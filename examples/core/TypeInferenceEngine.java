import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TypeInferenceEngine {

    public static void main(String[] args) throws Exception {
        System.out.println("=== Java 10+ Local Variable Type Inference (`var`) ===");

        // 1. Eliminating verbose duplicate generic syntax
        var userRolesMap = new HashMap<String, List<String>>();
        userRolesMap.put("alice", new ArrayList<>(List.of("DEVELOPER", "ADMIN")));
        userRolesMap.put("bob", new ArrayList<>(List.of("VIEWER")));

        // 2. Iterating with var in enhanced for loops
        System.out.println("\n--- User Permissions Table ---");
        for (var entry : userRolesMap.entrySet()) {
            var username = entry.getKey();
            var roles = entry.getValue();
            System.out.printf("User: %-10s | Primary Role: %s | Total Roles: %d%n",
                    username, roles.get(0), roles.size());
        }

        // 3. var in try-with-resources statement
        byte[] payload = "System metric status: OK".getBytes();
        try (var stream = new ByteArrayInputStream(payload)) {
            var bytesRead = stream.readAllBytes();
            var decodedString = new String(bytesRead);
            System.out.println("\nStream processed message: " + decodedString);
        }

        // 4. Verifying inferred types at runtime
        var inferredInt = 42;
        var inferredDouble = 3.14159;
        var inferredString = "Strictly Typed Java";

        System.out.println("\nInferred Types Still Statically Checked:");
        System.out.println("inferredInt class: " + ((Object) inferredInt).getClass().getSimpleName());
        System.out.println("inferredDouble class: " + ((Object) inferredDouble).getClass().getSimpleName());
        System.out.println("inferredString class: " + inferredString.getClass().getSimpleName());
    }
}
