import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Ban,
  Brain,
  CheckCircle2,
  Clock,
  Gauge,
  Layers,
  RefreshCcw,
  ShieldAlert,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ children, className = "" }) {
  return <div className={cn("border bg-white shadow-lg", className)}>{children}</div>;
}

function Button({ children, className = "", variant = "default", type = "button", ...props }) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-black transition focus:outline-none focus:ring-4";
  const variants = {
    default: "bg-teal-700 text-white hover:bg-teal-800 focus:ring-teal-200",
    ghost: "bg-white text-slate-700 hover:bg-slate-50 focus:ring-teal-100 border border-slate-300",
    danger: "bg-red-700 text-white hover:bg-red-800 focus:ring-red-200",
  };
  return (
    <button type={type} className={cn(base, variants[variant] || variants.default, className)} {...props}>
      {children}
    </button>
  );
}

function Badge({ children, tone = "teal" }) {
  const toneMap = {
    teal: "border-teal-600 bg-teal-50 text-teal-900",
    red: "border-red-600 bg-red-50 text-red-900",
    amber: "border-amber-600 bg-amber-50 text-amber-950",
    blue: "border-sky-600 bg-sky-50 text-sky-950",
    violet: "border-violet-600 bg-violet-50 text-violet-950",
    slate: "border-slate-500 bg-slate-50 text-slate-800",
    green: "border-emerald-600 bg-emerald-50 text-emerald-950",
  };
  return <span className={cn("rounded-full border px-3 py-1 text-xs font-black", toneMap[tone])}>{children}</span>;
}

function SectionHeader({ number, title, desc, tone = "teal" }) {
  const toneMap = {
    teal: "from-teal-700 to-cyan-600",
    blue: "from-sky-700 to-blue-600",
    red: "from-red-700 to-rose-600",
    amber: "from-amber-700 to-orange-600",
    violet: "from-violet-700 to-fuchsia-600",
    slate: "from-slate-800 to-slate-600",
  };
  return (
    <div className="mb-5 flex items-start gap-4">
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-black text-white shadow-lg", toneMap[tone])}>{number}</div>
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>
        <p className="mt-1 max-w-4xl text-sm font-bold leading-7 text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function KeyWord({ children, tone = "teal" }) {
  const toneMap = {
    teal: "bg-teal-700 text-white",
    red: "bg-red-700 text-white",
    amber: "bg-amber-600 text-white",
    blue: "bg-sky-700 text-white",
    violet: "bg-violet-700 text-white",
    slate: "bg-slate-800 text-white",
    green: "bg-emerald-700 text-white",
  };
  return <span className={cn("inline-flex rounded-lg px-2 py-0.5 text-xs font-black", toneMap[tone])}>{children}</span>;
}

function RuleCard({ label, text, tone = "teal", icon: Icon = CheckCircle2 }) {
  const toneMap = {
    teal: "border-teal-200 bg-teal-50 text-teal-950",
    red: "border-red-200 bg-red-50 text-red-950",
    amber: "border-amber-200 bg-amber-50 text-amber-950",
    blue: "border-sky-200 bg-sky-50 text-sky-950",
    violet: "border-violet-200 bg-violet-50 text-violet-950",
    slate: "border-slate-200 bg-slate-50 text-slate-900",
    green: "border-emerald-200 bg-emerald-50 text-emerald-950",
  };
  return (
    <div className={cn("rounded-2xl border p-3 shadow-sm", toneMap[tone])}>
      <div className="mb-1 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-black uppercase tracking-wider opacity-80">{label}</span>
      </div>
      <p className="text-sm font-black leading-6">{text}</p>
    </div>
  );
}

function FlowCard({ title, badge, tone = "teal", items = [] }) {
  return (
    <Card className="overflow-hidden rounded-[1.7rem] border-slate-300 shadow-xl shadow-slate-200/80">
      <div className={cn("h-2", tone === "teal" ? "bg-teal-700" : tone === "blue" ? "bg-sky-700" : tone === "amber" ? "bg-amber-600" : tone === "red" ? "bg-red-700" : tone === "violet" ? "bg-violet-700" : "bg-slate-700")} />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge tone={tone}>{badge}</Badge>
          <Target className="h-5 w-5 text-slate-500" />
        </div>
        <h3 className="text-lg font-black leading-7 text-slate-950">{title}</h3>
        <div className="mt-4 grid gap-2">
          {items.map((item) => <RuleCard key={item.label} {...item} />)}
        </div>
      </div>
    </Card>
  );
}

const matrix = [
  { name: "黄金 / EUR", role: "主战场", tone: "amber", core: "流动性 + 结构确认", do: "只做扫后收回、回踩确认", ban: "新闻盘 / 中间位 / 只扫不收" },
  { name: "期权买方", role: "当前重点", tone: "teal", core: "方向 + 时间 + 波动率", do: "只拿确认后的中间段", ban: "无量、价差大、IV过高、扛单" },
  { name: "正股", role: "低频配置", tone: "blue", core: "基本面锚 + 技术择时", do: "先筛公司，再找位置", ban: "纯K线冲动买入" },
  { name: "加密", role: "暂缓扩展", tone: "violet", core: "OI + Funding + 清算", do: "清算后等确认", ban: "高杠杆猜顶底" },
];

const goldModels = [
  {
    title: "POC集中区",
    badge: "黄金核心",
    tone: "amber",
    items: [
      { label: "看什么", text: "3-5个相邻POC形成的成本区", tone: "amber" },
      { label: "怎么用", text: "上方偏强，下方偏弱；只做方向过滤", tone: "teal" },
      { label: "不做什么", text: "不把单一POC当支撑/压力按钮", tone: "red", icon: Ban },
    ],
  },
  {
    title: "FVG + OB 共振",
    badge: "黄金入场",
    tone: "amber",
    items: [
      { label: "有效条件", text: "强推动留下，未被反复穿透", tone: "amber" },
      { label: "触发", text: "回补边界 + 拒绝K + 量能放大", tone: "teal" },
      { label: "放弃", text: "反复穿透、无结构、止损太大", tone: "red", icon: XCircle },
    ],
  },
  {
    title: "MA9 / MA21 动能过滤",
    badge: "短线过滤",
    tone: "amber",
    items: [
      { label: "强势", text: "价格 > MA9 > MA21", tone: "green" },
      { label: "弱势", text: "价格 < MA9 < MA21", tone: "red" },
      { label: "提醒", text: "均线只过滤动能，不直接开仓", tone: "slate" },
    ],
  },
];

const eurModels = [
  {
    title: "EMA趋势回踩",
    badge: "EUR / 外汇",
    tone: "blue",
    items: [
      { label: "环境", text: "EMA9/21/55顺序排列 + ADX > 25", tone: "blue" },
      { label: "入场", text: "破位后回踩EMA21/结构位，等拒绝确认", tone: "teal" },
      { label: "放弃", text: "ADX低、均线缠绕、数据前后", tone: "red", icon: Ban },
    ],
  },
  {
    title: "破位不追，回踩再做",
    badge: "执行规则",
    tone: "blue",
    items: [
      { label: "先等", text: "突破后不追第一根", tone: "slate" },
      { label: "再看", text: "回踩不破 + 重新放量", tone: "teal" },
      { label: "管理", text: "RR≥1:2；到1:2先保护本金", tone: "green" },
    ],
  },
];

const optionModels = [
  {
    title: "期权三维判断",
    badge: "买方核心",
    tone: "teal",
    items: [
      { label: "方向", text: "正股结构 + 大盘 + 板块 + 催化剂同向", tone: "teal" },
      { label: "时间", text: "日内快进快出；波段看14-45DTE", tone: "blue" },
      { label: "波动率", text: "波段优先IVR<40；IVR>60降仓或放弃", tone: "violet" },
    ],
  },
  {
    title: "VWAP确认协议",
    badge: "日内核心",
    tone: "teal",
    items: [
      { label: "定义", text: "VWAP是观察区，不是开仓点", tone: "slate" },
      { label: "Call", text: "回踩不破 / 快速收回 / 9EMA上拐", tone: "green" },
      { label: "Put", text: "反抽不过 / 上影失败 / 跌回下方", tone: "red" },
    ],
  },
  {
    title: "合约过滤",
    badge: "先筛再做",
    tone: "teal",
    items: [
      { label: "Delta", text: "日内0.45-0.55；波段0.40-0.50；激进0.35-0.45", tone: "teal" },
      { label: "价差", text: "0.01-0.08较好；0.20+默认放弃", tone: "amber" },
      { label: "止损", text: "-20%警戒；-25%硬止损；不等-30%", tone: "red", icon: ShieldAlert },
    ],
  },
  {
    title: "时间窗口",
    badge: "日内过滤",
    tone: "blue",
    items: [
      { label: "优先", text: "09:45-11:30 / 13:30-15:00 ET", tone: "green" },
      { label: "避开", text: "09:30-09:45、午盘、尾盘15分钟", tone: "red", icon: Ban },
      { label: "数据", text: "FOMC/CPI/非农后30分钟不急进", tone: "amber" },
    ],
  },
  {
    title: "大盘/板块协同",
    badge: "方向确认",
    tone: "violet",
    items: [
      { label: "NVDA", text: "看QQQ + XLK，同向才升级", tone: "violet" },
      { label: "TSLA", text: "看QQQ + XLY，冲突就降级", tone: "blue" },
      { label: "原则", text: "个股强但大盘/板块冲突，放弃或小仓", tone: "red", icon: AlertTriangle },
    ],
  },
];

const stockModels = [
  {
    title: "正股低频配置",
    badge: "非日内",
    tone: "blue",
    items: [
      { label: "先筛", text: "营收/利润增长、行业景气、无重大负面", tone: "blue" },
      { label: "再等", text: "周线不坏，日线回调支撑，60分钟确认", tone: "teal" },
      { label: "不做", text: "只因K线好看就买；PE不能机械套用", tone: "red", icon: Ban },
    ],
  },
];

const macroCards = [
  { state: "强Risk ON", cond: "VIX<18 且当日下行", action: "Call环境更友好；可正常筛选机会", tone: "green" },
  { state: "低位转弱", cond: "VIX<18 但当日上行", action: "缩小仓位；警惕低位转向", tone: "amber" },
  { state: "过渡期", cond: "VIX 18-25", action: "降仓，等方向，不扩大交易", tone: "amber" },
  { state: "Risk OFF", cond: "VIX>25 且继续上行", action: "Put/观望优先；谨慎做多", tone: "red" },
];

const highWinModels = [
  {
    title: "扫流动性收回",
    badge: "黄金/EUR",
    tone: "amber",
    items: [
      { label: "场景", text: "扫前高/前低后重新收回", tone: "amber" },
      { label: "触发", text: "长影线 + CHoCH/反向K确认", tone: "teal" },
      { label: "放弃", text: "只扫不收、新闻刚出、区间中间", tone: "red" },
    ],
  },
  {
    title: "POC/FVG共振",
    badge: "黄金",
    tone: "amber",
    items: [
      { label: "场景", text: "成本区 + OB/FVG + 流动性位重叠", tone: "amber" },
      { label: "触发", text: "回踩拒绝 + 量能启动", tone: "teal" },
      { label: "放弃", text: "共振区被直接穿透", tone: "red" },
    ],
  },
  {
    title: "EMA趋势回踩",
    badge: "EUR",
    tone: "blue",
    items: [
      { label: "场景", text: "EMA顺排 + ADX确认趋势", tone: "blue" },
      { label: "触发", text: "回踩EMA21/结构位不破", tone: "teal" },
      { label: "放弃", text: "均线缠绕、ADX弱", tone: "red" },
    ],
  },
  {
    title: "VWAP确认期权",
    badge: "期权",
    tone: "teal",
    items: [
      { label: "场景", text: "催化剂 + 大盘共振 + 合约流动性好", tone: "teal" },
      { label: "触发", text: "VWAP收回/失败 + 量能确认", tone: "green" },
      { label: "放弃", text: "反复穿VWAP、无量横盘、价差大", tone: "red" },
    ],
  },
];

const checklist = [
  "交易系统已选定，规则没有混用。",
  "位置不在中间位，也不是机械到线开仓。",
  "方向完整：大盘、板块、品种结构不冲突。",
  "期权已检查：DTE、Delta、价差、成交量、IV风险。",
  "期权处于高概率时间窗口，避开开盘乱流/午盘/尾盘。",
  "VWAP只作观察区，已出现失败/收回确认。",
  "量能和空间足够，不是低胜率磨损区。",
  "黄金/EUR已确认Kill Zone、结构、流动性、趋势强度。",
  "风险已写清：-25%硬止损、+50%保护、最大亏损。",
  "VIX方向支持或已降仓处理。",
  "没有触发连续亏损熔断：2笔连亏/日损5%/3日连亏。",
  "情绪正常：不是回本、证明自己、连续亏损后追单。",
];

const questions = [
  { q: "价格到VWAP就买Put，对吗？", options: ["对，VWAP就是压力", "不对，VWAP是观察区", "只要跌过就买", "加仓更稳"], a: 1, exp: "VWAP不是开仓点。必须等反抽失败或收回确认。" },
  { q: "黄金来到单一POC，可以直接开仓吗？", options: ["可以", "不可以，等POC集中区+结构确认", "满仓", "只看均线"], a: 1, exp: "单一POC不是按钮。要看集中区、共振和确认。" },
  { q: "EUR均线缠绕、ADX低，还能做趋势回踩吗？", options: ["能", "不能，趋势强度不足", "只看MACD", "追突破"], a: 1, exp: "趋势系统必须先有趋势环境。" },
  { q: "IVR > 60 时，买方期权最怕什么？", options: ["买太便宜", "IV Crush和买贵", "成交太多", "Delta太高"], a: 1, exp: "IV高位时，方向对也可能被波动率回落杀掉利润。" },
  { q: "正股是否只靠K线入场？", options: ["是", "不是，先有基本面锚定", "只看PE", "只看消息"], a: 1, exp: "正股是低频配置系统，基本面锚定优先。" },
  { q: "日内期权亏损到-25%，正确动作是什么？", options: ["再等到-30%", "硬止损离场", "加仓摊平", "换合约继续赌"], a: 1, exp: "-20%是警戒，-25%是硬止损，不给情绪留空间。" },
  { q: "NVDA想买Call，但QQQ和XLK都弱，怎么办？", options: ["正常买", "方向冲突，降级或放弃", "买更虚值", "无视大盘"], a: 1, exp: "日内个股期权需要大盘/板块协同，冲突时胜率下降。" },
  { q: "黄金亚洲盘中间位出现信号，可以主动追吗？", options: ["可以", "不追，优先等伦敦/纽约Kill Zone", "满仓试", "只看FVG"], a: 1, exp: "黄金/EUR要加入时间过滤，亚洲盘中间位假信号多。" },
];

function OptionPriceCalculator() {
  const [mode, setMode] = useState("call");
  const [currentStock, setCurrentStock] = useState("520");
  const [targetStock, setTargetStock] = useState("522");
  const [optionPrice, setOptionPrice] = useState("1.80");
  const [delta, setDelta] = useState("0.55");
  const [contracts, setContracts] = useState("1");

  const current = Number(currentStock);
  const target = Number(targetStock);
  const option = Number(optionPrice);
  const deltaAbs = Math.abs(Number(delta));
  const contractCount = Math.max(1, Number(contracts) || 1);
  const isValid = [current, target, option, deltaAbs].every((n) => Number.isFinite(n));
  const stockMove = isValid ? (mode === "call" ? target - current : current - target) : 0;
  const projectedOption = Math.max(0, option + stockMove * deltaAbs);
  const pnl = (projectedOption - option) * 100 * contractCount;
  const pnlPct = option > 0 ? ((projectedOption - option) / option) * 100 : 0;
  const inputClass = "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-black text-slate-950 shadow-inner outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100";

  return (
    <Card className="overflow-hidden rounded-[2rem] border-2 border-teal-700 shadow-xl shadow-teal-100">
      <div className="bg-gradient-to-r from-teal-800 via-cyan-700 to-sky-700 px-5 py-4 text-white">
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-85">Quick Calculator</div>
        <h3 className="mt-1 text-xl font-black">正股目标 → 期权估算</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-teal-50">用Delta快速估算，适合止盈/止损参考。</p>
      </div>
      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">类型</span><select className={inputClass} value={mode} onChange={(e) => setMode(e.target.value)}><option value="call">Call</option><option value="put">Put</option></select></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">当前正股</span><input className={inputClass} value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} inputMode="decimal" /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">目标正股</span><input className={inputClass} value={targetStock} onChange={(e) => setTargetStock(e.target.value)} inputMode="decimal" /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">当前期权</span><input className={inputClass} value={optionPrice} onChange={(e) => setOptionPrice(e.target.value)} inputMode="decimal" /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Delta</span><input className={inputClass} value={delta} onChange={(e) => setDelta(e.target.value)} inputMode="decimal" /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">张数</span><input className={inputClass} value={contracts} onChange={(e) => setContracts(e.target.value)} inputMode="numeric" /></label>
        </div>
        <div className="grid gap-3">
          <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4"><div className="text-xs font-black text-slate-500">估算期权价</div><div className="mt-1 text-3xl font-black text-teal-800">{isValid ? projectedOption.toFixed(2) : "--"}</div></div>
          <div className={cn("rounded-2xl border p-4", pnl >= 0 ? "border-teal-300 bg-teal-50" : "border-red-300 bg-red-50")}><div className="text-xs font-black text-slate-500">估算盈亏</div><div className={cn("mt-1 text-2xl font-black", pnl >= 0 ? "text-teal-800" : "text-red-800")}>{isValid ? `${pnl >= 0 ? "+" : ""}${pnl.toFixed(0)} 美元` : "--"}</div><div className="text-sm font-bold text-slate-600">{isValid ? `${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(1)}%` : "--"}</div></div>
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">不包含IV、Theta、Gamma和价差。0DTE误差更大。</div>
        </div>
      </div>
    </Card>
  );
}

function TradingMatrix() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="01" title="多品种交易矩阵" desc="先定主次，再谈信号。每个品种只保留最关键的核心、动作和禁区。" tone="teal" />
      <div className="grid gap-4 lg:grid-cols-4">
        {matrix.map((item) => (
          <Card key={item.name} className="rounded-[1.7rem] border-slate-300 p-5 shadow-xl shadow-slate-200/70">
            <div className="mb-3 flex items-center justify-between"><Badge tone={item.tone}>{item.role}</Badge><Layers className="h-5 w-5 text-slate-500" /></div>
            <h3 className="text-xl font-black text-slate-950">{item.name}</h3>
            <div className="mt-4 grid gap-2">
              <RuleCard label="核心" text={item.core} tone={item.tone} />
              <RuleCard label="只做" text={item.do} tone="teal" />
              <RuleCard label="禁区" text={item.ban} tone="red" icon={Ban} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function GoldEurSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="02" title="黄金 / EUR 执行系统" desc="不堆概念，只保留实盘要看的结构、触发和放弃条件。" tone="amber" />
      <div className="mb-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border-2 border-amber-300 bg-amber-50 p-4 shadow-md"><KeyWord tone="amber">Level 1</KeyWord><h3 className="mt-2 font-black text-slate-950">日线 / 周线</h3><p className="mt-1 text-sm font-bold text-slate-700">只定方向：趋势、关键OB、主结构。</p></div>
        <div className="rounded-[1.5rem] border-2 border-teal-300 bg-teal-50 p-4 shadow-md"><KeyWord tone="teal">Level 2</KeyWord><h3 className="mt-2 font-black text-slate-950">4H / 1H</h3><p className="mt-1 text-sm font-bold text-slate-700">找位置：BSL/SSL、FVG、POC集中区。</p></div>
        <div className="rounded-[1.5rem] border-2 border-sky-300 bg-sky-50 p-4 shadow-md"><KeyWord tone="blue">Level 3</KeyWord><h3 className="mt-2 font-black text-slate-950">15M / 5M</h3><p className="mt-1 text-sm font-bold text-slate-700">等确认：收回、拒绝、CHoCH/BOS。</p></div>
      </div>
      <div className="mb-5 rounded-[1.6rem] border-2 border-red-300 bg-red-50 p-4 shadow-md">
        <div className="mb-3 flex flex-wrap items-center gap-2"><KeyWord tone="red">Kill Zone</KeyWord><span className="text-sm font-black text-red-950">时间过滤优先于普通信号</span></div>
        <div className="grid gap-3 md:grid-cols-3">
          <RuleCard label="伦敦" text="15:00-17:00 北京：扫亚洲盘高低点" tone="amber" />
          <RuleCard label="纽约" text="21:30-23:30 北京：扫伦敦高低点后定方向" tone="blue" />
          <RuleCard label="禁区" text="亚洲盘中间位默认不追，数据前后不做" tone="red" icon={Ban} />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">{goldModels.map((m) => <FlowCard key={m.title} {...m} />)}</div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">{eurModels.map((m) => <FlowCard key={m.title} {...m} />)}</div>
    </section>
  );
}

function OptionSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="03" title="期权买方系统" desc="先区分日内/波段，再判断方向、时间、波动率。" tone="blue" />
      <div className="grid gap-4 lg:grid-cols-3 2xl:grid-cols-5">{optionModels.map((m) => <FlowCard key={m.title} {...m} />)}</div>
      <div className="mt-5 rounded-[1.6rem] border-2 border-teal-300 bg-teal-50 p-4 shadow-md">
        <div className="grid gap-3 md:grid-cols-4">
          <RuleCard label="警戒" text="-20%：检查正股结构是否失效" tone="amber" icon={AlertTriangle} />
          <RuleCard label="硬止损" text="-25%：必须离场" tone="red" icon={ShieldAlert} />
          <RuleCard label="保护" text="+50%：至少平一半" tone="green" />
          <RuleCard label="不贪" text="+80%-100%：优先全平" tone="teal" />
        </div>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[1.8rem] border-red-300 bg-red-50 p-5 shadow-xl shadow-red-100">
          <h3 className="text-xl font-black text-red-950">期权买方四大杀手</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <RuleCard label="Theta" text="入场太早，被时间磨死" tone="red" icon={AlertTriangle} />
            <RuleCard label="IV" text="IV过高，方向对也不赚钱" tone="red" icon={AlertTriangle} />
            <RuleCard label="VWAP" text="把观察区误当开仓点" tone="red" icon={AlertTriangle} />
            <RuleCard label="止损" text="小亏不走，变成大亏" tone="red" icon={AlertTriangle} />
          </div>
        </Card>
        <OptionPriceCalculator />
      </div>
    </section>
  );
}

function ExpansionSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="04" title="正股配置系统" desc="正股不是日内冲动交易。先有基本面锚，再用技术择时。" tone="violet" />
      <div className="grid gap-4 lg:grid-cols-2">
        {stockModels.map((m) => <FlowCard key={m.title} {...m} />)}
        <Card className="rounded-[1.7rem] border-violet-300 bg-violet-50 p-5 shadow-xl shadow-violet-100">
          <Badge tone="violet">加密暂缓</Badge>
          <h3 className="mt-3 text-lg font-black text-slate-950">加密合约 / 期权</h3>
          <div className="mt-4 grid gap-2">
            <RuleCard label="看" text="OI、Funding、清算尖峰" tone="violet" />
            <RuleCard label="等" text="清算后15-45分钟，5M/15M确认" tone="teal" />
            <RuleCard label="禁" text="1M噪音追反转；高杠杆猜顶底" tone="red" icon={Ban} />
          </div>
        </Card>
      </div>
    </section>
  );
}

function MacroAndModels() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="05" title="宏观过滤 + 高胜率模型库" desc="先判断环境，再选择模型。没有触发，就不是机会。" tone="slate" />
      <div className="mb-5 grid gap-3 lg:grid-cols-4">
        {macroCards.map((m) => <RuleCard key={m.state} label={`${m.state}｜${m.cond}`} text={m.action} tone={m.tone} icon={Gauge} />)}
      </div>
      <div className="rounded-[1.8rem] border-2 border-teal-700 bg-white p-4 shadow-xl shadow-teal-100/70">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">高胜率模型库</h3>
            <p className="mt-1 text-sm font-bold text-slate-600">每张卡只回答：场景、触发、放弃。</p>
          </div>
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-black text-red-900">没有触发 = 不交易</div>
        </div>
        <div className="grid gap-4 xl:grid-cols-4">{highWinModels.map((m) => <FlowCard key={m.title} {...m} />)}</div>
      </div>
    </section>
  );
}

function TrafficLightChecklist() {
  const [checked, setChecked] = useState([]);
  const all = checked.length === checklist.length;
  const toggle = (i) => setChecked((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  return (
    <Card className={cn("rounded-[2rem] border-2 p-5 shadow-xl", all ? "border-teal-700 bg-teal-50" : "border-red-300 bg-red-50")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h3 className="text-xl font-black text-slate-950">开单前红绿灯</h3><p className="mt-1 text-sm font-bold text-slate-600">全部点亮才允许进入下一步。</p></div>
        <div className={cn("rounded-2xl px-4 py-3 text-lg font-black", all ? "bg-teal-700 text-white" : "bg-red-700 text-white")}>{checked.length} / {checklist.length}</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{checklist.map((_, i) => <span key={i} className={cn("h-4 w-4 rounded-full border-2", checked.includes(i) ? "border-teal-700 bg-teal-600" : "border-red-600 bg-red-500")} />)}</div>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">{checklist.map((item, i) => {
        const ok = checked.includes(i);
        return <button key={item} onClick={() => toggle(i)} className={cn("flex gap-3 rounded-2xl border-2 p-4 text-left text-sm font-black leading-6 transition", ok ? "border-teal-700 bg-white text-teal-950 shadow-lg shadow-teal-100" : "border-red-300 bg-white text-slate-800 shadow-sm hover:border-red-500")}><span className={cn("mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white", ok ? "bg-teal-700" : "bg-red-600")}>{ok ? "绿" : "红"}</span><span>{item}</span></button>;
      })}</div>
      <div className={cn("mt-5 rounded-2xl border p-4 text-center text-lg font-black", all ? "border-teal-700 bg-white text-teal-900" : "border-red-300 bg-white text-red-900")}>{all ? "绿灯全亮：可以进入执行，但仍然小仓试错。" : "红灯未清：禁止开单。"}</div>
    </Card>
  );
}

function TrainingQuiz() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const q = questions[idx];
  function next() { setAnswer(null); setIdx((idx + 1) % questions.length); }
  return (
    <Card className="rounded-[2rem] border-slate-300 p-5 shadow-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h3 className="text-xl font-black text-slate-950">强化答题</h3><p className="mt-1 text-sm font-bold text-slate-600">训练“能不能做”，不是预测涨跌。</p></div><Button onClick={next} variant="ghost"><RefreshCcw className="mr-2 h-4 w-4" />换一题</Button></div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"><h4 className="text-lg font-black leading-8 text-slate-950">{q.q}</h4><div className="mt-4 grid gap-3 md:grid-cols-2">{q.options.map((op, i) => {
        const chosen = answer === i; const correct = answer !== null && i === q.a; const wrong = chosen && i !== q.a;
        return <button key={op} onClick={() => setAnswer(i)} className={cn("rounded-2xl border-2 p-4 text-left text-sm font-black transition", correct ? "border-teal-700 bg-teal-50 text-teal-900" : wrong ? "border-red-700 bg-red-50 text-red-900" : "border-slate-300 bg-white text-slate-700 hover:border-teal-500")}>{op}</button>;
      })}</div>{answer !== null && <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-black leading-7 text-amber-950">{answer === q.a ? "判断正确：" : "判断错误："}{q.exp}</motion.div>}</div>
    </Card>
  );
}

function DisciplineSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="06" title="执行纪律与训练闸门" desc="系统不是让你做更多，而是让你少错。" tone="red" />
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]"><TrafficLightChecklist /><TrainingQuiz /></div>
      <Card className="mt-5 rounded-[1.8rem] border-red-300 bg-red-50 p-5 shadow-lg shadow-red-100">
        <h3 className="text-xl font-black text-red-950">账户生存法则</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <RuleCard label="次数" text="每日最多3笔" tone="red" />
          <RuleCard label="连亏" text="当日连续亏损2笔，暂停1小时" tone="red" />
          <RuleCard label="日损" text="当日亏损>账户5%，停止交易" tone="red" />
          <RuleCard label="周期" text="连续3日亏损，回模拟盘1周" tone="red" />
        </div>
      </Card>
    </section>
  );
}

export default function TradingModelTrainingSystem() {
  const stats = useMemo(() => [
    { label: "交易矩阵", value: "4类", icon: Layers, tone: "bg-teal-700" },
    { label: "执行模型", value: "9组", icon: Activity, tone: "bg-sky-700" },
    { label: "红绿灯", value: `${checklist.length}项`, icon: ShieldAlert, tone: "bg-red-700" },
    { label: "训练题", value: `${questions.length}题`, icon: Brain, tone: "bg-violet-700" },
  ], []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7f4_0,#f4fbff_32%,#f8fafc_70%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 overflow-hidden rounded-[2.4rem] border border-slate-300 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)]">
          <div className="h-3 bg-gradient-to-r from-teal-700 via-sky-600 to-violet-700" />
          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap gap-2"><Badge tone="teal">交易模型训练系统 v2.4</Badge><Badge tone="red">执行精确版</Badge><Badge tone="blue">关键词标注</Badge></div>
            <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">多品种交易执行训练系统</h1>
                <p className="mt-4 max-w-4xl text-base font-semibold leading-8 text-slate-700">
                  把复杂内容压缩成四个动作：<KeyWord>看什么</KeyWord> <KeyWord tone="blue">等什么</KeyWord> <KeyWord tone="green">做什么</KeyWord> <KeyWord tone="red">不做什么</KeyWord>。
                </p>
              </div>
              <div className="rounded-[1.5rem] border-2 border-red-300 bg-red-50 p-4 shadow-lg">
                <div className="flex items-center gap-2 text-red-900"><AlertTriangle className="h-5 w-5" /><span className="font-black">总原则</span></div>
                <p className="mt-2 text-sm font-bold leading-7 text-red-900">信号不完整，不交易。规则不清晰，不交易。情绪不稳定，不交易。</p>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="mb-8 grid gap-4 md:grid-cols-4">{stats.map((s) => { const Icon = s.icon; return <Card key={s.label} className="relative overflow-hidden rounded-[1.6rem] border-slate-300 p-5 shadow-xl"><div className="flex items-start justify-between"><div><div className="text-2xl font-black text-slate-950">{s.value}</div><div className="mt-1 text-sm font-black text-slate-600">{s.label}</div></div><div className={cn("rounded-2xl p-3 text-white", s.tone)}><Icon className="h-5 w-5" /></div></div><div className={cn("absolute bottom-0 left-0 h-2 w-full", s.tone)} /></Card>; })}</div>

        <TradingMatrix />
        <GoldEurSystem />
        <OptionSystem />
        <ExpansionSystem />
        <MacroAndModels />
        <DisciplineSystem />
      </div>
    </div>
  );
}
