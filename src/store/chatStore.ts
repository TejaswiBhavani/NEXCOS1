import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  groupId: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  image: string;
}

interface ChatState {
  messages: Message[];
  groups: ChatGroup[];
  activeGroupId: string | null;
  addMessage: (message: Message) => void;
  addGroup: (group: ChatGroup) => void;
  setActiveGroup: (groupId: string) => void;
  getGroupMessages: (groupId: string) => Message[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  groups: [
    {
      id: 'building-a',
      name: 'Building A Community',
      description: 'General discussion for Building A residents',
      members: ['user1', 'user2'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'
    },
    {
      id: 'tools-exchange',
      name: 'Tools Exchange',
      description: 'Discuss and coordinate tool sharing',
      members: ['user1', 'user3'],
      image: 'https://images.unsplash.com/photo-1581147036324-c1c9bf55b8dd?auto=format&fit=crop&q=80'
    }
  ],
  activeGroupId: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  addGroup: (group) =>
    set((state) => ({ groups: [...state.groups, group] })),
  setActiveGroup: (groupId) =>
    set({ activeGroupId: groupId }),
  getGroupMessages: (groupId) =>
    get().messages.filter((message) => message.groupId === groupId)
}));