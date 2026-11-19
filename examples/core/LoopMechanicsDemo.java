public class LoopMechanicsDemo {
    public static void main(String[] args) {
        System.out.println("=== 1. Standard for Loop (Odd numbers only) ===");
        for (int i = 1; i <= 6; i++) {
            if (i % 2 == 0) {
                continue;
            }
            System.out.print(i + " ");
        }
        System.out.println();

        System.out.println("\n=== 2. Enhanced for-each Loop ===");
        String[] servers = {"auth-01", "api-01", "db-primary"};
        for (String server : servers) {
            System.out.println("Checking node: " + server);
        }

        System.out.println("\n=== 3. while Loop (Retry Backoff) ===");
        int attempts = 1;
        int delayMs = 100;
        while (attempts <= 3) {
            System.out.printf("Attempt #%d: waiting %d ms...%n", attempts, delayMs);
            delayMs *= 2;
            attempts++;
        }

        System.out.println("\n=== 4. do-while Loop ===");
        int token = 0;
        do {
            System.out.println("Generated handshake token: " + (++token));
        } while (token < 1);
    }
}
