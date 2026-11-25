---
id: topic-166
slug: aggregation-nodes-fan-out-in
topicNumber: 166
title: "AggregateControl, Request & Reply: Fan-Out / Fan-In"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Call 2 or more backend services in parallel and combine their replies into one message with Aggregation nodes."
object: "Aggregation Nodes"
action: "Fan-Out / Fan-In"
commandName: "AggregateControl AggregateReply"
synonyms:
  - "aggregatecontrol"
  - "aggregaterequest"
  - "aggregatereply"
  - "fan out fan in ace"
---
# AggregateControl, Request & Reply: Fan-Out / Fan-In

Suppose one customer order needs price data from **Inventory** AND risk data from **Fraud** — running them in **parallel** cuts total wait time in half. ACE does this across two tiny flows using the **3 Aggregation nodes**.

---

## How Fan-Out / Fan-In Works

### Flow 1 (Fan-Out):
```text
                        ┌──▶ [Compute A] ──▶ [MQOutput (INV.Q)] ──▶ [AggregateRequest ('INV')]
  [Input] ──▶ [AggregateControl ('ORDER_AGG', Timeout=10s)]
                        └──▶ [Compute B] ──▶ [MQOutput (FRD.Q)] ──▶ [AggregateRequest ('FRD')]
```

### Flow 2 (Fan-In):
```text
  [MQInput (REPLIES.Q)] ──▶ [AggregateReply ('ORDER_AGG')] ──▶ [Compute (Combine Results)] ──▶ [Output]
```

---

## Rules to Remember

1. **Matching `Aggregate name`:** `AggregateControl`, both `AggregateRequest` nodes, and `AggregateReply` must share the exact same **Aggregate name** (e.g., `ORDER_AGG`).
2. **Place `AggregateRequest` *after* `MQOutput` / `HTTPRequest`:** It records each outbound folder name (`INV`, `FRD`) after sending.
3. **Wire `AggregateReply.Timeout`:** Always wire the `Timeout` (or `Unknown`) terminal so partial replies are still handled cleanly if one backend stalls!

> [!NOTE]
> Aggregation nodes store in-flight correlation state inside IBM MQ system queues (`SYSTEM.BROKER.AGGR.*`), so an associated IBM MQ Queue Manager is required when using them.

---

**Next Section — IBM MQ Messaging:** [What Is IBM MQ vs ACE? →](#topic-167)
