import {
  Home, Newspaper, Beaker, Quote, BookOpen, Cloud, DollarSign, Film,
  LayoutDashboard, GraduationCap, Atom, Calculator, BookMarked,
  BookText, Languages, FileText, CheckSquare, Timer, Moon, PenTool,
  Key, Palette, Percent, HomeIcon, Search, Bookmark, Settings,
  BarChart3, Zap,
} from 'lucide-react';

export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  translationKey: string;
}

export const mainItems: NavItem[] = [
  { icon: Home, label: 'Home', href: '/', translationKey: 'home' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', translationKey: 'dashboard' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', translationKey: 'analytics', badge: 'New' },
  { icon: Newspaper, label: 'News', href: '/news', translationKey: 'news' },
  { icon: Search, label: 'Search', href: '/search', translationKey: 'search' },
];

export const learnItems: NavItem[] = [
  { icon: Beaker, label: 'Science', href: '/science', translationKey: 'science' },
  { icon: Atom, label: 'Chemistry', href: '/chemistry', translationKey: 'chemistry' },
  { icon: Zap, label: 'Physics', href: '/physics', translationKey: 'physics' },
  { icon: Calculator, label: 'Maths', href: '/maths', translationKey: 'maths' },
  { icon: GraduationCap, label: 'Daily Learning', href: '/daily-learning', translationKey: 'dailyLearning' },
  { icon: BookMarked, label: 'Vedic Learning', href: '/vedic-learning', translationKey: 'vedicLearning' },
  { icon: BookText, label: 'Vedas', href: '/vedas', translationKey: 'vedas' },
  { icon: BookText, label: 'Upanishads', href: '/upanishads', translationKey: 'upanishads' },
  { icon: Languages, label: 'Translations', href: '/translations', translationKey: 'translations' },
  { icon: FileText, label: 'Slokas', href: '/slokas', translationKey: 'slokas' },
];

export const mediaItems: NavItem[] = [
  { icon: Cloud, label: 'Weather', href: '/weather', translationKey: 'weather' },
  { icon: DollarSign, label: 'Crypto', href: '/crypto', translationKey: 'crypto' },
  { icon: Film, label: 'Movies', href: '/movies', translationKey: 'movies' },
  { icon: Quote, label: 'Quotes', href: '/quotes', translationKey: 'quotes' },
  { icon: BookOpen, label: 'Blogs', href: '/blogs', translationKey: 'blogs' },
];

export const productivityItems: NavItem[] = [
  { icon: CheckSquare, label: 'Todo', href: '/todo', translationKey: 'todo' },
  { icon: Timer, label: 'Pomodoro', href: '/pomodoro', translationKey: 'pomodoro' },
  { icon: Moon, label: 'Habits', href: '/habits', translationKey: 'habits' },
  { icon: PenTool, label: 'Notes', href: '/notes', translationKey: 'notes' },
];

export const toolsItems: NavItem[] = [
  { icon: Key, label: 'Password Gen', href: '/password-generator', translationKey: 'passwordGen' },
  { icon: Palette, label: 'Gradient Gen', href: '/gradient-generator', translationKey: 'gradientGen' },
  { icon: Percent, label: 'Tip Calc', href: '/tip-calculator', translationKey: 'tipCalc' },
  { icon: HomeIcon, label: 'Mortgage Calc', href: '/mortgage-calculator', translationKey: 'mortgageCalc' },
];

export const bottomItems: NavItem[] = [
  { icon: Bookmark, label: 'Saved', href: '/saved', translationKey: 'saved' },
  { icon: Settings, label: 'Settings', href: '/settings', translationKey: 'settings' },
];

export const mobileMainItems: NavItem[] = [
  { icon: Home, label: 'Home', href: '/', translationKey: 'home' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', translationKey: 'dashboard' },
  { icon: Newspaper, label: 'News', href: '/news', translationKey: 'news' },
  { icon: Search, label: 'Search', href: '/search', translationKey: 'search' },
];

export const mobileMoreItems: NavItem[] = [
  { icon: Cloud, label: 'Weather', href: '/weather', translationKey: 'weather' },
  { icon: GraduationCap, label: 'Learn', href: '/daily-learning', translationKey: 'dailyLearning' },
  { icon: Moon, label: 'Habits', href: '/habits', translationKey: 'habits' },
  { icon: Calculator, label: 'Tools', href: '/password-generator', translationKey: 'passwordGen' },
  { icon: Bookmark, label: 'Saved', href: '/saved', translationKey: 'saved' },
  { icon: Settings, label: 'Settings', href: '/settings', translationKey: 'settings' },
];
