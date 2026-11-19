import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.NavigableSet;
import java.util.Set;
import java.util.TreeSet;

/**
 * Topic 36: The Set Hierarchy - Basic Example
 * Compares HashSet (hash table), LinkedHashSet (insertion ordered), and TreeSet (Red-Black tree).
 */
public class SetHierarchyDemo {

    public static void main(String[] args) {
        // 1. HashSet: O(1) operations, non-deterministic order, disallows duplicates
        Set<String> hashSet = new HashSet<>();
        hashSet.add("Banana");
        hashSet.add("Apple");
        hashSet.add("Cherry");
        hashSet.add("Apple"); // Duplicate ignored
        System.out.println("HashSet size (duplicates rejected): " + hashSet.size());

        // 2. LinkedHashSet: maintains insertion order via underlying doubly-linked list
        Set<String> linkedHashSet = new LinkedHashSet<>();
        linkedHashSet.add("First");
        linkedHashSet.add("Second");
        linkedHashSet.add("Third");
        System.out.println("LinkedHashSet insertion order preserved: " + linkedHashSet);

        // 3. TreeSet: implements NavigableSet, sorted in natural order (Red-Black tree O(log n))
        NavigableSet<Integer> sortedNumbers = new TreeSet<>();
        sortedNumbers.add(50);
        sortedNumbers.add(10);
        sortedNumbers.add(80);
        sortedNumbers.add(30);

        System.out.println("TreeSet sorted view: " + sortedNumbers);
        System.out.println("TreeSet first (min): " + sortedNumbers.first());
        System.out.println("TreeSet last (max): " + sortedNumbers.last());
        System.out.println("TreeSet subset (< 50): " + sortedNumbers.headSet(50));
    }
}
