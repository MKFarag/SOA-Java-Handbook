public class PrimitivesDemo {
    public static void main(String[] args) {
        byte serverRack = 12;
        short networkPort = 8080;
        int activeUsers = 1_450_200;
        long transactionId = 9_876_543_210L;

        float cpuTemperature = 48.5F;
        double preciseLatency = 0.0034821;

        char statusGrade = 'A';
        boolean isServiceOnline = true;

        System.out.println("=== Java Primitive Types Exploration ===");
        System.out.printf("Byte Range   : [%d to %d], Value: %d%n", Byte.MIN_VALUE, Byte.MAX_VALUE, serverRack);
        System.out.printf("Short Range  : [%d to %d], Value: %d%n", Short.MIN_VALUE, Short.MAX_VALUE, networkPort);
        System.out.printf("Integer Max  : %d, Value: %d%n", Integer.MAX_VALUE, activeUsers);
        System.out.printf("Long Max     : %d, Value: %d%n", Long.MAX_VALUE, transactionId);
        System.out.printf("Float Temp   : %.1f C%n", cpuTemperature);
        System.out.printf("Double Lat   : %.7f seconds%n", preciseLatency);
        System.out.printf("Char Grade   : %c (Unicode int: %d)%n", statusGrade, (int) statusGrade);
        System.out.printf("Online State : %b%n", isServiceOnline);
    }
}
