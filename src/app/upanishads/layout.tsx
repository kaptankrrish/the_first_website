import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upanishads | Philosophical Wisdom',
  description: 'Explore the profound philosophical teachings of the Upanishads with explanations and commentary.',
  openGraph: {
    title: 'Upanishads | Philosophical Wisdom',
    description: 'Explore the profound philosophical teachings of the Upanishads with explanations and commentary.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upanishads | Philosophical Wisdom',
    description: 'Explore the profound philosophical teachings of the Upanishads with explanations and commentary.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
