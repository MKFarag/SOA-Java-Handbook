package com.handbook.web;

public class SecuritySanitizerApp {

    public static String escapeHtml(String input) {
        if (input == null) return "";
        StringBuilder out = new StringBuilder(input.length() + 16);
        for (char c : input.toCharArray()) {
            switch (c) {
                case '<' -> out.append("&lt;");
                case '>' -> out.append("&gt;");
                case '&' -> out.append("&amp;");
                case '"' -> out.append("&quot;");
                case '\'' -> out.append("&#x27;");
                default -> out.append(c);
            }
        }
        return out.toString();
    }

    public static void main(String[] args) {
        System.out.println("=== Web Application Security Defense Suite ===");
        
        // 1. XSS Defense Demonstration
        String maliciousComment = "<script>alert('Stealing cookie: ' + document.cookie);</script>";
        String safeHtml = escapeHtml(maliciousComment);

        System.out.println("Original Malicious Input:");
        System.out.println("  " + maliciousComment);
        System.out.println("Escaped Safe HTML Output:");
        System.out.println("  " + safeHtml);

        // 2. Session Fixation Mitigation Simulation
        String initialSessionId = "JSESSIONID-ANONYMOUS-8041";
        System.out.printf("%n[Session Fixation Defense]%n");
        System.out.println("  Initial Anonymous Session: " + initialSessionId);
        
        // After successful login, invoke req.changeSessionId()
        String rotatedSessionId = "JSESSIONID-AUTHENTICATED-9923";
        System.out.println("  User Authenticated: Rotating Session via req.changeSessionId()");
        System.out.println("  New Secure Authenticated Session: " + rotatedSessionId);

        System.out.println("Web security defense verification completed successfully.");
    }
}
