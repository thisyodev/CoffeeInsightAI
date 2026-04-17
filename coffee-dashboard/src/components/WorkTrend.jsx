import React from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "./Card";

const WorkTrend = ({
  data,
  title = "Work-Friendly Demand Trend",
  lang = "en",
}) => {
  const t =
    lang === "th"
      ? {
          label: "ข้อมูลสภาพแวดล้อม",
          live: "ข้อมูลสด",
        }
      : {
          label: "Environmental Telemetry",
          live: "Live Flow",
        };

  if (!data || data.length === 0) {
    return (
      <Card className="h-64 flex flex-col items-center justify-center animate-pulse">
        <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
          Loading Data...
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-1">
            {t.label}
          </h3>
          <p className="text-lg font-bold text-white tracking-tight">{title}</p>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 bg-primary-900/20 rounded-full border border-primary-500/20">
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></span>
          <span className="text-[8px] font-bold text-primary-400 uppercase tracking-widest">
            {t.live}
          </span>
        </div>
      </div>

      <div className="h-48 w-full group">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 9, fontWeight: 500 }}
              dy={5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "10px",
                color: "#fff",
              }}
              itemStyle={{ color: "#f97316" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default WorkTrend;
