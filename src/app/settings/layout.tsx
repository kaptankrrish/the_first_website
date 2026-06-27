import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Customize Your Experience',
  description: 'Personalize themes, languages, font sizes, and notification preferences.',
  openGraph: {
    title: 'Settings | Customize Your Experience',
    description: 'Personalize themes, languages, font sizes, and notification preferences.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settings | Customize Your Experience',
    description: 'Personalize themes, languages, font sizes, and notification preferences.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
