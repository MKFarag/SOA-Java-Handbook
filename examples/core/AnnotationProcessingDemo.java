import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

public class AnnotationProcessingDemo {
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    @interface AuditLog {
        String action();
        int severity() default 1;
    }

    static class BillingService {
        @AuditLog(action = "PROCESS_CREDIT_CARD", severity = 3)
        public void charge(String card, double amount) {
            System.out.printf("  Executing charge: card=****%s, amount=$%.2f%n",
                    card.substring(card.length() - 4), amount);
        }

        public void ping() {
            System.out.println("  Ping service active.");
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Runtime Annotation Reflection Processing ===");
        BillingService service = new BillingService();
        Class<?> clazz = service.getClass();

        for (Method method : clazz.getDeclaredMethods()) {
            if (method.isAnnotationPresent(AuditLog.class)) {
                AuditLog annotation = method.getAnnotation(AuditLog.class);
                System.out.printf("Intercepted Annotated Method [%s]: action='%s', severity=%d%n",
                        method.getName(), annotation.action(), annotation.severity());
                method.invoke(service, "4111222233334444", 249.99);
            }
        }
        System.out.println("Annotation processing completed successfully.");
    }
}
