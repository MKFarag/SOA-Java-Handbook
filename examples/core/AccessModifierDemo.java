public class AccessModifierDemo {

    public static class SecurityBoundary {
        public String publicName = "PUBLIC: Accessible everywhere";
        protected String protectedRole = "PROTECTED: Accessible in same package or subclasses";
        String packageDefaultToken = "DEFAULT: Accessible only in same package";
        private String privateSecret = "PRIVATE: Accessible only inside SecurityBoundary class";

        public String readPrivateSecretFromInside() {
            return "Inside Class Access -> " + privateSecret;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Java Access Modifier Boundaries ===");
        SecurityBoundary boundary = new SecurityBoundary();

        // 1. Public: Direct access
        System.out.println(boundary.publicName);

        // 2. Protected: Accessible because AccessModifierDemo is in the same package
        System.out.println(boundary.protectedRole);

        // 3. Package-private / default: Accessible in same package
        System.out.println(boundary.packageDefaultToken);

        // 4. Private: Inaccessible directly (boundary.privateSecret would cause compile error)
        // Accessible only via public getter method
        System.out.println(boundary.readPrivateSecretFromInside());
    }
}
