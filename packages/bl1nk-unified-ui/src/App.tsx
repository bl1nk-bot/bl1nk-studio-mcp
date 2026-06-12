"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { 
	LayoutDashboard, 
	PenLine, 
	Network, 
	CalendarDays, 
	BarChart3, 
	Settings,
	CheckSquare,
	Search,
	Folder
} from "lucide-react";

import { ActDistributionChart } from "./components/ActDistributionChart";
import { HealthCheck } from "./components/HealthCheck";
import { MermaidViewer } from "./components/MermaidViewer";
import { StatCard } from "./components/StatCard";
import { StoryTimeline } from "./components/StoryTimeline";
import { ValidationPanel } from "./components/ValidationPanel";
import { Editor } from "./components/Editor";
import { Sidebar } from "./components/Sidebar";
import { TaskTracker } from "./components/TaskTracker";

import {
	mockMermaidDiagram,
	mockStoryGraph,
	mockValidationResult,
} from "./lib/mock-data";
import { notesStore, type Note, type Task, extractTasksFromNotes } from "./store/notes";

type ActiveView = "dashboard" | "editor" | "graph" | "timeline" | "tasks" | "insights";

interface NavItem {
	id: ActiveView;
	label: string;
	icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
	{ id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
	{ id: "editor", label: "Writer", icon: <PenLine size={18} /> },
	{ id: "graph", label: "Graph View", icon: <Network size={18} /> },
	{ id: "timeline", label: "Timeline", icon: <CalendarDays size={18} /> },
	{ id: "tasks", label: "Tasks", icon: <CheckSquare size={18} /> },
	{ id: "insights", label: "Insights", icon: <BarChart3 size={18} /> },
];

function App(): React.ReactElement {
	const [activeView, setActiveView] = useState<ActiveView>("dashboard");
	const [notes, setNotes] = useState<Note[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
	
	const graph = mockStoryGraph;
	const validation = mockValidationResult;

	useEffect(() => {
		const loadedNotes = notesStore.load();
		setNotes(loadedNotes);
		const firstNote = loadedNotes[0];
		if (firstNote) setActiveNoteId(firstNote.id);

		const loadedTasks = notesStore.tasksLoad();
		if (loadedTasks.length === 0) {
			setTasks(extractTasksFromNotes(loadedNotes));
		} else {
			setTasks(loadedTasks);
		}
	}, []);

	const activeNote = notes.find(n => n.id === activeNoteId) || null;

	function handleNoteChange(id: string, content: string) {
		const next = notes.map(n => n.id === id ? { ...n, content, updatedAt: Date.now() } : n);
		setNotes(next);
		notesStore.save(next);
		// Sync tasks from notes
		const updatedTasks = extractTasksFromNotes(next);
		setTasks(updatedTasks);
		notesStore.tasksSave(updatedTasks);
	}

	function handleCreateNote() {
		const newNote = notesStore.create("New Story Part");
		const next = [newNote, ...notes];
		setNotes(next);
		setActiveNoteId(newNote.id);
		setActiveView("editor");
		notesStore.save(next);
	}

	function handleToggleTask(id: string) {
		const task = tasks.find(t => t.id === id);
		if (!task) return;

		if (task.noteId) {
			let currentGlobalIndex = 0;
			const updatedNotes = notes.map(note => {
				const lines = note.content.split("\n");
				const newLines = lines.map(line => {
					const match = line.match(/^- \[(x| )\] (.+)/);
					if (match) {
						const isTarget = `${note.id}-${currentGlobalIndex}` === id;
						currentGlobalIndex++;
						if (isTarget) {
							const newDone = match[1] === " " ? "x" : " ";
							return `- [${newDone}] ${match[2]}`;
						}
					}
					return line;
				});
				return {
					...note,
					content: newLines.join("\n"),
					updatedAt: Date.now(),
				};
			});

			setNotes(updatedNotes);
			notesStore.save(updatedNotes);

			const updatedTasks = extractTasksFromNotes(updatedNotes);
			setTasks(updatedTasks);
			notesStore.tasksSave(updatedTasks);
		} else {
			const next = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
			setTasks(next);
			notesStore.tasksSave(next);
		}
	}

	function handleAddTask(text: string, priority: Task["priority"]) {
		const newTask: Task = {
			id: `task-${Date.now()}`,
			text,
			done: false,
			priority,
		};
		const next = [newTask, ...tasks];
		setTasks(next);
		notesStore.tasksSave(next);
	}

	return (
		<div className="flex h-screen w-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden">
			{/* Left Navigation Rail */}
			<aside className="flex flex-col w-16 bg-[var(--bg-sidebar)] border-r border-[var(--border)] items-center py-4 gap-4 shrink-0">
				<div className="w-10 h-10 rounded-xl bg-[var(--teal)] flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(0,188,212,0.3)] mb-4">
					B
				</div>
				
				{NAV_ITEMS.map((item) => (
					<button
						key={item.id}
						onClick={() => setActiveView(item.id)}
						title={item.label}
						className={[
							"p-3 rounded-xl transition-all group relative",
							activeView === item.id
								? "text-[var(--teal)] bg-[rgba(0,188,212,0.1)]"
								: "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.03)]",
						].join(" ")}
					>
						{item.icon}
						{activeView === item.id && (
							<div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[var(--teal)] rounded-r-full" />
						)}
					</button>
				))}

				<div className="mt-auto">
					<button className="p-3 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
						<Settings size={18} />
					</button>
				</div>
			</aside>

			{/* Sub-Sidebar for Editor (if active) */}
			{activeView === "editor" && (
				<Sidebar 
					notes={notes} 
					activeNoteId={activeNoteId} 
					onSelectNote={setActiveNoteId} 
					onNewNote={handleCreateNote} 
				/>
			)}

			<main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[rgba(5,15,15,0.1)]">
				<header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] backdrop-blur-md shrink-0">
					<div className="flex items-center gap-3">
						<h1 className="text-sm font-bold tracking-wider text-[var(--teal)] uppercase">
							{NAV_ITEMS.find(n => n.id === activeView)?.label}
						</h1>
						{activeView === "editor" && activeNote && (
							<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,188,212,0.05)] border border-[var(--border)]">
								<Folder size={12} className="text-[var(--text-muted)]" />
								<span className="text-[10px] text-[var(--text-secondary)] font-mono">{activeNote.title}</span>
							</div>
						)}
					</div>
					<div className="flex items-center gap-4">
						<button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/5 transition-all">
							<Search size={14} />
						</button>
						<span className="text-[10px] font-mono text-[var(--text-muted)]">
							VSP_UNIFIED_V3.0
						</span>
					</div>
				</header>

				<div className="flex-1 overflow-hidden">
					<ViewContent
						activeView={activeView}
						graph={graph}
						validation={validation}
						activeNote={activeNote}
						onNoteChange={handleNoteChange}
						tasks={tasks}
						onToggleTask={handleToggleTask}
						onAddTask={handleAddTask}
					/>
				</div>
			</main>
		</div>
	);
}

interface ViewContentProps {
	activeView: ActiveView;
	graph: typeof mockStoryGraph;
	validation: typeof mockValidationResult;
	activeNote: Note | null;
	onNoteChange: (id: string, content: string) => void;
	tasks: Task[];
	onToggleTask: (id: string) => void;
	onAddTask: (text: string, priority: Task["priority"]) => void;
}

function ViewContent({
	activeView,
	graph,
	validation,
	activeNote,
	onNoteChange,
	tasks,
	onToggleTask,
	onAddTask
}: ViewContentProps): React.ReactElement {
	switch (activeView) {
		case "dashboard":
			return <DashboardView graph={graph} validation={validation} />;
		case "editor":
			return <Editor note={activeNote} onChange={onNoteChange} />;
		case "graph":
			return (
				<div className="h-full p-6 overflow-auto">
					<MermaidViewer diagram={mockMermaidDiagram} />
				</div>
			);
		case "timeline":
			return (
				<div className="h-full p-6 overflow-auto">
					<StoryTimeline events={graph.events} />
				</div>
			);
		case "tasks":
			return <TaskTracker tasks={tasks} onToggle={onToggleTask} onAdd={onAddTask} />;
		case "insights":
			return (
				<div className="h-full p-6 overflow-auto">
					<InsightsView graph={graph} validation={validation} />
				</div>
			);
		default:
			return <div className="p-10">Select a view from the sidebar</div>;
	}
}

function DashboardView({
	graph,
	validation
}: { 
	graph: typeof mockStoryGraph;
	validation: typeof mockValidationResult;
}): React.ReactElement {
	return (
		<div className="h-full p-6 overflow-auto space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<StatCard label="Events" value={validation.analysis.eventCount} color="indigo" />
				<StatCard label="Characters" value={validation.analysis.characterCount} color="blue" />
				<StatCard label="Conflicts" value={validation.analysis.conflictCount} color="orange" />
				<StatCard label="Pacing" value={validation.analysis.pacing} color="emerald" />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<ActDistributionChart
						act1={validation.analysis.actBalance.act1}
						act2={validation.analysis.actBalance.act2}
						act3={validation.analysis.actBalance.act3}
					/>
				</div>
				<HealthCheck
					hasMidpoint={validation.analysis.hasMidpoint}
					hasClimax={validation.analysis.hasClimax}
					balanceScore={validation.analysis.actBalance.balance}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<ValidationPanel validation={validation} />
				<div className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)] p-6 shadow-xl backdrop-blur-md">
					<h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">Key Characters</h2>
					<div className="grid grid-cols-1 gap-3">
						{graph.characters.slice(0, 4).map(c => (
							<div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--border-light)] hover:border-[var(--teal)] transition-all">
								<span className="font-medium text-[var(--text-primary)]">{c.name}</span>
								<span className="text-xs px-2 py-1 bg-[rgba(0,188,212,0.1)] text-[var(--teal)] rounded-md font-bold uppercase tracking-wider">{c.role}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function InsightsView({
	graph,
	validation: _validation,
}: {
	graph: typeof mockStoryGraph;
	validation: typeof mockValidationResult;
}): React.ReactElement {
	return (
		<div className="p-6 space-y-6">
			<div className="bg-gradient-to-r from-indigo-900/40 to-blue-900/40 p-8 rounded-2xl border border-[var(--border)] shadow-2xl backdrop-blur-xl">
				<h2 className="text-3xl font-black mb-2 tracking-tight">{graph.meta.title}</h2>
				<p className="text-[var(--text-secondary)]">
					{graph.meta.genre || "General"} • v{graph.meta.version}
				</p>
				<div className="flex gap-2 mt-4">
					{graph.tags.map((tag) => (
						<span key={tag} className="px-3 py-1 bg-[var(--teal)]/10 text-[var(--teal)] border border-[var(--teal)]/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
							{tag}
						</span>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] p-6 shadow-xl">
					<h2 className="text-lg font-bold mb-4 text-[var(--text-secondary)]">Core Conflicts</h2>
					<div className="space-y-4">
						{graph.conflicts.map((conflict) => (
							<div key={conflict.id} className="p-4 bg-[rgba(255,255,255,0.02)] rounded-xl border border-[var(--border-light)] hover:bg-[rgba(0,188,212,0.03)] transition-all">
								<div className="flex justify-between mb-2">
									<span className="text-[10px] font-black text-[var(--teal)] uppercase tracking-tighter">
										{conflict.type}
									</span>
									<span className="text-[10px] text-[var(--text-muted)]">
										Act {conflict.actIntroduced}
									</span>
								</div>
								<p className="text-sm leading-relaxed">
									{conflict.description}
								</p>
							</div>
						))}
					</div>
				</div>
				<div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border)] p-6 shadow-xl h-full flex flex-col">
					<h2 className="text-lg font-bold mb-4 text-[var(--text-secondary)]">Story Graph</h2>
					<div className="flex-1 min-h-[300px]">
						<MermaidViewer diagram={mockMermaidDiagram} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
