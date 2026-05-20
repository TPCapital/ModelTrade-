import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Target,
  Brain,
  TrendingUp,
  Ban,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Flame,
  Activity,
  Clock,
  Layers,
  Zap,
} from "lucide-react";

const models = [
  {
    id: "gold-liquidity-sweep",
    market: "黄金 XAUUSD",
    category: "反转模型",
    title: "扫流动性 + 长影线拒绝",
    level: "核心必练",
    direction: "多空都可",
    icon: ShieldAlert,
    color: "yellow",
    summary:
      "价格先扫前高/前低，制造突破假象，随后长影线收回关键区间，形成反向机会。",
    conditions: [
      "价格明确扫掉前高或前低",
      "出现长上影或长下影拒绝",
      "K线重新收回关键区间内",
      "反向动能开始出现，不是单根影线就盲进",
      "止损可以放在影线外，风险清晰",
    ],
    avoid: [
      "数据刚公布后的第一波乱扫",
      "只扫了高低点但没有收回",
      "价格在区间中间，没有边界意义",
      "影线很长但后续没有反向确认",
    ],
    entry: "等待收回关键位后的回踩或小级别反向确认，不追第一根反转K。",
    exit: "第一目标看区间中轴/前结构位；若反向动能衰减，先减仓或离场。",
    mantra: "扫了不等于反转，收回才有意义。",
  },
  {
    id: "gold-fvg-ob-continuation",
    market: "黄金 XAUUSD",
    category: "趋势延续",
    title: "FVG + OB 回踩延续",
    level: "核心必练",
    direction: "顺势",
    icon: Layers,
    color: "amber",
    summary:
      "强推动留下 FVG，价格回补到订单块附近，出现拒绝后顺原方向继续。",
    conditions: [
      "前面必须有明显推动，不是弱震荡",
      "FVG 来自强势K线或连续推动",
      "回补时价格减速，而不是猛烈反穿",
      "附近有 OB / POC / 结构位共振",
      "出现长影线、吞没、重新放量等确认",
    ],
    avoid: [
      "FVG 被多次穿透，已经失效",
      "没有趋势背景，只是在震荡里乱画区域",
      "回补时速度太快，说明支撑/阻力弱",
      "止损空间过大，盈亏比不合理",
    ],
    entry: "回补 FVG 后等拒绝确认，顺原推动方向入场。",
    exit: "目标看前高/前低、流动性池或下一磁吸区域。",
    mantra: "FVG 不是入场理由，共振和拒绝才是。",
  },
  {
    id: "gold-trash-range-ban",
    market: "黄金 XAUUSD",
    category: "禁止交易",
    title: "垃圾震荡识别模型",
    level: "保命模型",
    direction: "不交易",
    icon: Ban,
    color: "red",
    summary:
      "上下影线乱扫、实体小、ATR下降、结构混乱时，黄金最容易反复打损。",
    conditions: [
      "上下影线频繁出现，多空都被扫",
      "K线实体变小，方向没有延续",
      "ATR 下降但价格来回穿关键位",
      "FVG / OB 频繁失效",
      "价格卡在区间中间，没有边界优势",
    ],
    avoid: [
      "想靠一单回本",
      "因为无聊或不甘心强行找机会",
      "连续亏损后加大仓位",
      "用趋势模型硬套震荡盘",
    ],
    entry: "没有入场，直接关闭交易冲动。",
    exit: "离场、休息、等待伦敦盘/纽约盘重新定方向。",
    mantra: "看不懂不是错，硬做才是错。",
  },
  {
    id: "eur-trend-pullback",
    market: "EURUSD",
    category: "趋势延续",
    title: "趋势回踩延续模型",
    level: "稳定模型",
    direction: "顺势",
    icon: TrendingUp,
    color: "blue",
    summary:
      "EUR 经常不是暴力单边，而是在杂乱K线中慢慢延续趋势，适合等回踩。",
    conditions: [
      "高低点结构清晰，同向推进",
      "回踩到均线 / 结构位 / FVG 附近",
      "回踩力度弱，没有破坏趋势结构",
      "小级别出现拒绝或重新放量",
      "止损放在回踩结构外，风险可控",
    ],
    avoid: [
      "追连续大阳/大阴之后的末端",
      "趋势已经走太久但没有回踩",
      "回踩直接破坏前低/前高",
      "伦敦/纽约切换时无方向乱扫",
    ],
    entry: "只在回踩确认后顺势做，不在第一波突破时追。",
    exit: "前高/前低、通道边界或动能衰减时分批。",
    mantra: "EUR 要耐心，慢趋势比猛冲更可靠。",
  },
  {
    id: "eur-range-boundary",
    market: "EURUSD",
    category: "区间模型",
    title: "区间边界拒绝模型",
    level: "稳定模型",
    direction: "边界反向",
    icon: Activity,
    color: "cyan",
    summary:
      "EUR 在区间中更适合只做边界，不在中间位置被噪音牵着走。",
    conditions: [
      "区间上沿/下沿清晰",
      "价格触碰边界后出现拒绝",
      "假突破后重新收回区间更优",
      "中间区域坚决不做",
      "止损放在边界外侧，亏损有限",
    ],
    avoid: [
      "区间边界不清晰",
      "刚突破还没确认真假",
      "在中轴附近因为指标变色入场",
      "波动太小，盈亏比不足",
    ],
    entry: "边界拒绝后入场，或假突破收回后入场。",
    exit: "目标看区间中轴和对侧边界，不贪满段。",
    mantra: "区间只做边界，中间全是噪音。",
  },
  {
    id: "option-gap-vwap-call",
    market: "美股期权",
    category: "日内 Call 模型",
    title: "盘前利好 + 回踩 VWAP",
    level: "核心必练",
    direction: "Call 看涨",
    icon: Zap,
    color: "green",
    summary:
      "盘前明确利好推动高开，开盘不追，等回踩 VWAP 或关键支撑不破后做 Call。",
    conditions: [
      "盘前有明确利好，不是无原因乱涨",
      "盘前成交量明显放大",
      "开盘高开后没有直接瀑布",
      "回踩 VWAP / 前高 / 支撑不破",
      "期权成交量足，买卖价差小",
    ],
    avoid: [
      "开盘前5分钟情绪乱扫直接追",
      "利好很虚，没有成交量确认",
      "IV 过高，期权已经被买贵",
      "买卖价差大，进去就亏很多",
    ],
    entry: "等第一次回踩站稳，再买近月/当周期权的平值或轻度价内 Call。",
    exit: "盈利 30%-50% 先保护；跌破 VWAP 或关键位直接撤。",
    mantra: "期权不要追热闹，要等回踩证明强。",
  },
  {
    id: "option-sector-leader",
    market: "美股期权",
    category: "热点模型",
    title: "板块共振 + 龙头突破",
    level: "核心必练",
    direction: "Call 看涨",
    icon: Flame,
    color: "orange",
    summary:
      "不是一只股票孤立上涨，而是整个板块被资金攻击，选择最强龙头做突破。",
    conditions: [
      "同板块多只股票同步上涨",
      "有清晰主题：AI / 机器人 / 芯片 / 核电 / 军工等",
      "龙头涨幅、成交量、新闻强度都领先",
      "突破关键位时大盘没有拖后腿",
      "期权链流动性好，价差可接受",
    ],
    avoid: [
      "只是一只小票孤立拉升",
      "板块已经冲太高，龙头开始放量滞涨",
      "追后排弱股",
      "消息不明，只有社媒情绪",
    ],
    entry: "优先做龙头第一次有效突破或突破后回踩确认。",
    exit: "板块热度衰减、龙头跌回突破位、期权利润快速回吐时离场。",
    mantra: "热钱打的是方向，交易只做最强龙头。",
  },
  {
    id: "option-market-confluence",
    market: "美股期权",
    category: "大盘共振",
    title: "SPY / QQQ / VIX 共振模型",
    level: "核心必练",
    direction: "Call / Put",
    icon: Target,
    color: "purple",
    summary:
      "期权日内不能只看个股，方向必须和大盘环境、VIX、板块强弱共振。",
    conditions: [
      "做 Call：SPY/QQQ 向上，VIX 下降",
      "目标股强于大盘，而不是被大盘拖着走",
      "做 Put：SPY/QQQ 下跌，VIX 上升",
      "标的方向和板块方向一致",
      "入场前确认期权流动性，不买冷门合约",
    ],
    avoid: [
      "个股利好但大盘明显走弱",
      "VIX 快速拉升还硬做 Call",
      "只看K线，不看当天市场状态",
      "买临近归零的极端虚值合约赌博",
    ],
    entry: "大盘、板块、个股三者同向时才开仓。",
    exit: "大盘转弱、VIX反向、个股跌破关键位时不恋战。",
    mantra: "期权不是只赌方向，还要赌时间和环境。",
  },
  {
    id: "risk-revenge-ban",
    market: "全市场",
    category: "风控模型",
    title: "连续亏损 / 回本冲动禁止交易",
    level: "最高优先级",
    direction: "强制暂停",
    icon: XCircle,
    color: "rose",
    summary:
      "当交易动机变成回本、证明自己、追回亏损时，所有技术分析都会变形。",
    conditions: [
      "今天已经连续亏损2笔",
      "你正在想用一单把亏损打回来",
      "仓位明显大于平时",
      "没有等到完整信号就想提前进",
      "开单前心跳加速、烦躁、不甘心",
    ],
    avoid: [
      "加仓摊平亏损",
      "因为错过行情而追单",
      "爆仓后马上换品种继续赌",
      "用更高杠杆制造刺激感",
    ],
    entry: "禁止交易。离开屏幕至少15分钟。",
    exit: "当天最大亏损触发后，关闭交易平台，只允许观察。",
    mantra: "想回本的时候，市场最容易把你清零。",
  },
];

const trainingQuestions = [
  {
    question: "黄金扫了前低，出现长下影，但K线还没有重新收回关键区间。你该怎么做？",
    options: ["立刻做多", "立刻做空", "等待收回确认", "加大仓位搏反转"],
    answer: 2,
    explain: "扫低点不等于反转，必须等价格收回关键区间并出现确认。",
  },
  {
    question: "EUR 在区间中轴附近，指标突然变多，但上下边界都很远。你该怎么做？",
    options: ["做多", "做空", "不做，等边界", "双向挂单"],
    answer: 2,
    explain: "区间交易只做边界，中间位置没有盈亏比优势。",
  },
  {
    question: "一只股票盘前利好高开，开盘第一分钟直接拉升，你想买 Call。正确动作是？",
    options: ["马上追", "等回踩 VWAP 或关键位", "买最便宜虚值合约", "满仓进"],
    answer: 1,
    explain: "期权开盘追涨风险极高，第一版系统优先训练回踩确认。",
  },
  {
    question: "今天已经连续亏损两笔，但你看到黄金出现了一个还不错的FVG回补。你该怎么做？",
    options: ["继续做", "加仓追回", "强制暂停", "换EUR继续做"],
    answer: 2,
    explain: "连续亏损后，风控模型优先级高于任何技术模型。",
  },
  {
    question: "SPY 和 QQQ 下跌，VIX 上升，但某只股票有小利好。你想买 Call。是否合适？",
    options: ["合适", "不合适，缺少大盘共振", "只要利好就买", "买更远虚值"],
    answer: 1,
    explain: "期权日内必须看大盘共振，逆大盘做 Call 容易冲高回落。",
  },
  {
    question: "一只股票盘中突然上涨，但没有消息、没有板块共振，成交量也一般。你该怎么处理？",
    options: ["追 Call", "买便宜虚值", "不做", "等亏了再补仓"],
    answer: 2,
    explain: "期权第一步是 Catalyst（事件驱动）。没有原因、没有量、没有共振，默认不做。",
  },
  {
    question: "正股在 VWAP 下方，反抽 VWAP 失败，同时放量下跌。更符合什么机会？",
    options: ["Call", "Put", "不看方向", "追最便宜合约"],
    answer: 1,
    explain: "VWAP 下方反抽不过，再放量转弱，更符合 Put 方向，但仍要控制入场和止损。",
  },
];


const optionExecutionSteps = [
  {
    key: "Catalyst",
    cn: "事件驱动",
    title: "先问：为什么会涨 / 跌？",
    summary: "没有事件驱动，不做。期权最怕没有原因的波动，因为时间价值会持续流血。",
    rules: [
      "有明确消息、财报、评级、订单、政策或板块热点，才进入观察",
      "个股消息必须和板块、大盘方向共振，不能只看一条利好/利空",
      "没有原因的上涨或下跌，默认不做，宁愿错过也不乱买期权",
    ],
    example: "AMD利空 + 半导体走弱 + QQQ跌破VWAP = Put；NVDA利好 + AI板块强 + QQQ站上VWAP = Call。",
  },
  {
    key: "Direction",
    cn: "方向确认",
    title: "方向不是感觉，是多因素同向",
    summary: "期权方向必须来自消息、板块、大盘和价格结构的共同确认，而不是单纯看一根K线。",
    rules: [
      "做 Call：利好/热点 + 板块强 + 大盘不拖后腿 + 价格站上关键位",
      "做 Put：利空/弱势 + 板块弱 + 大盘转弱 + 价格跌破关键位",
      "如果盯盘半天还不知道做多做空，那就不是你的行情",
    ],
    example: "真正适合期权的行情，不应该让你纠结；纠结说明条件不完整。",
  },
  {
    key: "VWAP",
    cn: "日内分界",
    title: "VWAP 是日内多空边界线",
    summary: "VWAP 用来决定你优先找 Call 还是 Put，不是用来频繁猜顶底。",
    rules: [
      "价格在 VWAP 上方：只优先找 Call，不轻易逆势做 Put",
      "价格在 VWAP 下方：只优先找 Put，不轻易逆势做 Call",
      "反复穿 VWAP：不做，因为多空没有清晰控制权",
    ],
    example: "VWAP 附近反复拉扯，就是期权买方的消耗区。",
  },
  {
    key: "Volume",
    cn: "量能验证",
    title: "量能确认市场有没有真钱进来",
    summary: "期权最怕正股不动。没有量，就算方向看对，也可能因为时间价值衰减而亏。",
    rules: [
      "放量突破：可以考虑顺势进入",
      "缩量反弹：多半只是反抽，不要当成趋势",
      "放量跌破：优先观察 Put 机会",
      "无量横盘：期权买方地狱，宁愿不做",
    ],
    example: "没有量，不是不够刺激，而是期权合约没有足够的正股推动。",
  },
  {
    key: "Entry",
    cn: "入场框架",
    title: "最好的入场不是追最猛那根",
    summary: "期权日内最好的入场，通常是第一次放量确认、回踩失败，或突破 VWAP 后反抽不过。",
    rules: [
      "第一波放量站稳，可以小仓试错",
      "回踩 VWAP / 支撑不破，再做 Call 更稳",
      "跌破 VWAP 后反抽不过，再做 Put 更稳",
      "已经连续三四根大阳/大阴，不要追，容易吃反弹或回落",
    ],
    example: "你不需要吃完整段，只需要拿走中间最确定的一段。",
  },
  {
    key: "Exit",
    cn: "及时离场",
    title: "离场是期权真正的护城河",
    summary: "期权日内最爽的地方不是拿到终点，而是方向对的时候及时拿走利润。",
    rules: [
      "盈利 +20%：开始认真盯盘，不再幻想",
      "盈利 +30%–50%：优先落袋，至少保护利润",
      "盈利 +80%–100%：不要幻想，优先分批退出",
      "跌回 VWAP、量能衰退、方向失效：直接走",
    ],
    example: "期权要成为研究型交易工具，不是情绪发泄工具。",
  },
];



const preTradeChecks = [
  "当前价格不在区间中间，至少靠近边界 / FVG / OB / VWAP / 关键位",
  "这笔交易符合 9 个核心模型之一，而不是临时找理由",
  "已经明确止损位置，亏损金额可以接受",
  "没有处于连续亏损、回本冲动、烦躁追单状态",
  "黄金避开数据前后乱扫；期权确认大盘/板块/个股共振",
  "入场不是第一根冲动K，而是等待过确认或回踩",
];

const colorMap = {
  yellow: "border-amber-500 bg-amber-50 text-amber-950",
  amber: "border-orange-500 bg-orange-50 text-orange-950",
  red: "border-red-500 bg-red-50 text-red-950",
  blue: "border-sky-500 bg-sky-50 text-sky-950",
  cyan: "border-cyan-500 bg-cyan-50 text-cyan-950",
  green: "border-emerald-500 bg-emerald-50 text-emerald-950",
  orange: "border-amber-500 bg-amber-50 text-amber-950",
  purple: "border-violet-500 bg-violet-50 text-violet-950",
  rose: "border-rose-500 bg-rose-50 text-rose-950",
};

const statCards = [
  { label: "核心模型", value: "9", icon: Target, color: "bg-teal-600", bar: "bg-teal-600", shadow: "shadow-teal-100" },
  { label: "强制禁止模型", value: "2", icon: Ban, color: "bg-red-600", bar: "bg-red-600", shadow: "shadow-red-100" },
  { label: "开盘前训练", value: "每日", icon: Clock, color: "bg-sky-600", bar: "bg-sky-600", shadow: "shadow-sky-100" },
  { label: "强化做单逻辑", value: "肌肉记忆", icon: Brain, color: "bg-violet-600", bar: "bg-violet-600", shadow: "shadow-violet-100" },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ children, className = "" }) {
  return <div className={cn("border", className)}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Button({ children, className = "", variant = "default", type = "button", ...props }) {
  const variants = {
    default:
      "inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500/70",
    ghost:
      "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500/70",
  };

  return (
    <button type={type} className={cn(variants[variant] || variants.default, className)} {...props}>
      {children}
    </button>
  );
}

function Badge({ children, color = "yellow" }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${colorMap[color] || colorMap.yellow}`}>
      {children}
    </span>
  );
}

function SectionHeader({ number, title, desc, tone = "teal" }) {
  const toneMap = {
    teal: "from-teal-700 to-cyan-600",
    red: "from-red-700 to-rose-600",
    amber: "from-amber-700 to-orange-600",
    blue: "from-sky-700 to-cyan-600",
  };
  return (
    <div className="mb-5 flex items-start gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${toneMap[tone]} text-sm font-black text-white shadow-lg`}>
        {number}
      </div>
      <div>
        <h2 className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{title}</h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function StatCard({ item }) {
  const Icon = item.icon;
  return (
    <Card className={cn("relative overflow-hidden rounded-[1.6rem] border-slate-300 bg-white shadow-xl", item.shadow)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-black tracking-tight text-slate-950">{item.value}</div>
            <div className="mt-2 text-sm font-bold text-slate-600">{item.label}</div>
          </div>
          <div className={cn("rounded-2xl p-3 text-white shadow-md", item.color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
      <div className={cn("h-1.5 w-full", item.bar)} />
    </Card>
  );
}

function ChecklistItem({ text }) {
  return (
    <li className="flex gap-3 rounded-2xl border border-emerald-200 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <span>{text}</span>
    </li>
  );
}

function AvoidItem({ text }) {
  return (
    <li className="flex gap-3 rounded-2xl border border-red-200 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm">
      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
      <span>{text}</span>
    </li>
  );
}

function MetricCard({ label, value, tone = "slate", note }) {
  const toneMap = {
    teal: "border-teal-300 bg-teal-50 text-teal-950",
    red: "border-red-300 bg-red-50 text-red-950",
    amber: "border-amber-300 bg-amber-50 text-amber-950",
    sky: "border-sky-300 bg-sky-50 text-sky-950",
    violet: "border-violet-300 bg-violet-50 text-violet-950",
    slate: "border-slate-300 bg-slate-50 text-slate-950",
  };
  return (
    <div className={cn("rounded-2xl border p-4 shadow-sm", toneMap[tone] || toneMap.slate)}>
      <div className="text-xs font-black uppercase tracking-[0.14em] opacity-70">{label}</div>
      <div className="mt-2 text-lg font-black">{value}</div>
      {note && <div className="mt-1 text-xs font-bold leading-5 opacity-75">{note}</div>}
    </div>
  );
}

function OptionPriceCalculator() {
  const [mode, setMode] = useState("call");
  const [currentStock, setCurrentStock] = useState("520");
  const [targetStock, setTargetStock] = useState("521");
  const [optionPrice, setOptionPrice] = useState("1.80");
  const [delta, setDelta] = useState("0.55");
  const [contracts, setContracts] = useState("1");

  const current = Number(currentStock);
  const target = Number(targetStock);
  const option = Number(optionPrice);
  const deltaAbs = Math.abs(Number(delta));
  const contractCount = Math.max(1, Number(contracts) || 1);
  const isValid = [current, target, option, deltaAbs].every((num) => Number.isFinite(num));
  const stockMove = isValid ? (mode === "call" ? target - current : current - target) : 0;
  const optionMove = stockMove * deltaAbs;
  const projectedOption = Math.max(0, option + optionMove);
  const pnlPerContract = (projectedOption - option) * 100;
  const totalPnl = pnlPerContract * contractCount;
  const pnlPct = option > 0 ? ((projectedOption - option) / option) * 100 : 0;

  const inputClass = "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-black text-slate-950 shadow-inner outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100";
  const labelClass = "mb-2 block text-xs font-black uppercase tracking-[0.13em] text-slate-500";

  return (
    <div className="overflow-hidden rounded-[1.9rem] border-2 border-teal-700 bg-white shadow-xl shadow-teal-100">
      <div className="border-b border-teal-100 bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 px-5 py-4 text-white">
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Quick Calculator</div>
        <h3 className="mt-1 text-xl font-black">正股目标 → 期权目标价快捷计算</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-teal-50">
          用 Delta（德尔塔）做日内粗算：期权价格变化 ≈ 正股价格变化 × |Delta|。
        </p>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-300 bg-slate-50 p-2">
            <button
              onClick={() => setMode("call")}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-black transition",
                mode === "call" ? "bg-teal-700 text-white shadow-md" : "bg-white text-slate-700 hover:bg-teal-50"
              )}
            >
              Call 看涨
            </button>
            <button
              onClick={() => setMode("put")}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-black transition",
                mode === "put" ? "bg-red-700 text-white shadow-md" : "bg-white text-slate-700 hover:bg-red-50"
              )}
            >
              Put 看跌
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>当前正股价格</span>
              <input className={inputClass} value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} inputMode="decimal" />
            </label>
            <label>
              <span className={labelClass}>目标 / 止损正股价格</span>
              <input className={inputClass} value={targetStock} onChange={(e) => setTargetStock(e.target.value)} inputMode="decimal" />
            </label>
            <label>
              <span className={labelClass}>当前期权价格</span>
              <input className={inputClass} value={optionPrice} onChange={(e) => setOptionPrice(e.target.value)} inputMode="decimal" />
            </label>
            <label>
              <span className={labelClass}>Delta 绝对值</span>
              <input className={inputClass} value={delta} onChange={(e) => setDelta(e.target.value)} inputMode="decimal" />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClass}>合约张数</span>
              <input className={inputClass} value={contracts} onChange={(e) => setContracts(e.target.value)} inputMode="numeric" />
            </label>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-slate-300 bg-slate-50 p-4 shadow-inner">
          <div className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">即时结果</div>
          <div className="grid gap-3">
            <MetricCard
              label="正股方向幅度"
              value={`${stockMove >= 0 ? "+" : ""}${isValid ? stockMove.toFixed(2) : "--"}`}
              tone={stockMove >= 0 ? "teal" : "red"}
              note={mode === "call" ? "Call 需要正股上涨才增值" : "Put 需要正股下跌才增值"}
            />
            <MetricCard
              label="估算期权价格"
              value={isValid ? projectedOption.toFixed(2) : "--"}
              tone={projectedOption >= option ? "teal" : "red"}
              note={`当前 ${Number.isFinite(option) ? option.toFixed(2) : "--"} → 估算 ${isValid ? projectedOption.toFixed(2) : "--"}`}
            />
            <MetricCard
              label="估算盈亏"
              value={`${totalPnl >= 0 ? "+" : ""}${isValid ? totalPnl.toFixed(0) : "--"} 美元`}
              tone={totalPnl >= 0 ? "teal" : "red"}
              note={`${contractCount} 张；约 ${pnlPct >= 0 ? "+" : ""}${isValid ? pnlPct.toFixed(1) : "--"}%`}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-black leading-7 text-amber-950">
            这是日内近似计算，不包含 IV（隐含波动率）、Theta（时间价值衰减）、Gamma（加速度）和买卖价差。用于挂单参考，不是精确定价。
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionScanningModule() {
  const scanRules = [
    ["热门标的", "优先 SPY / QQQ；其次 NVDA / AMD / TSLA / META / AAPL / MSFT", "冷门股期权少碰"],
    ["平值附近", "ATM 平值优先；轻微 ITM 更稳；强趋势才考虑轻微 OTM", "深虚值不碰"],
    ["买卖价差", "0.01–0.03 极好；0.04–0.08 可用；0.10 附近谨慎", "0.20+ 不做"],
    ["成交量", "至少几百张；1000+ 较好；5000+ 很活跃", "0–50 直接不做"],
    ["盘口厚度", "Bid / Ask Size 最好几十张以上", "薄盘口进出都难"],
    ["Delta", "0.45–0.65 最适合你；0.60–0.75 更稳但成本高", "0.20 以下太彩票"],
    ["下单方式", "用中间价挂限价单，5–10秒不成交再微调", "不要市价追"],
    ["止盈止损", "+20% 开始盯盘；+30%–50% 优先落袋；-15%–25% 警惕/离场", "0DTE 更严格"],
  ];

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.95fr]">
      <div className="rounded-[1.8rem] border-2 border-slate-300 bg-white p-5 shadow-lg">
        <h3 className="text-lg font-black text-slate-950">期权一眼扫描规则</h3>
        <p className="mt-2 text-sm font-bold leading-7 text-slate-700">
          买之前先筛合约，再谈方向。成交量太低、点差太大、盘口太薄，都是一票否决。
        </p>
        <div className="mt-4 grid gap-3">
          {scanRules.map(([name, standard, reject], index) => (
            <div key={name} className="overflow-hidden rounded-2xl border border-slate-300 bg-slate-50 shadow-sm">
              <div className="grid gap-0 md:grid-cols-[130px_1fr_150px]">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-white p-3 md:border-b-0 md:border-r">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-xs font-black text-white">{index + 1}</span>
                  <span className="text-sm font-black text-slate-950">{name}</span>
                </div>
                <div className="border-b border-slate-200 p-3 text-sm font-semibold leading-6 text-slate-700 md:border-b-0 md:border-r">{standard}</div>
                <div className="bg-red-50 p-3 text-sm font-black leading-6 text-red-900">{reject}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <OptionPriceCalculator />
    </div>
  );
}

function OptionExecutionModule() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/80 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
      <SectionHeader
        number="03"
        title="期权执行与合约选择系统"
        desc="把日内期权压缩为：先筛合约，再判断方向，再用 Delta 估算目标价。"
        tone="blue"
      />

      <div className="mb-5 rounded-[1.6rem] border-2 border-teal-700 bg-gradient-to-br from-white via-teal-50 to-cyan-50 p-5 shadow-xl shadow-teal-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">Options Execution Framework</div>
            <h3 className="mt-2 text-2xl font-black text-slate-950">五步执行法：Catalyst → Direction → VWAP → Volume → Exit</h3>
            <p className="mt-3 max-w-4xl text-sm font-semibold leading-7 text-slate-700">
              中文就是：事件驱动、方向确认、VWAP 分界、量能验证、及时离场。期权不是看到股票涨就买 Call，而是先判断这张期权好不好进、好不好出、涨不涨得动。
            </p>
          </div>
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-black leading-7 text-red-900 shadow-md">
            先筛合约，再谈方向。先看流动性，再看利润。用 Delta 估算目标，用限价单进出。
          </div>
        </div>
      </div>

      <OptionScanningModule />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {optionExecutionSteps.map((step, index) => (
          <div key={step.key} className="overflow-hidden rounded-[1.7rem] border border-slate-300 bg-white shadow-lg shadow-slate-200/70">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Step {String(index + 1).padStart(2, "0")}</div>
                <div className="mt-1 text-lg font-black text-slate-950">{step.key} <span className="text-teal-700">{step.cn}</span></div>
              </div>
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black text-white shadow-md", index === 5 ? "bg-red-700" : "bg-teal-700")}> 
                {index + 1}
              </div>
            </div>
            <div className="p-5">
              <h4 className="text-base font-black leading-7 text-slate-950">{step.title}</h4>
              <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{step.summary}</p>
              <ul className="mt-4 space-y-2">
                {step.rules.map((rule) => (
                  <li key={rule} className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm font-black leading-6 text-amber-950">
                {step.example}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.6rem] border-2 border-slate-300 bg-white p-5 shadow-md">
          <h3 className="text-lg font-black text-slate-950">期权执行纪律</h3>
          <div className="mt-4 grid gap-2 text-sm font-bold leading-7 text-slate-800 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3">每天最多 1–3 单</div>
            <div className="rounded-2xl bg-slate-50 p-3">单笔只用账户 5%–10% 以内</div>
            <div className="rounded-2xl bg-slate-50 p-3">优先 ATM 平值 / 轻微 ITM</div>
            <div className="rounded-2xl bg-slate-50 p-3">Delta 0.45–0.65 优先</div>
            <div className="rounded-2xl bg-slate-50 p-3">盈利 +30%–50% 优先落袋</div>
            <div className="rounded-2xl bg-slate-50 p-3">亏损 -15%–25% 警惕离场</div>
          </div>
        </div>
        <div className="rounded-[1.6rem] border-2 border-red-300 bg-red-50 p-5 shadow-md shadow-red-100">
          <h3 className="text-lg font-black text-red-950">期权禁止交易提醒</h3>
          <p className="mt-3 text-sm font-bold leading-7 text-red-900">
            成交量太低，不买。点差太大，不买。盘口太薄，不买。正股围绕 VWAP 来回穿，不买。只是想证明自己，更不能买。
          </p>
          <div className="mt-4 rounded-2xl border border-red-300 bg-white p-4 text-base font-black leading-8 text-slate-950">
            股票涨，不代表期权好买；期权要买“会动、有人接、点差小”的那张。
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TradingModelTrainingSystem() {
  const [marketFilter, setMarketFilter] = useState("全部");
  const [selectedId, setSelectedId] = useState(models[0].id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);

  const markets = ["全部", "黄金 XAUUSD", "EURUSD", "美股期权", "全市场"];

  const filteredModels = useMemo(() => {
    if (marketFilter === "全部") return models;
    return models.filter((model) => model.market === marketFilter);
  }, [marketFilter]);

  const selectedModel = models.find((model) => model.id === selectedId) || models[0];
  const question = trainingQuestions[questionIndex];

  function nextQuestion() {
    setSelectedAnswer(null);
    setQuestionIndex((prev) => (prev + 1) % trainingQuestions.length);
  }

  function toggleCheck(index) {
    setCheckedItems((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    );
  }

  const allPreTradeChecked = checkedItems.length === preTradeChecks.length;

  return (
    <div className="min-h-screen bg-[#EAF1F4] text-slate-950">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-100 via-teal-50 to-transparent" />
      <div className="pointer-events-none fixed left-6 top-24 h-64 w-64 rounded-full bg-teal-200/35 blur-3xl" />
      <div className="pointer-events-none fixed right-10 top-44 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 overflow-hidden rounded-[2.2rem] border border-slate-300 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.14)] ring-1 ring-white md:p-8"
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-teal-700 via-cyan-500 to-sky-600" />
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge color="cyan">交易模型训练系统 v1.0</Badge>
                <Badge color="red">先风控，后机会</Badge>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                黄金 / EUR / 期权高胜率形态强化面板
              </h1>
              <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-slate-700 md:text-base">
                每天只训练少数真正值得做的模型：扫流动性、FVG + OB、趋势回踩、区间边界、期权五步执行法、板块龙头、大盘共振，以及最重要的禁止交易条件。
              </p>
            </div>
            <div className="rounded-[1.6rem] border-2 border-red-300 bg-gradient-to-br from-red-50 to-white p-5 shadow-xl shadow-red-100">
              <div className="flex items-center gap-3 text-red-700">
                <div className="rounded-2xl bg-red-600 p-2 text-white shadow-md">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <span className="text-lg font-black">今日默认规则</span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">
                没有完整信号，不开单。连续亏损两笔，强制暂停。想回本的时候，所有技术判断自动降级。
              </p>
            </div>
          </div>
        </motion.header>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {statCards.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </div>

        <section className="mb-8 rounded-[2.2rem] border border-slate-300 bg-white/70 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.10)] ring-1 ring-white md:p-6">
          <SectionHeader number="01" title="模型库导航" desc="先选择今天要强化的市场和形态，不要把所有机会都当成机会。" />

          <div className="mb-6 flex flex-wrap gap-2 rounded-3xl border border-slate-300 bg-slate-50/90 p-2 shadow-inner">
            {markets.map((market) => (
              <Button
                key={market}
                onClick={() => setMarketFilter(market)}
                variant="ghost"
                className={`rounded-2xl border px-4 ${
                  marketFilter === market
                    ? "border-teal-800 bg-teal-700 text-white shadow-lg shadow-teal-300"
                    : "border-slate-300 bg-white text-slate-700 shadow-sm hover:border-teal-500 hover:bg-teal-50"
                }`}
              >
                {market}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="rounded-[1.8rem] border border-slate-300 bg-slate-50 p-3 shadow-inner">
              <div className="mb-3 px-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Model Index</div>
              <div className="space-y-3">
                {filteredModels.map((model, index) => {
                  const Icon = model.icon;
                  const active = selectedId === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedId(model.id)}
                      className={`relative w-full overflow-hidden rounded-3xl border p-4 text-left transition ${
                        active
                          ? "border-teal-700 bg-white shadow-xl shadow-teal-200 ring-2 ring-teal-100"
                          : "border-slate-300 bg-white/80 shadow-sm hover:border-teal-400 hover:bg-white hover:shadow-md"
                      }`}
                    >
                      <div className={`absolute inset-y-0 left-0 w-1.5 ${active ? "bg-teal-700" : "bg-slate-200"}`} />
                      <div className="flex items-start gap-3 pl-2">
                        <div className={`rounded-2xl border p-3 shadow-sm ${colorMap[model.color]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <span>•</span>
                            <span>{model.market}</span>
                          </div>
                          <h3 className="mt-2 font-black text-slate-950">{model.title}</h3>
                          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-600">
                            {model.summary}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div
              key={selectedModel.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-[2rem] border-2 border-teal-700 bg-white shadow-[0_28px_90px_rgba(13,148,136,0.18)] ring-4 ring-teal-100"
            >
              <div className="h-2 bg-gradient-to-r from-teal-700 via-cyan-500 to-sky-600" />
              <div className="p-5 md:p-6">
                <SectionHeader number="02" title="当前模型拆解" desc="只看成立条件、禁止条件、入场和出场；不临场发明新逻辑。" />

                <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_300px]">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge color={selectedModel.color}>{selectedModel.market}</Badge>
                      <Badge color={selectedModel.color}>{selectedModel.level}</Badge>
                      <Badge color={selectedModel.color}>{selectedModel.direction}</Badge>
                    </div>
                    <h2 className="text-2xl font-black text-slate-950 md:text-3xl">{selectedModel.title}</h2>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">{selectedModel.summary}</p>
                  </div>
                  <div className="rounded-[1.4rem] border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-4 shadow-lg shadow-amber-100">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">核心口令</div>
                    <div className="mt-3 text-lg font-black leading-8 text-amber-950">{selectedModel.mantra}</div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.6rem] border-2 border-emerald-300 bg-emerald-50 p-4 shadow-lg shadow-emerald-100/70">
                    <h3 className="mb-3 flex items-center gap-2 font-black text-emerald-950">
                      <CheckCircle2 className="h-5 w-5" /> 成立条件
                    </h3>
                    <ul className="space-y-2">
                      {selectedModel.conditions.map((item) => (
                        <ChecklistItem key={item} text={item} />
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.6rem] border-2 border-red-300 bg-red-50 p-4 shadow-lg shadow-red-100/70">
                    <h3 className="mb-3 flex items-center gap-2 font-black text-red-950">
                      <XCircle className="h-5 w-5" /> 禁止条件
                    </h3>
                    <ul className="space-y-2">
                      {selectedModel.avoid.map((item) => (
                        <AvoidItem key={item} text={item} />
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.6rem] border border-slate-300 bg-slate-50 p-5 shadow-sm">
                    <div className="mb-3 h-1 w-16 rounded-full bg-teal-700" />
                    <h3 className="mb-2 font-black text-slate-950">入场参考</h3>
                    <p className="text-sm font-semibold leading-7 text-slate-700">{selectedModel.entry}</p>
                  </div>
                  <div className="rounded-[1.6rem] border border-slate-300 bg-slate-50 p-5 shadow-sm">
                    <div className="mb-3 h-1 w-16 rounded-full bg-sky-600" />
                    <h3 className="mb-2 font-black text-slate-950">出场参考</h3>
                    <p className="text-sm font-semibold leading-7 text-slate-700">{selectedModel.exit}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <OptionExecutionModule />

        <section className="mb-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[2.2rem] border-slate-300 bg-white p-1 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <CardContent className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-white to-teal-50 p-5 md:p-6">
              <SectionHeader number="04" title="开单前 10 秒检查" desc="这里不是复盘，是开单前的刹车。全部通过，才进入执行。" />
              <div className="mb-5 overflow-hidden rounded-[1.7rem] border-2 border-slate-300 bg-white shadow-lg">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Traffic Light Gate</div>
                    <div className="mt-1 text-sm font-black text-slate-950">开单通行灯：{checkedItems.length} / {preTradeChecks.length} 已点亮</div>
                  </div>
                  <div
                    className={`rounded-full border-2 px-4 py-2 text-xs font-black shadow-sm ${
                      allPreTradeChecked
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-emerald-200"
                        : "border-red-500 bg-red-50 text-red-800 shadow-red-100"
                    }`}
                  >
                    {allPreTradeChecked ? "全部绿灯 · 可以进入执行" : "红灯未清 · 禁止开单"}
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2 p-4">
                  {preTradeChecks.map((_, index) => {
                    const checked = checkedItems.includes(index);
                    return (
                      <button
                        key={index}
                        onClick={() => toggleCheck(index)}
                        aria-label={`检查项 ${index + 1}`}
                        className={`h-5 rounded-full border-2 transition ${
                          checked
                            ? "border-emerald-700 bg-emerald-500 shadow-lg shadow-emerald-200"
                            : "border-red-400 bg-red-100 shadow-inner"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                {preTradeChecks.map((item, index) => {
                  const checked = checkedItems.includes(index);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleCheck(index)}
                      className={`group relative flex w-full items-stretch overflow-hidden rounded-[1.35rem] border-2 text-left transition ${
                        checked
                          ? "border-emerald-700 bg-emerald-500 text-white shadow-xl shadow-emerald-200 ring-4 ring-emerald-100"
                          : "border-red-300 bg-white text-slate-800 shadow-md hover:border-red-500 hover:bg-red-50"
                      }`}
                    >
                      <div
                        className={`flex w-16 shrink-0 items-center justify-center border-r-2 ${
                          checked ? "border-emerald-300 bg-emerald-700" : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-md ${
                            checked
                              ? "border-white bg-white text-emerald-700"
                              : "border-red-400 bg-red-100 text-red-600"
                          }`}
                        >
                          {checked ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        </div>
                      </div>
                      <div className="flex flex-1 items-center justify-between gap-4 p-4">
                        <span className={`text-sm font-black leading-6 ${checked ? "text-white" : "text-slate-900"}`}>{item}</span>
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${
                            checked
                              ? "border-white/60 bg-white/20 text-white"
                              : "border-red-300 bg-red-100 text-red-800"
                          }`}
                        >
                          {checked ? "绿灯" : "红灯"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div
                className={`mt-5 rounded-[1.5rem] border-2 p-5 text-sm font-black leading-7 shadow-lg ${
                  allPreTradeChecked
                    ? "border-emerald-700 bg-emerald-600 text-white shadow-emerald-200"
                    : "border-red-500 bg-red-50 text-red-900 shadow-red-100"
                }`}
              >
                {allPreTradeChecked
                  ? "绿灯全亮：可以进入下一步。只按计划执行，不能临场扩大仓位。"
                  : "红灯未清：暂不允许交易。必须全部点亮，才允许进入执行。"}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.2rem] border-slate-300 bg-white p-1 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <CardContent className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-5 md:p-6">
              <SectionHeader number="05" title="模型优先级顺序" desc="每次判断都按这个顺序来，不能直接从看到信号跳到我要开单。" tone="blue" />
              <div className="space-y-3">
                {[
                  ["01", "市场环境", "趋势、震荡、新闻盘、垃圾盘，先判断能不能做。", "bg-teal-700"],
                  ["02", "关键位置", "边界、FVG、OB、VWAP、前高前低，中间位置默认不做。", "bg-sky-700"],
                  ["03", "触发确认", "长影线收回、回踩不破、放量突破、板块共振。", "bg-violet-700"],
                  ["04", "风险执行", "止损、仓位、最大亏损、连续亏损规则必须先定。", "bg-red-700"],
                ].map(([num, title, desc, color]) => (
                  <div key={num} className="relative overflow-hidden rounded-2xl border border-slate-300 bg-white p-4 shadow-md">
                    <div className={cn("absolute inset-y-0 left-0 w-1.5", color)} />
                    <div className="flex items-center gap-3 pl-2">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-md", color)}>
                        {num}
                      </div>
                      <div>
                        <div className="font-black text-slate-950">{title}</div>
                        <div className="mt-1 text-sm font-semibold leading-6 text-slate-700">{desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[2.2rem] border-slate-300 bg-white p-1 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <CardContent className="rounded-[2rem] border border-slate-200 bg-white p-5 md:p-6">
              <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <SectionHeader number="06" title="每日形态判断训练" desc="目的不是答题，而是把能不能做练成条件反射。" tone="amber" />
                <Button
                  onClick={nextQuestion}
                  className="w-full shrink-0 rounded-full bg-teal-700 text-white shadow-lg shadow-teal-200 hover:bg-teal-800 sm:w-auto"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> 换一题
                </Button>
              </div>

              <div className="rounded-[1.8rem] border border-slate-300 bg-slate-50 p-5 shadow-inner">
                <h3 className="text-lg font-black leading-8 text-slate-950">{question.question}</h3>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {question.options.map((option, index) => {
                    const chosen = selectedAnswer === index;
                    const correct = selectedAnswer !== null && index === question.answer;
                    const wrong = chosen && index !== question.answer;
                    return (
                      <button
                        key={option}
                        onClick={() => setSelectedAnswer(index)}
                        className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                          correct
                            ? "border-emerald-500 bg-emerald-100 text-emerald-950 shadow-md"
                            : wrong
                              ? "border-red-500 bg-red-100 text-red-950 shadow-md"
                              : "border-slate-300 bg-white text-slate-800 shadow-sm hover:border-teal-500 hover:bg-teal-50"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 shadow-md"
                  >
                    <div className="font-black text-amber-900">
                      {selectedAnswer === question.answer ? "判断正确" : "判断错误"}
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{question.explain}</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.2rem] border-2 border-red-300 bg-red-50 p-1 shadow-[0_24px_70px_rgba(220,38,38,0.16)]">
            <CardContent className="rounded-[2rem] border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 md:p-6">
              <SectionHeader number="07" title="强制停手系统" desc="触发任意一项，停止交易；这不是错过机会，是避免灾难。" tone="red" />
              <div className="space-y-3">
                {[
                  "连续亏损 2 笔",
                  "想靠一单回本",
                  "价格在区间中间",
                  "黄金上下影线乱扫",
                  "数据公布前后 15 分钟",
                  "期权买卖价差过大",
                  "没有提前确定止损",
                  "只是因为感觉要涨/跌",
                ].map((item) => (
                  <div key={item} className="relative overflow-hidden rounded-2xl border border-red-300 bg-white p-4 shadow-md">
                    <div className="absolute inset-y-0 left-0 w-1.5 bg-red-600" />
                    <div className="flex items-center gap-3 pl-2">
                      <Ban className="h-4 w-4 shrink-0 text-red-600" />
                      <span className="text-sm font-black text-slate-850">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border-2 border-red-500 bg-red-100 p-4 text-sm font-black leading-7 text-red-950 shadow-md">
                触发任意一项，都不是错过机会，而是在避免灾难。交易最强的能力，是知道什么时候不交易。
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
