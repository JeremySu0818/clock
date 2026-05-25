import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SupportedLocale } from '../../../shared/i18n';

type ClockParts = {
  time: string;
  dayPeriod?: string;
  date: string;
};

type ClockFormatters = {
  date: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
};

function formatClock(now: Date, formatters: ClockFormatters): ClockParts {
  const timeParts = formatters.time.formatToParts(now);
  const dayPeriod = timeParts.find((part) => part.type === 'dayPeriod')?.value;
  const timeString = timeParts
    .filter((part) => part.type !== 'dayPeriod')
    .map((part) => part.value)
    .join('')
    .trim();

  return {
    time: timeString,
    dayPeriod,
    date: formatters.date.format(now),
  };
}

export function useClock(
  locale: SupportedLocale,
  timeFormat: '12h' | '24h' = '24h',
): ClockParts {
  const formatters = useMemo<ClockFormatters>(
    () => ({
      date: new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        month: '2-digit',
        day: '2-digit',
      }),
      time: new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: timeFormat === '12h',
      }),
    }),
    [locale, timeFormat],
  );

  const formatCurrentClock = useCallback(
    () => formatClock(new Date(), formatters),
    [formatters],
  );
  const [parts, setParts] = useState(formatCurrentClock);
  const partsRef = useRef(parts);

  useEffect(() => {
    let timeoutId: number;

    const syncParts = (): void => {
      const next = formatCurrentClock();
      if (
        next.time !== partsRef.current.time ||
        next.date !== partsRef.current.date
      ) {
        partsRef.current = next;
        setParts(next);
      }
    };

    const scheduleNextTick = (): void => {
      const msUntilNextSecond = 1000 - (Date.now() % 1000);

      timeoutId = window.setTimeout(() => {
        syncParts();
        scheduleNextTick();
      }, msUntilNextSecond);
    };

    syncParts();
    scheduleNextTick();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [formatCurrentClock]);

  return parts;
}
