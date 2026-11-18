import {
  handleNewsletterSubscription,
  runChatTriage,
  runImageTriage,
} from "../../server/triageService.ts";

const JSON_HEADERS: Record<string, string> = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS,
  });
}

function normalizeEndpoint(pathname: string): string {
  return pathname
    .replace(/^\/\.netlify\/functions\/api/, "")
    .replace(/^\/api/, "")
    .replace(/\/+$/, "") || "/";
}

async function readJsonBody(req: Request): Promise<Record<string, unknown> | null> {
  const raw = await req.text();
  if (!raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const url = new URL(req.url);
  const route = normalizeEndpoint(url.pathname);

  if (route === "/health" && req.method === "GET") {
    return jsonResponse({
      status: "ok",
      runtime: "netlify-functions",
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        error: "METHOD_NOT_ALLOWED",
        message: "Method not allowed.",
      },
      405
    );
  }

  const body = await readJsonBody(req);
  if (body === null) {
    return jsonResponse(
      {
        error: "INVALID_JSON",
        message: "Invalid JSON request body.",
      },
      400
    );
  }

  if (route === "/triage/chat") {
    const result = await runChatTriage(body);
    if (!result.ok) {
      return jsonResponse(
        { error: result.error.error, message: result.error.message },
        result.error.status
      );
    }
    return jsonResponse(result.data, 200);
  }

  if (route === "/triage/image") {
    const result = await runImageTriage(body);
    if (!result.ok) {
      return jsonResponse(
        { error: result.error.error, message: result.error.message },
        result.error.status
      );
    }
    return jsonResponse(result.data, 200);
  }

  if (route === "/newsletter") {
    const result = handleNewsletterSubscription(body);
    if (!result.ok) {
      return jsonResponse(
        { error: result.error.error, message: result.error.message },
        result.error.status
      );
    }
    return jsonResponse({ ok: true, message: result.message }, 200);
  }

  return jsonResponse(
    {
      error: "NOT_FOUND",
      message: "API endpoint not found.",
    },
    404
  );
}
