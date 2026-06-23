import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const tag = searchParams.get('tag') || ''; // optional filter

    // Dev.to API
    let url = `https://dev.to/api/articles?per_page=12&page=${page}`;
    if (tag && tag !== 'All') {
      url += `&tag=${encodeURIComponent(tag.toLowerCase())}`;
    }

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch from Dev.to');
    
    const articles = await res.json();

    interface DevToArticle {
      id: number;
      title: string;
      description: string;
      user: { name: string };
      tag_list: string[];
      cover_image: string | null;
      social_image: string;
      published_at: string;
      reading_time_minutes: number;
      url: string;
    }

    const posts = articles.map((article: DevToArticle) => ({
      id: article.id.toString(),
      title: article.title,
      excerpt: article.description,
      content: '', // Dev.to requires a separate call for full content by ID
      author: article.user.name,
      category: tag || 'Technology',
      tags: article.tag_list,
      imageUrl: article.cover_image || article.social_image,
      publishedAt: article.published_at,
      readingTime: article.reading_time_minutes,
      url: article.url,
    }));

    return NextResponse.json({ posts });
  } catch (err) {
    console.error('Blogs API Error:', err);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
