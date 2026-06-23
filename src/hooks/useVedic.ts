'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { VedicContent } from '@/types';

async function fetchVedicPage({ pageParam = 1, category }: { pageParam?: number; category?: string }) {
  const res = await fetch(`/api/vedic?page=${pageParam}${category ? `&category=${category}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch Vedic content');
  return res.json() as Promise<{ items: VedicContent[] }>;
}

export function useVedic(category?: string) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['vedic', category],
    queryFn: ({ pageParam }) => fetchVedicPage({ pageParam, category }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length === 0) return undefined;
      return allPages.length + 1;
    },
  });

  const allItems = data?.pages.flatMap((page) => page.items) || [];

  return {
    items: allItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  };
}
