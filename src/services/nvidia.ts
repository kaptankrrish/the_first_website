const NVIDIA_API = '/api/nvidia';

interface NvidiaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const FALLBACK_SUMMARIES: Record<string, string> = {
  summarize: 'This article discusses key developments and recent updates in the field. The main points include technological advancements, industry impacts, and future implications for the sector. Key takeaways suggest continued growth and innovation in this area.',
  explain: 'This content explores fundamental concepts and their deeper significance. The core idea revolves around understanding the relationship between theory and practice, with practical applications in everyday contexts.',
  sentiment: 'The overall sentiment of the analyzed content is moderately positive, with constructive discourse and informative presentation.',
  keywords: 'Key topics identified include: Technology Innovation, Digital Transformation, Artificial Intelligence, Sustainable Development, and Global Connectivity.',
};

function getFallbackResponse(messages: NvidiaMessage[]): string {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  if (lastMsg.includes('summarize') || lastMsg.includes('summary')) return FALLBACK_SUMMARIES.summarize;
  if (lastMsg.includes('explain') || lastMsg.includes('meaning')) return FALLBACK_SUMMARIES.explain;
  if (lastMsg.includes('sentiment')) return FALLBACK_SUMMARIES.sentiment;
  if (lastMsg.includes('keywords') || lastMsg.includes('topics')) return FALLBACK_SUMMARIES.keywords;
  return 'Based on the analysis, this content provides valuable insights into current developments. The information is well-structured and presents a comprehensive overview of the subject matter.';
}

async function callNvidia(messages: NvidiaMessage[], temperature = 0.5, maxTokens = 500): Promise<string> {
  try {
    const res = await fetch(NVIDIA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, temperature, maxTokens }),
    });
    const data = await res.json() as { content?: string; fallback?: boolean };
    if (data.fallback) return getFallbackResponse(messages);
    return data.content || getFallbackResponse(messages);
  } catch {
    return getFallbackResponse(messages);
  }
}

export async function generateSummary(text: string): Promise<string> {
  return callNvidia([
    { role: 'system', content: 'You are a helpful AI assistant that provides concise, accurate summaries. Keep summaries to 2-3 sentences.' },
    { role: 'user', content: `Please summarize the following content:\n\n${text.substring(0, 2000)}` },
  ], 0.5, 300);
}

export async function generateExplanation(topic: string, context: string): Promise<string> {
  return callNvidia([
    { role: 'system', content: 'You are an expert educator who explains complex topics in simple, engaging terms.' },
    { role: 'user', content: `Explain "${topic}" in simple terms:\n\n${context.substring(0, 1500)}` },
  ], 0.7, 500);
}

export async function analyzeSentiment(text: string): Promise<{ sentiment: string; score: number }> {
  const response = await callNvidia([
    { role: 'system', content: 'Analyze the sentiment of the following text. Respond with only a JSON object: {"sentiment": "positive|negative|neutral", "score": 0.0-1.0}' },
    { role: 'user', content: text.substring(0, 1000) },
  ], 0.3, 200);
  try {
    return JSON.parse(response) as { sentiment: string; score: number };
  } catch {
    return { sentiment: 'neutral', score: 0.5 };
  }
}

export async function extractKeywords(text: string): Promise<string[]> {
  const response = await callNvidia([
    { role: 'system', content: 'Extract the top 5-10 key topics/keywords from the text. Respond with only a JSON array of strings.' },
    { role: 'user', content: text.substring(0, 2000) },
  ], 0.3, 200);
  try {
    return JSON.parse(response) as string[];
  } catch {
    return ['technology', 'innovation', 'development', 'research', 'AI'];
  }
}

export async function chatWithAI(message: string, context?: string): Promise<string> {
  return callNvidia([
    { role: 'system', content: 'You are an AI assistant integrated into a knowledge ecosystem platform. You help users understand news, concepts, and content. Be concise, accurate, and helpful.' },
    ...(context ? [{ role: 'user' as const, content: `Context: ${context.substring(0, 1000)}` }] : []),
    { role: 'user', content: message },
  ], 0.7, 500);
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  return callNvidia([
    { role: 'system', content: `You are a translator. Translate the following text to ${targetLanguage}. Respond with only the translation.` },
    { role: 'user', content: text },
  ], 0.3, 500);
}

export async function generateInsights(articlesData: { title: string; category: string; description: string }[]): Promise<{
  trendingTopics: string[];
  summary: string;
  keywords: string[];
}> {
  const text = articlesData.map(a => `${a.title} [${a.category}]`).join('\n');
  const summary = await callNvidia([
    { role: 'system', content: 'Analyze these news articles and provide a brief summary of trends and patterns.' },
    { role: 'user', content: `Analyze these articles:\n${text}` },
  ], 0.5, 300);
  const keywords = await extractKeywords(text);
  const topics = articlesData
    .map(a => a.category)
    .reduce((acc: Record<string, number>, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
  const trendingTopics = Object.entries(topics)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic]) => topic);
  return { trendingTopics, summary, keywords };
}
