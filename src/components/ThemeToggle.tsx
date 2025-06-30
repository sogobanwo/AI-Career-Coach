import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-2xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110 group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        <Sun className={`absolute inset-0 h-6 w-6 text-yellow-500 transition-all duration-500 transform ${
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`} />
        <Moon className={`absolute inset-0 h-6 w-6 text-blue-400 transition-all duration-500 transform ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`} />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
        isDark 
          ? 'bg-blue-400/20 shadow-lg shadow-blue-400/25' 
          : 'bg-yellow-400/20 shadow-lg shadow-yellow-400/25'
      } opacity-0 group-hover:opacity-100`}></div>
    </button>
  );
}