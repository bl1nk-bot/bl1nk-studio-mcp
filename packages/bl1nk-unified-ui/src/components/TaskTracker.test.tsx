import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskTracker } from "./TaskTracker";
import type { Task } from "../store/notes";

const tasks: Task[] = [
  { id: "1", text: "Write tests", done: false, priority: "high" },
  { id: "2", text: "Review PR", done: true, priority: "medium" },
  { id: "3", text: "Deploy", done: false, priority: "low" },
];

describe("TaskTracker — rendering", () => {
  it("renders all tasks", () => {
    render(<TaskTracker tasks={tasks} onToggle={vi.fn()} onAdd={vi.fn()} />);
    expect(screen.getByText("Write tests")).toBeInTheDocument();
    expect(screen.getByText("Review PR")).toBeInTheDocument();
    expect(screen.getByText("Deploy")).toBeInTheDocument();
  });

  it("shows correct completion count", () => {
    render(<TaskTracker tasks={tasks} onToggle={vi.fn()} onAdd={vi.fn()} />);
    expect(screen.getByText("1 / 3 completed")).toBeInTheDocument();
  });

  it("shows correct percentage", () => {
    render(<TaskTracker tasks={tasks} onToggle={vi.fn()} onAdd={vi.fn()} />);
    expect(screen.getByText("33%")).toBeInTheDocument();
  });

  it("renders filter tabs", () => {
    render(<TaskTracker tasks={tasks} onToggle={vi.fn()} onAdd={vi.fn()} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});

describe("TaskTracker — interactions", () => {
  it("calls onToggle with the task id when clicked", () => {
    const onToggle = vi.fn();
    render(<TaskTracker tasks={tasks} onToggle={onToggle} onAdd={vi.fn()} />);
    fireEvent.click(screen.getByText("Write tests"));
    expect(onToggle).toHaveBeenCalledWith("1");
  });

  it("filters to show only incomplete tasks", () => {
    render(<TaskTracker tasks={tasks} onToggle={vi.fn()} onAdd={vi.fn()} />);
    fireEvent.click(screen.getByText("To Do"));
    expect(screen.getByText("Write tests")).toBeInTheDocument();
    expect(screen.getByText("Deploy")).toBeInTheDocument();
    expect(screen.queryByText("Review PR")).not.toBeInTheDocument();
  });

  it("filters to show only completed tasks", () => {
    render(<TaskTracker tasks={tasks} onToggle={vi.fn()} onAdd={vi.fn()} />);
    fireEvent.click(screen.getByText("Done"));
    expect(screen.getByText("Review PR")).toBeInTheDocument();
    expect(screen.queryByText("Write tests")).not.toBeInTheDocument();
  });

  it("calls onAdd with trimmed text and current priority on Enter", () => {
    const onAdd = vi.fn();
    render(<TaskTracker tasks={[]} onToggle={vi.fn()} onAdd={onAdd} />);
    const input = screen.getByPlaceholderText("Add a task...");
    fireEvent.change(input, { target: { value: "  New task  " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onAdd).toHaveBeenCalledWith("New task", "medium");
  });

  it("does not call onAdd when input is blank", () => {
    const onAdd = vi.fn();
    render(<TaskTracker tasks={[]} onToggle={vi.fn()} onAdd={onAdd} />);
    const input = screen.getByPlaceholderText("Add a task...");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("shows empty state when no tasks match filter", () => {
    const noTasks: Task[] = [];
    render(<TaskTracker tasks={noTasks} onToggle={vi.fn()} onAdd={vi.fn()} />);
    expect(screen.getByText("No tasks here")).toBeInTheDocument();
  });
});
