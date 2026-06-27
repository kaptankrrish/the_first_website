import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Notes | Capture & Organize Ideas',
  description: 'Write, organize, and search your notes with folders and tags.',
  openGraph: {
    title: 'Smart Notes | Capture & Organize Ideas',
    description: 'Write, organize, and search your notes with folders and tags.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Notes | Capture & Organize Ideas',
    description: 'Write, organize, and search your notes with folders and tags.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
