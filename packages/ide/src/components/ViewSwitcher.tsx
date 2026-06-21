import React from "react";
import { List, LayoutGrid, Table2, CalendarDays, GitBranch, Activity } from "lucide-react";
import { cn } from "../lib/utils";

export type ViewMode = "list" | "fleet" | "table" | "calendar" | "timeline" | "heatmap";

interface ViewSwitcherProps {
  active: ViewMode;
  onChange: (v: ViewMode) => void;
}

const VIEWS: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
  { mode: "list",     icon: <List size={13} />,         label: "List" },
  { mode: "fleet",    icon: <LayoutGrid size={13} />,    label: "Fleet" },
  { mode: "table",    icon: <Table2 size={13} />,        label: "Table" },
  { mode: "calendar", icon: <CalendarDays size={13} />,  label: "Calendar" },
  { mode: "timeline", icon: <GitBranch size={13} />,     label: "Timeline" },
  { mode: "heatmap",  icon: <Activity size={13} />,      label: "Heatmap" },
];

export function ViewSwitcher({ active, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-0.5 px-4 py-2 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
      {VIEWS.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all",
            active === mode
              ? "text-[var(--teal)] bg-[rgba(0,188,212,0.12)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(0,188,212,0.05)]"
          )}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
