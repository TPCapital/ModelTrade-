import React from "react";

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="top-flow-bar" />
        <div className="hero-grid">
          <div>
            <span className="pill">SPECULARIS CAPITAL · VERCEL READY</span>
            <h1>Trading Model Training System</h1>
            <p className="hero-copy">黄金、EUR 与美股期权交易模型训练终端。当前版本已补齐 Vite 入口结构，适配 Vercel 静态部署。</p>
          </div>
          <div className="status-panel">
            <div>✓ Build Ready</div>
            <div>✓ Vite + React</div>
            <div>✓ Static Output: dist</div>
          </div>
        </div>
      </section>
      <section className="card-grid">
        <article className="terminal-card"><p>Market Regime</p><h2>Risk-On Watch</h2><span>Trade only when structure, timing and catalyst align.</span></article>
        <article className="terminal-card"><p>Execution Grade</p><h2>A+ Only</h2><span>Sweep + reclaim + FVG retest + confirmation candle.</span></article>
        <article className="terminal-card"><p>Risk Protocol</p><h2>Max 2%</h2><span>No oversizing. No emotional trade. No random entry.</span></article>
        <article className="terminal-card"><p>Training Mode</p><h2>Active</h2><span>Review checklist before every entry.</span></article>
      </section>
    </main>
  );
}

export default App;
