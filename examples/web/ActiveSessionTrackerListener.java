package com.handbook.web;

import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import java.util.concurrent.atomic.AtomicInteger;

@WebListener
public class ActiveSessionTrackerListener implements HttpSessionListener {

    private static final AtomicInteger activeSessions = new AtomicInteger(0);

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        int total = activeSessions.incrementAndGet();
        System.out.println("[SessionTracker] Session created: " + se.getSession().getId() + " | Active: " + total);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        int total = activeSessions.decrementAndGet();
        System.out.println("[SessionTracker] Session destroyed: " + se.getSession().getId() + " | Active: " + total);
    }

    public static int getActiveSessionCount() {
        return activeSessions.get();
    }
}
