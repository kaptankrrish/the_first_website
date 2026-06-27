import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Calculator | Plan Your Home Loan',
  description: 'Estimate monthly payments, total interest, and amortization schedules.',
  openGraph: {
    title: 'Mortgage Calculator | Plan Your Home Loan',
    description: 'Estimate monthly payments, total interest, and amortization schedules.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator | Plan Your Home Loan',
    description: 'Estimate monthly payments, total interest, and amortization schedules.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
