import { memo, type ReactElement } from "react";
import type { SupportedLocale } from "../../../shared/i18n";
import { useClock } from "../hooks/useClock";

type ClockFaceProps = {
  currentTimeLabel: string;
  language: SupportedLocale;
};

export const ClockFace = memo(function ClockFace({ 
  currentTimeLabel, 
  language 
}: ClockFaceProps): ReactElement {
  const { time, date } = useClock(language);

  return (
    <div className="clock-face" aria-label={`${currentTimeLabel} ${time}`}>
      <div className="clock-time" aria-hidden="true" data-contrast-sample>
        {time}
      </div>
      <div className="clock-date" aria-hidden="true">
        {date}
      </div>
    </div>
  );
});
