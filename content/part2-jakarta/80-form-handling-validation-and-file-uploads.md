---
id: topic-80
slug: form-handling-validation-and-file-uploads
topicNumber: 80
title: Form Handling, Multipart Uploads & Declarative Error Pages
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 22
sectionTitle: Production Web Development
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 16 min read
shortDescription: >-
  Master production form processing: parse multipart file uploads with
  @MultipartConfig, validate inputs, handle file size limits, and declare web.xml
  custom error pages.
prerequisites:
  - 'Topic 67: Request and Response Processing in Servlets'
  - 'Topic 79: The Web MVC Pattern'
relevanceLevel: MUST-KNOW / CORE
---
# Topic 80: Form Handling, Multipart Uploads & Declarative Error Pages

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists
Web applications receive user-submitted input through two primary encoding mechanisms:
1. **URL-Encoded Forms (`application/x-www-form-urlencoded`):** Text parameters formatted as key-value query strings (`name=John&role=Admin`).
2. **Multipart MIME Forms (`multipart/form-data`):** Binary payloads allowing simultaneous transmission of textual metadata and binary files (PDFs, images, ZIPs) separated by unique byte boundaries.

The Jakarta Servlet specification provides built-in mechanisms to parse both: standard form fields via `req.getParameter(name)` and binary multipart files via `@MultipartConfig` and `req.getPart(name)`.

Furthermore, production applications must handle failures—such as validation errors, missing resources (404), or uncaught exceptions (500)—gracefully without leaking server stack traces to users. The Jakarta Servlet specification provides **declarative error page mapping** via `web.xml`, enabling the web container to automatically intercept HTTP status codes and uncaught `Throwable` exceptions and dispatch them to custom branded error views.

### Real-World Analogy
Think of shipping a care package at a post office:
- A standard letter (`application/x-www-form-urlencoded`) contains only flat textual words on single paper.
- A boxed parcel (`multipart/form-data`) contains distinct compartments: one envelope holding your paper letter (metadata), another holding a USB drive (binary file), and a third holding a physical item, all sealed within one master delivery box divided by cardboard dividers (multipart boundaries).
- If the parcel is damaged or rejected (system fault), the post office does not throw internal logistics paperwork and conveyor belt blueprints onto the street; instead, it delivers a polite, standardized notification slip (**declarative error page**) directing you to customer service.

### Why It Exists
Before Servlet 3.0, handling file uploads in Java required heavy third-party libraries like Apache Commons FileUpload. Modern Jakarta EE standardizes native container-level multipart parsing with direct memory-to-disk streaming, configurable memory thresholds, and file-size quotas.

Simultaneously, declarative error handling centralizes failure management at the container level. Individual Servlets do not need repetitive `try-catch` blocks returning custom HTML error markup. The container manages error forwarding automatically, populating the JSP `ErrorData` object with status codes, request URIs, and root causes while preventing information disclosure vulnerabilities (OWASP A05: Security Misconfiguration).

---

## 2. Prerequisites
- **Topic 67: Request and Response Processing in Servlets:** Reading query parameters and handling POST bodies.
- **Topic 79: The Web MVC Pattern:** Dispatching models and views via Controllers.
- **Topic 45: Classic I/O Streams:** Reading and copying byte streams with `InputStream` and `Files.copy()`.

---

## 3. Syntax Breakdown

### 3.1 Multipart Configuration (`@MultipartConfig`)
```java
@WebServlet("/upload")
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024,      // 1 MB: In-memory threshold before buffering to disk
    maxFileSize = 1024 * 1024 * 10,       // 10 MB: Maximum allowed size per individual file
    maxRequestSize = 1024 * 1024 * 25     // 25 MB: Maximum total multipart request size
)
public class UploadServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        String description = req.getParameter("description");
        Part filePart = req.getPart("document");
        String filename = filePart.getSubmittedFileName();
        InputStream stream = filePart.getInputStream();
    }
}
```

#### Key Elements Explained
- `@MultipartConfig`: Class-level annotation alerting the web container to instantiate multipart parsers for incoming `multipart/form-data` requests.
- `fileSizeThreshold`: Files smaller than this byte limit remain in RAM; larger files are spooled to temporary container disk files.
- `req.getPart("document")`: Retrieves the `jakarta.servlet.http.Part` handle matching the HTML `<input type="file" name="document">` form element.
- `filePart.getSubmittedFileName()`: Reads the original filename submitted by the client browser.
- `filePart.getInputStream()`: Provides direct streaming access to upload bytes without loading the entire payload into heap memory.

---

### 3.2 Declarative Error Page Mapping (`web.xml`)
Centralized error boundaries configured in the application deployment descriptor:

```xml
<!-- web.xml Declarative Error Page Configuration -->
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" version="6.0">

    <!-- 1. HTTP 404 Not Found Mapping -->
    <error-page>
        <error-code>404</error-code>
        <location>/WEB-INF/errors/404.jsp</location>
    </error-page>

    <!-- 2. HTTP 500 Internal Server Error Mapping -->
    <error-page>
        <error-code>500</error-code>
        <location>/WEB-INF/errors/500.jsp</location>
    </error-page>

    <!-- 3. Java Exception Hierarchy Fallback -->
    <error-page>
        <exception-type>java.lang.Throwable</exception-type>
        <location>/WEB-INF/errors/500.jsp</location>
    </error-page>

    <!-- 4. Multipart File Size Quota Exceeded Mapping -->
    <error-page>
        <exception-type>java.lang.IllegalStateException</exception-type>
        <location>/WEB-INF/errors/upload-limit.jsp</location>
    </error-page>

</web-app>
```

#### Error Data Implicit Model (`pageContext.errorData`)
When an error page is triggered (`<%@ page isErrorPage="true" %>`), the container populates `ErrorData`:
- `pageContext.errorData.statusCode`: HTTP status integer (e.g., `404`, `500`).
- `pageContext.errorData.requestURI`: Original URI that triggered the failure.
- `pageContext.errorData.throwable`: The caught `Throwable` root cause exception.
- `pageContext.errorData.servletName`: Name of the servlet where the exception was thrown.

---

## 4. Runnable Examples

### Example 1: Basic Multipart File Upload Servlet with Validation
```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@WebServlet(name = "FileUploadServlet", urlPatterns = {"/upload"})
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024,
    maxFileSize = 1024 * 1024 * 10,
    maxRequestSize = 1024 * 1024 * 25
)
public class FileUploadServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");

        String description = req.getParameter("description");
        if (description == null || description.trim().isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().println("Validation Error: 'description' parameter is mandatory.");
            return;
        }

        Part filePart = req.getPart("document");
        if (filePart == null || filePart.getSize() == 0) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().println("Validation Error: No file uploaded under 'document'.");
            return;
        }

        String submittedFilename = filePart.getSubmittedFileName();
        if (submittedFilename == null || submittedFilename.contains("..")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().println("Security Error: Invalid or path-traversal filename detected.");
            return;
        }
        String cleanName = new File(submittedFilename).getName();

        Path uploadDir = Path.of(System.getProperty("java.io.tmpdir"), "handbook-uploads");
        Files.createDirectories(uploadDir);
        Path destination = uploadDir.resolve(cleanName);

        try (InputStream input = filePart.getInputStream()) {
            Files.copy(input, destination, StandardCopyOption.REPLACE_EXISTING);
        }

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().printf("SUCCESS: Uploaded '%s' (%d bytes) with description: '%s'%n",
            cleanName, filePart.getSize(), description.trim());
    }
}
```

#### Corresponding HTML Submission Form
```html
<form method="POST" action="/app/upload" enctype="multipart/form-data">
    <label>Description: <input type="text" name="description" /></label>
    <label>Document: <input type="file" name="document" /></label>
    <button type="submit">Upload File</button>
</form>
```

---

### Example 2: Realistic Form Validation Engine with Streaming
```java
package com.handbook.web;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class FormValidationServiceDemo {
    public record FormSubmission(String email, String role, int experienceYears, String filename, byte[] content) {}

    public static class FormValidator {
        private static final Pattern EMAIL_REGEX = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        private static final List<String> ALLOWED_ROLES = List.of("DEVELOPER", "ARCHITECT", "OPERATOR");
        private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

        public List<String> validate(FormSubmission submission) {
            List<String> errors = new ArrayList<>();

            if (submission.email() == null || !EMAIL_REGEX.matcher(submission.email()).matches()) {
                errors.add("Invalid email address format.");
            }
            if (submission.role() == null || !ALLOWED_ROLES.contains(submission.role().toUpperCase())) {
                errors.add("Invalid role specified. Allowed: " + ALLOWED_ROLES);
            }
            if (submission.experienceYears() < 0 || submission.experienceYears() > 50) {
                errors.add("Experience years must be between 0 and 50.");
            }
            if (submission.filename() != null && submission.filename().contains("..")) {
                errors.add("Directory traversal vulnerability detected in filename.");
            }
            if (submission.content() != null && submission.content().length > MAX_FILE_SIZE) {
                errors.add("Uploaded payload exceeds maximum size limit.");
            }

            return errors;
        }

        public byte[] streamUpload(InputStream in) throws Exception {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096];
            int read;
            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            return out.toByteArray();
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Form Handling & Multipart Validation Demo ===");
        FormValidator validator = new FormValidator();

        byte[] fileBytes = "public class Solution { System.out.println(1); }".getBytes(StandardCharsets.UTF_8);
        FormSubmission validForm = new FormSubmission("dev@company.com", "DEVELOPER", 5, "Solution.java", fileBytes);
        List<String> validErrors = validator.validate(validForm);
        System.out.println("Valid submission errors: " + validErrors.size());
        assert validErrors.isEmpty();

        FormSubmission invalidForm = new FormSubmission("bad-email", "HACKER", -2, "../../../etc/passwd", new byte[100]);
        List<String> invalidErrors = validator.validate(invalidForm);
        System.out.println("Invalid submission caught errors (" + invalidErrors.size() + "):");
        for (String err : invalidErrors) {
            System.out.println("  - " + err);
        }
        assert invalidErrors.size() >= 4;

        byte[] streamed = validator.streamUpload(new ByteArrayInputStream(fileBytes));
        assert streamed.length == fileBytes.length;
        System.out.println("Multipart streaming verification successful: " + streamed.length + " bytes processed.");
    }
}
```

---

### Example 3: Fault Trigger Servlet & Container Error JSP View
```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "FaultTriggerServlet", urlPatterns = {"/fault"})
public class FaultTriggerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String type = req.getParameter("type");
        if ("404".equals(type)) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Requested entity does not exist.");
            return;
        }
        if ("runtime".equals(type)) {
            throw new RuntimeException("Simulated NullPointerException inside business workflow.");
        }
        resp.setContentType("text/plain");
        resp.getWriter().println("Normal execution: No faults triggered.");
    }
}
```

#### Custom Error View (`/WEB-INF/errors/500.jsp`)
```jsp
<%@ page isErrorPage="true" contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head><title>500 - Server Application Error</title></head>
<body>
    <h1>Application Error (500)</h1>
    <p>Target URI: <code>${pageContext.errorData.requestURI}</code></p>
    <p>Status Code: <strong>${pageContext.errorData.statusCode}</strong></p>
    <p>Root Cause: <em>${pageContext.errorData.throwable.message}</em></p>
</body>
</html>
```

---

## 5. Step-by-Step Execution Trace

### File Upload Processing Flow:
1. **Client Submits Form:** Browser bundles form parts with boundary markers (e.g., `--WebKitFormBoundary7MA4YWxkTrZu0gW`).
2. **Container Verifies Configuration:** Tomcat checks for `@MultipartConfig` on the target Servlet.
3. **MIME Boundaries Parsed:** The container splits the raw TCP stream into individual headers and bodies.
4. **Size Enforced:** If a file exceeds `maxFileSize`, an `IllegalStateException` is thrown before user logic runs.
5. **Memory Spooling:** Payloads smaller than `fileSizeThreshold` stay in RAM buffers; larger payloads stream to disk temp files.
6. **Execution Delegated:** `doPost()` runs, granting access to `req.getParameter()` and `req.getPart()`.
7. **Cleanup:** When request processing finishes, temporary disk spool files are deleted.

### Declarative Error Handling Flow:
1. **Fault Eruption:** A servlet throws an uncaught `RuntimeException` or invokes `resp.sendError(404)`.
2. **Container Boundary Interception:** Tomcat catches the fault before closing the HTTP response.
3. **Descriptor Matching:** The container searches `web.xml` `<error-page>` entries:
   - First matches exact HTTP status code (`<error-code>404</error-code>`).
   - If uncaught exception, checks `<exception-type>` hierarchy (most specific matching subtype).
4. **Internal Error Dispatch:** Container creates an `ErrorData` wrapper and forwards internally to the designated `<location>` JSP.
5. **Sanitized Response Delivered:** The client receives a polished error page with status 404 or 500 and zero sensitive stack traces.

---

## 6. Common Mistakes and Solutions

### Mistake 1: Missing `@MultipartConfig` Annotation on Servlet
**Symptom:** Calling `req.getPart("file")` throws `ServletException: UT010057: multipart config was not present on Servlet` or `java.lang.IllegalStateException: No multipart config for servlet`.
**Cause:** Without `@MultipartConfig`, the web container treats the incoming body as a raw unparsed byte stream and refuses multipart calls.
**Solution:** Always annotate file upload Servlets with `@MultipartConfig`.

### Mistake 2: Path Traversal via Unsanitized Filename
**Wrong Code:**
```java
String filename = part.getSubmittedFileName();
Path target = Path.of("/var/handbook/uploads", filename);
Files.copy(part.getInputStream(), target);
```
**Cause:** Malicious clients can submit filenames like `../../../../usr/bin/malware`. If used directly, attackers overwrite system executables.
**Solution:** Strip directory prefixes using `new File(filename).getName()` or validate that `filename` does not contain `..` or path separators.

### Mistake 3: Unhandled Multipart Size Exceptions Crashing with Raw 500
**Cause:** When an uploaded file exceeds `maxFileSize`, Tomcat throws an `IllegalStateException` during `req.getPart()`. If unhandled, this defaults to an ugly container stack trace.
**Solution:** Configure a declarative `<error-page>` mapping for `java.lang.IllegalStateException` or map HTTP 413 / 500 in `web.xml`.

---

## 6b. Web Error Pages & Exception Handling (`<error-page>`)

In production Jakarta EE applications, unhandled exceptions and HTTP error codes must never display raw server stack traces or Tomcat default error pages to end users. Configure declarative error mappings in `WEB-INF/web.xml`:

### Declarative Error Mappings in `web.xml`
```xml
<!-- Map HTTP Status Code 404 (Not Found) -->
<error-page>
    <error-code>404</error-code>
    <location>/WEB-INF/views/errors/404.jsp</location>
</error-page>

<!-- Map HTTP Status Code 500 (Internal Server Error) -->
<error-page>
    <error-code>500</error-code>
    <location>/WEB-INF/views/errors/500.jsp</location>
</error-page>

<!-- Map Specific Java Exception Types -->
<error-page>
    <exception-type>java.lang.Throwable</exception-type>
    <location>/WEB-INF/views/errors/error.jsp</location>
</error-page>
```

### Standard Servlet Error Attributes
When forwarding to an error page, the container populates standard request attributes:
| Attribute Name | Type | Description |
|---|---|---|
| `jakarta.servlet.error.status_code` | `Integer` | HTTP status code (e.g., `404`, `500`) |
| `jakarta.servlet.error.exception_type` | `Class<?>` | Runtime class of the exception thrown |
| `jakarta.servlet.error.message` | `String` | Exception error message string |
| `jakarta.servlet.error.exception` | `Throwable` | The actual exception object instance |
| `jakarta.servlet.error.request_uri` | `String` | URI of the target resource that failed |
| `jakarta.servlet.error.servlet_name` | `String` | Name of the servlet where error occurred |

---

## 7. Best Practices and When NOT to Use It

### Best Practices
- Always enforce strict `maxFileSize` and `maxRequestSize` quotas to prevent Denial of Service (DoS) attacks.
- Store uploaded files outside the public web root (`/WEB-INF/` or dedicated object storage) so users cannot execute arbitrary uploaded scripts.
- Validate file extensions and magic bytes (MIME type verification).
- Place error JSPs inside `/WEB-INF/errors/` so users cannot access error pages directly via URL.

### When NOT to Use It
- Do not store multi-gigabyte video or backup files directly in local application servers. Use direct-to-cloud presigned URLs (AWS S3, Google Cloud Storage) to offload upload bandwidth from your web container.

---

## 8. Version Notes
- **Servlet 3.0 (Java EE 6):** Introduced standard `@MultipartConfig` and `Part` interface.
- **Jakarta EE 10 / Servlet 6.0:** Deprecated legacy wrapper classes; fully migrated to `jakarta.servlet.http.Part`.
- **Status:** Stable modern standard web API.

---

## 9. Summary Cheat Sheet

| Directive / Method | Scope / Location | Operational Behavior |
|---|---|---|
| `@MultipartConfig(maxFileSize)` | Servlet Class | Caps individual file size (e.g. 10 MB) |
| `@MultipartConfig(fileSizeThreshold)` | Servlet Class | Max RAM buffer before disk spooling (e.g. 1 MB) |
| `req.getPart("name")` | Servlet `doPost` | Retrieves single uploaded file part |
| `part.getSubmittedFileName()` | `Part` handle | Original client-side filename |
| `<error-page><error-code>` | `web.xml` | Maps HTTP status code (404, 500) to view |
| `<error-page><exception-type>` | `web.xml` | Maps Java exception class to error view |
| `${pageContext.errorData.statusCode}` | Error JSP (`isErrorPage="true"`) | Returns HTTP status code integer |
| `${pageContext.errorData.requestURI}` | Error JSP | Returns original requested URI |

---

## 10. Exercises with Solutions

### Exercise 1: Spot the Security Flaw
<details>
<summary>View Solution</summary>
**Question:** Spot the critical security vulnerability:
```java
Part p = req.getPart("upload");
p.write("/var/www/html/" + p.getSubmittedFileName());
```
**Solution:** Two critical flaws:
1. **Path Traversal:** An attacker can provide `../../etc/shadow` as the filename.
2. **Arbitrary Code Execution:** Saving uninspected uploads directly into the public web root (`/var/www/html/`) allows an attacker to upload a `.jsp` file and execute arbitrary shell commands on the server.
</details>

### Exercise 2: Hands-on Implementation (Quota & Error Configuration)
<details>
<summary>View Solution</summary>
**Question:** Write an `@MultipartConfig` declaration that allows maximum 2 MB per file, 5 MB total request size, and keeps files under 500 KB entirely in memory, along with the `web.xml` snippet to catch upload overflow exceptions.

**Solution:**
```java
@MultipartConfig(
    fileSizeThreshold = 500 * 1024,
    maxFileSize = 2 * 1024 * 1024,
    maxRequestSize = 5 * 1024 * 1024
)
```
```xml
<error-page>
    <exception-type>java.lang.IllegalStateException</exception-type>
    <location>/WEB-INF/errors/file-too-large.jsp</location>
</error-page>
```
</details>

### Exercise 3: Real-World Edge Case (Large Payload Denial of Service & Temporary File Cleanup)
<details>
<summary>View Solution</summary>
**Question:** What happens at the servlet container level when an attacker uploads a 500 MB file to a servlet protected by `@MultipartConfig(maxFileSize = 10_485_760)` (10 MB)? How should production code handle the resulting container exception and clean up disk artifacts?

**Solution:**
1. **Container Exception:** When the uploaded part exceeds `maxFileSize` or the entire request exceeds `maxRequestSize`, Tomcat immediately terminates multipart parsing and throws an `IllegalStateException` (or `jakarta.servlet.ServletException` wrapping an `org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException`) as soon as `req.getPart()` or `req.getParts()` is called.
2. **Graceful Handling:** Wrap the parsing call in a `try-catch` block inside the servlet or configure a servlet filter / global container error-page for HTTP 500 / 413:
```java
try {
    Part filePart = req.getPart("document");
    // process file
} catch (IllegalStateException | ServletException e) {
    resp.setStatus(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE); // 413
    resp.getWriter().write("Uploaded file exceeds the maximum allowed size of 10 MB.");
    return;
}
```
3. **Disk Cleanup:** For files exceeding `fileSizeThreshold`, Tomcat writes temporary files to `location` (or the JVM `java.io.tmpdir`). At the end of request processing, call `part.delete()` to immediately purge the temporary file from disk rather than waiting for OS garbage collection.
</details>

---

## 11. Sources
- [Jakarta Servlet 6.0 Specification - Multipart & Error Handling](https://jakarta.ee/specifications/servlet/6.0/)
- [OWASP File Upload Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Error Handling & Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
