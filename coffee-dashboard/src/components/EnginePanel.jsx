import React, { useState } from "react";

const EnginePanel = ({ explainability, lang = "th" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!explainability) return null;

  const t = {
    th: {
      btn: "AI Logic Transparency (Click to Expand)",
      geo_formula: "สูตรคำนวณ Geo Score",
      rev_formula: "สูตรคำนวณ Revenue Uplift",
      assumptions: "สมมติฐานหลักของโมเดล",
      reasoning: "เหตุผลการประเมินความเชื่อมั่น",
    },
    en: {
      btn: "AI Logic Transparency (Click to Expand)",
      geo_formula: "Geo Score Formula",
      rev_formula: "Revenue Uplift Formula",
      assumptions: "Core Model Assumptions",
      reasoning: "Confidence Reasoning",
    },
  }[lang];

  return (
    <div className="mt-12 rounded-2xl border border-neutral-800 bg-neutral-900/30 overflow-hidden transition-all duration-500 hover:border-neutral-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-5 flex items-center justify-between hover:bg-white/5 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-400 group-hover:bg-primary-900 transition-colors">
            ⚙️
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-primary-400 transition-colors">
            {t.btn}
          </span>
        </div>
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full border border-neutral-800 transition-all ${isOpen ? "rotate-180 bg-neutral-800" : ""}`}
        >
          <span className="text-[10px] text-neutral-500">▼</span>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-8 border-t border-neutral-800 bg-neutral-950/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                  {t.geo_formula}
                </h4>
                <code className="block bg-black/60 p-5 rounded-xl text-[10px] font-mono text-neutral-400 border border-neutral-800 overflow-x-auto leading-relaxed">
                  {explainability.geo_formula}
                </code>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                  {t.rev_formula}
                </h4>
                <code className="block bg-black/60 p-5 rounded-xl text-[10px] font-mono text-neutral-400 border border-neutral-800 overflow-x-auto leading-relaxed">
                  {explainability.revenue_formula}
                </code>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                  {t.assumptions}
                </h4>
                <ul className="space-y-3">
                  {explainability.assumptions?.map((as, i) => (
                    <li
                      key={i}
                      className="text-[11px] font-medium text-neutral-400 flex items-start gap-3"
                    >
                      <span className="text-primary-500 mt-1">•</span>
                      <span className="flex-1">{as}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
                  {t.reasoning}
                </h4>
                <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800">
                  <p className="text-[11px] italic text-neutral-400 leading-relaxed font-medium">
                    "{explainability.confidence_reason}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnginePanel;
