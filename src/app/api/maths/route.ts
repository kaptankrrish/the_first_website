import { NextResponse } from 'next/server';

const MATH_FACTS = [
  { number: 0, text: "0 is the only real number that is neither positive nor negative." },
  { number: 1, text: "1 is the only number that is neither prime nor composite." },
  { number: 2, text: "2 is the only even prime number." },
  { number: 3, text: "3 is the first odd prime number." },
  { number: 4, text: "4 is the smallest composite number." },
  { number: 5, text: "5 is the only prime number that ends in 5, other than 5 itself." },
  { number: 6, text: "6 is the smallest perfect number (its divisors 1, 2, and 3 add up to 6)." },
  { number: 7, text: "7 is the only single-digit number that is not a factor of any number between 1 and 100." },
  { number: 8, text: "8 is the first number that is a cube of a prime number (2³)." },
  { number: 9, text: "9 is the highest single-digit number in the decimal system." },
  { number: 10, text: "10 is the base of our decimal system." },
  { number: 11, text: "11 is the smallest two-digit prime number." },
  { number: 12, text: "12 is a sublime number because it has a perfect number of divisors (6), and the sum of its divisors (1+2+3+4+6+12=28) is also a perfect number." },
  { number: 13, text: "13 is the number of Archimedean solids." },
  { number: 17, text: "17 is the number of possible wallpaper groups that tile the plane." },
  { number: 28, text: "28 is the second perfect number." },
  { number: 42, text: "42 is the number of partitions of 10." },
  { number: 60, text: "60 is the smallest number divisible by 1 through 6." },
  { number: 100, text: "100 is the square of 10 and the base of percentages." },
  { number: 153, text: "153 is a narcissistic number (1³ + 5³ + 3³ = 153)." },
  { number: 496, text: "496 is the third perfect number." },
  { number: 1729, text: "1729 is the Hardy-Ramanujan number, the smallest number expressible as the sum of two cubes in two different ways." },
  { number: 8128, text: "8128 is the fourth perfect number." },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    // Attempt to fetch from Numbers API, but provide a robust local fallback
    try {
      const facts = await Promise.all(
        Array.from({ length: 12 }).map(() => 
          fetch('http://numbersapi.com/random/math?json', { 
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(2000) 
          }).then(r => r.ok ? r.json() : null).catch(() => null)
        )
      );

      const validFacts = facts.filter(f => f !== null);

      if (validFacts.length > 0) {
        interface NumbersApiFact {
          number: number;
          text: string;
        }

        return NextResponse.json({ 
          facts: validFacts.map((f: NumbersApiFact, i: number) => ({
            id: `math-${page}-${i}-${Date.now()}`,
            number: f.number,
            text: f.text,
          }))
        });
      }
    } catch {
      console.warn('Numbers API failed, using local fallback');
    }

    // Shuffle and serve local facts if API fails or times out
    const shuffled = [...MATH_FACTS].sort(() => Math.random() - 0.5);
    const result = shuffled.slice(0, 12).map((f, i) => ({
      ...f,
      id: `math-local-${page}-${i}-${Date.now()}`
    }));

    return NextResponse.json({ facts: result });
  } catch (err) {
    console.error('Maths API Error:', err);
    return NextResponse.json({ facts: [], error: 'Failed to generate math facts' }, { status: 500 });
  }
}
