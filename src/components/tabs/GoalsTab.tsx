"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { type Locale, t, tFormat } from "@/lib/i18n";
import type { Goal, Milestone } from "@/types";
import { TargetIcon, CheckCircleIcon, CircleIcon, PlusIcon } from "@/components/Icons";

interface GoalsTabProps {
  locale: Locale;
  milestones: Milestone[];
  onMilestonesChange: (milestones: Milestone[]) => void;
}

export default function GoalsTab({ locale, milestones, onMilestonesChange }: GoalsTabProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [addingMilestoneGoalId, setAddingMilestoneGoalId] = useState<string | null>(null);

  // TIMERの目標を読み取り（enso-goalsキー、プレフィックスなし）
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("enso-goals");
      if (raw) {
        const parsed = JSON.parse(raw) as Goal[];
        // アクティブ（未達成）の目標のみ
        setGoals(parsed.filter((g) => !g.achievedAt));
      }
    } catch { /* empty */ }
  }, []);

  const getDaysRemaining = (deadline: string): number => {
    const now = new Date();
    const end = new Date(deadline);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleToggleMilestone = (id: string) => {
    const next = milestones.map((m) =>
      m.id === id
        ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
        : m
    );
    onMilestonesChange(next);
  };

  const handleAddMilestone = (goalId: string, title: string, dueDate: string) => {
    const goalMilestones = milestones.filter((m) => m.goalId === goalId);
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      goalId,
      title,
      dueDate,
      completed: false,
      order: goalMilestones.length,
    };
    onMilestonesChange([...milestones, newMilestone]);
    setAddingMilestoneGoalId(null);
  };

  return (
    <div className="animate-tab-enter space-y-5">
      <h2 className="text-lg font-bold">{t("goals.title", locale)}</h2>

      {goals.length === 0 ? (
        <div className="border-2 border-dashed border-card rounded-2xl p-8 text-center">
          <TargetIcon size={28} className="mx-auto text-muted opacity-40 mb-2" />
          <p className="text-sm text-muted">{t("goals.noGoals", locale)}</p>
          <p className="text-xs text-muted mt-1 opacity-50">{t("goals.noGoalsHint", locale)}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const days = getDaysRemaining(goal.deadline);
            const isOverdue = days < 0;
            const goalMilestones = milestones.filter((m) => m.goalId === goal.id).sort((a, b) => a.order - b.order);
            const completedMs = goalMilestones.filter((m) => m.completed).length;
            const isExpanded = expandedGoalId === goal.id;

            return (
              <div key={goal.id} className="bg-card border border-card rounded-2xl p-4 space-y-3">
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                >
                  <TargetIcon size={22} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{goal.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${isOverdue ? "text-red-400" : "text-muted"}`}>
                        {isOverdue ? t("goals.overdue", locale) : tFormat("goals.remaining", locale, days)}
                      </span>
                      {goalMilestones.length > 0 && (
                        <span className="text-xs text-emerald-500">{completedMs}/{goalMilestones.length}</span>
                      )}
                    </div>
                    {/* 進捗バー */}
                    {goalMilestones.length > 0 && (
                      <div className="mt-2 h-1.5 rounded-full bg-subtle overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${(completedMs / goalMilestones.length) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* マイルストーン（展開時） */}
                {isExpanded && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-muted">{t("goals.milestones", locale)}</h4>
                      <button
                        onClick={() => setAddingMilestoneGoalId(goal.id)}
                        className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                      >
                        {t("goals.addMilestone", locale)}
                      </button>
                    </div>

                    {goalMilestones.map((ms) => (
                      <div key={ms.id} className="flex items-center gap-3 pl-1">
                        <button onClick={() => handleToggleMilestone(ms.id)} className="shrink-0">
                          {ms.completed ? (
                            <CheckCircleIcon size={18} className="text-emerald-500" />
                          ) : (
                            <CircleIcon size={18} className="text-muted hover:text-emerald-500" />
                          )}
                        </button>
                        <p className={`text-sm flex-1 ${ms.completed ? "line-through text-muted" : ""}`}>{ms.title}</p>
                        <span className="text-[10px] text-muted tabular-nums">{ms.dueDate.slice(5)}</span>
                      </div>
                    ))}

                    {/* マイルストーン追加（インライン） */}
                    {addingMilestoneGoalId === goal.id && (
                      <AddMilestoneInline
                        locale={locale}
                        goalDeadline={goal.deadline}
                        onAdd={(title, dueDate) => handleAddMilestone(goal.id, title, dueDate)}
                        onCancel={() => setAddingMilestoneGoalId(null)}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-[10px] text-muted opacity-40">{t("goals.fromTimer", locale)}</p>
    </div>
  );
}

// ===== マイルストーン追加（インライン） =====
function AddMilestoneInline({
  locale, goalDeadline, onAdd, onCancel,
}: {
  locale: Locale;
  goalDeadline: string;
  onAdd: (title: string, dueDate: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [composing, setComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSave = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), dueDate || goalDeadline.slice(0, 10));
  };

  return (
    <div className="bg-subtle rounded-xl p-3 space-y-2">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("goals.milestone.placeholder", locale)}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={() => setComposing(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !composing) handleSave();
          if (e.key === "Escape") onCancel();
        }}
        className="w-full bg-transparent text-sm py-1 border-b border-card focus:border-emerald-500/50 focus:outline-none placeholder:text-muted"
        style={{ color: "var(--text)" }}
      />
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 bg-transparent text-xs py-1 text-muted focus:outline-none appearance-none"
          style={{ color: "var(--muted)" }}
        />
        <button onClick={onCancel} className="text-xs text-muted hover:opacity-80">{t("modal.cancel", locale)}</button>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="text-xs text-emerald-500 font-medium disabled:opacity-30"
        >
          {t("task.save", locale)}
        </button>
      </div>
    </div>
  );
}
