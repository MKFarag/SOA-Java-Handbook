---
id: topic-03
slug: your-first-java-program
topicNumber: 3
title: Your First Java Program
part: 'Part 1: Java Core'
sectionNumber: 1
sectionTitle: Foundations & Architecture
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Write, compile with javac, and execute with java your very first program.
  Understand the anatomy of main() and bytecode execution.
prerequisites:
  - 'Topic 01: What is Programming & How Code Runs'
  - 'Topic 02: JDK vs JRE vs JVM & Setup'
---
## 1. What It Is and Why It Exists

A Java program is a collection of instructions written inside a class definition. The source file (`.java`) is compiled by the Java Compiler (`javac`) into portable bytecode (`.class`), which is subsequently executed by the Java Virtual Machine (`java`).

### The Real-World Analogy
Think of Java source code as an architectural schematic drawn on paper. You cannot live inside a blueprint. The compiler (`javac`) acts as a structural engineering review, translating your blueprint into universal standardized fabrication templates (`.class` bytecode). The JVM (`java`) is the physical construction crane on your specific plot of land that reads the templates and builds a solid, functioning house.

### Why Does This Feature Exist?
Computers cannot directly understand English words like `class`, `static`, or `println`. Java exists to provide an elegant, strongly typed, object-oriented language that humans can write with precision, while the JVM guarantees that the resulting compiled bytecode runs consistently across Windows, macOS, Linux, and cloud servers without modification.

---

## 2. Prerequisites
- **Topic 01: What is Programming & How Code Runs**
- **Topic 02: JDK vs JRE vs JVM & Setup**

---

## 3. Syntax Breakdown & Symbol Mechanics

Every element in this foundational program serves a mandatory architectural role in the Java Language Specification.

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java Explorer!");
    }
}
```

### Breakdown of Keywords and Symbols
- `public (class)`: Access modifier indicating that this class definition is accessible by any other code or the JVM runtime launcher.
- `class HelloWorld`: Declares a blueprint named `HelloWorld`. In standard Java, the filename must exactly match: `HelloWorld.java`.
- `{ ... }`: Curly braces define the lexical scope (boundary) of the class and methods.
- `public (method)`: Enables the JVM entry launcher to access and invoke the entry point method from outside the class.
- `static`: Binds the method directly to the class rather than an object instance. The JVM can call `main()` immediately without allocating memory for `new HelloWorld()`.
- `void`: Specifies the method return type. `main()` executes instructions and returns nothing to the caller.
- `main`: The exact, reserved identifier that the JVM runtime searches for as the initial application entry point.
- `String[] args`: An array of String objects used to pass command-line arguments into the program at launch time.
- `System`: A built-in class in the `java.lang` standard package containing system-level utilities.
- `out`: A static `PrintStream` field inside `System` representing the standard console output stream.
- `println(...)`: Method that prints the given argument followed by a platform-specific newline character.
- `;`: Statement terminator. Every complete operational statement in Java must end with a semicolon.

---

## 4. Fully Runnable Code Examples

### Example 1: Minimal Working Java Program
The classic canonical starting program. It prints greeting text and displays the active Java runtime version.

```java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java Explorer! Your offline Java journey begins here.");
        System.out.println("Runtime Version: " + System.getProperty("java.version"));
    }
}
```

#### Expected Terminal Output
```
Hello, Java Explorer! Your offline Java journey begins here.
Runtime Version: 26.0.1
```

#### Step-by-Step Execution
1. The JVM process starts up and loads `HelloWorld.class` into Metaspace.
2. The bytecode verifier verifies format safety and stack constraints.
3. The JVM locates `public static void main(String[] args)` and pushes the main frame onto the thread stack.
4. `System.out.println()` invokes the native console output system to print the greeting message.
5. `System.getProperty("java.version")` queries the runtime environment and outputs the active JDK version.
6. The main method stack frame pops, and the JVM exits with status code 0 (clean exit).

---

### Example 2: Realistic Console Application with CLI Arguments & Formatted Output
A realistic program demonstrating command-line parameter handling with safe fallbacks and formatted output.

```java
// GreetingApp.java
public class GreetingApp {
    public static void main(String[] args) {
        // Safe check for command-line arguments
        String learnerName = (args.length > 0) ? args[0] : "Student";
        int targetHours = 10;
        
        System.out.println("==========================================");
        System.out.println(" Welcome to Modern Java Engineering!     ");
        System.out.println("==========================================");
        System.out.printf("Learner: %s%n", learnerName);
        System.out.printf("Weekly Target: %d hours%n", targetHours);
        System.out.println("Status: Ready to compile and build.");
    }
}
```

#### Expected Terminal Output
```
==========================================
 Welcome to Modern Java Engineering!     
==========================================
Learner: DevMaster
Weekly Target: 10 hours
Status: Ready to compile and build.
```

#### Step-by-Step Execution
1. The JVM parses the terminal launch arguments and packages them into the `String[] args` array.
2. The ternary condition checks `args.length > 0` to prevent `ArrayIndexOutOfBoundsException`.
3. `System.out.printf()` formats the string and decimal integers with platform-independent `%n` newlines.
4. Clean execution finishes, writing all bytes to stdout and releasing resources.

---

## 5. Common Mistakes & Compiler / Runtime Errors

### Mistake 1: Case Sensitivity Error
```java
// WRONG:
system.out.println("Hello");

// FIXED:
System.out.println("Hello");
```
- **Cause:** Java is strictly case-sensitive. The identifier `system` with a lowercase `s` does not exist in `java.lang`.
- **Fix:** Always capitalize class names: `System.out.println`.

### Mistake 2: File Name Mismatch
```
error: class HelloWorld is public, should be declared in a file named HelloWorld.java
```
- **Cause:** The Java compiler requires any public top-level class name to match the file name exactly, including case.
- **Fix:** Ensure the file name on disk is exactly `HelloWorld.java`.

### Mistake 3: Missing Semicolon
```
error: ';' expected
```
- **Cause:** Java does not use automatic semicolon insertion. Every statement must be terminated.
- **Fix:** Append a semicolon (`;`) to the end of every statement.

### Mistake 4: Missing `static` Modifier in `main`
```
Error: Main method is not static in class HelloWorld, please define the main method as:
   public static void main(String[] args)
```
- **Cause:** Without `static`, the JVM cannot invoke the entry point without first creating an instance of the class.
- **Fix:** Include `static` in the method signature.

---

## 6. Best Practices & Anti-Patterns

### Best Practices (DO):
- **UpperCamelCase:** Always use UpperCamelCase for class names (`HelloWorld`, `UserProfile`).
- **One Public Class per File:** Keep one primary public class per `.java` source file.
- **Verify Array Bounds:** Always verify array length before accessing `args[index]`.
- **Platform-Independent Newlines:** Use `System.out.printf` with `%n` for portable newlines across Windows and Unix.

### Anti-Patterns (DON'T):
- **Never name files with lowercase initial letters** if the class is public.
- **Never place executable statements outside of methods** in a class body.
- **Do not hardcode Windows backslashes** in console strings.

### When NOT to Use:
- Do not use raw `System.out.println` statements in production enterprise web applications; professional systems use structured logging frameworks (SLF4J / Logback) instead.

---

## 7. Version Notes & Compatibility Matrix

- **Java 1.0:** Standard canonical main method signature established.
- **Java 21 (LTS):** Introduced **JEP 445** (continued in Java 22/23/24 **JEP 477**) allowing beginners to write instance main methods without class boilerplate (`void main()`), but the canonical signature remains the universal production standard.
- **Compatibility:** Fully backward-compatible across every version of Java from 1.0 to Java 26.
- **LTS Availability:** Supported in Java 8, 11, 17, 21, and 25 LTS.

---

## 8. Summary Cheat Sheet

| Command / Keyword | Type | Purpose | Example |
| :--- | :--- | :--- | :--- |
| **`javac`** | CLI Tool | Compiles source `.java` files into `.class` bytecode | `javac HelloWorld.java` |
| **`java`** | CLI Tool | Launches the JVM and executes compiled class bytecode | `java HelloWorld` |
| **`public`** | Keyword | Allows unbounded visibility across packages and JVM launcher | `public class App` |
| **`static`** | Keyword | Binds member to the class rather than object instances | `public static void main` |
| **`void`** | Keyword | Denotes that a method returns no value to the caller | `void doWork()` |
| **`String[] args`** | Parameter | Accepts command-line arguments passed at launch | `java App arg1 arg2` |
| **`System.out.println`** | Method | Writes string to stdout followed by newline | `System.out.println("Hi");` |

---

## 9. Graded Interactive Practice Exercises

### Exercise 1: Spot the Compiler Errors
**Prompt:** Find the two syntax errors preventing this program from compiling:
```java
public class TestProgram {
    public static void main(string[] args) {
        System.out.println("Coding in Java")
    }
}
```

#### Hidden Solution & Explanation
```java
public class TestProgram {
    public static void main(String[] args) {
        System.out.println("Coding in Java");
    }
}
```
> **Explanation:**  
> 1. `string` must be capitalized as `String` because `String` is a class in `java.lang`.  
> 2. The `println` statement was missing its trailing semicolon (`;`).

---

### Exercise 2: Hands-on Implementation Challenge
**Prompt:** Write a complete Java program named `SystemCheck` that prints: (1) Your name, (2) The Java Version, and (3) The Operating System Name using `System.getProperty("os.name")`.

#### Starter Code
```java
public class SystemCheck {
    public static void main(String[] args) {
        // Your code here
    }
}
```

#### Hidden Solution & Explanation
```java
public class SystemCheck {
    public static void main(String[] args) {
        System.out.println("Developer: Alex");
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("Operating System: " + System.getProperty("os.name"));
    }
}
```
> **Explanation:** `System.getProperty()` retrieves fundamental runtime environment keys from the host operating system and JVM specification.

---

### Exercise 3: Real-World Edge Case: Command-Line Index Guarding
**Prompt:** What happens when someone runs `java GreetingApp` without any arguments if the code does `String name = args[0];`? How do you fix it?

#### Hidden Solution & Explanation
```java
// Problematic:
// String name = args[0]; -> Throws ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0

// Robust Fix:
String name = (args.length > 0) ? args[0] : "Guest";
```
> **Explanation:** When no arguments are supplied on the command line, `args` is initialized as a zero-length array (`args.length == 0`). Accessing index 0 immediately triggers an unchecked `ArrayIndexOutOfBoundsException` at runtime.

---

## 10. Verified Official Sources
- [Oracle Java Documentation: Getting Started with Java](https://docs.oracle.com/en/java/javase/21/get-started/)
- [dev.java: The Official Java Learning Platform](https://dev.java/learn/)
- [OpenJDK JEP 477: Implicitly Declared Classes and Instance Main Methods](https://openjdk.org/jeps/477)
