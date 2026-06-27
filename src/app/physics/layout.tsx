import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Physics Universe | Laws & Experiments',
  description: 'Master physics concepts from mechanics to quantum theory with formulas and practice problems.',
  openGraph: {
    title: 'Physics Universe | Laws & Experiments',
    description: 'Master physics concepts from mechanics to quantum theory with formulas and practice problems.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Physics Universe | Laws & Experiments',
    description: 'Master physics concepts from mechanics to quantum theory with formulas and practice problems.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
