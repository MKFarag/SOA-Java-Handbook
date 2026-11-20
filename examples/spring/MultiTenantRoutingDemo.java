package com.handbook.spring;

import java.util.*;

public class MultiTenantRoutingDemo {

    public record TenantAccount(String tenantId, String accountNumber, double balance) {}

    public static class TenantRoutingEngine {
        private final Map<String, List<TenantAccount>> databaseClusters = new HashMap<>();

        public void registerDatabase(String tenantId, List<TenantAccount> accounts) {
            databaseClusters.put(tenantId, accounts);
        }

        public List<TenantAccount> queryAccountsForTenant(String tenantId) {
            List<TenantAccount> accounts = databaseClusters.get(tenantId);
            if (accounts == null) {
                throw new IllegalStateException("Access Denied: Unrecognized tenant ID: " + tenantId);
            }
            return accounts;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 111: Multi-Tenancy Architecture & Routing DataSource ===");

        TenantRoutingEngine engine = new TenantRoutingEngine();
        engine.registerDatabase("TENANT-ACME", List.of(
            new TenantAccount("TENANT-ACME", "ACME-01", 150000.00),
            new TenantAccount("TENANT-ACME", "ACME-02", 45000.00)
        ));
        engine.registerDatabase("TENANT-STARK", List.of(
            new TenantAccount("TENANT-STARK", "STARK-99", 9800000.00)
        ));

        System.out.println("Switching context to TENANT-ACME:");
        List<TenantAccount> acmeAccounts = engine.queryAccountsForTenant("TENANT-ACME");
        acmeAccounts.forEach(a -> System.out.println("  -> " + a.accountNumber() + ": $" + a.balance()));

        System.out.println("Switching context to TENANT-STARK:");
        List<TenantAccount> starkAccounts = engine.queryAccountsForTenant("TENANT-STARK");
        starkAccounts.forEach(a -> System.out.println("  -> " + a.accountNumber() + ": $" + a.balance()));

        if (acmeAccounts.size() != 2 || starkAccounts.size() != 1) {
            throw new AssertionError("Multi-tenant isolation validation failed!");
        }

        System.out.println("Topic 111 Multi-Tenancy Architecture and Routing DataSource verified successfully.");
    }
}
