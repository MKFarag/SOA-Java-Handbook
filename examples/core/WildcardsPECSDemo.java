import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Topic 34: Generic Wildcards & PECS Principle - Basic Example
 * Demonstrates Producer Extends (read-only) and Consumer Super (write-capable).
 */
public class WildcardsPECSDemo {

    // Producer Extends: reads numbers from the source collection
    public static double sumOfNumbers(List<? extends Number> numbers) {
        double sum = 0.0;
        for (Number n : numbers) {
            sum += n.doubleValue();
        }
        return sum;
    }

    // Consumer Super: writes integer elements into the destination collection
    public static void populateConsecutive(List<? super Integer> target, int start, int count) {
        for (int i = 0; i < count; i++) {
            target.add(start + i);
        }
    }

    public static void main(String[] args) {
        // Producer Extends in action
        List<Integer> integers = Arrays.asList(10, 20, 30);
        List<Double> doubles = Arrays.asList(1.5, 2.5, 3.5);

        System.out.println("Integer Sum: " + sumOfNumbers(integers));
        System.out.println("Double Sum: " + sumOfNumbers(doubles));

        // Consumer Super in action
        List<Number> numberSink = new ArrayList<>();
        populateConsecutive(numberSink, 100, 3);
        System.out.println("Number Sink Contents: " + numberSink);

        List<Object> objectSink = new ArrayList<>();
        populateConsecutive(objectSink, 500, 2);
        System.out.println("Object Sink Contents: " + objectSink);
    }
}
