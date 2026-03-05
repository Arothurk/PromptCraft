<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<center>
<h1>PromptCraft</h1>
</center>

![Vite](https://img.shields.io/badge/Vite-Frontend-purple?logo=vite) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Active-success) ![AI Powered](https://img.shields.io/badge/AI-Powered-orange) ![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)

[简体中文](README_zh.md) | [English](README.md)

PromptCraft 是一个帮助用户生成结构化 AI 提示（prompts）的工具前端，
可以转换原始想法为高质量提示用于 AI 代码助手或模型交互。

---

## ✨ 项目特色

- 🧠 将简单想法转化为结构化 Prompt
- 🎯 自动补充约束、目标与上下文
- ⚡ 基于 Vite + TypeScript 构建
- 💡 纯前端架构，轻量易扩展
- 🔌 可接入 Gemini 等 AI 模型接口

---

## 🖼 项目预览



---

## 🛠 技术栈

- Vite
- TypeScript
- 现代前端架构
- AI API 接口调用

---

## 🚀 快速开始

### 1️⃣ 克隆仓库

```bash
git clone https://github.com/Arothurk/PromptCraft.git
cd PromptCraft
```

### 2️⃣ 安装依赖

```bash
npm install
```

### 3️⃣ 配置环境变量

复制示例文件：

```bash
cp .env.example .env.local
```

在 `.env.local` 中添加你的 API Key：

```
VITE_GEMINI_API_KEY=你的_API_Key
```

> [!WARNING]
> 不要将 API Key 提交到公开仓库。

### 4️⃣ 启动开发环境

```bash
npm run dev
```

---

## 📂 项目结构

```
PromptCraft/
│
├── src/              # 应用源码
├── public/           # 静态资源
├── index.html        # 入口 HTML
├── vite.config.ts    # Vite 配置
└── .env.example      # 环境变量示例
```

---

## 💡 使用说明

1. 在输入框中填写你的原始想法。
2. 系统会将内容转换为结构化 Prompt。
3. 可直接复制用于 AI 模型调用。

---

## 🔐 安全提示

本项目为纯前端架构。

如果直接在浏览器调用 AI API：

* API Key 可能会暴露
* 不建议用于生产环境

如需生产部署，建议增加后端代理层。

---

## 🧪 未来规划

* Prompt 历史记录缓存
* 本地存储优化
* 多模型支持
* 更精致的 SVG 动画设计
* 后端代理支持

---

## 🤝 参与贡献

欢迎提交 Issue 或 Pull Request。

1. Fork 本仓库
2. 创建新分支
3. 提交 PR

---

## 📜 License

None
