// ─────────────────────────────────────────────
// PAGE – Dashboard
// Importe et assemble tous les composants
// ─────────────────────────────────────────────
import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";

import RevenueCard from "../components/DashboardComponents/RevenueCard";
import PlansSalesCard from "../components/DashboardComponents/PlanssalesCard";
import LastPaymentsCard from "../components/DashboardComponents/LastpaymentsCard";
import MembershipsCard from "../components/DashboardComponents/MembershipsCard";

// ─────────────────────────────────────────────
// TYPES – à connecter au backend
// ─────────────────────────────────────────────
interface DashboardData {
  adminName: string;
  revenue: {
    total: number;
    percentChange: number;
    period: string;
    chartData: { day: string; current: number; previous: number }[];
  };
  planSales: {
    period: string;
    plans: { name: string; value: number; color: string; orders: number }[];
  };
  lastPayments: { id: number; name: string; amount: number; avatar: string }[];
  memberships: {
    total: number;
    percentChange: number;
    period: string;
    chartData: { month: string; men: number; women: number }[];
  };
}

// ─────────────────────────────────────────────
// MOCK DATA – remplacer par des appels API
// ─────────────────────────────────────────────
const mockData: DashboardData = {
  adminName: "Mr Amine",
  revenue: {
    total: 37000,
    percentChange: 2.1,
    period: "01-07 Dec, 2025",
    chartData: [
      { day: "01", current: 3200, previous: 2800 },
      { day: "02", current: 4100, previous: 3200 },
      { day: "03", current: 3800, previous: 3500 },
      { day: "04", current: 2900, previous: 3100 },
      { day: "05", current: 5200, previous: 4100 },
      { day: "06", current: 6100, previous: 4800 },
      { day: "07", current: 4200, previous: 3900 },
    ],
  },
  planSales: {
    period: "01-07 Dec, 2025",
    plans: [
  { name: "Pro plan",      value: 40, color: "#2d3a6e", orders: 23 },
  { name: "Beginner plan", value: 32, color: "#7b8fd4", orders: 18 },
  { name: "Customer plan", value: 28, color: "#c5cef0", orders: 15 },
],
  },
  lastPayments: [
    { id: 1, name: "MADI Yasmine",    amount: 7000,  avatar: "MY" },
    { id: 2, name: "SAHNOUN Ahmed",   amount: 6500,  avatar: "SA" },
    { id: 3, name: "HOUARI Messaoud", amount: 23000, avatar: "HM" },
    { id: 4, name: "ZOUAOUI Sara",    amount: 8000,  avatar: "ZS" },
  ],
  memberships: {
    total: 2568,
    percentChange: -2.1,
    period: "Jul-Dec, 2025",
    chartData: [
      { month: "07", men: 1100, women: 900  },
      { month: "08", men: 1200, women: 950  },
      { month: "09", men: 1150, women: 1050 },
      { month: "10", men: 1300, women: 1100 },
      { month: "11", men: 1250, women: 1200 },
      { month: "12", men: 1600, women: 1000 },
    ],
  },
};

// ─────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────
export default function Dashboard() {
  // TODO: remplacer mockData par un appel API
  const data: DashboardData = mockData;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* Overlay sombre derrière la sidebar (mobile/tablette) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ──────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-gray-200
        transition-transform duration-300
        lg:relative lg:translate-x-0 lg:z-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <button
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        {/* TODO: remplacer par <Sidebar /> importé depuis le repo */}
        <div className="p-6 pt-12 lg:pt-6">
          <p className="text-base font-bold text-[#2d3a6e]">FitTech</p>
          <p className="text-xs text-gray-400 mt-1">← Sidebar du repo ici</p>
        </div>
      </aside>

      {/* ── CONTENU PRINCIPAL ────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden shrink-0 text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              Welcome back {data.adminName} 👋
            </h1>
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors shrink-0">
            <Bell size={18} />
            <span className="hidden sm:inline text-sm font-medium">Notifications</span>
          </button>
        </div>

        {/* ── GRILLE 2×2 ───────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">

          <RevenueCard
            total={data.revenue.total}
            percentChange={data.revenue.percentChange}
            period={data.revenue.period}
            chartData={data.revenue.chartData}
          />

          <PlansSalesCard
            period={data.planSales.period}
            plans={data.planSales.plans}
          />

          <LastPaymentsCard
            payments={data.lastPayments}
          />

          <MembershipsCard
            total={data.memberships.total}
            percentChange={data.memberships.percentChange}
            period={data.memberships.period}
            chartData={data.memberships.chartData}
          />

        </div>
      </main>
    </div>
  );
}

