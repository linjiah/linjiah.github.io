---
title: "A Minimal Tool-Calling Loop You Can Reason About"
date: 2025-04-18
draft: false
math: true
tags: ["agents", "tools", "LLM", "orchestration"]
categories: ["Agentic System"]
summary: "Placeholder design for a bounded agent loop with explicit state transitions and guardrails."
---

## Control flow

Many agent stacks collapse into spaghetti when tool calls are implicit. A cleaner pattern is to treat each turn as a **state machine** transition:

1. **Plan** (optional, short): choose intent.
2. **Act**: emit a structured tool call with JSON arguments.
3. **Observe**: append tool output to context.
4. **Stop** when a termination predicate holds.

Let \( s_t \) be the context summary at step \( t \). A simple stability constraint is to cap context growth so that \( |s_{t+1}| \le |s_t| + B \) for a fixed budget \( B \) per step—otherwise long-horizon runs become dominated by irrelevant history.

## Tool schema fragment

```json
{
  "name": "query_metrics",
  "description": "Return aggregated latency metrics for a service.",
  "parameters": {
    "type": "object",
    "properties": {
      "service": { "type": "string" },
      "window_minutes": { "type": "integer", "minimum": 1, "maximum": 1440 }
    },
    "required": ["service", "window_minutes"]
  }
}
```

Strict schemas are part of your safety boundary: they reduce malformed calls and make offline evaluation reproducible.

## Illustration placeholder

![Agent loop diagram placeholder](/images/sample-placeholder.png)

## Engineering checklist

- Log **tool latency** and **retry counts** separately from model latency.
- Put **idempotency keys** on mutating tools.
- Keep a **human-readable trace** for postmortems—future you will thank present you.
