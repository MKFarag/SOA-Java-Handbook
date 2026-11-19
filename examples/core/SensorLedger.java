public class SensorLedger {
    public static void main(String[] args) {
        int sensorId = 404;
        long timestampEpochMs = 1718000000000L;
        double batteryVoltage = 3.28;
        float signalStrengthDbm = -65.4F;
        char deviceRegion = 'W';
        boolean alertTriggered = batteryVoltage < 3.0;

        System.out.println("----------------------------------------------");
        System.out.println("           IOT TELEMETRY REPORT               ");
        System.out.println("----------------------------------------------");
        System.out.printf("Sensor ID       : #%d (Region: %c)%n", sensorId, deviceRegion);
        System.out.printf("Epoch Timestamp : %d ms%n", timestampEpochMs);
        System.out.printf("Battery Voltage : %.2f V%n", batteryVoltage);
        System.out.printf("Signal Strength : %.1f dBm%n", signalStrengthDbm);
        System.out.printf("Alert Triggered : %s%n", alertTriggered ? "CRITICAL: LOW BATTERY" : "NORMAL");
        System.out.println("----------------------------------------------");
    }
}
