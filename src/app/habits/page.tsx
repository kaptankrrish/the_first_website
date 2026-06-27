'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '@/store';
import { generateId } from '@/utils';
import { cn } from '@/utils/cn';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import * as Select from '@radix-ui/react-select';
import { Check, Plus, Trash2, Flame, Target, CalendarDays, ChevronDown as ChevronDownIcon, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageWrapper } from '@/components/layout/page-wrapper';
import type { Habit } from '@/types';

interface HabitItemProps {
  habit: Habit;
  weekDays: string[];
  today: string;
  toggleHabit: (id: string, date: string) => void;
  removeHabit: (id: string) => void;
  t: ReturnType<typeof useLanguage>['t'];
}

const HABIT_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
];

const FREQUENCIES = ['daily', 'weekly'] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -20, scale: 0.95 },
};

const HabitItem = memo(function HabitItem({ habit, weekDays, today, toggleHabit, removeHabit, t }: HabitItemProps) {
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center gap-3 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-all group bg-gradient-to-r from-transparent hover:from-white/5 to-transparent relative overflow-hidden card-shine"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 z-10">
        <div
          className="w-3 h-3 rounded-full shrink-0 shadow-lg"
          style={{ backgroundColor: habit.color, boxShadow: `0 0 12px ${habit.color}80` }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{habit.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn("flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md", habit.streak > 0 ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_8px_rgba(249,115,22,0.3)]" : "text-white/40")}>
              <Flame className="w-3 h-3" />
              {t.habits.streak}: {habit.streak} {t.habits.days}
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 capitalize glass-1 border-white/10">
              {habit.frequency === 'daily' ? t.habits.daily : t.habits.weekly}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 z-10">
        {weekDays.map((date: string) => {
          const done = habit.logs.includes(date);
          const isToday = date === today;
          return (
            <button
              key={date}
              onClick={() => toggleHabit(habit.id, date)}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all hover:scale-105 active:scale-95',
                done
                  ? 'text-white shadow-lg'
                  : 'text-white/30 border border-white/10 hover:border-white/30 bg-black/20',
                isToday && !done && 'ring-1 ring-white/30',
                done && !isToday && 'opacity-80'
              )}
              style={{
                backgroundColor: done ? habit.color : undefined,
                boxShadow: done ? `0 4px 12px ${habit.color}40` : undefined,
              }}
              title={new Date(date).toLocaleDateString('en', { weekday: 'short' })}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : new Date(date).getDate()}
            </button>
          );
        })}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 ml-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-opacity"
          onClick={() => removeHabit(habit.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
});

export default function HabitsPage() {
  const { t } = useLanguage();
  const { habits, addHabit, toggleHabit, removeHabit } = useHabitStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const weekDays = useMemo(() => {
    const days = [];
    const todayDate = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  const calendarDays = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (string | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  const stats = useMemo(() => {
    if (habits.length === 0) return { longestStreak: 0, avgCompletion: 0, total: 0 };
    const longest = Math.max(...habits.map((h) => h.streak));
    const totalLogs = habits.reduce((sum, h) => sum + h.logs.length, 0);
    const avgRate = habits.length > 0 ? totalLogs / habits.length : 0;
    return { longestStreak: longest, avgCompletion: Math.min(avgRate / 30, 1) * 100, total: habits.length };
  }, [habits]);

  const handleAdd = () => {
    if (!name.trim()) return;
    addHabit({
      id: generateId(),
      name: name.trim(),
      description: description.trim(),
      frequency,
      streak: 0,
      logs: [],
      createdAt: new Date().toISOString(),
      color,
    });
    setName('');
    setDescription('');
    setColor(HABIT_COLORS[0]);
    setDialogOpen(false);
  };

  return (
    <PageWrapper
      icon={Activity}
      title={t.nav.habits}
      subtitle={t.habits.subtitle}
      badgeText="Track Daily"
      colorScheme="indigo"
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <Plus className="w-4 h-4" />
              {t.habits.addHabit}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-3 border-white/10">
            <DialogHeader>
              <DialogTitle>{t.habits.addHabit}</DialogTitle>
              <DialogDescription>Define a habit you want to track</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Name</label>
                <Input
                  placeholder="e.g. Morning meditation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/20 border-white/10 focus-visible:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Description</label>
                <Input
                  placeholder="Optional description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-black/20 border-white/10 focus-visible:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Frequency</label>
                <Select.Root value={frequency} onValueChange={(v) => setFrequency(v as 'daily' | 'weekly')}>
                  <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="z-50 rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl text-white shadow-xl">
                      <Select.Viewport className="p-1">
                        {FREQUENCIES.map((f) => (
                          <Select.Item
                            key={f}
                            value={f}
                            className="relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none capitalize focus:bg-white/10 focus:text-white"
                          >
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                              <Select.ItemIndicator>
                                <Check className="h-4 w-4" />
                              </Select.ItemIndicator>
                            </span>
                            <Select.ItemText>{f === 'daily' ? t.habits.daily : t.habits.weekly}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {HABIT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all border-2 hover:scale-110',
                        color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      )}
                      style={{ backgroundColor: c, boxShadow: color === c ? `0 0 16px ${c}80` : undefined }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                  <Button variant="outline" className="border-white/10 hover:bg-white/5">{t.common.cancel}</Button>
                </DialogClose>
                <Button onClick={handleAdd} className="bg-indigo-500 hover:bg-indigo-600 text-white">{t.common.create}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="card-premium overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-100">
                  <Target className="w-4 h-4 text-indigo-400" />
                  This Week
                </CardTitle>
                <CardDescription>Check off today&apos;s habits</CardDescription>
              </CardHeader>
              <CardContent>
                {habits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-white/40">
                    <Target className="w-12 h-12 mb-3 opacity-30 text-indigo-300" />
                    <p className="text-sm font-medium">{t.habits.noHabits}</p>
                    <p className="text-xs mt-1 text-white/30">Create your first habit to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {habits.map((habit) => (
                        <HabitItem 
                          key={habit.id} 
                          habit={habit} 
                          weekDays={weekDays} 
                          today={today} 
                          toggleHabit={toggleHabit} 
                          removeHabit={removeHabit} 
                          t={t} 
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-100">
                  <CalendarDays className="w-4 h-4 text-indigo-400" />
                  Monthly Heatmap
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1.5">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="text-[10px] text-white/30 text-center py-1 font-medium">
                      {d}
                    </div>
                  ))}
                  {calendarDays.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} />;
                    const dayHabits = habits.filter((h) => h.logs.includes(date));
                    const intensity = habits.length > 0 ? dayHabits.length / habits.length : 0;
                    const isToday = date === today;
                    return (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.005 }}
                        className={cn(
                          'aspect-square rounded-md flex items-center justify-center text-[10px] font-medium transition-all hover:scale-110 cursor-default hover:z-10',
                          isToday && 'ring-2 ring-indigo-400/50 shadow-[0_0_12px_rgba(129,140,248,0.5)]',
                          intensity > 0
                            ? 'text-white shadow-sm'
                            : 'text-white/20 bg-black/20 hover:bg-white/10'
                        )}
                        style={{
                          backgroundColor: intensity > 0 ? `rgba(99, 102, 241, ${0.2 + intensity * 0.8})` : undefined,
                          boxShadow: intensity > 0 ? `0 0 ${8 * intensity}px rgba(99, 102, 241, ${intensity})` : undefined,
                        }}
                        title={`${date}: ${dayHabits.length}/${habits.length} habits`}
                      >
                        {new Date(date).getDate()}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className="card-premium shimmer-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-100">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Statistics
                </CardTitle>
                <CardDescription>Your habit tracking stats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Longest Streak</span>
                    <span className="text-lg font-bold text-white flex items-center gap-1">
                      {stats.longestStreak} <span className="text-sm font-normal text-white/40">days</span>
                    </span>
                  </div>
                  <Progress value={Math.min(stats.longestStreak * 10, 100)} className="h-2 bg-black/40" />
                </div>
                <div className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Active Habits</span>
                    <span className="text-lg font-bold text-white">{stats.total}</span>
                  </div>
                  <Progress value={Math.min(stats.total * 20, 100)} className="h-2 bg-black/40" />
                </div>
                <div className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Completion Rate</span>
                    <span className="text-lg font-bold text-white">{Math.round(stats.avgCompletion)}%</span>
                  </div>
                  <Progress value={stats.avgCompletion} className="h-2 bg-black/40" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-100">
                  <Target className="w-4 h-4 text-indigo-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habits.slice(0, 5).map((habit) => {
                    const weekHits = weekDays.filter((d) => habit.logs.includes(d)).length;
                    return (
                      <div key={habit.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: habit.color, boxShadow: `0 0 8px ${habit.color}80` }}
                        />
                        <span className="text-sm text-white/80 flex-1 truncate">{habit.name}</span>
                        <span className="text-xs font-medium text-white/50 bg-black/20 px-2 py-1 rounded-md">{weekHits}/{weekDays.length}</span>
                      </div>
                    );
                  })}
                  {habits.length === 0 && (
                    <p className="text-xs text-white/30 text-center py-4">
                      No habits to display
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
