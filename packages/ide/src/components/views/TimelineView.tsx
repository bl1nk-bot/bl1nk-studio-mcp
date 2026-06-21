import React from "react";
import { Note } from "../../store/notes";
import { Label } from "../../store/labels";

function formatDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function groupByDay(notes: Note[]): Map<string, Note[]> {
  const map = new Map<string, Note[]>();
  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  for (const note of sorted) {
    const key = new Date(note.updatedAt).toDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(note);
  }
  return map;
}

function excerpt(content: string): string {
  return content
    .replace(/^#+\s+.+$/gm, "")
    .replace(/[_*`~>[\]]/g, "")
    .trim()
    .slice(0, 90);
}

interface TimelineViewProps {
  notes: Note[];
  labels: Label[];
  onSelect: (id: string) => void;
}

export function TimelineView({ notes, labels, onSelect }: TimelineViewProps) {
  const labelMap = Object.fromEntries(labels.map(l => [l.id, l]));
  const groups = groupByDay(notes);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-xl mx-auto">
        {[...groups.entries()].map(([dateStr, dayNotes]) => (
          <div key={dateStr} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: "var(--border)" }} />
              <span className="text-xs font-semibold tracking-wider uppercase px-2" style={{ color: "var(--teal)" }}>
                {formatDate(dayNotes[0].updatedAt)}
              </span>
              <div className="h-px flex-1" style={{ background: "var(--border)" }} />
            </div>

            <div className="relative pl-6">
              <div
                className="absolute left-2 top-0 bottom-0 w-px"
                style={{ background: "linear-gradient(to bottom, rgba(0,188,212,0.4), rgba(0,188,212,0.05))" }}
              />

              {dayNotes.map(note => (
                <div key={note.id} className="relative mb-4">
                  <div
                    className="absolute -left-4 top-3 w-2 h-2 rounded-full"
                    style={{ background: "var(--teal)", outline: "2px solid var(--bg-base)" }}
                  />
                  <button
                    onClick={() => onSelect(note.id)}
                    className="w-full text-left p-3 rounded-xl transition-all hover:scale-[1.01]"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl shrink-0 mt-0.5">{note.emoji ?? "📝"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {note.title}
                          </span>
                          <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                            {formatTime(note.updatedAt)}
                          </span>
                        </div>
                        {excerpt(note.content) && (
                          <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: "var(--text-muted)" }}>
                            {excerpt(note.content)}
                          </p>
                        )}
                        {(note.labelIds ?? []).length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {(note.labelIds ?? []).map(lid => {
                              const label = labelMap[lid];
                              if (!label) return null;
                              return (
                                <span
                                  key={lid}
                                  className="px-1.5 py-0.5 rounded-full text-xs"
                                  style={{ background: label.color + "22", color: label.color }}
                                >
                                  {label.name}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl opacity-20">⏳</span>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No notes yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
