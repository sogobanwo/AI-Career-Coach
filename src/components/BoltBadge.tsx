import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export default function BoltBadge() {
  return (
    <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-shimmer border border-purple-200/50 dark:border-purple-700/50">
      <div className="relative">
        <Zap className="h-5 w-5 animate-pulse" />
        <div className="absolute inset-0 animate-ping">
          <Zap className="h-5 w-5 opacity-30" />
        </div>
      </div>
      <span className="gradient-text font-bold">Built with Bolt.new</span>
      <Sparkles className="h-4 w-4 text-pink-500 dark:text-pink-400 animate-pulse" />
    </div>
  );
}