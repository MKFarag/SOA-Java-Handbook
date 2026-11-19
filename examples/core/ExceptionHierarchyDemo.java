public class ExceptionHierarchyDemo {

    public static void inspectStackTrace() {
        try {
            triggerDeepCalculation(0);
        } catch (ArithmeticException ex) {
            System.out.println("=== 1. Inspecting Caught Exception & StackTrace ===");
            System.out.println("Exception Class: " + ex.getClass().getName());
            System.out.println("Message:         " + ex.getMessage());

            StackTraceElement[] frames = ex.getStackTrace();
            System.out.println("Top Stack Frame: " + frames[0].getMethodName() +
                    " at " + frames[0].getFileName() + ":" + frames[0].getLineNumber());
        }
    }

    private static void triggerDeepCalculation(int divisor) {
        int result = 100 / divisor; // Throws ArithmeticException (subclass of RuntimeException)
    }

    public static void main(String[] args) {
        inspectStackTrace();

        System.out.println("\n=== 2. Hierarchy Verification ===");
        ArithmeticException ae = new ArithmeticException("Divide error");
        System.out.println("ae instanceof RuntimeException: " + (ae instanceof RuntimeException));
        System.out.println("ae instanceof Exception:        " + (ae instanceof Exception));
        System.out.println("ae instanceof Throwable:        " + (ae instanceof Throwable));
    }
}
