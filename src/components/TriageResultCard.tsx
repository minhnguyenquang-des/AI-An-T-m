import React, { useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Hospital,
  MessageSquarePlus,
  PhoneCall,
  Share2,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { ImageAnalysisResponse, Language, TriageResponse } from "../types/triage";

interface TriageResultCardProps {
  result: TriageResponse | ImageAnalysisResponse;
  language: Language;
  onFindHospital: () => void;
  onAskFollowUp?: (contextText: string) => void;
}

function isImageAnalysis(
  res: TriageResponse | ImageAnalysisResponse
): res is ImageAnalysisResponse {
  return "preliminaryVisualFindings" in res;
}

export const TriageResultCard: React.FC<TriageResultCardProps> = ({
  result,
  language,
  onFindHospital,
  onAskFollowUp,
}) => {
  const [copied, setCopied] = useState(false);

  const severityStyles = {
    RED: {
      container:
        "bg-red-50/90 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-900/70 dark:text-red-100",
      icon: <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />,
      fallbackLabel: language === "vi" ? "Mức độ ĐỎ — Khẩn cấp" : "RED — Emergency",
    },
    YELLOW: {
      container:
        "bg-amber-50/90 border-amber-200 text-amber-950 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-100",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />,
      fallbackLabel: language === "vi" ? "Mức độ VÀNG — Cần theo dõi" : "YELLOW — Urgent Care",
    },
    GREEN: {
      container:
        "bg-teal-50/90 border-teal-200 text-teal-950 dark:bg-teal-950/40 dark:border-teal-900/60 dark:text-teal-100",
      icon: <CheckCircle2 className="h-5 w-5 text-teal-700 dark:text-teal-400 shrink-0" />,
      fallbackLabel: language === "vi" ? "Mức độ XANH — Nhẹ" : "GREEN — Minor",
    },
  };

  const steps = Array.isArray(result.steps) ? result.steps : [];
  const doNotDo = Array.isArray(result.doNotDo) ? result.doNotDo : [];
  const whenToHospital = Array.isArray(result.whenToHospital) ? result.whenToHospital : [];
  const references = Array.isArray(result.references) ? result.references : [];

  const sev = severityStyles[result.severity] || severityStyles.YELLOW;

  const handleShare = async () => {
    const shareText = [
      `[${result.severityLabel || sev.fallbackLabel}] ${result.injuryType}`,
      result.summary,
      "",
      language === "vi" ? "Các bước sơ cứu:" : "First-aid steps:",
      ...steps.map((s, i) => `${i + 1}. ${s}`),
      "",
      language === "vi" ? "KHÔNG được làm:" : "DO NOT do:",
      ...doNotDo.map((d) => `- ${d}`),
      "",
      result.disclaimer,
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: result.injuryType,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Ignore clipboard denial
      }
    }
  };

  return (
    <div className="rounded-lg border border-stone-200 bg-[#FAF8F4] p-5 sm:p-6 dark:border-slate-700 dark:bg-[#0E192C]">
      {/* Severity Header */}
      <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${sev.container}`}>
        <div className="flex items-center gap-2.5">
          {sev.icon}
          <div>
            <p className="text-sm font-bold tracking-tight">
              {result.severityLabel || sev.fallbackLabel}
            </p>
            <p className="text-xs opacity-90">{result.injuryType}</p>
          </div>
        </div>
        {(result.severity === "RED" || result.recommendHospital) && (
          <a
            href="tel:115"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 whitespace-nowrap shrink-0"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            {language === "vi" ? "Gọi 115 ngay" : "Call 115 Now"}
          </a>
        )}
      </div>

      {/* Preliminary Visual Findings (Image Analysis only) */}
      {isImageAnalysis(result) && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {language === "vi" ? "Nhận diện sơ bộ từ hình ảnh (không phải chẩn đoán)" : "Preliminary visual observation (non-diagnostic)"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            {result.preliminaryVisualFindings}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {result.confidenceNote}
          </p>
        </div>
      )}

      {/* Summary */}
      <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {result.summary}
      </p>

      {/* Ordered First Aid Steps */}
      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
        <h4 className="text-sm font-bold text-teal-800 dark:text-teal-300">
          {language === "vi" ? "Các bước sơ cứu theo thứ tự" : "Ordered First-Aid Steps"}
        </h4>
        <ol className="mt-3 space-y-2.5">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-50 font-mono text-xs font-semibold text-teal-800 tabular-nums dark:bg-teal-950 dark:text-teal-300">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Contraindications & Hospital Red Flags */}
      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 dark:border-slate-800">
        <div className="rounded-xl border border-rose-200/80 bg-rose-50/60 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
          <h4 className="flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-300">
            <XCircle className="h-4 w-4 shrink-0" />
            {language === "vi" ? "Những việc tuyệt đối không làm" : "What NOT To Do"}
          </h4>
          <ul className="mt-2.5 space-y-2 text-sm leading-relaxed text-rose-950 dark:text-rose-100">
            {doNotDo.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600 dark:bg-rose-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <h4 className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {language === "vi" ? "Khi nào cần đến bệnh viện ngay" : "When to Seek Immediate Hospital Care"}
          </h4>
          <ul className="mt-2.5 space-y-2 text-sm leading-relaxed text-amber-950 dark:text-amber-100">
            {whenToHospital.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hospital Recommendation Banner when YELLOW or RED */}
      {(result.recommendHospital || result.severity !== "GREEN") && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-900/60 dark:bg-red-950/35">
          <div className="text-sm font-medium text-red-900 dark:text-red-100">
            {language === "vi"
              ? "Khuyến cáo: Tổn thương từ mức trung bình trở lên cần được bác sĩ kiểm tra trực tiếp tại cơ sở y tế."
              : "Medical Advice: Moderate to severe injuries require direct examination at a hospital or clinic."}
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="tel:115"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 whitespace-nowrap shrink-0"
            >
              <PhoneCall className="h-4 w-4" />
              {language === "vi" ? "Gọi 115" : "Call 115"}
            </a>
            <button
              type="button"
              onClick={onFindHospital}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
            >
              <Hospital className="h-4 w-4 text-teal-700 dark:text-teal-400" />
              {language === "vi" ? "Tìm bệnh viện gần nhất" : "Nearest Hospital"}
            </button>
          </div>
        </div>
      )}

      {/* Action Footer & Medical References */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {language === "vi" ? "Nguồn tham khảo:" : "Sources:"}
          </span>
          {references.map((ref, idx) => {
            const safeUrl =
              typeof ref.url === "string" &&
              (ref.url.startsWith("https://") || ref.url.startsWith("http://"))
                ? ref.url
                : "https://www.who.int";
            return (
              <a
                key={idx}
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
              >
                <span>{ref.organization}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onAskFollowUp && (
            <button
              type="button"
              onClick={() =>
                onAskFollowUp(
                  language === "vi"
                    ? `Tôi vừa nhận phân tích sơ bộ về "${result.injuryType}" (${result.summary}). Tôi cần hỏi thêm chi tiết cách xử lý tiếp theo.`
                    : `I received preliminary analysis for "${result.injuryType}" (${result.summary}). I have follow-up questions.`
                )
              }
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 transition-colors hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-200 dark:hover:bg-teal-900/70 whitespace-nowrap shrink-0"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              {language === "vi" ? "Hỏi thêm về trường hợp này" : "Ask Follow-Up"}
            </button>
          )}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copied
              ? language === "vi"
                ? "Đã sao chép hướng dẫn"
                : "Copied"
              : language === "vi"
                ? "Chia sẻ hướng dẫn"
                : "Share Guide"}
          </button>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer */}
      <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {result.disclaimer}
      </p>
    </div>
  );
};
