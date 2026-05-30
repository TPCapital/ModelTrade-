import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Ban,
  BarChart3,
  Brain,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Flame,
  Gauge,
  Layers,
  LineChart,
  Radar,
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
  return <button type={type} className={cn(base, variants[variant] || variants.default, className)} {...props}>{children}</button>;
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
        <p className="mt-1 max-w-4xl text-sm font-semibold leading-7 text-slate-600">{desc}</p>
      </div>
    </div>
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

function RuleLine({ children, tone = "teal", index }) {
  const colors = {
    teal: "border-teal-200 bg-teal-50 text-teal-800",
    red: "border-red-200 bg-red-50 text-red-800",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    blue: "border-sky-200 bg-sky-50 text-sky-900",
    slate: "border-slate-200 bg-slate-50 text-slate-800",
    violet: "border-violet-200 bg-violet-50 text-violet-900",
  };
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold leading-6 text-slate-800 shadow-sm">
      <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-black", colors[tone])}>{index ?? <CheckCircle2 className="h-4 w-4" />}</span>
      <span>{children}</span>
    </div>
  );
}

const tradeMatrix = [
  {
    name: "黄金 / EUR",
    role: "主战场",
    icon: ShieldAlert,
    tone: "amber",
    core: "流动性扫荡 + 价格行为",
    edge: "Kill Zone、OB/FVG、扫前高前低后的确认",
    risk: "假突破、新闻盘、区间中间乱做",
  },
  {
    name: "期权买方",
    role: "当前重点",
    icon: Zap,
    tone: "teal",
    core: "方向 + 时间 + 波动率",
    edge: "有限亏损博大波动，适合日内确认后的中间段",
    risk: "Theta、IV买贵、VWAP假突破、扛亏损",
  },
  {
    name: "正股",
    role: "辅助学习",
    icon: TrendingUp,
    tone: "blue",
    core: "基本面锚定 + 技术择时",
    edge: "财报/成长逻辑支撑，中线更稳定",
    risk: "财报黑天鹅、基本面恶化、追高回撤",
  },
  {
    name: "加密合约/期权",
    role: "暂缓扩展",
    icon: Flame,
    tone: "violet",
    core: "趋势 + OI + Funding + 清算",
    edge: "情绪极端后的反转，插针后反弹",
    risk: "插针爆仓、点差大、流动性差、过高杠杆",
  },
];

const smcLevels = [
  ["Level 1 宏观结构层", "周线 / 日线", "确认趋势偏向、关键 OB、主要支撑阻力。只决定方向，不直接开单。"],
  ["Level 2 中观流动性层", "4H / 1H", "定位 BSL/SSL、FVG、POI、POC 磁吸区，判断价格可能先扫哪里。"],
  ["Level 3 微观入场层", "15M / 5M / 3M", "等 CHoCH/BOS、长影线收回、OB+FVG 重叠区，再考虑执行。"],
];

const smcConcepts = [
  ["BSL / SSL", "前高/前低聚集的止损流动性", "扫完流动性后反向，才有交易意义。"],
  ["OB", "导致大幅位移前的最后反向K线", "和FVG/POC重叠时更强，不能孤立使用。"],
  ["FVG / IFVG", "三根K线之间的不平衡区域", "回补50%附近更值得观察，但必须等确认。"],
  ["POC", "成交量分布峰值 / 价格磁吸区", "单点POC不够，优先看3-5个相邻POC形成的成本集中区。"],
  ["CHoCH / BOS", "结构转变 / 趋势延续确认", "CHoCH用于早期反转，BOS用于趋势延续。"],
];

const goldRefinements = [
  ["POC集中区", "不只看单一POC，优先看3-5个相邻POC形成的成交密集成本区。价格在集中区上方偏强，下方偏弱。"],
  ["FVG精准化", "优先选择来自强推动、3根以上未被快速回补、未被多次穿透，并与OB/POC/流动性池共振的FVG。"],
  ["MA9 / MA21", "替代MA20/50作为日内动能过滤。价格 > MA9 > MA21 代表短线强势，但不是直接追单理由。"],
  ["量能激增", "当前量能 > 过去20根均量 × 1.5，可视为异动确认。注意黄金/外汇多为tick volume，只做辅助确认。"],
];

const fxTrendRules = [
  ["宏观过滤", "先看DXY方向、重大数据时间、美元强弱环境。数据前后不把技术信号当确定性。"],
  ["趋势排列", "EMA9 > EMA21 > EMA55 偏多；反向偏空。ADX > 25 说明趋势强度更可交易。"],
  ["动能确认", "MACD可做辅助，不作为核心开单理由。价格结构与EMA/ADX优先级更高。"],
  ["入场方式", "破位后不追，等待回踩EMA21或结构位，再用K线收回/拒绝确认。不要机械固定10-15 pips。"],
  ["管理规则", "RR至少1:2；达到1:2后移动止损到进场价附近；1:3以上分批止盈。"],
];

const optionCoreSteps = [
  {
    key: "Direction",
    cn: "方向",
    icon: Target,
    tone: "teal",
    title: "不是感觉，是结构 + 大盘 + 板块 + 催化剂同向",
    rules: [
      "Call：正股结构向上，SPY/QQQ不拖后腿，板块有资金，VIX不快速拉升。",
      "Put：正股弱于大盘，大盘走弱或VIX上升，跌破关键结构后反抽失败。",
      "看不出方向，就不是你的行情；不需要硬选 Call 或 Put。",
    ],
  },
  {
    key: "Time",
    cn: "时间",
    icon: Clock,
    tone: "blue",
    title: "日内和波段分开，不能混用规则",
    rules: [
      "日内：0DTE / 1DTE / 3-5DTE，只做快进快出，严格止损。",
      "波段：14-45DTE，看日线结构、IVR、催化剂和持仓时间。",
      "期权持有时间不要超过原计划到期日的一半；该走就走。",
    ],
  },
  {
    key: "Volatility",
    cn: "波动率",
    icon: Gauge,
    tone: "violet",
    title: "IV 便宜才适合买方，IV 高位要警惕被收割",
    rules: [
      "IVR = (当前IV - 52周最低IV) / (52周最高IV - 52周最低IV) × 100。",
      "波段买方优先IVR < 30-40；IVR 30-60中性；IVR > 60必须降仓或放弃。",
      "Skew只判断哪一侧期权更贵，不作为当前阶段的单独入场信号。",
      "财报前、重大事件前 IV 常被抬高，方向对也可能 IV Crush。",
      "VIX低不等于随便买Call，仍然要看个股IV、方向、成交量和空间。",
    ],
  },
];

const optionIntradayModels = [
  {
    name: "A｜VWAP回踩 / 反抽确认",
    bestFor: "趋势日最常用",
    conditions: [
      "正股先站上VWAP，回踩时缩量，不破或快速收回。",
      "做Call：回踩VWAP不破，下一根重新站上，9EMA上拐。",
      "做Put：从下方反抽VWAP不过，出现上影线/放量失败，重新跌回下方。",
    ],
    ban: "到VWAP就开仓 = 错误。VWAP是观察区，不是按钮。",
  },
  {
    name: "B｜ORB开盘区间突破",
    bestFor: "开盘后方向明确",
    conditions: [
      "开盘15分钟形成高低区间，不在第一波乱追。",
      "突破ORB高/低点时放量，且VWAP在突破方向同侧。",
      "突破后第一根K线收盘确认，回撤进区间内就止损。",
    ],
    ban: "1.5小时内没有达到目标或失去动能，无论盈亏都不恋战。",
  },
  {
    name: "C｜VWAP ±2σ 极值反转",
    bestFor: "震荡日，不适合趋势日",
    conditions: [
      "大盘当日没有明确趋势，QQQ/SPY涨跌温和。",
      "价格触及+2σ后滞涨反包，考虑Put；触及-2σ后止跌反包，考虑Call。",
      "极值处量能衰减，而不是趋势加速放量。",
    ],
    ban: "趋势日不要逆势摸顶抄底，±2σ可以继续扩张。",
  },
];

const optionContractRules = [
  ["标的", "优先 SPY / QQQ；个股优先 NVDA / TSLA / AMD 等高流动性标的。"],
  ["DTE", "日内 0DTE/1DTE/3-5DTE；短线波段 15-30DTE；核心波段 30-45DTE；<15DTE只限强确定性。"],
  ["Strike", "ATM 平值优先；轻度ITM更稳；强趋势才考虑一档OTM。"],
  ["Delta", "日内优先 0.45-0.65；0.20以下太彩票。"],
  ["IVR", "日内作为背景，波段作为核心过滤；IVR > 60时买方要谨慎，IVR > 80默认高危。"],
  ["Spread", "买卖价差 0.01-0.08 较好；0.20+ 默认不做。"],
  ["Volume/OI", "成交量至少几百张，1000+更好；盘口厚度要够。"],
  ["Order", "只用限价单；不要市价追，尤其是开盘第一波。"],
  ["Exit", "+20%开始盯盘，+30%-50%优先落袋；-20%-30%警惕/止损。"],
];

const macroMatrix = [
  ["Risk ON", "VIX < 18 + DXY下行", "偏多正股/QQQ Call/加密；黄金谨慎震荡"],
  ["Risk OFF", "VIX > 25 + DXY上行", "黄金偏多或避险；加密减仓/做空；期权偏Put或观望"],
  ["过渡期", "VIX 18-25", "降低仓位，等待方向，不急着扩大交易"],
];

const cryptoRules = [
  ["Funding Rate", "持续 >0.1% 多头过热；持续 <-0.1% 空头过热。极端后只找反向确认，不盲逆势。"],
  ["OI", "OI上升+价格上涨=趋势健康；OI上升+价格下跌=空头堆积，注意清算反弹。"],
  ["清算", "大额清算后出现Pin Bar/吞没，才考虑反向，不在清算前硬猜底顶。"],
  ["杠杆", "建议3-5x，最高不超过10x；单笔风险≤账户1-2%。"],
];

const stockRules = [
  ["定位", "正股是低频配置/波段系统，不是日内冲动系统。先有基本面锚，再谈技术择时。"],
  ["候选池", "营收/盈利增速 >15%、行业景气度向上、机构持仓稳定或增加、无重大负面催化。"],
  ["估值判断", "PE低分位只能用于成熟股。成长股要结合行业增速、利润率和现金流，不能机械要求低PE。"],
  ["技术择时", "周线趋势不坏，日线回调至MA20/前支撑，60分钟突破用2-3根K线确认。"],
  ["成交量", "回调时缩量更健康；突破时放量但不能过热，过热容易冲高回落。"],
  ["入场", "靠近支撑区等待确认，不使用固定2%-3%安全边际；止损放结构失效位。"],
  ["管理", "短波段3-10个交易日；达到1:2可移动止损；目标看下一个阻力位或趋势破坏。"],
];

const checklist = [
  "我知道今天交易的是哪一套系统：黄金、EUR/外汇、日内期权、波段期权、正股或加密，规则没有混用。",
  "位置明确：不是区间中间，不是在VWAP/均线附近机械开仓，而是在观察区等确认。",
  "方向完整：大盘、板块、正股/品种结构没有明显冲突。",
  "期权已检查：DTE、Delta、价差、成交量、IV/IVR、Theta风险都可接受。",
  "VWAP规则正确：确认失败才反转，确认收回才顺势；反复穿越不做。",
  "量能和空间够：突破有量，压力/支撑距离足够，不是低胜率磨损区。",
  "黄金/外汇已确认：黄金看POC集中区+FVG共振，EUR看EMA排列/ADX趋势，不机械套点数。",
  "正股已确认：有基本面锚定和技术择时，不只是因为K线好看就买。",
  "风险先定：止损位、最大亏损、止盈区间已经写清楚。",
  "节奏正确：避开开盘前15分钟乱扫、午盘低流动性、重大数据前30分钟。",
  "情绪正常：不是回本、证明自己、刚亏完想追回，也没有连续亏损后加仓。",
];

const trainingQuestions = [
  {
    q: "价格从下方反抽到VWAP，没有上影线也没有放量阴线，反而重新站上并横住。你能买Put吗？",
    options: ["能，到VWAP就是压力", "不能，空头失败没有确认", "能，因为上涨都是诱多", "加倍买Put"],
    a: 1,
    exp: "VWAP是观察区，不是开仓点。站不上并跌回下方才是反抽失败。",
  },
  {
    q: "0DTE日内和30-45DTE波段期权最大的区别是什么？",
    options: ["没有区别", "日内看速度和确认，波段看结构/IVR/催化剂", "波段不用止损", "0DTE可以随便拿"],
    a: 1,
    exp: "两套系统不能混用。0DTE更看速度和执行，波段更看IVR、结构和时间。",
  },
  {
    q: "SPY围绕VWAP反复穿越，9EMA/20EMA缠绕，小实体很多。这是什么区？",
    options: ["最佳Call区", "最佳Put区", "期权买方低胜率区", "必须双向开仓"],
    a: 2,
    exp: "方向不清 + 空间不够 + 时间流血，是买方低胜率区。",
  },
  {
    q: "IVR > 60 时买方期权最需要警惕什么？",
    options: ["买得太便宜", "IV Crush和买贵", "成交太活跃", "Delta太低"],
    a: 1,
    exp: "IV高位时，就算方向对，也可能被波动率回落杀掉利润。",
  },
  {
    q: "黄金扫了前低，出现长下影，但没有收回关键区间。正确动作是？",
    options: ["立刻做多", "立刻做空", "等待收回确认", "加仓搏反转"],
    a: 2,
    exp: "扫流动性只是第一步，收回和结构确认才有意义。",
  },
  {
    q: "加密合约Funding极端、OI很高、价格扫关键位后出现大额清算。下一步应该是什么？",
    options: ["清算前提前满仓", "等Pin Bar/吞没等反向确认", "马上高杠杆追", "忽略资金费率"],
    a: 1,
    exp: "加密的高胜率机会是清算后的确认，不是清算前硬猜。",
  },
  {
    q: "你今天已经连续亏损两笔，但看到一个看起来不错的期权ORB突破。你该怎么做？",
    options: ["继续做", "加仓追回", "强制暂停", "换品种继续"],
    a: 2,
    exp: "风控规则优先于任何技术模型，连续亏损后判断会变形。",
  },
  {
    q: "黄金价格来到单一POC附近，你能直接把它当支撑/压力开单吗？",
    options: ["能，POC就是必反位", "不能，优先看POC集中区和结构确认", "能，越靠近越满仓", "只看均线不用POC"],
    a: 1,
    exp: "单一POC不是按钮。更高质量的是POC集中区 + OB/FVG/流动性共振 + 收回/拒绝确认。",
  },
  {
    q: "EUR破位后回踩EMA21附近，但ADX低于20、均线缠绕。你该怎么做？",
    options: ["立刻进场", "不做，趋势强度不足", "加大仓位", "只看MACD进"],
    a: 1,
    exp: "外汇趋势系统需要趋势环境。ADX弱、均线缠绕时，破位更容易是假突破或震荡噪音。",
  },
  {
    q: "一个成长股PE不低，但营收和利润高速增长、行业景气向上。是否必须因为PE不低直接排除？",
    options: ["必须排除", "不一定，估值要结合成长性和行业", "只看K线", "只看消息"],
    a: 1,
    exp: "正股不能机械看PE低分位。成长股要结合增速、利润率、现金流和行业景气。",
  },
];

const highWinModels = [
  {
    market: "黄金/EUR",
    title: "扫流动性 + 收回确认",
    desc: "扫前高/前低后必须收回关键区间，并出现CHoCH或反向动能确认。",
    doRules: ["等收回", "等反向确认", "止损放影线外/结构外", "目标看对侧流动性"],
    banRules: ["只扫不收回", "新闻刚公布", "区间中间", "连续止损后硬做"],
  },
  {
    market: "黄金/EUR",
    title: "POC集中区 + OB + FVG 共振回踩",
    desc: "强推动后回补FVG，叠加3-5个相邻POC形成的成本区和OB/结构位，等待拒绝确认后顺势。",
    doRules: ["强推动来源", "FVG未反复穿透", "POC集中区共振", "出现拒绝K和量能确认"],
    banRules: ["单一POC机械开仓", "FVG反复被穿", "无趋势背景", "追第一根"],
  },
  {
    market: "EUR/外汇",
    title: "EMA9/21/55 + ADX 趋势回踩",
    desc: "外汇更适合趋势跟踪。破位后不追，等回踩EMA21或结构位，ADX确认趋势强度。",
    doRules: ["EMA顺序排列", "ADX > 25更优", "回踩EMA21/结构位", "K线拒绝确认"],
    banRules: ["ADX低迷", "均线缠绕", "固定10-15点机械入场", "数据前硬做"],
  },
  {
    market: "期权日内",
    title: "VWAP确认 + 量能 + 合约过滤",
    desc: "只做确认后的中间段，不在VWAP机械开仓。先筛合约，再谈方向。",
    doRules: ["Catalyst", "大盘共振", "VWAP确认", "量能放大", "合约价差小"],
    banRules: ["开盘前15分钟乱追", "反复穿VWAP", "无量横盘", "IV过高"],
  },
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
        <h3 className="mt-1 text-xl font-black">正股目标 → 期权目标价快捷计算</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-teal-50">用Delta做日内粗算，适合挂单、止盈止损参考，不是精确定价模型。</p>
      </div>
      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">类型</span><select className={inputClass} value={mode} onChange={(e) => setMode(e.target.value)}><option value="call">Call 看涨</option><option value="put">Put 看跌</option></select></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">当前正股价</span><input className={inputClass} value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} inputMode="decimal" /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">目标/止损正股价</span><input className={inputClass} value={targetStock} onChange={(e) => setTargetStock(e.target.value)} inputMode="decimal" /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">当前期权价</span><input className={inputClass} value={optionPrice} onChange={(e) => setOptionPrice(e.target.value)} inputMode="decimal" /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Delta</span><input className={inputClass} value={delta} onChange={(e) => setDelta(e.target.value)} inputMode="decimal" /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">合约张数</span><input className={inputClass} value={contracts} onChange={(e) => setContracts(e.target.value)} inputMode="numeric" /></label>
        </div>
        <div className="grid gap-3">
          <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4"><div className="text-xs font-black text-slate-500">估算期权价</div><div className="mt-1 text-3xl font-black text-teal-800">{isValid ? projectedOption.toFixed(2) : "--"}</div></div>
          <div className={cn("rounded-2xl border p-4", pnl >= 0 ? "border-teal-300 bg-teal-50" : "border-red-300 bg-red-50")}><div className="text-xs font-black text-slate-500">估算盈亏</div><div className={cn("mt-1 text-2xl font-black", pnl >= 0 ? "text-teal-800" : "text-red-800")}>{isValid ? `${pnl >= 0 ? "+" : ""}${pnl.toFixed(0)} 美元` : "--"}</div><div className="text-sm font-bold text-slate-600">{isValid ? `${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(1)}%` : "--"}</div></div>
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">不包含IV、Theta、Gamma和价差。越接近0DTE，误差越大。</div>
        </div>
      </div>
    </Card>
  );
}

function TradingMatrix() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="01" title="多品种交易矩阵" desc="先定主次，再谈策略。不同品种的核心优势和最大风险完全不同，不能互相硬套。" tone="teal" />
      <div className="grid gap-4 lg:grid-cols-4">
        {tradeMatrix.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.name} className="rounded-[1.7rem] border-slate-300 p-5 shadow-xl shadow-slate-200/70">
              <div className="flex items-center justify-between"><Badge tone={item.tone}>{item.role}</Badge><Icon className="h-6 w-6 text-teal-700" /></div>
              <h3 className="mt-4 text-xl font-black text-slate-950">{item.name}</h3>
              <div className="mt-3 space-y-3 text-sm font-semibold leading-6 text-slate-700">
                <p><span className="font-black text-slate-950">核心：</span>{item.core}</p>
                <p><span className="font-black text-teal-800">优势：</span>{item.edge}</p>
                <p><span className="font-black text-red-800">风险：</span>{item.risk}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function SmcSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="02" title="黄金 / 外汇：结构化执行系统精进" desc="黄金偏流动性扫单，EUR/外汇偏趋势跟踪。POC、FVG、MA、量能都只做过滤和确认，不做机械开仓按钮。" tone="amber" />
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.8rem] border-2 border-amber-300 bg-amber-50 p-5 shadow-lg shadow-amber-100">
          <h3 className="text-lg font-black text-amber-950">三层时间框架</h3>
          <div className="mt-4 space-y-3">
            {smcLevels.map(([level, tf, desc], index) => (
              <div key={level} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 text-xs font-black text-white">{index + 1}</span><span className="font-black text-slate-950">{level}</span><Badge tone="amber">{tf}</Badge></div>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.8rem] border-2 border-slate-300 bg-white p-5 shadow-lg">
          <h3 className="text-lg font-black text-slate-950">核心概念精确定义</h3>
          <div className="mt-4 grid gap-3">
            {smcConcepts.map(([name, def, use]) => (
              <div key={name} className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[100px_1fr]">
                <div className="font-black text-teal-800">{name}</div>
                <div className="text-sm font-semibold leading-6 text-slate-700"><span className="font-black text-slate-950">定义：</span>{def}<br /><span className="font-black text-slate-950">用法：</span>{use}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card className="rounded-[1.8rem] border-amber-300 bg-amber-50 p-5 shadow-lg shadow-amber-100">
          <h3 className="text-xl font-black text-amber-950">黄金系统精进：POC + FVG + MA9/21 + 量能</h3>
          <div className="mt-4 space-y-2">{goldRefinements.map(([k, v]) => <RuleLine key={k} tone="amber"><b>{k}：</b>{v}</RuleLine>)}</div>
          <div className="mt-3 rounded-2xl border border-red-300 bg-white p-3 text-sm font-black leading-6 text-red-900">禁止把MA9/21、POC或FVG当成单独开仓信号；必须等结构位置 + 收回/拒绝 + 量能确认。</div>
        </Card>
        <Card className="rounded-[1.8rem] border-sky-300 bg-sky-50 p-5 shadow-lg shadow-sky-100">
          <h3 className="text-xl font-black text-sky-950">外汇 / EUR 趋势系统</h3>
          <div className="mt-4 space-y-2">{fxTrendRules.map(([k, v]) => <RuleLine key={k} tone="blue"><b>{k}：</b>{v}</RuleLine>)}</div>
        </Card>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-[1.7rem] border-red-300 bg-red-50 p-5 shadow-lg shadow-red-100"><h3 className="font-black text-red-950">黄金专属过滤器</h3><div className="mt-3 space-y-2"><RuleLine tone="red">避开非农/CPI前2小时入场，新闻前后不要用技术模型硬做。</RuleLine><RuleLine tone="red">伦敦开盘前30分钟高低点，是重要BSL/SSL观察区。</RuleLine><RuleLine tone="red">纽约开盘Kill Zone更容易扫流动性，但必须等确认。</RuleLine></div></Card>
        <Card className="rounded-[1.7rem] border-teal-300 bg-teal-50 p-5 shadow-lg shadow-teal-100 lg:col-span-2"><h3 className="font-black text-teal-950">精确入场三步法</h3><div className="mt-3 grid gap-2 md:grid-cols-3"><RuleLine index="1" tone="teal">日线确认偏向：看HTF结构和关键OB方向。</RuleLine><RuleLine index="2" tone="teal">4H/1H找到待扫流动性池：前高/前低密集止损区。</RuleLine><RuleLine index="3" tone="teal">15M/5M等CHoCH后，回调到OB+FVG重叠区执行；RR至少1:2。</RuleLine></div></Card>
      </div>
    </section>
  );
}

function OptionSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="03" title="期权买方系统：方向 + 时间 + 波动率" desc="v2.0把日内和波段彻底拆开：日内看速度与确认，波段看IVR、结构和催化剂。" tone="blue" />
      <div className="grid gap-4 lg:grid-cols-3">
        {optionCoreSteps.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.key} className="overflow-hidden rounded-[1.8rem] border-slate-300 shadow-xl shadow-slate-200/70">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4"><div className="flex items-center gap-3"><Icon className="h-6 w-6 text-teal-700" /><div><div className="text-xs font-black uppercase tracking-widest text-slate-500">{step.key}</div><h3 className="text-lg font-black text-slate-950">{step.cn}</h3></div></div></div>
              <div className="p-5"><h4 className="font-black leading-7 text-slate-950">{step.title}</h4><div className="mt-4 space-y-2">{step.rules.map((r) => <RuleLine key={r} tone={step.tone}>{r}</RuleLine>)}</div></div>
            </Card>
          );
        })}
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.8rem] border-2 border-teal-700 bg-white p-5 shadow-xl shadow-teal-100">
          <h3 className="text-xl font-black text-slate-950">日内期权四维确认系统</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <RuleLine tone="teal"><b>VWAP：</b>观察区，不是开仓点。失败才反转，收回才顺势。</RuleLine>
            <RuleLine tone="blue"><b>VWAP ±1σ/±2σ：</b>判断极值和均值回归，但趋势日不可逆势硬做。</RuleLine>
            <RuleLine tone="violet"><b>9EMA + 20EMA：</b>短线动能确认，缠绕时不做买方。</RuleLine>
            <RuleLine tone="amber"><b>成交量：</b>突破时需放量；无量横盘是期权买方地狱。</RuleLine>
            <RuleLine tone="slate"><b>关键位：</b>前日高低、开盘价、整数关口、ORB区间。</RuleLine>
            <RuleLine tone="red"><b>禁止：</b>开盘前15分钟、午盘低流动性、数据前30分钟乱进。</RuleLine>
          </div>
        </div>
        <div className="rounded-[1.8rem] border-2 border-red-300 bg-red-50 p-5 shadow-xl shadow-red-100">
          <h3 className="text-xl font-black text-red-950">期权买方四大杀手</h3>
          <div className="mt-4 space-y-2">
            <RuleLine tone="red">方向对了，但入场太早，被Theta磨死。</RuleLine>
            <RuleLine tone="red">方向对了，但IV过高，买贵后被IV Crush杀利润。</RuleLine>
            <RuleLine tone="red">突破VWAP是假突破，没有等失败/收回确认。</RuleLine>
            <RuleLine tone="red">亏损单不止损，小亏变大亏。</RuleLine>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {optionIntradayModels.map((model) => (
          <Card key={model.name} className="rounded-[1.7rem] border-slate-300 p-5 shadow-lg">
            <Badge tone="teal">{model.bestFor}</Badge><h3 className="mt-3 text-lg font-black text-slate-950">{model.name}</h3>
            <div className="mt-4 space-y-2">{model.conditions.map((c) => <RuleLine key={c} tone="teal">{c}</RuleLine>)}</div>
            <div className="mt-3 rounded-2xl border border-red-300 bg-red-50 p-3 text-sm font-black leading-6 text-red-900">{model.ban}</div>
          </Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[1.8rem] border-slate-300 p-5 shadow-xl">
          <h3 className="text-xl font-black text-slate-950">期权合约选择参数</h3>
          <div className="mt-4 grid gap-2">{optionContractRules.map(([k, v]) => <div key={k} className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 sm:grid-cols-[90px_1fr]"><span className="font-black text-teal-800">{k}</span><span className="font-semibold text-slate-700">{v}</span></div>)}</div>
        </Card>
        <OptionPriceCalculator />
      </div>
    </section>
  );
}

function ExpansionSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="04" title="扩展系统：正股低频配置 + 加密暂缓" desc="正股可以加入低频配置流程；加密合约/期权仍只做观察，不抢主战场。" tone="violet" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-[1.8rem] border-violet-300 bg-violet-50 p-5 shadow-lg shadow-violet-100"><h3 className="text-xl font-black text-violet-950">加密合约 / 加密期权</h3><div className="mt-4 space-y-2">{cryptoRules.map(([k, v]) => <RuleLine key={k} tone="violet"><b>{k}：</b>{v}</RuleLine>)}</div><div className="mt-3 rounded-2xl border border-red-300 bg-white p-3 text-sm font-black leading-6 text-red-900">暂不作为主战场：流动性、点差、插针和杠杆风险太高。</div></Card>
        <Card className="rounded-[1.8rem] border-sky-300 bg-sky-50 p-5 shadow-lg shadow-sky-100"><h3 className="text-xl font-black text-sky-950">正股低频配置系统</h3><div className="mt-4 space-y-2">{stockRules.map(([k, v]) => <RuleLine key={k} tone="blue"><b>{k}：</b>{v}</RuleLine>)}</div><div className="mt-3 rounded-2xl border border-teal-300 bg-white p-3 text-sm font-black leading-6 text-teal-900">正股不是纯技术，要用基本面锚定，再用技术择时。</div></Card>
      </div>
    </section>
  );
}

function MacroAndModels() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="05" title="宏观过滤 + 高胜率模型库" desc="每周只需要用宏观矩阵确定环境；每天只需要练少数高胜率形态。" tone="slate" />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[1.8rem] border-slate-300 p-5 shadow-xl"><h3 className="text-xl font-black text-slate-950">风险偏好矩阵</h3><div className="mt-4 space-y-3">{macroMatrix.map(([state, cond, action]) => <div key={state} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center gap-2"><Badge tone={state === "Risk OFF" ? "red" : state === "Risk ON" ? "green" : "amber"}>{state}</Badge><span className="text-sm font-black text-slate-800">{cond}</span></div><p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{action}</p></div>)}</div></Card>
        <div className="grid gap-4 lg:grid-cols-3">{highWinModels.map((m) => <Card key={m.title} className="rounded-[1.8rem] border-slate-300 p-5 shadow-xl"><Badge tone={m.market === "期权日内" ? "teal" : "amber"}>{m.market}</Badge><h3 className="mt-3 text-lg font-black text-slate-950">{m.title}</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{m.desc}</p><div className="mt-3 space-y-2"><div className="text-xs font-black text-teal-700">必须满足</div>{m.doRules.map((r) => <RuleLine key={r} tone="teal">{r}</RuleLine>)}<div className="pt-2 text-xs font-black text-red-700">禁止</div>{m.banRules.map((r) => <RuleLine key={r} tone="red">{r}</RuleLine>)}</div></Card>)}</div>
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
        <div><h3 className="text-xl font-black text-slate-950">开单前红绿灯检查</h3><p className="mt-1 text-sm font-bold text-slate-600">全部点亮才允许进入下一步。任何红灯，都不是错过机会，而是避免灾难。</p></div>
        <div className={cn("rounded-2xl px-4 py-3 text-lg font-black", all ? "bg-teal-700 text-white" : "bg-red-700 text-white")}>{checked.length} / {checklist.length}</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{checklist.map((_, i) => <span key={i} className={cn("h-4 w-4 rounded-full border-2", checked.includes(i) ? "border-teal-700 bg-teal-600" : "border-red-600 bg-red-500")} />)}</div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">{checklist.map((item, i) => {
        const ok = checked.includes(i);
        return <button key={item} onClick={() => toggle(i)} className={cn("flex gap-3 rounded-2xl border-2 p-4 text-left text-sm font-bold leading-6 transition", ok ? "border-teal-700 bg-white text-teal-950 shadow-lg shadow-teal-100" : "border-red-300 bg-white text-slate-800 shadow-sm hover:border-red-500")}><span className={cn("mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white", ok ? "bg-teal-700" : "bg-red-600")}>{ok ? "绿" : "红"}</span><span>{item}</span></button>;
      })}</div>
      <div className={cn("mt-5 rounded-2xl border p-4 text-center text-lg font-black", all ? "border-teal-700 bg-white text-teal-900" : "border-red-300 bg-white text-red-900")}>{all ? "绿灯全亮：可以进入执行，但仍然小仓试错。" : "红灯未清：禁止开单。"}</div>
    </Card>
  );
}

function TrainingQuiz() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const q = trainingQuestions[idx];
  function next() { setAnswer(null); setIdx((idx + 1) % trainingQuestions.length); }
  return (
    <Card className="rounded-[2rem] border-slate-300 p-5 shadow-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h3 className="text-xl font-black text-slate-950">强化答题训练</h3><p className="mt-1 text-sm font-bold text-slate-600">训练的是“能不能做”，不是预测涨跌。</p></div><Button onClick={next} variant="ghost"><RefreshCcw className="mr-2 h-4 w-4" />换一题</Button></div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"><h4 className="text-lg font-black leading-8 text-slate-950">{q.q}</h4><div className="mt-4 grid gap-3 md:grid-cols-2">{q.options.map((op, i) => {
        const chosen = answer === i; const correct = answer !== null && i === q.a; const wrong = chosen && i !== q.a;
        return <button key={op} onClick={() => setAnswer(i)} className={cn("rounded-2xl border-2 p-4 text-left text-sm font-black transition", correct ? "border-teal-700 bg-teal-50 text-teal-900" : wrong ? "border-red-700 bg-red-50 text-red-900" : "border-slate-300 bg-white text-slate-700 hover:border-teal-500")}>{op}</button>;
      })}</div>{answer !== null && <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-black leading-7 text-amber-950">{answer === q.a ? "判断正确：" : "判断错误："}{q.exp}</motion.div>}</div>
    </Card>
  );
}

function DisciplineSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader number="06" title="执行纪律与训练闸门" desc="交易系统不是为了让你每天都开单，而是为了让你只在最有优势的位置开单。" tone="red" />
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]"><TrafficLightChecklist /><TrainingQuiz /></div>
      <Card className="mt-5 rounded-[1.8rem] border-red-300 bg-red-50 p-5 shadow-lg shadow-red-100">
        <h3 className="text-xl font-black text-red-950">账户生存法则</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4"><RuleLine tone="red">每日最多3笔，连续亏损2笔停止。</RuleLine><RuleLine tone="red">每日最大亏损≤账户5%，触发立刻停止。</RuleLine><RuleLine tone="red">单笔期权成本不要超过账户10%-15%。</RuleLine><RuleLine tone="red">任何规则误用单，不允许拖成情绪单。</RuleLine></div>
      </Card>
    </section>
  );
}

export default function TradingModelTrainingSystem() {
  const stats = useMemo(() => [
    { label: "交易矩阵", value: "4类", icon: Layers, tone: "bg-teal-700" },
    { label: "期权核心", value: "3维", icon: Zap, tone: "bg-sky-700" },
    { label: "日内模型", value: "3个", icon: Activity, tone: "bg-violet-700" },
    { label: "红绿灯", value: `${checklist.length}项`, icon: ShieldAlert, tone: "bg-red-700" },
  ], []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7f4_0,#f4fbff_32%,#f8fafc_70%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 overflow-hidden rounded-[2.4rem] border border-slate-300 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)]">
          <div className="h-3 bg-gradient-to-r from-teal-700 via-sky-600 to-violet-700" />
          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap gap-2"><Badge tone="teal">交易模型训练系统 v2.1</Badge><Badge tone="red">先风控，后机会</Badge><Badge tone="blue">精进优化版</Badge></div>
            <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
              <div><h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">多品种交易执行训练系统 v2.1</h1><p className="mt-4 max-w-4xl text-base font-semibold leading-8 text-slate-700">把黄金/EUR、期权买方、正股、加密的逻辑分层处理：不是增加补丁，而是重构成“品种矩阵 → 单品种执行模型 → 期权三维系统 → 红绿灯检查 → 强化答题”的完整训练闭环。</p></div>
              <div className="rounded-[1.5rem] border-2 border-red-300 bg-red-50 p-4 shadow-lg"><div className="flex items-center gap-2 text-red-900"><AlertTriangle className="h-5 w-5" /><span className="font-black">v2.1总原则</span></div><p className="mt-2 text-sm font-bold leading-7 text-red-900">先优化旧模块，不乱加补丁；日内和波段分开；VWAP只作观察区；任何交易先过红绿灯。</p></div>
            </div>
          </div>
        </motion.header>

        <div className="mb-8 grid gap-4 md:grid-cols-4">{stats.map((s) => { const Icon = s.icon; return <Card key={s.label} className="relative overflow-hidden rounded-[1.6rem] border-slate-300 p-5 shadow-xl"><div className="flex items-start justify-between"><div><div className="text-2xl font-black text-slate-950">{s.value}</div><div className="mt-1 text-sm font-black text-slate-600">{s.label}</div></div><div className={cn("rounded-2xl p-3 text-white", s.tone)}><Icon className="h-5 w-5" /></div></div><div className={cn("absolute bottom-0 left-0 h-2 w-full", s.tone)} /></Card>; })}</div>

        <TradingMatrix />
        <SmcSystem />
        <OptionSystem />
        <ExpansionSystem />
        <MacroAndModels />
        <DisciplineSystem />
      </div>
    </div>
  );
}
