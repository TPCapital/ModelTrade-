import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Ban,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Gauge,
  Layers,
  LineChart,
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
  return <div className={cn("border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_22px_55px_rgba(15,23,42,0.10)]", className)}>{children}</div>;
}

function Button({ children, className = "", variant = "default", type = "button", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-black transition focus:outline-none focus:ring-4";
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
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-black text-white shadow-lg",
          toneMap[tone]
        )}
      >
        {number}
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>
        <p className="mt-1 max-w-4xl text-sm font-bold leading-7 text-slate-600">{desc}</p>
      </div>
    </div>
  );
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
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
    <Card className="overflow-hidden rounded-[1.7rem] border-slate-300 shadow-[0_20px_55px_rgba(15,23,42,0.10)] transition hover:shadow-[0_28px_70px_rgba(15,23,42,0.13)]">
      <div
        className={cn(
          "h-2",
          tone === "teal"
            ? "bg-teal-700"
            : tone === "blue"
              ? "bg-sky-700"
              : tone === "amber"
                ? "bg-amber-600"
                : tone === "red"
                  ? "bg-red-700"
                  : tone === "violet"
                    ? "bg-violet-700"
                    : tone === "green"
                      ? "bg-emerald-700"
                      : "bg-slate-700"
        )}
      />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge tone={tone}>{badge}</Badge>
          <Target className="h-5 w-5 text-slate-500" />
        </div>
        <h3 className="text-lg font-black leading-7 text-slate-950">{title}</h3>
        <div className="mt-4 grid gap-2">
          {items.map((item) => (
            <RuleCard key={item.label} {...item} />
          ))}
        </div>
      </div>
    </Card>
    </motion.div>
  );
}

function VisualMeter({ label, left, right, fill = 50, tone = "teal", note }) {
  const [hovered, setHovered] = useState(false);
  const theme = {
    teal: { base: "bg-teal-500", soft: "bg-teal-400/30", dot: "border-teal-200 bg-teal-500 shadow-[0_0_18px_rgba(13,148,136,0.65)]", glow: "shadow-[0_0_18px_rgba(13,148,136,0.55)]" },
    red: { base: "bg-red-500", soft: "bg-red-400/25", dot: "border-red-200 bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.65)]", glow: "shadow-[0_0_18px_rgba(239,68,68,0.55)]" },
    amber: { base: "bg-amber-500", soft: "bg-amber-300/30", dot: "border-amber-100 bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.65)]", glow: "shadow-[0_0_18px_rgba(245,158,11,0.55)]" },
    blue: { base: "bg-sky-500", soft: "bg-sky-300/30", dot: "border-sky-100 bg-sky-500 shadow-[0_0_18px_rgba(14,165,233,0.65)]", glow: "shadow-[0_0_18px_rgba(14,165,233,0.55)]" },
    violet: { base: "bg-violet-500", soft: "bg-violet-300/30", dot: "border-violet-100 bg-violet-500 shadow-[0_0_18px_rgba(139,92,246,0.65)]", glow: "shadow-[0_0_18px_rgba(139,92,246,0.55)]" },
    green: { base: "bg-emerald-500", soft: "bg-emerald-300/30", dot: "border-emerald-100 bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.65)]", glow: "shadow-[0_0_18px_rgba(16,185,129,0.55)]" },
  }[tone];
  return (
    <div
      className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3 transition duration-300 hover:border-slate-300 hover:bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between text-xs font-black text-slate-500">
        <span>{label}</span>
        <span>{note}</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200/90 ring-1 ring-slate-200">
        <div className={cn("absolute hidden", theme.base)} />
        <div className={cn("h-full rounded-full", theme.soft)} style={{ width: `${fill}%` }} />
        <motion.div
          className={cn("-mt-3 h-3 rounded-full", theme.base, theme.glow)}
          initial={false}
          animate={{ width: hovered ? `${fill}%` : "0%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="relative mt-1 h-4">
        <motion.div
          className={cn("absolute top-0.5 h-3 w-3 rounded-full border-2", theme.dot)}
          initial={false}
          animate={{ left: hovered ? `calc(${fill}% - 6px)` : "-12px", opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs font-bold text-slate-500">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}

function ProcessRail({ steps, tone = "teal" }) {
  const dotTone = {
    teal: "bg-teal-700",
    blue: "bg-sky-700",
    amber: "bg-amber-600",
    violet: "bg-violet-700",
    red: "bg-red-700",
  }[tone];
  return (
    <div className="grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))] xl:grid-cols-[repeat(4,minmax(0,1fr))]">
      {steps.map((step, i) => (
        <div key={step.title} className="relative rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white", dotTone)}>
              {i + 1}
            </div>
            <div className="text-sm font-black text-slate-950">{step.title}</div>
          </div>
          <div className="text-sm font-bold leading-6 text-slate-600">{step.text}</div>
          {i !== steps.length - 1 && (
            <ArrowRight className="absolute -right-2 top-8 hidden h-4 w-4 text-slate-400 xl:block" />
          )}
        </div>
      ))}
    </div>
  );
}

function HeatWindow({ title, rows }) {
  const [active, setActive] = useState(null);
  return (
    <Card className="rounded-[1.7rem] border-slate-300 bg-white/95 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.10)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-slate-950">{title}</h3>
        <Clock className="h-5 w-5 text-slate-500" />
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((row, idx) => (
          <div key={row.label} onMouseEnter={() => setActive(idx)} onMouseLeave={() => setActive(null)} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 transition hover:border-slate-300 hover:bg-white">
            <div className="mb-2 flex items-center justify-between text-xs font-black text-slate-500">
              <span>{row.label}</span>
              <span>{row.status}</span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
              <div className={cn("h-full rounded-full opacity-20", row.className)} style={{ width: `${row.fill}%` }} />
              <motion.div
                className={cn("-mt-4 h-4 rounded-full", row.className, "shadow-[0_0_18px_rgba(15,23,42,0.20)]")}
                initial={false}
                animate={{ width: active === idx ? `${row.fill}%` : "0%" }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-2 text-xs font-bold text-slate-600">{row.note}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function VisualDecision({ title, tone = "teal", items }) {
  const headClass = {
    teal: "bg-teal-700 text-white",
    amber: "bg-amber-600 text-white",
    blue: "bg-sky-700 text-white",
    violet: "bg-violet-700 text-white",
    red: "bg-red-700 text-white",
  }[tone];
  return (
    <Card className="overflow-hidden rounded-[1.7rem] border-slate-300 shadow-[0_20px_55px_rgba(15,23,42,0.10)]">
      <div className={cn("px-5 py-4", headClass)}>
        <h3 className="text-lg font-black">{title}</h3>
      </div>
      <div className="grid gap-3 p-5 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500">{it.label}</div>
            <div className="mt-2 text-sm font-black leading-6 text-slate-900">{it.text}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const matrix = [
  { name: "黄金 / EUR", role: "主战场", tone: "amber", core: "流动性 + 结构确认", do: "扫后收回、回踩确认", ban: "新闻盘 / 中间位" },
  { name: "期权买方", role: "当前重点", tone: "teal", core: "方向 + 时间 + 波动率", do: "确认后的中间段", ban: "无量 / 高IV / 扛单" },
  { name: "正股", role: "低频配置", tone: "blue", core: "基本面锚 + 技术择时", do: "先筛公司，再找位置", ban: "纯K线冲动" },
  { name: "加密", role: "暂缓扩展", tone: "violet", core: "OI + Funding + 清算", do: "清算后等确认", ban: "高杠杆猜顶底" },
];

const goldModels = [
  {
    title: "POC集中区",
    badge: "黄金核心",
    tone: "amber",
    items: [
      { label: "看", text: "3-5个相邻POC成本区", tone: "amber" },
      { label: "用", text: "上方偏强，下方偏弱", tone: "teal" },
      { label: "禁", text: "单一POC直接开仓", tone: "red", icon: Ban },
    ],
  },
  {
    title: "FVG + OB 共振",
    badge: "黄金入场",
    tone: "amber",
    items: [
      { label: "有效", text: "强推动留下，未反复穿透", tone: "amber" },
      { label: "触发", text: "回补边界 + 拒绝K + 放量", tone: "teal" },
      { label: "放弃", text: "结构破坏、止损太大", tone: "red", icon: XCircle },
    ],
  },
  {
    title: "MA9 / MA21 动能",
    badge: "短线过滤",
    tone: "amber",
    items: [
      { label: "强", text: "价格 > MA9 > MA21", tone: "green" },
      { label: "弱", text: "价格 < MA9 < MA21", tone: "red" },
      { label: "提醒", text: "均线只过滤，不开仓", tone: "slate" },
    ],
  },
];

const eurModels = [
  {
    title: "EMA趋势回踩",
    badge: "EUR / 外汇",
    tone: "blue",
    items: [
      { label: "环境", text: "EMA9/21/55顺排 + ADX > 25", tone: "blue" },
      { label: "入场", text: "回踩EMA21/结构位，等拒绝确认", tone: "teal" },
      { label: "放弃", text: "ADX低、均线缠绕、数据前后", tone: "red", icon: Ban },
    ],
  },
  {
    title: "破位不追",
    badge: "执行规则",
    tone: "blue",
    items: [
      { label: "先等", text: "突破后不追第一根", tone: "slate" },
      { label: "再看", text: "回踩不破 + 重新放量", tone: "teal" },
      { label: "管理", text: "RR≥1:2；到1:2先保本", tone: "green" },
    ],
  },
];

const optionModels = [
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
      { label: "Delta", text: "日内0.45-0.55；波段0.40-0.50", tone: "teal" },
      { label: "价差", text: "0.01-0.08较好；0.20+放弃", tone: "amber" },
      { label: "止损", text: "-20%警戒；-25%硬止损", tone: "red", icon: ShieldAlert },
    ],
  },
  {
    title: "板块协同",
    badge: "方向确认",
    tone: "violet",
    items: [
      { label: "NVDA", text: "看QQQ + XLK，同向才升级", tone: "violet" },
      { label: "TSLA", text: "看QQQ + XLY，冲突就降级", tone: "blue" },
      { label: "原则", text: "大盘/板块冲突，放弃或小仓", tone: "red", icon: AlertTriangle },
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
  { state: "强Risk ON", cond: "VIX<18 且下行", action: "Call环境更友好", tone: "green", icon: TrendingUp, short: "偏进攻", bias: { attack: 88, wait: 20, defend: 8 } },
  { state: "低位转弱", cond: "VIX<18 但上行", action: "缩仓，防转向", tone: "amber", icon: AlertTriangle, short: "先收缩", bias: { attack: 40, wait: 72, defend: 28 } },
  { state: "过渡期", cond: "VIX 18-25", action: "降仓，等方向", tone: "amber", icon: Activity, short: "不扩张", bias: { attack: 28, wait: 80, defend: 35 } },
  { state: "Risk OFF", cond: "VIX>25 且上行", action: "Put/观望优先", tone: "red", icon: ShieldAlert, short: "偏防守", bias: { attack: 12, wait: 36, defend: 90 } },
];

const highWinModels = [
  { title: "扫流动性收回", badge: "黄金/EUR", tone: "amber", items: [{ label: "场景", text: "扫前高/前低后重新收回", tone: "amber" }, { label: "触发", text: "长影线 + CHoCH确认", tone: "teal" }, { label: "放弃", text: "只扫不收、新闻刚出", tone: "red" }] },
  { title: "POC/FVG共振", badge: "黄金", tone: "amber", items: [{ label: "场景", text: "成本区 + OB/FVG + 流动性位", tone: "amber" }, { label: "触发", text: "回踩拒绝 + 量能启动", tone: "teal" }, { label: "放弃", text: "共振区被直接穿透", tone: "red" }] },
  { title: "EMA趋势回踩", badge: "EUR", tone: "blue", items: [{ label: "场景", text: "EMA顺排 + ADX确认趋势", tone: "blue" }, { label: "触发", text: "回踩EMA21/结构位不破", tone: "teal" }, { label: "放弃", text: "均线缠绕、ADX弱", tone: "red" }] },
  { title: "VWAP确认期权", badge: "期权", tone: "teal", items: [{ label: "场景", text: "催化剂 + 大盘共振 + 合约流动性好", tone: "teal" }, { label: "触发", text: "VWAP收回/失败 + 量能确认", tone: "green" }, { label: "放弃", text: "反复穿VWAP、无量横盘、价差大", tone: "red" }] },
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
  const inputClass =
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-black text-slate-950 shadow-inner outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100";

  return (
    <Card className="overflow-hidden rounded-[2rem] border-2 border-teal-700 shadow-xl shadow-teal-100">
      <div className="bg-gradient-to-r from-teal-800 via-cyan-700 to-sky-700 px-5 py-4 text-white">
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-85">Quick Calculator</div>
        <h3 className="mt-1 text-xl font-black">正股目标 → 期权估算</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-teal-50">用 Delta 快速估算，适合止盈/止损参考。</p>
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
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">不包含 IV、Theta、Gamma 和价差。0DTE 误差更大。</div>
        </div>
      </div>
    </Card>
  );
}

function TradingMatrix() {
  const iconMap = { "黄金 / EUR": BarChart3, "期权买方": Gauge, 正股: LineChart, 加密: Activity };
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="01" title="多品种交易矩阵" desc="用一屏先看清主次关系：做什么、为什么做、什么情况不做。" tone="teal" />
      <div className="grid gap-4 lg:grid-cols-4">
        {matrix.map((item) => {
          const Icon = iconMap[item.name];
          return (
            <Card key={item.name} className="rounded-[1.7rem] border-slate-300 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.10)]">
              <div className="mb-4 flex items-center justify-between">
                <Badge tone={item.tone}>{item.role}</Badge>
                <div className="rounded-2xl bg-slate-100 p-3"><Icon className="h-5 w-5 text-slate-600" /></div>
              </div>
              <h3 className="text-xl font-black text-slate-950">{item.name}</h3>
              <div className="mt-4 grid gap-3">
                <VisualMeter label="核心" left="结构" right="执行" fill={80} tone={item.tone} note={item.core} />
                <RuleCard label="只做" text={item.do} tone="teal" />
                <RuleCard label="禁区" text={item.ban} tone="red" icon={Ban} />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function GoldEurSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="02" title="黄金 / EUR 执行系统" desc="把 SMC 和趋势跟踪压缩成一条操作链：先定向，再找位，最后等确认。" tone="amber" />
      <ProcessRail
        tone="amber"
        steps={[
          { title: "日线定向", text: "看趋势、关键 OB、主结构；先有方向，再有交易。" },
          { title: "4H / 1H 找位", text: "找 BSL/SSL、FVG、POC 集中区和结构重叠区。" },
          { title: "15M / 5M 确认", text: "等收回、拒绝、CHoCH/BOS，不在测试区提前动手。" },
          { title: "只拿中间段", text: "止损放结构外；信号不完整，不做。" },
        ]}
      />
      <div className="mt-5 mb-5 rounded-[1.6rem] border-2 border-red-300 bg-red-50 p-4 shadow-md">
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
      <SectionHeader number="03" title="期权买方系统" desc="用图形替代大段说明：先看三维判断，再看时间、合约和开仓确认。" tone="blue" />
      <VisualDecision
        title="三维判断"
        tone="teal"
        items={[
          { label: "方向", text: "正股结构 + 大盘 + 板块 + 催化剂同向" },
          { label: "时间", text: "日内快进快出；波段看 14-45 DTE" },
          { label: "波动率", text: "波段优先 IVR < 40；IVR > 60 降仓或放弃" },
        ]}
      />
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[1.8rem] border-slate-300 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.10)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-black text-slate-950">VWAP 状态机</h3>
            <Zap className="h-5 w-5 text-slate-500" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500">Step 1</div>
              <div className="mt-2 text-sm font-black text-slate-950">接近 VWAP</div>
              <div className="mt-2 text-sm font-bold leading-6 text-slate-600">这里只观察，不抢跑，不直接开仓。</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-teal-50 p-4">
              <div className="text-xs font-black uppercase tracking-wider text-teal-700">Step 2</div>
              <div className="mt-2 text-sm font-black text-slate-950">等确认</div>
              <div className="mt-2 text-sm font-bold leading-6 text-slate-600">Call 看收回，Put 看失败；同时看 9EMA 和量能。</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-red-50 p-4">
              <div className="text-xs font-black uppercase tracking-wider text-red-700">Step 3</div>
              <div className="mt-2 text-sm font-black text-slate-950">执行 / 放弃</div>
              <div className="mt-2 text-sm font-bold leading-6 text-slate-600">确认成立再进；反复穿越 VWAP、无量横盘直接放弃。</div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{optionModels.map((m) => <FlowCard key={m.title} {...m} />)}</div>
        </Card>
        <div className="grid gap-4">
          <HeatWindow
            title="日内时间热力条"
            rows={[
              { label: "09:30-09:45", status: "禁做", fill: 20, className: "bg-red-500", note: "开盘乱流，方向未定。" },
              { label: "09:45-11:30", status: "优先", fill: 88, className: "bg-emerald-600", note: "趋势确立阶段，优先窗口。" },
              { label: "11:30-13:30", status: "低质", fill: 35, className: "bg-amber-500", note: "午盘低流动性，假信号多。" },
              { label: "13:30-15:00", status: "优先", fill: 82, className: "bg-emerald-600", note: "午后方向重启。" },
              { label: "15:45-16:00", status: "禁做", fill: 18, className: "bg-red-500", note: "尾盘对冲，波动异常。" },
            ]}
          />
          <Card className="rounded-[1.7rem] border-slate-300 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950">合约与风控仪表</h3>
              <Gauge className="h-5 w-5 text-slate-500" />
            </div>
            <div className="mt-4 grid gap-3">
              <VisualMeter label="Delta" left="激进 0.35" right="深 ITM 0.65" fill={55} tone="teal" note="日内优先 0.45-0.55" />
              <VisualMeter label="价差" left="0.01" right="0.20+" fill={30} tone="amber" note="越窄越好" />
              <VisualMeter label="止损线" left="-20% 警戒" right="-25% 离场" fill={100} tone="red" note="不保留 -30% 档位" />
              <VisualMeter label="止盈线" left="+50% 保护" right="+80%-100% 全平" fill={80} tone="green" note="盈利要锁住" />
            </div>
          </Card>
        </div>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[1.8rem] border-red-300 bg-red-50 p-5 shadow-[0_20px_55px_rgba(239,68,68,0.16)]">
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
      <SectionHeader number="04" title="正股配置系统" desc="保留必要内容，但图形化展示，避免和日内模块抢注意力。" tone="violet" />
      <div className="grid gap-4 lg:grid-cols-2">
        {stockModels.map((m) => <FlowCard key={m.title} {...m} />)}
        <Card className="rounded-[1.7rem] border-violet-300 bg-violet-50 p-5 shadow-[0_20px_55px_rgba(139,92,246,0.14)]">
          <Badge tone="violet">加密暂缓</Badge>
          <h3 className="mt-3 text-lg font-black text-slate-950">加密合约 / 期权</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-violet-200 bg-white p-4"><div className="text-xs font-black text-violet-700">看</div><div className="mt-2 text-sm font-black text-slate-950">OI / Funding / 清算</div></div>
            <div className="rounded-2xl border border-teal-200 bg-white p-4"><div className="text-xs font-black text-teal-700">等</div><div className="mt-2 text-sm font-black text-slate-950">15-45 分钟，5M/15M 确认</div></div>
            <div className="rounded-2xl border border-red-200 bg-white p-4"><div className="text-xs font-black text-red-700">禁</div><div className="mt-2 text-sm font-black text-slate-950">1M 追反转 / 高杠杆</div></div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function MacroAndModels() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="05" title="宏观过滤 + 高胜率模型库" desc="把宏观过滤做成可扫视的图形版面，同时强化模型卡片的交互反馈。" tone="slate" />
      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <Card className="rounded-[1.8rem] border-slate-300 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.10)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-950">VIX 风险地图</h3>
              <p className="mt-1 text-sm font-bold text-slate-600">用象限 + 偏向条 + 决策流，减少阅读压力。</p>
            </div>
            <Gauge className="h-5 w-5 text-slate-500" />
          </div>
          <MacroRadarBoard />
        </Card>
        <Card className="rounded-[1.8rem] border-teal-700 bg-white p-5 shadow-[0_22px_60px_rgba(13,148,136,0.15)]">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-950">高胜率模型库</h3>
              <p className="mt-1 text-sm font-bold text-slate-600">每张卡只回答：场景、触发、放弃。</p>
            </div>
            <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-black text-red-900">没有触发 = 不交易</div>
          </div>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="text-xs font-black text-slate-500">读卡顺序</div><div className="mt-2 text-sm font-black text-slate-950">先看场景，再看触发，最后看放弃。</div></div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-3"><div className="text-xs font-black text-teal-700">触发标准</div><div className="mt-2 text-sm font-black text-slate-950">出现确认才做，不做预判单。</div></div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3"><div className="text-xs font-black text-red-700">执行底线</div><div className="mt-2 text-sm font-black text-slate-950">没有空间 / 无量 / 新闻刚出，一律放弃。</div></div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">{highWinModels.map((m) => <FlowCard key={m.title} {...m} />)}</div>
        </Card>
      </div>
    </section>
  );
}

function TrafficLightChecklist() {
  const [checked, setChecked] = useState([]);
  const all = checked.length === checklist.length;
  const toggle = (i) => setChecked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  return (
    <Card className={cn("rounded-[2rem] border-2 p-5 shadow-xl", all ? "border-teal-700 bg-teal-50" : "border-red-300 bg-red-50")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-950">开单前红绿灯</h3>
          <p className="mt-1 text-sm font-bold text-slate-600">全部点亮才允许进入下一步。</p>
        </div>
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
  function next() {
    setAnswer(null);
    setIdx((idx + 1) % questions.length);
  }
  return (
    <Card className="rounded-[2rem] border-slate-300 p-5 shadow-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h3 className="text-xl font-black text-slate-950">强化答题</h3><p className="mt-1 text-sm font-bold text-slate-600">训练“能不能做”，不是预测涨跌。</p></div><Button onClick={next} variant="ghost"><RefreshCcw className="mr-2 h-4 w-4" />换一题</Button></div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"><h4 className="text-lg font-black leading-8 text-slate-950">{q.q}</h4><div className="mt-4 grid gap-3 md:grid-cols-2">{q.options.map((op, i) => {
        const chosen = answer === i;
        const correct = answer !== null && i === q.a;
        const wrong = chosen && i !== q.a;
        return <button key={op} onClick={() => setAnswer(i)} className={cn("rounded-2xl border-2 p-4 text-left text-sm font-black transition", correct ? "border-teal-700 bg-teal-50 text-teal-900" : wrong ? "border-red-700 bg-red-50 text-red-900" : "border-slate-300 bg-white text-slate-700 hover:border-teal-500")}>{op}</button>;
      })}</div>{answer !== null && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-black leading-7 text-amber-950">{answer === q.a ? "判断正确：" : "判断错误："}{q.exp}</motion.div>}</div>
    </Card>
  );
}

function DisciplineSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="06" title="执行纪律与训练闸门" desc="把复杂判断前置成图形化自检：红绿灯、熔断和训练题。" tone="red" />
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
  const stats = useMemo(
    () => [
      { label: "交易矩阵", value: "4类", icon: Layers, tone: "bg-teal-700" },
      { label: "执行模型", value: "9组", icon: Activity, tone: "bg-sky-700" },
      { label: "红绿灯", value: `${checklist.length}项`, icon: ShieldAlert, tone: "bg-red-700" },
      { label: "训练题", value: `${questions.length}题`, icon: Brain, tone: "bg-violet-700" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#d1fae5_0,#ebf8ff_22%,#f8fafc_55%,#eef4fb_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 overflow-hidden rounded-[2.4rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.97),rgba(241,245,249,0.94))] shadow-[0_35px_100px_rgba(15,23,42,0.18)] ring-1 ring-white">
          <div className="h-3 bg-gradient-to-r from-teal-700 via-sky-600 to-violet-700" />
          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap gap-2"><Badge tone="teal">交易模型训练系统 v2.7</Badge><Badge tone="red">图形精简版</Badge><Badge tone="blue">低阅读压力</Badge></div>
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

        <div className="mb-8 grid gap-4 md:grid-cols-4">{stats.map((s) => { const Icon = s.icon; return <Card key={s.label} className="relative overflow-hidden rounded-[1.6rem] border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"><div className="flex items-start justify-between"><div><div className="text-2xl font-black text-slate-950">{s.value}</div><div className="mt-1 text-sm font-black text-slate-600">{s.label}</div></div><div className={cn("rounded-2xl p-3 text-white", s.tone)}><Icon className="h-5 w-5" /></div></div><div className={cn("absolute bottom-0 left-0 h-2 w-full", s.tone)} /></Card>; })}</div>

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
