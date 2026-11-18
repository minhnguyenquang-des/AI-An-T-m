import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroTriageHub } from "./components/HeroTriageHub";
import { HospitalLocatorModal } from "./components/HospitalLocatorModal";
import { InjuryLibrary } from "./components/InjuryLibrary";
import { PreventionAndFaq } from "./components/PreventionAndFaq";
import { QuickSearchModal } from "./components/QuickSearchModal";
import { VideoIllustrationSection } from "./components/VideoIllustrationSection";
import { HistoryEntry, Language } from "./types/triage";

const HISTORY_STORAGE_KEY = "antam115_triage_history_v1";

export default function App() {
  const [language, setLanguage] = useState<Language>("vi");
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("antam115_theme") === "dark";
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<"chat" | "image">("chat");
  const [chatInput, setChatInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.lang = language;
    try {
      localStorage.setItem("antam115_theme", isDark ? "dark" : "light");
    } catch {
      // Ignore storage errors
    }
  }, [isDark, language]);

  const handleSaveHistory = (entry: HistoryEntry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 20);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage quota errors
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const jumpToHeroMode = (mode: "chat" | "image") => {
    setActiveTab(mode);
    document.getElementById("hero-triage")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAskAiPrefill = (prompt: string) => {
    setActiveTab("chat");
    setChatInput(prompt);
    document.getElementById("hero-triage")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-stone-900 dark:bg-[#080E1A] dark:text-stone-100">
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === "vi" ? "en" : "vi"))}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        onOpenSearch={() => setShowSearchModal(true)}
        onJumpToMode={jumpToHeroMode}
      />

      <main>
        <HeroTriageHub
          language={language}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          chatInput={chatInput}
          onChangeChatInput={setChatInput}
          onFindHospital={() => setShowHospitalModal(true)}
          history={history}
          onSaveHistory={handleSaveHistory}
          onClearHistory={handleClearHistory}
        />

        <InjuryLibrary
          language={language}
          searchQuery={searchQuery}
          onAskAiForGuide={handleAskAiPrefill}
        />

        <VideoIllustrationSection language={language} />

        <PreventionAndFaq
          language={language}
          onFindHospital={() => setShowHospitalModal(true)}
        />
      </main>

      <Footer language={language} />

      {showHospitalModal && (
        <HospitalLocatorModal
          language={language}
          onClose={() => setShowHospitalModal(false)}
        />
      )}

      {showSearchModal && (
        <QuickSearchModal
          language={language}
          query={searchQuery}
          onChangeQuery={setSearchQuery}
          onClose={() => setShowSearchModal(false)}
          onAskAi={handleAskAiPrefill}
          onSelectGuideSection={() =>
            document.getElementById("injury-guides")?.scrollIntoView({ behavior: "smooth" })
          }
        />
      )}
    </div>
  );
}
