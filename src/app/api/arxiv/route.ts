import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

const ARXIV_API = 'https://export.arxiv.org/api/query';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  isArray: (name) => name === 'entry' || name === 'author' || name === 'link',
});

function detectCategory(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('space') || t.includes('galaxy') || t.includes('nasa') || t.includes('planet') || t.includes('astronaut') || t.includes('mars') || t.includes('star')) return 'Space';
  if (t.includes('quantum') || t.includes('particle') || t.includes('physics') || t.includes('atom') || t.includes('nuclear') || t.includes('relativity')) return 'Physics';
  if (t.includes('ai') || t.includes('deep learning') || t.includes('neural') || t.includes('reinforcement') || t.includes('transformer') || t.includes('llm')) return 'AI';
  if (t.includes('dna') || t.includes('gene') || t.includes('protein') || t.includes('cell') || t.includes('biology') || t.includes('evolution')) return 'Biology';
  if (t.includes('chemistry') || t.includes('molecule') || t.includes('reaction') || t.includes('organic') || t.includes('chemical')) return 'Chemistry';
  if (t.includes('math') || t.includes('equation') || t.includes('theorem') || t.includes('algebra') || t.includes('calculus') || t.includes('geometry')) return 'Maths';
  return 'Science';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const maxResults = 20;
    const start = (page - 1) * maxResults;

    const query = 'cat:cs.AI+OR+cat:physics+OR+cat:astro-ph+OR+cat:math+OR+cat:chem';
    const url = `${ARXIV_API}?search_query=${query}&start=${start}&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const parsed = parser.parse(xml) as Record<string, unknown>;
    const feed = parsed.feed as Record<string, unknown> | undefined;
    const entries = (feed?.entry as Record<string, unknown>[]) || [];

    const articles = entries.map((entry: Record<string, unknown>) => {
      const title = ((entry.title as string) || '').replace(/\s+/g, ' ').trim();
      const summary = ((entry.summary as string) || '').replace(/\s+/g, ' ').trim();
      const authorsRaw = entry.author as Record<string, unknown>[];
      const authors = Array.isArray(authorsRaw)
        ? authorsRaw.map((a) => (a.name as string) || '').filter(Boolean).join(', ')
        : 'Unknown';
      const links = entry.link as Record<string, unknown>[];
      const link = Array.isArray(links) ? (links.find((l) => (l['@_rel'] as string) === 'alternate')?.['@_href'] as string) || (links[0]?.['@_href'] as string) || '' : '';
      const published = (entry.published as string) || '';
      const category = detectCategory(title + ' ' + summary);

      return {
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        title,
        description: summary.substring(0, 300),
        content: summary,
        url: link,
        imageUrl: '',
        source: 'arXiv',
        category,
        publishedAt: published,
        author: authors || 'Unknown',
        saved: false,
      };
    });

    return NextResponse.json({ articles });
  } catch (err) {
    console.error('arXiv API error:', err);
    return NextResponse.json({ articles: [], error: 'Failed to fetch arXiv articles' }, { status: 500 });
  }
}
