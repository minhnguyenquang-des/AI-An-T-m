import React, { useEffect, useRef, useState } from "react";
import { Eraser, EyeOff, RotateCcw, Save, X } from "lucide-react";
import { Language } from "../types/triage";

interface PrivacyMaskModalProps {
  imageUrl: string;
  language: Language;
  onClose: () => void;
  onSaveMasked: (maskedDataUrl: string) => void;
}

export const PrivacyMaskModal: React.FC<PrivacyMaskModalProps> = ({
  imageUrl,
  language,
  onClose,
  onSaveMasked,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushRadius, setBrushRadius] = useState(26);
  const [hasPainted, setHasPainted] = useState(false);

  const drawOriginalImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      const maxDim = 960;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setHasPainted(false);
    };
    img.src = imageUrl;
  };

  useEffect(() => {
    drawOriginalImage();
  }, [imageUrl]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const paintMosaicAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width <= 0 || canvas.height <= 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    const blockSize = 14;
    const startX = Math.max(0, Math.floor((x - brushRadius) / blockSize) * blockSize);
    const startY = Math.max(0, Math.floor((y - brushRadius) / blockSize) * blockSize);
    const endX = Math.min(canvas.width, x + brushRadius);
    const endY = Math.min(canvas.height, y + brushRadius);

    for (let bx = startX; bx < endX; bx += blockSize) {
      for (let by = startY; by < endY; by += blockSize) {
        const dx = bx + blockSize / 2 - x;
        const dy = by + blockSize / 2 - y;
        if (dx * dx + dy * dy <= brushRadius * brushRadius) {
          const w = Math.min(blockSize, canvas.width - bx);
          const h = Math.min(blockSize, canvas.height - by);
          if (w <= 0 || h <= 0) continue;
          const sampleX = Math.min(canvas.width - 1, Math.max(0, bx + Math.floor(w / 2)));
          const sampleY = Math.min(canvas.height - 1, Math.max(0, by + Math.floor(h / 2)));
          const pixel = ctx.getImageData(sampleX, sampleY, 1, 1).data;
          ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
          ctx.fillRect(bx, by, w, h);
        }
      }
    }
    setHasPainted(true);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    onSaveMasked(dataUrl);
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
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <EyeOff className="h-5 w-5 text-teal-700 dark:text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {language === "vi" ? "Làm mờ vùng riêng tư trước khi gửi" : "Blur Personal Areas Before Sending"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "vi"
                  ? "Kéo ngón tay hoặc chuột lên khuôn mặt, hình xăm hoặc đồ vật cá nhân để che mờ."
                  : "Drag over faces, tattoos, or personal items to pixelate them."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-100 p-4 dark:bg-slate-950">
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setIsDrawing(true);
              paintMosaicAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (isDrawing) paintMosaicAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => setIsDrawing(false)}
            onPointerCancel={() => setIsDrawing(false)}
            onPointerLeave={() => setIsDrawing(false)}
            className="max-h-[56vh] max-w-full cursor-crosshair touch-none rounded-lg border border-slate-300 dark:border-slate-700"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Eraser className="h-4 w-4 text-slate-500" />
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {language === "vi" ? "Cỡ cọ:" : "Brush:"}
            </label>
            <input
              type="range"
              min={12}
              max={52}
              value={brushRadius}
              onChange={(e) => setBrushRadius(Number(e.target.value))}
              className="w-28 accent-teal-700"
            />
            <button
              type="button"
              onClick={drawOriginalImage}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {language === "vi" ? "Khôi phục gốc" : "Reset"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {language === "vi" ? "Hủy" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasPainted}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {language === "vi" ? "Lưu ảnh đã che" : "Apply Blur"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
