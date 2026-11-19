public class SecurePaymentGateway {

    // Base Abstract Gateway Provider
    public static abstract class PaymentProvider {
        private final String merchantApiSecret; // Completely hidden from outside and subclasses
        protected final String gatewayEndpoint;   // Accessible to subclasses

        protected PaymentProvider(String endpoint, String secret) {
            this.gatewayEndpoint = endpoint;
            this.merchantApiSecret = secret;
        }

        // Public API contract
        public final boolean processCharge(String cardToken, double amount) {
            if (validateToken(cardToken) && amount > 0.0) {
                return executeNetworkCall(cardToken, amount, merchantApiSecret);
            }
            return false;
        }

        // Package-private helper: accessible to auditors within same package
        boolean validateToken(String token) {
            return token != null && token.startsWith("tok_");
        }

        // Protected hook for concrete vendor subclasses to implement
        protected abstract boolean executeNetworkCall(String token, double amount, String apiSecret);
    }

    public static class StripeProvider extends PaymentProvider {
        public StripeProvider(String secret) {
            super("https://api.stripe.com/v1/charges", secret);
        }

        @Override
        protected boolean executeNetworkCall(String token, double amount, String apiSecret) {
            System.out.printf("Dispatching HTTPS POST to %s with Secret Hash %d for $%.2f%n",
                    gatewayEndpoint, apiSecret.hashCode(), amount);
            return true;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Secure Payment Gateway Access Boundaries ===");
        PaymentProvider stripe = new StripeProvider("sk_live_9837429871409");

        boolean success = stripe.processCharge("tok_visa_4242", 149.99);
        System.out.println("Charge Status: " + (success ? "APPROVED" : "DECLINED"));
    }
}
