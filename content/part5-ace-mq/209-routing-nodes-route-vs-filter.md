---
id: topic-209
slug: routing-nodes-route-vs-filter
topicNumber: 209
title: "Message Routing: Route Node vs Filter Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Evaluate and route message paths using Route node (XPath multi-terminal) and Filter node (ESQL true/false)."
object: "Routing Node"
action: "Route Message"
commandName: "Route vs Filter"
synonyms:
  - "route node"
  - "filter node"
  - "content based routing"
  - "message routing"
  - "branching flows"
  - "dynamic routing"
  - "routetolabel"
---

Evaluates message payload or headers to direct message flow down different processing paths without writing full Compute nodes.
Use the `Route` node for XPath-based multi-terminal branching, and the `Filter` node for simple Boolean (true/false/unknown) ESQL decisions.

```
Route Node (Multi-Branch XPath):
[ Route Node ] ──┬──► 'Cairo' terminal      (XPath: $Root/JSON/Data/city = 'Cairo')
                 ├──► 'Alexandria' terminal (XPath: $Root/JSON/Data/city = 'Alexandria')
                 └──► 'default' terminal    (Unmatched messages)

Filter Node (3-Way ESQL Terminal):
[ Filter Node ] ──┬──► 'true' terminal      (ESQL expression returns TRUE)
                  ├──► 'false' terminal     (ESQL expression returns FALSE)
                  └──► 'unknown' terminal   (ESQL expression evaluates to NULL)
```

| Routing Feature | Route Node | Filter Node | RouteToLabel + Label |
| :--- | :--- | :--- | :--- |
| **Expression Language** | XPath 1.0 (No ESQL required) | ESQL boolean function (`RETURNS BOOLEAN`) | ESQL sets `Destination.RouterList` |
| **Output Terminals** | Dynamic (Create unlimited custom terminals) | Fixed 3 terminals (`true`, `false`, `unknown`) | Dispatches dynamically to matching `Label` nodes |
| **Modifies Message?** | Read-only (Message passes through untouched) | Read-only (Message passes through untouched) | Read-only |
| **Best Used For** | Content-based routing on JSON/XML fields | Quick pass/fail checks, filtering test traffic | Complex state machines with 10+ target handlers |

### Minimal Routing Example
Given incoming order: `{"id": 1, "name": "Ali", "city": "Cairo"}`

**Route Node Filter Table:**
| Filter Expression (XPath) | Output Terminal |
| :--- | :--- |
| `$Root/JSON/Data/city = 'Cairo'` | `CairoTerminal` |
| `$Root/JSON/Data/city = 'Alexandria'` | `AlexTerminal` |

**Filter Node ESQL Equivalent:**
```sql
CREATE FILTER MODULE CheckCairoCustomer
    FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        RETURN Root.JSON.Data.city = 'Cairo';
    END;
END MODULE;
```

* **No Message Mutation:** Neither `Route` nor `Filter` nodes modify the message body; they inspect the read-only tree and select the next node wire.
* **Filter Node Unknown Terminal:** If an inspected field is missing or evaluates to `NULL`, the `Filter` node dispatches down the `unknown` terminal rather than throwing an exception.
* **Route Node Match Order:** The `Route` node evaluates expressions top-to-bottom. Uncheck "Route to all matching terminals" if each message should only take one path.

* [Terminals and Message Routing](#topic-135)
* [Operators and Conditions in ESQL](#topic-143)
* [Which Transformation Node: Compute vs Java vs Mapping](#topic-207)
