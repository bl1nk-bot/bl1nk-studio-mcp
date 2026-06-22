import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import type { Note } from "../store/notes";
import { Editor } from "./Editor";

const makeNote = (overrides: Partial<Note> = {}): Note => ({
	id: "n1",
	title: "Test Note",
	content: "# Test Note\n\nHello world",
	tags: ["test"],
	emoji: "📝",
	createdAt: Date.now(),
	updatedAt: Date.now(),
	...overrides,
});

describe("Editor", () => {
	it("shows empty state when no note selected", () => {
		render(<Editor note={null} onChange={vi.fn()} />);
		expect(screen.getByText(/select a note/i)).toBeTruthy();
	});

	it("displays the note title", () => {
		render(<Editor note={makeNote()} onChange={vi.fn()} />);
		const matches = screen.getAllByText("Test Note");
		expect(matches.length).toBeGreaterThanOrEqual(1);
	});

	it("shows note tags", () => {
		render(<Editor note={makeNote({ tags: ["design"] })} onChange={vi.fn()} />);
		expect(screen.getByText("design")).toBeTruthy();
	});

	it("renders mode buttons (Split / Edit / Preview)", () => {
		render(<Editor note={makeNote()} onChange={vi.fn()} />);
		expect(screen.getByTitle("Split")).toBeTruthy();
		expect(screen.getByTitle("Edit")).toBeTruthy();
		expect(screen.getByTitle("Preview")).toBeTruthy();
	});

	it("shows the note emoji", () => {
		render(<Editor note={makeNote({ emoji: "🚀" })} onChange={vi.fn()} />);
		expect(screen.getByText("🚀")).toBeTruthy();
	});
});
