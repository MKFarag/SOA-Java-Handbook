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

## 🚀 Quick Start

### 1. Run with Docker (Recommended)
```bash
# Pull and run the pre-built image from Docker Hub:
docker run -d -p 3000:80 --name java_handbook mkfarag/java-handbook:latest

# Or build and start locally with Docker Compose:
docker compose up -d
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Run Locally with Node.js
```bash
# Clone the repository
git clone https://github.com/mkfarag/java-handbook.git
cd java-handbook

# Install dependencies
npm install

# Start local development server
npm run dev

# Or build and test the offline production bundle
npm run build
npm run preview
```

### 3. Run Automated Code Verifications
```bash
node scripts/verify-examples.mjs
```
This runs the automated verification suite executing 160 test scenarios across all 87 topics, compiling Java source files with `javac` and verifying Servlet compilation against Tomcat libraries.

---

## 📦 How to Share the Handbook with Others

### Option 1: Share via Docker Hub (Fastest)
Anyone with Docker can run the entire handbook with a single command without downloading source code or installing Node.js:
```bash
docker pull mkfarag/java-handbook:latest
docker run -d -p 3000:80 --name java_handbook mkfarag/java-handbook:latest
```

### Option 2: Share as a Standalone Tar Archive (Air-Gapped / USB)
You can export the built Docker image into a single `.tar` archive and send it to anyone via USB drive or offline network transfer:
```bash
# 1. Save image to a portable file
docker save -o java-handbook.tar mkfarag/java-handbook:latest

# 2. On the recipient's machine (no internet needed):
docker load -i java-handbook.tar
docker run -d -p 3000:80 --name java_handbook mkfarag/java-handbook:latest
```
The recipient opens `http://localhost:3000` in any web browser.

### Option 3: Share as a Pre-Built Static Folder (Zero-Docker / Zero-Node)
Because this handbook is 100% static and offline-first, you can distribute the built `dist/` directory:
```bash
# 1. Build production assets
npm run build

# 2. Compress the 'dist' folder into a zip file
# Windows PowerShell:
Compress-Archive -Path dist\* -DestinationPath java-handbook-dist.zip
```
The recipient can unpack the zip and serve it using any lightweight local server:
- Python: `python -m http.server 3000 --directory dist`
- Node: `npx serve dist`
- Or drag-and-drop onto free static hosts like GitHub Pages, Vercel, Netlify, or Cloudflare Pages.

### Option 4: Share & Contribute via GitHub
```bash
# Clone repository
git clone https://github.com/mkfarag/java-handbook.git
cd java-handbook

# Run locally or with Docker
npm install && npm run dev
# or: docker compose up -d
```

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
