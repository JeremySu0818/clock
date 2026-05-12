import { useEffect, useMemo, useState } from "react";

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

export function useClock(): ClockParts {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timeoutId = window.setTimeout(() => undefined, 0);

    const scheduleNextTick = (): void => {
      const msUntilNextSecond = 1000 - (Date.now() % 1000);

      timeoutId = window.setTimeout(() => {
        setNow(new Date());
        scheduleNextTick();
      }, msUntilNextSecond);
    };

    scheduleNextTick();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return useMemo(
    () => ({
      time: timeFormatter.format(now),
      date: dateFormatter.format(now)
    }),
    [now]
  );
}
