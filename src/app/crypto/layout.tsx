import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Market Tracker | Live Prices & Charts',
  description: 'Track Bitcoin, Ethereum, and top cryptocurrencies with live prices, sparkline charts, and market cap data.',
  openGraph: {
    title: 'Crypto Market Tracker | Live Prices & Charts',
    description: 'Track Bitcoin, Ethereum, and top cryptocurrencies with live prices, sparkline charts, and market cap data.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Market Tracker | Live Prices & Charts',
    description: 'Track Bitcoin, Ethereum, and top cryptocurrencies with live prices, sparkline charts, and market cap data.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
