import java.util.Map;

public class MockHttpServerDispatcherApp {
    record HttpResponse(int statusCode, String statusText, Map<String, String> headers, String body) {}

    public static void main(String[] args) {
        System.out.println("Starting Mock HTTP Server Dispatcher...");

        // Simulate incoming requests
        HttpResponse r1 = dispatch("GET", "/health", "");
        System.out.printf("GET /health       -> %d %s | Body: %s%n", r1.statusCode(), r1.statusText(), r1.body());

        HttpResponse r2 = dispatch("POST", "/api/data", "{\"sensor\": 42}");
        System.out.printf("POST /api/data    -> %d %s | Body: %s%n", r2.statusCode(), r2.statusText(), r2.body());

        HttpResponse r3 = dispatch("GET", "/nonexistent", "");
        System.out.printf("GET /nonexistent  -> %d %s | Body: %s%n", r3.statusCode(), r3.statusText(), r3.body());

        HttpResponse r4 = dispatch("DELETE", "/admin/reset", "");
        System.out.printf("DELETE /admin     -> %d %s | Body: %s%n", r4.statusCode(), r4.statusText(), r4.body());

        System.out.println("HTTP Dispatcher simulation completed successfully.");
    }

    public static HttpResponse dispatch(String method, String uri, String body) {
        if ("GET".equals(method) && "/health".equals(uri)) {
            return new HttpResponse(200, "OK", Map.of("Content-Type", "application/json"), "{\"status\": \"UP\"}");
        }

        if ("POST".equals(method) && "/api/data".equals(uri)) {
            if (body == null || body.isBlank()) {
                return new HttpResponse(400, "Bad Request", Map.of(), "{\"error\": \"Empty body\"}");
            }
            return new HttpResponse(201, "Created", Map.of("Location", "/api/data/101"), "{\"id\": 101}");
        }

        if ("/admin/reset".equals(uri)) {
            return new HttpResponse(403, "Forbidden", Map.of(), "{\"error\": \"Access denied\"}");
        }

        return new HttpResponse(404, "Not Found", Map.of(), "{\"error\": \"Resource not found\"}");
    }
}
