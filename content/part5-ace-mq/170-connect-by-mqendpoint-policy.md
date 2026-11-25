---
id: topic-170
slug: connect-by-mqendpoint-policy
topicNumber: 170
title: "Method 2: Connect MQ Nodes by MQEndpoint Policy"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Messaging'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Create an MQEndpoint policy inside a Policy Project so you can swap MQ servers across DEV/UAT/PROD without changing flows."
object: "MQEndpoint Policy"
action: "Connect via Policy"
commandName: "{PolicyProject}:MQPolicy"
synonyms:
  - "mqendpoint policy"
  - "policy project mq"
  - "bar editor manage mq"
  - "connect ace to remote mq"
---
# Method 2: Connect MQ Nodes by MQEndpoint Policy

An **`MQEndpoint` Policy** stores MQ host, port, queue manager, channel, and security identity in an XML policy file — completely separate from your flow code.

![BAR Editor Manage view configuring or overriding MQ policy settings](/images/ace/bar-editor-manage-mq.png)

---

## Create & Attach an `MQEndpoint` Policy (4 Steps)

1. In Toolkit: **New -> Policy Project** -> name it `AppPolicies`.
2. Right-click `AppPolicies` -> **New -> Policy** -> name it `OrderQM`.
3. Set **Type = `MQEndpoint`**, **Template = `MQEndpoint`**, and fill in:
   - **Connection:** `CLIENT` (remote) or `LOCAL` (same machine)
   - **Queue manager name:** `SCBQM`
   - **Queue manager host name:** `mq-server.internal` *(for `CLIENT`)*
   - **Listener port number:** `1414` *(for `CLIENT`)*
   - **Channel name:** `SYSTEM.DEF.SVRCONN` *(for `CLIENT`)*
4. Back on your **`MQInput` / `MQOutput`** node -> **Properties -> Policy -> Policy**, type:

```text
{AppPolicies}:OrderQM
```

---

## Using the Same Flow in UAT & PROD

Deploy the exact same Application BAR everywhere, and just deploy a different `AppPolicies` Policy Project per environment (DEV points to `dev-mq:1414`, PROD points to `prod-mq:1415`).

> [!TIP]
> Need a username/password or TLS keystore on that remote MQ channel? Add **`Security identity`** inside the `MQEndpoint` policy and run `mqsisetdbparms <Node> -n mq::myCreds -u appuser -p secret`.

---

**Next:** [Queue Manager Name vs MQEndpoint Policy →](#topic-171)
