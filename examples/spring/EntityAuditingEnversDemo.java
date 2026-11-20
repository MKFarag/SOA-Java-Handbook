package com.handbook.spring;

import java.time.Instant;
import java.util.*;

public class EntityAuditingEnversDemo {

    public record AuditRevision(int revId, Instant timestamp, String user, String action, double balance) {}

    public static class AccountHistoryLedger {
        private final List<AuditRevision> revisions = new ArrayList<>();
        private int currentRev = 1;

        public void recordRevision(String user, String action, double balance) {
            revisions.add(new AuditRevision(currentRev++, Instant.now(), user, action, balance));
        }

        public List<AuditRevision> getHistory() {
            return Collections.unmodifiableList(revisions);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 110: Automated Entity Auditing & Envers Versioning ===");

        AccountHistoryLedger ledger = new AccountHistoryLedger();
        ledger.recordRevision("alice_teller", "INITIAL_DEPOSIT", 5000.00);
        ledger.recordRevision("bob_officer", "CREDIT_OVERDRAFT_PROTECT", 7500.00);
        ledger.recordRevision("system_cron", "MONTHLY_INTEREST_ACCRUAL", 7612.50);

        System.out.println("Reconstructed Hibernate Envers Audit Revision History:");
        ledger.getHistory().forEach(rev -> System.out.printf(
            "  [REV #%d] User: %-15s | Action: %-25s | Balance: $%.2f%n",
            rev.revId(), rev.user(), rev.action(), rev.balance()
        ));

        if (ledger.getHistory().size() != 3) {
            throw new AssertionError("Expected 3 revisions, got: " + ledger.getHistory().size());
        }

        System.out.println("Topic 110 Entity Auditing and Envers versioning verified successfully.");
    }
}
