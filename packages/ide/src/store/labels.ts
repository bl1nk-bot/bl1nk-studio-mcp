export interface Label {
  id: string;
  name: string;
  color: string;
}

const LABELS_KEY = "ai-ide-labels";

const DEFAULT_LABELS: Label[] = [
  { id: "l-work",     name: "Work",     color: "#06b6d4" },
  { id: "l-personal", name: "Personal", color: "#8b5cf6" },
  { id: "l-ideas",    name: "Ideas",    color: "#f97316" },
  { id: "l-urgent",   name: "Urgent",   color: "#ef4444" },
  { id: "l-done",     name: "Done",     color: "#22c55e" },
];

function loadLabels(): Label[] {
  try {
    const raw = localStorage.getItem(LABELS_KEY);
    if (raw) return JSON.parse(raw) as Label[];
  } catch (err) {
    console.warn("[ai-ide] Failed to parse labels from storage.", err);
  }
  return DEFAULT_LABELS;
}

function saveLabels(labels: Label[]) {
  localStorage.setItem(LABELS_KEY, JSON.stringify(labels));
}

export const labelsStore = {
  load: loadLabels,
  save: saveLabels,
  create: (name: string, color: string): Label => ({
    id: `label-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name,
    color,
  }),
};

export const LABEL_PALETTE = [
  "#06b6d4", "#00e5ff", "#8b5cf6", "#ec4899",
  "#f97316", "#eab308", "#22c55e", "#ef4444",
  "#64748b", "#0ea5e9",
];
