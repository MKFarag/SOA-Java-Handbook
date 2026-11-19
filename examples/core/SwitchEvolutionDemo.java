public class SwitchEvolutionDemo {
    public static void main(String[] args) {
        int dayOfWeek = 6;

        System.out.println("=== 1. Classic Switch with Fall-Through ===");
        String dayCategory;
        switch (dayOfWeek) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                dayCategory = "Weekday (Work)";
                break;
            case 6:
            case 7:
                dayCategory = "Weekend (Rest)";
                break;
            default:
                dayCategory = "Invalid Day";
                break;
        }
        System.out.println("Day " + dayOfWeek + " is: " + dayCategory);

        System.out.println("\n=== 2. Modern Switch Expression ===");
        String modernCategory = switch (dayOfWeek) {
            case 1, 2, 3, 4, 5 -> "Weekday (Work)";
            case 6, 7          -> "Weekend (Rest)";
            default            -> "Invalid Day";
        };
        System.out.println("Computed modern result: " + modernCategory);
    }
}
