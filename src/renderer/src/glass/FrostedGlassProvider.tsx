import { createContext, useContext, useMemo, type ReactElement, type ReactNode } from "react";
import { LiquidGlassProvider, type LiquidGlassConfig } from "./LiquidGlassProvider";

export const DEFAULT_FROSTED_GLASS_CONFIG = Object.freeze({
  radius: 60,
  bezelWidth: 20,
  glassThickness: 300,
  blur: 10,
  refractiveIndex: 1,
  surface: "convexCircle",
  specularOpacity: 1
} satisfies LiquidGlassConfig);

type FrostedGlassContextValue = {
  config: LiquidGlassConfig;
};

const FrostedGlassContext = createContext<FrostedGlassContextValue | null>(null);

type FrostedGlassProviderProps = {
  children: ReactNode;
  config?: Partial<LiquidGlassConfig>;
};

export function FrostedGlassProvider({ children, config }: FrostedGlassProviderProps): ReactElement {
  const value = useMemo<FrostedGlassContextValue>(
    () => ({
      config: {
        ...DEFAULT_FROSTED_GLASS_CONFIG,
        ...config
      }
    }),
    [config]
  );

  return (
    <FrostedGlassContext.Provider value={value}>
      <LiquidGlassProvider config={value.config}>{children}</LiquidGlassProvider>
    </FrostedGlassContext.Provider>
  );
}

export function useFrostedGlassConfig(): FrostedGlassContextValue {
  const context = useContext(FrostedGlassContext);

  if (!context) {
    throw new Error("useFrostedGlassConfig must be used within FrostedGlassProvider.");
  }

  return context;
}
