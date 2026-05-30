import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/layout/providers';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import AnimatedBackground from '@/components/layout/animated-background';
import CommandPalette from '@/components/layout/command-palette';
import FloatingSearch from '@/components/layout/floating-search';
import GlobalHeader from '@/components/layout/global-header';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'AI Knowledge Ecosystem',
    description: 'A futuristic AI-powered knowledge platform combining news, learning, productivity, and insights.',
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8234588609544093"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-full">
        <Providers>
          <AnimatedBackground />
          <Sidebar />
          <CommandPalette />
          <FloatingSearch />
          <main className="lg:pl-[260px] min-h-screen relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
              <GlobalHeader />
              {children}
            </div>
          </main>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
