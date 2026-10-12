# Open-source tooling for agent containment

From the GitHub search API (repositories over 300 stars matching sandbox, guardrail, permission,
agent security, MCP security) plus a few named in the sources. Star counts are at collection time;
0 means not fetched. Descriptions are the repositories' own, trimmed. Several of the largest hits
are general agent harnesses or gateways rather than containment tools; they are kept because they
are where containment features are being bolted on.

## Sandboxes and agent runtimes

| Stars | Repository | Description |
|---|---|---|
| 83693 | [bytedance/deer-flow](https://github.com/bytedance/deer-flow) | An open-source long-horizon SuperAgent harness that researches, codes, and creates. With the help of sandboxes, memories, tools, skill, suba |
| 30925 | [nanocoai/nanoclaw](https://github.com/nanocoai/nanoclaw) | A lightweight alternative to OpenClaw that runs in containers for security. Connects to WhatsApp, Telegram, Slack, Discord, Gmail and other  |
| 30502 | [ComposioHQ/composio](https://github.com/ComposioHQ/composio) | Composio powers 1000+ toolkits, tool search, context management, authentication, and a sandboxed workbench to help you build AI agents that  |
| 26639 | [mksglu/context-mode](https://github.com/mksglu/context-mode) | Context window optimization for AI coding agents. Sandboxes tool output (98% reduction), persists session memory, and   enforces routing acr |
| 22714 | [NVIDIA/NemoClaw](https://github.com/NVIDIA/NemoClaw) | Runs Hermes, LangChain Deep Agents and OpenClaw inside OpenShell |
| 21144 | [wasmerio/wasmer](https://github.com/wasmerio/wasmer) | 🚀 Fast and lightweight sandboxes for your apps and AI agents |
| 15816 | [NVIDIA/OpenShell](https://github.com/NVIDIA/OpenShell) | Safe, private runtime for autonomous agents: per-agent sandbox, kernel-level file and syscall rules, per-connection egress policy, credential gateway, formal-verification prover for risky grants |
| 15782 | [opensandbox-group/OpenSandbox](https://github.com/opensandbox-group/OpenSandbox) | Secure, Fast, and Extensible Sandbox runtime for AI agents. |
| 12875 | [TencentCloud/CubeSandbox](https://github.com/TencentCloud/CubeSandbox) | Instant, Concurrent, Secure & Lightweight Sandbox for AI Agents. |
| 12648 | [nearai/ironclaw](https://github.com/nearai/ironclaw) | IronClaw is an Agent OS focused on privacy, security and extensibility |
| 12284 | [future-architect/vuls](https://github.com/future-architect/vuls) | Agent-less vulnerability scanner for Linux, FreeBSD, Container, WordPress, Programming language libraries, Network devices |
| 9460 | [databendlabs/databend](https://github.com/databendlabs/databend) | Data Agent Ready Warehouse : One for  Analytics, Search, AI, Python Sandbox.  — rebuilt from scratch. Unified architecture on your S3. |
| 8663 | [HarnessMD/munder-difflin](https://github.com/HarnessMD/munder-difflin) | an open-source alternative to the dots, bots and muses of the world, run an office of claude code/codex like agents on your laptop, sandboxe |
| 8446 | [withastro/flue](https://github.com/withastro/flue) | The sandbox agent framework. |
| 8375 | [mattpocock/sandcastle](https://github.com/mattpocock/sandcastle) | Orchestrate sandboxed coding agents in TypeScript with sandcastle.run() |
| 7785 | [steel-dev/steel-browser](https://github.com/steel-dev/steel-browser) | 🔥 Open Source Browser API for AI Agents & Apps. Steel Browser is a batteries-included browser sandbox that lets you automate the web without |
| 5272 | [FailproofAI/failproofai](https://github.com/FailproofAI/failproofai) | Observability and enforcement for AI agent harnesses. Capture every run and runtime reliability with policy enforcement.   |
| 4446 | [nolabs-ai/nono](https://github.com/nolabs-ai/nono) | agent runtime security - zero trust, zero setup, zero latency agent sandbox |
| 3646 | [nextlevelbuilder/goclaw](https://github.com/nextlevelbuilder/goclaw) | GoClaw - GoClaw is OpenClaw rebuilt in Go — with multi-tenant isolation, 5-layer security, and native concurrency. Deploy AI agent teams at  |
| 3568 | [onecli/onecli](https://github.com/onecli/onecli) | Open-source sandboxed agent harness for teams. Giving every employee a secured personal agent. |
| 1076 | [denoland/clawpatrol](https://github.com/denoland/clawpatrol) | Security firewall for agents |
| 303 | [ertugrulakben/cashclaw](https://github.com/ertugrulakben/cashclaw) | The Agent Economy Layer — agents earn, agents spend, Guard protects. 13 skills, runtime cost cap, recursive kill, tool firewall. 50+ HYRVE A |
| – | [microsoft/mxc](https://github.com/microsoft/mxc) | Microsoft Execution Containers: policy-driven containment with process, session, WSL and microVM backends; SDK and JSON policy schema |

## Gateways, proxies and policy enforcement

| Stars | Repository | Description |
|---|---|---|
| 60972 | [BerriAI/litellm](https://github.com/BerriAI/litellm) | The fastest, litest AI Gateway. Rust core with Python SDK. Call 100+ LLM APIs in OpenAI (or native) format with cost tracking, guardrails, l |
| 13166 | [Portkey-AI/gateway](https://github.com/Portkey-AI/gateway) | A blazing fast AI Gateway with integrated guardrails. Route to 1,600+ LLMs, 50+ AI Guardrails with 1 fast & friendly API. |
| 8703 | [maximhq/bifrost](https://github.com/maximhq/bifrost) | Fastest enterprise AI gateway (50x faster than LiteLLM) with adaptive load balancer, cluster mode, guardrails, 1000+ models support & <100 µ |
| 7084 | [katanemo/plano](https://github.com/katanemo/plano) | Plano is an AI-native proxy server and data plane for agentic apps. Smart LLM routing, observability, agent orchestration, and guardrails so |
| 6087 | [vllm-project/semantic-router](https://github.com/vllm-project/semantic-router) | An open, programmable decision layer for models and compute. |
| 4599 | [IBM/mcp-context-forge](https://github.com/IBM/mcp-context-forge) | An AI Gateway, registry, and proxy that sits in front of any MCP, A2A, or REST/gRPC APIs, exposing a unified endpoint with centralized disco |
| 4366 | [archestra-ai/archestra](https://github.com/archestra-ai/archestra) | Enterprise AI Platform with guardrails, MCP registry, gateway & orchestrator |
| 1684 | [theopenco/llmgateway](https://github.com/theopenco/llmgateway) | Route, manage, and analyze your LLM requests across multiple providers with a unified API interface. |
| 509 | [cordum-io/cordum](https://github.com/cordum-io/cordum) | The action firewall for AI agents. Enforce policy and human approval before risky tool calls, shell commands, workflows, and production chan |
| – | [Infisical/agent-vault](https://github.com/Infisical/agent-vault) | Open-source credential proxy and vault so agents never hold secrets |
| – | [qpoint-io/qtap](https://github.com/qpoint-io/qtap) | eBPF-based egress visibility through encryption without a proxy; useful for auditing agent traffic |
| – | [vectimus/vectimus](https://github.com/vectimus/vectimus) | Cedar policy enforcement for AI coding agents |

## Guardrail frameworks

| Stars | Repository | Description |
|---|---|---|
| 7508 | [guardrails-ai/guardrails](https://github.com/guardrails-ai/guardrails) | Adding guardrails to large language models. |
| 7276 | [NVIDIA-NeMo/Guardrails](https://github.com/NVIDIA-NeMo/Guardrails) | NeMo Guardrails is an open-source toolkit for easily adding programmable guardrails to LLM-based conversational systems. |
| 6827 | [Tencent/AI-Infra-Guard](https://github.com/Tencent/AI-Infra-Guard) | A full-stack AI Red Teaming platform securing AI ecosystems via Agent Scan, Skills Scan, MCP scan, AI Infra scan and LLM jailbreak evaluatio |
| 2549 | [lennney/stop-that-shit](https://github.com/lennney/stop-that-shit) | Stop That Shit（别再造史了）｜面向 Codex/GPT 场景的多平台 Hook + Skill Guard：拦截 AI coding agent 无需求的哈希、校验和与任务范围膨胀。 A multi-platform Hook + Skill Guard for A |
| 1591 | [kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net) | A pre-execution guard for AI coding agents. It blocks destructive Git and file system commands, plus common attempts to access sensitive fil |
| 1536 | [archestra-ai/OpenAPPA](https://github.com/archestra-ai/OpenAPPA) | Deterministic guardrails that don't break agents |
| 1233 | [wanxingai/LightAgent](https://github.com/wanxingai/LightAgent) | LightAgent: Lightweight Python framework for OpenAI-compatible agents with tools, memory, guardrails, tracing, lifecycle hooks, multi-agent  |
| 936 | [kaplanelad/shellfirm](https://github.com/kaplanelad/shellfirm) | Safety guardrails for ai coding agents and human terminal commands |

## Credential and secrets handling

| Stars | Repository | Description |
|---|---|---|
| 29694 | [Infisical/infisical](https://github.com/Infisical/infisical) | Infisical is the open-source platform for securing secrets, certificates, access, and AI Agents. |

## Scanners and red-team tooling

| Stars | Repository | Description |
|---|---|---|
| 28275 | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | A coding-agent skill for multi-phase security audits with independently verified, machine-readable findings |
| 19935 | [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) | Security scanner for AI agent skills. Detect vulnerabilities, malicious patterns, security risks, prompt injection, data exfiltration, and s |
| 9095 | [We5ter/Scanners-Box](https://github.com/We5ter/Scanners-Box) | The Ultimate Open-Source Security Arsenal for Hackers, Enterprises, and AI Agents——面向极客、企业与 AI 智能体的全域开源网络安全工具矩阵 |
| 8126 | [vercel-labs/deepsec](https://github.com/vercel-labs/deepsec) | Deepsec is a security harness for finding vulnerabilities in your codebase powered by coding agents |
| 5358 | [kaifcodec/user-scanner](https://github.com/kaifcodec/user-scanner) | 🕵️‍♂️ (2-in-1) Email & Username OSINT suite featuring native MCP support for deep data extraction just from a single Email/Username. Analyze |
| 4500 | [intuitem/ciso-assistant-community](https://github.com/intuitem/ciso-assistant-community) | CISO Assistant is a one-stop-shop GRC platform for Risk Management, AppSec, Compliance & Audit, TPRM, BIA, Privacy, and Reporting. It suppor |
| 3132 | [snyk/agent-scan](https://github.com/snyk/agent-scan) | Security scanner for AI agents, MCP servers and agent skills. |
| 922 | [luckyPipewrench/pipelock](https://github.com/luckyPipewrench/pipelock) | Open-source AI agent firewall for MCP security and agent egress. Scans mediated HTTP, MCP, A2A, and WebSocket traffic for exfiltration, SSRF |

## Governance and access control for data

| Stars | Repository | Description |
|---|---|---|
| 57639 | [appwrite/appwrite](https://github.com/appwrite/appwrite) | The open-source cloud for agents & devs. Including Auth, Databases, Storage, Functions, Messaging, Hosting, Realtime, WAF and more |
| 14550 | [bytebase/bytebase](https://github.com/bytebase/bytebase) | Database governance built for humans and agents — controlling changes and access across every major database. |

## Other matches

| Stars | Repository | Description |
|---|---|---|
| 277087 | [affaan-m/ECC](https://github.com/affaan-m/ECC) | The agent harness performance optimization system. Skills, instincts, memory, security, and research-first development for Claude Code, Code |
| 34243 | [mukul975/Anthropic-Cybersecurity-Skills](https://github.com/mukul975/Anthropic-Cybersecurity-Skills) | 817 structured cybersecurity skills for AI agents · Mapped to 6 frameworks: MITRE ATT&CK, NIST CSF 2.0, MITRE ATLAS, D3FEND, NIST AI RMF & M |
| 20116 | [eosphoros-ai/DB-GPT](https://github.com/eosphoros-ai/DB-GPT) | open-source agentic AI data assistant for the next generation of AI + Data products. |
| 14527 | [NevaMind-AI/memU](https://github.com/NevaMind-AI/memU) | Personal memory across agents |
| 12881 | [Piebald-AI/claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts) | All parts of Claude Code's system prompt, 27 builtin tool descriptions, sub agent prompts (Plan/Explore/Task), utility prompts (CLAUDE.md, c |
| 12642 | [0x4m4/hexstrike-ai](https://github.com/0x4m4/hexstrike-ai) | HexStrike AI MCP Agents is an advanced MCP server that lets AI agents (Claude, GPT, Copilot, etc.) autonomously run 150+ cybersecurity tools |
| 10748 | [omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent) | Omnigent is an open-source AI agent framework and meta-harness: orchestrate Claude Code, Codex, Cursor, Pi, and custom agents — swap harness |
| 9559 | [ntegrals/openbrowser](https://github.com/ntegrals/openbrowser) | Let AI agents browse the web. An autonomous toolkit for browser-based AI agents. |
| 9392 | [BoundaryML/baml](https://github.com/BoundaryML/baml) | The programming language for agents |
| 9084 | [nexu-io/html-anything](https://github.com/nexu-io/html-anything) | ✨ The agentic HTML editor — your local AI agent writes the HTML, you ship it. 🚀 75 Skills × 9 Surfaces (magazine · deck · poster · XHS / twe |
| 8571 | [firerpa/lamda](https://github.com/firerpa/lamda) | Android Full-Stack Device Control Platform: WebRTC/H.264 remote desktop, UI/OCR/image-matching automation, one-click MITM, built-in Frida, p |
| 6763 | [superagent-ai/superagent](https://github.com/superagent-ai/superagent) | Superagent protects your AI applications against prompt injections, data leaks, and harmful outputs. Embed safety directly into your app and |
| 4618 | [cerbos/cerbos](https://github.com/cerbos/cerbos) | Cerbos is an open-core authorization management platform for authorizing every identity and governing every action across applications, gate |
| 3364 | [metorial/metorial](https://github.com/metorial/metorial) | Connect any AI model to 1200+ integrations (MCP, CLI, API) |
| 2402 | [beenuar/AiSOC](https://github.com/beenuar/AiSOC) | Open-source AI Security Operations Center: alert fusion, LLM-agent triage, MITRE ATT&CK investigation, and a replayable decision ledger for  |
| 2268 | [stacklok/toolhive](https://github.com/stacklok/toolhive) | ToolHive is an enterprise-grade platform for running and managing Model Context Protocol (MCP) servers. |
| 2139 | [future-agi/future-agi](https://github.com/future-agi/future-agi) | Open-source, end-to-end platform for evaluating, observing, and improving LLM and AI agent applications. Tracing · Evals · Simulations · Dat |
| 1528 | [akto-api-security/akto](https://github.com/akto-api-security/akto) | Akto is the fastest growing AI Security platform for your teams to secure AI agents, MCPs, LLMs, Agent skills, Gen AI apps in your organizat |
| 1516 | [hardenrun/aif](https://github.com/hardenrun/aif) | On device Firewall for Coding and Personal Agents |
| 1279 | [Gentleman-Programming/gentle-shell](https://github.com/Gentleman-Programming/gentle-shell) | Gentle Shell is a Pi-native coding-agent harness for controlled development with Organic Driven Development, optional SDD/OpenSpec, subagent |
| 987 | [souvikmajumder26/Multi-Agent-Medical-Assistant](https://github.com/souvikmajumder26/Multi-Agent-Medical-Assistant) | ⚕️GenAI powered multi-agentic medical diagnostics and healthcare research assistance chatbot. 🏥 Designed for healthcare professionals, resea |
| 896 | [cuga-project/cuga-agent](https://github.com/cuga-project/cuga-agent) | CUGA is an open-source generalist agent harness for the enterprise, supporting complex task execution on web and APIs, OpenAPI/MCP integrati |
| 737 | [tldrsec/prompt-injection-defenses](https://github.com/tldrsec/prompt-injection-defenses) | Every practical and proposed defense against prompt injection. |
| 505 | [liu00222/Open-Prompt-Injection](https://github.com/liu00222/Open-Prompt-Injection) | This repository provides a benchmark for prompt injection attacks and defenses in LLMs |
| 368 | [yunwei37/prompt-hacker-collections](https://github.com/yunwei37/prompt-hacker-collections) | prompt attack-defense, prompt Injection, reverse engineering notes and examples / 提示词对抗、破解例子与笔记  |
| 362 | [zszszszsz/.config](https://github.com/zszszszsz/.config) | # # Automatically generated file; DO NOT EDIT. # OpenWrt Configuration # CONFIG_MODULES=y CONFIG_HAVE_DOT_CONFIG=y # CONFIG_TARGET_sunxi is  |
| – | [GenAI-Security-Project/agent-control-standard](https://github.com/GenAI-Security-Project/agent-control-standard) | OWASP Agent Control Standard v0.1.0: hooks, dispositions, OTel/OCSF tracing, AgBOM |

Observation: the deterministic layer (sandboxes, gateways, credential proxies) is where the
fastest-growing new projects sit; guardrail frameworks (NeMo Guardrails, guardrails-ai) predate
the incidents and are classifier-shaped. Nothing here yet implements the OWASP ACS hooks end to end.