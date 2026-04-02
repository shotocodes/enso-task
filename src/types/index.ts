import type { Locale } from "@/lib/i18n";

export type { Locale };

export type ThemeMode = "dark" | "light" | "system";

export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;         // "YYYY-MM-DD"
  goalId?: string;          // TIMER目標とのリンク
  milestoneId?: string;
  completed: boolean;
  completedAt?: string;     // ISO 8601
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  dueDate: string;          // "YYYY-MM-DD"
  completed: boolean;
  completedAt?: string;
  order: number;
}

/** TIMERの目標（読み取り専用） */
export interface Goal {
  id: string;
  title: string;
  deadline: string;         // ISO 8601
  createdAt: string;
  achievedAt?: string;
  memo?: string;
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-emerald-400",
};

export const PRIORITY_BG: Record<Priority, string> = {
  high: "bg-red-400/10 border-red-400/20",
  medium: "bg-amber-400/10 border-amber-400/20",
  low: "bg-emerald-400/10 border-emerald-400/20",
};
