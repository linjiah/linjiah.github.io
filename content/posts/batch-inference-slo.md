---
title: "Batch Inference SLOs That Survive Traffic Spikes"
date: 2025-02-10
draft: false
math: true
tags: ["inference", "Ray", "Kubernetes", "SLO"]
categories: ["ML Infra and System"]
summary: "Placeholder walkthrough of queueing, autoscaling knobs, and latency budgets for offline scoring jobs."
---

## Motivation

Large batch scoring pipelines rarely fail on model quality first—they fail on **queue depth**, **cold starts**, and **I/O contention**. This note sketches a minimal framework for defining SLOs that stay meaningful when traffic doubles overnight.

## Queueing sketch

Assume \( \lambda \) requests per second arrive into a worker pool with \( c \) parallel workers, each serving at rate \( \mu \). A conservative stability condition is \( \lambda < c\mu \). When you approach saturation, tail latency grows quickly—often before mean latency moves much.

For a stylized M/M/c queue, the probability that an arriving job waits (Erlang C) is often written in terms of offered load \( a = \lambda/\mu \):

$$
P_{\text{wait}} \approx \frac{a^c}{c!}\frac{c}{c-a} \Big/ \Big(\sum_{n=0}^{c-1}\frac{a^n}{n!} + \frac{a^c}{c!}\frac{c}{c-a}\Big).
$$

In practice you will not measure an ideal queue—but the formula is a useful sanity check when someone proposes “we can run at 95% utilization forever.”

## A tiny Ray-style config fragment

```yaml
# illustrative: tune max_concurrency vs batch size for GPU workers
scaling_config:
  min_replicas: 2
  max_replicas: 32
  target_ongoing_requests: 8
runtime_env:
  env_vars:
    OMP_NUM_THREADS: "1"
```

Pair **max replicas** with **per-replica batch size** so you do not thrash the scheduler while chasing throughput.

## Diagram placeholder

The following image is a stand-in for a queue-depth dashboard screenshot.

![Synthetic dashboard placeholder](/images/sample-placeholder.png)

## Takeaways

- Separate **throughput SLOs** (jobs/hour) from **deadline SLOs** (P99 job completion time).
- Measure **cold start** separately from steady-state; it dominates some burst patterns.
- Keep autoscaling signals aligned with **end-to-end** latency, not just CPU.
