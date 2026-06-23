export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  source: string;
  category: ArticleCategory;
  publishedAt: string;
  author: string;
  saved: boolean;
}

export type ArticleCategory = 'AI' | 'Technology' | 'Science' | 'Crypto' | 'Finance' | 'Startups' | 'World' | 'Space';

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  description: string;
  icon: string;
}

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  totalVolume: number;
  sparklineIn7d: number[];
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  voteAverage: number;
  releaseDate: string;
  genreIds: number[];
  originalLanguage: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
  source?: string;
}

export type QuoteCategory = 'discipline' | 'philosophy' | 'science' | 'success' | 'spirituality' | 'business';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  logs: string[];
  createdAt: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningProgress {
  subject: string;
  topic: string;
  completed: boolean;
  score: number;
  lastReviewed: string;
}

export interface VedicContent {
  id: string;
  title: string;
  sanskrit: string;
  transliteration: string;
  hindi: string;
  english: string;
  explanation: string;
  philosophy: string;
  source: string;
  chapter: string;
}

export interface Compound {
  id: string;
  title: string;
  formula: string;
  weight: number;
  iupacName: string;
  complexity: number;
  charge: number;
  description: string;
  url: string;
  imageUrl: string;
}

export interface ChemistryTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  formulas: string[];
  quizzes: Quiz[];
  completed: boolean;
}

export interface PhysicsTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  formulas: string[];
  quizzes: Quiz[];
  completed: boolean;
}

export interface MathTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  formulas: string[];
  practiceProblems: Problem[];
  completed: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Problem {
  id: string;
  question: string;
  answer: string;
  steps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'news' | 'blog' | 'science' | 'quote' | 'vedic' | 'note';
  imageUrl?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'sm' | 'md' | 'lg';
  animationsEnabled: boolean;
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
  searchHistory: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl: string;
  publishedAt: string;
  readingTime: number;
  url?: string;
}

export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export interface SavedItem {
  id: string;
  type: 'news' | 'quote' | 'movie' | 'article' | 'blog' | 'vedic';
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  savedAt: string;
}
