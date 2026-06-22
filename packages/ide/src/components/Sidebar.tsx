import React, { useState } from "react";
import {
  FileText, CheckSquare, Layout, Search, Plus, Settings,
  ChevronDown, ChevronRight, Hash, Folder, LayoutGrid, Trash2, Tag,
} from "lucide-react";
import { Note } from "../store/notes";
import { Label, labelsStore, LABEL_PALETTE } from "../store/labels";
import { cn } from "../lib/utils";

type Panel = "files" | "tasks" | "canvas" | "search" | "views";

interface SidebarProps {
  notes: Note[];
  labels: Label[];
  activeNoteId: string | null;
  activePanel: Panel;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onPanelChange: (p: Panel) => void;
  onLabelsChange: (labels: Label[]) => void;
}

export function Sidebar({
  notes, labels, activeNoteId, activePanel,
  onSelectNote, onNewNote, onPanelChange, onLabelsChange,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [search, setSearch] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(LABEL_PALETTE[0]);

  const filtered = notes.filter(n =>
    search === "" ||
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  function addLabel() {
    if (!newLabelName.trim()) return;
    const label = labelsStore.create(newLabelName.trim(), newLabelColor);
    const next = [...labels, label];
    labelsStore.save(next);
    onLabelsChange(next);
    setNewLabelName("");
  }

  function removeLabel(id: string) {
    const next = labels.filter(l => l.id !== id);
    labelsStore.save(next);
    onLabelsChange(next);
  }

  const navItems: { icon: React.ReactNode; panel: Panel; label: string }[] = [
    { icon: <FileText size={16} />,   panel: "files",  label: "Files" },
    { icon: <CheckSquare size={16} />, panel: "tasks",  label: "Tasks" },
    { icon: <Layout size={16} />,      panel: "canvas", label: "Canvas" },
    { icon: <LayoutGrid size={16} />,  panel: "views",  label: "Views" },
    { icon: <Search size={16} />,      panel: "search", label: "Search" },
  ];

  return (
    <div className="flex h-full">
      <div
        className="flex flex-col items-center gap-1 py-3 px-1.5 border-r"
        style={{ width: 44, background: "rgba(5, 13, 13, 0.95)", borderColor: "var(--border)" }}
      >
        <div
          className="mb-3 flex items-center justify-center w-7 h-7 rounded-lg teal-glow"
          style={{ background: "linear-gradient(135deg, #00bcd4, #006e7a)" }}
        >
          <span className="text-xs font-black text-white">AI</span>
        </div>
        {navItems.map(({ icon, panel, label }) => (
          <button
            key={panel}
            title={label}
            onClick={() => onPanelChange(panel)}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150",
              activePanel === panel
                ? "text-[var(--teal)] bg-[rgba(0,188,212,0.12)]"
                : "text-[var(--text-secondary)] hover:text-[var(--teal)] hover:bg-[rgba(0,188,212,0.06)]"
            )}
          >
            {icon}
          </button>
        ))}
        <div className="flex-1" />
        <button className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:text-[var(--teal)] hover:bg-[rgba(0,188,212,0.06)] transition-all">
          <Settings size={16} />
        </button>
      </div>

      {activePanel === "files" && (
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ background: "var(--bg-surface)" }}>
          <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Notes</span>
            <button
              onClick={onNewNote}
              className="flex items-center justify-center w-5 h-5 rounded transition-all hover:text-[var(--teal)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="px-2 py-2 border-b" style={{ borderColor: "var(--border)" }}>
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-md"
              style={{ background: "rgba(0, 188, 212, 0.05)", border: "1px solid var(--border)" }}
            >
              <Search size={11} style={{ color: "var(--text-muted)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 w-full px-3 py-1 text-left transition-all"
              style={{ color: "var(--text-muted)" }}
            >
              {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              <Folder size={11} />
              <span className="text-xs tracking-wide">Vault</span>
            </button>

            {expanded && filtered.map(note => (
              <button
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={cn(
                  "flex items-center gap-2 w-full px-4 py-1.5 text-left transition-all duration-100 group",
                  activeNoteId === note.id
                    ? "text-[var(--teal)] bg-[rgba(0,188,212,0.1)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(0,188,212,0.04)]"
                )}
              >
                <span className="text-sm shrink-0">{note.emoji ?? "📝"}</span>
                <span className="text-xs truncate">{note.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activePanel === "views" && (
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ background: "var(--bg-surface)" }}>
          <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Views</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-3 pt-3 pb-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={11} style={{ color: "var(--teal)" }} />
                <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--teal)" }}>Labels</span>
              </div>

              <div className="flex flex-col gap-1 mb-3">
                {labels.map(label => (
                  <div
                    key={label.id}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg group"
                    style={{ background: "rgba(0,0,0,0.15)" }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: label.color }} />
                    <span className="text-xs flex-1 truncate" style={{ color: "var(--text-secondary)" }}>{label.name}</span>
                    <button
                      onClick={() => removeLabel(label.id)}
                      className="opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>

              <div
                className="flex flex-col gap-2 p-2 rounded-lg"
                style={{ background: "rgba(0,188,212,0.04)", border: "1px solid var(--border)" }}
              >
                <input
                  value={newLabelName}
                  onChange={e => setNewLabelName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addLabel()}
                  placeholder="New label name…"
                  className="bg-transparent text-xs outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
                <div className="flex gap-1 flex-wrap">
                  {LABEL_PALETTE.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewLabelColor(color)}
                      className="w-4 h-4 rounded-full transition-all"
                      style={{
                        background: color,
                        outline: newLabelColor === color ? `2px solid ${color}` : "none",
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={addLabel}
                  disabled={!newLabelName.trim()}
                  className="flex items-center justify-center gap-1 py-1 rounded-md text-xs transition-all"
                  style={{
                    background: newLabelName.trim() ? "rgba(0,188,212,0.15)" : "transparent",
                    color: newLabelName.trim() ? "var(--teal)" : "var(--text-muted)",
                  }}
                >
                  <Plus size={11} /> Add label
                </button>
              </div>
            </div>

            <div className="px-3 pt-3 pb-2 border-t mt-2" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {notes.length} note{notes.length !== 1 ? "s" : ""} in vault
              </p>
            </div>
          </div>
        </div>
      )}

      {activePanel === "search" && (
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ background: "var(--bg-surface)" }}>
          <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Search</span>
          </div>
          <div className="px-3 py-3">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search all notes..."
              autoFocus
              className="w-full bg-transparent text-sm outline-none px-3 py-2 rounded-lg"
              style={{
                color: "var(--text-primary)",
                background: "rgba(0, 188, 212, 0.05)",
                border: "1px solid var(--border-strong)",
              }}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            {filtered.map(note => (
              <button
                key={note.id}
                onClick={() => { onSelectNote(note.id); onPanelChange("files"); }}
                className="flex items-start gap-2 w-full px-3 py-2 rounded-lg mb-1 text-left hover:bg-[rgba(0,188,212,0.06)] transition-all"
              >
                <span className="text-base shrink-0">{note.emoji ?? "📝"}</span>
                <div className="min-w-0">
                  <span className="text-xs font-medium block truncate" style={{ color: "var(--teal)" }}>{note.title}</span>
                  <span className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>
                    {note.content.replace(/^#+ .+$/gm, "").trim().slice(0, 80)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {(activePanel === "tasks" || activePanel === "canvas") && (
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ background: "var(--bg-surface)" }}>
          <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
              {activePanel === "tasks" ? "Tasks" : "Canvas"}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Opens in main panel →</p>
          </div>
        </div>
      )}
    </div>
  );
}
