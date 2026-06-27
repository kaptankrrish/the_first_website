'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

const ConfirmDialog = DialogPrimitive.Root;
const ConfirmDialogTrigger = DialogPrimitive.Trigger;
const ConfirmDialogPortal = DialogPrimitive.Portal;
const ConfirmDialogClose = DialogPrimitive.Close;

const ConfirmDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} asChild {...props}>
    <motion.div
      className={cn(
        'fixed inset-0 z-50 bg-black/80 backdrop-blur-md',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  </DialogPrimitive.Overlay>
));
ConfirmDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface ConfirmDialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  ConfirmDialogContentProps
>(({ className, children, variant = 'danger', ...props }, ref) => (
  <ConfirmDialogPortal>
    <ConfirmDialogOverlay />
    <DialogPrimitive.Content ref={ref} asChild {...props}>
      <motion.div
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 p-6 glass-premium rounded-2xl shadow-2xl',
          className
        )}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </motion.div>
    </DialogPrimitive.Content>
  </ConfirmDialogPortal>
));
ConfirmDialogContent.displayName = DialogPrimitive.Content.displayName;

const ConfirmDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
ConfirmDialogHeader.displayName = 'ConfirmDialogHeader';

const ConfirmDialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
ConfirmDialogTitle.displayName = DialogPrimitive.Title.displayName;

const ConfirmDialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground/70', className)}
    {...props}
  />
));
ConfirmDialogDescription.displayName = DialogPrimitive.Description.displayName;

const ConfirmDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
ConfirmDialogFooter.displayName = 'ConfirmDialogFooter';

interface ConfirmActionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

function ConfirmAction({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
}: ConfirmActionProps) {
  const variantStyles = {
    danger: 'bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-500/20',
    warning: 'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20',
    info: 'bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 shadow-lg shadow-blue-500/20',
  };

  return (
    <ConfirmDialog open={open} onOpenChange={onOpenChange}>
      <ConfirmDialogContent variant={variant}>
        <ConfirmDialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              variant === 'danger' && 'bg-red-500/15 text-red-400',
              variant === 'warning' && 'bg-amber-500/15 text-amber-400',
              variant === 'info' && 'bg-blue-500/15 text-blue-400',
            )}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <ConfirmDialogTitle>{title}</ConfirmDialogTitle>
            </div>
          </div>
          <ConfirmDialogDescription className="mt-2 pl-[52px]">
            {description}
          </ConfirmDialogDescription>
        </ConfirmDialogHeader>
        <ConfirmDialogFooter className="pl-[52px]">
          <ConfirmDialogClose asChild>
            <Button variant="ghost" size="sm">
              {cancelLabel}
            </Button>
          </ConfirmDialogClose>
          <Button
            size="sm"
            className={variantStyles[variant]}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </ConfirmDialogFooter>
      </ConfirmDialogContent>
    </ConfirmDialog>
  );
}

export {
  ConfirmDialog,
  ConfirmDialogTrigger,
  ConfirmDialogContent,
  ConfirmDialogHeader,
  ConfirmDialogFooter,
  ConfirmDialogTitle,
  ConfirmDialogDescription,
  ConfirmDialogClose,
  ConfirmAction,
};
