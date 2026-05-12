import { createContext, useContext, useMemo, type ReactElement, type ReactNode } from "react";
import type { LiquidGlassOptions } from "solid-glass/engines/svg-refraction";

type LiquidGlassConfig = Omit<LiquidGlassOptions, "width" | "height">;

const DEFAULT_LIQUID_GLASS_CONFIG = Object.freeze({
  radius: 60,
  bezelWidth: 20,
  glassThickness: 300,
  blur: 0,
  refractiveIndex: 1.5,
  surface: "convexSquircle",
  specularOpacity: 0.6
} satisfies LiquidGlassConfig);

type LiquidGlassContextValue = {
  config: LiquidGlassConfig;
};

const LiquidGlassContext = createContext<LiquidGlassContextValue | null>(null);

type LiquidGlassProviderProps = {
  children: ReactNode;
  config?: Partial<LiquidGlassConfig>;
};

export function LiquidGlassProvider({ children, config }: LiquidGlassProviderProps): ReactElement {
  const value = useMemo<LiquidGlassContextValue>(
    () => ({
      config: {
        ...DEFAULT_LIQUID_GLASS_CONFIG,
        ...config
      }
    }),
    [config]
  );

  return <LiquidGlassContext.Provider value={value}>{children}</LiquidGlassContext.Provider>;
}

export function useLiquidGlassConfig(): LiquidGlassContextValue {
  const context = useContext(LiquidGlassContext);

  if (!context) {
    throw new Error("useLiquidGlassConfig must be used within LiquidGlassProvider.");
  }

  return context;
}
