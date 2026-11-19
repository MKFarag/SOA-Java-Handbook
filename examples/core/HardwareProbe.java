public class HardwareProbe {
    public static void main(String[] args) {
        int availableProcessors = Runtime.getRuntime().availableProcessors();
        long maxMemoryMB = Runtime.getRuntime().maxMemory() / (1024 * 1024);
        
        System.out.println("=== Java Virtual Machine Execution Environment ===");
        System.out.println("Host CPU Cores Available to JVM: " + availableProcessors);
        System.out.println("Max Memory Available to JVM: " + maxMemoryMB + " MB");
        System.out.println("Java Specification Version: " + System.getProperty("java.specification.version"));
    }
}
