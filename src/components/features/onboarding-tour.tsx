'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Zap, ChevronRight, ChevronLeft, X,
  Command, Keyboard, Compass, ArrowRight,
} from 'lucide-react';
import { useOnboardingStore } from '@/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface TourStep {
  title: string;
  description: string;
  icon: React.ElementType;
  tip: string;
  cta?: { label: string; href: string };
  highlight?: string;
}

const STEPS: TourStep[] = [
  {
    title: 'Welcome to Knowledge Base',
    description: 'A futuristic AI knowledge ecosystem combining news, learning, productivity, and insights — all in one place.',
    icon: Sparkles,
    tip: 'You can replay this tour anytime from Settings.',
    cta: { label: 'Take a quick tour', href: '#tour' },
  },
  {
    title: 'Jump anywhere with ⌘K',
    description: 'Press ⌘K (or Ctrl+K) anywhere to open the command palette. Search 25+ features in milliseconds.',
    icon: Command,
    tip: 'Try it now — it works from any page.',
  },
  {
    title: 'Quick access widgets',
    description: 'Your homepage has live widgets for todos, habits, weather, focus time, and a daily quote — all in one place.',
    icon: Compass,
    tip: 'Widgets update in real-time as you use the app.',
    cta: { label: 'Open Home', href: '/' },
  },
  {
    title: 'Press ? for shortcuts',
    description: 'Press the ? key to see all keyboard shortcuts. Navigate the entire app without leaving the keyboard.',
    icon: Keyboard,
    tip: 'Combine G + key to jump between pages instantly.',
  },
  {
    title: 'You\'re ready!',
    description: 'Start with the Feature Showcase below or jump straight to your favorite tool. Everything is live, with no mock data.',
    icon: Zap,
    tip: 'Your last 6 visited features appear in the Recently Used rail on the home page.',
    cta: { label: 'Open Dashboard', href: '/dashboard' },
  },
];

export function OnboardingTour() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasCompletedTour, tourStep, nextStep, prevStep, skipTour, finishTour } = useOnboardingStore();
  const [mounted] = useState(true);

  // Don't show on settings or special pages
  const isVisible =
    mounted &&
    !hasCompletedTour &&
    pathname !== '/settings' &&
    pathname !== '/shortcuts';

  const currentStep = STEPS[Math.min(tourStep, STEPS.length - 1)];
  const isLast = tourStep >= STEPS.length - 1;
  const isFirst = tourStep === 0;
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (isLast) {
      finishTour();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    skipTour();
  };

  const handleCta = (href: string) => {
    if (href === '#tour') {
      // Just close overlay
      return;
    }
    finishTour();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg"
          >
            {/* Glow accents */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-xl opacity-60" />

            <div className="relative glass-strong rounded-3xl overflow-hidden">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors z-10"
                aria-label="Skip tour"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative p-7 sm:p-8">
                <div className="flex flex-col items-center text-center mb-6">
                  <motion.div
                    key={tourStep}
                    initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(167,139,250,0.4)]"
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <motion.h2
                    key={`t-${tourStep}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl sm:text-2xl font-bold text-pretty"
                  >
                    <span className="text-gradient">{currentStep.title}</span>
                  </motion.h2>
                  <motion.p
                    key={`d-${tourStep}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-sm text-muted-foreground mt-2 max-w-md text-pretty"
                  >
                    {currentStep.description}
                  </motion.p>
                </div>

                <motion.div
                  key={`tip-${tourStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/20 mb-5"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 mt-0.5 shrink-0" />
                    <p className="text-[11.5px] text-amber-100/90 leading-relaxed">
                      <span className="font-semibold text-amber-200">Tip:</span> {currentStep.tip}
                    </p>
                  </div>
                </motion.div>

                {/* Step indicators */}
                <div className="flex items-center justify-center gap-1.5 mb-5">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1 rounded-full transition-all duration-500',
                        i === tourStep
                          ? 'w-8 bg-gradient-to-r from-blue-400 to-purple-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]'
                          : i < tourStep
                            ? 'w-3 bg-blue-400/40'
                            : 'w-3 bg-white/10'
                      )}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {!isFirst && (
                    <Button
                      onClick={prevStep}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                      Back
                    </Button>
                  )}

                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground/60 hover:text-foreground"
                  >
                    Skip
                  </Button>

                  <div className="flex-1" />

                  {currentStep.cta && !isLast && (
                    <Button
                      onClick={() => handleCta(currentStep.cta!.href)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/10"
                    >
                      {currentStep.cta.label}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  )}

                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg shadow-purple-500/30"
                  >
                    {isLast ? 'Get started' : 'Next'}
                    {!isLast && <ChevronRight className="w-3.5 h-3.5 ml-1" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
