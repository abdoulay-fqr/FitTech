// ─────────────────────────────────────────────
// PAGE – FreeTrialPage
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { Bell, Menu, X, Search } from "lucide-react";
import FreeTrialTable from "../components/FreetrialeTable";
import {
  getAllTrials,
  approveTrial,
  FreeTrial,
} from "../api/freeTrialService";

type SortField = "email" | "fullName" | "id";
type SortOrder = "asc" | "desc";

export default function FreeTrialPage() {
  const [trials, setTrials]               = useState<FreeTrial[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [search, setSearch]               = useState("");
  const [sortField, setSortField]         = useState<SortField>("email");
  const [sortOrder, setSortOrder]         = useState<SortOrder>("asc");
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [page, setPage]                   = useState(0);
  const [totalPages, setTotalPages]       = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 10;

  // ── Chargement depuis le backend ──
  const fetchTrials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllTrials(
        search || undefined,
        false,
        page,
        PAGE_SIZE
      );

      setTrials(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (err.response?.status === 403) {
        setError("Accès refusé. Droits insuffisants.");
      } else {
        setError("Impossible de charger les données. Vérifiez que le backend est lancé.");
      }
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(() => fetchTrials(), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchTrials, search]);

  // ── Tri ──
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ── Approve ──
  const handleApprove = async (id: string) => {
    try {
      await approveTrial(id);
      setTrials((prev) => prev.filter((t) => t.id !== id));
      setTotalElements((prev) => prev - 1);
    } catch {
      alert("Erreur lors de l'approbation. Réessayez.");
    }
  };

  // ── Tri côté frontend sur la page courante ──
  const sorted = [...trials].sort((a, b) => {
    const valA = sortField === "fullName" ? a.fullName
               : sortField === "email"    ? a.email
               : a.id;
    const valB = sortField === "fullName" ? b.fullName
               : sortField === "email"    ? b.email
               : b.id;
    return sortOrder === "asc"
      ? valA.toLowerCase().localeCompare(valB.toLowerCase())
      : valB.toLowerCase().localeCompare(valA.toLowerCase());
  });

  // ── Numéro séquentiel basé sur la page ──
  // page 0 → 1,2,3... | page 1 → 11,12,13...
  const withIndex = sorted.map((t, i) => ({
    ...t,
    displayId: page * PAGE_SIZE + i + 1,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
        <div className="p-6 pt-12 lg:pt-6">
          <p className="text-base font-bold text-[#2d3a6e]">FitTech</p>
          <p className="text-xs text-gray-400 mt-1">← Sidebar du repo ici</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex items-center justify-end gap-4 mb-6">
          <button
            className="lg:hidden shrink-0 text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="flex-1 max-w-xl relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d3a6e]/20 focus:border-[#2d3a6e] transition-all"
            />
          </div>

          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors shrink-0">
            <Bell size={18} />
            <span className="hidden sm:inline text-sm font-medium">Notifications</span>
          </button>
        </div>

        {/* Titre */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          Free Trial Management
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Here you can view, add, edit and manage all the free trials
          {!loading && (
            <span className="ml-2 text-[#2d3a6e] font-medium">
              ({totalElements} total)
            </span>
          )}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">

          {loading ? (
            <div className="space-y-4">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-10" />
                  <div className="h-4 bg-gray-200 rounded w-36" />
                  <div className="h-4 bg-gray-200 rounded w-44" />
                  <div className="h-7 bg-gray-100 rounded w-20 ml-auto" />
                </div>
              ))}
            </div>
          ) : (
            <FreeTrialTable
              trials={withIndex}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              onApprove={handleApprove}
            />
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Page {page + 1} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  ← Précédent
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}