'use client';

import { useState, useRef, useCallback } from 'react';
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

const priorityConfig = {
  low: { label: 'Low', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  medium: { label: 'Medium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  high: { label: 'High', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const categories = ['General', 'Work', 'Personal', 'Study', 'Health', 'Finance'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -20, scale: 0.95 },
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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <motion.div
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(16,185,129,0.2)]"
              >
                <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-200" />
              </motion.div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient leading-tight text-balance">
                  {t.nav.todo}
                </h1>
                <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                  {t.todo.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="text-xs gap-1 glass-strong border-white/5">
                <ListTodo className="w-3 h-3" />
                {stats.total} total
              </Badge>
              <Badge variant="success" className="text-xs gap-1 bg-emerald-500/15 border-emerald-400/20 text-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                {stats.completed}
              </Badge>
              <Badge variant="warning" className="text-xs gap-1 bg-amber-500/15 border-amber-400/20 text-amber-300">
                <Circle className="w-3 h-3" />
                {stats.pending}
              </Badge>
            </div>
          </div>
          <div className="mt-5 h-px divider-gradient" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="overflow-visible">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  placeholder={t.todo.addTask}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  className="w-full"
                />
              </div>
              <Select.Root value={category} onValueChange={setCategory}>
                <Select.Trigger className="inline-flex h-10 w-32 items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/30">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="z-50 rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl text-white shadow-lg">
                    <Select.Viewport className="p-1">
                      {categories.map((cat) => (
                        <Select.Item
                          key={cat}
                          value={cat}
                          className="relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-white/10 focus:text-white"
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <Select.ItemIndicator>
                              <Check className="h-4 w-4" />
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
                <Select.Trigger className="inline-flex h-10 w-28 items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-white/30">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="z-50 rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl text-white shadow-lg">
                    <Select.Viewport className="p-1">
                      {(['low', 'medium', 'high'] as const).map((p) => (
                        <Select.Item
                          key={p}
                          value={p}
                          className="relative flex cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-white/10 focus:text-white"
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <Select.ItemIndicator>
                              <Check className="h-4 w-4" />
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
                className="w-40"
              />
              <Button onClick={handleAdd} className="shrink-0 gap-2">
                <Plus className="w-4 h-4" />
                {t.todo.add}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs.Root value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <Tabs.List className="inline-flex h-10 items-center justify-center rounded-lg bg-white/5 p-1 text-white/60 mb-4">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all capitalize data-[state=active]:bg-white data-[state=active]:text-black"
            >
              {tab === 'all' ? t.todo.all : tab === 'active' ? t.todo.active : t.todo.completed}
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                {tab === 'all' ? stats.total : tab === 'active' ? stats.pending : stats.completed}
              </Badge>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <Card>
        <CardContent className="p-0">
          {todos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-white/40"
            >
              <ListTodo className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">{t.todo.noTasks}</p>
              <p className="text-sm mt-1">{t.todo.addFirst}</p>
            </motion.div>
          ) : (
            <ScrollArea className="h-[500px]">
              <motion.div
                className="p-1 space-y-1"
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
                        'group flex items-center gap-3 rounded-xl p-3 transition-all duration-300',
                        'hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5 border border-transparent hover:border-blue-400/20 hover:shadow-[0_0_16px_rgba(96,165,250,0.08)]',
                        todo.completed && 'opacity-60'
                      )}
                    >
                      <Checkbox.Root
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all',
                          todo.completed
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-white/30 hover:border-white/50'
                        )}
                      >
                        <Checkbox.Indicator>
                          <Check className="h-3 w-3 text-white" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>

                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'text-sm font-medium truncate',
                            todo.completed && 'line-through text-white/40'
                          )}
                        >
                          {todo.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            {todo.category}
                          </Badge>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium',
                              priorityConfig[todo.priority].color
                            )}
                          >
                            {priorityConfig[todo.priority].label}
                          </span>
                          {todo.dueDate && (
                            <span className="flex items-center gap-1 text-[10px] text-white/40">
                              <Calendar className="w-3 h-3" />
                              {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveTodo(index, 'up')}
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {index < filteredTodos.length - 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveTodo(index, 'down')}
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => removeTodo(todo.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
  );
}
