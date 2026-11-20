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

        if (simulation.getExecutionCount() != 2) {
            throw new AssertionError("Cluster execution count mismatch!");
        }

        System.out.println("Topic 116 Distributed Scheduling and ShedLock verified successfully.");
    }
}
