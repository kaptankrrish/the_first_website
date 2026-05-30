'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Home, Percent, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Home className="h-7 w-7 text-blue-400" />
          {t.nav.mortgageCalc}
        </h1>
        <p className="text-white/50 mt-1">Estimate your monthly payments and interest</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-white">Loan Details</CardTitle>
            <CardDescription>Enter your loan information</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-white/70 flex items-center gap-2">
                <Home className="h-4 w-4 text-blue-400" />
                Loan Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="300000"
                  className="pl-7 h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70 flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-400" />
                Interest Rate (%)
              </label>
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="6.5"
                step="0.1"
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/70 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  Loan Term: {term} years
                </label>
              </div>
              <Slider
                value={[term]}
                onValueChange={([v]) => setTerm(v)}
                min={5}
                max={40}
                step={5}
              />
              <div className="flex justify-between text-xs text-white/40">
                <span>5</span>
                <span>40</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <div className="text-xs text-white/40 mb-1">Monthly</div>
                <div className="text-lg sm:text-xl font-bold text-emerald-400">
                  ${monthlyPayment.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <div className="text-xs text-white/40 mb-1">Total Interest</div>
                <div className="text-lg sm:text-xl font-bold text-amber-400">
                  ${totalInterest.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <div className="text-xs text-white/40 mb-1">Total Payment</div>
                <div className="text-lg sm:text-xl font-bold text-white">
                  ${totalPayment.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {amortization.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
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
                      contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                    <Bar dataKey="principal" name="Principal" fill="#22c55e" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="interest" name="Interest" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
