---
id: topic-222
slug: esql-compute-module-and-mode
topicNumber: 222
title: "Compute Module, Main() & Compute Mode"
part: 'Part 6: ESQL'
sectionNumber: 45
sectionTitle: 'Fundamentals'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Understand the Compute module template, Main(), CopyMessageHeaders(), CopyEntireMessage(), RETURN TRUE/FALSE, and Compute mode."
object: "Compute Module"
action: "Structure Module"
commandName: "CREATE COMPUTE MODULE"
synonyms:
  - "esql compute module"
  - "main returns boolean"
  - "copymessageheaders copyentiremessage"
  - "compute mode message localenvironment"
  - "return true return false esql"
---

# Compute Module, `Main()` & Compute Mode

When you double-click a **Compute** node in the ACE Toolkit, ACE generates a `.esql` file containing a **`CREATE COMPUTE MODULE`** block linked to that node's **ESQL module** property.

---

## Standard Shape of a Compute Module

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        SET OutputRoot.JSON.Data.greeting = 'Hello from ACE';
        RETURN TRUE; -- send OutputRoot to 'out'
    END;

    CREATE PROCEDURE CopyMessageHeaders() BEGIN
        DECLARE I INTEGER 1;
        DECLARE J INTEGER;
        SET J = CARDINALITY(InputRoot.*[]);
        WHILE I < J DO
            SET OutputRoot.*[I] = InputRoot.*[I];
            SET I = I + 1;
        END WHILE;
    END;

    CREATE PROCEDURE CopyEntireMessage() BEGIN
        SET OutputRoot = InputRoot;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "greeting": "Hello from ACE"
}
```

</details>

### Line-by-Line Breakdown

- **`BROKER SCHEMA <SchemaName>`**: Groups modules into a package-like schema matching the folder under your Application or Library. Modules in the default schema omit this line.
- **`CREATE COMPUTE MODULE <ComputeModuleName>` ... `END MODULE;`**: Defines the module body. The name `<ComputeModuleName>` **must match** the Compute node's **ESQL module** property in the Toolkit (`<SchemaName>.<ComputeModuleName>`).
- **`CREATE FUNCTION Main() RETURNS BOOLEAN`**: The entry-point function ACE invokes for every incoming message. It must return a `BOOLEAN`.
- **`CALL CopyMessageHeaders();`**: Invokes the helper procedure below to copy `Properties` and transport headers (`MQMD`, `HTTPInputHeader`, etc.) from `InputRoot` into `OutputRoot`, leaving the body empty so you can build a brand-new payload.
- **`SET OutputRoot.JSON.Data.greeting = 'Hello from ACE';`**: Creates the `JSON` parser domain and `Data` folder on `OutputRoot` and assigns the string literal `'Hello from ACE'` to `greeting`.
- **`RETURN TRUE;`**: Propagates `OutputRoot` (and `OutputLocalEnvironment` / `OutputExceptionList` depending on **Compute mode**) to the node's `out` terminal. Returning **`RETURN FALSE;`** sends **nothing** automatically — used when you already sent messages manually via `PROPAGATE` or want to drop the message silently.
- **`DECLARE I INTEGER 1;`**: Initializes 1-based loop index `I` to `1` (`InputRoot.*[1]` is always `Properties`).
- **`SET J = CARDINALITY(InputRoot.*[]);`**: Counts all top-level children of `InputRoot` (`Properties`, headers, and the body as the last child).
- **`WHILE I < J DO ... END WHILE;`**: Notice **`<`** (strictly less than `J`, NOT `<=`)! Because the message body is always the **last** top-level child at position `J`, stopping at `J - 1` copies every header and skips the input body.
- **`SET OutputRoot.*[I] = InputRoot.*[I];`**: Copies child `I` (name, type, and subtree) from `InputRoot` into `OutputRoot` using the wildcard `*`.
- **`CopyEntireMessage()`**: Copies the **entire** `InputRoot` tree (`Properties`, headers, **and** body) into `OutputRoot` in one line (`SET OutputRoot = InputRoot;`) — ideal when you only want to add or tweak 1–2 fields without rebuilding the whole body.

---

## Understanding **Compute mode** (Critical Node Property!)

In the Compute node's **Properties -> Basic -> Compute mode**, you choose which output trees the node actually propagates downstream (any tree NOT selected keeps its unchanged `Input...` version, silently throwing away your `Output...` edits!):

| Compute Mode | Message (`OutputRoot`) | `OutputLocalEnvironment` | `OutputExceptionList` | When to Choose |
| :--- | :--- | :--- | :--- | :--- |
| **`Message`** *(default)* | Output (`OutputRoot`) | Passed through unchanged | Passed through unchanged | Standard payload transforms that do NOT alter routing/HTTP status |
| **`LocalEnvironment`** | Input unchanged | Output (`OutputLocalEnvironment`) | Passed through unchanged | Dynamic routing only (setting destination URL/queue without touching payload) |
| **`LocalEnvironment And Message`** | Output (`OutputRoot`) | Output (`OutputLocalEnvironment`) | Passed through unchanged | Returning HTTP status codes (`ReplyStatusCode`), dynamic URLs/queues **plus** JSON/XML body |
| **`Exception`** | Input unchanged | Passed through unchanged | Output (`OutputExceptionList`) | Building a custom exception tree |
| **`All`** | Output (`OutputRoot`) | Output (`OutputLocalEnvironment`) | Output (`OutputExceptionList`) | When modifying payload, routing, and exception tree together |

> [!WARNING]
> **Top Beginner Bug:** Writing `SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 404;` while **Compute mode** is still the default `Message` silently ignores your `404`! Always change **Compute mode** to **`LocalEnvironment And Message`** whenever you edit `OutputLocalEnvironment`.

---

**Next:** [Variables (DECLARE), Data Types & Modifiers →](#topic-223)
