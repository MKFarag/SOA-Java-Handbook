---
id: topic-186
slug: esql-environment-vs-localenvironment
topicNumber: 186
title: "Environment vs LocalEnvironment"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Learn why Environment stores your custom variables across the whole flow while LocalEnvironment controls ACE node destinations."
object: "Environment & LocalEnv"
action: "Store & Route"
commandName: "Environment vs LocalEnvironment"
synonyms:
  - "environment vs localenvironment"
  - "outputlocalenvironment"
  - "destination mq http file"
  - "compute mode localenvironment"
---

# Environment vs LocalEnvironment

Both trees store metadata instead of message payload, so beginners mix them up. Remember: **you own `Environment`**, while **ACE nodes read `LocalEnvironment`**.

---

## Exact Responsibilities

| Tree | Who Reads/Uses It? | Common Use | Compute Mode Required? |
| :--- | :--- | :--- | :--- |
| **`Environment`** | **You** (in ESQL / Maps / Java) | Keep original request ID before calling `HTTPRequest`; store auth tokens across nodes | Works under default **`Message`** mode! |
| **`LocalEnvironment`** | **ACE Nodes** (`MQOutput`, `HTTPRequest`, `RouteToLabel`, `FileOutput`) | Override target queue, REST URL, reply HTTP status, target file name | **Must** set Compute mode to **`LocalEnvironment`** or **`LocalEnvironment And Message`**! |

---

## Classic Real-World Example

Save the original order ID in `Environment`, then dynamically override the `HTTPRequest` URL in `OutputLocalEnvironment`:

```esql
SET Environment.Variables.origOrderId = InputRoot.JSON.Data.orderId;

SET OutputLocalEnvironment.Destination.HTTP.RequestURL =
    'https://api.internal/customers/' || InputRoot.JSON.Data.customerId;
```

> [!WARNING]
> By default, a Compute node has **`Compute mode = Message`**, meaning it forwards the old `InputLocalEnvironment` unchanged and **discards** anything you wrote to `OutputLocalEnvironment`! Switch **Compute mode** to **`LocalEnvironment And Message`** whenever routing dynamically.

---

**Next:** [PROPAGATE: Send to Different Out Terminals →](#topic-187)
