'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Percent, Users, DollarSign, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { useLanguage } from '@/contexts/LanguageContext';

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
    <PageWrapper
      icon={Receipt}
      title={t.nav.tipCalc}
      subtitle="Split bills and calculate tips instantly"
      badgeText="Bill Splitter"
      colorScheme="emerald"
    >
      <div className="max-w-lg mx-auto">
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card className="overflow-hidden bg-white/[0.03] backdrop-blur-xl border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-white">Calculate Your Tip</CardTitle>
              <CardDescription>Enter your bill details below</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              
              <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    Bill Amount
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/40 blur transition duration-300"></div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">$</span>
                      <Input
                        type="number"
                        value={bill}
                        onChange={(e) => setBill(e.target.value)}
                        placeholder="0.00"
                        className="pl-9 h-14 text-xl bg-black/40 border-white/10 text-white placeholder:text-white/20 transition-all focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-emerald-400" />
                      Tip: <span className="text-emerald-300">{tipPercent}%</span>
                    </label>
                  </div>
                  <Slider
                    value={[tipPercent]}
                    onValueChange={([v]) => setTipPercent(v)}
                    min={0}
                    max={100}
                    step={1}
                    className="[&_[role=slider]]:bg-emerald-400 [&_[role=slider]]:border-emerald-300 [&_[role=slider]]:shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                  />
                  <div className="flex justify-between text-xs text-white/40 font-mono">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                    Number of People
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 blur transition duration-300"></div>
                    <Input
                      type="number"
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                      placeholder="1"
                      min={1}
                      className="relative h-14 text-xl text-center bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Animated Results Display */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-5 text-center shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-400/5 group-hover:bg-emerald-400/10 transition-colors" />
                  <div className="relative">
                    <div className="text-xs text-emerald-200/70 mb-1 uppercase tracking-wider font-semibold">Tip / Person</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tipPerPerson}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="text-3xl font-bold text-emerald-400"
                      >
                        ${tipPerPerson.toFixed(2)}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-5 text-center shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
                  <div className="relative">
                    <div className="text-xs text-white/60 mb-1 uppercase tracking-wider font-semibold">Total / Person</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={totalPerPerson}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      >
                        ${totalPerPerson.toFixed(2)}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 p-5 text-center shadow-lg col-span-2 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors" />
                  <div className="relative">
                    <div className="text-xs text-cyan-200/70 mb-1 uppercase tracking-wider font-semibold">Total Bill (with tip)</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={totalAmount}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 drop-shadow-sm flex items-center justify-center gap-3"
                      >
                        ${totalAmount.toFixed(2)}
                        <span className="text-sm font-medium text-cyan-300/50 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                          +${tipAmount.toFixed(2)} tip
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
