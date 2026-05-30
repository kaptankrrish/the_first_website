'use client';

import { useState, useMemo } from 'react';
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
import { Check, Plus, Trash2, Flame, Target, CalendarDays, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{t.nav.habits}</h1>
            <p className="text-white/60 mt-1">{t.habits.subtitle}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t.habits.addHabit}
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Description</label>
                  <Input
                    placeholder="Optional description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Frequency</label>
                  <Select.Root value={frequency} onValueChange={(v) => setFrequency(v as 'daily' | 'weekly')}>
                    <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/30">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="z-50 rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl text-white shadow-lg">
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
                          'w-8 h-8 rounded-full transition-all border-2',
                          color === c ? 'border-white scale-110' : 'border-transparent'
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <DialogClose asChild>
                    <Button variant="outline">{t.common.cancel}</Button>
                  </DialogClose>
                  <Button onClick={handleAdd}>{t.common.create}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  This Week
                </CardTitle>
                <CardDescription>Check off today&apos;s habits</CardDescription>
              </CardHeader>
              <CardContent>
                {habits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-white/40">
                    <Target className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium">{t.habits.noHabits}</p>
                    <p className="text-xs mt-1">Create your first habit to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {habits.map((habit) => (
                        <motion.div
                          key={habit.id}
                          layout
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="flex items-center gap-3 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-all group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: habit.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{habit.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex items-center gap-1 text-xs text-white/40">
                                  <Flame className="w-3 h-3" />
                                  {t.habits.streak}: {habit.streak} {t.habits.days}
                                </span>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 capitalize">
                                  {habit.frequency === 'daily' ? t.habits.daily : t.habits.weekly}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {weekDays.map((date) => {
                              const done = habit.logs.includes(date);
                              const isToday = date === today;
                              return (
                                <button
                                  key={date}
                                  onClick={() => toggleHabit(habit.id, date)}
                                  className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all',
                                    done
                                      ? 'text-white'
                                      : 'text-white/30 border border-white/10 hover:border-white/30',
                                    isToday && 'ring-1 ring-white/30',
                                    done && !isToday && 'opacity-80'
                                  )}
                                  style={{
                                    backgroundColor: done ? habit.color : 'transparent',
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
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Monthly Heatmap
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="text-[10px] text-white/30 text-center py-1">
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
                          'aspect-square rounded-md flex items-center justify-center text-[10px] font-medium transition-all',
                          isToday && 'ring-1 ring-white/40',
                          intensity > 0
                            ? `text-white`
                            : 'text-white/20 bg-white/5'
                        )}
                        style={{
                          backgroundColor: intensity > 0 ? `rgba(59, 130, 246, ${0.2 + intensity * 0.6})` : undefined,
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Statistics
                </CardTitle>
                <CardDescription>Your habit tracking stats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/60">Longest Streak</span>
                    <span className="text-lg font-bold text-white">{stats.longestStreak} days</span>
                  </div>
                  <Progress value={Math.min(stats.longestStreak * 10, 100)} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/60">Active Habits</span>
                    <span className="text-lg font-bold text-white">{stats.total}</span>
                  </div>
                  <Progress value={Math.min(stats.total * 20, 100)} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/60">Completion Rate</span>
                    <span className="text-lg font-bold text-white">{Math.round(stats.avgCompletion)}%</span>
                  </div>
                  <Progress value={stats.avgCompletion} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {habits.slice(0, 5).map((habit) => {
                    const weekHits = weekDays.filter((d) => habit.logs.includes(d)).length;
                    return (
                      <div key={habit.id} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="text-xs text-white/60 flex-1 truncate">{habit.name}</span>
                        <span className="text-xs text-white/40">{weekHits}/{weekDays.length}</span>
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
    </div>
  );
}
