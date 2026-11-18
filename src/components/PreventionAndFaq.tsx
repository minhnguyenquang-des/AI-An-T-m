import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Hospital,
  MapPin,
  PhoneCall,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { EMERGENCY_HOSPITALS, FAQ_ITEMS } from "../data/medicalContent";
import { Language } from "../types/triage";

interface PreventionAndFaqProps {
  language: Language;
  externalFaqId?: string | null;
  onFindHospital: () => void;
}

export const PreventionAndFaq: React.FC<PreventionAndFaqProps> = ({
  language,
  externalFaqId,
  onFindHospital,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  useEffect(() => {
    if (externalFaqId) {
      setOpenFaqId(externalFaqId);
    }
  }, [externalFaqId]);

  const preventionRules = [
    {
      title:
        language === "vi"
          ? "Không tự chế hoặc sử dụng pháo nổ trái phép"
          : "Never make or ignite illegal explosive fireworks",
      desc:
        language === "vi"
          ? "Hầu hết ca dập nát bàn tay và chấn thương mắt nặng xảy ra do pháo tự chế trộn thuốc nổ không ổn định."
          : "Most severe hand blast amputations and eye ruptures are caused by unstable homemade pyrotechnic mixtures.",
    },
    {
      title:
        language === "vi"
          ? "Giữ khoảng cách an toàn & không hướng về phía người"
          : "Maintain safe distance & never aim at people",
      desc:
        language === "vi"
          ? "Với pháo hoa không tiếng nổ hợp pháp, đặt thẳng đứng trên mặt phẳng cứng ngoài trời, cách xa nhà cửa, vật dễ cháy và trẻ em."
          : "For legal non-explosive consumer fireworks, place upright outdoors on a flat hard surface away from bystanders and buildings.",
    },
    {
      title:
        language === "vi"
          ? "Xử lý pháo xịt đúng cách: chờ 20 phút rồi dội nước"
          : "Dud firework protocol: wait 20 mins, then soak",
      desc:
        language === "vi"
          ? "Không bao giờ cúi mặt lại gần kiểm tra hoặc châm lại quả pháo không nổ. Chờ ít nhất 20 phút rồi đổ ngập nước."
          : "Never lean over or relight a dud firework. Wait at least 20 minutes and submerge it in a bucket of water.",
    },
    {
      title:
        language === "vi"
          ? "Trang bị kính bảo hộ & chuẩn bị sẵn xô nước"
          : "Wear eye protection & keep water nearby",
      desc:
        language === "vi"
          ? "Chuẩn bị sẵn xô nước sạch hoặc bình chữa cháy mini và đeo kính che mắt cho người trực tiếp châm ngòi."
          : "Keep a bucket of clean water or fire extinguisher on hand and wear safety glasses when lighting legal sparklers.",
    },
  ];

  return (
    <div className="divide-y divide-stone-300 dark:divide-slate-800">
      {/* Prevention & Legal Section */}
      <section id="prevention-section" className="bg-[#FAF8F4] py-14 sm:py-18 dark:bg-[#080E1A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-teal-800 uppercase dark:text-cyan-400">
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {language === "vi" ? "Phần III · Cảnh báo & Phòng tránh" : "Part III · Prevention & Safety"}
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
                {language === "vi"
                  ? "Phòng tránh tai nạn pháo nổ ngay từ đầu"
                  : "Preventing Firework Accidents Before They Happen"}
              </h2>

              <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {preventionRules.map((rule, i) => (
                  <div
                    key={i}
                    className="border-t border-stone-300 pt-4 dark:border-slate-800"
                  >
                    <span className="text-xs font-bold text-teal-800 tabular-nums dark:text-cyan-400">
                      0{i + 1}
                    </span>
                    <h3 className="mt-1.5 font-display text-base font-bold text-stone-900 dark:text-stone-100">
                      {rule.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-stone-700 dark:text-stone-400">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Legal Notice */}
            <div className="lg:col-span-5">
              <div className="rounded-lg border border-stone-300 bg-[#F2EFE9] p-6 dark:border-slate-700 dark:bg-[#0A1322]">
                <div className="flex items-center gap-2.5 border-b border-stone-300 pb-3 dark:border-slate-800">
                  <Scale className="h-4.5 w-4.5 text-teal-800 dark:text-cyan-400" />
                  <h3 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                    {language === "vi"
                      ? "Thông tin pháp lý về sử dụng pháo (Nghị định 137/2020/NĐ-CP)"
                      : "Firework Legal Framework (Decree 137/2020/ND-CP)"}
                  </h3>
                </div>
                <div className="mt-4 space-y-3 text-xs leading-relaxed text-stone-700 dark:text-slate-300">
                  <p>
                    {language === "vi"
                      ? "• Pháo hoa hợp pháp: Người dân có năng lực hành vi dân sự đầy đủ chỉ được mua và đốt pháo hoa không gây tiếng nổ do doanh nghiệp thuộc Bộ Quốc phòng sản xuất, kinh doanh hợp pháp."
                      : "• Legal consumer fireworks: Adults may only purchase and ignite non-explosive fireworks legally produced by authorized Ministry of Defense facilities."}
                  </p>
                  <p>
                    {language === "vi"
                      ? "• Nghiêm cấm tuyệt đối: Sản xuất, tự chế, mua bán, tàng trữ, vận chuyển hoặc đốt pháo nổ, pháo hoa nổ trái phép. Hành vi vi phạm có thể bị xử phạt hành chính hoặc truy cứu trách nhiệm hình sự."
                      : "• Strictly prohibited: Manufacturing, DIY mixing, trading, storing, or lighting illegal explosive firecrackers carries heavy administrative and criminal penalties."}
                  </p>
                  <p>
                    {language === "vi"
                      ? "• Trẻ em dưới 18 tuổi không được tự ý mua hoặc đốt pháo dưới mọi hình thức khi không có người lớn giám sát trực tiếp."
                      : "• Minors must never handle or ignite fireworks without direct adult supervision."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Emergency Contacts Section */}
      <section id="faq-emergency" className="bg-[#FAF8F4] py-14 sm:py-18 dark:bg-[#080E1A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* FAQ Hairline Ledger */}
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                {language === "vi" ? "Câu hỏi thường gặp" : "Frequently Asked Questions"}
              </h2>
              <div className="mt-5 divide-y divide-stone-300 border-y border-stone-300 dark:divide-slate-800 dark:border-slate-800">
                {FAQ_ITEMS.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="flex min-h-[52px] w-full items-center justify-between gap-4 py-4 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {faq.question[language]}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-stone-500 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="pb-4 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                          {faq.answer[language]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Directory */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-50">
                  {language === "vi"
                    ? "Liên hệ khẩn cấp & Bệnh viện"
                    : "Emergency Contacts & Hospitals"}
                </h2>
                <button
                  type="button"
                  onClick={onFindHospital}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md bg-[#0A1322] px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 whitespace-nowrap shrink-0"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {language === "vi" ? "Bản đồ gần nhất" : "Nearest Map"}
                </button>
              </div>

              <div className="mt-5 divide-y divide-stone-300 border-y border-stone-300 dark:divide-slate-800 dark:border-slate-800">
                {EMERGENCY_HOSPITALS.slice(0, 4).map((h) => (
                  <div key={h.id} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-teal-800 dark:text-cyan-400">
                          {h.city} · {h.specialty[language]}
                        </p>
                        <h3 className="mt-0.5 font-display text-sm font-bold text-stone-900 dark:text-stone-100">
                          {h.name[language]}
                        </h3>
                        <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                          {h.address}
                        </p>
                      </div>
                      <Hospital className="h-4 w-4 shrink-0 text-stone-400" />
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      <a
                        href={`tel:${h.phone.replace(/\s+/g, "")}`}
                        className="inline-flex min-h-[34px] items-center gap-1.5 rounded-md border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold text-stone-900 tabular-nums hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-stone-100"
                      >
                        <PhoneCall className="h-3.5 w-3.5 text-red-700 dark:text-red-400" />
                        {h.phone}
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.mapsQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[34px] items-center gap-1 text-xs font-semibold text-teal-800 underline-offset-4 hover:underline dark:text-cyan-400"
                      >
                        <span>{language === "vi" ? "Chỉ đường" : "Directions"}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
