import { type ReactElement, type ReactNode } from "react";
import { FrostedGlassProvider } from "./FrostedGlassProvider";
import { LiquidGlassProvider } from "./LiquidGlassProvider";
import { useClockSettings } from "../settings/ClockSettingsProvider";

export function GlassModeProvider({ children }: { children: ReactNode }): ReactElement {
  const { appearance } = useClockSettings();

  if (appearance === "frosted") {
    return <FrostedGlassProvider>{children}</FrostedGlassProvider>;
  }

  return <LiquidGlassProvider>{children}</LiquidGlassProvider>;
}
