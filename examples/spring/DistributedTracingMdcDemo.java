package com.handbook.spring;

import java.util.*;

public class DistributedTracingMdcDemo {

    public record TraceRecord(String serviceName, String traceId, String spanId, String message) {}

    public static class DistributedTraceAggregator {
        private final List<TraceRecord> auditLogs = new ArrayList<>();

        public void recordLog(String service, String traceId, String spanId, String msg) {
            TraceRecord record = new TraceRecord(service, traceId, spanId, msg);
            auditLogs.add(record);
            System.out.printf("  -> [%-15s] TraceId=%-16s | SpanId=%-12s | Log: %s%n",
                record.serviceName(), record.traceId(), record.spanId(), record.message());
        }

        public List<TraceRecord> getLogsForTrace(String traceId) {
            return auditLogs.stream().filter(r -> r.traceId().equals(traceId)).toList();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 124: Distributed Tracing & Correlation IDs ===");

        DistributedTraceAggregator aggregator = new DistributedTraceAggregator();
        String sharedTraceId = "4bf92f3577b34da6";

        aggregator.recordLog("GATEWAY-SERVICE", sharedTraceId, "span-001", "Request routed to ORDER-SERVICE");
        aggregator.recordLog("ORDER-SERVICE",   sharedTraceId, "span-002", "Persisting order record to DB");
        aggregator.recordLog("PAYMENT-SERVICE", sharedTraceId, "span-003", "Executing credit card capture");

        List<TraceRecord> traceChain = aggregator.getLogsForTrace(sharedTraceId);
        System.out.println("Reconstructed cross-service trace chain size: " + traceChain.size());

        if (traceChain.size() != 3) {
            throw new AssertionError("Distributed trace aggregation failed!");
        }

        System.out.println("Topic 124 Distributed Tracing and MDC verified successfully.");
    }
}
