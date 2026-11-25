---
id: topic-229
slug: mq-channel-authentication-dev
topicNumber: 229
title: "Channel Security & CHLAUTH Basics"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Understand why IBM MQ blocks remote connections by default with MQRC 2035 (CHLAUTH & CONNAUTH) and how to configure access safely."
object: "MQ Channel Security"
action: "Configure CHLAUTH"
commandName: "CHLAUTH & CONNAUTH"
synonyms:
  - "mq chlauth 2035"
  - "set chlauth runmqsc"
  - "mqrc 2035 admin blocked"
  - "refresh security mq"
---

# Channel Security & CHLAUTH Basics

IBM MQ ships **secure by default**: every remote connection running as an OS administrator/privileged user (and default `SYSTEM.*` channels) gets blocked with **`MQRC 2035 (MQRC_NOT_AUTHORIZED)`**.

---

## Recommended Setup (Dedicated App User vs. Local Lab)

| Environment | Recommended Fix for `MQRC 2035` |
| :--- | :--- |
| **Staging / Production** | Create a dedicated non-admin OS/LDAP user (`<UserName>`), map it via `SET CHLAUTH`, and enable TLS + user credentials (`mqsisetdbparms`) |
| **Isolated Local Dev Lab Only** | Allow your app channel (`<ChannelName>`) via `SET CHLAUTH` on your sandbox QMGR |

---

## Check What Blocked You First!

Always inspect `AMQERR01.LOG` — MQ explicitly prints **which exact rule** rejected your connection. Then configure a scoped rule in `runmqsc`:

```text
* Allow specific service user '<UserName>' over <ChannelName>
SET CHLAUTH('<ChannelName>') TYPE(USERMAP) CLNTUSER('<UserName>') USERSRC(MAP) MCAUSER('<UserName>') ACTION(ADD)
REFRESH SECURITY(*)
```

And grant `<UserName>` permission on queues via `setmqaut`:
```bash
setmqaut -m <QueueManagerName> -t qmgr -p <UserName> +connect +inq
setmqaut -m <QueueManagerName> -n <InputQueueName> -t queue -p <UserName> +get +browse +inq
```

> [!WARNING]
> **Never disable `CHLAUTH` or `CONNAUTH` on shared or production servers!** Disabling channel auth exposes every queue on port `1414` to unauthenticated administrative access.

---

**Next:** [amqsput: Send a Test Message from CLI →](#topic-230)
