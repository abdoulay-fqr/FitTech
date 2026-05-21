import React from 'react';

export interface NotificationItem {
  id: string;
  name: string;
  role: 'Coach' | 'Visitor' | 'Member';
  avatar: string;
  actionText: string;
  timeAgo: string;
  isNew?: boolean;
}


const notifications: NotificationItem[] = [
  {
    id: '1',
    name: 'AMRI Salim',
    role: 'Coach',
    avatar: 'https://i.pravatar.cc/150?u=amri', // Remplace par tes images
    actionText: 'scheduled a training session for Monday, April 2, 2026 at 5 pm',
    timeAgo: '50 min',
    isNew: true,
  },
  {
    id: '2',
    name: 'MERNIZ Houda',
    role: 'Visitor',
    avatar: '', // Vide pour afficher l'icône par défaut
    actionText: 'Has won a free trial ticket under ID 457457',
    timeAgo: '4 hours',
  },
  {
    id: '3',
    name: 'RIGHI Imene',
    role: 'Member',
    avatar: 'https://i.pravatar.cc/150?u=imene',
    actionText: 'renewed her subscription to the Pro plan for one month',
    timeAgo: '1 day',
  },
];

const NotificationDropdown: React.FC = () => {
  return (
    <div className="absolute right-0 mt-2 w-[450px] bg-white rounded-[20px] shadow-2xl border border-gray-100 overflow-hidden z-50">
      <div className="flex flex-col">
        {notifications.map((notif, index) => (
          <div 
            key={notif.id}
            className={`flex items-start p-5 transition-colors relative hover:bg-gray-50 ${
            notif.isNew 
              ? 'bg-blue-50 hover:bg-blue-100' 
              : 'bg-white hover:bg-gray-50 '      
            } ${index !== notifications.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              {notif.avatar ? (
                <img 
                  src={notif.avatar} 
                  alt={notif.name} 
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#FFD700] flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">👤</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h4 className="text-[17px] font-bold text-black">
                  {notif.name} <span className="text-gray-900 font-semibold">[{notif.role}]</span>
                </h4>
                <span className="text-gray-400 text-sm whitespace-nowrap ml-4">
                  {notif.timeAgo}
                </span>
              </div>
              <p className="text-gray-500 text-[16px] leading-snug mt-1 max-w-[280px]">
                {notif.actionText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;