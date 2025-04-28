import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: number;
}

interface NotificationState {
  notifications: Notification[];
  settings: {
    email: boolean;
    push: boolean;
    sound: boolean;
    desktop: boolean;
  };
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationState['settings']>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: '1',
      title: 'New Maintenance Request',
      message: 'Your maintenance request has been received and is being processed.',
      type: 'info',
      read: false,
      createdAt: Date.now() - 3600000
    },
    {
      id: '2',
      title: 'Facility Booking Confirmed',
      message: 'Your booking for the Community Hall has been confirmed.',
      type: 'success',
      read: false,
      createdAt: Date.now() - 7200000
    }
  ],
  settings: {
    email: true,
    push: true,
    sound: true,
    desktop: true
  },
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Date.now().toString(),
          read: false,
          createdAt: Date.now()
        },
        ...state.notifications
      ]
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true
      }))
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      )
    })),
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }))
}));