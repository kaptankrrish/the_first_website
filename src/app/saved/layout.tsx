import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Items | Your Reading List',
  description: 'Access your saved articles, quotes, movies, and learning content in one place.',
  openGraph: {
    title: 'Saved Items | Your Reading List',
    description: 'Access your saved articles, quotes, movies, and learning content in one place.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saved Items | Your Reading List',
    description: 'Access your saved articles, quotes, movies, and learning content in one place.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
