import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import type { Label } from "../../store/labels";
import type { Note } from "../../store/notes";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function dayKey(ts: number): string {
	const d = new Date(ts);
	return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

interface CalendarViewProps {
	notes: Note[];
	labels: Label[];
	onSelect: (id: string) => void;
}

export function CalendarView({ notes, labels, onSelect }: CalendarViewProps) {
	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState(today.getMonth());
	const [selectedDay, setSelectedDay] = useState<string | null>(null);

	const labelMap = Object.fromEntries(labels.map((l) => [l.id, l]));

	const notesByDay = new Map<string, Note[]>();
	for (const note of notes) {
		const k = dayKey(note.updatedAt);
		if (!notesByDay.has(k)) notesByDay.set(k, []);
		notesByDay.get(k)!.push(note);
	}

	function prevMonth() {
		if (month === 0) {
			setYear((y) => y - 1);
			setMonth(11);
		} else setMonth((m) => m - 1);
		setSelectedDay(null);
	}
	function nextMonth() {
		if (month === 11) {
			setYear((y) => y + 1);
			setMonth(0);
		} else setMonth((m) => m + 1);
		setSelectedDay(null);
	}

	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const cells: (number | null)[] = [
		...Array(firstDayOfMonth).fill(null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1),
	];
	while (cells.length % 7 !== 0) cells.push(null);

	const todayKey = dayKey(today.getTime());
	const selectedNotes = selectedDay ? (notesByDay.get(selectedDay) ?? []) : [];

	return (
		<div
			className="flex flex-1 min-h-0 overflow-hidden"
			style={{ background: "var(--bg-base)" }}
		>
			<div className="flex flex-col flex-1 min-w-0 p-6">
				<div className="flex items-center justify-between mb-6">
					<button
						onClick={prevMonth}
						className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:bg-[rgba(0,188,212,0.1)]"
						style={{ color: "var(--text-secondary)" }}
					>
						<ChevronLeft size={16} />
					</button>
					<h2
						className="text-sm font-semibold tracking-wider"
						style={{ color: "var(--text-primary)" }}
					>
						{MONTHS[month]} {year}
					</h2>
					<button
						onClick={nextMonth}
						className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:bg-[rgba(0,188,212,0.1)]"
						style={{ color: "var(--text-secondary)" }}
					>
						<ChevronRight size={16} />
					</button>
				</div>

				<div
					className="grid mb-2"
					style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
				>
					{DAYS.map((d) => (
						<div
							key={d}
							className="text-center text-xs font-semibold tracking-wider pb-2"
							style={{ color: "var(--text-muted)" }}
						>
							{d}
						</div>
					))}
				</div>

				<div
					className="grid gap-1 flex-1"
					style={{ gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr" }}
				>
					{cells.map((day, i) => {
						if (day === null) return <div key={i} />;
						const k = `${year}-${month}-${day}`;
						const dayNotes = notesByDay.get(k) ?? [];
						const isToday = k === todayKey;
						const isSelected = k === selectedDay;

						return (
							<button
								key={k}
								onClick={() => setSelectedDay(isSelected ? null : k)}
								className="flex flex-col items-center p-1.5 rounded-lg transition-all"
								style={{
									background: isSelected
										? "rgba(0,188,212,0.15)"
										: isToday
											? "rgba(0,188,212,0.07)"
											: "transparent",
									border: isToday
										? "1px solid rgba(0,188,212,0.35)"
										: "1px solid transparent",
								}}
							>
								<span
									className="text-xs font-medium mb-1"
									style={{
										color: isToday
											? "var(--teal)"
											: isSelected
												? "var(--teal)"
												: "var(--text-secondary)",
									}}
								>
									{day}
								</span>
								<div className="flex gap-0.5 flex-wrap justify-center">
									{dayNotes.slice(0, 3).map((n, ni) => {
										const labelColor = n.labelIds?.[0]
											? labelMap[n.labelIds[0]]?.color
											: null;
										return (
											<div
												key={ni}
												className="w-1.5 h-1.5 rounded-full"
												style={{ background: labelColor ?? "var(--teal)" }}
												title={n.title}
											/>
										);
									})}
								</div>
							</button>
						);
					})}
				</div>

				<div
					className="flex items-center gap-3 pt-4 mt-4"
					style={{ borderTop: "1px solid var(--border)" }}
				>
					<div className="flex items-center gap-1.5">
						<div
							className="w-2 h-2 rounded-full"
							style={{ background: "var(--teal)" }}
						/>
						<span className="text-xs" style={{ color: "var(--text-muted)" }}>
							Note updated on this day
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div
							className="w-4 h-4 rounded border"
							style={{
								border: "1px solid rgba(0,188,212,0.35)",
								background: "rgba(0,188,212,0.07)",
							}}
						/>
						<span className="text-xs" style={{ color: "var(--text-muted)" }}>
							Today
						</span>
					</div>
				</div>
			</div>

			{selectedNotes.length > 0 && (
				<div
					className="w-64 flex flex-col border-l overflow-y-auto p-4 shrink-0"
					style={{
						borderColor: "var(--border)",
						background: "var(--bg-surface)",
					}}
				>
					<p
						className="text-xs font-semibold tracking-wider uppercase mb-3"
						style={{ color: "var(--text-muted)" }}
					>
						{selectedNotes.length} note{selectedNotes.length > 1 ? "s" : ""}
					</p>
					{selectedNotes.map((note) => (
						<button
							key={note.id}
							onClick={() => onSelect(note.id)}
							className="flex items-start gap-2 p-2.5 rounded-lg mb-1 text-left transition-all hover:bg-[rgba(0,188,212,0.08)]"
						>
							<span className="text-lg shrink-0">{note.emoji ?? "📝"}</span>
							<div className="min-w-0">
								<p
									className="text-xs font-medium truncate"
									style={{ color: "var(--text-primary)" }}
								>
									{note.title}
								</p>
								{(note.labelIds ?? []).map((lid) => {
									const label = labelMap[lid];
									if (!label) return null;
									return (
										<span
											key={lid}
											className="text-xs px-1 rounded"
											style={{ color: label.color }}
										>
											{label.name}
										</span>
									);
								})}
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
