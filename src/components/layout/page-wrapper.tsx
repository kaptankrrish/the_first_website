"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { LiveClock } from "@/components/ui/live-clock";

interface PageWrapperProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge?: string;
  badgeText?: ReactNode;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'fuchsia' | 'cyan' | 'blue' | 'slate';
  actions?: ReactNode;
  children?: ReactNode;
}

const colorMaps = {
  indigo: {
    bg: "bg-indigo-500/10",
    glow: "shadow-[0_0_24px_rgba(139,92,246,0.2)]",
    gradient: "from-indigo-500/20 via-violet-500/20 to-purple-500/20",
    icon: "text-indigo-200",
    badgeBg: "bg-indigo-500/15",
    badgeText: "text-indigo-300",
    badgeBorder: "border-indigo-400/20",
    ping: "bg-indigo-400",
    dotShadow: "shadow-[0_0_6px_rgba(129,140,248,0.8)]"
  },
  emerald: {
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_24px_rgba(16,185,129,0.2)]",
    gradient: "from-emerald-500/20 via-teal-500/20 to-green-500/20",
    icon: "text-emerald-200",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-300",
    badgeBorder: "border-emerald-400/20",
    ping: "bg-emerald-400",
    dotShadow: "shadow-[0_0_6px_rgba(52,211,153,0.8)]"
  },
  amber: {
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_24px_rgba(245,158,11,0.2)]",
    gradient: "from-amber-500/20 via-orange-500/20 to-yellow-500/20",
    icon: "text-amber-200",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-300",
    badgeBorder: "border-amber-400/20",
    ping: "bg-amber-400",
    dotShadow: "shadow-[0_0_6px_rgba(251,191,36,0.8)]"
  },
  rose: {
    bg: "bg-rose-500/10",
    glow: "shadow-[0_0_24px_rgba(244,63,94,0.2)]",
    gradient: "from-rose-500/20 via-red-500/20 to-pink-500/20",
    icon: "text-rose-200",
    badgeBg: "bg-rose-500/15",
    badgeText: "text-rose-300",
    badgeBorder: "border-rose-400/20",
    ping: "bg-rose-400",
    dotShadow: "shadow-[0_0_6px_rgba(251,113,133,0.8)]"
  },
  fuchsia: {
    bg: "bg-fuchsia-500/10",
    glow: "shadow-[0_0_24px_rgba(217,70,239,0.2)]",
    gradient: "from-fuchsia-500/20 via-purple-500/20 to-pink-500/20",
    icon: "text-fuchsia-200",
    badgeBg: "bg-fuchsia-500/15",
    badgeText: "text-fuchsia-300",
    badgeBorder: "border-fuchsia-400/20",
    ping: "bg-fuchsia-400",
    dotShadow: "shadow-[0_0_6px_rgba(232,121,249,0.8)]"
  },
  cyan: {
    bg: "bg-cyan-500/10",
    glow: "shadow-[0_0_24px_rgba(6,182,212,0.2)]",
    gradient: "from-cyan-500/20 via-sky-500/20 to-blue-500/20",
    icon: "text-cyan-200",
    badgeBg: "bg-cyan-500/15",
    badgeText: "text-cyan-300",
    badgeBorder: "border-cyan-400/20",
    ping: "bg-cyan-400",
    dotShadow: "shadow-[0_0_6px_rgba(34,211,238,0.8)]"
  },
  blue: {
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_24px_rgba(59,130,246,0.2)]",
    gradient: "from-blue-500/20 via-indigo-500/20 to-sky-500/20",
    icon: "text-blue-200",
    badgeBg: "bg-blue-500/15",
    badgeText: "text-blue-300",
    badgeBorder: "border-blue-400/20",
    ping: "bg-blue-400",
    dotShadow: "shadow-[0_0_6px_rgba(96,165,250,0.8)]"
  },
  slate: {
    bg: "bg-slate-500/10",
    glow: "shadow-[0_0_24px_rgba(100,116,139,0.2)]",
    gradient: "from-slate-500/20 via-gray-500/20 to-zinc-500/20",
    icon: "text-slate-200",
    badgeBg: "bg-slate-500/15",
    badgeText: "text-slate-300",
    badgeBorder: "border-slate-400/20",
    ping: "bg-slate-400",
    dotShadow: "shadow-[0_0_6px_rgba(148,163,184,0.8)]"
  }
};

export function PageWrapper({
  icon: Icon,
  title,
  subtitle,
  badge = "Track",
  badgeText = "Live",
  colorScheme = "indigo",
  actions,
  children
}: PageWrapperProps) {
  const colors = colorMaps[colorScheme];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden">
        <div className={cn("absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none", colors.bg)} />
        <div className={cn("absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-50", colors.bg)} />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-white/10 flex items-center justify-center shrink-0 bg-gradient-to-br", colors.gradient, colors.glow)}
            >
              <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", colors.icon)} />
            </motion.div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] border inline-flex items-center gap-1.5", colors.badgeBg, colors.badgeText, colors.badgeBorder)}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", colors.ping)} />
                    <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", colors.ping, colors.dotShadow)} />
                  </span>
                  {badgeText}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold inline-flex items-center gap-1.5">
                  <LiveClock />
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient leading-tight text-balance">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                {subtitle}
              </p>
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>

        <div className="mt-5 h-px divider-gradient" />
      </div>

      {children && (
        <div className="animate-fade-up">
          {children}
        </div>
      )}
    </div>
  );
}
