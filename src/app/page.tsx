"use client";

import { useState, useEffect, useCallback } from "react";
import { type Locale, t } from "@/lib/i18n";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import type { Task, Milestone, Goal, ThemeMode } from "@/types";

import BottomTabBar, { type TabId } from "@/components/BottomTabBar";
import TasksTab from "@/components/tabs/TasksTab";
import GoalsTab from "@/components/tabs/GoalsTab";
import SettingsTab from "@/components/tabs/SettingsTab";
import MenuTab from "@/components/tabs/MenuTab";

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolved = theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    : theme;
  document.documentElement.setAttribute("data-theme", resolved);
}

function loadGoals(): Goal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("enso-goals");
    if (!raw) return [];
    return JSON.parse(raw) as Goal[];
  } catch { return []; }
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("tasks");
  const [locale, setLocale] = useState<Locale>("ja");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const savedLocale = storage.get<Locale>(STORAGE_KEYS.LOCALE);
    const savedTheme = storage.get<ThemeMode>(STORAGE_KEYS.THEME);
    const savedTasks = storage.get<Task[]>(STORAGE_KEYS.TASKS);
    const savedMilestones = storage.get<Milestone[]>(STORAGE_KEYS.MILESTONES);
    if (savedLocale) setLocale(savedLocale);
    if (savedTheme) setTheme(savedTheme);
    if (savedTasks) setTasks(savedTasks);
    if (savedMilestones) setMilestones(savedMilestones);
    setGoals(loadGoals());
  }, []);

  // タブ切替時にGoalsをリフレッシュ
  useEffect(() => {
    setGoals(loadGoals());
  }, [activeTab]);

  useEffect(() => {
    applyTheme(theme);
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const handleLocaleChange = useCallback((l: Locale) => {
    setLocale(l);
    storage.set(STORAGE_KEYS.LOCALE, l);
  }, []);

  const handleThemeChange = useCallback((t: ThemeMode) => {
    setTheme(t);
    storage.set(STORAGE_KEYS.THEME, t);
  }, []);

  const handleTasksChange = useCallback((next: Task[]) => {
    setTasks(next);
    storage.set(STORAGE_KEYS.TASKS, next);
  }, []);

  const handleTaskAdd = useCallback((task: Task) => {
    setTasks((prev) => {
      const next = [task, ...prev];
      storage.set(STORAGE_KEYS.TASKS, next);
      return next;
    });
  }, []);

  const handleMilestonesChange = useCallback((next: Milestone[]) => {
    setMilestones(next);
    storage.set(STORAGE_KEYS.MILESTONES, next);
  }, []);

  const handleClearData = useCallback(() => {
    storage.clearAll();
    window.location.reload();
  }, []);

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-24">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("app.name", locale)}</h1>
        <p className="text-xs text-muted mt-0.5">{t("app.tagline", locale)}</p>
      </div>

      <div key={`${activeTab}-${locale}`}>
        {activeTab === "tasks" && (
          <TasksTab locale={locale} tasks={tasks} milestones={milestones} goals={goals} onTasksChange={handleTasksChange} />
        )}
        {activeTab === "goals" && (
          <GoalsTab locale={locale} milestones={milestones} onMilestonesChange={handleMilestonesChange}
            tasks={tasks} onTaskAdd={handleTaskAdd} />
        )}
        {activeTab === "settings" && (
          <SettingsTab locale={locale} onLocaleChange={handleLocaleChange} theme={theme} onThemeChange={handleThemeChange} onClearData={handleClearData} />
        )}
        {activeTab === "menu" && <MenuTab locale={locale} />}
      </div>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} locale={locale} />
    </main>
  );
}
