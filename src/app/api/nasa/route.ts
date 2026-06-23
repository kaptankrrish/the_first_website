import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const count = 12;

    // Strategy: Use NASA Image and Video Library API for more variety than APOD
    const res = await fetch(`https://images-api.nasa.gov/search?q=space&media_type=image&page=${page}`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error('NASA API failed');

    const data = await res.json();

    interface NasaItem {
      data: Array<{
        nasa_id: string;
        title: string;
        description?: string;
        date_created: string;
        center?: string;
      }>;
      links?: Array<{ href: string }>;
    }

    const items = data.collection.items.slice(0, count).map((item: NasaItem) => {
      const data = item.data[0];
      return {
        id: `nasa-${data.nasa_id}-${Date.now()}`,
        title: data.title,
        description: data.description?.substring(0, 300) + '...',
        content: data.description,
        url: `https://images.nasa.gov/details-${data.nasa_id}`,
        imageUrl: item.links?.[0]?.href || '',
        source: 'NASA',
        category: 'Space',
        publishedAt: data.date_created,
        author: data.center || 'NASA',
        saved: false,
      };
    });

    return NextResponse.json({ articles: items });
  } catch (err) {
    console.error('NASA API error:', err);
    return NextResponse.json({ articles: [], error: 'Failed to fetch NASA data' }, { status: 500 });
  }
}
