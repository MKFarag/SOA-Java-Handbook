package com.handbook.web;

import java.util.HashMap;
import java.util.Map;

public class ErrorHandlingDispatcherDemo {

    public record ErrorPageMapping(Integer statusCode, Class<? extends Throwable> exceptionType, String targetLocation) {}

    public static class ErrorPageRegistry {
        private final Map<Integer, String> codeMap = new HashMap<>();
        private final Map<Class<? extends Throwable>, String> exceptionMap = new HashMap<>();

        public void registerErrorCode(int code, String location) {
            codeMap.put(code, location);
        }

        public void registerException(Class<? extends Throwable> type, String location) {
            exceptionMap.put(type, location);
        }

        public String resolveErrorPage(int statusCode, Throwable throwable) {
            if (throwable != null) {
                // Exact match first, then superclass match
                Class<?> curr = throwable.getClass();
                while (curr != null && Throwable.class.isAssignableFrom(curr)) {
                    if (exceptionMap.containsKey(curr)) {
                        return exceptionMap.get(curr);
                    }
                    curr = curr.getSuperclass();
                }
            }
            if (codeMap.containsKey(statusCode)) {
                return codeMap.get(statusCode);
            }
            return "/default-error.jsp";
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Error Page & Exception Handling Dispatcher Demo ===");

        ErrorPageRegistry registry = new ErrorPageRegistry();
        // Emulates <error-page> declarations in web.xml
        registry.registerErrorCode(404, "/error-404.jsp");
        registry.registerErrorCode(403, "/error-403.jsp");
        registry.registerException(IllegalArgumentException.class, "/error-bad-request.jsp");
        registry.registerException(Throwable.class, "/error-500.jsp");

        // 1. Resolve 404
        String notFoundPage = registry.resolveErrorPage(404, null);
        System.out.println("Status 404 resolved page: " + notFoundPage);
        assert "/error-404.jsp".equals(notFoundPage);

        // 2. Resolve specific exception (IllegalArgumentException)
        String specificExPage = registry.resolveErrorPage(500, new IllegalArgumentException("Invalid ID"));
        System.out.println("IllegalArgumentException resolved page: " + specificExPage);
        assert "/error-bad-request.jsp".equals(specificExPage);

        // 3. Resolve generic exception matching hierarchy (NullPointerException -> Throwable)
        String fallbackExPage = registry.resolveErrorPage(500, new NullPointerException("Null reference"));
        System.out.println("NullPointerException hierarchy resolved page: " + fallbackExPage);
        assert "/error-500.jsp".equals(fallbackExPage);

        System.out.println("Error page resolution verified: Declarative container exception dispatch successful.");
    }
}
