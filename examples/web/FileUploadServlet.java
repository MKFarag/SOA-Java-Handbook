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
    fileSizeThreshold = 1024 * 1024,      // 1 MB: memory buffer threshold
    maxFileSize = 1024 * 1024 * 10,       // 10 MB: maximum size per individual file
    maxRequestSize = 1024 * 1024 * 25     // 25 MB: maximum total multipart request size
)
public class FileUploadServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");

        // 1. Process regular form fields
        String description = req.getParameter("description");
        if (description == null || description.trim().isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().println("Validation Error: 'description' parameter is mandatory.");
            return;
        }

        // 2. Retrieve uploaded file Part
        Part filePart = req.getPart("document");
        if (filePart == null || filePart.getSize() == 0) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().println("Validation Error: No file uploaded under 'document'.");
            return;
        }

        // 3. Extract and sanitize submitted filename
        String submittedFilename = filePart.getSubmittedFileName();
        if (submittedFilename == null || submittedFilename.contains("..")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().println("Security Error: Invalid or path-traversal filename detected.");
            return;
        }
        String cleanName = new File(submittedFilename).getName();

        // 4. Stream upload into target directory safely
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
