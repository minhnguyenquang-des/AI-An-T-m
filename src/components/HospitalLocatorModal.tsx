import React, { useEffect, useState } from "react";
import { ExternalLink, Hospital, LocateFixed, PhoneCall, X } from "lucide-react";
import { EMERGENCY_HOSPITALS } from "../data/medicalContent";
import { Language } from "../types/triage";

interface HospitalLocatorModalProps {
  language: Language;
  onClose: () => void;
}

export const HospitalLocatorModal: React.FC<HospitalLocatorModalProps> = ({
  language,
  onClose,
}) => {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [mapsUrl, setMapsUrl] = useState<string>(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("bệnh viện cấp cứu gần nhất")}`
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(
        language === "vi"
          ? "Trình duyệt không hỗ trợ định vị. Bạn có thể mở Google Maps trực tiếp bên dưới."
          : "Geolocation is not supported by your browser."
      );
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps/search/${encodeURIComponent("bệnh viện cấp cứu")}/@${latitude},${longitude},14z`;
        setMapsUrl(url);
        setLocating(false);
      },
      () => {
        setGeoError(
          language === "vi"
            ? "Không thể truy cập vị trí GPS. Hãy nhấn mở Google Maps để tìm bệnh viện gần nhất."
            : "Location permission denied. Open Google Maps directly below."
        );
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Hospital className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {language === "vi"
                ? "Tìm bệnh viện gần nhất & Gọi cấp cứu"
                : "Find Nearest Hospital & Emergency Centers"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-6">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-900/60 dark:bg-teal-950/40">
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locating}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              <LocateFixed className="h-4 w-4" />
              {locating
                ? language === "vi"
                  ? "Đang lấy tọa độ GPS..."
                  : "Locating..."
                : language === "vi"
                ? "Xác định vị trí của tôi"
                : "Use My GPS Location"}
            </button>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <span>
                {language === "vi" ? "Mở Google Maps Bệnh viện" : "Open Hospitals in Maps"}
              </span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <a
              href="tel:115"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
            >
              <PhoneCall className="h-4 w-4" />
              {language === "vi" ? "Gọi 115 ngay" : "Call 115"}
            </a>
          </div>

          {geoError && (
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
              {geoError}
            </p>
          )}

          <div>
            <h4 className="text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400">
              {language === "vi"
                ? "Các bệnh viện tuyến đầu về Bỏng, Mắt & Chấn thương"
                : "Major Burn, Eye & Trauma Referral Centers"}
            </h4>
            <div className="mt-3 space-y-2.5">
              {EMERGENCY_HOSPITALS.map((h) => (
                <div
                  key={h.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-800"
                >
                  <div>
                    <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                      {h.city} · {h.specialty[language]}
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {h.name[language]}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{h.address}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${h.phone.replace(/\s+/g, "")}`}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 font-mono text-xs font-semibold text-slate-800 tabular-nums hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-red-600" />
                      {h.phone}
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.mapsQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-teal-300"
                    >
                      <span>{language === "vi" ? "Bản đồ" : "Map"}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
