import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  handleNewsletterSubscription,
  runChatTriage,
  runImageTriage,
} from "./server/triageService.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", runtime: "express", timestamp: new Date().toISOString() });
});

app.post("/api/triage/chat", async (req, res) => {
  const result = await runChatTriage(req.body ?? {});
  if (!result.ok) {
    return res
      .status(result.error.status)
      .json({
        error: result.error.error,
        message: result.error.message,
        detail: result.error.detail,
      });
  }
  return res.json(result.data);
});

app.post("/api/triage/image", async (req, res) => {
  const result = await runImageTriage(req.body ?? {});
  if (!result.ok) {
    return res
      .status(result.error.status)
      .json({
        error: result.error.error,
        message: result.error.message,
        detail: result.error.detail,
      });
  }
  return res.json(result.data);
});

app.post("/api/newsletter", (req, res) => {
  const result = handleNewsletterSubscription(req.body ?? {});
  if (!result.ok) {
    return res
      .status(result.error.status)
      .json({ error: result.error.error, message: result.error.message });
  }
  return res.json({ ok: true, message: result.message });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AnTâm 115 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
