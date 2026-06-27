import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Quotes | Wisdom & Inspiration',
  description: 'Discover motivational quotes from philosophers, scientists, and thought leaders.',
  openGraph: {
    title: 'Daily Quotes | Wisdom & Inspiration',
    description: 'Discover motivational quotes from philosophers, scientists, and thought leaders.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Quotes | Wisdom & Inspiration',
    description: 'Discover motivational quotes from philosophers, scientists, and thought leaders.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
