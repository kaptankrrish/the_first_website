
export interface MathFact {
  id: string;
  number: number;
  text: string;
  type: string;
  source: string;
}

export async function fetchMathFacts(page = 1): Promise<MathFact[]> {
  try {
    const res = await fetch(`/api/maths?page=${page}`);
    if (!res.ok) return [];
    const data = await res.json() as { facts: MathFact[] };
    return data.facts.map(f => ({
      ...f,
      type: 'Mathematical Property',
      source: 'Numbers API'
    }));
  } catch (err) {
    console.error('fetchMathFacts error:', err);
    return [];
  }
}
