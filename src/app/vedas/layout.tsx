import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sacred Vedas | Ancient Texts & Translations',
  description: 'Read and study the four Vedas with original Sanskrit, transliterations, and multi-language translations.',
  openGraph: {
    title: 'Sacred Vedas | Ancient Texts & Translations',
    description: 'Read and study the four Vedas with original Sanskrit, transliterations, and multi-language translations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sacred Vedas | Ancient Texts & Translations',
    description: 'Read and study the four Vedas with original Sanskrit, transliterations, and multi-language translations.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
