import React, { useState, useEffect } from "react";
import { simulateScenarios } from "../services/api";

const MultiScenarioSimulator = ({
  isOpen,
  onClose,
  onApply,
  lang = "th",
  branchId = "asoke-01",
}) => {
  const [loading, setLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);

  const t = {
    th: {
      title: "ระบบจำลองสถานการณ์",
      subtitle: "แบบจำลองเชิงพยากรณ์สำหรับการเปลี่ยนแปลงแผนงาน",
      running: "กำลังประมวลผลการจำลองโดย AI...",
      time: "เวลาเปิดร้าน",
      geo: "คะแนน Geo Score",
      revenue: "รายได้คาดการณ์",
      best: "ทางเลือกที่ดีที่สุด",
      cancel: "ยกเลิก",
      apply: "ใช้แผนการจำลองนี้",
      loading: "กำลังดาวน์โหลดข้อมูล...",
      visibility: "ความชัดเจนของแบรนด์",
    },
    en: {
      title: "Scenario Simulator",
      subtitle: "Predictive modeling for operational changes",
      running: "Running AI Simulations...",
      time: "Opening Time",
      geo: "Geo Score",
      revenue: "Revenue Est.",
      best: "Best Choice",
      cancel: "Cancel",
      apply: "Apply Simulation",
      loading: "Applying...",
      visibility: "visibility",
    },
  }[lang];

  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      const loadScenarios = async () => {
        try {
          const response = await simulateScenarios(
            ["07:00", "07:30", "08:00"],
            branchId,
          );
          if (isMounted) {
            const scenarioData = response.data?.scenarios || [];
            setScenarios(scenarioData);
            setSimLoading(false);
            const best = scenarioData.find(
              (s) => s.opening === response.data?.best_scenario,
            );
            if (best) setSelectedScenario(best);
          }
        } catch {
          if (isMounted) setSimLoading(false);
        }
      };

      loadScenarios();
    }

    return () => {
      isMounted = false;
      setSimLoading(true);
      setSelectedScenario(null);
      setScenarios([]);
    };
  }, [isOpen, branchId]);

  if (!isOpen) return null;

  const handleApply = async () => {
    if (!selectedScenario) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onApply(selectedScenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 selection:bg-primary-500/30">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative bg-neutral-950 w-full max-w-2xl rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col border border-neutral-800">
        <div className="p-6 md:p-8 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/40 flex-shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {t.title}
            </h2>
            <p className="text-[10px] md:text-sm text-neutral-500 font-medium">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-all hover:rotate-90"
          >
            ✕
          </button>
        </div>

        <div className="p-4 md:p-6 bg-neutral-950">
          {simLoading ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-neutral-800 border-t-primary-500 rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-neutral-500 animate-pulse">
                {t.running}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[550px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-neutral-500">
                    <th className="pb-2 px-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                      Rank
                    </th>
                    <th className="pb-2 px-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                      {t.time}
                    </th>
                    <th className="pb-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-center">
                      {t.geo}
                    </th>
                    <th className="pb-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                      Confidence
                    </th>
                    <th className="pb-2 px-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-right">
                      {t.revenue}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((s, idx) => {
                    const isSelected = selectedScenario?.opening === s.opening;
                    const confidence =
                      s.confidence || (idx === 0 ? "High" : "Medium");
                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedScenario(s)}
                        className={`cursor-pointer group transition-all duration-200 ${
                          isSelected
                            ? "bg-primary-600/30 text-white shadow-2xl ring-2 ring-primary-500/50"
                            : "bg-neutral-900/30 hover:bg-neutral-800/60 border border-neutral-800 text-neutral-400"
                        } rounded-xl`}
                      >
                        <td className="py-4 px-4 rounded-l-xl">
                          <span
                            className={`text-[10px] md:text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${
                              isSelected
                                ? "bg-primary-500 text-white"
                                : "bg-neutral-800 text-neutral-600"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? "border-primary-500 bg-primary-500"
                                  : "border-neutral-700 bg-neutral-800"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span
                              className={`text-base md:text-xl font-black tracking-tighter ${isSelected ? "text-white" : "text-neutral-200"}`}
                            >
                              {s.opening}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex flex-col">
                            <span
                              className={`text-lg md:text-2xl font-black ${
                                isSelected
                                  ? "text-white"
                                  : idx === 0
                                    ? "text-emerald-400"
                                    : "text-neutral-300"
                              }`}
                            >
                              {s.new_geo_score}
                            </span>
                            <span
                              className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tight ${
                                isSelected
                                  ? "text-primary-400"
                                  : "text-neutral-500"
                              }`}
                            >
                              {s.competitive_position}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                isSelected
                                  ? "bg-primary-400 animate-pulse"
                                  : confidence === "High"
                                    ? "bg-emerald-500"
                                    : "bg-amber-400"
                              }`}
                            ></div>
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest ${
                                isSelected ? "text-white" : "text-neutral-500"
                              }`}
                            >
                              {confidence}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right px-4 rounded-r-xl">
                          <div className="flex flex-col items-end">
                            <span
                              className={`text-lg md:text-2xl font-black ${
                                isSelected ? "text-white" : "text-primary-400"
                              }`}
                            >
                              +{s.estimated_revenue_increase_percent}
                            </span>
                            <span
                              className={`text-[9px] font-bold ${
                                isSelected
                                  ? "text-primary-300"
                                  : "text-emerald-500"
                              }`}
                            >
                              +{s.visibility_increase_percent}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 bg-neutral-900/30 border-t border-neutral-800 flex flex-col sm:flex-row gap-4 justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs md:text-sm font-bold text-neutral-500 hover:text-white transition-all"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedScenario || loading || simLoading}
            className={`px-10 py-3 rounded-xl text-xs md:text-sm font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
              !selectedScenario || simLoading
                ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-500 shadow-primary-900/20"
            }`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="text-lg">🚀</span>
                {t.apply}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiScenarioSimulator;
