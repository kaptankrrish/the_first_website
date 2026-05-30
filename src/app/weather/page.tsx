'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Search, MapPin, Wind, Droplets, Thermometer, Sun, CloudRain, CloudSnow, Cloud, CloudLightning, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { useWeather } from '@/hooks/useWeather';
import { format, parseISO } from 'date-fns';
import { LiveClock } from '@/components/ui/live-clock';
import { useLanguage } from '@/contexts/LanguageContext';

const weatherIconMap: Record<string, React.ElementType> = {
  sun: Sun,
  'cloud-sun': Cloud,
  'cloud-fog': Cloud,
  'cloud-drizzle': CloudRain,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  'cloud-showers-heavy': CloudRain,
  'cloud-bolt': CloudLightning,
};

function getGradient(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('clear') || desc.includes('sunny'))
    return 'from-blue-500/40 via-sky-400/30 to-orange-400/20';
  if (desc.includes('cloud') || desc.includes('overcast'))
    return 'from-slate-600/40 via-gray-500/30 to-slate-400/20';
  if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower'))
    return 'from-slate-700/50 via-blue-600/30 to-indigo-500/20';
  if (desc.includes('snow'))
    return 'from-gray-100/30 via-blue-200/20 to-white/10';
  if (desc.includes('fog') || desc.includes('mist'))
    return 'from-gray-500/40 via-gray-400/30 to-gray-300/20';
  if (desc.includes('thunder'))
    return 'from-purple-800/50 via-slate-700/30 to-indigo-600/20';
  return 'from-blue-500/30 via-indigo-400/20 to-purple-400/10';
}

function formatTime(timeStr: string): string {
  try {
    return format(parseISO(timeStr), 'ha');
  } catch {
    return timeStr;
  }
}

function formatDay(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'EEE');
  } catch {
    return dateStr;
  }
}

function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d');
  } catch {
    return dateStr;
  }
}

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function WeatherPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { weather, isLoading, city, searchResults, searchCity, selectCity, setSearchResults } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // 5 minute auto-refresh
    const interval = setInterval(() => {
      router.refresh();
    }, 300000);
    return () => clearInterval(interval);
  }, [router]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      searchCity(value);
      setShowDropdown(true);
    }, 300);
  };

  const handleSelect = (result: { name: string; lat: number; lon: number; country: string }) => {
    selectCity(result);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const gradientClass = useMemo(() => {
    if (!weather) return 'from-blue-500/30 via-indigo-400/20 to-purple-400/10';
    return getGradient(weather.description);
  }, [weather]);

  const chartData = useMemo(() => {
    if (!weather?.hourly) return [];
    return weather.hourly.map((h) => ({
      time: formatTime(h.time),
      temp: Math.round(h.temperature),
    }));
  }, [weather]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {t.nav.weather}
            <Badge variant="secondary" className="gap-1.5 py-1 text-sm font-normal">
              <Clock className="w-4 h-4" />
              <LiveClock />
            </Badge>
          </h1>
        </div>
        <WeatherSkeleton />
      </div>
    );
  }

  const WeatherIcon = weather ? weatherIconMap[weather.icon] || Sun : Sun;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Weather
          <Badge variant="secondary" className="gap-1.5 py-1 text-sm font-normal">
            <Clock className="w-4 h-4" />
            <LiveClock />
          </Badge>
        </h1>
      </div>

      <div ref={searchRef} className="relative max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder={t.weather.searchCity}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
            className="pl-10"
          />
        </div>
        <AnimatePresence>
          {showDropdown && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              {searchResults.map((result, i) => (
                <button
                  key={`${result.lat}-${result.lon}`}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-white/10',
                    i !== searchResults.length - 1 && 'border-b border-white/5'
                  )}
                >
                  <MapPin className="h-4 w-4 text-white/40 shrink-0" />
                  <span className="text-white/90">{result.name}</span>
                  <span className="text-white/40 text-xs ml-auto">{result.country}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={weather?.city || 'weather'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <motion.div
            className={cn(
              'relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8',
              'bg-gradient-to-br',
              gradientClass
            )}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ rotate: -30, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <WeatherIcon className="h-16 w-16 text-white/80" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-white/60" />
                    <h2 className="text-lg font-medium text-white/80">{weather?.city || city.name}</h2>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-light tracking-tighter">
                      {Math.round(weather?.temperature ?? 0)}
                    </span>
                    <span className="text-2xl text-white/60">°C</span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">{weather?.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <Thermometer className="h-4 w-4 text-white/50 mx-auto mb-1" />
                  <p className="text-xs text-white/50">{t.weather.feelsLike}</p>
                  <p className="text-lg font-semibold">{Math.round(weather?.feelsLike ?? 0)}°</p>
                </div>
                <div className="text-center">
                  <Droplets className="h-4 w-4 text-white/50 mx-auto mb-1" />
                  <p className="text-xs text-white/50">{t.weather.humidity}</p>
                  <p className="text-lg font-semibold">{weather?.humidity ?? 0}%</p>
                </div>
                <div className="text-center col-span-2 sm:col-span-1">
                  <Wind className="h-4 w-4 text-white/50 mx-auto mb-1" />
                  <p className="text-xs text-white/50">{t.weather.wind}</p>
                  <p className="text-lg font-semibold">{weather?.windSpeed ?? 0} km/h</p>
                </div>
              </div>
            </div>
          </motion.div>

          {chartData.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-white/50" />
                  <h3 className="text-sm font-medium text-white/70">{t.weather.hourForecast}</h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[500px]">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                          dataKey="time"
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          width={35}
                          tickFormatter={(v) => `${v}°`}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(20px)',
                            fontSize: '13px',
                          }}
                          labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                          formatter={(value) => [`${value}°C`, 'Temperature']}
                        />
                        <Line
                          type="monotone"
                          dataKey="temp"
                          stroke="#60a5fa"
                          strokeWidth={2}
                          dot={{ fill: '#60a5fa', r: 3, strokeWidth: 0 }}
                          activeDot={{ fill: '#60a5fa', r: 5, strokeWidth: 2, stroke: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {weather?.daily && weather.daily.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-4">{t.weather.dayForecast}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {weather.daily.map((day, i) => {
                  const DayIcon = weatherIconMap[day.icon] || Sun;
                  return (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Card className="hover:bg-white/10 transition-colors cursor-default">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-medium text-white/70 mb-1">
                            {i === 0 ? t.weather.today : formatDay(day.date)}
                          </p>
                          <p className="text-xs text-white/40 mb-3">{formatDate(day.date)}</p>
                          <DayIcon className="h-8 w-8 mx-auto mb-3 text-white/60" />
                          <div className="flex items-center justify-center gap-2 text-sm">
                            <span className="font-semibold">{Math.round(day.tempMax)}°</span>
                            <span className="text-white/40">{Math.round(day.tempMin)}°</span>
                          </div>
                          <p className="text-xs text-white/50 mt-1 truncate">{day.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
