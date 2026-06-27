import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Universal Search | Find Anything',
  description: 'Search across news, science, notes, quotes, and Vedic content with instant results.',
  openGraph: {
    title: 'Universal Search | Find Anything',
    description: 'Search across news, science, notes, quotes, and Vedic content with instant results.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universal Search | Find Anything',
    description: 'Search across news, science, notes, quotes, and Vedic content with instant results.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
