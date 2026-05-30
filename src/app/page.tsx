'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Newspaper, Cloud, DollarSign, Quote, GraduationCap,
  Atom, Sparkles, BookMarked, Clock as ClockIcon,
  ArrowRight, Search, Zap, Layers, Activity
} from 'lucide-react';
import { LiveClock } from '@/components/ui/live-clock';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDailyQuote } from '@/services/quotes';

const stats = [
  { key: 'articlesAnalyzed', label: 'Articles Analyzed', value: 15420, suffix: '+', icon: BookMarked },
  { key: 'topicsCovered', label: 'Topics Covered', value: 893, suffix: '+', icon: Layers },
  { key: 'learningModules', label: 'Modules', value: 247, suffix: '+', icon: GraduationCap },
  { key: 'dailyUsers', label: 'Daily Users', value: 12800, suffix: '+', icon: Activity },
];

const bentoItems = [
  { key: 'news', title: 'News & Headlines', description: 'Stay updated with the latest breaking stories from around the world.', href: '/news', icon: Newspaper, badge: 'Live', className: 'col-span-1 md:col-span-2 row-span-2 bg-gradient-to-br from-blue-500/10 to-transparent' },
  { key: 'science', title: 'Science', description: 'Discoveries & research.', href: '/science', icon: Atom, badge: 'Trending', className: 'col-span-1 row-span-1 bg-gradient-to-br from-purple-500/10 to-transparent' },
  { key: 'weather', title: 'Weather', description: 'Real-time forecasts.', href: '/weather', icon: Cloud, badge: 'Live', className: 'col-span-1 row-span-1 bg-gradient-to-br from-sky-500/10 to-transparent' },
  { key: 'crypto', title: 'Crypto Markets', description: 'Real-time market data, trends, and comprehensive coin analysis.', href: '/crypto', icon: DollarSign, badge: 'Bullish', className: 'col-span-1 md:col-span-2 row-span-1 bg-gradient-to-br from-emerald-500/10 to-transparent' },
  { key: 'learning', title: 'Learning', description: 'Interactive courses.', href: '/daily-learning', icon: GraduationCap, badge: 'Beta', className: 'col-span-1 row-span-1 bg-gradient-to-br from-indigo-500/10 to-transparent' },
  { key: 'tools', title: 'Productivity', description: 'Calculators & more.', href: '/todo', icon: Zap, badge: 'Pro', className: 'col-span-1 row-span-1 bg-gradient-to-br from-orange-500/10 to-transparent' },
];

const nextGenTexts: Record<string, string> = {
  en: 'Next-Gen Intelligence',
  hi: 'अगली पीढ़ी की बुद्धिमत्ता',
  es: 'Inteligencia de Próxima Generación'
};

const bentoTexts: Record<string, Record<string, { title: string; description: string }>> = {
  en: {
    news: { title: 'News & Headlines', description: 'Stay updated with the latest breaking stories from around the world.' },
    science: { title: 'Science', description: 'Discoveries & research.' },
    weather: { title: 'Weather', description: 'Real-time forecasts.' },
    crypto: { title: 'Crypto Markets', description: 'Real-time market data, trends, and comprehensive coin analysis.' },
    learning: { title: 'Learning', description: 'Interactive courses.' },
    tools: { title: 'Productivity', description: 'Calculators & more.' }
  },
  hi: {
    news: { title: 'समाचार और सुर्खियां', description: 'दुनिया भर की नवीनतम ब्रेकिंग कहानियों से अपडेट रहें।' },
    science: { title: 'विज्ञान', description: 'खोजें और अनुसंधान।' },
    weather: { title: 'मौसम', description: 'वास्तविक समय पूर्वानुमान।' },
    crypto: { title: 'क्रिप्टो बाजार', description: 'वास्तविक समय बाजार डेटा, रुझान और सिक्का विश्लेषण।' },
    learning: { title: 'सीखना', description: 'इंटरैक्टिव पाठ्यक्रम।' },
    tools: { title: 'उत्पादकता', description: 'कैलकुलेटर और बहुत कुछ।' }
  },
  es: {
    news: { title: 'Noticias y Titulares', description: 'Manténgase actualizado con las últimas historias de última hora.' },
    science: { title: 'Ciencia', description: 'Descubrimientos e investigación.' },
    weather: { title: 'Clima', description: 'Pronósticos en tiempo real.' },
    crypto: { title: 'Mercados Cripto', description: 'Datos del mercado, tendencias y análisis de monedas.' },
    learning: { title: 'Aprendizaje', description: 'Cursos interactivos.' },
    tools: { title: 'Productividad', description: 'Calculadoras y más.' }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const { lang, t } = useLanguage();
  const [quote, setQuote] = useState({ text: 'Loading wisdom...', author: 'AI Ecosystem' });

  useEffect(() => {
    let mounted = true;
    getDailyQuote().then(q => {
      if (mounted && q) setQuote(q);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-32 lg:py-40 text-center flex flex-col items-center justify-center min-h-[70vh]">
        {/* Glowing Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-40 animate-pulse-glow" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-4xl mx-auto"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Badge variant="secondary" className="px-4 py-1.5 text-xs font-semibold tracking-wider bg-white/10 dark:bg-white/[0.05] border-white/10 text-foreground/80 uppercase backdrop-blur-md">
              <ClockIcon className="h-3.5 w-3.5 mr-2 text-blue-500" />
              <LiveClock />
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-xs font-semibold tracking-wider bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 uppercase backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              {nextGenTexts[lang] || nextGenTexts.en}
            </Badge>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            <span className="text-gradient">Infinite</span><br />
            Knowledge Base
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            {t.home.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/news" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 px-8 py-7 rounded-2xl text-base font-semibold transition-all group shadow-xl shadow-blue-500/10">
                <Newspaper className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t.home.newsFeed}
                <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/search" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-background/50 backdrop-blur-md border-border/50 hover:bg-background/80 px-8 py-7 rounded-2xl text-base font-medium transition-all group">
                <Search className="mr-2 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                {t.common.search}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="px-4 mb-24 lg:mb-32"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const statsTranslation = t.home.stats as Record<string, string>;
            const displayLabel = statsTranslation[stat.key] || stat.label;
            return (
              <motion.div
                key={stat.key}
                variants={itemVariants}
                className="relative overflow-hidden bg-background/40 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 text-center hover:bg-background/60 hover:border-border transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">{displayLabel}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Bento Box Features */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="px-4 mb-24 lg:mb-32 max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
              {t.home.explore}
            </h2>
            <p className="text-muted-foreground font-light">
              Dive into our comprehensive suite of tools and insights.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[220px]">
          {bentoItems.map((item) => {
            const Icon = item.icon;
            const displayInfo = bentoTexts[lang]?.[item.key] || { title: item.title, description: item.description };
            
            return (
              <motion.div key={item.key} variants={itemVariants} className={item.className}>
                <Link href={item.href} className="block w-full h-full outline-none">
                  <Card className="h-full border-border/40 bg-background/40 backdrop-blur-md hover:bg-background/60 hover:border-border/80 hover:shadow-xl transition-all duration-500 p-6 rounded-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex flex-col h-full relative z-10">
                      <div className="flex items-start justify-between mb-auto">
                        <div className="p-3 rounded-2xl bg-foreground/5 text-foreground/80 group-hover:bg-foreground/10 group-hover:text-foreground transition-all duration-300">
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-semibold tracking-wider border-border/50 text-muted-foreground uppercase bg-background/50 backdrop-blur-md">
                          {item.badge}
                        </Badge>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-blue-500 transition-colors">
                          {displayInfo.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed font-light line-clamp-2">
                          {displayInfo.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Quote Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="px-4 mb-24"
      >
        <div className="max-w-4xl mx-auto relative p-10 sm:p-16 rounded-[2.5rem] bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-2xl border border-border/50 shadow-2xl overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-700" />
          
          <Quote className="h-12 w-12 text-blue-500/20 mb-8" />
          <h3 className="text-2xl sm:text-3xl md:text-4xl text-foreground font-medium italic leading-tight mb-8">
            &ldquo;{quote.text}&rdquo;
          </h3>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-blue-500/30" />
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
              {quote.author}
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
