# Idea backlog

Pieces you are positioned to write. Each is anchored in something already public
on the résumé or in a published essay, so writing it expands public facts rather
than leaking private ones. Move an idea to `drafts/` with `scripts/new-linkedin.sh`. The first published piece is
`AI Agents Need a Runtime That Can Say No` (Oct 2026); several entries below extend it.

## agents

- **Trust-first reasoning, as a pattern.** How structured templates with dynamic
  component selection took Copilot reasoning satisfaction from 3.0 to 4.2 in
  ninety days, and why predictable failures beat clever ones.
- **A six-thousand-query regression suite as a release gate.** What to sample,
  how to keep it from rotting, when to let it block a ship.
- **Human-in-the-loop first.** The rollout shape that got agents adopted in
  datacenter operations: +10% accuracy, 40% fewer escalations, 5x operator throughput.
- **Where multi-agent systems actually fail: the handoff.** Context loss, duplicated
  side effects, and termination that nobody owns.
- **Idempotency keys for mutating tools.** The smallest change that stops an agent
  from paying twice. Natural follow-up to the runtime article.

## inference

- **KV cache is an economics problem, not a memory problem.**
- **Why porting vLLM or SGLang to new silicon is harder than it looks**, and where
  a 3x over a GPU baseline comes from in a prototype.
- **Two SLOs, not one.** The batch-inference essay, cut for a LinkedIn audience.
- **Cost per token as the planning unit** for an inference platform.

## science

- **Validating an LLM judge against humans.** What a 0.89 Spearman tells you and
  what it hides.
- **Scaling-law fits have a validity window.** When the curve flattens, suspect data
  or optimization before parameters.
- **Bias and variance for people shipping models**, not studying them.

## product

- **Migrating a production copilot to a new model generation under a deadline.**
  The prompt router, the multi-turn regressions, the trace investigation; +5%
  accuracy and 15% lower latency.
- **Guardrails that let many teams ship independently.** The platform decisions
  that scale an organization, not just a model.
- **From weeks to under a day.** What actually changes when distributed training
  infrastructure gets fixed, and the 50% cost story behind it.
- **What a Principal Applied Scientist actually does all week.**

## trends

Format: what the release changes for someone running agents in production, the
mechanism behind it, and one dated position. Candidates appear weekly; keep the
bar at "I can name the mechanism".

## the personal thread

- **What a 5G embedded stack taught me about agent systems.** Real-time
  constraints, power budgets, failure discipline.
- **From Qualcomm to Copilot.** The career map for engineers entering AI systems
  from embedded, backend, or classical ML.
