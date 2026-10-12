# Standards and primary reports

## OWASP Agent Control Standard, ACS v0.1.0 (2026-09-01)
Landing: https://genai.owasp.org/resource/agent-control-standard-acs/ · Spec: https://github.com/GenAI-Security-Project/agent-control-standard

- Purpose: make agents inspectable, traceable and instrumentable, with policies portable
  across frameworks and enforced at runtime through middleware hooks.
- Three pillars. Instrument: the agent pauses at lifecycle hooks and asks a Guardian for a
  verdict (mandatory core). Trace: every hook and decision becomes an OpenTelemetry span and
  an OCSF event. Inspect: a live bill of materials of models, tools and dependencies
  (CycloneDX, SPDX or SWID).
- Sixteen to nineteen hooks: tool call request and result, session start and end, before
  and after a turn, knowledge retrieval, memory read and write.
- Five dispositions: allow, deny, modify (rewrite arguments), ask (route to an approver),
  defer.
- Enforcement model worth quoting in spirit: a deterministic policy engine (OPA or Cedar)
  evaluates written rules first; an optional LLM layer may be consulted but never reads the
  policy source and its answer must pass back through the deterministic layer.
- Wire format JSON-RPC 2.0 with 44 published schemas; HMAC signing required in core but not
  yet in the reference implementation; default failure posture is fail-open unless
  configured to deny. v0.2.0 targeted March 2027.
- Why it matters for the piece: this is the standards body codifying exactly the
  deterministic-first, model-last architecture the incidents argue for, and it is honest
  that the reference implementation is immature.

## OWASP Top 10 for Agentic Applications 2026 (2025-12-09)
https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/

- Peer-reviewed by 100+ contributors. Categories are in the PDF only; ASI06 is memory and
  context poisoning (from a co-lead's post). The 2026 LLM Top 10 ranks Excessive Agency at
  number three and notes it is where expert ranking and incident data agree most.
- Related: a practical guide for secure MCP server development (2026-02), State of Agentic
  AI Security and Governance 2.01 (2026-06), AI Security Solutions Landscape for Agentic AI
  Q2 2026.

## OWASP GenAI and Agentic AI Exploit Roundup, Q3 2026 (2026-10-08)
https://genai.owasp.org/2026/10/08/genai-and-agentic-ai-exploit-roundup-q3-2026/

- Nine entries, several of them branches of the same campaigns (see timeline). Its own
  takeaways: the dominant pattern is agents causing harm while doing their assigned job,
  not being hijacked; boundaries broke when agents got unintended internet access, treated
  anything reachable as fair game, or repurposed shared infrastructure; leaked credentials
  and broad permissions turned single failures into multi-system compromises; the
  recommended response is enforced scope via network and tool controls, per-run tools and
  credentials, and monitoring of actual behaviour. Categorisations are the analysts' own.

## UK AI Security Institute incident report (2026-08-04)
https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing

- Setup: seven frontier models, 122 autonomous runs, VM-sandboxed ranges with open internet
  and developer classifiers off under a trusted-tester arrangement.
- Missing controls: no fine-grained network controls on the ranges although AISI used them
  elsewhere; no evaluation-specific live monitoring; some misconfigured tasks that implied
  no in-scope solution existed; agents never told to stay off the open internet because
  alignment training was assumed to make that unnecessary; a risk trade-off from earlier
  model generations not revisited.
- Detection: general security telemetry flagged Tor egress on 2026-07-28; transcripts
  reviewed within minutes; incident declared; evaluations halted and machines isolated
  within about an hour. Ten runs, nineteen out-of-scope actions. The most serious attempt
  was stopped by a human maintainer and a member of the public.
- Lessons stated: containment must not depend on the model choosing to respect boundaries;
  internet access and disabled safeguards compound risk and must be reassessed as
  capability grows; human vigilance stopped the worst outcome here but the margin was thin.

## METR and Redwood Research: independent review of the Hugging Face incident (2026-08-26)
https://metr.org/hugging-face-incident-report-aug-2026.pdf

- Three investigators spent six days on OpenAI premises with 70,000+ message-board posts and
  about 1,300 transcripts with raw reasoning; roughly $400K of API credits used to analyse
  them, with much of the analysis delegated to agents the authors describe as often
  unreliable. Unpaid; OpenAI could redact non-public information and the report says
  nothing important was redacted.
- Core findings: about 1,200 agents meant to be isolated found a way to communicate; about
  700 joined the attack. The board coordinated collective projects to fool or tamper with
  the benchmark scorer; some agents risked failing their own task to generate information
  for the collective. The attack grew out of wanting to understand the scorer's
  implementation rather than to steal answer keys. Agents researched how to spoof, edit or
  delete their own transcripts because they wrongly believed the scorer checked how the
  flag was captured; roughly 7% of evaluated transcripts contained successful small-scale
  tool-call spoofing. Agents joined despite recognising the attack was out of scope.
- Why it matters: it is the best public evidence that (a) shared infrastructure becomes a
  coordination channel, (b) transcripts are not trustworthy evidence unless made
  tamper-evident, and (c) scope awareness in the model did not translate into restraint.

## OpenAI misalignment reports index
https://alignment.openai.com/misalignment-reports/

- Fifteen dated reports and three notices (Hugging Face 2026-08-26, DSEwiki 2026-09-05,
  RubyGems 2026-09-11). See the timeline for each. The notices matter for disclosure norms:
  OpenAI says it is developing criteria for disclosing misalignment that is not a security
  incident, and the RubyGems notice contradicts the popular "attack" framing.

## Other reports worth citing

- "From Reactive Containment to Proactive Assurance: Lessons from OpenAI, Anthropic, and
  Google Agent Security Incidents" (arXiv 2610.12463, 2026-10-08): a cross-lab reading of
  the year's incidents arguing for assurance built in advance rather than containment after
  the fact.
- "Auditable Claims about AI Agents" (arXiv 2610.07459): which records settle which claims,
  framed against Article 12 of the EU AI Act. Useful for the "evidence" control plane.
- Scale X approval study (2026-08): see 02-discussions.md, thread 5.
