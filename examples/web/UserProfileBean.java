package com.handbook.web;

import java.io.Serializable;

public class UserProfileBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private String username;
    private String email;
    private int loyaltyPoints;
    private boolean active;

    public UserProfileBean() {
        // Zero-arg constructor mandatory for JavaBeans / JSP useBean
    }

    public UserProfileBean(String username, String email, int loyaltyPoints, boolean active) {
        this.username = username;
        this.email = email;
        this.loyaltyPoints = loyaltyPoints;
        this.active = active;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(int loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
