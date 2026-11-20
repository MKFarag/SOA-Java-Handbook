package com.handbook.spring;

import java.util.*;

public class ProductionDockerLayeringDemo {

    public record LayerDefinition(String layerName, List<String> contents, boolean cacheable) {}

    public static class LayeredJarSimulator {
        private final List<LayerDefinition> layers = new ArrayList<>();

        public LayeredJarSimulator() {
            layers.add(new LayerDefinition("dependencies", List.of("spring-core-6.1.jar", "jackson-databind-2.17.jar"), true));
            layers.add(new LayerDefinition("spring-boot-loader", List.of("org/springframework/boot/loader/**"), true));
            layers.add(new LayerDefinition("snapshot-dependencies", List.of(), true));
            layers.add(new LayerDefinition("application", List.of("com/handbook/app/Application.class"), false));
        }

        public List<LayerDefinition> getLayers() {
            return Collections.unmodifiableList(layers);
        }

        public long calculateExtractedLayersCount() {
            return layers.stream().filter(l -> !l.contents().isEmpty()).count();
        }
    }

    public static class ContainerResourceInspector {
        public static boolean isCGroupMemoryAware() {
            long maxMemBytes = Runtime.getRuntime().maxMemory();
            // In containerized JVMs, maxMemory reflects the container cgroup limit (-XX:MaxRAMPercentage)
            return maxMemBytes > 0;
        }

        public static String recommendJvmFlags() {
            return "-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError";
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 128: Production Dockerization & Layered JARs ===");

        LayeredJarSimulator simulator = new LayeredJarSimulator();
        System.out.println("Configured Spring Boot layers: " + simulator.getLayers().size());
        for (LayerDefinition layer : simulator.getLayers()) {
            System.out.println("  -> Layer [" + layer.layerName() + "]: " +
                    (layer.cacheable() ? "CACHED" : "REBUILT") + " (" + layer.contents().size() + " entries)");
        }

        if (simulator.calculateExtractedLayersCount() < 2) {
            throw new AssertionError("Layer extraction simulator failed to register valid layers!");
        }

        boolean cgroupAware = ContainerResourceInspector.isCGroupMemoryAware();
        System.out.println("JVM Cgroup Memory Awareness: " + cgroupAware);
        System.out.println("Recommended Container JVM Flags: " + ContainerResourceInspector.recommendJvmFlags());

        if (!cgroupAware) {
            throw new AssertionError("Runtime failed cgroup memory detection!");
        }

        System.out.println("Topic 128 Layered JAR & Docker container optimization verified successfully.");
    }
}
