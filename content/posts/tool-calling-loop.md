---
title: "A Minimal Tool-Calling Loop You Can Reason About"
date: 2026-03-14
draft: false
math: true
tags: ["agents", "tools", "LLM", "orchestration", "evaluation"]
summary: "Most agent loops fail on termination and context growth, not on model quality. A four-state loop with an explicit stop predicate and a per-step context budget is easier to debug, evaluate, and operate."
---

Most production agent incidents I have looked at were not reasoning failures. They were **control-flow failures**: a loop that would not stop, a retry that duplicated a write, a context window that filled with stale tool output until the model lost the thread of the original request.

Those are engineering problems, and they respond to engineering discipline. This note describes the smallest agent loop I have found worth defending: four states, one explicit termination predicate, and a hard budget on context growth.

## Why implicit loops rot

The tempting implementation is a `while` loop around a chat completion call: append the model's tool call, execute it, append the result, repeat until the model stops asking for tools. It works in the demo and degrades badly in production, for three reasons.

**Termination is delegated to the model.** "Loop until the model stops calling tools" means your stopping condition is a sampled token. A model that is confused, or that has been handed a tool result it cannot parse, will often keep calling tools — the same tool, with the same arguments — because nothing in the loop forbids it.

**Context grows monotonically.** Every observation is appended. A twelve-step run with verbose tool output ends with a context dominated by intermediate results that no longer matter, and the instruction that started the run buried thousands of tokens back.

**There is no seam to test.** When plan, execution, and stopping logic are one function, you cannot unit-test "does this run terminate?" without invoking a model.

## The four states

Treat each turn as a transition in an explicit state machine. The states are deliberately boring:

<figure class="diagram">
<svg viewBox="0 0 720 210" role="img" aria-labelledby="loop-title" xmlns="http://www.w3.org/2000/svg">
  <title id="loop-title">Agent loop state machine: Plan, Act, Observe, with a guard leading to Stop</title>
  <g fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="16"  y="60" width="120" height="52" rx="8"/>
    <rect x="196" y="60" width="120" height="52" rx="8"/>
    <rect x="376" y="60" width="120" height="52" rx="8"/>
    <rect x="576" y="60" width="120" height="52" rx="8" stroke-dasharray="4 3"/>
    <path d="M136 86 H196" marker-end="url(#ah)"/>
    <path d="M316 86 H376" marker-end="url(#ah)"/>
    <path d="M496 86 H576" marker-end="url(#ah)"/>
    <path d="M436 112 V160 H256 V112" marker-end="url(#ah)"/>
  </g>
  <defs>
    <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="currentColor"/>
    </marker>
  </defs>
  <g fill="currentColor" font-family="inherit" font-size="14" text-anchor="middle">
    <text x="76"  y="91">Plan</text>
    <text x="256" y="91">Act</text>
    <text x="436" y="91">Observe</text>
    <text x="636" y="91">Stop</text>
    <text x="346" y="178" font-size="12" opacity="0.75">continue if guard passes</text>
    <text x="536" y="52" font-size="12" opacity="0.75">stop predicate</text>
  </g>
</svg>
<figcaption>Four states. Every edge out of <code>Observe</code> is guarded, so termination is a property of the loop rather than of the model's next token.</figcaption>
</figure>

1. **Plan** — optional and short. Choose an intent, not a script. Long upfront plans go stale after the first surprising observation.
2. **Act** — emit exactly one structured tool call with validated arguments.
3. **Observe** — execute the call, normalize the result, and append a *summary* of it to context.
4. **Stop** — evaluated on every iteration, by code you own.

The important claim is not that four states are optimal. It is that the transitions are **inspectable**: you can log them, assert on them, and replay them.

## Termination is a predicate, not a vibe

Write the stop condition as a function. It should be readable without knowing anything about the model:

```python
from dataclasses import dataclass, field

@dataclass
class RunState:
    step: int = 0
    context_tokens: int = 0
    tool_calls: list[tuple[str, str]] = field(default_factory=list)  # (name, args_hash)
    goal_satisfied: bool = False
    elapsed_s: float = 0.0

MAX_STEPS = 12
MAX_CONTEXT_TOKENS = 24_000
MAX_WALL_CLOCK_S = 90.0

def should_stop(s: RunState) -> str | None:
    """Return a stop reason, or None to continue. Ordered most-specific first."""
    if s.goal_satisfied:
        return "goal_satisfied"
    if s.step >= MAX_STEPS:
        return "step_budget_exhausted"
    if s.context_tokens >= MAX_CONTEXT_TOKENS:
        return "context_budget_exhausted"
    if s.elapsed_s >= MAX_WALL_CLOCK_S:
        return "deadline_exceeded"
    if _repeated_call(s.tool_calls, window=3):
        return "no_progress"
    return None

def _repeated_call(calls: list[tuple[str, str]], window: int) -> bool:
    """Same tool, same arguments, `window` times in a row -> the loop is stuck."""
    return len(calls) >= window and len(set(calls[-window:])) == 1
```

Two details earn their keep. First, `should_stop` returns a **reason string**, not a boolean — that reason is the single most useful field in your traces, because it turns "the agent failed" into a distribution over named failure modes you can chart. Second, `_repeated_call` catches the stuck-loop case that step budgets only catch late and expensively.

## Budget context growth explicitly

Let \( s_t \) be the context after step \( t \). Unbounded appending gives \( |s_t| = |s_0| + \sum_{i=1}^{t} o_i \) for observation sizes \( o_i \), which is linear in steps with a constant you do not control — \( o_i \) is whatever the tool returned.

Instead impose a per-step budget \( B \):

$$
|s_{t+1}| \le |s_t| + B .
$$

Now growth is at most \( |s_0| + Bt \), and with \( B \) and `MAX_STEPS` both fixed you have a **static upper bound** on context size — which means a static upper bound on cost per run. That is a property you can put in a capacity plan.

Enforcing it means truncating or summarizing observations at the boundary, which is a policy decision worth making explicitly:

```python
from typing import Callable

def admit(observation: str, budget_tokens: int, count: Callable[[str], int]) -> str:
    if count(observation) <= budget_tokens:
        return observation
    # Head-and-tail beats naive truncation: schemas and error codes live at the
    # start, and the actual failure usually lives at the end.
    head = observation[: budget_tokens * 2]
    tail = observation[-budget_tokens:]
    return f"{head}\n...[{count(observation) - budget_tokens} tokens elided]...\n{tail}"
```

Head-and-tail retention is not sophisticated, but it preserves the two regions that matter for most tool output: the shape of the response and the error at the end. Semantic summarization is better when you can afford an extra model call; measure before assuming you can.

## Strict schemas are part of the safety boundary

A tool schema does three jobs at once: it tells the model what is callable, it rejects malformed calls before they reach your infrastructure, and it makes offline evaluation reproducible.

```json
{
  "name": "query_metrics",
  "description": "Return aggregated latency metrics for one service over a time window.",
  "parameters": {
    "type": "object",
    "properties": {
      "service": { "type": "string", "pattern": "^[a-z0-9-]{1,64}$" },
      "window_minutes": { "type": "integer", "minimum": 1, "maximum": 1440 },
      "percentile": { "type": "number", "enum": [0.5, 0.9, 0.95, 0.99] }
    },
    "required": ["service", "window_minutes"],
    "additionalProperties": false
  }
}
```

`additionalProperties: false` and a `pattern` on the free-text field do more for reliability than a paragraph of prompt instruction, because they fail *closed* and they fail *before* execution. Bound every numeric range — `window_minutes` without a maximum is an invitation to a query that scans a quarter of your metrics store.

When validation fails, feed the validation error back as an observation rather than retrying blindly. Models are generally good at repairing a call when told precisely which field was rejected and why.

## Mutating tools need idempotency keys

Retries are non-negotiable in a distributed system, and retries plus mutation equals duplicates. Any tool that writes should accept a caller-supplied idempotency key derived from the logical operation, not from the attempt:

```python
key = sha256(f"{run_id}:{step}:{tool_name}:{canonical_json(args)}".encode()).hexdigest()
```

Deriving the key from `(run_id, step, tool, args)` means a transport-level retry of the *same* logical call reuses the key and deduplicates, while a genuinely new call at a later step gets a fresh one. Note the `canonical_json` — key stability requires stable field ordering, and this is a classic source of "why did the dedupe miss?"

## What to log

Traces are the whole game when you are debugging a non-deterministic system. Per step, record:

| Field | Why it matters |
|---|---|
| `step`, `run_id` | Reconstruct ordering; join across services. |
| `tool_name`, `args_hash` | Detect loops without logging sensitive arguments verbatim. |
| `model_latency_ms` | Separate from tool latency, or you will tune the wrong thing. |
| `tool_latency_ms`, `retry_count` | Tool retries hide inside a single "slow step". |
| `observation_tokens_raw` / `_admitted` | Shows how much your budget is actually eliding. |
| `stop_reason` | The outcome distribution you will report on. |

Separating model latency from tool latency is the one I would fight for. An agent run that takes 40 seconds is a completely different problem depending on whether 35 of those seconds were spent in one slow metrics query or spread across twelve model calls, and an aggregate step-duration metric cannot tell you which.

Keep a human-readable rendering of the trace, not just structured events. During a postmortem you want to read the run like a transcript.

## Evaluating the loop, not just the model

Because termination and budgeting live in code, most of this is testable without a model in the loop:

- **Unit tests on `should_stop`** — construct `RunState` fixtures and assert the reason. Free, fast, and they catch the "agent never terminates" class outright.
- **Recorded-trace replay** — persist real tool outputs and replay them against a stubbed model that emits a fixed call sequence. Verifies budgeting and idempotency deterministically.
- **Stop-reason distribution as a health metric** — a rising share of `no_progress` or `step_budget_exhausted` is an early warning that a tool's output format drifted, usually well before task success rate moves enough to notice.

That last one has been the most valuable in practice. Task success is a lagging indicator and often expensive to grade; the stop-reason mix is free and moves first.

## Checklist

- Termination is a predicate in your code, returning a **named reason**.
- Every loop has a step budget, a context budget, and a wall-clock deadline.
- Context growth per step is bounded by an explicit \( B \).
- Every tool schema bounds its numeric ranges and sets `additionalProperties: false`.
- Validation failures are fed back as observations, not silently retried.
- Mutating tools take idempotency keys derived from canonicalized arguments.
- Model latency and tool latency are separate metrics.
- Stop-reason distribution is on a dashboard someone looks at.

None of this makes an agent smarter. It makes an agent *operable* — and in my experience the gap between a demo and a system that survives real traffic is mostly operability, not intelligence.
