

interface AvatarProps {
  initials: string;
}
 
const colors: Record<string, string> = {
  MY: "bg-rose-200 text-rose-700",
  SA: "bg-blue-200 text-blue-700",
  HM: "bg-emerald-200 text-emerald-700",
  ZS: "bg-amber-200 text-amber-700",
};

export default function Avatar({ initials }: AvatarProps) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        colors[initials] ?? "bg-gray-200 text-gray-600"
      }`}
    >
      {initials}
    </div>
  );
}