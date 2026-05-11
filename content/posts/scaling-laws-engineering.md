---
title: "Scaling Laws: What Practitioners Actually Plot"
date: 2025-05-01
draft: false
math: true
tags: ["scaling", "training", "compute", "frontier models"]
categories: ["AI Frontiers"]
summary: "Placeholder notes on power-law fits between loss and compute, and how they inform capacity planning."
---

## The usual power-law story

Empirical studies often report that test loss \( L \) improves with compute \( C \) (or parameters \( N \)) following a relationship of the form

$$
\log L \approx -\alpha \log C + \text{const},
$$

i.e. \( L \propto C^{-\alpha} \) over a regime where many confounders are held fixed. The exponent \( \alpha \) is not universal—it depends on architecture, data mix, and optimization.

## A toy log–log sanity check

```python
import math

C = [1e18, 2e18, 4e18, 8e18]
L = [2.1, 1.9, 1.75, 1.62]  # hypothetical losses
alpha = -(math.log(L[-1]/L[0]) / math.log(C[-1]/C[0]))
print(f"rough local exponent ~ {alpha:.3f}")
```

Use this only as intuition: real curves have **kinks** when you change batching, data, or regularization.

## Placeholder figure

![Log-log loss vs compute placeholder](/images/sample-placeholder.png)

## Engineering translation

- Track **tokens seen** and **FLOPs estimates** with the same rigor as wall-clock.
- When curves flatten, the bottleneck is often **data or optimization**, not parameter count alone.
