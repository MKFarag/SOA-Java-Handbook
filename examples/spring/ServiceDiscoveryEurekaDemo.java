package com.handbook.spring;

import java.util.*;

public class ServiceDiscoveryEurekaDemo {

    public record ServiceInstance(String serviceId, String host, int port, boolean healthy) {}

    public static class EurekaRegistrySimulator {
        private final Map<String, List<ServiceInstance>> registryMap = new HashMap<>();

        public void registerInstance(ServiceInstance instance) {
            registryMap.computeIfAbsent(instance.serviceId(), k -> new ArrayList<>()).add(instance);
            System.out.printf("  -> [Eureka Register]: %s running on %s:%d%n", 
                instance.serviceId(), instance.host(), instance.port());
        }

        public List<ServiceInstance> getHealthyInstances(String serviceId) {
            return registryMap.getOrDefault(serviceId, List.of()).stream()
                .filter(ServiceInstance::healthy)
                .toList();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 120: Service Discovery & Dynamic Registration ===");

        EurekaRegistrySimulator eureka = new EurekaRegistrySimulator();
        eureka.registerInstance(new ServiceInstance("INVENTORY-SERVICE", "10.0.4.12", 8083, true));
        eureka.registerInstance(new ServiceInstance("INVENTORY-SERVICE", "10.0.4.18", 8083, true));
        eureka.registerInstance(new ServiceInstance("INVENTORY-SERVICE", "10.0.4.99", 8083, false)); // Unhealthy node

        List<ServiceInstance> activeNodes = eureka.getHealthyInstances("INVENTORY-SERVICE");
        System.out.println("Active healthy nodes available for load balancing: " + activeNodes.size());

        if (activeNodes.size() != 2) {
            throw new AssertionError("Eureka healthy instances count mismatch!");
        }

        System.out.println("Topic 120 Service Discovery with Eureka verified successfully.");
    }
}
