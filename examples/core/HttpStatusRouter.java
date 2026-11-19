public class HttpStatusRouter {
    public static void main(String[] args) {
        int httpStatusCode = 503;

        String actionPlan = switch (httpStatusCode) {
            case 200, 201, 204 -> "SUCCESS: Deliver response payload to client.";
            case 301, 302 -> "REDIRECT: Follow Location header to target URI.";
            case 400, 422 -> "VALIDATION FAILURE: Prompt user to verify request body.";
            case 401, 403 -> "SECURITY ALERT: Audit credentials or reject session.";
            case 404 -> "ROUTING ERROR: Endpoint does not exist.";
            case 500, 502, 503 -> {
                System.out.println("[AUDIT LOG] Critical Server Degradation Detected: HTTP " + httpStatusCode);
                yield "INCIDENT LOGGED: Dispatching pager alert to On-Call Engineer.";
            }
            default -> {
                yield "UNKNOWN STATUS: Log anomaly code " + httpStatusCode;
            }
        };

        System.out.println("==============================================");
        System.out.println("         GATEWAY ROUTER RESOLUTION            ");
        System.out.println("==============================================");
        System.out.println("Incoming HTTP Code : " + httpStatusCode);
        System.out.println("Resolved Action    : " + actionPlan);
        System.out.println("==============================================");
    }
}
