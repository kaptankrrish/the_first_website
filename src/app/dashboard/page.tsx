'use client';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper, CheckCircle2, TrendingUp,
  Activity, ArrowRight, Brain, Target, Zap,
  BarChart3, PieChart, ListTodo, LineChart as LineChartIcon,
  Timer, Sun, Moon, Cloud, Star, LayoutDashboard
} from 'lucide-react';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(m => m.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(m => m.Line), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const RePieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNewsStore, useTodoStore, useHabitStore, usePomodoroStore } from '@/store';
import { LiveClock } from '@/components/ui/live-clock';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageWrapper } from '@/components/layout/page-wrapper';

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
    <div className="glass rounded-xl px-4 py-3 shadow-xl border border-white/10 backdrop-blur-md bg-black/40">
      <p className="text-xs text-white/60 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold text-white" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  shadow: string;
}

function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' as const }}
        >
          <Card className="relative overflow-hidden group cursor-default border-white/5 bg-white/[0.02] backdrop-blur-md">
            {/* Shimmer Border */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            
            <CardContent className="p-5 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                  </p>
                </div>
                <div className={cn(
                  'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg',
                  stat.color,
                  stat.shadow
                )}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

function NewsChart({ data, total }: { data: { day: string; articles: number }[], total: number }) {
  return (
    <Card className="relative overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-md col-span-1 lg:col-span-2 xl:col-span-1 group">
      {/* Aurora Background */}
      <div className="absolute -inset-1/2 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-blue-400" />
              News Activity
            </CardTitle>
            <CardDescription className="text-white/40">Articles analyzed per day</CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-300 bg-blue-500/10">
            <TrendingUp className="w-3 h-3 mr-1" />
            {total} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="h-56">
          <ResponsiveContainer width="100%" height={256}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <motion.g
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <Line
                  type="monotone"
                  dataKey="articles"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                />
              </motion.g>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskChart({ data, completed, total }: { data: ChartDataItem[], completed: number, total: number }) {
  return (
    <Card className="relative overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-md group">
      {/* Aurora Background */}
      <div className="absolute -inset-1/2 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Task Overview
            </CardTitle>
            <CardDescription className="text-white/40">Completed vs pending</CardDescription>
          </div>
          <Badge variant="outline" className={cn("text-[10px]", completed === total && total > 0 ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10" : "border-amber-500/30 text-amber-300 bg-amber-500/10")}>
            {completed}/{total}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="h-56">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={data} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function HabitsChart({ data, completed, total }: { data: ChartDataItem[], completed: number, total: number }) {
  return (
    <Card className="relative overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-md group">
      {/* Aurora Background */}
      <div className="absolute -inset-1/2 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-violet-400" />
              Habits Today
            </CardTitle>
            <CardDescription className="text-white/40">Daily completion</CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-300 bg-violet-500/10">
            {completed}/{total}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center relative z-10">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height={256}>
            <RePieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
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
    { label: t.dashboard.browseNews, href: '/news', icon: Newspaper, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { label: t.dashboard.manageTasks, href: '/todo', icon: ListTodo, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { label: t.dashboard.trackHabits, href: '/habits', icon: Activity, color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/20' },
    { label: t.dashboard.focusTimer, href: '/pomodoro', icon: Timer, color: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-500/20' },
  ];

  useEffect(() => {
    // 5 minute auto-refresh
    const interval = setInterval(() => {
      router.refresh();
    }, 300000);
    return () => clearInterval(interval);
  }, [router]);

  const stats = useMemo(() => [
    { label: t.dashboard.articlesAnalyzed, value: articles.length, icon: Newspaper, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { label: t.dashboard.tasksCompleted, value: todos.filter((t) => t.completed).length, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { label: t.dashboard.habitsTracked, value: habits.length, icon: Activity, color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/20' },
    { label: t.dashboard.focusHours, value: Math.round(totalFocusTime / 60 * 10) / 10, icon: Timer, color: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-500/20' },
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
      { name: 'Pending', value: pending, color: '#3f3f46' },
    ];
  }, [todos]);

  const habitsOverviewData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const done = habits.filter((h) => h.logs.includes(today)).length;
    const missed = habits.filter((h) => !h.logs.includes(today)).length;
    return [
      { name: 'Done Today', value: done || 0.1, color: '#8b5cf6' },
      { name: 'Missed Today', value: missed || 0.1, color: '#3f3f46' },
    ];
  }, [habits]);

  const recentArticles = useMemo(() => articles.slice(0, 5), [articles]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const headerActions = (
    <div className="flex items-center gap-2 flex-wrap shrink-0">
      <Badge variant="outline" className="gap-1.5 py-1.5 border-white/10 bg-white/5 backdrop-blur-md">
        <Brain className="w-3.5 h-3.5 text-blue-400" />
        {articles.length} {t.dashboard.insights}
      </Badge>
      <Badge variant="outline" className="gap-1.5 py-1.5 border-white/10 bg-white/5 backdrop-blur-md">
        <Star className="w-3.5 h-3.5 text-amber-400" />
        {todos.filter((t) => t.completed).length}/{todos.length} {t.dashboard.done}
      </Badge>
      <Badge variant="outline" className="gap-1.5 py-1.5 border-white/10 bg-white/5 backdrop-blur-md text-white/80">
        <LiveClock />
      </Badge>
    </div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto"
    >
      <PageWrapper
        icon={LayoutDashboard}
        title={`${greeting.text}, ${t.dashboard.explorer}`}
        subtitle={t.dashboard.subtitle}
        badgeText={<span className="flex items-center gap-1"><GreetingIcon className="w-3 h-3" /> Dashboard</span>}
        colorScheme="blue"
        actions={headerActions}
      />

      <StatsGrid stats={stats} />

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <NewsChart data={newsActivityData} total={newsActivityData.reduce((a, b) => a + b.articles, 0)} />
        <TaskChart data={taskCompletionData} completed={todos.filter((t) => t.completed).length} total={todos.length} />
        <HabitsChart 
          data={habitsOverviewData} 
          completed={habits.filter((h) => h.logs.includes(new Date().toISOString().split('T')[0])).length} 
          total={habits.length} 
        />
      </motion.div>

      {/* Bottom Row: Recent Articles + Quick Actions + Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent News Feed */}
        <Card className="relative overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-md col-span-1 xl:col-span-2 group hover:border-blue-500/20 transition-colors">
          <CardHeader className="pb-3 border-b border-white/5 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-cyan-400" />
                  {t.dashboard.recentArticles}
                </CardTitle>
                <CardDescription className="text-white/40">{t.dashboard.latestFeed}</CardDescription>
              </div>
              <Link
                href="/news"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-full hover:bg-blue-500/20"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative z-10">
            {recentArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/30">
                <Newspaper className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-sm">No articles yet. Start exploring!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
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
                        className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group/item"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:shadow-lg transition-all border border-blue-500/20">
                          <Newspaper className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white/80 truncate group-hover/item:text-white transition-colors">
                            {article.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-white/10 bg-white/5">
                              {article.category}
                            </Badge>
                            <span className="text-[10px] text-white/30">
                              {article.source}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover/item:text-cyan-400 transition-colors shrink-0 translate-x-0 group-hover/item:translate-x-1" />
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
          <Card className="relative overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-amber-400" />
                {t.dashboard.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Link key={action.href} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg',
                        action.color,
                        action.shadow
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

          <Card className="relative overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Target className="w-4 h-4 text-emerald-400" />
                {t.dashboard.todaysOverview}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                      <Newspaper className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-white/70">{t.dashboard.newArticles}</span>
                  </div>
                  <span className="text-sm font-bold text-white bg-blue-500/10 px-2 py-1 rounded-md">{articles.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium text-white/70">{t.dashboard.tasksDone}</span>
                  </div>
                  <span className="text-sm font-bold text-white bg-emerald-500/10 px-2 py-1 rounded-md">{todos.filter((t) => t.completed).length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center border border-violet-500/20">
                      <Activity className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-xs font-medium text-white/70">{t.dashboard.activeHabits}</span>
                  </div>
                  <span className="text-sm font-bold text-white bg-violet-500/10 px-2 py-1 rounded-md">{habits.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
