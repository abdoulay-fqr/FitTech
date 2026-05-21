import { useNavigate } from "react-router-dom";

interface ClassCardProps {
  id: string;
  name: string;
  schedule: string;
  description: string;
  image: string;
}

export default function ClassCard({ id,name, schedule, description, image }: ClassCardProps) {

  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/coach/classes/${id}`)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-400 mt-1">{schedule}</p>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{description}</p>
      </div>
    </div>
  );
}