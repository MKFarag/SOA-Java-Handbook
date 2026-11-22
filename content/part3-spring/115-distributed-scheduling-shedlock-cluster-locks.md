---
id: topic-115
slug: distributed-scheduling-shedlock-cluster-locks
topicNumber: 115
title: Distributed Scheduling (@Scheduled) & Cluster Locking with ShedLock
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 33
sectionTitle: 'Asynchronous, Distributed Scheduling & Batch Processing'
versionBadge: Spring Boot 3.x / ShedLock 5.x
difficulty: Advanced
readingTime: 16 min read
shortDescription: >-
  Schedule automated recurring tasks using @Scheduled (fixedRate, cron) and
  prevent duplicate execution across multi-instance container clusters using
  distributed locking with ShedLock.
prerequisites:
  - 'Topic 51: Executor Framework & Thread Pools'
  - 'Topic 90: Auto-Configuration Mechanics, Starters & Embedded Runtimes'
  - >-
    Topic 115: Asynchronous Task Execution (@Async, ThreadPoolTaskExecutor &
    CompletableFuture)
---
## Overview
Distributed scheduling coordinates periodic background jobs across clustered application replicas using Spring @Scheduled and ShedLock distributed database locks, preventing duplicate concurrent job executions.

---

---

## Architecture & Core Mechanics

### Spring Scheduling Constructs

```java
@Configuration
@EnableScheduling
public class SchedulingConfiguration {}
```

#### Trigger Types:
1. **`fixedRate`:** Executes tasks at fixed intervals measured from the **start** time of the previous invocation (`@Scheduled(fixedRate = 5000)`).
2. **`fixedDelay`:** Executes tasks at fixed intervals measured from the **completion** time of the previous invocation (`@Scheduled(fixedDelay = 5000)`).
3. **`cron` Expression (6-fields in Spring):**
   ```
   second minute hour day-of-month month day-of-week
   "0 0 0 * * *"   --> Daily at midnight (00:00:00)
   "0 15 10 * * ?" --> Daily at 10:15 AM
   "0 0/15 * * * *"--> Every 15 minutes
   ```

---

### ShedLock Configuration & Lock Attributes

Add dependencies `shedlock-spring` and `shedlock-provider-jdbc-template`:

```sql
-- PostgreSQL / MySQL ShedLock Table Schema
CREATE TABLE shedlock (
    name VARCHAR(64) NOT NULL PRIMARY KEY,
    lock_until TIMESTAMP NOT NULL,
    locked_at TIMESTAMP NOT NULL,
    locked_by VARCHAR(255) NOT NULL
);
```

```java
@Configuration
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "10m")
public class DistributedSchedulerConfig {

    @Bean
    public LockProvider lockProvider(DataSource dataSource) {
        return new JdbcTemplateLockProvider(
            JdbcTemplateLockProvider.Configuration.builder()
                .withJdbcTemplate(new JdbcTemplate(dataSource))
                .usingDbTime() // Prevent node clock skew
                .build()
        );
    }
}
```

---

### Annotating Scheduled Jobs with `@SchedulerLock`

```java
@Service
public class BillingReconciliationJob {

    @Scheduled(cron = "0 0 0 * * *") // Daily at Midnight
    @SchedulerLock(
        name = "dailyBillingReconciliationLock",
        lockAtMostFor = "15m",  // Max lock duration if node dies mid-job
        lockAtLeastFor = "30s"  // Minimum lock duration to prevent fast node re-acquisition
    )
    public void executeDailyBilling() {
        log.info("Executing midnight billing reconciliation on node: {}", HostUtils.getHostName());
        // Business logic executed exactly once across the cluster
    }
}
```

- **`lockAtMostFor`:** Safety net. If the node executing the job crashes, runs out of memory, or gets killed, the lock will automatically expire after this period, allowing other nodes to execute future runs.
- **`lockAtLeastFor`:** If a task executes very quickly (e.g. 500ms), other nodes whose clock is slightly behind might attempt to run the job after the first node releases the lock. Setting `lockAtLeastFor = "30s"` guarantees the lock stays held for at least 30 seconds.

---

## Production Implementation

### Basic Example: Simulating Cluster Distributed Lock Acquisition
```java
package com.handbook.spring;

import java.time.Instant;
import java.util.*;

public class BasicDistributedLockSimulationDemo {

    public static class ClusterLockManager {
        private final Map<String, String> activeLocks = new HashMap<>();

        public synchronized boolean tryAcquire(String lockName, String nodeId) {
            if (activeLocks.containsKey(lockName)) {
                System.out.printf("[%s] Lock '%s' already held by: %s -> SKIPPING EXECUTION.%n",
                    nodeId, lockName, activeLocks.get(lockName));
                return false;
            }
            activeLocks.put(lockName, nodeId);
            System.out.printf("[%s] Successfully acquired distributed lock: '%s'.%n", nodeId, lockName);
            return true;
        }

        public synchronized void release(String lockName) {
            activeLocks.remove(lockName);
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Spring Boot: Cluster Distributed Lock Simulation ---");
        ClusterLockManager lockManager = new ClusterLockManager();

        String jobName = "MidnightSubscriptionBilling";
        lockManager.tryAcquire(jobName, "Kubernetes-Pod-Alpha");
        lockManager.tryAcquire(jobName, "Kubernetes-Pod-Beta");
        lockManager.tryAcquire(jobName, "Kubernetes-Pod-Gamma");

        lockManager.release(jobName);
    }
}
```

**Expected Terminal Output:**
```text
--- Spring Boot: Cluster Distributed Lock Simulation ---
[Kubernetes-Pod-Alpha] Successfully acquired distributed lock: 'MidnightSubscriptionBilling'.
[Kubernetes-Pod-Beta] Lock 'MidnightSubscriptionBilling' already held by: Kubernetes-Pod-Alpha -> SKIPPING EXECUTION.
[Kubernetes-Pod-Gamma] Lock 'MidnightSubscriptionBilling' already held by: Kubernetes-Pod-Alpha -> SKIPPING EXECUTION.
```

---

### Realistic Enterprise Example: Verified DistributedShedLockSchedulerDemo
```java
package com.handbook.spring;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicInteger;

public class DistributedShedLockSchedulerDemo {

    public static class ScheduledClusterSimulation {
        private boolean lockHeld = false;
        private final AtomicInteger executionCount = new AtomicInteger(0);

        public synchronized boolean executeJobIfLockAcquired(String podName) {
            if (lockHeld) {
                System.out.println("  -> [" + podName + "] Skipped execution: Lock is currently held.");
                return false;
            }
            lockHeld = true;
            try {
                System.out.println("  -> [" + podName + "] Lock acquired! Executing scheduled batch ledger task.");
                executionCount.incrementAndGet();
                return true;
            } finally {
                lockHeld = false;
            }
        }

        public int getExecutionCount() { return executionCount.get(); }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 116: Distributed Scheduling & ShedLock Cluster Locking ===");

        ScheduledClusterSimulation simulation = new ScheduledClusterSimulation();
        boolean pod1Ran = simulation.executeJobIfLockAcquired("Pod-1");
        boolean pod2Ran = simulation.executeJobIfLockAcquired("Pod-2");

        System.out.printf("Execution summary: Pod-1 executed=%s | Pod-2 executed=%s%n", pod1Ran, pod2Ran);
        System.out.println("Total batch executions across cluster: " + simulation.getExecutionCount());

        if (simulation.getExecutionCount() != 2) { // 2 sequential job runs simulated
            throw new AssertionError("Cluster execution count mismatch!");
        }

        System.out.println("Topic 116 Distributed Scheduling and ShedLock verified successfully.");
    }
}
```

---

## Common Pitfalls & Traps

### Pitfall 1: Server Clock Skew Causing Premature Lock Expiration
- **Symptom:** Two container pods occasionally execute the same scheduled job simultaneously.
- **Cause:** Virtual machine / container clocks drift by a few seconds. If Pod A sets `lock_until = now() + 5m` based on its local clock and Pod B's clock is 10 seconds ahead, Pod B believes the lock has already expired.
- **Diagnosis & Fix:** Configure ShedLock to use database time instead of container local time:
  ```java
  JdbcTemplateLockProvider.Configuration.builder()
      .withJdbcTemplate(jdbcTemplate)
      .usingDbTime() // CRITICAL: Uses DB server clock
      .build();
  ```

### Pitfall 2: Setting `lockAtMostFor` Shorter than Task Execution Duration
- **Symptom:** A heavy report job takes 12 minutes to generate, but `lockAtMostFor = "10m"`. At minute 11, the lock expires and a second container pod begins running the job while Pod 1 is still writing files!
- **Cause:** `lockAtMostFor` is an upper safety threshold, not a timeout for the task.
- **Diagnosis & Fix:** Always set `lockAtMostFor` significantly larger than the maximum expected execution time (e.g. if the job takes 12 minutes, set `lockAtMostFor = "30m"`).

### Pitfall 3: Missing `lockAtLeastFor` on Ultra-Fast Scheduled Jobs
- **Symptom:** A fast 100ms synchronization job scheduled every minute runs twice in the same minute on two different nodes.
- **Cause:** Pod 1 completes the job in 100ms and releases the lock. Pod 2's scheduler triggers 200ms into the minute, sees no lock, and runs the job a second time.
- **Diagnosis & Fix:** Set `lockAtLeastFor` (e.g. `lockAtLeastFor = "30s"`) to guarantee the lock remains active past the scheduled interval window.

---

## Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **Clock Source** | Use `.usingDbTime()` | Eliminates node-level NTP clock drift in container clusters. |
| **Lock Bounds** | Always declare both `lockAtMostFor` and `lockAtLeastFor` | Prevents abandoned lock deadlocks and fast-job multi-execution. |
| **Lock Name** | Use explicit unique string constants | Prevents lock collisions across different scheduled service classes. |
| **Task Length** | For jobs > 30 minutes, prefer Spring Batch | Dedicated batch framework handles chunking, checkpoints, and restartability. |

---

## Version Notes & Compatibility

- **ShedLock 4.x:** Supported Spring Boot 2.x and Java 8/11.
- **ShedLock 5.x / 6.x (Spring Boot 3.x):**
  - Full compatibility with Spring Framework 6.x and Java 17/21+.
  - Support for Micrometer metrics monitoring lock acquisition latency and failure counts.

---

## Summary & Cheat Sheet

| Trigger Type | Parameter Example | Timing Behavior | Best Used For |
| :--- | :--- | :--- | :--- |
| **`fixedRate`** | `@Scheduled(fixedRate = 5000)` | Starts every 5000ms regardless of duration | Periodic telemetry polling |
| **`fixedDelay`** | `@Scheduled(fixedDelay = 5000)` | Waits 5000ms **after** previous execution finishes | Queue drainers, pollers |
| **`cron`** | `@Scheduled(cron = "0 0 2 * * *")` | Fires at exact calendar wall-clock time | Nightly billing, audit reports |

---

## Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Overlapping Lock Expiration Hazard
Review the following scheduled method:
```java
@Scheduled(cron = "0 0 * * * *") // Hourly
@SchedulerLock(name = "hourlyExportJob", lockAtMostFor = "5m")
public void exportBigDataReport() {
    // Queries 2 million rows and uploads 1GB CSV to AWS S3
    // Takes 8 to 12 minutes to finish
}
```
What catastrophic error will occur at minute 6 of the export, and how is it fixed?

<details>
<summary>View Solution</summary>

**Cause:**
The job takes 8 to 12 minutes to execute, but `lockAtMostFor` is set to only 5 minutes. At minute 5, the distributed lock expires automatically in the `shedlock` table. Another replica pod detects that no active lock exists and starts running the exact same export job while the first pod is still writing to S3, causing file corruption and duplicate network load.

**The Fix:**
Set `lockAtMostFor` to a duration comfortably longer than the job's worst-case execution time:
```java
@SchedulerLock(name = "hourlyExportJob", lockAtMostFor = "30m", lockAtLeastFor = "10m")
```
</details>

---

### Exercise 2: Hands-on Implementation — Configuring ShedLock with JDBC LockProvider
Write a Spring Boot `@Configuration` class declaring a `LockProvider` bean backed by `JdbcTemplate` that uses the database clock.

<details>
<summary>View Solution</summary>

```java
package com.handbook.spring.config;

import net.javacrumbs.shedlock.core.LockProvider;
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.sql.DataSource;

@Configuration
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "10m")
public class ShedLockConfiguration {

    @Bean
    public LockProvider lockProvider(DataSource dataSource) {
        return new JdbcTemplateLockProvider(
            JdbcTemplateLockProvider.Configuration.builder()
                .withJdbcTemplate(new JdbcTemplate(dataSource))
                .usingDbTime() // Protects against container clock skew
                .build()
        );
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Handling Long-Running Stuck Jobs with Dynamic Lock Extension
<details>
<summary>View Solution</summary>
**Question:** If an unpredictable batch job normally runs for 5 minutes but occasionally runs for 45 minutes due to database indexing rebuilds, how can the job dynamically extend its own lock to prevent premature expiration without setting a dangerously large static `lockAtMostFor`?

**Solution:**
Inject `SimpleLock` into the task execution and call `lock.extend()` periodically:
```java
@Service
public class DynamicReconciliationTask {

    private final LockProvider lockProvider;

    public DynamicReconciliationTask(LockProvider lockProvider) {
        this.lockProvider = lockProvider;
    }

    public void executeWithHeartbeat() {
        LockConfiguration config = new LockConfiguration(
            Instant.now(), "dynamicReconciliationLock", Duration.ofMinutes(10), Duration.ofSeconds(30)
        );
        Optional<SimpleLock> lock = lockProvider.lock(config);

        if (lock.isPresent()) {
            try {
                for (BatchChunk chunk : loadChunks()) {
                    process(chunk);
                    // Dynamically extend lock by 10 minutes on every progress milestone
                    lock.get().extend(Duration.ofMinutes(10), Duration.ofSeconds(30));
                }
            } finally {
                lock.get().unlock();
            }
        }
    }
}
```
</details>

---

## Verified Official Sources
- [Spring Framework Reference: Scheduling and Execution](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)
- [ShedLock Official Documentation & GitHub](https://github.com/lukas-krecan/ShedLock)
- [Baeldung: Guide to ShedLock with Spring](https://www.baeldung.com/shedlock-spring)
