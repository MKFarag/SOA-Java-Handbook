# Java & Jakarta EE Interactive Handbook (Offline-First)

> **A comprehensive, offline-first reference and learning platform covering Java 8 through Java 26 and Jakarta EE 10/11.**  
> Designed from absolute zero for beginners and modern enterprise software engineers.
>
> **Architect & Author:** **Mohamed Khaled Farag**  
> 🔗 **LinkedIn:** [linkedin.com/in/mk-farag](https://www.linkedin.com/in/mk-farag/)  
> ✉️ **Email:** [mohammedkhaled.fa@gmail.com](mailto:mohammedkhaled.fa@gmail.com)  
> 🐙 **GitHub:** [github.com/mkfarag/java-handbook](https://github.com/mkfarag/java-handbook)  
> 🐳 **Docker Hub:** [hub.docker.com/r/mkfarag/java-handbook](https://hub.docker.com/r/mkfarag/java-handbook)

---

## 🌟 Key Features

- **100% Offline-First:** Zero runtime CDN dependencies, zero external font fetches. Everything runs directly on your local machine or container.
- **Official Completion Certificate:** Interactive, print-ready, and exportable (JSON & A4 PDF) verified Certificate of Technical Mastery issued upon completing all 87 modules.
- **VS Code Dark+ & Light Paper Themes:** Built to match developer ergonomics with a deep `#18181b` slate theme, warm Java amber/orange accents, and crisp light paper mode.
- **Offline Full-Text Search:** Sub-millisecond client-side indexing powered by MiniSearch with instant keyword matching, fuzzy tolerance, and `Ctrl + K` shortcut.
- **Dual-Tab Code Blocks:** Switch between Java source code and exact terminal/console output with one-click copy buttons.
- **Interactive Exercises:** 3 to 5 challenges per topic (Spot the Bug, Hands-on Implementation, Edge Case) with click-to-reveal solution panels.
- **Local JDK & Apache Tomcat Verification:** Every code snippet is compiled against JDK 26.0.1 and portable Apache Tomcat 10.1.61 with 160 automated test suites passed (0 failed).
- **Bookmarks & Progress:** Save topics for interview revision and track completion percentages across sections.

---

## 🚀 Quick Start (أسهل طريقتين لتشغيل المشروع)

### 1. تشغيل فوري عبر Docker (بدون كود وبدون تسطيب Node.js)
لو عندك Docker، انسخ الأمر ده وشغله في التيرمينال فوراً:
```bash
docker run -d -p 3000:80 --name java_handbook mkfarag/java-handbook:latest
```
وافتح المتصفح على: **[http://localhost:3000](http://localhost:3000)**.

---

### 2. تشغيل عبر كود المشروع (Git Clone)
لو حابب تسحب الكود وتشغله على جهازك:
```bash
# 1. اسحب المشروع
git clone https://github.com/MKFarag/java-handbook.git
cd java-handbook

# 2. سطب وشغل
npm install
npm run dev
```
وافتح المتصفح على: **[http://localhost:5173](http://localhost:5173)**.

> **ملاحظة:** يمكن أيضاً تحميل المشروع كملف مضغوط **ZIP** مباشرة بالضغط على زر **Code** ثم **Download ZIP** من صفحة GitHub، وفك الضغط وتشغيل `npm install` ثم `npm run dev`.

---

## 📚 Syllabus Overview

- **Part 1: Java Core (Sections 1–16, Topics 01–62):**
  - Foundations, Compilation, JDK vs JRE vs JVM
  - Primitives, Operators, Type Casting, Strings, Text Blocks
  - Control Flow, Modern Switch Expressions, Loops
  - Methods, Overloading, Scope, `var`
  - Arrays, Object-Oriented Programming (OOP) Essentials
  - Inheritance, Polymorphism, Abstract Classes, Interfaces
  - Modern Java: Records, Sealed Classes, Pattern Matching
  - Exception Handling, Try-With-Resources
  - Generics, Wildcards (PECS), Collections Framework (List, Set, Map, Deque)
  - Lambdas, Functional Interfaces, Stream API, Optional
  - File I/O, NIO.2, Date/Time API (`java.time`)
  - Concurrency, Locks, Thread Pools, CompletableFuture, Virtual Threads, Structured Concurrency
  - JVM Internals: Memory Model (JMM), Garbage Collection (G1, ZGC), JIT, ClassLoaders
  - Reflection, Annotations, Java Platform Module System (JPMS)
  - JDBC Fundamentals and Build Automation (Maven / Gradle)

- **Part 2: Java EE & Jakarta EE (Sections 17–23, Topics 63–87):**
  - The Great Transition: `javax.*` to `jakarta.*` namespace migration
  - Web Architecture & HTTP protocol fundamentals
  - Apache Tomcat container architecture and WAR packaging
  - Servlets Deep Dive: Lifecycle (`init`, `service`, `destroy`), Request/Response processing, Annotations vs `web.xml`, Dispatching (Forward vs Redirect)
  - State Management: Sessions, Cookies, Filters, Listeners, Web Security (CSRF, XSS)
  - JavaServer Pages (JSP): Translation lifecycle, Directives, Scriptlets, EL, JSTL, Custom Tags
  - The Web MVC Pattern, Form Handling, Multipart Uploads, Error Pages, JNDI Connection Pooling
  - Jakarta EE Enterprise Stack: JPA, CDI, JAX-RS, Bean Validation, JSF, EJB

---

## 🔬 Strict 11-Step Depth Standard per Topic

1. **What It Is and Why It Exists** (Plain language definition + intuitive real-world analogy)
2. **Prerequisites**
3. **Syntax Breakdown** (Annotated keyword and symbol breakdown)
4. **Runnable Code Examples** (Basic minimal + realistic production scenario with expected terminal output)
5. **Step-by-Step Execution** (Trace of what happens when the code runs)
6. **Common Mistakes & Compiler / Runtime Errors** (Real error message, cause, and exact fix)
7. **Best Practices & Anti-Patterns** (Do's, Don'ts, and when NOT to use)
8. **Version Notes & Compatibility Matrix** (Introduced version, preview history, LTS status)
9. **Summary Cheat Sheet** (Comparison table)
10. **Graded Interactive Exercises** (Spot the bug, hands-on, edge case with hidden solutions)
11. **Verified Official Sources** (Direct links to Oracle, OpenJDK, Jakarta EE, and Tomcat docs)
