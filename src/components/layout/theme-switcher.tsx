'use client';
import { useTheme } from '@/components/layout/theme-provider';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  const themes = [
    { value: 'light' as const, icon: Sun },
    { value: 'dark' as const, icon: Moon },
    { value: 'system' as const, icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={cn(
            'p-1.5 rounded-lg transition-all',
            theme === t.value ? 'bg-white/10 text-blue-400' : 'text-white/40 hover:text-white/70'
          )}
        >
          <t.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
