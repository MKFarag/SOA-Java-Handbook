---
id: topic-138
slug: the-compute-node-anatomy-and-properties
topicNumber: 138
title: "The Compute Node: Anatomy and Properties"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Inspect default generated ESQL boilerplate, CopyMessageHeaders vs CopyEntireMessage, and Compute Mode settings."
object: "Compute Node"
action: "Configuration"
commandName: "Compute Mode"
synonyms:
  - "compute mode"
  - "copymessageheaders"
  - "copyentiremessage"
  - "compute node properties"
---

Explains the default generated ESQL template and the Compute Mode property determining tree propagation.
Use these properties to specify whether headers, message bodies, or environment trees propagate to downstream nodes.

```esql
CALL CopyMessageHeaders();
-- CALL CopyEntireMessage();
```

| Compute Mode Value | OutputRoot Propagated? | LocalEnvironment Propagated? | ExceptionList Propagated? |
| :--- | :--- | :--- | :--- |
| **`Message`** (Default) | **Yes** | No (passes incoming LE) | No |
| **`LocalEnvironment`** | No (passes incoming Root)| **Yes** | No |
| **`All`** | **Yes** | **Yes** | **Yes** |
| **`Exception`** | No | No | **Yes** |

```esql
CREATE PROCEDURE CopyMessageHeaders() BEGIN
    DECLARE I INTEGER 1;
    DECLARE J INTEGER;
    SET J = CARDINALITY(InputRoot.*[]);
    WHILE I < J DO
        SET OutputRoot.*[I] = InputRoot.*[I];
        SET I = I + 1;
    END WHILE;
END;
```

* **Copying Headers Only:** `CopyMessageHeaders()` preserves transport headers (Properties, MQMD, HTTP headers) while leaving `OutputRoot.JSON` blank.
* **CopyEntireMessage Hazard:** Leaving `CopyEntireMessage()` active copies the entire input message into output; any subsequent `SET` will overwrite or append fields to the original.
* **Compute Mode Warning:** If your ESQL populates `OutputLocalEnvironment` but Compute Mode is set to `Message`, all changes to `LocalEnvironment` are lost upon exit.

* [What is ESQL and Where Does It Run](#topic-137)
* [The Message Tree Architecture](#topic-139)
* [Environment vs. LocalEnvironment](#topic-152)
