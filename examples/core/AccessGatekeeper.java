public class AccessGatekeeper {
    public static void main(String[] args) {
        String username = "sys_admin";
        boolean isAccountActive = true;
        boolean isEmailVerified = true;
        int failedLoginAttempts = 1;
        String ipCountry = "US";

        System.out.println("==============================================");
        System.out.println("       IDENTITY & ACCESS CONTROL AUDIT        ");
        System.out.println("==============================================");

        if (failedLoginAttempts >= 3) {
            System.out.println("ACCESS DENIED: Account temporarily locked due to excessive failed attempts.");
            return;
        }

        if (!isAccountActive) {
            System.out.println("ACCESS DENIED: Account has been deactivated by administrator.");
            return;
        }

        if (!isEmailVerified) {
            System.out.println("ACCESS DENIED: Please verify your registered email before logging in.");
            return;
        }

        if ("sys_admin".equals(username)) {
            System.out.println("ACCESS GRANTED: Full Root Administrative Privileges Enabled.");
        } else if ("support".equals(username)) {
            System.out.println("ACCESS GRANTED: Tier-2 Read/Diagnostic Access Granted.");
        } else {
            System.out.println("ACCESS GRANTED: Standard Customer Profile Access.");
        }
        System.out.println("Session Origin Verified: " + ipCountry);
        System.out.println("==============================================");
    }
}
