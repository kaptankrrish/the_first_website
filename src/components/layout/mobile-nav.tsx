'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';
import { mobileMainItems, mobileMoreItems } from '@/lib/nav-items';

export default function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-premium border-t border-white/5 safe-area-bottom" role="navigation" aria-label="Mobile navigation">
        <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none" />
        <div className="absolute inset-0 noise-overlay pointer-events-none" />
        <div className="flex items-center justify-around h-16 px-1 relative">
          {mobileMainItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 h-full"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    'relative flex flex-col items-center justify-center h-full w-full gap-1 transition-all duration-200 touch-manipulation',
                    isActive ? 'text-blue-300' : 'text-white/40 hover:text-white/70'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-active"
                      className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      'w-5 h-5 transition-all duration-200 shrink-0',
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
                </motion.div>
              </Link>
            );
          })}
          
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex-1 h-full"
            aria-label="More options"
            aria-expanded={moreOpen}
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={cn(
                'relative flex flex-col items-center justify-center h-full w-full gap-1 transition-all duration-200 touch-manipulation',
                moreOpen ? 'text-blue-300' : 'text-white/40 hover:text-white/70'
              )}
            >
              <MoreHorizontal
                className={cn(
                  'w-5 h-5 transition-all duration-200 shrink-0',
                  moreOpen && 'scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]'
                )}
              />
              <span className={cn(
                'text-[8px] font-semibold tracking-wider uppercase transition-colors truncate max-w-full',
                moreOpen ? 'text-foreground/90' : 'text-white/30'
              )}>
                More
              </span>
            </motion.div>
          </button>
        </div>
      </nav>

      {/* More Menu Overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-[64px] left-0 right-0 z-40 lg:hidden p-4 pb-8 glass-premium rounded-t-3xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)]"
              role="menu"
            >
              <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none rounded-t-3xl" />
              <div className="absolute inset-0 noise-overlay pointer-events-none rounded-t-3xl" />
              <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
              </div>
              <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                {mobileMoreItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      aria-label={item.label}
                      role="menuitem"
                    >
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        className="flex flex-col items-center gap-2 touch-manipulation"
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                          isActive 
                            ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300" 
                            : "bg-white/5 border border-white/5 text-white/60 hover:bg-white/10 hover:scale-105"
                        )}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className={cn(
                          "text-[9px] font-semibold tracking-wide uppercase text-center",
                          isActive ? "text-foreground/90" : "text-white/40"
                        )}>
                          {item.label}
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
