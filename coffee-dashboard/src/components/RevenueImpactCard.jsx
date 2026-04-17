import React, { useState, useEffect } from "react";

const RevenueImpactCard = ({ percent = 0, range = "+10% to +20%" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseInt(percent) || 0;
    let startTime = null;
    const duration = 1500;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = end === 0 ? 0 : Math.floor(progress * end);

      setCount(currentCount);

      if (progress < 1 && end > 0) {
        requestAnimationFrame(step);
      }
    };

    const animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [percent]);

  return (
    <div className="bg-white/5 p-8 rounded-3xl border border-white/5 shadow-inner backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50"></div>

      <h4 className="relative z-10 text-[10px] font-black uppercase text-stone-500 tracking-[0.2em] mb-6">
        Revenue Projection Alpha
      </h4>

      <div className="relative z-10 flex flex-col items-center justify-center py-2">
        <div className="text-7xl font-black bg-gradient-to-b from-green-400 to-green-600 bg-clip-text text-transparent tracking-tighter drop-shadow-[0_10px_10px_rgba(34,197,94,0.3)]">
          +{count}%
        </div>
        <div className="flex flex-col items-center mt-4">
          <p className="text-xs font-black text-white uppercase tracking-widest">
            Growth Potential
          </p>
          <p className="text-[10px] text-stone-500 font-bold mt-1 uppercase tracking-tighter">
            Confidence Index: High ({range})
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full bg-black/40 h-3 rounded-full mt-8 overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(34,197,94,0.5)]"
          style={{ width: `${Math.min(100, (count / 25) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RevenueImpactCard;
