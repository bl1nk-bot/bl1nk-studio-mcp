import { beforeEach, describe, expect, it } from "vitest";
import { extractTasksFromNotes, type Note, notesStore } from "./notes";

const makeNote = (overrides: Partial<Note> = {}): Note => ({
	id: "test-note",
	title: "Test",
	content: "",
	tags: [],
	createdAt: Date.now(),
	updatedAt: Date.now(),
	...overrides,
});

describe("extractTasksFromNotes", () => {
	it("returns empty array for notes with no tasks", () => {
		const notes = [makeNote({ content: "# Heading\n\nSome text" })];
		expect(extractTasksFromNotes(notes)).toHaveLength(0);
	});

	it("extracts unchecked tasks", () => {
		const notes = [makeNote({ content: "- [ ] Buy milk\n- [ ] Read book" })];
		const tasks = extractTasksFromNotes(notes);
		expect(tasks).toHaveLength(2);
		expect(tasks[0].done).toBe(false);
		expect(tasks[0].text).toBe("Buy milk");
	});

	it("extracts checked tasks", () => {
		const notes = [makeNote({ content: "- [x] Done task" })];
		const tasks = extractTasksFromNotes(notes);
		expect(tasks[0].done).toBe(true);
	});

	it("sets noteId on extracted tasks", () => {
		const notes = [makeNote({ id: "note-abc", content: "- [ ] Task" })];
		const tasks = extractTasksFromNotes(notes);
		expect(tasks[0].noteId).toBe("note-abc");
	});

	it("handles multiple notes", () => {
		const notes = [
			makeNote({ id: "a", content: "- [ ] A1\n- [ ] A2" }),
			makeNote({ id: "b", content: "- [x] B1" }),
		];
		const tasks = extractTasksFromNotes(notes);
		expect(tasks).toHaveLength(3);
	});

	it("ignores non-task lines", () => {
		const notes = [
			makeNote({ content: "# Header\n\nParagraph\n\n- [ ] Real task" }),
		];
		expect(extractTasksFromNotes(notes)).toHaveLength(1);
	});

	it("trims task text", () => {
		const notes = [makeNote({ content: "- [ ]   spaces around  " })];
		const tasks = extractTasksFromNotes(notes);
		expect(tasks[0].text).toBe("spaces around");
	});

	it("returns empty for empty notes array", () => {
		expect(extractTasksFromNotes([])).toHaveLength(0);
	});
});

describe("notesStore.create", () => {
	it("creates a note with the given title", () => {
		const note = notesStore.create("My Title");
		expect(note.title).toBe("My Title");
	});

	it("opens content with an h1 matching the title", () => {
		const note = notesStore.create("Hello");
		expect(note.content).toMatch(/^# Hello/);
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
		const after = Date.now();
		expect(note.createdAt).toBeGreaterThanOrEqual(before);
		expect(note.updatedAt).toBeLessThanOrEqual(after);
	});
});

describe("notesStore load/save round-trip", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("returns demo notes when storage is empty", () => {
		const notes = notesStore.load();
		expect(notes.length).toBeGreaterThan(0);
	});

	it("restores saved notes", () => {
		const notes = [makeNote({ id: "saved-1", title: "Saved" })];
		notesStore.save(notes);
		const loaded = notesStore.load();
		expect(loaded[0].id).toBe("saved-1");
	});

	it("falls back to demo data on corrupt storage", () => {
		localStorage.setItem("ai-ide-notes", "{bad json{{");
		const notes = notesStore.load();
		expect(notes.length).toBeGreaterThan(0);
	});
});
