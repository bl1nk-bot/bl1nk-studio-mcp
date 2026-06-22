import {
	CheckSquare,
	FileText,
	Layout,
	LayoutGrid,
	Menu,
	PanelLeft,
	PanelLeftClose,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { CanvasView } from "./components/CanvasView";
import { Editor } from "./components/Editor";
import { Sidebar } from "./components/Sidebar";
import { TaskTracker } from "./components/TaskTracker";
import { type ViewMode, ViewSwitcher } from "./components/ViewSwitcher";
import { CalendarView } from "./components/views/CalendarView";
import { FleetView } from "./components/views/FleetView";
import { HeatmapView } from "./components/views/HeatmapView";
import { ListView } from "./components/views/ListView";
import { TableView } from "./components/views/TableView";
import { TimelineView } from "./components/views/TimelineView";
import { type Label, labelsStore } from "./store/labels";
import {
	extractTasksFromNotes,
	type Note,
	notesStore,
	type Task,
} from "./store/notes";

type Panel = "files" | "tasks" | "canvas" | "search" | "views";

const BOTTOM_NAV: { icon: React.ReactNode; panel: Panel; label: string }[] = [
	{ icon: <FileText size={20} />, panel: "files", label: "Files" },
	{ icon: <CheckSquare size={20} />, panel: "tasks", label: "Tasks" },
	{ icon: <Layout size={20} />, panel: "canvas", label: "Canvas" },
	{ icon: <LayoutGrid size={20} />, panel: "views", label: "Views" },
];

export default function App() {
	const [notes, setNotes] = useState<Note[]>(() => notesStore.load());
	const [labels, setLabels] = useState<Label[]>(() => labelsStore.load());
	const [activeNoteId, setActiveNoteId] = useState<string | null>(
		notes[0]?.id ?? null,
	);
	const [activePanel, setActivePanel] = useState<Panel>("files");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [standaloneTaskList, setStandaloneTaskList] = useState<Task[]>(() =>
		notesStore.tasksLoad(),
	);
	const [view, setView] = useState<ViewMode>("list");

	const activeNote = useMemo(
		() => notes.find((n) => n.id === activeNoteId) ?? null,
		[notes, activeNoteId],
	);

	const allTasks = useMemo(() => {
		const fromNotes = extractTasksFromNotes(notes);
		return [...standaloneTaskList, ...fromNotes];
	}, [notes, standaloneTaskList]);

	const handleNoteChange = useCallback((id: string, content: string) => {
		setNotes((prev) => {
			const next = prev.map((n) =>
				n.id === id ? { ...n, content, updatedAt: Date.now() } : n,
			);
			notesStore.save(next);
			return next;
		});
	}, []);

	const handleEmojiChange = useCallback((id: string, emoji: string) => {
		setNotes((prev) => {
			const next = prev.map((n) => (n.id === id ? { ...n, emoji } : n));
			notesStore.save(next);
			return next;
		});
	}, []);

	const handleLabelToggle = useCallback((noteId: string, labelId: string) => {
		setNotes((prev) => {
			const next = prev.map((n) => {
				if (n.id !== noteId) return n;
				const current = n.labelIds ?? [];
				const labelIds = current.includes(labelId)
					? current.filter((id) => id !== labelId)
					: [...current, labelId];
				return { ...n, labelIds };
			});
			notesStore.save(next);
			return next;
		});
	}, []);

	const handleNewNote = useCallback(() => {
		const note = notesStore.create(`Untitled ${notes.length + 1}`);
		setNotes((prev) => {
			const next = [note, ...prev];
			notesStore.save(next);
			return next;
		});
		setActiveNoteId(note.id);
		setActivePanel("files");
	}, [notes.length]);

	const handleToggleTask = useCallback((id: string) => {
		setStandaloneTaskList((prev) => {
			const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
			notesStore.tasksSave(next);
			return next;
		});
	}, []);

	const handleAddTask = useCallback(
		(text: string, priority: Task["priority"]) => {
			const task: Task = {
				id: `task-${Date.now()}`,
				text,
				done: false,
				priority,
			};
			setStandaloneTaskList((prev) => {
				const next = [task, ...prev];
				notesStore.tasksSave(next);
				return next;
			});
		},
		[],
	);

	function changePanel(p: Panel) {
		setActivePanel(p);
		setDrawerOpen(false);
		if (p === "files" && !activeNoteId && notes.length)
			setActiveNoteId(notes[0].id);
		if (p === "views") setActiveNoteId(null);
		if (p === "tasks" || p === "canvas") setActiveNoteId(null);
	}

	function selectNote(id: string) {
		setActiveNoteId(id);
		setActivePanel("files");
		setDrawerOpen(false);
	}

	const showTaskPanel = activePanel === "tasks";
	const showCanvasPanel = activePanel === "canvas";
	const showViewsPanel = activePanel === "views" && !activeNoteId;
	const showEditor = !showTaskPanel && !showCanvasPanel && !showViewsPanel;

	const topPanels: Panel[] = ["files", "tasks", "canvas", "views"];

	const sidebarProps = {
		notes,
		labels,
		activeNoteId,
		activePanel,
		onSelectNote: selectNote,
		onNewNote: () => {
			handleNewNote();
			setDrawerOpen(false);
		},
		onPanelChange: changePanel,
		onLabelsChange: setLabels,
	};

	return (
		<div
			className="flex h-full w-full overflow-hidden"
			style={{ background: "var(--bg-base)" }}
		>
			{/* ── Desktop sidebar (hidden on mobile) ─────────────────────── */}
			{sidebarOpen && (
				<div
					className="hidden md:flex shrink-0 border-r"
					style={{ width: 244, borderColor: "var(--border)" }}
				>
					<Sidebar {...sidebarProps} />
				</div>
			)}

			{/* ── Mobile drawer overlay ───────────────────────────────────── */}
			{drawerOpen && (
				<div className="md:hidden fixed inset-0 z-50 flex">
					<div
						className="w-72 h-full flex shrink-0"
						style={{ borderRight: "1px solid var(--border)" }}
					>
						<Sidebar {...sidebarProps} />
					</div>
					<button
						aria-label="Close menu"
						className="flex-1 bg-black/60 cursor-default"
						onClick={() => setDrawerOpen(false)}
					/>
				</div>
			)}

			{/* ── Main column ─────────────────────────────────────────────── */}
			<div className="flex flex-col flex-1 min-w-0 overflow-hidden">
				{/* Top bar */}
				<div
					className="flex items-center px-3 border-b shrink-0 gap-2"
					style={{
						height: 48,
						background: "var(--bg-elevated)",
						borderColor: "var(--border)",
						backdropFilter: "blur(20px)",
					}}
				>
					{/* Mobile: hamburger */}
					<button
						onClick={() => setDrawerOpen((o) => !o)}
						className="md:hidden flex items-center justify-center rounded-lg transition-all active:bg-[rgba(0,188,212,0.15)]"
						style={{ width: 44, height: 44, color: "var(--text-secondary)" }}
						aria-label="Open menu"
					>
						<Menu size={18} />
					</button>

					{/* Desktop: sidebar toggle */}
					<button
						onClick={() => setSidebarOpen((o) => !o)}
						className="hidden md:flex items-center justify-center w-7 h-7 rounded transition-all hover:bg-[rgba(0,188,212,0.08)]"
						style={{ color: "var(--text-secondary)" }}
					>
						{sidebarOpen ? (
							<PanelLeftClose size={14} />
						) : (
							<PanelLeft size={14} />
						)}
					</button>

					<div className="flex-1 flex items-center justify-center">
						<span
							className="text-xs font-semibold tracking-widest uppercase teal-text-glow"
							style={{ color: "var(--teal)" }}
						>
							AI · IDE
						</span>
					</div>

					{/* Desktop tab bar */}
					<div className="hidden md:flex items-center gap-1">
						{topPanels.map((p) => (
							<button
								key={p}
								onClick={() => changePanel(p)}
								className="text-xs px-2.5 py-1 rounded-md capitalize transition-all"
								style={{
									color:
										activePanel === p ? "var(--teal)" : "var(--text-secondary)",
									background:
										activePanel === p ? "rgba(0,188,212,0.1)" : "transparent",
								}}
							>
								{p}
							</button>
						))}
					</div>
				</div>

				{/* Content area */}
				<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
					{showEditor && (
						<Editor
							note={activeNote}
							onChange={handleNoteChange}
							onEmojiChange={handleEmojiChange}
							onBack={
								activePanel === "views"
									? () => setActiveNoteId(null)
									: undefined
							}
						/>
					)}
					{showTaskPanel && (
						<TaskTracker
							tasks={allTasks}
							onToggle={handleToggleTask}
							onAdd={handleAddTask}
						/>
					)}
					{showCanvasPanel && <CanvasView />}
					{showViewsPanel && (
						<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
							<ViewSwitcher active={view} onChange={setView} />
							{view === "list" && (
								<ListView
									notes={notes}
									labels={labels}
									onSelect={(id) => {
										selectNote(id);
									}}
								/>
							)}
							{view === "fleet" && (
								<FleetView
									notes={notes}
									labels={labels}
									onSelect={(id) => {
										selectNote(id);
									}}
								/>
							)}
							{view === "table" && (
								<TableView
									notes={notes}
									labels={labels}
									onSelect={(id) => {
										selectNote(id);
									}}
									onLabelToggle={handleLabelToggle}
								/>
							)}
							{view === "calendar" && (
								<CalendarView
									notes={notes}
									labels={labels}
									onSelect={(id) => {
										selectNote(id);
									}}
								/>
							)}
							{view === "timeline" && (
								<TimelineView
									notes={notes}
									labels={labels}
									onSelect={(id) => {
										selectNote(id);
									}}
								/>
							)}
							{view === "heatmap" && <HeatmapView notes={notes} />}
						</div>
					)}
				</div>

				{/* ── Mobile bottom navigation ─────────────────────────────── */}
				<nav
					className="md:hidden shrink-0 flex items-stretch border-t"
					style={{
						height: 56,
						background: "var(--bg-elevated)",
						borderColor: "var(--border)",
					}}
				>
					{BOTTOM_NAV.map(({ icon, panel, label }) => (
						<button
							key={panel}
							onClick={() => changePanel(panel)}
							className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all"
							style={{
								color:
									activePanel === panel ? "var(--teal)" : "var(--text-muted)",
								background:
									activePanel === panel
										? "rgba(0,188,212,0.08)"
										: "transparent",
							}}
						>
							{icon}
							<span className="text-[10px] font-medium capitalize tracking-wide">
								{label}
							</span>
						</button>
					))}
				</nav>
			</div>
		</div>
	);
}
