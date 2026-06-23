'use client';
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWeather, searchCities } from '@/services/weather';
import type { WeatherData } from '@/types';

const DEFAULT_CITY = { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK' };

export function useWeather() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lon: number; country: string }[]>([]);

  const { data: weather, isLoading, refetch } = useQuery({
    queryKey: ['weather', city.lat, city.lon],
    queryFn: () => fetchWeather(city.lat, city.lon, city.name),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const stored = localStorage.getItem('weather-city');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        Promise.resolve().then(() => setCity(parsed));
      } catch { /* ignore */ }
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocode or just set lat/lon to get local weather
          setCity({ name: 'Your Location', lat: latitude, lon: longitude, country: '' });
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, []);

  const searchCity = useCallback(async (query: string) => {
    if (query.length < 2) { setSearchResults([]); return; }
    const results = await searchCities(query);
    setSearchResults(results);
  }, []);

  const selectCity = useCallback((c: typeof DEFAULT_CITY) => {
    setCity(c);
    localStorage.setItem('weather-city', JSON.stringify(c));
    setSearchResults([]);
  }, []);

  return { weather: weather as WeatherData | undefined, isLoading, city, searchResults, searchCity, selectCity, setSearchResults, refetch };
}
