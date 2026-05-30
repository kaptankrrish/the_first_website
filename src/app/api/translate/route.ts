import { NextResponse } from 'next/server';

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'en') return text;
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GoogleTranslate/2.0)',
      },
    });
    if (!res.ok) throw new Error(`Translate API error: ${res.status}`);
    
    const data = await res.json();
    if (data && data[0]) {
      const translatedParts = (data[0] as Array<[string, ...unknown[]]>)
        .map((part) => part[0] || '')
        .join('');
      return translatedParts || text;
    }
    return text;
  } catch (error) {
    console.error(`Translation failed for: "${text.substring(0, 30)}..."`, error);
    return text;
  }
}

export async function POST(request: Request) {
  try {
    const { text, lang } = await request.json();
    if (!text || !lang || lang === 'en') {
      return NextResponse.json({ translated: text });
    }

    if (Array.isArray(text)) {
      // Translate elements in parallel
      const translated = await Promise.all(
        text.map((t) => (typeof t === 'string' ? translateText(t, lang) : t))
      );
      return NextResponse.json({ translated });
    } else if (typeof text === 'string') {
      const translated = await translateText(text, lang);
      return NextResponse.json({ translated });
    } else {
      return NextResponse.json({ error: 'Invalid text format' }, { status: 400 });
    }
  } catch (err) {
    console.error('Translation endpoint error:', err);
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
  }
}
