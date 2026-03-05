<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<center>
<h1>PromptCraft</h1>
</center>

![Vite](https://img.shields.io/badge/Vite-Frontend-purple?logo=vite) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Active-success) ![AI Powered](https://img.shields.io/badge/AI-Powered-orange) ![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)

[简体中文](README_zh.md) | [English](README.md)

PromptCraft is a frontend tool that helps users generate structured AI prompts, transforming raw ideas into high-quality prompts for AI code assistants or model interactions.

---

## ✨ Features

- 🧠 Turns simple ideas into structured prompts
- 🎯 Automatically supplements constraints, objectives, and context
- ⚡ Built with Vite + TypeScript
- 💡 Pure frontend architecture, lightweight and easy to extend
- 🔌 Can connect to AI model APIs like Gemini

---

## 🖼 Preview



---

## 🛠 Tech Stack

- Vite
- TypeScript
- Modern Frontend Architecture
- AI API Integration

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Arothurk/PromptCraft.git
cd PromptCraft
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Add your API Key in `.env.local`:

```
VITE_GEMINI_API_KEY=Your_API_Key_Here
```

> [!WARNING]
> Do not commit your API Key to public repositories.

### 4️⃣ Start the Development Environment

```bash
npm run dev
```

---

## 📂 Project Structure

```
PromptCraft/
│
├── src/              # Application source code
├── public/           # Static assets
├── index.html        # Entry HTML
├── vite.config.ts    # Vite configuration
└── .env.example      # Environment variables example
```

---

## 💡 Usage Instructions

1.  Enter your raw idea in the input field.
2.  The system will convert the content into a structured prompt.
3.  The prompt can be copied directly for use with AI models.

---

## 🔐 Security Notes

This project uses a pure frontend architecture.

If calling AI APIs directly in the browser:

* The API Key may be exposed
* Not recommended for production environments

For production deployment, it is recommended to add a backend proxy layer.

---

## 🧪 Future Plans

* Prompt history and caching
* Local storage optimization
* Multi-model support
* More refined SVG animation design
* Backend proxy support

---

## 🤝 Contributing

Issues and Pull Requests are welcome.

1. Fork the repository
2. Create a new branch
3. Submit a PR

---

## 📜 License

None