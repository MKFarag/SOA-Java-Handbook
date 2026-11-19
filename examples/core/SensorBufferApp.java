public class SensorBufferApp {

    // Fixed-size circular buffer for sensor telemetry stream
    public static class TelemetryRingBuffer {
        private final double[] buffer;
        private int head = 0;
        private int size = 0;

        public TelemetryRingBuffer(int capacity) {
            if (capacity <= 0) throw new IllegalArgumentException("Capacity must be positive.");
            this.buffer = new double[capacity];
        }

        public void push(double sample) {
            buffer[head] = sample;
            head = (head + 1) % buffer.length;
            if (size < buffer.length) {
                size++;
            }
        }

        public double calculateAverage() {
            if (size == 0) return 0.0;
            double sum = 0.0;
            for (int i = 0; i < size; i++) {
                sum += buffer[i];
            }
            return sum / size;
        }

        public double findMax() {
            if (size == 0) return 0.0;
            double max = buffer[0];
            for (int i = 1; i < size; i++) {
                if (buffer[i] > max) {
                    max = buffer[i];
                }
            }
            return max;
        }

        public int getSize() {
            return size;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Industrial IoT Telemetry Ring Buffer ===");
        TelemetryRingBuffer ring = new TelemetryRingBuffer(5);

        // Stream initial samples
        double[] incomingStream = { 22.4, 23.1, 22.8, 24.5, 25.0, 26.2, 27.1 };

        for (double sample : incomingStream) {
            ring.push(sample);
            System.out.printf("Streamed %4.1f C -> Current Avg: %5.2f C | Peak: %4.1f C | Samples in window: %d%n",
                    sample, ring.calculateAverage(), ring.findMax(), ring.getSize());
        }
    }
}
