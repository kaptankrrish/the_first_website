import { generateId } from '@/utils';
import { vedicContent as fallbackVedicContent } from '@/content/vedic';
import type { VedicContent } from '@/types';

// Reliable Static API for Bhagavad Gita
const GITA_API_BASE = 'https://vedicscriptures.github.io';

export async function fetchVedicContent(category?: string, page: number = 1): Promise<VedicContent[]> {
  try {
    const items: VedicContent[] = [];
    
    if (category === 'Rigveda') {
      // Fetch from DharmicData (Raw GitHub)
      // Mandala 1 is a good start, we can randomize mandalas for "infinite" effect
      const mandala = Math.floor(Math.random() * 10) + 1;
      const res = await fetch(`https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/Rigveda/rigveda_mandala_${mandala}.json`);
      
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Get 5 random suktas from this mandala
          const startIdx = Math.floor(Math.random() * (data.length - 5));
          const suktas = data.slice(startIdx, startIdx + 5);
          
          interface RigvedaEntry {
            sukta: number | string;
            text: string;
          }

          return suktas.map((s: RigvedaEntry) => ({
            id: `rigveda-${mandala}-${s.sukta}-${generateId()}`,
            title: `Rigveda: Mandala ${mandala}, Sukta ${s.sukta}`,
            sanskrit: s.text,
            transliteration: 'Transliteration available in full view.',
            hindi: 'Hindi translation coming soon from Vedic Heritage sources.',
            english: 'English translation available via Wisdom Library integration.',
            explanation: 'A sacred hymn from the oldest of the four Vedas, focusing on nature, deities, and cosmic order.',
            philosophy: 'Vedic hymns (Suktas) are the foundation of Sanatana Dharma, representing early spiritual realizations.',
            source: 'Rigveda',
            chapter: `Mandala ${mandala}`,
          }));
        }
      }
    }

    // Default to Bhagavad Gita for Slokas, Learning, etc.
    // Fetch 5 random verses
    for (let i = 0; i < 5; i++) {
      const chapter = Math.floor(Math.random() * 18) + 1;
      const verse = Math.floor(Math.random() * 20) + 1;
      
      try {
        const res = await fetch(`${GITA_API_BASE}/slok/${chapter}/${verse}`, {
          next: { revalidate: 3600 }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.slok) {
            items.push({
              id: `gita-${chapter}-${verse}-${generateId()}`,
              title: `Bhagavad Gita: Chapter ${chapter}, Verse ${verse}`,
              sanskrit: data.slok,
              transliteration: data.transliteration || 'N/A',
              hindi: data.tej?.ht || 'Hindi translation available in full view.',
              english: data.siva?.et || data.gambir?.et || 'English translation available.',
              explanation: data.purohit?.et || 'Deep philosophical discourse between Krishna and Arjuna.',
              philosophy: 'The Bhagavad Gita is the essence of Vedic knowledge and one of the most important texts of Hindu philosophy.',
              source: category === 'Upanishads' ? 'Upanishads' : 'Bhagavad Gita',
              chapter: `Chapter ${chapter}`,
            });
          }
        }
      } catch (e) {
        console.error('Error fetching Gita sloka:', e);
      }
    }

    if (items.length > 0) {
      return items;
    }
  } catch (error) {
    console.warn('Vedic fetch error, using fallback:', error);
  }
  
  // Final fallback to static content if everything fails
  if (page === 1) {
    if (category) {
      return fallbackVedicContent.filter(v => 
        v.source === category || 
        (category === 'Slokas' && v.id.includes('sloka')) ||
        (category === 'Upanishads' && v.source.includes('Upanishad'))
      );
    }
    return fallbackVedicContent;
  }
  
  return [];
}
