'use client';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Newspaper, CheckCircle2, TrendingUp,
  Activity, ArrowRight, Brain, Target, Zap,
  BarChart3, PieChart, ListTodo, LineChart as LineChartIcon,
  Timer, Sun, Moon, Cloud, Star, Clock as ClockIcon,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNewsStore, useTodoStore, useHabitStore, usePomodoroStore } from '@/store';
import { LiveClock } from '@/components/ui/live-clock';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDayName(dateStr: string): string {
  try {
    return WEEKDAYS[new Date(dateStr).getDay()];
  } catch {
    return 'Unknown';
  }
}

function getGreeting(t: Record<string, unknown>): { text: string; icon: React.ElementType } {
  const hour = new Date().getHours();
  const db = t.dashboard as Record<string, Record<string, string>>;
  if (hour < 12) return { text: db.greeting.morning, icon: Sun };
  if (hour < 18) return { text: db.greeting.afternoon, icon: Cloud };
  return { text: db.greeting.evening, icon: Moon };
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number | string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-xl border border-white/10">
      <p className="text-xs text-white/60 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold text-white" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const articles = useNewsStore((s) => s.articles);
  const todos = useTodoStore((s) => s.todos);
  const habits = useHabitStore((s) => s.habits);
  const { totalFocusTime, sessionsCompleted } = usePomodoroStore();

  const greeting = getGreeting(t);
  const GreetingIcon = greeting.icon;

  const quickActions = [
    { label: t.dashboard.browseNews, href: '/news', icon: Newspaper, color: 'from-blue-500 to-cyan-500' },
    { label: t.dashboard.manageTasks, href: '/todo', icon: ListTodo, color: 'from-emerald-500 to-teal-500' },
    { label: t.dashboard.trackHabits, href: '/habits', icon: Activity, color: 'from-violet-500 to-purple-500' },
    { label: t.dashboard.focusTimer, href: '/pomodoro', icon: Timer, color: 'from-rose-500 to-pink-500' },
  ];

  useEffect(() => {
    // 5 minute auto-refresh
    const interval = setInterval(() => {
      router.refresh();
    }, 300000);
    return () => clearInterval(interval);
  }, [router]);

  const stats = useMemo(() => [
    { label: t.dashboard.articlesAnalyzed, value: articles.length, icon: Newspaper, color: 'from-blue-500 to-cyan-500' },
    { label: t.dashboard.tasksCompleted, value: todos.filter((t) => t.completed).length, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
    { label: t.dashboard.habitsTracked, value: habits.length, icon: Activity, color: 'from-violet-500 to-purple-500' },
    { label: t.dashboard.focusHours, value: Math.round(totalFocusTime / 60 * 10) / 10, icon: Timer, color: 'from-rose-500 to-pink-500' },
  ], [articles.length, todos, habits.length, totalFocusTime, t]);

  const newsActivityData = useMemo(() => {
    const dayCounts = WEEKDAYS.map(() => 0);
    articles.forEach((a) => {
      const dayIndex = WEEKDAYS.indexOf(getDayName(a.publishedAt));
      if (dayIndex >= 0) dayCounts[dayIndex]++;
    });
    return WEEKDAYS.map((day, i) => ({ day, articles: dayCounts[i] }));
  }, [articles]);

  const taskCompletionData = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    const pending = todos.filter((t) => !t.completed).length;
    return [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#6b7280' },
    ];
  }, [todos]);

  const habitsOverviewData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const done = habits.filter((h) => h.logs.includes(today)).length;
    const missed = habits.filter((h) => !h.logs.includes(today)).length;
    return [
      { name: 'Done Today', value: done || 1, color: '#8b5cf6' },
      { name: 'Missed Today', value: missed || 1, color: '#374151' },
    ];
  }, [habits]);

  const recentArticles = useMemo(() => articles.slice(0, 5), [articles]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <GreetingIcon className="w-6 h-6 text-amber-400" />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {greeting.text}, {t.dashboard.explorer}
              </span>
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              {t.dashboard.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 py-1.5">
            <ClockIcon className="w-3.5 h-3.5 text-blue-400" />
            <LiveClock />
          </Badge>
          <Badge variant="secondary" className="gap-1.5 py-1.5">
            <Brain className="w-3.5 h-3.5" />
            {articles.length} {t.dashboard.insights}
          </Badge>
          <Badge variant="secondary" className="gap-1.5 py-1.5">
            <Star className="w-3.5 h-3.5" />
            {todos.filter((t) => t.completed).length}/{todos.length} {t.dashboard.done}
          </Badge>
        </div>
      </motion.div>

      {/* Stats Cards Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' as const }}
          >
            <Card className="card-glass hover:neon-glow transition-all duration-300 group cursor-default">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn(
                    'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300',
                    stat.color
                  )}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* News Activity Line Chart */}
        <Card className="card-glass col-span-1 lg:col-span-2 xl:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <LineChartIcon className="w-4 h-4 text-blue-400" />
                  News Activity
                </CardTitle>
                <CardDescription>Articles analyzed per day this week</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1 text-emerald-400" />
                {newsActivityData.reduce((a, b) => a + b.articles, 0)} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height={256}>
                <LineChart data={newsActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="articles"
                    stroke="url(#lineGrad)"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Completion Bar Chart */}
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Task Overview
                </CardTitle>
                <CardDescription>Completed vs pending tasks</CardDescription>
              </div>
              <Badge variant={todos.filter((t) => t.completed).length === todos.length && todos.length > 0 ? 'success' : 'warning'} className="text-xs">
                {todos.filter((t) => t.completed).length}/{todos.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={taskCompletionData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {taskCompletionData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Habits Donut Chart */}
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-violet-400" />
                  Habits Today
                </CardTitle>
                <CardDescription>Today&apos;s habit completion</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {habits.filter((h) => h.logs.includes(new Date().toISOString().split('T')[0])).length}/{habits.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height={256}>
                <RePieChart>
                  <Pie
                    data={habitsOverviewData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {habitsOverviewData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row: Recent Articles + Quick Actions + Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent News Feed */}
        <Card className="card-glass col-span-1 xl:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-cyan-400" />
{t.dashboard.recentArticles}
                </CardTitle>
                <CardDescription>{t.dashboard.latestFeed}</CardDescription>
              </div>
              <Link
                href="/news"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/40">
                <Newspaper className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm">No articles yet. Start exploring!</p>
                <Link
                  href="/news"
                  className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  Browse news <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {recentArticles.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      <Link
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Newspaper className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
                            {article.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {article.category}
                            </Badge>
                            <span className="text-[10px] text-white/40">
                              {article.source}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors shrink-0 mt-1" />
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions + Today's Overview */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="card-glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-amber-400" />
{t.dashboard.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Link key={action.href} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer group'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform',
                        action.color
                      )}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                        {action.label}
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Overview */}
          <Card className="card-glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Target className="w-4 h-4 text-emerald-400" />
                {t.dashboard.todaysOverview}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Newspaper className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-xs text-white/70">{t.dashboard.newArticles}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{articles.length}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-xs text-white/70">{t.dashboard.tasksDone}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{todos.filter((t) => t.completed).length}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <span className="text-xs text-white/70">{t.dashboard.activeHabits}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{habits.length}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
                      <Timer className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <span className="text-xs text-white/70">{t.dashboard.sessionsDone}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{sessionsCompleted}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
