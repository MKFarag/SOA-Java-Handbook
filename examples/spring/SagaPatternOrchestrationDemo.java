package com.handbook.spring;

import java.util.*;

public class SagaPatternOrchestrationDemo {

    public enum SagaStep { ORDER_PENDING, PAYMENT_CAPTURED, INVENTORY_RESERVED, COMPENSATED, COMPLETED }

    public static class OrderSagaCoordinator {
        private SagaStep currentStep = SagaStep.ORDER_PENDING;

        public void runSaga(boolean simulateInventoryFailure) {
            System.out.println("  -> [SAGA START]: Order ORD-8891 initialized.");
            currentStep = SagaStep.PAYMENT_CAPTURED;
            System.out.println("  -> [Step 1 SUCCESS]: Payment captured.");

            if (simulateInventoryFailure) {
                System.out.println("  -> [Step 2 FAILURE]: Inventory allocation rejected!");
                compensate();
            } else {
                currentStep = SagaStep.INVENTORY_RESERVED;
                System.out.println("  -> [Step 2 SUCCESS]: Inventory allocated.");
                currentStep = SagaStep.COMPLETED;
            }
        }

        private void compensate() {
            System.out.println("  -> [COMPENSATION TRIGGERED]: Refunding payment & cancelling order.");
            currentStep = SagaStep.COMPENSATED;
        }

        public SagaStep getCurrentStep() { return currentStep; }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 127: Distributed Transactions & Saga Pattern ===");

        OrderSagaCoordinator coordinator = new OrderSagaCoordinator();
        coordinator.runSaga(true); // Run with failure to test compensation

        System.out.println("Final Saga terminal state: " + coordinator.getCurrentStep());

        if (coordinator.getCurrentStep() != SagaStep.COMPENSATED) {
            throw new AssertionError("Saga compensation state verification failed!");
        }

        System.out.println("Topic 127 Saga Pattern and Orchestration verified successfully.");
    }
}
