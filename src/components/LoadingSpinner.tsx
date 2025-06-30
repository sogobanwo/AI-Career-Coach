import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
            <Brain className="h-10 w-10 text-white animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-purple-500 animate-bounce" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          AI Career Coach
        </h2>
        
        <div className="flex justify-center space-x-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">Loading your career journey...</p>
      </div>
    </div>
  );
}