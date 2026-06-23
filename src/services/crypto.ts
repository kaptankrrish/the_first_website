import type { CryptoCoin } from '@/types';

const COINGECKO = 'https://api.coingecko.com/api/v3';

export async function fetchTrendingCoins(page = 1): Promise<CryptoCoin[]> {
  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '100',
      page: page.toString(),
      sparkline: 'true',
      price_change_percentage: '24h',
    });
    const res = await fetch(`${COINGECKO}/coins/markets?${params}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      console.warn(`CoinGecko API returned ${res.status}`);
      return [];
    }
    const data = await res.json() as Record<string, unknown>[];
    return data.map((coin) => ({
      id: coin.id as string,
      symbol: (coin.symbol as string).toUpperCase(),
      name: coin.name as string,
      image: coin.image as string,
      currentPrice: coin.current_price as number,
      marketCap: coin.market_cap as number,
      marketCapRank: coin.market_cap_rank as number,
      priceChange24h: coin.price_change_24h as number,
      priceChangePercentage24h: coin.price_change_percentage_24h as number,
      totalVolume: coin.total_volume as number,
      sparklineIn7d: (coin.sparkline_in_7d as { price: number[] })?.price || [],
    }));
  } catch {
    return [];
  }
}

export async function fetchCoinHistory(id: string, days = 7): Promise<{ prices: [number, number][] }> {
  try {
    const res = await fetch(`${COINGECKO}/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
    if (!res.ok) return { prices: [] };
    const data = await res.json() as { prices: [number, number][] };
    return data;
  } catch {
    return { prices: [] };
  }
}

export async function searchCoins(query: string): Promise<{ id: string; name: string; symbol: string }[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`${COINGECKO}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json() as { coins: Record<string, unknown>[] };
    return ((data).coins || []).map((c) => ({
      id: c.id as string,
      name: c.name as string,
      symbol: (c.symbol as string).toUpperCase(),
    }));
  } catch {
    return [];
  }
}
