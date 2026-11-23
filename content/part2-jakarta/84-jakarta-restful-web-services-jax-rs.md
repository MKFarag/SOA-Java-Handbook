---
id: topic-84
slug: jakarta-restful-web-services-jax-rs
topicNumber: 84
title: Jakarta RESTful Web Services (JAX-RS)
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 23
sectionTitle: Modern Jakarta EE Specifications
versionBadge: Jakarta RESTful Web Services 3.1
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: JAX-RS specification, resource class routing (@Path, @GET, @POST),
  parameter binding (@PathParam, @QueryParam), content negotiation, and Response
  builder.
prerequisites:
  - 'Topic 67: Web Architecture Fundamentals: The HTTP Protocol'
  - 'Topic 70: HttpServletRequest & HttpServletResponse Processing'
---

## Overview
Jakarta RESTful Web Services (JAX-RS) is the standard Java specification for building RESTful web services and HTTP APIs. Implemented by frameworks such as Eclipse Jersey and RESTEasy, JAX-RS utilizes declarative annotations to bind HTTP methods, URI templates, headers, and media types directly to Java classes and methods.

---

## Master Jakarta RESTful Web Services (JAX-RS) Annotations Directory

Jakarta RESTful Web Services (JAX-RS 3.1) standardizes HTTP service routing, parameter extraction, content negotiation, and filter interception. Below is the comprehensive directory categorized by architectural role.

### 1. HTTP Verbs, Routing & Content Negotiation

| Annotation | Target Element | Key Attributes | Specification Purpose & RFC Semantics | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@ApplicationPath`** | `TYPE` | `value` (String, required) | Declares the base application URI context path for all REST resources in the application. | `@ApplicationPath("/api/v1") public class RestApp extends Application {}` |
| **`@Path`** | `TYPE`, `METHOD` | `value` (String, required) | Specifies URI template path matching with optional path variables (e.g. `@Path("/users/{id:[0-9]+}")`). | `@Path("/orders") public class OrderResource {}` |
| **`@GET`** | `METHOD` | None | Maps HTTP `GET` requests (safe, idempotent resource retrieval). | `@GET @Path("/{id}") public Response get(@PathParam("id") Long id)` |
| **`@POST`** | `METHOD` | None | Maps HTTP `POST` requests (create subordinate resource or trigger action). | `@POST public Response create(OrderDto dto)` |
| **`@PUT`** | `METHOD` | None | Maps HTTP `PUT` requests (full resource replacement, idempotent). | `@PUT @Path("/{id}") public Response replace(@PathParam("id") Long id, OrderDto dto)` |
| **`@DELETE`** | `METHOD` | None | Maps HTTP `DELETE` requests (resource removal, idempotent). | `@DELETE @Path("/{id}") public Response delete(@PathParam("id") Long id)` |
| **`@PATCH`** | `METHOD` | None | Maps HTTP `PATCH` requests (partial resource modification). | `@PATCH @Path("/{id}") public Response patch(@PathParam("id") Long id, PatchDto p)` |
| **`@HEAD`** | `METHOD` | None | Maps HTTP `HEAD` requests (returns HTTP headers identical to `GET` without message body). | `@HEAD @Path("/{id}") public Response checkHeader(@PathParam("id") Long id)` |
| **`@OPTIONS`** | `METHOD` | None | Maps HTTP `OPTIONS` requests (returns supported HTTP communication methods). | `@OPTIONS public Response getOptions()` |
| **`@Produces`** | `TYPE`, `METHOD` | `value = String[]` | Declares MIME media types serialized into response body (`MediaType.APPLICATION_JSON`). | `@Produces(MediaType.APPLICATION_JSON)` |
| **`@Consumes`** | `TYPE`, `METHOD` | `value = String[]` | Declares accepted MIME media types expected in request body. | `@Consumes(MediaType.APPLICATION_JSON)` |

### 2. Parameter Resolution, Context Injection & Providers

| Annotation | Target Element | Key Attributes | Parameter Source & Operational Mechanics | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@PathParam`** | `PARAMETER`, `FIELD` | `value` (variable name) | Extracts URI path template variable declared in `@Path` matching. | `public Response get(@PathParam("orderId") String orderId)` |
| **`@QueryParam`** | `PARAMETER`, `FIELD` | `value` (query key) | Extracts URL query parameter from query string (`?page=2&size=10`). | `public Response list(@QueryParam("page") @DefaultValue("0") int page)` |
| **`@HeaderParam`** | `PARAMETER`, `FIELD` | `value` (header name) | Extracts HTTP request header value. | `public Response auth(@HeaderParam("Authorization") String token)` |
| **`@CookieParam`** | `PARAMETER`, `FIELD` | `value` (cookie name) | Extracts HTTP cookie value by cookie name. | `public Response session(@CookieParam("JSESSIONID") String session)` |
| **`@MatrixParam`** | `PARAMETER`, `FIELD` | `value` (matrix key) | Extracts matrix URI parameter separated by semicolons (`/items;color=red`). | `public Response filter(@MatrixParam("color") String color)` |
| **`@FormParam`** | `PARAMETER`, `FIELD` | `value` (form field) | Extracts form field value from `application/x-www-form-urlencoded` payload. | `public Response submit(@FormParam("username") String username)` |
| **`@BeanParam`** | `PARAMETER` | None | Aggregates multiple parameter annotations into properties of a single POJO. | `public Response search(@BeanParam FilterParams params)` |
| **`@DefaultValue`** | `PARAMETER`, `FIELD` | `value` (String) | Sets fallback default string value if parameter is absent from request. | `@QueryParam("limit") @DefaultValue("25") int limit` |
| **`@Context`** | `FIELD`, `PARAMETER` | None | Injects contextual runtime instances (`UriInfo`, `HttpHeaders`, `Request`, `SecurityContext`, `HttpServletRequest`). | `public Response info(@Context UriInfo uriInfo, @Context SecurityContext sec)` |
| **`@Provider`** | `TYPE` | None | Marks class as a JAX-RS extension provider (`ContainerRequestFilter`, `ExceptionMapper`, `MessageBodyReader`). | `@Provider public class GlobalExceptionMapper implements ExceptionMapper<Throwable>` |
| **`@NameBinding`** | `ANNOTATION_TYPE` | None | Meta-annotation defining custom binding annotation to bind filters to specific resource methods. | `@NameBinding @Retention(RUNTIME) public @interface Logged {}`

---

## Production Implementation: RESTful Resource Controller

```java
package com.example.rest;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import java.net.URI;

record UserDto(Long id, String name, String email) {}

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @GET
    @Path("/{id}")
    public Response getUserById(@PathParam("id") Long id) {
        if (id <= 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Invalid user identifier\"}")
                    .build();
        }

        UserDto user = new UserDto(id, "Sarah Connor", "sarah@example.com");
        return Response.ok(user).build();
    }

    @POST
    public Response createUser(UserDto payload, @Context UriInfo uriInfo) {
        // Persist logic generates ID 42
        Long generatedId = 42L;
        URI location = uriInfo.getAbsolutePathBuilder().path(String.valueOf(generatedId)).build();

        return Response.created(location)
                .entity(new UserDto(generatedId, payload.name(), payload.email()))
                .build();
    }
}
```

---

## Common Pitfalls & REST Traps

- **Ignoring `Response.created()` Location Header:**
  When responding to an HTTP `POST` that creates a new resource, returning `201 Created` without a `Location` header violates RFC 9110. Always use `Response.created(locationUri).build()`.
- **Mismatch Between `@Consumes` and Request `Content-Type`:**
  If a resource defines `@Consumes(MediaType.APPLICATION_JSON)` but the client sends a request without the `Content-Type: application/json` header, JAX-RS aborts with an HTTP `415 Unsupported Media Type` error before executing the method.
- **Throwing Unhandled Exceptions to Clients:**
  Letting uncaught runtime exceptions bubble up produces raw HTML 500 error pages from Tomcat. Implement `ExceptionMapper<E>` to serialize exceptions into standardized JSON error responses.

---

## Verification & Practice

**Question:** What HTTP response status code does JAX-RS return if a client sends a `PUT` request to an endpoint where the `@Path` matches, but only `@GET` and `@POST` annotations are defined?

**Explanation:** JAX-RS automatically returns HTTP `405 Method Not Allowed`, accompanied by an `Allow` header listing the permitted HTTP verbs (`Allow: GET, POST, OPTIONS`).

---

## Practice

### Q: How do `@PathParam` and `@QueryParam` differ in JAX-RS resource method signatures?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** `@PathParam` extracts variables embedded directly in the URI path hierarchy (e.g. `@Path("/users/{id}")` with URL `/users/42` extracts `42`). `@QueryParam` extracts optional key-value filters appended after the question mark in the URL string (e.g. `/users?status=active` extracts `active`).
</details>
