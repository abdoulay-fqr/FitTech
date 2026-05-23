// ─────────────────────────────────────────────
// COMPOSANT – RevenueCard
// Quadrant 1 : graphique des revenus (BarChart)
// ─────────────────────────────────────────────
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ViewReportBtn from "./ViewReportBtn";

interface RevenueData {
  day: string;
  current: number;
  previous: number;
}

interface RevenueCardProps {
  total: number;
  percentChange: number;
  period: string;
  chartData: RevenueData[];
}

export default function RevenueCard({
  total,
  percentChange,
  period,
  chartData,
}: RevenueCardProps) {
  return (
    <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200 sm:border-r">

      {/* Titre + bouton */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-sm font-semibold text-gray-800">Revenue</h2>
        <ViewReportBtn />
      </div>

      {/* Montant total */}
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-3 truncate">
        DA {total.toLocaleString("fr-DZ", { minimumFractionDigits: 2 })}
      </p>

      {/* % évolution */}
      <div className="flex items-center gap-1 mt-1 flex-wrap">
        <span className="text-green-500 font-semibold text-sm">
          ↑ {percentChange}%
        </span>
        <span className="text-gray-400 text-xs">vs last week</span>
      </div>

      {/* Période */}
      <p className="text-xs text-gray-400 mt-2 mb-3">Sales from {period}</p>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={chartData} barCategoryGap="30%" barGap={2}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            formatter={(v) => `DA ${Number(v).toLocaleString("fr-DZ")}`}             
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontSize: 11,
            }}
          />
          <Bar dataKey="current" fill="#2d3a6e" radius={[3, 3, 0, 0]} />
          <Bar dataKey="previous" fill="#d1d5db" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Légende */}
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2d3a6e] inline-block shrink-0" />
          Last 7 days
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block shrink-0" />
          Last Week
        </span>
      </div>
    </div>
  );
}