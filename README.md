# TalkWorld 🌿 — AI 角色扮演聊天室

> 一個可自訂 AI 角色、群聊、世界觀與故事生成的本地端 Web App。

---

## 🚀 快速部署（GitHub Pages）

### 步驟 1：Fork 此 Repo

點右上角 **Fork** → 複製到自己的帳號。

### 步驟 2：啟用 GitHub Pages

1. 進入你的 Repo → **Settings** → **Pages**
2. Source 選 **GitHub Actions**
3. Push 任何 commit 即自動部署

你的網址會是：`https://你的帳號.github.io/talkworld`

---

## 🤖 AI 模式說明

### 模式 A：Puter.js（預設，完全免費）

- 不需要 API Key
- 需要使用者登入 [puter.com](https://puter.com) 帳號
- 適合個人使用

### 模式 B：Cloudflare Worker Proxy（自主控制）

部署在 HTTPS 網域後，可加一個免費的 Cloudflare Worker 做 proxy，讓你用自己的 Anthropic API Key，不需要任何人登入 Puter。

---

## ☁️ Cloudflare Worker 部署（選用）

### 步驟 1：建立 Worker

1. 前往 [workers.cloudflare.com](https://workers.cloudflare.com/)
2. 建立新 Worker（免費帳號每天 100,000 次請求）
3. 貼上 `cloudflare-worker/worker.js` 的內容

### 步驟 2：設定環境變數

在 Worker 的 **Settings → Variables** 中新增：

| 變數名稱 | 說明 |
|---|---|
| `ANTHROPIC_API_KEY` | 你的 Anthropic API Key（`sk-ant-...`） |
| `ALLOWED_ORIGIN` | 你的 GitHub Pages 網址（如 `https://你的帳號.github.io`） |

### 步驟 3：在 TalkWorld 設定中填入 Worker 網址

打開 TalkWorld → ⚙️ 設定 → 填入 Worker 網址：

```
https://talkworld-proxy.你的帳號.workers.dev
```

儲存後，狀態列會顯示「✓ Proxy 模式」，所有 AI 呼叫改走你自己的 Key。

---

## 🌐 Vercel 部署（另一選擇）

```bash
npm i -g vercel
vercel --prod
```

或直接在 [vercel.com](https://vercel.com) 匯入此 GitHub Repo，自動部署。

---

## 📁 檔案結構

```
talkworld/
├── index.html                   # 主應用程式（單頁 App）
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages 自動部署
└── cloudflare-worker/
    └── worker.js                # Cloudflare Worker Proxy 程式碼
```

---

## 🔒 安全說明

- Cloudflare Worker 的 `ALLOWED_ORIGIN` 設定可防止其他網站盜用你的 API Key
- API Key 儲存在 Cloudflare 環境變數，不會暴露在前端程式碼中
- 所有用戶資料（角色、對話記錄）存在瀏覽器 `localStorage`，不上傳至任何伺服器

---

## 💡 功能列表

- 🎭 **角色創建**：自訂名字、特質、背景、說話風格
- 💬 **一對一對話**：AI 扮演角色與你聊天，附記憶系統
- 👥 **群聊**：最多 5 個 AI 角色同台對話
- 🌍 **世界觀**：建立奇幻、科幻、現代等不同世界設定
- 📖 **故事生成**：指定角色與場景，AI 自動寫短中長篇故事
- 🔊 **TTS 語音**：瀏覽器內建語音朗讀 AI 回覆
- 🎨 **AI 立繪**：透過 Pollinations.ai 生成角色插圖
