import { memo, type ReactElement } from "react";
import { LiquidGlassProvider } from "./glass/LiquidGlassProvider";
import { LiquidGlassSurface } from "./glass/LiquidGlassSurface";
import { useClock } from "./hooks/useClock";

const ClockFace = memo(function ClockFace(): ReactElement {
  const { time, date } = useClock();

  return (
    <div className="clock-face" aria-label={`Current time ${time}`}>
      <div className="clock-time" aria-hidden="true">
        {time}
      </div>
      <div className="clock-date" aria-hidden="true">
        {date}
      </div>
    </div>
  );
});

export default function App(): ReactElement {
  return (
    <LiquidGlassProvider>
      <main className="clock-shell">
        <LiquidGlassSurface className="clock-glass">
          <ClockFace />
        </LiquidGlassSurface>
      </main>
    </LiquidGlassProvider>
  );
}
