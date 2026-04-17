import React from "react";
import Card from "./Card";

const CompetitorSnapshot = ({
  currentStoreName,
  currentStoreOpening,
  competitors,
  lang = "en",
}) => {
  if (!competitors || competitors.length === 0) return null;

  const t =
    lang === "th"
      ? {
          title: "สถานะการแข่งขัน (1 กม.)",
          position: "ตำแหน่งทางการตลาด",
          active: "เปิดใช้งาน",
          away: "ห่างออกไป",
          opens: "เปิดเวลา",
          insight: "ข้อมูลเจาะลึกพื้นที่",
        }
      : {
          title: "Nearby Competitors (1km)",
          position: "Market Position",
          active: "ACTIVE",
          away: "km away",
          opens: "Opens",
          insight: "Local Insight",
        };

  // Analysis logic
  const earlierCompetitors = competitors.filter(
    (c) => c.openingTime < currentStoreOpening && c.name !== currentStoreName,
  );

  const myRating =
    competitors.find((s) => s.name === currentStoreName)?.rating || 0;
  const betterRatedCount = competitors.filter(
    (c) => c.rating > myRating && c.name !== currentStoreName,
  ).length;

  return (
    <Card className="flex flex-col h-full bg-neutral-900 border-neutral-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 md:mb-8">
        <div>
          <h3 className="text-[10px] md:text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-1">
            {t.position}
          </h3>
          <p className="text-base md:text-lg xl:text-xl font-bold text-white tracking-tight">
            {t.title}
          </p>
        </div>
        <span className="px-3 py-1 bg-white/5 border border-white/10 text-neutral-500 text-[9px] md:text-[10px] font-bold uppercase rounded-full tracking-widest">
          {competitors.length} {t.active}
        </span>
      </div>

      <div className="mb-6 flex-1 rounded-xl border border-neutral-800 overflow-hidden">
        {competitors.map((shop, i) => {
          const isMe = shop.name === currentStoreName;
          const scoreColor =
            shop.rating >= 4.5
              ? "text-green-400"
              : shop.rating >= 4.0
                ? "text-yellow-400"
                : "text-red-400";

          return (
            <div
              key={i}
              className={`p-3 md:p-4 flex items-center justify-between transition-all border-b border-neutral-800 last:border-b-0 hover:bg-neutral-900 ${
                isMe ? "bg-primary-900/20" : "bg-neutral-950/50"
              }`}
            >
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <div
                  className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-xs md:text-sm font-bold ${isMe ? "bg-white text-black" : "bg-neutral-800 text-neutral-400"}`}
                >
                  {shop.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4
                    className={`text-xs md:text-sm font-bold truncate ${isMe ? "text-white" : "text-neutral-200"}`}
                  >
                    {shop.name} {isMe && " (YOU)"}
                  </h4>
                  <p className="text-[8px] md:text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                    {shop.distanceKm || 0}
                    {t.away}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <span className="text-yellow-500 text-[8px] md:text-[10px]">
                    ★
                  </span>
                  <span
                    className={`text-xs md:text-sm font-bold ${scoreColor}`}
                  >
                    {shop.rating}
                  </span>
                </div>
                <p
                  className={`text-[8px] md:text-[9px] font-bold tracking-widest uppercase ${isMe ? "text-primary-200" : "text-neutral-600"}`}
                >
                  {t.opens} {shop.openingTime}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex gap-3 items-center">
        <div className="text-xl">🚀</div>
        <div>
          <p className="text-[9px] font-bold text-primary-400 uppercase tracking-widest mb-0.5">
            {t.insight}
          </p>
          <p className="text-[10px] font-medium text-neutral-400 leading-snug">
            {earlierCompetitors.length} competitors open before you.
            {betterRatedCount > 0
              ? ` ${betterRatedCount} higher rated.`
              : " Quality leader."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CompetitorSnapshot;
