const WORD_LIST = [
  'algorithm', 'quantum', 'philosophy', 'hypothesis', 'nebula',
  'paradox', 'velocity', 'metamorphosis', 'ephemeral', 'ubiquitous',
  'serendipity', 'pragmatic', 'ambiguous', 'resilient', 'eloquent',
  'benevolent', 'magnificent', 'luminous', 'transcendent', 'enigmatic',
  'astronomy', 'botany', 'chemistry', 'ecology', 'geology',
  'thermodynamics', 'microbiology', 'neuroscience', 'paleontology', 'genetics',
  'democracy', 'renaissance', 'revolution', 'civilization', 'mythology',
  'symphony', 'architecture', 'literature', 'photography', 'sculpture'
];

function getRandomWord(): string {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

export async function fetchWordOfTheDay() {
  try {
    const word = getRandomWord();
    
    const defRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!defRes.ok) throw new Error('Not found');
    
    const data = await defRes.json();
    const meaning = data[0].meanings[0].definitions[0].definition;
    
    return {
      word: word.charAt(0).toUpperCase() + word.slice(1),
      definition: meaning,
    };
  } catch {
    return {
      word: 'Resilience',
      definition: 'The capacity to withstand or to recover quickly from difficulties.',
    };
  }
}
