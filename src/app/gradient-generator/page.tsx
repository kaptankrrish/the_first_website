'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check, RotateCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

export default function GradientGeneratorPage() {
  const { t } = useLanguage();
  const [color1, setColor1] = useState('#00b4d8');
  const [color2, setColor2] = useState('#ff6b6b');
  const [direction, setDirection] = useState<GradientDirection>('to right');
  const [copied, setCopied] = useState(false);

  const cssValue = useMemo(() => {
    if (direction === 'radial') {
      return `radial-gradient(circle, ${color1}, ${color2})`;
    }
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
  }, [color1, color2, direction]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(`background: ${cssValue};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cssValue]);

  const applyPreset = useCallback((preset: typeof presets[0]) => {
    setColor1(preset.colors[0]);
    setColor2(preset.colors[1]);
    setDirection(preset.direction);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Palette className="h-7 w-7 text-purple-400" />
          {t.nav.gradientGen}
        </h1>
        <p className="text-white/50 mt-1">Create beautiful CSS gradients</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-white">Customize</CardTitle>
            <CardDescription>Pick colors and choose a direction</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-5">
            <div
              className="h-36 rounded-xl border border-white/10 transition-all duration-500"
              style={{ background: cssValue }}
            />

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-white/50 mb-1 block">Color 1</label>
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-full h-10 rounded-lg border border-white/10 bg-white/5 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-white/50 mb-1 block">Color 2</label>
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-full h-10 rounded-lg border border-white/10 bg-white/5 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-2 block">Direction</label>
              <div className="flex flex-wrap gap-2">
                {directions.map((d) => (
                  <Button
                    key={d.value}
                    variant={direction === d.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDirection(d.value)}
                  >
                    {d.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 font-mono">CSS Output</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1 text-xs">
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? t.common.copied : t.common.copy}
                </Button>
              </div>
              <code className="text-xs text-white/70 font-mono break-all">background: {cssValue};</code>
            </div>
          </CardContent>
          <CardFooter className="relative">
            <Button onClick={handleCopy} className="w-full gap-2">
              <Copy className="h-4 w-4" />
              Copy CSS
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <RotateCw className="h-4 w-4 text-purple-400" />
              Preset Gradients
            </CardTitle>
            <CardDescription>Quick-start with beautiful combinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="group relative rounded-xl overflow-hidden aspect-[3/2] border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  style={{
                    background: preset.direction === 'radial'
                      ? `radial-gradient(circle, ${preset.colors[0]}, ${preset.colors[1]})`
                      : `linear-gradient(${preset.direction}, ${preset.colors[0]}, ${preset.colors[1]})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <span className="text-xs font-medium text-white drop-shadow-lg">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
