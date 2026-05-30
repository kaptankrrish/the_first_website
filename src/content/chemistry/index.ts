import type { ChemistryTopic } from '@/types';

export const chemistryTopics: ChemistryTopic[] = [
  {
    id: 'atomic-structure',
    title: 'Atomic Structure',
    description: 'Understanding the fundamental structure of atoms, including protons, neutrons, and electrons.',
    content: `## Atomic Structure

Atoms are the basic building blocks of matter. They consist of three fundamental particles:

### Subatomic Particles

- **Protons**: Positively charged particles in the nucleus
- **Neutrons**: Neutral particles in the nucleus
- **Electrons**: Negatively charged particles orbiting the nucleus

### Key Concepts

- **Atomic Number (Z)**: Number of protons in the nucleus
- **Mass Number (A)**: Sum of protons and neutrons
- **Isotopes**: Atoms of the same element with different numbers of neutrons

### Electron Configuration

Electrons arrange themselves in shells around the nucleus following the 2n² rule:
- Shell 1: 2 electrons
- Shell 2: 8 electrons
- Shell 3: 18 electrons
- Shell 4: 32 electrons`,
    formulas: ['E = -13.6/n² eV', 'λ = h/mv', 'Δx·Δp ≥ ℏ/2'],
    quizzes: [
      { id: 'as-q1', question: 'What is the charge of a proton?', options: ['+1', '-1', '0', '+2'], correctAnswer: 0 },
      { id: 'as-q2', question: 'Which particle has the smallest mass?', options: ['Proton', 'Neutron', 'Electron', 'Nucleus'], correctAnswer: 2 },
      { id: 'as-q3', question: 'What does the atomic number represent?', options: ['Number of neutrons', 'Number of protons', 'Number of electrons', 'Mass of atom'], correctAnswer: 1 },
    ],
    completed: false,
  },
  {
    id: 'periodic-table',
    title: 'Periodic Table',
    description: 'Explore the organization of elements in the periodic table and periodic trends.',
    content: `## Periodic Table

The periodic table organizes all known elements based on their atomic structure and properties.

### Organization

- **Periods**: Horizontal rows (7 periods)
- **Groups**: Vertical columns (18 groups)
- **Blocks**: s, p, d, f blocks based on electron configuration

### Periodic Trends

1. **Atomic Radius**: Decreases across a period, increases down a group
2. **Ionization Energy**: Increases across a period, decreases down a group
3. **Electronegativity**: Increases across a period, decreases down a group
4. **Electron Affinity**: Generally increases across a period

### Key Groups

- **Group 1**: Alkali metals (highly reactive)
- **Group 2**: Alkaline earth metals
- **Group 17**: Halogens (highly reactive non-metals)
- **Group 18**: Noble gases (inert)`,
    formulas: ['IE = hν - KE', 'χ = (IE + EA)/2', 'Zeff = Z - S'],
    quizzes: [
      { id: 'pt-q1', question: 'How many periods are in the periodic table?', options: ['5', '7', '9', '18'], correctAnswer: 1 },
      { id: 'pt-q2', question: 'Which element is in Group 1, Period 3?', options: ['Lithium', 'Sodium', 'Potassium', 'Magnesium'], correctAnswer: 1 },
    ],
    completed: false,
  },
  {
    id: 'chemical-bonding',
    title: 'Chemical Bonding',
    description: 'Understanding how atoms combine through different types of chemical bonds.',
    content: `## Chemical Bonding

Atoms bond together to form molecules and compounds.

### Types of Bonds

1. **Ionic Bonds**: Transfer of electrons between metals and non-metals
2. **Covalent Bonds**: Sharing of electrons between non-metals
3. **Metallic Bonds**: Delocalized electrons in metals

### Lewis Structures

Represent valence electrons as dots around element symbols.

### Molecular Geometry

VSEPR theory predicts molecular shapes:
- Linear (2 electron pairs)
- Trigonal planar (3 pairs)
- Tetrahedral (4 pairs)
- Trigonal bipyramidal (5 pairs)
- Octahedral (6 pairs)`,
    formulas: ['F = k(q₁q₂/r²)', 'Bond Energy = Σ bonds broken - Σ bonds formed', 'VSEPR: AXE notation'],
    quizzes: [
      { id: 'cb-q1', question: 'What type of bond involves electron sharing?', options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correctAnswer: 1 },
      { id: 'cb-q2', question: 'What is the shape of a molecule with 4 electron pairs?', options: ['Linear', 'Trigonal planar', 'Tetrahedral', 'Octahedral'], correctAnswer: 2 },
    ],
    completed: false,
  },
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    description: 'Study of energy changes in chemical reactions.',
    content: `## Chemical Thermodynamics

Thermodynamics deals with heat and energy changes in chemical reactions.

### Laws of Thermodynamics

1. **First Law**: Energy cannot be created or destroyed
2. **Second Law**: Entropy of the universe always increases
3. **Third Law**: Perfect crystal at 0K has zero entropy

### Key Concepts

- **Enthalpy (H)**: Heat content of a system
- **Entropy (S)**: Measure of disorder
- **Gibbs Free Energy (G)**: Determines spontaneity

### Spontaneity

ΔG = ΔH - TΔS
- ΔG < 0: Spontaneous
- ΔG = 0: Equilibrium
- ΔG > 0: Non-spontaneous`,
    formulas: ['ΔG = ΔH - TΔS', 'ΔU = q + w', 'ΔS = qrev/T', 'PV = nRT'],
    quizzes: [
      { id: 'td-q1', question: 'What does negative ΔG indicate?', options: ['Non-spontaneous', 'Spontaneous', 'Equilibrium', 'No reaction'], correctAnswer: 1 },
      { id: 'td-q2', question: 'What is entropy a measure of?', options: ['Heat', 'Disorder', 'Pressure', 'Volume'], correctAnswer: 1 },
    ],
    completed: false,
  },
  {
    id: 'organic-chemistry',
    title: 'Organic Chemistry',
    description: 'Introduction to carbon compounds and their reactions.',
    content: `## Organic Chemistry

Organic chemistry studies carbon-containing compounds.

### Functional Groups

- **Alkanes**: C-C single bonds
- **Alkenes**: C=C double bonds
- **Alkynes**: C≡C triple bonds
- **Alcohols**: -OH group
- **Carboxylic Acids**: -COOH group
- **Amines**: -NH₂ group

### Nomenclature

IUPAC naming system:
1. Find the longest carbon chain
2. Number the chain
3. Name substituents
4. Combine with prefixes/suffixes

### Reaction Types

- **Substitution**: Replace one atom/group with another
- **Addition**: Add atoms across a double/triple bond
- **Elimination**: Remove atoms to form double bonds
- **Oxidation**: Increase oxygen or decrease hydrogen`,
    formulas: ['CₙH₂ₙ₊₂ (alkanes)', 'CₙH₂ₙ (alkenes)', 'CₙH₂ₙ₋₂ (alkynes)'],
    quizzes: [
      { id: 'oc-q1', question: 'What is the general formula for alkanes?', options: ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'], correctAnswer: 0 },
      { id: 'oc-q2', question: 'Which functional group contains -OH?', options: ['Aldehyde', 'Ketone', 'Alcohol', 'Ether'], correctAnswer: 2 },
    ],
    completed: false,
  },
];
