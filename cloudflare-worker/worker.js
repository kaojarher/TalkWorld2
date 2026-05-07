/**
 * TalkWorld × Cloudflare Worker — Anthropic API Proxy
 * 
 * 部署方式：
 *   1. 前往 https://workers.cloudflare.com/ 建立新 Worker
 *   2. 貼上此檔案內容
 *   3. 在 Workers > Settings > Variables 新增：
 *        ANTHROPIC_API_KEY = sk-ant-xxxxx（你的 API Key）
 *        ALLOWED_ORIGIN    = https://你的帳號.github.io（或 Vercel 網址）
 *   4. 在 talkworld 的 index.html 中把 PROXY_URL 改成你的 Worker 網址
 * 
 * Worker 網址格式：https://talkworld-proxy.你的帳號.workers.dev
 */

const ANTHROPIC_BASE = "https://api.anthropic.com";
const ANTHROPIC_VERSION = "2023-06-01";

export default {
  async fetch(request, env) {
    // ── CORS preflight ──────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return corsResponse(null, 204, env);
    }

    // ── 只允許 POST /v1/messages ─────────────────────────────────
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/v1/messages") {
      return corsResponse(JSON.stringify({ error: "Not found" }), 404, env);
    }

    // ── Origin 白名單（防止其他網站盜用你的 Key）────────────────
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";
    if (allowedOrigin !== "*" && !origin.startsWith(allowedOrigin)) {
      return corsResponse(JSON.stringify({ error: "Forbidden origin" }), 403, env);
    }

    // ── 讀取請求 body ────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse(JSON.stringify({ error: "Invalid JSON" }), 400, env);
    }

    // ── 安全過濾：確保只能呼叫允許的模型 ─────────────────────────
    const ALLOWED_MODELS = [
      "claude-3-5-haiku-20241022",
      "claude-3-5-sonnet-20241022",
      "claude-3-haiku-20240307",
      "claude-3-sonnet-20240229",
    ];
    if (!ALLOWED_MODELS.includes(body.model)) {
      body.model = "claude-3-5-haiku-20241022"; // 預設模型
    }

    // ── 轉送至 Anthropic ─────────────────────────────────────────
    const upstream = await fetch(`${ANTHROPIC_BASE}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
    });

    const upstreamText = await upstream.text();
    return corsResponse(upstreamText, upstream.status, env, upstream.headers.get("Content-Type"));
  },
};

function corsResponse(body, status, env, contentType = "application/json") {
  const allowedOrigin = env?.ALLOWED_ORIGIN || "*";
  const headers = {
    "Content-Type": contentType || "application/json",
    "Access-Control-Allow-Origin": allowedOrigin === "*" ? "*" : allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  return new Response(body, { status, headers });
}
