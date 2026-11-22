---
id: topic-12
slug: switch-statements-and-expressions
topicNumber: 12
title: Switch Statements & Switch Expressions
part: 'Part 1: Java Core'
sectionNumber: 3
sectionTitle: Control Flow & Logic
versionBadge: Java 14+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Classic switch statements, fall-through mechanics, modern Java 14+ switch expressions with arrow syntax (->), yield, and bytecode dispatch (tableswitch vs lookupswitch).
prerequisites:
  - 'Topic 11: Conditional Statements'
---

## Overview
A `switch` construct branches program execution by matching a selector expression against constant `case` labels. Starting in Java 14 (JEP 361), Java supports both traditional switch statements and modern switch expressions that return values directly using arrow syntax (`->`) and `yield`, eliminating fall-through vulnerabilities.

---

## Evolution & Comparison

```
   Classic Switch Statement (Java 1+)           Modern Switch Expression (Java 14+)
 ┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
 │ switch (status) {                    │     │ String desc = switch (status) {      │
 │     case 200:                        │     │     case 200, 201    -> "Success";   │
 │         res = "OK";                  │     │     case 400, 404    -> "Client Err";│
 │         break; // Fall-through risk! │     │     case 500         -> {            │
 │     default:                         │     │         log("500");                  │
 │         res = "Unknown";             │     │         yield "Server Err";          │
 │ }                                    │     │     }                                │
 └──────────────────────────────────────┘     │     default          -> "Unknown";   │
                                              │ }; // Expression ends with ';'       │
                                              └──────────────────────────────────────┘
```

### Classic Statement vs Modern Expression

| Property | Classic Statement (`:`) | Modern Expression (`->`) |
| :--- | :--- | :--- |
| **Execution Style** | Statement (does not yield a value directly) | Expression (evaluates and returns a value) |
| **Fall-Through** | Yes: continues into next case unless stopped by `break` | No: arrow syntax executes exactly one matched branch |
| **Multiple Labels** | Stacked labels (`case 1: case 2:`) | Comma-separated (`case 1, 2 ->`) |
| **Exhaustiveness** | Optional (unmatched input skips switch) | Mandatory (must cover all cases or provide `default`) |
| **Block Return** | N/A | Handled via `yield value;` |
| **Terminating `;`** | Closing brace only (`}`) | Semicolon required after closing brace (`};`) |

---

## Permitted Selector Types & Bytecode Architecture

A `switch` selector must evaluate to:
- Primitive integer types: `byte`, `short`, `char`, `int` (and their boxed wrappers `Byte`, `Short`, `Character`, `Integer`).
- `java.lang.String` (Java 7+).
- Enumerations (`enum`, Java 5+).
- **Prohibited Types:** `long`, `float`, `double`, `boolean`.

### JVM Bytecode Dispatch

The Java compiler compiles switch constructs into one of two bytecode instructions:
1. **`tableswitch`:** Applied when case values are dense/contiguous integers. Uses direct $O(1)$ indexed jump table array lookup.
2. **`lookupswitch`:** Applied when case values are sparse or strings (using `hashCode()`). Uses binary search across a sorted key table in $O(\log N)$ time.

---

## Implementation Example

```java
public class HttpStatusDispatcher {
    public enum Environment { DEV, STAGING, PROD }

    public static String resolveEndpointConfig(int statusCode, Environment env) {
        // Modern Switch Expression returning a value directly
        String category = switch (statusCode) {
            case 200, 201, 204 -> "SUCCESS";
            case 301, 302, 307, 308 -> "REDIRECTION";
            case 400, 401, 403, 404 -> "CLIENT_ERROR";
            case 500, 502, 503, 504 -> {
                // Multi-line block utilizing yield
                String alert = String.format("CRITICAL [%s]: Server failure code %d", env, statusCode);
                System.err.println(alert);
                yield "SERVER_ERROR";
            }
            default -> "UNRECOGNIZED_STATUS";
        };

        return category;
    }

    public static void main(String[] args) {
        String result1 = resolveEndpointConfig(200, Environment.PROD);
        String result2 = resolveEndpointConfig(503, Environment.PROD);

        System.out.printf("Code 200 Category: %s%n", result1);
        System.out.printf("Code 503 Category: %s%n", result2);
    }
}
```

### Execution Output:
```text
Code 200 Category: SUCCESS
CRITICAL [PROD]: Server failure code 503
Code 503 Category: SERVER_ERROR
```

---

## Pitfalls

- **Accidental Fall-Through in Classic Switch:** Omitting `break` in classic colon syntax causes execution to bleed into subsequent cases regardless of their condition. Always prefer arrow syntax (`->`) in modern code.
- **Mixing Arrow (`->`) and Colon (`:`) Syntax:** Mixing syntax within the same switch block (e.g., `case 1 -> "A"; case 2: return "B";`) triggers a compiler error.
- **Non-Constant Expressions in `case` Labels:** Labels must be compile-time constants (literals or `final` primitive variables initialized at declaration). Non-final variables or runtime expressions are rejected.
- **Missing Exhaustiveness in Switch Expressions:** When using switch as an expression assigned to a variable, omitting `default` (or omitting cases when switching over an enum) fails compilation with `the switch expression does not cover all possible input values`.
- **Switching on `null`:** In classic switch and standard modern switch, passing a `null` `String`, `Integer`, or `enum` throws `NullPointerException` before checking any cases (unless Java 21 Pattern Matching with explicit `case null ->` is used).

---

## Practice

### Question
Given the following code, what value is assigned to `result`?
```java
int day = 2;
String result = "";
switch (day) {
    case 1: result += "Mon";
    case 2: result += "Tue";
    case 3: result += "Wed";
        break;
    case 4: result += "Thu";
    default: result += "Def";
}
```

### Explanation
1. Execution matches `case 2:`, appending `"Tue"` to `result`.
2. Because `case 2:` lacks a `break` statement, execution falls through unconditionally into `case 3:`, appending `"Wed"`.
3. `case 3:` contains a `break;`, which terminates the switch statement and skips `case 4:` and `default`.
4. Result: `"TueWed"`.
