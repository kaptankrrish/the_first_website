import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Todo List | Task Management',
  description: 'Organize your tasks with priorities, categories, and due dates. Never miss a deadline.',
  openGraph: {
    title: 'Smart Todo List | Task Management',
    description: 'Organize your tasks with priorities, categories, and due dates. Never miss a deadline.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Todo List | Task Management',
    description: 'Organize your tasks with priorities, categories, and due dates. Never miss a deadline.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
