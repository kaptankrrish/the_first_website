'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Newspaper, Search, Bookmark, Settings,
  LayoutDashboard, Cloud, GraduationCap,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const items = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Cloud, label: 'Weather', href: '/weather' },
  { icon: GraduationCap, label: 'Learn', href: '/daily-learning' },
  { icon: Bookmark, label: 'Saved', href: '/saved' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-strong border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1 relative">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 px-2 py-2 transition-all duration-300 flex-1 min-w-0 touch-manipulation',
                isActive ? 'text-blue-300' : 'text-white/40 hover:text-white/70'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-x-1 top-0 h-0.5 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon
                className={cn(
                  'w-5 h-5 transition-all duration-300 shrink-0',
                  isActive && 'scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]'
                )}
              />
              <span
                className={cn(
                  'text-[8px] font-semibold tracking-wider uppercase transition-colors truncate max-w-full',
                  isActive ? 'text-foreground/90' : 'text-white/30'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
