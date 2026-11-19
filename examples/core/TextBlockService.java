public class TextBlockService {
    public static void main(String[] args) {
        String serviceName = "AuthenticationGateway";
        int activeSessions = 342;
        double uptimeHours = 99.98;

        String jsonConfig = """
            {
                "service": "%s",
                "metrics": {
                    "sessions": %d,
                    "uptime": %.2f
                },
                "status": "HEALTHY"
            }
            """.formatted(serviceName, activeSessions, uptimeHours);

        String sqlQuery = """
            SELECT user_id, email, created_at
            FROM system_users
            WHERE account_status = 'ACTIVE'
              AND login_attempts < 3
            ORDER BY created_at DESC;
            """;

        System.out.println("==============================================");
        System.out.println("          SERVICE CONFIGURATION JSON          ");
        System.out.println("==============================================");
        System.out.println(jsonConfig);
        System.out.println("==============================================");
        System.out.println("              DATABASE SQL QUERY              ");
        System.out.println("==============================================");
        System.out.println(sqlQuery);
    }
}
