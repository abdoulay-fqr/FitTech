// ─────────────────────────────────────────────
// COMPOSANT – MembershipsCard
// Quadrant 4 : courbe des membres (LineChart)
// ─────────────────────────────────────────────
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ViewReportBtn from "./ViewReportBtn";

interface MembershipData {
  month: string;
  men: number;
  women: number;
}

interface MembershipsCardProps {
  total: number;
  percentChange: number;
  period: string;
  chartData: MembershipData[];
}

export default function MembershipsCard({
  total,
  percentChange,
  period,
  chartData,
}: MembershipsCardProps) {
  const isNegative = percentChange < 0;

  return (
    <div className="p-4 sm:p-5 lg:p-6">

      {/* Bouton en haut à droite */}
      <div className="flex justify-end mb-2">
        <ViewReportBtn />
      </div>

      {/* Titre */}
      <h2 className="text-sm font-semibold text-gray-800 mt-1">Memberships</h2>

      {/* Total membres */}
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
        {total.toLocaleString("fr-DZ")}
      </p>

      {/* % évolution */}
      <div className="flex items-center gap-1 mt-1 flex-wrap">
        <span className={`font-semibold text-sm ${isNegative ? "text-red-500" : "text-green-500"}`}>
          {isNegative ? "↓" : "↑"} {Math.abs(percentChange)}%
        </span>
        <span className="text-gray-400 text-xs">vs last month</span>
      </div>

      {/* Période */}
      <p className="text-xs text-gray-400 mt-2 mb-3">from {period}</p>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
              formatter={(v) => `DA ${Number(v).toLocaleString("fr-DZ")}`}            
              contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontSize: 11,
            }}
          />
          <Line type="monotone" dataKey="men" stroke="#2d3a6e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="women" stroke="#d1d5db" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      {/* Légende */}
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2d3a6e] inline-block shrink-0" />
          Men
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block shrink-0" />
          Women
        </span>
      </div>
    </div>
  );
}