---
title: "Hexagonal Boundaries for ML Microservices"
date: 2025-05-20
draft: false
math: true
tags: ["architecture", "DDD", "APIs", "testing"]
categories: ["Software Architecture"]
summary: "Placeholder on ports-and-adapters for inference services: swap models without rewiring callers."
---

## Why ports matter

Inference services tend to accumulate **ad hoc integrations**: feature stores, blob storage, auth, caches. Without explicit boundaries, every new experiment becomes a fork.

Hexagonal architecture (ports and adapters) keeps **domain logic**—batching rules, safety checks, routing—at the center, while **I/O** lives at the edge.

## A simple interface

Suppose scoring requests arrive as a stream. Let \( \mathcal{X} \) denote the space of valid feature bundles. A port might be a pure function signature conceptually mapping

$$
f : \mathcal{X} \rightarrow \mathbb{R}^k
$$

while adapters handle serialization, retries, and vendor-specific SDKs.

## Adapter sketch in Python

```python
from typing import Protocol, Any

class ModelPort(Protocol):
    def score(self, features: dict[str, Any]) -> list[float]: ...

class TorchAdapter:
    def __init__(self, model_path: str) -> None:
        self.model_path = model_path

    def score(self, features: dict[str, Any]) -> list[float]:
        # placeholder: load once, run forward, return logits
        return [0.2, 0.5, 0.3]
```

Callers depend on `ModelPort`, not on `TorchAdapter`, so you can swap implementations for offline tests.

## Layer diagram placeholder

![Ports and adapters sketch placeholder](/images/sample-placeholder.png)

## Practical payoff

- **Contract tests** on the port stabilize CI when the model artifact changes weekly.
- **Adapters** absorb vendor churn so your HTTP handlers stay boring—and that is a compliment.
