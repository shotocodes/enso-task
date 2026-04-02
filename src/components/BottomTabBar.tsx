"use client";

import { type Locale, t } from "@/lib/i18n";
import { ChecklistIcon, TargetIcon, SettingsIcon, Bars3Icon } from "@/components/Icons";

export type TabId = "tasks" | "goals" | "settings" | "menu";

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  locale: Locale;
}

const TABS: { id: TabId; labelKey: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: "tasks",    labelKey: "tabs.tasks",    Icon: ChecklistIcon },
  { id: "goals",    labelKey: "tabs.goals",    Icon: TargetIcon },
  { id: "settings", labelKey: "tabs.settings", Icon: SettingsIcon },
  { id: "menu",     labelKey: "tabs.menu",     Icon: Bars3Icon },
];

export default function BottomTabBar({ activeTab, onTabChange, locale }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-tab-bar backdrop-blur-md border-t border-card z-40">
      <div className="max-w-lg mx-auto flex">
        {TABS.map(({ id, labelKey, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors min-h-[56px] ${
                active ? "text-emerald-500" : "text-muted"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium truncate max-w-[64px]">{t(labelKey, locale)}</span>
            </button>
          );
        })}
      </div>
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
