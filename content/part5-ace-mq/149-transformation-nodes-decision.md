---
id: topic-149
slug: transformation-nodes-decision
topicNumber: 149
title: "Mapping vs Compute vs JavaCompute: Which Node?"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Quick decision table for choosing between Mapping, Compute (ESQL), and JavaCompute in App Connect Enterprise."
object: "Transformation Node"
action: "Compare & Choose"
commandName: "Mapping vs Compute vs JavaCompute"
synonyms:
  - "mapping vs compute"
  - "compute vs javacompute"
  - "when to use mapping node"
  - "transformation nodes ace"
---
# Mapping vs Compute vs JavaCompute: Which Node?

New ACE developers often ask: *"There are three nodes that transform messages — which one should I drag onto my flow?"* Use this simple rule of thumb.

![Decision diagram comparing Mapping, Compute, and JavaCompute nodes](/images/ace/diagram-transform-nodes.svg)

---

## Side-by-Side Comparison

| Node | Skill Needed | Best When... | Avoid When... |
| :--- | :--- | :--- | :--- |
| **Mapping** | Visual drag & drop (no code) | You have schemas (XSD, JSON Schema, Swagger, DFDL) and want fast field-to-field mapping + DB enrichment | Incoming JSON has unpredictable dynamic keys |
| **Compute** | ESQL (SQL-like syntax) | You want fast procedural logic, dynamic JSON/XML trees, custom headers (`MQMD`, `HTTP`), or `PROPAGATE` loops | Team prefers pure no-code visual diagrams |
| **JavaCompute** | Java + Maven/JARs | You need Java cryptography, Apache POI/PDF libs, complex regex, or existing Java utilities | Simple XML/JSON copy (slow & verbose compared to ESQL) |

---

## 3-Second Checklist

1. **Have both schemas & want visual docs?** Use **[Mapping Node](#topic-150)**.
2. **Working with schemaless JSON, MQ headers, or fast loops?** Use **[Compute Node](#topic-151)**.
3. **Need an external Java library or AES/RSA crypto?** Use **[JavaCompute Node](#topic-152)**.

> [!TIP]
> Performance tip: `Mapping` maps compile down efficiently at deploy time, and `Compute` (ESQL) runs natively inside ACE with minimal memory overhead. Only drop into `JavaCompute` when you genuinely need Java APIs.

---

**Next:** [Mapping Node (.map): Drag-and-Drop Mapping →](#topic-150)
