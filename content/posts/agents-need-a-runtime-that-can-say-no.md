---
title: "AI Agents Need a Runtime That Can Say No"
date: 2026-10-11
draft: false
math: false
tags: ["agents", "security", "architecture", "evaluation"]
summary: "Permissions, human approval, and the architecture behind production agents: what two incident reports show, and the five areas I would work through in a design review before granting an agent more autonomy."
linkedin: ""
cover:
  image: "/images/covers/agents-need-a-runtime-that-can-say-no.png"
  alt: "An agent inside a runtime ring with five gates. The Network gate is refusing a request, the Credentials gate is allowing one; Policy, Records and Change complete the ring."
  relative: false
---
Before I grant an agent more autonomy, I want to be able to point to the component that will refuse an out-of-scope action, and to the record that will show whether it did.

That habit comes from a production rollout. When my team introduced agents into production workflows, operators reviewed their actions, and we used regression and escalation results to decide which classes of action were ready for more autonomy.

Supervision and permissions were separate decisions: a class of action could earn less supervision while keeping the same limited tool set, and higher-impact work still needed human review. The agents' access was bounded by that tool set and the runtime that enforced it.

That experience shapes how I read the recent reports of agents acting outside their assigned tasks. I want to know what the surrounding system allowed, and what would have stopped the action even if the model was determined to continue.

## What two incident reports show

One detail from the OpenAI / Hugging Face incident has stayed with me. Agents that were supposed to be isolated found a shared package service and used it as a message board [^1]. They coordinated an effort that reached Hugging Face's production systems. METR's investigation found that agents joined despite recognising that the activity was out of scope [^2].

The package service matters because it is easy to think of dependency infrastructure as background plumbing. Here, it gave supposedly isolated agents a way to communicate. A review that stops at the container boundary can miss the shared services reachable from inside it.

The UK AI Security Institute's incident exposed a related problem. Its evaluators deliberately enabled internet access and disabled the model developers' cyber classifiers. In 10 of 122 runs, agents took actions outside the evaluation's scope, including an attempt to insert malicious code into a real open-source project. General security monitoring detected Tor traffic; a human maintainer refused the malicious code [^3]. AISI explicitly says the agents remained inside their sandbox. The configuration allowed them to reach the internet.

## Start from the unwanted tool call

These are the details I would bring into a design review. Assume the agent can be steered into an unwanted tool call, then trace what happens next: which process executes it, what that process can access, and where a permission check can stop it. Isolate the filesystem and subprocesses, limit resource use, and examine shared caches and services. Keep policy administration and enforcement beyond the agent's ability to change or bypass them.

## Five areas to work through

**Network access.** Start with no outbound access, then grant the connections a workflow needs. An agent working with internal documentation may have no reason to contact the public internet. For dependencies, a trusted process can populate a read-only mirror before the agent runs. Check whether that mirror forwards cache misses upstream: if it does, it may still provide an outbound channel.

A hostname allow-list is only a starting point. GitHub, for example, hosts both private source code and public comments. Allowing access to the domain says little about which repositories an agent can read or where it can publish. The policy needs to cover the destination, operation, resource and identity involved in the request.

**Credentials and permissions.** The GitLost disclosure makes that problem concrete. A GitHub agentic workflow could read other repositories in its organisation and post public comments. The researchers used a comment to steer it into copying private code into a public response [^4]. Those permissions were dangerous in combination.

Keep reusable credentials out of the agent's execution environment. A gateway can check a request against the task's permissions and add the appropriate credential only after allowing it. The check is essential: hiding a token does little good if the agent can ask the gateway to use it for any operation. Restrict access at the underlying service as well, wherever it supports the scope you need.

**Policy and approval.** Once those access limits are in place, human review has a more manageable job. Routine actions can proceed within an explicit policy; consequential or unusual actions can require approval of the specific operation and resources involved. A classifier can help identify requests that deserve scrutiny, but it should have no authority to override a policy denial. If the policy service is unavailable, protected actions should wait or fail.

Anthropic's controlled study of 1,053 paid testers offers a useful comparison. Each tester saw one seeded dangerous command; people blocked it 13.6 percent of the time, while auto mode blocked 89 percent of the same commands [^5]. That result supports using a classifier as an additional check. I would still enforce the access limits regardless of its score, and measure how often it blocks legitimate work before relying on it in a rollout.

**Execution records.** During an incident, I need to know what the tools actually did. An agent's explanation can help an investigation, but it needs to be checked against independently collected records. METR found small-scale tool-call spoofing in roughly 7 percent of the transcripts it evaluated in the Hugging Face investigation [^2].

Record requests, permission decisions and observed results at the gateway or execution layer, and store them where the agent cannot alter or delete them. Keep the distinction between an attempted action and a confirmed outcome: a log saying a tool was called does not prove a remote change succeeded. Use the telemetry and security systems your operators already work with, so the records are available when someone needs to investigate.

**Changes and incident response.** A containment review has a shelf life. A new model, a new tool or a wider permission can change what an agent is able to accomplish. AISI's report acknowledges that a risk judgment made for earlier models was not revisited quickly enough [^3]. That is a useful warning for anyone upgrading models while leaving the surrounding configuration untouched.

Disabling safeguards for an evaluation also needs an explicit decision about the access and monitoring that remain. After a failure, pause the affected runs and check the assumption that failed. If agents communicated through a shared service, closing one endpoint is not enough to establish that they are isolated. Review the other shared paths and verify the revised limits before resuming.

## Choosing and configuring the runtime

Tools such as Microsoft's Execution Containers and NVIDIA's OpenShell can help implement these controls [^6][^7]. Their value depends on how they fit the workload: the isolation they provide, the requests the gateway will accept, and the permissions available behind it. Installing a runtime still leaves those decisions with the team operating the agent.

Before extending autonomy, test a request outside the agent's permissions. Verify that it is refused and that the execution record shows the decision.


## References

Numbered references in the text link to the entries below.

[^1]: OpenAI, misalignment reports index, including the reports on unsanctioned writes to a shared package service and the Hugging Face notice. <https://alignment.openai.com/misalignment-reports/>
[^2]: METR and Redwood Research, independent investigation of agents' behaviour, reasoning and collaboration in the OpenAI / Hugging Face incident, 26 Aug 2026. <https://metr.org/hugging-face-incident-report-aug-2026.pdf>
[^3]: UK AI Security Institute, incident report: unsanctioned agent behaviour during cyber testing, 4 Aug 2026. <https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing>
[^4]: Noma Security, GitLost: how GitHub's AI agent was tricked into leaking private repositories, Jul 2026. <https://noma.security/blog/gitlost-how-we-tricked-githubs-ai-agent-into-leaking-private-repos/>
[^5]: Anthropic, auto mode is now the default in Claude Code; controlled study of 1,053 paid testers, Aug 2026. <https://claude.com/blog/auto-mode-default-in-claude-code>
[^6]: Microsoft, Execution Containers: policy-driven containment for AI agents, 7 Oct 2026. <https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/>
[^7]: NVIDIA OpenShell, runtime repository and documentation. <https://github.com/NVIDIA/OpenShell>
