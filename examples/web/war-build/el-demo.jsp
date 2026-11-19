<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="hb" uri="https://handbook.java/tags" %>
<!DOCTYPE html>
<html>
<head><title>Jakarta EL &amp; Custom Tags</title></head>
<body>
    <h1>Expression Language &amp; Custom Tag Demo</h1>
    <p>User Agent: <code>${header['User-Agent']}</code></p>
    <p>Theme: <code>${not empty param.theme ? param.theme : 'Standard'}</code></p>
    <p>Item Price (USD): <hb:formatCurrency amount="149.99" currencyCode="USD" /></p>
    <p>Item Price (EUR): <hb:formatCurrency amount="129.50" currencyCode="EUR" /></p>
</body>
</html>
