'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Atom, ChevronDown, ChevronUp, CheckCircle2, Circle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import { BentoCard } from '@/components/ui/bento-card';
import { cn } from '@/utils/cn';
import { physicsTopics } from '@/content/physics';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PhysicsPage() {
  const { t } = useLanguage();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const completedCount = physicsTopics.filter(tp => tp.completed).length;
  const totalCount = physicsTopics.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.4, ease: 'easeOut' as const } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeIn' as const } },
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Physics Explorer"
        description="Classical mechanics, thermodynamics, electromagnetism, quantum mechanics, and relativity"
        icon={Atom}
        badge={`${completedCount}/${totalCount} Topics`}
      />

      {/* Topic Overview Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {physicsTopics.map((topic) => (
          <motion.div key={topic.id} variants={itemVariants}>
            <BentoCard
              variant={topic.completed ? 'glow' : 'default'}
              size="sm"
              interactive
              onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-blue-300" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {topic.formulas.length} formulas
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground/90 truncate">{topic.title}</h3>
              <p className="text-[11px] text-muted-foreground/60 mt-1 line-clamp-2">{topic.description}</p>
              <div className="flex items-center gap-1 mt-2">
                {topic.completed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Circle className="w-3 h-3 text-muted-foreground/40" />
                )}
                <span className="text-[10px] text-muted-foreground/50">
                  {topic.completed ? 'Completed' : 'Not started'}
                </span>
              </div>
            </BentoCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Expanded Topic Content */}
      <AnimatePresence mode="wait">
        {expandedTopic && (
          <motion.div
            key={expandedTopic}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            {physicsTopics.filter(tp => tp.id === expandedTopic).map(topic => (
              <Card key={topic.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground/90 flex items-center gap-2">
                      <Atom className="w-5 h-5 text-blue-300" />
                      {topic.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedTopic(null)}
                      className="text-muted-foreground/60 hover:text-foreground"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Content */}
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {topic.content}
                    </ReactMarkdown>
                  </div>

                  {/* Formulas */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-300" />
                      Key Formulas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {topic.formulas.map((formula, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs font-mono bg-white/[0.03] border-white/10 px-3 py-1.5"
                        >
                          {formula}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Quiz */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/90 mb-3">Knowledge Check</h3>
                    <div className="space-y-4">
                      {topic.quizzes.map((quiz) => {
                        const selectedAnswer = quizAnswers[quiz.id];
                        const isAnswered = selectedAnswer !== undefined;
                        const isCorrect = selectedAnswer === quiz.correctAnswer;
                        return (
                          <div key={quiz.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                            <p className="text-sm font-medium text-foreground/90 mb-3">{quiz.question}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {quiz.options.map((option, i) => (
                                <button
                                  key={i}
                                  onClick={() => !isAnswered && setQuizAnswers(prev => ({ ...prev, [quiz.id]: i }))}
                                  className={cn(
                                    'p-2.5 rounded-lg border text-left text-xs transition-all',
                                    isAnswered && i === quiz.correctAnswer
                                      ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
                                      : isAnswered && i === selectedAnswer && !isCorrect
                                      ? 'bg-red-500/15 border-red-400/30 text-red-300'
                                      : 'bg-white/[0.03] border-white/5 text-foreground/70 hover:bg-white/[0.06] hover:border-white/10'
                                  )}
                                  disabled={isAnswered}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                            {isAnswered && (
                              <p className={cn(
                                'text-xs mt-2 font-medium',
                                isCorrect ? 'text-emerald-400' : 'text-red-400'
                              )}>
                                {isCorrect ? 'Correct!' : `Incorrect. The answer is: ${quiz.options[quiz.correctAnswer]}`}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
