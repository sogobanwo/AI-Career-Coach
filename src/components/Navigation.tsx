import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X, Sparkles, LogOut, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  const publicNavLinks = [
    { path: '/', label: 'Home', description: 'Start your journey' },
    { path: '/about', label: 'About', description: 'Learn more' },
  ];

  const privateNavLinks = [
    { path: '/dashboard', label: 'Dashboard', description: 'Your overview' },
    { path: '/career-goals', label: 'Career Goals', description: 'Define your path' },
    { path: '/resume-upload', label: 'Resume Analysis', description: 'Optimize your resume' },
    { path: '/mock-interview', label: 'Mock Interview', description: 'Practice interviews' },
  ];

  const navLinks = user ? privateNavLinks : publicNavLinks;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
            <div className="relative p-3 bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-500 dark:to-purple-600 rounded-2xl group-hover:from-purple-600 group-hover:to-blue-700 dark:group-hover:from-purple-500 dark:group-hover:to-blue-500 transition-all duration-500 shadow-lg group-hover:shadow-xl animate-pulse-glow">
              <Brain className="h-7 w-7 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                AI Career Coach
              </span>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-purple-500 dark:text-purple-400" />
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Powered by AI</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, index) => (
              <div key={link.path} className="relative group">
                <Link
                  to={link.path}
                  className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {isActive(link.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl animate-pulse-glow"></div>
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                  {link.description}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100"></div>
                </div>
              </div>
            ))}
            
            <div className="ml-4 flex items-center space-x-3">              
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-gray-800/50 rounded-xl">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-110"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-110"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/20 dark:border-gray-700/30 animate-slide-up">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col">
                    <span>{link.label}</span>
                    <span className="text-xs opacity-70 mt-1">{link.description}</span>
                  </div>
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-white/20 dark:border-gray-700/30">
                  <div className="flex items-center space-x-3 px-6 py-3 text-gray-700 dark:text-gray-300">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.user_metadata?.full_name || user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-6 py-4 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/20 dark:border-gray-700/30 space-y-3">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-4 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}