import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class DynamicProxyLoggingApp {
    interface PaymentGateway {
        boolean processPayment(String account, double amount);
        String queryStatus(String transactionId);
    }

    static class StripePaymentGateway implements PaymentGateway {
        @Override
        public boolean processPayment(String account, double amount) {
            System.out.printf("  [Gateway Logic] Charged $%.2f to %s%n", amount, account);
            return true;
        }

        @Override
        public String queryStatus(String transactionId) {
            return "SETTLED";
        }
    }

    static class LoggingInvocationHandler implements InvocationHandler {
        private final Object target;

        LoggingInvocationHandler(Object target) {
            this.target = target;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            System.out.println("[Audit Proxy] Intercepting: " + method.getName() + "()");
            long start = System.nanoTime();
            Object result = method.invoke(target, args);
            long elapsedUs = (System.nanoTime() - start) / 1000;
            System.out.println("[Audit Proxy] Finished " + method.getName() + " in " + elapsedUs + " us. Result: " + result);
            return result;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) {
        System.out.println("Starting Dynamic Proxy Telemetry App...");

        PaymentGateway realGateway = new StripePaymentGateway();
        PaymentGateway proxiedGateway = (PaymentGateway) Proxy.newProxyInstance(
                PaymentGateway.class.getClassLoader(),
                new Class<?>[] { PaymentGateway.class },
                new LoggingInvocationHandler(realGateway)
        );

        boolean paid = proxiedGateway.processPayment("ACC-1004", 450.00);
        String status = proxiedGateway.queryStatus("TXN-9901");

        System.out.println("Main Verification -> Paid: " + paid + ", Status: " + status);
        System.out.println("Dynamic Proxy executed successfully.");
    }
}
