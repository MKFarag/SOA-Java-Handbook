package com.handbook.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExpressionLanguageEvaluatorDemo {

    public static Object resolveElProperty(Object target, String property) throws Exception {
        if (target instanceof Map<?, ?> map) {
            return map.get(property);
        }
        // JavaBean getter reflection: getUsername(), getEmail()
        String getterName = "get" + Character.toUpperCase(property.charAt(0)) + property.substring(1);
        return target.getClass().getMethod(getterName).invoke(target);
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Jakarta Expression Language (EL) Evaluator ===");
        
        // 1. JavaBean property resolution (${user.username}, ${user.email})
        UserProfileBean user = new UserProfileBean("jduke", "duke@oracle.com", 1500, true);
        System.out.println("Resolving EL expressions against JavaBean:");
        System.out.println("  ${user.username}      -> " + resolveElProperty(user, "username"));
        System.out.println("  ${user.email}         -> " + resolveElProperty(user, "email"));
        System.out.println("  ${user.loyaltyPoints} -> " + resolveElProperty(user, "loyaltyPoints"));

        // 2. Map and Collection resolution (${sessionScope.config.theme})
        Map<String, Object> sessionScope = new HashMap<>();
        sessionScope.put("theme", "VS Code Dark+");
        sessionScope.put("cartItems", List.of("Spring Boot Book", "Java Concurrency In Practice"));

        System.out.println("\nResolving EL expressions against Scoped Maps:");
        System.out.println("  ${sessionScope.theme} -> " + resolveElProperty(sessionScope, "theme"));
        
        List<?> items = (List<?>) resolveElProperty(sessionScope, "cartItems");
        System.out.println("  ${empty sessionScope.cartItems} -> " + (items == null || items.isEmpty()));
        System.out.println("  ${sessionScope.cartItems[0]}    -> " + items.get(0));

        System.out.println("\nExpression Language evaluation completed successfully.");
    }
}
