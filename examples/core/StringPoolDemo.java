public class StringPoolDemo {
    public static void main(String[] args) {
        String literal1 = "JavaCore";
        String literal2 = "JavaCore";
        String heapString = new String("JavaCore");

        System.out.println("=== 1. String Pool & Equality ===");
        System.out.println("literal1 == literal2 (Same Memory Ref): " + (literal1 == literal2));
        System.out.println("literal1 == heapString (Diff Memory Ref): " + (literal1 == heapString));
        System.out.println("literal1.equals(heapString) (Text Content): " + literal1.equals(heapString));

        String message = "hello";
        message.toUpperCase();
        System.out.println("\n=== 2. Immutability Check ===");
        System.out.println("Message after unassigned toUpperCase(): " + message);
        message = message.toUpperCase();
        System.out.println("Message after reassignment: " + message);

        System.out.println("\n=== 3. Efficient StringBuilder Assembly ===");
        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append("[EVENT LOG]");
        for (int i = 1; i <= 3; i++) {
            logBuilder.append(" -> Step ").append(i);
        }
        System.out.println("Assembled Log: " + logBuilder.toString());
    }
}
