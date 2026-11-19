public class OverflowGuardApp {
    public static void main(String[] args) {
        int unitStock = 2_000_000_000;
        int incomingStock = 500_000_000;

        System.out.println("==============================================");
        System.out.println("         WAREHOUSE INVENTORY AUDIT            ");
        System.out.println("==============================================");
        System.out.println("Current Stock : " + unitStock);
        System.out.println("Incoming Stock: " + incomingStock);

        int uncheckedTotal = unitStock + incomingStock;
        System.out.println("\n[DANGER] Unchecked Addition Result: " + uncheckedTotal);
        System.out.println("Notice: 2.5 Billion wrapped around to a negative number!");

        System.out.println("\n[SECURE] Executing Protected Math Calculation...");
        try {
            int safeTotal = Math.addExact(unitStock, incomingStock);
            System.out.println("Safe Total: " + safeTotal);
        } catch (ArithmeticException ex) {
            System.out.println("ALERT PREVENTED: Overflow detected! " + ex.getMessage());
            long widenedTotal = (long) unitStock + incomingStock;
            System.out.println("Fallback Calculation (Widened to long): " + widenedTotal);
        }
        System.out.println("==============================================");
    }
}
