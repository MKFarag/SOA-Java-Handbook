public class PaymentMethodHierarchyApp {

    // Sealed payment method hierarchy
    public sealed interface PaymentMethod permits CreditCard, BankTransfer, CryptoWallet {
        double processPayment(double amount);
    }

    public record CreditCard(String cardNumber, String cvv, double feeRate) implements PaymentMethod {
        @Override
        public double processPayment(double amount) {
            double total = amount + (amount * (feeRate / 100.0));
            System.out.printf("[Credit Card: **** %s] Charged $%.2f (Fee: $%.2f)%n",
                    cardNumber.substring(cardNumber.length() - 4), total, amount * (feeRate / 100.0));
            return total;
        }
    }

    public record BankTransfer(String iban, String swiftCode) implements PaymentMethod {
        @Override
        public double processPayment(double amount) {
            System.out.printf("[ACH / Wire: %s] Settling $%.2f with zero transaction fee%n", iban, amount);
            return amount;
        }
    }

    public record CryptoWallet(String walletAddress, String tokenSymbol) implements PaymentMethod {
        @Override
        public double processPayment(double amount) {
            System.out.printf("[Crypto: %s on %s] Broadcasted transaction for $%.2f%n",
                    walletAddress, tokenSymbol, amount);
            return amount;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Exhaustive Sealed Payment Processing ===");

        PaymentMethod p1 = new CreditCard("4111222233339088", "123", 2.5);
        PaymentMethod p2 = new BankTransfer("US89000123456789", "CHASUS33");
        PaymentMethod p3 = new CryptoWallet("0x71C...4f9", "USDC");

        PaymentMethod[] batch = { p1, p2, p3 };

        for (PaymentMethod method : batch) {
            // Pattern matching switch without requiring default: because hierarchy is closed!
            String summary = switch (method) {
                case CreditCard cc -> "Card transaction executed with " + cc.feeRate() + "% fee";
                case BankTransfer bt -> "Wire initiated to IBAN " + bt.iban();
                case CryptoWallet cw -> "Crypto transaction submitted on " + cw.tokenSymbol();
            };
            method.processPayment(100.0);
            System.out.println("Summary: " + summary + "\n");
        }
    }
}
