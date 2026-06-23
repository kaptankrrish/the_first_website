'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Settings, Sun, Type, Bell, Trash2, Info, Languages, Monitor, Sparkles, Keyboard, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore, useOnboardingStore } from '@/store';
import ThemeSwitcher from '@/components/layout/theme-switcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { type LanguageCode } from '@/translations';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

const LOCALIZED_TEXTS = {
  en: {
    subtitle: 'Customize your app experience',
    appearance: 'Appearance',
    appearanceDesc: 'Customize the look and feel',
    themeDesc: 'Choose light, dark, or system theme',
    languageDesc: 'Select website language',
    fontSizeDesc: 'Adjust text size',
    fontSmall: 'Small',
    fontMedium: 'Medium',
    fontLarge: 'Large',
    sidebar: 'Sidebar',
    sidebarDesc: 'Default collapsed state',
    preferences: 'Preferences',
    preferencesDesc: 'Manage app behavior',
    data: 'Data',
    dataDesc: 'Manage your stored data',
    searchHistory: 'Search History',
    entry: 'entry',
    entries: 'entries',
    clearBtn: 'Clear',
    clearedBtn: 'Cleared!',
    about: 'About',
    appVersion: 'App Version',
    framework: 'Framework',
    dataStorage: 'Data Storage',
    footerDesc: 'AI Knowledge Ecosystem — A futuristic AI-powered platform combining news, learning, productivity, and insights.',
  },
  hi: {
    subtitle: 'अपने ऐप अनुभव को अनुकूलित करें',
    appearance: 'दिखावट',
    appearanceDesc: 'दिखने और महसूस होने के तरीके को अनुकूलित करें',
    themeDesc: 'लाइट, डार्क या सिस्टम थीम चुनें',
    languageDesc: 'वेबसाइट की भाषा चुनें',
    fontSizeDesc: 'फ़ॉन्ट का आकार समायोजित करें',
    fontSmall: 'छोटा',
    fontMedium: 'मध्यम',
    fontLarge: 'बड़ा',
    sidebar: 'साइडबार',
    sidebarDesc: 'डिफ़ॉल्ट रूप से संक्षिप्त स्थिति',
    preferences: 'प्राथमिकताएं',
    preferencesDesc: 'ऐप के व्यवहार को प्रबंधित करें',
    data: 'डेटा',
    dataDesc: 'अपने संग्रहीत डेटा को प्रबंधित करें',
    searchHistory: 'खोज इतिहास',
    entry: 'प्रविष्टि',
    entries: 'प्रविष्टियाँ',
    clearBtn: 'साफ़ करें',
    clearedBtn: 'साफ़ किया गया!',
    about: 'के बारे में',
    appVersion: 'ऐप संस्करण',
    framework: 'फ्रेमवर्क',
    dataStorage: 'डेटा संग्रहण',
    footerDesc: 'AI ज्ञान पारिस्थितिकी तंत्र — समाचार, सीखने, उत्पादकता और अंतर्दृष्टि को मिलाने वाला एक भविष्यवादी AI-संचालित मंच।',
  },
  es: {
    subtitle: 'Personaliza tu experiencia de la aplicación',
    appearance: 'Apariencia',
    appearanceDesc: 'Personaliza la apariencia y el estilo',
    themeDesc: 'Elige tema claro, oscuro o del sistema',
    languageDesc: 'Selecciona el idioma del sitio web',
    fontSizeDesc: 'Ajustar el tamaño de la fuente',
    fontSmall: 'Pequeño',
    fontMedium: 'Mediano',
    fontLarge: 'Grande',
    sidebar: 'Barra lateral',
    sidebarDesc: 'Estado contraído por defecto',
    preferences: 'Preferencias',
    preferencesDesc: 'Gestionar el comportamiento de la aplicación',
    data: 'Datos',
    dataDesc: 'Gestionar tus datos almacenados',
    searchHistory: 'Historial de búsqueda',
    entry: 'entrada',
    entries: 'entradas',
    clearBtn: 'Limpiar',
    clearedBtn: '¡Limpiado!',
    about: 'Acerca de',
    appVersion: 'Versión de la aplicación',
    framework: 'Framework',
    dataStorage: 'Almacenamiento de datos',
    footerDesc: 'Ecosistema de Conocimiento AI — Una plataforma futurista impulsada por IA que combina noticias, aprendizaje, productividad y perspectivas.',
  }
};

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const searchHistory = useAppStore((s) => s.searchHistory);
  const clearSearchHistory = useAppStore((s) => s.clearSearchHistory);
  const { resetTour } = useOnboardingStore();
  const [historyCleared, setHistoryCleared] = useState(false);

  const handleClearHistory = () => {
    clearSearchHistory();
    setHistoryCleared(true);
    setTimeout(() => setHistoryCleared(false), 2000);
  };

  const handleReplayTour = () => {
    resetTour();
    // Navigate to home where the tour will appear
    window.location.href = '/';
  };

  const localTexts = LOCALIZED_TEXTS[lang] || LOCALIZED_TEXTS.en;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <motion.div variants={itemVariants} className="relative mb-8">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(96,165,250,0.2)]"
          >
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-200" />
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient leading-tight text-balance">
              {t.settings.title}
            </h1>
            <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
              {localTexts.subtitle}
            </p>
          </div>
        </div>
        <div className="mt-5 h-px divider-gradient" />
      </motion.div>

      {/* Appearance Section */}
      <motion.div variants={itemVariants} className="mb-4">
        <Card className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-white">{localTexts.appearance}</CardTitle>
            <CardDescription>{localTexts.appearanceDesc}</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-5">
            {/* Theme Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Sun className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.settings.theme}</div>
                  <div className="text-xs text-white/50">{localTexts.themeDesc}</div>
                </div>
              </div>
              <ThemeSwitcher />
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-500/10 p-2">
                  <Languages className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.settings.language}</div>
                  <div className="text-xs text-white/50">{localTexts.languageDesc}</div>
                </div>
              </div>
              <Select
                value={lang}
                onValueChange={(v: LanguageCode) => setLang(v)}
              >
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white text-xs">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10 text-white">
                  <SelectItem value="en" className="hover:bg-white/10 text-xs">English</SelectItem>
                  <SelectItem value="hi" className="hover:bg-white/10 text-xs">हिन्दी</SelectItem>
                  <SelectItem value="es" className="hover:bg-white/10 text-xs">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Type className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.settings.fontSize}</div>
                  <div className="text-xs text-white/50">{localTexts.fontSizeDesc}</div>
                </div>
              </div>
              <Select
                value={settings.fontSize}
                onValueChange={(v: 'sm' | 'md' | 'lg') => updateSettings({ fontSize: v })}
              >
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white text-xs">
                  <SelectValue placeholder="Font size" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10 text-white">
                  <SelectItem value="sm" className="hover:bg-white/10 text-xs">{localTexts.fontSmall}</SelectItem>
                  <SelectItem value="md" className="hover:bg-white/10 text-xs">{localTexts.fontMedium}</SelectItem>
                  <SelectItem value="lg" className="hover:bg-white/10 text-xs">{localTexts.fontLarge}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sidebar Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Monitor className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{localTexts.sidebar}</div>
                  <div className="text-xs text-white/50">{localTexts.sidebarDesc}</div>
                </div>
              </div>
              <Switch
                checked={sidebarCollapsed}
                onCheckedChange={toggleSidebar}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences Section */}
      <motion.div variants={itemVariants} className="mb-4">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white">{localTexts.preferences}</CardTitle>
            <CardDescription>{localTexts.preferencesDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <Bell className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.settings.notifications}</div>
                  <div className="text-xs text-white/50">{t.settings.notificationsDesc}</div>
                </div>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(v) => updateSettings({ notificationsEnabled: v })}
              />
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-pink-500/10 p-2">
                  <Settings className="h-4 w-4 text-pink-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.settings.animations}</div>
                  <div className="text-xs text-white/50">{t.settings.animationsDesc}</div>
                </div>
              </div>
              <Switch
                checked={settings.animationsEnabled}
                onCheckedChange={(v) => updateSettings({ animationsEnabled: v })}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Section */}
      <motion.div variants={itemVariants} className="mb-4">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white">{localTexts.data}</CardTitle>
            <CardDescription>{localTexts.dataDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{localTexts.searchHistory}</div>
                <div className="text-xs text-white/50">
                  {searchHistory.length} {searchHistory.length === 1 ? localTexts.entry : localTexts.entries}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearHistory}
                disabled={searchHistory.length === 0}
                className="gap-1.5 h-8 text-xs rounded-lg transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {historyCleared ? localTexts.clearedBtn : localTexts.clearBtn}
              </Button>
            </div>
            {searchHistory.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {searchHistory.map((q) => (
                  <Badge key={q} variant="secondary" className="text-[10px] bg-white/5 text-white/60 border-white/5">{q}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tour & Shortcuts Section */}
      <motion.div variants={itemVariants} className="mb-4">
        <Card className="overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Discover
            </CardTitle>
            <CardDescription>Re-explore the ecosystem</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-3">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">Quick tour</div>
                  <div className="text-xs text-white/50">A 30-second walkthrough of the ecosystem</div>
                </div>
              </div>
              <Button
                variant="gradient"
                size="sm"
                onClick={handleReplayTour}
                className="gap-1.5 h-8 text-xs shrink-0"
              >
                Replay
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <Link
              href="/shortcuts"
              className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-white/5 flex items-center justify-center shrink-0">
                  <Keyboard className="h-4 w-4 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">Keyboard shortcuts</div>
                  <div className="text-xs text-white/50">Fly through the app without the mouse</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* About Section */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              {localTexts.about}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">{localTexts.appVersion}</span>
              <Badge variant="secondary" className="bg-white/5 text-white/60 border-white/5">v0.1.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">{localTexts.framework}</span>
              <Badge variant="secondary" className="bg-white/5 text-white/60 border-white/5">Next.js 16</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">{localTexts.dataStorage}</span>
              <Badge variant="secondary" className="bg-white/5 text-white/60 border-white/5">Local (Zustand + Persist)</Badge>
            </div>
            <p className="text-xs text-white/30 pt-2 border-t border-white/10">
              {localTexts.footerDesc}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
