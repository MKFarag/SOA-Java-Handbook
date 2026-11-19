---
id: 104
title: "Production Observability: Spring Boot Actuator, Micrometer & Prometheus"
sectionId: 30
part: "Part 3: Spring Boot & The Modern Production Ecosystem"
order: 104
summary: "Master enterprise observability in Spring Boot: Actuator endpoints, Kubernetes liveness/readiness probes, dimensional metrics collection with Micrometer, and Prometheus text exposition format scraping."
keyTakeaways:
  - "Observability rests on three pillars: Metrics (numerical time-series data), Logs (discrete event records), and Traces (distributed request journeys across microservices)."
  - "Spring Boot Actuator exposes production-ready endpoints (`/actuator/health`, `/actuator/metrics`, `/actuator/prometheus`, `/actuator/info`) for container orchestration and infrastructure monitoring."
  - "Kubernetes relies on `/actuator/health/liveness` to restart crashed pods and `/actuator/health/readiness` to route network traffic only when database migrations and caches are warmed up."
  - "Micrometer acts as the SLF4J of metrics: it abstracts instrumentation into universal primitives (`Counter`, `Gauge`, `Timer`) that seamlessly export to Prometheus, Datadog, CloudWatch, or Grafana."
---

# Production Observability: Spring Boot Actuator, Micrometer & Prometheus

Running microservices in cloud environments (like Kubernetes or AWS ECS) requires comprehensive visibility into application runtime health, garbage collection overhead, thread pool saturation, and HTTP response latencies. **Spring Boot Actuator** combined with **Micrometer** provides a standardized, battle-tested observability engine.

---

## 1. Spring Boot Actuator Endpoints

Actuator automatically provides management endpoints over HTTP or JMX:

| Endpoint | Purpose | Default State |
| :--- | :--- | :--- |
| `/actuator/health` | Application status (`UP`, `DOWN`) and subsystem health indicators | Enabled (restricted summary) |
| `/actuator/info` | Git commit metadata, build timestamps, and application version | Enabled |
| `/actuator/metrics` | Inventory of all dimensional metrics in JVM memory | Disabled by default |
| `/actuator/prometheus` | Prometheus-formatted metrics scrape target | Disabled by default |
| `/actuator/env` | Active configuration properties and environment variables | Disabled (sensitive) |

Exposing management endpoints securely in `application.yml`:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true # Enables /actuator/health/liveness and /actuator/health/readiness
```

---

## 2. Kubernetes Probes: Liveness vs Readiness

```mermaid
flowchart TD
    subgraph Kubernetes Kubelet
        K1["Liveness Probe (GET /actuator/health/liveness)"]
        K2["Readiness Probe (GET /actuator/health/readiness)"]
    end

    subgraph Pod Lifecycle
        P1["Is JVM Deadlocked / OOM?"]
        P2["Are Database Connections Open & Caches Warm?"]
    end

    K1 --> P1
    P1 -->|"If DOWN"| R1["Restart Container Immediately"]
    K2 --> P2
    P2 -->|"If DOWN"| R2["Temporarily Detach from K8s Service Ingress"]
```

---

## 3. Micrometer: Dimensional Metrics & Prometheus

Micrometer structures metrics using **dimensional tags** (key-value pairs), allowing DevOps teams to slice and aggregate metrics dynamically in Grafana:

```java
@Service
public class OrderProcessingService {

    private final Counter orderCounter;
    private final Timer orderProcessingTimer;

    public OrderProcessingService(MeterRegistry registry) {
        this.orderCounter = Counter.builder("orders.placed.total")
            .description("Total placed orders")
            .tag("channel", "mobile")
            .tag("region", "us-east")
            .register(registry);

        this.orderProcessingTimer = Timer.builder("orders.processing.duration")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(registry);
    }

    public void processOrder(Order order) {
        orderProcessingTimer.record(() -> {
            // Business logic
            orderCounter.increment();
        });
    }
}
```

---

## 4. Verification & Architecture Demo

The executable architecture demo `examples/spring/ActuatorObservabilityDemo.java` implements:
- `DatabaseHealthIndicator` simulating Actuator `/actuator/health` response formatting.
- `MeterRegistrySimulator` tracking dimensional counters and gauges with sorted tags.
- Prometheus text format serializer exporting metrics for scrapers.

Compile and run the verified test:
```bash
javac -d examples/web/classes examples/spring/ActuatorObservabilityDemo.java
java -ea -cp examples/web/classes com.handbook.spring.ActuatorObservabilityDemo
```
