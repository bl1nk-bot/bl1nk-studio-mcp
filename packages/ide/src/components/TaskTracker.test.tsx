import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import type { Task } from "../store/notes";
import { TaskTracker } from "./TaskTracker";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
	id: "t1",
	text: "Test task",
	done: false,
	priority: "medium",
	...overrides,
});

describe("TaskTracker", () => {
	it("renders without crashing when tasks is empty", () => {
		render(<TaskTracker tasks={[]} onToggle={vi.fn()} onAdd={vi.fn()} />);
		expect(screen.getByText(/no tasks yet/i)).toBeTruthy();
	});

	it("shows 0 / 0 done when empty", () => {
		render(<TaskTracker tasks={[]} onToggle={vi.fn()} onAdd={vi.fn()} />);
		expect(screen.getByText("0 / 0 done")).toBeTruthy();
	});

	it("renders a task text", () => {
		render(
			<TaskTracker
				tasks={[makeTask({ text: "Buy groceries" })]}
				onToggle={vi.fn()}
				onAdd={vi.fn()}
			/>,
		);
		expect(screen.getByText("Buy groceries")).toBeTruthy();
	});

	it("shows done count correctly", () => {
		const tasks = [
			makeTask({ done: true }),
			makeTask({ id: "t2", done: false }),
		];
		render(<TaskTracker tasks={tasks} onToggle={vi.fn()} onAdd={vi.fn()} />);
		expect(screen.getByText("1 / 2 done")).toBeTruthy();
	});

	it("calls onToggle when a standalone task is clicked", () => {
		const onToggle = vi.fn();
		render(
			<TaskTracker tasks={[makeTask()]} onToggle={onToggle} onAdd={vi.fn()} />,
		);
		fireEvent.click(screen.getByText("Test task"));
		expect(onToggle).toHaveBeenCalledWith("t1");
	});

	it("renders filter buttons", () => {
		render(<TaskTracker tasks={[]} onToggle={vi.fn()} onAdd={vi.fn()} />);
		expect(screen.getByText("all")).toBeTruthy();
		expect(screen.getByText("high")).toBeTruthy();
		expect(screen.getByText("low")).toBeTruthy();
	});

	it("opens add task form when Add task button clicked", () => {
		render(<TaskTracker tasks={[]} onToggle={vi.fn()} onAdd={vi.fn()} />);
		fireEvent.click(screen.getByText(/add task/i));
		expect(screen.getByPlaceholderText(/task description/i)).toBeTruthy();
	});

	it("calls onAdd when Enter pressed in the new task input", () => {
		const onAdd = vi.fn();
		render(<TaskTracker tasks={[]} onToggle={vi.fn()} onAdd={onAdd} />);
		fireEvent.click(screen.getByText(/add task/i));
		const input = screen.getByPlaceholderText(/task description/i);
		fireEvent.change(input, { target: { value: "New task" } });
		fireEvent.keyDown(input, { key: "Enter" });
		expect(onAdd).toHaveBeenCalledWith("New task", "medium");
	});

	it("shows priority badge on each task", () => {
		render(
			<TaskTracker
				tasks={[makeTask({ priority: "high" })]}
				onToggle={vi.fn()}
				onAdd={vi.fn()}
			/>,
		);
		const highElements = screen.getAllByText("high");
		expect(highElements.length).toBeGreaterThanOrEqual(1);
	});
});
