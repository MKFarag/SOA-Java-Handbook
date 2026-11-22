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

## Core JAX-RS Annotations Reference

| Annotation | Target | Description |
| :--- | :--- | :--- |
| **`@ApplicationPath`** | Class | Defines base URI path prefix for all REST resources in the application |
| **`@Path`** | Class / Method | Specifies relative URI template matching (e.g., `@Path("/users/{id}")`) |
| **`@GET / @POST / @PUT / @DELETE`** | Method | Maps standard HTTP verbs to Java methods |
| **`@Produces`** | Class / Method | Specifies MIME types generated in response (`MediaType.APPLICATION_JSON`) |
| **`@Consumes`** | Class / Method | Specifies accepted MIME types in request body |
| **`@PathParam`** | Parameter | Binds URI template path variable (e.g., `{id}`) to method parameter |
| **`@QueryParam`** | Parameter | Extracts URL query parameter (`?page=2`) |
| **`@HeaderParam`** | Parameter | Extracts HTTP request header value |

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
