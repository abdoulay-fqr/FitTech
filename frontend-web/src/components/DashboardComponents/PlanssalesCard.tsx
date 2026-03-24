// ─────────────────────────────────────────────
// COMPOSANT – PlansSalesCard
// Tooltip positionné via les données Recharts
// directement (startAngle, endAngle, outerRadius)
// ─────────────────────────────────────────────
import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import ViewReportBtn from "./ViewReportBtn";
import TooltipArrow from "./Tooltiparrow";

interface PlanData {
  name: string;
  value: number;
  color: string;
  orders: number;
}

interface PlansSalesCardProps {
  period: string;
  plans: PlanData[];
}

interface TooltipPos {
  x: number;
  y: number;
}

const TOOLTIP_WIDTH = 128;
const TOOLTIP_HEIGHT = 56; // hauteur approximative de la bulle
const CX = 90;
const CY = 90;
const OUTER_RADIUS = 82;
const MARGIN_TOP = 24;

export default function PlansSalesCard({ period, plans }: PlansSalesCardProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [tooltipPos, setTooltipPos] = useState<TooltipPos>({ x: 140, y: 10 });

  // Recharts passe les vraies données de la part dans onMouseEnter
  // On récupère startAngle et endAngle directement pour calculer
  // le milieu exact de la part en coords SVG
  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);

    const { startAngle, endAngle, cx, cy, outerRadius } = data;

    // Angle du milieu de la part en radians
    // Recharts donne les angles en degrés depuis l'axe X positif, sens anti-horaire
    const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);

    // Point sur le bord extérieur au milieu de la part
    const tipX = cx + (outerRadius + 14) * Math.cos(midAngle);
    const tipY = cy - (outerRadius + 14) * Math.sin(midAngle);

    setTooltipPos({ x: tipX, y: tipY });
  };

  const activePlan = plans[activeIndex];

  // Position CSS du tooltip :
  // - centré horizontalement sur le point de la flèche
  // - placé au-dessus (bulle + flèche)
  const cssLeft = `calc(50% + ${tooltipPos.x - CX - TOOLTIP_WIDTH / 2}px)`;
  const cssTop  = `${tooltipPos.y - TOOLTIP_HEIGHT - 8 + MARGIN_TOP}px`;

  return (
    <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200">

      {/* Titre + bouton */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-sm font-semibold text-gray-800">Plans sales</h2>
        <ViewReportBtn />
      </div>
      <p className="text-xs text-gray-400 mt-1">From {period}</p>

      {/* Zone relative : tooltip + donut */}
      <div className="relative flex justify-center mt-3" style={{ height: 230 }}>

        {/* ── Tooltip ── */}
        <div
          className="absolute pointer-events-none z-10 transition-all duration-150"
          style={{ left: cssLeft, top: cssTop, width: TOOLTIP_WIDTH }}
        >
          <div
            className="text-white rounded-xl px-3 py-2 shadow-lg text-center w-full"
            style={{ backgroundColor: "#2d3a6e" }}
          >
            <p className="text-xs font-medium opacity-80 leading-tight">
              {activePlan.name}
            </p>
            <p className="text-xl font-bold leading-tight">
              {activePlan.orders} orders
            </p>
          </div>
          <TooltipArrow color="#2d3a6e" size={8} />
        </div>

        {/* ── Donut ── */}
        <PieChart width={180} height={180} style={{ marginTop: MARGIN_TOP }}>
          <Pie
            data={plans}
            cx={CX}
            cy={CY}
            innerRadius={52}
            outerRadius={OUTER_RADIUS}
            dataKey="value"
            strokeWidth={0}
            paddingAngle={2}
            onMouseEnter={handleMouseEnter}
          >
            {plans.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color}
                style={{
                  opacity: activeIndex === i ? 1 : 0.7,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  transform: activeIndex === i ? "scale(1.05)" : "scale(1)",
                  transformOrigin: `${CX}px ${CY}px`,
                }}
              />
            ))}
          </Pie>
        </PieChart>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap justify-around gap-x-2 gap-y-2 mt-1">
        {plans.map((plan, i) => (
          <div
            key={i}
            className="text-center min-w-0 cursor-pointer"
            onMouseEnter={() => setActiveIndex(i)}
          >
            <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
              <span
                className="w-2 h-2 rounded-full inline-block shrink-0"
                style={{ backgroundColor: plan.color }}
              />
              <span className="truncate">{plan.name}</span>
            </div>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">
              {plan.value}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}