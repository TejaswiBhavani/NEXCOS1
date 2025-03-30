import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Bell, Menu, X, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const handleAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Community', path: '/chat' },
    { name: 'Alerts', path: '/alerts' },
  ];

  return (
    <>
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
                  NexCos
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/notifications"
                    className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                      <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                        alt={user?.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-soft border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={() => logout()}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAuth('login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => handleAuth('signup')}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => {
                      handleAuth('login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      handleAuth('signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
}