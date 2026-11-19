public class GeoLocationRecordApp {

    public record GeoCoordinate(double latitude, double longitude) {
        public GeoCoordinate {
            if (latitude < -90.0 || latitude > 90.0) {
                throw new IllegalArgumentException("Latitude out of range: " + latitude);
            }
            if (longitude < -180.0 || longitude > 180.0) {
                throw new IllegalArgumentException("Longitude out of range: " + longitude);
            }
        }

        // Great-circle distance using Haversine formula
        public double distanceToKilometers(GeoCoordinate other) {
            final double EARTH_RADIUS_KM = 6371.0;
            double dLat = Math.toRadians(other.latitude - this.latitude);
            double dLon = Math.toRadians(other.longitude - this.longitude);
            double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                    + Math.cos(Math.toRadians(this.latitude)) * Math.cos(Math.toRadians(other.latitude))
                    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return EARTH_RADIUS_KM * c;
        }
    }

    public record DeliveryWaypoint(String locationName, GeoCoordinate coordinate, boolean isPriority) {}

    public static void main(String[] args) {
        System.out.println("=== Geospatial Tracking with Immutable Records ===");

        DeliveryWaypoint warehouse = new DeliveryWaypoint(
                "Central Hub (Chicago)",
                new GeoCoordinate(41.8781, -87.6298),
                false
        );

        DeliveryWaypoint destination = new DeliveryWaypoint(
                "Client Site (New York)",
                new GeoCoordinate(40.7128, -74.0060),
                true
        );

        double distance = warehouse.coordinate().distanceToKilometers(destination.coordinate());
        System.out.printf("Route: %s -> %s%n", warehouse.locationName(), destination.locationName());
        System.out.printf("Direct Flight Distance: %.2f km (Priority: %b)%n", distance, destination.isPriority());
    }
}
