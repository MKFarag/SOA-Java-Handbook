public class PerformanceTracker {
    public static void main(String[] args) {
        String studentName = "Elena Vance";
        int completedLessons = 12;
        int totalLessons = 15;
        
        double progressPercentage = ((double) completedLessons / totalLessons) * 100.0;
        boolean isComplete = completedLessons >= totalLessons;
        
        System.out.println("----------------------------------------------");
        System.out.println("      JAVA ACADEMY - PROGRESS DISPATCH        ");
        System.out.println("----------------------------------------------");
        System.out.printf("Student Name        : %s%n", studentName);
        System.out.printf("Completed Lessons   : %d / %d%n", completedLessons, totalLessons);
        System.out.printf("Overall Progress    : %.1f%%%n", progressPercentage);
        System.out.printf("Curriculum Finished : %s%n", isComplete ? "YES" : "NO - In Progress");
        System.out.println("----------------------------------------------");
    }
}
