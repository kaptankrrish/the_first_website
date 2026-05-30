import type { MathTopic } from '@/types';

export const mathTopics: MathTopic[] = [
  {
    id: 'algebra',
    title: 'Algebra',
    description: 'Master the fundamentals of algebra including equations, polynomials, and functions.',
    content: `## Algebra

Algebra is the branch of mathematics dealing with symbols and rules for manipulating them.

### Key Concepts

1. **Linear Equations**: ax + b = 0
2. **Quadratic Equations**: ax² + bx + c = 0
3. **Polynomials**: Expressions with multiple terms
4. **Functions**: Relations between inputs and outputs

### Quadratic Formula

For ax² + bx + c = 0:
x = (-b ± √(b² - 4ac)) / 2a

### Factoring Rules

- a² - b² = (a - b)(a + b)
- a² + 2ab + b² = (a + b)²
- a² - 2ab + b² = (a - b)²`,
    formulas: ['x = (-b ± √(b² - 4ac))/2a', '(a+b)² = a² + 2ab + b²', 'a² - b² = (a-b)(a+b)'],
    practiceProblems: [
      { id: 'al-p1', question: 'Solve for x: 2x + 5 = 13', answer: 'x = 4', steps: ['2x + 5 = 13', '2x = 13 - 5', '2x = 8', 'x = 4'], difficulty: 'easy' },
      { id: 'al-p2', question: 'Solve for x: x² - 5x + 6 = 0', answer: 'x = 2 or x = 3', steps: ['x² - 5x + 6 = 0', '(x - 2)(x - 3) = 0', 'x - 2 = 0 or x - 3 = 0', 'x = 2 or x = 3'], difficulty: 'medium' },
    ],
    completed: false,
  },
  {
    id: 'geometry',
    title: 'Geometry',
    description: 'Explore shapes, angles, areas, and volumes in two and three dimensions.',
    content: `## Geometry

Geometry studies the properties of space and shapes.

### Shapes and Formulas

**Triangles**: Area = ½ × base × height
**Circles**: Area = πr², Circumference = 2πr
**Rectangles**: Area = length × width, Perimeter = 2(l + w)

### Theorems

- **Pythagorean Theorem**: a² + b² = c²
- **Triangle Sum**: Sum of angles = 180°
- **Similar Triangles**: Corresponding angles equal, sides proportional

### 3D Shapes

- **Sphere**: Volume = ⁴⁄₃πr³
- **Cylinder**: Volume = πr²h
- **Cone**: Volume = ⅓πr²h`,
    formulas: ['A = ½bh', 'A = πr²', 'C = 2πr', 'a² + b² = c²', 'V = ⁴⁄₃πr³'],
    practiceProblems: [
      { id: 'ge-p1', question: 'Find the area of a circle with radius 7 cm.', answer: '153.94 cm²', steps: ['A = πr²', 'A = π(7)²', 'A = 49π', 'A ≈ 153.94 cm²'], difficulty: 'easy' },
    ],
    completed: false,
  },
  {
    id: 'calculus',
    title: 'Calculus',
    description: 'Understand limits, derivatives, and integrals - the mathematics of change.',
    content: `## Calculus

Calculus is the mathematical study of continuous change.

### Limits

The limit of a function as x approaches a value:
lim(x→a) f(x) = L

### Derivatives

The derivative measures the rate of change:
f'(x) = lim(h→0) [f(x+h) - f(x)]/h

**Basic Derivatives:**
- d/dx(xⁿ) = nxⁿ⁻¹
- d/dx(sin x) = cos x
- d/dx(eˣ) = eˣ

### Integrals

The integral represents the area under a curve:
∫f(x)dx = F(x) + C

### Fundamental Theorem of Calculus

∫ₐᵇ f(x)dx = F(b) - F(a)`,
    formulas: ["f'(x) = lim(h→0) [f(x+h)-f(x)]/h", '∫f(x)dx = F(x) + C', 'd/dx(xⁿ) = nxⁿ⁻¹'],
    practiceProblems: [
      { id: 'ca-p1', question: 'Find the derivative of f(x) = 3x² + 2x - 1', answer: "f'(x) = 6x + 2", steps: ['f(x) = 3x² + 2x - 1', "d/dx(3x²) = 6x", "d/dx(2x) = 2", "d/dx(-1) = 0", "f'(x) = 6x + 2"], difficulty: 'medium' },
    ],
    completed: false,
  },
  {
    id: 'trigonometry',
    title: 'Trigonometry',
    description: 'Master the relationships between angles and sides in triangles.',
    content: `## Trigonometry

Trigonometry deals with the relationships between angles and sides of triangles.

### Basic Ratios

- sin θ = opposite/hypotenuse
- cos θ = adjacent/hypotenuse
- tan θ = opposite/adjacent

### Key Identities

- sin²θ + cos²θ = 1
- tan θ = sin θ/cos θ
- sin(2θ) = 2sinθcosθ

### Special Angles

| θ | 0° | 30° | 45° | 60° | 90° |
| sin θ | 0 | ½ | √2/2 | √3/2 | 1 |
| cos θ | 1 | √3/2 | √2/2 | ½ | 0 |
| tan θ | 0 | 1/√3 | 1 | √3 | ∞ |`,
    formulas: ['sin²θ + cos²θ = 1', 'sin(2θ) = 2sinθcosθ', 'Law of Sines: a/sinA = b/sinB = c/sinC'],
    practiceProblems: [
      { id: 'tr-p1', question: 'If sin θ = 3/5, find cos θ.', answer: 'cos θ = 4/5', steps: ['sin²θ + cos²θ = 1', '(3/5)² + cos²θ = 1', '9/25 + cos²θ = 1', 'cos²θ = 16/25', 'cos θ = ±4/5'], difficulty: 'easy' },
    ],
    completed: false,
  },
  {
    id: 'statistics',
    title: 'Statistics & Probability',
    description: 'Learn to analyze data and understand probability theory.',
    content: `## Statistics & Probability

Statistics deals with data collection, analysis, and interpretation.

### Measures of Central Tendency

- **Mean**: Average of all values
- **Median**: Middle value when sorted
- **Mode**: Most frequent value

### Measures of Dispersion

- **Range**: Max - Min
- **Variance**: Average of squared differences
- **Standard Deviation**: √Variance

### Probability

P(A) = Number of favorable outcomes / Total outcomes

- P(A∩B) = P(A) × P(B) [independent events]
- P(A∪B) = P(A) + P(B) - P(A∩B)`,
    formulas: ['x̄ = Σx/n', 'σ² = Σ(x-x̄)²/n', 'σ = √σ²', 'P(A) = n(A)/n(S)'],
    practiceProblems: [
      { id: 'st-p1', question: 'Find the mean of: 4, 8, 6, 5, 3', answer: '5.2', steps: ['Sum = 4 + 8 + 6 + 5 + 3 = 26', 'Count = 5', 'Mean = 26/5 = 5.2'], difficulty: 'easy' },
    ],
    completed: false,
  },
];
