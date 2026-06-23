'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  gradient?: boolean;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  gradient = true,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('relative mb-6 sm:mb-8', className)}
    >
      {/* Aurora accents */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 right-0 w-48 h-48 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {Icon && (
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500/15 via-purple-500/15 to-pink-500/15 border border-white/8 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(96,165,250,0.15)]"
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200" />
            </motion.div>
          )}
          <div className="min-w-0">
            {badge && (
              <span className="inline-block mb-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                {badge}
              </span>
            )}
            <h1 className={cn(
              'text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-pretty tracking-tight',
              gradient ? 'text-gradient' : 'text-foreground/90'
            )}>
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-sm text-muted-foreground/70 max-w-2xl text-pretty">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      <div className="relative mt-5 h-px divider-gradient" />
    </motion.header>
  );
}

interface SectionProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Section({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section className={cn('mb-8 sm:mb-10', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/12 to-purple-500/12 border border-white/5 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-blue-300" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h2 className="text-base sm:text-lg font-semibold text-foreground/90 truncate">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[11px] text-muted-foreground/55 truncate">
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
