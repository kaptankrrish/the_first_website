import { generateId } from '@/utils';
import type { Article, ArticleCategory } from '@/types';

const RSS_API = '/api/rss';

const HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0';

function categorizeArticle(title: string, description: string): ArticleCategory {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning') || text.includes('chatgpt') || text.includes('openai') || text.includes('neural')) return 'AI';
  if (text.includes('crypto') || text.includes('bitcoin') || text.includes('blockchain') || text.includes('ethereum') || text.includes('nft')) return 'Crypto';
  if (text.includes('space') || text.includes('nasa') || text.includes('mars') || text.includes('galaxy') || text.includes('astronaut') || text.includes('planet')) return 'Space';
  if (text.includes('science') || text.includes('research') || text.includes('study') || text.includes('dna') || text.includes('gene') || text.includes('climate')) return 'Science';
  if (text.includes('startup') || text.includes('venture') || text.includes('funding') || text.includes('ipo')) return 'Startups';
  if (text.includes('finance') || text.includes('stock') || text.includes('market') || text.includes('bank') || text.includes('economy') || text.includes('inflation')) return 'Finance';
  if (text.includes('tech') || text.includes('google') || text.includes('apple') || text.includes('microsoft') || text.includes('software') || text.includes('digital')) return 'Technology';
  return 'World';
}

// Helper to translate text using the newly created API route
async function translateTextOnClient(text: string | string[], lang: string): Promise<string | string[]> {
  if (lang === 'en' || !text) return text;
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang }),
    });
    if (!res.ok) return text;
    const data = await res.json();
    return data.translated || text;
  } catch {
    return text;
  }
}

export async function fetchRSSArticles(lang = 'en'): Promise<Article[]> {
  try {
    const res = await fetch(`${RSS_API}?lang=${lang}`);
    if (!res.ok) return [];
    const data = await res.json() as { articles: Record<string, unknown>[] };
    return (data.articles || []).map((a) => ({
      id: (a.id as string) || generateId(),
      title: (a.title as string) || 'Untitled',
      description: (a.description as string) || '',
      content: (a.content as string) || '',
      url: (a.url as string) || '',
      imageUrl: (a.imageUrl as string) || '',
      source: (a.source as string) || 'Unknown',
      category: (a.category as ArticleCategory) || 'World',
      publishedAt: (a.publishedAt as string) || new Date().toISOString(),
      author: (a.author as string) || 'Unknown',
      saved: false,
    }));
  } catch {
    return [];
  }
}

export async function fetchHackerNewsArticles(lang = 'en'): Promise<Article[]> {
  try {
    const res = await fetch(`${HACKER_NEWS_API}/topstories.json`);
    const topIds = await res.json() as number[];
    const storyIds = topIds.slice(0, 15);
    const stories = await Promise.allSettled(
      storyIds.map((id) =>
        fetch(`${HACKER_NEWS_API}/item/${id}.json`).then(r => r.json())
      )
    );
    const articles: Article[] = [];
    stories.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        const item = result.value as Record<string, unknown>;
        articles.push({
          id: generateId(),
          title: (item.title as string) || 'Untitled',
          description: (item.text as string) || '',
          content: (item.text as string) || '',
          url: (item.url as string) || `https://news.ycombinator.com/item?id=${item.id}`,
          imageUrl: '',
          source: 'Hacker News',
          category: categorizeArticle((item.title as string) || '', (item.text as string) || ''),
          publishedAt: new Date(((item.time as number) || 0) * 1000).toISOString(),
          author: (item.by as string) || 'Anonymous',
          saved: false,
        });
      }
    });

    if (lang !== 'en' && articles.length > 0) {
      const textsToTranslate = articles.map(a => `${a.title} ||| ${a.description}`);
      const translatedTexts = await translateTextOnClient(textsToTranslate, lang) as string[];
      
      articles.forEach((a, i) => {
        const trans = translatedTexts[i];
        if (trans) {
          const parts = trans.split('|||');
          if (parts.length >= 2) {
            a.title = parts[0].trim();
            a.description = parts.slice(1).join('|||').trim();
          } else {
            a.title = trans.trim();
          }
        }
      });
    }

    return articles;
  } catch {
    return [];
  }
}

export async function fetchAllNews(lang = 'en'): Promise<Article[]> {
  const [rss, hn] = await Promise.all([fetchRSSArticles(lang), fetchHackerNewsArticles(lang)]);
  const all = [...rss, ...hn];
  all.sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    if (isNaN(dateA) && isNaN(dateB)) return 0;
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    return dateB - dateA;
  });
  return all;
}
