public class ClassMemoryLayout {

    // Static / Class variable: stored on the Java Heap attached to ClassMemoryLayout.class
    private static int totalInstancesCreated = 0;

    // Instance variables: unique to each object allocated on the Heap
    private final int id;
    private String label;

    public ClassMemoryLayout(String label) {
        this.id = ++totalInstancesCreated;
        this.label = label;
    }

    public static int getTotalInstancesCreated() {
        return totalInstancesCreated;
    }

    public int getId() { return id; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public static void main(String[] args) {
        System.out.println("=== 1. Stack References vs Heap Objects ===");
        ClassMemoryLayout obj1 = new ClassMemoryLayout("Alpha");
        ClassMemoryLayout obj2 = new ClassMemoryLayout("Beta");

        System.out.printf("obj1 -> id: %d, label: '%s'%n", obj1.getId(), obj1.getLabel());
        System.out.printf("obj2 -> id: %d, label: '%s'%n", obj2.getId(), obj2.getLabel());
        System.out.println("Total Instances (Static): " + ClassMemoryLayout.getTotalInstancesCreated());

        System.out.println("\n=== 2. Reference Assignment & Aliasing ===");
        ClassMemoryLayout alias = obj1; // 'alias' and 'obj1' point to the identical heap object
        System.out.println("obj1 == alias: " + (obj1 == alias) + " (Same object instance identity)");
        System.out.println("obj1 == obj2: " + (obj1 == obj2) + " (Distinct heap objects)");

        alias.setLabel("Alpha-Modified");
        System.out.println("After mutating via alias -> obj1 label is: " + obj1.getLabel());

        System.out.println("\n=== 3. Dereferencing & GC Eligibility ===");
        obj2 = null; // Original Beta object now has 0 incoming references; eligible for GC!
        System.out.println("obj2 reference cleared to null. Object eligible for JVM GC.");
    }
}
