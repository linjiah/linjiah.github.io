---
title: "Scaling Laws: What Practitioners Actually Plot"
date: 2026-07-30
draft: false
math: true
tags: ["scaling", "training", "compute", "frontier models", "capacity planning"]
summary: "Power-law fits are a planning tool with a narrow validity window. What to measure, how to fit an exponent honestly, and why the curve flattening usually means data or optimization rather than parameters."
---

Scaling laws are the closest thing large-model training has to a capacity planning formula, and they get misused in both directions — treated as physical constants by people who want a number, and dismissed as numerology by people who have watched a fit break.

The useful position is in between: a power-law fit is a **local extrapolation tool with a narrow validity window**, and it is genuinely load-bearing for planning as long as you respect the window.

## The usual power-law story

Empirical studies report that test loss \( L \) improves with compute \( C \), parameters \( N \), or dataset size \( D \) following an approximate power law over a wide range:

$$
L(C) \approx L_\infty + \left(\frac{C_0}{C}\right)^{\alpha}
$$

which on a log–log plot of the *reducible* loss \( L - L_\infty \) is a straight line with slope \( -\alpha \):

$$
\log(L - L_\infty) \approx -\alpha \log C + \text{const}.
$$

The \( L_\infty \) term is the part most informal treatments drop, and dropping it is the single most common source of bad fits. It is an irreducible floor — entropy of the data distribution plus whatever your setup cannot capture. Fit \( \log L \) against \( \log C \) directly and you will get a curve that bends on the log–log axes, conclude "scaling is breaking down," and be wrong: you were fitting the wrong functional form.

The exponent \( \alpha \) is **not universal**. It depends on architecture, data mix and quality, tokenizer, optimizer and its hyperparameters, and the precision you train in. An \( \alpha \) measured on your stack transfers to your stack. Borrowing a published exponent for your capacity plan is a category error.

## Fitting an exponent honestly

Two-point estimates of a local slope are how most people start, and they are fine for intuition provided you know what they hide:

```python
import math

# Hypothetical loss at increasing training compute (FLOPs), same recipe throughout.
C = [1e18, 2e18, 4e18, 8e18]
L = [2.10, 1.90, 1.75, 1.62]

L_inf = 1.20  # ESTIMATED floor -- the fit is highly sensitive to this

for (c0, l0), (c1, l1) in zip(zip(C, L), zip(C[1:], L[1:])):
    alpha = -math.log((l1 - L_inf) / (l0 - L_inf)) / math.log(c1 / c0)
    print(f"C {c0:.1e} -> {c1:.1e}:  local alpha ~ {alpha:.3f}")
```

Running this prints local exponents that are not equal — which is the honest and informative outcome. A single global \( \alpha \) is a summary of a curve that has structure, and the *drift* in local exponent across the range tells you more about where you are than the average does.

Note how much the answer depends on `L_inf`. Assuming a floor that is too low flatters your scaling; too high and you will conclude scaling has stalled. If you have enough points, fit \( L_\infty \) and \( \alpha \) jointly with a nonlinear least-squares routine, weight the residuals in log space, and report a confidence interval. If you have four points, do not report three significant figures.

<figure class="diagram">
<svg viewBox="0 0 640 320" role="img" aria-labelledby="sl-title" xmlns="http://www.w3.org/2000/svg">
  <title id="sl-title">Log-log plot of loss versus compute, straight in the power-law regime and kinked after a recipe change</title>
  <g stroke="currentColor" fill="none" stroke-width="1.5">
    <path d="M64 272 H600"/>
    <path d="M64 272 V26"/>
  </g>
  <!-- clean power law segment -->
  <path d="M84 58 L330 168" fill="none" stroke="currentColor" stroke-width="2.5"/>
  <!-- kink: shallower slope after recipe change -->
  <path d="M330 168 L580 218" fill="none" stroke="currentColor" stroke-width="2.5"/>
  <!-- extrapolation you would have believed -->
  <path d="M330 168 L580 280" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.65"/>
  <g stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.5">
    <path d="M330 168 V272"/>
  </g>
  <g fill="currentColor" font-family="inherit" font-size="12">
    <text x="300" y="302" font-size="13" text-anchor="middle">log compute</text>
    <text x="26" y="150" font-size="13" text-anchor="middle" transform="rotate(-90 26 150)">log (L − L∞)</text>
    <text x="150" y="130" font-size="11.5" opacity="0.85">slope = −α</text>
    <text x="334" y="288" font-size="11.5" text-anchor="middle" opacity="0.8">recipe change</text>
    <text x="470" y="196" font-size="11.5" opacity="0.85">observed</text>
    <text x="474" y="272" font-size="11.5" opacity="0.7">extrapolated</text>
  </g>
</svg>
<figcaption>Real curves kink whenever the recipe changes. The gap between the dashed extrapolation and the observed line is the budget error you commit to when you plan off a fit taken before the change.</figcaption>
</figure>

## Compute-optimal allocation is the actual planning question

"How much compute do we need?" is less useful than "given this compute, how should we split it?" With \( C \approx 6ND \) FLOPs for a dense transformer training run over \( N \) parameters and \( D \) tokens, the planning question becomes how to allocate a fixed \( C \) between model size and data.

The empirical finding that reset the field's defaults is that the optimum scales both roughly proportionally — \( N_{\text{opt}} \propto C^{a} \) and \( D_{\text{opt}} \propto C^{b} \) with \( a \) and \( b \) each near \( 0.5 \) — meaning a compute increase should be split between a bigger model and more tokens, not spent entirely on parameters. Many models trained before that result were substantially undertrained for their size.

Two engineering caveats change the answer in practice:

**Inference cost is not in the objective.** Compute-optimal minimizes *training* loss for *training* FLOPs. If a model will serve billions of requests, total cost of ownership favors a smaller model trained on more tokens well past the training-optimal point — you pay more to train once and less to serve forever. Decide which objective you are optimizing before quoting an allocation.

**The \( 6ND \) approximation drifts.** It omits attention's quadratic term, which is negligible at short context and is not at long context. It also assumes dense activation; for mixture-of-experts you need active-parameter accounting, and using total parameters will badly misestimate both cost and the scaling behavior.

## Instrument tokens and FLOPs like you instrument wall-clock

The recurring practical failure is that teams measure wall-clock and dollars precisely and \( D \) and \( C \) sloppily, then cannot reconcile runs. Minimum instrumentation for every training run:

| Quantity | Why it is easy to get wrong |
|---|---|
| **Tokens seen** (not examples, not steps) | Packing, padding, and truncation all break the step→token conversion. |
| **Unique tokens** vs. total | Repeated epochs give diminishing returns; \( D \) in a scaling law means *unique* data. |
| **FLOPs estimate** with its formula recorded | Two teams using different approximations produce incomparable numbers. |
| **Achieved MFU** | Separates "needs more compute" from "wastes the compute it has." |
| **Data mix proportions** | A mix change invalidates the fit; without this logged you cannot detect that. |
| **Loss on a frozen eval set** | Loss on a changing validation set is not comparable across runs, which is the whole purpose. |

That last one causes more wasted quarters than anything else here. If the eval set changes when the data mix changes, your loss curve mixes two effects and the fit means nothing. Freeze an eval set, version it, and never touch it.

**Achieved MFU** deserves emphasis because it separates two very different problems that look identical on a loss-versus-wall-clock plot. A run at 25% MFU does not need more GPUs; it needs a profiler. Doubling the cluster to work around a pipeline stall is an expensive way to avoid reading a trace.

## When the curve flattens

A loss curve bending away from its power law is a diagnostic, not a verdict. In rough order of likelihood:

**You are repeating data.** Multiple epochs over the same tokens yields far less than fresh tokens, and past a handful of repetitions can actively hurt. Check unique-token count before anything else. This is the most common cause and the cheapest to check.

**Optimization is the bottleneck.** Learning rate schedule, warmup, batch size past the critical batch size, or numerical instability in low precision. A run that is diverging slowly, or has a learning rate that decayed too early, produces a flattening that has nothing to do with scale. Ablate the schedule before buying hardware.

**Data quality has saturated.** Adding more of the same low-information data moves \( D \) without moving effective information. Deduplication and filtering routinely beat volume here.

**You have hit \( L_\infty \).** Sometimes the floor is simply where you are, and the remaining loss is the entropy of the distribution. Recognizing this is valuable; it is the signal to change the problem — better data, different objective, longer context — rather than to scale the current one.

Note that "add parameters" is not on that list. It is the most expensive hypothesis and usually not the binding constraint.

## Engineering translation

- Fit \( L_\infty \) as a parameter. Do not fit \( \log L \) against \( \log C \) and expect a line.
- Report **local** exponents across your range, not one global \( \alpha \), and never borrow a published one.
- Track **tokens seen**, **unique tokens**, **FLOPs with its formula**, and **MFU** with the same rigor as wall-clock and spend.
- Freeze and version the eval set, or the loss curve is not comparable across runs.
- Decide whether you are optimizing training cost or total cost of ownership *before* choosing an allocation.
- When curves flatten, check data repetition, then optimization, then data quality — parameters last.

Scaling laws are worth the effort to measure on your own stack. They just are not laws; they are locally valid empirical fits, and every kink in the curve is a place where someone changed the recipe and did not write it down.
