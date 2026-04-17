import React from "react";
import { ResponsiveContainer, YAxis, Area, AreaChart } from "recharts";

const GeoScoreTrend = ({ data = [], color = "#22c55e" }) => {
  if (!data || data.length < 2) {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-20">
        <span className="text-[8px] font-black uppercase tracking-widest text-stone-500">
          Stabilizing Metrics...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin - 0.5", "dataMax + 0.5"]} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTrend)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GeoScoreTrend;
