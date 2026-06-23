import { NextRequest, NextResponse } from 'next/server';
import type { Quote, QuoteCategory } from '@/types';

const FALLBACK_QUOTES: Quote[] = [
  { id: 's1', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'success' },
  { id: 's2', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', category: 'success' },
  { id: 's3', text: 'It always seems impossible until it is done.', author: 'Nelson Mandela', category: 'success' },
  { id: 'p1', text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', category: 'philosophy' },
  { id: 'p2', text: 'The unexamined life is not worth living.', author: 'Socrates', category: 'philosophy' },
  { id: 'p3', text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle', category: 'philosophy' },
  { id: 'sc1', text: 'Somewhere, something incredible is waiting to be known.', author: 'Carl Sagan', category: 'science' },
  { id: 'sc2', text: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.', author: 'Marie Curie', category: 'science' },
  { id: 'sc3', text: 'Science is not only a disciple of reason but also one of romance and passion.', author: 'Stephen Hawking', category: 'science' },
  { id: 'd1', text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn', category: 'discipline' },
  { id: 'd2', text: 'We must all suffer one of two things: the pain of discipline or the pain of regret or disappointment.', author: 'Jim Rohn', category: 'discipline' },
  { id: 'd3', text: 'Self-discipline is the ability to make yourself do what you should do, when you should do it, whether you feel like it or not.', author: 'Elbert Hubbard', category: 'discipline' },
  { id: 'sp1', text: 'The privilege of a lifetime is to become who you truly are.', author: 'Carl Jung', category: 'spirituality' },
  { id: 'sp2', text: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.', author: 'Buddha', category: 'spirituality' },
  { id: 'sp3', text: 'Peace comes from within. Do not seek it without.', author: 'Buddha', category: 'spirituality' },
  { id: 'b1', text: 'Your most unhappy customers are your greatest source of learning.', author: 'Bill Gates', category: 'business' },
  { id: 'b2', text: 'Capitalism is a mechanism for making people work hard to produce things that other people want.', author: 'Charlie Munger', category: 'business' },
  { id: 'b3', text: 'The best way to predict the future is to create it.', author: 'Peter Drucker', category: 'business' },
];

let serverCachedQuotes: Quote[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours cache

function categorizeQuoteText(text: string): QuoteCategory {
  const t = text.toLowerCase();
  if (t.includes('success') || t.includes('win') || t.includes('fail') || t.includes('achieve') || t.includes('goal') || t.includes('work') || t.includes('effort') || t.includes('progress') || t.includes('victory') || t.includes('destiny')) return 'success';
  if (t.includes('science') || t.includes('nature') || t.includes('universe') || t.includes('truth') || t.includes('logic') || t.includes('reason') || t.includes('know') || t.includes('physics') || t.includes('earth') || t.includes('discovery') || t.includes('theory')) return 'science';
  if (t.includes('discipline') || t.includes('habit') || t.includes('control') || t.includes('master') || t.includes('rule') || t.includes('will') || t.includes('action') || t.includes('focus') || t.includes('strength') || t.includes('courage')) return 'discipline';
  if (t.includes('peace') || t.includes('soul') || t.includes('god') || t.includes('love') || t.includes('heart') || t.includes('spirit') || t.includes('silence') || t.includes('mind') || t.includes('hope') || t.includes('happy')) return 'spirituality';
  if (t.includes('business') || t.includes('money') || t.includes('market') || t.includes('customer') || t.includes('sell') || t.includes('economy') || t.includes('plan') || t.includes('leader') || t.includes('team') || t.includes('company')) return 'business';
  return 'philosophy';
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function fetchWithTimeout(url: string, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; QuoteEngine/2.0)',
        'Accept': 'application/json',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function getQuotesDatabase(): Promise<Quote[]> {
  const now = Date.now();
  if (serverCachedQuotes.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return serverCachedQuotes;
  }

  try {
    const res = await fetchWithTimeout('https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json');
    if (res.ok) {
      const rawData = await res.json() as { quoteText: string; quoteAuthor: string }[];
      if (Array.isArray(rawData)) {
        const mapped = rawData.map((q, index) => {
          const text = q.quoteText.trim();
          const author = q.quoteAuthor.trim() || 'Unknown';
          return {
            id: `gq-${index}`,
            text,
            author,
            category: categorizeQuoteText(text),
          };
        });
        
        // Shuffle the database on load so that the quotes sequence is unique and fresh on every restart
        serverCachedQuotes = shuffleArray(mapped);
        lastFetchTime = now;
        return serverCachedQuotes;
      }
    }
  } catch (err) {
    console.error('Error fetching quotes from GitHub, falling back to static set:', err);
  }

  serverCachedQuotes = shuffleArray(FALLBACK_QUOTES);
  return serverCachedQuotes;
}

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get('page') || '1');
  const limit = Number(request.nextUrl.searchParams.get('limit') || '16');
  const category = request.nextUrl.searchParams.get('category') || 'All';

  const allQuotes = await getQuotesDatabase();
  
  const filtered = category === 'All'
    ? allQuotes
    : allQuotes.filter((q) => q.category === category);

  const start = (page - 1) * limit;
  let sliced = filtered.slice(start, start + limit);

  // If the user reaches the end of the 5,400+ quotes list, dynamically synthesize high-quality quotes on-the-fly to support a truly UNLIMITED scrolling experience!
  if (sliced.length === 0 && start > 0) {
    const synthesized: Quote[] = [];
    const subjects = {
      success: [
        'The velocity of your dreams is only throttled by the doubts you harbor today.',
        'True progress lies not in outperforming others, but in outperforming your past self.',
        'Success is a compound interest of small habits executed with unwavering consistency.',
        'Do not wait for perfect conditions to start; the starting itself creates the perfect conditions.',
        'Great achievements are built on a foundation of trials, endurance, and quiet resilience.'
      ],
      science: [
        'In the grand cosmic calendar, our lives are but a brilliant flash, yet we possess the capacity to understand the universe itself.',
        'Science is the language of nature, spoken through equations and verified through empirical curiosity.',
        'The elegance of a physical law lies in its ability to describe infinite complexities with finite mathematical grace.',
        'Every cell in our bodies is composed of stardust, making us the universe contemplating itself.',
        'To ask questions without fear of the answers is the fundamental spark of scientific progress.'
      ],
      discipline: [
        'Discipline is the silent force that transforms random flashes of motivation into a permanent state of mastery.',
        'We conquer ourselves when we choose the discomfort of focus over the temporary comfort of distraction.',
        'A sharp mind is forged in the fires of consistency, where minor choices shape destiny.',
        'Self-control is not a restriction; it is the ultimate expression of personal freedom and power.',
        'Your daily habits are voting cards for the person you wish to become tomorrow.'
      ],
      spirituality: [
        'The noise of the world dissolves the moment you learn to listen to the spaces between your thoughts.',
        'Peace is not the absence of external storms, but the presence of a quiet sanctuary within the soul.',
        'You are not a drop in the ocean; you are the entire ocean encapsulated in a single drop.',
        'To know yourself deeply is to realize that the outer universe is but a mirror of your inner landscape.',
        'Gratitude is the lens that turns ordinary moments into expressions of divine beauty.'
      ],
      business: [
        'A successful enterprise does not merely sell products; it solves genuine human struggles and builds enduring trust.',
        'Innovation is the art of seeing what everyone else sees, but thinking what no one else has thought.',
        'The best business model is built on absolute integrity, exceptional craftsmanship, and profound empathy.',
        'Do not fear competition; fear losing the clarity of your own unique mission and values.',
        'A team bound by shared belief will always out-innovate a team bound only by transactional metrics.'
      ],
      philosophy: [
        'The ultimate truth is not found in seeking new answers, but in refining the questions we dare to ask.',
        'We suffer more in our imaginations than we do in actual physical reality.',
        'Life is not a puzzle to be solved, but a reality to be experienced, appreciated, and integrated.',
        'The key to wisdom is recognizing that every perspective is but a partial shadow of a larger truth.',
        'To be completely content with what you have is the highest form of wealth and liberation.'
      ]
    };

    const targetCategory: QuoteCategory = (category === 'All' ? 'philosophy' : category) as QuoteCategory;
    const list = subjects[targetCategory] || subjects.philosophy;
    
    for (let i = 0; i < limit; i++) {
      const baseText = list[i % list.length];
      const deterministicId = `synthesized-${category}-${page}-${start + i}`;
      // Give a tiny variation context to keep it fully dynamic
      const dynamicText = baseText.replace('.', ` (Reflecting Level ${page}, Part ${i + 1}).`);
      
      synthesized.push({
        id: deterministicId,
        text: dynamicText,
        author: 'AI Sage',
        category: targetCategory,
        source: 'Dynamic Stream'
      });
    }
    sliced = synthesized;
  }

  return NextResponse.json({
    results: sliced,
    page,
    limit,
    total: filtered.length || allQuotes.length,
    hasMore: true // Quotes are mathematically infinite now!
  });
}
