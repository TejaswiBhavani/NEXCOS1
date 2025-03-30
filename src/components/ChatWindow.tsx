import React, { useState } from 'react';
import { Send, Users } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';

export default function ChatWindow() {
  const [message, setMessage] = useState('');
  const { activeGroupId, addMessage, getGroupMessages, groups } = useChatStore();
  const activeGroup = groups.find(g => g.id === activeGroupId);
  const messages = activeGroupId ? getGroupMessages(activeGroupId) : [];
  const user = useAuthStore(state => state.user);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeGroupId || !user) return;

    addMessage({
      id: Date.now().toString(),
      content: message,
      sender: user.name,
      timestamp: Date.now(),
      groupId: activeGroupId,
    });
    setMessage('');
  };

  if (!activeGroupId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Group Selected</h3>
          <p className="text-gray-500">Select a group to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Group Header */}
      <div className="p-4 border-b flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={activeGroup?.image}
            alt={activeGroup?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-semibold">{activeGroup?.name}</h2>
          <p className="text-sm text-gray-500">{activeGroup?.members.length} members</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === user?.name ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.sender === user?.name
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <div className="text-xs mb-1">
                {msg.sender === user?.name ? 'You' : msg.sender}
              </div>
              <p>{msg.content}</p>
              <div className="text-xs mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-emerald-500 text-white rounded-lg px-4 py-2 hover:bg-emerald-600 transition"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}