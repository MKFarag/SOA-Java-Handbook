---
id: topic-152
slug: javacompute-node-java-transform
topicNumber: 152
title: "JavaCompute Node: Use Java Libraries & Custom Logic"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Run standard Java code inside your message flow when you need Java libraries, regex, or cryptography."
object: "JavaCompute Node"
action: "Run Java Code"
commandName: "JavaCompute"
synonyms:
  - "javacompute node ace"
  - "mbmessageassembly"
  - "java class wizard ace"
  - "evaluate java node"
---
# JavaCompute Node: Use Java Libraries & Custom Logic

The **JavaCompute** node runs a Java class (`MbJavaComputeNode`) whenever a message arrives on its `In` terminal.

![New Java Compute Node Class wizard showing package, class name, and superclass](/images/ace/javacompute-new-class-wizard.png)

---

## When to Use JavaCompute

- You need third-party **Java JARs** (Excel/PDF generators, custom JWT/HMAC encryption, Apache Commons).
- You are integrating with existing Java business objects your team already maintains.
- For ordinary JSON/XML field transformations, prefer **[Mapping](#topic-150)** or **[Compute](#topic-151)** — they require less boilerplate.

---

## Generated Java Skeleton

Double-click the node to generate a class extending `MbJavaComputeNode` with an `evaluate()` method:

![JavaCompute node editor showing evaluate(MbMessageAssembly) code](/images/ace/javacompute-code-editor.png)

```java
public void evaluate(MbMessageAssembly inAssembly) throws MbException {
    MbOutputTerminal out = getOutputTerminal("out");
    MbMessage outMsg = new MbMessage(inAssembly.getMessage());
    MbMessageAssembly outAssembly = new MbMessageAssembly(inAssembly, outMsg);
    out.propagate(outAssembly);
}
```

<details data-type="output">
<summary>What Happens at Runtime</summary>

```text
Copies the incoming MbMessage into outMsg and propagates outAssembly to the 'out' terminal.
```

</details>

> [!TIP]
> Always wrap temporary `MbElement` / `MbMessage` allocations cleanly or use try/finally `clearMessage()` if you build extra messages inside loops so JVM heap stays flat.

---

**Next:** [ResetContentDescriptor: Switch Parser Without Rewriting →](#topic-153)
