import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const TEXT = {
  zh: {
    tag: "SPECULARIS CAPITAL · 交易执行训练系统",
    title: "Trading Model Training System",
    subtitle: "黄金、EUR 与美股期权训练终端。核心目标不是预测市场，而是把每一笔交易压缩成：看什么、等什么、做什么、不做什么。",
    build: "构建状态",
    ready: "Vercel 已修复",
    entry: "React 入口已恢复",
    output: "输出目录 dist",
    checklist: "交易前清单",
    risk: "仓位风险计算",
    models: "模型评分板",
    rules: "铁律",
    capital: "账户本金",
    riskPct: "单笔风险 %",
    maxRisk: "单笔最大亏损",
    note: "训练用途，不构成金融建议。",
  },
  en: {
    tag: "SPECULARIS CAPITAL · EXECUTION TRAINING OS",
    title: "Trading Model Training System",
    subtitle: "A training terminal for XAU, EUR and US options. The goal is not prediction, but disciplined execution: what to watch, what to wait for, what to do, and what to avoid.",
    build: "Build Status",
    ready: "Vercel fixed",
    entry: "React entry restored",
    output: "Output directory: dist",
    checklist: "Pre-Trade Checklist",
    risk: "Position Risk Calculator",
    models: "Model Scoreboard",
    rules: "Iron Rules",
    capital: "Account Capital",
    riskPct: "Risk % Per Trade",
    maxRisk: "Maximum Risk Per Trade",
    note: "For training only. Not financial advice.",
  },
};

const cards = [
  ["Market Regime", "Risk-On Watch", "Only trade when structure, timing and catalyst align."],
  ["Execution Grade", "A+ Only", "Sweep + reclaim + FVG retest + confirmation candle."],
  ["Risk Protocol", "Max 2%", "No oversizing, no revenge trade, no random entry."],
  ["Training Mode", "Active", "Review the checklist before every execution."],
];

const checklist = [
  "Trend and session are aligned",
  "Liquidity sweep has already happened",
  "Entry is near boundary, not middle POC",
  "FVG / reclaim / confirmation candle is visible",
  "Stop-loss level is clear before entry",
  "Position size is calculated before order",
  "News risk, spread risk and IV risk are checked",
  "Exit plan is written before entry",
];

const models = [
  { name: "A1 · Sweep → Reclaim → Expansion", score: 9.2, status: "Primary" },
  { name: "A2 · Trend Pullback into FVG", score: 8.4, status: "Allowed" },
  { name: "B1 · Boundary Rejection", score: 7.1, status: "Observe" },
  { name: "C · Random / Emotional Trade", score: 2.4, status: "Forbidden" },
];

const rules = [
  "If the trade needs persuasion, it is not a trade.",
  "No Asian-session chop unless the setup is objectively A+.",
  "No trade in the middle of POC congestion.",
  "One clean A+ setup is better than five forced B trades.",
];

function App() {
  const [lang, setLang] = useState("zh");
  const [capital, setCapital] = useState("2000");
  const [riskPct, setRiskPct] = useState("2");
  const t = TEXT[lang];

  const riskAmount = useMemo(() => {
    const c = Number(capital) || 0;
    const r = Number(riskPct) || 0;
    return Math.max(0, (c * r) / 100).toFixed(2);
  }, [capital, riskPct]);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="top-flow-bar" />
        <div className="hero-grid">
          <div>
            <div className="hero-topline">
              <span className="pill">{t.tag}</span>
              <button className="toggle" onClick={() => setLang(lang === "zh" ? "en" : "zh")}>{lang === "zh" ? "EN" : "中文"}</button>
            </div>
            <h1>{t.title}</h1>
            <p className="hero-copy">{t.subtitle}</p>
            <div className="nav-row">
              <a href="#checklist">Checklist</a>
              <a href="#risk">Risk</a>
              <a href="#models">Models</a>
              <a href="#rules">Rules</a>
            </div>
          </div>
          <div className="status-panel">
            <p>{t.build}</p>
            <div>✓ {t.ready}</div>
            <div>✓ {t.entry}</div>
            <div>✓ {t.output}</div>
          </div>
        </div>
      </section>

      <section className="card-grid">
        {cards.map(([label, value, note]) => (
          <article className="terminal-card" key={label}>
            <p>{label}</p>
            <h2>{value}</h2>
            <span>{note}</span>
          </article>
        ))}
      </section>

      <section className="layout-grid">
        <article className="terminal-card" id="checklist">
          <h3>{t.checklist}</h3>
          <div className="checklist">
            {checklist.map((item, i) => (
              <label className="check-row" key={item}>
                <input type="checkbox" />
                <span>{String(i + 1).padStart(2, "0")} · {item}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="terminal-card" id="risk">
          <h3>{t.risk}</h3>
          <div className="input-grid">
            <label>
              <span>{t.capital}</span>
              <input value={capital} onChange={(e) => setCapital(e.target.value)} inputMode="decimal" />
            </label>
            <label>
              <span>{t.riskPct}</span>
              <input value={riskPct} onChange={(e) => setRiskPct(e.target.value)} inputMode="decimal" />
            </label>
          </div>
          <div className="risk-output">
            <span>{t.maxRisk}</span>
            <strong>${riskAmount}</strong>
          </div>
          <small>{t.note}</small>
        </article>
      </section>

      <section className="terminal-card" id="models">
        <h3>{t.models}</h3>
        <div className="model-list">
          {models.map((model) => (
            <div className="model-row" key={model.name}>
              <div>
                <strong>{model.name}</strong>
                <span>{model.status}</span>
              </div>
              <div className="score-bar"><i style={{ width: `${model.score * 10}%` }} /></div>
              <b>{model.score.toFixed(1)}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="terminal-card rules-card" id="rules">
        <h3>{t.rules}</h3>
        {rules.map((rule) => <blockquote key={rule}>{rule}</blockquote>)}
      </section>
    </main>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

export default App;
