const express = require("express");
const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const VOICEVOX_URL = String(process.env.VOICEVOX_URL || "").trim().replace(/\/+$/, "");
const VOICEVOX_FEMALE_ID = Number(process.env.VOICEVOX_FEMALE_ID || 2);
const VOICEVOX_MALE_ID = Number(process.env.VOICEVOX_MALE_ID || 13);
const app = express();
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => res.json({
  status: "ok", service: "jft-kanji-colorful", runtime: "nodejs",
  voicevoxConfigured: Boolean(VOICEVOX_URL)
}));

// Proxy synthesis through Node to avoid browser-side VOICEVOX CORS restrictions.
// VOICEVOX Engine must be hosted separately and set in Render as VOICEVOX_URL.
app.post("/api/voicevox/synthesize", async (req, res) => {
  if (!VOICEVOX_URL) return res.status(503).json({
    error: "VOICEVOX belum dikonfigurasi.",
    hint: "Set environment variable VOICEVOX_URL ke URL VOICEVOX Engine yang bisa dijangkau server."
  });
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const role = req.body?.role === "male" ? "male" : "female";
  const rate = Number(req.body?.rate ?? 0.86);
  if (!text || text.length > 2000) return res.status(400).json({ error: "Teks audio wajib diisi dan maksimal 2000 karakter." });
  if (!Number.isFinite(rate) || rate < 0.5 || rate > 2) return res.status(400).json({ error: "Rate audio harus berada di antara 0.5 dan 2." });

  const speakerId = role === "male" ? VOICEVOX_MALE_ID : VOICEVOX_FEMALE_ID;
  const withTimeout = (ms) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return { signal: controller.signal, clear: () => clearTimeout(timer) };
  };
  try {
    const queryTimeout = withTimeout(45000);
    let queryResponse;
    try {
      const queryUrl = new URL(`${VOICEVOX_URL}/audio_query`);
      queryUrl.searchParams.set("text", text);
      queryUrl.searchParams.set("speaker", String(speakerId));
      queryResponse = await fetch(queryUrl, { method: "POST", signal: queryTimeout.signal });
    } finally { queryTimeout.clear(); }
    if (!queryResponse.ok) return res.status(502).json({ error: `VOICEVOX audio_query gagal (${queryResponse.status}).` });
    const query = await queryResponse.json();
    query.speedScale = rate;

    const synthesisTimeout = withTimeout(90000);
    let audioResponse;
    try {
      audioResponse = await fetch(`${VOICEVOX_URL}/synthesis?speaker=${encodeURIComponent(speakerId)}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query), signal: synthesisTimeout.signal
      });
    } finally { synthesisTimeout.clear(); }
    if (!audioResponse.ok) return res.status(502).json({ error: `VOICEVOX synthesis gagal (${audioResponse.status}).` });
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    res.setHeader("Content-Type", audioResponse.headers.get("content-type") || "audio/wav");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(audioBuffer);
  } catch (error) {
    const timedOut = error?.name === "AbortError";
    console.error("VOICEVOX proxy error:", error?.message || error);
    return res.status(timedOut ? 504 : 502).json({ error: timedOut ? "VOICEVOX timeout." : "Tidak dapat menghubungi VOICEVOX Engine." });
  }
});

// Serve existing website files unchanged.
app.use(express.static(ROOT_DIR, { index: "index.html", extensions: ["html"], dotfiles: "ignore" }));
// Render/local Node starts a persistent HTTP server; Vercel imports the app as a serverless function.
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => console.log(`JFT-Basic website is running on port ${PORT}`));
}

module.exports = app;
