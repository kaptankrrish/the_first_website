import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chemistry Lab | Compounds & Reactions',
  description: 'Explore chemical compounds, molecular structures, and interactive quizzes from the ChEMBL database.',
  openGraph: {
    title: 'Chemistry Lab | Compounds & Reactions',
    description: 'Explore chemical compounds, molecular structures, and interactive quizzes from the ChEMBL database.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chemistry Lab | Compounds & Reactions',
    description: 'Explore chemical compounds, molecular structures, and interactive quizzes from the ChEMBL database.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
