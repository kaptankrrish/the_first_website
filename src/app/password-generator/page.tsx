'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Copy, Check, RefreshCw, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { PageWrapper } from '@/components/layout/page-wrapper';
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

function getStrength(password: string): { label: string; color: string; variant: 'destructive' | 'warning' | 'default' | 'success'; percent: number } {
  let score = 0;
  if (password.length >= 12) score += 1;
  if (password.length >= 20) score += 1;
  if (password.length >= 32) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  if (score <= 2) return { label: 'Weak', color: 'from-red-500 to-red-400', variant: 'destructive', percent: 25 };
  if (score <= 4) return { label: 'Medium', color: 'from-amber-500 to-orange-400', variant: 'warning', percent: 50 };
  if (score <= 6) return { label: 'Strong', color: 'from-emerald-500 to-emerald-400', variant: 'default', percent: 75 };
  return { label: 'Very Strong', color: 'from-emerald-400 to-cyan-400', variant: 'success', percent: 100 };
}

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
    <PageWrapper
      icon={Key}
      title={t.nav.passwordGen}
      subtitle="Create secure, random passwords instantly"
      badgeText="Secure"
      colorScheme="fuchsia"
    >
      <div className="max-w-lg mx-auto">
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Card className="overflow-hidden bg-white/[0.02] backdrop-blur-xl border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="text-white">Generate Password</CardTitle>
              <CardDescription>Customize your password settings below</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              
              {/* Password Display with Shimmer Border */}
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-50 blur transition duration-500 group-hover:duration-200 animate-gradient-xy"></div>
                <div className="relative">
                  <Input
                    value={password}
                    readOnly
                    placeholder="Click generate to create a password"
                    className="pr-20 text-lg font-mono tracking-wider h-14 bg-black/40 border-white/10 text-white placeholder:text-white/20"
                  />
                  {password && (
                    <div className="absolute right-1.5 top-1.5 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCopy} 
                        className={cn(
                          "h-11 w-11 transition-all duration-300 relative overflow-hidden",
                          copied ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300" : "bg-white/5 text-white/70 hover:bg-fuchsia-500/20 hover:text-fuchsia-300 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Copy className="h-4 w-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {strength && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden border border-white/5 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${strength.percent}%` }}
                      transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                      className={cn('h-full rounded-full bg-gradient-to-r shadow-[0_0_10px_rgba(255,255,255,0.2)]', strength.color)}
                    />
                  </div>
                  <Badge variant={strength.variant} className="animate-fade-in">{strength.label}</Badge>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/80">Length: <span className="text-fuchsia-400">{length}</span></span>
                </div>
                <Slider
                  value={[length]}
                  onValueChange={([v]) => setLength(v)}
                  min={8}
                  max={64}
                  step={1}
                  className="[&_[role=slider]]:bg-fuchsia-400 [&_[role=slider]]:border-fuchsia-300 [&_[role=slider]]:shadow-[0_0_10px_rgba(217,70,239,0.5)]"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>8</span>
                  <span>64</span>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                {[
                  { key: 'upper', label: 'Uppercase (A-Z)' },
                  { key: 'lower', label: 'Lowercase (a-z)' },
                  { key: 'numbers', label: 'Numbers (0-9)' },
                  { key: 'symbols', label: 'Symbols (!@#$%)' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{label}</span>
                    <Switch
                      checked={opts[key as keyof typeof opts]}
                      onCheckedChange={(v) => setOpts((prev) => ({ ...prev, [key]: v }))}
                      className="data-[state=checked]:bg-fuchsia-500"
                    />
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleGenerate} 
                size="lg" 
                className="w-full gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 border-0 shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                Generate Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
