public class NamespaceTransitionInspectorDemo {
    public static void main(String[] args) {
        System.out.println("=== The Great Transition: Java EE to Jakarta EE ===");

        // Historical Milestones
        System.out.println("1. 1999 - 2017: Java EE (Sun Microsystems -> Oracle Corporation)");
        System.out.println("   Package Namespace: javax.* (e.g. javax.servlet.http.HttpServlet)");

        System.out.println("2. 2017: Oracle donates Java EE to Eclipse Foundation.");
        System.out.println("   Oracle retains 'Java' trademark; requires namespace migration.");

        System.out.println("3. 2019: Jakarta EE 8 released (fully identical to Java EE 8, still javax.*).");

        System.out.println("4. 2020: Jakarta EE 9 'Big Bang' migration (namespace permanently switched to jakarta.*).");

        System.out.println("5. Modern Production: Jakarta EE 10 / 11 (Servlet 6.0/6.1, Tomcat 10.1/11).");

        // Inspect runtime Servlet API presence
        try {
            Class<?> servletClass = Class.forName("jakarta.servlet.http.HttpServlet");
            System.out.println("\nActive Servlet API Detected: " + servletClass.getName());
            System.out.println("Namespace: 'jakarta.*' (Modern Jakarta EE Container verified)");
        } catch (ClassNotFoundException e) {
            System.out.println("\nServlet API not on standalone boot classpath (Standard in Java SE runtime)");
        }

        System.out.println("Namespace transition inspection completed successfully.");
    }
}
