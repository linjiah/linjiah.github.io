# What people are discussing about AI agents, surveyed 2026-10-11

Sources: Hacker News front page via the Algolia API (stories over 80 points, last 30 days), arXiv
(500 papers with "agent" in the title, cs.AI/CL/MA/LG, 1–8 Oct 2026), Google News (100 headlines,
last 14 days), GitHub search API (agent repos created since August by stars, and most-starred agent
repos pushed this week), Hugging Face trending papers, Simon Willison's agents tag. LinkedIn's own
feed is behind login; Reddit and Latent Space blocked automated access. Treat LinkedIn as roughly
"the news cycle plus the vendor announcements", which the sources above cover.

## Heat ranking

| # | Topic | Evidence |
|---|-------|----------|
| 1 | Rogue agents and agent-caused security incidents | Four of the top ten HN stories of the month (975, 755, 306, 267 pts; attacks on RubyGems, Hugging Face, Wikimedia, urlquery). Reuters, NYT, MIT Tech Review, WaPo, Forbes, Guardian all ran pieces in 14 days: liability, "act of war", OpenAI alerting 100+ organisations, Anthropic cutting internal evals off the live internet. Counter-take "There are no rogue AI agents" also 396 pts. |
| 2 | Runtime containment for agents (the vendor response) | NVIDIA OpenShell open agent safety platform and the "watchdog chip" framing; Microsoft Execution Containers; Apple tightening full-disk access; Docker Agent (304 pts); sandboxes (gVisor, Pi pod). 9% of arXiv titles are safety/guardrails: guard models, option-channel attacks on typed guardrails, lessons from the OpenAI/Anthropic/Google incidents. |
| 3 | Always-on personal agents | OpenAI Dots (769 pts, 647 comments), Meta Muse ignoring permissions, WIRED/WSJ coverage; self-hosted alternatives trending (Talorys 319 pts; nanoMuse and openmuse on HF/GitHub). Failure stories about them leaking data into the wrong chat. |
| 4 | Harness engineering and agent configuration standards | "HarnessTax" and an empirical harness-design study on HN; AGENTS.md convergence (741 pts); harness repos dominate GitHub (ECC 277k★, DeepSeek Harness 247k★, ZCode, SoL-Pi); 11% of arXiv titles on skills/harness/scaffolding, including conflicts between co-installed skills. |
| 5 | Memory versus documentation | "Agents don't need memory, they need documentation" (391 pts, 311 comments); 17% of arXiv titles on memory and long-horizon context; memory runtimes on GitHub (claude-mem 99k★, agent-memory with Markdown as source of truth, Mem0 on HF). |
| 6 | Evaluation and verification of agents | The single largest arXiv theme at 22%: verifier brittleness, real-time trajectory monitoring, epistemic humility, output-only review being insufficient. Industry echo: Anthropic isolating evals from the live internet. |
| 7 | Multi-agent orchestration | 17% of arXiv titles (failure attribution via error propagation, population thresholds, negotiation recovery); Google AX orchestrator (666 pts); Pion "run any company" (497 pts, 618 comments); team-chat-for-agents and A2A routing repos. HN never uses the phrase "multi-agent"; it says orchestrator, fleet, team, company. |
| 8 | Agents doing science | Opus 5.5 agents proposing semiconductor candidates (494 pts); a planet found with Claude Code (298 pts); auto-research loops (SoL-Pi), research-agent contracts on arXiv. |
| 9 | Inference economics for agents | Self-optimising inference engine for agents (Launch HN); adaptive "when should agents think" papers; model-routing for harnesses (magpie: Codex on DeepSeek, Claude Code on Kimi); prompt caching as a harness design constraint. |
| 10 | MCP backlash and protocol politics | "You said no MCP" (686 pts), "MCP was always a bad idea?" (335), Figma whitelisting MCP clients. Research interest is low (4% of titles): this is an industry argument, not a research one. |
| 11 | Agents as customers | NYT, WSJ, HBR, Politico: agents shopping, retailers blocking them, who owns the customer, banks' fee income at risk, OpenAI "Sponsored Agents". |
| 12 | Browser and computer-use agents | Fastest-growing new repos are browser infrastructure (jev-ultrafast 22.6k★, moli 16k★, phone-harness); CUA models; mobile GUI memory reuse papers. |

Also visible: a strong Chinese ecosystem (DeepSeek Harness, Z.ai's ZCode, Kimi, short-drama
skill packs, A2A routers) that English-language LinkedIn largely ignores.

## What is crowded, what is open

Crowded: incident recaps, "agents are flooding the workforce", MCP hot takes, framework tier
lists, and announcements of personal agents. Everyone posts these within the hour.

Open, and matching this site's experience:

1. **Containment as architecture, not product.** Nobody with production copilot scars is
   explaining what runtime controls actually have to enforce. HITL-first rollout, idempotency
   keys, typed guardrails and their failure modes. Ties to the tool-calling essay.
2. **Evaluation gates that survive agents.** The largest research theme and the least covered
   on LinkedIn by practitioners. The 6,000-query regression suite and the 0.89-Spearman
   evaluator story are exactly this.
3. **Harness engineering with numbers.** HarnessTax made it a topic; the production view
   (prompt caching, context budgets, skill conflicts) is unwritten.
4. **Memory versus documentation, from someone who shipped both.** Take a side with evidence.
5. **Multi-agent failure attribution.** Error propagation in agent teams is a hot paper topic
   and an unwritten practitioner topic. The handoff essay in ideas.md lands here.
6. **Inference economics for agents.** The intersection of agents and silicon is almost empty
   on LinkedIn and is this site's rarest credential.
7. **Agentic science, read critically.** What the semiconductor and planet results do and do
   not show about autonomous research. Mechanism, not cheering.

Each of these is a "trends" piece in the ideas backlog format: what changed, the mechanism,
one dated position.
