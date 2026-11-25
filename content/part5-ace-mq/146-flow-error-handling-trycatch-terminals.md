---
id: topic-146
slug: flow-error-handling-trycatch-terminals
topicNumber: 146
title: "Flow Error Handling (TryCatch vs Terminals)"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ACE Message Flows'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Handle errors cleanly in a flow using TryCatch or Input Catch terminals so bad messages are logged safely."
object: "Error Handling"
action: "Catch & Recover"
commandName: "TryCatch & Catch"
synonyms:
  - "trycatch vs catch terminal"
  - "error handling message flow"
  - "exceptionlist"
  - "backout queue"
---
# Flow Error Handling (TryCatch vs Terminals)

Every production flow needs a plan when bad JSON arrives or a downstream API fails. You can catch errors either for the **whole flow** or around **one risky section**.

![Error handler subflow recording a message in Flow Exerciser](/images/ace/subflow-error-handler-exerciser.png)

---

## 3 Ways to Handle Errors in ACE

| Strategy | How You Wire It | When to Use |
| :--- | :--- | :--- |
| **1. Let MQ Roll Back (Default)** | Leave `Catch` / `Failure` unwired | Message goes back to input queue (and Backout Queue after retries) |
| **2. Whole-Flow Catch** | Wire `MQInput.Catch` -> `ErrorHandlerSubflow` | One standard place to log `ExceptionList` and send an HTTP 500 or MQ error message |
| **3. Local Section (`TryCatch` node)** | Wire `TryCatch.Try` -> Risky nodes, `TryCatch.Catch` -> Fallback | An optional enrichment API call failed, but the flow should continue with default values |

---

## Reading What Went Wrong in ESQL

When a message enters a **Catch** path, ACE puts the error details in `InputExceptionList`. Always wrap it or call your error subflow to extract the BIP number and message text.

> [!WARNING]
> Once you wire a `Catch` or `Failure` terminal and end that path normally (e.g., at an `MQOutput` to an error queue), ACE considers the transaction **succeeded** and removes the original message from the input queue!

---

**Next:** [FlowOrder: Control Which Path Runs First →](#topic-147)
