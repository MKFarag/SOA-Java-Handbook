---
id: topic-212
slug: subflows-when-and-how-to-modularize
topicNumber: 212
title: "Modularization: Subflows and Static Libraries"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Package reusable flow components into .subflow files inside Applications or Shared Libraries in ACE 12."
object: "Subflows"
action: "Modularize Flow"
commandName: ".subflow"
synonyms:
  - "subflow"
  - "create subflow"
  - "modularize flow"
  - "reusable flow"
  - "shared library subflow"
  - "embedded subflow"
  - "subflow node"
---

Encapsulates a sequence of message flow nodes into a reusable `.subflow` component with custom Input and Output terminals.
Use subflows to standardize common logic (such as audit logging, JWT token verification, or error handling) across multiple applications without duplicating flow code.

```
Subflow Architecture (.subflow file):
[ Input Terminal ] ──► [ Compute / Mapping ] ──► [ Output Terminal ]
         │                                              │
         └───────────── (Wired into Parent Flow) ───────┘
```

| Packaging Option | File Extension | Scope & Reusability | Where Deployed | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **Embedded Subflow** | `.subflow` | Private to parent Application | Packaged inside application BAR | Breaking a complex 30-node flow into readable 5-node segments. |
| **Shared Library Subflow** | `.subflow` | Public across multiple Applications | Deployed independently or referenced in BAR | Enterprise standard logging, token decoding, common error handling. |
| **Full Message Flow** | `.msgflow` | Top-level execution unit | Packaged in BAR file | Complete independent service with its own input trigger (HTTP/MQ). |

### Minimal Reusable Subflow Pattern
1. **Create Subflow:** In ACE Toolkit, right-click Application ➔ *New* ➔ *Subflow* ➔ Name: `AuditLogger`.
2. **Add Terminals:** Drag an `Input` terminal node and an `Output` terminal node from the palette.
3. **Connect Nodes:** Wire `Input` ➔ `Compute` ➔ `Output`.
4. **Use in Main Flow:** Drag `AuditLogger.subflow` into any `.msgflow` canvas as a regular node.

Subflow ESQL implementation:
```sql
CREATE COMPUTE MODULE AuditLogger_Compute
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        SET OutputRoot = InputRoot;
        INSERT INTO Database.FLOW_AUDIT (FLOW_NAME, LOG_TIME)
        VALUES (MessageFlowLabel, CURRENT_TIMESTAMP);
        RETURN TRUE;
    END;
END MODULE;
```

* **No Ingress Listeners in Subflows:** A subflow cannot contain protocol listener nodes like `MQInput` or `HTTPInput`; it must begin with a subflow `Input` terminal.
* **Shared Libraries Save Memory:** When a subflow resides in a Shared Library, all referencing applications on the integration server share a single in-memory copy of the compiled flow.
* **Preserve Message Tree:** Always ensure `SET OutputRoot = InputRoot;` is called in pass-through subflows so downstream nodes receive the original payload.

* [The Compute Node Overview](#topic-136)
* [Workflow Decisions: When to Use What](#topic-168)
* [Deploy a BAR File (mqsideploy)](#topic-199)
