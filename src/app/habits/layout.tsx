import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Habit Tracker | Build Better Routines',
  description: 'Track daily and weekly habits, build streaks, and transform your routine.',
  openGraph: {
    title: 'Habit Tracker | Build Better Routines',
    description: 'Track daily and weekly habits, build streaks, and transform your routine.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habit Tracker | Build Better Routines',
    description: 'Track daily and weekly habits, build streaks, and transform your routine.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
