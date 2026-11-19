package com.handbook.spring;

import java.time.Instant;
import java.util.*;

/**
 * Section 24 - Topic 88: Spring Framework Core, BeanFactory vs ApplicationContext
 * Architectural demonstration of Spring container hierarchies, lazy vs eager instantiation,
 * and ApplicationContext enterprise service layers.
 */
public class BeanFactoryVsApplicationContextDemo {

    // --- 1. Domain Entities & Managed Services ---
    public static class DatabaseConnector {
        private final String connectionString;
        private final Instant initializedAt;

        public DatabaseConnector(String connectionString) {
            this.connectionString = connectionString;
            this.initializedAt = Instant.now();
            System.out.println("  -> [DatabaseConnector] Initializing pool for: " + connectionString);
        }

        public String getConnectionString() { return connectionString; }
        public Instant getInitializedAt() { return initializedAt; }
    }

    public static class PaymentAuditService {
        private final DatabaseConnector connector;

        public PaymentAuditService(DatabaseConnector connector) {
            this.connector = connector;
            System.out.println("  -> [PaymentAuditService] Bound to connector: " + connector.getConnectionString());
        }

        public String auditTransaction(String txId, double amount) {
            return String.format("AUDIT [OK]: Tx=%s Amount=$%.2f via %s", txId, amount, connector.getConnectionString());
        }
    }

    // --- 2. BeanFactory Contract & Implementation (Lazy by Default) ---
    public interface SimpleBeanFactory {
        <T> T getBean(Class<T> requiredType);
        boolean containsBean(Class<?> requiredType);
    }

    public static class LazyBeanFactory implements SimpleBeanFactory {
        private final Map<Class<?>, Object> singletonPool = new HashMap<>();
        private final Map<Class<?>, java.util.function.Supplier<Object>> beanDefinitions = new HashMap<>();

        public <T> void registerBeanDefinition(Class<T> type, java.util.function.Supplier<T> factory) {
            beanDefinitions.put(type, () -> factory.get());
        }

        @Override
        @SuppressWarnings("unchecked")
        public <T> T getBean(Class<T> requiredType) {
            if (singletonPool.containsKey(requiredType)) {
                return (T) singletonPool.get(requiredType);
            }
            java.util.function.Supplier<Object> supplier = beanDefinitions.get(requiredType);
            if (supplier == null) {
                throw new NoSuchElementException("No bean definition registered for: " + requiredType.getName());
            }
            System.out.println("[BeanFactory] On-demand (Lazy) instantiation for: " + requiredType.getSimpleName());
            Object created = supplier.get();
            singletonPool.put(requiredType, created);
            return (T) created;
        }

        @Override
        public boolean containsBean(Class<?> requiredType) {
            return singletonPool.containsKey(requiredType) || beanDefinitions.containsKey(requiredType);
        }
    }

    // --- 3. ApplicationContext Contract & Implementation (Eager Singleton + Enterprise Events) ---
    public interface SimpleApplicationContext extends SimpleBeanFactory {
        void publishEvent(String eventName, Object payload);
        String getEnvironmentProperty(String key, String defaultValue);
    }

    public static class EagerApplicationContext implements SimpleApplicationContext {
        private final Map<Class<?>, Object> singletonPool = new HashMap<>();
        private final Map<String, String> environment = new HashMap<>();
        private final List<String> eventJournal = new ArrayList<>();

        public EagerApplicationContext(Map<String, String> envProps) {
            this.environment.putAll(envProps);
            System.out.println("[ApplicationContext] Bootstrapping container & eager pre-instantiation...");
        }

        public <T> void registerAndInstantiate(Class<T> type, T instance) {
            singletonPool.put(type, instance);
            System.out.println("[ApplicationContext] Eager pre-instantiated singleton: " + type.getSimpleName());
        }

        @Override
        @SuppressWarnings("unchecked")
        public <T> T getBean(Class<T> requiredType) {
            Object instance = singletonPool.get(requiredType);
            if (instance == null) {
                throw new NoSuchElementException("No bean instantiated for: " + requiredType.getName());
            }
            return (T) instance;
        }

        @Override
        public boolean containsBean(Class<?> requiredType) {
            return singletonPool.containsKey(requiredType);
        }

        @Override
        public void publishEvent(String eventName, Object payload) {
            String record = String.format("[EVENT @ %s] %s: %s", Instant.now(), eventName, payload);
            eventJournal.add(record);
            System.out.println("[ApplicationContext Publisher] " + record);
        }

        @Override
        public String getEnvironmentProperty(String key, String defaultValue) {
            return environment.getOrDefault(key, defaultValue);
        }

        public List<String> getEventJournal() {
            return Collections.unmodifiableList(eventJournal);
        }
    }

    // --- 4. Main Verification Entry Point ---
    public static void main(String[] args) {
        System.out.println("=================================================================");
        System.out.println(" Spring Core IoC: BeanFactory vs ApplicationContext Architecture ");
        System.out.println("=================================================================\n");

        // Step 1: Demonstrate Lazy BeanFactory
        System.out.println("--- STEP 1: BeanFactory Lifecycle (Lazy by Default) ---");
        LazyBeanFactory beanFactory = new LazyBeanFactory();
        beanFactory.registerBeanDefinition(DatabaseConnector.class, 
            () -> new DatabaseConnector("jdbc:postgresql://db.internal:5432/core_banking"));
        beanFactory.registerBeanDefinition(PaymentAuditService.class, 
            () -> new PaymentAuditService(beanFactory.getBean(DatabaseConnector.class)));

        System.out.println("BeanFactory registered. Note: No bean instances created yet.");
        System.out.println("Requesting PaymentAuditService for the first time...");
        PaymentAuditService auditService1 = beanFactory.getBean(PaymentAuditService.class);
        String auditLog = auditService1.auditTransaction("TX-9042", 12500.00);
        System.out.println("Result: " + auditLog);

        // Subsequent getBean() returns cached singleton
        PaymentAuditService auditService2 = beanFactory.getBean(PaymentAuditService.class);
        assert auditService1 == auditService2 : "BeanFactory singletons must be identity-identical!";
        System.out.println("Verified: Subsequent BeanFactory.getBean() retrieved cached singleton.\n");

        // Step 2: Demonstrate Eager ApplicationContext with Enterprise Services
        System.out.println("--- STEP 2: ApplicationContext Lifecycle (Eager Pre-instantiation) ---");
        Map<String, String> env = Map.of(
            "spring.profiles.active", "production",
            "app.currency", "USD"
        );
        EagerApplicationContext appContext = new EagerApplicationContext(env);

        // Pre-instantiating singletons during container bootstrap
        DatabaseConnector prodDb = new DatabaseConnector("jdbc:postgresql://cluster.prod:5432/payments");
        PaymentAuditService prodAudit = new PaymentAuditService(prodDb);
        appContext.registerAndInstantiate(DatabaseConnector.class, prodDb);
        appContext.registerAndInstantiate(PaymentAuditService.class, prodAudit);

        // Verification of Enterprise Services: Event Publishing & Environment
        appContext.publishEvent("ContextRefreshedEvent", "ApplicationContext ready for traffic");
        appContext.publishEvent("TransactionProcessedEvent", "TxID=TX-88001 Amount=$990.00");

        String activeProfile = appContext.getEnvironmentProperty("spring.profiles.active", "default");
        System.out.println("Active Environment Profile: " + activeProfile);
        assert "production".equals(activeProfile);

        PaymentAuditService retrievedAudit = appContext.getBean(PaymentAuditService.class);
        assert retrievedAudit == prodAudit : "ApplicationContext must return pre-instantiated singleton!";

        System.out.println("\nSUCCESS: BeanFactory vs ApplicationContext architectural mechanics verified successfully!");
    }
}
