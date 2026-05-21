import { useState, useEffect, useRef } from "react";
import { Menu, Loader2 } from "lucide-react";
import ClassesOverviewCard from "../../components/CoachDashboardComponents/ClassesOverviewCard";
import UpcomingClassesCard from "../../components/CoachDashboardComponents/UpcomingClassesCard";
import AttendanceCard from "../../components/CoachDashboardComponents/AttendanceCard";
import NotifButton from "../../components/NotifButton";
import NotificationDropdown from "../../components/NotificationDropdown";

interface CoachDashboardData {
  coachName: string;
  classesOverview: {
    total: number;
    percentChange: number;
    period: string;
    chartData: any[];
  };
  upcomingClasses: any[];
  attendance: {
    total: number;
    percentChange: number;
    period: string;
    chartData: any[];
  };
}

const defaultData: CoachDashboardData = {
  coachName: "",
  classesOverview: { total: 0, percentChange: 0, period: "", chartData: [] },
  upcomingClasses: [],
  attendance: { total: 0, percentChange: 0, period: "", chartData: [] },
};

// ── Données mockées pour tester le design ──
const mockData: CoachDashboardData = {
  coachName: "Mr Coach",
  classesOverview: {
    total: 28,
    percentChange: 2.1,
    period: "01-07 Dec, 2025",
    chartData: [
      { day: "01", current: 4, previous: 2 },
      { day: "02", current: 3, previous: 4 },
      { day: "03", current: 5, previous: 3 },
      { day: "04", current: 2, previous: 3 },
      { day: "05", current: 6, previous: 4 },
      { day: "06", current: 7, previous: 5 },
      { day: "07", current: 4, previous: 3 },
    ],
  },
  upcomingClasses: [
    { id: "1", name: "Class 01", time: "in 3 Hours" },
    { id: "2", name: "Class 02", time: "in 4 Hours 30 min" },
    { id: "3", name: "Class 03", time: "Tomorrow" },
    { id: "4", name: "Class 04", time: "in 2 Days" },
    { id: "5", name: "Class 05", time: "in 2 Days" },
  ],
  attendance: {
    total: 258,
    percentChange: -2.1,
    period: "Jul-Dec, 2025",
    chartData: [
      { month: "08", men: 180, women: 120 },
      { month: "08", men: 160, women: 140 },
      { month: "09", men: 200, women: 130 },
      { month: "10", men: 190, women: 150 },
      { month: "11", men: 210, women: 160 },
      { month: "12", men: 258, women: 180 },
    ],
  },
};

export default function CoachDashboard() {
  const [data, setData] = useState<CoachDashboardData>(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const coachName = localStorage.getItem("adminName") ?? "Coach";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-gray-200 transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <p className="text-xl font-bold text-[#2d3a6e]">FitTech</p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 p-4 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu /></button>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back {coachName} 👋</h1>
          </div>
          <div className="relative" ref={containerRef}>
            <NotifButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
            {isOpen && (
              <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in duration-200">
                <NotificationDropdown />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">⚠️ {error}</div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 className="animate-spin mb-2" />
            <p>Syncing with backend...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm">
            
            {/* Classes Overview */}
            <div className="border-r border-b border-gray-100 p-6">
              <ClassesOverviewCard {...data.classesOverview} />
            </div>

            {/* Upcoming Classes */}
            <div className="border-b border-gray-100 p-6">
              <h3 className="font-bold mb-1">Upcoming Classes</h3>
              <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ height: "350px" }}>
                <UpcomingClassesCard classes={data.upcomingClasses} />
              </div>
            </div>

            {/* Attendance */}
            <div className="md:col-span-2 p-6">
              <AttendanceCard {...data.attendance} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}