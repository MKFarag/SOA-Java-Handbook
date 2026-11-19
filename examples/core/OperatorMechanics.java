public class OperatorMechanics {
    public static void main(String[] args) {
        int a = 5;
        int prefixResult = ++a;
        
        int b = 5;
        int postfixResult = b++;

        System.out.println("=== 1. Prefix vs Postfix ===");
        System.out.printf("Prefix  : a=%d, result=%d%n", a, prefixResult);
        System.out.printf("Postfix : b=%d, result=%d%n", b, postfixResult);

        System.out.println("\n=== 2. Division Behavior ===");
        int intDiv = 7 / 2;
        double floatDiv = 7.0 / 2;
        int remainder = 7 % 2;
        System.out.println("7 / 2 (Integer)   = " + intDiv);
        System.out.println("7.0 / 2 (Floating)= " + floatDiv);
        System.out.println("7 % 2 (Remainder) = " + remainder);

        System.out.println("\n=== 3. Short-Circuit Evaluation ===");
        String username = null;
        boolean isValid = (username != null) && (username.length() > 3);
        System.out.println("Safely checked null string without crash: " + isValid);
    }
}
