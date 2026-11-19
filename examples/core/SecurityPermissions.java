public class SecurityPermissions {
    public static final int PERM_READ    = 1 << 0; // 0001 (1)
    public static final int PERM_WRITE   = 1 << 1; // 0010 (2)
    public static final int PERM_EXECUTE = 1 << 2; // 0100 (4)
    public static final int PERM_DELETE  = 1 << 3; // 1000 (8)

    public static void main(String[] args) {
        int userRole = PERM_READ | PERM_WRITE;

        System.out.println("==============================================");
        System.out.println("          BITMASK ACCESS CONTROL              ");
        System.out.println("==============================================");
        System.out.println("User Role Mask Binary: " + Integer.toBinaryString(userRole));

        boolean canRead = (userRole & PERM_READ) != 0;
        boolean canDelete = (userRole & PERM_DELETE) != 0;

        System.out.println("Has READ Access   : " + canRead);
        System.out.println("Has DELETE Access : " + canDelete);

        userRole |= PERM_EXECUTE;
        boolean canExecute = (userRole & PERM_EXECUTE) != 0;
        System.out.println("After Grant -> Has EXECUTE Access: " + canExecute);

        userRole &= ~PERM_WRITE;
        boolean canWriteAfterRevoke = (userRole & PERM_WRITE) != 0;
        System.out.println("After Revoke -> Has WRITE Access : " + canWriteAfterRevoke);
        System.out.println("==============================================");
    }
}
