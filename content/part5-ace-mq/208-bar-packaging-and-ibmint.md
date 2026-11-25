---
id: topic-208
slug: bar-packaging-and-ibmint
topicNumber: 208
title: "BAR Packaging (Toolkit & ibmint package)"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Bundle Applications, Shared Libraries, and Policies into a deployable .bar file using the Toolkit or CI/CD CLI."
object: "BAR Archive"
action: "Package App"
commandName: "ibmint package"
synonyms:
  - "bar file ace"
  - "ibmint package"
  - "mqsicreatebar"
  - "bar editor prepare"
---

# BAR Packaging (Toolkit & ibmint package)

A **BAR (Broker Archive)** is a `.bar` zip package containing compiled flows, ESQL, schemas, and maps ready for deployment.

![Toolkit BAR Editor Prepare tab selecting Applications and Shared Libraries to build a .bar file](/images/ace/bar-editor-prepare.png)

---

## Option A: Build in Toolkit (GUI)

1. Right-click anywhere in **Application Development -> New -> BAR file**.
2. Type a name like `<BarFileName>.bar` and click **Finish**.
3. Check the Applications / Shared Libraries / Policy Projects to include, then click **Build and Save**.

---

## Option B: Build in Terminal / CI/CD (`ibmint package`)

```bash
ibmint package --input-path <WorkspacePath> --output-bar-file <BarFilePath> --project <ApplicationName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP15201I: Packaging project '<ApplicationName>' into bar file '<BarFilePath>'.
BIP8071I: Successful command completion.
```

</details>

---

> [!TIP]
> Building in CI/CD pipelines (Jenkins/GitHub Actions) without launching the Eclipse GUI? **`ibmint package`** (ACE v12+) compiles everything directly from Git source cleanly with zero X11 display needed!

---

**Next:** [Inspect & Override BARs (mqsireadbar & Override) →](#topic-209)
