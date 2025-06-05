import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageCode, LANGUAGES } from '@/i18n/config';

export function LanguageSelector() {
  const { 
    currentLanguage, 
    isChanging, 
    changeLanguage, 
    languages 
  } = useLanguage();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, code: LanguageCode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      changeLanguage(code);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  // Type guard to check if the language exists in our config
  const isValidLanguage = (code: string): code is LanguageCode => {
    return Object.keys(LANGUAGES).includes(code);
  };

  const getCurrentLanguageConfig = () => {
    if (!isValidLanguage(currentLanguage)) {
      console.warn(`Language '${currentLanguage}' not found in language config`);
      return {
        flag: <Globe className="h-4 w-4" />,
        name: 'English',
        nativeName: 'English',
        rtl: false
      };
    }
    return LANGUAGES[currentLanguage];
  };

  const currentLanguageConfig = getCurrentLanguageConfig();
  const currentFlag = currentLanguageConfig.flag;
  const currentLanguageName = currentLanguageConfig.name;

  return (
    <div className="relative" ref={menuRef}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            ref={triggerRef}
            variant="ghost" 
            size="sm" 
            className="h-9 w-20 px-2 gap-1.5 hover:bg-accent/50 transition-colors"
            disabled={isChanging}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={`Current language: ${currentLanguageName}. Click to change language`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isChanging ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="text-base" aria-hidden="true">
                  {currentFlag}
                </span>
                <ChevronDown 
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    isOpen ? "rotate-180" : ""
                  )} 
                  aria-hidden="true"
                />
                <span className="sr-only">Change language</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 p-2"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setIsOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          <div role="listbox" aria-label="Select a language">
            {Object.entries(LANGUAGES).map(([code, language]) => {
              const langCode = code as LanguageCode;
              return (
                <DropdownMenuItem
                  key={code}
                  className={cn(
                    "flex items-center justify-between rounded-md p-2 cursor-pointer",
                    "hover:bg-accent/50 focus:bg-accent/50 focus:outline-none",
                    currentLanguage === langCode && "bg-accent/30"
                  )}
                  onClick={() => {
                    changeLanguage(langCode);
                    setIsOpen(false);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, langCode)}
                  role="option"
                  aria-selected={currentLanguage === langCode}
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-lg" aria-hidden="true">
                        {language.flag}
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {language.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {language.nativeName}
                        </div>
                      </div>
                    </div>
                    {currentLanguage === langCode && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
