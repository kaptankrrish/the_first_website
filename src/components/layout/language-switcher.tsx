'use client';

import { Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { type LanguageCode } from '@/translations';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-all border border-white/10 shadow-lg group shrink-0">
      {/* Premium Accent Globe Icon */}
      <Languages className="w-4 h-4 text-blue-400 shrink-0 group-hover:text-blue-300 transition-colors" />
      
      {/* Native-hybrid select wrapper that bypasses any overflow-hidden parent clipping */}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as LanguageCode)}
        className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-5 text-xs appearance-none py-0.5 relative z-10 w-full hover:text-white transition-colors"
        title="Change language"
      >
        <option value="en" className="bg-neutral-900 text-white py-2">English</option>
        <option value="hi" className="bg-neutral-900 text-white py-2">हिन्दी</option>
        <option value="es" className="bg-neutral-900 text-white py-2">Español</option>
      </select>

      {/* Styled custom indicator arrow */}
      <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-3 pointer-events-none group-hover:text-white/80 transition-colors" />
    </div>
  );
}
