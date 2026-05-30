import type { Article } from '@/types';

export async function fetchScienceArticles(page = 1): Promise<Article[]> {
  try {
    // Parallel fetch from arXiv and NASA for a richer science feed
    const [arxivRes, nasaRes] = await Promise.all([
      fetch(`/api/arxiv?page=${page}`),
      fetch(`/api/nasa?page=${page}`)
    ]);

    const arxivData = arxivRes.ok ? await arxivRes.json() : { articles: [] };
    const nasaData = nasaRes.ok ? await nasaRes.json() : { articles: [] };

    // Interleave the results
    const combined: Article[] = [];
    const maxLen = Math.max(arxivData.articles.length, nasaData.articles.length);
    
    for (let i = 0; i < maxLen; i++) {
      if (nasaData.articles[i]) combined.push(nasaData.articles[i]);
      if (arxivData.articles[i]) combined.push(arxivData.articles[i]);
    }

    return combined;
  } catch (err) {
    console.error('fetchScienceArticles error:', err);
    return [];
  }
}

// Deprecated old function name, keeping for compatibility if needed elsewhere
export const fetchArXivArticles = fetchScienceArticles;
