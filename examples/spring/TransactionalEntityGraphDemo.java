package com.handbook.spring;

import java.lang.annotation.*;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Topic 97: Declarative @Transactional Boundaries, Pagination, Sorting & N+1 Prevention
 * 
 * Demonstrates:
 * 1. Declarative Transaction Management via @Transactional proxy interceptor.
 * 2. Propagation behaviors (REQUIRED, REQUIRES_NEW) and readOnly optimization.
 * 3. The N+1 Query Problem: lazy collection navigation resulting in 1 + N queries.
 * 4. EntityGraph / JOIN FETCH resolution: batching / single-query eager fetching reducing query count to 1.
 * 5. Rollback on RuntimeException vs Commit on success.
 */
public class TransactionalEntityGraphDemo {

    public enum Propagation { REQUIRED, REQUIRES_NEW, SUPPORTS }
    public enum Isolation { DEFAULT, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.METHOD, ElementType.TYPE})
    public @interface Transactional {
        Propagation propagation() default Propagation.REQUIRED;
        Isolation isolation() default Isolation.DEFAULT;
        boolean readOnly() default false;
        Class<? extends Throwable>[] rollbackFor() default {};
    }

    // --- Domain Entities ---
    public static class OrderItem {
        private final Long id;
        private final String itemCode;
        private final double price;

        public OrderItem(Long id, String itemCode, double price) {
            this.id = id;
            this.itemCode = itemCode;
            this.price = price;
        }

        public Long getId() { return id; }
        public String getItemCode() { return itemCode; }
        public double price() { return price; }

        @Override
        public String toString() {
            return String.format("OrderItem[#%d: %s ($%.2f)]", id, itemCode, price);
        }
    }

    public static class CustomerOrder {
        private final Long id;
        private final String customerName;
        private final List<OrderItem> items = new ArrayList<>();
        private boolean itemsLoaded = false;

        public CustomerOrder(Long id, String customerName) {
            this.id = id;
            this.customerName = customerName;
        }

        public Long getId() { return id; }
        public String getCustomerName() { return customerName; }
        public List<OrderItem> getItems() { return items; }
        public boolean isItemsLoaded() { return itemsLoaded; }
        public void setItemsLoaded(boolean itemsLoaded) { this.itemsLoaded = itemsLoaded; }
    }

    // --- Query Monitor & Database Simulator ---
    public static class DatabaseSimulator {
        public static final AtomicInteger queryCounter = new AtomicInteger(0);

        public static void resetCounter() {
            queryCounter.set(0);
        }

        public static List<CustomerOrder> queryOrdersWithoutJoin() {
            queryCounter.incrementAndGet();
            System.out.println("  [SQL EXEC] SELECT o.id, o.customer_name FROM orders o");
            List<CustomerOrder> list = new ArrayList<>();
            list.add(new CustomerOrder(1L, "Alice"));
            list.add(new CustomerOrder(2L, "Bob"));
            list.add(new CustomerOrder(3L, "Carol"));
            return list;
        }

        public static List<OrderItem> queryItemsForOrder(Long orderId) {
            queryCounter.incrementAndGet();
            System.out.printf("  [SQL EXEC] SELECT i.id, i.item_code, i.price FROM order_items i WHERE i.order_id = %d\n", orderId);
            return List.of(
                    new OrderItem(orderId * 10 + 1, "SKU-" + orderId + "A", 49.99),
                    new OrderItem(orderId * 10 + 2, "SKU-" + orderId + "B", 129.50)
            );
        }

        public static List<CustomerOrder> queryOrdersWithEntityGraph() {
            queryCounter.incrementAndGet();
            System.out.println("  [SQL EXEC - @EntityGraph / JOIN FETCH] SELECT o.id, o.customer_name, i.id, i.item_code, i.price " +
                    "FROM orders o LEFT OUTER JOIN order_items i ON o.id = i.order_id");
            List<CustomerOrder> list = new ArrayList<>();
            CustomerOrder o1 = new CustomerOrder(1L, "Alice");
            o1.getItems().addAll(List.of(new OrderItem(11L, "SKU-1A", 49.99), new OrderItem(12L, "SKU-1B", 129.50)));
            o1.setItemsLoaded(true);

            CustomerOrder o2 = new CustomerOrder(2L, "Bob");
            o2.getItems().addAll(List.of(new OrderItem(21L, "SKU-2A", 49.99), new OrderItem(22L, "SKU-2B", 129.50)));
            o2.setItemsLoaded(true);

            CustomerOrder o3 = new CustomerOrder(3L, "Carol");
            o3.getItems().addAll(List.of(new OrderItem(31L, "SKU-3A", 49.99), new OrderItem(32L, "SKU-3B", 129.50)));
            o3.setItemsLoaded(true);

            list.add(o1);
            list.add(o2);
            list.add(o3);
            return list;
        }
    }

    // --- Service Layer & Declarative Transaction Aspect Simulation ---
    public interface OrderService {
        void processPayment(Long orderId, double amount);
        List<CustomerOrder> fetchOrdersLazyNPlusOne();
        List<CustomerOrder> fetchOrdersOptimizedWithEntityGraph();
    }

    public static class OrderServiceImpl implements OrderService {

        @Override
        @Transactional(propagation = Propagation.REQUIRED)
        public void processPayment(Long orderId, double amount) {
            if (amount <= 0) {
                throw new IllegalArgumentException("Payment amount must be strictly positive");
            }
            System.out.printf("  [Business Logic] Processed $%.2f payment successfully for order #%d\n", amount, orderId);
        }

        @Override
        @Transactional(readOnly = true)
        public List<CustomerOrder> fetchOrdersLazyNPlusOne() {
            // 1 Query to get orders
            List<CustomerOrder> orders = DatabaseSimulator.queryOrdersWithoutJoin();
            // N Queries to get items lazily per order
            for (CustomerOrder order : orders) {
                List<OrderItem> items = DatabaseSimulator.queryItemsForOrder(order.getId());
                order.getItems().addAll(items);
                order.setItemsLoaded(true);
            }
            return orders;
        }

        @Override
        @Transactional(readOnly = true)
        public List<CustomerOrder> fetchOrdersOptimizedWithEntityGraph() {
            // 1 Single Join Fetch Query eliminates the N+1 problem
            return DatabaseSimulator.queryOrdersWithEntityGraph();
        }
    }

    // --- Dynamic Proxy Interceptor for @Transactional ---
    public static class TransactionInterceptor implements InvocationHandler {
        private final Object target;

        public TransactionInterceptor(Object target) {
            this.target = target;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            Method targetMethod = target.getClass().getMethod(method.getName(), method.getParameterTypes());
            Transactional tx = targetMethod.getAnnotation(Transactional.class);

            if (tx == null) {
                return method.invoke(target, args);
            }

            System.out.printf("  [TxInterceptor] BEGIN Transaction [Propagation: %s, readOnly: %b]\n",
                    tx.propagation(), tx.readOnly());
            try {
                Object result = method.invoke(target, args);
                System.out.println("  [TxInterceptor] COMMIT Transaction - All updates safely persisted.");
                return result;
            } catch (Throwable ex) {
                Throwable cause = ex.getCause() != null ? ex.getCause() : ex;
                System.out.println("  [TxInterceptor] ROLLBACK Transaction due to: " + cause.getClass().getSimpleName() + " (" + cause.getMessage() + ")");
                throw cause;
            }
        }
    }

    // --- Main Execution ---
    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 97: Declarative @Transactional Boundaries, Pagination, Sorting & N+1 Prevention");
        System.out.println("================================================================================");

        OrderService rawService = new OrderServiceImpl();
        OrderService service = (OrderService) Proxy.newProxyInstance(
                OrderService.class.getClassLoader(),
                new Class<?>[]{OrderService.class},
                new TransactionInterceptor(rawService)
        );

        // 1. Transactional Commit on Success
        System.out.println("1. Executing Successful Transaction:");
        service.processPayment(1001L, 450.0);

        // 2. Transactional Rollback on Exception
        System.out.println("\n2. Executing Failing Transaction (Triggering Rollback):");
        try {
            service.processPayment(1002L, -50.0);
            assert false : "Exception was expected";
        } catch (IllegalArgumentException ex) {
            System.out.println("   Caught expected exception: " + ex.getMessage());
        }

        // 3. Demonstrating N+1 Problem (1 Initial Query + N Sub-queries)
        System.out.println("\n3. Demonstrating the N+1 Query Problem (Unoptimized Lazy Fetch):");
        DatabaseSimulator.resetCounter();
        List<CustomerOrder> lazyOrders = service.fetchOrdersLazyNPlusOne();
        int queriesExecutedNPlusOne = DatabaseSimulator.queryCounter.get();
        System.out.printf("   Fetched %d orders. Total SQL queries executed: %d (1 initial + %d child queries = N+1)\n",
                lazyOrders.size(), queriesExecutedNPlusOne, lazyOrders.size());
        assert queriesExecutedNPlusOne == (1 + lazyOrders.size()) : "N+1 query count mismatch";

        // 4. Demonstrating Resolution via @EntityGraph / JOIN FETCH (Single Query)
        System.out.println("\n4. Demonstrating N+1 Elimination via @EntityGraph / JOIN FETCH:");
        DatabaseSimulator.resetCounter();
        List<CustomerOrder> eagerOrders = service.fetchOrdersOptimizedWithEntityGraph();
        int queriesExecutedEntityGraph = DatabaseSimulator.queryCounter.get();
        System.out.printf("   Fetched %d orders. Total SQL queries executed: %d (Reduced from %d to %d)\n",
                eagerOrders.size(), queriesExecutedEntityGraph, queriesExecutedNPlusOne, queriesExecutedEntityGraph);
        assert queriesExecutedEntityGraph == 1 : "@EntityGraph must execute in exactly 1 query";

        System.out.println("\n[SUCCESS] Topic 97 Transactional and EntityGraph demo executed successfully!");
        System.out.println("================================================================================");
    }
}
