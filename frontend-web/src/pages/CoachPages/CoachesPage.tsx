import { useState, useEffect, useMemo } from "react";
import { Menu, Info, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getCoaches, Coach } from "../../api/CoachesListService";

type SortField = "firstName" | "secondName" | "email" | "specialties";
type SortDir = "asc" | "desc";

export default function CoachesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [sortField, setSortField] = useState<SortField>("firstName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCoaches() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCoaches(page, 10);
        setCoaches(data.content || []);
        setHasMore(data.hasMore);
      } catch (err) {
        setError("Erreur de connexion au backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchCoaches();
  }, [page]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = coaches.filter((c) =>
      !q ||
      c.firstName?.toLowerCase().includes(q) ||
      c.secondName?.toLowerCase().includes(q) ||
      c.specialties?.toLowerCase().includes(q)
    );
    list = [...list].sort((a, b) => {
      const aVal = (a[sortField as keyof Coach] as string) || "";
      const bVal = (b[sortField as keyof Coach] as string) || "";
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return list;
  }, [coaches, search, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 text-xs">
      {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </span>
  );

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

        <PageHeader
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(0); }}
          searchPlaceholder="Search for coachs"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Coachs</h1>
          <p className="text-sm text-gray-400 mt-1">Discover all the coaches in our team.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 className="animate-spin mb-2" />
            <p>Loading coaches...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-16">{error}</div>
        ) : (
          <>
            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="w-12 px-4 py-4" />
                    <th
                      className="text-left text-sm font-medium text-gray-500 px-4 py-4 cursor-pointer hover:text-gray-800 transition"
                      onClick={() => handleSort("firstName")}
                    >
                      First name <SortIcon field="firstName" />
                    </th>
                    <th
                      className="text-left text-sm font-medium text-gray-500 px-4 py-4 cursor-pointer hover:text-gray-800 transition"
                      onClick={() => handleSort("secondName")}
                    >
                      Second name <SortIcon field="secondName" />
                    </th>
                    <th
                      className="text-left text-sm font-medium text-yellow-500 px-4 py-4 cursor-pointer hover:text-yellow-600 transition"
                      onClick={() => handleSort("email")}
                    >
                      Email <SortIcon field="email" />
                    </th>
                    <th
                      className="text-left text-sm font-medium text-gray-500 px-4 py-4 cursor-pointer hover:text-gray-800 transition"
                      onClick={() => handleSort("specialties")}
                    >
                      Specialty <SortIcon field="specialties" />
                    </th>
                    <th className="w-24 px-4 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length > 0 ? filtered.map((coach) => (
                    <tr key={coach.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Avatar */}
                      <td className="px-4 py-3">
                        {coach.profilePic ? (
                          <img
                            src={`http://localhost:8080/${coach.profilePic}`}
                            alt={coach.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#2d3a6e] flex items-center justify-center shrink-0">
                            <span className="text-white text-sm font-bold">
                              {coach.firstName?.[0]}{coach.secondName?.[0]}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">{coach.firstName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{coach.secondName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{coach.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{coach.specialties}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/coach/coaches/${coach.id}`)}
                          className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#2d3a6e] transition"
                        >
                          <Info size={16} />
                          Details
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-400 py-16">No coaches found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasMore}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}