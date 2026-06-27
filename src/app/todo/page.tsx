'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodoStore } from '@/store';
import { generateId } from '@/utils';
import { cn } from '@/utils/cn';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  ChevronDown as ChevronDownIcon,
  ListTodo,
  CheckCircle2,
  Circle,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageWrapper } from '@/components/layout/page-wrapper';

const priorityConfig = {
  low: { label: 'Low', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  medium: { label: 'Medium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  high: { label: 'High', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const categories = ['General', 'Work', 'Personal', 'Study', 'Health', 'Finance'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: -50, scale: 0.9, transition: { duration: 0.2 } },
};

const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex justify-center">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            background: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
            left: '50%',
            top: '20%'
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: Math.random() * 0.5 + 0.5 }}
          animate={{
            x: (Math.random() - 0.5) * 600,
            y: Math.random() * 600 + 200,
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            ease: [0.23, 1, 0.32, 1]
          }}
        />
      ))}
    </div>
  );
};

export default function TodoPage() {
  const { t } = useLanguage();
  const { todos, addTodo, toggleTodo, removeTodo, updateTodo } = useTodoStore();
  const [text, setText] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  };

  useEffect(() => {
    if (stats.total > 0 && stats.pending === 0 && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [stats.total, stats.pending, showConfetti]);

  const handleAdd = useCallback(() => {
    if (!text.trim()) return;
    addTodo({
      id: generateId(),
      text: text.trim(),
      completed: false,
      category,
      priority,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    });
    setText('');
    setDueDate('');
    inputRef.current?.focus();
  }, [text, category, priority, dueDate, addTodo]);

  const moveTodo = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const filtered = filteredTodos;
      const realIndex = todos.findIndex((t) => t.id === filtered[index].id);
      const targetIndex = direction === 'up' ? realIndex - 1 : realIndex + 1;
      if (targetIndex < 0 || targetIndex >= todos.length) return;
      const newTodos = [...todos];
      [newTodos[realIndex], newTodos[targetIndex]] = [newTodos[targetIndex], newTodos[realIndex]];
      newTodos.forEach((t, i) => updateTodo(t.id, { createdAt: new Date(Date.now() - i * 1000).toISOString() }));
    },
    [todos, filteredTodos, updateTodo]
  );

  const Actions = (
    <div className="flex items-center gap-2 shrink-0">
      <Badge variant="secondary" className="text-xs gap-1 glass-strong border-white/5 px-2.5 py-1">
        <ListTodo className="w-3.5 h-3.5" />
        {stats.total} total
      </Badge>
      <Badge variant="outline" className="text-xs gap-1 bg-emerald-500/15 border-emerald-400/20 text-emerald-300 px-2.5 py-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {stats.completed}
      </Badge>
      <Badge variant="outline" className="text-xs gap-1 bg-amber-500/15 border-amber-400/20 text-amber-300 px-2.5 py-1">
        <Circle className="w-3.5 h-3.5" />
        {stats.pending}
      </Badge>
    </div>
  );

  return (
    <PageWrapper
      icon={ListTodo}
      title={t.nav.todo}
      subtitle={t.todo.subtitle}
      badgeText="Tasks"
      colorScheme="emerald"
      actions={Actions}
    >
      <Confetti active={showConfetti} />
      
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="overflow-visible bg-black/40 backdrop-blur-xl border-white/5 shadow-2xl">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    placeholder={t.todo.addTask}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    className="w-full bg-white/5 border-white/10 text-base"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Select.Root value={category} onValueChange={setCategory}>
                    <Select.Trigger className="inline-flex h-10 w-32 items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="z-50 rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl text-white shadow-xl">
                        <Select.Viewport className="p-1">
                          {categories.map((cat) => (
                            <Select.Item
                              key={cat}
                              value={cat}
                              className="relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-emerald-500/20 focus:text-emerald-100"
                            >
                              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <Select.ItemIndicator>
                                  <Check className="h-4 w-4 text-emerald-400" />
                                </Select.ItemIndicator>
                              </span>
                              <Select.ItemText>{cat}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  
                  <Select.Root value={priority} onValueChange={(v) => setPriority(v as 'low' | 'medium' | 'high')}>
                    <Select.Trigger className="inline-flex h-10 w-28 items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="z-50 rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl text-white shadow-xl">
                        <Select.Viewport className="p-1">
                          {(['low', 'medium', 'high'] as const).map((p) => (
                            <Select.Item
                              key={p}
                              value={p}
                              className="relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-emerald-500/20 focus:text-emerald-100"
                            >
                              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <Select.ItemIndicator>
                                  <Check className="h-4 w-4 text-emerald-400" />
                                </Select.ItemIndicator>
                              </span>
                              <Select.ItemText className="capitalize">{p}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-40 bg-white/5 border-white/10 text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  
                  <Button onClick={handleAdd} className="shrink-0 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                    <Plus className="w-4 h-4" />
                    {t.todo.add}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs.Root value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <Tabs.List className="inline-flex h-11 items-center justify-center rounded-xl bg-black/40 backdrop-blur-xl border border-white/5 p-1 text-white/60 mb-4 shadow-lg">
            {(['all', 'active', 'completed'] as const).map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-medium transition-all capitalize data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 data-[state=active]:shadow-sm data-[state=active]:border-emerald-500/30 border border-transparent"
              >
                {tab === 'all' ? t.todo.all : tab === 'active' ? t.todo.active : t.todo.completed}
                <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0 bg-black/40 text-white/70">
                  {tab === 'all' ? stats.total : tab === 'active' ? stats.pending : stats.completed}
                </Badge>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        <Card className="bg-black/40 backdrop-blur-xl border-white/5 shadow-2xl">
          <CardContent className="p-0">
            {todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-white/40"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <ListTodo className="w-10 h-10 opacity-50" />
                </div>
                <p className="text-xl font-medium text-white/80">{t.todo.noTasks}</p>
                <p className="text-sm mt-2">{t.todo.addFirst}</p>
              </motion.div>
            ) : (
              <ScrollArea className="h-[500px]">
                <motion.div
                  className="p-3 space-y-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredTodos.map((todo, index) => (
                      <motion.div
                        key={todo.id}
                        variants={itemVariants}
                        layout
                        exit="exit"
                        className={cn(
                          'group flex items-center gap-4 rounded-xl p-4 transition-all duration-300',
                          'bg-white/5 border border-white/10 hover:border-emerald-400/30 hover:bg-emerald-500/5 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]',
                          todo.completed && 'opacity-50 grayscale-[0.5]'
                        )}
                      >
                        <Checkbox.Root
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 overflow-hidden relative',
                            todo.completed
                              ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                              : 'border-white/30 hover:border-emerald-400'
                          )}
                        >
                          <Checkbox.Indicator asChild>
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                            </motion.div>
                          </Checkbox.Indicator>
                        </Checkbox.Root>

                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              'text-base font-medium truncate transition-all duration-300',
                              todo.completed ? 'line-through text-white/40' : 'text-white'
                            )}
                          >
                            {todo.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-auto bg-black/40 border-white/10 text-white/70">
                              {todo.category}
                            </Badge>
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide',
                                priorityConfig[todo.priority].color
                              )}
                            >
                              {priorityConfig[todo.priority].label}
                            </span>
                            {todo.dueDate && (
                              <span className="flex items-center gap-1.5 text-[10px] text-emerald-200 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Calendar className="w-3 h-3" />
                                {new Date(todo.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-col">
                            {index > 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-white/40 hover:text-white"
                                onClick={() => moveTodo(index, 'up')}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                            )}
                            {index < filteredTodos.length - 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-white/40 hover:text-white"
                                onClick={() => moveTodo(index, 'down')}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="w-px h-8 bg-white/10 mx-1" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg ml-1"
                            onClick={() => removeTodo(todo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
