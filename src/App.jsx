import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  Globe2,
  LineChart,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

const cards = [
  { title: "Market Regime", value: "Risk-On Watch", note: "Only trade when structure, timing and catalyst align.", icon: Globe2 },
  { title: "Execution Grade", value: "A+ Only", note: "Sweep + reclaim + FVG retest + confirmation candle.", icon: Target },
  { title: "Risk Protocol", value: "Max 2%", note: "No oversizing, no revenge trade, no Asian-session chop.", icon: ShieldCheck },
  { title: "Training Mode", value: "Active", note: "Review checklist before every options or XAUUSD entry.", icon: BrainCircuit },
];

const checklist = [
  "Trend and session are aligned",
  "Liquidity sweep has already happened",
  "Entry is near boundary, not middle POC",
  "Stop-loss level is clear before entry",
  "Position size is calculated before order",
  "News risk and spread risk are checked",
];

const models = [
  { name: "A1 · Sweep → Reclaim → Expansion", score: 9.2, status: "Primary" },
  { name: "A2 · Trend Pullback into FVG", score: 8.4, status: "Allowed" },
  { name: "B1 · Boundary Rejection", score: 7.1, status: "Observe" },
  { name: "C · Random / Emotional Trade", score: 2.4, status: "Forbidden" },
];

function Pill({ children, tone = "neutral" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function App() {
  const [capital, setCapital] = useState(2000);
  const [riskPct, setRiskPct] = useState(2);

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
            <Pill tone="live">SPECULARIS CAPITAL · VERCEL SAFE BUILD</Pill>
            <h1>Trading Model Training System</h1>
            <p className="hero-copy">
              黄金、EUR 与美股期权交易模型训练终端。当前版本已补齐 Vite 入口结构，适配 Vercel 静态部署。
            </p>
            <div className="hero-actions">
              <a href="#checklist" className="primary-button">进入执行清单</a>
              <a href="#risk" className="ghost-button">查看风控</a>
            </div>
          </div>
          <div className="status-panel">
            <div className="status-line"><CheckCircle2 size={18} /> Build Ready</div>
            <div className="status-line"><Activity size={18} /> Vite + React</div>
            <div className="status-line"><Gauge size={18} /> Static Output: dist</div>
          </div>
        </div>
      </section>

      <section className="card-grid">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <article className="terminal-card" key={item.title}>
              <Icon className="card-icon" size={24} />
              <p className="card-label">{item.title}</p>
              <h2>{item.value}</h2>
              <p>{item.note}</p>
            </article>
          );
        })}
      </section>

      <section className="layout-grid">
        <article className="terminal-card" id="checklist">
          <div className="section-title"><Zap size={20} /> Pre-Trade Checklist</div>
          <div className="checklist">
            {checklist.map((item, index) => (
              <label key={item} className="check-row">
                <input type="checkbox" />
                <span>{index + 1}. {item}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="terminal-card" id="risk">
          <div className="section-title"><BarChart3 size={20} /> Position Risk</div>
          <div className="input-grid">
            <label>
              <span>Account Capital</span>
              <input value={capital} onChange={(e) => setCapital(e.target.value)} inputMode="decimal" />
            </label>
            <label>
              <span>Risk %</span>
              <input value={riskPct} onChange={(e) => setRiskPct(e.target.value)} inputMode="decimal" />
            </label>
          </div>
          <div className="risk-output">
            <span>Maximum Risk Per Trade</span>
            <strong>${riskAmount}</strong>
          </div>
          <p className="muted">This is a training reference, not financial advice.</p>
        </article>
      </section>

      <section className="terminal-card">
        <div className="section-title"><LineChart size={20} /> Model Scoreboard</div>
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

      <section className="warning-card">
        <AlertTriangle size={20} />
        <p>Only execute A+ setups. If the trade needs persuasion, it is not a trade.</p>
      </section>
    </main>
  );
}

export default App;
