import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tip Calculator | Split Bills Easily',
  description: 'Calculate tips and split bills quickly with a beautiful, intuitive interface.',
  openGraph: {
    title: 'Tip Calculator | Split Bills Easily',
    description: 'Calculate tips and split bills quickly with a beautiful, intuitive interface.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tip Calculator | Split Bills Easily',
    description: 'Calculate tips and split bills quickly with a beautiful, intuitive interface.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
