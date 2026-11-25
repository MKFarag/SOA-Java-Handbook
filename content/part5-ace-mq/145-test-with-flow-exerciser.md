---
id: topic-145
slug: test-with-flow-exerciser
topicNumber: 145
title: "Test Your Flow with Flow Exerciser"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ACE Message Flows'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Deploy, send a test message, and click green wires and blue envelopes to inspect live message trees inside your flow."
object: "Flow Exerciser"
action: "Test & Inspect"
commandName: "Start Flow Exerciser"
synonyms:
  - "flow exerciser ace"
  - "test flow toolkit"
  - "recorded message"
  - "blue envelope debug"
---
# Test Your Flow with Flow Exerciser

Before opening external tools like Postman or `amqsput`, use the Toolkit's built-in **Flow Exerciser** to send a test message and inspect what every single node produced.

![Flow Exerciser showing green active wires, blue message envelopes, and the Recorded Message viewer](/images/ace/flow-exerciser-recorded-message.png)

---

## Run Your First Test in 4 Clicks

1. Open your saved `.msgflow` on the canvas.
2. Click the red **Start Flow Exerciser** icon in the canvas toolbar (top-right of the flow editor). *(ACE builds and deploys your app to your selected server automatically.)*
3. Click the **Send Message** icon (envelope with green arrow). Paste your sample JSON/XML or pick a saved file and click **Send**.
4. **Click any blue envelope icon** on a green highlighted wire to see the exact **Recorded Message** at that step!

---

## What Green vs. Blue Tells You

| Visual Cue | Meaning |
| :--- | :--- |
| **Green highlighted wire** | That path executed during your test |
| **Unlit grey wire** | That branch did not run (for example a Route filter didn't match or no error occurred) |
| **Blue envelope on wire** | Click to inspect `Properties`, `MQMD`, `LocalEnvironment`, and `JSON/XMLNSC` tree right after that node |

> [!TIP]
> Remember to click the red **Stop Recording** button when you are done testing — Flow Exerciser puts the deployed flow into recording mode, which adds overhead in production.

---

**Next:** [Flow Error Handling (TryCatch vs Terminals) →](#topic-146)
