<%@ page contentType="text/html;charset=UTF-8" %>
<jsp:useBean id="userBean" class="com.handbook.web.UserProfileBean" scope="request" />
<jsp:setProperty name="userBean" property="username" value="Duke" />
<jsp:setProperty name="userBean" property="email" value="duke@oracle.com" />
<!DOCTYPE html>
<html>
<head><title>JSP Implicit Objects &amp; Standard Actions</title></head>
<body>
    <h1>JSP Implicit Objects Demo</h1>
    <p>Session ID: <code><%= session.getId() %></code></p>
    <p>Context Path: <code><%= application.getContextPath() %></code></p>
    <p>User Bean: <strong><jsp:getProperty name="userBean" property="username" /></strong> (<jsp:getProperty name="userBean" property="email" />)</p>
</body>
</html>
