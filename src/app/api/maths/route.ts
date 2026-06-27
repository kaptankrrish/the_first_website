import { NextResponse } from 'next/server';

const MATH_FACTS = [
  { number: 0, text: "0 is the only real number that is neither positive nor negative." },
  { number: 1, text: "1 is the only number that is neither prime nor composite." },
  { number: 2, text: "2 is the only even prime number." },
  { number: 3, text: "3 is the first odd prime number and the number of sides in a triangle." },
  { number: 4, text: "4 is the smallest composite number and the only number that has the same number of letters as its value." },
  { number: 5, text: "5 is the only prime that ends in 5. It is also the number of Platonic solids." },
  { number: 6, text: "6 is the smallest perfect number: 1 + 2 + 3 = 6." },
  { number: 7, text: "7 is considered the luckiest number in many cultures. It is the most popular one-digit prime." },
  { number: 8, text: "8 is the first cube of a prime (2³) and the first Fibonacci prime that is not prime-indexed." },
  { number: 9, text: "9 is the highest single-digit number. Any number divisible by 9 has digits that sum to 9 or a multiple of 9." },
  { number: 10, text: "10 is the base of our decimal number system." },
  { number: 11, text: "11 is the smallest two-digit prime. A hendecagon has 11 sides." },
  { number: 12, text: "12 is a sublime number with a perfect number of divisors, and their sum (28) is also perfect." },
  { number: 13, text: "13 is the number of Archimedean solids and the number of cards in a suit in a standard deck." },
  { number: 14, text: "14 is the smallest number with exactly 4 divisors: 1, 2, 7, 14." },
  { number: 15, text: "15 is the smallest number that can be expressed as the sum of four consecutive primes." },
  { number: 16, text: "16 is the only two-digit number that is the fourth power of a prime (2⁴)." },
  { number: 17, text: "17 is the number of possible wallpaper symmetry groups." },
  { number: 18, text: "18 is the only positive number that equals twice the sum of its digits." },
  { number: 19, text: "19 is the maximum number of fourth powers needed to sum to any number (Waring's problem)." },
  { number: 20, text: "20 is the base of the ancient Mayan numeral system." },
  { number: 21, text: "21 is the smallest perfect number in base 10 and the number of dots on a standard die." },
  { number: 24, text: "24 is the smallest number with exactly 8 divisors." },
  { number: 28, text: "28 is the second perfect number. It is also the number of days in February in a non-leap year." },
  { number: 29, text: "29 is the 10th prime number and the only prime that is also the sum of three consecutive primes (7 + 11 + 13)." },
  { number: 30, text: "30 is the number of sides in a regular icosahedron and the smallest sphenic number." },
  { number: 36, text: "36 is the largest integer that can be expressed as a product of two distinct primes in fewer than three ways." },
  { number: 42, text: "42 is the number of partitions of 10 and famously the Answer to the Ultimate Question of Life, the Universe, and Everything." },
  { number: 49, text: "49 is the smallest square where the digits are all different and sum to a perfect square." },
  { number: 50, text: "50 is the sum of the first three perfect numbers (6 + 28 + 50... actually it's the atomic number of tin)." },
  { number: 54, text: "54 is the number of colored squares on a Rubik's Cube." },
  { number: 57, text: "57 is the 16th prime. Grothendieck called it the 'absolute worst prime number'." },
  { number: 60, text: "60 is the smallest number divisible by 1 through 6 and is used as the basis for time (60 seconds, 60 minutes)." },
  { number: 64, text: "64 is both a perfect square (8²) and a perfect cube (4³)." },
  { number: 72, text: "72 is the smallest number whose digits add up to 9 and whose reverse does too." },
  { number: 89, text: "89 is a Fibonacci number and the 11th prime number." },
  { number: 100, text: "100 is the square of 10, the basis of percentages, and a 'perfect square' of a perfect square." },
  { number: 121, text: "121 is the smallest multi-digit square whose digits are all squares (1, 2, 1). It is also 11²." },
  { number: 128, text: "128 is the largest number that cannot be expressed as the sum of distinct cubes." },
  { number: 144, text: "144 is the 12th Fibonacci number and the largest square Fibonacci number." },
  { number: 153, text: "153 is a narcissistic number: 1³ + 5³ + 3³ = 153. It is also a Harshad number." },
  { number: 169, text: "169 is the square of 13. Its reverse (961) is the square of 31." },
  { number: 196, text: "196 is the smallest Lychrel number candidate that has not been proven to not produce a palindrome." },
  { number: 216, text: "216 is 6³, the only cube that is the sum of consecutive cubes (3³ + 4³ + 5³)." },
  { number: 225, text: "225 is 15². It is the smallest square that is the product of two consecutive triangular numbers." },
  { number: 256, text: "256 is 2⁸, a power of 2 important in computing as it represents the number of values in a byte." },
  { number: 365, text: "365 is the number of days in a standard year." },
  { number: 496, text: "496 is the third perfect number. 1 + 2 + 4 + 8 + 16 + 31 + 62 + 124 + 248 = 496." },
  { number: 666, text: "666 is the sum of the first 36 natural numbers (the 36th triangular number) and the Number of the Beast." },
  { number: 720, text: "720 is 6! (6 factorial) and the number of degrees in four full rotations." },
  { number: 999, text: "999 is the largest three-digit number. In many cultures it is considered a lucky or angel number." },
  { number: 1000, text: "1000 is 10³ and the base of the decimal system's naming convention (a thousand)." },
  { number: 1024, text: "1024 is 2¹⁰, the base of the binary numeral system used in computing (1 kilobyte ≈ 1024 bytes)." },
  { number: 1729, text: "1729 is the Hardy-Ramanujan number: the smallest number expressible as the sum of two cubes in two different ways (1³ + 12³ = 9³ + 10³)." },
  { number: 2048, text: "2048 is 2¹¹ and the name of the popular sliding tile puzzle game." },
  { number: 40320, text: "40320 is 8! (8 factorial) and appears in combinatorics problems frequently." },
  { number: 8128, text: "8128 is the fourth perfect number. It is also the 4th Mersenne prime-related perfect number." },
  { number: 10000, text: "10000 is 10⁴. In some Asian cultures, it represents an infinite number." },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const shuffled = [...MATH_FACTS].sort(() => Math.random() - 0.5);
    const result = shuffled.slice(0, 12).map((f, i) => ({
      ...f,
      id: `math-${page}-${i}-${Date.now()}`
    }));

    return NextResponse.json({ facts: result });
  } catch (err) {
    console.error('Maths API Error:', err);
    return NextResponse.json({ facts: [], error: 'Failed to generate math facts' }, { status: 500 });
  }
}
