import React, { useMemo } from "react";
import { Note } from "../../store/notes";

const DAYS_LABEL = ["", "Mo", "", "We", "", "Fr", ""];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function daysSince(ts: number, ref: Date): number {
  const d = new Date(ts);
  const refMidnight = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const dMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.floor((refMidnight.getTime() - dMidnight.getTime()) / 86400000);
}

function cellColor(count: number): string {
  if (count === 0) return "rgba(0,188,212,0.06)";
  if (count === 1) return "rgba(0,188,212,0.25)";
  if (count === 2) return "rgba(0,188,212,0.50)";
  if (count === 3) return "rgba(0,188,212,0.75)";
  return "rgba(0,229,255,0.95)";
}

interface HeatmapViewProps {
  notes: Note[];
}

export function HeatmapView({ notes }: HeatmapViewProps) {
  const today = useMemo(() => new Date(), []);
  const WEEKS = 52;
  const TOTAL_DAYS = WEEKS * 7;

  const countByDayOffset = useMemo(() => {
    const map = new Map<number, number>();
    for (const note of notes) {
      const offset = daysSince(note.updatedAt, today);
      if (offset >= 0 && offset < TOTAL_DAYS) {
        map.set(offset, (map.get(offset) ?? 0) + 1);
      }
    }
    return map;
  }, [notes, today]);

  const totalActive = useMemo(() => {
    let count = 0;
    for (const v of countByDayOffset.values()) if (v > 0) count++;
    return count;
  }, [countByDayOffset]);

  const longestStreak = useMemo(() => {
    let max = 0, cur = 0;
    for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
      if ((countByDayOffset.get(i) ?? 0) > 0) { cur++; max = Math.max(max, cur); }
      else cur = 0;
    }
    return max;
  }, [countByDayOffset]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < TOTAL_DAYS; i++) {
      if ((countByDayOffset.get(i) ?? 0) > 0) streak++;
      else break;
    }
    return streak;
  }, [countByDayOffset]);

  const totalEdits = useMemo(() => {
    let sum = 0;
    for (const v of countByDayOffset.values()) sum += v;
    return sum;
  }, [countByDayOffset]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < WEEKS; w++) {
      const dayOffset = (WEEKS - 1 - w) * 7;
      const d = new Date(today);
      d.setDate(d.getDate() - dayOffset);
      const m = d.getMonth();
      if (m !== lastMonth) {
        labels.push({ label: MONTHS_SHORT[m], col: w });
        lastMonth = m;
      }
    }
    return labels;
  }, [today]);

  const cells = useMemo(() => {
    const result: { offset: number; count: number; date: string }[] = [];
    for (let w = 0; w < WEEKS; w++) {
      for (let dow = 0; dow < 7; dow++) {
        const offset = (WEEKS - 1 - w) * 7 + (6 - dow);
        const d = new Date(today);
        d.setDate(d.getDate() - offset);
        result.push({
          offset,
          count: countByDayOffset.get(offset) ?? 0,
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        });
      }
    }
    return result;
  }, [countByDayOffset, today]);

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Activity Heatmap</h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Last 52 weeks</p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total edits",    value: totalEdits },
            { label: "Active days",    value: totalActive },
            { label: "Longest streak", value: `${longestStreak}d` },
            { label: "Current streak", value: `${currentStreak}d` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center p-3 rounded-xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <span className="text-xl font-bold teal-text-glow" style={{ color: "var(--teal)" }}>{value}</span>
              <span className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>

        <div
          className="p-5 rounded-xl overflow-x-auto"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: `20px repeat(${WEEKS}, 13px)`, gap: 2, minWidth: WEEKS * 15 + 20 }}>
            <div />
            {monthLabels.map(({ label, col }) => (
              <div
                key={`${label}-${col}`}
                className="text-xs"
                style={{
                  gridColumn: col + 2,
                  gridRow: 1,
                  color: "var(--text-muted)",
                  fontSize: 10,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </div>
            ))}

            {DAYS_LABEL.map((d, i) => (
              <div
                key={i}
                style={{
                  gridColumn: 1,
                  gridRow: i + 2,
                  color: "var(--text-muted)",
                  fontSize: 9,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {d}
              </div>
            ))}

            {cells.map(({ offset, count, date }) => {
              const week = Math.floor(offset / 7);
              const dow = offset % 7;
              const col = WEEKS - week;
              const row = 6 - dow + 2;
              return (
                <div
                  key={offset}
                  title={`${date}: ${count} edit${count !== 1 ? "s" : ""}`}
                  style={{
                    gridColumn: col + 1,
                    gridRow: row,
                    width: 11,
                    height: 11,
                    borderRadius: 2,
                    background: cellColor(count),
                    transition: "background 0.15s",
                    cursor: count > 0 ? "pointer" : "default",
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Less</span>
            {[0, 1, 2, 3, 4].map(n => (
              <div
                key={n}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ background: cellColor(n) }}
              />
            ))}
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
