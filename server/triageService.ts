import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

export type TriageLanguage = "vi" | "en";
export type TriageSeverity = "RED" | "YELLOW" | "GREEN";

export interface MedicalReference {
  title: string;
  organization: string;
  url: string;
}

export interface NormalizedTriageResponse {
  severity: TriageSeverity;
  severityLabel: string;
  injuryType: string;
  summary: string;
  steps: string[];
  doNotDo: string[];
  whenToHospital: string[];
  recommendHospital: boolean;
  references: MedicalReference[];
  disclaimer: string;
}

export interface NormalizedImageAnalysisResponse extends NormalizedTriageResponse {
  preliminaryVisualFindings: string;
  confidenceNote: string;
}

export interface TriageServiceErrorPayload {
  status: number;
  error: string;
  message: string;
  detail?: string;
}

const DEFAULT_REFERENCES: MedicalReference[] = [
  {
    title: "WHO Burn & Trauma First Aid Guidance",
    organization: "WHO",
    url: "https://www.who.int",
  },
  {
    title: "Cổng thông tin Bộ Y tế Việt Nam",
    organization: "Bộ Y tế Việt Nam",
    url: "https://moh.gov.vn",
  },
  {
    title: "Hội Chữ thập đỏ Việt Nam",
    organization: "Hội Chữ thập đỏ",
    url: "https://redcross.org.vn",
  },
];

const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const PRIMARY_MODEL = "gemini-4-hydrogen";
const FALLBACK_MODEL = "gemini-3.1-flash-lite";
const PRIMARY_TIMEOUT_MS = 6000;

function isTransientHighDemandError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg === "PRIMARY_MODEL_TIMEOUT" ||
    msg.includes("503") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("high demand") ||
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED")
  );
}

function callWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("PRIMARY_MODEL_TIMEOUT")), ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function generateWithModelFallback(
  ai: GoogleGenAI,
  request: {
    contents: unknown;
    config: Record<string, unknown>;
  }
) {
  const attempts: Array<{ model: string; delayMs: number; timeoutMs: number; useLowThinking: boolean }> = [
    { model: PRIMARY_MODEL, delayMs: 0, timeoutMs: PRIMARY_TIMEOUT_MS, useLowThinking: true },
    { model: FALLBACK_MODEL, delayMs: 250, timeoutMs: 7000, useLowThinking: false },
    { model: FALLBACK_MODEL, delayMs: 900, timeoutMs: 8000, useLowThinking: false },
    { model: PRIMARY_MODEL, delayMs: 1200, timeoutMs: 8000, useLowThinking: true },
  ];

  let lastErr: unknown;
  for (const attempt of attempts) {
    if (attempt.delayMs > 0) {
      await new Promise((r) => setTimeout(r, attempt.delayMs));
    }
    try {
      const cfg = attempt.useLowThinking
        ? { ...request.config, thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
        : request.config;
      return await callWithTimeout(
        ai.models.generateContent({
          model: attempt.model,
          contents: request.contents as never,
          config: cfg as never,
        }),
        attempt.timeoutMs
      );
    } catch (err) {
      lastErr = err;
      if (!isTransientHighDemandError(err)) {
        throw err;
      }
      console.warn(
        `[AnTâm 115] ${attempt.model} transient error, continuing fallback/retry:`,
        err instanceof Error ? err.message : String(err)
      );
    }
  }
  throw lastErr;
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const triageResponseSchema = {
  type: Type.OBJECT,
  properties: {
    severity: {
      type: Type.STRING,
      description: "Must be exactly one of: RED, YELLOW, GREEN",
    },
    severityLabel: {
      type: Type.STRING,
      description: "Short severity badge text in the requested language.",
    },
    injuryType: {
      type: Type.STRING,
      description: "Preliminary injury category or situation identified.",
    },
    summary: {
      type: Type.STRING,
      description: "Concise 1-2 sentence clinical triage summary.",
    },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Ordered, actionable immediate first-aid steps (3 to 6 steps).",
    },
    doNotDo: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Critical contraindications / things strictly NOT to do (3 to 5 items).",
    },
    whenToHospital: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Red-flag signs requiring immediate hospital care or calling 115 (3 to 5 items).",
    },
    recommendHospital: {
      type: Type.BOOLEAN,
      description: "True whenever severity is YELLOW or RED, or if any medical uncertainty exists.",
    },
    references: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          organization: { type: Type.STRING },
          url: { type: Type.STRING },
        },
        required: ["title", "organization", "url"],
      },
      description: "2 to 3 official medical guideline references (WHO, Vietnam Ministry of Health, Red Cross).",
    },
    disclaimer: {
      type: Type.STRING,
      description: "Mandatory reminder that this is temporary first-aid guidance only, not a medical diagnosis.",
    },
  },
  required: [
    "severity",
    "severityLabel",
    "injuryType",
    "summary",
    "steps",
    "doNotDo",
    "whenToHospital",
    "recommendHospital",
    "references",
    "disclaimer",
  ],
};

const imageAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    ...triageResponseSchema.properties,
    preliminaryVisualFindings: {
      type: Type.STRING,
      description:
        "Objective, cautious visual description of what appears in the photo(s) without claiming certainty or definitive diagnosis.",
    },
    confidenceNote: {
      type: Type.STRING,
      description:
        "Brief caveat explaining visual limitations (lighting, angle, depth cannot be measured from a photo) and why physician exam is needed.",
    },
  },
  required: [
    ...triageResponseSchema.required,
    "preliminaryVisualFindings",
    "confidenceNote",
  ],
};

function buildChatSystemInstruction(language: TriageLanguage): string {
  if (language === "en") {
    return `You are an evidence-based emergency first-aid triage assistant specializing in firework and pyrotechnic injuries (thermal/chemical burns, open blast wounds, bleeding, eye trauma, acoustic ear injury, fractures, shock, smoke inhalation).
Respond strictly in English.
Safety & Medical Rules:
1. NEVER diagnose definitively or prescribe prescription drugs/dosages. State clearly this is temporary first-aid guidance only.
2. Assign severity conservatively:
   - RED: Life-threatening, airway/breathing compromise, severe bleeding, eye penetration/chemical splash, deep/large burns, burns on face/hands/genitals/joints, unconsciousness, shock, amputation/blast trauma.
   - YELLOW: Moderate burns (blistering), moderate cuts, persistent ear pain/ringing, mild smoke cough, uncertain depth.
   - GREEN: Very minor superficial redness (<2cm, intact skin, no face/eye/hand involvement).
3. ALWAYS set recommendHospital = true whenever severity is YELLOW or RED.
4. Keep first-aid steps practical, calm, numbered in sequence, following WHO, IFRC (Red Cross), and Vietnam Ministry of Health trauma standards (e.g., cool burns with cool running water 15-20 mins, NEVER apply toothpaste/fish sauce/ice/oil; NEVER rub or press injured eyes; apply direct firm pressure for bleeding; do NOT remove deeply embedded fragments).
5. Always provide real official reference links (e.g. https://www.who.int, https://moh.gov.vn, https://redcross.org.vn).`;
  }

  return `Bạn là trợ lý điều phối sơ cứu y khoa dựa trên bằng chứng, chuyên về tai nạn và chấn thương do pháo (bỏng nhiệt/hóa chất, vết thương hở chảy máu, chấn thương mắt, chấn thương tai/thính lực, gãy xương lực nổ, sốc/bất tỉnh, ngộ độc khói/bụi pháo).
Trả lời hoàn toàn bằng Tiếng Việt rõ ràng, bình tĩnh, dễ đọc trong tình huống khẩn cấp.
Quy tắc an toàn y khoa bắt buộc:
1. TUYỆT ĐỐI KHÔNG chẩn đoán xác định thay bác sĩ và không kê đơn thuốc uống. Luôn nhấn mạnh đây chỉ là hướng dẫn sơ cứu tạm thời.
2. Phân loại mức độ nghiêm trọng thận trọng:
   - RED (Đỏ - Khẩn cấp): Đe dọa tính mạng, khó thở/ngạt khói, chảy máu ồ ạt, chấn thương mắt/hóa chất bắn vào mắt, bỏng sâu hoặc diện rộng, bỏng ở mặt/bàn tay/bộ phận sinh dục/khớp, bất tỉnh/sốc, dập nát chi/mảnh pháo găm sâu.
   - YELLOW (Vàng - Trung bình): Bỏng phồng rộp diện tích nhỏ, vết cắt vừa, ù tai/đau tai kéo dài, ho do hít khói nhẹ, hoặc chưa rõ độ sâu tổn thương.
   - GREEN (Xanh - Nhẹ): Chỉ đỏ rát nông rất nhỏ (<2cm, còn nguyên da, không ở mặt/mắt/tay/khớp).
3. LUÔN đặt recommendHospital = true khi mức độ là YELLOW hoặc RED.
4. Hướng dẫn sơ cứu thực tế, đúng chuẩn Bộ Y tế, Hội Chữ thập đỏ, WHO (ví dụ: làm mát vết bỏng dưới vòi nước sạch mát 15-20 phút, TUYỆT ĐỐI không bôi kem đánh răng/nước mắm/mỡ trăn/đá lạnh; không dụi hoặc đè ép lên mắt bị thương; ép trực tiếp cầm máu; không tự ý rút dị vật găm sâu).
5. Cung cấp nguồn tham khảo chính thức (https://moh.gov.vn, https://www.who.int, https://redcross.org.vn).`;
}

function buildImageSystemInstruction(language: TriageLanguage): string {
  const base = buildChatSystemInstruction(language);
  if (language === "en") {
    return `${base}
Additional Multimodal Image Rules:
- You are analyzing one or more photos uploaded by a user during a possible firework injury.
- Provide ONLY a preliminary visual classification (e.g., "Suspected superficial/partial-thickness burn", "Possible open laceration with active bleeding", "Unclear / obscured view").
- NEVER claim a definitive medical diagnosis from a photograph.
- If the image is blurry, too dark, not a human injury, or obstructed, clearly note this in preliminaryVisualFindings and confidenceNote, recommend re-capturing with clear light or consulting a physician, and provide safe general guidance based on the user's description.
- Always advise calling 115 or visiting the nearest hospital for moderate or severe findings.`;
  }
  return `${base}
Quy tắc bổ sung khi phân tích hình ảnh vết thương:
- Bạn đang xem xét một hoặc nhiều ảnh người dùng chụp vùng nghi chấn thương do pháo.
- Chỉ đưa ra NHẬN DIỆN SƠ BỘ bề mặt (ví dụ: "Nghi ngờ bỏng độ 2 có phồng rộp", "Vết thương hở có chảy máu", "Hình ảnh mờ/thiếu sáng chưa thể đánh giá rõ").
- TUYỆT ĐỐI KHÔNG khẳng định chẩn đoán y khoa chắc chắn chỉ qua ảnh.
- Nếu ảnh bị mờ, thiếu sáng, bị che khuất hoặc không phải ảnh vết thương: hãy nêu rõ trong preliminaryVisualFindings và confidenceNote, hướng dẫn chụp lại rõ sáng hoặc đưa đến cơ sở y tế, đồng thời dựa vào mô tả (nếu có) để hỗ trợ sơ cứu an toàn.
- Luôn khuyến cáo gọi 115 hoặc đến cơ sở y tế ngay nếu nghi ngờ tổn thương từ trung bình đến nặng.`;
}

function extractJsonObject(rawText: string): Record<string, unknown> {
  const trimmed = rawText.trim();
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(unfenced);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    const firstBrace = unfenced.indexOf("{");
    const lastBrace = unfenced.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const sliced = unfenced.slice(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(sliced);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    }
  }
  throw new Error("INVALID_AI_JSON_RESPONSE");
}

function sanitizeStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

function sanitizeHttpUrl(url: unknown): string {
  if (typeof url !== "string") return "https://www.who.int";
  const trimmed = url.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }
  return "https://www.who.int";
}

function normalizeTriageResponse(
  raw: Record<string, unknown>,
  language: TriageLanguage
): NormalizedTriageResponse {
  const rawSeverity =
    typeof raw.severity === "string" ? raw.severity.trim().toUpperCase() : "YELLOW";
  const severity: TriageSeverity =
    rawSeverity === "RED" || rawSeverity === "YELLOW" || rawSeverity === "GREEN"
      ? rawSeverity
      : "YELLOW";

  const defaultLabels: Record<TriageSeverity, string> =
    language === "en"
      ? {
          RED: "RED — Emergency",
          YELLOW: "YELLOW — Urgent Care",
          GREEN: "GREEN — Minor",
        }
      : {
          RED: "Mức độ ĐỎ — Khẩn cấp",
          YELLOW: "Mức độ VÀNG — Cần theo dõi",
          GREEN: "Mức độ XANH — Nhẹ",
        };

  const refsRaw = Array.isArray(raw.references) ? raw.references : [];
  const references: MedicalReference[] = refsRaw
    .map((r) => {
      if (!r || typeof r !== "object") return null;
      const obj = r as Record<string, unknown>;
      const title = typeof obj.title === "string" ? obj.title.trim() : "";
      const organization =
        typeof obj.organization === "string" ? obj.organization.trim() : "";
      if (!title || !organization) return null;
      return {
        title,
        organization,
        url: sanitizeHttpUrl(obj.url),
      };
    })
    .filter((item): item is MedicalReference => item !== null);

  return {
    severity,
    severityLabel:
      typeof raw.severityLabel === "string" && raw.severityLabel.trim()
        ? raw.severityLabel.trim()
        : defaultLabels[severity],
    injuryType:
      typeof raw.injuryType === "string" && raw.injuryType.trim()
        ? raw.injuryType.trim()
        : language === "en"
        ? "Firework-related injury triage"
        : "Phân loại chấn thương do pháo",
    summary:
      typeof raw.summary === "string" && raw.summary.trim()
        ? raw.summary.trim()
        : language === "en"
        ? "Follow immediate first-aid steps carefully and seek medical evaluation."
        : "Thực hiện sơ cứu tạm thời đúng cách và theo dõi dấu hiệu cần đi viện.",
    steps: sanitizeStringArray(raw.steps),
    doNotDo: sanitizeStringArray(raw.doNotDo),
    whenToHospital: sanitizeStringArray(raw.whenToHospital),
    recommendHospital:
      severity === "RED" || severity === "YELLOW" ? true : Boolean(raw.recommendHospital),
    references: references.length > 0 ? references : DEFAULT_REFERENCES,
    disclaimer:
      typeof raw.disclaimer === "string" && raw.disclaimer.trim()
        ? raw.disclaimer.trim()
        : language === "en"
        ? "Temporary first-aid guidance only. Not a medical diagnosis. Call 115 in emergencies."
        : "Thông tin chỉ mang tính hướng dẫn sơ cứu tạm thời, không thay thế chẩn đoán bác sĩ. Gọi 115 khi khẩn cấp.",
  };
}

export function mapGeminiError(
  err: unknown,
  language: TriageLanguage
): TriageServiceErrorPayload {
  console.error("Gemini API error:", err);
  const rawMsg = err instanceof Error ? err.message : String(err);
  const msg = rawMsg.replace(/AIza[0-9A-Za-z_-]{20,}/g, "[REDACTED]").slice(0, 240);

  if (
    msg === "MISSING_API_KEY" ||
    msg.includes("API_KEY_INVALID") ||
    msg.includes("PERMISSION_DENIED")
  ) {
    return {
      status: 500,
      error: "GEMINI_API_CONFIG_ERROR",
      message:
        language === "en"
          ? "AI service key is missing or invalid. Please configure GEMINI_API_KEY in environment settings."
          : "Khóa dịch vụ AI (GEMINI_API_KEY) chưa được cấu hình hoặc không hợp lệ.",
      detail: msg,
    };
  }

  if (
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("503") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("high demand") ||
    msg === "PRIMARY_MODEL_TIMEOUT"
  ) {
    return {
      status: 503,
      error: "SERVICE_TEMPORARILY_BUSY",
      message:
        language === "en"
          ? "AI service is experiencing temporary high demand. Please retry in a few seconds, or call 115 immediately for emergencies."
          : "Hệ thống AI đang có lượng truy cập cao tạm thời. Vui lòng thử lại sau vài giây, hoặc gọi ngay 115 nếu khẩn cấp.",
      detail: msg,
    };
  }

  return {
    status: 502,
    error: "AI_SERVICE_ERROR",
    message:
      language === "en"
        ? "Could not complete AI analysis right now. Please follow the vetted injury guide below or call 115."
        : "Không thể kết nối phân tích AI lúc này. Vui lòng xem hướng dẫn sơ cứu chuẩn bên dưới hoặc gọi 115.",
    detail: msg,
  };
}

export async function runChatTriage(input: {
  message?: unknown;
  history?: unknown;
  language?: unknown;
}): Promise<
  | { ok: true; data: NormalizedTriageResponse }
  | { ok: false; error: TriageServiceErrorPayload }
> {
  const language: TriageLanguage = input.language === "en" ? "en" : "vi";
  try {
    const message = typeof input.message === "string" ? input.message.trim() : "";
    const history = Array.isArray(input.history) ? input.history : [];

    if (!message) {
      return {
        ok: false,
        error: {
          status: 400,
          error: "INVALID_INPUT",
          message:
            language === "en"
              ? "Please describe the injury or situation."
              : "Vui lòng nhập mô tả tình huống chấn thương.",
        },
      };
    }

    const ai = getGeminiClient();

    const conversationContext = history
      .slice(-6)
      .map((item: { role?: unknown; text?: unknown }) => {
        const role = item?.role === "user" ? "User" : "Assistant";
        const text = typeof item?.text === "string" ? item.text.slice(0, 600) : "";
        return `${role}: ${text}`;
      })
      .join("\n");

    const promptText = conversationContext
      ? `Previous context:\n${conversationContext}\n\nCurrent question:\n${message}`
      : message;

    const response = await generateWithModelFallback(ai, {
      contents: promptText,
      config: {
        systemInstruction: buildChatSystemInstruction(language),
        responseMimeType: "application/json",
        responseSchema: triageResponseSchema,
      },
    });

    const parsed = extractJsonObject(response.text ?? "{}");
    return {
      ok: true,
      data: normalizeTriageResponse(parsed, language),
    };
  } catch (err) {
    return {
      ok: false,
      error: mapGeminiError(err, language),
    };
  }
}

export async function runImageTriage(input: {
  images?: unknown;
  description?: unknown;
  privacyMasked?: unknown;
  language?: unknown;
}): Promise<
  | { ok: true; data: NormalizedImageAnalysisResponse }
  | { ok: false; error: TriageServiceErrorPayload }
> {
  const language: TriageLanguage = input.language === "en" ? "en" : "vi";
  try {
    const rawImages = Array.isArray(input.images) ? input.images : [];
    const description =
      typeof input.description === "string" ? input.description.trim().slice(0, 1500) : "";
    const privacyMasked = Boolean(input.privacyMasked);

    const imageParts = rawImages
      .slice(0, 4)
      .map((img: { base64?: unknown; mimeType?: unknown }) => {
        const rawBase64 = typeof img?.base64 === "string" ? img.base64.trim() : "";
        const cleanedBase64 = rawBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
        const rawMime =
          typeof img?.mimeType === "string" ? img.mimeType.trim().toLowerCase() : "image/jpeg";
        const mimeType = ALLOWED_IMAGE_MIMES.has(rawMime)
          ? rawMime === "image/jpg"
            ? "image/jpeg"
            : rawMime
          : "image/jpeg";

        if (!cleanedBase64) return null;
        return {
          inlineData: {
            mimeType,
            data: cleanedBase64,
          },
        };
      })
      .filter((part): part is { inlineData: { mimeType: string; data: string } } => part !== null);

    if (imageParts.length === 0) {
      return {
        ok: false,
        error: {
          status: 400,
          error: "NO_IMAGES",
          message:
            language === "en"
              ? "Please upload or capture at least one valid photo for preliminary assessment."
              : "Vui lòng tải lên hoặc chụp ít nhất 1 ảnh hợp lệ để phân tích sơ bộ.",
        },
      };
    }

    const ai = getGeminiClient();

    const textPrompt =
      language === "en"
        ? `Please perform a cautious, non-diagnostic preliminary first-aid triage of the uploaded firework-related injury image(s).
User description: ${description || "No extra description provided."}
Privacy masking applied by user: ${privacyMasked ? "Yes (some background/non-wound areas may be intentionally blurred/covered)" : "No"}.`
        : `Hãy thực hiện phân loại sơ bộ và hướng dẫn sơ cứu tạm thời (không thay thế chẩn đoán bác sĩ) cho hình ảnh chấn thương nghi do pháo được cung cấp.
Mô tả thêm từ người dùng: ${description || "Không có mô tả thêm."}
Người dùng đã che/làm mờ vùng không liên quan: ${privacyMasked ? "Có (một số vùng xung quanh có thể đã được làm mờ để bảo mật)" : "Không"}.`;

    const response = await generateWithModelFallback(ai, {
      contents: {
        parts: [...imageParts, { text: textPrompt }],
      },
      config: {
        systemInstruction: buildImageSystemInstruction(language),
        responseMimeType: "application/json",
        responseSchema: imageAnalysisSchema,
      },
    });

    const parsed = extractJsonObject(response.text ?? "{}");
    const baseNormalized = normalizeTriageResponse(parsed, language);

    return {
      ok: true,
      data: {
        ...baseNormalized,
        preliminaryVisualFindings:
          typeof parsed.preliminaryVisualFindings === "string" &&
          parsed.preliminaryVisualFindings.trim()
            ? parsed.preliminaryVisualFindings.trim()
            : language === "en"
            ? "Preliminary visual review completed; lighting and depth cannot be confirmed from a photo."
            : "Đã xem xét sơ bộ bề mặt ảnh; không thể đánh giá chính xác độ sâu tổn thương qua hình ảnh.",
        confidenceNote:
          typeof parsed.confidenceNote === "string" && parsed.confidenceNote.trim()
            ? parsed.confidenceNote.trim()
            : language === "en"
            ? "Photos have limited depth and lighting accuracy. A physician must examine the wound in person."
            : "Hình ảnh có giới hạn về ánh sáng và độ sâu. Bác sĩ cần thăm khám trực tiếp để chẩn đoán chính xác.",
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: mapGeminiError(err, language),
    };
  }
}

const subscribedEmails = new Set<string>();

export function handleNewsletterSubscription(input: {
  email?: unknown;
  language?: unknown;
}):
  | { ok: true; message: string }
  | { ok: false; error: TriageServiceErrorPayload } {
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const language: TriageLanguage = input.language === "en" ? "en" : "vi";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: "INVALID_EMAIL",
        message:
          language === "en"
            ? "Please enter a valid email address."
            : "Vui lòng nhập địa chỉ email hợp lệ.",
      },
    };
  }

  subscribedEmails.add(email);
  return {
    ok: true,
    message:
      language === "en"
        ? "Subscribed to firework safety & first-aid updates."
        : "Đã đăng ký nhận thông báo an toàn phòng chống tai nạn pháo.",
  };
}
