public class FinancialEventMatcherApp {

    public sealed interface FinancialEvent permits DepositEvent, TradeExecutionEvent, FraudAlertEvent {}

    public record DepositEvent(String accountId, double amount, String currency) implements FinancialEvent {}
    public record TradeExecutionEvent(String ticker, int quantity, double pricePerShare) implements FinancialEvent {}
    public record FraudAlertEvent(String accountId, String severityLevel, String reason) implements FinancialEvent {}

    public static String routeFinancialEvent(FinancialEvent event) {
        // Deconstructing records directly in case expressions with guarded predicates
        return switch (event) {
            case DepositEvent(String acc, double amt, String curr) when amt >= 100_000.0 ->
                String.format("[AML AUDIT REQUIRED] Large deposit of %s %.2f to %s", curr, amt, acc);

            case DepositEvent(String acc, double amt, String curr) ->
                String.format("[DEPOSIT CONFIRMED] Credited %s %.2f to account %s", curr, amt, acc);

            case TradeExecutionEvent(String ticker, int qty, double price) when (qty * price) >= 500_000.0 ->
                String.format("[BLOCK TRADE] %d shares of %s executed at $%.2f (Notional: $%.2f)",
                        qty, ticker, price, qty * price);

            case TradeExecutionEvent(String ticker, int qty, double price) ->
                String.format("[RETAIL TRADE] %d shares of %s at $%.2f", qty, ticker, price);

            case FraudAlertEvent(String acc, String sev, String reason) when sev.equalsIgnoreCase("CRITICAL") ->
                String.format("[SECURITY LOCKDOWN] Freezing account %s immediately! Reason: %s", acc, reason);

            case FraudAlertEvent(String acc, String sev, String reason) ->
                String.format("[WARNING] Flagging account %s (%s): %s", acc, sev, reason);
        };
    }

    public static void main(String[] args) {
        System.out.println("=== Financial Event Router with Record Patterns ===");

        FinancialEvent e1 = new DepositEvent("ACC-901", 150_000.0, "USD");
        FinancialEvent e2 = new DepositEvent("ACC-902", 500.0, "EUR");
        FinancialEvent e3 = new TradeExecutionEvent("NVDA", 5_000, 130.0);
        FinancialEvent e4 = new FraudAlertEvent("ACC-774", "CRITICAL", "Concurrent logins from Nigeria and Japan");

        System.out.println(routeFinancialEvent(e1));
        System.out.println(routeFinancialEvent(e2));
        System.out.println(routeFinancialEvent(e3));
        System.out.println(routeFinancialEvent(e4));
    }
}
