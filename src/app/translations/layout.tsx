import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Multi-Language Translations | Sanskrit to Modern Languages',
  description: 'Access translations of ancient texts in English, Hindi, Spanish, and more.',
  openGraph: {
    title: 'Multi-Language Translations | Sanskrit to Modern Languages',
    description: 'Access translations of ancient texts in English, Hindi, Spanish, and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multi-Language Translations | Sanskrit to Modern Languages',
    description: 'Access translations of ancient texts in English, Hindi, Spanish, and more.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
