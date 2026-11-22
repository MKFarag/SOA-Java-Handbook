---
id: topic-118
slug: server-sent-events-http-streaming
topicNumber: 118
title: Server-Sent Events (SSE) & Reactive HTTP Streaming
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 34
sectionTitle: Real-Time Web & Asynchronous Streaming
versionBadge: Spring Framework 6.x / Boot 3.x
difficulty: Intermediate
readingTime: 16 min read
shortDescription: >-
  Implement lightweight unidirectional real-time event streaming in Spring Boot:
  SseEmitter lifecycle, MIME text/event-stream, client auto-reconnection via
  Last-Event-ID, and high-concurrency event broadcasting.
prerequisites:
  - 'Topic 64: Web Architecture Fundamentals (HTTP Protocol, Client-Server)'
  - 'Topic 92: Production REST Controller Architecture with Spring Web MVC'
  - >-
    Topic 118: Real-Time Bidirectional Communication with WebSockets, STOMP &
    SockJS
---
## Overview
Server-Sent Events (SSE) provide unidirectional, HTTP-based real-time event streaming from server to client over standard text/event-stream connections using SseEmitter and automatic browser reconnection.

---

---

## Architecture & Core Mechanics

### Exposing an SSE Endpoint with `SseEmitter`

In Spring MVC, streaming is enabled by returning an instance of `SseEmitter`:

```java
@RestController
@RequestMapping("/api/v1/telemetry")
public class TelemetryStreamController {

    private final TelemetryBroadcaster broadcaster;

    public TelemetryStreamController(TelemetryBroadcaster broadcaster) {
        this.broadcaster = broadcaster;
    }

    @GetMapping(value = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamTelemetry() {
        // Set timeout: 30 minutes (0L means no timeout)
        SseEmitter emitter = new SseEmitter(1800_000L);
        broadcaster.register(emitter);
        return emitter;
    }
}
```

---

### Managing Emitter Lifecycles & Thread Safety

Because clients can close browser tabs or lose Wi-Fi at any moment, servers must clean up disconnected emitters to prevent memory leaks:

```java
@Component
public class TelemetryBroadcaster {

    // Thread-safe collection of active client streams
    private final List<SseEmitter> activeEmitters = new CopyOnWriteArrayList<>();

    public void register(SseEmitter emitter) {
        this.activeEmitters.add(emitter);

        // Lifecycle callbacks
        emitter.onCompletion(() -> activeEmitters.remove(emitter));
        emitter.onTimeout(() -> {
            emitter.complete();
            activeEmitters.remove(emitter);
        });
        emitter.onError(throwable -> activeEmitters.remove(emitter));
    }

    public void broadcast(String eventName, Object data) {
        List<SseEmitter> deadEmitters = new ArrayList<>();

        for (SseEmitter emitter : activeEmitters) {
            try {
                emitter.send(SseEmitter.event()
                    .name(eventName)
                    .id(UUID.randomUUID().toString())
                    .data(data)
                    .reconnectTime(5000L) // Suggests 5s retry delay to browser
                );
            } catch (IOException ex) {
                deadEmitters.add(emitter);
            }
        }
        activeEmitters.removeAll(deadEmitters);
    }
}
```

---

### Consuming SSE in JavaScript Client

```javascript
const eventSource = new EventSource('/api/v1/telemetry/live');

eventSource.addEventListener('temperature_alert', (event) => {
    const payload = JSON.parse(event.data);
    console.log('Live Alert:', payload);
});

eventSource.onerror = (err) => {
    console.error('SSE Stream Error. Browser will automatically retry...');
};
```

---

## Production Implementation

### Basic Example: Simulating SSE Format Serialization
```java
package com.handbook.spring;

public class BasicSseFormattingDemo {

    public static String formatSseMessage(String id, String event, String data) {
        return "id: " + id + "\n" +
               "event: " + event + "\n" +
               "retry: 3000\n" +
               "data: " + data + "\n\n";
    }

    public static void main(String[] args) {
        System.out.println("--- Spring Web: Standard SSE Frame Formatting ---");
        String frame = formatSseMessage("101", "stock_tick", "{\"symbol\":\"GOOGL\",\"price\":185.20}");
        System.out.print(frame);
    }
}
```

**Expected Terminal Output:**
```text
--- Spring Web: Standard SSE Frame Formatting ---
id: 101
event: stock_tick
retry: 3000
data: {"symbol":"GOOGL","price":185.20}
```

---

### Realistic Enterprise Example: Verified ServerSentEventsStreamingDemo
```java
package com.handbook.spring;

import java.util.*;

public class ServerSentEventsStreamingDemo {

    public record StreamEvent(String eventType, String payload) {}

    public static class SseBroadcastChannel {
        private final List<StreamEvent> eventStream = new ArrayList<>();

        public void pushEvent(String eventType, String payload) {
            StreamEvent event = new StreamEvent(eventType, payload);
            eventStream.add(event);
            System.out.printf("  -> [SSE Push]: event=%s | data=%s%n", event.eventType(), event.payload());
        }

        public int getDeliveredEventCount() { return eventStream.size(); }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 119: Server-Sent Events (SSE) & HTTP Streaming ===");

        SseBroadcastChannel channel = new SseBroadcastChannel();
        channel.pushEvent("BUILD_STATUS", "{\"step\":\"COMPILE\",\"status\":\"SUCCESS\"}");
        channel.pushEvent("BUILD_STATUS", "{\"step\":\"UNIT_TESTS\",\"status\":\"181_PASSED\"}");
        channel.pushEvent("DEPLOY_STATUS", "{\"target\":\"KUBERNETES_PROD\",\"status\":\"ROLLOUT_COMPLETE\"}");

        System.out.println("Total real-time SSE stream events delivered: " + channel.getDeliveredEventCount());

        if (channel.getDeliveredEventCount() != 3) {
            throw new AssertionError("SSE stream event count mismatch!");
        }

        System.out.println("Topic 119 Server-Sent Events and HTTP streaming verified successfully.");
    }
}
```

---

## Common Pitfalls & Traps

### Pitfall 1: Memory Leaks from Orphaned Emitter References
- **Symptom:** JVM heap memory climbs steadily until `OutOfMemoryError` occurs after several days in production.
- **Cause:** When a client closes their browser, the connection is severed on the client side. If the server does not register `onCompletion` and `onTimeout` callbacks to remove the emitter from the active subscriber list, the dead emitter objects remain referenced in the heap forever.
- **Diagnosis & Fix:** Always use a thread-safe collection (`CopyOnWriteArrayList`) and purge dead emitters in `onCompletion`, `onTimeout`, and catch blocks on `send()`.

### Pitfall 2: Intermediate Reverse Proxy Buffering
- **Symptom:** SSE events are not received in real-time; instead, the browser freezes for 30 seconds and then suddenly receives a batch of 50 events all at once.
- **Cause:** Reverse proxies (NGINX, Cloudflare, AWS ALB) buffer HTTP chunked responses to optimize packet compression unless told otherwise.
- **Diagnosis & Fix:** Disable proxy buffering by sending the `X-Accel-Buffering: no` HTTP header:
  ```java
  response.setHeader("X-Accel-Buffering", "no");
  ```

### Pitfall 3: Browser HTTP/1.1 Maximum 6-Connection Limit
- **Symptom:** Opening 6 browser tabs with active SSE connections causes the 7th tab to hang indefinitely.
- **Cause:** The HTTP/1.1 specification limits browsers to 6 concurrent TCP connections per domain.
- **Diagnosis & Fix:** Deploy your production application over **HTTP/2**. In HTTP/2, dozens of concurrent SSE streams multiplex over a single TCP connection, eliminating the 6-connection limit.

---

## Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **Transport Protocol** | Always deploy SSE over HTTP/2 | Eliminates browser connection limits via multiplexed streaming. |
| **Proxy Buffering** | Send `X-Accel-Buffering: no` | Prevents NGINX and Cloudflare from holding events in memory buffers. |
| **Heartbeat Pings** | Send empty comment `:keepalive\n\n` every 15s | Prevents intermediate cloud load balancers from closing idle connections. |
| **Client Reconnect** | Supply `.reconnectTime(5000L)` | Controls client reconnection rate to protect backend from thundering herds. |

---

## Version Notes & Compatibility

- **Spring 4.x / 5.x:** Introduced `SseEmitter` and `ResponseBodyEmitter`.
- **Spring 6.x (Spring Boot 3.x):**
  - Enhanced asynchronous request processing backed by Jakarta Servlet 6.0 asynchronous I/O.
  - Native integration with Spring WebFlux `Flux<ServerSentEvent<T>>`.

---

## Summary & Cheat Sheet

| Feature | Server-Sent Events (SSE) | WebSockets |
| :--- | :--- | :--- |
| **Directionality** | Unidirectional (Server -> Client) | **Full-Duplex (Bidirectional)** |
| **Protocol** | Standard HTTP/1.1 or HTTP/2 | TCP WebSocket Upgrade (`ws://`) |
| **Firewall Friendliness**| Native (Standard port 80 / 443 HTTP) | Requires WebSocket-aware proxies |
| **Auto-Reconnection** | **Built-in natively by browsers** | Requires custom client reconnect code |
| **Data Format** | UTF-8 Text (`text/event-stream`) | Binary or Text |
| **Best Used For** | Dashboards, news feeds, AI token streaming | Chat apps, multiplayer gaming, collaborative boards |

---

## Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Leaking SseEmitter Collection Trap
Review the following controller:
```java
@RestController
public class LiveNewsController {
    private final List<SseEmitter> clients = new ArrayList<>();

    @GetMapping("/news/stream")
    public SseEmitter streamNews() {
        SseEmitter emitter = new SseEmitter();
        clients.add(emitter);
        return emitter;
    }
}
```
What two major production disasters will occur under high concurrent traffic?

<details>
<summary>View Solution</summary>

**Disasters:**
1. **Concurrency Failure:** `ArrayList` is not thread-safe. Concurrent client connections will trigger `ConcurrentModificationException` during broadcast or corrupt the internal array.
2. **Permanent Memory Leak:** Dead or closed emitters are never removed. As users refresh pages, hundreds of orphaned `SseEmitter` instances remain in RAM, leading to `OutOfMemoryError`.

**The Fix:**
Use `CopyOnWriteArrayList` and register `onCompletion` and `onTimeout` callbacks to remove the emitter.
</details>

---

### Exercise 2: Hands-on Implementation — Thread-Safe Real-Time Notification Broadcaster
Write a Spring `@Service` managing real-time notifications with automatic error eviction and heartbeats.

<details>
<summary>View Solution</summary>

```java
package com.handbook.spring.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class OrderNotificationService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public void addEmitter(SseEmitter emitter) {
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));
    }

    public void broadcastOrder(String orderId, double amount) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                    .name("order_update")
                    .data(String.format("{\"id\":\"%s\",\"total\":%.2f}", orderId, amount))
                );
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }

    // Keepalive heartbeat every 15 seconds
    @Scheduled(fixedRate = 15000)
    public void sendHeartbeat() {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().comment("keepalive"));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Resuming Missed Events Using `Last-Event-ID`
<details>
<summary>View Solution</summary>
**Question:** When a mobile user walks through a subway tunnel and loses cellular connection for 10 seconds, how does the browser's `EventSource` automatically resume and recover all missed events upon reconnecting?

**Solution:**
1. **The `Last-Event-ID` Header:** When the server sends an SSE frame with an ID (`id: 1042`), the browser records this ID in its internal session state.
2. **Reconnection Handshake:** Upon reconnecting, the browser automatically transmits the header:
   `Last-Event-ID: 1042`
3. **Server Recovery:** In Spring Boot, extract the header in your controller:
   ```java
   @GetMapping("/stream")
   public SseEmitter streamEvents(@RequestHeader(value = "Last-Event-ID", required = false) String lastEventId) {
       SseEmitter emitter = new SseEmitter();
       if (lastEventId != null) {
           // Query database or Redis event log for events created after lastEventId
           List<Event> missedEvents = eventLogRepository.findEventsAfter(lastEventId);
           for (Event e : missedEvents) {
               emitter.send(e);
           }
       }
       return emitter;
   }
   ```
</details>

---

## Verified Official Sources
- [HTML Living Standard: Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [Spring Framework Reference: Server-Sent Events](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responsebodyemitter.html#mvc-ann-async-sse)
- [MDN Web Docs: Using Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)

---

## Practice

### Q: When should an architect choose Server-Sent Events (SSE) instead of WebSockets for real-time web features?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Server-Sent Events are ideal when communication is unidirectional (server-to-client only), such as stock tickers, live sports scores, build logs, or notification alerts. SSE operates over standard HTTP/HTTPS (benefiting from standard HTTP/2 multiplexing, native browser reconnection, and proxy compatibility) without the protocol overhead of full-duplex WebSockets.
</details>
