---
id: topic-168
slug: workflow-when-to-use-what
topicNumber: 168
title: "Workflow Decisions: When to Use What"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Decision tables for junior developers: new server vs reuse, application container vs standalone, and deploy vs restart."
object: "Workflow Decisions"
action: "Decision"
commandName: "Workflow Decisions"
synonyms:
  - "when to use what"
  - "workflow decisions"
  - "server reuse"
  - "application vs standalone"
  - "deploy vs restart"
---

Answers the 3 most common workflow architecture decisions junior developers face when deploying ACE workloads.
Use these decision tables to select the right packaging boundaries and deployment operations.

### 1. New Integration Server vs. Reuse Existing Server
| Situation | Decision | Reason |
| :--- | :--- | :--- |
| **Related flows belonging to the same business service** | **Reuse server** | Saves JVM memory; faster inter-flow communication. |
| **Flows with high CPU load or crash risk (native libraries)**| **New server** | Process isolation (`DataFlowEngine.exe`) prevents crashing other flows. |
| **Different security requirements or distinct teams** | **New server** | Allows independent restarts and distinct access control. |

### 2. Application Container vs. Standalone Flow
| Situation | Decision | Reason |
| :--- | :--- | :--- |
| **Production applications in ACE 12** | **Application** | Encapsulates flows, ESQL, and schemas with version control. |
| **Shared common subflows or ESQL libraries** | **Shared Library**| Eliminates code duplication across multiple applications. |
| **Legacy Message Broker 8 migration flows** | **Application** | Standalone flows are deprecated in modern containerized ACE. |

### 3. Deploy BAR vs. Restart Server
| Situation | Decision | Reason |
| :--- | :--- | :--- |
| **Code changes (ESQL, flow wire, new property)** | **Deploy BAR** | Updates compiled artifacts in the runtime engine dynamically. |
| **Config changes in `node.conf.yaml` or `server.conf.yaml`** | **Restart Server** | Configuration files are only re-read during process initialization. |
| **Flow is unresponsive or stuck in infinite loop** | **Restart Server** | Kills the thread and cleans in-memory state. |

* [Create an Integration Server (mqsicreateexecutiongroup)](#topic-196)
* [Deploy a BAR File (mqsideploy)](#topic-199)
* [Start a Message Flow (mqsistartmsgflow)](#topic-201)
