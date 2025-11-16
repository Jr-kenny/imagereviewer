import React from 'react';
import { Moon, Sun, Image as ImageIcon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../shared/Button';

export function Header() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gray-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Image Archive
              </h1>
              <p className="text-xs text-gray-400">AI-Powered Analysis Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full p-2"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
