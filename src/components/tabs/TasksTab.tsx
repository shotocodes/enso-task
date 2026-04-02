"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { type Locale, t, tFormat } from "@/lib/i18n";
import type { Task, Priority, Goal, Milestone } from "@/types";
import { PRIORITY_COLORS, PRIORITY_BG } from "@/types";
import { recordTaskToJournal } from "@/lib/storage";
import { TrashIcon, PenIcon, CheckCircleIcon, CircleIcon, ChecklistIcon, TargetIcon } from "@/components/Icons";

interface TasksTabProps {
  locale: Locale;
  tasks: Task[];
  milestones: Milestone[];
  goals: Goal[];
  onTasksChange: (tasks: Task[]) => void;
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TasksTab({ locale, tasks, milestones, goals, onTasksChange }: TasksTabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [collapsedGoals, setCollapsedGoals] = useState<Set<string>>(new Set());
  const [collapsedMilestones, setCollapsedMilestones] = useState<Set<string>>(new Set());

  const activeTasks = useMemo(() =>
    tasks.filter((t) => !t.completed).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [tasks]
  );
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);
  const completedCount = completedTasks.length;
  const totalCount = tasks.length;

  // --- グルーピング ---
  const grouped = useMemo(() => {
    type GoalGroup = {
      goal: Goal | null; // null = 未分類
      milestoneGroups: { milestone: Milestone | null; tasks: Task[] }[];
    };

    const goalMap = new Map<string, GoalGroup>();

    // 目標ありのタスクをグルーピング
    for (const task of activeTasks) {
      if (!task.goalId) continue;
      if (!goalMap.has(task.goalId)) {
        const goal = goals.find((g) => g.id === task.goalId) ?? null;
        goalMap.set(task.goalId, { goal, milestoneGroups: [] });
      }
      const group = goalMap.get(task.goalId)!;
      const msKey = task.milestoneId ?? "__none__";
      let msGroup = group.milestoneGroups.find((mg) =>
        task.milestoneId ? mg.milestone?.id === task.milestoneId : mg.milestone === null
      );
      if (!msGroup) {
        const ms = task.milestoneId ? milestones.find((m) => m.id === task.milestoneId) ?? null : null;
        msGroup = { milestone: ms, tasks: [] };
        group.milestoneGroups.push(msGroup);
      }
      msGroup.tasks.push(task);
    }

    // 未分類タスク
    const uncategorized = activeTasks.filter((t) => !t.goalId);

    // goalMapを配列化（目標の作成日順）
    const goalGroups = Array.from(goalMap.values()).sort((a, b) => {
      const aTime = a.goal?.createdAt ?? "";
      const bTime = b.goal?.createdAt ?? "";
      return aTime.localeCompare(bTime);
    });

    return { goalGroups, uncategorized };
  }, [activeTasks, goals, milestones]);

  const toggleGoal = (id: string) => {
    setCollapsedGoals((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleMilestone = (id: string) => {
    setCollapsedMilestones((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    const isCompleting = task && !task.completed;
    const next = tasks.map((t) =>
      t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined, updatedAt: new Date().toISOString() }
        : t
    );
    onTasksChange(next);
    if (isCompleting && task) recordTaskToJournal(task.title);
  };

  const handleAdd = (task: Task) => {
    const maxOrder = Math.max(0, ...activeTasks.map((t) => t.order ?? 0));
    onTasksChange([{ ...task, order: maxOrder + 1 }, ...tasks]);
    setShowAdd(false);
  };

  const handleEdit = (updated: Task) => {
    onTasksChange(tasks.map((t) => (t.id === updated.id ? updated : t)));
    setEditTask(null);
  };

  const handleMoveUp = (id: string) => {
    const idx = activeTasks.findIndex((t) => t.id === id);
    if (idx <= 0) return;
    const above = activeTasks[idx - 1];
    const current = activeTasks[idx];
    const next = tasks.map((t) => {
      if (t.id === current.id) return { ...t, order: above.order ?? 0 };
      if (t.id === above.id) return { ...t, order: current.order ?? 0 };
      return t;
    });
    onTasksChange(next);
  };

  const handleMoveDown = (id: string) => {
    const idx = activeTasks.findIndex((t) => t.id === id);
    if (idx < 0 || idx >= activeTasks.length - 1) return;
    const below = activeTasks[idx + 1];
    const current = activeTasks[idx];
    const next = tasks.map((t) => {
      if (t.id === current.id) return { ...t, order: below.order ?? 0 };
      if (t.id === below.id) return { ...t, order: current.order ?? 0 };
      return t;
    });
    onTasksChange(next);
  };

  const handleDelete = (id: string) => {
    onTasksChange(tasks.filter((t) => t.id !== id));
    setDeleteId(null);
  };

  const hasGroups = grouped.goalGroups.length > 0;

  return (
    <div className="animate-tab-enter space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("tasks.title", locale)}</h2>
        <button onClick={() => setShowAdd(true)} className="text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
          {t("tasks.add", locale)}
        </button>
      </div>

      {/* 進捗 */}
      {totalCount > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-subtle overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }} />
          </div>
          <span className="text-xs text-muted tabular-nums">{tFormat("tasks.count", locale, completedCount, totalCount)}</span>
        </div>
      )}

      {/* 目標別グルーピング */}
      {hasGroups && (
        <div className="space-y-4">
          {grouped.goalGroups.map((gg) => {
            const goalId = gg.goal?.id ?? "unknown";
            const isCollapsed = collapsedGoals.has(goalId);
            const taskCount = gg.milestoneGroups.reduce((sum, mg) => sum + mg.tasks.length, 0);

            return (
              <div key={goalId} className="space-y-2">
                {/* Goal ヘッダー */}
                <button onClick={() => toggleGoal(goalId)}
                  className="flex items-center gap-2 w-full text-left group">
                  <TargetIcon size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-bold flex-1 truncate">{gg.goal?.title ?? goalId}</span>
                  <span className="text-[10px] text-muted tabular-nums">{taskCount}</span>
                  <span className="text-[10px] text-muted">{isCollapsed ? "▼" : "▲"}</span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-3 pl-2 border-l-2 border-emerald-500/20">
                    {gg.milestoneGroups.map((mg) => {
                      const msId = mg.milestone?.id ?? "__none__";
                      const msCollapsed = collapsedMilestones.has(msId);

                      return (
                        <div key={msId} className="space-y-1.5">
                          {/* Milestone ヘッダー（nullの場合は「マイルストーンなし」） */}
                          <button onClick={() => toggleMilestone(msId)}
                            className="flex items-center gap-2 w-full text-left pl-2">
                            <span className="text-[10px] text-muted">{mg.milestone ? "◆" : "○"}</span>
                            <span className="text-xs font-medium text-muted flex-1 truncate">
                              {mg.milestone?.title ?? t("tasks.noMilestone", locale)}
                            </span>
                            <span className="text-[10px] text-muted tabular-nums">{mg.tasks.length}</span>
                            <span className="text-[10px] text-muted">{msCollapsed ? "▼" : "▲"}</span>
                          </button>

                          {!msCollapsed && (
                            <div className="space-y-1.5 pl-2">
                              {mg.tasks.map((task, idx) => (
                                <TaskCard key={task.id} task={task} locale={locale}
                                  onToggle={handleToggle} onEdit={setEditTask} onDelete={setDeleteId}
                                  onMoveUp={idx > 0 ? () => handleMoveUp(task.id) : undefined}
                                  onMoveDown={idx < mg.tasks.length - 1 ? () => handleMoveDown(task.id) : undefined} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 未分類タスク */}
      {grouped.uncategorized.length > 0 && (
        <div className="space-y-2">
          {hasGroups && (
            <p className="text-xs font-bold text-muted">{t("tasks.uncategorized", locale)}</p>
          )}
          {grouped.uncategorized.map((task, idx) => (
            <TaskCard key={task.id} task={task} locale={locale}
              onToggle={handleToggle} onEdit={setEditTask} onDelete={setDeleteId}
              onMoveUp={idx > 0 ? () => handleMoveUp(task.id) : undefined}
              onMoveDown={idx < grouped.uncategorized.length - 1 ? () => handleMoveDown(task.id) : undefined} />
          ))}
          {activeTasks.length > 5 && (
            <p className="text-center text-[10px] text-muted opacity-40">TOP 5 → ENSO FOCUS</p>
          )}
        </div>
      )}

      {/* 空状態 */}
      {activeTasks.length === 0 && completedTasks.length === 0 && (
        <div className="border-2 border-dashed border-card rounded-2xl p-8 text-center">
          <ChecklistIcon size={28} className="mx-auto text-muted opacity-40 mb-2" />
          <p className="text-sm text-muted">{t("tasks.empty", locale)}</p>
          <p className="text-xs text-muted mt-1 opacity-50">{t("tasks.emptyHint", locale)}</p>
        </div>
      )}

      {/* 完了済み */}
      {completedTasks.length > 0 && (
        <div>
          <button onClick={() => setShowCompleted(!showCompleted)}
            className="text-sm font-bold text-muted hover:text-emerald-500 transition-colors">
            {t("tasks.completed", locale)} ({completedTasks.length}) {showCompleted ? "▲" : "▼"}
          </button>
          {showCompleted && (
            <div className="space-y-2 mt-3 animate-fade-in">
              {completedTasks.sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? "")).map((task) => (
                <TaskCard key={task.id} task={task} locale={locale} onToggle={handleToggle} onEdit={setEditTask} onDelete={setDeleteId} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* タスク追加/編集モーダル */}
      {showAdd && <TaskModal locale={locale} goals={goals} milestones={milestones} onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editTask && <TaskModal locale={locale} goals={goals} milestones={milestones} initial={editTask} onSave={handleEdit} onClose={() => setEditTask(null)} />}

      {/* 削除確認 */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in" onClick={() => setDeleteId(null)}>
          <div className="w-full max-w-sm bg-modal rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-center">{t("modal.confirm", locale)}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm bg-subtle text-muted hover:opacity-80">{t("modal.cancel", locale)}</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl text-sm text-red-400 bg-subtle hover:opacity-80">{t("modal.delete", locale)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== タスクカード =====
function TaskCard({
  task, locale, onToggle, onEdit, onDelete, onMoveUp, onMoveDown,
}: {
  task: Task;
  locale: Locale;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div className={`bg-card border border-card rounded-xl p-3 flex items-center gap-2 ${task.completed ? "opacity-50" : ""}`}>
      {!task.completed && (
        <div className="flex flex-col shrink-0">
          <button onClick={onMoveUp} disabled={!onMoveUp}
            className={`text-[10px] leading-none p-0.5 ${onMoveUp ? "text-muted hover:text-emerald-500" : "text-transparent"} transition-colors`}>▲</button>
          <button onClick={onMoveDown} disabled={!onMoveDown}
            className={`text-[10px] leading-none p-0.5 ${onMoveDown ? "text-muted hover:text-emerald-500" : "text-transparent"} transition-colors`}>▼</button>
        </div>
      )}
      <button onClick={() => onToggle(task.id)} className="shrink-0 transition-colors">
        {task.completed ? <CheckCircleIcon size={22} className="text-emerald-500" /> : <CircleIcon size={22} className="text-muted hover:text-emerald-500" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.completed ? "line-through text-muted" : ""}`}>{task.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-medium ${PRIORITY_COLORS[task.priority]}`}>{t(`task.priority.${task.priority}`, locale)}</span>
          {task.dueDate && <span className="text-[10px] text-muted tabular-nums">{task.dueDate.slice(5)}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onEdit(task)} className="text-muted hover:text-emerald-500 transition-colors"><PenIcon size={14} /></button>
        <button onClick={() => onDelete(task.id)} className="text-muted hover:text-red-400 transition-colors"><TrashIcon size={14} /></button>
      </div>
    </div>
  );
}

// ===== タスク追加/編集モーダル =====
function TaskModal({
  locale, goals, milestones, initial, onSave, onClose,
}: {
  locale: Locale;
  goals: Goal[];
  milestones: Milestone[];
  initial?: Task;
  onSave: (task: Task) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [goalId, setGoalId] = useState<string>(initial?.goalId ?? "");
  const [milestoneId, setMilestoneId] = useState<string>(initial?.milestoneId ?? "");
  const [composing, setComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);

  const activeGoals = goals.filter((g) => !g.achievedAt);
  const goalMilestones = goalId ? milestones.filter((m) => m.goalId === goalId) : [];

  // goalが変更されたらmilestoneをリセット
  const handleGoalChange = (newGoalId: string) => {
    setGoalId(newGoalId);
    setMilestoneId("");
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      priority,
      dueDate: dueDate || undefined,
      goalId: goalId || undefined,
      milestoneId: milestoneId || undefined,
      completed: initial?.completed ?? false,
      completedAt: initial?.completedAt,
      order: initial?.order ?? Date.now(),
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    });
  };

  const priorities: Priority[] = ["high", "medium", "low"];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-sm bg-modal rounded-2xl p-5 space-y-3 overflow-hidden max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-center">{t(isEdit ? "task.edit.title" : "task.add.title", locale)}</h3>

        {/* タイトル */}
        <div>
          <label className="text-xs text-muted block mb-1">{t("task.title", locale)}</label>
          <input ref={inputRef} type="text" value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("task.title.placeholder", locale)}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
            onKeyDown={(e) => { if (e.key === "Enter" && !composing) handleSave(); }}
            className="w-full bg-input border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-muted"
            style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }} />
        </div>

        {/* 優先度 */}
        <div>
          <label className="text-xs text-muted block mb-1">{t("task.priority", locale)}</label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button key={p} onClick={() => setPriority(p)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                  priority === p ? PRIORITY_BG[p] + " " + PRIORITY_COLORS[p] : "bg-subtle text-muted border-transparent"}`}>
                {t(`task.priority.${p}`, locale)}
              </button>
            ))}
          </div>
        </div>

        {/* 目標 */}
        {activeGoals.length > 0 && (
          <div>
            <label className="text-xs text-muted block mb-1">{t("task.goal", locale)}</label>
            <select value={goalId} onChange={(e) => handleGoalChange(e.target.value)}
              className="w-full bg-input border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}>
              <option value="">{t("task.goal.none", locale)}</option>
              {activeGoals.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* マイルストーン */}
        {goalMilestones.length > 0 && (
          <div>
            <label className="text-xs text-muted block mb-1">{t("task.milestone", locale)}</label>
            <select value={milestoneId} onChange={(e) => setMilestoneId(e.target.value)}
              className="w-full bg-input border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
              style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}>
              <option value="">{t("task.milestone.none", locale)}</option>
              {goalMilestones.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* 期日 */}
        <div>
          <label className="text-xs text-muted block mb-1">{t("task.dueDate", locale)}</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-input border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
            style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }} />
        </div>

        {/* ボタン */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm bg-subtle text-muted hover:opacity-80">{t("modal.cancel", locale)}</button>
          <button onClick={handleSave} disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            {t(isEdit ? "task.update" : "task.save", locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
