import React from "react";
import GeoScoreTrend from "./GeoScoreTrend";
import Card from "./Card";

const GeoScoreWidget = ({
  score = 0,
  change = 0,
  status = "Stable",
  sparkline = [],
  breakdown = {},
  lang = "en",
}) => {
  const {
    proximity: distance = 0,
    competitiveness: openingTime = 0,
    alignment: intentMatch = 0,
    quality: review = 0,
  } = breakdown;

  const labels =
    lang === "th"
      ? {
          title: "คะแนนทำเล (Geo Score)",
          dist: "ระยะทาง",
          hours: "เวลาเปิด",
          intent: "ความต้องการ",
          review: "รีวิว",
        }
      : {
          title: "Geo Score Index",
          dist: "Distance",
          hours: "Hours",
          intent: "Intent",
          review: "Review",
        };

  const trendData = sparkline.map((s) => ({ score: s }));

  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div>
          <h3 className="text-base md:text-lg font-semibold tracking-wide text-white uppercase mb-1">
            {labels.title}
          </h3>
          <span className="text-[9px] md:text-[10px] font-bold text-primary-400 uppercase tracking-widest bg-primary-900/20 px-2 py-0.5 rounded border border-primary-500/20">
            {status}
          </span>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-3xl md:text-4xl font-bold text-white leading-none">
              {score.toFixed(1)}
            </span>
            <span className="text-neutral-500 font-medium text-xs md:text-sm">
              /10
            </span>
          </div>
          <p
            className={`text-[10px] md:text-[11px] font-bold mt-1 ${change >= 0 ? "text-emerald-500" : "text-rose-500"}`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-[9px] md:text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            {labels.dist}
          </p>
          <p className="text-base md:text-lg font-bold text-white">
            {distance}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] md:text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            {labels.hours}
          </p>
          <p className="text-base md:text-lg font-bold text-white">
            {openingTime}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] md:text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            {labels.intent}
          </p>
          <p className="text-base md:text-lg font-bold text-white">
            {intentMatch}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] md:text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            {labels.review}
          </p>
          <p className="text-base md:text-lg font-bold text-white">{review}</p>
        </div>
      </div>

      <div className="h-20 w-full opacity-60">
        <GeoScoreTrend
          data={trendData}
          color={change >= 0 ? "#10b981" : "#f43f5e"}
        />
      </div>
    </Card>
  );
};

export default GeoScoreWidget;
