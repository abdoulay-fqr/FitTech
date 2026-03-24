

interface FreeTrial {
  id: number;
  fullName: string;
  email: string;
}

interface FreeTrialTableProps {
  trials: FreeTrial[];
  sortField: "email" | "fullName" | "id";
  sortOrder: "asc" | "desc";
  onSort: (field: "email" | "fullName" | "id") => void;
  onApprove: (id: number) => void;
}

export default function FreeTrialTable({
  trials,
  sortField,
  sortOrder,
  onSort,
  onApprove,
}: FreeTrialTableProps) {
  // Icône de tri
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return (
      <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[500px]">

        {/* ── En-têtes ── */}
        <thead>
          <tr className="border-b border-gray-200">
            <th
              className="text-sm font-medium text-gray-500 text-left pb-3 pr-4 cursor-pointer hover:text-gray-800 transition-colors w-24"
              onClick={() => onSort("id")}
            >
              ID <SortIcon field="id" />
            </th>
            <th
              className="text-sm font-medium text-gray-500 text-left pb-3 pr-4 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => onSort("fullName")}
            >
              Full name <SortIcon field="fullName" />
            </th>
            <th
              className="text-sm font-medium text-left pb-3 pr-4 cursor-pointer transition-colors"
              onClick={() => onSort("email")}
              style={{
                color: sortField === "email" ? "#f5a623" : "#6b7280",
              }}
            >
              Email <SortIcon field="email" />
            </th>
            {/* Colonne vide pour le bouton */}
            <th className="pb-3 w-28" />
          </tr>
        </thead>

        {/* ── Lignes ── */}
        <tbody>
          {trials.map((trial) => (
            <tr
              key={trial.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 pr-4 text-sm text-gray-700">{trial.id}</td>
              <td className="py-3 pr-4 text-sm text-gray-800 font-medium">
                {trial.fullName}
              </td>
              <td className="py-3 pr-4 text-sm text-gray-600">{trial.email}</td>
              <td className="py-3 text-right">
                <button
                  onClick={() => onApprove(trial.id)}
                  className="px-5 py-1.5 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#f5a623" }}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Message si tableau vide */}
      {trials.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-10">
          No free trial requests found.
        </p>
      )}
    </div>
  );
}