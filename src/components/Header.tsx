import React, { useState } from "react";
import {
  Camera,
  Globe,
  Menu,
  Moon,
  PhoneCall,
  Search,
  Sun,
  X,
} from "lucide-react";
import { Language } from "../types/triage";

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onJumpToMode: (mode: "chat" | "image") => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  isDark,
  onToggleTheme,
  onOpenSearch,
  onJumpToMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#hero-triage", label: language === "vi" ? "Trang chủ" : "Home" },
    { href: "#hero-triage", label: language === "vi" ? "Hỏi AI" : "AI Triage" },
    { href: "#injury-guides", label: language === "vi" ? "Chấn thương" : "Injuries" },
    { href: "#video-guides", label: language === "vi" ? "Minh họa" : "Guides" },
    { href: "#faq-emergency", label: language === "vi" ? "Khẩn cấp" : "Emergency" },
  ];

  const fullDrawerLinks = [
    { href: "#hero-triage", label: language === "vi" ? "Trang chủ" : "Home" },
    { href: "#hero-triage", label: language === "vi" ? "Hỏi AI Sơ cứu" : "Ask First-Aid AI" },
    { href: "#injury-guides", label: language === "vi" ? "Hướng dẫn theo loại chấn thương" : "Injury Guides" },
    { href: "#video-guides", label: language === "vi" ? "Video & Hình ảnh minh họa" : "Videos & Illustrations" },
    { href: "#prevention-section", label: language === "vi" ? "Phòng tránh & Pháp lý" : "Prevention & Law" },
    { href: "#faq-emergency", label: language === "vi" ? "Câu hỏi thường gặp & Liên hệ khẩn cấp" : "FAQ & Emergency" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-300/90 bg-[#FAF8F4]/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#080E1A]/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-4 sm:h-16 sm:px-6 lg:gap-8">
        {/* Zone 1: Editorial Wordmark */}
        <a
          href="#hero-triage"
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-800 bg-[#0A1322] text-white dark:border-cyan-500/40">
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            AnTâm 115
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Editorial Navigation */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-sm font-medium text-stone-700 underline-offset-8 transition-colors hover:text-stone-950 hover:underline dark:text-stone-300 dark:hover:text-white whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions & Emergency 115 */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-transparent text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-200/50 dark:text-stone-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 sm:inline-flex"
            aria-label={language === "vi" ? "Tìm kiếm nhanh" : "Quick Search"}
            title={language === "vi" ? "Tìm kiếm nhanh" : "Quick Search"}
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onJumpToMode("image")}
            className="hidden min-h-[38px] items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 transition-colors hover:border-stone-500 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:hover:border-slate-500 sm:inline-flex whitespace-nowrap shrink-0"
            aria-label={language === "vi" ? "Tra cứu bằng ảnh" : "Image Triage"}
          >
            <Camera className="h-3.5 w-3.5 text-teal-800 dark:text-cyan-400" />
            <span>{language === "vi" ? "Tra cứu ảnh" : "Photo Check"}</span>
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="hidden min-h-[38px] items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-slate-800 sm:inline-flex whitespace-nowrap shrink-0"
            aria-label="Switch language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{language === "vi" ? "VI" : "EN"}</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="hidden h-9 w-9 items-center justify-center rounded-md text-stone-700 transition-colors hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-slate-800 sm:inline-flex"
            aria-label={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href="tel:115"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md bg-red-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-800 whitespace-nowrap shrink-0"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span className="tabular-nums">
              {language === "vi" ? "Cấp cứu 115" : "Call 115"}
            </span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-800 hover:bg-stone-200/60 dark:text-stone-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-stone-300 bg-[#FAF8F4] px-4 py-4 dark:border-slate-800 dark:bg-[#080E1A] lg:hidden">
          <nav className="flex flex-col divide-y divide-stone-200 dark:divide-slate-800">
            {fullDrawerLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center py-2.5 text-sm font-medium text-stone-800 hover:text-teal-800 dark:text-stone-200 dark:hover:text-cyan-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-300 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-200"
            >
              <Search className="h-4 w-4" />
              {language === "vi" ? "Tìm kiếm nhanh" : "Search"}
            </button>
            <button
              type="button"
              onClick={onToggleLanguage}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-200"
            >
              <Globe className="h-4 w-4" />
              {language === "vi" ? "Tiếng Việt / EN" : "English / VI"}
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-200"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? (language === "vi" ? "Chế độ sáng" : "Light") : (language === "vi" ? "Chế độ tối" : "Dark")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onJumpToMode("chat");
              }}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md bg-[#0A1322] px-4 py-2 text-xs font-semibold text-white"
            >
              {language === "vi" ? "Hỏi AI ngay" : "Ask AI Now"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
