'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Atom, ChevronDown, ChevronUp, CheckCircle2, Circle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageWrapper } from '@/components/layout/page-wrapper';
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
    <PageWrapper
      icon={Atom}
      title="Physics Explorer"
      subtitle="Classical mechanics, thermodynamics, electromagnetism, quantum mechanics, and relativity"
      badgeText={`${completedCount}/${totalCount} Topics`}
      colorScheme="blue"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Topic Overview Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {physicsTopics.map((topic) => (
            <motion.div key={topic.id} variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <BentoCard
                variant={topic.completed ? 'glow' : 'default'}
                size="sm"
                interactive
                className="bg-white/[0.03] backdrop-blur-xl border-white/10 hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-300"
                onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    {topic.formulas.length} formulas
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white/90 truncate">{topic.title}</h3>
                <p className="text-[11px] text-white/50 mt-1 line-clamp-2">{topic.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  {topic.completed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Circle className="w-3 h-3 text-white/30" />
                  )}
                  <span className="text-[10px] text-white/50">
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
                <Card key={topic.id} className="overflow-hidden bg-white/[0.03] backdrop-blur-xl border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white/90 flex items-center gap-2">
                        <Atom className="w-5 h-5 text-blue-400" />
                        {topic.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedTopic(null)}
                        className="text-white/50 hover:text-white"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 relative">
                    {/* Content */}
                    <div className="prose prose-invert prose-sm max-w-none text-white/70">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {topic.content}
                      </ReactMarkdown>
                    </div>

                    {/* Formulas */}
                    <div>
                      <h3 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Key Formulas
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {topic.formulas.map((formula, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs font-mono bg-white/[0.05] border-white/20 px-3 py-1.5 text-blue-300"
                          >
                            {formula}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Quiz */}
                    <div>
                      <h3 className="text-sm font-semibold text-white/90 mb-3">Knowledge Check</h3>
                      <div className="space-y-4">
                        {topic.quizzes.map((quiz) => {
                          const selectedAnswer = quizAnswers[quiz.id];
                          const isAnswered = selectedAnswer !== undefined;
                          const isCorrect = selectedAnswer === quiz.correctAnswer;
                          return (
                            <div key={quiz.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                              <p className="text-sm font-medium text-white/90 mb-3">{quiz.question}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {quiz.options.map((option, i) => (
                                  <button
                                    key={i}
                                    onClick={() => !isAnswered && setQuizAnswers(prev => ({ ...prev, [quiz.id]: i }))}
                                    className={cn(
                                      'p-2.5 rounded-lg border text-left text-xs transition-all duration-300',
                                      isAnswered && i === quiz.correctAnswer
                                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                                        : isAnswered && i === selectedAnswer && !isCorrect
                                        ? 'bg-red-500/20 border-red-400/50 text-red-300'
                                        : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.08] hover:border-white/20'
                                    )}
                                    disabled={isAnswered}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                              {isAnswered && (
                                <motion.p 
                                  initial={{ opacity: 0, y: -5 }} 
                                  animate={{ opacity: 1, y: 0 }}
                                  className={cn(
                                    'text-xs mt-3 font-medium flex items-center gap-1.5',
                                    isCorrect ? 'text-emerald-400' : 'text-red-400'
                                  )}
                                >
                                  {isCorrect ? (
                                    <><CheckCircle2 className="w-3.5 h-3.5" /> Correct!</>
                                  ) : (
                                    <><Circle className="w-3.5 h-3.5" /> Incorrect. The answer is: {quiz.options[quiz.correctAnswer]}</>
                                  )}
                                </motion.p>
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
    </PageWrapper>
  );
}
