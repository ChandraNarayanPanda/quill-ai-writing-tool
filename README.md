# ✦ Quill — AI Writing Studio

<div align="center">

![Quill Banner](https://img.shields.io/badge/✦%20QUILL-AI%20Writing%20Studio-00ffcc?style=for-the-badge&labelColor=000000)

![React](https://img.shields.io/badge/React-18-00aaff?style=for-the-badge&logo=react&labelColor=000000)
![Vite](https://img.shields.io/badge/Vite-5-ffff00?style=for-the-badge&logo=vite&labelColor=000000)
![Claude API](https://img.shields.io/badge/Claude-API-ff00ff?style=for-the-badge&labelColor=000000)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-00ffcc?style=for-the-badge&logo=vercel&labelColor=000000)

**An AI-powered writing studio that transforms your text in real time — built with React and Anthropic Claude API.**

[🚀 Live Demo](https://quill-ai-writing-tool.vercel.app) · [⚡ Features](#features) · [🛠️ Setup](#getting-started)

</div>

---

## 📌 About The Project

**Quill** is a sleek, neon-noir AI writing tool that lets you paste any text and instantly transform it using 6 intelligent AI modes — powered by Anthropic's Claude API.

Built as a portfolio project by a **B.Tech final year Computer Science Engineering student** to demonstrate real-world skills in:

- Generative AI & LLM API integration
- Modern React development
- Production-grade UI/UX design
- Frontend deployment with Vercel

---

## 💼 Key Highlights

- Built real-time AI text transformation tool using Claude API
- Implemented streaming UI for better user experience
- Designed modern neon-themed responsive interface
- Deployed production-ready app on Vercel

---

## ✨ Features <a name="features"></a>

| Mode            | What It Does                                 |
| --------------- | -------------------------------------------- |
| ◈ **POLISH**    | Fix grammar, improve clarity and word choice |
| ⊕ **EXPAND**    | Add depth, examples and meaningful context   |
| ⊖ **CONDENSE**  | Cut to core meaning, keep all key ideas      |
| ▣ **FORMALIZE** | Rewrite for professional business contexts   |
| ◇ **CASUALIZE** | Make warm, friendly and conversational       |
| ✶ **VIVIFY**    | Inject creative flair and vivid expression   |

### 🎨 UI Highlights

- Neon Noir dark theme with animated scanline grid background
- Each mode has its own neon accent color
- Real-time text streaming output
- Swap button for chained transformations
- One-click copy to clipboard

---

## 🛠️ Built With

- React 18
- Vite
- Anthropic Claude API
- Google Fonts (Bebas Neue + Share Tech Mono)
- CSS-in-JS

---

## 🚀 Getting Started <a name="getting-started"></a>

### Prerequisites

- Node.js v18+ → https://nodejs.org
- Anthropic API Key → https://console.anthropic.com

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/ChandraNarayanPanda/quill-ai-writing-tool.git
cd quill-ai-writing-tool
```

---

### Step 2 — Install dependencies

```bash
npm install
```

---

### Step 3 — Add your API key

Create a `.env` file in the root folder:

```env
VITE_ANTHROPIC_API_KEY=your-api-key-here
```

---

### Step 4 — Update API headers in `src/App.jsx`

```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
},
```

---

### Step 5 — Run the app

```bash
npm run dev
```

Open http://localhost:5173 in your browser 🎉

---

## 📁 Project Structure

```
quill-ai-writing-tool/
├── src/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env
├── .gitignore
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🌐 Deployment

Deployed on Vercel.

To deploy your own:

1. Push repo to GitHub
2. Go to Vercel
3. Import project
4. Add environment variable:
   VITE_ANTHROPIC_API_KEY
5. Click Deploy

---

## 🔐 Security Note

This project uses the API key on the client side for demo purposes.

In production:

- Use backend (Node.js / Express / Next.js API routes)
- Never expose API keys publicly

---

## 🙋 About Me

Hi! I'm **Chandra Narayan Panda**, a B.Tech final year Computer Science Engineering student from Gandhi Engineering College, Bhubaneswar.

- 🔗 LinkedIn: https://linkedin.com/in/your-profile
- 💻 GitHub: https://github.com/ChandraNarayanPanda
- 📧 Email: [chandranarayanpanda2005gmail.com](chandranarayanpanda2005gmail.com)

I am passionate about:

- Generative AI
- MERN Stack Development
- Building real-world projects

**Currently looking for SDE / AI / Frontend Developer opportunities!** 🚀

---

## 📄 License

This project is open source under the MIT License.

---

<div align="center">

Built with ✦ and Claude AI by Chandra Narayan Panda

⭐ Star this repo if you found it useful!

</div>
