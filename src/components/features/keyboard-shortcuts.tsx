'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Zap } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  group: 'Navigation' | 'Global' | 'Actions';
  isMac?: boolean;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['⌘', 'K'], description: 'Open command palette', group: 'Global' },
  { keys: ['/'], description: 'Focus floating search', group: 'Global' },
  { keys: ['?'], description: 'Toggle this shortcuts panel', group: 'Global' },
  { keys: ['Esc'], description: 'Close any open modal', group: 'Global' },
  { keys: ['G', 'H'], description: 'Go to Home', group: 'Navigation' },
  { keys: ['G', 'N'], description: 'Go to News', group: 'Navigation' },
  { keys: ['G', 'D'], description: 'Go to Dashboard', group: 'Navigation' },
  { keys: ['G', 'Q'], description: 'Go to Quotes', group: 'Navigation' },
  { keys: ['G', 'T'], description: 'Go to Todo', group: 'Navigation' },
  { keys: ['G', 'W'], description: 'Go to Weather', group: 'Navigation' },
  { keys: ['G', 'S'], description: 'Go to Settings', group: 'Navigation' },
  { keys: ['['], description: 'Toggle sidebar collapse', group: 'Actions' },
  { keys: ['T'], description: 'Toggle theme (light/dark)', group: 'Actions' },
];

export function KeyboardShortcutsOverlay() {
  const [open, setOpen] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const router = useRouter();

  // Listen for "?" to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore if typing in input
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;

      // Open shortcuts
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setOpen((p) => !p);
        return;
      }

      // Sidebar collapse
      if (e.key === '[' && !isInput) {
        const evt = new CustomEvent('toggle-sidebar');
        window.dispatchEvent(evt);
        return;
      }

      // Go to navigation
      if (e.key === 'g' && !isInput && !e.metaKey && !e.ctrlKey) {
        setPressedKeys(['g']);
        setTimeout(() => setPressedKeys([]), 800);
        return;
      }

      if (pressedKeys.includes('g') && !isInput) {
        const map: Record<string, string> = {
          h: '/',
          n: '/news',
          d: '/dashboard',
          q: '/quotes',
          t: '/todo',
          w: '/weather',
          s: '/settings',
        };
        const dest = map[e.key.toLowerCase()];
        if (dest) {
          e.preventDefault();
          router.push(dest);
          setPressedKeys([]);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [pressedKeys, router]);

  // Sidebar toggle listener
  useEffect(() => {
    const onToggle = () => {
      const evt = new CustomEvent('app:toggle-sidebar');
      window.dispatchEvent(evt);
    };
    window.addEventListener('toggle-sidebar', onToggle);
    return () => window.removeEventListener('toggle-sidebar', onToggle);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl glass-strong rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden"
          >
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center">
                  <Keyboard className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-pretty">Keyboard Shortcuts</h2>
                  <p className="text-[11px] text-muted-foreground/60">Navigate faster without leaving the keyboard</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative p-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(['Navigation', 'Global', 'Actions'] as const).map((group) => {
                  const items = SHORTCUTS.filter((s) => s.group === group);
                  return (
                    <div key={group}>
                      <h3 className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold mb-3 px-1">
                        {group}
                      </h3>
                      <div className="space-y-1.5">
                        {items.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                          >
                            <span className="text-[12px] text-foreground/80">{s.description}</span>
                            <div className="flex items-center gap-1">
                              {s.keys.map((k, ki) => (
                                <kbd
                                  key={ki}
                                  className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md bg-white/10 text-[10px] font-mono text-foreground/90 border border-white/10 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_-1px_0_rgba(0,0,0,0.2)_inset]"
                                >
                                  {k}
                                </kbd>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/5 border border-white/5">
                <div className="flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12px] font-semibold text-foreground/90">Pro tip</p>
                    <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                      Combine <kbd className="px-1 py-0.5 rounded bg-white/10 text-[9px] font-mono">G</kbd> with a key for instant navigation. Example: <kbd className="px-1 py-0.5 rounded bg-white/10 text-[9px] font-mono">G</kbd> then <kbd className="px-1 py-0.5 rounded bg-white/10 text-[9px] font-mono">N</kbd> jumps to News.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
