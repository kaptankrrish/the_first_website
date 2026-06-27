import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Feed | Insights & Articles',
  description: 'Read curated blog posts on technology, science, philosophy, and productivity.',
  openGraph: {
    title: 'Blog Feed | Insights & Articles',
    description: 'Read curated blog posts on technology, science, philosophy, and productivity.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Feed | Insights & Articles',
    description: 'Read curated blog posts on technology, science, philosophy, and productivity.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
