---
id: topic-230
slug: display-qstatus-monitor-queues
topicNumber: 230
title: "DISPLAY QSTATUS: Who Is Connected & Queue Depth"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Diagnose stuck queues by checking live open readers (IPPROCS), writers (OPPROCS), and exact connected PIDs with TYPE(HANDLE)."
object: "Queue Monitoring"
action: "Check Handles"
commandName: "DISPLAY QSTATUS"
synonyms:
  - "display qstatus"
  - "ipprocs opprocs"
  - "type handle runmqsc"
  - "who is reading my queue mq"
---

# DISPLAY QSTATUS: Who Is Connected & Queue Depth

Messages piling up in `<InputQueueName>`? Run **`DISPLAY QSTATUS`** inside `runmqsc` to see **if ACE is actually listening** and **which exact process holds the queue open**.

![IBM MQ Explorer Queues panel showing Current queue depth and Open input/output counts](/images/ace/mq-explorer-queues-depth.png)

---

## Check Live Queue State (`runmqsc`)

```text
* Check queue depth, open readers (IPPROCS), open writers (OPPROCS), oldest msg age
DISPLAY QSTATUS('<InputQueueName>') CURDEPTH IPPROCS OPPROCS MSGAGE

* See the EXACT app name and PID connected to <InputQueueName>!
DISPLAY QSTATUS('<InputQueueName>') TYPE(HANDLE) APPLTAG PID
```

<details data-type="output">
<summary>Expected Output</summary>

```text
AMQ8450I: Display queue status details.
   QUEUE(<InputQueueName>)                             TYPE(QUEUE)
   CURDEPTH(0)                             IPPROCS(1)
   MSGAGE( )                               OPPROCS(0)
AMQ8450I: Display queue status details.
   QUEUE(<InputQueueName>)                             TYPE(HANDLE)
   APPLTAG(DataFlowEngine.exe)             PID(14820)
```

</details>

---

## Reading `IPPROCS` Like a Pro

| `CURDEPTH` | `IPPROCS` (Open Readers) | Meaning |
| :--- | :--- | :--- |
| `0` | `>= 1` | Healthy! ACE (`DataFlowEngine`) is connected and draining messages immediately |
| `> 0` | **`0`** | **Nobody is listening!** Your ACE flow is stopped or pointing to the wrong queue/QMGR |
| Growing | `>= 1` | ACE is slower than incoming load (or rolling back messages!) — check `MSGAGE` & ACE errors |

---

**Next:** [Dead-Letter Queue (DLQ) & Alias Queues →](#topic-231)
