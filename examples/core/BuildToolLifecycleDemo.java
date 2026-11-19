import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class BuildToolLifecycleDemo {
    private static final String SAMPLE_POM_XML = """
        <project xmlns="http://maven.apache.org/POM/4.0.0">
            <modelVersion>4.0.0</modelVersion>
            <groupId>com.handbook.app</groupId>
            <artifactId>order-service</artifactId>
            <version>1.0.0-RELEASE</version>
            <packaging>jar</packaging>
            <dependencies>
                <dependency>
                    <groupId>org.slf4j</groupId>
                    <artifactId>slf4j-api</artifactId>
                    <version>2.0.12</version>
                    <scope>compile</scope>
                </dependency>
                <dependency>
                    <groupId>org.junit.jupiter</groupId>
                    <artifactId>junit-jupiter</artifactId>
                    <version>5.10.2</version>
                    <scope>test</scope>
                </dependency>
            </dependencies>
        </project>
    """;

    record MavenCoordinate(String groupId, String artifactId, String version, String scope) {}

    public static void main(String[] args) throws Exception {
        System.out.println("=== Maven POM.xml & Lifecycle Phases Inspector ===");

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(new ByteArrayInputStream(SAMPLE_POM_XML.getBytes(StandardCharsets.UTF_8)));

        Element root = doc.getDocumentElement();
        String groupId = getTagValue(root, "groupId");
        String artifactId = getTagValue(root, "artifactId");
        String version = getTagValue(root, "version");
        String packaging = getTagValue(root, "packaging");

        System.out.printf("Project Coordinate: %s:%s:%s [%s]%n", groupId, artifactId, version, packaging);

        List<MavenCoordinate> dependencies = new ArrayList<>();
        NodeList depNodes = root.getElementsByTagName("dependency");
        for (int i = 0; i < depNodes.getLength(); i++) {
            Element depElem = (Element) depNodes.item(i);
            dependencies.add(new MavenCoordinate(
                    getTagValue(depElem, "groupId"),
                    getTagValue(depElem, "artifactId"),
                    getTagValue(depElem, "version"),
                    getTagValue(depElem, "scope")
            ));
        }

        System.out.println("\nDeclared Dependencies (" + dependencies.size() + "):");
        for (MavenCoordinate dep : dependencies) {
            System.out.printf("  - %s:%s:%s (Scope: %s)%n",
                    dep.groupId(), dep.artifactId(), dep.version(), dep.scope());
        }

        System.out.println("\nStandard Maven Build Lifecycle:");
        List<String> lifecyclePhases = List.of("validate", "compile", "test", "package", "verify", "install", "deploy");
        for (int i = 0; i < lifecyclePhases.size(); i++) {
            System.out.printf("  Phase %d: mvn %s%n", i + 1, lifecyclePhases.get(i));
        }
        System.out.println("Build tool validation completed successfully.");
    }

    private static String getTagValue(Element parent, String tag) {
        NodeList nl = parent.getElementsByTagName(tag);
        if (nl.getLength() > 0 && nl.item(0).getFirstChild() != null) {
            return nl.item(0).getFirstChild().getNodeValue().trim();
        }
        return "";
    }
}
