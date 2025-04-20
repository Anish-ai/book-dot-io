'use client';

import { useTheme } from '@/app/context/ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      // onClick={toggleTheme}
      // className="p-2 rounded-lg bg-[var(--card)] hover:bg-[var(--card-hover)] 
      //            transition-all duration-200 border border-[var(--border)]"
      // aria-label="Toggle theme"
    >
      {/* {theme === 'dark' ? (
        <SunIcon className="w-5 h-5 text-[var(--warning)]" />
      ) : (
<SunIcon className="w-5 h-5 text-[var(--warning)]" />
      )} */}
    </button>
  );
} 