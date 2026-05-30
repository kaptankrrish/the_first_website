'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Check, RefreshCw } from 'lucide-react';
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
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Key className="h-7 w-7 text-blue-400" />
          {t.nav.passwordGen}
        </h1>
        <p className="text-white/50 mt-1">Create secure, random passwords instantly</p>
      </motion.div>

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
