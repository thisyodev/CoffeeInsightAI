import React from "react";

const RevenueLeakageCard = ({ explainability, lang = "th" }) => {
  if (!explainability) return null;

  const t = {
    th: {
      title: "ความสูญเสียทางรายได้ (Revenue Leakage)",
      gapLabel: "เปิดร้านช้ากว่าคู่แข่ง",
      demandLabel: "ดีมานด์ที่หลุดลอยไป",
      impactLabel: "ผลกระทบต่อรายได้",
      minutes: "นาที",
      queries: "กลุ่มความต้องการ",
      status: "Enterprise Alert",
    },
    en: {
      title: "Revenue Leakage Analysis",
      gapLabel: "Opening Gap vs Market",
      demandLabel: "Missed Traffic Opportunity",
      impactLabel: "Est. Revenue Loss",
      minutes: "mins",
      queries: "requests",
      status: "Enterprise Alert",
    },
  }[lang];

  return (
    <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-red-900/70 to-red-800/40 border border-red-500/20 p-5 md:p-8 transition-all duration-700 shadow-2xl">
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div>
          <span className="bg-red-500/10 text-red-500 text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
            {t.status}
          </span>
          <h3 className="text-base md:text-lg xl:text-xl font-bold text-red-100/90 tracking-tight">
            {t.title}
          </h3>
        </div>
        <div className="text-2xl md:text-3xl opacity-70">⚠️</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-black/40 border border-white/5 transition-all">
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
            {t.gapLabel}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl xl:text-3xl font-bold text-red-400">
              {explainability.opening_gap_minutes}
            </span>
            <span className="text-[10px] font-bold text-neutral-600 uppercase">
              {t.minutes}
            </span>
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-black/40 border border-white/5 transition-all">
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
            {t.demandLabel}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl xl:text-3xl font-bold text-red-400">
              ~{Math.round(explainability.opening_gap_minutes * 1.5)}
            </span>
            <span className="text-[10px] font-bold text-neutral-600 uppercase">
              {t.queries}
            </span>
          </div>
        </div>

        <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-red-950/40 border border-red-500/20 transition-all">
          <p className="text-[9px] font-bold text-red-300 uppercase tracking-widest mb-2">
            {t.impactLabel}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl xl:text-3xl font-bold text-red-400">
              -{explainability.demand_recovered_percent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueLeakageCard;
