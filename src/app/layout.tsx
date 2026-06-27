import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/layout/providers';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import AnimatedBackground from '@/components/layout/animated-background';
import CommandPalette from '@/components/layout/command-palette';
import FloatingSearch from '@/components/layout/floating-search';
import GlobalHeader from '@/components/layout/global-header';
import { OnboardingTour } from '@/components/features/onboarding-tour';
import { KeyboardShortcutsOverlay } from '@/components/features/keyboard-shortcuts';
import { SidebarCollapseBridge } from '@/components/layout/sidebar-collapse-bridge';
import { BackToTop } from '@/components/ui/back-to-top';
import { PageTransition } from '@/components/ui/page-transition';
import { FocusManager } from '@/components/features/focus-manager';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'AI Knowledge Ecosystem | Infinite Knowledge Base',
    description: 'A futuristic AI-powered knowledge platform combining real-time news, learning modules, productivity tools, crypto tracking, weather, and Vedic wisdom.',
    keywords: ['AI', 'knowledge', 'news', 'learning', 'productivity', 'crypto', 'weather', 'vedic', 'ecosystem'],
    authors: [{ name: 'AI Knowledge Ecosystem' }],
    openGraph: {
      title: 'AI Knowledge Ecosystem',
      description: 'A futuristic AI-powered knowledge platform combining real-time news, learning modules, productivity tools, crypto tracking, weather, and Vedic wisdom.',
      type: 'website',
      siteName: 'AI Knowledge Ecosystem',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Knowledge Ecosystem',
      description: 'A futuristic AI-powered knowledge platform combining real-time news, learning modules, productivity tools, crypto tracking, weather, and Vedic wisdom.',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#05050a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full">
        <Providers>
          <AnimatedBackground />
          <Sidebar />
          <CommandPalette />
          <FloatingSearch />
          <main className="lg:pl-[264px] min-h-screen relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6 safe-area-top">
              <GlobalHeader />
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </main>
          <MobileNav />
          <BackToTop />
          <OnboardingTour />
          <KeyboardShortcutsOverlay />
          <SidebarCollapseBridge />
          <FocusManager />
        </Providers>
      </body>
    </html>
  );
}
