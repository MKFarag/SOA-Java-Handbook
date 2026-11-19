public class CastingMechanics {
    public static void main(String[] args) {
        int initialCount = 42;
        long widerLong = initialCount;
        double widerDouble = widerLong;
        System.out.println("=== 1. Automatic Widening ===");
        System.out.println("int 42 widened to double: " + widerDouble);

        double exactPrice = 199.95;
        int wholeDollars = (int) exactPrice;
        System.out.println("\n=== 2. Explicit Narrowing ===");
        System.out.println("Original double : " + exactPrice);
        System.out.println("Truncated int   : " + wholeDollars);

        char letter = 'J';
        int asciiCode = letter;
        char restoredLetter = (char) (asciiCode + 1);
        System.out.println("\n=== 3. Char Code Point Conversion ===");
        System.out.println("Char 'J' as code point int: " + asciiCode);
        System.out.println("Code point 75 as char     : " + restoredLetter);

        System.out.println("\n=== 4. String Parsing ===");
        String rawPort = "8080";
        int parsedPort = Integer.parseInt(rawPort.trim());
        System.out.println("Parsed Port Number: " + (parsedPort + 1));
    }
}
