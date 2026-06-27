import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Weather Dashboard | Forecasts & Conditions',
  description: 'Real-time weather data, hourly forecasts, and multi-day predictions for cities worldwide.',
  openGraph: {
    title: 'Live Weather Dashboard | Forecasts & Conditions',
    description: 'Real-time weather data, hourly forecasts, and multi-day predictions for cities worldwide.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Weather Dashboard | Forecasts & Conditions',
    description: 'Real-time weather data, hourly forecasts, and multi-day predictions for cities worldwide.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
