"use client";

import { useState, useRef, useEffect } from "react";
import { type Locale, t, tFormat } from "@/lib/i18n";
import type { Task, Priority } from "@/types";
import { PRIORITY_COLORS, PRIORITY_BG } from "@/types";
import { recordTaskToJournal } from "@/lib/storage";
import { TrashIcon, PenIcon, CheckCircleIcon, CircleIcon, ChecklistIcon } from "@/components/Icons";

interface TasksTabProps {
  locale: Locale;
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TasksTab({ locale, tasks, onTasksChange }: TasksTabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const todayStr = getTodayStr();
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const todayTasks = activeTasks.filter((t) => !t.dueDate || t.dueDate <= todayStr);
  const futureTasks = activeTasks.filter((t) => t.dueDate && t.dueDate > todayStr);
  const completedCount = completedTasks.length;
  const totalCount = tasks.length;

  const handleToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    const isCompleting = task && !task.completed;

    const next = tasks.map((t) =>
      t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined, updatedAt: new Date().toISOString() }
        : t
    );
    onTasksChange(next);

    // タスク完了時 → JOURNALに自動記録
    if (isCompleting && task) {
      recordTaskToJournal(task.title);
    }
  };

  const handleAdd = (task: Task) => {
    onTasksChange([task, ...tasks]);
    setShowAdd(false);
  };

  const handleEdit = (updated: Task) => {
    onTasksChange(tasks.map((t) => (t.id === updated.id ? updated : t)));
    setEditTask(null);
  };

  const handleDelete = (id: string) => {
    onTasksChange(tasks.filter((t) => t.id !== id));
    setDeleteId(null);
  };

  const sortByPriority = (a: Task, b: Task) => {
    const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  };

  return (
    <div className="animate-tab-enter space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("tasks.title", locale)}</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          {t("tasks.add", locale)}
        </button>
      </div>

      {/* 進捗 */}
      {totalCount > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-muted tabular-nums">{tFormat("tasks.count", locale, completedCount, totalCount)}</span>
        </div>
      )}

      {/* 今日のタスク */}
      {todayTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-3">{t("tasks.today", locale)}</h3>
          <div className="space-y-2">
            {todayTasks.sort(sortByPriority).map((task) => (
              <TaskCard key={task.id} task={task} locale={locale} onToggle={handleToggle} onEdit={setEditTask} onDelete={setDeleteId} />
            ))}
          </div>
        </div>
      )}

      {/* 予定タスク */}
      {futureTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-3">{t("tasks.all", locale)}</h3>
          <div className="space-y-2">
            {futureTasks.sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? "")).map((task) => (
              <TaskCard key={task.id} task={task} locale={locale} onToggle={handleToggle} onEdit={setEditTask} onDelete={setDeleteId} />
            ))}
          </div>
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
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-sm font-bold text-muted hover:text-emerald-500 transition-colors"
          >
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

      {/* タスク追加モーダル */}
      {showAdd && <TaskModal locale={locale} onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editTask && <TaskModal locale={locale} initial={editTask} onSave={handleEdit} onClose={() => setEditTask(null)} />}

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
  task, locale, onToggle, onEdit, onDelete,
}: {
  task: Task;
  locale: Locale;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`bg-card border border-card rounded-xl p-3 flex items-center gap-3 ${task.completed ? "opacity-50" : ""}`}>
      <button onClick={() => onToggle(task.id)} className="shrink-0 transition-colors">
        {task.completed ? (
          <CheckCircleIcon size={22} className="text-emerald-500" />
        ) : (
          <CircleIcon size={22} className="text-muted hover:text-emerald-500" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.completed ? "line-through text-muted" : ""}`}>{task.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-medium ${PRIORITY_COLORS[task.priority]}`}>
            {t(`task.priority.${task.priority}`, locale)}
          </span>
          {task.dueDate && (
            <span className="text-[10px] text-muted tabular-nums">{task.dueDate.slice(5)}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onEdit(task)} className="text-muted hover:text-emerald-500 transition-colors">
          <PenIcon size={14} />
        </button>
        <button onClick={() => onDelete(task.id)} className="text-muted hover:text-red-400 transition-colors">
          <TrashIcon size={14} />
        </button>
      </div>
    </div>
  );
}

// ===== タスク追加/編集モーダル =====
function TaskModal({
  locale, initial, onSave, onClose,
}: {
  locale: Locale;
  initial?: Task;
  onSave: (task: Task) => void;
  onClose: () => void;
}) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [composing, setComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSave = () => {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      priority,
      dueDate: dueDate || undefined,
      completed: initial?.completed ?? false,
      completedAt: initial?.completedAt,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    });
  };

  const priorities: Priority[] = ["high", "medium", "low"];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-sm bg-modal rounded-2xl p-5 space-y-3 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-center">{t(isEdit ? "task.edit.title" : "task.add.title", locale)}</h3>

        {/* タイトル */}
        <div>
          <label className="text-xs text-muted block mb-1">{t("task.title", locale)}</label>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("task.title.placeholder", locale)}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
            onKeyDown={(e) => { if (e.key === "Enter" && !composing) handleSave(); }}
            className="w-full bg-input border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-muted"
            style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
          />
        </div>

        {/* 優先度 */}
        <div>
          <label className="text-xs text-muted block mb-1">{t("task.priority", locale)}</label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                  priority === p ? PRIORITY_BG[p] + " " + PRIORITY_COLORS[p] : "bg-subtle text-muted border-transparent"
                }`}
              >
                {t(`task.priority.${p}`, locale)}
              </button>
            ))}
          </div>
        </div>

        {/* 期日 */}
        <div>
          <label className="text-xs text-muted block mb-1">{t("task.dueDate", locale)}</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-input border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
            style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
          />
        </div>

        {/* ボタン */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm bg-subtle text-muted hover:opacity-80">{t("modal.cancel", locale)}</button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {t(isEdit ? "task.update" : "task.save", locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
