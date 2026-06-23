'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Check, RefreshCw, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';

function generatePassword(length: number, opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let chars = '';
  if (opts.upper) chars += upper;
  if (opts.lower) chars += lower;
  if (opts.numbers) chars += numbers;
  if (opts.symbols) chars += symbols;
  if (!chars) return '';
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

function getStrength(password: string): { label: string; color: string; variant: 'destructive' | 'warning' | 'default' | 'success' } {
  let score = 0;
  if (password.length >= 12) score += 1;
  if (password.length >= 20) score += 1;
  if (password.length >= 32) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', variant: 'destructive' };
  if (score <= 4) return { label: 'Medium', color: 'bg-amber-500', variant: 'warning' };
  if (score <= 6) return { label: 'Strong', color: 'bg-emerald-500', variant: 'default' };
  return { label: 'Very Strong', color: 'bg-emerald-400', variant: 'success' };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

export default function PasswordGeneratorPage() {
  const { t } = useLanguage();
  const [length, setLength] = useState(24);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const strength = useMemo(() => (password ? getStrength(password) : null), [password]);

  const handleGenerate = useCallback(() => {
    setPassword(generatePassword(length, opts));
    setCopied(false);
  }, [length, opts]);

  const handleCopy = useCallback(async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-lg mx-auto"
    >
      <div className="relative overflow-hidden mb-6">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-3 sm:gap-4 min-w-0">
          <motion.div
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(217,70,239,0.2)]"
          >
            <Key className="w-5 h-5 sm:w-6 sm:h-6 text-fuchsia-200" />
          </motion.div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 text-[10px] font-semibold uppercase tracking-[0.18em] border border-fuchsia-400/20 inline-flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(232,121,249,0.8)]" />
                </span>
                <ShieldCheck className="h-3 w-3" />
                Secure
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
                Cryptographic
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient leading-tight text-balance">
              {t.nav.passwordGen}
            </h1>
            <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
              Create secure, random passwords instantly
            </p>
          </div>
        </div>

        <div className="mt-5 h-px divider-gradient" />
      </div>

      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="text-white">Generate Password</CardTitle>
            <CardDescription>Customize your password settings below</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <div className="relative">
              <Input
                value={password}
                readOnly
                placeholder="Click generate to create a password"
                className="pr-20 text-lg font-mono tracking-wider h-12"
              />
              {password && (
                <div className="absolute right-1 top-1 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={handleCopy} className="h-10 w-10">
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>

            {strength && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(strength.label === 'Weak' ? 25 : strength.label === 'Medium' ? 50 : strength.label === 'Strong' ? 75 : 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className={cn('h-full rounded-full transition-all', strength.color)}
                  />
                </div>
                <Badge variant={strength.variant}>{strength.label}</Badge>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Length: {length}</span>
              </div>
              <Slider
                value={[length]}
                onValueChange={([v]) => setLength(v)}
                min={8}
                max={64}
                step={1}
              />
              <div className="flex justify-between text-xs text-white/40">
                <span>8</span>
                <span>64</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'upper', label: 'Uppercase (A-Z)' },
                { key: 'lower', label: 'Lowercase (a-z)' },
                { key: 'numbers', label: 'Numbers (0-9)' },
                { key: 'symbols', label: 'Symbols (!@#$%)' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{label}</span>
                  <Switch
                    checked={opts[key as keyof typeof opts]}
                    onCheckedChange={(v) => setOpts((prev) => ({ ...prev, [key]: v }))}
                  />
                </div>
              ))}
            </div>

            <Button onClick={handleGenerate} size="lg" className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
