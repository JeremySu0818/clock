import { useEffect, useRef, useState } from "react";

type ClockParts = {
  time: string;
  date: string;
};

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "2-digit",
  day: "2-digit"
});

function formatClock(now: Date): ClockParts {
  return {
    time: timeFormatter.format(now),
    date: dateFormatter.format(now)
  };
}

export function useClock(): ClockParts {
  const [parts, setParts] = useState(() => formatClock(new Date()));
  const partsRef = useRef(parts);

  useEffect(() => {
    let timeoutId: number;

    const scheduleNextTick = (): void => {
      const msUntilNextSecond = 1000 - (Date.now() % 1000);

      timeoutId = window.setTimeout(() => {
        const next = formatClock(new Date());
        if (next.time !== partsRef.current.time || next.date !== partsRef.current.date) {
          partsRef.current = next;
          setParts(next);
        }
        scheduleNextTick();
      }, msUntilNextSecond);
    };

    scheduleNextTick();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return parts;
}
