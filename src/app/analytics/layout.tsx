import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Data Insights & Charts',
  description: 'Visualize your productivity, reading habits, and ecosystem usage with interactive charts.',
  openGraph: {
    title: 'Analytics Dashboard | Data Insights & Charts',
    description: 'Visualize your productivity, reading habits, and ecosystem usage with interactive charts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Analytics Dashboard | Data Insights & Charts',
    description: 'Visualize your productivity, reading habits, and ecosystem usage with interactive charts.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
