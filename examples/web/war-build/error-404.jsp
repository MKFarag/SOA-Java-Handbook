<%@ page isErrorPage="true" contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>404 - Resource Not Found</title>
    <style>
        body { font-family: sans-serif; margin: 3rem; background: #fafafa; color: #333; }
        .box { border: 1px solid #e0e0e0; background: #fff; padding: 2rem; border-radius: 8px; max-width: 600px; }
        h1 { color: #d9534f; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="box">
        <h1>404: Page Not Found</h1>
        <p>The requested URL <code>${pageContext.errorData.requestURI}</code> does not exist on this server.</p>
        <p>Status Code: <strong>${pageContext.errorData.statusCode}</strong></p>
        <p><a href="${pageContext.request.contextPath}/">Return to Home</a></p>
    </div>
</body>
</html>
