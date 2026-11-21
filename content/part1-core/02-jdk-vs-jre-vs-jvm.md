---
id: topic-02
slug: jdk-vs-jre-vs-jvm-and-setup
topicNumber: 2
title: JDK vs JRE vs JVM & Setup
part: 'Part 1: Java Core'
sectionNumber: 1
sectionTitle: Foundations & Architecture
versionBadge: Java 21 LTS (Baseline) / Java 25 LTS
difficulty: Beginner
readingTime: 9 min read
shortDescription: >-
  Master the three concentric layers of Java: the Virtual Machine (JVM), the
  Runtime Environment (JRE), and the Development Kit (JDK). Configure PATH and
  JAVA_HOME with zero confusion.
prerequisites:
  - 'Topic 01: What is Programming & How Code Runs'
relevanceLevel: MUST-KNOW / CORE
---
> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

To write and run software in Java, you must understand the three concentric components that form the Java ecosystem: the **JVM**, the **JRE**, and the **JDK**. Many beginners get confused because they download "Java" without knowing which layer they actually installed.

```
┌─────────────────────────────────────────────────────────────┐
│                      JDK (Development)                      │
│   javac, jar, jshell, jdb, javap, jlink, documentation      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    JRE (Execution)                    │  │
│  │   Core Class Libraries (java.base, Collections, etc.) │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                  JVM (Engine)                   │  │  │
│  │  │      ClassLoaders, JIT Compiler, GC, Memory     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

1. **JVM (Java Virtual Machine):**  
   The execution engine. It loads compiled `.class` bytecode, validates memory safety, allocates heap/stack memory, performs Garbage Collection, and translates bytecode into host CPU instructions. It cannot compile code; it only executes.
2. **JRE (Java Runtime Environment):**  
   The bundle required to *run* an existing Java program. It consists of the JVM plus the standard class libraries (like `java.lang`, `java.util`, `java.io`). A consumer who just wants to run a Java desktop app or game only needed the JRE.
3. **JDK (Java Development Kit):**  
   The complete toolkit required to *build* Java software. It contains the JRE, the JVM, and all developer tools: the compiler (`javac`), archiver (`jar`), interactive shell (`jshell`), disassembler (`javap`), and debugger (`jdb`).

### The Real-World Analogy
Think of the relationship like an automotive company:
- The **JVM** is the **high-performance engine**. On its own, an engine sitting on a workbench cannot drive down the highway.
- The **JRE** is the **finished consumer car** (engine + chassis + steering wheel + seats). An everyday driver can sit inside and drive down the street, but they cannot manufacture new cars with it.
- The **JDK** is the **full automotive manufacturing factory** (the car, the engine, plus the welding robots, paint sprayers, diagnostic computers, and assembly line). If you are a car manufacturer (software engineer), you must own the factory (the JDK).

### Why Does This Separation Exist?
This separation exists for efficiency, security, and distribution footprint:
- Servers running production code in a cloud cluster do not need compilers (`javac`) or interactive tools taking up disk space or introducing potential security attack vectors.
- Since Java 9, modern Java has evolved even further: Oracle no longer distributes standalone JREs. Instead, developers use the JDK's `jlink` tool to bundle only the exact modules an application needs into a custom, ultra-compact runtime image.

---

## 2. Prerequisites
- **Topic 01: What is Programming & How Code Runs** (Understanding bytecode and compilation).

---

## 3. Syntax Breakdown & Environment Configuration

To allow your operating system terminal (PowerShell, Command Prompt, bash, or zsh) to find Java tools from any folder on your hard drive, you must configure two environment variables:

### 1. `JAVA_HOME`
An environment variable that points to the root directory where your JDK is installed.
- **Windows Example:** `C:\Program Files\Java\jdk-21` (or `jdk-25` / `jdk-26`)
- **Linux/macOS Example:** `/usr/lib/jvm/java-21-openjdk` or `/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home`

### 2. `PATH`
An operating system search list of directories containing executable commands. When you type `javac` or `java`, your OS searches every directory in `PATH` from left to right.
- You must append `%JAVA_HOME%\bin` (Windows) or `$JAVA_HOME/bin` (Linux/macOS) to your `PATH`.

### CLI Verification Commands Breakdown
```powershell
# 1. Check compiler version (verifies JDK installation)
javac -version
# Output: javac 26.0.1

# 2. Check runtime launcher version (verifies JVM / JRE)
java -version
# Output: java version "26.0.1" 2026-04-21

# 3. Print the JAVA_HOME variable
echo $env:JAVA_HOME
```

---

## 4. Fully Runnable Code Examples

### Example 1: Querying JVM and Java Home Metadata via Code
This program demonstrates how Java inspects its own installation paths, specification versions, and runtime properties programmatically.

```java
// RuntimeInspector.java
public class RuntimeInspector {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("       JAVA RUNTIME & ENVIRONMENT REPORT          ");
        System.out.println("==================================================");
        
        // Query official Java System properties
        String javaHome = System.getProperty("java.home");
        String javaVersion = System.getProperty("java.version");
        String jvmName = System.getProperty("java.vm.name");
        String jvmVendor = System.getProperty("java.vm.vendor");
        String classVersion = System.getProperty("java.class.version");
        
        System.out.println("Active Java Home   : " + javaHome);
        System.out.println("Java Version       : " + javaVersion);
        System.out.println("JVM Implementation : " + jvmName);
        System.out.println("JVM Vendor         : " + jvmVendor);
        System.out.println("Bytecode Version   : " + classVersion);
        System.out.println("==================================================");
    }
}
```

#### Expected Terminal Output
```
==================================================
       JAVA RUNTIME & ENVIRONMENT REPORT          
==================================================
Active Java Home   : C:\Program Files\Java\jdk-26.0.1
Java Version       : 26.0.1
JVM Implementation : Java HotSpot(TM) 64-Bit Server VM
JVM Vendor         : Oracle Corporation
Bytecode Version   : 70.0
==================================================
```

---

### Example 2: Validating System Path & Memory Properties
A practical configuration auditor verifying that system properties meet minimum requirements for development.

```java
// EnvironmentValidator.java
public class EnvironmentValidator {
    public static void main(String[] args) {
        long maxHeapBytes = Runtime.getRuntime().maxMemory();
        long maxHeapMB = maxHeapBytes / (1024 * 1024);
        
        String osArch = System.getProperty("os.arch");
        boolean is64Bit = osArch.contains("64");
        
        System.out.println(">>> Checking Development Environment Compliance <<<");
        System.out.printf("Architecture Check : %s (%s)%n", osArch, is64Bit ? "64-bit Compliant" : "32-bit Legacy");
        System.out.printf("Max Heap Memory    : %d MB%n", maxHeapMB);
        
        if (maxHeapMB >= 512 && is64Bit) {
            System.out.println("STATUS: [READY] System meets enterprise Java development standards.");
        } else {
            System.out.println("STATUS: [WARNING] Limited memory or 32-bit runtime detected.");
        }
    }
}
```

#### Expected Terminal Output
```
>>> Checking Development Environment Compliance <<<
Architecture Check : amd64 (64-bit Compliant)
Max Heap Memory    : 8168 MB
STATUS: [READY] System meets enterprise Java development standards.
```

---

## 5. Step-by-Step: What Happens When This Runs

1. **Terminal Command Entered:** The user types `java -cp . RuntimeInspector` in PowerShell.
2. **OS Searches `PATH`:** Windows iterates through each folder listed in the `%PATH%` variable until it finds `java.exe` in `C:\Program Files\Java\jdk-26.0.1\bin`.
3. **HotSpot VM Launch:** `java.exe` reads the host configuration and initializes the **HotSpot 64-Bit Server VM**.
4. **Bootstrap Class Loading:** The JVM's internal Bootstrap ClassLoader initializes core classes from the Java runtime module system (`java.base`).
5. **System Properties Populated:** The JVM queries the host OS and populates the global `java.lang.System.getProperties()` table (including `java.home`, `java.version`, and `os.arch`).
6. **Execution of `main`:** The bytecode for `RuntimeInspector.class` is verified, pushed to the call stack, and string outputs are dispatched to the console.

---

## 6. Common Mistakes & Compiler / Runtime Errors

### Mistake 1: `javac` is not recognized as an internal or external command
```
'javac' is not recognized as an internal or external command, operable program or batch file.
```
- **Cause:** You installed only a JRE (which lacks developer tools), or you installed the JDK but did not add the JDK's `bin` directory to your system `PATH`.
- **Fix:** Verify you downloaded a JDK. Add `%JAVA_HOME%\bin` to your system `PATH` variable and restart your terminal.

### Mistake 2: Setting `PATH` directly to `JAVA_HOME` instead of `bin`
- **Cause:** Setting `PATH` to `C:\Program Files\Java\jdk-26.0.1` will not work because the executable binaries (`javac.exe`, `java.exe`) are located inside the `bin` subdirectory.
- **Fix:** Always append `\bin` (e.g. `%JAVA_HOME%\bin` or `C:\Program Files\Java\jdk-26.0.1\bin`).

### Mistake 3: Stale Command Prompts after Updating Environment Variables
- **Cause:** Terminals cache environment variables when they open. If you edit `PATH` in Windows System Properties while a PowerShell window is open, the open window will not see the changes.
- **Fix:** Close and reopen your terminal or IDE after modifying environment variables.

---

## 7. Best Practices & Anti-Patterns

### Best Practices (DO):
- **Always install an LTS (Long-Term Support) version for production:** Java 17, Java 21, or Java 25 LTS provide multi-year security patches and stability.
- **Always configure `JAVA_HOME`:** Build tools like Maven, Gradle, IntelliJ IDEA, and Tomcat look specifically for `JAVA_HOME` to locate the compiler.
- **Prefer modern OpenJDK distributions:** Eclipse Temurin (Adoptium), Amazon Corretto, Azul Zulu, or Oracle OpenJDK are standard, production-ready distributions.

### Anti-Patterns (DON'T):
- **Don't install multiple conflicting JDKs in the same PATH:** If you need multiple JDK versions on one machine, use a version manager like `SDKMAN!` (Linux/macOS) or manage `JAVA_HOME` explicitly.
- **Don't hardcode absolute JDK file paths into project files:** Always rely on `JAVA_HOME`.

---

## 8. Version Notes & Compatibility Matrix

- **Java 8 (LTS):** The last major release where standalone JRE downloads were the primary distribution format for end-users.
- **Java 9:** Introduced the Java Platform Module System (JPMS). Standalone JRE distribution was discontinued; the JDK became the universal developer package, and `jlink` was introduced.
- **Java 17 (LTS):** Previous enterprise LTS standard (Spring Boot 3 minimum baseline).
- **Java 21 (LTS):** Modern enterprise Long-Term Support baseline (standardized Virtual Threads, Pattern Matching for switch, Record Patterns, Sequenced Collections). Minimum standard for this handbook.
- **Java 25 (LTS):** Late-2025 enterprise Long-Term Support release with finalized Project Loom, Project Leyden startup, and Project Panama features.
- **Java 26:** Modern feature release.

| JDK Component | Java 8 | Java 11 | Java 17 | Java 21 | Java 25 / 26 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `javac` (Compiler) | Included | Included | Included | Included | Included |
| `jshell` (REPL) | ❌ No | Included | Included | Included | Included |
| `jlink` (Custom runtime builder) | ❌ No | Included | Included | Included | Included |
| Standalone JRE installer | ✅ Yes | ❌ Discontinued | ❌ Discontinued | ❌ Discontinued | ❌ Discontinued |

---

## 9. Summary Cheat Sheet

| Tool / Variable | Category | Purpose | Example Usage |
| :--- | :--- | :--- | :--- |
| **`JAVA_HOME`** | Environment Variable | Points to root JDK directory | `C:\Program Files\Java\jdk-26.0.1` |
| **`PATH`** | Environment Variable | OS command search path | `%JAVA_HOME%\bin` |
| **`javac`** | JDK Tool | Compiles `.java` to `.class` bytecode | `javac App.java` |
| **`java`** | JVM / JRE Tool | Launches and runs Java programs | `java App` |
| **`jar`** | JDK Tool | Packages classes into ZIP/JAR archives | `jar -cvf app.jar -C bin .` |
| **`jshell`** | JDK Tool | Interactive Java REPL for testing code | `jshell` |
| **`javap`** | JDK Tool | Disassembles `.class` files into bytecode | `javap -c App.class` |

---

## 10. Graded Interactive Practice Exercises

### Exercise 1: Spot the Configuration Bug
**Prompt:** A new developer sets their environment variables as follows:
- `JAVA_HOME` = `C:\Program Files\Java\jdk-21\bin`
- `PATH` = `%JAVA_HOME%\bin;%PATH%`
When they run `javac -version`, Windows says command not found. What is the bug?

#### Hidden Solution & Explanation
> **Bug:** `JAVA_HOME` should point to the root JDK folder (`C:\Program Files\Java\jdk-21`), NOT the `bin` folder. Because `JAVA_HOME` already contained `\bin`, the `PATH` expanded to `C:\Program Files\Java\jdk-21\bin\bin`, which does not exist!  
> **Correct Configuration:**  
> - `JAVA_HOME` = `C:\Program Files\Java\jdk-21`  
> - `PATH` = `%JAVA_HOME%\bin;%PATH%`

---

### Exercise 2: Hands-on Implementation Challenge
**Prompt:** Write a Java program named `JvmMemoryCheck` that calculates the amount of free memory currently available in the JVM heap and prints it in Megabytes using `Runtime.getRuntime().freeMemory()`.

#### Starter Code
```java
public class JvmMemoryCheck {
    public static void main(String[] args) {
        // Calculate and print free memory in MB
    }
}
```

#### Hidden Solution & Explanation
```java
public class JvmMemoryCheck {
    public static void main(String[] args) {
        long freeBytes = Runtime.getRuntime().freeMemory();
        long totalBytes = Runtime.getRuntime().totalMemory();
        
        long freeMB = freeBytes / (1024 * 1024);
        long totalMB = totalBytes / (1024 * 1024);
        
        System.out.println("JVM Initial Total Memory: " + totalMB + " MB");
        System.out.println("JVM Unused Free Memory  : " + freeMB + " MB");
    }
}
```
> **Explanation:** `Runtime.getRuntime().freeMemory()` returns an approximation of the memory currently available for future object allocations before the heap must expand.

---

### Exercise 3: Real-World Architecture Challenge: JRE vs JDK in Production Containers
**Prompt:** Why do modern DevOps engineers use multi-stage Dockerfiles that build using a full JDK image, but produce a final deployment container using a minimal JRE or `jlink` runtime image?

#### Hidden Solution & Explanation
> **Explanation:**  
> 1. **Image Size:** A full JDK image is often 400MB–800MB because it includes compilers, debuggers, and development headers. A stripped JRE or custom `jlink` image is only 40MB–90MB. Smaller images download and start much faster in cloud clusters.  
> 2. **Security Hardening:** A production container should never contain a compiler (`javac`) or debugging tools (`jdb`). If an attacker exploits a vulnerability in a web app, having a compiler inside the container allows them to compile and execute malicious exploit tools directly on the host.

---

## 11. Verified Official Sources
- [Oracle JDK Installation Guide for Windows, macOS, and Linux](https://docs.oracle.com/en/java/javase/21/install/)
- [dev.java: Installing Java and Setting Up the Environment](https://dev.java/learn/install/)
- [OpenJDK: Project Amber and JEP 330 Single-File Source Programs](https://openjdk.org/jeps/330)
