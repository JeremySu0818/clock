import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SupportedLocale } from '../../../shared/i18n';

type ClockParts = {
  time: string;
  date: string;
};

type ClockFormatters = {
  date: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
};

function formatClock(now: Date, formatters: ClockFormatters): ClockParts {
  return {
    time: formatters.time.format(now),
    date: formatters.date.format(now),
  };
}

export function useClock(locale: SupportedLocale): ClockParts {
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
        hour12: false,
      }),
    }),
    [locale],
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
