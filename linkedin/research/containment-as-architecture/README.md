# Containment as architecture: research pack

Working material for the LinkedIn piece (and the site essay) arguing that runtime
controls on agents are an architecture problem, not a product you buy or a prompt
you write. Assembled 2026-10-11. Everything here is a summary in my own words with
links back to sources; nothing is quoted at length.

## Files

| File | What it holds |
|------|---------------|
| `01-incident-timeline.md` | Dated list of agent containment failures, Oct 2025 → Oct 2026, with sources. |
| `02-discussions.md` | The nine most-discussed Hacker News threads and the positions in them. |
| `03-vendor-controls.md` | What OpenShell, Execution Containers, Docker Sandboxes, Claude Code auto mode, Lockdown Mode and the labs' own changes actually enforce. Comparison table. |
| `04-standards-and-reports.md` | OWASP Agent Control Standard and Top 10, the AISI incident report, the METR review, OpenAI's misalignment reports, the OWASP Q3 exploit roundup. |
| `05-papers.md` | Curated reading list with one-line notes, then a catalog of 2026 papers on the topic. |
| `06-tooling.md` | Open-source sandboxes, gateways, guardrails, credential proxies, scanners. |
| `07-argument-map-and-outline.md` | The synthesis: the claim, the five control planes, contested points, numbers to cite, dated positions, and a draft outline for the article. **Start here when drafting.** |
| `08-news-index.md` | Generated index of recent headlines with links. |
| `data/` | Raw JSON pulled from the arXiv, Hacker News and GitHub APIs and Google News, for provenance. |

## How the material was gathered

- arXiv API: eight queries over abstracts (guardrails and runtime enforcement, sandboxing
  and permissions, prompt injection in agents, tool misuse, human oversight, security
  incidents, identity, guard models), 402 unique papers, 394 of them from 2026; plus 17
  seminal 2023–2025 papers fetched by title.
- Hacker News via the Algolia API: 57 stories over 40 points in the last four months;
  the top nine threads read for arguments.
- Google News RSS: 897 headlines across 14 queries, last 60 days.
- GitHub search API: repositories over 300 stars matching sandbox, guardrail, permission,
  agent security and MCP security.
- Primary sources read directly: the AISI incident report, the METR/Redwood review of the
  Hugging Face incident, OpenAI's misalignment-report index, Anthropic's auto-mode post,
  the Microsoft Execution Containers announcement, the NVIDIA OpenShell and OWASP Agent
  Control Standard repositories, the OWASP Q3 2026 exploit roundup, the Scale X approval
  study, the AppleInsider and TechCrunch reporting on Muse, Apple and Anthropic, Eoin
  Higgins's essay, and Simon Willison's prompt-injection and lethal-trifecta tags.

## Gaps

- LinkedIn itself is behind login; its discussion is inferred from what it reacts to.
- The two incident write-ups at rubyhack.ai and swarmtraces.org could not be fetched; the
  METR review, OpenAI's notices and the OWASP roundup cover the same ground.
- Reuters (OpenAI notifying 100+ organisations) and the OpenAI Lockdown Mode page refused
  automated access; both are covered via secondary reporting.
- The FelonyBench site rate-limited; its HN thread was read instead.
- The OWASP Top 10 for Agentic Applications is only available as a PDF; categories are not
  enumerated here beyond ASI06 (memory and context poisoning).

## Before publishing anything from this pack

- Re-check the RubyGems story: OpenAI's own notice says its review so far found benign
  use and that claims of malicious uploads are unverified. Do not state it as an attack.
- The OWASP roundup's categorisations are the analysts' interpretations, not official
  OWASP positions; cite it as such.
- Numbers from vendor posts (Anthropic auto mode, NVIDIA) are vendor claims; say so.
