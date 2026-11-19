import java.util.concurrent.StructuredTaskScope;

public class TravelBookingAggregatorApp {
    record FlightQuote(String flightNumber, double priceUsd) {}
    record HotelBooking(String hotelName, double ratePerNight) {}
    record TravelPackage(FlightQuote flight, HotelBooking hotel, double totalEstimatedCost) {}

    public static void main(String[] args) {
        System.out.println("Starting Travel Booking Aggregator...");
        try {
            TravelPackage packageResult = assembleTravelPackage("JFK", "LHR");
            System.out.println("Booking Assembled Successfully:");
            System.out.println("  Flight: " + packageResult.flight().flightNumber() + " ($" + packageResult.flight().priceUsd() + ")");
            System.out.println("  Hotel: " + packageResult.hotel().hotelName() + " ($" + packageResult.hotel().ratePerNight() + "/night)");
            System.out.println("  Total Estimated: $" + packageResult.totalEstimatedCost());
        } catch (Exception e) {
            System.err.println("Travel package assembly failed: " + e.getMessage());
        }
    }

    public static TravelPackage assembleTravelPackage(String origin, String destination) throws InterruptedException {
        try (var scope = StructuredTaskScope.open(StructuredTaskScope.Joiner.allSuccessfulOrThrow())) {
            StructuredTaskScope.Subtask<FlightQuote> flightTask = scope.fork(() -> fetchFlightQuote(origin, destination));
            StructuredTaskScope.Subtask<HotelBooking> hotelTask = scope.fork(() -> fetchHotelReservation(destination));

            scope.join();

            FlightQuote flight = flightTask.get();
            HotelBooking hotel = hotelTask.get();
            double total = flight.priceUsd() + (hotel.ratePerNight() * 3); // 3 nights estimate

            return new TravelPackage(flight, hotel, total);
        }
    }

    private static FlightQuote fetchFlightQuote(String origin, String destination) throws InterruptedException {
        Thread.sleep(60);
        return new FlightQuote("BA-178 (" + origin + "->" + destination + ")", 680.50);
    }

    private static HotelBooking fetchHotelReservation(String city) throws InterruptedException {
        Thread.sleep(40);
        return new HotelBooking("The Kensington Garden Hotel (" + city + ")", 215.00);
    }
}
