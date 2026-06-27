import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mathematics Hub | Formulas & Problem Solving',
  description: 'Practice algebra, calculus, geometry, and more with step-by-step solutions.',
  openGraph: {
    title: 'Mathematics Hub | Formulas & Problem Solving',
    description: 'Practice algebra, calculus, geometry, and more with step-by-step solutions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mathematics Hub | Formulas & Problem Solving',
    description: 'Practice algebra, calculus, geometry, and more with step-by-step solutions.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
