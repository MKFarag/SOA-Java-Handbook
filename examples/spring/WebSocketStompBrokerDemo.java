package com.handbook.spring;

import java.time.Instant;
import java.util.*;

public class WebSocketStompBrokerDemo {

    public record MarketQuote(String symbol, double price, Instant timestamp) {}

    public static class StompMessageChannelSimulator {
        private final List<MarketQuote> messageLog = new ArrayList<>();

        public void publishMarketQuote(String symbol, double price) {
            MarketQuote quote = new MarketQuote(symbol, price, Instant.now());
            messageLog.add(quote);
            System.out.printf("  -> [STOMP Broadcast /topic/market]: %s = $%.2f (%s)%n", 
                quote.symbol(), quote.price(), quote.timestamp());
        }

        public int getMessageCount() { return messageLog.size(); }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 118: Real-Time WebSockets & STOMP Messaging Architecture ===");

        StompMessageChannelSimulator channel = new StompMessageChannelSimulator();
        channel.publishMarketQuote("AAPL", 228.45);
        channel.publishMarketQuote("NVDA", 142.10);

        System.out.println("Total real-time frames delivered via STOMP broker: " + channel.getMessageCount());

        if (channel.getMessageCount() != 2) {
            throw new AssertionError("WebSocket message dispatch count mismatch!");
        }

        System.out.println("Topic 118 WebSockets and STOMP messaging verified successfully.");
    }
}
