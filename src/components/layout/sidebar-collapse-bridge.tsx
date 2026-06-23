'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/store';

export function SidebarCollapseBridge() {
  const { toggleSidebar } = useAppStore();
  useEffect(() => {
    const onToggle = () => toggleSidebar();
    window.addEventListener('app:toggle-sidebar', onToggle);
    return () => window.removeEventListener('app:toggle-sidebar', onToggle);
  }, [toggleSidebar]);
  return null;
}
