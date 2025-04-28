import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Bell, AlertTriangle, Users, Search } from 'lucide-react';
import Header from './components/Header';
import ResourceList from './components/resources/ResourceList';
import ResourceTypeFilter from './components/resources/ResourceTypeFilter';
import AlertsList from './components/alerts/AlertsList';
import { useResourceStore } from './store/resourceStore';
import { useAlertStore } from './store/alertStore';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { ResourceType } from './types';
import CommunityChat from './components/CommunityChat';
import Profile from './components/Profile';
import NexAI from './components/NexAI';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'All'>('All');
  const resources = useResourceStore((state) => state.resources);
  const alerts = useAlertStore((state) => state.alerts);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || resource.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Header />
        
        <Routes>
          <Route path="/" element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Stay Connected, Stay Prepared
                </h1>
                <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Join your local community in sharing resources, preparing for emergencies, and building resilience together.
                </p>
              </div>

              {/* Alert Banner */}
              {alerts.length > 0 && (
                <div className={`border-l-4 border-amber-500 p-4 mb-8 ${isDarkMode ? 'bg-amber-900/50' : 'bg-amber-50'}`}>
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-amber-500 mr-3" />
                    <p className={isDarkMode ? 'text-amber-200' : 'text-amber-700'}>
                      {alerts[0].type === 'prep' ? 'Preparation Alert' : 'Help Needed'}: {alerts[0].title}
                    </p>
                  </div>
                </div>
              )}

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search resources, alerts, or locations..."
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    className="flex items-center justify-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
                  >
                    <Bell className="h-5 w-5" />
                    <span>Create Alert</span>
                  </button>
                  <button 
                    className="flex items-center justify-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
                  >
                    <Users className="h-5 w-5" />
                    <span>Join Group</span>
                  </button>
                </div>
              </div>

              <ResourceTypeFilter
                selectedType={selectedType}
                onTypeSelect={setSelectedType}
              />

              <ResourceList 
                resources={filteredResources}
              />
            </main>
          } />
          
          <Route path="/chat" element={<CommunityChat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        <footer className={`mt-16 py-8 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-800 text-gray-300'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About NexCos</h3>
                <p className="text-sm">Building resilient communities through resource sharing and crisis preparedness.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">Emergency Resources</a></li>
                  <li><a href="#" className="hover:text-white transition">Community Guidelines</a></li>
                  <li><a href="#" className="hover:text-white transition">Crisis Response</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li>help@nexcos.org</li>
                  <li>Emergency: 112</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
              © 2024 NexCos. Building resilient communities together.
            </div>
          </div>
        </footer>

        <NexAI />
      </div>
    </Router>
  );
}

export default App;