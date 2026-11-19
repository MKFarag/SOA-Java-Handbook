package com.handbook.web;

public class JspTranslationInspectorDemo {

    public static String translateJspSnippet(String jspText) {
        StringBuilder javaSource = new StringBuilder();
        javaSource.append("// Translated by Jasper JSP Engine\n");
        javaSource.append("public final class HelloJsp extends org.apache.jasper.runtime.HttpJspBase {\n");
        javaSource.append("  public void _jspService(HttpServletRequest request, HttpServletResponse response) throws Exception {\n");
        javaSource.append("    JspWriter out = pageContext.getOut();\n");

        for (String line : jspText.split("\\r?\\n")) {
            line = line.trim();
            if (line.startsWith("<%--") && line.endsWith("--%>")) {
                // JSP Comment: ignored in translated Java code
                continue;
            } else if (line.startsWith("<%=") && line.endsWith("%>")) {
                // Expression: evaluated and passed to out.print()
                String expr = line.substring(3, line.length() - 2).trim();
                javaSource.append("    out.print(").append(expr).append(");\n");
            } else if (line.startsWith("<%") && line.endsWith("%>")) {
                // Scriptlet: raw Java statements placed directly into _jspService()
                String stmt = line.substring(2, line.length() - 2).trim();
                javaSource.append("    ").append(stmt).append("\n");
            } else if (!line.isBlank()) {
                // Static template text: written via out.write()
                javaSource.append("    out.write(\"").append(line.replace("\"", "\\\"")).append("\\n\");\n");
            }
        }
        javaSource.append("  }\n}");
        return javaSource.toString();
    }

    public static void main(String[] args) {
        System.out.println("=== Jasper JSP Translation Simulator ===");
        String sampleJsp = """
            <%@ page contentType="text/html" %>
            <%-- User Greeting Banner --%>
            <h1>Welcome to Java Handbook</h1>
            <% String user = request.getParameter("name"); %>
            <p>Hello, <%= user != null ? user : "Guest" %></p>
            """;

        System.out.println("Input Raw JSP Template:");
        System.out.println(sampleJsp);

        System.out.println("Generated Servlet Source (_jspService):");
        String generated = translateJspSnippet(sampleJsp);
        System.out.println(generated);

        System.out.println("JSP translation simulation completed successfully.");
    }
}
