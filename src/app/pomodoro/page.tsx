'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePomodoroStore } from '@/store';
import { cn } from '@/utils/cn';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Clock, Coffee, Brain, Timer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CIRCUMFERENCE = 2 * Math.PI * 120;

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
    Notification.requestPermission();
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
      Promise.resolve().then(() => setTimeLeft(currentDuration * 60));
    }
  }, [mode, currentDuration, isRunning]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-3 sm:gap-4 min-w-0">
          <motion.div
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-red-500/20 via-orange-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(239,68,68,0.2)]"
          >
            <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-red-200" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded-full ${mode === 'work' ? 'bg-red-500/15 text-red-300 border-red-400/20' : 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20'} text-[10px] font-semibold uppercase tracking-[0.18em] border inline-flex items-center gap-1.5`}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${mode === 'work' ? 'bg-red-400' : 'bg-emerald-400'} opacity-75`} />
                  <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${mode === 'work' ? 'bg-red-400' : 'bg-emerald-400'} ${mode === 'work' ? 'shadow-[0_0_6px_rgba(248,113,113,0.8)]' : 'shadow-[0_0_6px_rgba(52,211,153,0.8)]'}`} />
                </span>
                {mode === 'work' ? 'Focus' : 'Break'} · {sessionsCompleted} sessions
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
                {Math.round(totalFocusTime)}m focused
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-warm leading-tight text-balance">
              {t.nav.pomodoro}
            </h1>
            <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
              {t.pomodoro.title}
            </p>
          </div>
        </div>

        <div className="mt-5 h-px divider-gradient" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="relative overflow-hidden">
              <CardContent className="flex flex-col items-center p-8">
                <div className="flex items-center gap-2 mb-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!isRunning) {
                        setMode('work');
                        setTimeLeft(workMinutes * 60);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                      mode === 'work'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-white/40 hover:text-white/60'
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
                      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                      mode === 'break'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-white/40 hover:text-white/60'
                    )}
                  >
                    <Coffee className="w-4 h-4" />
                    {t.pomodoro.break}
                  </motion.button>
                </div>

                <div className="relative mb-6">
                  <svg width="280" height="280" className="transform -rotate-90">
                    <circle
                      cx="140"
                      cy="140"
                      r="120"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="140"
                      cy="140"
                      r="120"
                      fill="none"
                      stroke={mode === 'work' ? '#3b82f6' : '#10b981'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * (timeLeft / totalSeconds))}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      key={timeLeft}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-6xl font-bold tracking-tighter text-white tabular-nums"
                    >
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </motion.span>
                    <span className="text-sm text-white/40 mt-2 capitalize">
                      {mode === 'work' ? 'Focus Time' : 'Break Time'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    size="lg"
                    onClick={handleStartPause}
                    className={cn(
                      'w-32 gap-2',
                      mode === 'work'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    )}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4" /> {t.pomodoro.pause}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> {t.pomodoro.start}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleReset} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    {t.pomodoro.reset}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Customize
                </CardTitle>
                <CardDescription>Adjust session durations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">{t.pomodoro.focus}</span>
                    <Badge variant="secondary">{workMinutes} {t.pomodoro.minutes}</Badge>
                  </div>
                  <Slider
                    value={[workMinutes]}
                    onValueChange={handleWorkChange}
                    min={1}
                    max={60}
                    step={1}
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">{t.pomodoro.break}</span>
                    <Badge variant="secondary">{breakMinutes} {t.pomodoro.minutes}</Badge>
                  </div>
                  <Slider
                    value={[breakMinutes]}
                    onValueChange={handleBreakChange}
                    min={1}
                    max={30}
                    step={1}
                    disabled={isRunning}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Statistics
                </CardTitle>
                <CardDescription>Your productivity stats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/60">{t.pomodoro.sessions}</span>
                    <span className="text-lg font-bold text-white">{sessionsCompleted}</span>
                  </div>
                  <Progress value={Math.min((sessionsCompleted % 4) * 25, 100)} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/60">{t.pomodoro.totalFocus}</span>
                    <span className="text-lg font-bold text-white">{totalFocusTime} {t.pomodoro.minutes}</span>
                  </div>
                  <Progress value={Math.min((totalFocusTime / 60) * 100, 100)} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <audio ref={audioRef}>
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f4B/f3+AgH+AgH+AgIC Af39/f39/gICAgICAgICAf39/f4B/f3+AgH+AgH+AgICAf39/f3+AgICAf39/gH9/f3+AgH+AgH9/f4B/f3+AgIC Af39/f4B/f3+AgH+AgH+AgICAf39/gH9/f3+AgH9/f4B/f3+AgH+AgH+AgICAf39/f3+AgH+AgH+AgICAf39/gH9/f3+AgH+AgH+AgICAf39/gH9/f3+AgH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICAf39/f39/gH+AgH+AgICA"
        />
      </audio>
    </div>
  );
}
