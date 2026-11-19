package com.handbook.enterprise;

import java.lang.annotation.*;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

// JAX-RS Meta-annotations emulation for standalone reference execution
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@interface Path { String value(); }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface GET {}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface POST {}

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@interface Produces { String[] value(); }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
@interface PathParam { String value(); }

public class JaxRsEndpointDemo {

    // 1. JAX-RS Resource Class
    @Path("/api/v1/orders")
    @Produces({"application/json"})
    public static class OrderResource {

        @GET
        @Path("/{id}")
        public String getOrderById(@PathParam("id") String orderId) {
            return "{\"orderId\": \"" + orderId + "\", \"status\": \"SHIPPED\", \"total\": 199.95}";
        }

        @POST
        public String createOrder() {
            return "{\"status\": \"CREATED\", \"id\": \"ORD-" + System.currentTimeMillis() % 10000 + "\"}";
        }
    }

    // 2. Simulated JAX-RS Routing Dispatcher
    public static class MockJaxRsDispatcher {
        public String dispatch(String httpMethod, String requestUri) throws Exception {
            OrderResource resource = new OrderResource();
            Class<?> clazz = resource.getClass();
            Path rootPath = clazz.getAnnotation(Path.class);

            if (requestUri.startsWith(rootPath.value())) {
                String subPath = requestUri.substring(rootPath.value().length());

                for (Method method : clazz.getDeclaredMethods()) {
                    if ("GET".equals(httpMethod) && method.isAnnotationPresent(GET.class)) {
                        Path methodPath = method.getAnnotation(Path.class);
                        if (methodPath != null && methodPath.value().equals("/{id}") && subPath.startsWith("/")) {
                            String paramValue = subPath.substring(1);
                            System.out.println("[JAX-RS Dispatcher] Routing GET to " + method.getName() + " with @PathParam=" + paramValue);
                            return (String) method.invoke(resource, paramValue);
                        }
                    } else if ("POST".equals(httpMethod) && method.isAnnotationPresent(POST.class)) {
                        System.out.println("[JAX-RS Dispatcher] Routing POST to " + method.getName());
                        return (String) method.invoke(resource);
                    }
                }
            }
            return "{\"error\": \"404 Not Found\"}";
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Jakarta RESTful Web Services (JAX-RS) ===");

        MockJaxRsDispatcher dispatcher = new MockJaxRsDispatcher();

        // 1. Test GET by path parameter
        String jsonResponse = dispatcher.dispatch("GET", "/api/v1/orders/ORD-9872");
        System.out.println("GET Response: " + jsonResponse);
        assert jsonResponse.contains("\"orderId\": \"ORD-9872\"");
        assert jsonResponse.contains("\"status\": \"SHIPPED\"");

        // 2. Test POST creation
        String postResponse = dispatcher.dispatch("POST", "/api/v1/orders");
        System.out.println("POST Response: " + postResponse);
        assert postResponse.contains("\"status\": \"CREATED\"");

        System.out.println("JAX-RS annotation routing and JSON dispatch verified successfully.");
    }
}
