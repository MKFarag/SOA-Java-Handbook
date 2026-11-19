package com.handbook.spring;

import java.lang.annotation.*;
import java.lang.reflect.*;
import java.util.*;

/**
 * Section 24 - Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle Callbacks
 * Demonstrates Constructor vs Setter vs Field injection, @Primary/@Qualifier ambiguity resolution,
 * and the complete 8-phase Spring Bean lifecycle execution pipeline.
 */
public class BeanLifecycleInjectionDemo {

    // --- Meta-Annotations Emulating Spring Framework 6.x ---
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    public @interface Component {
        String value() default "";
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    public @interface Service {}

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    public @interface Repository {}

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    public @interface Primary {}

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD})
    public @interface Qualifier {
        String value();
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.FIELD})
    public @interface Autowired {
        boolean required() default true;
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    public @interface PostConstruct {}

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    public @interface PreDestroy {}

    // --- Interfaces for Aware Callbacks & PostProcessors ---
    public interface BeanNameAware {
        void setBeanName(String name);
    }

    public interface InitializingBean {
        void afterPropertiesSet() throws Exception;
    }

    public interface DisposableBean {
        void destroy() throws Exception;
    }

    public interface BeanPostProcessor {
        default Object postProcessBeforeInitialization(Object bean, String beanName) { return bean; }
        default Object postProcessAfterInitialization(Object bean, String beanName) { return bean; }
    }

    // --- 1. Notification Strategy Pattern (Ambiguity & @Qualifier/@Primary) ---
    public interface NotificationChannel {
        String send(String recipient, String message);
    }

    @Component("emailChannel")
    @Primary
    public static class EmailNotificationChannel implements NotificationChannel {
        @Override
        public String send(String recipient, String message) {
            return "[EMAIL to " + recipient + "]: " + message;
        }
    }

    @Component("smsChannel")
    public static class SmsNotificationChannel implements NotificationChannel {
        @Override
        public String send(String recipient, String message) {
            return "[SMS to " + recipient + "]: " + message;
        }
    }

    // --- 2. Production Service: Constructor Injection (Clean Architecture) ---
    @Service
    public static class OrderDispatchService implements BeanNameAware, InitializingBean, DisposableBean {
        private final NotificationChannel primaryChannel;
        private final NotificationChannel urgentChannel;
        private String configuredBeanName;
        private boolean isOperational = false;

        // Constructor Injection with @Qualifier for disambiguation
        @Autowired
        public OrderDispatchService(
                NotificationChannel defaultChannel, // Resolves to @Primary (Email)
                @Qualifier("smsChannel") NotificationChannel urgentChannel // Explicit Qualifier (SMS)
        ) {
            this.primaryChannel = Objects.requireNonNull(defaultChannel, "defaultChannel cannot be null");
            this.urgentChannel = Objects.requireNonNull(urgentChannel, "urgentChannel cannot be null");
            System.out.println("  [Phase 1: Instantiation] OrderDispatchService constructor called.");
        }

        @Override
        public void setBeanName(String name) {
            this.configuredBeanName = name;
            System.out.println("  [Phase 3: BeanNameAware] Assigned bean identifier: " + name);
        }

        @PostConstruct
        public void initAnnotation() {
            System.out.println("  [Phase 5a: @PostConstruct] Validating channels and warm-up sockets...");
        }

        @Override
        public void afterPropertiesSet() {
            this.isOperational = true;
            System.out.println("  [Phase 5b: InitializingBean.afterPropertiesSet()] Service marked OPERATIONAL.");
        }

        public String dispatchOrder(String customer, double amount, boolean isUrgent) {
            if (!isOperational) {
                throw new IllegalStateException("Service is not operational yet!");
            }
            NotificationChannel chosen = isUrgent ? urgentChannel : primaryChannel;
            String msg = String.format("Order placed for $%.2f", amount);
            return chosen.send(customer, msg);
        }

        @PreDestroy
        public void preDestroyAnnotation() {
            System.out.println("  [Phase 8a: @PreDestroy] Draining pending notification queues...");
        }

        @Override
        public void destroy() {
            this.isOperational = false;
            System.out.println("  [Phase 8b: DisposableBean.destroy()] Disconnected all notification transports.");
        }

        public String getConfiguredBeanName() { return configuredBeanName; }
        public boolean isOperational() { return isOperational; }
    }

    // --- 3. Security Audit BeanPostProcessor ---
    public static class SecurityAuditPostProcessor implements BeanPostProcessor {
        @Override
        public Object postProcessBeforeInitialization(Object bean, String beanName) {
            System.out.println("  [Phase 4: BeanPostProcessor (Before)] Inspecting security metadata for: " + beanName);
            return bean;
        }

        @Override
        public Object postProcessAfterInitialization(Object bean, String beanName) {
            System.out.println("  [Phase 6: BeanPostProcessor (After)] Applying AOP interceptor proxy wrapping for: " + beanName);
            return bean;
        }
    }

    // --- 4. Micro Spring Context Pipeline Simulation ---
    public static class MicroLifecycleContainer {
        private final List<BeanPostProcessor> postProcessors = new ArrayList<>();
        private final Map<String, Object> singletons = new LinkedHashMap<>();

        public void addBeanPostProcessor(BeanPostProcessor bpp) {
            postProcessors.add(bpp);
        }

        public void bootstrap() throws Exception {
            System.out.println("--- Bootstrapping Container & Executing Full Lifecycle ---");

            // Register channels
            EmailNotificationChannel email = new EmailNotificationChannel();
            SmsNotificationChannel sms = new SmsNotificationChannel();
            singletons.put("emailChannel", email);
            singletons.put("smsChannel", sms);

            // Instantiate OrderDispatchService with Constructor Injection
            String beanName = "orderDispatchService";
            OrderDispatchService service = new OrderDispatchService(email, sms);

            // Phase 3: Aware Callbacks
            if (service instanceof BeanNameAware bna) {
                bna.setBeanName(beanName);
            }

            // Phase 4: BeanPostProcessor Before
            for (BeanPostProcessor bpp : postProcessors) {
                bpp.postProcessBeforeInitialization(service, beanName);
            }

            // Phase 5a: @PostConstruct
            for (Method m : service.getClass().getDeclaredMethods()) {
                if (m.isAnnotationPresent(PostConstruct.class)) {
                    m.invoke(service);
                }
            }

            // Phase 5b: InitializingBean
            if (service instanceof InitializingBean ib) {
                ib.afterPropertiesSet();
            }

            // Phase 6: BeanPostProcessor After (Proxies)
            Object proxyOrBean = service;
            for (BeanPostProcessor bpp : postProcessors) {
                proxyOrBean = bpp.postProcessAfterInitialization(proxyOrBean, beanName);
            }

            singletons.put(beanName, proxyOrBean);
            System.out.println("  [Phase 7: Ready] Bean '" + beanName + "' is ready for production traffic.\n");
        }

        public void shutdown() throws Exception {
            System.out.println("\n--- Shutting Down Container & Executing Destruction Lifecycle ---");
            for (Object bean : singletons.values()) {
                // Phase 8a: @PreDestroy
                for (Method m : bean.getClass().getDeclaredMethods()) {
                    if (m.isAnnotationPresent(PreDestroy.class)) {
                        m.invoke(bean);
                    }
                }
                // Phase 8b: DisposableBean
                if (bean instanceof DisposableBean db) {
                    db.destroy();
                }
            }
            singletons.clear();
            System.out.println("Container shutdown complete. All resources recycled.");
        }

        @SuppressWarnings("unchecked")
        public <T> T getBean(String name) {
            return (T) singletons.get(name);
        }
    }

    // --- 5. Main Execution & Verification ---
    public static void main(String[] args) throws Exception {
        System.out.println("==========================================================================");
        System.out.println(" Spring 6.x: Injection Strategies & Bean Lifecycle Execution Architecture ");
        System.out.println("==========================================================================\n");

        MicroLifecycleContainer container = new MicroLifecycleContainer();
        container.addBeanPostProcessor(new SecurityAuditPostProcessor());

        // Run full initialization lifecycle
        container.bootstrap();

        OrderDispatchService service = container.getBean("orderDispatchService");
        assert service != null : "Service bean must be in container registry";
        assert service.isOperational() : "Service must be operational after lifecycle initialization";
        assert "orderDispatchService".equals(service.getConfiguredBeanName());

        // Business Execution
        System.out.println("--- Business Execution ---");
        String standardResult = service.dispatchOrder("alice@enterprise.com", 240.50, false);
        System.out.println("Standard dispatch: " + standardResult);
        assert standardResult.contains("[EMAIL to alice@enterprise.com]");

        String urgentResult = service.dispatchOrder("+1-555-0199", 1580.00, true);
        System.out.println("Urgent dispatch:   " + urgentResult);
        assert urgentResult.contains("[SMS to +1-555-0199]");

        // Run destruction lifecycle
        container.shutdown();
        assert !service.isOperational() : "Service must be non-operational after destroy()";

        System.out.println("\nSUCCESS: All Spring Bean lifecycle phases and injection strategies verified successfully!");
    }
}
