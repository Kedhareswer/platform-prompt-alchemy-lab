
import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

export const SimplifiedHeader = () => {
  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">PromptForge</h1>
              <p className="text-xs text-slate-500">AI Prompt Engineering Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Docs</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Examples</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Community</a>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
