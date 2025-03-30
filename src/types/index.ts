export type Language = 'en' | 'hi' | 'ta';

export type ResourceType = 'Tools' | 'Emergency' | 'Food' | 'Water' | 'Space' | 'Medical';

export type AlertType = 'prep' | 'help';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  description: string;
  location: string;
  owner: string;
  status: 'available' | 'requested' | 'booked';
  image?: string;
  capacity?: number;
  rate?: number;
  amenities?: string[];
  createdAt: number;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  location: string;
  sender: string;
  verified: boolean;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  verified: boolean;
  vouches: number;
  createdAt: number;
  avatar?: string;
  preferences?: {
    darkMode: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: Language;
  };
  activity?: {
    id: string;
    type: string;
    description: string;
    timestamp: number;
  }[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: User;
  groupId: string;
  timestamp: number;
  pending?: boolean;
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  location: string;
  members: string[];
  type: 'neighborhood' | 'crisis' | 'general';
  createdAt: number;
}

export interface BookingDetails {
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
}