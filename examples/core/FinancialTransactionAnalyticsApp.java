import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Topic 43: Stream API: Terminal Operations & Collectors - Realistic Application
 * Demonstrates enterprise financial analytics: grouping by currency, summing totals,
 * and partitioning high-value wire transfers.
 */
public class FinancialTransactionAnalyticsApp {

    public record Transaction(String txId, String currency, String category, double amountUsd) {}

    public static void main(String[] args) {
        List<Transaction> transactions = List.of(
                new Transaction("TX-101", "USD", "CLOUD_INFRA", 1250.00),
                new Transaction("TX-102", "EUR", "MARKETING", 450.50),
                new Transaction("TX-103", "USD", "SALARY", 8500.00),
                new Transaction("TX-104", "USD", "CLOUD_INFRA", 2300.00),
                new Transaction("TX-105", "GBP", "TRAVEL", 320.00),
                new Transaction("TX-106", "EUR", "CLOUD_INFRA", 900.00),
                new Transaction("TX-107", "USD", "EQUIPMENT", 15000.00)
        );

        // 1. Grouping by Category with downstream summing of total USD spent
        Map<String, Double> spendingByCategory = transactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::category,
                        Collectors.summingDouble(Transaction::amountUsd)
                ));

        System.out.println("Total Spending by Category:");
        spendingByCategory.forEach((cat, total) ->
                System.out.printf("  %-15s -> $%,10.2f%n", cat, total)
        );

        // 2. Partitioning into High-Value Transactions (>= $5,000) vs Standard Transactions
        Map<Boolean, List<String>> highValueSplit = transactions.stream()
                .collect(Collectors.partitioningBy(
                        t -> t.amountUsd() >= 5000.0,
                        Collectors.mapping(Transaction::txId, Collectors.toList())
                ));

        System.out.println("\nHigh-Value Transfers (>= $5,000): " + highValueSplit.get(true));
        System.out.println("Standard Volume Transfers:        " + highValueSplit.get(false));
    }
}
