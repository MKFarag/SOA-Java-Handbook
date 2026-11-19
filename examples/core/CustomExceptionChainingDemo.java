public class CustomExceptionChainingDemo {

    // Custom root domain checked exception
    public static class PaymentProcessingException extends Exception {
        private final String errorCode;

        public PaymentProcessingException(String message, String errorCode, Throwable cause) {
            super(message, cause); // Passes cause to Throwable constructor
            this.errorCode = errorCode;
        }

        public String getErrorCode() {
            return errorCode;
        }
    }

    public static void executePayment(double amount) throws PaymentProcessingException {
        try {
            simulatePaymentGatewayFailure();
        } catch (java.net.ConnectException ex) {
            // Exception chaining: preserve low-level network exception inside domain exception
            throw new PaymentProcessingException(
                    "Credit gateway processing failed for amount $" + amount,
                    "ERR_GATEWAY_TIMEOUT",
                    ex
            );
        }
    }

    private static void simulatePaymentGatewayFailure() throws java.net.ConnectException {
        throw new java.net.ConnectException("Connection refused by peer: 10.0.0.1:443");
    }

    public static void main(String[] args) {
        System.out.println("=== Custom Domain Exception & Root Cause Traversal ===");
        try {
            executePayment(999.0);
        } catch (PaymentProcessingException ex) {
            System.out.println("Caught Domain Exception: " + ex.getMessage());
            System.out.println("Error Code:              " + ex.getErrorCode());
            System.out.println("Underlying Root Cause:   " + ex.getCause().getClass().getName());
            System.out.println("Root Cause Detail:       " + ex.getCause().getMessage());
        }
    }
}
