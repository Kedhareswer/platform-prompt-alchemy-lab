import { PenTool, Github, ExternalLink } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

export const Header = () => {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b-2 border-foreground/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group focus-visible:outline-none" aria-label="PromptForge Home">
            <div className="sketch-card p-3 transform rotate-12 transition-transform group-hover:rotate-0 group-focus-visible:rotate-0">
              <PenTool className="w-6 h-6 transform -rotate-12 transition-transform group-hover:rotate-0 group-focus-visible:rotate-0" />
            </div>
            <div>
              <h1 className="text-3xl font-bold relative inline-flex items-center">
                PromptForge
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-foreground/20 transform -skew-x-12 transition-transform group-hover:skew-x-0"></div>
              </h1>
              <p className="text-sm text-foreground/70">AI Prompt Optimizer</p>
            </div>
          </a>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center border-r border-foreground/20 pr-4 mr-2">
              <LanguageSelector />
            </div>
            <a
              href="https://github.com/jujumilk3/leaked-system-prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="sketch-button group"
              aria-label="View System Prompts on GitHub"
            >
              <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">System Prompts</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};