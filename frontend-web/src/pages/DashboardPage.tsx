import { useState, useEffect , useRef } from "react";
import { Bell, Menu, X, Loader2 } from "lucide-react";

import RevenueCard      from "../components/DashboardComponents/RevenueCard";
import PlansSalesCard   from "../components/DashboardComponents/PlanssalesCard";
import LastPaymentsCard from "../components/DashboardComponents/LastpaymentsCard";
import MembershipsCard  from "../components/DashboardComponents/MembershipsCard";
import NotifButton      from "../components/NotifButton";
import NotificationDropdown from "../components/NotificationDropdown";


import {
  getTotalMembers,
  getMembershipStats,
  getLastPayments,
  getPlanSales,
  getRevenue,
} from "../api/dashboardService";

// --- TYPES ---
interface DashboardData {
  adminName: string;
  revenue: {
    total: number;
    percentChange: number;
    period: string;
    chartData: any[];
  };
  planSales: {
    period: string;
    plans: any[];
  };
  lastPayments: any[];
  memberships: {
    total: number;
    percentChange: number;
    period: string;
    chartData: any[];
  };
}

const defaultData: DashboardData = {
  adminName: "",
  revenue: { total: 0, percentChange: 0, period: "", chartData: [] },
  planSales: { period: "", plans: [] },
  lastPayments: [],
  memberships: { total: 0, percentChange: 0, period: "", chartData: [] },
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const adminName = localStorage.getItem("adminName") ?? "Admin";

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [totalMembers, membershipChart, lastPayments, planSales, revenue] = 
          await Promise.all([
            getTotalMembers(),
            getMembershipStats(),
            getLastPayments(),
            getPlanSales(),
            getRevenue(),
          ]);

        setData({
          adminName,
          revenue: revenue || defaultData.revenue,
          planSales: planSales || defaultData.planSales,
          lastPayments: lastPayments || [],
          memberships: {
            total: totalMembers || 0,
            percentChange: 0,
            period: "2026",
            chartData: membershipChart || [],
          },
        });
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError("Erreur de connexion au backend (Vérifiez les ports 8080/8082)");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [adminName]);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // On vérifie si containerRef existe ET si le clic (event.target) 
    // n'est PAS à l'intérieur de cet élément
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // On écoute le clic sur TOUT le document
  document.addEventListener('mousedown', handleClickOutside);
  
  // Nettoyage pour éviter les fuites de mémoire
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []); // [] signifie que l'écouteur est installé une seule fois au chargement

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans"  >
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-gray-200 transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <p className="text-xl font-bold text-[#2d3a6e]">FitTech</p>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 min-w-0 p-4 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu /></button>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back {adminName} 👋</h1>
          </div>
          
           <div className="relative" ref={containerRef} >
                  <NotifButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
    
                 {isOpen && (
                      <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in duration-200">
                        <NotificationDropdown />
                      </div>
                  )}
  </div>
        </div>


        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">⚠️ {error}</div>}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <Loader2 className="animate-spin mb-2" />
             <p>Syncing with backend...</p>
          </div>
        ) : (
          /* GRILLE 2x2 */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm">
            
            <div className="border-r border-b border-gray-100 p-6">
               <RevenueCard {...data.revenue} />
            </div>

            {/* SECTION AVEC SCROLLBAR */}
            <div className="border-b border-gray-100 p-6">
               <h3 className="font-bold mb-4">Plan Sales</h3>
               <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ height: "350px" }}>
                  <PlansSalesCard {...data.planSales} />
               </div>
            </div>

            {/* SECTION AVEC SCROLLBAR */}
            <div className="border-r border-gray-100 p-6">
               <h3 className="font-bold mb-4">Recent Payments</h3>
               <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ height: "350px" }}>
                  <LastPaymentsCard payments={data.lastPayments} />
               </div>
            </div>

            <div className="p-6">
               <MembershipsCard {...data.memberships} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}