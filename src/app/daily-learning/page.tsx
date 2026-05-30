'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/navigation';
import { fetchChemistryData, type Compound } from '@/services/chemistry';
import { fetchMathFacts, type MathFact } from '@/services/maths';
import { getDailyQuote } from '@/services/quotes';
import { fetchWordOfTheDay } from '@/services/dictionary';
import {
  Sparkles,
  BookOpen,
  Calculator,
  Brain,
  Flame,
  Quote,
  ArrowRight,
  Zap,
  Target,
  Star,
  Sun,
  BarChart3,
  Trophy,
  Atom,
  Infinity,
  Clock as ClockIcon,
} from 'lucide-react';
import Link from 'next/link';
import { LiveClock } from '@/components/ui/live-clock';
import { useLanguage } from '@/contexts/LanguageContext';

interface DailyChallenge {
  type: 'chem' | 'math';
  title: string;
  description: string;
  content: string;
}

// Removed static data

const quickLinks = [
  { title: 'Chemistry', href: '/chemistry', icon: Atom, gradient: 'from-blue-500/20 to-cyan-500/10', color: 'text-blue-400' },
  { title: 'Mathematics', href: '/maths', icon: Calculator, gradient: 'from-indigo-500/20 to-rose-500/10', color: 'text-indigo-400' },
  { title: 'Vedic Learning', href: '/vedic-learning', icon: BookOpen, gradient: 'from-amber-500/20 to-orange-500/10', color: 'text-amber-400' },
];

function getDailySeed(): number {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function DailyLearningPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastActive, setLastActive] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState(0);
  const [quizzesPassed, setQuizzesPassed] = useState(0);
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const [dailyWord, setDailyWord] = useState({ word: t.common.loading, definition: '...' });
  const [dailyQuote, setDailyQuote] = useState({ text: t.common.loading, author: '...' });
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [isChemistry, setIsChemistry] = useState(true);

  const today = new Date().toDateString();

  useEffect(() => {
    // 5 minute auto-refresh
    const interval = setInterval(() => {
      router.refresh();
    }, 300000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
      const savedStreak = localStorage.getItem('daily-streak');
      const savedLastActive = localStorage.getItem('daily-last-active');
      const savedCompleted = localStorage.getItem('daily-completed-topics');
      const savedQuizzes = localStorage.getItem('daily-quizzes-passed');
      const savedTodos = localStorage.getItem('daily-todos');

      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedLastActive) setLastActive(savedLastActive);
      if (savedCompleted) setCompletedTopics(parseInt(savedCompleted));
      if (savedQuizzes) setQuizzesPassed(parseInt(savedQuizzes));
      if (savedTodos) setTodos(JSON.parse(savedTodos));
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastActive !== today) {
      Promise.resolve().then(() => {
        if (lastActive === yesterday) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem('daily-streak', String(newStreak));
        } else if (lastActive !== null) {
          setStreak(1);
          localStorage.setItem('daily-streak', '1');
        } else {
          setStreak(1);
          localStorage.setItem('daily-streak', '1');
        }
        setLastActive(today);
        localStorage.setItem('daily-last-active', today);
      });
    }
  }, [mounted, lastActive, today, streak]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('daily-completed-topics', String(completedTopics));
    }
  }, [completedTopics, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('daily-quizzes-passed', String(quizzesPassed));
    }
  }, [quizzesPassed, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('daily-todos', JSON.stringify(todos));
    }
  }, [todos, mounted]);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      const word = await fetchWordOfTheDay();
      setDailyWord(word);

      const dq = await getDailyQuote();
      if (dq) setDailyQuote(dq);

      const [chemData, mathData] = await Promise.all([
        fetchChemistryData(),
        fetchMathFacts()
      ]);
      
      const allTopics: DailyChallenge[] = [
        ...chemData.map((c: Compound) => ({ type: 'chem' as const, title: c.title, description: c.formula, content: c.description || 'Fascinating chemical compound.' })),
        ...mathData.map((m: MathFact) => ({ type: 'math' as const, title: `Number ${m.number}`, description: m.type, content: m.text }))
      ];
      
      if (allTopics.length > 0) {
        const seed = getDailySeed();
        const idx = Math.floor(seededRandom(seed) * allTopics.length);
        const challenge = allTopics[idx];
        setDailyChallenge(challenge);
        setIsChemistry(challenge.type === 'chem');
      }
    }
    loadData();
  }, [mounted]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos((prev) => [...prev, newTodo.trim()]);
      setNewTodo('');
    }
  };

  const handleRemoveTodo = (idx: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMarkComplete = () => {
    setCompletedTopics((prev) => prev + 1);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-white/10">
              <Sun className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient flex items-center gap-2">
              {t.nav.dailyLearning}
              <Badge variant="secondary" className="ml-2 gap-1.5 py-1 text-sm font-normal">
                <ClockIcon className="w-4 h-4 text-amber-400" />
                <LiveClock />
              </Badge>
            </h1>
          </div>
          <p className="text-white/50 text-sm sm:text-base ml-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity as unknown as number, ease: 'easeInOut' as const }}
          >
            <Badge variant="secondary" className="text-sm gap-1.5 px-3 py-1.5">
              <Flame className={cn('w-4 h-4', streak > 0 ? 'text-orange-400' : 'text-white/40')} />
              <span className={cn('font-bold', streak > 0 ? 'text-orange-300' : 'text-white/60')}>
                {streak} day{streak !== 1 ? 's' : ''}
              </span>
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' as const, stiffness: 80, damping: 15 }}
          >
            <Card className="relative overflow-hidden border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-gradient" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-pulse-glow" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="gap-1.5 text-xs">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    Daily Challenge
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {isChemistry ? 'Chemistry' : 'Mathematics'}
                  </Badge>
                </div>
                <CardTitle className="text-white flex items-center gap-2">
                  {isChemistry ? (
                    <Atom className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Infinity className="w-5 h-5 text-indigo-400" />
                  )}
                  {dailyChallenge?.title || t.common.loading}
                </CardTitle>
                <CardDescription className="text-white/50">
                  {dailyChallenge?.description || t.common.loading}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="prose prose-invert prose-sm max-w-none text-white/70">
                  <p>{dailyChallenge?.content?.split('\n').slice(0, 4).join('\n') || t.common.loading}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={isChemistry ? '/chemistry' : '/maths'}>
                    <Button variant="default" size="sm" className="gap-1.5">
                      Study Now <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleMarkComplete}>
                    <Target className="w-3.5 h-3.5 mr-1.5" />
                    Mark Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-white/5">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Quote className="w-4 h-4 text-amber-400" />
                  <CardTitle className="text-sm text-white/70 uppercase tracking-wider">
                    Motivation
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-2 border-amber-500/40 pl-4 italic">
                  <p className="text-white/80 text-sm leading-relaxed">
                    &quot;{dailyQuote.text}&quot;
                  </p>
                  <footer className="mt-2 text-xs text-white/40">
                    — {dailyQuote.author}
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-white/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <CardTitle className="text-sm text-white/70 uppercase tracking-wider">
                      Today&apos;s Tasks
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {todos.filter((t) => t.startsWith('✓')).length}/{todos.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <form onSubmit={handleAddTodo} className="flex gap-2">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a learning task..."
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    {t.todo.add}
                  </Button>
                </form>
                <div className="space-y-1.5">
                  {todos.map((todo, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 group"
                    >
                      <button
                        onClick={() => {
                          const updated = [...todos];
                          updated[idx] = updated[idx].startsWith('✓')
                            ? updated[idx].replace('✓ ', '')
                            : `✓ ${updated[idx]}`;
                          setTodos(updated);
                        }}
                        className={cn(
                          'flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all',
                          todo.startsWith('✓')
                            ? 'text-white/40 line-through'
                            : 'text-white/70 hover:bg-white/5'
                        )}
                      >
                        <span
                          className={cn(
                            'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                            todo.startsWith('✓')
                              ? 'border-emerald-500 bg-emerald-500/20'
                              : 'border-white/20'
                          )}
                        >
                          {todo.startsWith('✓') && (
                            <Star className="w-2.5 h-2.5 text-emerald-400" />
                          )}
                        </span>
                        {todo.replace('✓ ', '')}
                      </button>
                      <button
                        onClick={() => handleRemoveTodo(idx)}
                        className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all text-xs"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                  {todos.length === 0 && (
                    <p className="text-xs text-white/30 text-center py-3">
                      {t.common.noItems}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-white/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <CardTitle className="text-sm text-white/70 uppercase tracking-wider">
                    Word of the Day
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative overflow-hidden rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-transparent p-4">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/5 rounded-full blur-2xl" />
                  <p className="text-lg font-bold text-gradient relative z-10">
                    {dailyWord.word}
                  </p>
                  <p className="text-xs text-white/60 mt-2 leading-relaxed relative z-10">
                    {dailyWord.definition}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-white/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <CardTitle className="text-sm text-white/70 uppercase tracking-wider">
                    Learning Stats
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-gradient">{completedTopics}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">
                      Completed
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 text-center">
                    <Brain className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-gradient">{quizzesPassed}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">
                      Quizzes
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/50 mb-1.5">
                    <span>Daily Streak</span>
                    <span>{streak} day{streak !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400"
                    />
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">
                    {streak >= 30 ? 'Legendary streak! 🔥' : streak >= 7 ? 'Consistent learner!' : 'Keep going!'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-white/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <CardTitle className="text-sm text-white/70 uppercase tracking-wider">
                    Quick Access
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                          'group relative overflow-hidden rounded-xl border border-white/5 p-3 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-white/5',
                          'cursor-pointer'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                            link.gradient
                          )}
                        />
                        <div className="relative flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">
                            <Icon className={cn('w-4 h-4', link.color)} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                              {link.title}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-all group-hover:translate-x-0.5" />
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
