---
id: topic-32
slug: custom-exceptions-and-exception-chaining
topicNumber: 32
title: Custom Exceptions & Exception Chaining
part: 'Part 1: Java Core'
sectionNumber: 9
sectionTitle: Exception Handling
versionBadge: Java 8+
difficulty: Intermediate
readingTime: 11 min read
shortDescription: >-
  Design clear domain-specific exception hierarchies. Master exception chaining
  to preserve root causes and eliminate anti-patterns like log-and-rethrow.
prerequisites:
  - 'Topic 29: The Java Exception Hierarchy'
  - 'Topic 30: Checked vs Unchecked Exceptions'
---
## 1. What It Is and Why It Exists

A **Custom Exception** is a user-defined exception class designed to represent domain-specific failure conditions in an application (e.g., `InsufficientFundsException`, `UserNotFoundException`, `InventoryDepletedException`).

**Exception Chaining** (introduced in Java 1.4) is the practice of wrapping a lower-level root cause exception (such as a database `SQLException` or network `ConnectException`) inside a higher-level domain exception while preserving the original cause's stack trace. The root cause is stored in the `cause` field of `Throwable` and retrieved via `getCause()`.

### The Real-World Analogy
Think of an international diplomatic embassy:
- If a low-level wire cable between country A and country B is severed (**`java.net.ConnectException`**), the foreign minister doesn't broadcast "Ethernet frame drop on port 4" to citizens.
- Instead, the ministry issues a formal diplomatic bulletin: "Diplomatic Communication Severed" (**Domain Exception**).
- Attached inside the official diplomatic folder is the technical engineer's cable diagnostic report (**Root Cause Chain**), so engineers can fix the wire while the ambassadors handle state relations.

### Why Does This Exist?
Throwing generic exceptions like `RuntimeException("error")` forces callers to inspect string messages to figure out what went wrong. Custom exceptions provide strongly-typed error semantics: callers can catch specific exceptions (`catch (InsufficientFundsException e)`) and extract domain data fields (such as `e.getShortfall()`) to drive automated business recovery.

---

## 2. Prerequisites
- **Topic 29: The Java Exception Hierarchy**
- **Topic 30: Checked vs Unchecked Exceptions**

---

## 3. Syntax Breakdown & Exception Chaining

### The Standard 4-Constructor Custom Exception Pattern
A well-behaved custom exception class should provide the standard four constructors inherited from `Exception` or `RuntimeException`:
```java
public class InsufficientFundsException extends RuntimeException {
    private final double shortfall;

    // 1. Message only
    public InsufficientFundsException(String message) {
        this(message, 0.0, null);
    }

    // 2. Message and cause (Chain)
    public InsufficientFundsException(String message, Throwable cause) {
        this(message, 0.0, cause);
    }

    // 3. Domain-specific constructor
    public InsufficientFundsException(String message, double shortfall, Throwable cause) {
        super(message, cause); // Passes cause to Throwable!
        this.shortfall = shortfall;
    }

    public double getShortfall() { return shortfall; }
}
```

### Common Exception Anti-Patterns to Eliminate
1. **Log-and-Rethrow:** Logging an exception and then immediately throwing it causes duplicate error logs across every single layer of the stack.
2. **Exception Swallowing:** `catch (Exception e) {}` hiding critical bugs.
3. **Losing Root Cause:** `throw new DomainException(e.getMessage());` without passing `e` as the cause destroys the original stack trace.

---

## 4. Runnable Code Examples

### Example 1: Exception Chaining & Root Cause Inspection
```java
// File: examples/core/CustomExceptionChainingDemo.java
public class CustomExceptionChainingDemo {

    public static class PaymentProcessingException extends Exception {
        private final String errorCode;

        public PaymentProcessingException(String message, String errorCode, Throwable cause) {
            super(message, cause); // Passes cause to Throwable constructor
            this.errorCode = errorCode;
        }

        public String getErrorCode() {
            return errorCode;
        }
    }

    public static void executePayment(double amount) throws PaymentProcessingException {
        try {
            simulatePaymentGatewayFailure();
        } catch (java.net.ConnectException ex) {
            // Exception chaining: preserve low-level network exception inside domain exception
            throw new PaymentProcessingException(
                    "Credit gateway processing failed for amount $" + amount,
                    "ERR_GATEWAY_TIMEOUT",
                    ex
            );
        }
    }

    private static void simulatePaymentGatewayFailure() throws java.net.ConnectException {
        throw new java.net.ConnectException("Connection refused by peer: 10.0.0.1:443");
    }

    public static void main(String[] args) {
        System.out.println("=== Custom Domain Exception & Root Cause Traversal ===");
        try {
            executePayment(999.0);
        } catch (PaymentProcessingException ex) {
            System.out.println("Caught Domain Exception: " + ex.getMessage());
            System.out.println("Error Code:              " + ex.getErrorCode());
            System.out.println("Underlying Root Cause:   " + ex.getCause().getClass().getName());
            System.out.println("Root Cause Detail:       " + ex.getCause().getMessage());
        }
    }
}
```

#### Expected Output
```text
=== Custom Domain Exception & Root Cause Traversal ===
Caught Domain Exception: Credit gateway processing failed for amount $999.0
Error Code:              ERR_GATEWAY_TIMEOUT
Underlying Root Cause:   java.net.ConnectException
Root Cause Detail:       Connection refused by peer: 10.0.0.1:443
```

---

### Example 2: Realistic Application (Banking Transfer Validation with Domain Exceptions)
```java
// File: examples/core/BankingTransactionValidatorApp.java
public class BankingTransactionValidatorApp {

    public static class InsufficientFundsException extends RuntimeException {
        private final double currentBalance;
        private final double attemptedAmount;

        public InsufficientFundsException(String accountId, double current, double attempted) {
            super(String.format("Account %s overdraft: current $%.2f, attempted $%.2f", accountId, current, attempted));
            this.currentBalance = current;
            this.attemptedAmount = attempted;
        }

        public double getShortfall() {
            return attemptedAmount - currentBalance;
        }
    }

    public static class AccountComplianceLockException extends RuntimeException {
        public AccountComplianceLockException(String accountId, String sanctionReason) {
            super(String.format("Account %s locked by compliance: %s", accountId, sanctionReason));
        }
    }

    public static class Account {
        private final String id;
        private double balance;
        private boolean isFrozen;

        public Account(String id, double initialBalance, boolean frozen) {
            this.id = id;
            this.balance = initialBalance;
            this.isFrozen = frozen;
        }

        public void withdraw(double amount) {
            if (isFrozen) {
                throw new AccountComplianceLockException(id, "AML Sanctions Review Pending");
            }
            if (amount > balance) {
                throw new InsufficientFundsException(id, balance, amount);
            }
            this.balance -= amount;
            System.out.printf("Successfully withdrew $%.2f from %s. Remaining: $%.2f%n", amount, id, balance);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Strongly-Typed Banking Domain Exceptions ===");

        Account activeAccount = new Account("CHK-100", 250.0, false);
        Account frozenAccount = new Account("CHK-999", 5000.0, true);

        // Test 1: Overdraft
        try {
            activeAccount.withdraw(400.0);
        } catch (InsufficientFundsException ex) {
            System.out.println("[REJECTED] " + ex.getMessage());
            System.out.printf("Overdraft Shortfall: $%.2f%n", ex.getShortfall());
        }

        // Test 2: Compliance Lockout
        try {
            frozenAccount.withdraw(100.0);
        } catch (AccountComplianceLockException ex) {
            System.out.println("[REJECTED] " + ex.getMessage());
        }
    }
}
```

#### Expected Output
```text
=== Strongly-Typed Banking Domain Exceptions ===
[REJECTED] Account CHK-100 overdraft: current $250.00, attempted $400.00
Overdraft Shortfall: $150.00
[REJECTED] Account CHK-999 locked by compliance: AML Sanctions Review Pending
```

---

## 5. Step-by-Step Execution Trace

When `executePayment(999.0)` runs:

```text
1. Low-Level Network Failure:
   - simulatePaymentGatewayFailure() throws java.net.ConnectException.

2. Catch & Chain:
   - Enclosing catch block catches ConnectException ex.
   - Instantiates PaymentProcessingException:
     - Sets message = "Credit gateway processing failed..."
     - Sets errorCode = "ERR_GATEWAY_TIMEOUT"
     - Invokes super(message, ex) -> stores 'ex' inside Throwable.cause!

3. Diagnostic Output:
   - Calling ex.getCause() retrieves the original java.net.ConnectException.
   - The original port number and line number where the socket refused connection are preserved!
```

---

## 6. Common Mistakes & Compiler Errors

### Mistake 1: Discarding the Root Cause (Stack Trace Amnesia)
```java
try {
    dao.save(entity);
} catch (SQLException e) {
    throw new ServiceException("Database save failed: " + e.getMessage()); // BUG: Lost cause!
}
```
**Why it fails:** By passing only `e.getMessage()` instead of `e` itself, the original SQL stack trace and SQL error code are completely lost.
**How to fix:** Pass the exception object as the cause parameter: `throw new ServiceException("Save failed", e);`.

### Mistake 2: The Log-and-Rethrow Anti-Pattern
```java
try {
    calculate();
} catch (Exception e) {
    log.error("Calculation failed", e); // Logged here
    throw e;                            // Rethrown! (Next layer logs again!)
}
```
**Why it is harmful:** Across a 5-tier architecture, the identical exception will be printed 5 times into the production logs, creating massive noise and clutter.
**How to fix:** Either **handle and log** the exception, OR **rethrow** it. Never do both at the same level.

---

## 7. Best Practices & When NOT to Use

### Best Practices (Do's)
1. **Extend `RuntimeException` by Default:** Most custom domain exceptions are unrecoverable by the immediate caller; making them unchecked keeps method signatures clean.
2. **Provide Domain Fields:** Attach relevant context fields (e.g. `accountId`, `orderId`, `shortfall`) to custom exceptions.
3. **End Class Names in `Exception`:** Always name custom exceptions with the `Exception` suffix (e.g. `OrderValidationException`).

### When NOT to Use
- **Do not invent custom exceptions when standard Java exceptions fit:** If an argument is null, throw `NullPointerException`. If an argument is negative or malformed, throw `IllegalArgumentException`. If an object is in an invalid state, throw `IllegalStateException`.

---

## 8. Version Notes
- **Java 1.4:** Exception chaining (`initCause()` and `Throwable(cause)` constructor) standardized.
- **Java 7:** Added `Throwable.getSuppressed()` and multi-catch support.
- **Java 14:** Added helpful NullPointerExceptions, identifying exact null components in chains.

---

## 9. Summary Cheat Sheet

| Feature | Standard Implementation | Purpose |
| :--- | :--- | :--- |
| **Custom Unchecked** | `extends RuntimeException` | Domain business errors without signature pollution |
| **Custom Checked** | `extends Exception` | Mandatory recovery contingencies |
| **Exception Chaining** | `super(msg, cause);` | Preserves original low-level stack trace |
| **Root Cause Lookup** | `ex.getCause()` | Inspects wrapped underlying exception |
| **Rule of Thumb** | Either log OR throw | Prevents log clutter and duplicate alarms |

---

## 10. Exercises with Hidden Solutions

### Exercise 1: Spot the Bug
Why does this exception wrapper lose the original stack trace?
```java
public void transfer() {
    try {
        db.commit();
    } catch (SQLException e) {
        throw new TransactionException(e.getMessage());
    }
}
```
<details>
<summary>View Solution</summary>

**Cause:** Passing `e.getMessage()` only copies the text string. The `SQLException` object itself was not passed to the constructor.
**Fix:** Define a constructor accepting `Throwable cause` and write `throw new TransactionException("Commit failed", e);`.
</details>

---

### Exercise 2: Hands-on Implementation
Write a custom unchecked exception `UserNotFoundException` that stores a `String username` field and generates a message `"User 'username' was not found in directory"`.
<details>
<summary>View Solution</summary>

```java
public class UserNotFoundException extends RuntimeException {
    private final String username;

    public UserNotFoundException(String username) {
        super(String.format("User '%s' was not found in directory", username));
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case
Can an exception be its own cause (circular causality)?
<details>
<summary>View Solution</summary>

**Answer:** No!
**Explanation:** `Throwable.initCause()` explicitly verifies that `cause != this`. If you attempt to set an exception as its own cause, the JVM throws `IllegalArgumentException: Self-causation not permitted`.
</details>

---

## 11. Official Sources & Specifications
- [Oracle Java Documentation: Chained Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/chained.html)
- [dev.java: Creating Custom Exceptions](https://dev.java/learn/exceptions/)
- [Java Language Specification §11.1.1: Asynchronous Exceptions](https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html#jls-11.1.1)
