public class RuntimeInspector {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("       JAVA RUNTIME & ENVIRONMENT REPORT          ");
        System.out.println("==================================================");
        
        String javaHome = System.getProperty("java.home");
        String javaVersion = System.getProperty("java.version");
        String jvmName = System.getProperty("java.vm.name");
        String jvmVendor = System.getProperty("java.vm.vendor");
        String classVersion = System.getProperty("java.class.version");
        
        System.out.println("Active Java Home   : " + javaHome);
        System.out.println("Java Version       : " + javaVersion);
        System.out.println("JVM Implementation : " + jvmName);
        System.out.println("JVM Vendor         : " + jvmVendor);
        System.out.println("Bytecode Version   : " + classVersion);
        System.out.println("==================================================");
    }
}
