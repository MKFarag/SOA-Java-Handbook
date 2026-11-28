---
id: topic-253
slug: esql-practice-exercises
topicNumber: 253
title: "Practice Exercises (6 Hands-On Challenges)"
part: 'Part 6: ESQL'
sectionNumber: 47
sectionTitle: 'Tasks'
versionBadge: 'ESQL'
difficulty: Intermediate
readingTime: 6 min read
shortDescription: "Six real-world ESQL exercises to solve on your own — covering XML namespaces, grouping totals, Egyptian mobile validation, Filter nodes, SHARED ROW DB caching, and ExceptionList JSON — each with a click-to-reveal solution."
object: "Practice Exercises"
action: "Solve & Verify"
commandName: "Practice Challenges"
synonyms:
  - "esql exercises practice"
  - "egyptian mobile validation esql"
  - "shared row currency cache esql"
  - "filter node amount esql"
  - "group transactions by currency esql"
---

# Practice Exercises (6 Hands-On Challenges)

Try solving each exercise in your own Compute or Filter module first, then click **Reveal Solution & Explanation** to compare your approach line by line.

---

## Exercise 1: Convert JSON Customer to Namespaced XML with Attribute `id`

**Goal:** Convert an incoming JSON customer (`{"id":"C-10","name":"Mona","email":"mona@example.com"}`) into an **`XMLNSC`** message with root element `<ns:Customer>`, an `id` **attribute**, and XML namespace `<NamespaceUri>`.

**Expected XML Output:**
```xml
<ns:Customer xmlns:ns="<NamespaceUri>" id="C-10">
  <ns:Name>Mona</ns:Name>
  <ns:Email>mona@example.com</ns:Email>
</ns:Customer>
```

<details data-type="solution">
<summary>Reveal Solution &amp; Explanation</summary>

```esql
BROKER SCHEMA <SchemaName>

DECLARE ns NAMESPACE '<NamespaceUri>';

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        SET OutputRoot.Properties.ContentType = 'application/xml';

        CREATE LASTCHILD OF OutputRoot DOMAIN('XMLNSC');

        DECLARE inRef   REFERENCE TO InputRoot.JSON.Data;
        DECLARE custRef REFERENCE TO OutputRoot;

        CREATE LASTCHILD OF OutputRoot.XMLNSC AS custRef NAMESPACE ns NAME 'Customer';
        SET custRef.(XMLNSC.NamespaceDecl)xmlns:ns = ns;
        SET custRef.(XMLNSC.Attribute)id           = COALESCE(inRef.id, '');
        SET custRef.ns:Name                        = COALESCE(inRef.name, '');
        SET custRef.ns:Email                       = COALESCE(inRef.email, '');

        RETURN TRUE;
    END;
END MODULE;
```

**How the Solution Works:**
- **`DECLARE ns NAMESPACE '<NamespaceUri>';`**: Declares the XML namespace constant at schema/module level (for example `'https://example.com/customers'`).
- **`CREATE LASTCHILD OF OutputRoot.XMLNSC AS custRef NAMESPACE ns NAME 'Customer';`**: Creates the root `<Customer>` element **inside** namespace `ns` and binds `custRef` to it.
- **`SET custRef.(XMLNSC.NamespaceDecl)xmlns:ns = ns;`**: Explicitly emits the `xmlns:ns="..."` attribute on `<ns:Customer>` using the **`(XMLNSC.NamespaceDecl)`** field type so the prefix `ns` stays crisp and readable.
- **`custRef.(XMLNSC.Attribute)id`**: Attaches `id="C-10"` as an attribute on `<ns:Customer>`.
- **`custRef.ns:Name` / `custRef.ns:Email`**: Qualifies child elements with `ns:` so they inherit the exact same namespace URI.

</details>

---

## Exercise 2: Group Transactions by Currency & Return Total per Currency

**Goal:** Given an incoming JSON array of transactions (`[{"currency":"EGP","amount":120.50},{"currency":"USD","amount":40.00},{"currency":"EGP","amount":80.00}]`), group by `currency` and output a total per currency.

**Expected JSON Output:**
```json
{
  "totals": {
    "EGP": 200.50,
    "USD": 40.00
  }
}
```

<details data-type="solution">
<summary>Reveal Solution &amp; Explanation</summary>

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE totalsRef REFERENCE TO OutputRoot;
        CREATE FIELD OutputRoot.JSON.Data.totals AS totalsRef;

        DECLARE curr CHARACTER;
        DECLARE amt  DECIMAL;
        DECLARE t    REFERENCE TO InputRoot.JSON.Data.transactions.Item[1];

        WHILE LASTMOVE(t) DO
            SET curr = UPPER(TRIM(COALESCE(t.currency, 'UNKNOWN')));
            SET amt  = CAST(COALESCE(t.amount, 0) AS DECIMAL DEFAULT 0);

            SET totalsRef.{curr} = ROUND(COALESCE(totalsRef.{curr}, 0) + amt, 2);
            MOVE t NEXTSIBLING;
        END WHILE;

        RETURN TRUE;
    END;
END MODULE;
```

**How the Solution Works:**
- **`CREATE FIELD OutputRoot.JSON.Data.totals AS totalsRef;`**: Initializes an empty `totals` JSON object and points `totalsRef` to it.
- **`DECLARE t REFERENCE TO ...Item[1];` + `WHILE LASTMOVE(t)` + `MOVE t NEXTSIBLING;`**: Walks the transaction list in one linear pass without slow `[i]` indexing.
- **`SET curr = UPPER(TRIM(COALESCE(t.currency, 'UNKNOWN')));`**: Normalizes `'egp '` and `'EGP'` into the same key `'EGP'`.
- **`SET totalsRef.{curr} = ROUND(COALESCE(totalsRef.{curr}, 0) + amt, 2);`**: Uses **dynamic field-name braces `{curr}`** to read/create `totals.EGP` or `totals.USD` dynamically! On the first `EGP` record, `totalsRef.{curr}` is `NULL`, so `COALESCE(..., 0)` starts it at `0` before adding `amt`.

</details>

---

## Exercise 3: Validate an Egyptian Mobile Number

**Goal:** Validate `InputRoot.JSON.Data.mobile`: it must be **exactly 11 digits**, all numeric (`0`–`9`), starting with **`010`**, **`011`**, **`012`**, or **`015`**. Throw `USER EXCEPTION MESSAGE 2951` if invalid, or return `{"valid": true, "mobile": "..."}` if valid.

**Sample Inputs & Results:**
```text
"01012345678"  -> valid: true
"01812345678"  -> throws BIP2951 ('Invalid Egyptian mobile number')
"0101234abcd"  -> throws BIP2951 ('Invalid Egyptian mobile number')
```

<details data-type="solution">
<summary>Reveal Solution &amp; Explanation</summary>

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        DECLARE num CHARACTER TRIM(COALESCE(InputRoot.JSON.Data.mobile, ''));

        DECLARE hasValidLen    BOOLEAN (LENGTH(num) = 11);
        DECLARE hasValidPrefix BOOLEAN (LEFT(num, 3) IN ('010', '011', '012', '015'));
        DECLARE isAllDigits    BOOLEAN (TRANSLATE(num, '0123456789', '') = '');

        IF NOT (hasValidLen AND hasValidPrefix AND isAllDigits) THEN
            THROW USER EXCEPTION
                MESSAGE 2951
                VALUES('Invalid Egyptian mobile number');
        END IF;

        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');
        SET OutputRoot.JSON.Data.valid  = TRUE;
        SET OutputRoot.JSON.Data.mobile = num;
        RETURN TRUE;
    END;
END MODULE;
```

**How the Solution Works:**
- **`TRIM(COALESCE(InputRoot.JSON.Data.mobile, ''))`**: Safely handles missing/`NULL` input and strips whitespace.
- **`LENGTH(num) = 11`**: Verifies exact 11-character length.
- **`LEFT(num, 3) IN ('010', '011', '012', '015')`**: Checks the first 3 characters against Egypt's four mobile operator prefixes using SQL's `IN (...)` operator.
- **`TRANSLATE(num, '0123456789', '') = ''`**: Clever ESQL digit check! `TRANSLATE` maps each character from `'0123456789'` to the matching position in `''` (nothing), deleting every digit `0`–`9`. If anything remains (`<> ''`), the string contained a non-digit letter or symbol!
- **`IF NOT (...) THEN THROW USER EXCEPTION ...`**: Rejects invalid numbers cleanly with `BIP2951` so your Catch flow can return HTTP `400`.

</details>

---

## Exercise 4: Route by Amount Using a `Filter` Node (> 50,000)

**Goal:** Write a **`Filter`** node module that routes messages with `amount` strictly above **`50,000`** to an approval queue (`True` terminal), amounts `<= 50,000` to standard processing (`False` terminal), and missing/`NULL` amounts to `Unknown`.

**Expected Routing:**
```text
{"amount": 75000} -> 'True' terminal  (approval queue)
{"amount": 50000} -> 'False' terminal (standard queue)
{}                -> 'Unknown' terminal
```

<details data-type="solution">
<summary>Reveal Solution &amp; Explanation</summary>

```esql
BROKER SCHEMA <SchemaName>

CREATE FILTER MODULE <FilterModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        IF Root.JSON.Data.amount IS NULL THEN
            RETURN UNKNOWN;
        END IF;

        DECLARE amt DECIMAL CAST(Root.JSON.Data.amount AS DECIMAL DEFAULT NULL);
        IF amt IS NULL THEN
            RETURN UNKNOWN;
        ELSEIF amt > 50000 THEN
            RETURN TRUE;
        ELSE
            RETURN FALSE;
        END IF;
    END;
END MODULE;
```

**How the Solution Works:**
- **`CREATE FILTER MODULE <FilterModuleName>`**: Linked to the **Filter** node's **Filter expression** property; does **not** construct an `OutputRoot`.
- **`Root.JSON.Data.amount`**: **Critical!** Inside a `Filter` node, the incoming tree is named **`Root`** (not `InputRoot`).
- **`RETURN UNKNOWN;` / `RETURN TRUE;` / `RETURN FALSE;`**: A `Filter` node has three output terminals matching SQL's three boolean states:
  - Returning `TRUE` routes the unchanged input message to the **`True`** terminal (wired to your approval queue).
  - Returning `FALSE` routes to **`False`** (standard flow).
  - Returning `UNKNOWN` (when `amount` is missing or non-numeric after `CAST(... DEFAULT NULL)`) routes cleanly to the **`Unknown`** terminal for manual review!

</details>

---

## Exercise 5: Cache a Currency Lookup Table in a `SHARED ROW` Loaded Once from DB

**Goal:** Load currency exchange rates from `<CurrencyTableName>` into a module-level **`SHARED ROW`** cache on the **first** message only (protected by `BEGIN ATOMIC`), then convert incoming `amount` to `EGP` on every request without querying the DB again.

**Sample Input & Expected Output (Rate `USD -> 49.50`):**
```json
// Input:  {"currency": "USD", "amount": 100}
// Output: {"currency": "USD", "amount": 100, "rate": 49.50, "amountEgp": 4950.00}
```

<details data-type="solution">
<summary>Reveal Solution &amp; Explanation</summary>

```esql
BROKER SCHEMA <SchemaName>

DECLARE CURRENCY_CACHE SHARED ROW;

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        -- Double-checked lazy initialization protected by BEGIN ATOMIC
        IF NOT EXISTS(CURRENCY_CACHE.Rate[]) THEN
            BEGIN ATOMIC
                IF NOT EXISTS(CURRENCY_CACHE.Rate[]) THEN
                    SET CURRENCY_CACHE.Rate[] = PASSTHRU(
                        'SELECT CODE, RATE_TO_EGP FROM <CurrencyTableName>'
                    );
                END IF;
            END;
        END IF;

        DECLARE curr CHARACTER UPPER(TRIM(COALESCE(InputRoot.JSON.Data.currency, 'EGP')));
        DECLARE amt  DECIMAL   CAST(COALESCE(InputRoot.JSON.Data.amount, 0) AS DECIMAL DEFAULT 0);
        DECLARE rate DECIMAL;

        IF curr = 'EGP' THEN
            SET rate = 1.00;
        ELSE
            SET rate = THE(
                SELECT ITEM R.RATE_TO_EGP
                FROM CURRENCY_CACHE.Rate[] AS R
                WHERE R.CODE = curr
            );
        END IF;

        IF rate IS NULL THEN
            THROW USER EXCEPTION MESSAGE 2951 VALUES('Unsupported currency: ' || curr);
        END IF;

        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');
        SET OutputRoot.JSON.Data.currency  = curr;
        SET OutputRoot.JSON.Data.amount    = amt;
        SET OutputRoot.JSON.Data.rate      = rate;
        SET OutputRoot.JSON.Data.amountEgp = ROUND(amt * rate, 2);
        RETURN TRUE;
    END;
END MODULE;
```

**How the Solution Works:**
- **`DECLARE CURRENCY_CACHE SHARED ROW;`**: Lives once at module level and persists across all messages and threads in that Integration Server until the flow restarts or redeploys.
- **Double-checked `BEGIN ATOMIC`**: Once populated, 99.99% of messages skip the lock entirely because the outer `IF NOT EXISTS(CURRENCY_CACHE.Rate[])` is `FALSE`. Only on the very first message(s) do threads enter `BEGIN ATOMIC`, where the inner `IF` guarantees the `PASSTHRU` SQL query executes **only once**.
- **`THE(SELECT ITEM R.RATE_TO_EGP FROM CURRENCY_CACHE.Rate[] AS R WHERE R.CODE = curr)`**: Queries the cached in-memory `SHARED ROW` just like a message tree in microseconds — zero database round-trips!

</details>

---

## Exercise 6: Return Deepest BIP Number & Text from `ExceptionList` as JSON

**Goal:** Inside a Catch Compute node, walk `InputExceptionList` down to the **deepest** exception node and return its `bipNumber`, `bipText`, and deepest `detail` message as JSON with HTTP status `500` (remember **Compute mode = `LocalEnvironment And Message`**).

**Expected JSON Output:**
```json
{
  "bipNumber": 5025,
  "bipText": "XML parsing errors have occurred.",
  "detail": "Unexpected character at line 1"
}
```

<details data-type="solution">
<summary>Reveal Solution &amp; Explanation</summary>

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <CatchComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        SET OutputRoot.Properties = InputRoot.Properties;
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE bipNum  INTEGER   0;
        DECLARE bipText CHARACTER 'Unknown ACE error';
        DECLARE detail  CHARACTER '';
        DECLARE e       REFERENCE TO InputExceptionList.*[1];

        WHILE LASTMOVE(e) DO
            IF e.Number IS NOT NULL THEN
                SET bipNum = e.Number;
            END IF;
            IF e.Text IS NOT NULL THEN
                SET bipText = e.Text;
            END IF;
            IF e.Insert[1].Text IS NOT NULL THEN
                SET detail = e.Insert[1].Text;
            END IF;
            MOVE e LASTCHILD;
        END WHILE;

        SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 500;
        SET OutputRoot.JSON.Data.bipNumber = bipNum;
        SET OutputRoot.JSON.Data.bipText   = bipText;
        SET OutputRoot.JSON.Data.detail    = CASE WHEN detail <> '' THEN detail ELSE bipText END;

        RETURN TRUE;
    END;
END MODULE;
```

**How the Solution Works:**
- **`DECLARE e REFERENCE TO InputExceptionList.*[1];`**: Starts at the outermost exception entry (`RecoverableException`, `ParserException`, `UserException`, etc.).
- **`WHILE LASTMOVE(e) DO ... MOVE e LASTCHILD; END WHILE;`**: Walks down each nested exception child to the bottom-most leaf node, which holds the actual root-cause error rather than generic flow wrappers.
- **`e.Number`, `e.Text`, `e.Insert[1].Text`**: Overwrites `bipNum`, `bipText`, and `detail` whenever a deeper node defines them (note some deepest entries hold multiple `Insert` elements or put extra context in `e.Insert[1].Text`, while `e.Text` holds the main BIP description).
- **`OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 500;`**: Sends HTTP `500` back via `HTTPReply` (set **Compute mode = `LocalEnvironment And Message`** on the node).

</details>

---

**Back to Start of ESQL:** [Introduction: Compute, Filter & Database Nodes →](#topic-220)
