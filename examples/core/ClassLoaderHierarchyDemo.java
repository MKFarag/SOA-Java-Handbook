public class ClassLoaderHierarchyDemo {
    public static void main(String[] args) {
        System.out.println("=== ClassLoader Delegation Hierarchy ===");

        // 1. Application ClassLoader (Loads application classes from classpath)
        ClassLoader appLoader = ClassLoaderHierarchyDemo.class.getClassLoader();
        System.out.println("1. Application ClassLoader: " + appLoader.getName() + " (" + appLoader.getClass().getSimpleName() + ")");

        // 2. Platform ClassLoader (Loads Java platform modules, formerly Extension loader)
        ClassLoader platformLoader = appLoader.getParent();
        System.out.println("2. Platform ClassLoader:    " + platformLoader.getName() + " (" + platformLoader.getClass().getSimpleName() + ")");

        // 3. Bootstrap ClassLoader (Native C++ core JVM loader; represented as null in Java)
        ClassLoader bootstrapLoader = platformLoader.getParent();
        System.out.println("3. Bootstrap ClassLoader:   " + bootstrapLoader + " (Native JVM Core)");

        // System Class (java.lang.String) is loaded by Bootstrap ClassLoader
        ClassLoader stringLoader = String.class.getClassLoader();
        System.out.println("\nString.class ClassLoader:   " + stringLoader + " (Bootstrap verified)");
    }
}
