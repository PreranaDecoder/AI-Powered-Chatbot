import React from 'react';
import { User, Settings, Bell } from 'lucide-react';

interface UserProfileProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="flex items-center justify-between w-full p-4 bg-white border-b">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User size={24} className="text-white" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Settings size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}