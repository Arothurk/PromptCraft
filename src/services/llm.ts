import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ModelConfig {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  isCustom: boolean;
}

export const DEFAULT_MODEL: ModelConfig = {
  id: 'gemini-default',
  name: 'Gemini 3.1 Pro (Default)',
  endpoint: '',
  apiKey: '',
  isCustom: false
};

export async function generateJargons(context: string, cardType: string, cardContent: string, modelConfig: ModelConfig): Promise<string[]> {
  if (!cardContent.trim()) return [];
  
  const promptText = `Context of other prompt modules: ${context}\n\nCurrent module being edited: [${cardType}]\nCurrent content: "${cardContent}"\n\nTask: Suggest exactly 6 highly professional, hardcore industry jargon or niche terms that could enhance this ${cardType}. NO generic words (like "beautiful" or "professional").\nFormat each string exactly as: "[ 中文名 (English Name) ]" (e.g., "[ 表现主义 (Expressionism) ]").\nReturn ONLY a JSON array of 6 strings.`;

  try {
    if (!modelConfig.isCustom) {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          temperature: 0.7,
        }
      });
      
      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed.slice(0, 6);
      }
      return [];
    } else {
      const response = await fetch(modelConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modelConfig.apiKey}`
        },
        body: JSON.stringify({
          model: modelConfig.name,
          messages: [{ role: 'user', content: promptText }],
          temperature: 0.7
        })
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) return parsed.slice(0, 6);
      }
      return [];
    }
  } catch (error) {
    console.error("Failed to generate jargons:", error);
    return [];
  }
}

export async function* generatePromptsStream(cards: {type: string, content: string}[], modelConfig: ModelConfig): AsyncGenerator<string, void, unknown> {
  const cardsJson = JSON.stringify(cards);
  
  const systemInstruction = `## [ SYSTEM PROTOCOL: PROMPT-CRAFT V7.0 ]
## ROLE: Chief Prompt Architect & Semantic Engineer
## INTERFACE: Modular Canvas & Typewriter Output

### 1. 核心逻辑：模块化解析 (Modular Parsing)
- **输入变量识别**：实时监听变量 {{Task}}, {{Role}}, {{Context}}。

### 2. 启发引擎：维度轮盘 (Dimension Roulette)
- **维度池 (Dimension Pool)**：{材料工艺, 历史背景, 逻辑架构, 审美哲学, 感官体验, 极端约束}。
- **随机抽样**：每次生成/刷新，必须随机选取 2 个维度作为本轮扩写的锚点。
- **强制发散**：若收到“刷新”指令或新 Seed，必须彻底摒弃上一次的关键词，执行断层式联想。

### 3. 输出阶段：流式渲染规范 (Rendering Workflow)

#### 第一步：[ 灵感激发标签 | Inspiration Tags ]
- 必须最先输出，以消除等待感。
- 格式：分类展示。例如：
  - [ 视角 Perspective ]: 术语 (English)
  - [ 质感 Texture ]: 术语 (English)
  - [ 氛围 Mood ]: 术语 (English)

#### 第二步：[ 对比模式 | Comparison Mode ]
- **原生意图 (Raw Intent)**: 简述用户原始输入的语义。
- **增强逻辑 (Enhanced Logic)**: 说明本轮选择了哪两个随机维度进行增强。

#### 第三步：[ 三路差异化方案 | Triple Streams ]
- **方案 A: 结构化蓝图 (Technical Blueprint)**
  - 中英对照。模块化描述执行标准、物理参数、逻辑步骤。
- **方案 B: 沉浸式叙事 (Sensory Narrative)**
  - **禁令**：禁止使用任何列表、标题或 Markdown 符号。
  - **要求**：一段不少于 250 字的纯中文连贯散文。侧重嗅觉、触觉、温标。关键专业术语后紧跟英文括号。
- **方案 C: 纯净指令流 (Raw Prompt Stream)**
  - **代码块格式**：\`PURE ENGLISH TAGS ONLY\`. 针对目标模型优化的参数流。

### 4. 视觉净化与翻译协议 (Cleansing & Bilingual)
- **正则净化**：在输出正文时，强制过滤所有干扰阅读的 Markdown 符号（如 #, *, -, >）。
- **打字机光标**：在生成末尾随闪烁实心块 █。
- **全双语化**：除方案 C 外，所有核心术语必须遵循 [ 中文 (English) ]。

### 5. 零废话原则 (No-Fluff Policy)
- 严禁输出任何引导性开场白（如“好的”、“没问题”）。
- 直接从 [ 灵感激发标签 ] 开始输出。`;

  const prompt = `Input modules: ${cardsJson}\n\nRandom Dimension Seed: ${Math.random()}`;

  try {
    if (!modelConfig.isCustom) {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.9,
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          yield chunk.text.replace(/[#*>\-]/g, '');
        }
      }
    } else {
      const response = await fetch(modelConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modelConfig.apiKey}`
        },
        body: JSON.stringify({
          model: modelConfig.name,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
          ],
          stream: true,
          temperature: 0.9
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line.includes('[DONE]')) return;
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                yield data.choices[0].delta.content.replace(/[#*>\-]/g, '');
              }
            } catch (e) {}
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to generate prompts:", error);
    throw error;
  }
}
