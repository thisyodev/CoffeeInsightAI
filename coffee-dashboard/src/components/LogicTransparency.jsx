import React from "react";

const LogicTransparency = ({ logicData, lang = "en" }) => {
  if (!logicData) return null;
  const { model_version, confidence_index, explainability } = logicData;

  const t = {
    th: {
      title: "ความโปร่งใสของตรรกะ AI",
      model: "โมเดลประมวลผล",
      confidence: "ความเชื่อมั่น",
      gap: "ช่องว่างเวลา",
      recovered: "ความต้องการที่กู้คืน",
      revenue: "รายได้เพิ่มขึ้น",
      formula: "สัดส่วนคะแนน Geo-Formula (0-10)",
      proximity: "ระยะทาง (Proximity)",
      comp: "การแข่งขัน (Comp)",
      alignment: "ความต้องการ (Intent)",
      quality: "คุณภาพ (Rating)",
    },
    en: {
      title: "Logic Transparency",
      model: "Engine Model",
      confidence: "Confidence",
      gap: "Opening Gap",
      recovered: "Demand Recovered",
      revenue: "Revenue Uplift",
      formula: "Geo-Formula Breakdown (0-10 Scale)",
      proximity: "Proximity",
      comp: "Competitiveness",
      alignment: "Alignment",
      quality: "Quality",
    },
  }[lang];

  return (
    <div className="bg-[#1c1917]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="text-8xl font-black italic select-none">LOGIC</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-white/5 pb-8 relative z-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-400 mb-2">
            Deterministic Engine Hardening
          </h3>
          <h2 className="text-2xl font-black text-white">{t.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest">
              {t.model}
            </p>
            <p className="text-[10px] font-black text-white">{model_version}</p>
          </div>
          <div
            className={`px-4 py-2 rounded-xl border flex flex-col items-center ${confidence_index > 0.8 ? "border-green-500/30 bg-green-500/10" : "border-amber-500/30 bg-amber-500/10"}`}
          >
            <p className="text-[8px] font-black text-stone-500 uppercase tracking-widest">
              {t.confidence}
            </p>
            <p
              className={`text-[10px] font-black ${confidence_index > 0.8 ? "text-green-400" : "text-amber-400"}`}
            >
              {Math.round(confidence_index * 100)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 relative z-10">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
            {t.gap}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {explainability.opening_gap_minutes}
            </span>
            <span className="text-[10px] font-bold text-stone-500 uppercase">
              MINUTES
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
            {t.recovered}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary-400">
              {explainability.demand_recovered_percent}%
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
            {t.revenue}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-green-400">
              +{explainability.revenue_uplift}%
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
            Missed Traffic
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-400">
              ≈{explainability.missed_traffic_raw}
            </span>
            <span className="text-[10px] font-bold text-stone-500 uppercase">
              QUERIES
            </span>
          </div>
        </div>
      </div>

      <div className="bg-black/40 rounded-3xl p-6 border border-white/5 relative z-10">
        <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-6">
          {t.formula}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <SignalBar
            label={t.proximity}
            value={explainability.formula_breakdown?.geo_score?.proximity || 0}
            max={10}
            color="bg-blue-500"
          />
          <SignalBar
            label={t.comp}
            value={
              explainability.formula_breakdown?.geo_score?.competitiveness || 0
            }
            max={10}
            color="bg-primary-500"
          />
          <SignalBar
            label={t.alignment}
            value={explainability.formula_breakdown?.geo_score?.alignment || 0}
            max={10}
            color="bg-amber-500"
          />
          <SignalBar
            label={t.quality}
            value={explainability.formula_breakdown?.geo_score?.quality || 0}
            max={10}
            color="bg-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

const SignalBar = ({ label, value, max, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center px-1">
      <span className="text-[8px] font-black text-stone-500 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-[10px] font-black text-white">{value}</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000`}
        style={{ width: `${(value / (max || 10)) * 100}%` }}
      />
    </div>
  </div>
);

export default LogicTransparency;
