import java.lang.module.ModuleDescriptor;
import java.util.Set;

public class ModuleDescriptorDemo {
    public static void main(String[] args) {
        System.out.println("=== JPMS Module Descriptor Inspection ===");

        // Inspect java.base core module
        Module baseModule = String.class.getModule();
        System.out.println("Current Module Name: " + baseModule.getName());
        System.out.println("Is Named Module:     " + baseModule.isNamed());

        ModuleDescriptor descriptor = baseModule.getDescriptor();
        if (descriptor != null) {
            System.out.println("Descriptor Version:  " + descriptor.version().orElse(null));
            System.out.println("Total Exports:       " + descriptor.exports().size() + " packages");
            System.out.println("IsOpen (Deep Refl):  " + descriptor.isOpen());

            // Check exports of java.util
            boolean exportsJavaUtil = baseModule.isExported("java.util");
            System.out.println("Exports 'java.util': " + exportsJavaUtil);
        }

        // Inspect Unnamed Module for application classpath classes
        Module appModule = ModuleDescriptorDemo.class.getModule();
        System.out.println("\nApplication Class Module Name: '" + appModule.getName() + "' (null = Unnamed Module)");
        System.out.println("Is Named Module: " + appModule.isNamed());
    }
}
