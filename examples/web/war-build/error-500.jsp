<%@ page isErrorPage="true" contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>500 - Server Application Error</title>
    <style>
        body { font-family: sans-serif; margin: 3rem; background: #fff5f5; color: #333; }
        .box { border: 1px solid #fed7d7; background: #fff; padding: 2rem; border-radius: 8px; max-width: 650px; }
        h1 { color: #e53e3e; }
        pre { background: #2d3748; color: #f7fafc; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: 0.85rem; }
    </style>
</head>
<body>
    <div class="box">
        <h1>500: Internal Server Error</h1>
        <p>A fatal exception occurred while processing request for <code>${pageContext.errorData.requestURI}</code>.</p>
        <p>Exception Message: <strong>${pageContext.errorData.throwable.message}</strong></p>
        <p>Exception Type: <code>${pageContext.errorData.throwable.class.name}</code></p>
        <p>Status Code: <strong>${pageContext.errorData.statusCode}</strong></p>
    </div>
</body>
</html>
