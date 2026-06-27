import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vedic Learning | Ancient Knowledge System',
  description: 'Explore Vedic philosophy, scriptures, and meditation techniques with guided lessons.',
  openGraph: {
    title: 'Vedic Learning | Ancient Knowledge System',
    description: 'Explore Vedic philosophy, scriptures, and meditation techniques with guided lessons.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vedic Learning | Ancient Knowledge System',
    description: 'Explore Vedic philosophy, scriptures, and meditation techniques with guided lessons.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
