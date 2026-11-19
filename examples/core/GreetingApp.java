public class GreetingApp {
    public static void main(String[] args) {
        String learnerName = args.length > 0 ? args[0] : "Student";
        int targetHours = 10;
        
        System.out.println("==========================================");
        System.out.println(" Welcome to Modern Java Engineering!     ");
        System.out.println("==========================================");
        System.out.printf("Learner: %s%n", learnerName);
        System.out.printf("Weekly Target: %d hours%n", targetHours);
        System.out.println("Status: Ready to compile and build.");
    }
}
