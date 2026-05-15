import {
	ChevronDown,
	ChevronRight,
	FileText,
	Folder,
	Hash,
	Plus,
	Search,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import type { Note } from "../store/notes";

interface SidebarProps {
	notes: Note[];
	activeNoteId: string | null;
	onSelectNote: (id: string | null) => void;
	onNewNote: () => void;
}

export function Sidebar({
	notes,
	activeNoteId,
	onSelectNote,
	onNewNote,
}: SidebarProps) {
	const [expanded, setExpanded] = useState(true);
	const [search, setSearch] = useState("");

	const filtered = notes.filter(
		(n) =>
			search === "" ||
			n.title.toLowerCase().includes(search.toLowerCase()) ||
			n.content.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div 
			className="flex flex-col w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border)] overflow-hidden shrink-0"
		>
			<div
				className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]"
			>
				<div className="flex items-center gap-2">
					<FileText size={14} className="text-[var(--teal)]" />
					<span
						className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-secondary)]"
					>
						Manuscript
					</span>
				</div>
				<button
					onClick={onNewNote}
					className="flex items-center justify-center w-6 h-6 rounded-lg bg-[rgba(0,188,212,0.1)] text-[var(--teal)] hover:bg-[var(--teal)] hover:text-black transition-all"
				>
					<Plus size={14} />
				</button>
			</div>

			<div
				className="px-3 py-3 border-b border-[var(--border)]"
			>
				<div
					className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--border-light)] focus-within:border-[var(--teal)] transition-all"
				>
					<Search size={12} className="text-[var(--text-muted)]" />
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Filter scenes..."
						className="flex-1 bg-transparent text-xs outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
					/>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
				<button
					onClick={() => setExpanded((e) => !e)}
					className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-white/5 transition-all text-[var(--text-secondary)]"
				>
					{expanded ? (
						<ChevronDown size={12} className="text-[var(--teal)]" />
					) : (
						<ChevronRight size={12} />
					)}
					<Folder size={12} />
					<span className="text-xs font-semibold">Vault</span>
					<span className="ml-auto text-[10px] bg-[rgba(0,188,212,0.1)] px-1.5 py-0.5 rounded-md text-[var(--teal)]">
						{notes.length}
					</span>
				</button>

				{expanded &&
					filtered.map((note) => (
						<button
							key={note.id}
							onClick={() => onSelectNote(note.id)}
							className={cn(
								"flex items-center gap-3 w-full px-6 py-2 text-left transition-all duration-150 relative group",
								activeNoteId === note.id
									? "text-[var(--teal)] bg-[rgba(0,188,212,0.08)]"
									: "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5",
							)}
						>
							{activeNoteId === note.id && (
								<div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[var(--teal)] shadow-[0_0_10px_var(--teal)]" />
							)}
							<Hash size={12} className={cn("shrink-0", activeNoteId === note.id ? "opacity-100" : "opacity-30 group-hover:opacity-60")} />
							<span className="text-xs truncate font-medium">{note.title}</span>
						</button>
					))}
			</div>
		</div>
	);
}
