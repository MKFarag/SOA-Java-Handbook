---
id: topic-42
slug: comparable-and-comparator
topicNumber: 42
title: Comparable & Comparator
part: 'Part 1: Java Core'
sectionNumber: 10
sectionTitle: Generics & Collections Framework
versionBadge: Java 1.2+ / Java 8+ (Fluent APIs)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Natural ordering (Comparable.compareTo) vs external sorting strategies (Comparator.compare), Java 8 fluent chaining, nullsFirst/nullsLast, and TimSort stability.
prerequisites:
  - 'Topic 26: Interfaces & Modern Interface Evolution'
  - 'Topic 36: Generics Fundamentals'
---

## Overview
Java separates sorting into internal natural ordering via `java.lang.Comparable<T>` and external sorting strategies via `java.util.Comparator<T>`. Both rely on a three-way comparison contract returning negative, zero, or positive integer values to drive TimSort ($O(N \log N)$ stable sorting).

---

## Architectural Comparison Matrix

| Dimension | `java.lang.Comparable<T>` | `java.util.Comparator<T>` |
| :--- | :--- | :--- |
| **Package** | `java.lang` (implicit import) | `java.util` |
| **Abstract Method** | `int compareTo(T other)` | `int compare(T o1, T o2)` |
| **Location** | Implemented by the target class itself | Implemented in separate helper classes or lambdas |
| **Modifications Needed** | Must have source code access to modify class | Zero modification of target class required |
| **Sorting Strategies** | Exactly **one** natural order per class | **Multiple** arbitrary strategies per class |

---

## The Three-Way Comparison Contract

```
 compareTo(other) / compare(o1, o2)
   ├── Value < 0  ──► First element precedes second element
   ├── Value == 0 ──► Elements are equivalent in sort rank
   └── Value > 0  ──► First element follows second element
```

### Mathematical Invariants Required by TimSort
1. **Antisymmetry:** $\text{sgn}(compare(x, y)) == -\text{sgn}(compare(y, x))$
2. **Transitivity:** If $compare(x, y) > 0$ and $compare(y, z) > 0$, then $compare(x, z) > 0$.
3. **Consistency with Equals:** Strongly recommended that $(x.compareTo(y) == 0) == (x.equals(y))$. Discrepancies cause inconsistent behavior in `TreeSet` and `TreeMap`.

---

## Java 8 Fluent `Comparator` Composition

```java
Comparator<Product> productComparator = Comparator
    .comparing(Product::category)                                 // Primary key
    .thenComparingDouble(Product::price)                         // Secondary key
    .thenComparing(Product::name, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)) // Null-safe key
    .reversed();                                                  // Inverts entire sorting order
```

---

## Implementation Example

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SortingPipelineDemo {
    public static class InventoryItem implements Comparable<InventoryItem> {
        private final String sku;
        private final double price;
        private final int quantity;

        public InventoryItem(String sku, double price, int quantity) {
            this.sku = sku;
            this.price = price;
            this.quantity = quantity;
        }

        public String getSku() { return sku; }
        public double getPrice() { return price; }
        public int getQuantity() { return quantity; }

        // Natural Ordering: alphabetical by SKU
        @Override
        public int compareTo(InventoryItem other) {
            return this.sku.compareTo(other.sku);
        }

        @Override
        public String toString() {
            return String.format("%s($%.2f, qty=%d)", sku, price, quantity);
        }
    }

    public static void main(String[] args) {
        List<InventoryItem> stock = new ArrayList<>(List.of(
            new InventoryItem("SKU-B", 49.99, 100),
            new InventoryItem("SKU-A", 129.50, 15),
            new InventoryItem("SKU-C", 49.99, 500)
        ));

        // 1. Natural Sort via Comparable
        Collections.sort(stock);
        System.out.println("Natural Sort (SKU): " + stock);

        // 2. Custom Strategy via Comparator: Price ascending, then Quantity descending
        stock.sort(Comparator
            .comparingDouble(InventoryItem::getPrice)
            .thenComparing(Comparator.comparingInt(InventoryItem::getQuantity).reversed())
        );
        System.out.println("Custom Sort (Price asc, Qty desc): " + stock);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Natural Sort (SKU): [SKU-A($129.50, qty=15), SKU-B($49.99, qty=100), SKU-C($49.99, qty=500)]
Custom Sort (Price asc, Qty desc): [SKU-C($49.99, qty=500), SKU-B($49.99, qty=100), SKU-A($129.50, qty=15)]
```
</details>

---

## Pitfalls

- **Integer Subtraction Overflow:** Writing `(a, b) -> a.value - b.value` produces silent integer underflow/overflow when `a.value` is positive and `b.value` is negative (e.g. `Integer.MAX_VALUE - (-1)` wraps to negative). Always use `Integer.compare(a.value, b.value)` or `Double.compare(a.val, b.val)`.
- **Violating Transitivity:** A non-deterministic or non-transitive comparator triggers runtime `IllegalArgumentException: Comparison method violates its general contract` in HotSpot's TimSort algorithm.
- **NullPointerExceptions on Missing Keys:** Calling `Comparator.comparing(User::getEmail)` throws `NullPointerException` if any email is `null`. Wrap with `Comparator.nullsFirst(Comparator.naturalOrder())`.

---

## Practice

### Question
Why is the following comparator considered defective in production software?
```java
Comparator<Integer> badComp = (a, b) -> (a > b) ? 1 : -1;
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. The comparison contract requires returning `0` when two elements are equivalent (`a.equals(b)`).
2. This comparator returns `-1` when `a == b`.
3. As a consequence, `badComp.compare(x, x)` returns `-1`, which violates the fundamental reflexivity and antisymmetry axioms ($compare(x, x) == 0$).
4. When passed to `Arrays.sort()`, TimSort detects this invariant breach and throws `IllegalArgumentException: Comparison method violates its general contract`.

</details>
