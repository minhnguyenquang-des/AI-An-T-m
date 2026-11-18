import React, { useEffect, useState } from "react";
import { CheckCircle2, Mail, PhoneCall, X } from "lucide-react";
import { Language } from "../types/triage";

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; msg?: string }>({
    type: "idle",
  });
  const [infoModal, setInfoModal] = useState<"privacy" | "terms" | "sources" | null>(null);

  useEffect(() => {
    if (!infoModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInfoModal(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [infoModal]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language }),
      });
      const text = await res.text();
      let data: { message?: string } | null = null;
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { message?: string };
        } catch {
          data = null;
        }
      }
      if (!res.ok) {
        setStatus({
          type: "error",
          msg:
            data?.message ||
            (language === "vi" ? "Lỗi kết nối khi đăng ký." : "Subscription request failed."),
        });
      } else {
        setStatus({
          type: "success",
          msg:
            data?.message ||
            (language === "vi"
              ? "Đã đăng ký nhận thông báo an toàn."
              : "Subscribed to safety alerts."),
        });
        setEmail("");
      }
    } catch {
      setStatus({
        type: "error",
        msg: language === "vi" ? "Lỗi kết nối khi đăng ký." : "Subscription request failed.",
      });
    }
  };

  return (
    <footer className="border-t border-stone-300 bg-[#F2EFE9] pt-12 pb-8 dark:border-slate-800 dark:bg-[#060B14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand & Disclaimers */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-800 bg-[#0A1322] text-white dark:border-cyan-500/40">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
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
              <span className="font-display text-lg font-bold text-stone-900 dark:text-stone-50">
                AnTâm 115
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-stone-700 dark:text-stone-400">
              {language === "vi"
                ? "Cẩm nang sơ cứu chấn thương do pháo nhanh chóng, bình tĩnh và đúng chuẩn y khoa."
                : "Fast, calm, evidence-based temporary first-aid guidance for firework injuries."}
            </p>

            {/* Mandatory Disclaimers */}
            <div className="mt-4 space-y-2 border-t border-stone-300 pt-3 text-xs leading-relaxed text-stone-700 dark:border-slate-800 dark:text-stone-300">
              <p className="font-semibold text-red-800 dark:text-red-400">
                {language === "vi"
                  ? "Trang web chỉ cung cấp thông tin sơ cứu tham khảo. Không thay thế cho chẩn đoán và điều trị của bác sĩ. Trong trường hợp khẩn cấp, hãy gọi ngay 115."
                  : "This website provides reference first-aid information only. It does not replace medical diagnosis or treatment. In emergencies, call 115 immediately."}
              </p>
              <p>
                {language === "vi"
                  ? "Tính năng phân tích hình ảnh chỉ mang tính tham khảo sơ bộ. Kết quả không phải là chẩn đoán y khoa. Trong trường hợp khẩn cấp, hãy gọi ngay 115."
                  : "Image analysis provides preliminary orientation only. Results are not a medical diagnosis. Call 115 immediately in emergencies."}
              </p>
            </div>
          </div>

          {/* Quick Links & Emergency Numbers */}
          <div className="grid gap-8 sm:grid-cols-2 md:col-span-3">
            <div>
              <h3 className="text-xs font-bold tracking-wide text-stone-900 dark:text-stone-100">
                {language === "vi" ? "Liên kết & Pháp lý" : "Policy & Sources"}
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-stone-700 dark:text-stone-400">
                <li>
                  <button
                    type="button"
                    onClick={() => setInfoModal("privacy")}
                    className="underline-offset-4 hover:text-stone-950 hover:underline dark:hover:text-white"
                  >
                    {language === "vi" ? "Chính sách bảo mật ảnh" : "Photo Privacy Policy"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setInfoModal("terms")}
                    className="underline-offset-4 hover:text-stone-950 hover:underline dark:hover:text-white"
                  >
                    {language === "vi" ? "Điều khoản sử dụng" : "Terms of Use"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setInfoModal("sources")}
                    className="underline-offset-4 hover:text-stone-950 hover:underline dark:hover:text-white"
                  >
                    {language === "vi" ? "Nguồn y khoa tham khảo" : "Medical References"}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-wide text-stone-900 dark:text-stone-100">
                {language === "vi" ? "Đường dây khẩn cấp" : "Emergency Hotlines"}
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-stone-700 dark:text-stone-400">
                <li>
                  <a href="tel:115" className="inline-flex items-center gap-1.5 font-bold text-red-700 tabular-nums dark:text-red-400">
                    <PhoneCall className="h-3.5 w-3.5" />
                    115 ({language === "vi" ? "Cấp cứu Y tế" : "Medical EMS"})
                  </a>
                </li>
                <li>
                  <a href="tel:19009095" className="font-semibold text-stone-900 tabular-nums dark:text-stone-200">
                    1900 9095 ({language === "vi" ? "Bộ Y tế" : "Ministry of Health"})
                  </a>
                </li>
                <li>
                  <a href="tel:114" className="font-semibold text-stone-900 tabular-nums dark:text-stone-200">
                    114 ({language === "vi" ? "Cứu hỏa / Nổ" : "Fire & Rescue"})
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Safety Alerts Newsletter */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-bold tracking-wide text-stone-900 dark:text-stone-100">
              {language === "vi"
                ? "Đăng ký nhận thông báo an toàn"
                : "Subscribe to Safety Alerts"}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-stone-700 dark:text-stone-400">
              {language === "vi"
                ? "Nhận cẩm nang phòng chống tai nạn pháo và sơ cứu mùa lễ Tết."
                : "Receive seasonal firework safety updates and community first-aid checklists."}
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="min-h-[44px] w-full rounded-md border border-stone-300 bg-white pr-3 pl-9 text-xs text-stone-900 focus:border-stone-800 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100"
                />
              </div>
              <button
                type="submit"
                className="min-h-[44px] rounded-md bg-[#0A1322] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 whitespace-nowrap shrink-0"
              >
                {language === "vi" ? "Đăng ký" : "Subscribe"}
              </button>
            </form>
            {status.type === "success" && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-800 dark:text-teal-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{status.msg}</span>
              </p>
            )}
            {status.type === "error" && (
              <p className="mt-2 text-xs font-medium text-red-700 dark:text-red-400">
                {status.msg}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-stone-300 pt-6 text-xs text-stone-600 sm:flex-row sm:items-center dark:border-slate-800 dark:text-stone-400">
          <p>© {new Date().getFullYear()} AnTâm 115.</p>
        </div>
      </div>

      {/* Policy / Sources Info Modal */}
      {infoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setInfoModal(null);
          }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {infoModal === "privacy"
                  ? language === "vi"
                    ? "Chính sách bảo mật & Dữ liệu ảnh"
                    : "Photo Privacy Policy"
                  : infoModal === "terms"
                  ? language === "vi"
                    ? "Điều khoản sử dụng"
                    : "Terms of Use"
                  : language === "vi"
                  ? "Nguồn y khoa tham khảo"
                  : "Official Medical References"}
              </h3>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {infoModal === "privacy" && (
                <>
                  <p>
                    {language === "vi"
                      ? "Hình ảnh vết thương do bạn tải lên chỉ được gửi qua kết nối bảo mật để phân tích sơ bộ trong phiên hiện tại và không lưu trữ lâu dài trên máy chủ."
                      : "Uploaded wound photos are processed transiently via secure connection for immediate preliminary first-aid analysis and are not retained long-term."}
                  </p>
                  <p>
                    {language === "vi"
                      ? "Công cụ che/làm mờ tích hợp cho phép bạn ẩn khuôn mặt hoặc chi tiết cá nhân ngay trên thiết bị trước khi gửi."
                      : "Our built-in pixelation brush lets you blur faces or personal identifiers directly on your device prior to analysis."}
                  </p>
                </>
              )}
              {infoModal === "terms" && (
                <p>
                  {language === "vi"
                    ? "Mọi phản hồi văn bản và hình ảnh trên AnTâm 115 chỉ nhằm mục đích hỗ trợ sơ cứu tạm thời, không cấu thành hành nghề khám chữa bệnh hay chẩn đoán y khoa. Người dùng phải gọi 115 hoặc đến cơ sở y tế gần nhất trong mọi tình huống nặng hoặc nghi ngờ."
                    : "All text and image guidance on AnTâm 115 is strictly for temporary first-aid support and does not constitute medical diagnosis or treatment."}
                </p>
              )}
              {infoModal === "sources" && (
                <ul className="space-y-2 text-xs">
                  <li>• Tổ chức Y tế Thế giới (WHO) — Burn & Trauma First Aid Guidelines</li>
                  <li>• Bộ Y tế Việt Nam (moh.gov.vn) — Hướng dẫn cấp cứu chấn thương & bỏng</li>
                  <li>• Hội Chữ thập đỏ Quốc tế (IFRC) & Hội Chữ thập đỏ Việt Nam</li>
                  <li>• Nghị định 137/2020/NĐ-CP về quản lý, sử dụng pháo</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
