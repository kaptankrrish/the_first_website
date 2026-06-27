import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pomodoro Timer | Focus & Productivity',
  description: 'Boost your focus with the Pomodoro technique. Track sessions and total focus time.',
  openGraph: {
    title: 'Pomodoro Timer | Focus & Productivity',
    description: 'Boost your focus with the Pomodoro technique. Track sessions and total focus time.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodoro Timer | Focus & Productivity',
    description: 'Boost your focus with the Pomodoro technique. Track sessions and total focus time.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
