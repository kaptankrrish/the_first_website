# AI Knowledge Ecosystem

A futuristic AI-powered knowledge platform combining news, learning, productivity, and insights. Built with Next.js 15, TypeScript, Tailwind CSS, and modern frontend technologies.

## Features

- **News Aggregation** - RSS feeds from BBC, TechCrunch, NY Times + Hacker News API
- **Science Explorer** - arXiv API integration for latest research
- **Weather Dashboard** - Open-Meteo API with hourly/7-day forecasts
- **Crypto Tracker** - CoinGecko API with live prices and charts
- **Movie Database** - TMDB integration with trending movies
- **Learning Modules** - Chemistry, Mathematics, Vedic Knowledge
- **Productivity Suite** - Todo, Pomodoro, Habits, Notes
- **Tools** - Password Generator, Gradient Generator, Calculators
- **AI Insights** - Content analysis with NVIDIA API
- **Global Search** - Search across all content types
- **Dark/Light Mode** - Theme support with next-themes

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (state management)
- TanStack Query (data fetching)
- Recharts (charts)
- Radix UI (accessible components)
- Lucide React (icons)
- next-themes (theming)

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_NVIDIA_API_KEY=your_nvidia_api_key
NEXT_PUBLIC_TMDB_KEY=your_tmdb_api_key
```

- NVIDIA API key is optional but enables AI-powered content analysis
- TMDB key is optional; movies fallback to built-in classics

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/          # Next.js App Router pages
├── components/   # UI and layout components
├── content/      # Learning content (vedic, chemistry, maths, blogs)
├── hooks/        # Custom React hooks
├── services/     # API services (news, weather, crypto, movies, nvidia)
├── store/        # Zustand state stores
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
└── components/
    ├── layout/   # Sidebar, navbar, providers, backgrounds
    └── ui/       # Shadcn-style UI components
```

## Free APIs Used

- **RSS2JSON** - RSS feed parsing
- **Hacker News API** - Tech news
- **arXiv API** - Scientific articles
- **Open-Meteo** - Weather data
- **CoinGecko** - Cryptocurrency data
- **TMDB** - Movie database (optional)
- **NVIDIA AI** - AI content analysis (optional)
- **Quotable** - Inspirational quotes

## Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or any Node.js hosting platform.
