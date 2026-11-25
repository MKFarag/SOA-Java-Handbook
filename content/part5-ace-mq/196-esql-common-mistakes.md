---
id: topic-196
slug: esql-common-mistakes
topicNumber: 196
title: "Common ESQL Mistakes & Quick Fixes"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Spot and fix the top 6 mistakes every new ACE developer hits when writing ESQL."
object: "ESQL Debugging"
action: "Fix Mistakes"
commandName: "Common ESQL Bugs"
synonyms:
  - "common esql errors"
  - "double quotes vs single quotes esql"
  - "esql array starts at 1"
  - "missing copy headers"
---

# Common ESQL Mistakes & Quick Fixes

Check this quick table whenever a Compute node outputs empty payloads, crashes with `BIP2521E`, or ignores your routing changes.

---

## Top 6 Mistakes & Instant Fixes

| Mistake | Symptom / Error | Quick Fix |
| :--- | :--- | :--- |
| Using double quotes for text (`"OK"`) | Treats `"OK"` as a field name -> evaluates `NULL` | Always use **single quotes**: `'OK'` |
| Starting array at `[0]` (`Item[0]`) | Runtime index error (`BIP2531E`) | ESQL arrays are **1-based**: `Item[1]` |
| Mutating `InputRoot` directly | Error: `Cannot alter read-only tree` | Call `CopyEntireMessage()` and edit **`OutputRoot`** |
| Missing `CALL CopyMessageHeaders()` | MQ/HTTP properties lost; replies fail | Put `CALL CopyMessageHeaders();` at line 1 of `Main()` |
| Editing `LocalEnvironment` under `Message` mode | Target queue / HTTP status override silently ignored | Set node **Properties -> Compute mode = `LocalEnvironment And Message`** |
| Concatenating nullable fields with `\|\|` | Entire output field quietly turns into `NULL` | Wrap optional inputs with **`COALESCE(field, '')`** |

---

> [!TIP]
> Whenever an ESQL line won't compile cleanly in the Toolkit, inspect the exact line number listed in the **Problems** tab at the bottom of the screen — red markers on the `.esql` editor scrollbar take you straight there!

---

**Next:** [Full Example: Transform JSON to XMLNSC →](#topic-197)
