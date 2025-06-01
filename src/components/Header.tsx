
import { Zap, Github, ExternalLink, PenTool } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b-4 border-gray-300 sticky top-0 z-50 relative">
      {/* Sketch-style tape effect */}
      <div className="absolute top-2 left-1/4 w-16 h-8 bg-yellow-200 opacity-70 transform -rotate-12 rounded-sm border border-yellow-400"></div>
      <div className="absolute top-1 right-1/3 w-12 h-6 bg-blue-200 opacity-70 transform rotate-45 rounded-sm border border-blue-400"></div>
      
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl transform rotate-12 shadow-lg border-2 border-gray-300">
              <PenTool className="w-6 h-6 text-white transform -rotate-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold relative">
                <span className="relative z-10 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  PromptForge
                </span>
                {/* Hand-drawn underline effect */}
                <svg className="absolute -bottom-2 left-0 w-full h-3" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5,8 Q50,4 100,8 T200,8" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </h1>
              <p className="text-sm text-gray-600 relative">
                <span className="relative z-10">AI Prompt Optimizer</span>
                <div className="absolute -bottom-0.5 left-0 w-3/4 h-1 bg-blue-200 opacity-60 transform -skew-x-12"></div>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/jujumilk3/leaked-system-prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors bg-white/80 rounded-xl border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105 duration-200 shadow-md"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">System Prompts</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom sketch line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-60"></div>
    </header>
  );
};
