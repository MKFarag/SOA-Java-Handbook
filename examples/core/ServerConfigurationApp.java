public class ServerConfigurationApp {

    public static class HTTPServerConfig {
        private final String bindAddress;
        private final int port;
        private final int maxThreads;
        private final int timeoutSeconds;

        // Canonical Constructor with validation
        public HTTPServerConfig(String bindAddress, int port, int maxThreads, int timeoutSeconds) {
            if (bindAddress == null || bindAddress.isBlank()) {
                throw new IllegalArgumentException("Bind address cannot be blank.");
            }
            if (port < 1 || port > 65535) {
                throw new IllegalArgumentException("Port out of range (1-65535): " + port);
            }
            if (maxThreads < 1) {
                throw new IllegalArgumentException("Thread pool must have at least 1 thread.");
            }
            if (timeoutSeconds < 0) {
                throw new IllegalArgumentException("Timeout cannot be negative.");
            }

            this.bindAddress = bindAddress;
            this.port = port;
            this.maxThreads = maxThreads;
            this.timeoutSeconds = timeoutSeconds;
        }

        // Convenience Constructor 1: Default threads (200) and timeout (30s)
        public HTTPServerConfig(String bindAddress, int port) {
            this(bindAddress, port, 200, 30);
        }

        // Convenience Constructor 2: Standard production web defaults (0.0.0.0:8080)
        public HTTPServerConfig() {
            this("0.0.0.0", 8080, 200, 30);
        }

        public String describe() {
            return String.format("Server Listening on %s:%d (Max Threads: %d, Timeout: %ds)",
                    bindAddress, port, maxThreads, timeoutSeconds);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Production Server Configuration Profiles ===");

        // Profile 1: Full custom configuration
        HTTPServerConfig customServer = new HTTPServerConfig("127.0.0.1", 9090, 50, 15);
        System.out.println("Custom Config:     " + customServer.describe());

        // Profile 2: Semi-default configuration
        HTTPServerConfig standardServer = new HTTPServerConfig("192.168.1.100", 8443);
        System.out.println("Standard Config:   " + standardServer.describe());

        // Profile 3: Fully defaulted configuration
        HTTPServerConfig defaultServer = new HTTPServerConfig();
        System.out.println("Default Config:    " + defaultServer.describe());
    }
}
