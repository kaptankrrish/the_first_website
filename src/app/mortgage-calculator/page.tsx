'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Percent, Calendar, Banknote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { useLanguage } from '@/contexts/LanguageContext';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

export default function MortgageCalculatorPage() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('300000');
  const [rate, setRate] = useState('6.5');
  const [term, setTerm] = useState(30);

  const { monthlyPayment, totalPayment, totalInterest, amortization } = useMemo(() => {
    const p = parseFloat(amount) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = term * 12;
    if (p <= 0 || r <= 0 || n <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, amortization: [] };
    }
    const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - p;

    const amortization: { year: string; principal: number; interest: number }[] = [];
    let balance = p;
    for (let y = 1; y <= term; y++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let m = 1; m <= 12; m++) {
        const intPortion = balance * r;
        const prinPortion = monthly - intPortion;
        yearlyPrincipal += prinPortion;
        yearlyInterest += intPortion;
        balance -= prinPortion;
        if (balance < 0) balance = 0;
      }
      amortization.push({
        year: `Year ${y}`,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
      });
      if (balance <= 0) break;
    }
    return {
      monthlyPayment: Math.round(monthly * 100) / 100,
      totalPayment: Math.round(total * 100) / 100,
      totalInterest: Math.round(interest * 100) / 100,
      amortization,
    };
  }, [amount, rate, term]);

  return (
    <PageWrapper
      icon={Banknote}
      title={t.nav.mortgageCalc}
      subtitle="Estimate your monthly payments and interest"
      badgeText={`${term}-year term`}
      colorScheme="blue"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card className="overflow-hidden bg-white/[0.03] backdrop-blur-xl border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-white">Loan Details</CardTitle>
              <CardDescription>Enter your loan information</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Home className="h-4 w-4 text-blue-400" />
                    Loan Amount
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/40 blur transition duration-300"></div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">$</span>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="300000"
                        className="pl-9 h-12 text-lg bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Percent className="h-4 w-4 text-blue-400" />
                    Interest Rate (%)
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/40 blur transition duration-300"></div>
                    <Input
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="6.5"
                      step="0.1"
                      className="relative h-12 text-lg bg-black/40 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      Loan Term: <span className="text-blue-300">{term} years</span>
                    </label>
                  </div>
                  <Slider
                    value={[term]}
                    onValueChange={([v]) => setTerm(v)}
                    min={5}
                    max={40}
                    step={5}
                    className="[&_[role=slider]]:bg-blue-400 [&_[role=slider]]:border-blue-300 [&_[role=slider]]:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                  <div className="flex justify-between text-xs text-white/40 font-mono">
                    <span>5y</span>
                    <span>40y</span>
                  </div>
                </div>
              </div>

              {/* Gradient Result Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 p-5 text-center shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/10 transition-colors duration-500" />
                  <div className="text-xs text-emerald-200/80 mb-2 uppercase tracking-wider font-semibold">Monthly</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={monthlyPayment}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-2xl font-black text-emerald-400 drop-shadow-md"
                    >
                      ${monthlyPayment.toLocaleString()}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 p-5 text-center shadow-[0_0_15px_rgba(245,158,11,0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/10 transition-colors duration-500" />
                  <div className="text-xs text-amber-200/80 mb-2 uppercase tracking-wider font-semibold">Total Interest</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={totalInterest}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-2xl font-black text-amber-400 drop-shadow-md"
                    >
                      ${totalInterest.toLocaleString()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30 p-5 text-center shadow-[0_0_15px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/10 transition-colors duration-500" />
                  <div className="text-xs text-blue-200/80 mb-2 uppercase tracking-wider font-semibold">Total Payment</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={totalPayment}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                    >
                      ${totalPayment.toLocaleString()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Animated Chart */}
        <AnimatePresence>
          {amortization.length > 0 && (
            <motion.div 
              variants={itemVariants} 
              initial="hidden" 
              animate="visible"
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="overflow-hidden bg-white/[0.03] backdrop-blur-xl border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Amortization Schedule</CardTitle>
                  <CardDescription>Principal vs Interest Over Years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height={256}>
                      <BarChart data={amortization} barCategoryGap={2}>
                        <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} interval={Math.max(1, Math.floor(amortization.length / 8))} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                          labelStyle={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', marginBottom: '8px' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar 
                          dataKey="principal" 
                          name="Principal" 
                          fill="#3b82f6" 
                          radius={[0, 0, 0, 0]} 
                          stackId="a"
                          animationDuration={1500}
                        />
                        <Bar 
                          dataKey="interest" 
                          name="Interest" 
                          fill="#f59e0b" 
                          radius={[4, 4, 0, 0]} 
                          stackId="a"
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
