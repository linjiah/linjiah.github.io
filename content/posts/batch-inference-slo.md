---
title: "Batch Inference SLOs That Survive Traffic Spikes"
date: 2026-04-22
draft: false
math: true
tags: ["inference", "Ray", "Kubernetes", "SLO", "capacity planning"]
summary: "Large batch scoring pipelines fail on queue depth, cold starts, and I/O contention long before model quality matters. A framework for SLOs that stay meaningful when volume doubles overnight."
---

Large batch scoring pipelines rarely fail on model quality first. They fail on **queue depth**, **cold starts**, and **I/O contention** — and they fail in a particular way that surprises teams: everything looks fine on the dashboards right up until it does not, because the metric people watch (average latency, or worse, CPU utilization) is the last one to move.

This note is about defining batch inference SLOs that keep their meaning when volume doubles, and about the queueing intuition that tells you where the cliff is before you drive off it.

## Two SLOs, not one

The most common mistake is a single latency SLO applied to a batch system. Batch workloads have two independent service objectives, and conflating them produces a target that is either trivially met or impossible.

**Throughput SLO** — sustained records scored per hour at steady state. This is a *capacity* statement. It answers "can we finish the nightly job before the business day starts?"

**Deadline SLO** — P99 end-to-end completion time for a submitted job. This is a *tail* statement. It answers "when a team submits a scoring job at 2pm, when can they rely on results?"

These pull in opposite directions. Maximizing throughput means large batches, high utilization, and deep queues — all of which inflate the completion-time tail. Maximizing deadline adherence means headroom you are "wasting" at steady state. Pick a number for each, write both down, and make the trade-off explicit rather than discovering it during an incident.

A third objective is worth stating even though it is not strictly an SLO: **cost per million records scored**. Without it, every capacity conversation resolves to "add replicas."

## Where the cliff is

Model a worker pool as \( c \) parallel workers, each serving at rate \( \mu \) records per second, with arrivals at \( \lambda \). Define **offered load** \( a = \lambda/\mu \) and **utilization** \( \rho = a/c \). Stability requires \( \rho < 1 \).

For an idealized M/M/c queue, the probability that an arriving job waits at all is Erlang C:

$$
P_{\text{wait}} = \frac{\dfrac{a^c}{c!}\dfrac{c}{c-a}}
{\displaystyle\sum_{n=0}^{c-1}\frac{a^n}{n!} + \dfrac{a^c}{c!}\dfrac{c}{c-a}}
$$

and the expected waiting time in queue follows as

$$
\mathbb{E}[W_q] = \frac{P_{\text{wait}}}{c\mu - \lambda}.
$$

Your pipeline is not an M/M/c queue. Service times are not exponential, arrivals are bursty rather than Poisson, and workers are not independent when they share a network filesystem. So do not use these to predict latency.

Use them for one thing: **understanding the shape of the curve**. Note the \( c\mu - \lambda \) in the denominator. As \( \rho \to 1 \), waiting time grows without bound — hyperbolically, not linearly. Concretely, going from 80% to 90% utilization roughly *doubles* expected queue wait; 90% to 95% doubles it again.

<figure class="diagram">
<svg viewBox="0 0 640 300" role="img" aria-labelledby="util-title" xmlns="http://www.w3.org/2000/svg">
  <title id="util-title">Queue wait time versus utilization, showing hyperbolic growth near full utilization</title>
  <g stroke="currentColor" fill="none" stroke-width="1.5">
    <path d="M60 250 H600"/>
    <path d="M60 250 V30"/>
  </g>
  <path d="M60 246 C260 240, 400 225, 480 195 C530 172, 555 130, 566 40"
        fill="none" stroke="currentColor" stroke-width="2.5"/>
  <g stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6">
    <path d="M480 250 V195"/>
    <path d="M528 250 V168"/>
  </g>
  <g fill="currentColor" font-family="inherit" font-size="12">
    <text x="466" y="268">0.8</text>
    <text x="514" y="268">0.9</text>
    <text x="556" y="268">1.0</text>
    <text x="300" y="288" font-size="13" text-anchor="middle">utilization ρ</text>
    <text x="30" y="140" font-size="13" text-anchor="middle" transform="rotate(-90 30 140)">queue wait</text>
    <text x="300" y="215" font-size="12" opacity="0.75">flat and reassuring…</text>
    <text x="440" y="70" font-size="12" opacity="0.75">…then not</text>
  </g>
</svg>
<figcaption>The reason "we run at 95% utilization and it's fine" is a statement about luck, not capacity. Mean latency barely moves across most of this curve while the tail is already degrading.</figcaption>
</figure>

This is the sanity check to reach for when someone proposes running at 95% utilization indefinitely to save cost. They are not wrong that it is cheaper. They are wrong that it is stable: at \( \rho = 0.95 \) a 10% traffic increase does not cost you 10% more latency, it costs you a multiple.

## Cold starts deserve their own budget

Steady-state analysis assumes workers exist. For GPU inference workers, becoming ready means pulling a container image, allocating a device, loading weights into device memory, and often compiling or warming kernels on the first request. Tens of seconds is normal; minutes is common for large models.

This matters because **cold start cost is paid exactly when you can least afford it** — during a scale-up triggered by a burst. If a burst lasts 3 minutes and your workers take 2 minutes to become ready, autoscaling contributes almost nothing to that burst. You absorbed it with whatever headroom you already had, or you did not absorb it.

Consequences worth designing for:

- **Measure `time_to_first_successful_request`** separately from steady-state latency, and alert on its P95. It regresses silently when someone adds a dependency to the image or bumps model size.
- **Size `min_replicas` from burst shape, not from average load.** The floor exists to absorb the bursts that are shorter than your cold start.
- **Pre-warm on a schedule** when load is predictable. A nightly job at 01:00 should find workers already up at 00:55; this is a cron problem, not an autoscaling problem.
- **Cache weights on the node**, not in the image, so a restarted pod skips the download.

## Autoscaling on the right signal

The default autoscaling signal on most platforms is CPU utilization, which for GPU inference is close to meaningless — a saturated GPU with a busy-waiting host process can read as either 100% or 15% CPU depending on your serving framework.

Scale on a signal that tracks the SLO you actually care about. In rough order of preference: **queue depth per replica** or **ongoing requests per replica** (both directly reflect saturation), then **P95 end-to-end latency** (correct but laggy — it moves after users are already affected), and only then resource utilization.

```yaml
# Illustrative Ray Serve deployment config.
# target_ongoing_requests is the load knob; max_batch_size is the efficiency knob.
scaling_config:
  min_replicas: 4              # sized to absorb bursts shorter than cold start
  max_replicas: 32
  target_ongoing_requests: 8   # ~= per-replica queue depth target
  upscale_delay_s: 10          # react fast to load
  downscale_delay_s: 300       # retreat slowly; churn costs a cold start
batch_config:
  max_batch_size: 32
  batch_wait_timeout_s: 0.05   # bounds the latency added by batch assembly
runtime_env:
  env_vars:
    OMP_NUM_THREADS: "1"       # avoid CPU oversubscription across replicas
```

Three of these settings are load-bearing:

**Asymmetric delays.** Scale up in seconds, down over minutes. Symmetric delays produce thrashing, and every unnecessary scale-down buys you a cold start on the next uptick.

**`batch_wait_timeout_s` is a latency budget.** Batching improves throughput by waiting for work to accumulate — the wait is pure added latency for the first request in each batch. Setting this to 50ms means you have spent 50ms of your deadline budget buying throughput. That can be an excellent trade; it just needs to be a deliberate one.

**`OMP_NUM_THREADS: "1"`.** Frameworks default to one thread per core; running eight replicas per node each spawning per-core thread pools produces catastrophic oversubscription. This single line has fixed more mysterious throughput plateaus than any tuning I have done.

## Batch size interacts with everything

Larger batches raise GPU efficiency and raise queue wait, and the relationship is not monotone in the metric you care about. Throughput gains from batching saturate — once the GPU is compute-bound, doubling batch size roughly doubles per-batch latency for little additional throughput — while assembly wait keeps growing.

The practical procedure: sweep batch size at fixed arrival rate, and plot throughput *and* P99 completion time on the same axis. There is usually a knee where throughput has captured most of its available gain and the tail has not yet degraded badly. Run there, not at the throughput maximum.

Also pair `max_replicas` with per-replica batch size deliberately. Both are ways to spend the same capacity, and maximizing them independently produces a configuration that thrashes the scheduler while chasing throughput it cannot sustain.

## The failure mode nobody instruments

I/O contention is the one that gets missed. Batch scoring reads features and writes predictions, often to the same object store or filesystem, from every worker simultaneously. Scale replicas 4× and you scale I/O concurrency 4× against shared infrastructure with its own limits.

Symptoms: per-record service time \( 1/\mu \) degrades as \( c \) increases, so adding workers reduces total throughput. Every queueing model above assumes \( \mu \) is independent of \( c \), and here that assumption breaks.

Instrument per-worker I/O wait as a fraction of step time. If it rises with replica count, you are contending, and the fix is on the storage side — read coalescing, larger sequential reads, a caching layer — not the compute side.

## Putting it together

A batch inference SLO document that has survived contact with production tends to contain:

1. **Throughput SLO** at a stated steady-state utilization target — I default to \( \rho \le 0.75 \) and argue upward only with burst data.
2. **Deadline SLO** as P99 end-to-end job completion, measured from submission, not from first execution.
3. **Cold start budget** with its own P95 alert.
4. **Cost per million records**, so capacity discussions have two sides.
5. **A named burst profile** — the specific spike shape you promise to absorb ("2× for 5 minutes"), because "handles spikes" is not a commitment anyone can verify.

## Takeaways

- Separate **throughput SLOs** from **deadline SLOs**; they trade against each other.
- Tail latency grows hyperbolically near saturation. Target utilization around 0.75, not 0.95.
- Measure **cold start** separately — it is paid precisely during the bursts autoscaling was supposed to handle.
- Autoscale on **queue depth**, not CPU. Scale up fast, down slow.
- `batch_wait_timeout_s` spends your latency budget to buy throughput. Know the price.
- Watch per-worker **I/O wait** versus replica count; contention breaks every model above.
