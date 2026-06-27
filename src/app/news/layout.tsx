import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI News Feed | Real-Time Global Headlines',
  description: 'Stay informed with live news from BBC, Reuters, TechCrunch, WIRED, NPR, and Al Jazeera. AI-powered categorization and smart search.',
  openGraph: {
    title: 'AI News Feed | Real-Time Global Headlines',
    description: 'Stay informed with live news from BBC, Reuters, TechCrunch, WIRED, NPR, and Al Jazeera. AI-powered categorization and smart search.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI News Feed | Real-Time Global Headlines',
    description: 'Stay informed with live news from BBC, Reuters, TechCrunch, WIRED, NPR, and Al Jazeera. AI-powered categorization and smart search.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
