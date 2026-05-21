import React from 'react';
import { Bell } from 'lucide-react'; 

interface Props {
  onClick: () => void;
  isOpen: boolean;
}

const NotifButton: React.FC<Props> = ({ onClick, isOpen }) => {
    
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
        isOpen ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <div className="relative">
        <Bell size={20} />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 border-2 border-white rounded-full"></span>
      </div>
      <span className="font-medium">Notifications</span>
    </button>
  );
};

export default NotifButton;