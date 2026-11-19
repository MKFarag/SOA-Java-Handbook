package com.handbook.enterprise;

import java.lang.annotation.*;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

// CDI Meta-annotations emulation for standalone reference execution
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.CONSTRUCTOR, ElementType.METHOD})
@interface Inject {}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface ApplicationScoped {}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface RequestScoped {}

public class CdiDependencyInjectionDemo {

    // 1. Service Interface & Implementations
    public interface PaymentGateway {
        String process(double amount);
    }

    @ApplicationScoped
    public static class StripePaymentGateway implements PaymentGateway {
        @Override
        public String process(double amount) {
            return "SUCCESS [Stripe]: Charged $" + amount;
        }
    }

    // 2. Client Bean requesting dependency injection
    @RequestScoped
    public static class CheckoutService {
        @Inject
        private PaymentGateway gateway;

        public String executeCheckout(double orderTotal) {
            if (gateway == null) {
                throw new IllegalStateException("CDI Injection Failed: PaymentGateway is null!");
            }
            return gateway.process(orderTotal);
        }

        public PaymentGateway getGateway() { return gateway; }
    }

    // 3. Lightweight CDI Bean Container Simulator
    public static class SimpleCdiContainer {
        private final Map<Class<?>, Object> singletons = new HashMap<>();

        public <T> void registerSingleton(Class<T> type, T instance) {
            singletons.put(type, instance);
        }

        public <T> T createBean(Class<T> beanClass) throws Exception {
            T bean = beanClass.getDeclaredConstructor().newInstance();
            for (Field field : beanClass.getDeclaredFields()) {
                if (field.isAnnotationPresent(Inject.class)) {
                    field.setAccessible(true);
                    Class<?> targetType = field.getType();
                    Object dependency = singletons.get(targetType);
                    if (dependency != null) {
                        field.set(bean, dependency);
                        System.out.println("[CDI Container] Injected " + dependency.getClass().getSimpleName() 
                            + " into field: " + field.getName());
                    }
                }
            }
            return bean;
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Jakarta Contexts and Dependency Injection (CDI) ===");

        SimpleCdiContainer container = new SimpleCdiContainer();

        // 1. Register ApplicationScoped bean implementation
        StripePaymentGateway stripeGateway = new StripePaymentGateway();
        container.registerSingleton(PaymentGateway.class, stripeGateway);

        // 2. Instantiate RequestScoped bean with automatic @Inject field resolution
        CheckoutService checkout = container.createBean(CheckoutService.class);

        // 3. Verify injection worked without manual 'new' in client code
        assert checkout.getGateway() != null : "Dependency should have been automatically injected";
        String receipt = checkout.executeCheckout(249.99);
        System.out.println("Checkout Result: " + receipt);
        assert receipt.contains("SUCCESS [Stripe]: Charged $249.99");

        System.out.println("CDI container dependency injection verified successfully.");
    }
}
