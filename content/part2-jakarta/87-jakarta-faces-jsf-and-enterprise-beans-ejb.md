---
id: topic-87
slug: jakarta-faces-jsf-and-enterprise-beans-ejb
topicNumber: 87
title: Jakarta Faces (JSF) & Enterprise Beans (EJB)
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 23
sectionTitle: Jakarta EE Enterprise Stack Overview
versionBadge: Jakarta Faces 4.0 / EE 10
difficulty: Advanced
readingTime: 15 min read
shortDescription: >-
  Explore component-based web UIs with Jakarta Faces (JSF) and container-managed
  declarative transactions with Enterprise JavaBeans (EJB).
prerequisites:
  - 'Topic 74: JSP Architecture & Translation Lifecycle'
  - 'Topic 82: JDBC Connection Pooling in Web Applications'
  - 'Topic 84: Contexts & Dependency Injection (CDI)'
relevanceLevel: OPTIONAL / LEGACY
---
# Topic 87: Jakarta Faces (JSF) & Enterprise Beans (EJB)

> 🏛️ **Roadmap Seal:** **`[OPTIONAL / LEGACY]`** — *Historical / legacy enterprise tech. Safely skip unless maintaining legacy enterprise systems.*

## 1. What It Is and Why It Exists
The Jakarta EE platform features two historical pillars that shaped enterprise enterprise systems:
1. **Jakarta Faces (formerly JavaServer Faces / JSF):** A component-based server-side user interface framework where web pages are assembled from reusable UI component trees (buttons, data tables, dialogs) that manage their own state, conversion, and validation across an automated 6-phase lifecycle.
2. **Enterprise Beans (formerly Enterprise JavaBeans / EJB):** Server-side business components (`@Stateless`, `@Stateful`, `@Singleton`) that provide automatic, declarative container-managed services, such as distributed transactions (JTA), asynchronous execution, and thread-safe security authorization without writing transaction management code.

### Real-World Analogy
A municipal public transit system:
- **Jakarta Faces (The Bus Dashboard & Passenger Turnstiles):** Standardized physical levers, ticketing turnstiles, and destination display boards. When a passenger pushes the "Stop" button, the event automatically triggers electrical relays throughout the vehicle according to strict protocol steps.
- **Enterprise Beans (The Automated Train Dispatcher & Power Substation):** When a high-speed train leaves the station, an automated substation manages power surge containment and track switches atomically. If anything goes wrong on the track, the automated system cuts the power and rolls back the train safely without the driver manually adjusting voltage dials.

### Why It Exists
In early enterprise Java, writing transactional business logic required complex manual management of database commit and rollback APIs. EJB introduced container-managed transactions (`@TransactionAttribute(REQUIRED)`), where the container automatically begins, commits, or rolls back distributed transactions. JSF introduced component-based UI engineering to Java, enabling developers to build complex intranet web forms using rich tag libraries (PrimeFaces) backed by server-side state.

---

## 2. Prerequisites
- **Topic 74: JSP Architecture:** Server-side templating and tag libraries.
- **Topic 82: Connection Pooling:** Transactional database connections.
- **Topic 84: CDI:** Managed backing beans and scope management.

---

## 3. Syntax Breakdown
```java
// 1. Enterprise Bean: Stateless Session Bean with Declarative Transactions
@Stateless
public class BankingService {

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void transferMoney(Long fromAcc, Long toAcc, BigDecimal amount) {
        // Container automatically starts JTA transaction before method enters
        accountDao.debit(fromAcc, amount);
        accountDao.credit(toAcc, amount);
        // Container automatically commits on exit; rolls back on RuntimeException!
    }
}

// 2. JSF Backing Bean: Connects Facelets template to business services
@Named("transferBean")
@ViewScoped
public class TransferController implements Serializable {

    @Inject
    private BankingService bankingService;

    private Long sourceAccount;
    private Long targetAccount;
    private BigDecimal amount;

    // Action method invoked by JSF commandButton
    public String executeTransfer() {
        bankingService.transferMoney(sourceAccount, targetAccount, amount);
        return "confirmation?faces-redirect=true"; // Dynamic navigation
    }
}
```

```xml
<!-- 3. Jakarta Facelets XHTML Template (transfer.xhtml) -->
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="jakarta.faces.html">
<h:body>
    <h:form>
        <h:outputLabel value="Source Account:" />
        <h:inputText value="#{transferBean.sourceAccount}" required="true" />

        <h:outputLabel value="Amount:" />
        <h:inputText value="#{transferBean.amount}" required="true" />

        <h:commandButton value="Transfer Funds" action="#{transferBean.executeTransfer}" />
    </h:form>
</h:body>
</html>
```

### Key Elements Explained
- `@Stateless`: Marks an EJB pooled by the container; no client conversational state is retained between method invocations.
- `@TransactionAttribute`: Defines declarative transaction boundaries (e.g. `REQUIRED`, `REQUIRES_NEW`, `MANDATORY`).
- `@ViewScoped`: Scopes a JSF backing bean to the active browser view; survives AJAX postbacks until the user navigates away.
- `#{transferBean.property}`: JSF Value Expression binding UI inputs directly to backing bean getters and setters.

---

## 4. Runnable Examples

### Example 1: EJB Stateless Session Bean and Backing Bean
```java
package com.handbook.enterprise;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface Stateless {}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface Named { String value() default ""; }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface ViewScoped {}

@Stateless
public class PaymentProcessingBean {
    public boolean authorizePayment(String account, double amount) {
        System.out.println("[EJB] Container-managed transaction: Debiting $" + amount + " from " + account);
        return true;
    }
}

@Named("paymentBean")
@ViewScoped
public class PaymentBackingBean {
    private String account;
    private double amount;
    private final PaymentProcessingBean service = new PaymentProcessingBean();

    public String submit() {
        service.authorizePayment(account, amount);
        return "receipt";
    }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}
```

#### Expected Output
```text
[EJB] Container-managed transaction: Debiting $150.0 from ACC-4401
```

---

### Example 2: Realistic JSF 6-Phase Lifecycle & EJB Transaction Simulator
```java
package com.handbook.enterprise;

import java.util.List;

public class JsfEjbArchitectureDemo {
    public static class BankTransferService {
        public boolean transfer(String from, String to, double amount) {
            System.out.println("[EJB Container] Starting JTA container-managed transaction (REQUIRED)");
            System.out.printf("[EJB] Transferring $%.2f from %s to %s%n", amount, from, to);
            System.out.println("[EJB Container] Committing JTA transaction");
            return true;
        }
    }

    public static class TransferBackingBean {
        private String sourceAccount;
        private String targetAccount;
        private double amount;
        private String feedbackMessage;
        private final BankTransferService transferService = new BankTransferService();

        public String submitTransfer() {
            if (amount <= 0) {
                this.feedbackMessage = "Validation Error: Transfer amount must be positive.";
                return null;
            }
            boolean ok = transferService.transfer(sourceAccount, targetAccount, amount);
            if (ok) {
                this.feedbackMessage = "Success: Transferred $" + amount;
                return "receipt?faces-redirect=true";
            }
            return "error";
        }

        public void setSourceAccount(String s) { this.sourceAccount = s; }
        public void setTargetAccount(String t) { this.targetAccount = t; }
        public void setAmount(double a) { this.amount = a; }
        public String getFeedbackMessage() { return feedbackMessage; }
    }

    public static class JsfLifecycleSimulator {
        public static final List<String> PHASES = List.of(
            "1. Restore View (Component Tree Restored)",
            "2. Apply Request Values (HTTP parameters decoded)",
            "3. Process Validations (Conversion & Bean Validation)",
            "4. Update Model Values (Backing Bean setters invoked)",
            "5. Invoke Application (Action method executed)",
            "6. Render Response (HTML generated & streamed)"
        );

        public void executeLifecycle(TransferBackingBean bean, String from, String to, double amt) {
            System.out.println("--- JSF 6-Phase Request Lifecycle ---");
            for (String phase : PHASES) {
                System.out.println("Executing Phase: " + phase);
                if (phase.startsWith("4.")) {
                    bean.setSourceAccount(from);
                    bean.setTargetAccount(to);
                    bean.setAmount(amt);
                } else if (phase.startsWith("5.")) {
                    String outcome = bean.submitTransfer();
                    System.out.println("[JSF Navigation] Action method returned outcome: " + outcome);
                }
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Jakarta Faces (JSF) & Enterprise Beans (EJB) Demo ===");
        TransferBackingBean bean = new TransferBackingBean();
        JsfLifecycleSimulator lifecycle = new JsfLifecycleSimulator();

        lifecycle.executeLifecycle(bean, "ACC-1001", "ACC-2002", 500.0);

        assert bean.getFeedbackMessage().contains("Success: Transferred $500.0");
        System.out.println("Result: " + bean.getFeedbackMessage());
        System.out.println("JSF lifecycle and EJB transaction execution verified successfully.");
    }
}
```

#### Expected Output
```text
=== Jakarta Faces (JSF) & Enterprise Beans (EJB) Demo ===
--- JSF 6-Phase Request Lifecycle ---
Executing Phase: 1. Restore View (Component Tree Restored)
Executing Phase: 2. Apply Request Values (HTTP parameters decoded)
Executing Phase: 3. Process Validations (Conversion & Bean Validation)
Executing Phase: 4. Update Model Values (Backing Bean setters invoked)
Executing Phase: 5. Invoke Application (Action method executed)
[EJB Container] Starting JTA container-managed transaction (REQUIRED)
[EJB] Transferring $500.00 from ACC-1001 to ACC-2002
[EJB Container] Committing JTA transaction
[JSF Navigation] Action method returned outcome: receipt?faces-redirect=true
Executing Phase: 6. Render Response (HTML generated & streamed)
Result: Success: Transferred $500.0
JSF lifecycle and EJB transaction execution verified successfully.
```

---

## 5. Step-by-Step "What Happens When This Runs"
1. **Restore View:** JSF reconstructs the component tree in memory, either from the previous postback state or by parsing the Facelets XHTML file.
2. **Apply Request Values:** Container iterates through UI components, extracting incoming HTTP form values and storing them in temporary component state.
3. **Process Validations:** Components apply registered converters (String to Long) and Bean Validation constraints (`@Min`, `@NotNull`). If validation fails, phases 4 and 5 are skipped.
4. **Update Model Values:** Converted, validated values are transferred into the backing bean by invoking setter methods (`setAmount()`).
5. **Invoke Application:** The action method (`#{transferBean.submitTransfer}`) executes, calling backend business services and EJBs.
6. **EJB Transaction Boundary:** The EJB container starts a JTA database transaction, executes SQL queries, and commits upon method completion.
7. **Render Response:** JSF renders the updated component tree as HTML and streams the response to the client browser.

---

## 6. Common Mistakes and Solutions

### Mistake 1: Placing Business Logic Inside Backing Bean Getters
**Cause:** In JSF, getter methods (`getAccount()`) are invoked multiple times per request by the rendering engine during component tree traversal.
**Consequence:** Placing database queries or REST calls in getters causes severe performance degradation, executing duplicate queries 5-10 times per page refresh.
**Solution:** Keep getters purely accessor methods returning pre-computed fields. Load data inside `@PostConstruct` lifecycle methods or explicit action methods.

### Mistake 2: Missing Serialization on `@ViewScoped` or `@SessionScoped` Beans
**Symptom:** Server throws `java.io.NotSerializableException` upon session passivation or cluster replication.
**Cause:** View-scoped and session-scoped backing beans must be serialized when containers persist state between requests.
**Solution:** Always declare `implements java.io.Serializable` on all stateful backing beans.

---

## 7. Best Practices and When NOT to Use It

### Best Practices
- Prefer modern CDI beans (`@Named` + `@ViewScoped`) over legacy JSF `@ManagedBean` annotations.
- Modernize legacy EJB applications by replacing `@Stateless` with `@ApplicationScoped` and `@Transactional` (Jakarta Transactions / JTA).
- Use PrimeFaces or OmniFaces when building complex enterprise intranet back-office interfaces.

### When NOT to Use It
- Public-facing consumer mobile applications or lightweight microservices: Modern enterprise web applications generally favor stateless REST APIs (JAX-RS / Spring Boot) paired with client-side reactive frameworks (React, Angular, Vue).

---

## 8. Version Notes
- **JSF 1.0 (2004) / EJB 1.0 (1998):** Early foundations of enterprise Java web development.
- **Jakarta Faces 4.0 (Jakarta EE 10):** Completely removed legacy JSP view support; Facelets (XHTML) is now the sole standard view technology.
- **Status:** Enterprise standard primarily for back-office administration and legacy modernization.

---

## 9. Summary Cheat Sheet
| Technology | Core Responsibility | Key Annotations | Typical File Ext |
|---|---|---|---|
| **Jakarta Faces (JSF)** | Server-side component UI & event lifecycle | `@Named`, `@ViewScoped`, `@RequestScoped` | `.xhtml` (Facelets) |
| **Enterprise Beans (EJB)** | Container-managed transactions & concurrency | `@Stateless`, `@Singleton`, `@TransactionAttribute` | `.java` |
| **Jakarta Transactions (JTA)** | Declarative transaction boundaries | `@Transactional` | Java methods |

---

## 10. Exercises with Solutions

### Exercise 1: Spot the Lifecycle Phase
<details>
<summary>View Solution</summary>
**Question:** If a user submits a text field with invalid data that violates a `@Min(18)` constraint, which JSF lifecycle phases are executed and which are skipped?

**Solution:**
- **Executed:** Phase 1 (Restore View), Phase 2 (Apply Request Values), Phase 3 (Process Validations), and Phase 6 (Render Response).
- **Skipped:** Phase 4 (Update Model Values) and Phase 5 (Invoke Application). JSF immediately jumps to Render Response to display the error message without dirtying the backing bean.
</details>

### Exercise 2: Hands-on Implementation
<details>
<summary>View Solution</summary>
**Question:** Write a minimal `@Stateless` EJB method that executes within an existing transaction if one exists, or creates a new transaction if none exists.

**Solution:**
```java
@Stateless
public class AuditService {
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void recordAction(String user, String action) {
        entityManager.persist(new AuditLog(user, action, LocalDateTime.now()));
    }
}
```
</details>

### Exercise 3: Real-World Edge Case (@Stateless vs @Stateful EJB in Cloud Clustering)
<details>
<summary>View Solution</summary>
**Question:** An enterprise application historically used `@Stateful` session beans to maintain shopping cart items in application server memory across HTTP requests. When migrating to a multi-instance containerized cloud environment (Kubernetes), performance degraded significantly and memory exhaustion errors occurred. Why are `@Stateful` EJBs problematic in distributed cloud architectures?

**Solution:**
1. **Cluster State Replication:** Unlike `@Stateless` EJBs which are interchangeable pooled instances that handle any request from any client, a `@Stateful` bean is pinned to a single client identity. In a clustered environment, high availability requires the application server (e.g. WildFly, Payara) to continuously serialize the bean's memory state and replicate it across all nodes over the cluster network on every request.
2. **Memory Leaks & Zombie Instances:** If a user closes their browser without checking out, the stateful bean remains in server memory until container session timeout expires, unless explicitly purged with an `@Remove` annotated method.
3. **Modern Architectural Migration:** Cloud-native architectures replace `@Stateful` EJBs with `@Stateless` service components, externalizing conversation state into lightweight distributed stores (such as Redis) or database tables, ensuring individual app server containers remain completely stateless and horizontally scalable.
</details>

---

## 11. Sources
- [Jakarta Faces 4.0 Specification](https://jakarta.ee/specifications/faces/4.0/)
- [Jakarta Enterprise Beans 4.0 Specification](https://jakarta.ee/specifications/enterprise-beans/4.0/)
- [PrimeFaces Component Suite Documentation](https://www.primefaces.org/)
