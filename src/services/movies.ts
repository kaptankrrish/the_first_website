import type { Movie } from '@/types';

const TMDB_API = '/api/tmdb';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

function normalizeMovie(m: Record<string, unknown>): Movie {
  return {
    id: m.id as number,
    title: m.title as string || m.original_title as string || 'Unknown',
    overview: (m.overview as string) || '',
    posterPath: m.poster_path
      ? (typeof m.poster_path === 'string' && m.poster_path.startsWith('http') ? m.poster_path : `${IMAGE_BASE}/w500${m.poster_path}`)
      : m.posterPath as string || '',
    backdropPath: m.backdrop_path
      ? (typeof m.backdrop_path === 'string' && m.backdrop_path.startsWith('http') ? m.backdrop_path : `${IMAGE_BASE}/original${m.backdrop_path}`)
      : m.backdropPath as string || '',
    voteAverage: (m.vote_average as number) || (m.voteAverage as number) || 0,
    releaseDate: (m.release_date as string) || (m.releaseDate as string) || '',
    genreIds: (m.genre_ids as number[]) || (m.genreIds as number[]) || [],
    originalLanguage: (m.original_language as string) || 'en',
  };
}

export async function fetchTrendingMovies(page = 1): Promise<Movie[]> {
  try {
    const res = await fetch(`${TMDB_API}?action=trending&page=${page}`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const data = await res.json() as { results: Record<string, unknown>[] };
    return (data.results || []).map(normalizeMovie);
  } catch {
    return [];
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`${TMDB_API}?action=search&query=${encodeURIComponent(query)}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json() as { results: Record<string, unknown>[] };
    return (data.results || []).map(normalizeMovie);
  } catch {
    return [];
  }
}

export async function fetchMovieDetails(id: number): Promise<Movie | null> {
  try {
    const res = await fetch(`${TMDB_API}?action=detail&id=${id}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;
    return data ? normalizeMovie(data) : null;
  } catch {
    return null;
  }
}


