import React, { useEffect, useState } from "react";
import { fetchSimulationHistory } from "../services/api";

const SimulationHistoryWidget = ({ branchId, lang = "th" }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = {
    th: {
      title: "ประวัติการจำลองแผนงาน",
      no_data: "ยังไม่มีประวัติการจำลอง",
      time: "เวลา",
      geo: "Geo Score",
      impact: "Revenue",
      at: "เมื่อวันที่",
    },
    en: {
      title: "Simulation History",
      no_data: "No history found",
      time: "Time",
      geo: "Geo Score",
      impact: "Revenue",
      at: "Date",
    },
  }[lang];

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      const res = await fetchSimulationHistory(branchId);
      if (res.success) {
        setHistory(res.data);
      }
      setLoading(false);
    };
    loadHistory();
  }, [branchId]);

  if (loading)
    return (
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-[2rem] p-6 animate-pulse">
        <div className="h-6 bg-white/5 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-[2.5rem] p-8 h-full transition-all hover:border-neutral-700/50 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-600/10 flex items-center justify-center border border-primary-500/20">
            <span className="text-xl">📜</span>
          </div>
          <h3 className="text-xl font-black text-white leading-tight tracking-tight">
            {t.title}
          </h3>
        </div>
        <span className="text-[10px] font-black bg-neutral-800 text-neutral-500 px-3 py-1 rounded-full uppercase tracking-widest">
          Recent 5
        </span>
      </div>

      <div className="space-y-3">
        {history.length === 0 ? (
          <p className="text-neutral-600 text-center py-10 font-medium italic">
            {t.no_data}
          </p>
        ) : (
          history.map((sim, idx) => (
            <div
              key={idx}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-900/50 hover:bg-neutral-800/80 border border-neutral-800/50 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs shadow-lg shadow-primary-900/20">
                  {(sim.opening_time || "08:00:00").substring(0, 5)}
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                    {t.at} {new Date(sim.simulated_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-neutral-400 font-semibold">
                    {new Date(sim.simulated_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 sm:mt-0">
                <div className="text-right">
                  <div className="text-[9px] text-neutral-600 font-black uppercase tracking-widest">
                    {t.geo}
                  </div>
                  <div className="text-lg font-black text-emerald-400">
                    {sim.predicted_geo_score}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-neutral-600 font-black uppercase tracking-widest">
                    {t.impact}
                  </div>
                  <div className="text-lg font-black text-primary-400">
                    +{sim.predicted_revenue_uplift}%
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimulationHistoryWidget;
