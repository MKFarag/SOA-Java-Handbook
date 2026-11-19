public class EnvironmentValidator {
    public static void main(String[] args) {
        long maxHeapBytes = Runtime.getRuntime().maxMemory();
        long maxHeapMB = maxHeapBytes / (1024 * 1024);
        
        String osArch = System.getProperty("os.arch");
        boolean is64Bit = osArch.contains("64");
        
        System.out.println(">>> Checking Development Environment Compliance <<<");
        System.out.printf("Architecture Check : %s (%s)%n", osArch, is64Bit ? "64-bit Compliant" : "32-bit Legacy");
        System.out.printf("Max Heap Memory    : %d MB%n", maxHeapMB);
        
        if (maxHeapMB >= 512 && is64Bit) {
            System.out.println("STATUS: [READY] System meets enterprise Java development standards.");
        } else {
            System.out.println("STATUS: [WARNING] Limited memory or 32-bit runtime detected.");
        }
    }
}
