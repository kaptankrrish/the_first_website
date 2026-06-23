'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cloud, Sun, CloudRain, Quote as QuoteIcon, CheckSquare, Moon,
  ArrowUpRight, Flame, Clock,
} from 'lucide-react';
import { useTodoStore, useHabitStore, usePomodoroStore } from '@/store';
import { BentoCard } from '@/components/ui/bento-card';

interface WeatherSnapshot {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'snow';
  city: string;
}

interface QuoteSnapshot {
  text: string;
  author: string;
}

function getTimeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

export function QuickAccessWidgets() {
  const { todos } = useTodoStore();
  const { habits } = useHabitStore();
  const { sessionsCompleted, totalFocusTime } = usePomodoroStore();

  const activeTodos = todos.filter((t) => !t.completed).length;
  const completedToday = todos.filter((t) => t.completed).length;
  const habitStreaks = habits.reduce((acc, h) => acc + (h.streak || 0), 0);

  // Mini weather widget — fixed initial for SSR, updated on client mount
  const [weather, setWeather] = useState<WeatherSnapshot | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    const conditions: WeatherSnapshot['condition'][] = ['sunny', 'cloudy', 'rain'];
    setWeather({
      temp: 18 + ((hour * 3) % 12),
      condition: conditions[hour % conditions.length],
      city: 'Earth',
    });
    setMounted(true);
  }, []);

  // Mini quote widget (deterministic from date for SSR safety)
  const [quote] = useState<QuoteSnapshot>(() => {
    const samples: QuoteSnapshot[] = [
      { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
      { text: 'Knowledge is power.', author: 'Francis Bacon' },
      { text: 'Stay hungry, stay foolish.', author: 'Stewart Brand' },
      { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
    ];
    const today = new Date();
    const dayIndex = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return samples[dayIndex % samples.length];
  });

  // Greeting — fixed initial for SSR, updated on client mount
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    setGreeting(getTimeOfDayGreeting());
  }, []);

  const WeatherIcon = weather?.condition === 'sunny' ? Sun
    : weather?.condition === 'rain' ? CloudRain
    : Cloud;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Greeting + time */}
      <BentoCard variant="aurora" size="md" className="col-span-2">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
            Today
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
            <Clock className="w-3 h-3" />
            <ClientTime />
          </div>
        </div>
        <div className="text-balance">
          <h3 className="text-xl sm:text-2xl font-bold leading-tight text-pretty">
            <span className="text-gradient-aurora">{greeting}</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md text-pretty">
            {activeTodos > 0
              ? `You have ${activeTodos} task${activeTodos === 1 ? '' : 's'} waiting and ${habits.length} habit${habits.length === 1 ? '' : 's'} to nurture.`
              : habits.length > 0
                ? `${habits.length} habit${habits.length === 1 ? '' : 's'} in motion. Keep the streak alive.`
                : 'Pick a tool to begin. The whole ecosystem is at your fingertips.'}
          </p>
        </div>
      </BentoCard>

      {/* Todos */}
      <Link href="/todo" className="block">
        <BentoCard variant="gradient" size="md" interactive className="h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-400/20 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-green-300" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-300 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-foreground/90">{activeTodos}</div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-1">
            Open Tasks
          </p>
          {completedToday > 0 && (
            <div className="mt-2 text-[10px] text-emerald-300 font-semibold">
              {completedToday} done
            </div>
          )}
        </BentoCard>
      </Link>

      {/* Habits */}
      <Link href="/habits" className="block">
        <BentoCard variant="gradient" size="md" interactive className="h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-400/20 flex items-center justify-center">
              <Moon className="w-4 h-4 text-indigo-300" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-300 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground/90">{habitStreaks}</span>
            <Flame className="w-4 h-4 text-orange-400 mb-1" />
          </div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-1">
            Habit Streak
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1.5">
            {habits.length} active {habits.length === 1 ? 'habit' : 'habits'}
          </p>
        </BentoCard>
      </Link>

      {/* Weather */}
      <Link href="/weather" className="block">
        <BentoCard variant="gradient" size="md" interactive className="h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/30 to-blue-500/30 border border-sky-400/20 flex items-center justify-center">
              <WeatherIcon className="w-4 h-4 text-sky-300" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-300 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground/90">
              {weather ? `${weather.temp}°` : '--°'}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-1">
            {weather ? weather.city : 'Weather'}
          </p>
        </BentoCard>
      </Link>

      {/* Focus time */}
      <Link href="/pomodoro" className="block">
        <BentoCard variant="gradient" size="md" interactive className="h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-red-400/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-red-300" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-300 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-foreground/90">{totalFocusTime}<span className="text-sm text-muted-foreground/60 ml-1">m</span></div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-1">
            Focus Time
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1.5">
            {sessionsCompleted} session{sessionsCompleted === 1 ? '' : 's'}
          </p>
        </BentoCard>
      </Link>

      {/* Quote */}
      {quote && (
        <Link href="/quotes" className="block col-span-2">
          <BentoCard variant="aurora" size="md" interactive className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <QuoteIcon className="w-4 h-4 text-pink-300" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
                Daily Quote
              </span>
            </div>
            <p className="text-sm sm:text-base text-foreground/90 font-medium leading-relaxed text-balance text-pretty">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground/60 mt-3">
              — {quote.author}
            </p>
          </BentoCard>
        </Link>
      )}
    </div>
  );
}

function ClientTime() {
  const [time, setTime] = useState<string>('');
  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums">{time}</span>;
}
