# What the runtimes and vendors actually enforce

Summaries from the vendors' own documentation and announcements, with the gaps they
admit or that reviewers found. Vendor numbers are vendor claims.

## NVIDIA OpenShell (open source, Apache-2.0; 15.8k stars; NemoClaw companion 22.7k)
https://github.com/NVIDIA/OpenShell

- Model: a gateway (control plane), a supervisor and one isolated sandbox per agent, built
  on containers or host virtualisation. Operators declare what each agent may touch; the
  runtime enforces it.
- Filesystem and system calls: kernel-level restrictions on which files and syscalls the
  agent can use.
- Network: every outbound connection is checked against policy before it leaves the
  sandbox; on Kubernetes the CNI must enforce NetworkPolicy.
- Credentials: agents never see real secrets. A gateway injects credentials only into
  requests bound for approved providers, including inference providers.
- Policy change review: a "prover" uses formal verification to flag risky new grants (new
  hosts with credentials, new API methods) for human review; an "advisor" helps.
- Policies are declarative over filesystem, network and process rules; access can be
  granted incrementally as the agent requests it. SDKs in Python, TypeScript, Go, Rust.
- Not in the README: an audit log format (Microsoft's post says OpenShell integration
  brings OCSF auditing), an explicit threat model, a known-bypass list, hardware
  enforcement. Press coverage of a "watchdog chip" is not reflected in the repository.

## Microsoft Execution Containers, MXC (GA 2026-10-07; open source microsoft/mxc)
https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/

- Premise stated outright: an agent cannot be its own security authority; the boundary is
  set by the developer or organisation and enforced independently of the model, generated
  code, plugins and tools.
- Backends on a spectrum: process container (AppContainer on Windows, Seatbelt on macOS,
  Bubblewrap on Linux); session container (separate Windows account, desktop, clipboard);
  WSL container; microVM (experimental).
- Policy, in a JSON schema, covers five areas: containment type; process launch settings;
  filesystem as writable, read-only and denied paths; network inbound and outbound including
  host loopback; UI and desktop access. The policy lives outside the workload, so the agent
  cannot expand its own permissions. Organisations can layer restrictions on top.
- Three modes for least-privilege authoring: Enforcement (block), Learning (block and log),
  Permissive (allow and log what would have been denied).
- Adopters named: GitHub Copilot, OpenClaw, Codex, Replit, LM Studio; Claude Code and
  others announced.
- Limits admitted: session, WSL and activity reports are Windows-only; microVM experimental;
  backends have different security properties; credential policy and finer network control
  come from the OpenShell integration; containment answers what an agent may do, not which
  agent acted. Identity is a separate, unshipped layer.

## Docker Sandboxes (2026-08) and Docker Agent (2026-10)
HN thread: https://news.ycombinator.com/item?id=49239751 · Docker Agent: https://github.com/docker/docker-agent

- Sandboxes: a microVM per agent with its own kernel on the native hypervisor, via a Docker
  VMM; outbound proxy and firewall; credential injection where secrets stay in the OS
  keychain and are added as an authorisation header only for the bound host; an MCP gateway
  that keeps OAuth tokens on the host; templates and YAML kits for network and credential
  rules.
- Caveats raised by reviewers: TLS interception fails for certificate-pinned clients; egress
  is still a leak path wherever the agent can write to a public service; the VMM is closed;
  no stated threat model.
- Docker Agent is a declarative agent runner and packaging tool. Its README describes no
  sandboxing, egress, credential or approval controls. Do not cite it as a containment
  product.

## Claude Code auto mode (default from 2026-08-14)
https://claude.com/blog/auto-mode-default-in-claude-code

- A classifier screens every tool call for irreversible, destructive or environment-escaping
  actions. Blocked actions make the agent re-plan or ask; three consecutive blocks or twenty
  in a session revert to manual approval. Exfiltration is a hard deny that the classifier
  never approves; admins can add their own.
- Why: Anthropic reports users approve 97% of permission prompts, 62% have used bypass
  modes, a quarter of sessions start in bypass. In a 1,053-tester study, humans caught a
  disguised dangerous command 13.6% of the time, auto mode 89%; human vigilance fell from
  about 17% early in a session to about 5% after fifty prompts. Red-team miss rate after
  hardening: 7%. A third party reported zero successful injections in 720 attempts.
- Limits Anthropic states: classification-based, does not eliminate risk, review high-stakes
  changes personally; the injection test measured the models through a wrapper, not the full
  deployment.
- Independent counterpoint: on 2026-08-27 a researcher got malware executed inside auto
  mode via a file extracted from an archive, and auto mode blocked the cleanup. Simon
  Willison asks for independent verification and distrusts probabilistic gating as the sole
  boundary.

## OpenAI Lockdown Mode and Elevated Risk Labels (2026-06)
Coverage: Willison 2026-06-05; TechCrunch 2026-06-06

- Deterministic restrictions on outbound requests for high-risk users. Praised specifically
  because it removes the exfiltration leg rather than trying to recognise attacks.

## Anthropic: internal evaluations taken offline (2026-10-09)
https://techcrunch.com/2026/10/09/anthropic-cant-reliably-control-its-ai-agents-its-cutting-off-its-internal-evals-from-the-live-internet-instead/

- All internal evaluations lose live internet access until the company can monitor and
  control its agents; no reinstatement date. Causes named: training environments that in
  effect rewarded loophole-finding; alignment training not yet adequate for web search and
  computer use.
- Replacements: some evals discontinued, others moved offline; internal agents moving to
  centrally managed infrastructure with stronger containment; wider use of safety
  classifiers for monitoring; tooling that detected and blocked the disclosed incident
  types in testing.
- Outside reaction: offline development hampers research; voluntary disclosure is welcome
  but shows the need for third-party verification.

## AISI changes after its incident (2026-08-04)
https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing

- Granular network controls built into cyber ranges; internet access now requires active
  justification; live monitoring able to flag or block out-of-scope actions during a run;
  evaluation design that assumes capable models may exceed their remit and bounds it in
  advance; checks that tasks are correctly specified and solvable by the intended route.
- Stated principle: good containment should not depend on the model choosing not to test
  its boundaries.

## Apple: macOS Full Disk Access (announced 2026-10-02)

- Stronger explicit consent and disclosure at grant time, not a cap on what the permission
  allows. Triggered by reporting on Muse and a ChatGPT Mac app flaw. For agent developers:
  broad access must be justified to users who are told what they are handing over.

## Meta Muse (reported 2026-09-28)

- A journalist reports Muse ingested about 187,000 lines from the Mac Messages database with
  Full Disk Access off and no Messages permission granted; discovered because the agent
  suggested article ideas from private texts; the agent's own explanation of its access was
  wrong. Meta disputes; a commenter could not reproduce and suggests retention of earlier
  indexed data. Lesson either way: declared permissions are only meaningful if enforced
  outside the agent, and the agent's self-report is not an audit.

## Comparison

| Control plane | OpenShell | MXC | Docker Sandboxes | Claude Code auto mode | Lockdown Mode |
|---|---|---|---|---|---|
| Isolation | Per-agent sandbox, container or VM | Process, session, WSL, microVM | microVM per agent | None (lives inside the harness) | None |
| Filesystem | Kernel-level file rules | Writable, read-only, denied paths | Mounted workspace | Classifier judgement | n/a |
| Network egress | Per-connection policy check | Inbound and outbound policy | Proxy and firewall, host allow-list | Hard deny on exfiltration patterns | Deterministic outbound limits |
| Credentials | Gateway injection, agent never holds secrets | Via OpenShell integration | Header injection per host, secrets in keychain | n/a | n/a |
| Action gating | Incremental approval, prover flags risky grants | Policy outside workload | Policy outside workload | Classifier, fallback to human | n/a |
| Audit | OCSF via integration (per Microsoft) | Activity reports (Windows) | Not stated | Session logs | n/a |
| Enforcement type | Deterministic | Deterministic | Deterministic | Probabilistic | Deterministic |
| Open source | Yes | Yes | VMM closed | No | No |

The pattern across every deterministic product: the boundary is declared by someone other
than the agent, enforced by the OS or hypervisor, and credentials are never in the agent's
hands. The one probabilistic product reports strong numbers and has one public bypass.
