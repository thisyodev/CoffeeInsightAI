import React from "react";
import RevenueImpactCard from "./RevenueImpactCard";
import Card from "./Card";

const AIInsightBox = ({ analysis, onExecute, onExplore, lang = "th" }) => {
  if (!analysis) {
    return (
      <Card className="animate-pulse flex flex-col justify-center h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/5 rounded-2xl"></div>
          <div className="h-4 bg-white/5 rounded w-48"></div>
        </div>
        <div className="space-y-4">
          <div className="h-3 bg-white/5 rounded w-full"></div>
          <div className="h-3 bg-white/5 rounded w-5/6"></div>
        </div>
      </Card>
    );
  }

  const {
    summary,
    risks,
    opportunities,
    priority_actions,
    estimated_revenue_impact,
  } = analysis;

  const t = {
    th: {
      header: "การวิเคราะห์ยุทธศาสตร์โดย AI",
      risks: "ความเสี่ยงเชิงกลยุทธ์",
      vectors: "จุดเติบโตที่แนะนำ",
      tasks: "ภารกิจเร่งด่วน",
      execute: "ดำเนินการตามแผน",
      explore: "จำลองสถานการณ์",
      projected: "คาดการณ์โดย CoffeeInsight AI",
    },
    en: {
      header: "Strategic AI Audit",
      risks: "Strategic Risks",
      vectors: "Growth Vectors",
      tasks: "Priority Tasks",
      execute: "Apply Plan",
      explore: "Market Simulator",
      projected: "via CoffeeInsight AI",
    },
  }[lang];

  return (
    <Card className="p-0 flex flex-col h-full overflow-hidden">
      <div className="p-5 md:p-8 flex flex-col justify-between flex-1">
        <div>
          <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary-900 rounded-xl flex items-center justify-center text-2xl md:text-3xl shadow-xl shadow-primary-900/20">
              🧠
            </div>
            <div>
              <h3 className="text-primary-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                {t.header}
              </h3>
              <p className="text-base md:text-lg font-bold text-white leading-snug tracking-tight">
                {summary}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <ul className="space-y-2">
              <h4 className="text-[9px] md:text-[10px] font-bold uppercase text-rose-400 tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-rose-400 rounded-full"></span>
                {t.risks}
              </h4>
              {risks?.map((risk, i) => (
                <li
                  key={i}
                  className="text-[10px] md:text-xs font-medium text-stone-400 flex items-start gap-2"
                >
                  <span className="text-rose-500/50 font-black">×</span> {risk}
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              <h4 className="text-[9px] md:text-[10px] font-bold uppercase text-emerald-400 tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                {t.vectors}
              </h4>
              {opportunities?.map((opp, i) => (
                <li
                  key={i}
                  className="text-[10px] md:text-xs font-medium text-stone-400 flex items-start gap-2"
                >
                  <span className="text-emerald-500/50 font-black">✓</span>{" "}
                  {opp}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 p-4 bg-neutral-900/50 rounded-xl border border-white/5">
            <h4 className="text-[9px] md:text-[10px] font-bold uppercase text-primary-300 tracking-[0.2em] mb-3">
              {t.tasks}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {priority_actions?.slice(0, 3).map((action, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded bg-white/5 flex items-center justify-center text-[7px] md:text-[8px] text-white font-black">
                    {i + 1}
                  </div>
                  <span className="text-[10px] md:text-[11px] font-medium text-stone-300">
                    {action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExecute}
            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 active:scale-95 uppercase tracking-widest"
          >
            {t.execute}
          </button>
          <button
            onClick={onExplore}
            className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
          >
            {t.explore}
          </button>
        </div>
      </div>

      <div className="bg-neutral-950/50 px-5 md:px-8 py-4 md:py-6 border-t border-white/5 flex items-center justify-between">
        <p className="text-[8px] md:text-[9px] text-stone-500 font-bold uppercase tracking-widest leading-relaxed">
          {t.projected}
        </p>
        <div className="text-base md:text-lg font-black text-emerald-400">
          +{estimated_revenue_impact || "18%"}
        </div>
      </div>
    </Card>
  );
};

export default AIInsightBox;
