import React from 'react';
import { Palette } from 'lucide-react';
import { useThemeStore, type Theme } from '../../store/themeStore';

const themes: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Clean Light' },
  { value: 'dark', label: 'Editorial Dark' },
  { value: 'theme-forest', label: 'Forest Calm' },
  { value: 'theme-sunset', label: 'Sunset Warm' },
  { value: 'theme-modern-blue', label: 'Modern Blue' },
];

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = React.useState(false);

  // Apply theme to document root
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'theme-forest', 'theme-sunset', 'theme-modern-blue');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={isOpen}
        aria-label="Toggle theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  theme === t.value
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                role="menuitem"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
