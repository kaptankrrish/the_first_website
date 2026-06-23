import { NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NEXT_PUBLIC_NVIDIA_API_KEY || process.env.NVIDIA_API_KEY;
const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

export async function POST(request: Request) {
  if (!NVIDIA_API_KEY) {
    return NextResponse.json({ fallback: true }, { status: 200 });
  }

  try {
    const { messages, temperature, maxTokens } = await request.json();

    const res = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-405b-instruct',
        messages,
        temperature: temperature ?? 0.5,
        top_p: 1,
        max_tokens: maxTokens ?? 500,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('NVIDIA API error:', err);
      return NextResponse.json({ fallback: true }, { status: 200 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ content });
  } catch (err) {
    console.error('NVIDIA route error:', err);
    return NextResponse.json({ fallback: true }, { status: 200 });
  }
}
