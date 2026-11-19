import java.util.HashMap;
import java.util.Map;

public class HttpProtocolParserDemo {
    private static final String RAW_HTTP_REQUEST = """
        POST /api/v1/orders?priority=true HTTP/1.1\r
        Host: api.handbook.com\r
        User-Agent: Java-Handbook-Client/1.0\r
        Content-Type: application/json\r
        Content-Length: 32\r
        Authorization: Bearer sec-token-99\r
        \r
        {"item": "Laptop", "qty": 1}""";

    public static void main(String[] args) {
        System.out.println("=== HTTP/1.1 Wire Protocol Request Parser ===");

        String[] parts = RAW_HTTP_REQUEST.split("\r\n\r\n", 2);
        String headerSection = parts[0];
        String body = parts.length > 1 ? parts[1] : "";

        String[] lines = headerSection.split("\r\n");
        String requestLine = lines[0];

        // Parse Request Line: Method, Path, Protocol
        String[] requestTokens = requestLine.split(" ");
        String method = requestTokens[0];
        String fullPath = requestTokens[1];
        String protocol = requestTokens[2];

        String path = fullPath.contains("?") ? fullPath.substring(0, fullPath.indexOf('?')) : fullPath;
        String queryString = fullPath.contains("?") ? fullPath.substring(fullPath.indexOf('?') + 1) : "";

        System.out.println("1. Request Line:");
        System.out.println("   Method:   " + method);
        System.out.println("   Path URI: " + path);
        System.out.println("   Query:    " + queryString);
        System.out.println("   Protocol: " + protocol);

        // Parse Headers
        Map<String, String> headers = new HashMap<>();
        for (int i = 1; i < lines.length; i++) {
            String line = lines[i];
            int colonIdx = line.indexOf(':');
            if (colonIdx != -1) {
                String key = line.substring(0, colonIdx).trim();
                String val = line.substring(colonIdx + 1).trim();
                headers.put(key, val);
            }
        }

        System.out.println("\n2. Parsed Request Headers (" + headers.size() + "):");
        System.out.println("   Host:         " + headers.get("Host"));
        System.out.println("   Content-Type: " + headers.get("Content-Type"));
        System.out.println("   Auth:         " + headers.get("Authorization"));

        System.out.println("\n3. Payload Body:");
        System.out.println("   " + body);
        System.out.println("HTTP request parsing completed successfully.");
    }
}
