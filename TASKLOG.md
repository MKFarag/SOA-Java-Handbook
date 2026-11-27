# TASKLOG.md — Rules for Adding Tasks to Task Log

Follow these rules strictly every time the user invokes **`Follow TASKLOG.md`**.

---

## 1. Invocation Format

```text
Follow TASKLOG.md
Topic: <topic name>
Title: <task title>
Reference: <optional>
Steps:
1. text
   Code: (optional, the code or commands, with the language if not obvious)
   Image: <file name from _inbox> | <short caption>  (optional)
   Note: <optional>
2. ...
```

- `Topic`: Required. Must match one of the existing handbook area labels from `MAIN_SECTIONS` in `src/data/topics.ts` (`Java Core`, `Jakarta EE`, `Spring Boot`, `Database Systems`, `ACE & MQ`).
- `Title`: Required. Short English title.
- `Reference`: Optional. A PDF name + page number, or a URL. Omit `reference` from frontmatter if not provided.
- `Steps`: Required. Numbered list (`1.`, `2.`, ...). Each step may optionally include `Code:`, `Image:`, and/or `Note:` blocks underneath in any order.

---

## 2. Step-by-Step Execution Procedure

On every invocation of `Follow TASKLOG.md`, perform these exact steps in order:

1. **Validate `Topic` against the existing top-nav config**:
   - Read `MAIN_SECTIONS` in `src/data/topics.ts` (`Java Core`, `Jakarta EE`, `Spring Boot`, `Database Systems`, `ACE & MQ`).
   - Do not hardcode or invent a new topic area. If the provided `Topic` does not match an existing `MAIN_SECTIONS` label, stop immediately and tell the user without creating any files.
2. **Validate referenced images in `content/tasks/_inbox/` BEFORE writing anything**:
   - For every `Image: <file name from _inbox> | <short caption>` line, verify that `content/tasks/_inbox/<file name>` actually exists.
   - If a referenced image is **not** in `content/tasks/_inbox/`, **stop immediately and tell the user** — never invent, guess, copy another image, or generate a placeholder.
3. **Detect code block languages**:
   - Allowed languages: `bash`, `java`, `sql`, `esql`, `xml`, `json`, `properties`, or `text` (for plain text).
   - If the user supplied the language, use it; otherwise detect it automatically from the snippet.
   - If you are unsure about a snippet's language, **stop and ask the user** before writing the task file.
4. **Compute folder, task slug, and next `NN` sequence number**:
   - Compute `<topic-slug>` from `Topic` (`java-core`, `jakarta-ee`, `spring-boot`, `database-systems`, `ace-mq`).
   - Compute `<title-slug>` from `Title` (lowercase ASCII alphanumeric and hyphens).
   - Scan all existing `*.md` files across `content/tasks/*/*.md` (ignoring `_inbox` and any `_`-prefixed folders), find the highest numeric prefix `NN` globally (`0` if none exist), and set `nextNN = String(maxNN + 1).padStart(2, '0')`.
   - Set `<task-slug>` = `<nextNN>-<title-slug>` (so task file is `content/tasks/<topic-slug>/<task-slug>.md`).
5. **Move and rename referenced images**:
   - For each `Image:` block on step `<n>` (`1`-indexed), move `content/tasks/_inbox/<file name>` to:
     `content/tasks/<topic-slug>/images/<task-slug>-step-<n>.<ext>`
     (using lowercase extension `<ext>`; if a single step has multiple images, append `-2`, `-3`, etc. before `.<ext>`).
   - Delete the original file from `content/tasks/_inbox/` after moving (never delete `_inbox/.gitkeep`).
   - Record each moved image's file size in bytes/KB. If any image is **larger than 300 KB**, note a clear warning in the final report.
6. **Create the new task Markdown file**:
   - Write `content/tasks/<topic-slug>/<task-slug>.md`.
   - Use minimal YAML frontmatter containing **only**:
     - `topic`: exact `Topic` label
     - `title`: `Title`
     - `reference`: included **only** if `Reference` was provided
   - Under each step number (`1. ...`), place its `Code`, `Image`, and `Note` blocks in the exact order written using this Markdown format:
     ```markdown
     1. Run `mqsiprofile`
        ```bash
        mqsiprofile
        ```
        ![Console after running mqsiprofile](./images/<task-slug>-step-1.png)
        > Note: run it from the ACE console, not a normal terminal.
     ```
7. **Run the build-time auto-link compiler**:
   - Run `npm run compile-tasks` (executes `scripts/compile-tasks.mjs` and updates `src/data/generated-tasks.json`).
   - Confirm auto-linking ran only on each step's main text (never on code blocks, image captions, or notes).
8. **Run lint and build**:
   - Run `npm run lint` and `npm run build` to verify TypeScript, linting, image bundling, and Vite production build pass cleanly.
9. **Confirm scope & isolation**:
   - Run `git status` / `git diff` to confirm **only** the new task file under `content/tasks/<topic-slug>/`, moved images under `content/tasks/<topic-slug>/images/`, `_inbox/` removals, and `src/data/generated-tasks.json` changed.
   - Do **not** run `git push` unless explicitly instructed.

---

## 3. Step Handling Rules

- Keep the user's steps and rich blocks (`Code`, `Image`, `Note`) in the **exact same order and meaning**.
- **Only** fix obvious spelling/grammar typos and wrap commands, flags, file names, paths, annotations, and code identifiers in inline `` `code` `` inside the step's main text (and inside `Note:` text when appropriate).
- Do **not** add, remove, split, merge, reorder, or explain steps.
- Do **not** add extra commentary, tips, or summary paragraphs inside the task file.

---

## 4. Auto-Linking & Final Report Rules

### Auto-Linking Rules
- Linking runs deterministically at build time (`scripts/compile-tasks-lib.mjs`) against the Topic Index built from existing handbook topics (`src/data/generated-topics.json`) and existing aliases (`LEGACY_TOPIC_ALIASES` in `src/data/topics.ts`).
- Auto-linking matches **only** on each step's main text — never on fenced code blocks, image alt captions, or `Note:` blocks.
- Max **2 links per step**.
- Link **only** on a confident match; no link is better than a wrong link.
- **Never** create new handbook topics and **never** edit existing handbook topics or aliases for the sake of linking.

### Final Report Format
After `npm run compile-tasks`, `npm run lint`, and `npm run build` pass, reply with a concise report covering:
- **File created**: exact path (e.g. `content/tasks/ace-mq/02-example.md`)
- **Linked steps**: each step number that received link(s), showing the linked topic ID(s) and title(s)
- **Unlinked steps**: list of step numbers that received no link
- **Images moved**: source -> destination path and file size in KB (plus warning if any image > 300 KB)
- **Blocked / skipped items**: anything you could not do (or `None`)

---

## 5. Do-Not Rules

- **NEVER** touch, edit, or refactor existing handbook content (`content/part1-*` through `content/part5-*`), `generated-topics.json`, or `generated-sections.json`.
- **NEVER** create new handbook topics or modify existing topics/aliases to force a link.
- **NEVER** invent or generate missing images when an `Image:` reference is absent from `content/tasks/_inbox/`.
- **NEVER** add `date`, `difficulty`, `status`, or metadata header blocks to task files or the Task Log UI.
- **NEVER** index Task Log files or content in the global search (`SearchModal` / `compile-content.mjs`).
- **NEVER** use orange (`#ea580c`, `#f97316`, etc.) or reuse the blue/purple gradient in Task Log UI styling.
- **NEVER** push to remote (`git push`) unless explicitly asked.
