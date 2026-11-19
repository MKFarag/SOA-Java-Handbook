import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

/**
 * Topic 36: The Set Hierarchy - Realistic Application
 * Demonstrates visitor telemetry tracking: fast deduplication with HashSet,
 * chronological visit tracking with LinkedHashSet, and score ranking with TreeSet.
 */
public class UniqueVisitorTrackerApp {

    public static class AnalyticsTracker {
        // Fast deduplication
        private final Set<String> uniqueVisitorIds = new HashSet<>();
        // Chronological arrival record
        private final Set<String> arrivalTimeline = new LinkedHashSet<>();
        // Leaderboard ranking by score
        private final Set<Integer> uniqueLeaderboardScores = new TreeSet<>();

        public boolean recordVisit(String visitorId, int userScore) {
            boolean isNewVisitor = uniqueVisitorIds.add(visitorId);
            if (isNewVisitor) {
                arrivalTimeline.add(visitorId);
            }
            uniqueLeaderboardScores.add(userScore);
            return isNewVisitor;
        }

        public int getTotalUniqueVisitors() {
            return uniqueVisitorIds.size();
        }

        public Set<String> getArrivalTimeline() {
            return Set.copyOf(arrivalTimeline);
        }

        public Integer getHighestScore() {
            return ((TreeSet<Integer>) uniqueLeaderboardScores).last();
        }

        public Integer getLowestScore() {
            return ((TreeSet<Integer>) uniqueLeaderboardScores).first();
        }
    }

    public static void main(String[] args) {
        AnalyticsTracker tracker = new AnalyticsTracker();

        tracker.recordVisit("usr-node-01", 350);
        tracker.recordVisit("usr-node-02", 920);
        tracker.recordVisit("usr-node-01", 350); // Duplicate visit
        tracker.recordVisit("usr-node-03", 510);
        tracker.recordVisit("usr-node-04", 180);

        System.out.println("Unique Visitors Count: " + tracker.getTotalUniqueVisitors());
        System.out.println("Arrival Order: " + tracker.getArrivalTimeline());
        System.out.println("Highest Leaderboard Score: " + tracker.getHighestScore());
        System.out.println("Lowest Leaderboard Score: " + tracker.getLowestScore());
    }
}
