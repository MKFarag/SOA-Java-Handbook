import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Topic 35: The List Hierarchy - Realistic Application
 * Demonstrates batch order processing, pagination with subList, and immutable defensive copying.
 */
public class OrderBatchProcessorApp {

    public record CustomerOrder(String orderId, double totalAmount) {}

    public static class BatchProcessor {
        private final List<CustomerOrder> queue = new ArrayList<>();

        public void addOrder(CustomerOrder order) {
            queue.add(order);
        }

        public List<CustomerOrder> getBatch(int offset, int limit) {
            if (offset >= queue.size()) {
                return Collections.emptyList();
            }
            int toIndex = Math.min(offset + limit, queue.size());
            // subList provides a live view; List.copyOf creates an unmodifiable snapshot
            return List.copyOf(queue.subList(offset, toIndex));
        }

        public int getTotalPending() {
            return queue.size();
        }
    }

    public static void main(String[] args) {
        BatchProcessor processor = new BatchProcessor();
        processor.addOrder(new CustomerOrder("ORD-101", 89.50));
        processor.addOrder(new CustomerOrder("ORD-102", 240.00));
        processor.addOrder(new CustomerOrder("ORD-103", 45.20));
        processor.addOrder(new CustomerOrder("ORD-104", 512.99));
        processor.addOrder(new CustomerOrder("ORD-105", 19.99));

        System.out.println("Total Orders Queued: " + processor.getTotalPending());

        List<CustomerOrder> firstBatch = processor.getBatch(0, 2);
        System.out.println("Batch 1 (Size " + firstBatch.size() + "): " + firstBatch);

        List<CustomerOrder> secondBatch = processor.getBatch(2, 2);
        System.out.println("Batch 2 (Size " + secondBatch.size() + "): " + secondBatch);

        List<CustomerOrder> thirdBatch = processor.getBatch(4, 2);
        System.out.println("Batch 3 (Size " + thirdBatch.size() + "): " + thirdBatch);
    }
}
