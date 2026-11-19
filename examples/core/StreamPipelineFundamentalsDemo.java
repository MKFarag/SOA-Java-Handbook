import java.util.Arrays;
import java.util.List;

/**
 * Topic 42: Stream API: Pipeline Fundamentals - Basic Example
 * Demonstrates stream lazy evaluation, intermediate operations (filter, map, flatMap, distinct),
 * and terminal extraction.
 */
public class StreamPipelineFundamentalsDemo {

    public static void main(String[] args) {
        List<String> rawTokens = List.of("alpha", "beta", "gamma", "alpha", "delta", "epsilon");

        System.out.println("=== 1. Demonstrating Lazy Evaluation ===");
        // Streams evaluate lazily: intermediate steps do not execute until a terminal operation runs
        var stream = rawTokens.stream()
                .filter(s -> {
                    System.out.println("  [filter called on: " + s + "]");
                    return s.length() > 4;
                })
                .map(String::toUpperCase);

        System.out.println("Stream defined, but no terminal operation invoked yet.");
        System.out.println("Triggering terminal count()...");
        long matchCount = stream.count();
        System.out.println("Filtered count: " + matchCount);

        System.out.println("\n=== 2. Intermediate Operations Chain ===");
        List<String> processed = rawTokens.stream()
                .filter(s -> s.length() >= 5)
                .distinct()                    // Eliminates duplicate "alpha"
                .sorted()                      // Natural alphabetical sort
                .map(String::toUpperCase)      // Transforms to upper case
                .limit(2)                      // Short-circuits after 2 elements
                .toList();

        System.out.println("Final Processed List: " + processed);

        System.out.println("\n=== 3. FlatMap Transformation ===");
        List<List<Integer>> nestedLists = List.of(
                List.of(1, 2, 3),
                List.of(4, 5),
                List.of(6, 7, 8)
        );

        List<Integer> flattened = nestedLists.stream()
                .flatMap(List::stream)         // Flattens Stream<List<Integer>> to Stream<Integer>
                .toList();

        System.out.println("Flattened Elements: " + flattened);
    }
}
