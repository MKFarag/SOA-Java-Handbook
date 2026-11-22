---
id: topic-10
slug: strings-and-text-blocks
topicNumber: 10
title: Strings & Text Blocks
part: 'Part 1: Java Core'
sectionNumber: 2
sectionTitle: Language Basics & Data Types
versionBadge: Java 8+ / Java 15+
difficulty: Beginner
readingTime: 6 min read
shortDescription: >-
  Reference: String immutability, the String Constant Pool, core API methods, StringBuilder, and multi-line Text Blocks.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
  - 'Topic 05: Operators & Expressions'
---

## Overview
A `String` in Java is an immutable reference type representing a sequence of characters. String literals are automatically cached in the JVM String Constant Pool on the heap to eliminate duplicate memory allocations.

---

## Memory Mechanics

```
                  JVM Heap Memory
  ┌────────────────────────────────────────────────────────┐
  │                 String Constant Pool                   │
  │                                                        │
  │   "data" ◄────── str1 = "data"                         │
  │        ▲                                               │
  │        └───────── str2 = "data"      (Shared pointer)  │
  │                                                        │
  │   "DATA" ◄────── str3 = str1.toUpperCase()             │
  │                  (New object created, str1 unchanged)  │
  └────────────────────────────────────────────────────────┘
```

- **Immutability:** Once instantiated, a String's internal character array cannot change. Every transformation method returns a brand-new String object.
- **Literal vs `new String()`:** Writing `"Java"` reuses the interned instance from the pool. Calling `new String("Java")` explicitly allocates a redundant object on the heap outside the pool.

---

## Key Methods Reference

| Method | Return | Description | Example |
| :--- | :--- | :--- | :--- |
| `equals(other)` | `boolean` | Compares character content equality | `"abc".equals("abc")` -> `true` |
| `equalsIgnoreCase(s)` | `boolean` | Case-insensitive content check | `"a".equalsIgnoreCase("A")` -> `true` |
| `length()` | `int` | Returns number of UTF-16 code units | `"Java".length()` -> `4` |
| `contains(seq)` | `boolean` | Checks if substring exists | `"user_admin".contains("admin")` |
| `startsWith(prefix)` | `boolean` | Verifies prefix string | `"https://api".startsWith("https")` |
| `endsWith(suffix)` | `boolean` | Verifies suffix extension | `"report.pdf".endsWith(".pdf")` |
| `substring(start, end)` | `String` | Extracts slice `[start, end)` | `"2026-11".substring(0, 4)` -> `"2026"` |
| `strip()` | `String` | Strips leading and trailing whitespace (Java 11+) | `"  text  ".strip()` -> `"text"` |
| `isBlank()` | `boolean` | Checks if empty or whitespace-only (Java 11+) | `"   ".isBlank()` -> `true` |
| `isEmpty()` | `boolean` | Checks if length is zero | `"".isEmpty()` -> `true` |
| `split(regex)` | `String[]` | Splits string by regular expression pattern | `"a,b,c".split(",")` |
| `String.join(del, items)` | `String` | Joins elements using specified delimiter | `String.join("-", "a", "b")` -> `"a-b"` |

---

## High-Performance Construction: StringBuilder

Repeated string concatenation (`+`) inside loops creates excessive garbage objects on the heap. Use `java.lang.StringBuilder` for mutable, in-place character buffering:

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(",");
}
String result = sb.toString();
```

---

## Text Blocks (Java 15+)

Surrounded by triple quotes `"""`, text blocks represent multi-line string literals without requiring escape sequences (`\n`, `\"`):

```java
String jsonPayload = """
    {
        "status": "UP",
        "service": "%s"
    }
    """.formatted("PaymentGateway");
```
- **Incidental Indentation:** Java automatically detects and strips common leading indentation spaces.
- **`.formatted(...)`:** Injects arguments directly into template specifiers.

---

## Pitfalls

- **Comparing Content with `==`:** `str1 == str2` checks memory reference equality, NOT character content. It evaluates to `false` for strings allocated dynamically or via `new String()`. Always use `.equals()`.
- **Ignoring Return Value of String Operations:** Because strings are immutable, calling `str.trim();` or `str.toUpperCase();` does nothing to `str`. You must assign the result: `str = str.trim();`.
- **Concatenation Inside Loops:** Using `str += item;` in a loop executes in $O(N^2)$ time due to repeated memory copies. Always use `StringBuilder`.

---

## Practice

### Question
What is printed by the following code?
```java
String a = "hello";
String b = new String("hello");
String c = b.intern();
System.out.println((a == b) + " " + (a == c));
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `a == b` evaluates to `false` because `b` was created via `new String()`, allocating a distinct object outside the String Pool.
2. `b.intern()` returns the canonical reference from the String Constant Pool, which is identical to `a`. Thus `a == c` evaluates to `true`.
3. Output: `false true`.

</details>
