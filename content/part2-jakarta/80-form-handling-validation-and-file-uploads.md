---
id: topic-80
slug: form-handling-validation-and-file-uploads
topicNumber: 80
title: 'Form Handling, Validation & Multipart File Uploads'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 22
sectionTitle: Enterprise Web Applications & Data Flow
versionBadge: Jakarta Servlet 6.0
difficulty: Intermediate
readingTime: 9 min read
shortDescription: >-
  Reference: Processing standard forms and multipart/form-data with
  @MultipartConfig, Part API stream handling, input validation, and upload
  security safeguards.
prerequisites:
  - 'Topic 70: HttpServletRequest & HttpServletResponse Processing'
  - 'Topic 72: Request Dispatching: Forward, Include & Redirect'
---

## Overview
Web applications process client input through standard URL-encoded forms (`application/x-www-form-urlencoded`) and multipart form data (`multipart/form-data`). In Jakarta Servlet, file uploads are handled declaratively using the `@MultipartConfig` annotation, exposing uploaded binary streams through the `jakarta.servlet.http.Part` interface.

---

## Encoding Types Comparison

| Encoding Type | Content-Type Header | Payload Structure | Best Used For |
| :--- | :--- | :--- | :--- |
| **URL-Encoded** | `application/x-www-form-urlencoded` | Key-value pairs: `name=John+Doe&age=30` | Standard text fields and short form submissions |
| **Multipart** | `multipart/form-data; boundary=...` | MIME boundaries separating individual parts | Binary files (images, PDFs) + mixed text fields |

---

## `@MultipartConfig` Configuration Attributes

| Attribute | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **`location`** | `String` | `""` (temp dir) | Directory where files are buffered on disk when exceeding threshold |
| **`maxFileSize`** | `long` | `-1L` (unlimited)| Maximum permitted file size in bytes for an individual file part |
| **`maxRequestSize`**| `long` | `-1L` (unlimited)| Maximum permitted total size in bytes for the entire multipart request |
| **`fileSizeThreshold`**| `int` | `0` bytes | Memory threshold; files larger than this are written to disk buffer |

---

## Production Implementation: Secure File Upload Controller

```java
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@WebServlet("/upload/avatar")
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024,      // 1 MB memory buffer
    maxFileSize = 1024 * 1024 * 5,         // 5 MB max per file
    maxRequestSize = 1024 * 1024 * 10     // 10 MB max request total
)
public class FileUploadServlet extends HttpServlet {

    private static final Path UPLOAD_DIR = Paths.get("/var/app/uploads");

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Part filePart = req.getPart("avatar");

        if (filePart == null || filePart.getSize() == 0) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "No file uploaded.");
            return;
        }

        // Validate MIME type
        String contentType = filePart.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            resp.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, "Only images allowed.");
            return;
        }

        // Sanitize file name to prevent Path Traversal attacks (CVE-standard)
        String extension = contentType.equals("image/png") ? ".png" : ".jpg";
        String safeFileName = UUID.randomUUID() + extension;
        Path destination = UPLOAD_DIR.resolve(safeFileName).normalize();

        // Enforce boundary check
        if (!destination.startsWith(UPLOAD_DIR)) {
            throw new SecurityException("Path traversal attempt detected.");
        }

        try (InputStream input = filePart.getInputStream()) {
            Files.copy(input, destination, StandardCopyOption.REPLACE_EXISTING);
        }

        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.getWriter().printf("File uploaded successfully as: %s%n", safeFileName);
    }
}
```

---

## Common Pitfalls & Security Traps

- **Missing `@MultipartConfig` Annotation:**
  Attempting to call `req.getPart("file")` on a servlet without `@MultipartConfig` throws `ServletException: Unable to process parts as no multi-part configuration is provided`.
- **Path Traversal Vulnerability via `getSubmittedFileName()`:**
  `part.getSubmittedFileName()` returns the exact client-supplied filename, which may contain malicious sequences like `../../etc/passwd`. Never concatenate the submitted filename directly into a filesystem path; always generate a synthetic UUID or sanitize strictly.
- **Denial of Service via Unbounded File Uploads:**
  Omitting `maxFileSize` and `maxRequestSize` allows malicious clients to upload gigabyte-sized files, causing server disk exhaustion or `OutOfMemoryError`. Always configure explicit byte ceilings.

---

## Verification & Practice

**Question:** An attacker uploads a file named `avatar.jpg` containing raw executable PHP or JSP code into a publicly served directory. Why is generating a random `UUID` and storing files outside the web root essential?

**Explanation:** If an uploaded file retains its original name and is stored inside a publicly accessible web root, the web server or container might execute it as server-side script when requested via URL, granting the attacker Remote Code Execution (RCE). Storing files outside the web root under synthetic UUID names ensures they can never be directly executed by the server.

---

## Practice

### Q: Why must an `HttpServlet` be annotated with `@MultipartConfig` when processing file uploads submitted with `enctype="multipart/form-data"`?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Standard URL-encoded forms submit data as key-value text pairs. `multipart/form-data` transmits boundaries separating binary file payloads and form fields. The `@MultipartConfig` annotation instructs the servlet container to activate multipart parser handlers, enabling the servlet to invoke `request.getPart("file")` and stream uploaded binary chunks directly to disk or temporary buffers.
</details>
