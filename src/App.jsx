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
  yellow: "border-amber-500 bg-amber-100 text-amber-950",
  amber: "border-orange-500 bg-orange-100 text-orange-950",
  red: "border-red-500 bg-red-100 text-red-950",
  blue: "border-sky-500 bg-sky-100 text-sky-950",
  cyan: "border-cyan-500 bg-cyan-100 text-cyan-950",
  green: "border-emerald-500 bg-emerald-100 text-emerald-950",
  orange: "border-amber-500 bg-amber-100 text-amber-950",
  purple: "border-violet-500 bg-violet-100 text-violet-950",
  rose: "border-rose-500 bg-rose-100 text-rose-950",
};

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
      "inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-400/70",
    ghost:
      "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-400/70",
  };

  return (
    <button type={type} className={cn(variants[variant] || variants.default, className)} {...props}>
      {children}
    </button>
  );
}

function Badge({ children, color = "yellow" }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${colorMap[color] || colorMap.yellow}`}>
      {children}
    </span>
  );
}

function ChecklistItem({ text }) {
  return (
    <li className="flex gap-2 text-sm font-medium text-slate-800">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <span>{text}</span>
    </li>
  );
}

function AvoidItem({ text }) {
  return (
    <li className="flex gap-2 text-sm font-medium text-slate-800">
      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
      <span>{text}</span>
    </li>
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
    <div className="min-h-screen bg-[#EEF4F7] text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 overflow-hidden rounded-[2rem] border border-slate-300 bg-white p-6 shadow-2xl shadow-slate-300/70 ring-1 ring-white md:p-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge color="cyan">交易模型训练系统 v1.0</Badge>
                <Badge color="red">先风控，后机会</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
                黄金 / EUR / 期权高胜率形态强化面板
              </h1>
              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-700 md:text-base">
                每天只训练少数真正值得做的模型：扫流动性、FVG + OB、趋势回踩、区间边界、期权大盘共振、板块龙头，以及最重要的禁止交易条件。
              </p>
            </div>
            <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 shadow-md shadow-red-100 md:w-80">
              <div className="flex items-center gap-2 text-red-700">
                <ShieldAlert className="h-5 w-5" />
                <span className="font-medium">今日默认规则</span>
              </div>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                没有完整信号，不开单。连续亏损两笔，强制暂停。想回本的时候，所有技术判断自动降级。
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="rounded-3xl border-slate-300 bg-white shadow-xl shadow-slate-300/60">
            <CardContent className="p-5">
              <Target className="mb-3 h-6 w-6 text-teal-700" />
              <div className="text-2xl font-bold text-slate-950">9</div>
              <div className="text-sm font-medium text-slate-600">核心模型</div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-slate-300 bg-white shadow-xl shadow-slate-300/60">
            <CardContent className="p-5">
              <Ban className="mb-3 h-6 w-6 text-red-600" />
              <div className="text-2xl font-bold text-slate-950">2</div>
              <div className="text-sm font-medium text-slate-600">强制禁止模型</div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-slate-300 bg-white shadow-xl shadow-slate-300/60">
            <CardContent className="p-5">
              <Clock className="mb-3 h-6 w-6 text-sky-600" />
              <div className="text-2xl font-bold text-slate-950">每日</div>
              <div className="text-sm font-medium text-slate-600">开盘前训练</div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-slate-300 bg-white shadow-xl shadow-slate-300/60">
            <CardContent className="p-5">
              <Brain className="mb-3 h-6 w-6 text-violet-600" />
              <div className="text-2xl font-bold text-slate-950">肌肉记忆</div>
              <div className="text-sm font-medium text-slate-600">强化做单逻辑</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {markets.map((market) => (
            <Button
              key={market}
              onClick={() => setMarketFilter(market)}
              variant="ghost"
              className={`rounded-full border px-4 ${
                marketFilter === market
                  ? "border-teal-800 bg-teal-700 text-white shadow-lg shadow-teal-300"
                  : "border-slate-300 bg-white text-slate-700 shadow-sm hover:border-teal-400 hover:bg-teal-50"
              }`}
            >
              {market}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.4fr]">
          <div className="space-y-3">
            {filteredModels.map((model) => {
              const Icon = model.icon;
              const active = selectedId === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedId(model.id)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${
                    active
                      ? "border-teal-700 bg-white shadow-xl shadow-teal-200 ring-2 ring-teal-100"
                      : "border-slate-300 bg-white shadow-sm hover:border-teal-400 hover:bg-teal-50/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-2xl border p-3 ${colorMap[model.color]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <Badge color={model.color}>{model.market}</Badge>
                        <Badge color={model.color}>{model.category}</Badge>
                      </div>
                      <h3 className="mt-3 font-bold text-slate-950">{model.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-700">
                        {model.summary}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <motion.div
            key={selectedModel.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-[2rem] border border-slate-300 bg-white p-5 shadow-2xl shadow-slate-300/70 ring-1 ring-white md:p-6"
          >
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge color={selectedModel.color}>{selectedModel.market}</Badge>
                  <Badge color={selectedModel.color}>{selectedModel.level}</Badge>
                  <Badge color={selectedModel.color}>{selectedModel.direction}</Badge>
                </div>
                <h2 className="text-2xl font-bold text-slate-950 md:text-3xl">{selectedModel.title}</h2>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-700">{selectedModel.summary}</p>
              </div>
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 shadow-sm md:w-72">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">核心口令</div>
                <div className="mt-2 text-lg font-bold text-amber-900">{selectedModel.mantra}</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-400 bg-white p-4 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="h-5 w-5" /> 成立条件
                </h3>
                <ul className="space-y-2">
                  {selectedModel.conditions.map((item) => (
                    <ChecklistItem key={item} text={item} />
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-red-400 bg-red-50 p-4 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-red-900">
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
              <div className="rounded-3xl border border-slate-300 bg-slate-50 p-4 shadow-sm">
                <h3 className="mb-2 font-bold text-slate-950">入场参考</h3>
                <p className="text-sm font-medium leading-7 text-slate-700">{selectedModel.entry}</p>
              </div>
              <div className="rounded-3xl border border-slate-300 bg-slate-50 p-4 shadow-sm">
                <h3 className="mb-2 font-bold text-slate-950">出场参考</h3>
                <p className="text-sm font-medium leading-7 text-slate-700">{selectedModel.exit}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[2rem] border-slate-300 bg-white shadow-2xl shadow-slate-300/70">
            <CardContent className="p-5 md:p-6">
              <h2 className="text-2xl font-bold text-slate-950">开单前 10 秒检查</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                这里不是复盘，是开单前的刹车。全部通过，才进入执行；任意一项没过，就先不碰鼠标。
              </p>
              <div className="mt-5 space-y-3">
                {preTradeChecks.map((item, index) => {
                  const checked = checkedItems.includes(index);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleCheck(index)}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                        checked
                          ? "border-teal-700 bg-teal-50 text-teal-950 shadow-sm ring-1 ring-teal-100"
                          : "border-slate-300 bg-white text-slate-800 hover:border-teal-400 hover:bg-teal-50"
                      }`}
                    >
                      <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${checked ? "text-teal-600" : "text-slate-400"}`} />
                      <span className="text-sm leading-6">{item}</span>
                    </button>
                  );
                })}
              </div>
              <div
                className={`mt-5 rounded-2xl border p-4 text-sm leading-7 ${
                  allPreTradeChecked
                    ? "border-teal-300 bg-teal-50 text-teal-800"
                    : "border-amber-300 bg-amber-50 text-amber-800"
                }`}
              >
                {allPreTradeChecked
                  ? "可以进入下一步：只按计划执行，不能临场扩大仓位。"
                  : "暂不允许交易：先把条件补齐，别让感觉替你下单。"}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-300 bg-white shadow-2xl shadow-slate-300/70">
            <CardContent className="p-5 md:p-6">
              <h2 className="text-2xl font-bold text-slate-950">模型优先级顺序</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                每次判断都按这个顺序来，不能直接从“看到信号”跳到“我要开单”。
              </p>
              <div className="mt-5 space-y-3">
                {[
                  ["01", "市场环境", "趋势、震荡、新闻盘、垃圾盘，先判断能不能做。"],
                  ["02", "关键位置", "边界、FVG、OB、VWAP、前高前低，中间位置默认不做。"],
                  ["03", "触发确认", "长影线收回、回踩不破、放量突破、板块共振。"],
                  ["04", "风险执行", "止损、仓位、最大亏损、连续亏损规则必须先定。"],
                ].map(([num, title, desc]) => (
                  <div key={num} className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-200 bg-teal-600 text-sm font-semibold text-white">
                        {num}
                      </div>
                      <div>
                        <div className="font-bold text-slate-950">{title}</div>
                        <div className="mt-1 text-sm font-medium leading-6 text-slate-700">{desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[2rem] border-slate-300 bg-white shadow-2xl shadow-slate-300/70">
            <CardContent className="p-5 md:p-6">
              <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">每日形态判断训练</h2>
                  <p className="mt-2 text-sm text-slate-600">目的不是答题，而是把“能不能做”练成条件反射。</p>
                </div>
                <Button
                  onClick={nextQuestion}
                  className="w-full rounded-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> 换一题
                </Button>
              </div>

              <div className="rounded-3xl border border-slate-300 bg-slate-50 p-5">
                <h3 className="text-lg font-bold leading-8 text-slate-950">{question.question}</h3>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {question.options.map((option, index) => {
                    const chosen = selectedAnswer === index;
                    const correct = selectedAnswer !== null && index === question.answer;
                    const wrong = chosen && index !== question.answer;
                    return (
                      <button
                        key={option}
                        onClick={() => setSelectedAnswer(index)}
                        className={`rounded-2xl border p-4 text-left text-sm transition ${
                          correct
                            ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                            : wrong
                              ? "border-red-400 bg-red-100 text-red-900"
                              : "border-slate-300 bg-white text-slate-800 hover:border-teal-400 hover:bg-teal-50"
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
                    className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4"
                  >
                    <div className="font-medium text-amber-800">
                      {selectedAnswer === question.answer ? "判断正确" : "判断错误"}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{question.explain}</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-2 border-red-300 bg-red-50 shadow-2xl shadow-red-200/70">
            <CardContent className="p-5 md:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-red-900">
                <ShieldAlert className="h-6 w-6" /> 强制停手清单
              </h2>
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
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-red-300 bg-white p-3 shadow-sm">
                    <Ban className="h-4 w-4 shrink-0 text-red-600" />
                    <span className="text-sm font-medium text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border-2 border-red-400 bg-red-100 p-4 text-sm font-semibold leading-7 text-red-900">
                触发任意一项，都不是错过机会，而是在避免灾难。交易最强的能力，是知道什么时候不交易。
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
