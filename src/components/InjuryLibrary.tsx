import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bone,
  CheckCircle2,
  Droplets,
  Ear,
  Eye,
  Flame,
  MessageSquare,
  Search,
  Wind,
  X,
  XCircle,
} from "lucide-react";
import { INJURY_GUIDES } from "../data/medicalContent";
import { InjuryGuide, Language } from "../types/triage";

interface InjuryLibraryProps {
  language: Language;
  searchQuery: string;
  onChangeSearchQuery: (val: string) => void;
  externalGuideId?: string | null;
  onClearExternalGuide?: () => void;
  onAskAiForGuide: (prompt: string) => void;
}

const iconMap = {
  burn: Flame,
  bleeding: Droplets,
  eye: Eye,
  ear: Ear,
  fracture: Bone,
  shock: Activity,
  smoke: Wind,
};

export const InjuryLibrary: React.FC<InjuryLibraryProps> = ({
  language,
  searchQuery,
  onChangeSearchQuery,
  externalGuideId,
  onClearExternalGuide,
  onAskAiForGuide,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeGuide, setActiveGuide] = useState<InjuryGuide | null>(null);

  useEffect(() => {
    if (!externalGuideId) return;
    const found = INJURY_GUIDES.find((g) => g.id === externalGuideId);
    if (found) {
      setActiveGuide(found);
    }
    onClearExternalGuide?.();
  }, [externalGuideId, onClearExternalGuide]);

  useEffect(() => {
    if (!activeGuide) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveGuide(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeGuide]);

  const filterOptions = [
    { id: "all", label: language === "vi" ? "Tất cả" : "All" },
    { id: "burn", label: language === "vi" ? "Bỏng" : "Burns" },
    { id: "bleeding", label: language === "vi" ? "Chảy máu" : "Bleeding" },
    { id: "eye", label: language === "vi" ? "Mắt" : "Eye" },
    { id: "ear", label: language === "vi" ? "Tai" : "Ear" },
    { id: "fracture", label: language === "vi" ? "Gãy xương" : "Fractures" },
    { id: "shock", label: language === "vi" ? "Sốc / Ngất" : "Shock" },
    { id: "smoke", label: language === "vi" ? "Ngạt khói" : "Smoke" },
  ];

  const filteredGuides = useMemo(() => {
    return INJURY_GUIDES.filter((g) => {
      const matchesCat = selectedCategory === "all" || g.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCat;
      const haystack = `${g.title[language]} ${g.shortSummary[language]} ${g.firstAidSteps[language].join(" ")}`.toLowerCase();
      return matchesCat && haystack.includes(q);
    });
  }, [selectedCategory, searchQuery, language]);

  const iconStyleMap = {
    burn: "bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400",
    bleeding: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
    eye: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
    ear: "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400",
    fracture: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    shock: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    smoke: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400",
  };

  return (
    <section id="injury-guides" className="bg-[#FAF8F4] py-14 sm:py-18 dark:bg-[#080E1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-stone-300 pb-6 md:flex-row md:items-end dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold tracking-wider text-teal-800 uppercase dark:text-cyan-400">
              {language === "vi" ? "Phần I · Danh mục xử trí" : "Part I · Trauma Index"}
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
              {language === "vi"
                ? "Cẩm nang hướng dẫn theo loại chấn thương"
                : "First-Aid Compendium by Injury Type"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {language === "vi"
                ? "Tra cứu nhanh quy trình xử trí chuẩn y khoa cho từng dạng tai nạn pháo, kể cả khi không tải ảnh lên AI."
                : "Quick access to vetted first-aid protocols for every firework trauma category."}
            </p>
          </div>

          {/* Inline Search Filter */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              placeholder={
                language === "vi" ? "Tìm hướng dẫn chấn thương..." : "Search injury guides..."
              }
              aria-label={language === "vi" ? "Tìm hướng dẫn chấn thương" : "Search injury guides"}
              className="min-h-[40px] w-full rounded-md border border-stone-300 bg-white pr-9 pl-9 text-xs text-stone-900 placeholder:text-stone-500 focus:border-[#0A1322] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:placeholder:text-slate-400 dark:focus:border-cyan-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onChangeSearchQuery("")}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label={language === "vi" ? "Xóa tìm kiếm" : "Clear search"}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Underline Category Filter Strip */}
        <div className="mt-4 flex flex-wrap gap-1 border-b border-stone-300 dark:border-slate-800">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedCategory(opt.id)}
              className={`min-h-[42px] border-b-2 px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === opt.id
                  ? "border-[#0A1322] text-stone-950 dark:border-cyan-400 dark:text-cyan-300"
                  : "border-transparent text-stone-600 hover:border-stone-400 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Editorial 2-Column Hairline Ledger */}
        {filteredGuides.length === 0 ? (
          <div className="mt-8 border border-stone-300 bg-white/60 p-8 text-center text-sm text-stone-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-stone-400">
            {language === "vi"
              ? "Không tìm thấy hướng dẫn phù hợp với từ khóa tìm kiếm."
              : "No injury guides match your search query."}
          </div>
        ) : (
          <div className="grid divide-y divide-stone-300 border-b border-stone-300 md:grid-cols-2 md:divide-y-0 dark:divide-slate-800 dark:border-slate-800">
            {filteredGuides.map((guide, index) => {
              const Icon = iconMap[guide.category];
              const isCritical = guide.severityDefault === "RED";

              return (
                <article
                  key={guide.id}
                  className={`flex flex-col justify-between py-6 transition-colors hover:bg-stone-200/35 dark:hover:bg-slate-900/50 ${
                    index % 2 === 0 ? "md:pr-8 md:border-r md:border-stone-300 dark:md:border-slate-800" : "md:pl-8"
                  } ${index >= 2 ? "md:border-t md:border-stone-300 dark:md:border-slate-800" : ""}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <span className="tabular-nums">
                        <strong className="text-stone-900 dark:text-stone-200">
                          {String(index + 1).padStart(2, "0")}
                        </strong>
                        {" · "}
                        <span className={isCritical ? "font-semibold text-red-700 dark:text-red-400" : "font-semibold text-amber-800 dark:text-amber-300"}>
                          {isCritical
                            ? language === "vi"
                              ? "Ưu tiên ĐỎ"
                              : "RED Priority"
                            : language === "vi"
                            ? "Ưu tiên VÀNG"
                            : "YELLOW Priority"}
                        </span>
                      </span>
                      <span>{guide.source}</span>
                    </div>

                    <div className="mt-3 flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-stone-300/80 dark:border-slate-700 ${iconStyleMap[guide.category]}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="font-display text-lg font-bold leading-snug text-stone-900 dark:text-stone-100">
                        {guide.title[language]}
                      </h3>
                    </div>

                    <p className="mt-2.5 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                      {guide.shortSummary[language]}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveGuide(guide)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-stone-400 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-900 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:hover:bg-slate-800 whitespace-nowrap"
                    >
                      <span>{language === "vi" ? "Đọc quy trình" : "View Protocol"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onAskAiForGuide(guide.aiPrefillPrompt[language])}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md bg-[#0A1322] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 whitespace-nowrap"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{language === "vi" ? "Hỏi AI" : "Ask AI"}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Injury Guide Detail Modal */}
      {activeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveGuide(null);
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                  {activeGuide.source}
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">
                  {activeGuide.title[language]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-6">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-teal-800 dark:text-teal-300">
                  <CheckCircle2 className="h-4 w-4" />
                  {language === "vi" ? "Các bước sơ cứu đúng" : "Correct First-Aid Steps"}
                </h4>
                <ol className="mt-3 space-y-2.5">
                  {activeGuide.firstAidSteps[language].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      <span className="font-mono text-xs font-bold text-teal-700 tabular-nums dark:text-teal-400">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/60 dark:bg-rose-950/35">
                <h4 className="flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-300">
                  <XCircle className="h-4 w-4" />
                  {language === "vi" ? "Những việc tuyệt đối không làm" : "Strictly Avoid"}
                </h4>
                <ul className="mt-2 space-y-1.5 text-sm text-rose-950 dark:text-rose-100">
                  {activeGuide.doNotDo[language].map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/35">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                  {language === "vi" ? "Dấu hiệu phải đi bệnh viện ngay" : "Immediate Hospital Red Flags"}
                </h4>
                <ul className="mt-2 space-y-1.5 text-sm text-amber-950 dark:text-amber-100">
                  {activeGuide.hospitalRedFlags[language].map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {language === "vi" ? "Đóng" : "Close"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const prompt = activeGuide.aiPrefillPrompt[language];
                  setActiveGuide(null);
                  onAskAiForGuide(prompt);
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-700"
              >
                <MessageSquare className="h-4 w-4" />
                {language === "vi" ? "Hỏi AI về trường hợp này" : "Ask AI About This Case"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
