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

interface ListViewProps {
	notes: Note[];
	labels: Label[];
	onSelect: (id: string) => void;
}

export function ListView({ notes, labels, onSelect }: ListViewProps) {
	const labelMap = Object.fromEntries(labels.map((l) => [l.id, l]));

	return (
		<div
			className="flex-1 overflow-y-auto"
			style={{ background: "var(--bg-base)" }}
		>
			<table className="w-full text-xs border-collapse">
				<thead
					style={{
						position: "sticky",
						top: 0,
						zIndex: 10,
						background: "var(--bg-surface)",
					}}
				>
					<tr style={{ borderBottom: "1px solid var(--border)" }}>
						<th
							className="text-left px-4 py-2.5 font-semibold tracking-wider uppercase"
							style={{ color: "var(--text-muted)", width: 36 }}
						></th>
						<th
							className="text-left px-4 py-2.5 font-semibold tracking-wider uppercase"
							style={{ color: "var(--text-muted)" }}
						>
							Title
						</th>
						<th
							className="text-left px-4 py-2.5 font-semibold tracking-wider uppercase"
							style={{ color: "var(--text-muted)" }}
						>
							Labels
						</th>
						<th
							className="text-left px-4 py-2.5 font-semibold tracking-wider uppercase"
							style={{ color: "var(--text-muted)" }}
						>
							Tags
						</th>
						<th
							className="text-right px-4 py-2.5 font-semibold tracking-wider uppercase"
							style={{ color: "var(--text-muted)" }}
						>
							Updated
						</th>
					</tr>
				</thead>
				<tbody>
					{notes.map((note) => (
						<tr
							key={note.id}
							onClick={() => onSelect(note.id)}
							className="cursor-pointer transition-all hover:bg-[rgba(0,188,212,0.04)]"
							style={{ borderBottom: "1px solid rgba(0,188,212,0.06)" }}
						>
							<td className="px-4 py-2.5 text-base text-center">
								{note.emoji ?? "📝"}
							</td>
							<td
								className="px-4 py-2.5 font-medium"
								style={{ color: "var(--text-primary)" }}
							>
								{note.title}
							</td>
							<td className="px-4 py-2.5">
								<div className="flex gap-1 flex-wrap">
									{(note.labelIds ?? []).map((lid) => {
										const label = labelMap[lid];
										if (!label) return null;
										return (
											<span
												key={lid}
												className="px-1.5 py-0.5 rounded-full text-xs font-medium"
												style={{
													background: label.color + "22",
													color: label.color,
													border: `1px solid ${label.color}44`,
												}}
											>
												{label.name}
											</span>
										);
									})}
								</div>
							</td>
							<td className="px-4 py-2.5">
								<div className="flex gap-1 flex-wrap">
									{note.tags.map((t) => (
										<span
											key={t}
											className="px-1.5 py-0.5 rounded-md"
											style={{
												background: "rgba(0,188,212,0.08)",
												color: "var(--teal)",
											}}
										>
											{t}
										</span>
									))}
								</div>
							</td>
							<td
								className="px-4 py-2.5 text-right whitespace-nowrap"
								style={{ color: "var(--text-muted)" }}
							>
								{relTime(note.updatedAt)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
