package com.handbook.spring;

import java.util.*;

public class CentralizedConfigRefreshDemo {

    public static class ManagedFeatureFlagService {
        private String discountCode = "WELCOME10";
        private int refreshCount = 0;

        public void reloadConfiguration(String newDiscountCode) {
            this.discountCode = newDiscountCode;
            this.refreshCount++;
            System.out.printf("  -> [@RefreshScope Proxy]: Re-initialized discountCode to '%s' (Cycle #%d)%n",
                discountCode, refreshCount);
        }

        public String getDiscountCode() { return discountCode; }
        public int getRefreshCount() { return refreshCount; }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 122: Centralized Config Server & @RefreshScope ===");

        ManagedFeatureFlagService service = new ManagedFeatureFlagService();
        System.out.println("1. Initial active discount code: " + service.getDiscountCode());

        // Simulate Actuator /refresh triggering reload
        service.reloadConfiguration("BLACK_FRIDAY_50");
        System.out.println("2. Active discount code after dynamic refresh: " + service.getDiscountCode());

        if (!"BLACK_FRIDAY_50".equals(service.getDiscountCode()) || service.getRefreshCount() != 1) {
            throw new AssertionError("Centralized config dynamic refresh validation failed!");
        }

        System.out.println("Topic 122 Centralized Config Server and @RefreshScope verified successfully.");
    }
}
