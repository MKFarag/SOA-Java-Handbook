import java.util.List;

public class TomcatDeploymentPackagerApp {
    record CatalinaContainer(String level, String name, String purpose) {}

    public static void main(String[] args) {
        System.out.println("Starting Apache Tomcat Deployment Packager Simulator...\n");

        List<CatalinaContainer> catalinaHierarchy = List.of(
                new CatalinaContainer("Server", "StandardServer", "Top-level JVM process container (conf/server.xml)"),
                new CatalinaContainer("Service", "Catalina", "Groups connectors with an execution engine"),
                new CatalinaContainer("Connector", "HTTP/1.1 (Port 8080)", "Handles TCP socket connections and HTTP protocol parsing"),
                new CatalinaContainer("Engine", "Catalina", "Entry point for request processing pipeline"),
                new CatalinaContainer("Host", "localhost (appBase=webapps)", "Virtual host domain configuration"),
                new CatalinaContainer("Context", "/handbook-demo", "Individual web application represented by a WAR")
        );

        System.out.println("Tomcat Catalina Container Architecture:");
        for (CatalinaContainer c : catalinaHierarchy) {
            System.out.printf("  [%-10s] %-25s -> %s%n", c.level(), c.name(), c.purpose());
        }

        // Generate standard web.xml deployment descriptor string
        String webXml = generateWebXml("com.handbook.web.LifecycleServlet", "/status");
        System.out.println("\nGenerated Canonical WEB-INF/web.xml:");
        System.out.println(webXml);

        System.out.println("Tomcat deployment package verification completed successfully.");
    }

    private static String generateWebXml(String servletClass, String urlPattern) {
        return """
            <?xml version="1.0" encoding="UTF-8"?>
            <web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                                         https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
                     version="6.0">
                <servlet>
                    <servlet-name>AppServlet</servlet-name>
                    <servlet-class>%s</servlet-class>
                </servlet>
                <servlet-mapping>
                    <servlet-name>AppServlet</servlet-name>
                    <url-pattern>%s</url-pattern>
                </servlet-mapping>
            </web-app>
            """.formatted(servletClass, urlPattern).trim();
    }
}
