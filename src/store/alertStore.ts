import { create } from 'zustand';
import { Alert, AlertType } from '../types';

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  removeAlert: (id: string) => void;
  verifyAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [
    {
      id: '1',
      type: 'prep',
      title: 'Heavy Rain Expected',
      description: 'Prepare for heavy rainfall in the next 24 hours. Stock up on essentials.',
      location: 'Entire District',
      sender: 'Weather Department',
      verified: true,
      createdAt: Date.now()
    }
  ],
  addAlert: (alert) =>
    set((state) => ({
      alerts: [
        {
          ...alert,
          id: Date.now().toString(),
          createdAt: Date.now()
        },
        ...state.alerts
      ]
    })),
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id)
    })),
  verifyAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, verified: true } : alert
      )
    }))
}));