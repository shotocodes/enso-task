"use client";

import { type Locale, LOCALES, t } from "@/lib/i18n";
import { exportData, importData } from "@/lib/storage";
import { useState, useRef } from "react";

interface SettingsTabProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  theme: "dark" | "light" | "system";
  onThemeChange: (theme: "dark" | "light" | "system") => void;
  onClearData: () => void;
}

const THEME_OPTIONS = ["dark", "light", "system"] as const;

export default function SettingsTab({ locale, onLocaleChange, theme, onThemeChange, onClearData }: SettingsTabProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enso-task-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const ok = importData(text);
      setImportMsg({ ok, text: t(ok ? "settings.importSuccess" : "settings.importFail", locale) });
      if (ok) setTimeout(() => window.location.reload(), 1000);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="animate-tab-enter space-y-5">
      <h2 className="text-lg font-bold mb-4">{t("settings.title", locale)}</h2>

      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-3">{t("settings.theme", locale)}</h3>
        <div className="flex gap-2">
          {THEME_OPTIONS.map((opt) => (
            <button key={opt} onClick={() => onThemeChange(opt)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${theme === opt ? "bg-emerald-500 text-white" : "bg-subtle text-muted hover:opacity-80"}`}>
              {t(`settings.theme.${opt}`, locale)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-3">{t("settings.language", locale)}</h3>
        <div className="grid grid-cols-2 gap-2">
          {LOCALES.map(({ code, label }) => (
            <button key={code} onClick={() => onLocaleChange(code)} className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${locale === code ? "bg-emerald-500 text-white" : "bg-subtle text-muted hover:opacity-80"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-card space-y-3">
        <h3 className="text-sm font-bold mb-3">{t("settings.data", locale)}</h3>
        <button onClick={handleExport} className="w-full py-2.5 rounded-xl text-sm bg-subtle text-muted hover:opacity-80 transition-opacity">{t("settings.export", locale)}</button>
        <button onClick={() => fileRef.current?.click()} className="w-full py-2.5 rounded-xl text-sm bg-subtle text-muted hover:opacity-80 transition-opacity">{t("settings.import", locale)}</button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        {importMsg && <p className={`text-xs text-center ${importMsg.ok ? "text-emerald-500" : "text-red-400"}`}>{importMsg.text}</p>}
        <button onClick={() => setShowClearConfirm(true)} className="w-full py-2.5 rounded-xl text-sm text-red-400 bg-subtle hover:opacity-80 transition-opacity">{t("settings.clear", locale)}</button>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowClearConfirm(false)}>
          <div className="w-full max-w-sm bg-modal rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-center">{t("settings.clearConfirm", locale)}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm bg-subtle text-muted hover:opacity-80">{t("modal.cancel", locale)}</button>
              <button onClick={() => { onClearData(); setShowClearConfirm(false); }} className="flex-1 py-2.5 rounded-xl text-sm text-red-400 bg-subtle hover:opacity-80">{t("modal.delete", locale)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
