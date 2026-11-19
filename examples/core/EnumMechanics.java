public class EnumMechanics {

    // Enum with custom fields, constructor, and methods
    public enum Priority {
        LOW(1, "Low priority - batch later"),
        MEDIUM(2, "Standard priority"),
        HIGH(3, "Urgent - process immediately"),
        CRITICAL(4, "Emergency - wake up on-call engineer");

        private final int level;
        private final String description;

        Priority(int level, String description) {
            this.level = level;
            this.description = description;
        }

        public int getLevel() { return level; }
        public String getDescription() { return description; }

        public boolean isUrgent() {
            return this.level >= 3;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Enum Iteration via values() ===");
        for (Priority p : Priority.values()) {
            System.out.printf("Name: %-8s | Ordinal: %d | Level: %d | Urgent: %b%n",
                    p.name(), p.ordinal(), p.getLevel(), p.isUrgent());
        }

        System.out.println("\n=== 2. Enum in Switch Expression ===");
        Priority current = Priority.valueOf("HIGH");
        String action = switch (current) {
            case LOW, MEDIUM -> "Enqueue to background worker";
            case HIGH -> "Process in dedicated VIP thread";
            case CRITICAL -> "Broadcast incident alert to pager";
        };
        System.out.println("Dispatch action: " + action);
    }
}
