---
id: topic-85
slug: jakarta-restful-web-services-jax-rs
topicNumber: 85
title: Jakarta RESTful Web Services (JAX-RS)
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 23
sectionTitle: Jakarta EE Enterprise Stack Overview
versionBadge: Jakarta RESTful Web Services 3.1 / EE 10
difficulty: Advanced
readingTime: 14 min read
shortDescription: >-
  Build production RESTful APIs using declarative URI routing (@Path), HTTP
  verbs (@GET, @POST), media negotiation, and JAX-RS filters.
prerequisites:
  - 'Topic 64: Web Architecture Fundamentals (HTTP Protocol)'
  - 'Topic 66: Servlet Lifecycle & Architecture'
  - 'Topic 84: Contexts & Dependency Injection (CDI)'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Topic 85: Jakarta RESTful Web Services (JAX-RS)

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

## 1. What It Is and Why It Exists
Representational State Transfer (REST) is an architectural style for networked hypermedia applications that leverages standard HTTP verbs (GET, POST, PUT, DELETE, PATCH), URI resources, and standardized MIME representations (JSON, XML).

**Jakarta RESTful Web Services (JAX-RS)** is the official Jakarta EE specification that enables developers to build RESTful web services in Java using declarative annotations. Rather than manually parsing raw query strings and request headers in low-level Servlets, JAX-RS automatically binds URL path variables, deserializes incoming JSON payloads into Java POJOs, negotiates content types, and serializes Java response objects into JSON responses.

### Real-World Analogy
A specialized international freight airport terminal:
Instead of forcing every cargo plane pilot to personally walk packages to individual warehouse shelves, the airport provides designated numbered hangars (`@Path("/hangar-5")`), specialized docks for refrigerated or oversized cargo (`@Consumes("application/json")`), and automated conveyor belts that unbox and scan every delivery item into computer inventory before handing it to warehouse workers.

### Why It Exists
Writing REST APIs using plain Servlets requires hundreds of lines of repetitive boilerplate: extracting path components with regex, reading `InputStream` buffers, calling Jackson/JSON-B mappers, setting status codes, and setting `Content-Type` headers. JAX-RS eliminates all of this boilerplate, allowing developers to write clean, declarative controller methods.

---

## 2. Prerequisites
- **Topic 64: HTTP Architecture:** HTTP methods (GET, POST, PUT, DELETE) and status codes (200, 201, 400, 404).
- **Topic 66: Servlet Lifecycle:** How web requests enter application servers.
- **Topic 84: CDI:** Injecting business services into REST resource classes.

---

## 3. Syntax Breakdown
```java
@Path("/api/v1/customers") // Base URI path mapping
@Produces(MediaType.APPLICATION_JSON) // Automatic JSON serialization
@Consumes(MediaType.APPLICATION_JSON) // Automatic JSON deserialization
public class CustomerResource {

    @Inject
    private CustomerService service;

    // HTTP GET /api/v1/customers/101
    @GET
    @Path("/{id}")
    public Response getCustomer(@PathParam("id") Long id) {
        Customer c = service.findById(id);
        if (c == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("{\"error\": \"Customer not found\"}").build();
        }
        return Response.ok(c).build(); // Returns HTTP 200 with JSON body
    }

    // HTTP POST /api/v1/customers
    @POST
    public Response createCustomer(Customer newCustomer) {
        Customer created = service.create(newCustomer);
        URI location = URI.create("/api/v1/customers/" + created.getId());
        return Response.created(location).entity(created).build(); // Returns HTTP 201
    }
}
```

### Key Elements Explained
- `@Path("/api/v1/customers")`: Defines the URI template matched by the container's REST dispatcher.
- `@GET`, `@POST`, `@PUT`, `@DELETE`: HTTP verb annotations designating which HTTP request method triggers the annotated Java method.
- `@PathParam("id")`: Binds the URI path variable `{id}` directly to the method parameter with automatic type conversion (e.g. String to Long).
- `@QueryParam("sort")`: Binds URL query string parameters (e.g. `?sort=asc`).
- `Response`: Fluent builder API to configure HTTP status codes, response headers, and payload entities.

---

## 4. Runnable Examples

### Example 1: Basic JAX-RS Resource Class Mapping
```java
package com.handbook.enterprise;

import java.lang.annotation.*;

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

@Path("/api/v1/orders")
@Produces({"application/json"})
public class OrderResource {
    @GET
    @Path("/{id}")
    public String getOrderById(@PathParam("id") String orderId) {
        return "{\"orderId\": \"" + orderId + "\", \"status\": \"SHIPPED\", \"total\": 199.95}";
    }

    @POST
    public String createOrder() {
        return "{\"status\": \"CREATED\", \"id\": \"ORD-9872\"}";
    }
}
```

#### Expected Output
```json
{"orderId": "ORD-9872", "status": "SHIPPED", "total": 199.95}
```

---

### Example 2: Realistic JAX-RS Routing Dispatcher Simulation
```java
package com.handbook.enterprise;

import java.lang.reflect.Method;

public class JaxRsEndpointDemo {
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

        String jsonResponse = dispatcher.dispatch("GET", "/api/v1/orders/ORD-9872");
        System.out.println("GET Response: " + jsonResponse);
        assert jsonResponse.contains("\"orderId\": \"ORD-9872\"");
        assert jsonResponse.contains("\"status\": \"SHIPPED\"");

        String postResponse = dispatcher.dispatch("POST", "/api/v1/orders");
        System.out.println("POST Response: " + postResponse);
        assert postResponse.contains("\"status\": \"CREATED\"");

        System.out.println("JAX-RS annotation routing and JSON dispatch verified successfully.");
    }
}
```

#### Expected Output
```text
=== Jakarta RESTful Web Services (JAX-RS) ===
[JAX-RS Dispatcher] Routing GET to getOrderById with @PathParam=ORD-9872
GET Response: {"orderId": "ORD-9872", "status": "SHIPPED", "total": 199.95}
[JAX-RS Dispatcher] Routing POST to createOrder
POST Response: {"status": "CREATED", "id": "ORD-9285"}
JAX-RS annotation routing and JSON dispatch verified successfully.
```

---

## 5. Step-by-Step "What Happens When This Runs"
1. **Application Initialization:** JAX-RS implementation (Jersey, RESTEasy) scans for `@ApplicationPath` and `@Path` classes.
2. **Request Ingress:** An incoming HTTP request (e.g. `GET /api/v1/orders/ORD-9872`) hits the servlet container.
3. **Route Matching:** The JAX-RS runtime matches the URL path and HTTP verb against registered `@Path` templates.
4. **Parameter Extraction:** Path variables (`{id}`) and query parameters are parsed and converted to Java types.
5. **Entity Deserialization:** For POST/PUT requests, JSON-B or Jackson parses incoming JSON into a Java POJO.
6. **Method Execution:** The resource method executes business logic and returns a `Response` or entity.
7. **Serialization & Status:** The return object is serialized into JSON and returned to the client with the specified status code (e.g. 200 OK, 201 Created).

---

## 6. Common Mistakes and Solutions

### Mistake 1: Returning raw entities without handling 404 Not Found
**Wrong Code:**
```java
@GET
@Path("/{id}")
public Customer get(@PathParam("id") Long id) {
    return service.findById(id); // If null, returns HTTP 204 No Content instead of 404!
}
```
**Cause:** Returning `null` from a JAX-RS method translates to HTTP 204 No Content, misleading REST clients that expect HTTP 404 when a resource does not exist.
**Solution:** Use the `Response` builder:
```java
Customer c = service.findById(id);
if (c == null) return Response.status(Status.NOT_FOUND).build();
return Response.ok(c).build();
```

### Mistake 2: Forgetting `@Produces` or `@Consumes` media types
**Symptom:** Client receives `HTTP 415 Unsupported Media Type` or `HTTP 406 Not Acceptable`.
**Cause:** The resource does not declare compatibility with the client's `Content-Type` or `Accept` request headers.
**Solution:** Always annotate the class or method with `@Produces(MediaType.APPLICATION_JSON)` and `@Consumes(MediaType.APPLICATION_JSON)`.

---

## 7. Best Practices and When NOT to Use It

### Best Practices
- Always return HTTP 201 Created with a `Location` header when successfully creating resources via POST.
- Use `ExceptionMapper<T>` to translate Java exceptions into consistent, structured JSON error bodies.
- Follow REST URI conventions: use nouns (`/users`, `/orders`) rather than verbs (`/getUsers`, `/saveOrder`).

### When NOT to Use It
- Real-time bidirectional communication: For real-time chat, multiplayer games, or live stock tickers, use Jakarta WebSocket (`@ServerEndpoint`) instead of REST polling.

---

## 8. Version Notes
- **JAX-RS 1.0 / 2.0 (JSR 311 / 339):** Established standard REST annotations and client API.
- **Jakarta REST 3.0 / 3.1 (Jakarta EE 9/10):** Migrated package to `jakarta.ws.rs.*` with enhanced Java record support.
- **Status:** Industry-standard RESTful API framework.

---

## 9. Summary Cheat Sheet
| Annotation / Class | Purpose | Example |
|---|---|---|
| `@Path(value)` | URI template mapping | `@Path("/api/v1/orders")` |
| `@PathParam(name)` | Injects URI path variable | `@PathParam("id") Long id` |
| `@QueryParam(name)` | Injects query string parameter | `@QueryParam("page") int page` |
| `@HeaderParam(name)` | Injects HTTP request header | `@HeaderParam("Authorization") String auth` |
| `Response.created(uri)` | Returns HTTP 201 with Location | `Response.created(locationUri).build()` |

---

## 10. Exercises with Solutions

### Exercise 1: Spot the Bug
<details>
<summary>View Solution</summary>
**Question:** Explain what is wrong with this JAX-RS resource method:
```java
@POST
@Path("/deleteCustomer")
public void remove(@QueryParam("id") Long id) {
    service.delete(id);
}
```
**Solution:** Violates REST architectural principles in two ways:
1. Uses HTTP POST instead of the standard HTTP DELETE verb.
2. Uses a procedural action verb in the URI (`/deleteCustomer`) instead of addressing the noun resource directly: `@DELETE @Path("/{id}")`.
</details>

### Exercise 2: Hands-on Implementation
<details>
<summary>View Solution</summary>
**Question:** Write a JAX-RS method that handles `GET /users?status=ACTIVE` and returns a list of users as JSON.

**Solution:**
```java
@GET
@Produces(MediaType.APPLICATION_JSON)
public Response getUsers(@QueryParam("status") @DefaultValue("ALL") String status) {
    List<User> users = userService.findByStatus(status);
    return Response.ok(users).build();
}
```
</details>

### Exercise 3: Real-World Edge Case (URI Ambiguity & Regex Path Restrictions)
<details>
<summary>View Solution</summary>
**Question:** A JAX-RS resource declares two endpoints:
```java
@GET
@Path("/{id}")
public Response getUserById(@PathParam("id") Long id) { ... }

@GET
@Path("/current")
public Response getCurrentUser() { ... }
```
When an HTTP client invokes `GET /users/current`, the server intermittently crashes with `NumberFormatException: For input string: "current"` or fails to execute `getCurrentUser()`. Why does this occur, and how do you resolve URI pattern ambiguity in JAX-RS?

**Solution:**
1. **URI Matching Algorithm:** JAX-RS sorts matching candidate methods based on literal character counts and regex matching. However, if path parameters are unbounded, the router may evaluate `/{id}` first. Attempting to parse the literal String `"current"` into `Long id` triggers a parameter conversion error before method execution.
2. **The Production Fix:** Constrain the path template parameter using regular expressions so the parameter only matches numeric strings:
```java
@GET
@Path("/{id: [0-9]+}")
public Response getUserById(@PathParam("id") Long id) {
    return Response.ok(userService.findById(id)).build();
}

@GET
@Path("/current")
public Response getCurrentUser() {
    return Response.ok(securityContext.getUserPrincipal()).build();
}
```
With the regex constraint `[0-9]+`, any non-numeric request such as `/users/current` bypasses the ID method completely and reliably routes to `getCurrentUser()`.
</details>

---

## 11. Sources
- [Jakarta RESTful Web Services 3.1 Specification](https://jakarta.ee/specifications/restful-ws/3.1/)
- [Eclipse Jersey User Guide](https://eclipse-ee4j.github.io/jersey/)
