import Card from "./Card";

export default function KPI({ title, value, desc }) {
  return (
    <Card className="flex flex-col justify-between h-full p-6 md:p-8">
      <div>
        <h3 className="text-xs md:text-sm text-espresso-600 font-semibold tracking-wide uppercase mb-3">
          {title}
        </h3>
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-espresso-900 tracking-tight leading-tight">
          {value}
        </p>
      </div>
      {desc && (
        <p className="text-xs text-espresso-600 font-medium mt-4 italic uppercase tracking-widest">
          {desc}
        </p>
      )}
    </Card>
  );
}
