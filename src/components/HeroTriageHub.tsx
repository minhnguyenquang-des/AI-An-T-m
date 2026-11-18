import React, { useRef, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Camera,
  EyeOff,
  History,
  Hospital,
  ImagePlus,
  Loader2,
  MessageSquareText,
  PhoneCall,
  Send,
  ShieldAlert,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { HERO_FIRSTAID_IMAGE, QUICK_PROMPTS } from "../data/medicalContent";
import {
  ChatMessage,
  HistoryEntry,
  ImageAnalysisResponse,
  Language,
  TriageResponse,
} from "../types/triage";
import { PrivacyMaskModal } from "./PrivacyMaskModal";
import { TriageResultCard } from "./TriageResultCard";

interface HeroTriageHubProps {
  language: Language;
  activeTab: "chat" | "image";
  onChangeTab: (tab: "chat" | "image") => void;
  chatInput: string;
  onChangeChatInput: (val: string) => void;
  onFindHospital: () => void;
  history: HistoryEntry[];
  onSaveHistory: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
}

interface UploadedPhoto {
  id: string;
  dataUrl: string;
  mimeType: string;
  masked: boolean;
}

async function compressImageFile(file: File): Promise<{ dataUrl: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Read error"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image decode error"));
      img.onload = () => {
        const maxDim = 1024;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ dataUrl: String(reader.result), mimeType: file.type || "image/jpeg" });
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        resolve({ dataUrl: compressed, mimeType: "image/jpeg" });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

async function parseApiJson<T>(res: Response, fallbackMsg: string): Promise<T> {
  const text = await res.text();
  let parsed: Record<string, unknown> | null = null;
  if (text.trim()) {
    try {
      parsed = JSON.parse(text) as Record<string, unknown>;
    } catch {
      parsed = null;
    }
  }
  if (!res.ok) {
    const serverMsg =
      parsed && typeof parsed.message === "string" && parsed.message.trim()
        ? parsed.message
        : fallbackMsg;
    throw new Error(serverMsg);
  }
  if (!parsed) {
    throw new Error(fallbackMsg);
  }
  return parsed as unknown as T;
}

export const HeroTriageHub: React.FC<HeroTriageHubProps> = ({
  language,
  activeTab,
  onChangeTab,
  chatInput,
  onChangeChatInput,
  onFindHospital,
  history,
  onSaveHistory,
  onClearHistory,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [imageDescription, setImageDescription] = useState("");
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<ImageAnalysisResponse | null>(null);
  const [maskingPhotoId, setMaskingPhotoId] = useState<string | null>(null);

  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendChat = async (overridePrompt?: string) => {
    const textToSend = (overridePrompt ?? chatInput).trim();
    if (!textToSend || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(language === "vi" ? "vi-VN" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!overridePrompt) onChangeChatInput("");
    setIsSendingChat(true);

    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);

    try {
      const historyPayload = nextMessages.slice(-6).map((m) => ({
        role: m.role,
        text: m.triage ? `${m.triage.injuryType}: ${m.triage.summary}` : m.text,
      }));

      const res = await fetch("/api/triage/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          language,
        }),
      });

      const triage = await parseApiJson<TriageResponse>(
        res,
        language === "vi"
          ? "Không thể kết nối phân tích AI lúc này. Vui lòng thử lại hoặc gọi 115."
          : "AI service returned an unexpected response. Please try again or call 115."
      );
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: triage.summary,
        timestamp: new Date().toLocaleTimeString(language === "vi" ? "vi-VN" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        triage,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      onSaveHistory({
        id: `hist-${Date.now()}`,
        type: "chat",
        createdAt: new Date().toISOString(),
        querySummary: textToSend.slice(0, 90),
        result: triage,
      });
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : language === "vi"
          ? "Không thể kết nối AI lúc này."
          : "Unable to reach AI triage service.";
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: errMsg,
          timestamp: new Date().toLocaleTimeString(),
          error: errMsg,
        },
      ]);
    } finally {
      setIsSendingChat(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImageError(null);

    const remaining = 4 - photos.length;
    const selected = Array.from(files).slice(0, remaining);

    try {
      const processed = await Promise.all(
        selected.map(async (f, idx) => {
          const { dataUrl, mimeType } = await compressImageFile(f);
          return {
            id: `img-${Date.now()}-${idx}`,
            dataUrl,
            mimeType,
            masked: false,
          };
        })
      );
      setPhotos((prev) => [...prev, ...processed]);
    } catch {
      setImageError(
        language === "vi"
          ? "Không thể đọc tệp ảnh này. Vui lòng thử ảnh JPEG hoặc PNG khác."
          : "Could not load selected image. Please try another JPEG or PNG photo."
      );
    }
  };

  const handleAnalyzeImages = async () => {
    if (photos.length === 0 || isAnalyzingImage) return;
    setImageError(null);
    setIsAnalyzingImage(true);

    try {
      const payloadImages = photos
        .map((p) => ({
          base64: p.dataUrl.split(",")[1] || "",
          mimeType: p.mimeType,
        }))
        .filter((img) => img.base64.length > 0);

      const totalBase64Length = payloadImages.reduce((sum, img) => sum + img.base64.length, 0);
      if (totalBase64Length > 4_200_000) {
        throw new Error(
          language === "vi"
            ? "Tổng dung lượng ảnh vượt giới hạn gửi (~4 MB). Vui lòng giảm số lượng hoặc chọn ảnh nhẹ hơn."
            : "Total image size exceeds upload limit (~4 MB). Please send fewer photos."
        );
      }

      const res = await fetch("/api/triage/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: payloadImages,
          description: imageDescription,
          privacyMasked: photos.some((p) => p.masked),
          language,
        }),
      });

      const parsed = await parseApiJson<ImageAnalysisResponse>(
        res,
        language === "vi"
          ? "Không thể phân tích hình ảnh lúc này. Hãy gọi 115 nếu khẩn cấp."
          : "Image analysis failed. Call 115 if urgent."
      );
      setImageResult(parsed);

      onSaveHistory({
        id: `hist-img-${Date.now()}`,
        type: "image",
        createdAt: new Date().toISOString(),
        querySummary:
          imageDescription.trim().slice(0, 80) ||
          parsed.injuryType,
        result: parsed,
        thumbnailCount: photos.length,
      });
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : language === "vi"
          ? "Không thể phân tích hình ảnh lúc này. Hãy gọi 115 nếu khẩn cấp."
          : "Could not analyze image right now. Call 115 if urgent."
      );
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const maskingTarget = photos.find((p) => p.id === maskingPhotoId);

  return (
    <section
      id="hero-triage"
      className="border-b border-stone-300 bg-[#FAF8F4] py-7 sm:py-10 dark:border-slate-800 dark:bg-[#080E1A]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Broadsheet Dateline Strip */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-300 pb-3 text-xs text-stone-600 dark:border-slate-800 dark:text-stone-400">
          <span>
            {language === "vi"
              ? "Ấn phẩm hướng dẫn sơ cứu khẩn cấp · Nhóm NCKH Tỉnh Lào Cai · Tham khảo WHO & Bộ Y tế"
              : "Emergency First-Aid Compendium · Lao Cai Research Group · WHO & Ministry of Health"}
          </span>
          <span className="font-semibold text-red-800 dark:text-red-400">
            {language === "vi" ? "Khẩn cấp gọi 115" : "Emergency: 115"}
          </span>
        </div>

        {/* Hero Masthead */}
        <div className="max-w-4xl">
          <h1
            className="font-display font-bold tracking-tight text-stone-900 dark:text-stone-50"
            style={{
              fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)",
              lineHeight: 1.18,
              textWrap: "balance",
            }}
          >
            {language === "vi" ? (
              <>
                <span className="bg-gradient-to-r from-[#0A1322] via-teal-800 to-cyan-700 bg-clip-text font-extrabold text-transparent dark:from-white dark:via-cyan-300 dark:to-teal-300">
                  Hệ thống AI
                </span>
                {" – Cẩm nang xử lý "}
                <span className="italic text-teal-800 dark:text-cyan-300">
                  chấn thương do pháo
                </span>
              </>
            ) : (
              <>
                <span className="bg-gradient-to-r from-[#0A1322] via-teal-800 to-cyan-700 bg-clip-text font-extrabold text-transparent dark:from-white dark:via-cyan-300 dark:to-teal-300">
                  AI System
                </span>
                {" – Firework Injury "}
                <span className="italic text-teal-800 dark:text-cyan-300">
                  First-Aid Handbook
                </span>
              </>
            )}
          </h1>

          <p className="mt-2 text-sm italic text-stone-600 dark:text-stone-400">
            {language === "vi"
              ? "Phát triển bởi nhóm NCKH trong khuôn khổ Cuộc thi NCKH năm học 2026 – 2027, tỉnh Lào Cai"
              : "Developed by the Research Team under the 2026 – 2027 Lao Cai Provincial Science & Engineering Fair"}
          </p>

          <p className="mt-3.5 inline-flex items-start gap-2 border-y border-red-200/90 bg-red-50/50 px-3 py-2 text-xs font-semibold text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {language === "vi"
                ? "Đây chỉ là hướng dẫn sơ cứu tạm thời. Hãy gọi cấp cứu 115 nếu tình trạng nghiêm trọng."
                : "This provides temporary first-aid guidance only. Call emergency 115 immediately if severe."}
            </span>
          </p>
        </div>

        {/* Main 2-Column Broadsheet Split */}
        <div className="mt-8 grid gap-7 lg:grid-cols-12 lg:items-stretch">
          {/* Left 9 Columns: Primary AI Workbench Centerpiece */}
          <div className="flex flex-col lg:col-span-9">
            <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-cyan-500/25 bg-[#0A1322] shadow-[0_24px_64px_-20px_rgba(8,47,73,0.55)] ring-1 ring-cyan-400/10">
              {/* Mode Switcher Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-gradient-to-r from-[#0E1A2E] via-[#0B1526] to-[#0D1E2E] px-5 py-4 sm:px-7">
                <div
                  className="inline-flex rounded-xl border border-slate-800/80 bg-[#070E1B] p-1"
                  role="tablist"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "chat"}
                    onClick={() => onChangeTab("chat")}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      activeTab === "chat"
                        ? "border border-cyan-500/30 bg-[#132642] text-cyan-300 shadow-sm"
                        : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    <MessageSquareText className="h-4 w-4" />
                    {language === "vi" ? "Hỏi bằng chữ" : "Text Chat"}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "image"}
                    onClick={() => onChangeTab("image")}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      activeTab === "image"
                        ? "border border-cyan-500/30 bg-[#132642] text-cyan-300 shadow-sm"
                        : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    <Camera className="h-4 w-4" />
                    {language === "vi" ? "Hỏi bằng hình ảnh" : "Image Check"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHistoryDrawer((v) => !v)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#101D33] px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/40 hover:bg-[#162742] whitespace-nowrap shrink-0"
                >
                  <History className="h-3.5 w-3.5 text-cyan-400" />
                  <span>
                    {language === "vi" ? "Lịch sử" : "History"}
                    {history.length > 0 && (
                      <span className="ml-1 font-mono tabular-nums text-slate-400">
                        ({history.length})
                      </span>
                    )}
                  </span>
                </button>
              </div>

              {/* Saved Local History Drawer */}
              {showHistoryDrawer && (
                <div className="border-b border-slate-800 bg-[#070E1A] p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100">
                      {language === "vi"
                        ? "Lịch sử tra cứu trên thiết bị này"
                        : "Saved Triage History (This Device)"}
                    </h3>
                    <div className="flex items-center gap-2">
                      {history.length > 0 && (
                        <button
                          type="button"
                          onClick={onClearHistory}
                          className="inline-flex items-center gap-1 text-xs font-medium text-rose-400 hover:underline"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {language === "vi" ? "Xóa tất cả" : "Clear all"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowHistoryDrawer(false)}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                        aria-label="Close history"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {history.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-400">
                      {language === "vi"
                        ? "Chưa có phiên tra cứu nào được lưu. Các câu hỏi và kết quả phân tích của bạn sẽ tự động lưu tại trình duyệt này để tiện theo dõi."
                        : "No saved sessions yet. Your triage conversations and image assessments are saved locally in your browser."}
                    </p>
                  ) : (
                    <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">
                      {history.map((entry) => (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => {
                            if (entry.type === "image") {
                              onChangeTab("image");
                              setImageResult(entry.result as ImageAnalysisResponse);
                            } else {
                              onChangeTab("chat");
                              setMessages([
                                {
                                  id: `hist-u-${entry.id}`,
                                  role: "user",
                                  text: entry.querySummary,
                                  timestamp: new Date(entry.createdAt).toLocaleTimeString(),
                                },
                                {
                                  id: `hist-a-${entry.id}`,
                                  role: "assistant",
                                  text: entry.result.summary,
                                  timestamp: new Date(entry.createdAt).toLocaleTimeString(),
                                  triage: entry.result,
                                },
                              ]);
                            }
                            setShowHistoryDrawer(false);
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0E192C] px-3.5 py-2.5 text-left transition-colors hover:border-cyan-500/50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-100">
                              {entry.result.injuryType}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                              {entry.type === "image"
                                ? language === "vi"
                                  ? "Phân tích ảnh"
                                  : "Photo analysis"
                                : language === "vi"
                                ? "Hỏi chữ"
                                : "Text chat"}{" "}
                              · {entry.querySummary}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-[11px] text-slate-400 tabular-nums">
                            {new Date(entry.createdAt).toLocaleDateString(
                              language === "vi" ? "vi-VN" : "en-US"
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 1: NATURAL TEXT CHAT TRIAGE */}
              {activeTab === "chat" && (
                <div className="flex flex-1 flex-col justify-between bg-[#0A1322] p-5 sm:p-7">
                  {/* Conversation Viewport */}
                  <div className="min-h-[280px] max-h-[560px] flex-1 space-y-5 overflow-y-auto pr-1">
                    {messages.length === 0 ? (
                      <div className="rounded-2xl border border-cyan-900/50 bg-gradient-to-br from-[#0F1E33] via-[#0C1829] to-[#0A1524] p-5">
                        <p className="text-sm font-bold text-slate-100">
                          {language === "vi"
                            ? "Mô tả tình huống tai nạn do pháo để nhận hướng dẫn sơ cứu từng bước"
                            : "Describe the firework injury to get ordered first-aid triage"}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-300/90">
                          {language === "vi"
                            ? "Ví dụ: vị trí bị thương (tay, mắt, mặt...), thời gian xảy ra, có chảy máu/phồng rộp/khó thở hay không. AI phân loại theo mức độ Xanh / Vàng / Đỏ và dẫn nguồn y khoa."
                            : "Include affected body part, time elapsed, bleeding, blistering, or breathing symptoms. Responses include triage severity, ordered steps, contraindications, and medical sources."}
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) =>
                        msg.role === "user" ? (
                          <div key={msg.id} className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 text-sm text-white shadow-sm">
                              <p className="leading-relaxed">{msg.text}</p>
                              <p className="mt-1 text-right font-mono text-[11px] text-cyan-100/90 tabular-nums">
                                {msg.timestamp}
                              </p>
                            </div>
                          </div>
                        ) : msg.error ? (
                          <div
                            key={msg.id}
                            className="flex items-start gap-3 rounded-xl border border-red-800/70 bg-red-950/50 p-4 text-sm text-red-200"
                          >
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                              <p className="font-semibold">{msg.error}</p>
                              <p className="mt-1 text-xs">
                                {language === "vi"
                                  ? "Trong lúc chờ khắc phục, bạn có thể xem hướng dẫn chuẩn bên dưới hoặc gọi 115."
                                  : "Meanwhile, consult the vetted injury guides below or call 115."}
                              </p>
                            </div>
                          </div>
                        ) : msg.triage ? (
                          <TriageResultCard
                            key={msg.id}
                            result={msg.triage}
                            language={language}
                            onFindHospital={onFindHospital}
                          />
                        ) : null
                      )
                    )}

                    {isSendingChat && (
                      <div className="flex items-center gap-3 rounded-xl border border-cyan-900/50 bg-[#0F1E33] px-4 py-3 text-sm text-slate-200">
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                        <span>
                          {language === "vi"
                            ? "Đang đánh giá mức độ và tổng hợp bước sơ cứu chuẩn y khoa..."
                            : "Assessing triage severity and compiling clinical first-aid steps..."}
                        </span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="mt-auto pt-4">
                    {/* Chat Input Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendChat();
                      }}
                    >
                      <div className="flex flex-col gap-2 rounded-2xl border border-slate-700/80 bg-[#070E1A] p-2 transition-colors focus-within:border-cyan-500/70 focus-within:bg-[#0D1829] sm:flex-row sm:items-end">
                        <textarea
                          rows={2}
                          value={chatInput}
                          onChange={(e) => onChangeChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendChat();
                            }
                          }}
                          placeholder={
                            language === "vi"
                              ? "Nhập triệu chứng hoặc tình huống (vd: Bị pháo hoa bắn vào tay đang rát và phồng rộp)..."
                              : "Describe symptoms (e.g., Firework spark burned hand 10 mins ago, blistering)..."
                          }
                          className="w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={!chatInput.trim() || isSendingChat}
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-red-600 disabled:opacity-50 whitespace-nowrap shrink-0"
                        >
                          <Send className="h-4 w-4" />
                          <span>{language === "vi" ? "Hỏi AI ngay" : "Ask AI Now"}</span>
                        </button>
                      </div>
                    </form>

                    {/* Quick Suggestion Buttons */}
                    <div className="mt-4">
                      <p className="text-xs font-medium text-slate-400">
                        {language === "vi" ? "Tình huống phổ biến:" : "Quick situations:"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {QUICK_PROMPTS.map((q) => (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() =>
                              handleSendChat(language === "vi" ? q.fullPromptVi : q.fullPromptEn)
                            }
                            className="inline-flex min-h-[40px] items-center rounded-xl border border-slate-700/80 bg-[#101D33] px-3.5 py-2 text-xs font-medium text-slate-200 transition-all hover:border-cyan-500/60 hover:bg-[#162742] hover:text-cyan-200"
                          >
                            {language === "vi" ? q.vi : q.en}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MULTIMODAL IMAGE ANALYSIS */}
              {activeTab === "image" && (
                <div className="flex flex-1 flex-col justify-between bg-[#0A1322] p-5 sm:p-7">
                  {/* Pre-upload Privacy & Non-Diagnostic Banner */}
                  <div className="rounded-xl border border-amber-700/50 bg-amber-950/35 p-3.5 text-xs leading-relaxed text-amber-100">
                    <p className="font-semibold">
                      {language === "vi"
                        ? "Lưu ý quan trọng: AI không chẩn đoán và không thay thế bác sĩ."
                        : "Important Notice: AI does not diagnose and cannot replace a physician."}
                    </p>
                    <p className="mt-1">
                      {language === "vi"
                        ? "Ảnh của bạn chỉ được dùng để phân tích định hướng sơ cứu tạm thời và không lưu trữ lâu dài."
                        : "Your uploaded photos are used strictly for temporary first-aid orientation and are not stored long-term."}
                    </p>
                  </div>

                  {/* Upload & Direct Mobile Camera Controls */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFilesSelected(e.dataTransfer.files);
                    }}
                    className="mt-4 rounded-2xl border-2 border-dashed border-cyan-800/60 bg-gradient-to-br from-[#0E1B2F] via-[#0B1526] to-[#0D1D2E] p-6 text-center transition-colors hover:border-cyan-500/70"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleFilesSelected(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        handleFilesSelected(e.target.files);
                        e.target.value = "";
                      }}
                    />

                    <ImagePlus className="mx-auto h-8 w-8 text-cyan-400" />
                    <p className="mt-2 text-sm font-semibold text-slate-100">
                      {language === "vi"
                        ? "Chụp rõ vùng bị thương, đủ ánh sáng, không bị che khuất"
                        : "Capture the injured area clearly in good lighting without obstruction"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {language === "vi"
                        ? "Hỗ trợ gửi tối đa 4 ảnh (vd: ảnh tổng thể + ảnh cận cảnh)."
                        : "Upload up to 4 photos (e.g., wide context + close-up)."}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-teal-500 whitespace-nowrap shrink-0"
                      >
                        <Camera className="h-4 w-4" />
                        {language === "vi" ? "Chụp ảnh trực tiếp" : "Take Photo Now"}
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-700 bg-[#101D33] px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-[#162742] whitespace-nowrap shrink-0"
                      >
                        <Upload className="h-4 w-4" />
                        {language === "vi" ? "Chọn ảnh từ thư viện" : "Choose from Gallery"}
                      </button>
                    </div>
                  </div>

                  {/* Preview Uploaded Images + Privacy Blur Option */}
                  {photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {photos.map((photo, idx) => (
                        <div
                          key={photo.id}
                          className="group relative overflow-hidden rounded-xl border border-slate-700 bg-[#101D33]"
                        >
                          <img
                            src={photo.dataUrl}
                            alt={`Wound photo ${idx + 1}`}
                            className="aspect-square w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
                            }
                            className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-red-600"
                            aria-label="Remove image"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setMaskingPhotoId(photo.id)}
                            className="flex w-full items-center justify-center gap-1 border-t border-slate-700 bg-[#0E1A2E] py-2 text-[11px] font-semibold text-slate-200 hover:text-cyan-300"
                          >
                            <EyeOff className="h-3.5 w-3.5" />
                            {photo.masked
                              ? language === "vi"
                                ? "Đã che vùng riêng tư"
                                : "Privacy masked"
                              : language === "vi"
                              ? "Ẩn vùng cá nhân"
                              : "Blur personal info"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Optional Description */}
                  <div className="mt-4">
                    <label
                      htmlFor="wound-description"
                      className="block text-xs font-semibold text-slate-300"
                    >
                      {language === "vi"
                        ? "Mô tả thêm hoàn cảnh (tùy chọn)"
                        : "Additional context (optional)"}
                    </label>
                    <textarea
                      id="wound-description"
                      rows={2}
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      placeholder={
                        language === "vi"
                          ? "Ví dụ: Bị pháo hoa bắn vào tay khoảng 10 phút trước, đang đau rát và có chảy máu..."
                          : "Example: Firework spark hit hand 10 minutes ago, painful and slight bleeding..."
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#070E1A] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Analyze CTA & No-Upload Alternative */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleAnalyzeImages}
                      disabled={photos.length === 0 || isAnalyzingImage}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50 whitespace-nowrap shrink-0"
                    >
                      {isAnalyzingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>
                            {language === "vi" ? "Đang phân tích sơ bộ..." : "Analyzing..."}
                          </span>
                        </>
                      ) : (
                        <span>{language === "vi" ? "Phân tích ngay" : "Analyze Now"}</span>
                      )}
                    </button>

                    <a
                      href="#injury-guides"
                      className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-semibold text-cyan-400 underline-offset-4 hover:underline"
                    >
                      <BookOpen className="h-4 w-4" />
                      {language === "vi"
                        ? "Chỉ xem hướng dẫn, không phân tích ảnh"
                        : "View guides only without uploading photos"}
                    </a>
                  </div>

                  {imageError && (
                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-800/70 bg-red-950/50 p-3.5 text-xs font-medium text-red-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{imageError}</span>
                    </div>
                  )}

                  {imageResult && (
                    <div className="mt-6">
                      <TriageResultCard
                        result={imageResult}
                        language={language}
                        onFindHospital={onFindHospital}
                        onAskFollowUp={(contextText) => {
                          onChangeTab("chat");
                          onChangeChatInput(contextText);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right 3 Columns: Editorial Margin Rail */}
          <aside className="flex flex-col justify-between space-y-5 border-t border-stone-300 pt-6 lg:col-span-3 lg:border-t-0 lg:border-l lg:border-stone-300 lg:pl-6 lg:pt-0 dark:border-slate-800">
            {/* Archival Clinical Figure */}
            <figure>
              <div className="relative aspect-[16/9] max-h-[190px] w-full overflow-hidden rounded-md border border-stone-300 bg-stone-200 dark:border-slate-700 dark:bg-slate-800">
                {!heroImgFailed ? (
                  <img
                    src={HERO_FIRSTAID_IMAGE}
                    alt={
                      language === "vi"
                        ? "Bộ dụng cụ sơ cứu bỏng và chấn thương chuẩn y khoa"
                        : "Standard medical burn and trauma first aid kit"
                    }
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#0A1322] p-4 text-center text-xs font-semibold text-white">
                    {language === "vi" ? "Sơ cứu chuẩn y khoa" : "Clinical First Aid"}
                  </div>
                )}
              </div>
              <figcaption className="mt-2 text-xs italic text-stone-600 dark:text-stone-400">
                {language === "vi"
                  ? "Hình 1 — Bộ dụng cụ sơ cứu bỏng và chấn thương cơ bản tại chỗ."
                  : "Fig. 1 — Essential burn and trauma first-aid supplies."}
              </figcaption>
            </figure>

            {/* Immediate On-Site Actions */}
            <div className="border-t border-stone-300 pt-5 dark:border-slate-800">
              <h2 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                {language === "vi" ? "Xử trí khẩn cấp tại chỗ" : "Immediate On-Site Actions"}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                {language === "vi"
                  ? "Ưu tiên giữ bình tĩnh, tách nạn nhân khỏi khói lửa và gọi hỗ trợ y tế ngay khi có dấu hiệu nguy hiểm."
                  : "Stay calm, move away from fire/smoke hazards, and call emergency responders immediately for severe signs."}
              </p>

              <div className="mt-4 space-y-2.5">
                <a
                  href="tel:115"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-red-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-800"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>
                    {language === "vi" ? "Gọi Cấp Cứu 115" : "Call Emergency 115"}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={onFindHospital}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-stone-400 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100 dark:hover:bg-slate-800"
                >
                  <Hospital className="h-4 w-4 text-teal-800 dark:text-cyan-400" />
                  <span>
                    {language === "vi" ? "Tìm bệnh viện gần nhất" : "Find Nearest Hospital"}
                  </span>
                </button>
              </div>

              <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200 text-xs text-stone-700 dark:divide-slate-800 dark:border-slate-800 dark:text-stone-300">
                <div className="flex items-center justify-between py-2">
                  <span>{language === "vi" ? "Đường dây nóng Bộ Y tế:" : "Ministry of Health:"}</span>
                  <a href="tel:19009095" className="font-bold text-teal-800 tabular-nums hover:underline dark:text-cyan-400">
                    1900 9095
                  </a>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>{language === "vi" ? "Cứu hỏa / Cháy nổ:" : "Fire & Rescue:"}</span>
                  <a href="tel:114" className="font-bold text-stone-900 tabular-nums hover:underline dark:text-stone-100">
                    114
                  </a>
                </div>
              </div>
            </div>

            {/* Numbered Editorial Margin Notes */}
            <div className="border-t border-stone-300 pt-5 dark:border-slate-800">
              <h3 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                {language === "vi" ? "3 nguyên tắc vàng sơ cứu pháo" : "3 Golden Firework First-Aid Rules"}
              </h3>
              <ol className="mt-3 divide-y divide-stone-200 text-xs leading-relaxed text-stone-700 dark:divide-slate-800 dark:text-stone-300">
                <li className="flex gap-2.5 py-2.5">
                  <span className="font-bold text-teal-800 tabular-nums dark:text-cyan-400">01.</span>
                  <span>
                    {language === "vi"
                      ? "Bỏng: xả nước sạch mát 15–20 phút, tuyệt đối không bôi kem đánh răng hay nước mắm."
                      : "Burns: cool under clean running water 15–20 mins; never apply toothpaste or oils."}
                  </span>
                </li>
                <li className="flex gap-2.5 py-2.5">
                  <span className="font-bold text-teal-800 tabular-nums dark:text-cyan-400">02.</span>
                  <span>
                    {language === "vi"
                      ? "Chảy máu: ép gạc sạch trực tiếp liên tục, không tự rút dị vật găm sâu."
                      : "Bleeding: apply firm direct gauze pressure; do not pull embedded debris."}
                  </span>
                </li>
                <li className="flex gap-2.5 py-2.5">
                  <span className="font-bold text-teal-800 tabular-nums dark:text-cyan-400">03.</span>
                  <span>
                    {language === "vi"
                      ? "Mắt: úp cốc giấy bảo vệ hốc mắt, không dụi, đi khám chuyên khoa Mắt ngay."
                      : "Eyes: shield gently with a rigid cup, never rub, go straight to eye ER."}
                  </span>
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>

      {/* Interactive Privacy Blur Modal */}
      {maskingTarget && (
        <PrivacyMaskModal
          imageUrl={maskingTarget.dataUrl}
          language={language}
          onClose={() => setMaskingPhotoId(null)}
          onSaveMasked={(maskedDataUrl) => {
            setPhotos((prev) =>
              prev.map((p) =>
                p.id === maskingTarget.id ? { ...p, dataUrl: maskedDataUrl, masked: true } : p
              )
            );
            setMaskingPhotoId(null);
          }}
        />
      )}
    </section>
  );
};
