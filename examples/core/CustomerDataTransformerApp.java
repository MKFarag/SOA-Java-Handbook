import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

/**
 * Topic 41: Method References - Realistic Application
 * Demonstrates an ETL batch cleansing pipeline using constructor and instance method references.
 */
public class CustomerDataTransformerApp {

    public record RawRecord(String rawName, String rawEmail) {}

    public record CleanCustomer(String name, String email) {
        public static CleanCustomer fromRaw(RawRecord raw) {
            String cleanName = raw.rawName().trim();
            String cleanEmail = raw.rawEmail().trim().toLowerCase();
            return new CleanCustomer(cleanName, cleanEmail);
        }

        public String formattedDisplay() {
            return name + " <" + email + ">";
        }
    }

    public static <T, R> List<R> mapList(List<T> source, Function<T, R> mapper) {
        List<R> results = new ArrayList<>();
        for (T item : source) {
            results.add(mapper.apply(item));
        }
        return results;
    }

    public static void main(String[] args) {
        List<RawRecord> csvBatch = List.of(
                new RawRecord("  Alice Walker  ", " ALICE@Example.COM "),
                new RawRecord("Bob Vance ", "Bob.Vance@Refrigeration.COM "),
                new RawRecord(" Charlie Day", "CHARLIE@Paddys.ORG ")
        );

        // Transform using static method reference CleanCustomer::fromRaw
        List<CleanCustomer> cleansed = mapList(csvBatch, CleanCustomer::fromRaw);

        // Format for output using unbound instance method reference CleanCustomer::formattedDisplay
        List<String> displayStrings = mapList(cleansed, CleanCustomer::formattedDisplay);

        System.out.println("Cleansed Customer Roster (" + displayStrings.size() + " records):");
        for (String record : displayStrings) {
            System.out.println("  " + record);
        }
    }
}
