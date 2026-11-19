import java.util.ArrayList;
import java.util.List;

public class WarStructureValidatorDemo {
    record WarEntry(String path, boolean isDirectory, long size) {}

    public static void main(String[] args) {
        System.out.println("=== Java Web Archive (WAR) Structure Validator ===");

        // Simulate canonical WAR directory entries
        List<WarEntry> warManifest = List.of(
                new WarEntry("index.html", false, 1024),
                new WarEntry("css/styles.css", false, 2048),
                new WarEntry("WEB-INF/", true, 0),
                new WarEntry("WEB-INF/web.xml", false, 512),
                new WarEntry("WEB-INF/classes/", true, 0),
                new WarEntry("WEB-INF/classes/com/handbook/web/LifecycleServlet.class", false, 4096),
                new WarEntry("WEB-INF/lib/", true, 0),
                new WarEntry("WEB-INF/lib/sqlite-jdbc-3.49.1.0.jar", false, 14000000)
        );

        boolean hasWebInf = false;
        boolean hasWebXml = false;
        boolean hasClasses = false;
        List<String> publicAssets = new ArrayList<>();

        for (WarEntry entry : warManifest) {
            String p = entry.path();
            if (p.startsWith("WEB-INF/")) {
                hasWebInf = true;
                if (p.equals("WEB-INF/web.xml")) hasWebXml = true;
                if (p.startsWith("WEB-INF/classes/")) hasClasses = true;
            } else {
                publicAssets.add(p);
            }
        }

        System.out.println("1. Security Boundary Check:");
        System.out.println("   WEB-INF Root Present:    " + hasWebInf);
        System.out.println("   web.xml Deployment Desk: " + hasWebXml);
        System.out.println("   Compiled Bytecode Area:  " + hasClasses);

        System.out.println("\n2. Direct Client-Accessible Assets (" + publicAssets.size() + "):");
        for (String asset : publicAssets) {
            System.out.println("   - /" + asset);
        }

        System.out.println("\n3. Protected Internal Assets (Clients cannot request directly):");
        System.out.println("   - /WEB-INF/* is strictly blocked by Web Container HTTP connectors.");
        System.out.println("WAR structure validation completed successfully.");
    }
}
