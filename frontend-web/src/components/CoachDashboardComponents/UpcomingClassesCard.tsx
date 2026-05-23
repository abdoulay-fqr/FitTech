interface UpcomingClass {
  id: string;
  name: string;
  time: string;
}

interface UpcomingClassesCardProps {
  classes: UpcomingClass[];
}

export default function UpcomingClassesCard({ classes }: UpcomingClassesCardProps) {
  return (
    <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
      <h2 className="text-sm font-semibold text-gray-800">Upcoming Classes</h2>
      <p className="text-xs text-gray-400 mt-1 mb-4">You find here your next classes</p>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="divide-y divide-gray-100">
          {classes?.length > 0 ? (
            classes.map((cls, i) => (
              <div key={cls.id} className={`flex items-center justify-between gap-3 py-3 hover:bg-gray-50/50 transition-colors ${i === 0 ? "font-bold text-gray-900" : "text-gray-500"}`}>
                <span className="text-xs sm:text-sm truncate">{cls.name}</span>
                <span className={`text-xs sm:text-sm shrink-0 ${i === 0 ? "text-[#2d3a6e] font-bold" : "text-gray-400"}`}>{cls.time}</span>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-gray-400">No upcoming classes.</div>
          )}
        </div>
      </div>
    </div>
  );
}