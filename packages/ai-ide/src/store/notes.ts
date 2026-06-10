export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  emoji?: string;
  labelIds?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
  noteId?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
}

const DEMO_NOTES: Note[] = [
  {
    id: "welcome",
    title: "Welcome",
    emoji: "👋",
    content: `# Welcome to AI IDE\n\nA lightweight Obsidian-style editor built for speed and clarity.\n\n## Features\n\n- **Markdown editing** with live preview\n- **Task tracking** across all notes\n- **Canvas** for visual thinking\n- Dark teal metallic theme\n- Tauri-ready for desktop\n\n## Getting Started\n\nClick any file in the sidebar to open it. Use **Cmd+P** to search.\n\n> "Simplicity is the ultimate sophistication." — Leonardo da Vinci\n`,
    tags: ["meta"],
    labelIds: ["l-work"],
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "tasks",
    title: "Tasks",
    emoji: "📌",
    content: `# My Tasks\n\n## Today\n\n- [x] Set up AI IDE project\n- [x] Configure dark teal theme\n- [ ] Write first note\n- [ ] Connect to Craft workspace\n\n## This Week\n\n- [ ] Build canvas view\n- [ ] Add file sync\n- [ ] Implement search\n- [ ] Export to PDF\n\n## Backlog\n\n- [ ] Mobile companion app\n- [ ] Plugin system\n`,
    tags: ["tasks"],
    labelIds: ["l-urgent"],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
  },
  {
    id: "ideas",
    title: "Ideas",
    emoji: "💡",
    content: `# Ideas & Brainstorm\n\n## Product Ideas\n\n1. **Local-first sync** — store notes as plain .md files\n2. **AI summaries** — one-click summarize any note\n3. **Graph view** — see connections between notes\n4. **Templates** — quick-start for daily notes, meetings, etc.\n\n## Design Notes\n\n- Teal metallic palette feels premium\n- iOS blur gives depth without weight\n- Monospace editor font aids readability\n\n## Resources\n\n- [Tauri docs](https://tauri.app)\n- [Marked.js](https://marked.js.org)\n- [Tailwind v4](https://tailwindcss.com)\n`,
    tags: ["ideas", "design"],
    labelIds: ["l-ideas"],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "daily",
    title: "Daily Log",
    emoji: "📅",
    content: `# Daily Log\n\n## ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\n\n### Morning\n\n- [ ] Review tasks for the day\n- [ ] Check messages\n\n### Focus Blocks\n\n**Block 1** (9-11am): Deep work on AI IDE\n\n**Block 2** (2-4pm): Review and planning\n\n### Notes\n\n_Write your reflections here..._\n\n### End of Day\n\n- [ ] Update task list\n- [ ] Plan tomorrow\n`,
    tags: ["daily"],
    labelIds: ["l-personal"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const STORAGE_KEY = "ai-ide-notes";
const TASKS_KEY = "ai-ide-tasks";

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Note[];
  } catch (err) {
    console.warn("[ai-ide] Failed to parse notes from storage — resetting to demo data.", err);
  }
  return DEMO_NOTES;
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) return JSON.parse(raw) as Task[];
  } catch (err) {
    console.warn("[ai-ide] Failed to parse tasks from storage — resetting to empty list.", err);
  }
  return [];
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function extractTasksFromNotes(notes: Note[]): Task[] {
  const tasks: Task[] = [];
  for (const note of notes) {
    const lines = note.content.split("\n");
    for (const line of lines) {
      const match = line.match(/^- \[(x| )\] (.+)/);
      if (match) {
        tasks.push({
          id: `${note.id}-${tasks.length}`,
          text: match[2].trim(),
          done: match[1] === "x",
          noteId: note.id,
          priority: "medium",
        });
      }
    }
  }
  return tasks;
}

export const notesStore = {
  load: loadNotes,
  save: saveNotes,
  create: (title: string): Note => ({
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    content: `# ${title}\n\n`,
    tags: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }),
  tasksLoad: loadTasks,
  tasksSave: saveTasks,
};
