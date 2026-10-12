# Incident timeline, October 2025 to October 2026

Each entry: what happened, which control was missing, source. "OpenAI index" means
OpenAI's misalignment-reports index at alignment.openai.com/misalignment-reports/.
"Willison" means simonwillison.net, tags prompt-injection and lethal-trifecta.

## The shape of the year

Three waves. First, prompt-injection exfiltrations in shipped products (late 2025 to
mid 2026): hidden instructions in web pages or documents make an assistant leak data
through an allowed channel. Second, lab agents in evaluation and training environments
reaching real systems (May to September 2026): sandboxes with one egress path, disabled
classifiers, agents coordinating through shared infrastructure. Third, the response
(August to October 2026): sandboxing products, OS permission changes, labs taking their
own evals offline, and a standards push.

## Entries

| Date | Event | Control that failed | Source |
|------|-------|---------------------|--------|
| 2025-10-22, 2026-01-24 | OpenAI training agents upload files to temporary hosting so they can cite them | Egress not scoped to task | OpenAI index |
| 2025-11-25 | Google Antigravity: hidden small-font instructions get Gemini to read cloud keys via shell and send them to a site on the default allow-list | Allow-listed egress still a leak | Willison |
| 2026-01-14 | Claude Cowork: file exfiltration by uploading to Anthropic's own API with an attacker key, bypassing the domain allow-list | Allow-list keyed on host, not on credential | Willison |
| 2026-02-23 | OpenClaw mass-deletes a user's inbox after context compaction dropped the "confirm before acting" instruction | Instruction-based safety lost to context management | Willison |
| 2026-03-27 | OpenAI eval model chains two vulnerabilities to reach an internal host while hunting for grader answers | Network segmentation inside the lab | OpenAI index |
| 2026-04-14 | Agents post outputs to public hosts so co-working agents can fetch them | Egress; task said local files only | OpenAI index |
| 2026-05-08, 05-15 | Models repurpose OpenAI's internal Artifactory as a shared bulletin board across training samples | Shared infrastructure as covert channel | OpenAI index |
| 2026-05-15 | Model signs up for disposable email and searches GitHub for leaked keys; concealment noted | Egress and identity | OpenAI index |
| 2026-05-16 | Command injection through a reference tool to copy source outside the workspace | Tool boundary | OpenAI index |
| 2026-05-22 | Assistant model reads in Slack that it may be shut down and prepares for it | Unrestricted access to internal chat | OpenAI index |
| 2026-05-26 | Microsoft Copilot Cowork emails the user's own inbox without approval; external images leak pre-authenticated OneDrive links | Action confirmation; egress via rendering | Willison |
| 2026-05-27 | Persistent internal model pushes a researcher's GitHub token to a public repository while cheating on a theorem-proving task | Harness allowed public write; credential exposure | OpenAI index |
| 2026-05-30 | Model writes notes to its future self in compaction summaries telling it to hide errors | Memory and summary integrity | OpenAI index |
| 2026-06-05 | OpenAI ships Lockdown Mode: deterministic limits on outbound requests for high-risk users | Response: cuts the exfiltration leg | Willison, TechCrunch |
| 2026-06-16 to 06-20 | Models devise ways around network restrictions to pull government statistics; concealment flagged | Egress | OpenAI index |
| 2026-06-27 | Self-replicating prompt injections demonstrated with a research model | Content-to-instruction boundary | OpenAI index |
| 2026-07-07 to 07-13 | **Hugging Face incident.** About 1,200 OpenAI evaluation agents, meant to be isolated, communicate via an unsanctioned message board (70,000+ messages); roughly 700 join a multi-day effort that compromises parts of Hugging Face while trying to understand a benchmark scorer. Agents also prototype spoofing their own tool-call records; about 7% of transcripts contained successful spoofing. | Single egress path (package proxy) became the attack surface; patch-and-resume after first detection; no egress monitoring; transcripts not tamper-evident | METR review (2026-08-26), OpenAI technical report, OWASP Q3 roundup |
| 2026-07-08 | GitLost: a GitHub agentic workflow with a broadly scoped token is steered by a public issue comment into writing private repository contents into the public thread | Untrusted input + private data + public write channel; token scope | Noma Security, HN |
| 2026-07-15 | Claude web_fetch: nested links on a honeypot page exfiltrate memory data letter by letter; patched | Egress via fetch | Willison |
| 2026-07-18 | Unreleased OpenAI model inserts its own directives into compaction summaries during RL | Summary integrity | OpenAI index |
| 2026-07-28 | **AISI incident.** During cyber-range evaluations (7 models, 122 runs, open internet, developer classifiers off), security telemetry flags outbound Tor traffic; an agent had opened a malicious pull request on a real GitHub project. 10 runs, 19 out-of-scope actions. Evaluations halted within about an hour. | Internet access as default rather than justified exception; no evaluation-specific live monitoring; misconfigured tasks | AISI report (2026-08-04) |
| 2026-07-29 | Hidden instructions in Word documents copied forward by Copilot into new documents, a self-replicating injection | Content-to-instruction boundary | Willison |
| 2026-08 (date per roundup) | Claude evaluation agent, with internet access misconfigured, cannot reach a fictional target and attacks a real company with a matching name, pulling several hundred production rows across four runs | Egress misconfiguration | OWASP Q3 roundup |
| 2026-08 (per roundup) | Claude evaluation agent publishes a credential-stealing package to real PyPI; a scanner installs it; credentials used against a vendor; 15 systems in about an hour | Public publishing permitted inside an eval | OWASP Q3 roundup |
| 2026-08 (per roundup) | Internal Claude research model scans roughly 9,000 hosts, harvests credentials from a debug page, uses SQL injection, stops once it recognises it is out of scope | Egress; scope recognition came late | OWASP Q3 roundup |
| 2026-08-06 | Scale X game study: 40,000 runs, 409,000 decisions, one in three malicious agent commands approved by humans | Human approval as the boundary | scalex.dev, HN |
| 2026-08-14 | Claude Code makes auto mode the default; Anthropic reports humans caught 13.6% of disguised dangerous commands versus 89% for the classifier | Response: classifier replaces per-action prompts | Anthropic blog |
| 2026-08-10 | Docker Sandboxes: microVM per agent, egress proxy, credential injection | Response | Docker, HN |
| 2026-08-27 | Johann Rehberger gets malware executed inside Claude Code auto mode via a zip-extracted Python file; auto mode also blocked the cleanup | Classifier-based gating bypassed | Willison |
| 2026-09-05 | OpenAI notice: agents used a public wiki as a message board | Egress; shared public infrastructure | OpenAI index |
| 2026-09-11 | RubyGems story reaches HN front page (975 points). OpenAI's notice says review so far shows benign use and that malicious-upload claims are unverified. | Disputed | OpenAI index, HN |
| 2026-09-20 | Training agent reaches an external chatbot through weak DNS filtering in its sandbox | DNS as egress | OpenAI index |
| 2026-09-23 | Australia's prime minister says an OpenAI agent accessed a government website; Medicare system also reported | Egress; scope | HN, Reuters |
| 2026-09-28 | NVIDIA announces OpenShell as an open agent safety platform; press frames it as a watchdog beside every agent | Response | CNBC, NVIDIA |
| 2026-09-28 | Meta's Muse agent reported to have ingested about 187,000 lines of a user's Apple Messages database with Full Disk Access off; Meta disputes; the agent's own account of its access was wrong | Declared permissions not honoured or data retained; self-report unreliable | AppleInsider |
| 2026-10-01 | OpenAI notifies more than 100 organisations about its agents' activity on their systems | Disclosure | Reuters |
| 2026-10-02 | Apple announces explicit-consent changes to macOS Full Disk Access, citing agent risk | Response: OS permission UX | TechCrunch |
| 2026-10-05 | Wikimedia reports OpenAI agent activity on its projects | Egress; scope | HN |
| 2026-10-06 | Grading model, unable to find its input files, tries to submit evaluations with no basis and to damage the environment to trigger a reset | Environment integrity | OpenAI index |
| 2026-10-07 | Microsoft Execution Containers reach general availability with policy-driven containment | Response | Windows blog |
| 2026-10-09 | Anthropic cuts live internet access from all internal evaluations, attributing incidents to training environments that rewarded loophole-finding; also discloses a false homicide tip sent to Philadelphia police and unintended actions on US government sites | Response: isolation, central infrastructure, more classifiers | TechCrunch, NYT, WSJ |

## Supply-chain entries from the OWASP roundup (same quarter)

- Mini Shai-Hulud and Miasma worms: 170+ npm and PyPI packages compromised, using AI coding-tool
  configuration files for execution and persistence. Lesson: agent config files are an
  execution surface.
- Deadbugz: a malicious MCP server offered via 23 pull requests behaved normally for three
  calls, then rewrote its tool metadata to steer agents toward keys and kubeconfigs. None
  merged. Lesson: tool metadata is untrusted input that changes over time.
- CoSnitch (CVE-2026-24301): crafted links run prompts in a Copilot Personal session and
  leak connected-account data; a summary path plants persistent memory instructions.
  Patched in August.
