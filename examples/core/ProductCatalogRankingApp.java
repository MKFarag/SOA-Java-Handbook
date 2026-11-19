import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Topic 39: Comparable & Comparator - Realistic Application
 * Demonstrates an e-commerce ranking engine using chained Comparators with null-safety and descending order.
 */
public class ProductCatalogRankingApp {

    public record Product(String sku, String category, double rating, double priceUsd) {}

    public static void main(String[] args) {
        List<Product> catalog = new ArrayList<>();
        catalog.add(new Product("SKU-1", "Electronics", 4.8, 299.99));
        catalog.add(new Product("SKU-2", "Books", 4.9, 24.50));
        catalog.add(new Product("SKU-3", "Electronics", 4.8, 149.99));
        catalog.add(new Product("SKU-4", "Electronics", 4.2, 89.99));
        catalog.add(new Product("SKU-5", "Books", 4.5, 15.00));

        // Ranking Comparator:
        // 1. Category alphabetical
        // 2. Rating descending (highest rated first)
        // 3. Price ascending (cheaper first for ties in rating)
        Comparator<Product> rankingComparator = Comparator
                .comparing(Product::category)
                .thenComparing(Comparator.comparingDouble(Product::rating).reversed())
                .thenComparingDouble(Product::priceUsd);

        catalog.sort(rankingComparator);

        System.out.println("Ranked Product Catalog:");
        for (Product p : catalog) {
            System.out.printf("  [%s] %s | Rating: %.1f | Price: $%.2f%n",
                    p.category(), p.sku(), p.rating(), p.priceUsd());
        }
    }
}
