import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowRight, Ban, BarChart3, Brain,
  CheckCircle2, ChevronRight, Clock, Gauge, Layers, LineChart,
  ShieldAlert, Target, TrendingUp, XCircle, Zap, Globe, Lock,
  BookOpen, BarChart2, Flame,
} from "lucide-react";

/* ─── utility ─── */
function cn(...c) { return c.filter(Boolean).join(" "); }

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
function SectionHeader({ number, title, desc, tone = "teal" }) {
  const m = { teal:"from-teal-700 to-cyan-600", blue:"from-sky-700 to-blue-600", red:"from-red-700 to-rose-600", amber:"from-amber-700 to-orange-600", violet:"from-violet-700 to-fuchsia-600", slate:"from-slate-800 to-slate-600", green:"from-emerald-700 to-teal-600" };
  return (
    <div className="mb-5 flex items-start gap-4">
      <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-base font-black text-white shadow-lg", m[tone])}>{number}</div>
      <div><h2 className="text-2xl font-black tracking-tight text-slate-50">{title}</h2><p className="mt-1 max-w-4xl text-sm font-bold leading-7 text-slate-400">{desc}</p></div>
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
function FlowCard({ title, badge, tone = "teal", items = [] }) {
  const barColor = { teal:"bg-teal-700", blue:"bg-sky-700", amber:"bg-amber-600", red:"bg-red-700", violet:"bg-violet-700", green:"bg-emerald-700", slate:"bg-slate-700" };
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden rounded-[1.7rem] border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        <div className={cn("section-accent-bar h-2", barColor[tone] || "bg-slate-700")} />
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-2"><Badge tone={tone}>{badge}</Badge><Target className="h-5 w-5 text-slate-500" /></div>
          <h3 className="text-lg font-black leading-7 text-slate-50">{title}</h3>
          <div className="mt-4 grid gap-2">{items.map((item) => <RuleCard key={item.label} {...item} />)}</div>
        </div>
      </Card>
    </motion.div>
  );
}
function VisualMeter({ label, left, right, fill = 50, tone = "teal", note }) {
  const [hovered, setHovered] = useState(false);
  const theme = { teal:{base:"bg-teal-500",soft:"bg-teal-400/30",dot:"border-teal-300/25 bg-teal-500 shadow-[0_0_18px_rgba(13,148,136,0.65)]"}, red:{base:"bg-red-500",soft:"bg-red-400/25",dot:"border-red-300/35 bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.65)]"}, amber:{base:"bg-amber-500",soft:"bg-amber-300/30",dot:"border-amber-100 bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.65)]"}, blue:{base:"bg-sky-500",soft:"bg-sky-300/30",dot:"border-sky-100 bg-sky-500 shadow-[0_0_18px_rgba(14,165,233,0.65)]"}, violet:{base:"bg-violet-500",soft:"bg-violet-300/30",dot:"border-violet-100 bg-violet-500 shadow-[0_0_18px_rgba(139,92,246,0.65)]"}, green:{base:"bg-emerald-500",soft:"bg-emerald-300/30",dot:"border-emerald-100 bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.65)]"} }[tone] || {};
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="flex items-center justify-between text-xs font-black text-slate-500"><span>{label}</span><span>{note}</span></div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/10">
        <div className={cn("h-full rounded-full", theme.soft)} style={{ width: `${fill}%` }} />
        <motion.div className={cn("-mt-3 h-3 rounded-full", theme.base)} initial={false} animate={{ width: hovered ? `${fill}%` : "0%" }} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }} />
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
          <div className="relative flex items-center">
            <div className={cn("relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 text-sm font-black text-white", dot)}>{i + 1}</div>
            {i < steps.length - 1 && <div className={cn("absolute left-9 top-4 h-0.5 w-full md:block hidden bg-amber-600/30")} style={{ width: "calc(100% + 1rem)" }} />}
          </div>
          <div className="pb-4 md:pb-0 md:px-2"><div className="text-sm font-black text-slate-50">{s.title}</div><div className="mt-1 text-xs font-bold leading-5 text-slate-400">{s.text}</div></div>
        </div>
      ))}
    </div>
  );
}
function HeatBar({ rows }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">日内时间热力 (ET)</div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="rounded-xl bg-slate-800/50 border border-slate-700/40 px-3 py-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black text-slate-200">{r.label}</span>
              <span className={cn("text-[10px] font-black rounded-full px-2 py-0.5", r.status === "优先" ? "bg-emerald-900/60 text-emerald-300" : r.status === "禁做" ? "bg-red-900/60 text-red-300" : "bg-amber-900/50 text-amber-300")}>{r.status}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden mb-1"><div className={cn("h-full rounded-full", r.barColor)} style={{ width: `${r.fill}%` }} /></div>
            <div className="text-[10px] text-slate-500 font-bold">{r.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function KillZoneBoard({ items }) {
  return (
    <div className="rounded-[1.6rem] border-2 border-amber-300/35 bg-amber-950/20 p-4 shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2"><KeyWord tone="amber">Kill Zone</KeyWord><span className="text-sm font-black text-amber-100">时间过滤优先于普通信号</span></div>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon || CheckCircle2;
          return (
            <motion.div key={item.title} whileHover={{ y: -4, scale: 1.01 }} className={cn("rounded-[1.5rem] border p-4 shadow-sm", item.cls)}>
              <div className="flex items-center gap-2 mb-2"><Icon className={cn("h-5 w-5", item.iconCls)} /><div className="text-base font-black text-slate-50">{item.title}</div></div>
              <div className="text-sm font-black leading-6 text-slate-200">{item.text}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── DATA ─── */
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
  { n:"01", title:"VWAP方向", desc:"价格明确站上/下VWAP，不在VWAP附近反复横跳" },
  { n:"02", title:"EMA趋势", desc:"9EMA在21EMA上/下方，且两线发散（不粘合、不频繁交叉）" },
  { n:"03", title:"成交量", desc:"当前量 > 前5根K线平均量 × 1.5倍（三者缺一不可）" },
  { n:"04", title:"时间窗口", desc:"09:45–11:30 ET（开盘15分钟后至11:30），缺一不可" },
];
const preMarketItems = [
  { text:"今天有无美联储讲话或重大经济数据发布？", warn:"有→降低预期或跳过当天" },
  { text:"VIX是否高于25？", warn:"是→期权成本贵，缩仓或跳过" },
  { text:"QQQ的IV Rank是否高于50%？", warn:"是→需更大方向移动才盈利，提高目标或缩仓" },
  { text:"昨日QQQ收盘方向 + 今日开盘缺口情况？", warn:"与趋势一致优先；反向缺口谨慎" },
];
const journalFields = [
  { field:"日期时间", example:"2025-01-15  09:52" },
  { field:"标的", example:"QQQ" },
  { field:"方向", example:"Call / Put" },
  { field:"进场理由", example:"VWAP上方+9>21EMA发散+放量" },
  { field:"情绪状态", example:"平静 / 焦虑 / 冲动 / 报复" },
  { field:"满足全部铁律？", example:"是 / 否（写出哪条未满足）" },
  { field:"结果盈亏", example:"+$35" },
  { field:"一句话总结", example:"等到确认才进，做对了" },
];
const matrix = [
  { name:"美股期权", role:"当前核心", tone:"teal", core:"方向 + 时间 + 波动率", do:"IVR低时买方，IVR高时价差", ban:"0DTE常态 / 开盘即进 / 超仓" },
  { name:"黄金 XAU/USD", role:"外汇主战①", tone:"amber", core:"宏观驱动 + SMC结构", do:"扫单收回 + 结构确认", ban:"DXY与实际利率双向反转时" },
  { name:"EUR/USD", role:"外汇主战②", tone:"blue", core:"趋势强度 + 结构回踩", do:"EMA顺排回踩确认", ban:"均线缠绕 / ADX低 / 数据前后" },
  { name:"美股正股", role:"低频配置", tone:"violet", core:"基本面锚 + 技术择时", do:"先筛公司，再等位置", ban:"纯K线冲动 / 追热点" },
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
  { title:"流动性扫单收回", badge:"黄金 A1", tone:"amber", items:[
    { label:"场景", text:"扫前高/前低后，价格重新收回结构区" },
    { label:"触发", text:"长影线 + CHoCH 确认 + 量能启动", tone:"teal" },
    { label:"放弃", text:"只扫不收 / DXY与实际利率双向反转", tone:"red", icon:Ban },
  ]},
  { title:"POC / FVG / OB 共振", badge:"黄金 A2", tone:"amber", items:[
    { label:"场景", text:"成本集中区 + OB/FVG + 流动性位重叠" },
    { label:"触发", text:"回踩拒绝 + 量能启动 + 宏观未反向", tone:"teal" },
    { label:"放弃", text:"共振区被直接穿透 / 实际利率+DXY双向反转", tone:"red", icon:XCircle },
  ]},
  { title:"MA9 / MA21 动能过滤", badge:"辅助", tone:"amber", items:[
    { label:"强", text:"价格 > MA9 > MA21（只过滤，不开仓）", tone:"green" },
    { label:"弱", text:"价格 < MA9 < MA21", tone:"red" },
    { label:"提醒", text:"均线是过滤器，不是触发器", tone:"slate" },
  ]},
];
const eurModels = [
  { title:"EMA趋势回踩", badge:"EUR 主力", tone:"blue", items:[
    { label:"环境", text:"EMA9/21/55顺排 + ADX > 25，趋势已确立" },
    { label:"入场", text:"回踩EMA21/结构位，等拒绝K线确认", tone:"teal" },
    { label:"放弃", text:"ADX低 / 均线缠绕 / 数据发布前后", tone:"red", icon:Ban },
  ]},
  { title:"破位不追", badge:"执行规则", tone:"blue", items:[
    { label:"先等", text:"突破后不追第一根，等回踩" },
    { label:"再看", text:"回踩不破原突破位 + 重新放量", tone:"teal" },
    { label:"管理", text:"RR ≥ 1:2；到1:1.5先锁一半利润", tone:"green" },
  ]},
];
const highEvModels = [
  { title:"流动性扫单收回", badge:"黄金/EUR", tone:"amber", items:[
    { label:"场景", text:"扫前高/前低 + 重新收回结构" },
    { label:"触发", text:"长影线 + CHoCH 确认", tone:"teal" },
    { label:"EV特征", text:"中等胜率 + 高赔率。切忌'只扫不收'入场", tone:"amber" },
  ]},
  { title:"POC/FVG/OB共振", badge:"黄金", tone:"amber", items:[
    { label:"场景", text:"成本区+OB/FVG+流动性位重叠" },
    { label:"触发", text:"回踩拒绝 + 量能启动 + 宏观未反向", tone:"teal" },
    { label:"EV特征", text:"共振点越多胜率越高，穿透则放弃", tone:"amber" },
  ]},
  { title:"EMA趋势回踩", badge:"EUR", tone:"blue", items:[
    { label:"场景", text:"EMA顺排 + ADX>25 确认趋势" },
    { label:"触发", text:"回踩EMA21/结构位不破", tone:"teal" },
    { label:"EV特征", text:"趋势日胜率较高，均线缠绕时期望值极差", tone:"blue" },
  ]},
  { title:"VWAP+EMA+量能确认", badge:"QQQ期权", tone:"teal", items:[
    { label:"场景", text:"三指标同向 + QQQ 09:45后窗口" },
    { label:"触发", text:"量能>1.5倍+VWAP收回/失败+9EMA配合", tone:"green" },
    { label:"EV特征", text:"三条件同时满足时EV最高，缺一不可", tone:"teal" },
  ]},
  { title:"ORB 开盘区间突破", badge:"QQQ期权", tone:"teal", items:[
    { label:"场景", text:"9:45后突破开盘15分钟高低区间 + 量能" },
    { label:"触发", text:"突破 + QQQ VWAP同侧 + 不立即回撤", tone:"green" },
    { label:"EV特征", text:"趋势日高胜率；横盘日假信号多", tone:"teal" },
  ]},
  { title:"事件后IV回落", badge:"期权特有", tone:"green", items:[
    { label:"场景", text:"FOMC/CPI发布后，方向定盘，IV开始回落" },
    { label:"触发", text:"等二次确认，不追公布瞬间" },
    { label:"EV特征", text:"此时做debit/credit价差都有边；IV降后买方才合理", tone:"green" },
  ]},
];
const macroCards = [
  { state:"强 Risk ON", cond:"VIX<15，市场平静", action:"期权买方环境最友好，成本低，可正常执行", tone:"green", icon:TrendingUp, short:"进攻", bias:{ attack:90, wait:20, defend:8 } },
  { state:"正常区间", cond:"VIX 15–25，正常执行", action:"按常规系统执行，无需特别调整", tone:"amber", icon:Activity, short:"常规", bias:{ attack:60, wait:60, defend:25 } },
  { state:"期权变贵", cond:"VIX>25，溢价高", action:"降低预期或缩小仓位，买方需更大方向移动才盈利", tone:"amber", icon:AlertTriangle, short:"缩仓", bias:{ attack:25, wait:75, defend:40 } },
  { state:"VIX突然暴涨", cond:"VIX急速上行，方向混沌", action:"跳过当天，不参与，等市场稳定", tone:"red", icon:ShieldAlert, short:"跳过", bias:{ attack:5, wait:30, defend:90 } },
];
const checklist = [
  "仓位已过计算器：张数符合单笔权利金上限，QQQ固定1张。",
  "标的已确认为QQQ，当日不混用系统。",
  "时间已确认在09:45–11:30 ET窗口内，不在禁区。",
  "方向完整：QQQ VWAP方向明确（不横跳附近）。",
  "EMA已确认：9EMA在21EMA上/下方且发散（不粘合）。",
  "量能已确认：当前量 > 前5根K线平均量 × 1.5倍。",
  "四项入场条件全部满足（VWAP+EMA+量能+时间）。",
  "失效位已写清：止损具体价格，止损-$20。",
  "今日无重大数据（FOMC/CPI）发布前后15分钟。",
  "VIX未超过25，IV Rank未超过50%。",
  "未触发熔断：当日未亏$50 / 未连亏2笔。",
  "情绪正常：不是回本、证明自己、补偿心理驱动。",
];
const questions = [
  { category:"QQQ入场", q:"三项指标中，量能未达标（<1.5倍），但VWAP和EMA都正确，应该？", options:["正常开仓，两项满足就够了","不开仓，三项缺一不可","缩小仓位入场","等量能来了再说"],a:1,exp:"四项入场条件缺一不可。量能未达标=不开仓。这是铁律，没有例外。" },
  { category:"止损", q:"期权开仓后亏了$18，接近-$20止损线，但感觉'快到支撑了'，应该？", options:["再等一下，快到支撑了","到$20立刻无条件市价出场","移动止损到$25再给机会","换一个合约继续持有"],a:1,exp:"亏$20无条件市价出场，没有'再等等'。止损规则不给情绪留空间。" },
  { category:"心理", q:"昨天错过了一个大波段，今天开盘特别想赶回来，这是什么信号？", options:["信心满满，积极状态","补偿心理出现，立刻停止交易","正常的交易欲望","市场机会好，加仓信号"],a:1,exp:"这正是两次破坏性亏损的共同根源。补偿心理是开关，出现时立刻停止，不是减仓，是停止。" },
  { category:"时间规则", q:"现在是11:45 ET，QQQ刚出现完美的四项同时满足信号，应该？", options:["信号这么好，做一笔","不开仓，11:30后铁律禁止","观察记录但不交易","做短线，15分钟就出来"],a:1,exp:"11:30后不开新仓是铁律。再好的信号也不做。系统高于感觉。" },
  { category:"量能", q:"有效放量的标准是什么？", options:["当前量比前一根K线大就行","当前量 > 前5根K线平均量 × 1.5倍","量比昨日平均量大","随便，量大就行"],a:1,exp:"标准是前5根K线平均量的1.5倍以上。精确标准，不是感觉。" },
  { category:"风控", q:"当日已亏$47，又出现信号，距离$50日亏熔断还有$3，应该？", options:["做这笔，还没到$50","停止交易，已接近熔断线","做小仓位试试","信号好可以做"],a:1,exp:"接近熔断线就应停止，不是到了才停。且该信号的止损是$20，超过剩余空间，本就不该做。" },
  { category:"QQQ选择", q:"为什么当前主力标的选QQQ而不是NVDA？", options:["QQQ波动更大","QQQ趋势更干净+流动性好+价差小+个股消息影响小","NVDA太贵","随机选的"],a:1,exp:"复盘10个交易日确认：QQQ趋势和波段结构明显优于NVDA，且市价价差损耗问题已解决。" },
  { category:"VIX", q:"VIX突然从18暴涨到32，当天应该？", options:["VIX高期权便宜，加仓","跳过当天不参与","做Put顺势","减半仓位参与"],a:1,exp:"VIX突然暴涨=方向极难判断，建议跳过当天。不是缩仓，是不参与。" },
  { category:"仓位", q:"账户重建阶段赚了一些，信号极好，可以加到2张吗？", options:["信号好可以加","不可以，连续20笔稳定执行才讨论加张","赚钱了当然可以加","看当天VIX决定"],a:1,exp:"账户重建阶段：固定一张，永不加张。连续稳定执行20笔后再讨论。盈利不是加仓的理由。" },
  { category:"开盘规则", q:"09:38 ET，QQQ出现完美跳空低开后的反弹信号，应该？", options:["反弹力度大，可以做Call","不开仓，09:45前禁止开仓","做小仓位试试开盘波动","等等看形势"],a:1,exp:"前15分钟只看不动。09:30-09:45是绝对禁区，无论信号多好。" },
  { category:"黄金", q:"黄金的'大盘'是什么？", options:["QQQ和科技ETF","美元指数DXY + 10年期实际收益率","A股指数","VIX走势"],a:1,exp:"黄金无板块。第一驱动是实际利率，第二是DXY。与股票板块完全无关。" },
  { category:"黄金", q:"DXY走强 + 10年实际利率同时上行，做多黄金应该？", options:["正常做多，黄金是避险资产","降级处理或放弃，宏观双向反转","加大仓位对抗","换到EUR做多"],a:1,exp:"实际利率和DXY双向反转是黄金做多最差的宏观环境，放弃或极小仓。" },
  { category:"EUR", q:"EUR均线缠绕、ADX低于20，还能做趋势回踩吗？", options:["能做","不能，趋势强度不足","只看MACD","追突破"],a:1,exp:"趋势系统必须先有趋势环境。ADX低=无趋势=系统无效。" },
  { category:"风控计算", q:"账户$1000，单笔风险2%，期权价$1.00，最多几张？", options:["1张","2张","5张","随意"],a:0,exp:"1000×2%=$20；$1.00×100=$100；20÷100<1，最多1张。$1000账户期权超过$1就要谨慎选择合约。" },
  { category:"纪律", q:"今日已连续亏损2笔，第三个信号出现且完美，应该？", options:["信号好立即出手","触发连亏熔断，停止30分钟后再评估","换标的继续","加仓弥补亏损"],a:1,exp:"连续亏损2笔触发熔断，停止30分钟冷静再评估。不因信号质量破例。系统高于感觉。" },
];

/* ─── INTERACTIVE COMPONENTS ─── */
function AccountRebuildingBanner() {
  const [execCount, setExecCount] = useState(0);
  const pct = Math.round((execCount / 20) * 100);
  return (
    <div className="mb-6 rounded-[1.8rem] border-2 border-red-400/40 bg-red-950/30 p-5 shadow-[0_0_48px_rgba(239,68,68,0.12)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-5 w-5 text-red-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-red-400">账户重建阶段</span>
            <Badge tone="red">当前余额 ~$1,000</Badge>
          </div>
          <h3 className="text-xl font-black text-red-100 mb-2">现阶段目标不是盈利，是建立稳定执行的肌肉记忆</h3>
          <div className="text-sm font-bold text-red-200/80 leading-6 mb-3">评判标准：不是盈亏金额，是这笔交易进场前是否走完了全部检查清单。</div>
          <div className="grid gap-2 md:grid-cols-2 mb-3">
            {[
              { account:"黄金账户", pattern:"稳定盈利→放大仓位→震荡行情→爆仓" },
              { account:"期权账户", pattern:"小额稳定→放大张数+开盘进场→3天-50%" },
            ].map(p => (
              <div key={p.account} className="rounded-xl border border-red-400/25 bg-red-900/20 px-3 py-2">
                <span className="text-xs font-black text-red-400">{p.account}</span>
                <div className="text-xs font-bold text-red-200/80 mt-0.5">{p.pattern}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-amber-400/35 bg-amber-950/30 px-4 py-2">
            <span className="text-xs font-black text-amber-300">根本原因：</span>
            <span className="text-xs font-bold text-amber-200"> 补偿心理触发失控行为。能力没有问题，开关是情绪，不是市场。</span>
          </div>
        </div>
        <div className="w-full md:w-56">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">稳定执行进度</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-violet-200">{execCount}</span>
              <span className="text-lg font-black text-slate-500 mb-1">/ 20</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden mb-3">
              <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width:`${pct}%` }} />
            </div>
            <div className="grid grid-cols-4 gap-1 mb-3">
              {[...Array(20)].map((_,i)=>(
                <button key={i} type="button" onClick={() => setExecCount(i < execCount ? i : i+1)}
                  className={cn("h-6 rounded-lg text-[10px] font-black transition", i < execCount ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-600 hover:bg-slate-700")}>
                  {i+1}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 font-bold text-center">{execCount >= 20 ? "✓ 可讨论扩展" : `还需 ${20-execCount} 笔后再讨论扩展`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeaOSPanel() {
  return (
    <div className="mb-6 rounded-[1.8rem] border border-white/15 bg-slate-950/80 p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-4 w-4 text-teal-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-teal-400">Sea 交易员铁律 · QQQ期权专项</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {seaIronRules.map(rule => (
              <div key={rule.n} className={cn("flex items-start gap-3 rounded-xl border px-3 py-2.5",
                rule.critical ? "border-red-400/45 bg-red-950/40" : "border-white/8 bg-slate-900/40")}>
                <div className={cn("w-7 h-7 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-black",
                  rule.critical ? "bg-red-700 text-white" : "bg-slate-800 text-slate-400")}>
                  {rule.n}
                </div>
                <span className={cn("text-sm font-bold leading-6", rule.critical ? "text-red-200 font-black" : "text-slate-300")}>
                  {rule.text}
                  {rule.critical && <span className="ml-2 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-black">核心</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-teal-400/25 bg-teal-950/25 p-4">
            <div className="text-xs font-black text-teal-400 uppercase tracking-wider mb-3">核心信条</div>
            {coreBeliefs.map((b,i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                <span className="text-base font-black text-teal-100 leading-7">{b}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-amber-400/25 bg-amber-950/20 p-4">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2">Quick Reference · $1,000账户</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label:"每笔止损", value:"-$20", tone:"red" },
                { label:"每笔目标", value:"+$40", tone:"green" },
                { label:"日亏熔断", value:"-$50", tone:"red" },
                { label:"时间止盈", value:"45分钟", tone:"amber" },
              ].map(item => (
                <div key={item.label} className={cn("rounded-xl p-2 text-center", item.tone==="red"?"bg-red-950/40 border border-red-400/30":item.tone==="green"?"bg-emerald-950/40 border border-emerald-400/30":"bg-amber-950/30 border border-amber-400/25")}>
                  <div className="text-[10px] font-black text-slate-500 uppercase">{item.label}</div>
                  <div className={cn("text-lg font-black mt-0.5", item.tone==="red"?"text-red-300":item.tone==="green"?"text-emerald-300":"text-amber-300")}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskCalculator() {
  const [account, setAccount] = useState(1000);
  const [riskPct, setRiskPct] = useState(2);
  const [optionPrice, setOptionPrice] = useState(1.0);
  const maxPremium = useMemo(() => Math.round(account * riskPct / 100), [account, riskPct]);
  const maxContracts = useMemo(() => Math.max(1, Math.floor(account * riskPct / 100 / (optionPrice * 100))), [account, riskPct, optionPrice]);
  const totalCap = useMemo(() => Math.round(account * 0.06), [account]);
  const dailyLimit = useMemo(() => Math.round(account * 0.05), [account]);
  const weeklyLimit = useMemo(() => Math.round(account * 0.10), [account]);
  const ic = "terminal-input w-full rounded-2xl border border-white/15 bg-slate-950/90 px-4 py-3 text-base font-black text-slate-50 shadow-inner outline-none transition focus:border-teal-300/45 focus:ring-4 focus:ring-teal-400/20";
  return (
    <Card className="overflow-hidden rounded-[2rem] border-2 border-teal-300/45">
      <div className="bg-gradient-to-r from-teal-800 via-cyan-700 to-sky-700 px-5 py-4 text-white">
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-85">Position Sizer</div>
        <h3 className="mt-1 text-xl font-black">仓位计算器 · 开仓前必过此关</h3>
      </div>
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-3 mb-4">
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">账户总额 ($)</span><input className={ic} type="number" value={account} min={100} onChange={e=>setAccount(Math.max(100,Number(e.target.value)||100))} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">单笔风险</span><div className="grid grid-cols-3 gap-1.5">{[1,2,3].map(p=><button key={p} type="button" onClick={()=>setRiskPct(p)} className={cn("rounded-xl py-3 text-sm font-black transition",riskPct===p?"bg-teal-600 text-white":"bg-slate-800 text-slate-400 hover:bg-slate-700")}>{p}%</button>)}</div></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">期权价格 ($)</span><input className={ic} type="number" step="0.05" min="0.05" value={optionPrice} onChange={e=>setOptionPrice(Math.max(0.05,Number(e.target.value)||0.05))} /></label>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
          {[
            { label:"单笔最多权利金",value:`$${maxPremium}`,sub:`账户×${riskPct}%`,border:"border-teal-300/45",bg:"bg-teal-500/10",val:"text-teal-100" },
            { label:"最多合约数",value:`${maxContracts}张`,sub:`按$${optionPrice}/张`,border:"border-teal-300/45",bg:"bg-teal-500/10",val:"text-teal-100" },
            { label:"同时持仓上限",value:`$${totalCap}`,sub:"账户×6%",border:"border-amber-300/45",bg:"bg-amber-500/10",val:"text-amber-100" },
            { label:"日亏熔断线",value:`$${dailyLimit}`,sub:"账户×5%→当日停",border:"border-red-300/45",bg:"bg-red-500/10",val:"text-red-100" },
          ].map(item=>(
            <div key={item.label} className={cn("rounded-2xl border p-3 text-center",item.border,item.bg)}>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5 leading-4">{item.label}</div>
              <div className={cn("text-2xl font-black leading-none",item.val)}>{item.value}</div>
              <div className="text-[10px] text-slate-500 font-bold mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-3 text-xs font-bold leading-6 text-amber-100 mb-3">
          公式：张数=⌊账户×{riskPct}%÷期权价÷100⌋，向下取整。结果为0→该期权对你账户过贵，换便宜合约。
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/58 p-3">
          <div className="text-xs font-black text-slate-300 mb-2">熔断阈值（自动计算）</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { t:"日内连亏2笔",a:"停30分钟+复盘",c:"amber" },
              { t:"日内连亏3笔",a:"当日停止",c:"red" },
              { t:`日损≥$${dailyLimit}`,a:"当日停止",c:"red" },
              { t:`周损≥$${weeklyLimit}`,a:"本周停，周末复盘",c:"red" },
            ].map(item=>(
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

function ScaleUpPath() {
  return (
    <Card className="overflow-hidden rounded-[1.8rem] border-violet-300/35">
      <div className="bg-gradient-to-r from-violet-800 to-fuchsia-700 px-5 py-4 text-white">
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-85">Scale Protocol</div>
        <h3 className="mt-1 text-xl font-black">仓位增长路径</h3>
      </div>
      <div className="p-5 space-y-3">
        {[
          { lv:"起步阶段",contracts:"1张",cond:"无条件。账户重建阶段，不谈加张。",active:true },
          { lv:"Level 2",contracts:"2张",cond:"连续20笔稳定执行 + 零次熔断触发 + EV>0",active:false },
          { lv:"Level 3",contracts:"3张",cond:"再累积20笔满足上述条件",active:false },
        ].map(item=>(
          <div key={item.lv} className={cn("rounded-2xl border px-4 py-3",item.active?"border-violet-500/50 bg-violet-500/10":"border-white/10 bg-slate-900/40")}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {item.active&&<div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"/>}
                <span className={cn("text-sm font-black",item.active?"text-violet-200":"text-slate-500")}>{item.lv}</span>
              </div>
              <span className={cn("text-xl font-black",item.active?"text-violet-100":"text-slate-600")}>{item.contracts}</span>
            </div>
            <div className={cn("text-xs font-bold",item.active?"text-violet-300":"text-slate-600")}>{item.cond}</div>
          </div>
        ))}
        <div className="rounded-2xl border border-red-300/35 bg-red-950/45 px-4 py-3 flex items-start gap-2">
          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5"/>
          <div><div className="text-xs font-black text-red-300">任何熔断触发→立即降回1张</div><div className="text-xs font-bold text-red-400/80 mt-0.5">重置计数器，从20笔重新开始</div></div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/58 p-3">
          <div className="text-xs font-black text-slate-300 mb-1">你的数据已经给出答案</div>
          <div className="text-xs font-bold text-slate-500 leading-5">1张→每天稳定盈 · 多张→两天−50%<br/><span className="text-slate-400">边不是加仓加出来的，是纪律守出来的。</span></div>
        </div>
      </div>
    </Card>
  );
}

function OptionPriceEstimator() {
  const [mode,setMode]=useState("call");
  const [cur,setCur]=useState("520");const [tgt,setTgt]=useState("522");const [sl,setSl]=useState("518");
  const [opt,setOpt]=useState("1.20");const [delta,setDelta]=useState("0.55");const [qty,setQty]=useState("1");
  const c=Number(cur),t=Number(tgt),s=Number(sl),o=Number(opt),d=Math.abs(Number(delta)),q=Math.max(1,Number(qty)||1);
  const ok=[c,t,s,o,d].every(n=>Number.isFinite(n))&&o>=0&&d>=0;
  const mv=ok?(mode==="call"?t-c:c-t):0,slmv=ok?(mode==="call"?s-c:c-s):0;
  const proj=ok?Math.max(0,o+mv*d):0,slPr=ok?Math.max(0,o+slmv*d):0;
  const pnl=(proj-o)*100*q,slPnl=(slPr-o)*100*q;
  const pnlPct=o>0?((proj-o)/o)*100:0,slPct=o>0?((slPr-o)/o)*100:0;
  const ic="terminal-input w-full rounded-2xl border border-white/15 bg-slate-950/90 px-4 py-3 text-base font-black text-slate-50 shadow-inner outline-none transition focus:border-teal-300/45 focus:ring-4 focus:ring-teal-400/20";
  return (
    <Card className="overflow-hidden rounded-[1.8rem]">
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-5 py-3 text-white">
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-70">Delta Estimator</div>
        <h3 className="text-lg font-black">正股目标→期权估算</h3>
      </div>
      <div className="p-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">类型</span><select className={ic} value={mode} onChange={e=>setMode(e.target.value)}><option value="call">Call</option><option value="put">Put</option></select></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">当前正股</span><input className={ic} value={cur} onChange={e=>setCur(e.target.value)} inputMode="decimal"/></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">目标价</span><input className={ic} value={tgt} onChange={e=>setTgt(e.target.value)} inputMode="decimal"/></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">止损价</span><input className={ic} value={sl} onChange={e=>setSl(e.target.value)} inputMode="decimal"/></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">当前期权价</span><input className={ic} value={opt} onChange={e=>setOpt(e.target.value)} inputMode="decimal"/></label>
          <label><span className="text-xs font-black uppercase tracking-wider text-slate-500">Delta</span><input className={ic} value={delta} onChange={e=>setDelta(e.target.value)} inputMode="decimal"/></label>
          <label className="sm:col-span-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">张数</span><input className={ic} value={qty} onChange={e=>setQty(e.target.value)} inputMode="numeric"/></label>
        </div>
        <div className="grid gap-3">
          <div className="rounded-2xl border border-white/15 bg-slate-900/58 p-4"><div className="text-xs font-black text-slate-500">目标期权估算价</div><div className="mt-1 text-3xl font-black text-teal-100">{ok?proj.toFixed(2):"--"}</div></div>
          <div className={cn("rounded-2xl border p-4",pnl>=0?"border-teal-300 bg-teal-500/10":"border-red-300/35 bg-red-950/45")}><div className="text-xs font-black text-slate-500">目标盈亏</div><div className={cn("mt-1 text-2xl font-black",pnl>=0?"text-teal-100":"text-red-100")}>{ok?`${pnl>=0?"+":""}${pnl.toFixed(0)}刀`:"--"}</div><div className="text-sm font-bold text-slate-400">{ok?`${pnlPct>=0?"+":""}${pnlPct.toFixed(1)}%`:"--"}</div></div>
          <div className={cn("rounded-2xl border p-4",slPnl>=0?"border-amber-300/50 bg-amber-500/10":"border-red-300/35 bg-red-950/45")}><div className="text-xs font-black text-slate-500">止损估算</div><div className={cn("mt-1 text-2xl font-black",slPnl>=0?"text-amber-100":"text-red-100")}>{ok?`${slPnl>=0?"+":""}${slPnl.toFixed(0)}刀`:"--"}</div></div>
          <div className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-3 text-xs font-bold leading-6 text-amber-100">不含IV、Theta、Gamma和价差。结合$20止损规则使用。</div>
        </div>
      </div>
    </Card>
  );
}

function MacroRadarBoard() {
  const [active,setActive]=useState(0);
  const cur=macroCards[active];const Icon=cur.icon;
  const tCls={green:"border-emerald-300/25 bg-emerald-500/10",amber:"border-amber-300/25 bg-amber-500/10",red:"border-red-300/35 bg-red-950/55"};
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        {macroCards.map((m,idx)=>{const Ic=m.icon;return(
          <motion.button key={m.state} type="button" onMouseEnter={()=>setActive(idx)} onFocus={()=>setActive(idx)} whileHover={{y:-3,scale:1.01}}
            className={cn("rounded-[1.4rem] border p-4 text-left transition shadow-sm",tCls[m.tone]||"border-white/10 bg-slate-900/58",active===idx?"ring-2 ring-slate-300":"")}>
            <div className="flex items-start justify-between gap-3">
              <div><div className="text-xs font-black uppercase tracking-wider text-slate-500">{m.state}</div><div className="mt-1 text-sm font-black text-slate-50">{m.cond}</div></div>
              <div className="rounded-xl border border-white/60 bg-slate-900/70 p-2"><Ic className="h-4 w-4 text-slate-300"/></div>
            </div>
            <div className="mt-3 text-base font-black text-slate-100">{m.action}</div>
          </motion.button>
        );})}
      </div>
      <Card className="rounded-[1.5rem] border-white/15 p-4">
        <div className="flex items-center justify-between gap-3">
          <div><div className="text-xs font-black uppercase tracking-wider text-slate-500">当前聚焦</div><div className="mt-1 flex items-center gap-2 text-lg font-black text-slate-50"><Icon className="h-5 w-5"/>{cur.state}</div><div className="mt-1 text-sm font-bold text-slate-400">{cur.cond}</div></div>
          <Badge tone={cur.tone==="green"?"green":cur.tone==="red"?"red":"amber"}>{cur.short}</Badge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[["Call/进攻","teal",cur.bias.attack],["等待/降仓","amber",cur.bias.wait],["Put/防守","red",cur.bias.defend]].map(([l,t,v])=>(
            <div key={l} className="rounded-2xl border border-white/10 bg-slate-900/58 p-3">
              <div className="text-xs font-black text-slate-500 mb-2">{l}</div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div className={cn("h-full rounded-full",t==="teal"?"bg-teal-500":t==="amber"?"bg-amber-500":"bg-red-500")} style={{width:`${v}%`}}/></div>
              <div className={cn("mt-2 text-2xl font-black",t==="teal"?"text-teal-300":t==="amber"?"text-amber-300":"text-red-300")}>{v>=70?"极高":v>=50?"高":v>=25?"中":"低"}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── SECTIONS ─── */
function RiskSpineSection() {
  return (
    <section className="mb-8 rounded-[2.2rem] border-2 border-teal-300/35 bg-slate-950/70 p-5 shadow-[0_28px_85px_rgba(0,0,0,0.42)] ring-1 ring-white/10 md:p-7">
      <SectionHeader number="00" title="风控脊柱" desc="先活下来，才能谈翻倍。亏50%需要赚100%回本。所有其他模块挂在这根脊柱下面，每笔交易之前必过此关。" tone="red"/>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <RiskCalculator/>
        <div className="grid gap-4">
          <ScaleUpPath/>
          <Card className="rounded-[1.8rem] border-white/15 p-5">
            <div className="flex items-center justify-between gap-3 mb-4"><h3 className="text-lg font-black text-slate-50">持仓管理</h3><Zap className="h-5 w-5 text-slate-500"/></div>
            <div className="grid gap-2">
              <VisualMeter label="止损线" left="-20%警戒" right="-25%硬止损" fill={100} tone="red" note="QQQ期权固定-$20"/>
              <VisualMeter label="止盈线" left="+50%减仓50%" right="+80%全平" fill={78} tone="green" note="QQQ期权目标+$40"/>
              <div className="rounded-2xl border border-amber-300/35 bg-amber-500/10 p-3 text-xs font-bold text-amber-100">时间止盈：持仓超45分钟，无论盈亏出场（避免时间价值衰减）</div>
              <RuleCard label="绝对禁止" text="扛单·加仓摊平·换合约续命·超仓" tone="red" icon={Ban}/>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function OptionsSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 shadow-[0_28px_85px_rgba(0,0,0,0.42)] ring-1 ring-white/10 md:p-7">
      <SectionHeader number="01" title="美股期权买方系统 · QQQ专注" desc="当前核心武器。固定QQQ，固定1张，三指标同时满足+时间窗口才开仓。小资金用凸性增长，纪律是唯一护城河。" tone="teal"/>
      <div className="mb-5 rounded-[1.8rem] border-2 border-teal-400/35 bg-teal-950/20 p-5">
        <div className="text-sm font-black text-teal-300 uppercase tracking-wider mb-4">三指标框架 · 缺一不可</div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon:BarChart2, title:"VWAP", role:"方向过滤器", rules:["价格在VWAP上方→只做Call","价格在VWAP下方→只做Put","VWAP附近横跳→不开仓"], tone:"teal" },
            { icon:TrendingUp, title:"EMA 9/21", role:"趋势确认", rules:["9EMA>21EMA且发散→多头趋势","9EMA<21EMA且发散→空头趋势","两线粘合/频繁交叉→不开仓"], tone:"teal" },
            { icon:Activity, title:"成交量", role:"动能确认（新增）", rules:["当前量>前5根平均量×1.5倍","仅方向+趋势无量→不开仓","量能是三者中最容易忽视的"], tone:"teal" },
          ].map(ind=>{const Icon=ind.icon;return(
            <div key={ind.title} className="rounded-2xl border border-teal-300/25 bg-teal-500/8 p-4">
              <div className="flex items-center gap-2 mb-3"><Icon className="h-5 w-5 text-teal-400"/><div><div className="text-base font-black text-teal-100">{ind.title}</div><div className="text-xs text-teal-400 font-bold">{ind.role}</div></div></div>
              {ind.rules.map((r,i)=><div key={i} className="flex items-start gap-1.5 mb-1"><div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"/><span className="text-xs font-bold text-slate-300 leading-5">{r}</span></div>)}
            </div>
          );})}
        </div>
      </div>
      <div className="mb-5">
        <div className="text-sm font-black text-slate-300 uppercase tracking-wider mb-3">四项入场条件 · 全部满足才开仓</div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {fourEntryConditions.map(cond=>(
            <div key={cond.n} className="rounded-2xl border border-teal-300/20 bg-slate-800/50 p-4">
              <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-xl bg-teal-900/70 border border-teal-700/50 flex items-center justify-center text-sm font-black text-teal-400">{cond.n}</div><span className="text-sm font-black text-slate-50">{cond.title}</span></div>
              <p className="text-xs font-bold text-slate-400 leading-5">{cond.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-red-300/35 bg-red-950/35 p-3 text-xs font-bold text-red-100">
          ⚠️ 四项缺一不可。量能未达标但方向和EMA正确→不开仓。时间过了11:30→不开仓。没有例外。
        </div>
      </div>
      <div className="mb-5">
        <div className="text-sm font-black text-slate-300 uppercase tracking-wider mb-3">标的选择 · 当前主力QQQ</div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name:"QQQ ✓", desc:"趋势比个股干净，假突破少；流动性极好价差小；单一消息面影响小；复盘10天确认结构明显优于NVDA。", tone:"teal", tag:"当前主力" },
            { name:"SPY", desc:"IV低、点差极小，但窄幅震荡频繁，theta磨损快，日内方向性差。大盘趋势日可用，不是首选。", tone:"slate", tag:"备选" },
            { name:"NVDA ✗", desc:"消息面冲击大，开盘方向不可预测；已有负面交易记录，心理干扰风险；市价价差损耗严重。暂时回避。", tone:"red", tag:"暂时回避" },
          ].map(item=>(
            <Card key={item.name} className={cn("rounded-[1.5rem] p-4",item.tone==="teal"?"border-teal-300/25 bg-teal-500/8":item.tone==="red"?"border-red-300/25 bg-red-950/30":"border-white/10 bg-slate-900/40")}>
              <div className="mb-2 flex items-center justify-between"><span className="text-lg font-black text-slate-50">{item.name}</span><Badge tone={item.tone==="teal"?"teal":item.tone==="red"?"red":"slate"}>{item.tag}</Badge></div>
              <p className="text-xs font-bold leading-6 text-slate-400">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="text-sm font-black text-slate-300 uppercase tracking-wider mb-3">VWAP 状态机</div>
          <div className="grid gap-3 md:grid-cols-3 mb-4">
            {[
              { step:"Step 1",title:"接近VWAP",text:"只观察，不抢跑，不直接开仓。",border:"border-white/10 bg-slate-900/58",tag:"text-slate-500" },
              { step:"Step 2",title:"等待确认",text:"Call看收回+9EMA上拐+量能1.5x；Put看反抽失败+跌回+量能1.5x。",border:"border-teal-300/25 bg-teal-500/10",tag:"text-teal-500" },
              { step:"Step 3",title:"执行/放弃",text:"三项+时间全满足才进；反复穿越、无量、量不足直接放弃。",border:"border-red-300/35 bg-red-950/45",tag:"text-red-500" },
            ].map(s=><div key={s.step} className={cn("rounded-2xl border p-4",s.border)}><div className={cn("text-xs font-black uppercase tracking-wider mb-2",s.tag)}>{s.step}</div><div className="text-sm font-black text-slate-50">{s.title}</div><div className="mt-2 text-sm font-bold leading-6 text-slate-400">{s.text}</div></div>)}
          </div>
          <div className="mb-4 rounded-[1.6rem] border border-violet-300/25 bg-violet-950/20 p-4">
            <div className="flex items-center gap-2 mb-3"><Lock className="h-4 w-4 text-violet-400"/><span className="text-sm font-black text-violet-300">VWAP扫流动性收回结构 · 仅观察</span><Badge tone="violet">观察中</Badge></div>
            <p className="text-xs font-bold text-slate-400 leading-6 mb-3">开盘15-30分钟内，价格冲出VWAP上下方（假突破）后迅速收回。当前样本量不足，不实盘操作。</p>
            <div className="grid gap-2 md:grid-cols-2">
              {[
                { label:"当前状态",text:"只观察记录，不实盘",tone:"violet" },
                { label:"启用条件",text:"≥30次样本，成功率>60%",tone:"amber" },
                { label:"入场条件",text:"明显拒绝K线+量能+真正收回VWAP站稳",tone:"teal" },
                { label:"止损位置",text:"扫出去的高点或低点",tone:"red" },
              ].map(item=><RuleCard key={item.label} {...item} icon={item.tone==="red"?Ban:CheckCircle2}/>)}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FlowCard title="合约与风控仪表" badge="合约过滤" tone="teal" items={[
              { label:"Delta",text:"ATM优先（约0.5），方向最敏感，流动性最好" },
              { label:"DTE",text:"日内1-5DTE；波段14-45DTE；黄金0DTE不做",tone:"blue" },
              { label:"价差",text:"≤$0.05优；≥$0.15放弃（流动性不足）",tone:"amber" },
              { label:"IVR<30",text:"买方友好；>50禁止裸买（IV crush风险）",tone:"slate" },
            ]}/>
            <FlowCard title="期权买方四大杀手" badge="风险识别" tone="red" items={[
              { label:"Theta",text:"入场太早，被时间磨死",tone:"red",icon:AlertTriangle },
              { label:"IV Crush",text:"IVR>50时买入，方向对也不赚",tone:"red",icon:AlertTriangle },
              { label:"VWAP误用",text:"把观察区当开仓点",tone:"red",icon:AlertTriangle },
              { label:"不止损",text:"小亏不走，最后变大亏",tone:"red",icon:Ban },
            ]}/>
          </div>
        </div>
        <div className="grid gap-4">
          <HeatBar rows={[
            { label:"09:30–09:45",status:"禁做",fill:8,barColor:"bg-red-600",note:"开盘乱流，绝对禁区" },
            { label:"09:45–11:30",status:"优先",fill:88,barColor:"bg-emerald-500",note:"主战窗口，趋势确立后入场" },
            { label:"11:30–16:00",status:"禁做",fill:12,barColor:"bg-red-600",note:"11:30后不开新仓（下午无量慢磨）" },
          ]}/>
          <OptionPriceEstimator/>
        </div>
      </div>
    </section>
  );
}

function GoldSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 shadow-[0_28px_85px_rgba(0,0,0,0.42)] ring-1 ring-white/10 md:p-7">
      <SectionHeader number="02" title="黄金 XAU/USD 现货买卖" desc="外汇平台现货/差价合约交易，非期权。宏观驱动决定方向，SMC结构决定位置，Kill Zone决定时间。三层对齐才出手。" tone="amber"/>
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-amber-400"/><h3 className="text-base font-black text-amber-300 uppercase tracking-wider">宏观驱动层（黄金真正的"大盘"）</h3></div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {goldMacroDrivers.map(item=>(
            <div key={item.driver} className={cn("rounded-2xl border p-4",item.tone==="red"?"border-red-300/35 bg-red-950/35":item.tone==="amber"?"border-amber-300/25 bg-amber-500/10":item.tone==="green"?"border-emerald-300/25 bg-emerald-500/10":item.tone==="blue"?"border-sky-300/25 bg-sky-500/10":"border-white/10 bg-slate-900/58")}>
              <div className="flex items-start justify-between gap-2 mb-2"><span className="text-sm font-black text-slate-50">{item.driver}</span><Badge tone={item.tone}>{item.dir}</Badge></div>
              <p className="text-xs font-bold leading-5 text-slate-400">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-red-300/35 bg-red-950/35 p-3 text-xs font-bold leading-6 text-red-100"><span className="font-black">方向确认规则：</span> 做多黄金前，确认DXY与实际利率未同时走强。若两者都在反向，不做或极小仓。</div>
      </div>
      <div className="mb-5"><ProcessRail tone="amber" steps={[{title:"日线定向",text:"宏观驱动方向+主结构OB+流动性格局"},{title:"4H/1H找位",text:"BSL/SSL流动性+FVG+POC集中区+结构重叠"},{title:"15M/5M确认",text:"等收回/拒绝/CHoCH·BOS，不在测试区抢跑"},{title:"只拿中间段",text:"止损放结构外；信号不完整，放弃。"}]}/></div>
      <div className="mb-5"><KillZoneBoard items={[
        { title:"伦敦",text:"15:00–17:00 北京：扫亚洲盘高低点，常设定当日方向",cls:"border-amber-300/25 bg-amber-500/10",icon:CheckCircle2,iconCls:"text-amber-300" },
        { title:"纽约",text:"21:30–23:30 北京：扫伦敦高低后定方向，主要走势段",cls:"border-sky-300/25 bg-sky-500/10",icon:CheckCircle2,iconCls:"text-sky-300" },
        { title:"禁区",text:"亚洲盘中间位不追，FOMC/CPI发布瞬间方向未定不进",cls:"border-red-300/35 bg-red-950/45",icon:Ban,iconCls:"text-red-300" },
      ]}/></div>
      <div className="grid gap-4 md:grid-cols-3">{goldModels.map(m=><FlowCard key={m.title} {...m}/>)}</div>
    </section>
  );
}

function ForexSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 shadow-[0_28px_85px_rgba(0,0,0,0.42)] ring-1 ring-white/10 md:p-7">
      <SectionHeader number="03" title="EUR/USD 外汇系统" desc="趋势跟踪系统：EMA顺排+ADX确认趋势环境，回踩结构位等确认，只拿中间段。均线缠绕和低ADX时系统无效，不做。" tone="blue"/>
      <ProcessRail tone="blue" steps={[{title:"趋势过滤",text:"EMA9/21/55顺排+ADX>25，先确认趋势环境"},{title:"Kill Zone",text:"伦敦/纽约开盘窗口，扫前高低点后定方向"},{title:"找回踩位",text:"回踩EMA21或关键结构位，等拒绝K线确认"},{title:"执行",text:"RR≥1:2；到1:1.5先锁一半；不追破位第一根"}]}/>
      <div className="mt-5 mb-5"><KillZoneBoard items={[
        { title:"伦敦",text:"15:00–17:00 北京：扫亚洲高低点，EUR主要方向常在此确立",cls:"border-sky-300/25 bg-sky-500/10",icon:CheckCircle2,iconCls:"text-sky-300" },
        { title:"纽约",text:"21:30–23:30 北京：美国数据/纽约开盘是EUR第二主要时段",cls:"border-blue-300/25 bg-blue-500/10",icon:CheckCircle2,iconCls:"text-blue-300" },
        { title:"禁区",text:"ADX<20+均线缠绕 / 重大数据前后 / 亚洲盘中间位",cls:"border-red-300/35 bg-red-950/45",icon:Ban,iconCls:"text-red-300" },
      ]}/></div>
      <div className="grid gap-4 md:grid-cols-2">{eurModels.map(m=><FlowCard key={m.title} {...m}/>)}</div>
    </section>
  );
}

function StockSystem() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 shadow-[0_28px_85px_rgba(0,0,0,0.42)] ring-1 ring-white/10 md:p-7">
      <SectionHeader number="04" title="美股正股 · 低频配置" desc="这是资金量大了以后的底仓系统，不是当前主战场。先筛公司质量，再等技术位置，最后低频持有。不做日内，不追热点。" tone="violet"/>
      <div className="grid gap-4 md:grid-cols-3">
        <FlowCard title="基本面筛选" badge="第一步" tone="violet" items={[{label:"营收/利润",text:"连续增长，行业景气，无重大负面"},{label:"质量筛选",text:"重视增长质量和护城河",tone:"blue"},{label:"不做",text:"只因K线好看/热点消息/情绪冲动",tone:"red",icon:Ban}]}/>
        <FlowCard title="技术择时" badge="第二步" tone="violet" items={[{label:"周线",text:"趋势不坏，在关键支撑或突破回踩"},{label:"日线",text:"回调支撑，结构完整，无破坏信号",tone:"teal"},{label:"60分钟",text:"日线确认后，60分钟级别找入场确认",tone:"blue"}]}/>
        <FlowCard title="持仓管理" badge="第三步" tone="violet" items={[{label:"持有周期",text:"周线级别为基准，不做日内"},{label:"止损",text:"主结构下方，不因短期波动止损"},{label:"加仓",text:"等突破确认后再加，不在下跌中摊平",tone:"amber"}]}/>
      </div>
    </section>
  );
}

function MacroAndModels() {
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/74 p-5 shadow-[0_28px_85px_rgba(0,0,0,0.42)] ring-1 ring-white/10 md:p-7">
      <SectionHeader number="05" title="宏观过滤 + 高期望值模型库" desc="双轨过滤：期权看VIX三档，黄金/外汇看DXY+实际利率。宏观只做环境过滤，不代替具体入场触发。" tone="slate"/>
      <div className="grid gap-5 xl:grid-cols-2 mb-6">
        <div>
          <div className="mb-3 flex items-center gap-2"><Badge tone="teal">期权/美股 · VIX三档过滤</Badge></div>
          <MacroRadarBoard/>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2"><Badge tone="amber">黄金/外汇 · 宏观过滤</Badge></div>
          <Card className="rounded-[1.5rem] border-white/15 p-4 mb-3">
            <h4 className="text-base font-black text-slate-50 mb-3">DXY + 实际利率双维判断</h4>
            <div className="grid gap-2">
              {[
                { state:"实际利率↓+DXY↓",action:"黄金最友好环境，可主动做多",tone:"green" },
                { state:"单向下行（其一）",action:"偏多，需结构确认，不强追",tone:"amber" },
                { state:"双向平稳",action:"中性，用SMC结构确认方向",tone:"slate" },
                { state:"单向上行（其一）",action:"谨慎，降仓，等更好入场点",tone:"amber" },
                { state:"实际利率↑+DXY↑（双向压制）",action:"禁止做多，宏观双向压制",tone:"red" },
              ].map(item=>(
                <div key={item.state} className={cn("rounded-xl border px-3 py-2",item.tone==="green"?"border-emerald-300/25 bg-emerald-500/10":item.tone==="red"?"border-red-300/35 bg-red-950/35":item.tone==="amber"?"border-amber-300/25 bg-amber-500/10":"border-white/10 bg-slate-900/40")}>
                  <div className="flex items-start justify-between gap-2"><span className="text-xs font-black text-slate-200">{item.state}</span><Badge tone={item.tone}>{item.tone==="green"?"友好":item.tone==="red"?"禁止":item.tone==="amber"?"谨慎":"中性"}</Badge></div>
                  <div className="text-xs font-bold text-slate-400 mt-1">{item.action}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <div className="mb-3 flex items-center gap-2"><h3 className="text-lg font-black text-slate-50">高期望值模型库</h3><Badge tone="teal">期望值=胜率×赔率，非单一指标</Badge></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{highEvModels.map(m=><FlowCard key={m.title} {...m}/>)}</div>
    </section>
  );
}

function DisciplineSystem() {
  const [preChecked,setPreChecked]=useState({});
  const [dayChecked,setDayChecked]=useState({});
  const [qIndex,setQIndex]=useState(0);
  const [selected,setSelected]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const preCount=Object.values(preChecked).filter(Boolean).length;
  const dayCount=Object.values(dayChecked).filter(Boolean).length;
  const q=questions[qIndex];
  const handleAnswer=(idx)=>{if(selected!==null)return;setSelected(idx);if(idx===q.a)setScore(s=>s+1);};
  const nextQ=()=>{if(qIndex<questions.length-1){setQIndex(i=>i+1);setSelected(null);}else setDone(true);};
  const reset=()=>{setQIndex(0);setSelected(null);setScore(0);setDone(false);};
  return (
    <section className="mb-8 rounded-[2.2rem] border border-white/15 bg-slate-950/70 p-5 shadow-[0_28px_85px_rgba(0,0,0,0.42)] ring-1 ring-white/10 md:p-7">
      <SectionHeader number="07" title="纪律系统与训练" desc="开盘前检查+入场前检查+训练闭环。每笔交易过清单，每周做题，不合格不扩仓。" tone="slate"/>
      <div className="grid gap-5 xl:grid-cols-3 mb-5">
        <Card className="rounded-[1.8rem] border-white/15 p-5">
          <div className="flex items-center justify-between gap-3 mb-4"><h3 className="text-base font-black text-slate-50">开盘前检查（每日）</h3><div className="flex items-center gap-2"><span className="text-sm font-black text-slate-400">{preCount}/4</span><div className="h-2 w-16 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-amber-500 transition-all" style={{width:`${preCount/4*100}%`}}/></div></div></div>
          <div className="space-y-2">
            {preMarketItems.map((item,i)=>(
              <motion.div key={i} whileHover={{x:4}} onClick={()=>setPreChecked(p=>({...p,[i]:!p[i]}))}
                className={cn("flex items-start gap-3 rounded-2xl border p-3 cursor-pointer transition",preChecked[i]?"border-amber-300/35 bg-amber-500/10":"border-white/10 bg-slate-900/40 hover:border-white/20")}>
                <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border-2 mt-0.5",preChecked[i]?"border-amber-400 bg-amber-500":"border-slate-600")}>{preChecked[i]&&<CheckCircle2 className="h-4 w-4 text-white"/>}</div>
                <div><div className={cn("text-xs font-bold leading-5",preChecked[i]?"text-amber-100":"text-slate-300")}>{item.text}</div><div className="text-[10px] text-slate-500 font-bold mt-0.5">{item.warn}</div></div>
              </motion.div>
            ))}
          </div>
          {preCount===4&&<div className="mt-3 rounded-2xl border border-amber-300/35 bg-amber-500/10 p-3 text-center text-sm font-black text-amber-100">✓ 开盘前检查完毕</div>}
        </Card>
        <Card className="rounded-[1.8rem] border-white/15 p-5">
          <div className="flex items-center justify-between gap-3 mb-4"><h3 className="text-base font-black text-slate-50">入场前检查</h3><div className="flex items-center gap-2"><span className="text-sm font-black text-slate-400">{dayCount}/{checklist.length}</span><div className="h-2 w-16 rounded-full bg-slate-800 overflow-hidden"><div className={cn("h-full rounded-full transition-all",dayCount===checklist.length?"bg-emerald-500":dayCount>8?"bg-amber-500":"bg-red-500")} style={{width:`${dayCount/checklist.length*100}%`}}/></div></div></div>
          <div className="space-y-1.5">
            {checklist.map((item,i)=>(
              <motion.div key={i} whileHover={{x:4}} onClick={()=>setDayChecked(p=>({...p,[i]:!p[i]}))}
                className={cn("flex items-start gap-3 rounded-xl border p-2.5 cursor-pointer transition",dayChecked[i]?"border-teal-300/35 bg-teal-500/10":"border-white/10 bg-slate-900/40 hover:border-white/20")}>
                <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border-2 mt-0.5",dayChecked[i]?"border-teal-400 bg-teal-500":"border-slate-600")}>{dayChecked[i]&&<CheckCircle2 className="h-3 w-3 text-white"/>}</div>
                <span className={cn("text-xs font-bold leading-5",dayChecked[i]?"text-teal-100":"text-slate-300")}>{item}</span>
              </motion.div>
            ))}
          </div>
          {dayCount===checklist.length&&<div className="mt-3 rounded-xl border border-teal-300/35 bg-teal-500/10 p-2 text-center text-sm font-black text-teal-100">✓ 可以入场</div>}
        </Card>
        <Card className="rounded-[1.8rem] border-white/15 p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="h-4 w-4 text-slate-400"/><h3 className="text-base font-black text-slate-50">交易日志模板</h3></div>
          <div className="space-y-2 mb-4">
            {journalFields.map((item,i)=>(
              <div key={i} className="flex items-start gap-2 rounded-xl border border-white/8 bg-slate-900/40 px-3 py-2">
                <div className="w-28 flex-shrink-0 text-[10px] font-black text-slate-500 uppercase">{item.field}</div>
                <div className="text-xs font-bold text-slate-400">{item.example}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-violet-300/25 bg-violet-950/20 p-3">
            <div className="text-xs font-black text-violet-300 mb-1">复盘分析重点</div>
            {["哪种情绪状态下胜率最低？","哪类进场理由是自我欺骗？","被铁律拦截的交易，事后证明拦对了多少？"].map((t,i)=><div key={i} className="flex items-start gap-1.5 mb-1"><div className="w-1 h-1 rounded-full bg-violet-500 mt-2 flex-shrink-0"/><span className="text-xs font-bold text-slate-400">{t}</span></div>)}
          </div>
          <div className="mt-3 rounded-2xl border border-white/8 bg-slate-900/40 p-3 text-xs font-bold text-slate-500">工具：TradingView Bar Replay（还原走势+保留时间压力感）+ Excel/Notion记录</div>
        </Card>
      </div>
      <Card className="rounded-[1.8rem] border-white/15 p-5">
        <div className="flex items-center justify-between gap-3 mb-4"><h3 className="text-xl font-black text-slate-50">训练题库</h3><Badge tone="violet">{done?`得分 ${score}/${questions.length}`:`${qIndex+1}/${questions.length}`}</Badge></div>
        {done?(
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-violet-400"/>
            <div className="text-3xl font-black text-violet-100 mb-2">{score}/{questions.length}</div>
            <div className="text-slate-400 font-bold mb-6">{score>=questions.length*0.87?"优秀，系统理解扎实":score>=questions.length*0.7?"良好，继续复习薄弱点":"需要加强，重读规则再练"}</div>
            <button type="button" onClick={reset} className="rounded-2xl bg-violet-700 px-6 py-3 text-sm font-black text-white hover:bg-violet-800 transition">再练一次</button>
          </div>
        ):(
          <>
            <div className="rounded-2xl border border-white/10 bg-slate-900/58 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3"><Badge tone="violet">{q.category}</Badge></div>
              <p className="text-base font-black text-slate-50 leading-7">{q.q}</p>
            </div>
            <div className="grid gap-2 mb-4">
              {q.options.map((opt,idx)=>(
                <motion.button key={idx} type="button" whileHover={selected===null?{x:6}:{}} onClick={()=>handleAnswer(idx)}
                  className={cn("rounded-2xl border p-3 text-left text-sm font-bold transition",
                    selected===null?"border-white/15 bg-slate-900/40 hover:border-white/30 text-slate-200":
                    idx===q.a?"border-emerald-300/35 bg-emerald-500/10 text-emerald-100":
                    idx===selected?"border-red-300/35 bg-red-950/45 text-red-100":
                    "border-white/10 bg-slate-900/40 text-slate-500")}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black border",selected===null?"border-slate-600 text-slate-500":idx===q.a?"border-emerald-400 bg-emerald-500 text-white":"border-slate-700 text-slate-600")}>{String.fromCharCode(65+idx)}</div>
                    {opt}
                  </div>
                </motion.button>
              ))}
            </div>
            {selected!==null&&<div className={cn("rounded-2xl border p-4 mb-4",selected===q.a?"border-emerald-300/35 bg-emerald-500/10":"border-amber-300/35 bg-amber-500/10")}><div className={cn("text-xs font-black mb-1",selected===q.a?"text-emerald-300":"text-amber-300")}>{selected===q.a?"✓ 正确":"解析"}</div><p className={cn("text-sm font-bold leading-6",selected===q.a?"text-emerald-100":"text-amber-100")}>{q.exp}</p></div>}
            {selected!==null&&<button type="button" onClick={nextQ} className="w-full rounded-2xl bg-teal-700 px-6 py-3 text-sm font-black text-white hover:bg-teal-800 transition flex items-center justify-center gap-2">{qIndex<questions.length-1?"下一题":"查看成绩"}<ChevronRight className="h-4 w-4"/></button>}
          </>
        )}
      </Card>
    </section>
  );
}

/* ─── MAIN ─── */
export default function TradingModelTrainingSystem() {
  const stats = useMemo(()=>[
    { label:"交易方向",value:"4类",icon:Layers,tone:"bg-teal-700" },
    { label:"执行模型",value:"12组",icon:Activity,tone:"bg-amber-600" },
    { label:"入场红绿灯",value:`${checklist.length}项`,icon:ShieldAlert,tone:"bg-red-700" },
    { label:"训练题",value:`${questions.length}题`,icon:Brain,tone:"bg-violet-700" },
  ],[]);
  return (
    <div className="min-h-screen premium-terminal-bg text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <motion.header initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="mb-6 overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.72))] shadow-[0_40px_120px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
          <div className="section-accent-bar h-3 bg-gradient-to-r from-red-700 via-teal-600 to-violet-700"/>
          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap gap-2"><Badge tone="red">风控优先</Badge><Badge tone="teal">QQQ专注期权</Badge><Badge tone="amber">黄金现货</Badge><Badge tone="blue">EUR/USD</Badge><Badge tone="violet">正股低频</Badge></div>
            <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-50 md:text-6xl">Sea Trading OS</h1>
                <p className="mt-3 text-base font-semibold leading-8 text-slate-300">把交易决策压缩成四个动作：<KeyWord>看什么</KeyWord> <KeyWord tone="blue">等什么</KeyWord> <KeyWord tone="green">做什么</KeyWord> <KeyWord tone="red">不做什么</KeyWord>。风控脊柱在所有模块之前。</p>
              </div>
              <div className="rounded-[1.5rem] border-2 border-red-300/35 bg-red-950/45 p-4 shadow-lg">
                <div className="flex items-center gap-2 text-red-100 mb-2"><AlertTriangle className="h-5 w-5"/><span className="font-black">总原则</span></div>
                <p className="text-sm font-bold leading-7 text-red-100">信号不完整，不交易。规则不清晰，不交易。情绪不稳定，不交易。仓位不符合计算器，不交易。</p>
              </div>
            </div>
          </div>
        </motion.header>
        <AccountRebuildingBanner/>
        <SeaOSPanel/>
        <div className="mb-8 grid gap-4 md:grid-cols-4 xl:gap-5">
          {stats.map((s)=>{const Icon=s.icon;return(
            <Card key={s.label} className="relative overflow-hidden rounded-[1.6rem] border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.86),rgba(15,23,42,0.62))] p-5 shadow-[0_26px_70px_rgba(0,0,0,0.40)]">
              <div className="flex items-start justify-between"><div><div className="text-2xl font-black text-slate-50">{s.value}</div><div className="mt-1 text-sm font-black text-slate-400">{s.label}</div></div><div className={cn("rounded-2xl p-3 text-white",s.tone)}><Icon className="h-5 w-5"/></div></div>
              <div className={cn("absolute bottom-0 left-0 h-2 w-full",s.tone)}/>
            </Card>
          );})}
        </div>
        <RiskSpineSection/>
        <OptionsSystem/>
        <GoldSystem/>
        <ForexSystem/>
        <StockSystem/>
        <MacroAndModels/>
        <DisciplineSystem/>
      </div>
    </div>
  );
}
