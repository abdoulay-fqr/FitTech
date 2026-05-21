// ─────────────────────────────────────────────
// COMPOSANT – LastPaymentsCard (UPDATED)
// ─────────────────────────────────────────────
import Avatar from "./Avatar";

interface Payment {
  id: string;
  name: string;
  amount: number;
  avatar: string; // URL de l'image ou Initiales
}

interface LastPaymentsCardProps {
  payments: Payment[];
}

export default function LastPaymentsCard({ payments }: LastPaymentsCardProps) {
  return (
    <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
      
      {/* Header fixe */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800">Last payments</h2>
        <p className="text-xs text-gray-400 mt-1 mb-4 leading-relaxed">
          You find here the last payments made by the members
        </p>
      </div>

      {/* Zone de liste Scrollable */}
      {/* h-[350px] : Hauteur fixe pour forcer le scroll
          custom-scrollbar : Pour le style que nous avons ajouté en CSS
      */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ minHeight: '300px', maxHeight: '400px' }}>
        <div className="divide-y divide-gray-100">
          {payments?.length > 0 ? (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between gap-3 py-3 hover:bg-gray-50/50 transition-colors"
              >
                {/* Avatar + nom */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* On passe l'avatar. Si c'est une URL, le composant Avatar doit la gérer */}
                  <Avatar initials={payment.name.substring(0, 2).toUpperCase()} />
                  <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                    {payment.name}
                  </span>
                </div>

                {/* Montant formaté en DA */}
                <span className="text-xs sm:text-sm text-blue-600 font-bold shrink-0">
                  {payment.amount.toLocaleString("fr-DZ")} DA
                </span>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-gray-400">
              No recent payments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}