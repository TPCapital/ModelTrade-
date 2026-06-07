import React from "react";
import { createRoot } from "react-dom/client";
import { AlertTriangle, BarChart3, Brain, CheckCircle2, Gauge, ShieldCheck } from "lucide-react";
import "./styles.css";

const rules = [
  "Trade QQQ only until execution data proves expansion is safe.",
  "One contract during account rebuilding. No scale-up after wins.",
  "No new positions before 09:45 ET or after 11:30 ET.",
  "VWAP, EMA, volume, and time window are all mandatory.",
  "At a $20 option loss, exit at market without negotiation.",
  "Near a $50 daily loss, stop for the day.",
  "If revenge or prove-yourself psychology appears, stop immediately.",
];

const models = [
  {
    title: "Negative GEX + VWAP Break",
    tag: "QQQ Options",
    text: "Negative GEX, VWAP lost or unreclaimed, directional 9EMA, and 1.5x volume. Follow confirmed breaks; do not bottom-fish.",
  },
  {
    title: "Positive GEX VWAP Pullback",
    tag: "Mean Reversion",
    text: "Positive GEX suppresses volatility. Wait for VWAP pullbacks and EMA support instead of chasing fake breakouts.",
  },
  {
    title: "Gold Liquidity Sweep Recovery",
    tag: "Gold",
    text: "Sweep prior high or low, reclaim structure, confirm with CHoCH, and make sure DXY plus real rates are not both against the trade.",
  },
  {
    title: "EUR EMA Trend Pullback",
    tag: "EUR/USD",
    text: "EMA 9/21/55 aligned with ADX above 25. Pull back to EMA21 or structure, then wait for rejection confirmation.",
  },
];

function useStoredState(key, fallback) {
  const [value, setValue] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  });
  const update = (next) => {
    const resolved = typeof next === "function" ? next(value) : next;
    setValue(resolved);
    try {
      localStorage.setItem(key, JSON.stringify(resolved));
    } catch {}
  };
  return [value, update];
}

function PositionSizer() {
  const [account, setAccount] = React.useState(1000);
  const [riskPct, setRiskPct] = React.useState(2);
  const [optionPrice, setOptionPrice] = React.useState(1);
  const maxPremium = Math.round((account * riskPct) / 100);
  const contracts = Math.max(0, Math.floor(maxPremium / (optionPrice * 100)));
  return (
    <section className="panel accent-teal">
      <div className="section-title"><Gauge /> Position Sizer</div>
      <div className="inputs">
        <label>Account<input type="number" value={account} min="100" onChange={(e) => setAccount(Math.max(100, Number(e.target.value) || 100))} /></label>
        <label>Risk %<input type="number" value={riskPct} min="1" max="3" onChange={(e) => setRiskPct(Math.max(1, Math.min(3, Number(e.target.value) || 1)))} /></label>
        <label>Option Price<input type="number" value={optionPrice} step="0.05" min="0.05" onChange={(e) => setOptionPrice(Math.max(0.05, Number(e.target.value) || 0.05))} /></label>
      </div>
      <div className="metrics">
        <strong>${maxPremium}</strong><span>max premium</span>
        <strong>{contracts}</strong><span>max contracts</span>
        <strong>${Math.round(account * 0.05)}</strong><span>daily stop</span>
      </div>
    </section>
  );
}

function GexSetup() {
  const [setup, setSetup] = useStoredState("specularis-gex", { regime: "", gammaFlip: "", callWall: "", putWall: "" });
  const ready = setup.regime && setup.gammaFlip && setup.callWall && setup.putWall;
  const update = (key, value) => setSetup((current) => ({ ...current, [key]: value }));
  return (
    <section className="panel accent-violet">
      <div className="section-title"><BarChart3 /> GEX Daily Setup <span className={ready ? "pill good" : "pill warn"}>{ready ? "ready" : "required"}</span></div>
      <div className="regime-row">
        <button className={setup.regime === "positive" ? "selected" : ""} onClick={() => update("regime", "positive")}>Positive GEX<br /><small>range / mean reversion</small></button>
        <button className={setup.regime === "negative" ? "selected" : ""} onClick={() => update("regime", "negative")}>Negative GEX<br /><small>trend / vol expansion</small></button>
      </div>
      <div className="inputs four">
        <label>Gamma Flip<input value={setup.gammaFlip} onChange={(e) => update("gammaFlip", e.target.value)} /></label>
        <label>Call Wall<input value={setup.callWall} onChange={(e) => update("callWall", e.target.value)} /></label>
        <label>Put Wall<input value={setup.putWall} onChange={(e) => update("putWall", e.target.value)} /></label>
        <label>Vol Trigger<input value={setup.volTrigger || ""} onChange={(e) => update("volTrigger", e.target.value)} /></label>
      </div>
    </section>
  );
}

function Checklist() {
  const [checked, setChecked] = React.useState({});
  const count = Object.values(checked).filter(Boolean).length;
  return (
    <section className="panel accent-red">
      <div className="section-title"><ShieldCheck /> Pre-Entry Checklist <span className="pill">{count}/{rules.length}</span></div>
      <div className="checklist">
        {rules.map((rule, index) => (
          <button key={rule} className={checked[index] ? "checked" : ""} onClick={() => setChecked((current) => ({ ...current, [index]: !current[index] }))}>
            <CheckCircle2 /> {rule}
          </button>
        ))}
      </div>
    </section>
  );
}

function App() {
  return (
    <main>
      <header className="hero">
        <div className="badges"><span>QQQ</span><span>0DTE</span><span>Gold</span><span>EUR/USD</span><span>Risk First</span></div>
        <h1>Specularis Trading Model</h1>
        <p>Decision training for QQQ options, gold, EUR/USD, macro filters, GEX setup, position sizing, and discipline drills.</p>
        <div className="warning"><AlertTriangle /> No complete signal, no trade. No GEX setup, no trade. Unstable emotions, no trade.</div>
      </header>
      <div className="grid top"><PositionSizer /><GexSetup /></div>
      <section className="panel">
        <div className="section-title"><Brain /> High EV Model Library</div>
        <div className="cards">{models.map((m) => <article key={m.title}><span>{m.tag}</span><h2>{m.title}</h2><p>{m.text}</p></article>)}</div>
      </section>
      <Checklist />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
