public class DiscountCalculator {
    public static void main(String[] args) {
        double cartTotal = 150.00;
        boolean isVipMember = true;
        double discountPercentage;

        if (cartTotal >= 200.0) {
            discountPercentage = 20.0;
        } else if (cartTotal >= 100.0) {
            discountPercentage = isVipMember ? 15.0 : 10.0;
        } else if (cartTotal >= 50.0) {
            discountPercentage = 5.0;
        } else {
            discountPercentage = 0.0;
        }

        double discountAmount = (cartTotal * discountPercentage) / 100.0;
        double finalPrice = cartTotal - discountAmount;

        System.out.println("=== Checkout Discount Summary ===");
        System.out.printf("Cart Subtotal      : $%.2f%n", cartTotal);
        System.out.printf("VIP Membership     : %b%n", isVipMember);
        System.out.printf("Applied Discount   : %.0f%%%n", discountPercentage);
        System.out.printf("Total Savings      : $%.2f%n", discountAmount);
        System.out.printf("Final Price to Pay : $%.2f%n", finalPrice);
    }
}
