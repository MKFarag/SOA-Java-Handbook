---
id: topic-76
slug: web-security-essentials
topicNumber: 76
title: Jakarta Web Security Essentials
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 20
sectionTitle: 'State Management, Filtering & Security'
versionBadge: Jakarta Security 3.0 / Servlet 6.0
difficulty: Advanced
readingTime: 9 min read
shortDescription: >-
  Reference: Container-managed declarative security in web.xml
  (security-constraint, auth-constraint), authentication mechanisms (BASIC,
  FORM, CLIENT-CERT), and programmatic security APIs.
prerequisites:
  - 'Topic 73: State Management: Sessions & Secure Cookies'
  - 'Topic 74: Servlet Filters & FilterChain Architecture'
---

## Overview
Jakarta Web Security provides standardized declarative and programmatic authentication and authorization mechanisms managed by the servlet container. Through XML constraints or modern Jakarta Security annotations, applications restrict URL access by caller roles, enforce encrypted HTTPS transport, and inspect caller credentials via container-managed identities.

---

## Declarative Security Elements in web.xml

| Element | Parent | Configuration Responsibility |
| :--- | :--- | :--- |
| **`<security-constraint>`** | `<web-app>` | Top-level container defining protected URL patterns and role requirements |
| **`<web-resource-collection>`** | `<security-constraint>` | Specifies URL patterns and HTTP methods (`<http-method>`) subject to protection |
| **`<auth-constraint>`** | `<security-constraint>` | Names roles permitted access (`<role-name>ADMIN</role-name>` or `*`) |
| **`<user-data-constraint>`** | `<security-constraint>` | Enforces SSL/TLS via `<transport-guarantee>CONFIDENTIAL</transport-guarantee>` |
| **`<login-config>`** | `<web-app>` | Configures auth method (`BASIC`, `FORM`, `CLIENT-CERT`) and form login pages |
| **`<security-role>`** | `<web-app>` | Declares valid application security roles referenced by constraints |

---

## Programmatic Security API Contract

```java
// Available directly on HttpServletRequest
boolean authenticated = req.authenticate(response); // Triggers container login dialog
req.login("username", "password");                  // Programmatic credential submission
req.logout();                                       // Clears user identity and invalidates session
boolean isAdmin = req.isUserInRole("ADMIN");        // Queries caller role membership
Principal user = req.getUserPrincipal();             // Returns caller identity (Principal.getName())
```

---

## Production Implementation: Declarative Security in web.xml

```xml
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" version="6.0">

    <!-- Restrict /admin/* to users with role ADMIN and enforce HTTPS -->
    <security-constraint>
        <web-resource-collection>
            <web-resource-name>Admin Console</web-resource-name>
            <url-pattern>/admin/*</url-pattern>
            <http-method>GET</http-method>
            <http-method>POST</http-method>
        </web-resource-collection>
        <auth-constraint>
            <role-name>ADMIN</role-name>
        </auth-constraint>
        <user-data-constraint>
            <transport-guarantee>CONFIDENTIAL</transport-guarantee>
        </user-data-constraint>
    </security-constraint>

    <!-- Configure Form-Based Authentication -->
    <login-config>
        <auth-method>FORM</auth-method>
        <realm-name>EnterpriseRealm</realm-name>
        <form-login-config>
            <form-login-page>/login.jsp</form-login-page>
            <form-error-page>/login-error.jsp</form-error-page>
        </form-login-config>
    </login-config>

    <security-role>
        <role-name>ADMIN</role-name>
    </security-role>

</web-app>
```

---

## Common Pitfalls & Security Traps

- **The HTTP Method Omission Trap in `<web-resource-collection>`:**
  Listing specific methods like `<http-method>GET</http-method>` protects ONLY `GET` requests. An attacker issuing `POST`, `HEAD`, or `PUT` bypasses the `<auth-constraint>` completely. Omit `<http-method>` entirely to protect **all** HTTP verbs by default.
- **Form Action Discrepancies in FORM Auth:**
  In FORM authentication, the HTML login form must submit via `POST` to the special container action `j_security_check` with input fields named exactly `j_username` and `j_password`. Changing field names prevents container credential interception.
- **Confidential Transport on Non-SSL Ports:**
  Configuring `<transport-guarantee>CONFIDENTIAL</transport-guarantee>` instructs Tomcat to redirect HTTP requests to the secure redirect port (default 8443). If SSL/TLS connectors are not configured in `conf/server.xml`, the browser receives a connection refused error.

---

## Verification & Practice

**Question:** An application defines `<auth-constraint><role-name>*</role-name></auth-constraint>`. What does the asterisk `*` specify according to the Jakarta Servlet specification?

**Explanation:** In Jakarta Servlet 3.0+, `*` matches **any authenticated user**, regardless of specific role assignment, provided the user successfully authenticated against the container realm. In contrast, `<role-name>**</role-name>` specifically requires that the user is authenticated and mapped to at least one declared application role.

---

## Practice

### Q: How does the Synchronizer Token Pattern defend against Cross-Site Request Forgery (CSRF) attacks in server-side Java web applications?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** CSRF attacks rely on the browser automatically attaching session cookies (`JSESSIONID`) when submitting cross-site requests. The Synchronizer Token Pattern stores an unpredictable random token in user session state and embeds it in HTML forms as a hidden field. Because malicious cross-origin sites cannot read or forge this token under the Same-Origin Policy, the server validates the incoming token against session state and rejects requests where tokens mismatch.
</details>
