'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative p-8 rounded-2xl glass-strong border-white/10 max-w-md w-full overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="text-8xl font-bold text-gradient"
          >
            404
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
          
          <p className="text-sm text-white/50 max-w-[280px]">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <div className="flex items-center gap-3 mt-4">
            <Link href="/">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
