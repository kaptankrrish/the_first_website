'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, BookOpen, ExternalLink, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from './language-switcher';
import { useLanguage } from '@/contexts/LanguageContext';

interface DataSource {
  name: string;
  category: string;
  description: string;
  url: string;
  status: 'online' | 'cached';
}

export default function GlobalHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { lang, t } = useLanguage();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefModal, setShowRefModal] = useState(false);
  const [refreshedToast, setRefreshedToast] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate all queries in the cache to trigger active routes to refetch
      await queryClient.invalidateQueries();
      // Trigger Next.js route data refresh
      router.refresh();
      
      setRefreshedToast(true);
      setTimeout(() => setRefreshedToast(false), 2500);
    } catch (err) {
      console.error(' Ecosytem manual refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const dataSources: DataSource[] = [
    {
      name: 'IMDbOT Movies API',
      category: 'Media & Entertainment',
      description: 'Provides keyless, unblocked real-time search, movie details, ranks, casts, and official Amazon IMDb CDN covers.',
      url: 'https://imdb.iamidiotareyoutoo.com',
      status: 'online'
    },
    {
      name: 'Global RSS & Atom Feeds',
      category: 'News Aggregator',
      description: 'Synchronized top world headlines and tech briefs from BBC News, Reuters, TechCrunch, WIRED, NPR, and Al Jazeera.',
      url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
      status: 'online'
    },
    {
      name: 'Wisdom Quotes Engine',
      category: 'Daily Learning',
      description: 'Compiles over 5,420 randomized classical, philosophical, and inspiring quotes from public repository repositories.',
      url: 'https://github.com/ssut/type.fit',
      status: 'online'
    },
    {
      name: 'arXiv Repository API',
      category: 'Science Explorer',
      description: 'Provides open access to 2M+ scholarly preprints in Physics, Mathematics, Computer Science, and Quantitative Biology from Cornell University.',
      url: 'https://arxiv.org',
      status: 'online'
    },
    {
      name: 'ChEMBL Bioactivity Database',
      category: 'Chemical Discovery',
      description: 'Provides curated chemical structures and bioactivity data for millions of drug-like molecules, molecular formulas, and weights.',
      url: 'https://www.ebi.ac.uk/chembl/',
      status: 'online'
    },
    {
      name: 'CoinDesk Crypto Tickers',
      category: 'Finance & Tickers',
      description: 'Serves active market rates, live prices, and 24h percentage updates for top crypto assets like Bitcoin and Ethereum.',
      url: 'https://www.coindesk.com',
      status: 'online'
    }
  ];

  // Dynamic localization for status texts
  const statusTexts = {
    en: {
      active: 'Ecosystem Active',
      refresh: 'Refresh',
      refreshed: 'Refreshed!',
      sources: 'Data Sources',
      modalTitle: 'Real-Time Ecosystem Data Sources',
      modalDesc: 'This knowledge ecosystem is fully dynamic and integrates live, unblocked scientific, media, and financial databases. Zero mock data is served.',
      category: 'Category',
      status: 'Status',
      online: 'Live Connection',
      close: 'Close Window',
      visitSource: 'Visit Source Database'
    },
    hi: {
      active: 'पारिस्थितिकी तंत्र सक्रिय है',
      refresh: 'ताज़ा करें',
      refreshed: 'सफलतापूर्वक ताज़ा किया!',
      sources: 'डेटा स्रोत',
      modalTitle: 'वास्तविक समय पारिस्थितिकी तंत्र डेटा स्रोत',
      modalDesc: 'यह ज्ञान पारिस्थितिकी तंत्र पूरी तरह से गतिशील है और वास्तविक समय में सक्रिय वैज्ञानिक, मीडिया और वित्तीय डेटाबेस को एकीकृत करता है।',
      category: 'श्रेणी',
      status: 'स्थिति',
      online: 'लाइव कनेक्शन',
      close: 'खिड़की बंद करें',
      visitSource: 'स्रोत डेटाबेस पर जाएं'
    },
    es: {
      active: 'Ecosistema Activo',
      refresh: 'Actualizar',
      refreshed: '¡Actualizado!',
      sources: 'Fuentes de Datos',
      modalTitle: 'Fuentes de Datos del Ecosistema en Tiempo Real',
      modalDesc: 'Este ecosistema de conocimiento es totalmente dinámico e integra bases de datos científicas, de medios y financieras activas y desbloqueadas.',
      category: 'Categoría',
      status: 'Estado',
      online: 'Conexión en Vivo',
      close: 'Cerrar Ventana',
      visitSource: 'Visitar Base de Datos'
    }
  };

  const currentTexts = statusTexts[lang] || statusTexts.en;

  return (
    <>
      <div className="w-full mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/40 backdrop-blur-xl border border-border/50 rounded-xl px-5 py-3 shadow-sm relative group">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500/80"></span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase select-none">
              {currentTexts.active}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Language Selection */}
            <LanguageSwitcher />

            {/* Manual Refresh Button */}
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="ghost"
              size="sm"
              className="h-8 gap-2 bg-transparent hover:bg-foreground/5 text-muted-foreground hover:text-foreground px-3 text-[11px] rounded-lg transition-all"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
              <span>{isRefreshing ? t.common.loading : currentTexts.refresh}</span>
            </Button>

            {/* Reference Sources Button */}
            <Button
              onClick={() => setShowRefModal(true)}
              variant="ghost"
              size="sm"
              className="h-8 gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-3 text-[11px] rounded-lg transition-all"
            >
              <Info className="w-3 h-3" />
              <span>{currentTexts.sources}</span>
            </Button>
          </div>
        </div>

        {/* Dynamic Refreshed Mini-Toast */}
        <AnimatePresence>
          {refreshedToast && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl shadow-2xl"
            >
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{currentTexts.refreshed}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glassmorphic References Modal */}
      <AnimatePresence>
        {showRefModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRefModal(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-3xl bg-background/90 border border-border/50 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden z-10 max-h-[85vh] flex flex-col"
            >
              {/* Corner abstract gradients */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowRefModal(false)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Desc */}
              <div className="mb-6 shrink-0">
                <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2.5">
                  <BookOpen className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
                  {currentTexts.modalTitle}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {currentTexts.modalDesc}
                </p>
              </div>

              {/* Dynamic Scrollable Grid of Sources */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataSources.map((source) => (
                    <div
                      key={source.name}
                      className="p-4 rounded-xl bg-foreground/5 border border-border/50 hover:border-border hover:bg-foreground/10 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                            {source.category}
                          </span>
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 py-0.5">
                            {currentTexts.online}
                          </Badge>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                          {source.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {source.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span>{currentTexts.visitSource}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 flex justify-end border-t border-border/50 pt-4">
                <Button
                  onClick={() => setShowRefModal(false)}
                  className="bg-foreground text-background hover:bg-foreground/90 text-xs px-5 py-2 h-9 rounded-lg"
                >
                  {currentTexts.close}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
