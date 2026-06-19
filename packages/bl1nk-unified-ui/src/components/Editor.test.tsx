import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Editor } from "./Editor";
import type { Note } from "../store/notes";

const mockNote: Note = {
  id: "note-1",
  title: "My Note",
  content: "# Hello\n\nSome content here.",
  tags: ["draft", "ideas"],
  createdAt: 1000,
  updatedAt: 2000,
};

describe("Editor — empty state", () => {
  it("shows a prompt when no note is selected", () => {
    render(<Editor note={null} onChange={vi.fn()} />);
    expect(screen.getByText(/Select a note/i)).toBeInTheDocument();
  });
});

describe("Editor — with note", () => {
  it("displays the note title in the toolbar", () => {
    render(<Editor note={mockNote} onChange={vi.fn()} />);
    expect(screen.getByText("My Note")).toBeInTheDocument();
  });

  it("renders each tag as a badge", () => {
    render(<Editor note={mockNote} onChange={vi.fn()} />);
    expect(screen.getByText("draft")).toBeInTheDocument();
    expect(screen.getByText("ideas")).toBeInTheDocument();
  });

  it("shows the mode toggle buttons", () => {
    render(<Editor note={mockNote} onChange={vi.fn()} />);
    expect(screen.getByTitle("Split")).toBeInTheDocument();
    expect(screen.getByTitle("Edit")).toBeInTheDocument();
    expect(screen.getByTitle("Preview")).toBeInTheDocument();
  });

  it("renders a textarea with the note content in split/edit mode", () => {
    render(<Editor note={mockNote} onChange={vi.fn()} />);
    const ta = screen.getByPlaceholderText(/Start writing/i) as HTMLTextAreaElement;
    expect(ta).toBeInTheDocument();
    expect(ta.value).toContain("# Hello");
  });
});
