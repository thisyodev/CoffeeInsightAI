import { useState, useEffect } from "react";

export default function MarketMap({
  location = "Sukhumvit (Asoke Junction), Bangkok",
  competitors = [],
  className = "",
  lang = "en",
}) {
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 1500);
    return () => clearTimeout(timer);
  }, [competitors]);

  // Calculate metrics from real competitor data
  const competitorCount = competitors.filter(c => c.distanceKm > 0).length;
  const avgRating =
    competitors.length > 0
      ? (
          competitors.reduce((sum, c) => sum + (c.rating || 0), 0) /
          competitors.length
        ).toFixed(1)
      : 0;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const timeToMins = (h) => {
    const [hrs, mins] = h.split(":").map(Number);
    return hrs * 60 + mins;
  };
  const nowMins = currentHour * 60 + currentMinute;

  // Count open/closed competitors
  const openNow = competitors.filter((c) => {
    if (!c.openingTime) return false;
    const openMins = timeToMins(c.openingTime);
    return nowMins >= openMins;
  }).length;

  // Determine traffic level based on competitors
  let trafficLevel = "Light";
  let trafficColor = "text-green-400";
  if (competitorCount >= 5) {
    trafficLevel = lang === "th" ? "หนัก" : "Heavy";
    trafficColor = "text-red-400";
  } else if (competitorCount >= 3) {
    trafficLevel = lang === "th" ? "ปานกลาง" : "Moderate";
    trafficColor = "text-yellow-400";
  } else {
    trafficLevel = lang === "th" ? "เบา" : "Light";
    trafficColor = "text-green-400";
  }

  return (
    <div
      className={`bg-gradient-to-br from-espresso-700 to-espresso-800 border border-caramel-300 rounded-xl md:rounded-2xl overflow-hidden relative w-full ${className}`}
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-caramel-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-cream-50 font-black text-sm md:text-lg tracking-tight flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-caramel-500 rounded-full animate-pulse"></span>
              {lang === "th" ? "การวิเคราะห์ตลาดแบบสดใจ" : "Live Market Analysis"}
            </h3>
            <p className="text-cream-200 text-xs md:text-sm font-medium">
              📍 {location}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Competitors Count */}
        <div className="bg-espresso-600/50 border border-caramel-200 rounded-lg p-3 md:p-4 text-center">
          <p className="text-[10px] md:text-xs font-bold text-cream-200 uppercase tracking-widest mb-2">
            {lang === "th" ? "คู่แข่ง" : "Competitors"}
          </p>
          <p className="text-2xl md:text-3xl font-black text-caramel-500 mb-1">
            {competitorCount}
          </p>
          <p className="text-[9px] text-cream-300">
            {lang === "th" ? "ในรัศมี 1 กม." : "within 1km"}
          </p>
        </div>

        {/* Average Rating */}
        <div className="bg-espresso-600/50 border border-caramel-200 rounded-lg p-3 md:p-4 text-center">
          <p className="text-[10px] md:text-xs font-bold text-cream-200 uppercase tracking-widest mb-2">
            {lang === "th" ? "เรตติ้ง" : "Avg Rating"}
          </p>
          <p className="text-2xl md:text-3xl font-black text-yellow-400 mb-1">
            {avgRating}
          </p>
          <p className="text-[9px] text-cream-300">⭐ {competitorCount} shops</p>
        </div>

        {/* Open Now */}
        <div className="bg-espresso-600/50 border border-caramel-200 rounded-lg p-3 md:p-4 text-center">
          <p className="text-[10px] md:text-xs font-bold text-cream-200 uppercase tracking-widest mb-2">
            {lang === "th" ? "เปิดอยู่" : "Open Now"}
          </p>
          <p className="text-2xl md:text-3xl font-black text-green-400 mb-1">
            {openNow}/{competitorCount}
          </p>
          <p className="text-[9px] text-cream-300">
            {lang === "th" ? "ขณะนี้" : "currently"}
          </p>
        </div>

        {/* Traffic Level */}
        <div className="bg-espresso-600/50 border border-caramel-200 rounded-lg p-3 md:p-4 text-center">
          <p className="text-[10px] md:text-xs font-bold text-cream-200 uppercase tracking-widest mb-2">
            {lang === "th" ? "ข้อมูล" : "Traffic"}
          </p>
          <p className={`text-2xl md:text-3xl font-black ${trafficColor} mb-1`}>
            {trafficLevel}
          </p>
          <p className="text-[9px] text-cream-300">
            {lang === "th" ? "ความหนาแน่น" : "density"}
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 md:px-6 pb-4 md:pb-6">
        <div className="bg-caramel-500/10 border border-caramel-300 rounded-lg p-3 md:p-4">
          <div className="grid grid-cols-2 gap-4 text-[10px] md:text-sm">
            <div>
              <p className="text-cream-200 font-bold uppercase tracking-widest mb-1">
                {lang === "th" ? "สถิติแข่ง" : "Competitive"}
              </p>
              <p className="text-cream-50 font-bold">
                {competitorCount > 0
                  ? lang === "th"
                    ? `${competitorCount} ร้านใกล้เคียง`
                    : `${competitorCount} nearby shops`
                  : lang === "th"
                    ? "ไม่มีคู่แข่ง"
                    : "No competitors"}
              </p>
            </div>
            <div>
              <p className="text-cream-200 font-bold uppercase tracking-widest mb-1">
                {lang === "th" ? "สถานะปัจจุบัน" : "Current Status"}
              </p>
              <p className="text-cream-50 font-bold">
                {isScanning
                  ? lang === "th"
                    ? "กำลังสแกน..."
                    : "Scanning..."
                  : lang === "th"
                    ? "ข้อมูลอัปเดต"
                    : "Data Updated"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isScanning && (
        <div className="absolute inset-0 bg-espresso-900/60 backdrop-blur-sm flex items-center justify-center rounded-xl md:rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-caramel-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold text-cream-100 uppercase tracking-widest">
              {lang === "th" ? "วิเคราะห์ข้อมูล..." : "Analyzing..."}
            </span>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0% { top: -2%; }
          100% { top: 102%; }
        }
      `,
        }}
      />
    </div>
  );
}
