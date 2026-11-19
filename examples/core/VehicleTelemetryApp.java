public class VehicleTelemetryApp {

    public static class FleetVehicle {
        private final String vin;
        private String driverName;
        private double latitude;
        private double longitude;
        private double fuelLevelPercent;

        public FleetVehicle(String vin, String driverName, double lat, double lon, double fuel) {
            this.vin = vin;
            this.driverName = driverName;
            this.latitude = lat;
            this.longitude = lon;
            this.fuelLevelPercent = fuel;
        }

        public void updateTelemetry(double newLat, double newLon, double fuelConsumed) {
            this.latitude = newLat;
            this.longitude = newLon;
            this.fuelLevelPercent = Math.max(0.0, this.fuelLevelPercent - fuelConsumed);
        }

        public String getTelemetrySnapshot() {
            return String.format("VIN: %s | Driver: %-12s | GPS: (%.4f, %.4f) | Fuel: %5.1f%%",
                    vin, driverName, latitude, longitude, fuelLevelPercent);
        }

        public String getVin() { return vin; }
        public double getFuelLevelPercent() { return fuelLevelPercent; }
    }

    public static void main(String[] args) {
        System.out.println("=== Fleet Telemetry Management System ===");
        FleetVehicle truck1 = new FleetVehicle("1HGCR2F83HA001", "Marcus Vance", 37.7749, -122.4194, 95.0);
        FleetVehicle truck2 = new FleetVehicle("2C3CDXBG8HH002", "Elena Rostova", 34.0522, -118.2437, 88.5);

        System.out.println("Initial State:");
        System.out.println(truck1.getTelemetrySnapshot());
        System.out.println(truck2.getTelemetrySnapshot());

        System.out.println("\nDispatching Telemetry Updates:");
        truck1.updateTelemetry(37.8044, -122.2712, 12.3);
        truck2.updateTelemetry(34.1012, -118.3245, 8.2);

        System.out.println(truck1.getTelemetrySnapshot());
        System.out.println(truck2.getTelemetrySnapshot());
    }
}
