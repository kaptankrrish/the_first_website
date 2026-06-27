import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Learning | Knowledge Modules',
  description: 'Structured learning paths across science, technology, and humanities with progress tracking.',
  openGraph: {
    title: 'Daily Learning | Knowledge Modules',
    description: 'Structured learning paths across science, technology, and humanities with progress tracking.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Learning | Knowledge Modules',
    description: 'Structured learning paths across science, technology, and humanities with progress tracking.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
