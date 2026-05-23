import { useState, useEffect } from "react";
import { Menu, ArrowLeft, Info } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { getClassById, deleteClass, GymClass } from "../../api/classesService";

export default function ClassDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [gymClass, setGymClass] = useState<GymClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchClass() {
      try {
        setLoading(true);
        const data = await getClassById(id!);
        setGymClass(data);
      } catch (err) {
        setError("Erreur lors du chargement de la classe.");
      } finally {
        setLoading(false);
      }
    }
    fetchClass();
  }, [id]);

  

const confirmDelete = async () => {
  try {
    await deleteClass(id!);
    navigate("/coach/classes");
  } catch (err) {
    setError("Erreur lors de la suppression.");
  }
};

  // Mock participants — remplace par vrai appel API quand disponible
  const participants = [
    { id: "1", name: "HOUARI Messaoud", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "2", name: "HOUARI Messaoud", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "3", name: "HOUARI Messaoud", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: "4", name: "HOUARI Messaoud", avatar: "https://i.pravatar.cc/150?u=4" },
    { id: "5", name: "HOUARI Messaoud", avatar: "https://i.pravatar.cc/150?u=5" },
    { id: "6", name: "HOUARI Messaoud", avatar: "https://i.pravatar.cc/150?u=6" },
    { id: "7", name: "HOUARI Messaoud", avatar: "https://i.pravatar.cc/150?u=7" },
  ];

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

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <button onClick={() => navigate("/coach/classes")} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Class Details</h1>
          </div>
          <PageHeader
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search for classes"
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-16">{error}</div>
        ) : gymClass ? (
          <>
            {/* COVER */}
            <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative mb-6">
              <img
                src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80"
                alt="cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <h2 className="absolute bottom-6 left-6 text-white text-3xl font-bold">
                {gymClass.name}
              </h2>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mb-6">
             <button
  onClick={() => setShowDeleteModal(true)}
  className="border border-red-500 text-red-500 hover:bg-red-50 transition font-semibold text-sm px-5 py-2.5 rounded-xl"
>
  Delete Class
</button>
              <button
                onClick={() => navigate(`/coach/classes/${id}/edit`)}
                className="bg-[#FFD300] hover:bg-yellow-400 transition text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-xl"
              >
                Edit Class
              </button>
            </div>

            {/* CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Class Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5">Class Information</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Description", value: gymClass.description || "—" },
                    { label: "Class level", value: gymClass.level },
                    { label: "Date", value: `${gymClass.dayOfWeek} • ${gymClass.startTime} - ${gymClass.endTime}` },
                    { label: "Maximum Participants", value: gymClass.maxParticipants ?? "—" },
                    { label: "Available Spots", value: gymClass.maxParticipants ? gymClass.maxParticipants - participants.length : "—" },
                    { label: "Status", value: gymClass.status },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-6">
                      <span className="text-sm text-gray-400 w-44 shrink-0">{item.label}</span>
                      <span className="text-sm text-gray-800 leading-relaxed">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Participants */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5">Class Participants</h3>
                <div className="flex flex-col divide-y divide-gray-100 overflow-y-auto custom-scrollbar" style={{ maxHeight: "350px" }}>
                  {participants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-3 gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                      </div>
                      <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#2d3a6e] transition">
                        <Info size={16} />
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        ) : null}

        {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white rounded-lg shadow-xl w-[475px] max-w-[90%] p-5">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Delete Class
      </h2>

      <p className="text-gray-800 text-base mb-7">
        Are you sure you want delete this class ?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="w-28 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-800 text-base font-medium hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="w-28 py-2 rounded-md bg-red-600 text-white text-base font-medium hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}