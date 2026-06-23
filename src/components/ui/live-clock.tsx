'use client';

import { useState, useEffect } from 'react';

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Use a microtask to avoid synchronous setState in effect warning
    Promise.resolve().then(() => setTime(new Date()));
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return <span className="opacity-0">00:00:00 AM</span>;

  return (
    <span>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}
