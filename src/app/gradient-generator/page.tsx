'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Copy, Check, RotateCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { useLanguage } from '@/contexts/LanguageContext';

type GradientDirection = 'to right' | 'to bottom' | 'diagonal' | 'radial';

const directions: { value: GradientDirection; label: string }[] = [
  { value: 'to right', label: 'Horizontal' },
  { value: 'to bottom', label: 'Vertical' },
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'radial', label: 'Radial' },
];

const presets: { name: string; colors: [string, string]; direction: GradientDirection }[] = [
  { name: 'Ocean Sunset', colors: ['#00b4d8', '#ff6b6b'], direction: 'to right' },
  { name: 'Midnight Galaxy', colors: ['#0f0c29', '#24243e'], direction: 'to bottom' },
  { name: 'Neon Glow', colors: ['#00f260', '#0575e6'], direction: 'diagonal' },
  { name: 'Cotton Candy', colors: ['#ff9a9e', '#fecfef'], direction: 'to right' },
  { name: 'Deep Space', colors: ['#1a1a2e', '#16213e'], direction: 'radial' },
  { name: 'Sunrise', colors: ['#f12711', '#f5af19'], direction: 'to bottom' },
  { name: 'Aurora', colors: ['#11998e', '#38ef7d'], direction: 'diagonal' },
  { name: 'Lavender Dream', colors: ['#c471ed', '#f7797d'], direction: 'to right' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

export default function GradientGeneratorPage() {
  const { t } = useLanguage();
  const [color1, setColor1] = useState('#00b4d8');
  const [color2, setColor2] = useState('#ff6b6b');
  const [direction, setDirection] = useState<GradientDirection>('to right');
  const [showToast, setShowToast] = useState(false);

  const cssValue = useMemo(() => {
    if (direction === 'radial') {
      return `radial-gradient(circle, ${color1}, ${color2})`;
    }
    const dirMap = {
      'to right': 'to right',
      'to bottom': 'to bottom',
      'diagonal': '135deg',
    };
    const realDir = direction === 'diagonal' ? '135deg' : direction;
    return `linear-gradient(${realDir}, ${color1}, ${color2})`;
  }, [color1, color2, direction]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(`background: ${cssValue};`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, [cssValue]);

  const applyPreset = useCallback((preset: typeof presets[0]) => {
    setColor1(preset.colors[0]);
    setColor2(preset.colors[1]);
    setDirection(preset.direction);
  }, []);

  return (
    <PageWrapper
      icon={Palette}
      title={t.nav.gradientGen}
      subtitle="Create beautiful CSS gradients"
      badgeText="CSS Studio"
      colorScheme="rose"
    >
      <div className="max-w-2xl mx-auto relative">
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-6">
          <Card className="overflow-hidden bg-white/[0.03] backdrop-blur-xl border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-orange-500/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-white">Customize</CardTitle>
              <CardDescription>Pick colors and choose a direction</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              {/* Live Preview with animated border */}
              <div className="relative group p-[2px] rounded-2xl overflow-hidden">
                <motion.div 
                  className="absolute inset-0 z-0 opacity-50"
                  animate={{ background: `linear-gradient(90deg, ${color1}, ${color2}, ${color1})`, backgroundSize: "200% 200%" }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                <div
                  className="relative z-10 h-40 rounded-xl border border-white/10 shadow-inner transition-all duration-500"
                  style={{ background: cssValue }}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1 space-y-2">
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider block">Color 1</label>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/10">
                    <input
                      type="color"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-sm text-white/80 font-mono flex-1">{color1.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs text-white/50 font-medium uppercase tracking-wider block">Color 2</label>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/10">
                    <input
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-sm text-white/80 font-mono flex-1">{color2.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/50 font-medium uppercase tracking-wider block">Direction</label>
                <div className="flex flex-wrap gap-2">
                  {directions.map((d) => (
                    <Button
                      key={d.value}
                      variant={direction === d.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDirection(d.value)}
                      className={direction === d.value ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] border-rose-400" : "bg-white/5 border-white/10 hover:bg-white/10"}
                    >
                      {d.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-black/40 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-rose-300/70 font-mono font-medium uppercase tracking-widest">CSS Output</span>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                    Copy Code
                  </Button>
                </div>
                <code className="text-sm text-white font-mono break-all leading-relaxed block">
                  <span className="text-rose-400">background</span>: {cssValue};
                </code>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-white/[0.02] backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-rose-400" />
                Preset Gradients
              </CardTitle>
              <CardDescription>Quick-start with beautiful combinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="group relative rounded-xl overflow-hidden aspect-[3/2] border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
                    style={{
                      background: preset.direction === 'radial'
                        ? `radial-gradient(circle, ${preset.colors[0]}, ${preset.colors[1]})`
                        : `linear-gradient(${preset.direction === 'diagonal' ? '135deg' : preset.direction}, ${preset.colors[0]}, ${preset.colors[1]})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-xs font-semibold text-white drop-shadow-md">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Custom Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.5)] border border-rose-400/50"
            >
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
