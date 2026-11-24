---
id: topic-153
slug: error-handling-and-exceptionlist
topicNumber: 153
title: "Throw and Handle Errors (ExceptionList)"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Navigate the ExceptionList tree, extract BIP error codes and diagnostic text, and manually trigger exceptions using THROW."
object: "Error Handling"
action: "Throw & Catch"
commandName: "THROW EXCEPTION ExceptionList"
synonyms:
  - "throw error"
  - "handle error"
  - "exceptionlist"
  - "bip code extraction"
  - "try catch"
  - "throw user exception"
---

Inspects incoming failure trees in `ExceptionList` to extract BIP codes, or raises intentional faults via `THROW EXCEPTION`.
Use this logic inside nodes connected to a `catch` or `failure` terminal to construct clean JSON error responses.

```esql
-- Throw an error manually
THROW USER EXCEPTION CATALOG 'BIPmsgs' NUMBER 2950 VALUES('Invalid user id');
```

| Construct | Description | Example |
| :--- | :--- | :--- |
| **`InputExceptionList`** | The error tree passed into the node when connected to `failure` or `catch`. | `InputExceptionList.*[1]` |
| **`THROW USER EXCEPTION`** | Immediately terminates thread and routes to failure/catch terminal. | `THROW USER EXCEPTION VALUES('Error');` |
| **`RecoverableException`** | Top-level node in ACE's nested exception hierarchy. | Inspect child `Number` for BIP code. |

```esql
CREATE PROCEDURE ExtractBIPDetails(IN exRef REFERENCE, OUT bipCode INTEGER, OUT errText CHARACTER)
BEGIN
    WHILE exRef.Number IS NOT NULL DO
        SET bipCode = exRef.Number;
        SET errText = exRef.Text;
        MOVE exRef LASTCHILD;
    END WHILE;
END;
```

```esql
-- Building JSON Error Response
SET OutputRoot.Properties = InputRoot.Properties;
DECLARE bipCode INTEGER;
DECLARE errText CHARACTER;
DECLARE exRef REFERENCE TO InputExceptionList.*[1];

CALL ExtractBIPDetails(exRef, bipCode, errText);

SET OutputRoot.JSON.Data.status = 'ERROR';
SET OutputRoot.JSON.Data.bipCode = 'BIP' || CAST(bipCode AS CHARACTER);
SET OutputRoot.JSON.Data.message = errText;
```

```json
{
  "status": "ERROR",
  "bipCode": "BIP8018E",
  "message": "Queue manager SCBQM is not available"
}
```

* **Nested Exceptions:** ACE nests exceptions like Russian dolls; the actual root cause BIP is located at the **deepest** child node.
* **Number Contains BIP:** The `Number` field contains the integer portion of the BIP code (e.g. `8018` for `BIP8018E`).
* **Uncaught Exceptions:** If an exception is raised and not captured by a `catch` or `failure` terminal, the message transaction rolls back to the input queue.

* [Terminals and Message Routing](#topic-135)
* [BIP Codes Quick Reference Directory](#topic-206)
* [Common MQ Connection Errors](#topic-167)
