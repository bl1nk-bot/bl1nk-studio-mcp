import { beforeEach, describe, expect, it } from "vitest";
import { extractTasksFromNotes, notesStore } from "./notes";
import type { Note } from "./notes";

const makeNote = (overrides: Partial<Note> = {}): Note => ({
  id: "n1",
  title: "Test",
  content: "# Test\n\n- [ ] todo\n- [x] done\n- regular line\n",
  tags: [],
  createdAt: 1000,
  updatedAt: 2000,
  ...overrides,
});

describe("extractTasksFromNotes", () => {
  it("extracts unchecked tasks", () => {
    const tasks = extractTasksFromNotes([makeNote()]);
    const undone = tasks.filter((t) => !t.done);
    expect(undone).toHaveLength(1);
    expect(undone[0]?.text).toBe("todo");
  });

  it("extracts checked tasks as done=true", () => {
    const tasks = extractTasksFromNotes([makeNote()]);
    const done = tasks.filter((t) => t.done);
    expect(done).toHaveLength(1);
    expect(done[0]?.text).toBe("done");
  });

  it("ignores non-task lines", () => {
    const tasks = extractTasksFromNotes([makeNote()]);
    expect(tasks).toHaveLength(2);
  });

  it("assigns noteId matching the source note", () => {
    const tasks = extractTasksFromNotes([makeNote({ id: "abc" })]);
    expect(tasks.every((t) => t.noteId === "abc")).toBe(true);
  });

  it("returns empty array for notes with no tasks", () => {
    const tasks = extractTasksFromNotes([makeNote({ content: "# Just prose\n\nNo tasks here." })]);
    expect(tasks).toHaveLength(0);
  });

  it("returns empty array for empty note list", () => {
    expect(extractTasksFromNotes([])).toHaveLength(0);
  });

  it("aggregates tasks across multiple notes", () => {
    const a = makeNote({ id: "a", content: "- [ ] alpha\n" });
    const b = makeNote({ id: "b", content: "- [x] beta\n" });
    const tasks = extractTasksFromNotes([a, b]);
    expect(tasks).toHaveLength(2);
    expect(tasks[0]?.noteId).toBe("a");
    expect(tasks[1]?.noteId).toBe("b");
  });

  it("defaults priority to medium", () => {
    const tasks = extractTasksFromNotes([makeNote()]);
    expect(tasks.every((t) => t.priority === "medium")).toBe(true);
  });
});

describe("notesStore.create", () => {
  it("creates a note with the given title", () => {
    const note = notesStore.create("My Note");
    expect(note.title).toBe("My Note");
  });

  it("opens content with an h1 matching the title", () => {
    const note = notesStore.create("Hello");
    expect(note.content.startsWith("# Hello")).toBe(true);
  });

  it("generates a unique id on each call", () => {
    const a = notesStore.create("A");
    const b = notesStore.create("B");
    expect(a.id).not.toBe(b.id);
  });

  it("starts with empty tags array", () => {
    const note = notesStore.create("X");
    expect(note.tags).toEqual([]);
  });

  it("sets createdAt and updatedAt as recent timestamps", () => {
    const before = Date.now();
    const note = notesStore.create("T");
    expect(note.createdAt).toBeGreaterThanOrEqual(before);
    expect(note.updatedAt).toBeGreaterThanOrEqual(before);
  });
});

describe("notesStore load/save round-trip", () => {
  beforeEach(() => localStorage.clear());

  it("returns demo notes when storage is empty", () => {
    const notes = notesStore.load();
    expect(notes.length).toBeGreaterThan(0);
  });

  it("round-trips notes through localStorage", () => {
    const note = notesStore.create("Persisted");
    notesStore.save([note]);
    const loaded = notesStore.load();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.title).toBe("Persisted");
  });

  it("round-trips tasks through localStorage", () => {
    const task = { id: "t1", text: "Do it", done: false, priority: "high" as const };
    notesStore.tasksSave([task]);
    const loaded = notesStore.tasksLoad();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.text).toBe("Do it");
  });
});
