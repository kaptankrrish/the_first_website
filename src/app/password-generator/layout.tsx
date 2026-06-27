import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Generator | Secure & Random',
  description: 'Generate strong, secure passwords with customizable length and character options.',
  openGraph: {
    title: 'Password Generator | Secure & Random',
    description: 'Generate strong, secure passwords with customizable length and character options.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Password Generator | Secure & Random',
    description: 'Generate strong, secure passwords with customizable length and character options.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
