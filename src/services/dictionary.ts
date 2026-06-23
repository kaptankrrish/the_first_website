export async function fetchWordOfTheDay() {
  try {
    // We fetch a random word from random-word-api, then get definition from dictionaryapi.dev
    const wordRes = await fetch('https://random-word-api.herokuapp.com/word');
    const [word] = await wordRes.json();
    
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
