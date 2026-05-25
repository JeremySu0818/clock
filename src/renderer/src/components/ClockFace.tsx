import { memo, type ReactElement } from 'react';
import type { SupportedLocale } from '../../../shared/i18n';
import { useClock } from '../hooks/useClock';

type ClockFaceProps = {
  currentTimeLabel: string;
  language: SupportedLocale;
  timeFormat: '12h' | '24h';
};

export const ClockFace = memo(function ClockFace({
  currentTimeLabel,
  language,
  timeFormat,
}: ClockFaceProps): ReactElement {
  const { time, date, dayPeriod } = useClock(language, timeFormat);

  return (
    <div className="clock-face" aria-label={`${currentTimeLabel} ${time}${dayPeriod ? ` ${dayPeriod}` : ''}`}>
      <div className="clock-time" aria-hidden="true" data-contrast-sample>
        {time}
        {dayPeriod && <span className="clock-day-period">{dayPeriod}</span>}
      </div>
      <div className="clock-date" aria-hidden="true">
        {date}
      </div>
    </div>
  );
});
