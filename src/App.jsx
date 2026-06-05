import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowRight, Ban, BarChart3, Brain,
  CheckCircle2, ChevronRight, Clock, Gauge, Layers, LineChart,
  ShieldAlert, Target, TrendingUp, XCircle, Zap, Globe, Lock,
  BookOpen, BarChart2, Flame, TrendingDown, Edit3, Save, ExternalLink,
} from "lucide-react";
import { I } from './i18n.js';

function cn(...c) { return c.filter(Boolean).join(" "); }

const safeLang = () => { try { return localStorage.getItem("sea-lang") || "zh"; } catch { return "zh"; } };
const TX = {
  "日内时间热力 (ET)":"Intraday Time Heatmap (ET)", "优先":"Active", "禁做":"Banned", "时间过滤优先于普通信号":"Time filter overrides ordinary signals",
  "正GEX":"Positive GEX", "负GEX":"Negative GEX", "震荡·压制波动·均值回归":"Range · Vol Suppression · Mean Reversion", "趋势·放大波动·单边延伸":"Trend · Vol Expansion · One-Way Extension",
  "做市商 Long Gamma → 价格涨时卖出 / 价格跌时买入":"Dealers long gamma → sell when price rises / buy when price falls", "做市商 Short Gamma → 价格涨时追买 / 价格跌时追卖":"Dealers short gamma → chase-buy when price rises / chase-sell when price falls",
  "涨了有压，跌了有托":"Upside gets capped; dips get supported", "涨会更涨，跌会更跌":"Up moves extend; down moves extend",
  "VWAP附近反复拉扯，假突破多":"Choppy around VWAP; many fake breakouts", "追单容易被反杀":"Chasing is easily faded", "高低点不容易突破杀穿":"Highs/lows less likely to break cleanly", "更适合等回踩、做区间":"Better to wait for pullbacks / trade range",
  "突破后容易加速":"Breakouts can accelerate", "跌破后容易瀑布":"Breakdowns can cascade", "VWAP失守/站回是节奏切换":"VWAP loss/reclaim marks regime shift", "容易出现单边行情":"One-way sessions become more likely",
  "少追突破，多等VWAP回踩/EMA确认，偏区间均值回归":"Avoid chasing; wait for VWAP pullback / EMA confirmation; range mean-reversion bias", "少逆势抄底摸顶，等破位确认顺势，VWAP得失是第一参考线":"Avoid countertrend bottoms/tops; wait for confirmed break and follow trend; VWAP is the first regime line",
  "上方压力":"Overhead Resistance", "下方支撑":"Downside Support", "节奏切换":"Regime Switch", "波动启动":"Vol Trigger",
  "上方最大Call Gamma集中区":"Largest overhead Call Gamma concentration", "下方最大Put Gamma集中区":"Largest downside Put Gamma concentration", "正负GEX切换核心区域":"Core area where Positive/Negative GEX flips", "盘面从震荡切趋势的价格位":"Price level where market shifts from range to trend",
  "容易出现钉盘、受压或挤空":"May pin, reject, or squeeze", "守住时容易形成托底；跌破后空间打开":"If holds, it supports; if breaks, downside opens", "站上偏稳定；跌破偏放大":"Above = stable; below = amplified", "站不上→震荡区间；跌破→波动放大":"Unable to reclaim = range; break = volatility expands",
  "靠近时不追Call，等突破确认或冲高衰竭":"Do not chase Calls near it; wait for confirmed break or upside exhaustion", "靠近时不追Put，等跌破确认或承接信号":"Do not chase Puts near it; wait for confirmed break or support signal", "跌破→负GEX节奏激活；站回→正GEX修复":"Break below → Negative GEX activated; reclaim → Positive GEX repaired", "跌破后是顺势信号而非抄底信号":"After break, it is a trend-follow signal, not dip-buy signal", "操作思路":"Playbook",
  "今日: 正GEX":"Today: Positive GEX", "今日: 负GEX":"Today: Negative GEX", "GEX 机制说明 · 两种市场节奏":"GEX Mechanics · Two Market Regimes", "GEX是波动节奏地图，不是方向预测器。先判断今日是哪种环境，再选对应的执行模式。两种环境用同一套操作方法会亏钱。":"GEX is a volatility-regime map, not a direction predictor. Identify today's environment first, then choose the matching playbook. Using one method for both regimes loses money.",
  "今日已设置":"Set Today", "今日尚未设置 · 开盘前必填":"Not Set Today · Required Before Open", "GEX 每日设置":"GEX Daily Setup", "编辑":"Edit", "正GEX · 震荡压制":"Positive GEX · Range Suppression", "负GEX · 趋势放大":"Negative GEX · Trend Expansion", "仅储存在本设备浏览器，不上传，不共享":"Stored only in this browser. Not uploaded or shared.", "今日GEX环境":"Today's GEX Environment", "震荡 · 压制波动":"Range · Vol Suppression", "趋势 · 放大波动":"Trend · Vol Expansion", "关键价位":"Key Levels", "价格":"Price", "保存今日设置":"Save Today's Setup", "取消":"Cancel", "* 必填 · 仅储存在本设备，不上传，不共享":"* Required · Stored locally only. Not uploaded or shared.",
  "今日偏区间 · 少追突破，等VWAP回踩/EMA确认后再入场":"Range bias today · avoid chasing; wait for VWAP pullback / EMA confirmation", "今日偏趋势 · 等破位确认顺势，VWAP得失是第一节奏信号":"Trend bias today · wait for confirmed break and follow trend; VWAP is the first regime signal",
  "仓位计算器 · 开仓前必过此关":"Position Sizer · Must Pass Before Entry", "账户总额 ($)":"Account Size ($)", "单笔风险":"Per-Trade Risk", "期权价格 ($)":"Option Price ($)", "单笔最多权利金":"Max Premium / Trade", "最多合约数":"Max Contracts", "同时持仓上限":"Open Position Cap", "日亏熔断线":"Daily Loss Limit", "账户":"Account", "按":"At", "张":"ct", "账户×6%":"Account × 6%", "账户×5%→当日停":"Account × 5% → stop for day", "公式：张数=":"Formula: contracts=", "向下取整。结果为0→该期权对账户过贵，换便宜合约。":"round down. If result is 0 → contract too expensive for account; choose cheaper contract.", "熔断阈值（自动计算）":"Circuit Breakers (Auto-Calculated)", "日内连亏2笔":"2 consecutive intraday losses", "日内连亏3笔":"3 consecutive intraday losses", "停30分钟+复盘":"Stop 30 min + review", "当日停止":"Stop for the day", "本周停，周末复盘":"Stop this week; weekend review",
  "仓位增长路径":"Position Scaling Path", "起步阶段":"Starting Phase", "1张":"1 contract", "2张":"2 contracts", "3张":"3 contracts", "无条件。账户重建阶段，不谈加张。":"Unconditional. Rebuilding phase: no scaling discussion.", "连续20笔稳定执行+零次熔断触发+EV>0":"20 clean executions + zero circuit breakers + EV>0", "再累积20笔满足上述条件":"Another 20 trades meeting the same conditions", "任何熔断触发→立即降回1张":"Any circuit breaker → immediately drop back to 1 contract", "重置计数器，从20笔重新开始":"Reset counter; restart from 20 trades", "你的数据已经给出答案":"Your data already gave the answer", "1张→每天稳定盈 · 多张→两天−50%":"1 contract → stable daily gains · multiple contracts → −50% in two days", "边不是加仓加出来的，是纪律守出来的。":"Edge is not created by sizing up; it is protected by discipline.",
  "正股目标→期权估算":"Stock Target → Option Estimate", "类型":"Type", "当前正股":"Current Stock", "目标价":"Target Price", "止损价":"Stop Price", "当前期权价":"Current Option Price", "张数":"Contracts", "目标期权估算价":"Estimated Option at Target", "目标盈亏":"Target P&L", "止损估算":"Stop Estimate", "不含IV、Theta、Gamma和价差。结合$20止损规则使用。":"Excludes IV, Theta, Gamma, and spread. Use with the $20 stop rule.", "刀":" USD",
  "当前聚焦":"Current Focus", "Call/进攻":"Call / Attack", "等待/降仓":"Wait / Reduce", "Put/防守":"Put / Defense", "极高":"Very High", "高":"High", "中":"Medium", "低":"Low", "强 Risk ON":"Strong Risk ON", "正常区间":"Normal Range", "期权变贵":"Options Expensive", "VIX突然暴涨":"VIX Spike", "VIX<15，市场平静":"VIX < 15, calm market", "VIX 15–25，正常执行":"VIX 15–25, normal execution", "VIX>25，溢价高":"VIX > 25, high premium", "VIX急速上行，方向混沌":"VIX surging, direction chaotic", "期权买方环境最友好，成本低，可正常执行":"Best environment for option buyers; lower cost, normal execution", "按常规系统执行，无需特别调整":"Execute normally; no special adjustment", "降低预期或缩小仓位，买方需更大方向移动才盈利":"Lower expectations or reduce size; buyers need larger move to profit", "跳过当天，不参与，等市场稳定":"Skip the day; wait for stability", "进攻":"Attack", "常规":"Normal", "缩仓":"Reduce", "跳过":"Skip",
  "实际利率（TIPS/10Y）":"Real Rates (TIPS/10Y)", "强负相关":"Strong Negative Corr.", "第一驱动。实际利率↑→金价受压":"Primary driver. Real rates ↑ → gold pressured", "美元指数 DXY":"Dollar Index DXY", "负相关":"Negative Corr.", "美元走强，金价通常承压":"Stronger dollar usually pressures gold", "Fed 政策路径 / FOMC":"Fed Policy Path / FOMC", "鸽派利多":"Dovish Bullish", "鸽派→利率预期下行→金价受支撑":"Dovish → rate expectations down → gold supported", "CPI / PCE / NFP 数据":"CPI / PCE / NFP Data", "事件触发":"Event Trigger", "偏离预期→剧烈波动，是方向触发器":"Surprise vs expectation → sharp move; direction trigger", "央行购金 / 实物需求":"Central Bank Buying / Physical Demand", "结构性底部":"Structural Floor", "长期慢变量，提供下方支撑":"Long-term slow variable; provides downside support", "避险 / 地缘冲突":"Safe Haven / Geopolitics", "短期脉冲":"Short-Term Impulse", "突发事件→IV瞬间拉高→谨慎追顶":"Sudden events spike IV; be careful chasing highs",
  "流动性扫单收回":"Liquidity Sweep Recovery", "黄金 A1":"Gold A1", "场景":"Setup", "扫前高/前低后，价格重新收回结构区":"Sweep prior high/low then reclaim structure", "触发":"Trigger", "长影线+CHoCH确认+量能启动":"Long wick + CHoCH confirmation + momentum starts", "放弃":"Abandon", "只扫不收 / DXY与实际利率双向反转":"Sweep without reclaim / DXY and real rates both against you", "POC / FVG / OB 共振":"POC / FVG / OB Confluence", "黄金 A2":"Gold A2", "成本集中区+OB/FVG+流动性位重叠":"Cost cluster + OB/FVG + liquidity overlap", "回踩拒绝+量能启动+宏观未反向":"Pullback rejection + momentum + macro not reversed", "共振区被直接穿透/实际利率+DXY双向反转":"Confluence zone breached / real rates + DXY both against you", "MA9 / MA21 动能过滤":"MA9 / MA21 Momentum Filter", "辅助":"Auxiliary", "强":"Strong", "价格>MA9>MA21（只过滤，不开仓）":"Price > MA9 > MA21 (filter only, not trigger)", "弱":"Weak", "价格<MA9<MA21":"Price < MA9 < MA21", "提醒":"Reminder", "均线是过滤器，不是触发器":"MA is a filter, not a trigger",
  "EMA趋势回踩":"EMA Trend Pullback", "EUR 主力":"EUR Main", "环境":"Environment", "EMA9/21/55顺排+ADX>25，趋势已确立":"EMA 9/21/55 aligned + ADX>25; trend confirmed", "入场":"Entry", "回踩EMA21/结构位，等拒绝K线确认":"Pullback to EMA21 / structure, wait for rejection candle", "ADX低/均线缠绕/数据发布前后":"Low ADX / tangled MAs / around data release", "破位不追":"Do Not Chase Breakout", "执行规则":"Execution Rule", "先等":"Wait First", "突破后不追第一根，等回踩":"Do not chase first breakout candle; wait for pullback", "再看":"Then Check", "回踩不破原突破位+重新放量":"Pullback holds breakout level + volume returns", "管理":"Manage", "RR≥1:2；到1:1.5先锁一半利润":"RR ≥ 1:2; lock half at 1:1.5",
  "黄金/EUR":"Gold/EUR", "扫前高/前低+重新收回结构":"Sweep prior high/low + reclaim structure", "长影线+CHoCH确认":"Long wick + CHoCH confirmation", "EV特征":"EV Profile", "中等胜率+高赔率。切忌只扫不收入场":"Moderate win rate + high payoff. Never enter sweep without reclaim", "POC/FVG/OB共振":"POC/FVG/OB Confluence", "成本区+OB/FVG+流动性位重叠":"Cost zone + OB/FVG + liquidity overlap", "共振点越多胜率越高，穿透则放弃":"More confluence = higher probability; breach = abandon", "EMA顺排+ADX>25确认趋势":"EMA alignment + ADX>25 confirms trend", "回踩EMA21/结构位不破":"Pullback to EMA21 / structure holds", "趋势日胜率高，均线缠绕时期望值极差":"High win rate on trend days; terrible EV when MAs are tangled", "负GEX+VWAP破位顺势":"Neg-GEX + VWAP Break Trend", "QQQ期权":"QQQ Options", "负GEX环境+VWAP失守/站不回+量能放大":"Negative GEX + VWAP lost / unable to reclaim + expanding volume", "VWAP破位确认+9EMA顺势+量能1.5x":"VWAP break confirmed + 9EMA directional + volume 1.5×", "负GEX日趋势延伸概率更高，是买方最好的环境":"Negative GEX days favor trend extension — best buyer environment", "正GEX VWAP回踩确认":"Pos-GEX VWAP Pullback Confirm", "正GEX环境+价格回踩VWAP不破+量能确认":"Positive GEX + price pulls back to VWAP and holds + volume confirmation", "VWAP收回+9EMA支撑+量能1.5x":"VWAP reclaim + 9EMA support + volume 1.5×", "正GEX压波动，回归成功率高于追突破":"Positive GEX suppresses vol; pullback success beats chasing breakouts", "事件后IV回落":"Post-Event IV Crush", "期权特有":"Options Specific", "FOMC/CPI发布后，方向定盘，IV开始回落":"After FOMC/CPI: direction set, IV starts to fall", "等二次确认，不追公布瞬间":"Wait for second confirmation; don't chase the release candle", "此时做debit/credit价差都有edge；IV降后买方才合理":"Debit/credit spreads both have edge; raw buyers wait for IV to cool",
  "日期时间":"Date/Time", "标的":"Instrument", "方向":"Direction", "进场理由":"Entry Rationale", "GEX环境":"GEX Environment", "情绪状态":"Emotional State", "满足全部铁律？":"All Iron Rules Met?", "结果盈亏":"Result P&L", "一句话总结":"One-Line Summary", "负GEX日+VWAP破位+9EMA顺势+放量":"Negative GEX + VWAP break + 9EMA aligned + volume", "负GEX · Flip $520.50 · Call Wall $525":"Negative GEX · Flip $520.50 · Call Wall $525", "平静 / 焦虑 / 冲动 / 报复":"Calm / anxious / impulsive / revenge", "是 / 否（写出哪条未满足）":"Yes / No (write which rule failed)", "负GEX顺势，执行到位":"Negative GEX trend-following, executed properly", "TradingView Bar Replay + Excel / Notion":"TradingView Bar Replay + Excel / Notion"
};
function tx(value, lang = safeLang()) {
  if (typeof value !== "string") return value;
  if (lang !== "en") return value;
  if (TX[value]) return TX[value];
  return value.replace(/(日损≥\$\d+)/g, (m)=>m.replace("日损≥", "Daily loss ≥")).replace(/(周损≥\$\d+)/g, (m)=>m.replace("周损≥", "Weekly loss ≥")).replace(/账户×/g, "Account × ").replace(/按\$(.*?)\/张/g, "At $$$1/contract");
}


/* ─── persistence helpers ─── */
function ls(key, fallback) { try { const v = localStorage.getItem(key); return v !== null ? v : fallback; } catch { return fallback; } }
function lsSet(key, val) { try { localStorage.setItem(key, val); } catch {} }

/* ─── Theme & Language Hooks ─── */
function useTheme() {
  const [theme, setTheme] = useState(() => ls("sea-theme", "dark"));
  const toggle = () => setTheme(t => { const n = t === "dark" ? "light" : "dark"; lsSet("sea-theme", n); return n; });
  return { theme, toggle };
}
function useLang() {
  const [lang, setLang] = useState(() => ls("sea-lang", "zh"));
  const toggle = () => setLang(l => { const n = l === "zh" ? "en" : "zh"; lsSet("sea-lang", n); return n; });
  return { lang, toggle };
}

/* ─── GEX Daily Setup Hook (localStorage, private to this browser) ─── */
function useGEXDailySetup() {
  const todayStr = new Date().toDateString();
  const EMPTY = { date: todayStr, state: null, gammaFlip: "", callWall: "", putWall: "", volTrigger: "", time: "", saved: false };
  const [setup, setSetup] = useState(() => {
    try {
      const s = localStorage.getItem("sea-gex-daily-v1");
      if (s) {
        const p = JSON.parse(s);
        if (p.date === todayStr) return p;
      }
    } catch (e) {}
    return EMPTY;
  });
  const saveSetup = (data) => {
    const toSave = { ...data, saved: true };
    try { localStorage.setItem("sea-gex-daily-v1", JSON.stringify(toSave)); } catch (e) {}
    setSetup(toSave);
  };
  const isToday = setup.saved && setup.date === todayStr;
  return { setup, saveSetup, isToday };
}

/* ─── UI Primitives ─── */
function Card({ children, className = "" }) {
  return <div className={cn("premium-card border border-cyan-300/10 bg-slate-950/78 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.42)] ring-1 ring-white/10", className)}>{children}</div>;
}
function Badge({ children, tone = "teal" }) {
  const m = { teal:"border-teal-600 bg-teal-500/10 text-teal-100", red:"border-red-600 bg-red-500/10 text-red-100", amber:"border-amber-600 bg-amber-500/10 text-amber-100", blue:"border-sky-600 bg-sky-500/10 text-sky-100", violet:"border-violet-600 bg-violet-500/10 text-violet-100", slate:"border-slate-400/40 bg-slate-900/58 text-slate-200", green:"border-emerald-600 bg-emerald-500/10 text-emerald-100" };
  return <span className={cn("rounded-full border px-3 py-1 text-xs font-black", m[tone])}>{children}</span>;
}
function KeyWord({ children, tone = "teal" }) {
  const m = { teal:"bg-teal-700 text-white", red:"bg-red-700 text-white", amber:"bg-amber-600 text-white", blue:"bg-sky-700 text-white", violet:"bg-violet-700 text-white", slate:"bg-slate-800 text-white", green:"bg-emerald-700 text-white" };
  return <span className={cn("inline-flex rounded-lg px-2 py-0.5 text-xs font-black", m[tone])}>{children}</span>;
}
function SectionHeader({ number, title, desc, tone = "teal", children }) {
  const m = { teal:"from-teal-700 to-cyan-600", blue:"from-sky-700 to-blue-600", red:"from-red-700 to-rose-600", amber:"from-amber-700 to-orange-600", violet:"from-violet-700 to-fuchsia-600", slate:"from-slate-800 to-slate-600", green:"from-emerald-700 to-teal-600" };
  return (
    <div className="mb-5 flex items-start gap-4">
      <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-base font-black text-white shadow-lg", m[tone])}>{number}</div>
      <div className="flex-1"><div className="flex items-start justify-between gap-3"><h2 className="text-2xl font-black tracking-tight text-slate-50">{title}</h2>{children}</div><p className="mt-1 max-w-4xl text-sm font-bold leading-7 text-slate-400">{desc}</p></div>
    </div>
  );
}
function RuleCard({ label, text, tone = "teal", icon: Icon = CheckCircle2 }) {
  const m = { teal:"border-teal-300/25 bg-teal-500/10 text-teal-100", red:"border-red-300/35 bg-red-950/45 text-red-100", amber:"border-amber-300/25 bg-amber-500/10 text-amber-100", blue:"border-sky-300/25 bg-sky-500/10 text-sky-100", violet:"border-violet-300/35 bg-violet-500/10 text-violet-100", slate:"border-white/10 bg-slate-900/58 text-slate-100", green:"border-emerald-300/25 bg-emerald-500/10 text-emerald-100" };
  return (
    <div className={cn("rounded-2xl border p-3 shadow-sm", m[tone])}>
      <div className="mb-1 flex items-center gap-2"><Icon className="h-4 w-4 shrink-0" /><span className="text-xs font-black uppercase tracking-wider opacity-80">{label}</span></div>
      <p className="text-sm font-black leading-6">{text}</p>
    </div>
  );
}
function FlowCard({ title, badge, tone = "teal", items = [], lang = safeLang() }) {
  const barColor = { teal:"bg-teal-700", blue:"bg-sky-700", amber:"bg-amber-600", red:"bg-red-700", violet:"bg-violet-700", green:"bg-emerald-700", slate:"bg-slate-700" };
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden rounded-[1.7rem] border-white/15">
        <div className={cn("section-accent-bar h-2", barColor[tone] || "bg-slate-700")} />
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-2"><Badge tone={tone}>{tx(badge, lang)}</Badge><Target className="h-5 w-5 text-slate-500" /></div>
          <h3 className="text-lg font-black leading-7 text-slate-50">{tx(title, lang)}</h3>
          <div className="mt-4 grid gap-2">{items.map((item) => <RuleCard key={item.label} {...item} label={tx(item.label, lang)} text={tx(item.text, lang)} />)}</div>
        </div>
      </Card>
    </motion.div>
  );
}
function VisualMeter({ label, left, right, fill = 50, tone = "teal", note }) {
  const [hovered, setHovered] = useState(false);
  const theme = { teal:{base:"bg-teal-500",soft:"bg-teal-400/30"}, red:{base:"bg-red-500",soft:"bg-red-400/25"}, amber:{base:"bg-amber-500",soft:"bg-amber-300/30"}, blue:{base:"bg-sky-500",soft:"bg-sky-300/30"}, violet:{base:"bg-violet-500",soft:"bg-violet-300/30"}, green:{base:"bg-emerald-500",soft:"bg-emerald-300/30"} }[tone] || {};
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <div className="flex items-center justify-between text-xs font-black text-slate-500"><span>{label}</span><span>{note}</span></div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/10">
        <div className={cn("h-full rounded-full", theme.soft)} style={{ width:`${fill}%` }} />
        <motion.div className={cn("-mt-3 h-3 rounded-full", theme.base)} initial={false} animate={{ width:hovered?`${fill}%`:"0%" }} transition={{ duration:0.7 }} />
      </div>
      <div className="mt-1 flex justify-between text-xs font-bold text-slate-500"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}
function ProcessRail({ steps, tone = "amber" }) {
  const dot = { amber:"bg-amber-600 ring-amber-400/30", teal:"bg-teal-600 ring-teal-400/30", blue:"bg-sky-600 ring-sky-400/30", violet:"bg-violet-600 ring-violet-400/30" }[tone] || "bg-slate-600 ring-slate-400/30";
  return (
    <div className="relative flex flex-col gap-0 md:flex-row">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-1 items-start gap-3 md:flex-col md:items-center md:text-center">
          <div className="relative flex items-center"><div className={cn("relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 text-sm font-black text-white", dot)}>{i+1}</div></div>
          <div className="pb-4 md:pb-0 md:px-2"><div className="text-sm font-black text-slate-50">{s.title}</div><div className="mt-1 text-xs font-bold leading-5 text-slate-400">{s.text}</div></div>
        </div>
      ))}
    </div>
  );
}
function HeatBar({ rows, lang = safeLang() }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">{tx("日内时间热力 (ET)", lang)}</div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="rounded-xl bg-slate-800/50 border border-slate-700/40 px-3 py-2">
            <div className="flex items-center justify-between mb-1.5"><span className="text-xs font-black text-slate-200">{r.label}</span><span className={cn("text-[10px] font-black rounded-full px-2 py-0.5", r.status==="优先"?"bg-emerald-900/60 text-emerald-300":r.status==="禁做"?"bg-red-900/60 text-red-300":"bg-amber-900/50 text-amber-300")}>{tx(r.status, lang)}</span></div>
            <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden mb-1"><div className={cn("h-full rounded-full", r.barColor)} style={{ width:`${r.fill}%` }} /></div>
            <div className="text-[10px] text-slate-500 font-bold">{tx(r.note, lang)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function KillZoneBoard({ items, lang = safeLang() }) {
  return (
    <div className="rounded-[1.6rem] border-2 border-amber-300/35 bg-amber-950/20 p-4 shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2"><KeyWord tone="amber">Kill Zone</KeyWord><span className="text-sm font-black text-amber-100">{tx("时间过滤优先于普通信号", lang)}</span></div>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => { const Icon=item.icon||CheckCircle2; return (
          <motion.div key={item.title} whileHover={{y:-4,scale:1.01}} className={cn("rounded-[1.5rem] border p-4 shadow-sm", item.cls)}>
            <div className="flex items-center gap-2 mb-2"><Icon className={cn("h-5 w-5", item.iconCls)}/><div className="text-base font-black text-slate-50">{tx(item.title, lang)}</div></div>
            <div className="text-sm font-black leading-6 text-slate-200">{tx(item.text, lang)}</div>
          </motion.div>
        ); })}
      </div>
    </div>
  );
}

/* ─── DATA ─── */
const gexEnvironments = [
  { type:"正GEX", eng:"Positive Gamma", tone:"blue", char:"震荡·压制波动·均值回归", mechanism:"做市商 Long Gamma → 价格涨时卖出 / 价格跌时买入", result:"涨了有压，跌了有托", traits:["VWAP附近反复拉扯，假突破多","追单容易被反杀","高低点不容易突破杀穿","更适合等回踩、做区间"], playbook:"少追突破，多等VWAP回踩/EMA确认，偏区间均值回归" },
  { type:"负GEX", eng:"Negative Gamma", tone:"amber", char:"趋势·放大波动·单边延伸", mechanism:"做市商 Short Gamma → 价格涨时追买 / 价格跌时追卖", result:"涨会更涨，跌会更跌", traits:["突破后容易加速","跌破后容易瀑布","VWAP失守/站回是节奏切换","容易出现单边行情"], playbook:"少逆势抄底摸顶，等破位确认顺势，VWAP得失是第一参考线" },
];
const gexKeyLevels = [
  { name:"Call Wall", role:"上方压力", desc:"上方最大Call Gamma集中区", behavior:"容易出现钉盘、受压或挤空", rule:"靠近时不追Call，等突破确认或冲高衰竭" },
  { name:"Put Wall", role:"下方支撑", desc:"下方最大Put Gamma集中区", behavior:"守住时容易形成托底；跌破后空间打开", rule:"靠近时不追Put，等跌破确认或承接信号" },
  { name:"Gamma Flip", role:"节奏切换", desc:"正负GEX切换核心区域", behavior:"站上偏稳定；跌破偏放大", rule:"跌破→负GEX节奏激活；站回→正GEX修复" },
  { name:"Volatility Trigger", role:"波动启动", desc:"盘面从震荡切趋势的价格位", behavior:"站不上→震荡区间；跌破→波动放大", rule:"跌破后是顺势信号而非抄底信号" },
];
const zeroDTEMistakes = [
  { n:1, title:"开盘就冲", desc:"开盘30分钟Gamma重新定价，结构最乱。先等VWAP方向明确+第一轮高低点形成" },
  { n:2, title:"当股票扛着拿", desc:"Theta每分钟都在杀你。即使标的横盘，Call和Put都在跌，没有等回来的时间" },
  { n:3, title:"追大阳线Call", desc:"往往已是第三根阳线+RSI超买+离VWAP过远。追进去遇回踩，Call直接腰斩" },
  { n:4, title:"追大阴线Put", desc:"支撑/VWAP/日内低点附近最容易出现空头回补。追进去Put归零" },
  { n:5, title:"不看VWAP", desc:"VWAP是机构成本线和多空分界线。逆VWAP做单成功率大幅下降，最常见新手病" },
  { n:6, title:"不设止损等归零", desc:"方向错时期权崩溃速度远超股票：-20%→-40%→-95%，全在同一天内" },
  { n:7, title:"满仓梭哈一把", desc:"即使70%胜率也会出现3-4连亏。满仓遇假突破一次就爆仓，活下来是第一位的" },
  { n:8, title:"亏后立刻报复单", desc:"亏→情绪上头→加倍→再亏→梭哈→归零。市场收割的永远是情绪失控的人" },
  { n:9, title:"一天交易十几次", desc:"高质量结构一天只出现2-4次。频繁出手=频繁在噪音区犯错" },
  { n:10, title:"预测方向而非阅读结构", desc:"坚持'今天必涨'→市场变了自己没变→在错误节奏里坚持正确方向→照样亏钱" },
];
const seaIronRules = [
  { n:1, text:"只做QQQ，暂不碰个股", critical:false },
  { n:2, text:"固定一张，永不加张（账户重建阶段）", critical:false },
  { n:3, text:"前15分钟只看不动", critical:false },
  { n:4, text:"四项入场条件缺一不可（VWAP+EMA+量能+时间）", critical:false },
  { n:5, text:"亏20刀无条件出场", critical:false },
  { n:6, text:"日亏50刀停止交易", critical:false },
  { n:7, text:"11:30后不开新仓", critical:false },
  { n:8, text:"补偿心理出现时，立刻停止交易", critical:true },
  { n:9, text:"盈利积累后，不放大规模，先积累执行记录", critical:false },
  { n:10, text:"系统高于感觉，纪律高于判断", critical:false },
];
const coreBeliefs = ["弱水三千，只取一瓢。","只做A+机会。","先活下来，再赚钱。"];
const fourEntryConditions = [
  { n:"01", title:"VWAP方向", desc:"价格明确站上/下VWAP，不在附近反复横跳" },
  { n:"02", title:"EMA趋势", desc:"9EMA在21EMA上/下方，且两线发散（不粘合）" },
  { n:"03", title:"成交量", desc:"当前量 > 前5根K线平均量 × 1.5倍" },
  { n:"04", title:"时间窗口", desc:"09:45–11:30 ET（开盘15分钟后至11:30）" },
];
const preMarketItems = [
  { text:"今天有无美联储讲话或重大经济数据发布？", warn:"有→降低预期或跳过当天" },
  { text:"VIX是否高于25？", warn:"是→期权成本贵，缩仓或跳过" },
  { text:"QQQ的IV Rank是否高于50%？", warn:"是→需更大方向移动才盈利，提高目标或缩仓" },
  { text:"昨日QQQ收盘方向 + 今日开盘缺口情况？", warn:"与趋势同向优先；反向缺口谨慎执行" },
  { text:"SpotGamma GEX已读取并填入系统？", warn:"正GEX→偏震荡等回踩；负GEX→偏趋势顺势；已记录Flip/Wall价位" },
];
const journalFields = [
  { field:"日期时间", example:"2025-01-15  09:52" },
  { field:"标的", example:"QQQ" },
  { field:"方向", example:"Call / Put" },
  { field:"进场理由", example:"负GEX日+VWAP破位+9EMA顺势+放量" },
  { field:"GEX环境", example:"负GEX · Flip $520.50 · Call Wall $525" },
  { field:"情绪状态", example:"平静 / 焦虑 / 冲动 / 报复" },
  { field:"满足全部铁律？", example:"是 / 否（写出哪条未满足）" },
  { field:"结果盈亏", example:"+$35" },
  { field:"一句话总结", example:"负GEX顺势，执行到位" },
];
const checklist = [
  "GEX环境已填入系统：正/负GEX已确认，Gamma Flip和Call/Put Wall价位已记录。",
  "仓位已过计算器：张数符合单笔权利金上限，QQQ固定1张。",
  "标的已确认为QQQ，当日不混用系统。",
  "时间已确认在09:45–11:30 ET窗口内，不在禁区。",
  "方向完整：QQQ VWAP方向明确（不横跳附近）。",
  "EMA已确认：9EMA在21EMA上/下方且发散（不粘合）。",
  "量能已确认：当前量 > 前5根K线平均量 × 1.5倍。",
  "四项入场条件全部满足（VWAP+EMA+量能+时间）。",
  "失效位已写清：止损具体价格，QQQ期权止损-$20。",
  "今日无重大数据（FOMC/CPI）发布前后15分钟。",
  "VIX未超过25，IV Rank未超过50%。",
  "未触发熔断：当日未亏$50 / 未连亏2笔。",
  "情绪正常：不是回本、证明自己、补偿心理驱动。",
];
const questions = [
  { category:"GEX", q:"今日处于正GEX环境，价格在VWAP附近反复横跳，正确做法是？", options:["少追突破，等VWAP回踩EMA确认","立刻追方向入场","加大仓位捉趋势","开盘第一根就入场"],a:0,exp:"正GEX=压制波动。假突破多，追单易被反杀。应等VWAP回踩+EMA支撑确认，偏区间均值回归思维。" },
  { category:"GEX", q:"价格刚跌破Gamma Flip，此时应该？", options:["抄底买Call","偏Put顺势，波动放大特性已激活","立刻做区间单","忽略GEX只看K线"],a:1,exp:"跌破Gamma Flip=负GEX激活=做市商追卖=波动放大。Put节奏更顺，不是逆势抄底时机。" },
  { category:"GEX", q:"价格靠近Call Wall，你在考虑追Call，应该？", options:["立刻买Call追涨","观察冲高失败/量能衰竭信号，不追Call","满仓Call","跌破Call Wall再买"],a:1,exp:"Call Wall是上方最大压力区，容易出现钉盘或受压。靠近不追Call，等突破确认或冲高衰竭信号。" },
  { category:"QQQ入场", q:"三项指标中量能未达标（<1.5倍），但VWAP和EMA都正确，应该？", options:["正常开仓，两项满足就够了","不开仓，三项缺一不可","缩小仓位入场","等量能来了再说"],a:1,exp:"四项入场条件缺一不可。量能未达标=不开仓。这是铁律，没有例外。" },
  { category:"止损", q:"期权开仓后亏了$18，接近$20止损线，但感觉'快到支撑了'，应该？", options:["再等一下，快到支撑了","到$20立刻无条件市价出场","移动止损到$25","换合约继续持有"],a:1,exp:"亏$20无条件市价出场，没有'再等等'。止损规则不给情绪留空间。" },
  { category:"心理", q:"昨天错过了一个大波段，今天开盘特别想赶回来，这是什么信号？", options:["信心满满，积极状态","补偿心理出现，立刻停止交易","正常的交易欲望","市场机会好，加仓信号"],a:1,exp:"补偿心理是两次破坏性亏损的共同根源。出现时立刻停止，不是减仓，是停止。" },
  { category:"时间规则", q:"现在是11:45 ET，QQQ刚出现完美四项同时满足信号，应该？", options:["信号这么好，做一笔","不开仓，11:30后铁律禁止","观察记录但不交易","做短线15分钟就出来"],a:1,exp:"11:30后不开新仓是铁律。再好的信号也不做。系统高于感觉。" },
  { category:"量能", q:"有效放量的标准是什么？", options:["当前量比前一根K线大就行","当前量>前5根K线平均量×1.5倍","量比昨日平均量大","随便量大就行"],a:1,exp:"标准是前5根K线平均量的1.5倍以上。精确标准，不是感觉。" },
  { category:"风控", q:"当日已亏$47，又出现信号，距$50日亏熔断还有$3，应该？", options:["做这笔，还没到$50","停止交易，已接近熔断线","做小仓位试试","信号好可以做"],a:1,exp:"接近熔断线就应停止，不是到了才停。且该信号止损是$20，超过剩余空间，本就不该做。" },
  { category:"QQQ选择", q:"为什么当前主力标的选QQQ而不是NVDA？", options:["QQQ波动更大","QQQ趋势更干净+流动性好+价差小+个股消息影响小","NVDA太贵","随机选的"],a:1,exp:"复盘10个交易日确认：QQQ趋势和波段结构明显优于NVDA，且市价价差损耗问题已解决。" },
  { category:"VIX", q:"VIX突然从18暴涨到32，当天应该？", options:["VIX高期权便宜，加仓","跳过当天不参与","做Put顺势","减半仓位参与"],a:1,exp:"VIX突然暴涨=方向极难判断，建议跳过当天。不是缩仓，是不参与。" },
  { category:"仓位", q:"账户重建阶段赚了一些，信号极好，可以加到2张吗？", options:["信号好可以加","不可以，连续20笔稳定执行才讨论加张","赚钱了当然可以加","看VIX决定"],a:1,exp:"账户重建阶段：固定一张，永不加张。连续稳定执行20笔后再讨论。盈利不是加仓的理由。" },
  { category:"黄金", q:"黄金的'大盘'是什么？", options:["QQQ和科技ETF","美元指数DXY+10年期实际收益率","A股指数","VIX走势"],a:1,exp:"黄金无板块。第一驱动是实际利率，第二是DXY。与股票板块完全无关。" },
  { category:"黄金", q:"DXY走强+10年实际利率同时上行，做多黄金应该？", options:["正常做多","降级处理或放弃，宏观双向反转","加大仓位对抗","换EUR做多"],a:1,exp:"实际利率和DXY双向反转是黄金做多最差的宏观环境，放弃或极小仓。" },
  { category:"EUR", q:"EUR均线缠绕、ADX低于20，还能做趋势回踩吗？", options:["能做","不能，趋势强度不足","只看MACD","追突破"],a:1,exp:"趋势系统必须先有趋势环境。ADX低=无趋势=系统无效。" },
  { category:"风控计算", q:"账户$1000，单笔风险2%，期权价$1.00，最多几张？", options:["1张","2张","5张","随意"],a:0,exp:"1000×2%=$20；$1.00×100=$100；20÷100<1，最多1张。$1000账户期权超过$1就要谨慎选合约。" },
  { category:"0DTE误区", q:"看到大阳线急拉升，FOMO上头，此刻应该？", options:["立刻冲进去追Call","等待VWAP回踩或EMA支撑确认再参与","满仓Call","追进去再设止损"],a:1,exp:"大阳线追Call是最常见死法。往往已是第三根+RSI超买+离VWAP过远，追进去遇回踩Call腰斩。" },
  { category:"纪律", q:"今日已连续亏损2笔，第三个信号出现且完美，应该？", options:["信号好立即出手","触发连亏熔断，停止30分钟后再评估","换标的继续","加仓弥补亏损"],a:1,exp:"连续亏损2笔触发熔断，停止30分钟冷静再评估。不因信号质量破例。系统高于感觉。" },
];

const goldMacroDrivers = [
  { driver:"实际利率（TIPS/10Y）", dir:"强负相关", note:"第一驱动。实际利率↑→金价受压", tone:"red" },
  { driver:"美元指数 DXY", dir:"负相关", note:"美元走强，金价通常承压", tone:"amber" },
  { driver:"Fed 政策路径 / FOMC", dir:"鸽派利多", note:"鸽派→利率预期下行→金价受支撑", tone:"blue" },
  { driver:"CPI / PCE / NFP 数据", dir:"事件触发", note:"偏离预期→剧烈波动，是方向触发器", tone:"amber" },
  { driver:"央行购金 / 实物需求", dir:"结构性底部", note:"长期慢变量，提供下方支撑", tone:"green" },
  { driver:"避险 / 地缘冲突", dir:"短期脉冲", note:"突发事件→IV瞬间拉高→谨慎追顶", tone:"slate" },
];
const goldModels = [
  { title:"流动性扫单收回", badge:"黄金 A1", tone:"amber", items:[{label:"场景",text:"扫前高/前低后，价格重新收回结构区"},{label:"触发",text:"长影线+CHoCH确认+量能启动",tone:"teal"},{label:"放弃",text:"只扫不收 / DXY与实际利率双向反转",tone:"red",icon:Ban}]},
  { title:"POC / FVG / OB 共振", badge:"黄金 A2", tone:"amber", items:[{label:"场景",text:"成本集中区+OB/FVG+流动性位重叠"},{label:"触发",text:"回踩拒绝+量能启动+宏观未反向",tone:"teal"},{label:"放弃",text:"共振区被直接穿透/实际利率+DXY双向反转",tone:"red",icon:XCircle}]},
  { title:"MA9 / MA21 动能过滤", badge:"辅助", tone:"amber", items:[{label:"强",text:"价格>MA9>MA21（只过滤，不开仓）",tone:"green"},{label:"弱",text:"价格<MA9<MA21",tone:"red"},{label:"提醒",text:"均线是过滤器，不是触发器",tone:"slate"}]},
];
const eurModels = [
  { title:"EMA趋势回踩", badge:"EUR 主力", tone:"blue", items:[{label:"环境",text:"EMA9/21/55顺排+ADX>25，趋势已确立"},{label:"入场",text:"回踩EMA21/结构位，等拒绝K线确认",tone:"teal"},{label:"放弃",text:"ADX低/均线缠绕/数据发布前后",tone:"red",icon:Ban}]},
  { title:"破位不追", badge:"执行规则", tone:"blue", items:[{label:"先等",text:"突破后不追第一根，等回踩"},{label:"再看",text:"回踩不破原突破位+重新放量",tone:"teal"},{label:"管理",text:"RR≥1:2；到1:1.5先锁一半利润",tone:"green"}]},
];
const highEvModels = [
  { title:"流动性扫单收回", badge:"黄金/EUR", tone:"amber", items:[{label:"场景",text:"扫前高/前低+重新收回结构"},{label:"触发",text:"长影线+CHoCH确认",tone:"teal"},{label:"EV特征",text:"中等胜率+高赔率。切忌只扫不收入场",tone:"amber"}]},
  { title:"POC/FVG/OB共振", badge:"黄金", tone:"amber", items:[{label:"场景",text:"成本区+OB/FVG+流动性位重叠"},{label:"触发",text:"回踩拒绝+量能启动+宏观未反向",tone:"teal"},{label:"EV特征",text:"共振点越多胜率越高，穿透则放弃",tone:"amber"}]},
  { title:"EMA趋势回踩", badge:"EUR", tone:"blue", items:[{label:"场景",text:"EMA顺排+ADX>25确认趋势"},{label:"触发",text:"回踩EMA21/结构位不破",tone:"teal"},{label:"EV特征",text:"趋势日胜率高，均线缠绕时期望值极差",tone:"blue"}]},
  { title:"负GEX+VWAP破位顺势", badge:"QQQ期权", tone:"teal", items:[{label:"场景",text:"负GEX环境+VWAP失守/站不回+量能放大"},{label:"触发",text:"VWAP破位确认+9EMA顺势+量能1.5x",tone:"green"},{label:"EV特征",text:"负GEX日趋势延伸概率更高，是买方最好的环境",tone:"teal"}]},
  { title:"正GEX VWAP回踩确认", badge:"QQQ期权", tone:"teal", items:[{label:"场景",text:"正GEX环境+价格回踩VWAP不破+量能确认"},{label:"触发",text:"VWAP收回+9EMA支撑+量能1.5x",tone:"green"},{label:"EV特征",text:"正GEX压波动，回归成功率高于追突破",tone:"teal"}]},
  { title:"事件后IV回落", badge:"期权特有", tone:"green", items:[{label:"场景",text:"FOMC/CPI发布后，方向定盘，IV开始回落"},{label:"触发",text:"等二次确认，不追公布瞬间"},{label:"EV特征",text:"此时做debit/credit价差都有edge；IV降后买方才合理",tone:"green"}]},
];
const macroCards = [
  { state:"强 Risk ON", cond:"VIX<15，市场平静", action:"期权买方环境最友好，成本低，可正常执行", tone:"green", icon:TrendingUp, short:"进攻", bias:{ attack:90, wait:20, defend:8 } },
  { state:"正常区间", cond:"VIX 15–25，正常执行", action:"按常规系统执行，无需特别调整", tone:"amber", icon:Activity, short:"常规", bias:{ attack:60, wait:60, defend:25 } },
  { state:"期权变贵", cond:"VIX>25，溢价高", action:"降低预期或缩小仓位，买方需更大方向移动才盈利", tone:"amber", icon:AlertTriangle, short:"缩仓", bias:{ attack:25, wait:75, defend:40 } },
  { state:"VIX突然暴涨", cond:"VIX急速上行，方向混沌", action:"跳过当天，不参与，等市场稳定", tone:"red", icon:ShieldAlert, short:"跳过", bias:{ attack:5, wait:30, defend:90 } },
];

/* ─── GEX DAILY SETUP CARD ─── */
function GEXDailySetupCard({ setup, onSave, isToday, t: tProp, lang = safeLang() }) {
  const t = tProp || ((zh) => zh);
  const [editing, setEditing] = useState(!isToday);
  const [state, setState] = useState(setup.state || null);
  const [gammaFlip, setGammaFlip] = useState(setup.gammaFlip || "");
  const [callWall, setCallWall] = useState(setup.callWall || "");
  const [putWall, setPutWall] = useState(setup.putWall || "");
  const [volTrigger, setVolTrigger] = useState(setup.volTrigger || "");
  const canSave = state && gammaFlip && callWall && putWall;
  const ic = "terminal-input w-full rounded-xl border border-white/15 bg-slate-950/90 px-3 py-2.5 text-sm font-black text-slate-50 shadow-inner outline-none transition focus:border-teal-300/45";
  const handleSave = () => {
    const t = new Date().toLocaleTimeString("zh-CN", { hour:"2-digit", minute:"2-digit" });
    onSave({ date: new Date().toDateString(), state, gammaFlip, callWall, putWall, volTrigger, time: t, saved: true });
    setEditing(false);
  };
  const playbook = {
    positive: t("今日偏区间 · 少追突破，等VWAP回踩/EMA确认后再入场", "Range bias today · avoid chasing; wait for VWAP pullback / EMA confirmation"),
    negative: t("今日偏趋势 · 等破位确认顺势，VWAP得失是第一节奏信号", "Trend bias today · wait for confirmed break and follow trend; VWAP is the first regime signal"),
  };
  const statusBar = isToday && !editing
    ? { bg:"border-emerald-400/35 bg-emerald-950/15", dot:"bg-emerald-400", text:"text-emerald-300", label:`${t("今日已设置", "Set Today")} · ${setup.time}`, badge:"bg-emerald-900/60 text-emerald-300" }
    : { bg:"border-amber-400/40 bg-amber-950/18", dot:"bg-amber-400 animate-pulse", text:"text-amber-300", label:t("今日尚未设置 · 开盘前必填", "Not Set Today · Required Before Open"), badge:"bg-amber-900/60 text-amber-300" };
  return (
    <div className={cn("mb-5 rounded-[1.8rem] border-2 p-5 transition", statusBar.bg)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", statusBar.dot)} />
          <span className={cn("text-xs font-black uppercase tracking-[0.18em]", statusBar.text)}>{t("GEX 每日设置", "GEX Daily Setup")}</span>
          <span className={cn("text-[11px] font-black rounded-full px-2.5 py-0.5", statusBar.badge)}>{statusBar.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {isToday && !editing && (
            <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-800/60 px-3 py-1.5 text-xs font-black text-slate-400 hover:text-slate-200 hover:border-white/30 transition">
              <Edit3 className="h-3 w-3" />{t("编辑", "Edit")}
            </button>
          )}
          <div className="flex gap-2">
            {[{href:"https://flashalpha.com/tools/gamma-exposure",label:"FlashAlpha"},{href:"https://spotgamma.com",label:"SpotGamma"}].map(l=>(
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/50 px-2.5 py-1.5 text-[10px] font-black text-slate-500 hover:text-slate-300 hover:border-white/20 transition">
                {l.label}<ExternalLink className="h-2.5 w-2.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      {isToday && !editing ? (
        /* ── SAVED VIEW ── */
        <div>
          <div className={cn("flex items-center gap-3 rounded-2xl border px-4 py-3 mb-4",
            setup.state==="positive"?"border-sky-500/35 bg-sky-950/20":"border-amber-500/35 bg-amber-950/20")}>
            <div className={cn("w-3 h-3 rounded-full flex-shrink-0", setup.state==="positive"?"bg-sky-400":"bg-amber-400")} />
            <span className={cn("text-base font-black", setup.state==="positive"?"text-sky-200":"text-amber-200")}>
              {setup.state==="positive"?t("正GEX · 震荡压制", "Positive GEX · Range Suppression"):t("负GEX · 趋势放大", "Negative GEX · Trend Expansion")}
            </span>
            <span className={cn("text-xs font-bold ml-2", setup.state==="positive"?"text-sky-400":"text-amber-400")}>
              {playbook[setup.state]}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {[
              { label:"Gamma Flip", value:setup.gammaFlip, color:"text-violet-300", bg:"border-violet-400/25 bg-violet-950/20" },
              { label:"Call Wall", value:setup.callWall, color:"text-red-300", bg:"border-red-400/25 bg-red-950/20" },
              { label:"Put Wall", value:setup.putWall, color:"text-emerald-300", bg:"border-emerald-400/25 bg-emerald-950/20" },
              { label:"Vol Trigger", value:setup.volTrigger||"—", color:"text-amber-300", bg:"border-amber-400/25 bg-amber-950/20" },
            ].map(item=>(
              <div key={item.label} className={cn("rounded-xl border p-3 text-center", item.bg)}>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
                <div className={cn("text-xl font-black", item.color)}>{item.value ? `$${item.value}` : "—"}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] font-bold text-slate-600 text-center">{t("仅储存在本设备浏览器，不上传，不共享", "Stored only in this browser. Not uploaded or shared.")}</div>
        </div>
      ) : (
        /* ── EDIT / INPUT VIEW ── */
        <div>
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">{t("今日GEX环境", "Today's GEX Environment")}</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { key:"positive", label:t("正GEX", "Positive GEX"), sub:t("震荡 · 压制波动", "Range · Vol Suppression"), border:"border-sky-500/50", bg:"bg-sky-950/30", active:"ring-2 ring-sky-400/50", textActive:"text-sky-100", subColor:"text-sky-400" },
              { key:"negative", label:t("负GEX", "Negative GEX"), sub:t("趋势 · 放大波动", "Trend · Vol Expansion"), border:"border-amber-500/50", bg:"bg-amber-950/30", active:"ring-2 ring-amber-400/50", textActive:"text-amber-100", subColor:"text-amber-400" },
            ].map(opt=>(
              <button key={opt.key} type="button" onClick={()=>setState(opt.key)}
                className={cn("rounded-2xl border-2 p-4 text-left transition",
                  state===opt.key?cn(opt.border, opt.bg, opt.active):"border-white/12 bg-slate-800/40 hover:border-white/20")}>
                <div className={cn("text-base font-black mb-0.5", state===opt.key?opt.textActive:"text-slate-300")}>{opt.label}</div>
                <div className={cn("text-xs font-bold", state===opt.key?opt.subColor:"text-slate-500")}>{opt.sub}</div>
              </button>
            ))}
          </div>
          {state && (
            <div className={cn("rounded-xl border px-3 py-2 mb-4 text-xs font-black", state==="positive"?"border-sky-500/30 bg-sky-950/20 text-sky-200":"border-amber-500/30 bg-amber-950/20 text-amber-200")}>
              {playbook[state]}
            </div>
          )}
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">{t("关键价位", "Key Levels")}</div>
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {[
              { label:"Gamma Flip *", val:gammaFlip, set:setGammaFlip, color:"text-violet-400" },
              { label:"Call Wall *", val:callWall, set:setCallWall, color:"text-red-400" },
              { label:"Put Wall *", val:putWall, set:setPutWall, color:"text-emerald-400" },
              { label:"Volatility Trigger", val:volTrigger, set:setVolTrigger, color:"text-amber-400" },
            ].map(f=>(
              <label key={f.label} className="space-y-1.5">
                <span className={cn("text-[10px] font-black uppercase tracking-wider", f.color)}>{f.label}</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-black">$</span>
                  <input className={cn(ic, "pl-6")} type="number" step="0.5" placeholder={t("价格", "Price")} value={f.val} onChange={e=>f.set(e.target.value)} inputMode="decimal"/>
                </div>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button type="button" disabled={!canSave} onClick={handleSave}
              className={cn("flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition", canSave?"bg-teal-700 text-white hover:bg-teal-600":"bg-slate-800 text-slate-600 cursor-not-allowed")}>
              <Save className="h-4 w-4" />{t("保存今日设置", "Save Today's Setup")}
            </button>
            {isToday && editing && (
              <button type="button" onClick={()=>setEditing(false)} className="rounded-2xl border border-white/15 bg-slate-800/60 px-4 py-3 text-sm font-black text-slate-400 hover:text-slate-200 transition">{t("取消", "Cancel")}</button>
            )}
            <span className="text-[10px] font-bold text-slate-600">{t("* 必填 · 仅储存在本设备，不上传，不共享", "* Required · Stored locally only. Not uploaded or shared.")}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── GEX PANEL (educational, highlights active state) ─── */
function GEXPanel({ setup, isToday, t: tProp, lang }) {
  const t = tProp || ((zh) => zh);
  const activeState = isToday ? setup.state : null;
  return (
    <div className="mb-5 rounded-[1.8rem] border border-violet-300/20 bg-violet-950/8 p-5">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <BarChart3 className="h-4 w-4 text-violet-400" />
        <span className="text-sm font-black text-violet-300 uppercase tracking-wider">{t("GEX 机制说明 · 两种市场节奏", "GEX Mechanics · Two Market Regimes")}</span>
        {activeState && <Badge tone={activeState==="positive"?"blue":"amber"}>{activeState==="positive"?t("今日: 正GEX", "Today: Positive GEX"):t("今日: 负GEX", "Today: Negative GEX")}</Badge>}
      </div>
      <div className="text-xs font-bold text-slate-400 mb-4 leading-6">{t("GEX是波动节奏地图，不是方向预测器。先判断今日是哪种环境，再选对应的执行模式。两种环境用同一套操作方法会亏钱。", "GEX is a volatility-regime map, not a direction predictor. Identify today's environment first, then choose the matching playbook. Using one method for both regimes loses money.")}</div>
      <div className="grid gap-3 md:grid-cols-2 mb-4">
        {gexEnvironments.map((env,i)=>{
          const isActive = activeState === (i===0?"positive":"negative");
          return (
            <div key={env.type} className={cn("rounded-2xl border-2 p-4 transition",
              isActive?(i===0?"border-sky-500/55 bg-sky-950/25 ring-1 ring-sky-400/20":"border-amber-500/55 bg-amber-950/25 ring-1 ring-amber-400/20"):
              "border-white/8 bg-slate-900/30 opacity-60")}>
              <div className="flex items-center justify-between mb-2">
                <div><span className="text-base font-black text-slate-50">{tx(env.type, lang)}</span><span className="text-xs font-bold text-slate-500 ml-2">{env.eng}</span></div>
                <Badge tone={env.tone}>{tx(env.char, lang)}</Badge>
              </div>
              <div className="text-xs font-bold text-slate-500 mb-1.5 italic">{tx(env.mechanism, lang)}</div>
              <div className={cn("text-sm font-black mb-3",i===0?"text-sky-200":"text-amber-200")}>{tx(env.result, lang)}</div>
              <div className="space-y-1 mb-3">
                {env.traits.map((t,j)=>(
                  <div key={j} className="flex items-start gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",i===0?"bg-sky-500":"bg-amber-500")} />
                    <span className="text-xs font-bold text-slate-400 leading-5">{tx(t, lang)}</span>
                  </div>
                ))}
              </div>
              <div className={cn("rounded-xl border px-3 py-2",i===0?"border-sky-500/25 bg-sky-950/20":"border-amber-500/25 bg-amber-950/20")}>
                <div className="text-[10px] font-black text-slate-500 uppercase mb-0.5">{t("操作思路", "Playbook")}</div>
                <div className="text-xs font-black text-slate-200">{tx(env.playbook, lang)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        {gexKeyLevels.map(level=>{
          const priceVal = isToday && (
            level.name==="Gamma Flip" ? setup.gammaFlip :
            level.name==="Call Wall" ? setup.callWall :
            level.name==="Put Wall" ? setup.putWall :
            level.name==="Volatility Trigger" ? setup.volTrigger : null
          );
          return (
            <div key={level.name} className="rounded-2xl border border-white/10 bg-slate-900/50 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-black text-slate-50">{level.name}</span>
                {priceVal ? <span className="text-sm font-black text-teal-300">${priceVal}</span> : <Badge tone="slate">{tx(level.role, lang)}</Badge>}
              </div>
              <div className="text-[10px] font-bold text-slate-500 mb-1">{tx(level.desc, lang)}</div>
              <div className="text-xs font-bold text-slate-400 mb-2">{tx(level.behavior, lang)}</div>
              <div className="text-xs font-black text-teal-300 border-t border-white/8 pt-2">{tx(level.rule, lang)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 0DTE Mistakes ─── */
function ZeroDTEMistakesCard({ lang }) {
  const mistakes = I.zeroDTEMistakes.map(m => ({n:m.n, title:lang==="zh"?m.zh_t:m.en_t, desc:lang==="zh"?m.zh_d:m.en_d}));
  const headline = lang==="zh" ? "日内期权十大致命误区 · 对照自查" : "10 Fatal Intraday Options Mistakes · Self-Check";
  const insight = lang==="zh" ? "最大的亏损来源，不是看错行情，而是在错误的位置、错误的时间、用错误的仓位做了正确的方向。" : "The biggest source of losses is not a wrong direction — it's the right direction at the wrong place, wrong time, with the wrong size.";
  const preQ = lang==="zh" ? ["我是在追单吗？","我离VWAP有多远？","如果止损，我能立刻认错吗？"] : ["Am I chasing?","How far am I from VWAP?","If stopped, can I accept it immediately?"];
  const preLabel = (i) => lang==="zh" ? `入场前必问 ${i+1}` : `Pre-Entry Q${i+1}`;
  return (
    <div className="mb-5 rounded-[1.8rem] border border-red-400/25 bg-red-950/12 p-5">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-red-400" />
        <span className="text-sm font-black text-red-300 uppercase tracking-wider">{headline}</span>
      </div>
      <div className="mb-4 rounded-xl border border-amber-400/25 bg-amber-950/20 px-4 py-2.5">
        <span className="text-xs font-black text-amber-300">{lang==="zh"?"核心结论：":"Key insight: "}</span>
        <span className="text-xs font-bold text-amber-200"> {insight}</span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {mistakes.map(m=>(
          <div key={m.n} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-slate-900/40 px-3 py-2.5">
            <div className="w-7 h-7 flex-shrink-0 rounded-xl bg-red-900/60 border border-red-700/40 flex items-center justify-center text-xs font-black text-red-400">{m.n}</div>
            <div><div className="text-sm font-black text-red-200">{m.title}</div><div className="text-xs font-bold text-slate-400 leading-5 mt-0.5">{m.desc}</div></div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {preQ.map((q,i)=>(
          <div key={i} className="rounded-xl border border-white/8 bg-slate-950/60 px-3 py-2 text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">{preLabel(i)}</div>
            <div className="text-xs font-black text-slate-300">{q}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── RISK CALCULATOR ─── */
function RiskCalculator({ lang = safeLang() }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  const [account,setAccount]=useState(1000);const [riskPct,setRiskPct]=useState(2);const [optionPrice,setOptionPrice]=useState(1.0);
  const maxPremium=useMemo(()=>Math.round(account*riskPct/100),[account,riskPct]);
  const maxContracts=useMemo(()=>Math.max(1,Math.floor(account*riskPct/100/(optionPrice*100))),[account,riskPct,optionPrice]);
  const totalCap=useMemo(()=>Math.round(account*0.06),[account]);
  const dailyLimit=useMemo(()=>Math.round(account*0.05),[account]);
  const weeklyLimit=useMemo(()=>Math.round(account*0.10),[account]);
  const ic="terminal-input w-full rounded-2xl border border-white/15 bg-slate-950/90 px-4 py-3 text-base font-black text-slate-50 shadow-inner outline-none transition focus:border-teal-300/45 focus:ring-4 focus:ring-teal-400/20";
  return (
    <Card className="overflow-hidden rounded-[2rem] border-2 border-teal-300/45">
      <div className="bg-gradient-to-r from-teal-800 via-cyan-700 to-sky-700 px-5 py-4 text-white">
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-85">Position Sizer</div>
        <h3 className="mt-1 text-xl font-black">{t("仓位计算器 · 开仓前必过此关", "Position Sizer · Must Pass Before Entry")}</h3>
      </div>
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-3 mb-4">
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">{t("账户总额 ($)", "Account Size ($)")}</span><input className={ic} type="number" value={account} min={100} onChange={e=>setAccount(Math.max(100,Number(e.target.value)||100))}/></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">{t("单笔风险", "Per-Trade Risk")}</span><div className="grid grid-cols-3 gap-1.5">{[1,2,3].map(p=><button key={p} type="button" onClick={()=>setRiskPct(p)} className={cn("rounded-xl py-3 text-sm font-black transition",riskPct===p?"bg-teal-600 text-white":"bg-slate-800 text-slate-400 hover:bg-slate-700")}>{p}%</button>)}</div></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">{t("期权价格 ($)", "Option Price ($)")}</span><input className={ic} type="number" step="0.05" min="0.05" value={optionPrice} onChange={e=>setOptionPrice(Math.max(0.05,Number(e.target.value)||0.05))}/></label>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
          {[{label:t("单笔最多权利金","Max Premium / Trade"),value:`$${maxPremium}`,sub:`${t("账户","Account")}×${riskPct}%`,border:"border-teal-300/45",bg:"bg-teal-500/10",val:"text-teal-100"},{label:t("最多合约数","Max Contracts"),value:`${maxContracts}${t("张"," ct")}`,sub:`${t("按","At ")}$${optionPrice}/${t("张","contract")}`,border:"border-teal-300/45",bg:"bg-teal-500/10",val:"text-teal-100"},{label:t("同时持仓上限","Open Position Cap"),value:`$${totalCap}`,sub:t("账户×6%","Account × 6%"),border:"border-amber-300/45",bg:"bg-amber-500/10",val:"text-amber-100"},{label:t("日亏熔断线","Daily Loss Limit"),value:`$${dailyLimit}`,sub:t("账户×5%→当日停","Account × 5% → stop for day"),border:"border-red-300/45",bg:"bg-red-500/10",val:"text-red-100"}].map(item=>(
            <div key={item.label} className={cn("rounded-2xl border p-3 text-center",item.border,item.bg)}>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5 leading-4">{item.label}</div>
              <div className={cn("text-2xl font-black leading-none",item.val)}>{item.value}</div>
              <div className="text-[10px] text-slate-500 font-bold mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-3 text-xs font-bold leading-6 text-amber-100 mb-3">{t("公式：张数=⌊账户×", "Formula: contracts = floor(Account × ")}{riskPct}{t("%÷期权价÷100⌋向下取整。结果为0→该期权对账户过贵，换便宜合约。", "% ÷ option price ÷ 100). If result is 0, the contract is too expensive for this account; choose a cheaper contract.")}</div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/58 p-3">
          <div className="text-xs font-black text-slate-300 mb-2">{t("熔断阈值（自动计算）", "Circuit Breakers (Auto-Calculated)")}</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[{t:t("日内连亏2笔","2 consecutive intraday losses"),a:t("停30分钟+复盘","Stop 30 min + review"),c:"amber"},{t:t("日内连亏3笔","3 consecutive intraday losses"),a:t("当日停止","Stop for the day"),c:"red"},{t:`${t("日损≥","Daily loss ≥")}$${dailyLimit}`,a:t("当日停止","Stop for the day"),c:"red"},{t:`${t("周损≥","Weekly loss ≥")}$${weeklyLimit}`,a:t("本周停，周末复盘","Stop this week; weekend review"),c:"red"}].map(item=>(
              <div key={item.t} className={cn("rounded-xl border p-2",item.c==="red"?"border-red-300/35 bg-red-950/45":"border-amber-300/35 bg-amber-500/10")}>
                <div className={cn("text-[10px] font-black",item.c==="red"?"text-red-300":"text-amber-300")}>{item.t}</div>
                <div className="flex items-center gap-1 mt-0.5"><ArrowRight className="h-3 w-3 text-slate-500 flex-shrink-0"/><div className="text-[10px] font-bold text-slate-400">{item.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
function ScaleUpPath({ lang = safeLang() }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  return (
    <Card className="overflow-hidden rounded-[1.8rem] border-violet-300/35">
      <div className="bg-gradient-to-r from-violet-800 to-fuchsia-700 px-5 py-4 text-white">
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-85">Scale Protocol</div>
        <h3 className="mt-1 text-xl font-black">{t("仓位增长路径", "Position Scaling Path")}</h3>
      </div>
      <div className="p-5 space-y-3">
        {[{lv:t("起步阶段","Starting Phase"),contracts:t("1张","1 contract"),cond:t("无条件。账户重建阶段，不谈加张。","Unconditional. Rebuilding phase: no scaling discussion."),active:true},{lv:"Level 2",contracts:t("2张","2 contracts"),cond:t("连续20笔稳定执行+零次熔断触发+EV>0","20 clean executions + zero circuit breakers + EV>0"),active:false},{lv:"Level 3",contracts:t("3张","3 contracts"),cond:t("再累积20笔满足上述条件","Another 20 trades meeting the same conditions"),active:false}].map(item=>(
          <div key={item.lv} className={cn("rounded-2xl border px-4 py-3",item.active?"border-violet-500/50 bg-violet-500/10":"border-white/10 bg-slate-900/40")}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">{item.active&&<div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"/>}<span className={cn("text-sm font-black",item.active?"text-violet-200":"text-slate-500")}>{item.lv}</span></div>
              <span className={cn("text-xl font-black",item.active?"text-violet-100":"text-slate-600")}>{item.contracts}</span>
            </div>
            <div className={cn("text-xs font-bold",item.active?"text-violet-300":"text-slate-600")}>{item.cond}</div>
          </div>
        ))}
        <div className="rounded-2xl border border-red-300/35 bg-red-950/45 px-4 py-3 flex items-start gap-2">
          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5"/><div><div className="text-xs font-black text-red-300">{t("任何熔断触发→立即降回1张", "Any circuit breaker → immediately drop back to 1 contract")}</div><div className="text-xs font-bold text-red-400/80 mt-0.5">{t("重置计数器，从20笔重新开始", "Reset counter; restart from 20 trades")}</div></div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/58 p-3"><div className="text-xs font-black text-slate-300 mb-1">{t("你的数据已经给出答案", "Your data already gave the answer")}</div><div className="text-xs font-bold text-slate-500 leading-5">{t("1张→每天稳定盈 · 多张→两天−50%", "1 contract → stable daily gains · multiple contracts → −50% in two days")}<br/><span className="text-slate-400">{t("边不是加仓加出来的，是纪律守出来的。", "Edge is not created by sizing up; it is protected by discipline.")}</span></div></div>
      </div>
    </Card>
  );
}
function OptionPriceEstimator({ lang = safeLang() }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  const [mode,setMode]=useState("call");const [cur,setCur]=useState("520");const [tgt,setTgt]=useState("522");const [sl,setSl]=useState("518");const [opt,setOpt]=useState("1.20");const [delta,setDelta]=useState("0.55");const [qty,setQty]=useState("1");
  const c=Number(cur),tgtVal=Number(tgt),s=Number(sl),o=Number(opt),d=Math.abs(Number(delta)),q=Math.max(1,Number(qty)||1);
  const ok=[c,tgtVal,s,o,d].every(n=>Number.isFinite(n))&&o>=0&&d>=0;
  const mv=ok?(mode==="call"?tgtVal-c:c-tgtVal):0,slmv=ok?(mode==="call"?s-c:c-s):0;
  const proj=ok?Math.max(0,o+mv*d):0,slPr=ok?Math.max(0,o+slmv*d):0;
  const pnl=(proj-o)*100*q,slPnl=(slPr-o)*100*q,pnlPct=o>0?((proj-o)/o)*100:0;
  const ic="terminal-input w-full rounded-2xl border border-white/15 bg-slate-950/90 px-4 py-3 text-base font-black text-slate-50 shadow-inner outline-none transition focus:border-teal-300/45 focus:ring-4 focus:ring-teal-400/20";
  return (
    <Card className="overflow-hidden rounded-[1.8rem]">
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-5 py-3 text-white"><div className="text-xs font-black uppercase tracking-[0.2em] opacity-70">Delta Estimator</div><h3 className="text-lg font-black">{t("正股目标→期权估算", "Stock Target → Option Estimate")}</h3></div>
      <div className="p-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">{t("类型", "Type")}</span><select className={ic} value={mode} onChange={e=>setMode(e.target.value)}><option value="call">Call</option><option value="put">Put</option></select></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">{t("当前正股", "Current Stock")}</span><input className={ic} value={cur} onChange={e=>setCur(e.target.value)} inputMode="decimal"/></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">{t("目标价", "Target Price")}</span><input className={ic} value={tgt} onChange={e=>setTgt(e.target.value)} inputMode="decimal"/></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">{t("止损价", "Stop Price")}</span><input className={ic} value={sl} onChange={e=>setSl(e.target.value)} inputMode="decimal"/></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">{t("当前期权价", "Current Option Price")}</span><input className={ic} value={opt} onChange={e=>setOpt(e.target.value)} inputMode="decimal"/></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">Delta</span><input className={ic} value={delta} onChange={e=>setDelta(e.target.value)} inputMode="decimal"/></label>
          <label className="sm:col-span-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">{t("张数", "Contracts")}</span><input className={ic} value={qty} onChange={e=>setQty(e.target.value)} inputMode="numeric"/></label>
        </div>
        <div className="grid gap-3">
          <div className="rounded-2xl border border-white/15 bg-slate-900/58 p-4"><div className="text-xs font-black text-slate-500">{t("目标期权估算价", "Estimated Option at Target")}</div><div className="mt-1 text-3xl font-black text-teal-100">{ok?proj.toFixed(2):"--"}</div></div>
          <div className={cn("rounded-2xl border p-4",pnl>=0?"border-teal-300 bg-teal-500/10":"border-red-300/35 bg-red-950/45")}><div className="text-xs font-black text-slate-500">{t("目标盈亏", "Target P&L")}</div><div className={cn("mt-1 text-2xl font-black",pnl>=0?"text-teal-100":"text-red-100")}>{ok?`${pnl>=0?"+":""}${pnl.toFixed(0)}${t("刀", " USD")}`:"--"}</div><div className="text-sm font-bold text-slate-400">{ok?`${pnlPct>=0?"+":""}${pnlPct.toFixed(1)}%`:"--"}</div></div>
          <div className={cn("rounded-2xl border p-4",slPnl>=0?"border-amber-300/50 bg-amber-500/10":"border-red-300/35 bg-red-950/45")}><div className="text-xs font-black text-slate-500">{t("止损估算", "Stop Estimate")}</div><div className={cn("mt-1 text-2xl font-black",slPnl>=0?"text-amber-100":"text-red-100")}>{ok?`${slPnl>=0?"+":""}${slPnl.toFixed(0)}${t("刀", " USD")}`:"--"}</div></div>
          <div className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-3 text-xs font-bold leading-6 text-amber-100">{t("不含IV、Theta、Gamma和价差。结合$20止损规则使用。", "Excludes IV, Theta, Gamma, and spread. Use with the $20 stop rule.")}</div>
        </div>
      </div>
    </Card>
  );
}
function MacroRadarBoard({ lang = safeLang() }) {
  const [active,setActive]=useState(0);const cur=macroCards[active];const Icon=cur.icon;
  const tCls={green:"border-emerald-300/25 bg-emerald-500/10",amber:"border-amber-300/25 bg-amber-500/10",red:"border-red-300/35 bg-red-950/55"};
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        {macroCards.map((m,idx)=>{const Ic=m.icon;return(
          <motion.button key={m.state} type="button" onMouseEnter={()=>setActive(idx)} onFocus={()=>setActive(idx)} whileHover={{y:-3,scale:1.01}} className={cn("rounded-[1.4rem] border p-4 text-left transition shadow-sm",tCls[m.tone]||"border-white/10 bg-slate-900/58",active===idx?"ring-2 ring-slate-300":"")}>
            <div className="flex items-start justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-wider text-slate-500">{tx(m.state, lang)}</div><div className="mt-1 text-sm font-black text-slate-50">{tx(m.cond, lang)}</div></div><div className="rounded-xl border border-white/60 bg-slate-900/70 p-2"><Ic className="h-4 w-4 text-slate-300"/></div></div>
            <div className="mt-3 text-base font-black text-slate-100">{tx(m.action, lang)}</div>
          </motion.button>
        );})}
      </div>
      <Card className="rounded-[1.5rem] border-white/15 p-4">
        <div className="flex items-center justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-wider text-slate-500">当前聚焦</div><div className="mt-1 flex items-center gap-2 text-lg font-black text-slate-50"><Icon className="h-5 w-5"/>{tx(cur.state, lang)}</div><div className="mt-1 text-sm font-bold text-slate-400">{tx(cur.cond, lang)}</div></div><Badge tone={cur.tone==="green"?"green":cur.tone==="red"?"red":"amber"}>{tx(cur.short, lang)}</Badge></div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[[tx("Call/进攻",lang),"teal",cur.bias.attack],[tx("等待/降仓",lang),"amber",cur.bias.wait],[tx("Put/防守",lang),"red",cur.bias.defend]].map(([l,t,v])=>(
            <div key={l} className="rounded-2xl border border-white/10 bg-slate-900/58 p-3"><div className="text-xs font-black text-slate-500 mb-2">{l}</div><div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div className={cn("h-full rounded-full",t==="teal"?"bg-teal-500":t==="amber"?"bg-amber-500":"bg-red-500")} style={{width:`${v}%`}}/></div><div className={cn("mt-2 text-2xl font-black",t==="teal"?"text-teal-300":t==="amber"?"text-amber-300":"text-red-300")}>{tx(v>=70?"极高":v>=50?"高":v>=25?"中":"低", lang)}</div></div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── ACCOUNT REBUILDING BANNER ─── */
/* ─── THEME / LANG TOGGLE ─── */
function ThemeLangControls({ theme, onTheme, lang, onLang }) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button type="button" onClick={onTheme}
        className="flex items-center gap-1.5 rounded-2xl border border-white/15 bg-slate-800/60 px-3 py-1.5 text-xs font-black text-slate-400 hover:text-slate-100 hover:border-white/30 transition select-none">
        <span className="text-sm">{theme === "dark" ? "☀️" : "🌙"}</span>
        <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
      </button>
      <button type="button" onClick={onLang}
        className="flex items-center gap-1.5 rounded-2xl border border-white/15 bg-slate-800/60 px-3 py-1.5 text-xs font-black text-slate-400 hover:text-slate-100 hover:border-white/30 transition select-none">
        <span className="text-sm">🌐</span>
        <span>{lang === "zh" ? "EN" : "中文"}</span>
      </button>
    </div>
  );
}

function AccountRebuildingBanner({ lang }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  const [execCount,setExecCount]=useState(0);
  const accounts = lang === "zh"
    ? [{account:"黄金账户",pattern:"稳定盈利→放大仓位→震荡行情→爆仓"},{account:"期权账户",pattern:"小额稳定→放大张数+开盘进场→3天-50%"}]
    : [{account:"Gold Account",pattern:"Stable profit → scale up → choppy market → blown out"},{account:"Options Account",pattern:"Small stable gains → more contracts + opening entries → −50% in 3 days"}];
  return (
    <div className="mb-6 rounded-[1.8rem] border-2 border-red-400/40 bg-red-950/30 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2"><Flame className="h-5 w-5 text-red-400"/><span className="text-xs font-black uppercase tracking-[0.2em] text-red-400">{t("账户重建阶段","Account Rebuilding Phase")}</span><Badge tone="red">{t("当前余额 ~$1,000","Current Balance ~$1,000")}</Badge></div>
          <h3 className="text-xl font-black text-red-100 mb-2">{t("现阶段目标不是盈利，是建立稳定执行的肌肉记忆","Current goal is not profit — it's building stable execution muscle memory")}</h3>
          <div className="text-sm font-bold text-red-200/80 leading-6 mb-3">{t("评判标准：不是盈亏金额，是这笔交易进场前是否走完了全部检查清单。","Success criterion: not P&L — but whether you completed the full checklist before this entry.")}</div>
          <div className="grid gap-2 md:grid-cols-2 mb-3">
            {accounts.map(p=>(
              <div key={p.account} className="rounded-xl border border-red-400/25 bg-red-900/20 px-3 py-2"><span className="text-xs font-black text-red-400">{p.account}</span><div className="text-xs font-bold text-red-200/80 mt-0.5">{p.pattern}</div></div>
            ))}
          </div>
          <div className="rounded-xl border border-amber-400/35 bg-amber-950/30 px-4 py-2"><span className="text-xs font-black text-amber-300">{t("根本原因：","Root cause: ")}</span><span className="text-xs font-bold text-amber-200">{t("补偿心理触发失控行为。能力没有问题，开关是情绪，不是市场。","Revenge psychology triggers loss-of-control. Ability is not the problem — the switch is emotional, not market.")}</span></div>
        </div>
        <div className="w-full md:w-56">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">{t("稳定执行进度","Stable Execution Progress")}</div>
            <div className="flex items-end gap-2 mb-2"><span className="text-4xl font-black text-violet-200">{execCount}</span><span className="text-lg font-black text-slate-500 mb-1">/ 20</span></div>
            <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden mb-3"><div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width:`${Math.round(execCount/20*100)}%` }}/></div>
            <div className="grid grid-cols-4 gap-1 mb-3">
              {[...Array(20)].map((_,i)=>(
                <button key={i} type="button" onClick={()=>setExecCount(i<execCount?i:i+1)} className={cn("h-6 rounded-lg text-[10px] font-black transition",i<execCount?"bg-violet-600 text-white":"bg-slate-800 text-slate-600 hover:bg-slate-700")}>{i+1}</button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 font-bold text-center">{execCount>=20?t("✓ 可讨论扩展","✓ Ready to discuss scaling"):t(`还需 ${20-execCount} 笔后再讨论扩展`,`${20-execCount} more executions before scaling discussion`)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeaOSPanel({ lang }) {
  const rules = I.seaIronRules.map(r => ({...r, text: r[lang === "zh" ? "zh" : "en"]}));
  const beliefs = I.coreBeliefs.map(b => b[lang === "zh" ? "zh" : "en"]);
  const coreLabel = lang === "zh" ? "核心信条" : "Core Beliefs";
  const panelLabel = lang === "zh" ? "Sea 交易员铁律 · QQQ期权专项" : "Sea Trader Iron Rules · QQQ Options";
  const qrLabel = lang === "zh" ? "Quick Reference · $1,000账户" : "Quick Reference · $1,000 Account";
  const qrItems = lang === "zh"
    ? [{label:"每笔止损",value:"−$20",tone:"red"},{label:"每笔目标",value:"+$40",tone:"green"},{label:"日亏熔断",value:"−$50",tone:"red"},{label:"时间止盈",value:"45分钟",tone:"amber"}]
    : [{label:"Per-Trade Stop",value:"−$20",tone:"red"},{label:"Per-Trade Target",value:"+$40",tone:"green"},{label:"Daily Limit",value:"−$50",tone:"red"},{label:"Time Stop",value:"45 min",tone:"amber"}];
  const coreTag = lang === "zh" ? "核心" : "Core";
  return (
    <div className="mb-6 rounded-[1.8rem] border border-white/15 bg-slate-950/80 p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div>
          <div className="flex items-center gap-2 mb-4"><Lock className="h-4 w-4 text-teal-400"/><span className="text-xs font-black uppercase tracking-[0.2em] text-teal-400">{panelLabel}</span></div>
          <div className="grid gap-2 sm:grid-cols-2">
            {rules.map(rule=>(
              <div key={rule.n} className={cn("flex items-start gap-3 rounded-xl border px-3 py-2.5",rule.critical?"border-red-400/45 bg-red-950/40":"border-white/8 bg-slate-900/40")}>
                <div className={cn("w-7 h-7 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-black",rule.critical?"bg-red-700 text-white":"bg-slate-800 text-slate-400")}>{rule.n}</div>
                <span className={cn("text-sm font-bold leading-6",rule.critical?"text-red-200 font-black":"text-slate-300")}>{rule.text}{rule.critical&&<span className="ml-2 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-black">{coreTag}</span>}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-teal-400/25 bg-teal-950/25 p-4">
            <div className="text-xs font-black text-teal-400 uppercase tracking-wider mb-3">{coreLabel}</div>
            {beliefs.map((b,i)=><div key={i} className="flex items-start gap-2 mb-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"/><span className="text-base font-black text-teal-100 leading-7">{b}</span></div>)}
          </div>
          <div className="rounded-2xl border border-amber-400/25 bg-amber-950/20 p-4">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2">{qrLabel}</div>
            <div className="grid grid-cols-2 gap-2">
              {qrItems.map(item=>(
                <div key={item.label} className={cn("rounded-xl p-2 text-center",item.tone==="red"?"bg-red-950/40 border border-red-400/30":item.tone==="green"?"bg-emerald-950/40 border border-emerald-400/30":"bg-amber-950/30 border border-amber-400/25")}>
                  <div className="text-[10px] font-black text-slate-500 uppercase">{item.label}</div>
                  <div className={cn("text-lg font-black mt-0.5",item.tone==="red"?"text-red-300":item.tone==="green"?"text-emerald-300":"text-amber-300")}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTIONS ─── */
function RiskSpineSection({ lang }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  return (
    <section className="mb-8 rounded-[2.2rem] border-2 border-teal-300/35 bg-slate-950/70 p-5 md:p-7">
      <SectionHeader number="00" title={t("风控脊柱","Risk Spine")} desc={t("先活下来，才能谈翻倍。亏50%需要赚100%回本。所有其他模块挂在这根脊柱下面，每笔交易之前必过此关。","Survive first, profit second. −50% requires +100% to recover. Every module hangs from this spine — required before every entry.")} tone="red"/>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <RiskCalculator lang={lang}/>
        <div className="grid gap-4">
          <ScaleUpPath lang={lang}/>
          <Card className="rounded-[1.8rem] border-white/15 p-5">
            <div className="flex items-center justify-between gap-3 mb-4"><h3 className="text-lg font-black text-slate-50">{t("持仓管理","Position Management")}</h3><Zap className="h-5 w-5 text-slate-500"/></div>
            <div className="grid gap-2">
              <VisualMeter label={t("止损线","Stop Line")} left={t("-20%警戒","-20% Alert")} right={t("-25%硬止损","-25% Hard Stop")} fill={100} tone="red" note={t("QQQ期权固定-$20","QQQ option: −$20")}/>
              <VisualMeter label={t("止盈线","Profit Target")} left={t("+50%减仓50%","+50% reduce 50%")} right={t("+80%全平","+80% full exit")} fill={78} tone="green" note={t("目标+$40","Target +$40")}/>
              <div className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-3 text-xs font-bold text-amber-100">{t("时间止盈：持仓超45分钟，无论盈亏出场","Time stop: exit after 45 min regardless of P&L")}</div>
              <RuleCard label={t("绝对禁止","Absolutely Forbidden")} text={t("扛单·加仓摊平·换合约续命·超仓","Holding losers · averaging down · rolling contracts · oversizing")} tone="red" icon={Ban}/>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function OptionsSystem({ gexSetup, onSaveGex, gexIsToday, lang }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  const conditions = I.fourEntryConditions.map(c=>({n:c.n,title:lang==="zh"?c.zh_t:c.en_t,desc:lang==="zh"?c.zh_d:c.en_d}));
  const indicators = [
    { icon:BarChart2, title:"VWAP", role:t("方向过滤器","Direction Filter"), rules:[t("价格在VWAP上方→只做Call","Price above VWAP → Calls only"),t("价格在VWAP下方→只做Put","Price below VWAP → Puts only"),t("VWAP附近横跳→不开仓","VWAP chop → no entry")] },
    { icon:TrendingUp, title:"EMA 9/21", role:t("趋势确认","Trend Confirmation"), rules:[t("9EMA>21EMA且发散→多头趋势","9EMA > 21EMA + diverging → bullish"),t("9EMA<21EMA且发散→空头趋势","9EMA < 21EMA + diverging → bearish"),t("两线粘合/频繁交叉→不开仓","Tangled / crossing → no entry")] },
    { icon:Activity, title:t("成交量","Volume"), role:t("动能确认（必须）","Momentum Confirm (required)"), rules:[t("当前量>前5根平均量×1.5倍","Current bar > 5-bar avg × 1.5×"),t("仅方向+趋势无量→不开仓","Direction + trend, no volume → no entry"),t("三者缺一不可","All three required")] },
  ];
  const instruments = [
    { name:"QQQ ✓", desc:t("趋势比个股干净，假突破少；流动性极好价差小；单一消息面影响小；复盘10天确认结构明显优于NVDA。","Cleaner trends; tight spreads; less headline risk. 10-day backtesting confirmed structure is meaningfully better than NVDA."), tone:"teal", tag:t("当前主力","Primary") },
    { name:"SPY", desc:t("IV低、点差极小，但窄幅震荡频繁，theta磨损快。大盘趋势日可用，不是首选。","Low IV, tight spreads, but frequent narrow-range chop and fast theta decay. Usable on trend days — not the default."), tone:"slate", tag:t("备选","Backup") },
    { name:"NVDA ✗", desc:t("消息面冲击大；开盘方向不可预测；已有负面记录，心理干扰风险；市价价差损耗严重。暂时回避。","High headline sensitivity; unpredictable opening direction; prior negative record adds psychological noise. Avoid for now."), tone:"red", tag:t("暂时回避","Avoid") },
  ];
  const vwapSteps = [
    { step:"Step 1", title:t("接近VWAP","Approaching VWAP"), text:t("只观察，不抢跑，不直接开仓。","Observe only — no anticipation, no entries."), border:"border-white/10 bg-slate-900/58", tag:"text-slate-500" },
    { step:"Step 2", title:t("等待确认","Await Confirmation"), text:t("Call看收回+9EMA上拐+量能1.5x；Put看反抽失败+跌回+量能1.5x。","Call: VWAP reclaim + 9EMA up + vol 1.5×. Put: failed bounce + drop + vol 1.5×."), border:"border-teal-300/25 bg-teal-500/10", tag:"text-teal-500" },
    { step:"Step 3", title:t("执行/放弃","Execute / Abandon"), text:t("三项+时间全满足才进；反复穿越、无量直接放弃。","All 3 + time window satisfied → enter. Chop, no volume → abandon."), border:"border-red-300/35 bg-red-950/45", tag:"text-red-500" },
  ];
  const heatRows = [
    {label:"09:30–09:45",status:t("禁做","Banned"),fill:8,barColor:"bg-red-600",note:t("开盘乱流，绝对禁区","Opening chaos — absolute no-entry zone")},
    {label:"09:45–11:30",status:t("优先","Active"),fill:88,barColor:"bg-emerald-500",note:t("主战窗口，趋势确立后入场","Primary window — enter after trend establishes")},
    {label:"11:30–16:00",status:t("禁做","Banned"),fill:12,barColor:"bg-red-600",note:t("11:30后不开新仓","No new positions after 11:30 ET")},
  ];
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 md:p-7">
      <SectionHeader number="01" title={t("美股期权买方系统 · QQQ专注","US Options Buyer System · QQQ Focus")} desc={t("固定QQQ，固定1张。每日开盘前填写GEX设置，再用三指标四条件执行。GEX决定今日是震荡模式还是趋势模式。","Fixed QQQ, fixed 1 contract. Set today's GEX before the open, then execute using the 3-indicator / 4-condition system. GEX determines today's regime.")} tone="teal">
        {gexIsToday && <Badge tone={gexSetup.state==="positive"?"blue":"amber"}>{gexSetup.state==="positive"?t("今日: 正GEX 震荡","Today: Positive GEX Range"):t("今日: 负GEX 趋势","Today: Negative GEX Trend")}</Badge>}
      </SectionHeader>
      <GEXDailySetupCard setup={gexSetup} onSave={onSaveGex} isToday={gexIsToday} t={t} lang={lang}/>
      <GEXPanel setup={gexSetup} isToday={gexIsToday} t={t} lang={lang}/>
      <div className="mb-5 rounded-[1.8rem] border-2 border-teal-400/35 bg-teal-950/20 p-5">
        <div className="text-sm font-black text-teal-300 uppercase tracking-wider mb-4">{t("三指标框架 · 缺一不可","3-Indicator Framework · All Required")}</div>
        <div className="grid gap-4 md:grid-cols-3">
          {indicators.map(ind=>{const Icon=ind.icon;return(
            <div key={ind.title} className="rounded-2xl border border-teal-300/25 bg-teal-500/8 p-4">
              <div className="flex items-center gap-2 mb-3"><Icon className="h-5 w-5 text-teal-400"/><div><div className="text-base font-black text-teal-100">{ind.title}</div><div className="text-xs text-teal-400 font-bold">{ind.role}</div></div></div>
              {ind.rules.map((r,i)=><div key={i} className="flex items-start gap-1.5 mb-1"><div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"/><span className="text-xs font-bold text-slate-300 leading-5">{r}</span></div>)}
            </div>
          );})}
        </div>
      </div>
      <div className="mb-5">
        <div className="text-sm font-black text-slate-300 uppercase tracking-wider mb-3">{t("四项入场条件 · 全部满足才开仓","4 Entry Conditions · All Required to Enter")}</div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {conditions.map(cond=>(
            <div key={cond.n} className="rounded-2xl border border-teal-300/20 bg-slate-800/50 p-4">
              <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-xl bg-teal-900/70 border border-teal-700/50 flex items-center justify-center text-sm font-black text-teal-400">{cond.n}</div><span className="text-sm font-black text-slate-50">{cond.title}</span></div>
              <p className="text-xs font-bold text-slate-400 leading-5">{cond.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-red-300/35 bg-red-950/35 p-3 text-xs font-bold text-red-100">⚠️ {t("四项缺一不可。量能未达标→不开仓。11:30后→不开仓。没有例外。","All 4 non-negotiable. Volume below threshold → no entry. After 11:30 ET → no entry. Zero exceptions.")}</div>
      </div>
      <div className="mb-5">
        <div className="text-sm font-black text-slate-300 uppercase tracking-wider mb-3">{t("标的选择 · 当前主力QQQ","Instrument Selection · Primary: QQQ")}</div>
        <div className="grid gap-3 md:grid-cols-3">
          {instruments.map(item=>(
            <Card key={item.name} className={cn("rounded-[1.5rem] p-4",item.tone==="teal"?"border-teal-300/25 bg-teal-500/8":item.tone==="red"?"border-red-300/25 bg-red-950/30":"border-white/10 bg-slate-900/40")}>
              <div className="mb-2 flex items-center justify-between"><span className="text-lg font-black text-slate-50">{item.name}</span><Badge tone={item.tone==="teal"?"teal":item.tone==="red"?"red":"slate"}>{item.tag}</Badge></div>
              <p className="text-xs font-bold leading-6 text-slate-400">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr] mb-5">
        <div>
          <div className="text-sm font-black text-slate-300 uppercase tracking-wider mb-3">{t("VWAP 状态机","VWAP State Machine")}</div>
          <div className="grid gap-3 md:grid-cols-3 mb-4">
            {vwapSteps.map(s=><div key={s.step} className={cn("rounded-2xl border p-4",s.border)}><div className={cn("text-xs font-black uppercase tracking-wider mb-2",s.tag)}>{s.step}</div><div className="text-sm font-black text-slate-50">{s.title}</div><div className="mt-2 text-sm font-bold leading-6 text-slate-400">{s.text}</div></div>)}
          </div>
          <div className="mb-4 rounded-[1.6rem] border border-violet-300/25 bg-violet-950/20 p-4">
            <div className="flex items-center gap-2 mb-3"><Lock className="h-4 w-4 text-violet-400"/><span className="text-sm font-black text-violet-300">{t("VWAP扫流动性收回结构 · 仅观察","VWAP Liquidity Sweep Recovery · Observe Only")}</span><Badge tone="violet">{t("观察中","Observing")}</Badge></div>
            <p className="text-xs font-bold text-slate-400 leading-6 mb-3">{t("开盘15-30分钟内价格冲出VWAP后迅速收回。需≥30次样本，成功率>60%后启用。","Price breaks VWAP within 15-30 min of open then quickly reclaims. Requires ≥30 sample observations with >60% success rate before going live.")}</p>
            <div className="grid gap-2 md:grid-cols-2">
              {[
                {label:t("当前状态","Status"),text:t("只观察记录，不实盘","Observe and log only"),tone:"violet"},
                {label:t("启用条件","Activation"),text:t("≥30次样本，成功率>60%","≥30 samples, success rate >60%"),tone:"amber"},
                {label:t("入场条件","Entry"),text:t("明显拒绝K线+量能+真正收回VWAP站稳","Clear rejection candle + volume + genuine VWAP reclaim"),tone:"teal"},
                {label:t("止损位置","Stop Location"),text:t("扫出去的高点或低点","The high or low of the sweep candle"),tone:"red"},
              ].map(item=><RuleCard key={item.label} {...item} icon={item.tone==="red"?Ban:CheckCircle2}/>)}
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <HeatBar rows={heatRows} lang={lang}/>
          <Card className="rounded-[1.7rem] border-white/15 p-5">
            <div className="flex items-center justify-between gap-3 mb-4"><h3 className="text-base font-black text-slate-50">{t("合约与风控仪表","Contract & Risk Dashboard")}</h3><Gauge className="h-5 w-5 text-slate-500"/></div>
            <div className="grid gap-3">
              <VisualMeter label="Delta" left={t("激进0.35","Aggr 0.35")} right={t("深ITM 0.65","Deep 0.65")} fill={55} tone="teal" note={t("ATM优先，约0.5","ATM ≈ 0.5")}/>
              <VisualMeter label="DTE" left="1 DTE" right="45 DTE" fill={22} tone="blue" note={t("日内1-5；波段14-45","Intraday 1-5; swing 14-45")}/>
              <VisualMeter label={t("价差","Spread")} left="$0.01" right="$0.20+" fill={25} tone="amber" note={t("≤$0.05优；≥$0.15放弃","≤$0.05 ideal; ≥$0.15 skip")}/>
              <VisualMeter label="IVR" left={t("0（买方友好）","0 (buyer-friendly)")} right={t("100（禁止裸买）","100 (no naked)")} fill={30} tone="violet" note={t("<30单腿；>50不裸买","<30 single leg; >50 no naked")}/>
            </div>
          </Card>
        </div>
      </div>
      <ZeroDTEMistakesCard lang={lang}/>
      <OptionPriceEstimator lang={lang}/>
    </section>
  );
}

function GoldSystem({ lang }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 md:p-7">
      <SectionHeader number="02" title={t("黄金 XAU/USD 现货买卖","Gold XAU/USD Spot Trading")} desc={t("外汇平台现货/差价合约交易，非期权。宏观驱动决定方向，SMC结构决定位置，Kill Zone决定时间。三层对齐才出手。","Spot/CFD leveraged trading on FX platform — NOT options. Macro drives direction, SMC determines level, Kill Zone determines timing. All three must align.")} tone="amber"/>
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-amber-400"/><h3 className="text-base font-black text-amber-300 uppercase tracking-wider">{t("宏观驱动层（黄金真正的“大盘”）","Macro Driver Layer (Gold's True 'Context')")}</h3></div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {goldMacroDrivers.map(item=>(
            <div key={item.driver} className={cn("rounded-2xl border p-4",item.tone==="red"?"border-red-300/35 bg-red-950/35":item.tone==="amber"?"border-amber-300/25 bg-amber-500/10":item.tone==="green"?"border-emerald-300/25 bg-emerald-500/10":item.tone==="blue"?"border-sky-300/25 bg-sky-500/10":"border-white/10 bg-slate-900/58")}>
              <div className="flex items-start justify-between gap-2 mb-2"><span className="text-sm font-black text-slate-50">{tx(item.driver, lang)}</span><Badge tone={item.tone}>{tx(item.dir, lang)}</Badge></div>
              <p className="text-xs font-bold leading-5 text-slate-400">{tx(item.note, lang)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-red-300/35 bg-red-950/35 p-3 text-xs font-bold leading-6 text-red-100"><span className="font-black">{t("方向确认规则：","Direction rule: ")}</span>{t("做多黄金前，确认DXY与实际利率未同时走强。若两者都在反向，不做或极小仓。","Before going long gold, confirm DXY and real rates are not both rising. If both reverse against you — pass or micro size.")}</div>
      </div>
      <div className="mb-5"><ProcessRail tone="amber" steps={[{title:t("日线定向","Daily: Direction"),text:t("宏观驱动方向+主结构OB+流动性格局","Macro driver direction + major OB + liquidity landscape")},{title:t("4H/1H找位","4H/1H: Find Level"),text:t("BSL/SSL流动性+FVG+POC集中区+结构重叠","BSL/SSL liquidity + FVG + POC cluster + structural overlap")},{title:t("15M/5M确认","15M/5M: Confirm"),text:t("等收回/拒绝/CHoCH·BOS，不在测试区抢跑","Wait for reclaim / rejection / CHoCH·BOS — don't front-run the test zone")},{title:t("只拿中间段","Take Middle Leg"),text:t("止损放结构外；信号不完整，放弃。","Stop outside structure. Incomplete signal — pass.")}]}/></div>
      <div className="mb-5"><KillZoneBoard lang={lang} items={[{title:t("伦敦","London"),text:t("15:00–17:00 北京：扫亚洲盘高低点，常设定当日方向","15:00–17:00 BJ: sweeps Asian highs/lows, often sets day's direction"),cls:"border-amber-300/25 bg-amber-500/10",icon:CheckCircle2,iconCls:"text-amber-300"},{title:t("纽约","New York"),text:t("21:30–23:30 北京：扫伦敦高低后定方向，主要走势段","21:30–23:30 BJ: sweeps London levels then sets direction"),cls:"border-sky-300/25 bg-sky-500/10",icon:CheckCircle2,iconCls:"text-sky-300"},{title:t("禁区","Banned"),text:t("亚洲盘中间位不追，FOMC/CPI发布瞬间方向未定不进","Asian midrange: don't chase. FOMC/CPI publication: direction unknown, stay out"),cls:"border-red-300/35 bg-red-950/45",icon:Ban,iconCls:"text-red-300"}]}/></div>
      <div className="grid gap-4 md:grid-cols-3">{goldModels.map(m=><FlowCard key={m.title} {...m}/>)}</div>
    </section>
  );
}
function ForexSystem({ lang }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 md:p-7">
      <SectionHeader number="03" title={t("EUR/USD 外汇系统","EUR/USD FX System")} desc={t("趋势跟踪系统：EMA顺排+ADX确认趋势环境，回踩结构位等确认，只拿中间段。均线缠绕和低ADX时系统无效，不做。","Trend-following system: EMA alignment + ADX confirms trend environment, pullback to structure for entry, take the middle leg only. Tangled EMAs or low ADX = system invalid.")} tone="blue"/>
      <ProcessRail tone="blue" steps={[{title:t("趋势过滤","Trend Filter"),text:t("EMA9/21/55顺排+ADX>25，先确认趋势环境","EMA 9/21/55 aligned + ADX>25 — confirm trend first")},{title:"Kill Zone",text:t("伦敦/纽约开盘窗口，扫前高低点后定方向","London/NY open windows — sweep prior levels then set direction")},{title:t("找回踩位","Find Pullback"),text:t("回踩EMA21或关键结构位，等拒绝K线确认","Pullback to EMA21 or key structure, wait for rejection candle")},{title:t("执行","Execute"),text:t("RR≥1:2；到1:1.5先锁一半；不追破位第一根","RR ≥ 1:2; lock 50% at 1:1.5; never chase the first breakout candle")}]}/>
      <div className="mt-5 mb-5"><KillZoneBoard lang={lang} items={[{title:t("伦敦","London"),text:t("15:00–17:00 北京：EUR主要方向常在此确立","15:00–17:00 BJ: EUR's primary direction usually established here"),cls:"border-sky-300/25 bg-sky-500/10",icon:CheckCircle2,iconCls:"text-sky-300"},{title:t("纽约","New York"),text:t("21:30–23:30 北京：美国数据/纽约开盘是EUR第二主要时段","21:30–23:30 BJ: US data / NY open is EUR's second major session"),cls:"border-blue-300/25 bg-blue-500/10",icon:CheckCircle2,iconCls:"text-blue-300"},{title:t("禁区","Banned"),text:t("ADX<20+均线缠绕/重大数据前后/亚洲盘中间位","ADX<20 + tangled EMAs / around major data / Asian midrange"),cls:"border-red-300/35 bg-red-950/45",icon:Ban,iconCls:"text-red-300"}]}/></div>
      <div className="grid gap-4 md:grid-cols-2">{eurModels.map(m=><FlowCard key={m.title} {...m}/>)}</div>
    </section>
  );
}
function StockSystem({ lang }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 md:p-7">
      <SectionHeader number="04" title={t("美股正股 · 低频配置","US Equities · Low-Frequency Portfolio")} desc={t("这是资金量大了以后的底仓系统，不是当前主战场。先筛公司质量，再等技术位置，最后低频持有。不做日内，不追热点。","This is the compounding foundation for later — not the current battleground. Screen for company quality first, then wait for the technical level, then hold low-frequency.")} tone="violet"/>
      <div className="grid gap-4 md:grid-cols-3">
        {lang === "zh" ? <>
          <FlowCard lang={lang} title="基本面筛选" badge="第一步" tone="violet" items={[{label:"营收/利润",text:"连续增长，行业景气，无重大负面"},{label:"质量筛选",text:"重视增长质量和护城河",tone:"blue"},{label:"不做",text:"只因K线好看/热点消息/情绪冲动",tone:"red",icon:Ban}]}/>
          <FlowCard lang={lang} title="技术择时" badge="第二步" tone="violet" items={[{label:"周线",text:"趋势不坏，在关键支撑或突破回踩"},{label:"日线",text:"回调支撑，结构完整",tone:"teal"},{label:"60分钟",text:"日线确认后，60分钟找入场确认",tone:"blue"}]}/>
          <FlowCard lang={lang} title="持仓管理" badge="第三步" tone="violet" items={[{label:"持有周期",text:"周线级别为基准，不做日内"},{label:"止损",text:"主结构下方，不因短期波动止损"},{label:"加仓",text:"等突破确认后再加，不在下跌中摊平",tone:"amber"}]}/>
        </> : <>
          <FlowCard lang={lang} title="Fundamental Screen" badge="Step 1" tone="violet" items={[{label:"Revenue/Profit",text:"Consistent growth, favorable industry, no major negatives"},{label:"Quality",text:"Prioritize growth quality and moat",tone:"blue"},{label:"Never",text:"Aesthetics / hype / emotional impulse",tone:"red",icon:Ban}]}/>
          <FlowCard lang={lang} title="Technical Timing" badge="Step 2" tone="violet" items={[{label:"Weekly",text:"Trend intact; at key support or post-breakout pullback"},{label:"Daily",text:"Pullback to support, structure intact",tone:"teal"},{label:"60-min",text:"After daily confirmation, use 60-min for entry",tone:"blue"}]}/>
          <FlowCard lang={lang} title="Position Management" badge="Step 3" tone="violet" items={[{label:"Holding Period",text:"Weekly timeframe as base — no intraday"},{label:"Stop",text:"Below major structure — not triggered by short-term volatility"},{label:"Adding",text:"Add after confirmed breakout only — never average down",tone:"amber"}]}/>
        </>}
      </div>
    </section>
  );
}
function MacroAndModels({ lang }) {
  const t = (zh, en) => lang === "zh" ? zh : en;
  const dxyItems = [
    {state:t("实际利率↓+DXY↓","Real rates↓ + DXY↓"),action:t("黄金最友好环境，可主动做多","Most favorable for gold — actively seek longs"),tone:"green"},
    {state:t("单向下行（其一）","Single downside (either)"),action:t("偏多，需结构确认，不强追","Bullish bias — require structural confirmation"),tone:"amber"},
    {state:t("双向平稳","Both stable"),action:t("中性，用SMC结构确认方向","Neutral — use SMC structure to confirm direction"),tone:"slate"},
    {state:t("单向上行（其一）","Single upside (either)"),action:t("谨慎，降仓，等更好入场点","Cautious — reduce size, wait for better entry"),tone:"amber"},
    {state:t("实际利率↑+DXY↑（双向压制）","Real rates↑ + DXY↑ (dual headwind)"),action:t("禁止做多，宏观双向压制","No longs — dual macro headwind"),tone:"red"},
  ];
  const evModels = lang === "zh" ? [
    {title:"流动性扫单收回",badge:"黄金/EUR",tone:"amber",items:[{label:"场景",text:"扫前高/前低+重新收回结构"},{label:"触发",text:"长影线+CHoCH确认",tone:"teal"},{label:"EV特征",text:"中等胜率+高赔率。切忌只扫不收入场",tone:"amber"}]},
    {title:"POC/FVG/OB共振",badge:"黄金",tone:"amber",items:[{label:"场景",text:"成本区+OB/FVG+流动性位重叠"},{label:"触发",text:"回踩拒绝+量能启动+宏观未反向",tone:"teal"},{label:"EV特征",text:"共振点越多胜率越高，穿透则放弃",tone:"amber"}]},
    {title:"EMA趋势回踩",badge:"EUR",tone:"blue",items:[{label:"场景",text:"EMA顺排+ADX>25确认趋势"},{label:"触发",text:"回踩EMA21/结构位不破",tone:"teal"},{label:"EV特征",text:"趋势日胜率高，均线缠绕时期望值极差",tone:"blue"}]},
    {title:"负GEX+VWAP破位顺势",badge:"QQQ期权",tone:"teal",items:[{label:"场景",text:"负GEX环境+VWAP失守/站不回+量能放大"},{label:"触发",text:"VWAP破位确认+9EMA顺势+量能1.5x",tone:"green"},{label:"EV特征",text:"负GEX日趋势延伸概率更高，是买方最好的环境",tone:"teal"}]},
    {title:"正GEX VWAP回踩确认",badge:"QQQ期权",tone:"teal",items:[{label:"场景",text:"正GEX环境+价格回踩VWAP不破+量能确认"},{label:"触发",text:"VWAP收回+9EMA支撑+量能1.5x",tone:"green"},{label:"EV特征",text:"正GEX压波动，回归成功率高于追突破",tone:"teal"}]},
    {title:"事件后IV回落",badge:"期权特有",tone:"green",items:[{label:"场景",text:"FOMC/CPI发布后，方向定盘，IV开始回落"},{label:"触发",text:"等二次确认，不追公布瞬间"},{label:"EV特征",text:"此时做debit/credit价差都有edge；IV降后买方才合理",tone:"green"}]},
  ] : [
    {title:"Liquidity Sweep Recovery",badge:"Gold/EUR",tone:"amber",items:[{label:"Setup",text:"Sweeps prior high/low then reclaims structure"},{label:"Trigger",text:"Long wick + CHoCH confirmation",tone:"teal"},{label:"EV Profile",text:"Moderate win rate + high payoff. Never enter on sweep without reclaim.",tone:"amber"}]},
    {title:"POC/FVG/OB Convergence",badge:"Gold",tone:"amber",items:[{label:"Setup",text:"Cost cluster + OB/FVG + liquidity level overlap"},{label:"Trigger",text:"Rejection on pullback + momentum + macro not reversed",tone:"teal"},{label:"EV Profile",text:"More convergence = higher probability. Breach = abandon.",tone:"amber"}]},
    {title:"EMA Trend Pullback",badge:"EUR",tone:"blue",items:[{label:"Setup",text:"EMA aligned + ADX>25 — trend confirmed"},{label:"Trigger",text:"Pullback to EMA21 / structure holds",tone:"teal"},{label:"EV Profile",text:"High win rate on trend days; terrible edge when EMAs are tangled",tone:"blue"}]},
    {title:"Neg-GEX + VWAP Break",badge:"QQQ Options",tone:"teal",items:[{label:"Setup",text:"Negative GEX + VWAP lost / can't reclaim + volume expanding"},{label:"Trigger",text:"VWAP break confirmed + 9EMA directional + volume 1.5×",tone:"green"},{label:"EV Profile",text:"Negative GEX days have higher trend-extension probability — best buyer environment",tone:"teal"}]},
    {title:"Pos-GEX VWAP Pullback",badge:"QQQ Options",tone:"teal",items:[{label:"Setup",text:"Positive GEX + price pulls back to VWAP but holds"},{label:"Trigger",text:"VWAP reclaim + 9EMA support + volume 1.5×",tone:"green"},{label:"EV Profile",text:"Positive GEX suppresses vol — pullback success rate higher than chasing breaks",tone:"teal"}]},
    {title:"Post-Event IV Collapse",badge:"Options Specific",tone:"green",items:[{label:"Setup",text:"After FOMC/CPI: direction set, IV starting to fall"},{label:"Trigger",text:"Wait for second confirmation — don't chase the publication candle"},{label:"EV Profile",text:"Both debit and credit spreads have edge here; raw buyers should wait for IV to normalize",tone:"green"}]},
  ];
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/74 p-5 md:p-7">
      <SectionHeader number="05" title={t("宏观过滤 + 高期望值模型库","Macro Filter + High EV Model Library")} desc={t("双轨过滤：期权看VIX三档，黄金/外汇看DXY+实际利率。宏观只做环境过滤，不代替具体入场触发。","Dual-track filtering: options use VIX three-tier; gold/FX use DXY + real rates. Macro only filters the environment — does not replace a specific entry trigger.")} tone="slate"/>
      <div className="grid gap-5 xl:grid-cols-2 mb-6">
        <div><div className="mb-3"><Badge tone="teal">{t("期权/美股 · VIX三档过滤","Options/Equities · VIX Three-Tier Filter")}</Badge></div><MacroRadarBoard lang={lang}/></div>
        <div>
          <div className="mb-3"><Badge tone="amber">{t("黄金/外汇 · 宏观过滤","Gold/FX · Macro Filter")}</Badge></div>
          <Card className="rounded-[1.5rem] border-white/15 p-4 mb-3">
            <h4 className="text-base font-black text-slate-50 mb-3">{t("DXY + 实际利率双维判断","DXY + Real Rates Two-Dimensional Assessment")}</h4>
            <div className="grid gap-2">
              {dxyItems.map(item=>(
                <div key={item.state} className={cn("rounded-xl border px-3 py-2",item.tone==="green"?"border-emerald-300/25 bg-emerald-500/10":item.tone==="red"?"border-red-300/35 bg-red-950/35":item.tone==="amber"?"border-amber-300/25 bg-amber-500/10":"border-white/10 bg-slate-900/40")}>
                  <div className="flex items-start justify-between gap-2"><span className="text-xs font-black text-slate-200">{item.state}</span><Badge tone={item.tone}>{item.tone==="green"?t("友好","Favorable"):item.tone==="red"?t("禁止","Forbidden"):item.tone==="amber"?t("谨慎","Caution"):t("中性","Neutral")}</Badge></div>
                  <div className="text-xs font-bold text-slate-400 mt-1">{item.action}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <div className="mb-3 flex items-center gap-2"><h3 className="text-lg font-black text-slate-50">{t("高期望值模型库","High EV Model Library")}</h3><Badge tone="teal">{t("期望值=胜率×赔率，非单一指标","EV = win rate × payoff — not a single metric")}</Badge></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{evModels.map(m=><FlowCard key={m.title} {...m}/>)}</div>
    </section>
  );
}

function DisciplineSystem({ gexIsToday, lang }) {
  const clItems = I.checklist.map(c => c[lang==="zh"?"zh":"en"]);
  const pmItems = I.preMarketItems.map(p => ({text:p[lang==="zh"?"zh":"en"],warn:p[lang==="zh"?"zh_w":"en_w"]}));
  const qs = I.questions.map(q => ({category:q.cat[lang==="zh"?"zh":"en"],q:q.q[lang==="zh"?"zh":"en"],options:q.opts[lang==="zh"?"zh":"en"],a:q.a,exp:q.exp[lang==="zh"?"zh":"en"]}));
  const preTitle = lang==="zh" ? "开盘前检查（每日）" : "Pre-Market Checklist (Daily)";
  const dayTitle = lang==="zh" ? "入场前清单" : "Entry Checklist";
  const journalTitle = lang==="zh" ? "交易日志模板" : "Trade Journal Template";
  const quizTitle = lang==="zh" ? "训练题库" : "Training Quiz";
  const correctTxt = lang==="zh" ? "✓ 正确" : "✓ Correct";
  const expTxt = lang==="zh" ? "解析" : "Explanation";
  const nextTxt = lang==="zh" ? "下一题" : "Next Question";
  const resultsTxt = lang==="zh" ? "查看成绩" : "See Results";
  const retryTxt = lang==="zh" ? "再练一次" : "Try Again";
  const scoreTxt = lang==="zh" ? "得分" : "Score";
  const canEntryTxt = lang==="zh" ? "✓ 可以入场" : "✓ Ready to Enter";
  const preDoneTxt = lang==="zh" ? "✓ 开盘前检查完毕" : "✓ Pre-Market Checklist Complete";
  const reviewItems = lang==="zh"
    ? ["哪种情绪状态下胜率最低？","正GEX日vs负GEX日，胜率有何差异？","被铁律拦截的交易，事后证明拦对了多少？","哪类进场理由是自我欺骗？"]
    : ["Which emotional state correlates with the lowest win rate?","How does win rate differ on Positive vs Negative GEX days?","Of trades blocked by iron rules, how many proved correct in hindsight?","Which entry rationale categories were self-deception?"];
  const scoreMsg = (score, total) => {
    if (score >= total*0.87) return lang==="zh" ? "优秀，系统理解扎实" : "Excellent — system understanding is solid";
    if (score >= total*0.7) return lang==="zh" ? "良好，继续复习薄弱点" : "Good — keep reviewing weak areas";
    return lang==="zh" ? "需要加强，重读规则再练" : "Needs work — reread the rules then retry";
  };
  const [preChecked,setPreChecked]=useState(()=>gexIsToday?{4:true}:{});
  const [dayChecked,setDayChecked]=useState(()=>gexIsToday?{0:true}:{});
  const [qIndex,setQIndex]=useState(0);const [selected,setSelected]=useState(null);const [score,setScore]=useState(0);const [done,setDone]=useState(false);
  const preCount=Object.values(preChecked).filter(Boolean).length;
  const dayCount=Object.values(dayChecked).filter(Boolean).length;
  const q=qs[qIndex];
  const handleAnswer=(idx)=>{if(selected!==null)return;setSelected(idx);if(idx===q.a)setScore(s=>s+1);};
  const nextQ=()=>{if(qIndex<qs.length-1){setQIndex(i=>i+1);setSelected(null);}else setDone(true);};
  const reset=()=>{setQIndex(0);setSelected(null);setScore(0);setDone(false);};
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 md:p-7">
      <SectionHeader number="07" title={lang==="zh"?"纪律系统与训练":"Discipline System & Training"} desc={lang==="zh"?"开盘前检查+入场前清单（GEX设置后自动打钩）+训练闭环。每笔交易过清单，每周做题。":"Pre-market checklist + entry checklist (GEX auto-checks when set) + training loop. Checklist before every trade. Quiz weekly."} tone="slate"/>
      <div className="grid gap-5 xl:grid-cols-3 mb-5">
        <Card className="rounded-[1.8rem] border-white/15 p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-base font-black text-slate-50">{preTitle}</h3>
            <div className="flex items-center gap-2"><span className="text-sm font-black text-slate-400">{preCount}/{pmItems.length}</span><div className="h-2 w-16 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-amber-500 transition-all" style={{width:`${preCount/pmItems.length*100}%`}}/></div></div>
          </div>
          <div className="space-y-2">
            {pmItems.map((item,i)=>(
              <motion.div key={i} whileHover={{x:4}} onClick={()=>setPreChecked(p=>({...p,[i]:!p[i]}))}
                className={cn("flex items-start gap-3 rounded-2xl border p-3 cursor-pointer transition",preChecked[i]?"border-amber-300/35 bg-amber-500/10":"border-white/10 bg-slate-900/40 hover:border-white/20")}>
                <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border-2 mt-0.5",preChecked[i]?"border-amber-400 bg-amber-500":"border-slate-600")}>{preChecked[i]&&<CheckCircle2 className="h-4 w-4 text-white"/>}</div>
                <div><div className={cn("text-xs font-bold leading-5",preChecked[i]?"text-amber-100":"text-slate-300")}>{item.text}</div><div className="text-[10px] text-slate-500 font-bold mt-0.5">{item.warn}</div></div>
              </motion.div>
            ))}
          </div>
          {preCount===pmItems.length&&<div className="mt-3 rounded-2xl border border-amber-300/35 bg-amber-500/10 p-3 text-center text-sm font-black text-amber-100">{preDoneTxt}</div>}
        </Card>
        <Card className="rounded-[1.8rem] border-white/15 p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-base font-black text-slate-50">{dayTitle}</h3>
            <div className="flex items-center gap-2"><span className="text-sm font-black text-slate-400">{dayCount}/{clItems.length}</span><div className="h-2 w-16 rounded-full bg-slate-800 overflow-hidden"><div className={cn("h-full rounded-full transition-all",dayCount===clItems.length?"bg-emerald-500":dayCount>9?"bg-amber-500":"bg-red-500")} style={{width:`${dayCount/clItems.length*100}%`}}/></div></div>
          </div>
          <div className="space-y-1.5">
            {clItems.map((item,i)=>(
              <motion.div key={i} whileHover={{x:4}} onClick={()=>setDayChecked(p=>({...p,[i]:!p[i]}))} className={cn("flex items-start gap-3 rounded-xl border p-2.5 cursor-pointer transition",dayChecked[i]?"border-teal-300/35 bg-teal-500/10":"border-white/10 bg-slate-900/40 hover:border-white/20")}>
                <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border-2 mt-0.5",dayChecked[i]?"border-teal-400 bg-teal-500":"border-slate-600")}>{dayChecked[i]&&<CheckCircle2 className="h-3 w-3 text-white"/>}</div>
                <span className={cn("text-xs font-bold leading-5",dayChecked[i]?"text-teal-100":"text-slate-300")}>{item}</span>
              </motion.div>
            ))}
          </div>
          {dayCount===clItems.length&&<div className="mt-3 rounded-xl border border-teal-300/35 bg-teal-500/10 p-2 text-center text-sm font-black text-teal-100">{canEntryTxt}</div>}
        </Card>
        <Card className="rounded-[1.8rem] border-white/15 p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="h-4 w-4 text-slate-400"/><h3 className="text-base font-black text-slate-50">{journalTitle}</h3></div>
          <div className="space-y-2 mb-4">
            {journalFields.map((item,i)=>(
              <div key={i} className="flex items-start gap-2 rounded-xl border border-white/8 bg-slate-900/40 px-3 py-2">
                <div className="w-28 flex-shrink-0 text-[10px] font-black text-slate-500 uppercase">{tx(item.field, lang)}</div>
                <div className="text-xs font-bold text-slate-400">{tx(item.example, lang)}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-violet-300/25 bg-violet-950/20 p-3">
            <div className="text-xs font-black text-violet-300 mb-1">{lang==="zh"?"复盘分析重点":"Monthly Review Focus"}</div>
            {reviewItems.map((tx,i)=><div key={i} className="flex items-start gap-1.5 mb-1"><div className="w-1 h-1 rounded-full bg-violet-500 mt-2 flex-shrink-0"/><span className="text-xs font-bold text-slate-400">{tx}</span></div>)}
          </div>
          <div className="mt-3 rounded-xl border border-white/8 bg-slate-900/40 p-3 text-xs font-bold text-slate-500">TradingView Bar Replay + Excel / Notion</div>
        </Card>
      </div>
      <Card className="rounded-[1.8rem] border-white/15 p-5">
        <div className="flex items-center justify-between gap-3 mb-4"><h3 className="text-xl font-black text-slate-50">{quizTitle}</h3><Badge tone="violet">{done?`${scoreTxt} ${score}/${qs.length}`:`${qIndex+1}/${qs.length}`}</Badge></div>
        {done?(
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-violet-400"/>
            <div className="text-3xl font-black text-violet-100 mb-2">{score}/{qs.length}</div>
            <div className="text-slate-400 font-bold mb-6">{scoreMsg(score, qs.length)}</div>
            <button type="button" onClick={reset} className="rounded-2xl bg-violet-700 px-6 py-3 text-sm font-black text-white hover:bg-violet-800 transition">{retryTxt}</button>
          </div>
        ):(
          <>
            <div className="rounded-2xl border border-white/10 bg-slate-900/58 p-4 mb-4"><div className="flex items-center gap-2 mb-3"><Badge tone="violet">{q.category}</Badge></div><p className="text-base font-black text-slate-50 leading-7">{q.q}</p></div>
            <div className="grid gap-2 mb-4">
              {q.options.map((opt,idx)=>(
                <motion.button key={idx} type="button" whileHover={selected===null?{x:6}:{}} onClick={()=>handleAnswer(idx)}
                  className={cn("rounded-2xl border p-3 text-left text-sm font-bold transition",selected===null?"border-white/15 bg-slate-900/40 hover:border-white/30 text-slate-200":idx===q.a?"border-emerald-300/35 bg-emerald-500/10 text-emerald-100":idx===selected?"border-red-300/35 bg-red-950/45 text-red-100":"border-white/10 bg-slate-900/40 text-slate-500")}>
                  <div className="flex items-center gap-2"><div className={cn("w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black border",selected===null?"border-slate-600 text-slate-500":idx===q.a?"border-emerald-400 bg-emerald-500 text-white":"border-slate-700 text-slate-600")}>{String.fromCharCode(65+idx)}</div>{opt}</div>
                </motion.button>
              ))}
            </div>
            {selected!==null&&<div className={cn("rounded-2xl border p-4 mb-4",selected===q.a?"border-emerald-300/35 bg-emerald-500/10":"border-amber-300/35 bg-amber-500/10")}><div className={cn("text-xs font-black mb-1",selected===q.a?"text-emerald-300":"text-amber-300")}>{selected===q.a?correctTxt:expTxt}</div><p className={cn("text-sm font-bold leading-6",selected===q.a?"text-emerald-100":"text-amber-100")}>{q.exp}</p></div>}
            {selected!==null&&<button type="button" onClick={nextQ} className="w-full rounded-2xl bg-teal-700 px-6 py-3 text-sm font-black text-white hover:bg-teal-800 transition flex items-center justify-center gap-2">{qIndex<qs.length-1?nextTxt:resultsTxt}<ChevronRight className="h-4 w-4"/></button>}
          </>
        )}
      </Card>
    </section>
  );
}

/* ─── MAIN ─── */
export default function TradingModelTrainingSystem() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang } = useLang();
  const { setup: gexSetup, saveSetup: saveGex, isToday: gexIsToday } = useGEXDailySetup();
  const t = useCallback((zh, en) => lang === "zh" ? zh : en, [lang]);
  const stats = useMemo(()=>[
    { label:t("交易方向","Directions"), value:"4", icon:Layers, tone:"bg-teal-700" },
    { label:t("执行模型","EV Models"), value:"13", icon:Activity, tone:"bg-amber-600" },
    { label:t("入场清单","Checklist"), value:`${I.checklist.length}`, icon:ShieldAlert, tone:"bg-red-700" },
    { label:t("训练题","Quiz"), value:`${I.questions.length}`, icon:Brain, tone:"bg-violet-700" },
  ],[lang]);
  const gexBadge = gexIsToday ? (gexSetup.state==="positive" ? t("今日正GEX","Today: +GEX") : t("今日负GEX","Today: −GEX")) : null;
  return (
    <div data-theme={theme} className="min-h-screen premium-terminal-bg text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <motion.header initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="sea-header mb-6 overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.72))] shadow-[0_40px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
          <div className="section-accent-bar h-3 bg-gradient-to-r from-red-700 via-teal-600 to-violet-700"/>
          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge tone="red">{t("风控优先","Risk First")}</Badge>
                <Badge tone="violet">{t("GEX每日设置","GEX Daily Setup")}</Badge>
                <Badge tone="teal">QQQ</Badge>
                <Badge tone="amber">{t("黄金现货","Gold Spot")}</Badge>
                <Badge tone="blue">EUR/USD</Badge>
                {gexBadge && <Badge tone={gexSetup.state==="positive"?"blue":"amber"}>{gexBadge}</Badge>}
              </div>
              <ThemeLangControls theme={theme} onTheme={toggleTheme} lang={lang} onLang={toggleLang}/>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-50 md:text-6xl">Sea Trading OS</h1>
                <p className="mt-3 text-base font-semibold leading-8 text-slate-300">
                  {t("把交易决策压缩成四个动作：","Compress every decision into four actions: ")}
                  <KeyWord>{t("看什么","See")}</KeyWord> <KeyWord tone="blue">{t("等什么","Wait")}</KeyWord> <KeyWord tone="green">{t("做什么","Do")}</KeyWord> <KeyWord tone="red">{t("不做什么","Don't")}</KeyWord>
                  {t("。风控脊柱在所有模块之前。GEX决定今日节奏。",". Risk Spine before everything. GEX determines today's regime.")}
                </p>
              </div>
              <div className="rounded-[1.5rem] border-2 border-red-300/35 bg-red-950/45 p-4 shadow-lg">
                <div className="flex items-center gap-2 text-red-100 mb-2"><AlertTriangle className="h-5 w-5"/><span className="font-black">{t("总原则","Core Principle")}</span></div>
                <p className="text-sm font-bold leading-7 text-red-100">{t("信号不完整，不交易。GEX未填写，不交易。规则不清晰，不交易。情绪不稳定，不交易。","Incomplete signal → no trade. GEX not set → no trade. Unclear rules → no trade. Unstable emotions → no trade.")}</p>
              </div>
            </div>
          </div>
        </motion.header>
        <AccountRebuildingBanner lang={lang}/>
        <SeaOSPanel lang={lang}/>
        <div className="mb-8 grid gap-4 md:grid-cols-4 xl:gap-5">
          {stats.map((s)=>{const Icon=s.icon;return(
            <Card key={s.label} className="relative overflow-hidden rounded-[1.6rem] border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.86),rgba(15,23,42,0.62))] p-5">
              <div className="flex items-start justify-between"><div><div className="text-2xl font-black text-slate-50">{s.value}</div><div className="mt-1 text-sm font-black text-slate-400">{s.label}</div></div><div className={cn("rounded-2xl p-3 text-white",s.tone)}><Icon className="h-5 w-5"/></div></div>
              <div className={cn("absolute bottom-0 left-0 h-2 w-full",s.tone)}/>
            </Card>
          );})}
        </div>
        <RiskSpineSection lang={lang}/>
        <OptionsSystem gexSetup={gexSetup} onSaveGex={saveGex} gexIsToday={gexIsToday} lang={lang}/>
        <GoldSystem lang={lang}/>
        <ForexSystem lang={lang}/>
        <StockSystem lang={lang}/>
        <MacroAndModels lang={lang}/>
        <DisciplineSystem gexIsToday={gexIsToday} lang={lang}/>
      </div>
    </div>
  );
}
