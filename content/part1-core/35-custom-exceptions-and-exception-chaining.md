---
id: topic-35
slug: custom-exceptions-and-exception-chaining
topicNumber: 35
title: Custom Exceptions & Exception Chaining
part: 'Part 1: Java Core'
sectionNumber: 9
sectionTitle: Exception Handling
versionBadge: Java 8+
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Domain exception modeling, extending Exception vs RuntimeException, root cause preservation via Throwable(cause), and anti-pattern prevention (log-and-throw).
prerequisites:
  - 'Topic 32: The Java Exception Hierarchy'
  - 'Topic 33: Checked vs Unchecked Exceptions'
---

## Overview
Custom exceptions represent domain-specific business failures (e.g. `AccountLockedException`, `OrderNotFoundException`) with structured context fields. Exception chaining wraps low-level infrastructure failures within high-level domain exceptions while preserving the original root cause stack trace via `Throwable.getCause()`.

---

## The 4 Canonical Exception Constructors

A standard custom exception should implement the four constructors inherited from `java.lang.Throwable`:

```java
public class PaymentProcessingException extends RuntimeException {
    private final String transactionId;

    // 1. Message only
    public PaymentProcessingException(String message) {
        this(message, null, null);
    }

    // 2. Message and cause (Chaining constructor)
    public PaymentProcessingException(String message, Throwable cause) {
        this(message, null, cause);
    }

    // 3. Cause only
    public PaymentProcessingException(Throwable cause) {
        this(null, null, cause);
    }

    // 4. Domain-specific constructor with custom state
    public PaymentProcessingException(String message, String transactionId, Throwable cause) {
        super(message, cause); // Stores cause in Throwable.cause field
        this.transactionId = transactionId;
    }

    public String getTransactionId() {
        return transactionId;
    }
}
```

---

## Root Cause Preservation Chaining Architecture

```
 Low-Level Network Driver: java.net.ConnectException: Connection refused
                             │
                             ▼ (Caught by Repository layer)
 Wrapped in Domain Layer: throw new PaymentProcessingException("Gateway unreachable", cause);
                             │
                             ▼ (Traversed by Logging / Exception Handler)
 topException.getMessage()   ──► "Gateway unreachable"
 topException.getCause()     ──► java.net.ConnectException: Connection refused
```

If the cause is omitted in `super(message)`, the root cause stack trace is obliterated, concealing the underlying hardware or SQL error.

---

## Implementation Example

```java
import java.io.IOException;

public class DomainExceptionChainingDemo {
    public static class ResourceUnavailableException extends RuntimeException {
        private final String resourceId;
        private final int httpStatusCode;

        public ResourceUnavailableException(String message, String resourceId, int httpStatusCode, Throwable cause) {
            super(message, cause);
            this.resourceId = resourceId;
            this.httpStatusCode = httpStatusCode;
        }

        public String getResourceId() { return resourceId; }
        public int getHttpStatusCode() { return httpStatusCode; }
    }

    public static void connectToCluster(String clusterId) throws IOException {
        // Simulating low-level socket failure
        throw new IOException("TCP Handshake timeout after 5000ms");
    }

    public static void initializeCluster(String clusterId) {
        try {
            connectToCluster(clusterId);
        } catch (IOException ex) {
            // Wrapping low-level IOException inside high-level domain exception with preserved cause
            throw new ResourceUnavailableException(
                "Failed to initialize storage cluster: " + clusterId,
                clusterId,
                503,
                ex
            );
        }
    }

    public static void main(String[] args) {
        try {
            initializeCluster("cluster-eu-west");
        } catch (ResourceUnavailableException ex) {
            System.err.printf("Domain Error [%d]: %s (Resource: %s)%n",
                    ex.getHttpStatusCode(), ex.getMessage(), ex.getResourceId());
            System.err.println("Root Cause Class : " + ex.getCause().getClass().getName());
            System.err.println("Root Cause Detail: " + ex.getCause().getMessage());
        }
    }
}
```

### Execution Output:
```text
Domain Error [503]: Failed to initialize storage cluster: cluster-eu-west (Resource: cluster-eu-west)
Root Cause Class : java.io.IOException
Root Cause Detail: TCP Handshake timeout after 5000ms
```

---

## Pitfalls

- **The "Log-and-Throw" Anti-Pattern:** Logging an exception and then immediately re-throwing it (`log.error("Failed", e); throw e;`) causes duplicate stack traces to flood logs at every layer of the call stack. Either handle the exception completely by logging it, or propagate it up the stack.
- **Throwing Generic `RuntimeException` Everywhere:** Throwing raw `new RuntimeException("failed")` prevents callers from selectively catching distinct business errors, forcing brittle string parsing.
- **Extending `Throwable` or `Error`:** Custom business exceptions must always subclass `Exception` (for checked) or `RuntimeException` (for unchecked), never `Throwable` or `Error`.
- **Losing the Cause in Wrapper Exceptions:** Calling `throw new CustomException(e.getMessage());` passes only the string message, discarding the original stack trace. Always pass the exception instance `e`.

---

## Practice

### Question
What is the consequence of executing `throw new CustomException(e.getMessage());` instead of `throw new CustomException(e.getMessage(), e);`?

### Explanation
1. Passing only `e.getMessage()` invokes the single-string constructor `CustomException(String message)`.
2. The `cause` reference inside `Throwable` remains initialized to `null`.
3. When the stack trace is logged or printed, the chained `Caused by:` section detailing the original exception's line numbers and type is completely lost.
4. Passing `(e.getMessage(), e)` preserves the full causal graph.
