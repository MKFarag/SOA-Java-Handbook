import java.util.List;

public class ServerCompatibilityMatrixApp {
    record CompatibilityEntry(
            String serverName,
            String serverVersion,
            String jakartaVersion,
            String servletSpec,
            String namespace,
            int minimumJavaVersion
    ) {}

    public static void main(String[] args) {
        System.out.println("Starting Server Compatibility Matrix Evaluator...\n");

        List<CompatibilityEntry> matrix = List.of(
                new CompatibilityEntry("Apache Tomcat", "9.0.x", "Java EE 8", "Servlet 4.0", "javax.*", 8),
                new CompatibilityEntry("Apache Tomcat", "10.1.x", "Jakarta EE 10", "Servlet 6.0", "jakarta.*", 11),
                new CompatibilityEntry("Apache Tomcat", "11.0.x", "Jakarta EE 11", "Servlet 6.1", "jakarta.*", 17),
                new CompatibilityEntry("Eclipse Jetty", "11.x", "Jakarta EE 9", "Servlet 5.0", "jakarta.*", 11),
                new CompatibilityEntry("Eclipse Jetty", "12.x", "Jakarta EE 10/11", "Servlet 6.0", "jakarta.*", 17),
                new CompatibilityEntry("WildFly", "30.x+", "Jakarta EE 10", "Full Profile", "jakarta.*", 17),
                new CompatibilityEntry("Eclipse GlassFish", "7.0.x", "Jakarta EE 10", "Full Profile", "jakarta.*", 17)
        );

        System.out.printf("%-18s | %-10s | %-15s | %-12s | %-10s | Min Java%n",
                "Server", "Version", "EE Level", "Servlet Spec", "Namespace");
        System.out.println("-".repeat(82));

        for (CompatibilityEntry entry : matrix) {
            System.out.printf("%-18s | %-10s | %-15s | %-12s | %-10s | Java %d+%n",
                    entry.serverName(), entry.serverVersion(), entry.jakartaVersion(),
                    entry.servletSpec(), entry.namespace(), entry.minimumJavaVersion());
        }

        System.out.println("\nRule: Any application compiled against 'jakarta.*' WILL NOT run on Tomcat 9.");
        System.out.println("Rule: Any application compiled against 'javax.*' WILL NOT run on Tomcat 10+ (without byte-code migration).");
        System.out.println("Server compatibility evaluation completed successfully.");
    }
}
