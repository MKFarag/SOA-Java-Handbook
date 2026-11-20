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
