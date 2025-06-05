
import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export const SimplifiedHeader = () => {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-blue-600" />
              <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PromptForge</h1>
              <p className="text-sm text-gray-600">AI Prompt Engineering Tool</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Transform Your Prompts</p>
              <p className="text-xs text-gray-500">Get better AI responses with optimized prompts</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
