package com.handbook.spring;

import java.lang.annotation.*;
import java.lang.reflect.*;
import java.util.*;

/**
 * Section 25 - Topic 90: Spring Boot Architecture, Starters & Embedded Runtimes
 * Demonstrates the auto-configuration condition evaluation engine (@ConditionalOnClass,
 * @ConditionalOnMissingBean, @ConditionalOnProperty) and embedded server bootstrap.
 */
public class AutoConfigurationEmbeddedDemo {

    // --- Meta-Annotations Emulating Spring Boot 3.x Auto-Configuration ---
    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.TYPE, ElementType.METHOD})
    public @interface ConditionalOnProperty {
        String name();
        String havingValue() default "true";
        boolean matchIfMissing() default false;
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.TYPE, ElementType.METHOD})
    public @interface ConditionalOnMissingBean {
        Class<?> value();
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.TYPE, ElementType.METHOD})
    public @interface ConditionalOnClass {
        String className();
    }

    // --- Domain Contracts & Components ---
    public interface DataSource {
        String getUrl();
        int getMaxPoolSize();
    }

    public static class HikariDataSource implements DataSource {
        private final String url;
        private final int poolSize;

        public HikariDataSource(String url, int poolSize) {
            this.url = url;
            this.poolSize = poolSize;
        }

        @Override public String getUrl() { return url; }
        @Override public int getMaxPoolSize() { return poolSize; }
    }

    // Custom user-defined DataSource (to test @ConditionalOnMissingBean back-off)
    public static class CustomOracleDataSource implements DataSource {
        @Override public String getUrl() { return "jdbc:oracle:thin:@prod-db:1521:orcl"; }
        @Override public int getMaxPoolSize() { return 100; }
    }

    // Embedded Web Server Contract
    public interface WebServer {
        void start();
        void stop();
        int getPort();
    }

    public static class EmbeddedTomcatWebServer implements WebServer {
        private final int port;
        private boolean running = false;

        public EmbeddedTomcatWebServer(int port) {
            this.port = port;
        }

        @Override
        public void start() {
            this.running = true;
            System.out.printf("  [Embedded Tomcat] Initializing Coyote HTTP/1.1 connector on port %d... STARTED%n", port);
        }

        @Override
        public void stop() {
            this.running = false;
            System.out.printf("  [Embedded Tomcat] Connector on port %d gracefully stopped.%n", port);
        }

        @Override public int getPort() { return port; }
        public boolean isRunning() { return running; }
    }

    // --- Auto-Configuration Candidate Classes ---
    public static class DataSourceAutoConfiguration {

        @ConditionalOnClass(className = "java.sql.Driver")
        @ConditionalOnProperty(name = "spring.datasource.enabled", havingValue = "true", matchIfMissing = true)
        @ConditionalOnMissingBean(DataSource.class)
        public DataSource defaultHikariDataSource() {
            System.out.println("  [Auto-Config MATCH] Creating default HikariCP DataSource pool.");
            return new HikariDataSource("jdbc:postgresql://localhost:5432/default_db", 20);
        }
    }

    public static class EmbeddedWebServerAutoConfiguration {

        @ConditionalOnClass(className = "java.net.ServerSocket")
        @ConditionalOnMissingBean(WebServer.class)
        public WebServer tomcatWebServer(int port) {
            System.out.println("  [Auto-Config MATCH] Creating EmbeddedTomcatWebServer on port " + port);
            return new EmbeddedTomcatWebServer(port);
        }
    }

    // --- Lightweight Auto-Configuration Processing Engine ---
    public static class ConditionEvaluationEngine {
        private final Map<String, String> environmentProperties;
        private final Map<Class<?>, Object> beanRegistry = new HashMap<>();

        public ConditionEvaluationEngine(Map<String, String> env) {
            this.environmentProperties = env;
        }

        public void registerUserBean(Class<?> type, Object instance) {
            beanRegistry.put(type, instance);
            System.out.println("  [User Defined Bean] Explicitly registered: " + type.getSimpleName());
        }

        public boolean evaluate(Method method) {
            // Check @ConditionalOnProperty
            if (method.isAnnotationPresent(ConditionalOnProperty.class)) {
                ConditionalOnProperty prop = method.getAnnotation(ConditionalOnProperty.class);
                String val = environmentProperties.get(prop.name());
                if (val == null) {
                    if (!prop.matchIfMissing()) return false;
                } else if (!val.equalsIgnoreCase(prop.havingValue())) {
                    return false;
                }
            }

            // Check @ConditionalOnMissingBean
            if (method.isAnnotationPresent(ConditionalOnMissingBean.class)) {
                ConditionalOnMissingBean missing = method.getAnnotation(ConditionalOnMissingBean.class);
                if (beanRegistry.containsKey(missing.value())) {
                    System.out.println("  [Auto-Config BACK-OFF] Skipping " + method.getName() + " -> Bean of type " + missing.value().getSimpleName() + " already exists!");
                    return false;
                }
            }

            // Check @ConditionalOnClass
            if (method.isAnnotationPresent(ConditionalOnClass.class)) {
                ConditionalOnClass classCheck = method.getAnnotation(ConditionalOnClass.class);
                try {
                    Class.forName(classCheck.className());
                } catch (ClassNotFoundException e) {
                    return false;
                }
            }

            return true;
        }

        public void processAutoConfiguration(Object autoConfigInstance) throws Exception {
            for (Method method : autoConfigInstance.getClass().getDeclaredMethods()) {
                if (evaluate(method)) {
                    if (method.getParameterCount() == 0) {
                        Object created = method.invoke(autoConfigInstance);
                        beanRegistry.put(method.getReturnType(), created);
                    }
                }
            }
        }

        @SuppressWarnings("unchecked")
        public <T> T getBean(Class<T> type) {
            return (T) beanRegistry.get(type);
        }
    }

    // --- Main Verification Flow ---
    public static void main(String[] args) throws Exception {
        System.out.println("==========================================================================");
        System.out.println(" Spring Boot: Auto-Configuration Mechanics & Embedded Web Runtime Engine  ");
        System.out.println("==========================================================================\n");

        // Scenario 1: Default Auto-Configuration (No user beans provided)
        System.out.println("--- SCENARIO 1: Pure Auto-Configuration (Out-of-the-Box Defaults) ---");
        Map<String, String> defaultEnv = Map.of("server.port", "8080");
        ConditionEvaluationEngine engine1 = new ConditionEvaluationEngine(defaultEnv);

        DataSourceAutoConfiguration dsConfig = new DataSourceAutoConfiguration();
        EmbeddedWebServerAutoConfiguration webConfig = new EmbeddedWebServerAutoConfiguration();

        engine1.processAutoConfiguration(dsConfig);
        WebServer defaultServer = webConfig.tomcatWebServer(8080);
        defaultServer.start();

        DataSource defaultDs = engine1.getBean(DataSource.class);
        assert defaultDs != null : "Default DataSource should have been auto-configured!";
        assert "jdbc:postgresql://localhost:5432/default_db".equals(defaultDs.getUrl());
        assert defaultDs.getMaxPoolSize() == 20;
        defaultServer.stop();
        System.out.println("Scenario 1 Verified: Default HikariCP and Embedded Tomcat auto-configured cleanly.\n");

        // Scenario 2: User-Defined Bean Overriding (Auto-Configuration Back-Off)
        System.out.println("--- SCENARIO 2: User Overrides DataSource (Conditional Back-Off) ---");
        ConditionEvaluationEngine engine2 = new ConditionEvaluationEngine(defaultEnv);

        // User registers custom Oracle DataSource BEFORE auto-configuration runs
        engine2.registerUserBean(DataSource.class, new CustomOracleDataSource());

        // Process Auto-Configuration
        engine2.processAutoConfiguration(dsConfig);

        DataSource chosenDs = engine2.getBean(DataSource.class);
        assert chosenDs instanceof CustomOracleDataSource : "User bean should override auto-configuration!";
        System.out.println("Active DataSource URL: " + chosenDs.getUrl());
        System.out.println("Scenario 2 Verified: Auto-configuration backed off in favor of user bean.\n");

        System.out.println("SUCCESS: Spring Boot Auto-Configuration & Embedded Runtime mechanics verified successfully!");
    }
}
