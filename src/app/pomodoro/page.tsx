'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePomodoroStore } from '@/store';
import { cn } from '@/utils/cn';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Clock, Coffee, Brain, Timer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageWrapper } from '@/components/layout/page-wrapper';

const CIRCUMFERENCE = 2 * Math.PI * 120;

// Floating Particles Component
const Particles = ({ color }: { color: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2
          }}
          animate={{
            y: [0, -100 - Math.random() * 100],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0, 0.8, 0],
            scale: [0, Math.random() * 1.5 + 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

export default function PomodoroPage() {
  const { t } = useLanguage();
  const {
    workDuration,
    breakDuration,
    sessionsCompleted,
    totalFocusTime,
    setWorkDuration,
    setBreakDuration,
    incrementSessions,
    addFocusTime,
  } = usePomodoroStore();

  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(workDuration);
  const [breakMinutes, setBreakMinutes] = useState(breakDuration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentDuration = mode === 'work' ? workMinutes : breakMinutes;
  const totalSeconds = currentDuration * 60;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const notify = useCallback(() => {
    if (Notification.permission === 'granted') {
      new Notification(mode === 'work' ? 'Work session complete!' : 'Break over!', {
        body: mode === 'work' ? 'Time for a break.' : 'Back to work!',
      });
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [mode]);

  const switchMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'work' ? 'break' : 'work';
      const duration = next === 'work' ? workMinutes : breakMinutes;
      setTimeLeft(duration * 60);
      if (prev === 'work') {
        incrementSessions();
        addFocusTime(workMinutes);
      }
      return next;
    });
  }, [workMinutes, breakMinutes, incrementSessions, addFocusTime]);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          notify();
          setTimeout(switchMode, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [isRunning, clearTimer, notify, switchMode]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleReset = () => {
    clearTimer();
    setIsRunning(false);
    setTimeLeft(currentDuration * 60);
  };

  const handleWorkChange = (value: number[]) => {
    const v = value[0];
    setWorkMinutes(v);
    setWorkDuration(v);
    if (mode === 'work' && !isRunning) {
      setTimeLeft(v * 60);
    }
  };

  const handleBreakChange = (value: number[]) => {
    const v = value[0];
    setBreakMinutes(v);
    setBreakDuration(v);
    if (mode === 'break' && !isRunning) {
      setTimeLeft(v * 60);
    }
  };

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(currentDuration * 60);
    }
  }, [mode, currentDuration, isRunning]);

  return (
    <PageWrapper
      icon={Timer}
      title={t.nav.pomodoro}
      subtitle={t.pomodoro.title}
      badgeText={mode === 'work' ? 'Focus' : 'Break'}
      colorScheme={mode === 'work' ? 'rose' : 'emerald'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="relative overflow-hidden bg-black/40 backdrop-blur-xl border-white/5">
              {isRunning && (
                <Particles color={mode === 'work' ? '#f43f5e' : '#10b981'} />
              )}
              <CardContent className="flex flex-col items-center p-8 sm:p-12">
                <div className="flex items-center gap-2 mb-10 z-10 relative bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!isRunning) {
                        setMode('work');
                        setTimeLeft(workMinutes * 60);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300',
                      mode === 'work'
                        ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                        : 'text-white/40 hover:text-white/80'
                    )}
                  >
                    <Brain className="w-4 h-4" />
                    {t.pomodoro.focus}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!isRunning) {
                        setMode('break');
                        setTimeLeft(breakMinutes * 60);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300',
                      mode === 'break'
                        ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : 'text-white/40 hover:text-white/80'
                    )}
                  >
                    <Coffee className="w-4 h-4" />
                    {t.pomodoro.break}
                  </motion.button>
                </div>

                <div className="relative mb-12 z-10 flex items-center justify-center">
                  {/* Pulsing Glow Background */}
                  <AnimatePresence mode="popLayout">
                    {isRunning && (
                      <motion.div
                        key="glow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className={cn(
                          "absolute inset-0 rounded-full blur-3xl",
                          mode === 'work' ? "bg-rose-500/30" : "bg-emerald-500/30"
                        )}
                      />
                    )}
                  </AnimatePresence>

                  <svg width="320" height="320" className="transform -rotate-90 filter drop-shadow-2xl">
                    <defs>
                      <linearGradient id="workGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#fb7185" />
                      </linearGradient>
                      <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="160"
                      cy="160"
                      r="140"
                      fill="none"
                      stroke={mode === 'work' ? 'url(#workGradient)' : 'url(#breakGradient)'}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE * (140/120)}
                      strokeDashoffset={(CIRCUMFERENCE * (140/120)) - ((CIRCUMFERENCE * (140/120)) * (timeLeft / totalSeconds))}
                      className="transition-all duration-1000 ease-linear"
                      filter="url(#glow)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      key={timeLeft}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="text-7xl font-bold tracking-tighter text-white tabular-nums drop-shadow-lg"
                    >
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </motion.span>
                    <span className="text-sm text-white/60 mt-3 font-medium uppercase tracking-widest">
                      {mode === 'work' ? 'Focus Time' : 'Break Time'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 z-10 relative">
                  <Button
                    size="lg"
                    onClick={handleStartPause}
                    className={cn(
                      'w-40 gap-3 h-14 text-lg font-medium shadow-xl transition-all duration-300 hover:scale-105',
                      mode === 'work'
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-500/25'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25'
                    )}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5 fill-current" /> {t.pomodoro.pause}
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" /> {t.pomodoro.start}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleReset} 
                    className="gap-2 h-14 bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 text-white/80"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="bg-black/40 backdrop-blur-xl border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white/90">
                  <Timer className="w-4 h-4 text-amber-400" />
                  Customize
                </CardTitle>
                <CardDescription className="text-white/50">Adjust session durations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70">{t.pomodoro.focus}</span>
                    <Badge variant="outline" className="bg-rose-500/10 text-rose-300 border-rose-500/20">{workMinutes} {t.pomodoro.minutes}</Badge>
                  </div>
                  <Slider
                    value={[workMinutes]}
                    onValueChange={handleWorkChange}
                    min={1}
                    max={60}
                    step={1}
                    disabled={isRunning}
                    className="[&_[role=slider]]:bg-rose-500 [&_[role=slider]]:border-rose-400 [&_.bg-primary]:bg-rose-500"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70">{t.pomodoro.break}</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">{breakMinutes} {t.pomodoro.minutes}</Badge>
                  </div>
                  <Slider
                    value={[breakMinutes]}
                    onValueChange={handleBreakChange}
                    min={1}
                    max={30}
                    step={1}
                    disabled={isRunning}
                    className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-400 [&_.bg-primary]:bg-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className="bg-black/40 backdrop-blur-xl border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white/90">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Statistics
                </CardTitle>
                <CardDescription className="text-white/50">Your productivity stats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">{t.pomodoro.sessions}</span>
                    <span className="text-xl font-bold text-white drop-shadow-sm">{sessionsCompleted}</span>
                  </div>
                  <Progress value={Math.min((sessionsCompleted % 4) * 25, 100)} className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500" />
                  <p className="text-[10px] text-white/40 mt-2 text-right">4 sessions = 1 long break</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">{t.pomodoro.totalFocus}</span>
                    <span className="text-xl font-bold text-white drop-shadow-sm">{totalFocusTime} <span className="text-sm font-normal text-white/50">{t.pomodoro.minutes}</span></span>
                  </div>
                  <Progress value={Math.min((totalFocusTime / 60) * 100, 100)} className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500" />
                  <p className="text-[10px] text-white/40 mt-2 text-right">Goal: 60 mins</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <audio ref={audioRef}>
        <source src="/audio/timer-complete.wav" type="audio/wav" />
      </audio>
    </PageWrapper>
  );
}
