import { type ReactElement, type ReactNode } from "react";
import { GlassModeProvider } from "../glass/GlassModeProvider";
import { LiquidGlassSurface } from "../glass/LiquidGlassSurface";
import type { LiquidGlassConfig } from "../glass/LiquidGlassProvider";
import { BUTTON_GLASS_CONFIG } from "./settings-constants";

type SettingsGlassProps = {
  children?: ReactNode;
  className: string;
  config?: Partial<LiquidGlassConfig>;
};

export function SettingsGlass({ 
  children, 
  className, 
  config = BUTTON_GLASS_CONFIG 
}: SettingsGlassProps): ReactElement {
  return (
    <GlassModeProvider config={config}>
      <LiquidGlassSurface as="span" className={`settings-control-glass ${className}`} autoTextContrast={false}>
        {children}
      </LiquidGlassSurface>
    </GlassModeProvider>
  );
}
