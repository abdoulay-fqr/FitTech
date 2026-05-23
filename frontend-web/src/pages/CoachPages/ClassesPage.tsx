import { useState, useRef, useEffect, useMemo} from "react";
import { Loader2 } from "lucide-react";
import ClassCard from "../../components/ClassCard";
import PageHeader from "../../components/PageHeader";
import { getCoachClasses, GymClass } from "../../api/classesService";
import { useNavigate } from "react-router-dom";

export default function ClassesPage() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoading(true);
        setError(null);

        const coachId = localStorage.getItem("userId");

        if (!coachId) {
          setError("Coach ID introuvable. Veuillez vous reconnecter.");
          setClasses([]);
          return;
        }

        const data = await getCoachClasses(coachId, page, 9);

        setClasses(data.content || []);
        setHasMore(Boolean(data.hasMore));
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion au backend");
        setClasses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredClasses = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return classes;

    return classes.filter((cls) => {
      return (
        cls.name?.toLowerCase().includes(q) ||
        cls.dayOfWeek?.toLowerCase().includes(q) ||
        cls.level?.toLowerCase().includes(q) ||
        cls.status?.toLowerCase().includes(q) ||
        cls.startTime?.toLowerCase().includes(q) ||
        cls.endTime?.toLowerCase().includes(q)
      );
    });
  }, [classes, search]);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-gray-200 transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <p className="text-xl font-bold text-[#2d3a6e]">FitTech</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-8">
        <PageHeader
          searchValue={search}
          onSearchChange={(v) => setSearch(v)}
          searchPlaceholder="Search in my classes"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
            <p className="text-sm text-gray-400 mt-1">
              Browse and manage your own classes from here
            </p>
          </div>

         <button
           onClick={() => navigate("/coach/add-class")}
           className="bg-[#FFD300] hover:bg-yellow-400 transition-colors text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-xl"
          >
  Add New Class
</button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 className="animate-spin mb-2" />
            <p>Loading classes...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-16">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    id={cls.id}
                    name={cls.name}
                    schedule={`${cls.dayOfWeek} • ${cls.startTime} - ${cls.endTime}`}
                    description={`${cls.level} class • Status: ${cls.status}`}
                    image="/images/class-default.jpg"
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-400 py-16">
                  No classes found.
                </div>
              )}
            </div>

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