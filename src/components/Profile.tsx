import React, { useState } from 'react';
import { User, Settings, Bell, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Please Sign In</h2>
          <p className="text-gray-600 mt-2">You need to be signed in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-white"
              />
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg">
                <User className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-teal-100">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === 'security'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={user.name}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={user.location}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Activity History</h3>
                <div className="mt-4 space-y-4">
                  {/* Sample activity items */}
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex-shrink-0">
                      <Bell className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-900">Created a new alert</p>
                      <p className="text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  {/* Add more activity items as needed */}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                      <p className="text-sm text-gray-500">Enable dark mode for the interface</p>
                    </div>
                    <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                      <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email updates about your activity</p>
                    </div>
                    <button className="bg-teal-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                      <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <button className="flex items-center space-x-2 text-sm text-gray-700">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <span>Change Password</span>
                    </button>
                  </div>
                  <div>
                    <button 
                      onClick={logout}
                      className="flex items-center space-x-2 text-sm text-red-600"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}