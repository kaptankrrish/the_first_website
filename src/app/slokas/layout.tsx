import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sacred Slokas | Daily Verses & Meanings',
  description: 'Read powerful slokas from Hindu scriptures with detailed meanings and interpretations.',
  openGraph: {
    title: 'Sacred Slokas | Daily Verses & Meanings',
    description: 'Read powerful slokas from Hindu scriptures with detailed meanings and interpretations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sacred Slokas | Daily Verses & Meanings',
    description: 'Read powerful slokas from Hindu scriptures with detailed meanings and interpretations.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
