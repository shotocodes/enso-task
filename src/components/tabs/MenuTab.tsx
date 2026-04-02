"use client";

import { type Locale, t } from "@/lib/i18n";
import EnsoLogo from "@/components/EnsoLogo";

export default function MenuTab({ locale }: { locale: Locale }) {
  return (
    <div className="animate-tab-enter space-y-5">
      <h2 className="text-lg font-bold mb-4">{t("menu.title", locale)}</h2>

      <div className="bg-card rounded-2xl p-6 border border-card text-center">
        <EnsoLogo size={64} className="mx-auto mb-3 text-emerald-500" animate />
        <h3 className="text-lg font-bold">{t("app.name", locale)}</h3>
        <p className="text-xs text-muted mt-1">{t("app.tagline", locale)}</p>
        <p className="text-xs text-muted mt-3 leading-relaxed">{t("app.description", locale)}</p>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-3">{t("menu.ensoApps", locale)}</h3>
        <div className="space-y-1">
          {[
            { name: t("menu.ensoDashboard", locale), desc: t("menu.ensoDashboardDesc", locale), href: "https://ensolife.app", logo: <><circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" /></> },
            { name: t("menu.ensoTimer", locale), desc: t("menu.ensoTimerDesc", locale), href: "https://ensolife.app/timer", logo: <><circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" /><circle cx="50" cy="18" r="5" fill="currentColor" /></> },
            { name: t("menu.ensoFocus", locale), desc: t("menu.ensoFocusDesc", locale), href: "https://ensolife.app/focus", logo: <><circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" /><circle cx="50" cy="50" r="5" fill="currentColor" /></> },
            { name: t("menu.ensoJournal", locale), desc: t("menu.ensoJournalDesc", locale), href: "https://ensolife.app/journal", logo: <><circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" /><line x1="38" y1="42" x2="62" y2="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4" /><line x1="38" y1="50" x2="62" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.65" /><line x1="38" y1="58" x2="62" y2="58" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="1" /></> },
          ].map((app) => (
            <a key={app.name} href={app.href} className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-subtle transition-colors">
              <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">{app.logo}</svg>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium block">{app.name}</span>
                <span className="text-xs text-muted block">{app.desc}</span>
              </div>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0"><polyline points="9 18 15 12 9 6" /></svg>
            </a>
          ))}

          {/* ENSO COMMUNITY - Coming Soon */}
          <div className="flex items-center gap-3 p-3 -mx-1 rounded-xl opacity-40">
            <svg width={36} height={36} viewBox="0 0 100 100" fill="none" className="text-emerald-500 shrink-0">
              <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.9" />
              <circle cx="38" cy="45" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
              <circle cx="62" cy="45" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
              <path d="M35 62 Q50 72 65 62" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <div className="min-w-0">
              <span className="text-sm font-medium block">{t("menu.ensoCommunity", locale)}</span>
              <span className="text-xs text-muted block">{t("menu.ensoCommunityDesc", locale)}</span>
              <span className="text-[10px] text-muted block mt-0.5">{t("menu.comingSoon", locale)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-2">{t("menu.credits", locale)}</h3>
        <p className="text-xs text-muted">{t("app.credit", locale)}</p>
      </div>

      <div className="bg-card rounded-2xl p-5 border border-card">
        <h3 className="text-sm font-bold mb-2">{t("menu.version", locale)}</h3>
        <p className="text-xs text-muted">v1.0.0</p>
      </div>
    </div>
  );
}
