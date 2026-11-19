import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Topic 35: The List Hierarchy - Basic Example
 * Compares ArrayList, LinkedList, and CopyOnWriteArrayList characteristics.
 */
public class ListHierarchyDemo {

    public static void main(String[] args) {
        // 1. ArrayList: dynamic contiguous array (fast random access O(1))
        List<String> arrayList = new ArrayList<>();
        arrayList.add("Alpha");
        arrayList.add("Beta");
        arrayList.add(1, "Inserted-Mid");
        System.out.println("ArrayList indexed read at 1: " + arrayList.get(1));

        // 2. LinkedList: doubly-linked list nodes (fast addFirst/removeFirst O(1))
        LinkedList<String> linkedList = new LinkedList<>();
        linkedList.addFirst("Head-Node");
        linkedList.addLast("Tail-Node");
        System.out.println("LinkedList first element: " + linkedList.getFirst());

        // 3. CopyOnWriteArrayList: thread-safe array that clones on mutation
        List<String> cowList = new CopyOnWriteArrayList<>(arrayList);
        for (String item : cowList) {
            // Safe concurrent mutation during iteration without ConcurrentModificationException
            if (item.equals("Beta")) {
                cowList.add("Gamma-Safe");
            }
        }
        System.out.println("CopyOnWriteArrayList size: " + cowList.size());
        System.out.println("CopyOnWriteArrayList final items: " + cowList);
    }
}
