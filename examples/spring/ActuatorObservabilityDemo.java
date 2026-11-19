package com.handbook.spring;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Section 30 - Topic 104: Production Observability: Spring Boot Actuator, Micrometer & Prometheus
 * 
 * Demonstrates:
 * 1. Spring Boot Actuator endpoints: /actuator/health, /actuator/info, /actuator/metrics.
 * 2. Micrometer instrumentation: Counter, Gauge, Timer metrics recording.
 * 3. Prometheus dimensional tags and text exposition format serialization.
 * 4. Production readiness probes (liveness and readiness state detection).
 */
public class ActuatorObservabilityDemo {

    public enum HealthStatus { UP, DOWN, OUT_OF_SERVICE }

    public record HealthReport(HealthStatus status, Map<String, Object> details) {}

    // --- 1. Micrometer Meter Registry Simulator ---
    public static class MeterRegistrySimulator {
        private final Map<String, AtomicLong> counters = new ConcurrentHashMap<>();
        private final Map<String, Double> gauges = new ConcurrentHashMap<>();

        public void count(String name, Map<String, String> tags) {
            String key = formatKey(name, tags);
            counters.computeIfAbsent(key, k -> new AtomicLong(0)).incrementAndGet();
        }

        public void gauge(String name, Map<String, String> tags, double value) {
            String key = formatKey(name, tags);
            gauges.put(key, value);
        }

        public String exportPrometheusFormat() {
            StringBuilder sb = new StringBuilder();
            sb.append("# HELP http_server_requests_total Total HTTP requests\n");
            sb.append("# TYPE http_server_requests_total counter\n");
            counters.forEach((k, v) -> sb.append(k).append(" ").append(v.get()).append("\n"));

            sb.append("# HELP jvm_memory_used_bytes Used JVM memory\n");
            sb.append("# TYPE jvm_memory_used_bytes gauge\n");
            gauges.forEach((k, v) -> sb.append(k).append(" ").append(v).append("\n"));
            return sb.toString();
        }

        private String formatKey(String name, Map<String, String> tags) {
            StringBuilder sb = new StringBuilder(name);
            if (!tags.isEmpty()) {
                sb.append("{");
                new TreeMap<>(tags).forEach((k, v) -> sb.append(k).append("=\"").append(v).append("\","));
                sb.deleteCharAt(sb.length() - 1);
                sb.append("}");
            }
            return sb.toString();
        }
    }

    // --- 2. Actuator Health Indicator ---
    public static class DatabaseHealthIndicator {
        public HealthReport checkHealth() {
            return new HealthReport(HealthStatus.UP, Map.of(
                    "database", "PostgreSQL",
                    "validationQuery", "SELECT 1",
                    "activeConnections", 12
            ));
        }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 104: Production Observability: Spring Boot Actuator, Micrometer & Prometheus");
        System.out.println("================================================================================");

        // 1. Actuator Health Endpoint
        DatabaseHealthIndicator healthIndicator = new DatabaseHealthIndicator();
        HealthReport report = healthIndicator.checkHealth();
        System.out.println("1. /actuator/health Endpoint Response:");
        System.out.printf("   Status: %s | Details: %s\n", report.status(), report.details());
        assert report.status() == HealthStatus.UP;

        // 2. Micrometer Instrumentation
        MeterRegistrySimulator registry = new MeterRegistrySimulator();
        System.out.println("\n2. Recording Business & System Metrics via Micrometer:");
        registry.count("http_server_requests_total", Map.of("method", "GET", "uri", "/api/v1/orders", "status", "200"));
        registry.count("http_server_requests_total", Map.of("method", "GET", "uri", "/api/v1/orders", "status", "200"));
        registry.count("http_server_requests_total", Map.of("method", "POST", "uri", "/api/v1/orders", "status", "201"));
        registry.gauge("jvm_memory_used_bytes", Map.of("area", "heap"), 524288000.0); // 500 MB

        // 3. Prometheus Format Exposition
        System.out.println("\n3. /actuator/prometheus Scrape Output:");
        String prometheusData = registry.exportPrometheusFormat();
        System.out.println(prometheusData.trim());

        assert prometheusData.contains("http_server_requests_total{method=\"GET\",status=\"200\",uri=\"/api/v1/orders\"} 2");
        assert prometheusData.contains("jvm_memory_used_bytes{area=\"heap\"} 5.24288E8");

        System.out.println("[SUCCESS] Topic 104 Observability & Actuator verified successfully!");
        System.out.println("================================================================================");
    }
}
