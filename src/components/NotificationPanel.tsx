import React from 'react';
import { Bell, Settings, Trash2, Check, X } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    settings,
    markAsRead,
    markAllAsRead,
    removeNotification,
    updateSettings
  } = useNotificationStore();

  const [activeTab, setActiveTab] = React.useState<'notifications' | 'settings'>('notifications');

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-4 top-16 w-96 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-lg transition ${
                activeTab === 'settings' ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'notifications' ? (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-h-[calc(100vh-16rem)] overflow-y-auto"
            >
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded transition"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4 text-gray-600" />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 hover:bg-gray-200 rounded transition"
                            title="Remove notification"
                          >
                            <Trash2 className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {notifications.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                  <button
                    onClick={markAllAsRead}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-4"
            >
              <h3 className="font-medium text-gray-900">Notification Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ email: !settings.email })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.email ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Push Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive push notifications
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ push: !settings.push })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.push ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Sound</p>
                    <p className="text-sm text-gray-500">
                      Play sound for notifications
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ sound: !settings.sound })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.sound ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.sound ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Desktop Notifications</p>
                    <p className="text-sm text-gray-500">
                      Show desktop notifications
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ desktop: !settings.desktop })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.desktop ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.desktop ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}