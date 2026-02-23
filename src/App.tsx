// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:       "#f5f2eb",
  surface:  "#faf8f3",
  white:    "#ffffff",
  ink:      "#111111",
  dim:      "#555555",
  ghost:    "#aaaaaa",
  line:     "#e0dbd0",
  lineHov:  "#b8b3a8",
  wine:     "#8b2635",
};
const SERIF = "'DM Serif Display', Georgia, serif";
const MONO  = "'Special Elite', 'Courier New', serif";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  en: {
    title:"PROMPTCRAFT", sub:"Modular Inspiration Engine", yr:"2025",
    inputSec:"Your Dimensions",
    inputHint:"Fill in the dimensions below to define your creative context.",
    addDim:"+ Add another dimension",
    generate:"Generate Output",
    generating:"Generating…",
    regenerate:"Regenerate",
    emptyStateText:"Ready to start a new creation?",
    processing:"Composing",
    clear:"Clear", conceiving:"Conceiving...",
    copy:"Copy text", copied:"Copied ✓",
    loaded:(n)=>`${n} dimension${n!==1?"s":""} loaded`,
    settings:"API Configuration",
    apiProvider:"Provider", apiKey:"API Key", apiModel:"Model", endpoint:"Base URL / Endpoint",
    apiKeyNote:(p)=>p==="anthropic"?"Leave blank for built-in access":p==="gemini"?"Leave blank to use built-in Gemini API Key":p==="custom"?"Optional depending on your setup":"Required",
    saveSettings:"Save", cancelSettings:"Cancel",
    refreshTags:"↻ Refresh", langBtn:"中文",
    instantMode:"Instant", typewriterMode:"Typewriter", outputMode:"Mode",
    skip:"Skip →",
    dimLabels:  {Task:"Task",Role:"Role",Context:"Context",Constraints:"Constraints",Aesthetics:"Aesthetics",Format:"Format",Tone:"Tone",Audience:"Audience",Craft:"Craft"},
    dimDesc:    {Task:"What needs to be done",Role:"Who is doing it",Context:"Time, place & situation",Constraints:"Limits & prohibitions",Aesthetics:"Style & visual language",Format:"Output structure & medium",Tone:"Emotional voice & attitude",Audience:"Target reader or viewer",Craft:"Specific techniques, tools, or methods"},
    variantKeys:["A","B","C"],
    variantTabs:["A — Structured Framework","B — Immersive Experience","C — Visual Prompt"],
    variantDesc:[
      "Comprehensive professional logic · domain-specific framework · reads like a master design document",
      "Pure unbroken prose · sensory and emotional depth · describes the ideal experience of the product",
      "Keyword chain for Midjourney / Stable Diffusion to generate a core visual scene",
    ],
    placeholders:{
      Task:        "e.g. Design an oil-painting cityscape at dusk...",
      Role:        "e.g. Senior concept artist specialising in 14th-century...",
      Context:     "e.g. Florentine atelier, 1387, late afternoon light...",
      Constraints: "e.g. No modern elements · No synthetic pigments...",
      Aesthetics:  "e.g. Velvet shadow tones · Gilt-leaf borders...",
      Format:      "e.g. A 3-paragraph descriptive essay, bullet points for technical specs...",
      Tone:        "e.g. Authoritative, melancholic, academic, whimsical...",
      Audience:    "e.g. Art historians, general public, software engineers...",
      Craft:       "e.g. Unreal Engine 5 Blueprints, impasto brushstrokes...",
    },
    jargonPrompt:(type,value,seed)=>
      `Creative lexicon engine. Input "${type}": "${value}". Seed: ${seed}.
Return ONLY raw JSON array of exactly 7 strings. 3-4 must be highly precise/relevant technical terms, and 3-4 must be divergent/creative associations closely linked to the input. Each 2–5 words.
Example: ["gesso priming board","sfumato light diffusion","Flemish glazing method","acoustic dampening felt","wabi-sabi imperfection","Venetian lacquerwork","pentimento ghost layers"]`,
    systemPrompt:(dims,summary)=>
      `Senior Prompt Architect. Expand these card inputs into THREE distinct, high-quality output variants. Expansion dimensions: ${dims.join(", ")}.
Return ONLY raw JSON: {"A":"...","B":"...","C":"..."} — zero markdown, zero preamble.
A — STRUCTURED FRAMEWORK (300+ words): [SECTION LABEL] inline markers. A highly detailed, multi-layered professional framework tailored to the specific domain. Break down into core pillars (e.g., for games: Core Loop, Mechanics, Narrative, Art Direction, Monetization; for art: Composition, Lighting, Color Palette, Technical Specs, Emotional Arc). Include bullet points, specific parameters, and actionable guidelines. Reads like a comprehensive master design document.
B — IMMERSIVE EXPERIENCE (220+ words): Pure unbroken prose. NO headers/bullets/lists ever. Describe the ideal sensory and emotional experience of the final product (e.g., the feeling of playing the game, or the atmosphere of the artwork). Make the reader feel physically present.
C — SCENE DESIGN PROMPT: One continuous comma-separated flow of keywords, style modifiers, and technical parameters optimized for AI image generators (Midjourney/SD). Focus on generating a single, striking visual scene representing the core concept.
Card inputs:\n${summary}`,
  },
  zh: {
    title:"PROMPTCRAFT", sub:"模块化灵感引擎", yr:"2025",
    inputSec:"你的维度",
    inputHint:"填写以下维度以定义你的创意上下文。",
    addDim:"+ 添加维度",
    generate:"生成输出",
    generating:"生成中…",
    regenerate:"重新生成",
    emptyStateText:"准备好开启新的创作了吗？",
    processing:"排版中",
    clear:"清除", conceiving:"正在构思...",
    copy:"复制文本", copied:"已复制 ✓",
    loaded:(n)=>`${n} 个维度已装载`,
    settings:"API 配置",
    apiProvider:"服务商", apiKey:"密钥", apiModel:"模型", endpoint:"接口地址 (Base URL)",
    apiKeyNote:(p)=>p==="anthropic"?"留空使用内置权限":p==="gemini"?"留空使用内置 Gemini 密钥":p==="custom"?"根据您的配置选填":"必填",
    saveSettings:"保存", cancelSettings:"取消",
    refreshTags:"↻ 刷新", langBtn:"EN",
    instantMode:"即时", typewriterMode:"打字机", outputMode:"模式",
    skip:"跳过 →",
    dimLabels:  {Task:"任务",Role:"角色",Context:"背景",Constraints:"限制",Aesthetics:"美学",Format:"格式",Tone:"语气",Audience:"受众",Craft:"技艺"},
    dimDesc:    {Task:"核心目标",Role:"执行者身份",Context:"时间、地点与场景",Constraints:"禁止项与准则",Aesthetics:"视觉风格与语言",Format:"输出结构与媒介",Tone:"情感基调与态度",Audience:"目标读者或受众",Craft:"特定技术、工具或制作方法"},
    variantKeys:["A","B","C"],
    variantTabs:["A — 结构化框架","B — 沉浸式体验","C — 画面设计指令"],
    variantDesc:[
      "符合领域的完整专业框架 · 核心机制与规范 · 读起来像大师级设计文档",
      "纯粹散文体，描述体验该作品时的理想感官与情感体验，让人身临其境",
      "为 Midjourney / SD 优化的关键词流，用于生成代表核心概念的单幅视觉场景",
    ],
    placeholders:{
      Task:        "例：设计一幅巴洛克光影油画风格的城市黄昏景观……",
      Role:        "例：专注 14 世纪意大利技法的资深概念艺术家……",
      Context:     "例：1387 年佛罗伦萨画室，午后阳光透过石制工坊窗洞斜入……",
      Constraints: "例：不得使用现代元素 · 禁用合成颜料 · 前景人物不超过三名……",
      Aesthetics:  "例：天鹅绒暗部 · 特雷琴托金叶镀边 · 琥珀暖色调……",
      Format:      "例：三段式描述散文，技术规格使用项目符号……",
      Tone:        "例：权威的、忧郁的、学术的、异想天开的……",
      Audience:    "例：艺术史学家、普通大众、软件工程师……",
      Craft:       "例：虚幻5蓝图、厚涂笔触、榫卯结构……",
    },
    jargonPrompt:(type,value,seed)=>
      `创意词库引擎。"${type}"输入："${value}"。种子：${seed}。
仅返回 JSON 数组，精确包含 7 个字符串。其中 3~4 个必须是高度契合的精准专业术语，另外 3~4 个必须是具有发散思维但与输入密切相关的联想词。每个 2–6 字。
示例：["石膏打底工艺","sfumato 光晕扩散","佛兰德斯釉彩法","吸声毡质感","物哀美学","威尼斯漆艺","pentimento 幽灵层"]`,
    systemPrompt:(dims,summary)=>
      `资深提示词架构师。将以下内容扩展为三套截然不同的高质量方案，应用维度：${dims.join("、")}。
严格返回 JSON：{"A":"...","B":"...","C":"..."} ——零 Markdown，零前言。
A（300字+）：[章节标签]内联引导，输出极其丰富细致、多层次的专业框架。将其拆解为核心支柱（例如：若是游戏则包含核心循环、具体机制、叙事、美术方向、系统架构；若是绘画则包含构图、光影、色彩调性、技术参数、情感弧线等）。必须包含具体的参数、可执行的指导原则和项目符号。读起来像一份详尽的大师级设计文档。
B（220字+）：纯散文，禁止标题列表。描述体验该作品时的理想感官与情感体验（例如：游玩时的沉浸感受，或观赏时的氛围感），让读者身临其境。
C：画面设计指令：逗号分隔的关键词流，包含风格修饰词、技术参数，专为 Midjourney/SD 等 AI 绘画工具优化，用于生成代表该核心概念的单幅视觉场景。
卡片内容：\n${summary}`,
  },
};

const CARD_TYPES = ["Task","Role","Context","Constraints","Aesthetics","Format","Tone","Audience","Craft"];
const DIMENSIONS = [
  "Materials & Craft","Architectural Grammar","Aesthetic Philosophy","Technical Methodology",
  "Historical Provenance","Sensory Atmosphere","Structural Underpinning","Haptic Vocabulary",
  "Spatial Choreography","Cultural Semiotics","Temporal Layering","Craft Genealogy",
];
const API_PROVIDERS = {
  gemini:   {name:"Google (Gemini)",   models:["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-pro"], defaultModel:"gemini-2.5-flash", endpoint:"https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"},
  deepseek: {name:"DeepSeek",          models:["deepseek-chat", "deepseek-reasoner"], defaultModel:"deepseek-chat", endpoint:"https://api.deepseek.com/chat/completions"},
  anthropic:{name:"Anthropic (Claude)",models:["claude-3-7-sonnet-20250219","claude-3-5-sonnet-20241022"],defaultModel:"claude-3-7-sonnet-20250219",endpoint:"https://api.anthropic.com/v1/messages"},
  openai:   {name:"OpenAI (GPT)",      models:["gpt-4o","gpt-4o-mini","gpt-4-turbo"],                           defaultModel:"gpt-4o",                   endpoint:"https://api.openai.com/v1/chat/completions"},
  qwen:     {name:"Qwen (千问)",         models:["qwen-max", "qwen-plus", "qwen-turbo"],                          defaultModel:"qwen-plus",                endpoint:"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"},
  kimi:     {name:"Kimi (Moonshot)",   models:["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],        defaultModel:"moonshot-v1-8k",           endpoint:"https://api.moonshot.cn/v1/chat/completions"},
  grok:     {name:"Grok (xAI)",        models:["grok-2-latest", "grok-2-vision-latest"],                        defaultModel:"grok-2-latest",            endpoint:"https://api.x.ai/v1/chat/completions"},
  custom:   {name:"Custom",            models:[],                                                               defaultModel:"",                         endpoint:""},
};

async function callAPI({provider,apiKey,model,endpoint,prompt,maxTokens=2800}){
  let actualApiKey = apiKey;
  if (provider === "gemini" && !apiKey) {
    // Fallback to built-in key if available, otherwise it will fail if empty
    actualApiKey = typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : "";
  }

  if(provider==="anthropic"){
    const h={"Content-Type":"application/json","anthropic-version":"2023-06-01"};
    if(actualApiKey)h["x-api-key"]=actualApiKey;
    const r=await fetch(endpoint,{method:"POST",headers:h,body:JSON.stringify({model,max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();if(d.error)throw new Error(d.error.message);
    return d.content?.[0]?.text||"";
  }else{
    const h={"Content-Type":"application/json"};
    if(actualApiKey)h["Authorization"]=`Bearer ${actualApiKey}`;
    const r=await fetch(endpoint,{method:"POST",headers:h,body:JSON.stringify({model,max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();if(d.error)throw new Error(d.error.message);
    return d.choices?.[0]?.message?.content||"";
  }
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function useTypewriter(text,speed,instant){
  const [disp,setDisp]=useState("");
  const [done,setDone]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    clearInterval(ref.current);setDisp("");setDone(false);
    if(!text)return;
    if(instant){setDisp(text);setDone(true);return;}
    let i=0;
    ref.current=setInterval(()=>{
      if(i<text.length)setDisp(text.slice(0,++i));
      else{setDone(true);clearInterval(ref.current);}
    },speed);
    return()=>clearInterval(ref.current);
  },[text,speed,instant]);
  const skip=useCallback(()=>{clearInterval(ref.current);setDisp(text);setDone(true);},[text]);
  return{disp,done,skip};
}

// ─── Reveal animation ─────────────────────────────────────────────────────────
function Fade({children,delay=0,y=16,style={}}){
  const [v,setV]=useState(false);
  useEffect(()=>{const id=setTimeout(()=>setV(true),delay);return()=>clearTimeout(id);},[delay]);
  return(
    <div style={{opacity:v?1:0,transform:v?`translateY(0px)`:`translateY(${y}px)`,
      transition:`opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,...style}}>
      {children}
    </div>
  );
}

// ─── Subtle cursor ────────────────────────────────────────────────────────────
function Cursor(){
  const ring=useRef(null);
  const pos=useRef({x:-50,y:-50});
  const target=useRef({x:-50,y:-50});
  const [hoverType, setHoverType] = useState("default");

  useEffect(()=>{
    const mv=e=>{
      target.current={x:e.clientX,y:e.clientY};
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if(el) {
        const tag = el.tagName.toLowerCase();
        const isClickable = tag === 'button' || tag === 'a' || el.closest('button') || el.closest('a') || el.style?.cursor === 'pointer' || el.parentElement?.style?.cursor === 'pointer';
        const isText = tag === 'input' || tag === 'textarea' || el.closest('input') || el.closest('textarea');
        if(isText) setHoverType("text");
        else if(isClickable) setHoverType("pointer");
        else setHoverType("default");
      }
    };
    document.addEventListener("mousemove",mv);
    let raf;
    const tick=()=>{
      pos.current.x+=(target.current.x-pos.current.x)*0.11;
      pos.current.y+=(target.current.y-pos.current.y)*0.11;
      if(ring.current){
        ring.current.style.left=pos.current.x+"px";
        ring.current.style.top=pos.current.y+"px";
      }
      raf=requestAnimationFrame(tick);
    };
    tick();
    return()=>{document.removeEventListener("mousemove",mv);cancelAnimationFrame(raf);};
  },[]);

  let style = {
    position:"fixed",width:"24px",height:"24px",
    borderWidth:"1px",borderStyle:"solid",borderColor:C.lineHov,borderRadius:"50%",
    pointerEvents:"none",zIndex:9999,transform:"translate(-50%,-50%)",
    transition:"width 0.2s,height 0.2s,border-color 0.2s, background-color 0.2s, border-radius 0.2s"
  };

  if (hoverType === "pointer") {
    style.width = "36px";
    style.height = "36px";
    style.borderColor = C.ink;
    style.backgroundColor = "rgba(17,17,17,0.04)";
  } else if (hoverType === "text") {
    style.width = "4px";
    style.height = "24px";
    style.borderRadius = "2px";
    style.borderColor = C.ink;
    style.backgroundColor = C.ink;
  }

  return <div ref={ring} style={style}/>;
}

// ─── Dim tag ──────────────────────────────────────────────────────────────────
function Tag({label,onClick}){
  const [h,sh]=useState(false);
  return(
    <button onClick={onClick} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}
      style={{background:h?C.ink:"transparent",color:h?C.white:C.dim,
        border:`1px solid ${h?C.ink:C.line}`,padding:"6px 10px",
        fontSize:"12px",fontFamily:MONO,cursor:"pointer",letterSpacing:"0.3px",
        transition:"all 0.18s",whiteSpace:"normal",textAlign:"left",lineHeight:1.4,borderRadius:"2px"}}>
      + {label}
    </button>
  );
}

// ─── Dimension card ───────────────────────────────────────────────────────────
function DimCard({card,index,onUpdate,onRemove,t,apiConfig}){
  const [tags,setTags]=useState([]);
  const [loading,setLoading]=useState(false);
  const [focused,setFocused]=useState(false);
  const [seed,setSeed]=useState(0);
  const [entered,setEntered]=useState(false);
  const [collapsed,setCollapsed]=useState(false);
  const deb=useRef(null);

  useEffect(()=>{const id=setTimeout(()=>setEntered(true),index*70+100);return()=>clearTimeout(id);},[index]);

  const fetchTags=useCallback(async(val,s)=>{
    if(!val.trim()||val.trim().length<3){setTags([]);return;}
    setLoading(true);
    try{
      const raw=await callAPI({...apiConfig,prompt:t.jargonPrompt(card.type,val,s),maxTokens:350});
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setTags(Array.isArray(parsed)?parsed.slice(0,7):[]);
    }catch{setTags([]);}
    setLoading(false);
  },[card.type,t,apiConfig]);

  const handleChange=e=>{
    onUpdate({...card,value:e.target.value});
    clearTimeout(deb.current);
    deb.current=setTimeout(()=>fetchTags(e.target.value,seed),900);
  };

  const refresh=()=>{const ns=seed+1;setSeed(ns);if(card.value.trim().length>=3)fetchTags(card.value,ns);};

  const showTags = card.value.trim().length >= 3;

  return(
    <div style={{
      flex:"0 0 auto",
      width: collapsed ? "140px" : (showTags ? "460px" : "300px"),
      background:C.surface,
      border:`1px solid ${focused?C.lineHov:C.line}`,
      borderRadius:"6px",
      padding:"24px",
      display:"flex",flexDirection:"row",gap:"24px",
      opacity:entered?1:0,
      transform:entered?"translateY(0)":"translateY(16px)",
      transition:`width 0.3s ease, opacity 0.5s ease ${index*60}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${index*60}ms, border-color 0.2s, box-shadow 0.2s`,
      boxShadow:focused?"0 0 0 3px rgba(0,0,0,0.06)":"0 1px 4px rgba(0,0,0,0.04)",
      minHeight:"220px",
      cursor: collapsed ? "pointer" : "default"
    }}
    onClick={() => { if(collapsed) setCollapsed(false); }}>
      <div style={{flex: collapsed ? "1" : "0 0 250px", display:"flex", flexDirection:"column", overflow: "hidden"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
          <div>
            <div style={{fontSize:"9px",letterSpacing:"3px",color:C.wine,fontFamily:MONO,marginBottom:"5px"}}>
              {String(index+1).padStart(2,"0")}
            </div>
            <div style={{fontSize:"13px",letterSpacing:"2.5px",color:C.dim,fontFamily:MONO,textTransform:"uppercase"}}>
              {t.dimLabels[card.type]}
            </div>
          </div>
          {!collapsed && (
            <div style={{display:"flex", gap: "12px"}}>
              <button onClick={(e)=>{e.stopPropagation(); setCollapsed(true);}}
                style={{background:"none",border:"none",color:C.line,cursor:"pointer",fontSize:"20px",
                  lineHeight:1,padding:0,transition:"color 0.15s",fontFamily:MONO}}
                onMouseEnter={e=>e.currentTarget.style.color=C.ink}
                onMouseLeave={e=>e.currentTarget.style.color=C.line}>−</button>
              <button onClick={(e)=>{e.stopPropagation(); onRemove(card.id);}}
                style={{background:"none",border:"none",color:C.line,cursor:"pointer",fontSize:"20px",
                  lineHeight:1,padding:0,transition:"color 0.15s",fontFamily:MONO}}
                onMouseEnter={e=>e.currentTarget.style.color=C.ink}
                onMouseLeave={e=>e.currentTarget.style.color=C.line}>×</button>
            </div>
          )}
        </div>

        {!collapsed ? (
          <>
            {/* Hint text */}
            <div style={{fontSize:"11px",color:C.ghost,fontFamily:MONO,marginBottom:"14px",lineHeight:1.5}}>
              {t.dimDesc[card.type]}
            </div>

            {/* Textarea */}
            <textarea
              value={card.value} onChange={handleChange}
              onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
              placeholder={t.placeholders[card.type]} rows={5}
              style={{flex:1,width:"100%",background:"transparent",border:"none",
                borderBottom:`1px solid ${focused?C.lineHov:C.line}`,
                padding:"0 0 12px 0",resize:"none",outline:"none",
                fontFamily:MONO,fontSize:"14px",color:C.ink,
                lineHeight:"1.9",letterSpacing:"0.2px",caretColor:C.ink,
                transition:"border-color 0.2s"}}/>
          </>
        ) : (
          <div style={{fontSize:"12px", color:C.ghost, fontFamily:MONO, lineHeight:1.6, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", whiteSpace: "pre-wrap"}}>
            {card.value || "..."}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {showTags && !collapsed && (
        <div style={{flex: 1, display:"flex", flexDirection:"column", borderLeft: `1px solid ${C.line}`, paddingLeft: "24px", overflowY: "auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
            <span style={{fontSize:"9px",letterSpacing:"2.5px",color:C.wine,fontFamily:MONO}}>SUGGEST</span>
            <button onClick={refresh} disabled={loading}
              style={{background:"none",border:"none",color:loading?C.line:C.ghost,
                cursor:loading?"not-allowed":"pointer",fontFamily:MONO,fontSize:"11px",
                letterSpacing:"0.5px",padding:0,transition:"color 0.18s"}}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.color=C.ink;}}
              onMouseLeave={e=>{if(!loading)e.currentTarget.style.color=C.ghost;}}>
              {loading?"…":t.refreshTags}
            </button>
          </div>
          {tags.length>0&&!loading&&(
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {tags.map((tag,i)=>(
                <Tag key={i} label={tag}
                  onClick={()=>onUpdate({...card,value:card.value?card.value+"  "+tag:tag})}/>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Output variant ───────────────────────────────────────────────────────────
function OutputVariant({text,variantKey,label,desc,t}){
  const spd={A:9,B:6,C:15};
  const {disp,done,skip}=useTypewriter(text,spd[variantKey],false);
  const [copied,setCopied]=useState(false);
  const copy=()=>navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});

  return(
    <Fade y={10} delay={60} style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Output header */}
      <div className="m-out-pad" style={{padding:"32px 64px 28px",borderBottom:`1px solid ${C.line}`,flexShrink:0}}>
        <div className="m-col" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:"32px"}}>
          <div>
            <div style={{fontSize:"10px",letterSpacing:"4px",color:C.ghost,marginBottom:"10px",fontFamily:MONO}}>
              {label}
            </div>
            <div style={{fontSize:"15px",color:C.dim,fontFamily:MONO,lineHeight:1.6,maxWidth:"600px"}}>
              {desc}
            </div>
          </div>
          <div style={{display:"flex",gap:"16px",alignItems:"center",flexShrink:0}}>
            <button onClick={copy}
              style={{background:copied?C.ink:"transparent",color:copied?C.white:C.dim,
                border:`1px solid ${copied?C.ink:C.line}`,padding:"9px 24px",
                fontFamily:MONO,fontSize:"12px",letterSpacing:"1.5px",
                cursor:"pointer",transition:"all 0.2s",borderRadius:"2px"}}
              onMouseEnter={e=>{if(!copied){e.currentTarget.style.borderColor=C.ink;e.currentTarget.style.color=C.ink;}}}
              onMouseLeave={e=>{if(!copied){e.currentTarget.style.borderColor=C.line;e.currentTarget.style.color=C.dim;}}}>
              {copied?t.copied:t.copy}
            </button>
          </div>
        </div>
      </div>

      {/* Text body */}
      <div className="m-out-pad" style={{flex:1,overflowY:"auto",padding:"48px 64px 64px",cursor:done?"auto":"pointer"}} onClick={!done?skip:undefined}>
        <div style={{fontFamily:MONO,fontSize:"17px",lineHeight:"2.3",color:C.ink,
          letterSpacing:"0.25px",whiteSpace:"pre-wrap",wordBreak:"break-word",
          maxWidth:"760px"}}>
          {disp}
          {!done&&<span style={{animation:"blink 0.9s step-end infinite",color:C.ghost}}>|</span>}
        </div>
      </div>
    </Fade>
  );
}

// ─── API Settings (slide-in drawer) ──────────────────────────────────────────
function APISettings({config,onSave,onClose,t}){
  const [local,setLocal]=useState({...config});
  const [vis,setVis]=useState(false);
  useEffect(()=>{const id=setTimeout(()=>setVis(true),10);return()=>clearTimeout(id);},[]);
  const prov=API_PROVIDERS[local.provider]||API_PROVIDERS.gemini;
  const inp={width:"100%",background:C.white,border:`1px solid ${C.line}`,borderRadius:"3px",
    padding:"11px 14px",fontFamily:MONO,fontSize:"14px",color:C.ink,outline:"none",
    transition:"border-color 0.2s"};

  return(
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",justifyContent:"flex-end"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{position:"absolute",inset:0,background:"rgba(245,242,235,0.7)",
        backdropFilter:"blur(4px)",opacity:vis?1:0,transition:"opacity 0.35s ease"}}/>
      <div style={{position:"relative",width:"500px",height:"100%",background:C.bg,
        borderLeft:`1px solid ${C.line}`,overflowY:"auto",
        transform:vis?"translateX(0)":"translateX(100%)",
        transition:"transform 0.45s cubic-bezier(0.16,1,0.3,1)"}}>
        <div style={{padding:"56px 48px"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"52px"}}>
            <div>
              <p style={{fontSize:"9px",letterSpacing:"4px",color:C.ghost,marginBottom:"12px",fontFamily:MONO}}>CONFIGURATION</p>
              <h2 style={{fontSize:"30px",fontFamily:SERIF,fontStyle:"italic",color:C.ink,lineHeight:1,margin:0}}>{t.settings}</h2>
            </div>
            <button onClick={onClose}
              style={{background:"none",border:"none",color:C.ghost,cursor:"pointer",
                fontSize:"26px",lineHeight:1,padding:0,transition:"color 0.18s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.ink}
              onMouseLeave={e=>e.currentTarget.style.color=C.ghost}>×</button>
          </div>

          {/* Provider */}
          <div style={{marginBottom:"36px"}}>
            <p style={{fontSize:"9px",letterSpacing:"3px",color:C.ghost,marginBottom:"14px",fontFamily:MONO}}>{t.apiProvider.toUpperCase()}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0"}}>
              {Object.keys(API_PROVIDERS).map((key,i)=>(
                <button key={key}
                  onClick={()=>setLocal(p=>({...p,provider:key,model:API_PROVIDERS[key].defaultModel,endpoint:API_PROVIDERS[key].endpoint}))}
                  style={{background:local.provider===key?C.ink:C.white,
                    color:local.provider===key?C.white:C.dim,
                    border:`1px solid ${C.ink}`,
                    padding:"12px 16px",fontFamily:MONO,fontSize:"13px",letterSpacing:"0.8px",
                    cursor:"pointer",transition:"all 0.2s"}}>
                  {API_PROVIDERS[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* Model */}
          <div style={{marginBottom:"30px"}}>
            <p style={{fontSize:"9px",letterSpacing:"3px",color:C.ghost,marginBottom:"14px",fontFamily:MONO}}>{t.apiModel.toUpperCase()}</p>
            {local.provider === "custom" ? (
              <input type="text" value={local.model||""} onChange={e=>setLocal(p=>({...p,model:e.target.value}))}
                placeholder="e.g. my-local-model"
                style={{...inp}}
                onFocus={e=>e.target.style.borderColor=C.dim}
                onBlur={e=>e.target.style.borderColor=C.line}/>
            ) : (
              <div style={{position:"relative"}}>
                <select value={local.model} onChange={e=>setLocal(p=>({...p,model:e.target.value}))}
                  style={{...inp,appearance:"none",cursor:"pointer",paddingRight:"36px"}}
                  onFocus={e=>e.target.style.borderColor=C.dim}
                  onBlur={e=>e.target.style.borderColor=C.line}>
                  {prov.models.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
                <span style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",color:C.ghost,pointerEvents:"none",fontSize:"11px"}}>▾</span>
              </div>
            )}
          </div>

          {/* API Key */}
          <div style={{marginBottom:"30px"}}>
            <p style={{fontSize:"9px",letterSpacing:"3px",color:C.ghost,marginBottom:"14px",fontFamily:MONO}}>{t.apiKey.toUpperCase()}</p>
            <input type="password" value={local.apiKey||""} onChange={e=>setLocal(p=>({...p,apiKey:e.target.value}))}
              placeholder="sk-ant-... or sk-..."
              style={{...inp,fontFamily:"'Courier New',monospace",letterSpacing:"1px"}}
              onFocus={e=>e.target.style.borderColor=C.dim}
              onBlur={e=>e.target.style.borderColor=C.line}/>
            <p style={{fontSize:"12px",color:C.ghost,marginTop:"8px",fontFamily:MONO,lineHeight:1.6}}>{t.apiKeyNote(local.provider)}</p>
          </div>

          {/* Endpoint */}
          <div style={{marginBottom:"52px"}}>
            <p style={{fontSize:"9px",letterSpacing:"3px",color:C.ghost,marginBottom:"14px",fontFamily:MONO}}>{t.endpoint.toUpperCase()}</p>
            <input type="text" value={local.endpoint||""} onChange={e=>setLocal(p=>({...p,endpoint:e.target.value}))}
              style={{...inp,fontSize:"12px",color:C.dim,fontFamily:"'Courier New',monospace"}}
              onFocus={e=>e.target.style.borderColor=C.dim}
              onBlur={e=>e.target.style.borderColor=C.line}/>
          </div>

          <div style={{display:"flex",gap:"12px"}}>
            <button onClick={onClose}
              style={{flex:1,background:"transparent",color:C.dim,border:`1px solid ${C.line}`,
                padding:"14px",fontFamily:MONO,fontSize:"13px",letterSpacing:"1.5px",
                cursor:"pointer",transition:"all 0.18s",borderRadius:"2px"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.dim;e.currentTarget.style.color=C.ink;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.line;e.currentTarget.style.color=C.dim;}}>
              {t.cancelSettings}
            </button>
            <button onClick={()=>{onSave(local);onClose();}}
              style={{flex:2,background:C.ink,color:C.white,border:`1px solid ${C.ink}`,
                padding:"14px",fontFamily:MONO,fontSize:"13px",letterSpacing:"1.5px",
                cursor:"pointer",transition:"background 0.18s",borderRadius:"2px"}}
              onMouseEnter={e=>e.currentTarget.style.background="#333"}
              onMouseLeave={e=>e.currentTarget.style.background=C.ink}>
              {t.saveSettings}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PromptCraft(){
  const [lang,setLang]=useState("zh");
  const [cards,setCards]=useState([{id:1,type:"Task",value:""}]);
  const [outputs,setOutputs]=useState({A:"",B:"",C:""});
  const [activeTab,setActiveTab]=useState("A");
  const [generating,setGenerating]=useState(false);
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [addOpen,setAddOpen]=useState(false);
  const [usedDims,setUsedDims]=useState([]);
  const [error,setError]=useState("");
  const [apiConfig,setApiConfig]=useState(()=>{
    const saved = localStorage.getItem("apiConfig");
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      provider:"gemini",model:"gemini-2.5-flash",
      apiKey:"",endpoint:"https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
    };
  });
  const nextId=useRef(2);
  const addRef=useRef(null);
  const t=T[lang];

  useEffect(()=>{
    const h=e=>{if(addRef.current&&!addRef.current.contains(e.target))setAddOpen(false);};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  const addCard  =type=>{setCards(p=>[...p,{id:nextId.current++,type,value:""}]);setAddOpen(false);};
  const updateCard=u=>setCards(p=>p.map(c=>c.id===u.id?u:c));
  const removeCard=id=>setCards(p=>p.filter(c=>c.id!==id));

  const generate=async()=>{
    const filled=cards.filter(c=>c.value.trim());
    if(!filled.length)return;
    setGenerating(true);setOutputs({A:"",B:"",C:""});setError("");setActiveTab("A");
    const dims=[...DIMENSIONS].sort(()=>Math.random()-0.5).slice(0,3);
    setUsedDims(dims);
    const summary=filled.map(c=>`[${t.dimLabels[c.type]}] ${c.value}`).join("\n");
    try{
      const raw=await callAPI({...apiConfig,prompt:t.systemPrompt(dims,summary),maxTokens:2900});
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setOutputs({
        A:(parsed.A||"").replace(/[#*>`]/g,""),
        B:(parsed.B||"").replace(/[#*>`]/g,""),
        C:(parsed.C||"").replace(/[#*>`]/g,""),
      });
    }catch(e){setError(lang==="zh"?`错误：${e.message}`:`Error: ${e.message}`);}
    setGenerating(false);
  };

  const hasOutput=outputs.A||outputs.B||outputs.C;
  const tabIdx=t.variantKeys.indexOf(activeTab);
  const usedTypes=cards.map(c=>c.type);
  const available=CARD_TYPES.filter(tp=>!usedTypes.includes(tp));

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.ink,fontFamily:MONO,
      display:"flex",flexDirection:"column",overflowX:"hidden",cursor:"none"}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Special+Elite&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:0.9}}
        @keyframes breathe{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes progress{0%{width:0%}100%{width:95%}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes writing{0%,100%{transform:translate(0,0) rotate(0deg)}10%{transform:translate(3px,-2px) rotate(2deg)}20%{transform:translate(6px,0) rotate(0deg)}30%{transform:translate(9px,-2px) rotate(2deg)}40%{transform:translate(12px,0) rotate(0deg)}50%{transform:translate(15px,-2px) rotate(2deg)}60%{transform:translate(12px,0) rotate(0deg)}70%{transform:translate(9px,-2px) rotate(2deg)}80%{transform:translate(6px,0) rotate(0deg)}90%{transform:translate(3px,-2px) rotate(2deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes dance{0%{transform:translateY(0) rotate(-2deg)}25%{transform:translateY(-12px) rotate(3deg)}50%{transform:translateY(-4px) rotate(-1deg)}75%{transform:translateY(-16px) rotate(4deg)}100%{transform:translateY(0) rotate(-2deg)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:${C.ink};color:${C.white}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.line};border-radius:2px}
        textarea::placeholder{color:${C.ghost};font-size:13px;line-height:1.7}
        textarea:focus,input:focus,select:focus{outline:none!important}
        button:focus{outline:none}
        select{-webkit-appearance:none}
        *{cursor:none!important}
        @media (max-width: 768px) {
          .m-col { flex-direction: column !important; align-items: flex-start !important; }
          .m-pad { padding: 24px 16px !important; }
          .m-nav { padding: 0 16px !important; }
          .m-card { flex: 1 1 100% !important; min-width: 100% !important; }
          .m-hide { display: none !important; }
          .m-tabs { flex-direction: column !important; }
          .m-tab-btn { border-right: none !important; border-bottom: 1px solid ${C.line} !important; padding: 12px !important; }
          .m-out-pad { padding: 24px 16px !important; }
          .m-text-sm { font-size: 11px !important; }
          .m-title { font-size: 40px !important; }
          .m-sub { font-size: 14px !important; }
          .m-hero { padding: 40px 16px 32px !important; }
          .m-dropdown { top: calc(100% + 8px) !important; left: 0 !important; width: 100% !important; z-index: 200 !important; }
        }
      `}</style>

      <Cursor/>

      {/* ══ NAV ═════════════════════════════════════════════════════════════ */}
      <nav className="m-nav" style={{
        position:"sticky",top:0,zIndex:100,
        background:C.bg,borderBottom:`1px solid ${C.line}`,
        padding:"0 64px",height:"56px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
      }}>
        <Fade delay={0}>
          <div style={{display:"flex",alignItems:"baseline",gap:"20px"}}>
            <span style={{fontSize:"15px",letterSpacing:"7px",color:C.ink,fontFamily:MONO}}>{t.title}</span>
            <span style={{fontSize:"10px",color:C.ghost,fontFamily:MONO,letterSpacing:"1.5px"}}>{t.sub}</span>
          </div>
        </Fade>

        <Fade delay={60}>
          <div style={{display:"flex",alignItems:"center",gap:"28px"}}>

            {/* API */}
            <button onClick={()=>setSettingsOpen(true)}
              style={{background:"none",border:"none",color:C.ghost,cursor:"pointer",fontFamily:MONO,
                fontSize:"11px",letterSpacing:"1px",padding:0,transition:"color 0.18s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.ink}
              onMouseLeave={e=>e.currentTarget.style.color=C.ghost}>
              {API_PROVIDERS[apiConfig.provider]?.name?.split(" ")[0]} / {apiConfig.model.split("-").slice(0,2).join("-")}
            </button>

            <div style={{width:"1px",height:"14px",background:C.line}}/>

            {/* Lang */}
            <button onClick={()=>setLang(l=>l==="zh"?"en":"zh")}
              style={{background:"none",border:"none",color:C.ghost,cursor:"pointer",
                fontFamily:MONO,fontSize:"11px",letterSpacing:"2px",padding:0,transition:"color 0.18s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.ink}
              onMouseLeave={e=>e.currentTarget.style.color=C.ghost}>
              {t.langBtn}
            </button>
          </div>
        </Fade>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════════════
           Full-width, generous vertical padding, editorial feel
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="m-hero" style={{padding:"80px 64px 64px",borderBottom:`1px solid ${C.line}`, position: "relative", overflow: "hidden"}}>
        <Fade delay={80}>
          <p style={{fontSize:"9px",letterSpacing:"5px",color:C.wine,marginBottom:"20px",fontFamily:MONO}}>
            S/N 1987 · {t.yr}
          </p>
        </Fade>
        <Fade delay={150}>
          <div className="m-col" style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px"}}>
            <h1 className="m-title" style={{fontFamily:SERIF,fontStyle:"italic",
              fontSize:"clamp(44px,5.5vw,76px)",color:C.ink,
              lineHeight:"0.92",letterSpacing:"-1px",marginBottom:"0",maxWidth:"600px"}}>
              {t.sub}
            </h1>
            <div style={{animation: "dance 3s ease-in-out infinite", transformOrigin: "center", marginRight: "40px"}}>
              <svg width="180" height="220" viewBox="0 0 200 240" fill="none" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.85}}>
                {/* Right arm up */}
                <path d="M 100 60 L 140 20" />
                <path d="M 135 25 L 145 15 C 150 15, 155 20, 160 15" />
                <path d="M 145 15 C 150 25, 155 25, 160 25" />
                <path d="M 130 35 L 140 10" />
                
                {/* Head */}
                <path d="M 75 60 C 70 50, 80 40, 90 45 C 100 50, 95 60, 85 65" />
                <path d="M 80 45 C 85 35, 95 40, 100 50" />
                <path d="M 65 65 C 70 60, 75 65, 80 60" />
                <path d="M 70 70 C 75 65, 85 70, 80 75" />
                <path d="M 75 55 L 85 55" />

                {/* Left arm */}
                <path d="M 80 80 L 40 105" />
                <path d="M 60 95 L 30 110" />
                <path d="M 30 110 C 25 115, 20 110, 25 105" />
                <path d="M 30 110 C 35 115, 30 120, 25 120" />
                <path d="M 35 105 C 30 110, 25 115, 30 120" />
                <path d="M 45 100 L 50 105" strokeWidth="3" />

                {/* Shirt */}
                <path d="M 95 60 C 110 70, 130 90, 135 115" />
                <path d="M 80 80 C 90 90, 100 100, 105 110" />
                <path d="M 105 110 C 115 115, 125 110, 135 115" />
                <path d="M 135 115 L 140 112" />
                <path d="M 130 90 C 135 100, 140 120, 135 140" />
                <path d="M 105 110 C 95 120, 85 130, 80 140" />
                <path d="M 90 85 L 105 100" />
                <path d="M 100 105 L 110 95" />
                
                {/* Pants & details */}
                <path d="M 135 115 C 130 130, 125 150, 115 170" />
                <path d="M 115 170 C 110 180, 105 175, 100 170" />
                <path d="M 100 170 C 105 160, 110 140, 115 130" />
                
                <path d="M 105 120 C 100 130, 90 140, 85 150" />
                <path d="M 85 150 C 90 155, 100 150, 105 145" />

                {/* Left Foot (raised) */}
                <path d="M 115 130 C 95 140, 80 155, 85 165 C 95 175, 120 150, 125 140 Z" fill={C.ink} />
                <path d="M 110 145 L 120 160" />
                <path d="M 100 155 L 115 170" />
                
                {/* Right Foot (pointing down) */}
                <path d="M 105 175 C 95 190, 85 210, 90 220 C 100 230, 115 205, 120 190 Z" fill={C.ink} />
                
                {/* Extra sketch lines (pockets/bag) */}
                <path d="M 100 125 L 130 120" />
                <path d="M 125 120 L 125 135 L 115 135" />
                <path d="M 115 135 L 115 120" />
                <path d="M 120 125 L 120 130" />
                <path d="M 100 135 L 110 130" />
                <path d="M 110 130 L 125 145" />
              </svg>
            </div>
          </div>
        </Fade>
      </section>

      {/* ══ INPUT SECTION ═══════════════════════════════════════════════════
           Full width, cards in a horizontal scroll row
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="m-pad" style={{padding:"56px 64px 48px",borderBottom:`1px solid ${C.line}`}}>

        {/* Section label */}
        <Fade delay={220}>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:"8px"}}>
            <p style={{fontSize:"9px",letterSpacing:"4px",color:C.ghost,fontFamily:MONO}}>{t.inputSec.toUpperCase()}</p>
            <span style={{fontSize:"11px",color:C.wine,fontFamily:MONO}}>{String(cards.length).padStart(2,"0")}</span>
          </div>
          <p style={{fontSize:"13px",color:C.ghost,fontFamily:MONO,marginBottom:"32px",letterSpacing:"0.3px"}}>{t.inputHint}</p>
        </Fade>

        {/* Card Grid / Wrap */}
        <div style={{
          display:"flex",gap:"16px",
          flexWrap:"wrap",paddingBottom:"8px",
          alignItems:"stretch",
        }}>
          {cards.map((card,i)=>(
            <DimCard key={card.id} card={card} index={i}
              onUpdate={updateCard} onRemove={removeCard} t={t} apiConfig={apiConfig}/>
          ))}

          {/* Add dimension button — same height as cards */}
          {available.length>0&&(
            <div ref={addRef} className="m-card" style={{flex:"0 0 180px",position:"relative",alignSelf:"stretch"}}>
              <button onClick={()=>setAddOpen(v=>!v)}
                style={{
                  width:"100%",height:"100%",minHeight:"220px",
                  background:"transparent",
                  border:`1px dashed ${addOpen?C.ink:C.line}`,borderRadius:"6px",
                  color:addOpen?C.ink:C.ghost,
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"10px",
                  cursor:"pointer",transition:"all 0.2s",fontFamily:MONO,
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.dim;e.currentTarget.style.color=C.ink;}}
                onMouseLeave={e=>{if(!addOpen){e.currentTarget.style.borderColor=C.line;e.currentTarget.style.color=C.ghost;}}}>
                <span style={{fontSize:"28px",lineHeight:1,transform:addOpen?"rotate(45deg)":"none",transition:"transform 0.25s",display:"inline-block"}}>+</span>
                <span style={{fontSize:"11px",letterSpacing:"1.5px"}}>{t.addDim.slice(2)}</span>
              </button>

              {addOpen&&(
                <div className="m-dropdown" style={{
                  position:"absolute",top:0,left:"calc(100% + 16px)",
                  width:"240px",
                  background:C.white,border:`1px solid ${C.line}`,borderRadius:"4px",
                  zIndex:50,overflow:"hidden",
                  boxShadow:"0 8px 32px rgba(0,0,0,0.08)",
                  animation:"fadeSlide 0.18s ease",
                }}>
                  {available.map((type,i)=>(
                    <button key={type} onClick={()=>addCard(type)}
                      style={{
                        display:"flex",alignItems:"center",gap:"14px",
                        width:"100%",background:"none",border:"none",
                        borderBottom:i<available.length-1?`1px solid ${C.line}`:"none",
                        padding:"14px 18px",cursor:"pointer",fontFamily:MONO,
                        fontSize:"13px",color:C.dim,transition:"background 0.12s",textAlign:"left"
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background=C.bg;e.currentTarget.style.color=C.ink;}}
                      onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=C.dim;}}>
                      <span style={{fontFamily:SERIF,fontStyle:"italic",fontSize:"18px",color:C.wine,flexShrink:0,lineHeight:1}}>{String(i+1)}</span>
                      <div>
                        <div style={{fontSize:"12px",letterSpacing:"1.5px",marginBottom:"2px",textTransform:"uppercase"}}>{t.dimLabels[type]}</div>
                        <div style={{fontSize:"10px",color:C.ghost}}>{t.dimDesc[type]}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error */}
        {error&&(
          <div style={{marginTop:"20px",fontSize:"13px",color:"#a03020",fontFamily:MONO,
            borderLeft:"2px solid #d06050",paddingLeft:"14px",lineHeight:1.7}}>
            {error}
          </div>
        )}

        {/* Generate button — centered, generous space */}
        <div style={{display:"flex",justifyContent:"center",marginTop:"48px"}}>
          <button onClick={generate} disabled={generating}
            style={{
              background:generating?C.surface:C.ink,
              color:generating?C.ghost:C.white,
              border:`1px solid ${generating?C.line:C.ink}`,
              borderRadius:"3px",padding:"18px 64px",
              fontFamily:MONO,fontSize:"14px",letterSpacing:"5px",
              cursor:generating?"not-allowed":"pointer",
              transition:"all 0.25s cubic-bezier(0.16,1,0.3,1)",
              display:"flex",alignItems:"center",gap:"14px",minWidth:"280px",justifyContent:"center",
            }}
            onMouseEnter={e=>{if(!generating){e.currentTarget.style.background="#2a2a2a";}}}
            onMouseLeave={e=>{if(!generating){e.currentTarget.style.background=C.ink;}}}>
            {generating&&(
              <svg width="15" height="15" viewBox="0 0 16 16"
                style={{animation:"spin 1s linear infinite",flexShrink:0}}>
                <circle cx="8" cy="8" r="6" stroke={C.line} strokeWidth="1.5" fill="none"/>
                <path d="M8 2 A6 6 0 0 1 14 8" stroke={C.ghost} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            )}
            {generating?t.generating:t.generate}
          </button>
        </div>

        {/* Status dots */}
        {usedDims.length>0&&(
          <div style={{display:"flex",justifyContent:"center",marginTop:"24px",gap:"6px",alignItems:"center",flexWrap:"wrap"}}>
            {usedDims.map((d,i)=>(
              <span key={i} style={{fontSize:"10px",color:C.ghost,fontFamily:MONO,letterSpacing:"0.5px"}}>
                {d}{i<usedDims.length-1&&<span style={{color:C.line,margin:"0 4px"}}>·</span>}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ══ OUTPUT SECTION ══════════════════════════════════════════════════
           Full width, tall area, tabs across the top
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{flex:1,display:"flex",flexDirection:"column",minHeight:"560px"}}>

        {/* Tab bar */}
        <div className="m-tabs" style={{display:"flex",borderBottom:`1px solid ${C.line}`,background:C.bg,flexShrink:0}}>
          {t.variantKeys.map((key,i)=>{
            const isAct=activeTab===key;
            const hasCt=!!outputs[key];
            return(
              <button key={key} className="m-tab-btn" onClick={()=>{if(hasOutput)setActiveTab(key);}}
                style={{
                  flex:1,background:isAct?C.white:"transparent",
                  color:isAct?C.ink:hasOutput?C.dim:C.ghost,
                  border:"none",
                  borderRight:i<2?`1px solid ${C.line}`:"none",
                  borderBottom:isAct?`2px solid ${C.ink}`:"2px solid transparent",
                  marginBottom:"-1px",
                  padding:"20px 32px 18px",
                  fontFamily:MONO,fontSize:"12px",letterSpacing:"2px",
                  cursor:hasOutput?"pointer":"default",
                  transition:"all 0.2s",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:"14px",
                }}
                onMouseEnter={e=>{if(hasOutput&&!isAct){e.currentTarget.style.background=C.surface;e.currentTarget.style.color=C.dim;}}}
                onMouseLeave={e=>{if(!isAct){e.currentTarget.style.background="transparent";e.currentTarget.style.color=hasOutput?C.dim:C.ghost;}}}>
                <span style={{fontFamily:SERIF,fontStyle:"italic",fontSize:"22px",
                  color:isAct?C.ink:hasCt?C.dim:C.line,transition:"color 0.2s",lineHeight:1}}>
                  {key}
                </span>
                <span>{t.variantTabs[i].slice(4)}</span>
                {hasCt&&<span style={{width:"4px",height:"4px",borderRadius:"50%",
                  background:isAct?C.ink:C.line,marginLeft:"auto",flexShrink:0}}/>}
              </button>
            );
          })}

          {/* Regenerate & Clear */}
          <div style={{display:"flex",alignItems:"center",padding:"0 32px",borderLeft:`1px solid ${C.line}`, gap:"24px"}}>
            {hasOutput&&!generating?(
              <>
                <button onClick={generate}
                  style={{background:"none",border:"none",color:C.ghost,cursor:"pointer",
                    fontFamily:MONO,fontSize:"11px",letterSpacing:"1.5px",padding:0,
                    transition:"color 0.18s",whiteSpace:"nowrap"}}
                  onMouseEnter={e=>e.currentTarget.style.color=C.ink}
                  onMouseLeave={e=>e.currentTarget.style.color=C.ghost}>
                  {t.regenerate}
                </button>
                <button onClick={()=>{setOutputs({A:"",B:"",C:""});setActiveTab("A");}}
                  style={{background:"none",border:"none",color:C.ghost,cursor:"pointer",
                    fontFamily:MONO,fontSize:"11px",letterSpacing:"1.5px",padding:0,
                    transition:"color 0.18s",whiteSpace:"nowrap"}}
                  onMouseEnter={e=>e.currentTarget.style.color="#d06050"}
                  onMouseLeave={e=>e.currentTarget.style.color=C.ghost}>
                  {t.clear}
                </button>
              </>
            ):(
              <span style={{fontSize:"9px",color:C.line,fontFamily:MONO,letterSpacing:"2px"}}>{t.yr}</span>
            )}
          </div>
        </div>

        {/* Output content */}
        <div style={{flex:1,background:C.white,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* Empty / loading state */}
          {(!hasOutput||generating)&&(
            <div className="m-pad" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",
              flexDirection:"column",gap:"28px",padding:"80px 64px",minHeight:"400px"}}>
              {generating?(
                <div style={{textAlign:"center", width: "100%", maxWidth: "240px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                  <svg width="64" height="64" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '16px'}}>
                    <g style={{animation: "writing 2.5s ease-in-out infinite", transformOrigin: "115px 185px"}}>
                      <path d="M 115 185 C 135 135 165 75 185 55 C 195 45 200 60 190 75 C 165 115 135 165 115 185 Z" fill={C.dim} stroke={C.dim} strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M 185 55 C 165 75 145 115 115 185" stroke={C.bg} strokeWidth="2" strokeLinecap="round"/>
                      <path d="M 170 85 L 185 80" stroke={C.bg} strokeWidth="2" strokeLinecap="round"/>
                      <path d="M 155 110 L 170 105" stroke={C.bg} strokeWidth="2" strokeLinecap="round"/>
                      <path d="M 140 135 L 155 130" stroke={C.bg} strokeWidth="2" strokeLinecap="round"/>
                      <path d="M 115 185 L 110 200 L 120 190 Z" fill={C.dim}/>
                    </g>
                  </svg>
                  <div style={{fontSize:"12px",letterSpacing:"4px",color:C.dim,fontFamily:MONO, animation: "breathe 2s ease-in-out infinite", marginBottom: "20px"}}>
                    {t.conceiving}
                  </div>
                  <div style={{width: "100%", height: "2px", background: C.line, borderRadius: "1px", overflow: "hidden"}}>
                    <div style={{height: "100%", background: C.wine, animation: "progress 15s cubic-bezier(0.1, 0.8, 0.3, 1) forwards"}} />
                  </div>
                </div>
              ):(
                <div style={{textAlign:"center",maxWidth:"520px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                  <svg width="240" height="200" viewBox="0 0 400 300" fill="none" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '24px'}}>
                    {/* Paper */}
                    <path d="M 60 40 L 340 40 L 340 260 L 60 260 Z" fill={C.surface} strokeWidth="3"/>
                    
                    {/* Text lines parallel to paper edges */}
                    <path d="M 90 80 L 310 80" strokeWidth="3"/>
                    <path d="M 90 110 L 280 110" strokeWidth="3"/>
                    <path d="M 90 140 L 310 140" strokeWidth="3"/>
                    <path d="M 90 170 L 290 170" strokeWidth="3"/>
                    <path d="M 90 200 L 180 200" strokeWidth="3"/>
                    <path d="M 90 230 L 250 230" strokeWidth="3"/>

                    <g style={{animation: "writing 2.5s ease-in-out infinite", transformOrigin: "200px 200px"}}>
                      {/* Pen Back */}
                      <path d="M 230 150 L 330 50 L 350 70 L 250 170 Z" fill={C.ink} strokeWidth="2"/>
                      <path d="M 290 90 L 300 100" stroke={C.surface} strokeWidth="2"/> {/* Pen clip/highlight */}
                      
                      {/* Pen Front */}
                      <path d="M 250 170 L 190 200 L 180 200 L 190 190 L 230 150 Z" fill={C.ink} strokeWidth="2"/>
                      <path d="M 190 200 L 180 200 L 190 190 Z" fill={C.surface} strokeWidth="1.5"/> {/* Nib */}
                      
                      {/* Ink trail */}
                      <path d="M 170 200 Q 175 195 180 200" strokeWidth="3" fill="none"/>
                    </g>
                  </svg>
                  <p style={{fontSize:"15px",color:C.ghost,fontFamily:MONO,lineHeight:1.9,letterSpacing:"0.3px"}}>
                    {t.emptyStateText}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Active output */}
          {hasOutput&&!generating&&(
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <OutputVariant
                key={activeTab}
                text={outputs[activeTab]}
                variantKey={activeTab}
                label={t.variantTabs[tabIdx]}
                desc={t.variantDesc[tabIdx]}
                t={t}
              />
            </div>
          )}
        </div>
      </section>

      {settingsOpen&&(
        <APISettings config={apiConfig} onSave={(c)=>{
          setApiConfig(c);
          localStorage.setItem("apiConfig", JSON.stringify(c));
        }} onClose={()=>setSettingsOpen(false)} t={t}/>
      )}
    </div>
  );
}
