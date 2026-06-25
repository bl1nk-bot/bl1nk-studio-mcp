import { CheckSquare, ChevronDown, Plus, Square } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../lib/utils";
import type { Task } from "../store/notes";

interface TaskTrackerProps {
	tasks: Task[];
	onToggle: (id: string) => void;
	onAdd: (text: string, priority: Task["priority"]) => void;
}

type Filter = "all" | "high" | "medium" | "low";

const PRIORITY_COLORS: Record<Task["priority"], string> = {
	high: "#ef4444",
	medium: "#f97316",
	low: "#22c55e",
};

export function TaskTracker({ tasks, onToggle, onAdd }: TaskTrackerProps) {
	const [filter, setFilter] = useState<Filter>("all");
	const [newText, setNewText] = useState("");
	const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
	const [addOpen, setAddOpen] = useState(false);

	const filtered = tasks.filter(
		(t) => filter === "all" || t.priority === filter,
	);
	const done = tasks.filter((t) => t.done).length;
	const progress =
		tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

	function handleAdd() {
		const text = newText.trim();
		if (!text) return;
		onAdd(text, newPriority);
		setNewText("");
		setAddOpen(false);
	}

	const filters: Filter[] = ["all", "high", "medium", "low"];

	return (
		<div
			className="flex-1 flex flex-col overflow-hidden"
			style={{ background: "var(--bg-base)" }}
		>
			<div
				className="px-6 py-4 border-b"
				style={{
					background: "var(--bg-elevated)",
					borderColor: "var(--border)",
					backdropFilter: "blur(20px)",
				}}
			>
				<div className="flex items-center justify-between mb-3">
					<h2
						className="text-sm font-semibold"
						style={{ color: "var(--text-primary)" }}
					>
						Tasks
					</h2>
					<span className="text-xs" style={{ color: "var(--text-muted)" }}>
						{done} / {tasks.length} done
					</span>
				</div>

				<div
					className="relative h-1.5 rounded-full overflow-hidden mb-4"
					style={{ background: "rgba(0,188,212,0.1)" }}
				>
					<div
						className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
						style={{
							width: `${progress}%`,
							background:
								"linear-gradient(90deg, var(--teal), var(--teal-bright))",
							boxShadow: "0 0 8px rgba(0,229,255,0.5)",
						}}
					/>
				</div>

				<div className="flex items-center justify-between gap-2">
					<div className="flex gap-1">
						{filters.map((f) => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								className={cn(
									"px-2.5 py-0.5 rounded-md text-xs capitalize transition-all",
									filter === f
										? "text-[var(--teal)] bg-[rgba(0,188,212,0.12)]"
										: "text-[var(--text-secondary)] hover:bg-[rgba(0,188,212,0.06)]",
								)}
							>
								{f}
							</button>
						))}
					</div>
					<button
						onClick={() => setAddOpen((o) => !o)}
						className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs transition-all hover:bg-[rgba(0,188,212,0.08)]"
						style={{ color: "var(--teal)" }}
					>
						<Plus size={12} /> Add task
					</button>
				</div>

				{addOpen && (
					<div
						className="mt-3 flex flex-col gap-2 p-3 rounded-xl"
						style={{
							background: "rgba(0,188,212,0.05)",
							border: "1px solid var(--border)",
						}}
					>
						<input
							autoFocus
							value={newText}
							onChange={(e) => setNewText(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAdd()}
							placeholder="Task description…"
							className="bg-transparent text-sm outline-none"
							style={{ color: "var(--text-primary)" }}
						/>
						<div className="flex items-center gap-2">
							<div className="flex gap-1">
								{(["high", "medium", "low"] as Task["priority"][]).map((p) => (
									<button
										key={p}
										onClick={() => setNewPriority(p)}
										className="px-2 py-0.5 rounded-md text-xs capitalize transition-all"
										style={{
											background:
												newPriority === p
													? PRIORITY_COLORS[p] + "33"
													: "transparent",
											color:
												newPriority === p
													? PRIORITY_COLORS[p]
													: "var(--text-muted)",
											border: `1px solid ${newPriority === p ? PRIORITY_COLORS[p] + "66" : "var(--border)"}`,
										}}
									>
										{p}
									</button>
								))}
							</div>
							<button
								onClick={handleAdd}
								disabled={!newText.trim()}
								className="ml-auto px-3 py-0.5 rounded-md text-xs transition-all"
								style={{
									background: newText.trim()
										? "rgba(0,188,212,0.2)"
										: "transparent",
									color: newText.trim() ? "var(--teal)" : "var(--text-muted)",
								}}
							>
								Add
							</button>
						</div>
					</div>
				)}
			</div>

			<div className="flex-1 overflow-y-auto px-4 py-3">
				{filtered.length === 0 && (
					<div className="flex flex-col items-center justify-center py-16 gap-3">
						<span className="text-5xl opacity-20">✓</span>
						<p className="text-sm" style={{ color: "var(--text-muted)" }}>
							{filter === "all"
								? "No tasks yet"
								: `No ${filter} priority tasks`}
						</p>
					</div>
				)}

				{filtered.map((task) => (
					<button
						key={task.id}
						onClick={() => !task.noteId && onToggle(task.id)}
						className={cn(
							"flex items-start gap-3 w-full px-3 py-2.5 rounded-lg mb-1.5 text-left transition-all",
							!task.noteId
								? "hover:bg-[rgba(0,188,212,0.05)] cursor-pointer"
								: "cursor-default opacity-75",
						)}
					>
						<span
							className="mt-0.5 shrink-0"
							style={{ color: task.done ? "var(--teal)" : "var(--text-muted)" }}
						>
							{task.done ? <CheckSquare size={15} /> : <Square size={15} />}
						</span>
						<span
							className={cn(
								"text-sm flex-1 leading-relaxed",
								task.done && "line-through",
							)}
							style={{
								color: task.done
									? "var(--text-muted)"
									: "var(--text-secondary)",
							}}
						>
							{task.text}
						</span>
						<span
							className="text-xs px-1.5 py-0.5 rounded-full shrink-0 mt-0.5"
							style={{
								background: PRIORITY_COLORS[task.priority] + "20",
								color: PRIORITY_COLORS[task.priority],
							}}
						>
							{task.priority}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
