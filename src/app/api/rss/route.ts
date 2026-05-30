import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

// Use reliable, publicly accessible RSS feeds that don't block server requests
const RSS_FEEDS = [
  // BBC - very reliable
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://feeds.bbci.co.uk/news/technology/rss.xml',
  'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  'https://feeds.bbci.co.uk/news/business/rss.xml',
  // Ars Technica - reliable tech news
  'https://feeds.arstechnica.com/arstechnica/index',
  // The Verge - reliable tech news
  'https://www.theverge.com/rss/index.xml',
  // Wired - tech/science
  'https://www.wired.com/feed/rss',
  // NASA - space news
  'https://www.nasa.gov/news-release/feed/',
  // TechCrunch - startup/tech
  'https://techcrunch.com/feed/',
  // The Hacker News - cybersecurity
  'https://feeds.feedburner.com/TheHackersNews',
  // Reuters - world news (new working URL)
  'https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best',
  // CNBC - finance
  'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114',
  // Moneycontrol - Finance (New)
  'https://www.moneycontrol.com/rss/latestnews.xml',
  'https://www.moneycontrol.com/rss/business.xml',
  'https://www.moneycontrol.com/rss/marketreports.xml',
  'https://www.moneycontrol.com/rss/economy.xml',
  // Economic Times (New)
  'https://economictimes.indiatimes.com/rssfeedsdefault.cms',
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  // Science Daily
  'https://www.sciencedaily.com/rss/all.xml',
  // CoinDesk - crypto
  'https://www.coindesk.com/arc/outboundfeeds/rss/',
  // The Guardian - world news
  'https://www.theguardian.com/world/rss',
  // The Guardian - tech
  'https://www.theguardian.com/technology/rss',
  // NPR news
  'https://feeds.npr.org/1001/rss.xml',
  // Al Jazeera
  'https://www.aljazeera.com/xml/rss/all.xml',
  // India Today
  'https://www.indiatoday.in/rss/home',
  // NDTV
  'https://feeds.feedburner.com/ndtvnews-top-stories',
  // CNN
  'http://rss.cnn.com/rss/cnn_topstories.rss',
  // NYT Tech
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  // WSJ Tech
  'https://feeds.a.dj.com/rss/RSSWSJD.xml',
  // Engadget
  'https://www.engadget.com/rss.xml',
  // Mashable
  'https://mashable.com/feeds/rss/all',
  // CNET
  'https://www.cnet.com/rss/news/',
  // Bloomberg Markets
  'https://feeds.bloomberg.com/markets/news.rss',
  // Forbes
  'https://www.forbes.com/real-time/feed2/',
  // TechRadar
  'https://www.techradar.com/rss',
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
});

interface MediaContent {
  '@_url'?: string;
  '@_medium'?: string;
  url?: string;
}

interface Enclosure {
  '@_url'?: string;
  '@_type'?: string;
  url?: string;
}

function categorizeArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning') || text.includes('chatgpt') || text.includes('openai') || text.includes('neural') || text.includes('llm') || text.includes('deepmind') || text.includes('generative')) return 'AI';
  if (text.includes('crypto') || text.includes('bitcoin') || text.includes('blockchain') || text.includes('ethereum') || text.includes('nft') || text.includes('defi') || text.includes('web3')) return 'Crypto';
  if (text.includes('space') || text.includes('nasa') || text.includes('mars') || text.includes('galaxy') || text.includes('astronaut') || text.includes('planet') || text.includes('rocket') || text.includes('satellite') || text.includes('lunar') || text.includes('orbit')) return 'Space';
  if (text.includes('science') || text.includes('research') || text.includes('study') || text.includes('dna') || text.includes('gene') || text.includes('climate') || text.includes('physics') || text.includes('biology') || text.includes('chemistry') || text.includes('discovery')) return 'Science';
  if (text.includes('startup') || text.includes('venture') || text.includes('funding') || text.includes('ipo') || text.includes('seed round') || text.includes('unicorn') || text.includes('series a') || text.includes('y combinator')) return 'Startups';
  if (text.includes('finance') || text.includes('stock') || text.includes('market') || text.includes('bank') || text.includes('economy') || text.includes('inflation') || text.includes('fed') || text.includes('interest rate') || text.includes('gdp') || text.includes('wall street') || text.includes('nasdaq')) return 'Finance';
  if (text.includes('tech') || text.includes('google') || text.includes('apple') || text.includes('microsoft') || text.includes('software') || text.includes('digital') || text.includes('meta') || text.includes('amazon') || text.includes('chip') || text.includes('semiconductor')) return 'Technology';
  return 'World';
}

function extractImageFromHtml(html: string): string {
  // Try img src
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1] && !match[1].includes('tracking') && !match[1].includes('pixel')) return match[1];
  // Try figure
  const figureMatch = html.match(/<figure[^>]*>.*?<img[^>]+src=["']([^"']+)["']/is);
  if (figureMatch && figureMatch[1]) return figureMatch[1];
  return '';
}

function extractImage(item: Record<string, unknown>): string {
  // 1. Try media:content
  const mediaContent = item['media:content'];
  if (mediaContent) {
    if (Array.isArray(mediaContent)) {
      const best = (mediaContent as MediaContent[]).find((m: MediaContent) => m['@_medium'] === 'image' || (m['@_url'] && /\.(jpg|jpeg|png|webp|gif)/i.test(m['@_url'])));
      if (best && best['@_url']) return best['@_url'];
      if ((mediaContent[0] as MediaContent)?.['@_url']) return (mediaContent[0] as MediaContent)['@_url'] || '';
    } else if (typeof mediaContent === 'object') {
      const mc = mediaContent as Record<string, unknown>;
      const url = (mc['@_url'] as string) || (mc.url as string) || '';
      if (url) return url;
    }
  }

  // 2. Try media:thumbnail
  const mediaThumb = item['media:thumbnail'];
  if (mediaThumb) {
    if (Array.isArray(mediaThumb)) {
      if (mediaThumb[0]?.['@_url']) return mediaThumb[0]['@_url'];
    } else if (typeof mediaThumb === 'object') {
      const mt = mediaThumb as Record<string, unknown>;
      const url = (mt['@_url'] as string) || (mt.url as string) || '';
      if (url) return url;
    }
  }

  // 3. Try enclosure
  if (item.enclosure) {
    if (Array.isArray(item.enclosure)) {
      const imgEnc = (item.enclosure as Enclosure[]).find((e: Enclosure) => (e['@_type'] as string)?.startsWith('image/'));
      if (imgEnc && imgEnc['@_url']) return imgEnc['@_url'];
    } else if (typeof item.enclosure === 'object') {
      const enc = item.enclosure as Record<string, unknown>;
      const type = (enc['@_type'] as string) || '';
      const url = (enc['@_url'] as string) || (enc.url as string) || '';
      if (url && (type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)/i.test(url))) return url;
    }
  }

  // 4. Try image tag directly
  if (item.image && typeof item.image === 'string') return item.image;
  if (item.image && typeof item.image === 'object') {
    const img = item.image as Record<string, unknown>;
    if (img.url) return img.url as string;
    if (img['@_url']) return img['@_url'] as string;
  }
  
  // 5. Look for og:image or similar in JSON stringified item (desperate measure)
  const itemStr = JSON.stringify(item);
  const jsonImgMatch = itemStr.match(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp|gif)[^"'\s]*/i);
  if (jsonImgMatch && !jsonImgMatch[0].includes('tracking') && !jsonImgMatch[0].includes('pixel')) {
    return jsonImgMatch[0];
  }

  // 6. Try extracting from content or description HTML
  const contentEncoded = (item['content:encoded'] as string) || '';
  const description = (item.description as string) || '';
  const contentStr = (item.content as string) || '';
  if (contentEncoded) {
    const extracted = extractImageFromHtml(contentEncoded);
    if (extracted) return extracted;
  }
  if (description) {
    const extracted = extractImageFromHtml(description);
    if (extracted) return extracted;
  }
  if (contentStr) {
    const extracted = extractImageFromHtml(contentStr);
    if (extracted) return extracted;
  }

  return '';
}

function getSourceName(feedUrl: string, link: string): string {
  try {
    // First try from the article link
    if (link) {
      const hostname = new URL(link).hostname.replace('www.', '');
      if (hostname.includes('bbc')) return 'BBC News';
      if (hostname.includes('reuters')) return 'Reuters';
      if (hostname.includes('aljazeera')) return 'Al Jazeera';
      if (hostname.includes('techcrunch')) return 'TechCrunch';
      if (hostname.includes('nytimes')) return 'NY Times';
      if (hostname.includes('thehackernews')) return 'The Hacker News';
      if (hostname.includes('arstechnica')) return 'Ars Technica';
      if (hostname.includes('theverge')) return 'The Verge';
      if (hostname.includes('wired')) return 'WIRED';
      if (hostname.includes('nasa')) return 'NASA';
      if (hostname.includes('cnbc')) return 'CNBC';
      if (hostname.includes('moneycontrol')) return 'Moneycontrol';
      if (hostname.includes('economictimes')) return 'Economic Times';
      if (hostname.includes('sciencedaily')) return 'Science Daily';
      if (hostname.includes('coindesk')) return 'CoinDesk';
      if (hostname.includes('theguardian')) return 'The Guardian';
      if (hostname.includes('npr')) return 'NPR';
      if (hostname.includes('indiatoday')) return 'India Today';
      if (hostname.includes('ndtv')) return 'NDTV';
      return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
    }
    // Fallback to feed URL
    const feedHost = new URL(feedUrl).hostname.replace('www.', '');
    return feedHost.split('.')[0].charAt(0).toUpperCase() + feedHost.split('.')[0].slice(1);
  } catch {
    return 'News';
  }
}

// Extract items from RSS or Atom feeds
function extractItems(feed: Record<string, unknown>): Record<string, unknown>[] {
  // RSS format
  const channel = (feed.rss as Record<string, unknown>)?.channel as Record<string, unknown> | undefined;
  if (channel) {
    const rawItems = channel.item as Record<string, unknown>[] | Record<string, unknown> | undefined;
    if (!rawItems) return [];
    return Array.isArray(rawItems) ? rawItems : [rawItems];
  }
  // Atom format (e.g., The Verge)
  const atomFeed = feed.feed as Record<string, unknown> | undefined;
  if (atomFeed) {
    const entries = atomFeed.entry as Record<string, unknown>[] | Record<string, unknown> | undefined;
    if (!entries) return [];
    return Array.isArray(entries) ? entries : [entries];
  }
  // RDF format
  const rdf = (feed['rdf:RDF'] as Record<string, unknown>) || (feed['RDF'] as Record<string, unknown>);
  if (rdf) {
    const rawItems = rdf.item as Record<string, unknown>[] | Record<string, unknown> | undefined;
    if (!rawItems) return [];
    return Array.isArray(rawItems) ? rawItems : [rawItems];
  }
  return [];
}

// Get link from an Atom entry (can be object or array of objects)
function getAtomLink(item: Record<string, unknown>): string {
  const link = item.link;
  if (typeof link === 'string') return link;
  if (Array.isArray(link)) {
    interface AtomLink {
      '@_rel'?: string;
      '@_href'?: string;
    }
    const alt = (link as AtomLink[]).find((l: AtomLink) => l['@_rel'] === 'alternate' || !l['@_rel']);
    if (alt) return (alt['@_href'] as string) || '';
    if (link[0]) return ((link[0] as AtomLink)['@_href'] as string) || '';
  }
  if (typeof link === 'object' && link !== null) {
    return ((link as Record<string, unknown>)['@_href'] as string) || '';
  }
  return '';
}

// Fetch with timeout to prevent hanging on slow feeds
async function fetchWithTimeout(url: string, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*',
      },
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const globalController = new AbortController();
  // Global timeout for the entire request to prevent hanging
  const globalTimeout = setTimeout(() => globalController.abort(), 25000);

  try {
    const batchSize = 5; // Smaller batch size for better stability
    const articles: Record<string, unknown>[] = [];
    
    // Process feeds in sequence of batches to avoid overwhelming the connection
    for (let i = 0; i < RSS_FEEDS.length; i += batchSize) {
      if (globalController.signal.aborted) break;
      
      const batch = RSS_FEEDS.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(async (feedUrl) => {
          try {
            const res = await fetchWithTimeout(feedUrl, 10000); // 10s per feed
            if (!res.ok) return [];
            const xml = await res.text();
            const parsed = parser.parse(xml);
            const items = extractItems(parsed as Record<string, unknown>);
            return items.slice(0, 15).map((item: Record<string, unknown>) => {
              // Handle both RSS and Atom formats for title
              let title = '';
              if (typeof item.title === 'string') {
                title = item.title.trim();
              } else if (typeof item.title === 'object' && item.title !== null) {
                title = ((item.title as Record<string, unknown>)['#text'] as string) || '';
              }
              title = title || 'Untitled';

              const link = (item.link as string) || getAtomLink(item) || '';
              const contentEncoded = (item['content:encoded'] as string) || '';
              const itemDescription = (item.description as string) || '';
              const itemSummary = (item.summary as string) || '';
              const itemContent = (item.content as string) || '';
              
              const rawContent = contentEncoded || itemDescription || itemSummary || itemContent || '';
              const descRaw = rawContent.replace(/<[^>]*>/g, '').trim();

              let description = descRaw.substring(0, 1000);
              if (descRaw.length > 1000) {
                const lastPeriod = description.lastIndexOf('.');
                if (lastPeriod > 500) {
                  description = description.substring(0, lastPeriod + 1);
                } else {
                  description = description.substring(0, 997) + '...';
                }
              }

              const pubDate = (item.pubDate as string) || (item.published as string) || (item.updated as string) || (item['dc:date'] as string) || new Date().toISOString();
              const author = (item['dc:creator'] as string) || (item.author as string) || (item.creator as string) || '';
              let authorStr = '';
              if (typeof author === 'string') authorStr = author;
              else if (typeof author === 'object' && author !== null) {
                const aObj = author as Record<string, unknown>;
                authorStr = (aObj.name as string) || '';
              }

              return {
                id: Math.random().toString(36).substring(2) + Date.now().toString(36),
                title,
                description,
                content: contentEncoded || descRaw || '',
                url: link,
                imageUrl: extractImage(item),
                source: getSourceName(feedUrl, link),
                category: categorizeArticle(title, description),
                publishedAt: pubDate,
                author: authorStr || 'Unknown',
                saved: false,
              };
            });
          } catch {
            return [];
          }
        })
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          articles.push(...result.value);
        }
      }
      
      // Stop if we have plenty of articles
      if (articles.length > 100) break;
    }

    // Deduplicate by title similarity
    const seen = new Set<string>();
    const uniqueArticles = articles.filter((a) => {
      const key = (a.title as string).toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    uniqueArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt as string).getTime();
      const dateB = new Date(b.publishedAt as string).getTime();
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });

    // Limit the number of articles returned for better performance
    const finalArticles = uniqueArticles.slice(0, 60);

    return NextResponse.json({ articles: finalArticles }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('RSS API error:', err);
    return NextResponse.json({ articles: [] }, { status: 200 }); // Return empty rather than 500
  } finally {
    clearTimeout(globalTimeout);
  }
}
