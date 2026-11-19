public class RecordMechanics {

    // Record with compact constructor validation
    public record UserProfile(String username, String email, int reputationScore) {

        // Compact constructor: no parameter list; runs before field assignment
        public UserProfile {
            if (username == null || username.isBlank()) {
                throw new IllegalArgumentException("Username cannot be blank.");
            }
            if (email == null || !email.contains("@")) {
                throw new IllegalArgumentException("Valid email required.");
            }
            if (reputationScore < 0) {
                reputationScore = 0; // Compact constructor can mutate component parameters
            }
        }

        // Custom instance method inside record
        public boolean isTopContributor() {
            return reputationScore >= 1000;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Java 16+ Record Instantiation & Components ===");
        UserProfile user1 = new UserProfile("alex_dev", "alex@enterprise.com", 1450);
        UserProfile user2 = new UserProfile("alex_dev", "alex@enterprise.com", 1450);

        // Component accessors do not use 'get' prefix
        System.out.println("Username: " + user1.username());
        System.out.println("Email:    " + user1.email());
        System.out.println("Score:    " + user1.reputationScore());
        System.out.println("Top Star: " + user1.isTopContributor());

        System.out.println("\n=== 2. Auto-generated equals, hashCode & toString ===");
        System.out.println("user1.toString(): " + user1);
        System.out.println("user1.equals(user2): " + user1.equals(user2));
        System.out.println("user1.hashCode() == user2.hashCode(): " + (user1.hashCode() == user2.hashCode()));

        System.out.println("\n=== 3. Compact Constructor Invariant Enforcement ===");
        UserProfile negativeScoreUser = new UserProfile("newbie", "new@test.com", -50);
        System.out.println("Clamped score: " + negativeScoreUser.reputationScore());
    }
}
