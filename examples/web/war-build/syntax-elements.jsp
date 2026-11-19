<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%! 
    // JSP Declaration: Class field and method
    private int globalCounter = 0;
    private synchronized int getNextHit() { return ++globalCounter; }
%>
<!DOCTYPE html>
<html>
<head>
    <title>JSP Syntax Elements Demo</title>
</head>
<body>
    <h1>JSP Syntax Breakdown</h1>
    <%-- JSP Comment: never sent to browser --%>
    <%
        // JSP Scriptlet: Local code executed inside _jspService()
        String clientIp = request.getRemoteAddr();
        int currentHit = getNextHit();
    %>
    <p>Client IP: <strong><%= clientIp %></strong></p>
    <p>Global Hit Counter: <strong><%= currentHit %></strong></p>
</body>
</html>
