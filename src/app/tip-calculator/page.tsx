'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Percent, Users, DollarSign, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

export default function TipCalculatorPage() {
  const { t } = useLanguage();
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState('2');

  const { tipAmount, totalAmount, tipPerPerson, totalPerPerson } = useMemo(() => {
    const b = parseFloat(bill) || 0;
    const p = parseInt(people) || 1;
    const tip = b * (tipPercent / 100);
    const total = b + tip;
    return {
      tipAmount: tip,
      totalAmount: total,
      tipPerPerson: tip / Math.max(p, 1),
      totalPerPerson: total / Math.max(p, 1),
    };
  }, [bill, tipPercent, people]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-lg mx-auto"
    >
      <div className="relative overflow-hidden mb-6">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-3 sm:gap-4 min-w-0">
          <motion.div
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(16,185,129,0.2)]"
          >
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-200" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold uppercase tracking-[0.18em] border border-emerald-400/20 inline-flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                </span>
                Bill Splitter
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
                Instant
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient leading-tight text-balance">
              {t.nav.tipCalc}
            </h1>
            <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
              Split bills and calculate tips instantly
            </p>
          </div>
        </div>

        <div className="mt-5 h-px divider-gradient" />
      </div>

      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-white">Calculate Your Tip</CardTitle>
            <CardDescription>Enter your bill details below</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-white/70 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                Bill Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                <Input
                  type="number"
                  value={bill}
                  onChange={(e) => setBill(e.target.value)}
                  placeholder="0.00"
                  className="pl-7 h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/70 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-emerald-400" />
                  Tip: {tipPercent}%
                </label>
              </div>
              <Slider
                value={[tipPercent]}
                onValueChange={([v]) => setTipPercent(v)}
                min={0}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-white/40">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                Number of People
              </label>
              <Input
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="1"
                min={1}
                className="h-12 text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <div className="text-xs text-white/40 mb-1">Tip / Person</div>
                <div className="text-2xl font-bold text-emerald-400">
                  ${tipPerPerson.toFixed(2)}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <div className="text-xs text-white/40 mb-1">Total / Person</div>
                <div className="text-2xl font-bold text-white">
                  ${totalPerPerson.toFixed(2)}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center col-span-2">
                <div className="text-xs text-white/40 mb-1">Total Bill (with tip)</div>
                <div className="text-2xl font-bold text-white">
                  ${totalAmount.toFixed(2)}
                  <span className="text-sm font-normal text-white/40 ml-2">
                    (${tipAmount.toFixed(2)} tip)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
