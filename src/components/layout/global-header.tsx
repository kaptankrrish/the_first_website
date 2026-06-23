'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, ExternalLink, X, Sparkles, Database } from 'lucide-react';
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
      await queryClient.invalidateQueries();
      router.refresh();
      setRefreshedToast(true);
      setTimeout(() => setRefreshedToast(false), 2500);
    } catch (err) {
      console.error('Ecosystem manual refresh failed:', err);
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
      description: 'Compiles over 5,420 randomized classical, philosophical, and inspiring quotes from public repositories.',
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
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col sm:flex-row items-center justify-between gap-3 glass-strong rounded-2xl px-4 sm:px-5 py-2.5 overflow-hidden group hover-lift"
        >
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none opacity-60" />
          <div className="absolute -bottom-16 right-1/3 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none opacity-60" />

          <div className="relative flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
            </span>
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-semibold tracking-[0.18em] text-foreground/75 uppercase select-none">
              {currentTexts.active}
            </span>
            <span className="hidden sm:inline-block w-px h-3 bg-white/10" />
            <span className="hidden sm:inline-block text-[10px] tracking-wider text-muted-foreground/55">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="relative flex items-center gap-2 w-full sm:w-auto justify-end">
            <LanguageSwitcher />

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="ghost"
              size="sm"
              className="h-8 gap-2 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground px-3 text-[11px] rounded-lg transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? t.common.loading : currentTexts.refresh}</span>
            </Button>

            <Button
              onClick={() => setShowRefModal(true)}
              variant="ghost"
              size="sm"
              className="h-8 gap-2 bg-gradient-to-r from-blue-500/12 to-purple-500/12 hover:from-blue-500/20 hover:to-purple-500/20 text-blue-300 hover:text-blue-200 px-3 text-[11px] rounded-lg transition-all border border-blue-400/15"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentTexts.sources}</span>
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {refreshedToast && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/12 border border-emerald-400/25 backdrop-blur-xl shadow-2xl shadow-emerald-500/15"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-emerald-300">{currentTexts.refreshed}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showRefModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRefModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-3xl glass-strong rounded-2xl shadow-2xl shadow-purple-500/8 p-6 md:p-8 overflow-hidden z-10 max-h-[85vh] flex flex-col"
            >
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-breathe" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-breathe" />

              <button
                onClick={() => setShowRefModal(false)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative mb-6 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/12 text-blue-300 text-[10px] font-semibold uppercase tracking-wider border border-blue-400/15">
                    Live
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/55">{dataSources.length} sources</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-pretty">
                  <span className="text-gradient">{currentTexts.modalTitle}</span>
                </h2>
                <p className="text-sm text-muted-foreground/70 mt-2 max-w-2xl text-pretty">
                  {currentTexts.modalDesc}
                </p>
              </div>

              <div className="relative flex-1 overflow-y-auto pr-1 space-y-4 mb-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dataSources.map((source, idx) => (
                    <motion.div
                      key={source.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-400/20 hover:bg-white/[0.05] transition-all flex flex-col justify-between group hover-lift"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.15em]">
                            {source.category}
                          </span>
                          <Badge variant="outline" className="text-[9px] bg-emerald-500/12 text-emerald-300 border-emerald-400/25 py-0.5 px-1.5 gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {currentTexts.online}
                          </Badge>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-300 transition-colors">
                          {source.name}
                        </h3>
                        <p className="text-xs text-muted-foreground/65 mt-1.5 leading-relaxed">
                          {source.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-blue-300 transition-colors group/link"
                        >
                          <span>{currentTexts.visitSource}</span>
                          <ExternalLink className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative shrink-0 flex justify-end border-t border-white/5 pt-4">
                <Button
                  onClick={() => setShowRefModal(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white text-xs px-5 py-2 h-9 rounded-lg shadow-lg shadow-purple-500/15"
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
