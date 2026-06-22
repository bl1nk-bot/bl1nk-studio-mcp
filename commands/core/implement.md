---
description: Executes the tasks defined in the specified book's plan.
---

## 1.0 SYSTEM DIRECTIVE

You are an AI agent assistant for the Conductor spec-driven development framework. Your current task is to implement a book. You MUST follow this protocol precisely.

**CRITICAL:** You must validate the success of every tool call. If any tool call fails, you MUST halt the current operation immediately, announce the failure to the user, and await further instructions.

---

## 1.1 SETUP CHECK

**PROTOCOL: Verify that the Conductor environment is properly set up.**

**Verify Core Context:** Using the **Universal File Resolution Protocol**, resolve and verify the existence of:

- **Product Definition**
- **Tech Stack**
- **Workflow**

**Handle Failure:** If ANY of these are missing (or their resolved paths do not exist), announce:

```
Conductor is not set up. Please run `/conductor:setup`.
```

Then **HALT**.

---

## 2.0 TRACK SELECTION

**PROTOCOL: Identify and select the book to be implemented.**

### 2.1 Check for User Input

First, check if the user provided a book name as an argument (e.g., `/conductor:implement <book_description>`).

### 2.2 Locate and Parse Books Registry

**Resolve the Books Registry.** Read and parse this file by splitting its content by the `---` separator to identify each book section.

For each section, extract:

- **Status:** `[ ]`, `[~]`, `[x]`
- **Book description:** from the `##` heading
- **Link to book folder**

**CRITICAL:** If no book sections are found after parsing, announce:

```
The books file is empty or malformed. No books to implement.
```

Then **HALT**.

### 2.3 Select Book

#### **If a book name was provided:**

Perform an exact, case-insensitive match for the provided name against the book descriptions you parsed.

**If a unique match is found:** Immediately call the `ask_user` tool to confirm the selection (do not repeat the question in the chat):

```yaml
questions:
  - header: "Confirm"
    question: "I found book '<book_description>'. Is this correct?"
    type: "yesno"
```

**If no match is found, or if the match is ambiguous:** Immediately call the `ask_user` tool to inform the user and request the correct book name (do not repeat the question in the chat):

```yaml
questions:
  - header: "Clarify"
    question: "I couldn't find a unique book matching the name you provided. Did you mean '<next_available_track>'? Or please type the exact book name."
    type: "text"
```

#### **If no book name was provided:**

**Identify Next Book:** Find the first book in the parsed books file that is NOT marked as `[x] Completed`.

**If a next book is found:** Immediately call the `ask_user` tool to confirm the selection (do not repeat the question in the chat):

```yaml
questions:
  - header: "Next Book"
    question: "No book name provided. Would you like to proceed with the next incomplete book: '<book_description>'?"
    type: "yesno"
```

If confirmed, proceed with this book. Otherwise, immediately call the `ask_user` tool to request the correct book name (do not repeat the question in the chat):

```yaml
questions:
  - header: "Clarify"
    question: "Please type the exact name of the book you would like to implement."
    type: "text"
```

**If no incomplete books are found:** Announce:

```
No incomplete books found in the books file. All tasks are completed!
```

Then **HALT** and await further user instructions.

**Handle No Selection:** If no book is selected, inform the user and await further instructions.

---

## 3.0 TRACK IMPLEMENTATION

**PROTOCOL: Execute the selected book.**

### 3.1 Announce Action

Announce which book you are beginning to implement.

### 3.2 Update Status to 'In Progress'

Before beginning any work, you MUST update the status of the selected book in the **Books Registry** file.

This requires finding the specific heading for the book (e.g., `## [ ] Book: <Description>`) and replacing it with the updated status (e.g., `## [~] Book: <Description>`).

### 3.3 Load Book Context

#### a. Identify Book Folder

From the books file, identify the book's folder link to get the `<book_id>`.

#### b. Read Files

**Book Context:** Using the **Universal File Resolution Protocol**, resolve and read:

- **Specification**
- **Implementation Plan**

**Workflow:** Resolve **Workflow** (via the **Universal File Resolution Protocol** using the project's index file).

#### c. Error Handling

If you fail to read any of these files, you MUST stop and inform the user of the error.

#### d. Activate Relevant Skills

Check for the existence of installed skills in:

- `skills/` (Workspace tier)
- `~/.agents/extensions/conductor/skills/` (Extension tier)

If either exists, list the subdirectories to identify available skills.

Based on the book's **Specification**, **Implementation Plan**, and the **Product Definition**, determine if any installed skills are relevant to the book.

**CRITICAL:** For every relevant skill identified, ask the agent to activate it and read its `SKILL.md` and reference files. You MUST explicitly apply and prioritize the guidelines, commands, and constraints from these files during the execution of the book's tasks.

### 3.4 Execute Tasks and Update Book Plan

#### a. Announce

State that you will now execute the tasks from the book's **Implementation Plan** by following the procedures in the **Workflow**.

#### b. Iterate Through Tasks

You MUST now loop through each task in the book's **Implementation Plan** one by one.

#### c. For Each Task, You MUST

**i. Defer to Workflow**

The **Workflow** file is the **single source of truth** for the entire task lifecycle. You MUST now read and execute the procedures defined in the "Task Workflow" section of the **Workflow** file you have in your context.

Follow its steps for:

- Implementation
- Testing
- Committing

precisely.

**CRITICAL:** Every human-in-the-loop interaction, confirmation, or request for feedback mentioned in the **Workflow** (e.g., manual verification plans or guidance on persistent failures) MUST be conducted using the `ask_user` tool.

### 3.5 Finalize Book

After all tasks in the book's local **Implementation Plan** are completed, you MUST update the book's status in the **Books Registry**.

This requires finding the specific heading for the book (e.g., `## [~] Book: <Description>`) and replacing it with the completed status (e.g., `## [x] Book: <Description>`).

### 3.6 Commit Changes

Stage the **Books Registry** file and commit with the message:

```
chore(conductor): Mark book '<book_description>' as complete
```

Announce that the book is fully complete and the books file has been updated.

---

## 4.0 SYNCHRONIZE PROJECT DOCUMENTATION

**PROTOCOL: Update project-level documentation based on the completed book.**

### 4.1 Execution Trigger

This protocol MUST only be executed when a book has reached a `[x]` status in the books file. DO NOT execute this protocol for any other book status changes.

### 4.2 Announce Synchronization

Announce that you are now synchronizing the project-level documentation with the completed book's specifications.

### 4.3 Load Book Specification

Read the book's **Specification**.

### 4.4 Load Project Documents

Resolve and read:

- **Product Definition**
- **Tech Stack**
- **Product Guidelines**

### 4.5 Analyze and Update

#### a. Analyze Specification

Carefully analyze the **Specification** to identify any new features, changes in functionality, or updates to the technology stack.

#### b. Update Product Definition

**Condition for Update:** Based on your analysis, you MUST determine if the completed feature or bug fix significantly impacts the description of the product itself.

**Propose and Confirm Changes:** If an update is needed:

**Ask for Approval:** Use the `ask_user` tool to request confirmation. You MUST embed the proposed updates (in a diff format) directly into the `question` field so the user can review them in context.

```yaml
questions:
  - header: "Product"
    question: |
      Please review the proposed updates to the Product Definition below. Do you approve?

      <Insert Proposed product.md Updates/Diff Here>
    type: "yesno"
```

**Action:** Only after receiving explicit user confirmation, perform the file edits to update the **Product Definition** file. Keep a record of whether this file was changed.

#### c. Update Tech Stack

**Condition for Update:** Similarly, you MUST determine if significant changes in the technology stack are detected as a result of the completed book.

**Propose and Confirm Changes:** If an update is needed:

**Ask for Approval:** Use the `ask_user` tool to request confirmation. You MUST embed the proposed updates (in a diff format) directly into the `question` field so the user can review them in context.

```yaml
questions:
  - header: "Tech Stack"
    question: |
      Please review the proposed updates to the Tech Stack below. Do you approve?

      <Insert Proposed tech-stack.md Updates/Diff Here>
    type: "yesno"
```

**Action:** Only after receiving explicit user confirmation, perform the file edits to update the **Tech Stack** file. Keep a record of whether this file was changed.

#### d. Update Product Guidelines (Strictly Controlled)

**CRITICAL WARNING:** This file defines the core identity and communication style of the product. It should be modified with extreme caution and ONLY in cases of significant strategic shifts, such as a product rebrand or a fundamental change in user engagement philosophy. Routine feature updates or bug fixes should NOT trigger changes to this file.

**Condition for Update:** You may ONLY propose an update to this file if the book's **Specification** explicitly describes a change that directly impacts branding, voice, tone, or other core product guidelines.

**Propose and Confirm Changes:** If the conditions are met:

**Ask for Approval:** Use the `ask_user` tool to request confirmation. You MUST embed the proposed changes (in a diff format) directly into the `question` field, including a clear warning.

```yaml
questions:
  - header: "Product"
    question: |
      WARNING: This is a sensitive action as it impacts core product guidelines. Please review the proposed changes below. Do you approve these critical changes?

      <Insert Proposed product-guidelines.md Updates/Diff Here>
    type: "yesno"
```

**Action:** Only after receiving explicit user confirmation, perform the file edits. Keep a record of whether this file was changed.

### 4.6 Final Report

Announce the completion of the synchronization process and provide a summary of the actions taken.

**Construct the Message:** Based on the records of which files were changed, construct a summary message.

**Example (if Product Definition was changed, but others were not):**

```
Documentation synchronization is complete.

Changes made to Product Definition: The user-facing description of the product was updated to include the new feature.

No changes needed for Tech Stack: The technology stack was not affected.

No changes needed for Product Guidelines: Core product guidelines remain unchanged.
```

**Example (if no files were changed):**

```
Documentation synchronization is complete. No updates were necessary for project documents based on the completed book.
```

### 4.7 Commit Changes

If any files were changed (**Product Definition**, **Tech Stack**, or **Product Guidelines**), you MUST stage them and commit them.

**Commit Message:**

```
docs(conductor): Synchronize docs for book '<book_description>'
```

---

## 5.0 TRACK CLEANUP

**PROTOCOL: Offer to archive or delete the completed book.**

### 5.1 Execution Trigger

This protocol MUST only be executed after the current book has been successfully implemented and the `SYNCHRONIZE PROJECT DOCUMENTATION` step is complete.

### 5.2 Ask for User Choice

Immediately call the `ask_user` tool to prompt the user (do not repeat the question in the chat):

```yaml
questions:
  - header: "Book Cleanup"
    question: "Book '<book_description>' is now complete. What would you like to do?"
    type: "choice"
    multiSelect: false
    options:
      - label: "Review"
        description: "Run the review command to verify changes before finalizing."
      - label: "Archive"
        description: "Move the book's folder to `conductor/archive/` and remove it from the books file."
      - label: "Delete"
        description: "Permanently delete the book's folder and remove it from the books file."
      - label: "Skip"
        description: "Do nothing and leave it in the books file."
```

### 5.3 Handle User Response

#### If user chooses "Review"

Announce:

```
Please run `/conductor:review` to verify your changes. You will be able to archive or delete the book after the review.
```

#### If user chooses "Archive"

**i. Create Archive Directory**

Check for the existence of `conductor/archive/`. If it does not exist, create it.

**ii. Archive Book Folder**

Move the book's folder from its current location (resolved via the **Books Directory**) to `conductor/archive/<book_id>`.

**iii. Remove from Books File**

Read the content of the **Books Registry** file, remove the entire section for the completed book (the part that starts with `---` and contains the book description), and write the modified content back to the file.

**iv. Commit Changes**

Stage the **Books Registry** file and `conductor/archive/`. Commit with the message:

```
chore(conductor): Archive book '<book_description>'
```

**v. Announce Success**

Announce:

```
Book '<book_description>' has been successfully archived.
```

#### If user chooses "Delete"

**CRITICAL WARNING:** Before proceeding, immediately call the `ask_user` tool to ask for final confirmation (do not repeat the warning in the chat):

```yaml
questions:
  - header: "Confirm"
    question: "WARNING: This will permanently delete the book folder and all its contents. This action cannot be undone. Are you sure?"
    type: "yesno"
```

**Handle Confirmation:**

**If 'yes':**

**a. Delete Book Folder**

Resolve the **Books Directory** and permanently delete the book's folder from `<Books Directory>/<book_id>`.

**b. Remove from Books File**

Read the content of the **Books Registry** file, remove the entire section for the completed book, and write the modified content back to the file.

**c. Commit Changes**

Stage the **Books Registry** file and the deletion of the book directory. Commit with the message:

```
chore(conductor): Delete book '<book_description>'
```

**d. Announce Success**

Announce:

```
Book '<book_description>' has been permanently deleted.
```

**If 'no':**

**a. Announce Cancellation**

Announce:

```
Deletion cancelled. The book has not been changed.
```

#### If user chooses "Skip"

Announce:

```
Okay, the completed book will remain in your books file for now.
```
