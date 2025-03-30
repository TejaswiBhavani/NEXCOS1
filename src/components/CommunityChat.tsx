import React from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

export default function CommunityChat() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}