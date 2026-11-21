// Sibling class in same package (package-private top-level class, NOT a nested class)
// Note: Declared outside AccessModifierDemo to prevent Java 11 nestmate private-access sharing!
class SecurityBoundary {
    public String publicName = "PUBLIC: Accessible everywhere";
    protected String protectedRole = "PROTECTED: Accessible in same package or subclasses";
    String packageDefaultToken = "DEFAULT: Accessible only in same package";
    private String privateSecret = "PRIVATE: Accessible only inside SecurityBoundary class";

    public String readPrivateSecretFromInside() {
        return "Inside Class Access -> " + privateSecret;
    }
}

public class AccessModifierDemo {

    public static void main(String[] args) {
        System.out.println("=== Java Access Modifier Boundaries ===");
        SecurityBoundary boundary = new SecurityBoundary();

        // 1. Public: Direct access from any class in any package
        System.out.println(boundary.publicName);

        // 2. Protected: Accessible because AccessModifierDemo is in the same package
        System.out.println(boundary.protectedRole);

        // 3. Package-private / default: Accessible to sibling classes in the same package
        System.out.println(boundary.packageDefaultToken);

        // 4. Private: Inaccessible outside SecurityBoundary!
        // boundary.privateSecret causes COMPILE ERROR: privateSecret has private access in SecurityBoundary
        // Accessible only via public/package-private accessor method:
        System.out.println(boundary.readPrivateSecretFromInside());
    }
}
