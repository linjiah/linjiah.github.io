---
title: "Hexagonal Boundaries for ML Microservices"
date: 2026-05-28
draft: false
math: true
tags: ["architecture", "DDD", "APIs", "testing", "MLOps"]
summary: "Inference services accumulate ad hoc integrations until every experiment becomes a fork. Ports and adapters keep batching, safety, and routing at the center and vendor churn at the edge."
---

Inference services start clean and accumulate integrations: a feature store, blob storage for artifacts, an auth provider, a cache, a metrics sink, a feature-flag service. Six months later the HTTP handler imports a vendor SDK, the batching logic knows about S3 key layouts, and adding a second model means copying the service.

Hexagonal architecture — ports and adapters — is the standard answer, and it applies unusually well to ML serving because ML systems have an unusually high **rate of change at the edges** and an unusually **stable core**. Model artifacts change weekly. Batching rules and safety checks do not.

## What belongs at the center

The test I use: **would this logic still be correct if you swapped every external dependency?** If yes, it is domain logic and belongs at the center.

For an inference service, the center is smaller than people expect:

- **Request validation** — is this a well-formed scoring request?
- **Batching and coalescing rules** — how do requests group, and what is the wait budget?
- **Routing** — which model version serves this request? Shadow traffic? Canary split?
- **Safety and policy checks** — input filters, output thresholds, refusal rules.
- **Result assembly** — turning raw scores into the contract callers depend on.

Everything else — how features are fetched, where weights live, which serialization format the caller uses, which framework runs the forward pass — is an adapter concern.

<figure class="diagram">
<svg viewBox="0 0 660 340" role="img" aria-labelledby="hex-title" xmlns="http://www.w3.org/2000/svg">
  <title id="hex-title">Ports and adapters: driving adapters on the left, domain core in the center, driven adapters on the right</title>
  <g stroke="currentColor" fill="none" stroke-width="1.5">
    <polygon points="250,60 410,60 470,170 410,280 250,280 190,170"/>
    <rect x="20" y="70"  width="120" height="46" rx="6" stroke-dasharray="4 3"/>
    <rect x="20" y="145" width="120" height="46" rx="6" stroke-dasharray="4 3"/>
    <rect x="20" y="220" width="120" height="46" rx="6" stroke-dasharray="4 3"/>
    <rect x="520" y="70"  width="120" height="46" rx="6" stroke-dasharray="4 3"/>
    <rect x="520" y="145" width="120" height="46" rx="6" stroke-dasharray="4 3"/>
    <rect x="520" y="220" width="120" height="46" rx="6" stroke-dasharray="4 3"/>
    <path d="M140 93  H196" marker-end="url(#hx)"/>
    <path d="M140 168 H188" marker-end="url(#hx)"/>
    <path d="M140 243 H196" marker-end="url(#hx)"/>
    <path d="M464 93  H520" marker-end="url(#hx)"/>
    <path d="M470 168 H520" marker-end="url(#hx)"/>
    <path d="M464 243 H520" marker-end="url(#hx)"/>
  </g>
  <defs>
    <marker id="hx" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="currentColor"/>
    </marker>
  </defs>
  <g fill="currentColor" font-family="inherit" font-size="12" text-anchor="middle">
    <text x="80" y="98">HTTP / gRPC</text>
    <text x="80" y="173">Kafka consumer</text>
    <text x="80" y="248">Batch CLI</text>
    <text x="580" y="98">Feature store</text>
    <text x="580" y="173">Model runtime</text>
    <text x="580" y="248">Metrics sink</text>
    <text x="330" y="152" font-size="14" font-weight="600">domain core</text>
    <text x="330" y="176" font-size="11.5" opacity="0.8">batching · routing</text>
    <text x="330" y="194" font-size="11.5" opacity="0.8">safety · assembly</text>
    <text x="330" y="308" font-size="11.5" opacity="0.7">adapters depend inward; the core depends on nothing</text>
  </g>
</svg>
<figcaption>Driving adapters (left) call in; driven adapters (right) are called out through ports the core defines. The arrow direction is the whole point.</figcaption>
</figure>

## The dependency rule is the actual content

Drawing a hexagon is decoration. The rule that does the work is: **the core defines the interfaces, and adapters implement them.** Dependencies point inward, always.

This inverts the intuitive direction. Your core does not import a feature store client; it declares what it needs from *some* source of features, and an adapter satisfies that declaration. Conceptually the core wants a total function

$$
f : \mathcal{X} \rightarrow \mathbb{R}^k
$$

over the space \( \mathcal{X} \) of valid feature bundles, and it should not care that behind that signature sits a `torch.nn.Module`, an HTTP call to a vendor endpoint, or a lookup table you use in tests.

In Python, `Protocol` expresses this without inheritance, which matters — adapters should not need to import from your core to satisfy it:

```python
from typing import Protocol, Any, Sequence

class ModelPort(Protocol):
    """What the core needs from anything that can score. Defined by the core."""
    def score(self, features: Sequence[dict[str, Any]]) -> list[list[float]]: ...

    @property
    def version(self) -> str: ...


class FeaturePort(Protocol):
    def fetch(self, entity_ids: Sequence[str]) -> list[dict[str, Any]]: ...
```

Two deliberate choices. `score` takes a **sequence** and returns a list of results, because batching is a core concern and a single-item signature forces the core to loop — which throws away the entire performance argument for batching. And `version` is on the port because routing and result assembly need it; if it were adapter-private, every caller would have to reach around the abstraction to log which model answered.

## Adapters absorb churn

An adapter's job is to be boring and to contain all the ugliness: serialization, retries, connection pooling, vendor-specific error taxonomies, and the surprising quirks of whatever is on the other side.

```python
import torch

class TorchAdapter:
    """Loads once, scores many. Satisfies ModelPort structurally."""

    def __init__(self, model_path: str, device: str = "cuda") -> None:
        self._device = device
        self._model = torch.jit.load(model_path, map_location=device).eval()
        self._version = _read_version_sidecar(model_path)

    @property
    def version(self) -> str:
        return self._version

    def score(self, features: Sequence[dict[str, Any]]) -> list[list[float]]:
        batch = _to_tensor(features).to(self._device)
        with torch.inference_mode():
            logits = self._model(batch)
        return logits.float().cpu().tolist()
```

Note what the core never learns: that weights came from TorchScript, that there is a device, that `inference_mode` exists, that the tensor needed a host copy on the way out. Swap in an ONNX Runtime adapter or a remote vLLM endpoint and the core is untouched.

The corollary is that **adapters should not contain business rules**. The moment `TorchAdapter.score` starts deciding which model version to use, or applying a safety threshold, you have leaked the core into the edge and lost the ability to test that rule without a GPU.

## Contract tests are the payoff

Here is where this stops being architectural taste and starts saving time. Write one test suite against the *port*, and run it against every adapter:

```python
import pytest

@pytest.fixture(params=["stub", "torch", "onnx"])
def model_port(request) -> ModelPort:
    return {"stub": StubAdapter, "torch": lambda: TorchAdapter(TEST_ARTIFACT),
            "onnx": lambda: OnnxAdapter(TEST_ARTIFACT)}[request.param]()

def test_batch_size_is_preserved(model_port: ModelPort):
    out = model_port.score([VALID_FEATURES] * 5)
    assert len(out) == 5

def test_output_dimension_is_stable(model_port: ModelPort):
    assert len(model_port.score([VALID_FEATURES])[0]) == EXPECTED_K

def test_version_is_non_empty(model_port: ModelPort):
    assert model_port.version
```

These tests encode the promises the core relies on. When a new model artifact lands — weekly, in most teams I have worked on — this suite tells you within seconds whether it still satisfies the contract, and the failure message points at the contract rather than at a stack trace three layers deep in a serving framework.

The stub adapter matters more than it looks. Because it satisfies the same port, the entire core — batching, routing, safety, assembly — is testable **with no model, no GPU, and no network**. That is what turns a 20-minute integration test cycle into a 2-second unit test cycle, and it is usually the change that makes the team actually write tests.

## Where it can go wrong

Three failure modes are worth naming.

**Ports that mirror one vendor's API.** If `ModelPort` has a `predict_proba` method with a `sklearn`-shaped signature, you have not abstracted anything; you have renamed scikit-learn. Design the port from what the *core needs*, then check that at least two plausible adapters can satisfy it. If only one can, it is not a port.

**Too many layers.** Hexagonal architecture is one boundary, not five. Adding a service layer, a repository layer, a mapper layer, and a DTO layer around a service that scores one model is how this pattern earns its reputation for ceremony. One port per genuine external dependency; no more.

**Ports that leak batching semantics.** If the port cannot express "score these 32 together," the core cannot batch, and you will end up with a second, secret code path for the batch case. Design the batch signature first; the single-item case is `score([x])[0]`.

## Practical payoff

- **Contract tests on the port** keep CI stable when the model artifact changes weekly.
- **Adapters absorb vendor churn**, so HTTP handlers stay boring — and that is a compliment.
- **The core is testable without infrastructure**, which is what makes fast tests possible at all.
- **New experiments become a new adapter**, not a fork of the service.

The measure of success is unglamorous: when someone swaps the inference runtime, the diff touches one file and no tests change. Getting to that state is mostly a matter of pointing the arrows inward and refusing to let policy drift outward.
