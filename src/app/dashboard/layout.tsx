import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Dashboard | Productivity & Insights',
  description: 'Your all-in-one overview of news, tasks, habits, weather, and learning progress.',
  openGraph: {
    title: 'Personal Dashboard | Productivity & Insights',
    description: 'Your all-in-one overview of news, tasks, habits, weather, and learning progress.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Dashboard | Productivity & Insights',
    description: 'Your all-in-one overview of news, tasks, habits, weather, and learning progress.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
