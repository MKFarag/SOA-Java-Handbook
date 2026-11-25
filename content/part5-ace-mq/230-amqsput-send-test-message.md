---
id: topic-230
slug: amqsput-send-test-message
topicNumber: 230
title: "amqsput: Send a Test Message from CLI"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Quickly inject a test text or JSON message onto any MQ queue directly from your terminal using IBM's amqsput sample tool."
object: "MQ Sample Producer"
action: "Send Message"
commandName: "amqsput"
synonyms:
  - "amqsput"
  - "amqsputc client"
  - "put test message on queue cli"
  - "pipe echo amqsput"
---

# amqsput: Send a Test Message from CLI

**`amqsput`** is IBM MQ's built-in sample tool for dropping a quick test message directly onto a queue from CMD or Bash.

---

## Mode 1: Interactive Typing

```bash
amqsput IN.Q SCBQM
```

Type your payload (even JSON on one line!), press **Enter**, then press **Enter on an empty line** to quit:

<details data-type="output">
<summary>Interactive Terminal Session</summary>

```text
Sample AMQSPUT0 start
target queue is IN.Q
{"orderId": 101, "amount": 250}

Sample AMQSPUT0 end
```

</details>

---

## Mode 2: One-Line Pipe (Great for Quick Repeats!)

```bash
echo {"orderId": 102, "amount": 99} | amqsput IN.Q SCBQM
```

- Notice **`amqsput`** uses **local bindings** (same server); use **`amqsputc`** (with `c` at the end) if connecting to a **remote** Queue Manager via `MQSERVER`!

---

**Next:** [amqsget: Read Messages & Empty a Queue →](#topic-231)
