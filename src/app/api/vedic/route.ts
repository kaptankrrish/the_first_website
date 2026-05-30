import { NextRequest, NextResponse } from 'next/server';
import { fetchVedicContent } from '@/services/vedic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);

    const items = await fetchVedicContent(category, page);

    return NextResponse.json({ items });
  } catch (err) {
    console.error('Vedic API Error:', err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
