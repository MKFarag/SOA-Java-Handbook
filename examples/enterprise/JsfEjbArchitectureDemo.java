package com.handbook.enterprise;

import java.lang.annotation.*;
import java.util.ArrayList;
import java.util.List;

// JSF and EJB Meta-annotations emulation for standalone reference execution
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface Stateless {}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface Named { String value() default ""; }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface ViewScoped {}

public class JsfEjbArchitectureDemo {

    // 1. Enterprise JavaBean (EJB): Stateless Session Bean managing declarative transactions
    @Stateless
    public static class BankTransferService {
        public boolean transfer(String fromAccount, String toAccount, double amount) {
            System.out.println("[EJB Container] Starting JTA container-managed transaction (REQUIRED)");
            System.out.printf("[EJB] Transferring $%.2f from %s to %s%n", amount, fromAccount, toAccount);
            // Simulated business debit/credit
            System.out.println("[EJB Container] Committing JTA transaction");
            return true;
        }
    }

    // 2. JSF Backing Bean: Connects HTML view components to backend enterprise services
    @Named("transferBean")
    @ViewScoped
    public static class TransferBackingBean {
        private String sourceAccount;
        private String targetAccount;
        private double amount;
        private String feedbackMessage;

        private final BankTransferService transferService = new BankTransferService();

        // JSF Action Method invoked by <h:commandButton action="#{transferBean.submitTransfer}" />
        public String submitTransfer() {
            if (amount <= 0) {
                this.feedbackMessage = "Validation Error: Transfer amount must be positive.";
                return null; // Stay on same view
            }
            boolean ok = transferService.transfer(sourceAccount, targetAccount, amount);
            if (ok) {
                this.feedbackMessage = "Success: Transferred $" + amount;
                return "receipt?faces-redirect=true"; // Navigate to receipt view
            }
            return "error";
        }

        public String getSourceAccount() { return sourceAccount; }
        public void setSourceAccount(String sourceAccount) { this.sourceAccount = sourceAccount; }

        public String getTargetAccount() { return targetAccount; }
        public void setTargetAccount(String targetAccount) { this.targetAccount = targetAccount; }

        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }

        public String getFeedbackMessage() { return feedbackMessage; }
    }

    // 3. JSF Request Lifecycle Simulator
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

        // Simulate complete JSF postback request lifecycle
        lifecycle.executeLifecycle(bean, "ACC-1001", "ACC-2002", 500.0);

        assert bean.getFeedbackMessage().contains("Success: Transferred $500.0");
        System.out.println("Result: " + bean.getFeedbackMessage());
        System.out.println("JSF lifecycle and EJB transaction execution verified successfully.");
    }
}
