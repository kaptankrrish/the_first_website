'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Clock, BookOpen, CheckSquare,
  Newspaper, Cloud, DollarSign, Film, Timer, PenTool,
  Sparkles, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { BentoCard } from '@/components/ui/bento-card';
import { Badge } from '@/components/ui/badge';
import { useTodoStore, useHabitStore, useNoteStore, usePomodoroStore, useNewsStore, useRecentlyUsedStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { todos } = useTodoStore();
  const { habits } = useHabitStore();
  const { notes } = useNoteStore();
  const { sessionsCompleted, totalFocusTime } = usePomodoroStore();
  const { articles } = useNewsStore();
  const { items: recentItems } = useRecentlyUsedStore();

  const stats = useMemo(() => {
    const completedTodos = todos.filter(t => t.completed).length;
    const totalTodos = todos.length;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    const totalHabitLogs = habits.reduce((sum, h) => sum + h.logs.length, 0);
    const avgStreak = habits.length > 0
      ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
      : 0;

    const highPriorityTodos = todos.filter(t => t.priority === 'high').length;
    const mediumPriorityTodos = todos.filter(t => t.priority === 'medium').length;
    const lowPriorityTodos = todos.filter(t => t.priority === 'low').length;

    const thisWeekTodos = todos.filter(t => {
      const created = new Date(t.createdAt || Date.now());
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return created >= weekAgo;
    }).length;

    return {
      completedTodos,
      totalTodos,
      completionRate,
      totalHabitLogs,
      avgStreak,
      highPriorityTodos,
      mediumPriorityTodos,
      lowPriorityTodos,
      thisWeekTodos,
    };
  }, [todos, habits]);

  const weeklyActivity = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    return days.map((day, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const habitLogs = habits.filter(h => h.logs.includes(dateStr)).length;
      const todoCompletions = todos.filter(t => {
        if (!t.completed) return false;
        const completed = new Date(t.createdAt || Date.now());
        return completed.toISOString().split('T')[0] === dateStr;
      }).length;
      return {
        day,
        habits: habitLogs,
        todos: todoCompletions,
        total: habitLogs + todoCompletions,
      };
    });
  }, [habits, todos]);

  const maxActivity = Math.max(...weeklyActivity.map(d => d.total), 1);

  const featureUsage = useMemo(() => [
    { name: 'News', icon: Newspaper, count: articles.length, color: 'text-blue-300' },
    { name: 'Notes', icon: PenTool, count: notes.length, color: 'text-amber-300' },
    { name: 'Pomodoro', icon: Timer, count: sessionsCompleted, color: 'text-emerald-300' },
    { name: 'Weather', icon: Cloud, count: 12, color: 'text-cyan-300' },
    { name: 'Crypto', icon: DollarSign, count: 8, color: 'text-purple-300' },
    { name: 'Movies', icon: Film, count: 5, color: 'text-pink-300' },
  ], [articles.length, notes.length, sessionsCompleted]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={t.nav.analytics || 'Analytics'}
        description="Track your productivity, learning progress, and usage insights"
        icon={BarChart3}
        badge="Personal"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.div variants={itemVariants}>
            <BentoCard variant="glow" size="md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-white/5">
                  <CheckSquare className="w-4 h-4 text-blue-300" />
                </div>
                <Badge variant="outline" className="text-[9px] bg-emerald-500/12 text-emerald-300 border-emerald-400/25 gap-1">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  +12%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">{stats.totalTodos}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mt-1">Total Tasks</div>
            </BentoCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <BentoCard variant="glow" size="md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-white/5">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                </div>
                <Badge variant="outline" className="text-[9px] bg-emerald-500/12 text-emerald-300 border-emerald-400/25 gap-1">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  {stats.completionRate}%
                </Badge>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">{stats.completionRate}%</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mt-1">Completion Rate</div>
            </BentoCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <BentoCard variant="glow" size="md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-white/5">
                  <Timer className="w-4 h-4 text-amber-300" />
                </div>
                <Badge variant="outline" className="text-[9px] bg-blue-500/12 text-blue-300 border-blue-400/25 gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Focus
                </Badge>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">{totalFocusTime}m</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mt-1">Focus Time</div>
            </BentoCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <BentoCard variant="glow" size="md">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-500/15 border border-white/5">
                  <BookOpen className="w-4 h-4 text-purple-300" />
                </div>
                <Badge variant="outline" className="text-[9px] bg-purple-500/12 text-purple-300 border-purple-400/25 gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Active
                </Badge>
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">{stats.avgStreak}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 mt-1">Avg Streak</div>
            </BentoCard>
          </motion.div>
        </div>

        {/* Weekly Activity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-foreground/90 flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4 text-blue-300" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-48">
                {weeklyActivity.map((day, i) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-0.5 items-center justify-end h-40">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.todos / maxActivity) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 opacity-80"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.habits / maxActivity) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}
                        className="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-purple-500 to-purple-400 opacity-80"
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 font-medium">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-blue-500" />
                  <span className="text-[10px] text-muted-foreground/60">Tasks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-purple-500" />
                  <span className="text-[10px] text-muted-foreground/60">Habits</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Usage & Task Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden h-full">
              <CardHeader>
                <CardTitle className="text-foreground/90 flex items-center gap-2 text-base">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  Feature Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {featureUsage.map((feature) => {
                  const Icon = feature.icon;
                  const maxCount = Math.max(...featureUsage.map(f => f.count), 1);
                  return (
                    <div key={feature.name} className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${feature.color} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground/80">{feature.name}</span>
                          <span className="text-[10px] text-muted-foreground/60">{feature.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(feature.count / maxCount) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden h-full">
              <CardHeader>
                <CardTitle className="text-foreground/90 flex items-center gap-2 text-base">
                  <CheckSquare className="w-4 h-4 text-emerald-300" />
                  Task Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { label: 'High', count: stats.highPriorityTodos, color: 'from-red-500 to-orange-500', textColor: 'text-red-300' },
                    { label: 'Medium', count: stats.mediumPriorityTodos, color: 'from-amber-500 to-yellow-500', textColor: 'text-amber-300' },
                    { label: 'Low', count: stats.lowPriorityTodos, color: 'from-emerald-500 to-teal-500', textColor: 'text-emerald-300' },
                  ].map((priority) => (
                    <div key={priority.label} className="flex items-center gap-3">
                      <span className={`text-xs font-medium ${priority.textColor} w-12`}>{priority.label}</span>
                      <div className="flex-1 h-8 rounded-lg bg-white/[0.03] border border-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.totalTodos > 0 ? (priority.count / stats.totalTodos) * 100 : 0}%` }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className={`h-full rounded-lg bg-gradient-to-r ${priority.color} opacity-60 flex items-center justify-end pr-2`}
                        >
                          {priority.count > 0 && (
                            <span className="text-[10px] font-bold text-white">{priority.count}</span>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-lg font-bold text-foreground">{stats.completedTodos}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Completed</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-lg font-bold text-foreground">{stats.totalTodos - stats.completedTodos}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Remaining</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-foreground/90 flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-cyan-300" />
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Pomodoro Sessions', value: sessionsCompleted, icon: Timer, color: 'text-emerald-300' },
                  { label: 'Total Notes', value: notes.length, icon: PenTool, color: 'text-amber-300' },
                  { label: 'Habit Logs', value: stats.totalHabitLogs, icon: BookOpen, color: 'text-purple-300' },
                  { label: 'Pages Visited', value: recentItems.length, icon: Newspaper, color: 'text-blue-300' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <Icon className={`w-4 h-4 ${stat.color} mx-auto mb-2`} />
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-1">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
