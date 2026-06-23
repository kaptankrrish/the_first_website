import type { Quote, QuoteCategory } from '@/types';

const FALLBACK_QUOTES: Quote[] = [
  // Success
  { id: 's1', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'success' },
  { id: 's2', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', category: 'success' },
  { id: 's3', text: 'It always seems impossible until it is done.', author: 'Nelson Mandela', category: 'success' },
  
  // Philosophy
  { id: 'p1', text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', category: 'philosophy' },
  { id: 'p2', text: 'The unexamined life is not worth living.', author: 'Socrates', category: 'philosophy' },
  { id: 'p3', text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle', category: 'philosophy' },
  
  // Science
  { id: 'sc1', text: 'Somewhere, something incredible is waiting to be known.', author: 'Carl Sagan', category: 'science' },
  { id: 'sc2', text: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.', author: 'Marie Curie', category: 'science' },
  { id: 'sc3', text: 'Science is not only a disciple of reason but also one of romance and passion.', author: 'Stephen Hawking', category: 'science' },
  
  // Discipline
  { id: 'd1', text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn', category: 'discipline' },
  { id: 'd2', text: 'We must all suffer one of two things: the pain of discipline or the pain of regret or disappointment.', author: 'Jim Rohn', category: 'discipline' },
  { id: 'd3', text: 'Self-discipline is the ability to make yourself do what you should do, when you should do it, whether you feel like it or not.', author: 'Elbert Hubbard', category: 'discipline' },
  
  // Spirituality
  { id: 'sp1', text: 'The privilege of a lifetime is to become who you truly are.', author: 'Carl Jung', category: 'spirituality' },
  { id: 'sp2', text: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.', author: 'Buddha', category: 'spirituality' },
  { id: 'sp3', text: 'Peace comes from within. Do not seek it without.', author: 'Buddha', category: 'spirituality' },
  
  // Business
  { id: 'b1', text: 'Your most unhappy customers are your greatest source of learning.', author: 'Bill Gates', category: 'business' },
  { id: 'b2', text: 'Capitalism is a mechanism for making people work hard to produce things that other people want.', author: 'Charlie Munger', category: 'business' },
  { id: 'b3', text: 'The best way to predict the future is to create it.', author: 'Peter Drucker', category: 'business' },
];

export async function fetchQuotes(page = 1, limit = 15, category?: QuoteCategory | 'All'): Promise<Quote[]> {
  try {
    const catParam = category || 'All';
    const res = await fetch(`/api/quotes?page=${page}&limit=${limit}&category=${catParam}`);
    if (res.ok) {
      const data = await res.json() as { results: Quote[] };
      if (data && Array.isArray(data.results)) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch from local quotes API, falling back to static set:', err);
  }

  // Fallback if local API fails
  const allQuotes = FALLBACK_QUOTES;

  // Filter by category
  const filtered = !category || category === 'All'
    ? allQuotes
    : allQuotes.filter((q) => q.category === category);

  // Return the paginated slice
  const start = (page - 1) * limit;
  return filtered.slice(start, start + limit);
}

export async function getDailyQuote(): Promise<Quote> {
  const quotes = await fetchQuotes(1, 1);
  return quotes[0] || FALLBACK_QUOTES[0];
}

export function generateAIQuote(): Quote {
  const templates = [
    { text: 'Every line of code you write today builds the reality of tomorrow.', author: 'AI', category: 'science' as const },
    { text: 'The algorithm of success is simple: learn, apply, repeat.', author: 'AI', category: 'success' as const },
    { text: 'Your potential is like an infinite loop — it never ends until you break it.', author: 'AI', category: 'discipline' as const },
    { text: 'In the matrix of life, be the one who writes the code, not the one who gets executed.', author: 'AI', category: 'philosophy' as const },
    { text: 'Data is the new soil. Plant your ideas wisely.', author: 'AI', category: 'science' as const },
  ];
  const t = templates[Math.floor(Math.random() * templates.length)];
  return { ...t, id: 'ai-' + Date.now(), source: 'AI Generated' };
}
