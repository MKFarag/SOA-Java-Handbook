public class InheritanceMechanics {

    // Base superclass
    public static class Device {
        protected final String brand;
        protected boolean powerStatus;

        public Device(String brand) {
            this.brand = brand;
            this.powerStatus = false;
        }

        public void powerOn() {
            this.powerStatus = true;
            System.out.println(brand + " device powering on (Generic BIOS)");
        }

        // Final method: cannot be overridden by any subclass
        public final String getBrand() {
            return brand;
        }
    }

    // Subclass inheriting Device
    public static class SmartPhone extends Device {
        private int batteryPercent;

        public SmartPhone(String brand, int batteryPercent) {
            super(brand); // Explicit invocation of superclass constructor
            this.batteryPercent = batteryPercent;
        }

        @Override
        public void powerOn() {
            super.powerOn(); // Call superclass implementation
            System.out.printf("SmartPhone UI initialized. Battery at %d%%%n", batteryPercent);
        }

        public int getBatteryPercent() {
            return batteryPercent;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Super Constructor Chaining & Method Overriding ===");
        SmartPhone phone = new SmartPhone("Nexus", 88);
        phone.powerOn();

        System.out.println("\n=== 2. Final Method Invariant ===");
        System.out.println("Brand query (final method): " + phone.getBrand());
    }
}
