'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Search, Bookmark, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';

const items = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Bookmark, label: 'Saved', href: '/saved' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-black/40 backdrop-blur-3xl border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 px-3 py-2 transition-all',
                isActive ? 'text-blue-400' : 'text-white/20 hover:text-white/40'
              )}
            >
              <item.icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
              <span className="text-[9px] font-semibold tracking-wider uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
