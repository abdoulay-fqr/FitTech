import { useState, useEffect } from "react";
import { Menu, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getCoachProfile, CoachProfile } from "../../api/coachService";

const coverImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coach, setCoach] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getCoachProfile();
        setCoach(data);
      } catch (err) {
        setError("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-gray-200 transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <p className="text-xl font-bold text-[#2d3a6e]">FitTech</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-8">
        <PageHeader
          showSearchBar={false}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Loading...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-16">{error}</div>
        ) : coach ? (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* COVER + AVATAR */}
            <div className="relative h-40 sm:h-52">
              <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
              <div className="absolute -bottom-12 left-6">
                {coach.id ? (
  <img
    src={`${process.env.REACT_APP_API_URL}/users/files/coaches/${coach.id}?t=${Date.now()}`}
    alt="avatar"
    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
  />
) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-[#2d3a6e] flex items-center justify-center shadow-md">
                    <span className="text-white text-2xl font-bold">
                      {coach.firstName?.[0]}{coach.secondName?.[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-16 px-6 pb-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => navigate("/coach/settings/edit")}
                  className="bg-[#FFD300] hover:bg-yellow-400 transition-colors text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-xl"
                >
                  Edit Information
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {coach.firstName} {coach.secondName}
              </h2>

              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                  {[
                    { label: "Phone Number", value: coach.phone || "—" },
                    { label: "Date of Birth", value: coach.birthDate || "—" },
                    { label: "Gender", value: coach.gender || "—" },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-6">
                      <span className="text-sm text-gray-400 w-32 shrink-0">{item.label}</span>
                      <span className="text-sm text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Profile */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">Professional Profile</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-6">
                    <span className="text-sm text-gray-400 w-32 shrink-0">Specialties</span>
                    <span className="text-sm text-gray-800">{coach.specialties || "—"}</span>
                  </div>
                  <div className="flex gap-6">
                    <span className="text-sm text-gray-400 w-32 shrink-0">Biography</span>
                    <span className="text-sm text-gray-800 leading-relaxed">{coach.biography || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}