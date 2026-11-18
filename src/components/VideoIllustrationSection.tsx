import React, { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Subtitles, Timer } from "lucide-react";
import { VIDEO_MODULES } from "../data/medicalContent";
import { Language } from "../types/triage";

interface VideoIllustrationSectionProps {
  language: Language;
}

export const VideoIllustrationSection: React.FC<VideoIllustrationSectionProps> = ({
  language,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState(VIDEO_MODULES[0].id);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);

  // Built-in 20-minute (1200s) burn cooling countdown timer
  const [burnTimerRunning, setBurnTimerRunning] = useState(false);
  const [burnSecondsLeft, setBurnSecondsLeft] = useState(20 * 60);

  const activeModule =
    VIDEO_MODULES.find((m) => m.id === selectedModuleId) || VIDEO_MODULES[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => {
        if (prev + 1 >= activeModule.durationSec) {
          setIsPlaying(false);
          return activeModule.durationSec;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, activeModule.durationSec]);

  useEffect(() => {
    if (!burnTimerRunning) return;
    const t = setInterval(() => {
      setBurnSecondsLeft((prev) => {
        if (prev <= 1) {
          setBurnTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [burnTimerRunning]);

  const currentSlide =
    activeModule.slides.find(
      (s) => elapsedSec >= s.startSec && elapsedSec <= s.endSec
    ) || activeModule.slides[activeModule.slides.length - 1];

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  return (
    <section
      id="video-guides"
      className="border-y border-stone-300 bg-[#F2EFE9] py-14 sm:py-18 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl border-b border-stone-300 pb-5 dark:border-slate-800">
          <p className="text-xs font-semibold tracking-wider text-teal-800 uppercase dark:text-cyan-400">
            {language === "vi" ? "Phần II · Thực hành trực quan" : "Part II · Visual Walkthroughs"}
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
            {language === "vi"
              ? "Video & Hình ảnh minh họa sơ cứu từng bước"
              : "Illustrated Step-by-Step First-Aid Sequences"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-400">
            {language === "vi"
              ? "Hướng dẫn trực quan 30–45 giây kèm phụ đề song ngữ và đồng hồ đếm thời gian làm mát vết bỏng."
              : "30–45 second interactive visual walkthroughs with bilingual subtitles and a built-in 20-minute burn cooling timer."}
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Interactive Player (Left 7 cols) */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-lg border border-stone-300 bg-white dark:border-slate-700 dark:bg-slate-900">
              {/* Visual Frame with Measured Scrim & Subtitles */}
              <div className="relative aspect-[4/3] w-full bg-stone-200 sm:aspect-[16/10] dark:bg-slate-800">
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.instructionTitle[language]}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/25" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
                  <span className="rounded-md bg-white/95 px-3 py-1 text-xs font-bold text-stone-900 backdrop-blur-sm dark:bg-slate-950/85 dark:text-cyan-300">
                    {currentSlide.actionTag[language]}
                  </span>
                  <span className="rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-900 tabular-nums backdrop-blur-sm dark:bg-slate-950/85 dark:text-stone-200">
                    {formatTime(elapsedSec)} / {formatTime(activeModule.durationSec)}
                  </span>
                </div>

                {showCaptions && (
                  <div className="absolute bottom-4 left-4 right-4 rounded-md border border-white/20 bg-slate-950/85 p-3.5 text-white backdrop-blur-md">
                    <p className="font-display text-sm font-bold text-white">
                      {currentSlide.instructionTitle[language]}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-200">
                      {currentSlide.caption[language]}
                    </p>
                  </div>
                )}
              </div>

              {/* Player Controls */}
              <div className="border-t border-stone-200 bg-white p-4 text-stone-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                <input
                  type="range"
                  min={0}
                  max={activeModule.durationSec}
                  value={elapsedSec}
                  onChange={(e) => setElapsedSec(Number(e.target.value))}
                  aria-label="Timeline scrubber"
                  className="w-full accent-[#0A1322] dark:accent-cyan-400"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (elapsedSec >= activeModule.durationSec) {
                          setElapsedSec(0);
                        }
                        setIsPlaying((p) => !p);
                      }}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#0A1322] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span>
                        {isPlaying
                          ? language === "vi"
                            ? "Tạm dừng"
                            : "Pause"
                          : language === "vi"
                          ? "Phát hướng dẫn"
                          : "Play Guide"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        setElapsedSec(0);
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      aria-label="Restart"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCaptions((c) => !c)}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold ${
                      showCaptions
                        ? "border-stone-800 bg-stone-100 text-stone-900 dark:border-cyan-500/60 dark:bg-cyan-950/50 dark:text-cyan-300"
                        : "border-stone-300 text-stone-600 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Subtitles className="h-4 w-4" />
                    <span>{language === "vi" ? "Phụ đề" : "Subtitles"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 cols: Editorial Playlist + Burn Cooling Timer */}
          <div className="space-y-6 lg:col-span-5">
            <div className="divide-y divide-stone-300 border-y border-stone-300 dark:divide-slate-800 dark:border-slate-800">
              {VIDEO_MODULES.map((mod, idx) => {
                const isSelected = mod.id === activeModule.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                      setElapsedSec(0);
                      setIsPlaying(true);
                    }}
                    className={`flex w-full items-center gap-3.5 px-3 py-3 text-left transition-colors ${
                      isSelected
                        ? "bg-white dark:bg-[#0A1322]"
                        : "hover:bg-white/60 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <img
                      src={mod.thumbnailUrl}
                      alt={mod.title[language]}
                      referrerPolicy="no-referrer"
                      className="h-14 w-20 shrink-0 rounded-sm border border-stone-300 object-cover dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-teal-800 tabular-nums dark:text-cyan-400">
                        {String(idx + 1).padStart(2, "0")} · {mod.durationSec}s
                      </p>
                      <h3 className="mt-0.5 font-display text-sm font-bold text-stone-900 dark:text-stone-100">
                        {mod.title[language]}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-stone-600 dark:text-stone-400">
                        {mod.subtitle[language]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive 20-Minute Burn Cooling Timer Utility */}
            <div className="rounded-lg border border-stone-300 bg-white p-5 dark:border-slate-700 dark:bg-[#0A1322]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Timer className="h-4.5 w-4.5 text-teal-800 dark:text-cyan-400" />
                  <h3 className="font-display text-sm font-bold text-stone-900 dark:text-stone-100">
                    {language === "vi"
                      ? "Đồng hồ làm mát vết bỏng (20 phút)"
                      : "20-Minute Burn Cooling Timer"}
                  </h3>
                </div>
                <span className="text-xl font-bold text-teal-800 tabular-nums dark:text-cyan-300">
                  {formatTime(burnSecondsLeft)}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                {language === "vi"
                  ? "Xả nước sạch mát nhẹ nhàng lên vùng bỏng đủ 15–20 phút để ngăn nhiệt ăn sâu."
                  : "Keep cool running tap water over the burn for the full 15–20 minutes."}
              </p>
              <div className="mt-3.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBurnTimerRunning((r) => !r)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-[#0A1322] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600"
                >
                  {burnTimerRunning
                    ? language === "vi"
                      ? "Tạm dừng"
                      : "Pause"
                    : language === "vi"
                    ? "Bắt đầu đếm 20 phút"
                    : "Start 20-Min Timer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBurnTimerRunning(false);
                    setBurnSecondsLeft(20 * 60);
                  }}
                  className="inline-flex min-h-[40px] items-center rounded-md border border-stone-300 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-stone-200"
                >
                  {language === "vi" ? "Đặt lại" : "Reset"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
