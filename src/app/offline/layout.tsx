import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline | AI Knowledge Ecosystem',
  description: 'You are currently offline.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}