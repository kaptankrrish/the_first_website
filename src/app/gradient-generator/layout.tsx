import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gradient Generator | Beautiful Color Gradients',
  description: 'Create stunning CSS gradients with live preview and copy-to-clipboard.',
  openGraph: {
    title: 'Gradient Generator | Beautiful Color Gradients',
    description: 'Create stunning CSS gradients with live preview and copy-to-clipboard.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gradient Generator | Beautiful Color Gradients',
    description: 'Create stunning CSS gradients with live preview and copy-to-clipboard.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
