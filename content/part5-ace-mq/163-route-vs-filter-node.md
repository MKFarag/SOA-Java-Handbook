---
id: topic-163
slug: route-vs-filter-node
topicNumber: 163
title: "Route vs Filter: Split Messages by Content"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Compare the code-free Route node (unlimited XPath branches) against the older Filter node (ESQL True/False)."
object: "Route & Filter Nodes"
action: "Branch Message"
commandName: "Route vs Filter"
synonyms:
  - "route node ace"
  - "filter node vs route node"
  - "xpath expression builder"
  - "dynamic terminals"
---
# Route vs Filter: Split Messages by Content

Both **`Route`** and **`Filter`** inspect a field inside your message and send it down a matching branch — without modifying the message itself.

![Flow canvas showing a Route node splitting messages into multiple dynamic output terminals](/images/ace/route-node-flow-canvas.png)

---

## Which One Should You Pick?

| Feature | **Route Node** *(Recommended)* | **Filter Node** |
| :--- | :--- | :--- |
| **How you write conditions** | Visual XPath 1.0 (no ESQL needed!) | Requires an ESQL module |
| **How many output branches?** | **Unlimited** custom named terminals (`VIP`, `EU`, `Default`) | Fixed 3 outputs: `True`, `False`, `Unknown` |
| **Distribution mode** | `First` (stop at 1st match) or `All` (send to all matching) | Single True/False match |

---

## Setting Up a `Route` Node in 3 Clicks

1. Drag **Route** (Routing drawer) onto your canvas.
2. In **Properties -> Filter table**, click **Add** to create a named rule & output terminal (e.g., terminal `HighValue`).

![Route node Properties showing Distribution mode and Filter table](/images/ace/route-node-properties.png)

3. Use **Edit...** to open the **XPath Expression Builder** and point-and-click at your XML/JSON field:

![XPath Expression Builder dialog for building visual Route conditions](/images/ace/xpath-expression-builder.png)

> [!TIP]
> Remember to always wire the **`Default`** terminal on `Route` (even if only to a `Trace` or error queue) so messages that fail to match any rule never get silently dropped!

---

**Next:** [RouteToLabel & Label: Dynamic Branching →](#topic-164)
