// ─────────────────────────────────────────────
// COMPOSANT – LastPaymentsCard
// Quadrant 3 : liste des derniers paiements
// ─────────────────────────────────────────────
import Avatar from "./Avatar";

interface Payment {
  id: number;
  name: string;
  amount: number;
  avatar: string;
}

interface LastPaymentsCardProps {
  payments: Payment[];
}

export default function LastPaymentsCard({ payments }: LastPaymentsCardProps) {
  return (
    <div className="p-4 sm:p-5 lg:p-6 border-b sm:border-b-0 border-gray-200 sm:border-r">

      {/* Titre + description */}
      <h2 className="text-sm font-semibold text-gray-800">Last payments</h2>
      <p className="text-xs text-gray-400 mt-1 mb-4 leading-relaxed">
        You find here the last payments made by the members
      </p>

      {/* Liste */}
      <div className="divide-y divide-gray-100">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between gap-3 py-2.5"
          >
            {/* Avatar + nom */}
            <div className="flex items-center gap-2 min-w-0">
              <Avatar initials={payment.avatar} />
              <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                {payment.name}
              </span>
            </div>

            {/* Montant */}
            <span className="text-xs sm:text-sm text-gray-600 font-medium shrink-0">
              DA {payment.amount.toLocaleString("fr-DZ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}