import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Science Explorer | Research & Discoveries',
  description: 'Dive into scientific topics, research papers, and interactive learning modules.',
  openGraph: {
    title: 'Science Explorer | Research & Discoveries',
    description: 'Dive into scientific topics, research papers, and interactive learning modules.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science Explorer | Research & Discoveries',
    description: 'Dive into scientific topics, research papers, and interactive learning modules.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
