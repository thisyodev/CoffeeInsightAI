import { useEffect, useState } from "react";
import { fetchDashboard, fetchBranches } from "../services/api";
import Navigation from "../components/Navigation";
import KPI from "../components/KPI";
import IntentPie from "../components/IntentPie";
import HourBar from "../components/HourBar";
import WorkTrend from "../components/WorkTrend";
import AIInsightBox from "../components/AIInsightBox";
import GeoScoreWidget from "../components/GeoScoreWidget";
import CompetitorSnapshot from "../components/CompetitorSnapshot";
import MultiScenarioSimulator from "../components/MultiScenarioSimulator";
import MarketMap from "../components/MarketMap";
import EnginePanel from "../components/EnginePanel";
import SimulationHistoryWidget from "../components/SimulationHistoryWidget";
import LocationAnalyzerModal from "../components/LocationAnalyzerModal";
import RevenueLeakageCard from "../components/RevenueLeakageCard";
import SecurityGate from "../components/SecurityGate";
import Toast from "../components/Toast";
import SettingsPanel from "../components/SettingsPanel";
import { translations } from "../utils/translations";

const DashboardSkeleton = () => (
  <div className="p-8 bg-cream-100 min-h-screen w-full animate-pulse">
    <div className="mb-10 flex justify-between items-center">
      <div className="space-y-3">
        <div className="h-8 bg-espresso-200/30 rounded-lg w-64"></div>
        <div className="h-4 bg-espresso-200/20 rounded w-96"></div>
      </div>
    </div>
    <div className="h-64 bg-latte-100/40 rounded-3xl mb-8"></div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lang, setLang] = useState("th");
  const [systemError, setSystemError] = useState(null);
  const [aiStatus, setAiStatus] = useState("online");
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [selectedBranch, setSelectedBranch] = useState("asoke-01");
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const t = translations[lang];

  const loadBranches = async () => {
    const res = await fetchBranches();
    if (res.success) {
      setBranches(res.data);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadBranches();
  }, [isAuthenticated]);

  const handleAnalysisComplete = async (newBranch) => {
    setToast({
      message:
        lang === "th"
          ? `วิเคราะห์สำเร็จ! บันทึกข้อมูล ${newBranch.name} ลงระบบแล้ว`
          : `Analysis complete! ${newBranch.name} persisted to database.`,
      type: "success",
    });
    await loadBranches();
    setSelectedBranch(newBranch.id);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        // Show loading state briefly when switching branches
        setLoading(true);

        const dashboardRes = await fetchDashboard(lang, selectedBranch);

        // Small delay to ensure UI update is visible
        setTimeout(() => {
          setData(dashboardRes);
          setLastUpdate(new Date().toLocaleTimeString());
          setLoading(false);
          setAiStatus("online");
          setSystemError(null);
        }, 300);
      } catch (err) {
        setAiStatus("offline");
        setSystemError(err.message || "Connection to neural seed lost.");
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, lang, selectedBranch]);

  const handleApplyScenario = (scenario) => {
    setToast({
      message:
        lang === "th"
          ? `ปรับเปลี่ยนแผนเรียบร้อย: เปิดเวลา ${scenario.time || scenario.opening}`
          : `Operational Change Applied: Opens at ${scenario.time || scenario.opening}`,
      type: "success",
    });
  };

  if (!isAuthenticated) {
    return <SecurityGate onAccessGranted={() => setIsAuthenticated(true)} />;
  }

  if (loading) return <DashboardSkeleton />;

  // Page routing logic
  const renderPageContent = () => {
    // Special case for Settings - render the actual component
    if (currentPage === "settings") {
      return (
        <div className="w-full py-8 px-4">
          <SettingsPanel lang={lang} onLanguageChange={setLang} />
        </div>
      );
    }

    const pageConfig = {
      analytics: { icon: "📊", titleEn: "Analytics Hub", titleTh: "ศูนย์วิเคราะห์ข้อมูล" },
      geo: { icon: "📍", titleEn: "Geo-Spatial Analysis", titleTh: "การวิเคราะห์ภูมิศาสตร์" },
      demand: { icon: "📊", titleEn: "Demand Analysis", titleTh: "การวิเคราะห์ความต้องการ" },
      revenue: { icon: "💰", titleEn: "Revenue Insights", titleTh: "ข้อมูลเชิงลึกด้านรายได้" },
      simulation: { icon: "🎯", titleEn: "Simulation Engine", titleTh: "เครื่องจำลองสถานการณ์" },
      locations: { icon: "📍", titleEn: "Location Management", titleTh: "การจัดการสถานที่" },
    };

    const config = pageConfig[currentPage];
    if (!config) return null;

    const title = lang === "th" ? config.titleTh : config.titleEn;

    return (
      <div className="w-full py-20 px-4 flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="max-w-2xl w-full text-center">
          {/* Icon */}
          <div style={{ fontSize: "80px", marginBottom: "24px" }}>
            {config.icon}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#6f4e37",
            marginBottom: "16px",
            lineHeight: "1.2"
          }}>
            {title}
          </h1>

          {/* Subtitle */}
          <p style={{
            color: "#a18072",
            fontSize: "18px",
            marginBottom: "32px",
            lineHeight: "1.6"
          }}>
            {lang === "th" ? "หน้านี้อยู่ระหว่างการพัฒนา" : "This page is currently under development"}
          </p>

          {/* Description Box */}
          <div style={{
            backgroundColor: "#fef5f0",
            border: "2px solid #e8907a",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "32px"
          }}>
            <p style={{
              color: "#6f4e37",
              fontSize: "16px",
              marginBottom: "16px"
            }}>
              {lang === "th"
                ? "เรากำลังเพิ่มคุณสมบัติใหม่อย่างน่าตื่นเต้นให้กับส่วนนี้"
                : "We're working on bringing exciting new features to this section"}
            </p>
            <p style={{
              color: "#a18072",
              fontSize: "14px"
            }}>
              {lang === "th"
                ? "ในขณะนี้ กรุณากลับไปที่แดชบอร์ดเพื่อใช้งานฟีเจอร์ที่มีอยู่"
                : "In the meantime, please return to the Dashboard to use available features"}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap"
          }} className="sm:flex-row">
            <button
              onClick={() => setCurrentPage("dashboard")}
              style={{
                padding: "12px 32px",
                backgroundColor: "#6f4e37",
                color: "#fef5f0",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#5c3f2f"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#6f4e37"}
            >
              {lang === "th" ? "← กลับไปแดชบอร์ด" : "← Back to Dashboard"}
            </button>
            <button
              onClick={() => setIsAnalyzerOpen(true)}
              style={{
                padding: "12px 32px",
                backgroundColor: "#fef5f0",
                color: "#6f4e37",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "2px solid #6f4e37",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#6f4e37";
                e.target.style.color = "#fef5f0";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#fef5f0";
                e.target.style.color = "#6f4e37";
              }}
            >
              {lang === "th" ? "📡 วิเคราะห์ตำแหน่งใหม่" : "📡 Analyze New Site"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-cream-50 text-espresso-900 selection:bg-caramel-200 overflow-x-hidden">
      {/* Improved Navigation */}
      <Navigation
        selectedBranch={selectedBranch}
        branches={branches}
        onBranchChange={setSelectedBranch}
        lang={lang}
        onLanguageChange={setLang}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* System Status Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-[101] flex transition-all duration-700 shadow-lg ${
          systemError || aiStatus === "offline"
            ? "h-10 bg-latte-600"
            : aiStatus === "degraded"
              ? "h-10 bg-caramel-500"
              : "h-1 bg-espresso-600 opacity-80"
        }`}
      >
        {(systemError || aiStatus !== "online") && (
          <div className="flex-1 flex items-center px-6 justify-between overflow-hidden">
            <p className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="bg-black/20 px-2 py-0.5 rounded text-[8px]">
                {aiStatus === "online"
                  ? "ALERT"
                  : "SYSTEM " + aiStatus.toUpperCase()}
              </span>
              {systemError || "Neural connection degraded."} • Safe Mode Active
            </p>
            <span className="text-[8px] font-black opacity-60 uppercase tracking-widest hidden md:inline">
              Deterministic Logic Layer v{data?.model_version || "1.0"}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 min-h-screen">
        {/* Show page content if not on dashboard */}
        {currentPage !== "dashboard" ? (
          renderPageContent()
        ) : (
          <>
        {/* Current Location Indicator */}
        <div className="mb-6 md:mb-8 p-6 bg-gradient-to-r from-espresso-500 to-espresso-600 border-2 border-caramel-300 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-cream-100 font-semibold mb-2 uppercase tracking-wider">{lang === "th" ? "📍 สถานที่ที่เลือก" : "📍 Selected Location"}</p>
            <p className="text-lg md:text-2xl font-bold text-cream-50">
              {branches.find(b => b.id === selectedBranch)?.name || selectedBranch}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-cream-200 font-medium mb-1">{lang === "th" ? "🔄 อัปเดตล่าสุด" : "🔄 Last Updated"}</p>
            <p className="text-sm md:text-base font-bold text-caramel-200">{lastUpdate}</p>
          </div>
        </div>

        {/* Intelligence Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Main Intelligence Card - Row 1 */}
          {data.daily_report && (
            <div className="md:col-span-2 xl:col-span-12 mb-4 md:mb-6">
              <div className="p-8 md:p-10 bg-gradient-to-br from-primary-950 to-neutral-900 rounded-3xl text-white shadow-2xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12 border border-primary-500/20 relative overflow-hidden">
                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-primary-500/10 rounded-3xl flex items-center justify-center text-6xl md:text-7xl shadow-inner border border-primary-500/30">
                  🚀
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary-300 mb-3">
                    {t.strategic_intelligence_brief}
                  </h2>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6 leading-tight">
                    {data.daily_report.headline}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <div className="bg-rose-900/30 px-4 py-3 rounded-lg border border-rose-500/40 text-sm md:text-base font-bold text-rose-100">
                      <span className="text-rose-400 mr-2">⚠️ RISK:</span>
                      {data.daily_report.top_risk}
                    </div>
                    <div className="bg-emerald-900/30 px-4 py-3 rounded-lg border border-emerald-500/40 text-sm md:text-base font-bold text-emerald-100">
                      <span className="text-emerald-400 mr-2">✨ OPPORTUNITY:</span>
                      {data.daily_report.top_opportunity}
                    </div>
                  </div>
                </div>
                <div className="bg-white text-black p-6 md:p-8 rounded-2xl w-full lg:w-96 text-center shadow-2xl border-2 border-white">
                  <p className="text-xs md:text-sm font-bold uppercase tracking-widest mb-2 opacity-60">
                    {t.tactical_recommendation}
                  </p>
                  <p className="text-sm md:text-lg font-bold leading-relaxed italic">
                    "{data.daily_report.action_today}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* KPI Row - Row 2 */}
          <div className="md:col-span-1 xl:col-span-3 h-40 md:h-48">
            <KPI
              title={t.market_captured_traffic}
              value={data.data.totalQueries?.toLocaleString()}
            />
          </div>
          <div className="md:col-span-1 xl:col-span-3 h-40 md:h-48">
            <KPI title={t.morning_intensity} value={data.data.morningPercent} />
          </div>
          <div className="md:col-span-1 xl:col-span-3 h-40 md:h-48">
            <KPI title={t.retention_potential} value={data.data.workPercent} />
          </div>
          <div className="md:col-span-1 xl:col-span-3 h-40 md:h-48">
            <KPI title={t.strategic_peak} value={data.peakHour || "08:00 AM"} />
          </div>

          {/* Revenue Leakage - Row 3 */}
          {data.explainability && (
            <div className="md:col-span-2 xl:col-span-12 mt-4 md:mt-6">
              <RevenueLeakageCard
                explainability={data.explainability}
                lang={lang}
              />
            </div>
          )}

          {/* Geo + Map - Row 4 */}
          <div className="md:col-span-2 xl:col-span-6 h-[220px] sm:h-[270px] lg:h-[360px] mt-2 md:mt-4">
            <GeoScoreWidget
              score={data.data.geoScore}
              status={data.data.geoStatus}
              change={parseFloat(data.data.geoChange)}
              sparkline={data.data.geoSparkline}
              breakdown={data.explainability?.formula_breakdown?.geo_score}
              lang={lang}
            />
          </div>
          <div className="md:col-span-2 xl:col-span-6 h-[220px] sm:h-[270px] lg:h-[360px] mt-2 md:mt-4">
            <MarketMap
              lang={lang}
              className="h-full rounded-xl md:rounded-2xl overflow-hidden"
              location={branches.find(b => b.id === selectedBranch)?.name}
              competitors={data.data?.competitors || []}
            />
          </div>

          {/* AI Box + Competitors - Row 5 */}
          <div className="md:col-span-2 xl:col-span-4 min-h-[300px] sm:min-h-[400px] mt-4 md:mt-6">
            <AIInsightBox analysis={data.data.ai_analysis} lang={lang} />
          </div>
          <div className="md:col-span-2 xl:col-span-8 min-h-[300px] sm:min-h-[400px] mt-4 md:mt-6">
            {(() => {
              const currentStore = data.data.competitors?.find(c => c.distanceKm === 0);
              return (
                <CompetitorSnapshot
                  competitors={data.data.competitors}
                  currentStoreName={currentStore?.name}
                  currentStoreOpening={currentStore?.openingTime}
                  lang={lang}
                />
              );
            })()}
          </div>

          {/* Charts Row - Row 6 */}
          <div className="md:col-span-2 xl:col-span-4 mt-4 md:mt-6">
            <IntentPie data={data.data.intentDistribution} lang={lang} />
          </div>
          <div className="md:col-span-2 xl:col-span-4 mt-4 md:mt-6">
            <HourBar data={data.data.hourlyDistribution} lang={lang} />
          </div>
          <div className="md:col-span-2 xl:col-span-4 mt-4 md:mt-6">
            <WorkTrend data={data.data.workTrend} lang={lang} />
          </div>

          {/* Simulation History Row - Row 7 */}
          <div className="md:col-span-2 xl:col-span-12 mt-4 md:mt-6">
            <SimulationHistoryWidget branchId={selectedBranch} lang={lang} />
          </div>

          {/* Engine Formulas - Footer Row */}
          <div className="md:col-span-2 xl:col-span-12 mt-6 md:mt-8">
            <EnginePanel explainability={data.explainability} lang={lang} />
          </div>
        </div>

        <footer className="mt-12 md:mt-16 lg:mt-24 py-6 md:py-8 lg:py-12 border-t border-neutral-800 flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            <span className="px-2 md:px-3 py-1 md:py-1.5 bg-neutral-900 border border-neutral-800 text-[8px] md:text-[9px] font-bold text-neutral-500 rounded-lg uppercase tracking-widest shadow-sm whitespace-nowrap">
              [Model v{data.model_version || "1.0.0"}]
            </span>
            <span className="px-2 md:px-3 py-1 md:py-1.5 bg-neutral-900 border border-neutral-800 text-[8px] md:text-[9px] font-bold text-neutral-500 rounded-lg uppercase tracking-widest shadow-sm hidden sm:inline-block">
              [Deterministic Engine]
            </span>
            <span className="px-2 md:px-3 py-1 md:py-1.5 bg-neutral-950 border border-primary-900/50 text-[8px] md:text-[9px] font-bold text-primary-500 rounded-lg uppercase tracking-widest shadow-lg hidden lg:inline-block">
              [Production Environment]
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-600 text-center">
              CoffeeInsight AI Intelligence Platform
            </p>
            <p className="text-[7px] md:text-[8px] font-medium text-neutral-700 uppercase tracking-widest text-center px-4">
              &copy; 2026 Enterprise Intelligence Systems • Fully Transparent
              Decision Support
            </p>
          </div>
        </footer>
          </>
        )}
      </div>

      <LocationAnalyzerModal
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
        lang={lang}
      />

      <MultiScenarioSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onApply={handleApplyScenario}
        lang={lang}
        branchId={selectedBranch}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
