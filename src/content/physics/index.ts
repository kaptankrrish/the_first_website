import type { PhysicsTopic } from '@/types';

export const physicsTopics: PhysicsTopic[] = [
  {
    id: 'classical-mechanics',
    title: 'Classical Mechanics',
    description: 'Newton\'s laws of motion, kinematics, and dynamics of rigid bodies.',
    content: `## Classical Mechanics

Classical mechanics describes the motion of macroscopic objects under the influence of forces.

### Newton's Laws of Motion

1. **First Law (Inertia)**: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a net external force.
2. **Second Law**: F = ma — The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.
3. **Third Law**: For every action, there is an equal and opposite reaction.

### Kinematic Equations

- v = v₀ + at
- x = x₀ + v₀t + ½at²
- v² = v₀² + 2a(x - x₀)
- x = x₀ + ½(v₀ + v)t

### Work and Energy

- **Work**: W = F · d · cos(θ)
- **Kinetic Energy**: KE = ½mv²
- **Potential Energy**: PE = mgh (gravitational)
- **Work-Energy Theorem**: W_net = ΔKE`,
    formulas: ['F = ma', 'KE = ½mv²', 'PE = mgh', 'W = F·d·cos(θ)'],
    quizzes: [
      { id: 'cm-q1', question: 'What is Newton\'s second law?', options: ['F = mv', 'F = ma', 'F = mg', 'F = m/a'], correctAnswer: 1 },
      { id: 'cm-q2', question: 'What is the unit of force in SI?', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correctAnswer: 2 },
      { id: 'cm-q3', question: 'An object is thrown upward. At the highest point, its velocity is:', options: ['Maximum', 'Zero', 'Negative', 'Infinite'], correctAnswer: 1 },
    ],
    completed: false,
  },
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    description: 'Heat, temperature, energy transfer, and the laws of thermodynamics.',
    content: `## Thermodynamics

Thermodynamics deals with heat, work, temperature, and their relation to energy and entropy.

### Zeroth Law
If two systems are each in thermal equilibrium with a third system, they are in thermal equilibrium with each other.

### First Law (Conservation of Energy)
ΔU = Q - W
The change in internal energy equals heat added minus work done by the system.

### Second Law (Entropy)
The total entropy of an isolated system can never decrease over time. Heat flows spontaneously from hot to cold.

### Third Law
As temperature approaches absolute zero, the entropy of a system approaches a minimum value.

### Key Concepts

- **Heat Capacity**: C = Q/ΔT
- **Ideal Gas Law**: PV = nRT
- **Entropy**: S = k·ln(W)
- **Carnot Efficiency**: η = 1 - T_cold/T_hot`,
    formulas: ['PV = nRT', 'ΔU = Q - W', 'η = 1 - T_c/T_h', 'S = k·ln(W)'],
    quizzes: [
      { id: 'td-q1', question: 'What does the First Law of Thermodynamics state?', options: ['Energy cannot be created', 'Entropy always increases', 'Heat flows from cold to hot', 'Temperature is absolute'], correctAnswer: 0 },
      { id: 'td-q2', question: 'What is the SI unit of entropy?', options: ['Joule', 'Watt', 'Joule/Kelvin', 'Kelvin'], correctAnswer: 2 },
    ],
    completed: false,
  },
  {
    id: 'electromagnetism',
    title: 'Electromagnetism',
    description: 'Electric and magnetic fields, Maxwell\'s equations, and electromagnetic waves.',
    content: `## Electromagnetism

Electromagnetism describes the interaction between electric charges and magnetic fields.

### Coulomb's Law
F = k·|q₁q₂|/r²
The force between two point charges is proportional to the product of charges and inversely proportional to the square of distance.

### Electric Field
E = F/q = kQ/r²

### Magnetic Field
- Force on moving charge: F = qvB·sin(θ)
- Force on current-carrying wire: F = BIL·sin(θ)

### Maxwell's Equations

1. **Gauss's Law**: ∮E·dA = q/ε₀
2. **Gauss's Law for Magnetism**: ∮B·dA = 0
3. **Faraday's Law**: ∮E·dl = -dΦ_B/dt
4. **Ampère's Law**: ∮B·dl = μ₀I + μ₀ε₀·dΦ_E/dt

### Electromagnetic Waves
c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s`,
    formulas: ['F = kq₁q₂/r²', 'E = kQ/r²', 'F = qvBsin(θ)', 'c = 3×10⁸ m/s'],
    quizzes: [
      { id: 'em-q1', question: 'What is the speed of light in vacuum?', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], correctAnswer: 1 },
      { id: 'em-q2', question: 'Which equation relates electric and magnetic fields?', options: ['F = ma', 'PV = nRT', 'Maxwell\'s equations', 'Schrödinger equation'], correctAnswer: 2 },
    ],
    completed: false,
  },
  {
    id: 'quantum-mechanics',
    title: 'Quantum Mechanics',
    description: 'Wave-particle duality, Schrödinger equation, and quantum states.',
    content: `## Quantum Mechanics

Quantum mechanics describes the behavior of matter and energy at the atomic and subatomic scale.

### Wave-Particle Duality
All matter exhibits both wave and particle properties.
- de Broglie wavelength: λ = h/p = h/(mv)

### Heisenberg Uncertainty Principle
Δx·Δp ≥ ℏ/2
You cannot simultaneously know both the exact position and momentum of a particle.

### Schrödinger Equation
iℏ·∂Ψ/∂t = ĤΨ
Describes how quantum states evolve over time.

### Key Concepts

- **Quantization**: Energy comes in discrete packets (quanta)
- **Superposition**: A quantum system can exist in multiple states simultaneously
- **Entanglement**: Particles can be correlated regardless of distance
- **Wave Function (Ψ)**: Probability amplitude for finding a particle
- **Probability Density**: |Ψ|² gives the probability of finding a particle at a given position`,
    formulas: ['λ = h/p', 'Δx·Δp ≥ ℏ/2', 'E = hf', 'λ = h/(mv)'],
    quizzes: [
      { id: 'qm-q1', question: 'What does the uncertainty principle state?', options: ['Energy is conserved', 'Position and momentum cannot both be known precisely', 'Light is a wave', 'Atoms are indivisible'], correctAnswer: 1 },
      { id: 'qm-q2', question: 'What is Planck\'s constant approximately?', options: ['6.63×10⁻³⁴ J·s', '6.63×10⁻²³ J·s', '6.63×10⁻¹⁰ J·s', '6.63×10⁻⁴⁴ J·s'], correctAnswer: 0 },
    ],
    completed: false,
  },
  {
    id: 'relativity',
    title: 'Relativity',
    description: 'Special and general relativity, spacetime, and mass-energy equivalence.',
    content: `## Relativity

Albert Einstein's theories of relativity revolutionized our understanding of space, time, and gravity.

### Special Relativity (1905)

- **Postulate 1**: The laws of physics are the same in all inertial frames
- **Postulate 2**: The speed of light is constant in all reference frames
- **Time Dilation**: Δt' = Δt/√(1 - v²/c²)
- **Length Contraction**: L' = L√(1 - v²/c²)
- **Mass-Energy Equivalence**: E = mc²

### General Relativity (1915)

- Gravity is not a force but a curvature of spacetime
- Massive objects warp the fabric of spacetime
- **Einstein Field Equations**: Gμν + Λgμν = (8πG/c⁴)Tμν
- Predictions: gravitational lensing, black holes, gravitational waves

### Key Implications
- Nothing can travel faster than light
- Time passes differently at different gravitational potentials
- GPS satellites must account for relativistic effects`,
    formulas: ['E = mc²', 'Δt\' = Δt/√(1-v²/c²)', 'E² = (pc)² + (mc²)²', 'F = GMm/r²'],
    quizzes: [
      { id: 'rt-q1', question: 'What is mass-energy equivalence?', options: ['F = ma', 'E = mc²', 'PV = nRT', 'λ = h/p'], correctAnswer: 1 },
      { id: 'rt-q2', question: 'According to special relativity, what is the speed limit of the universe?', options: ['Speed of sound', 'Speed of light', 'Speed of gravity', 'Infinite'], correctAnswer: 1 },
    ],
    completed: false,
  },
];
