import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movie Explorer | Discover Trending Films',
  description: 'Browse trending movies, search by genre, and build your watchlist with TMDB-powered recommendations.',
  openGraph: {
    title: 'Movie Explorer | Discover Trending Films',
    description: 'Browse trending movies, search by genre, and build your watchlist with TMDB-powered recommendations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movie Explorer | Discover Trending Films',
    description: 'Browse trending movies, search by genre, and build your watchlist with TMDB-powered recommendations.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
