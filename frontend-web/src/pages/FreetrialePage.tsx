// ─────────────────────────────────────────────
// PAGE – FreeTrialPage
// Gestion des demandes d'essai gratuit
// ─────────────────────────────────────────────
import { useState } from "react";
import { Bell, Menu, X, Search } from "lucide-react";
import FreeTrialTable from "../components/FreetrialeTable";

// ─────────────────────────────────────────────
// TYPES – à connecter au backend
// ─────────────────────────────────────────────
interface FreeTrial {
  id: number;
  fullName: string;
  email: string;
}

// ─────────────────────────────────────────────
// MOCK DATA – remplacer par des appels API
// ─────────────────────────────────────────────
const mockTrials: FreeTrial[] = [
  { id: 46747, fullName: "MADI Yasmine",    email: "y.madi@gmail.com"    },
  { id: 46748, fullName: "SAHNOUN Ahmed",   email: "a.sahnoun@gmail.com" },
  { id: 46749, fullName: "HOUARI Messaoud", email: "m.houari@gmail.com"  },
  { id: 46750, fullName: "ZOUAOUI Sara",    email: "s.zouaoui@gmail.com" },
  { id: 46751, fullName: "BENALI Karim",    email: "k.benali@gmail.com"  },
  { id: 46752, fullName: "LARBI Fatima",    email: "f.larbi@gmail.com"   },
  { id: 46753, fullName: "OUALI Riad",      email: "r.ouali@gmail.com"   },
  { id: 46754, fullName: "CHERIF Nadia",    email: "n.cherif@gmail.com"  },
  { id: 46755, fullName: "BENYAHIA Omar",   email: "o.benyahia@gmail.com"},
  { id: 46756, fullName: "MANSOURI Leila",  email: "l.mansouri@gmail.com"},
];

type SortField = "email" | "fullName" | "id";
type SortOrder = "asc" | "desc";

export default function FreeTrialPage() {
  // TODO: remplacer mockTrials par un appel API
  const [trials, setTrials] = useState<FreeTrial[]>(mockTrials);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("email");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Tri ──
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ── Approve : retire la ligne du tableau ──
  // TODO: appeler l'API PATCH /free-trials/:id/approve
  const handleApprove = (id: number) => {
    setTrials((prev) => prev.filter((t) => t.id !== id));
  };

  // ── Filtrage par recherche ──
  const filtered = trials
    .filter((t) =>
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toString().includes(search)
    )
    .sort((a, b) => {
      const valA = a[sortField].toString().toLowerCase();
      const valB = b[sortField].toString().toLowerCase();
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* Overlay mobile */}
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

      {/* ── CONTENU PRINCIPAL ───────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto p-4 sm:p-6 lg:p-8">

        {/* ── Header : search + notifications ── */}
        <div className="flex items-center justify-end gap-4 mb-6">
          {/* Burger (mobile) */}
          <button
            className="lg:hidden shrink-0 text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-xl relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d3a6e]/20 focus:border-[#2d3a6e] transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors shrink-0">
            <Bell size={18} />
            <span className="hidden sm:inline text-sm font-medium">Notifications</span>
          </button>
        </div>

        {/* ── Titre de la page ── */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          Free Trial Management
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Here you can view, add, edit and manage all the free trials
        </p>

        {/* ── Tableau ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <FreeTrialTable
            trials={filtered}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onApprove={handleApprove}
          />
        </div>

      </main>
    </div>
  );
}