import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "./Card";

const IntentPie = ({
  data,
  title = "Market Intent Distribution",
  lang = "en",
}) => {
  const COLORS = ["#78350f", "#451a03", "#92400e", "#b45309", "#d97706"];

  const t =
    lang === "th"
      ? {
          label: "ความต้องการลูกค้า",
        }
      : {
          label: "Consumer Intent",
        };

  return (
    <Card className="h-full">
      <div className="mb-6 md:mb-8">
        <h3 className="text-[10px] md:text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-1">
          {t.label}
        </h3>
        <p className="text-base md:text-lg font-bold text-white tracking-tight">
          {title}
        </p>
      </div>
      <div className="h-48 md:h-56 w-full flex flex-col items-center justify-center space-y-4 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={65}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "10px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-2 w-full">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5 md:gap-2">
              <div
                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-[9px] md:text-[10px] font-medium text-neutral-400 truncate">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default IntentPie;
