import type { Task, Milestone } from "@/types";

const PREFIX = "enso-task-";

export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      console.error("[enso-task] storage.set failed:", key);
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PREFIX + key);
  },

  clearAll(): void {
    if (typeof window === "undefined") return;
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
    keys.forEach((k) => localStorage.removeItem(k));
  },
};

export const STORAGE_KEYS = {
  TASKS:      "tasks",
  MILESTONES: "milestones",
  THEME:      "theme",
  LOCALE:     "locale",
} as const;

// ===== JOURNAL連携（タスク完了→日記に自動記録） =====

interface JournalEntry {
  date: string;
  mood?: number;
  comment?: string;
  notes: string[];
  aiSummary?: string;
  manualEntries: { id: string; time: string; text: string; icon: string }[];
  createdAt: string;
  updatedAt: string;
}

const JOURNAL_KEY = "enso-journal-entries";

/** タスク完了をJOURNALに記録する */
export function recordTaskToJournal(taskTitle: string): void {
  if (typeof window === "undefined") return;
  try {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const raw = localStorage.getItem(JOURNAL_KEY);
    const entries: JournalEntry[] = raw ? JSON.parse(raw) : [];

    let todayEntry = entries.find((e) => e.date === todayStr);
    if (todayEntry) {
      // 既存の今日のエントリーに追加
      todayEntry.manualEntries.push({
        id: Date.now().toString(),
        time: timeStr,
        text: taskTitle,
        icon: "done",
      });
      todayEntry.updatedAt = now.toISOString();
    } else {
      // 今日のエントリーを新規作成
      todayEntry = {
        date: todayStr,
        notes: [],
        manualEntries: [{
          id: Date.now().toString(),
          time: timeStr,
          text: taskTitle,
          icon: "done",
        }],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      entries.unshift(todayEntry);
    }

    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("[enso-task] Failed to record to journal:", e);
  }
}

// ===== データエクスポート/インポート =====

export function exportData(): string {
  const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) ?? [];
  const milestones = storage.get<Milestone[]>(STORAGE_KEYS.MILESTONES) ?? [];
  return JSON.stringify({
    version: "1.0.0",
    app: "enso-task",
    exportedAt: new Date().toISOString(),
    tasks,
    milestones,
  }, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (!data || !Array.isArray(data.tasks)) return false;
    storage.set(STORAGE_KEYS.TASKS, data.tasks);
    if (Array.isArray(data.milestones)) {
      storage.set(STORAGE_KEYS.MILESTONES, data.milestones);
    }
    return true;
  } catch {
    return false;
  }
}
