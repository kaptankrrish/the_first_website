const NVIDIA_API = '/api/nvidia';

interface NvidiaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const POSITIVE_WORDS = /\b(success|growth|positive|innovation|improve|advance|benefit|excellent|good|great|amazing|wonderful|powerful|breakthrough|milestone|achievement|progress|optimistic|thriving|flourish|prosper|gain|victory|triumph|win|leading|excellent|superior|outstanding|remarkable|exceptional)\b/gi;
const NEGATIVE_WORDS = /\b(fail|loss|negative|crisis|decline|threat|risk|problem|issue|concern|worry|danger|destruction|collapse|disaster|tragic|devastating|harmful|damaging|toxic|hazard|severe|critical|urgent|alarming|deteriorating|struggling|vulnerable|exposed|weak|fragile|unstable)\b/gi;

function extractKeywordsFromText(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));
  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
}

const STOP_WORDS = new Set([
  'the','and','for','are','but','not','you','all','can','had','her','was','one','our',
  'out','this','that','with','have','from','they','been','said','each','which','their',
  'will','other','about','many','then','them','would','make','like','time','just','over',
  'such','take','year','into','could','than','some','what','when','your','how','its',
  'also','more','very','most','such','into','than','only','other','new','some','could',
  'than','more','most','well','back','much','also','only','after','use','work','first',
  'even','want','because','these','two','may','any','where','need','find','long','down',
  'should','come','made','before','through','never','same','tell','does','set','three',
  'high','keep','every','under','between','around','while','both','using','during','still',
  'enough','before','should','right','large','small','place','world','life','hand','part',
  'case','week','company','system','program','question','work','government','number','night',
  'point','home','water','room','mother','area','money','story','fact','month','lot','study',
  'book','eye','job','word','business','issue','side','kind','head','house','service','friend',
  'father','power','hour','game','line','end','member','law','car','city','community','name',
  'president','team','minute','idea','body','information','back','parent','face','others',
  'level','office','door','health','person','art','war','history','party','result','change',
  'morning','reason','research','girl','guy','moment','air','teacher','force','education',
]);

function getSmartSummary(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length <= 2) return text.trim();
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 30) return `This content discusses: ${sentences[0].trim()}. The main point is that ${sentences[1].trim().toLowerCase()}.`;
  const summaryParts = sentences.slice(0, Math.min(3, sentences.length)).map(s => s.trim());
  return `Key points: ${summaryParts.join('. ')}.`;
}

function getSmartSentiment(text: string): { sentiment: string; score: number } {
  const posMatches = text.match(POSITIVE_WORDS) || [];
  const negMatches = text.match(NEGATIVE_WORDS) || [];
  const total = posMatches.length + negMatches.length;
  if (total === 0) return { sentiment: 'neutral', score: 0.5 };
  const ratio = posMatches.length / total;
  if (ratio > 0.6) return { sentiment: 'positive', score: Math.min(0.9, 0.5 + ratio * 0.4) };
  if (ratio < 0.4) return { sentiment: 'negative', score: Math.max(0.1, ratio * 0.4) };
  return { sentiment: 'neutral', score: 0.5 };
}

function getSmartKeywords(text: string): string[] {
  const keywords = extractKeywordsFromText(text);
  if (keywords.length >= 5) return keywords;
  const categories: Record<string, string[]> = {
    technology: ['AI', 'Machine Learning', 'Blockchain', 'Cloud', 'Software', 'Digital'],
    science: ['Research', 'Discovery', 'Experiment', 'Theory', 'Data', 'Analysis'],
    business: ['Market', 'Strategy', 'Growth', 'Revenue', 'Customer', 'Industry'],
    health: ['Wellness', 'Treatment', 'Medical', 'Healthcare', 'Patient', 'Therapy'],
    general: ['Innovation', 'Development', 'Impact', 'Future', 'Trends', 'Analysis'],
  };
  const textLower = text.toLowerCase();
  let detected = 'general';
  for (const cat of Object.keys(categories)) {
    if (textLower.includes(cat)) { detected = cat; break; }
  }
  return [...keywords, ...categories[detected].slice(0, 5 - keywords.length)].slice(0, 10);
}

function getSmartExplanation(topic: string, context: string): string {
  const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const briefContext = sentences.length > 0 ? sentences[0].trim() : context.substring(0, 150);
  return `"${topic}" refers to a concept or entity that plays a significant role in its field. Based on the context: ${briefContext}. In essence, understanding "${topic}" requires recognizing its core purpose and how it relates to broader trends and developments. This topic is relevant because it impacts various aspects of modern life and continues to evolve with new research and applications.`;
}

function getSmartChatResponse(message: string, context?: string): string {
  const msgLower = message.toLowerCase();
  if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey')) {
    return "Hello! I'm your AI assistant. I can help you understand news articles, explain concepts, analyze content, and answer questions. What would you like to explore?";
  }
  if (msgLower.includes('thank')) {
    return "You're welcome! Feel free to ask if you have more questions about the content or any other topics.";
  }
  if (msgLower.includes('what') || msgLower.includes('how') || msgLower.includes('why')) {
    const contextSnippet = context ? ` Based on the context you provided: "${context.substring(0, 100)}..." ` : '';
    return `That's a great question.${contextSnippet}To give you the best answer, I'd recommend exploring the source material in detail. The key aspects to consider are the main themes, supporting evidence, and any conclusions drawn. Would you like me to elaborate on any specific aspect?`;
  }
  if (msgLower.includes('explain') || msgLower.includes('meaning') || msgLower.includes('define')) {
    return "To explain this concept: it involves understanding the fundamental principles, its practical applications, and its significance in the broader context. The core idea revolves around interconnected relationships between different elements. Would you like me to break down any specific part?";
  }
  return "I understand your question. To provide the most helpful response, I'd need a bit more context. Could you share which article or topic you're referring to? In general, I can help with summarizing content, explaining concepts, analyzing sentiment, and extracting key information.";
}

function getTranslateNote(text: string, targetLanguage: string): string {
  return `[Translation to ${targetLanguage} requires an NVIDIA API key. The original text is: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"]`;
}

function getFallbackResponse(messages: NvidiaMessage[]): string {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  if (lastMsg.includes('summarize') || lastMsg.includes('summary')) {
    const textMatch = messages[messages.length - 1]?.content || '';
    return getSmartSummary(textMatch.replace(/summarize|summary|please|the following content:/gi, '').trim());
  }
  if (lastMsg.includes('explain') || lastMsg.includes('meaning')) {
    const content = messages[messages.length - 1]?.content || '';
    const topicMatch = content.match(/explain\s+["']?([^"'\n]+)["']?/i);
    const topic = topicMatch ? topicMatch[1] : 'this concept';
    return getSmartExplanation(topic, content);
  }
  if (lastMsg.includes('sentiment')) return JSON.stringify(getSmartSentiment(messages[messages.length - 1]?.content || ''));
  if (lastMsg.includes('keywords') || lastMsg.includes('topics')) return JSON.stringify(getSmartKeywords(messages[messages.length - 1]?.content || ''));
  if (lastMsg.includes('translate')) {
    const langMatch = lastMsg.match(/translate.*to\s+(\w+)/);
    return getTranslateNote(messages[messages.length - 1]?.content || '', langMatch ? langMatch[1] : 'the target language');
  }
  return getSmartChatResponse(messages[messages.length - 1]?.content || '');
}

async function callNvidia(messages: NvidiaMessage[], temperature = 0.5, maxTokens = 500): Promise<string> {
  try {
    const res = await fetch(NVIDIA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, temperature, maxTokens }),
    });
    if (!res.ok) return getFallbackResponse(messages);
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
    const parsed = JSON.parse(response) as { sentiment: string; score: number };
    if (parsed.sentiment && typeof parsed.score === 'number') return parsed;
  } catch { /* fallback below */ }
  return getSmartSentiment(text);
}

export async function extractKeywords(text: string): Promise<string[]> {
  const response = await callNvidia([
    { role: 'system', content: 'Extract the top 5-10 key topics/keywords from the text. Respond with only a JSON array of strings.' },
    { role: 'user', content: text.substring(0, 2000) },
  ], 0.3, 200);
  try {
    const parsed = JSON.parse(response) as string[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch { /* fallback below */ }
  return getSmartKeywords(text);
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
