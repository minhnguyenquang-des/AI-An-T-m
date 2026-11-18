import React, { useEffect, useMemo } from "react";
import { ArrowRight, MessageSquare, Search, X } from "lucide-react";
import { FAQ_ITEMS, INJURY_GUIDES } from "../data/medicalContent";
import { Language } from "../types/triage";

interface QuickSearchModalProps {
  language: Language;
  query: string;
  onChangeQuery: (val: string) => void;
  onClose: () => void;
  onAskAi: (prompt: string) => void;
  onSelectGuideSection: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  language,
  query,
  onChangeQuery,
  onClose,
  onAskAi,
  onSelectGuideSection,
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const guides = INJURY_GUIDES.filter((g) => {
      if (!q) return true;
      return `${g.title[language]} ${g.shortSummary[language]}`.toLowerCase().includes(q);
    }).slice(0, 4);

    const faqs = FAQ_ITEMS.filter((f) => {
      if (!q) return true;
      return `${f.question[language]} ${f.answer[language]}`.toLowerCase().includes(q);
    }).slice(0, 3);

    return { guides, faqs };
  }, [query, language]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 p-4 pt-16 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder={
              language === "vi"
                ? "Tìm kiếm nhanh (vd: bỏng tay, chấn thương mắt, cầm máu)..."
                : "Quick search (e.g., burn, eye trauma, bleeding)..."
            }
            className="min-h-[40px] flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[65vh] space-y-5 overflow-y-auto p-4">
          {query.trim() && (
            <button
              type="button"
              onClick={() => {
                onAskAi(query.trim());
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl border border-orange-200 bg-orange-50/70 px-4 py-3 text-left text-xs font-semibold text-orange-900 hover:bg-orange-100 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {language === "vi"
                  ? `Hỏi AI Sơ cứu trực tiếp về: "${query.trim()}"`
                  : `Ask First-Aid AI directly about: "${query.trim()}"`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {language === "vi" ? "Hướng dẫn chấn thương" : "Injury Guides"}
            </p>
            <div className="mt-2 space-y-1.5">
              {results.guides.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    onSelectGuideSection();
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {g.title[language]}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {g.shortSummary[language]}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {results.faqs.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {language === "vi" ? "Câu hỏi thường gặp" : "FAQ"}
              </p>
              <div className="mt-2 space-y-1.5">
                {results.faqs.map((f) => (
                  <a
                    key={f.id}
                    href="#faq-emergency"
                    onClick={onClose}
                    className="block rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {f.question[language]}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
