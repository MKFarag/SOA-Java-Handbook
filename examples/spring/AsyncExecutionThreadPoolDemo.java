package com.handbook.spring;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class AsyncExecutionThreadPoolDemo {

    public static class ResilientTaskDispatcher {
        private final ThreadPoolExecutor executor;
        private final AtomicInteger completedCount = new AtomicInteger(0);

        public ResilientTaskDispatcher(int core, int max, int queueCapacity) {
            this.executor = new ThreadPoolExecutor(
                core, max, 60L, TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(queueCapacity),
                new ThreadPoolExecutor.CallerRunsPolicy()
            );
        }

        public void submitTask(String taskId) {
            executor.submit(() -> {
                completedCount.incrementAndGet();
                System.out.printf("  -> Executed Task: %s on Thread: %s%n", 
                    taskId, Thread.currentThread().getName());
            });
        }

        public int getCompletedCount() { return completedCount.get(); }
        public void shutdown() { executor.shutdown(); }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Topic 115: Asynchronous Task Execution & ThreadPool Tuning ===");

        ResilientTaskDispatcher dispatcher = new ResilientTaskDispatcher(2, 4, 10);
        for (int i = 1; i <= 5; i++) {
            dispatcher.submitTask("ORDER_INVOICE_JOB_" + i);
        }

        Thread.sleep(150);
        System.out.println("Total background tasks completed: " + dispatcher.getCompletedCount());

        if (dispatcher.getCompletedCount() != 5) {
            throw new AssertionError("Not all asynchronous tasks completed successfully!");
        }

        dispatcher.shutdown();
        System.out.println("Topic 115 Asynchronous Task Execution verified successfully.");
    }
}
