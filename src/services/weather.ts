import type { WeatherData, HourlyForecast, DailyForecast } from '@/types';

const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchCities(query: string): Promise<{ name: string; lat: number; lon: number; country: string }[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`${GEOCODING}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    if (!res.ok) return [];
    const data = await res.json() as { results?: Record<string, unknown>[] };
    return (data.results || []).map((r: Record<string, unknown>) => ({
      name: r.name as string,
      lat: r.latitude as number,
      lon: r.longitude as number,
      country: r.country as string,
    }));
  } catch {
    return [];
  }
}

export async function fetchWeather(lat: number, lon: number, cityName = 'Unknown'): Promise<WeatherData> {
  let finalCityName = cityName;

  // If it's the auto-location, try to get the real city name
  if (cityName === 'Your Location') {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        finalCityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.suburb || cityName;
      }
    } catch { /* ignore and use cityName */ }
  }

  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
      daily: 'temperature_2m_max,temperature_2m_min,weather_code',
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code',
      timezone: 'auto',
    });
    const res = await fetch(`${OPEN_METEO}?${params}`, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as Record<string, unknown>;

    const weatherCodes: Record<number, string> = {
      0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Depositing Rime Fog', 51: 'Light Drizzle',
      53: 'Moderate Drizzle', 55: 'Dense Drizzle', 61: 'Slight Rain',
      63: 'Moderate Rain', 65: 'Heavy Rain', 71: 'Slight Snow',
      73: 'Moderate Snow', 75: 'Heavy Snow', 80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers', 82: 'Violent Rain Showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with Hail',
    };

    const current = data.current as Record<string, unknown> | undefined;
    const hourly = data.hourly as Record<string, unknown[]> | undefined;
    const daily = data.daily as Record<string, unknown[]> | undefined;

    const currentCode = (current?.weather_code as number) ?? 0;

    const hourlyTimes = (hourly?.time as string[]) || [];
    const hourlyTemps = (hourly?.temperature_2m as number[]) || [];
    const hourlyHumidity = (hourly?.relative_humidity_2m as number[]) || [];
    const hourlyWind = (hourly?.wind_speed_10m as number[]) || [];
    const hourlyCount = Math.min(hourlyTimes.length, hourlyTemps.length, hourlyHumidity.length, hourlyWind.length, 24);

    const hourlyForecast: HourlyForecast[] = [];
    for (let i = 0; i < hourlyCount; i++) {
      hourlyForecast.push({
        time: hourlyTimes[i],
        temperature: hourlyTemps[i] ?? 0,
        humidity: hourlyHumidity[i] ?? 0,
        windSpeed: hourlyWind[i] ?? 0,
      });
    }

    const dailyTimes = (daily?.time as string[]) || [];
    const dailyMax = (daily?.temperature_2m_max as number[]) || [];
    const dailyMin = (daily?.temperature_2m_min as number[]) || [];
    const dailyWeather = (daily?.weather_code as number[]) || [];
    const dailyCount = Math.min(dailyTimes.length, dailyMax.length, dailyMin.length, dailyWeather.length);

    const dailyForecast: DailyForecast[] = [];
    for (let i = 0; i < dailyCount; i++) {
      dailyForecast.push({
        date: dailyTimes[i],
        tempMax: dailyMax[i] ?? 0,
        tempMin: dailyMin[i] ?? 0,
        description: weatherCodes[dailyWeather[i]] || 'Unknown',
        icon: getWeatherIcon(dailyWeather[i]),
      });
    }

    return {
      city: finalCityName,
      temperature: (current?.temperature_2m as number) ?? 0,
      feelsLike: (current?.apparent_temperature as number) ?? 0,
      humidity: (current?.relative_humidity_2m as number) ?? 0,
      windSpeed: (current?.wind_speed_10m as number) ?? 0,
      description: weatherCodes[currentCode] || 'Unknown',
      icon: getWeatherIcon(currentCode),
      hourly: hourlyForecast,
      daily: dailyForecast,
    };
  } catch {
    return {
      city: finalCityName, temperature: 0, feelsLike: 0, humidity: 0,
      windSpeed: 0, description: 'N/A', icon: 'sun',
      hourly: [], daily: [],
    };
  }
}

function getWeatherIcon(code: number): string {
  if (code === 0) return 'sun';
  if (code <= 2) return 'cloud-sun';
  if (code <= 48) return 'cloud-fog';
  if (code <= 57) return 'cloud-drizzle';
  if (code <= 67) return 'cloud-rain';
  if (code <= 77) return 'cloud-snow';
  if (code <= 82) return 'cloud-showers-heavy';
  return 'cloud-bolt';
}
