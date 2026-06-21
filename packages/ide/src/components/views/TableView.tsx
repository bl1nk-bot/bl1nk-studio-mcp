import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Note } from "../../store/notes";
import { Label } from "../../store/labels";

type SortKey = "title" | "updatedAt" | "createdAt";
type SortDir = "asc" | "desc";

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

interface TableViewProps {
  notes: Note[];
  labels: Label[];
  onSelect: (id: string) => void;
  onLabelToggle: (noteId: string, labelId: string) => void;
}

export function TableView({ notes, labels, onSelect, onLabelToggle }: TableViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = [...notes].sort((a, b) => {
    const v = sortKey === "title" ? a.title.localeCompare(b.title) : a[sortKey] - b[sortKey];
    return sortDir === "asc" ? v : -v;
  });

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown size={10} style={{ opacity: 0.3 }} />;
    return sortDir === "asc"
      ? <ChevronUp size={10} style={{ color: "var(--teal)" }} />
      : <ChevronDown size={10} style={{ color: "var(--teal)" }} />;
  }

  return (
    <div className="flex-1 overflow-auto" style={{ background: "var(--bg-base)" }}>
      <table className="w-full text-xs border-collapse" style={{ minWidth: 640 }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg-surface)" }}>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th className="px-4 py-2.5" style={{ width: 40 }}></th>
            <th className="text-left px-4 py-2.5">
              <button
                className="flex items-center gap-1 font-semibold tracking-wider uppercase"
                style={{ color: "var(--text-muted)" }}
                onClick={() => toggleSort("title")}
              >
                Title <SortIcon k="title" />
              </button>
            </th>
            <th className="text-left px-4 py-2.5 font-semibold tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
              Labels
            </th>
            <th className="text-left px-4 py-2.5 font-semibold tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
              Tags
            </th>
            <th className="text-right px-4 py-2.5">
              <button
                className="flex items-center gap-1 ml-auto font-semibold tracking-wider uppercase"
                style={{ color: "var(--text-muted)" }}
                onClick={() => toggleSort("updatedAt")}
              >
                Updated <SortIcon k="updatedAt" />
              </button>
            </th>
            <th className="text-right px-4 py-2.5">
              <button
                className="flex items-center gap-1 ml-auto font-semibold tracking-wider uppercase"
                style={{ color: "var(--text-muted)" }}
                onClick={() => toggleSort("createdAt")}
              >
                Created <SortIcon k="createdAt" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(note => (
            <tr
              key={note.id}
              className="transition-all hover:bg-[rgba(0,188,212,0.04)]"
              style={{ borderBottom: "1px solid rgba(0,188,212,0.06)" }}
            >
              <td className="px-4 py-2 text-center text-base">{note.emoji ?? "📝"}</td>
              <td
                className="px-4 py-2 cursor-pointer font-medium"
                style={{ color: "var(--text-primary)" }}
                onClick={() => onSelect(note.id)}
              >
                {note.title}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-1 flex-wrap">
                  {labels.map(label => {
                    const active = (note.labelIds ?? []).includes(label.id);
                    return (
                      <button
                        key={label.id}
                        onClick={() => onLabelToggle(note.id, label.id)}
                        className="px-1.5 py-0.5 rounded-full text-xs transition-all"
                        style={{
                          background: active ? label.color + "33" : "transparent",
                          color: active ? label.color : "var(--text-muted)",
                          border: `1px solid ${active ? label.color + "66" : "var(--border)"}`,
                        }}
                      >
                        {label.name}
                      </button>
                    );
                  })}
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-1 flex-wrap">
                  {note.tags.map(t => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded-md"
                      style={{ background: "rgba(0,188,212,0.08)", color: "var(--teal)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2 text-right whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{relTime(note.updatedAt)}</td>
              <td className="px-4 py-2 text-right whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{relTime(note.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
