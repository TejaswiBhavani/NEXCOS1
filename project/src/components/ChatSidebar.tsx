import React from 'react';
import { Users } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export default function ChatSidebar() {
  const { groups, activeGroupId, setActiveGroup } = useChatStore();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Community Groups</h2>
      </div>
      <div className="space-y-1 p-2">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
              activeGroupId === group.id
                ? 'bg-emerald-50 text-emerald-700'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={group.image}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-sm">{group.name}</h3>
              <p className="text-xs text-gray-500 truncate">
                {group.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}