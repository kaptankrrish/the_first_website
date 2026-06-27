import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keyboard Shortcuts | Navigate Like a Pro',
  description: 'Master keyboard shortcuts to fly through the ecosystem.',
  openGraph: {
    title: 'Keyboard Shortcuts | Navigate Like a Pro',
    description: 'Master keyboard shortcuts to fly through the ecosystem.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyboard Shortcuts | Navigate Like a Pro',
    description: 'Master keyboard shortcuts to fly through the ecosystem.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
