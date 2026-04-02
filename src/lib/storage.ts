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
