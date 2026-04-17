import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "./Card";

const HourBar = ({
  data,
  title = "Hourly Traffic Distribution",
  lang = "en",
}) => {
  const t =
    lang === "th"
      ? {
          label: "ความเข้มข้นของตลาด",
        }
      : {
          label: "Market Intensity",
        };

  return (
    <Card className="h-full">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-1">
          {t.label}
        </h3>
        <p className="text-lg font-bold text-white tracking-tight">{title}</p>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 10, fontWeight: 500 }}
              dy={5}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "10px",
                color: "#fff",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.count > 100 ? "#f97316" : "rgba(249, 115, 22, 0.2)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default HourBar;
