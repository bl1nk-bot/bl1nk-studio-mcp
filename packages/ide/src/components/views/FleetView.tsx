import React from "react";
import type { Label } from "../../store/labels";
import type { Note } from "../../store/notes";

function relTime(ts: number): string {
	const diff = Date.now() - ts;
	const m = Math.floor(diff / 60000);
	if (m < 1) return "just now";
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	return d < 7 ? `${d}d ago` : new Date(ts).toLocaleDateString();
}

function excerpt(content: string): string {
	return content
		.replace(/^#+\s+.+$/gm, "")
		.replace(/[_*`~>[\]]/g, "")
		.trim()
		.slice(0, 140);
}

interface FleetViewProps {
	notes: Note[];
	labels: Label[];
	onSelect: (id: string) => void;
}

export function FleetView({ notes, labels, onSelect }: FleetViewProps) {
	const labelMap = Object.fromEntries(labels.map((l) => [l.id, l]));

	return (
		<div
			className="flex-1 overflow-y-auto p-5"
			style={{ background: "var(--bg-base)" }}
		>
			<div
				className="grid gap-4"
				style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}
			>
				{notes.map((note) => (
					<button
						key={note.id}
						onClick={() => onSelect(note.id)}
						className="flex flex-col text-left p-4 rounded-xl transition-all duration-150 hover:scale-[1.02] hover:shadow-lg"
						style={{
							background: "var(--bg-elevated)",
							border: "1px solid var(--border)",
							backdropFilter: "blur(12px)",
						}}
					>
						<div className="text-3xl mb-2">{note.emoji ?? "📝"}</div>
						<div
							className="text-sm font-semibold mb-1.5 line-clamp-1"
							style={{ color: "var(--text-primary)" }}
						>
							{note.title}
						</div>
						<div
							className="text-xs flex-1 line-clamp-3 mb-3 leading-relaxed"
							style={{ color: "var(--text-muted)" }}
						>
							{excerpt(note.content) || "Empty note"}
						</div>
						{(note.labelIds ?? []).length > 0 && (
							<div className="flex gap-1 flex-wrap mb-2">
								{(note.labelIds ?? []).map((lid) => {
									const label = labelMap[lid];
									if (!label) return null;
									return (
										<span
											key={lid}
											className="px-1.5 py-0.5 rounded-full text-xs"
											style={{
												background: label.color + "22",
												color: label.color,
											}}
										>
											{label.name}
										</span>
									);
								})}
							</div>
						)}
						<div className="text-xs" style={{ color: "var(--text-muted)" }}>
							{relTime(note.updatedAt)}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
