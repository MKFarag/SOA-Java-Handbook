---
id: topic-78
slug: custom-jsp-tag-libraries
topicNumber: 78
title: Custom JSP Tag Libraries
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 21
sectionTitle: JavaServer Pages (JSP) & Templating
versionBadge: Jakarta Pages 3.1 / EE 10
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Build domain-specific view components: extend SimpleTagSupport, create Tag
  Library Descriptors (.tld), accept dynamic EL attributes, and format localized
  data.
prerequisites:
  - 'Topic 74: JSP Architecture & Translation Lifecycle'
  - 'Topic 77: Expression Language (EL) & JSTL Core Tags'
relevanceLevel: OPTIONAL / LEGACY
---
# Custom JSP Tag Libraries

> 🏛️ **Roadmap Seal:** **`[OPTIONAL / LEGACY]`** — *Historical / legacy enterprise tech. Safely skip unless maintaining legacy enterprise systems.*

### 1. What It Is and Why It Exists
While the Jakarta Standard Tag Library (JSTL) covers universal programming operations (loops, conditionals, URL formatting), real-world enterprise applications have specialized domain requirements:
- Formatting localized monetary values and tax breakdowns.
- Rendering complex navigation menus based on role permissions.
- Masking sensitive personal data (e.g. credit card `****-****-****-1234`).
- Rendering reusable UI widgets and interactive components.

Rather than copying repetitive EL logic across hundreds of view files, the Jakarta Pages platform allows developers to create **Custom Tag Libraries**. A custom tag is an XML element backed by a Java class (extending `SimpleTagSupport`) and registered in a **Tag Library Descriptor (`.tld`)** XML file.

**Real-World Analogy:**
Imagine building a physical house. Standard JSTL tags are basic construction materials like 2x4 wooden studs, common nails, and drywall sheets. Custom Tag Libraries are pre-fabricated modular components—such as a custom bay window unit or an engineered spiral staircase—manufactured once in a factory and dropped cleanly into multiple rooms with a single installation step.

---

### 2. Prerequisites
- **JSP Architecture & Translation (Topic 74)**: Understanding how the container compiles tags into Java method calls.
- **Expression Language (EL) & JSTL (Topic 77)**: Understanding taglib directives and attribute passing.

---

### 3. Syntax Breakdown

#### 3.1 The Simple Tag Handler Lifecycle (`SimpleTagSupport`)
The `jakarta.servlet.jsp.tagext.SimpleTagSupport` base class provides a clean, streamlined lifecycle for authoring custom tags:
```java
package jakarta.servlet.jsp.tagext;

public class SimpleTagSupport implements SimpleTag {
    public void setJspContext(JspContext pc) { ... }
    public void setParent(JspTag parent) { ... }
    public void setJspBody(JspFragment jspBody) { ... }

    // THE CORE HOOK OVERRIDDEN BY DEVELOPERS:
    public void doTag() throws JspException, IOException { ... }
}
```
1. **Container creates an instance** of the tag handler.
2. **`setJspContext()`** supplies the `PageContext`.
3. **Setter methods** are invoked for each declared tag attribute.
4. **`doTag()`** executes; writes custom output to `getJspContext().getOut()`.

#### 3.2 The Tag Library Descriptor (`.tld`)
Custom tags must be declared in an XML descriptor file placed inside `WEB-INF/` or `META-INF/`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<taglib xmlns="https://jakarta.ee/xml/ns/jakartaee"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                            https://jakarta.ee/xml/ns/jakartaee/web-jsptaglibrary_3_0.xsd"
        version="3.0">

    <tlib-version>1.0</tlib-version>
    <short-name>hb</short-name>
    <uri>https://handbook.java/tags</uri>

    <tag>
        <name>formatCurrency</name>
        <tag-class>com.handbook.web.FormatCurrencyTag</tag-class>
        <body-content>empty</body-content>
        <attribute>
            <name>amount</name>
            <required>true</required>
            <rtexprvalue>true</rtexprvalue> <!-- Accepts runtime Expression Language (${...}) -->
            <type>double</type>
        </attribute>
    </tag>
</taglib>
```

---

### 4. Runnable Code Examples

#### Example 1: Localized Currency Formatter Tag Handler (Basic)
Demonstrates extending `SimpleTagSupport`, receiving typed attributes, and formatting currency.

```java
package com.handbook.web;

import jakarta.servlet.jsp.JspException;
import jakarta.servlet.jsp.JspWriter;
import jakarta.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.Locale;

public class FormatCurrencyTag extends SimpleTagSupport {

    private double amount;
    private String currencyCode = "USD";

    // Setters called automatically by container
    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    @Override
    public void doTag() throws JspException, IOException {
        JspWriter out = getJspContext().getOut();
        Locale locale = "EUR".equalsIgnoreCase(currencyCode) ? Locale.GERMANY : Locale.US;
        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
        out.print(formatter.format(amount));
    }
}
```

---

#### Example 2: Consuming Custom Tags in JSP (Realistic)
```jsp
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="hb" uri="https://handbook.java/tags" %>
<!DOCTYPE html>
<html>
<head><title>Custom Tag Demo</title></head>
<body>
    <h1>Custom Tag Currency Formatting</h1>
    <p>Product A Price: <hb:formatCurrency amount="149.99" currencyCode="USD" /></p>
    <p>Product B Price: <hb:formatCurrency amount="129.50" currencyCode="EUR" /></p>
</body>
</html>
```

**Expected HTTP Response Output:**
```http
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html>
<html>
<head><title>Custom Tag Demo</title></head>
<body>
    <h1>Custom Tag Currency Formatting</h1>
    <p>Product A Price: $149.99</p>
    <p>Product B Price: 129,50 €</p>
</body>
</html>
```

---

### 5. Step-by-Step Execution Trace
1. **Taglib Discovery**: Jasper parses `<%@ taglib prefix="hb" uri="https://handbook.java/tags" %>` and locates `handbook-tags.tld` inside `WEB-INF/tld/`.
2. **Class Lookup**: When encountering `<hb:formatCurrency>`, Jasper identifies `com.handbook.web.FormatCurrencyTag`.
3. **Instantiation**: Inside translated `_jspService()`, a new `FormatCurrencyTag` instance is allocated.
4. **Attribute Injection**: Jasper invokes `tag.setAmount(149.99)` and `tag.setCurrencyCode("USD")`.
5. **Execution**: `tag.doTag()` runs, acquires the `JspWriter`, formats `$149.99`, and prints it directly to the socket response.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Missing `<rtexprvalue>true</rtexprvalue>` in `.tld`
```xml
<attribute>
    <name>amount</name>
    <required>true</required>
    <!-- Missing rtexprvalue! -->
</attribute>
```
*Why it fails*: If `<rtexprvalue>` (Runtime Expression Value) is omitted or `false`, passing an EL expression like `<hb:formatCurrency amount="${item.price}" />` throws a compilation error because Jasper treats the input as literal text rather than evaluating EL.
*The Fix*: Always specify `<rtexprvalue>true</rtexprvalue>` on attributes meant to accept dynamic `${...}` values.

#### Mistake 2: Storing state across invocations in tag handler fields
*Why it fails*: If a tag handler instance is reused by the container (tag pooling), uncleared fields can leak data between different tag executions.
*The Fix*: Ensure all fields are overwritten by setters or reset before `doTag()` completes.

---

### 7. Best Practices
- **Use Tag Files (`.tag`) for UI Component Layouts**: For pure HTML/CSS component layouts, write `.tag` files in `WEB-INF/tags/` instead of compiled Java classes.
- **Use Java Custom Tags for Heavy Computation**: Use Java classes (`SimpleTagSupport`) when custom formatting requires Java APIs (number formatting, encryption, database access).

---

### 8. Version Notes
- **JSP 1.1**: Classic tag handlers (`TagSupport`, `BodyTagSupport`) introduced (verbose lifecycle).
- **JSP 2.0**: Introduced `SimpleTagSupport` and Tag Files (`.tag`), simplifying custom tag development by 80%.
- **Jakarta Pages 3.1 (Jakarta EE 10)**: Schema updated to `https://jakarta.ee/xml/ns/jakartaee/web-jsptaglibrary_3_0.xsd`.

---

### 9. Summary Cheat Sheet: Tag Library Descriptor XML Elements

| TLD Element | Sub-elements | Purpose |
| :--- | :--- | :--- |
| `<taglib>` | `<tlib-version>`, `<short-name>`, `<uri>` | Root container defining library metadata and unique URI |
| `<tag>` | `<name>`, `<tag-class>`, `<body-content>` | Declares a single tag and its backing Java class |
| `<body-content>` | `empty`, `scriptless`, `tagdependent` | Declares whether tag accepts child markup |
| `<attribute>` | `<name>`, `<required>`, `<rtexprvalue>`, `<type>` | Declares a tag parameter and whether it accepts EL |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (Static String Parsing)
Why does `<my:alert message="${errorMessage}" />` print the literal string `"${errorMessage}"` on the browser rather than the actual message?
<details>
<summary>View Solution</summary>

```
Cause: The attribute definition in the .tld file lacks <rtexprvalue>true</rtexprvalue>.
Without rtexprvalue set to true, the JSP compiler treats the value as literal text and does not invoke the EL resolver.
Fix: Add <rtexprvalue>true</rtexprvalue> to the attribute definition in the TLD file.
```
</details>

#### Exercise 2: Hands-on Implementation (Masking Sensitive Credit Cards)
Write a `doTag()` method in a `MaskCreditCardTag` that prints only the last 4 digits of a 16-digit card string, masking the first 12 with asterisks.

<details>
<summary>View Solution</summary>

```java
public class MaskCreditCardTag extends SimpleTagSupport {
    private String cardNumber;
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    @Override
    public void doTag() throws JspException, IOException {
        if (cardNumber == null || cardNumber.length() < 4) {
            getJspContext().getOut().print("****");
            return;
        }
        String lastFour = cardNumber.substring(cardNumber.length() - 4);
        getJspContext().getOut().print("****-****-****-" + lastFour);
    }
}
```
</details>

#### Exercise 3: Real-World Architecture (Body Content Types)
What is the difference between `<body-content>empty</body-content>` and `<body-content>scriptless</body-content>`?

<details>
<summary>View Solution</summary>

```
1. <body-content>empty</body-content>:
   The tag MUST NOT have any body content. It must be written as a self-closing tag (<tag />) or have empty body (<tag></tag>).

2. <body-content>scriptless</body-content>:
   The tag can contain body content including HTML, EL expressions (${...}), and other custom tags, but CANNOT contain raw Java scriptlets (<% %>). This is the standard for modern tags.
```
</details>

---

### 11. Official Sources
- [Jakarta Pages Specification 3.1: Chapter 7 Tag Libraries](https://jakarta.ee/specifications/pages/3.1/) — Jakarta EE
- [Apache Tomcat Documentation: Tag Library Descriptor Schema](https://tomcat.apache.org/tomcat-10.1-doc/index.html) — Apache Tomcat
