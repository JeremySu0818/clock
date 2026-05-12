import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  createLiquidGlass,
  type LiquidGlassResult
} from "solid-glass/engines/svg-refraction";
import { useLiquidGlassConfig } from "./LiquidGlassProvider";

type BackdropFilterStyle = CSSProperties & {
  WebkitFilter?: string;
};

type LiquidGlassSurfaceState<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  glass: LiquidGlassResult | null;
  glassStyle: BackdropFilterStyle;
};

export function useLiquidGlassSurface<T extends HTMLElement>(): LiquidGlassSurfaceState<T> {
  const { config } = useLiquidGlassConfig();
  const ref = useRef<T>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSizeKeyRef = useRef("");
  const [glass, setGlass] = useState<LiquidGlassResult | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    lastSizeKeyRef.current = "";

    const updateGlass = (rect: DOMRectReadOnly): void => {
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const sizeKey = `${width}x${height}`;

      if (sizeKey === lastSizeKeyRef.current) {
        return;
      }

      lastSizeKeyRef.current = sizeKey;
      setGlass(
        createLiquidGlass({
          width,
          height,
          ...config
        })
      );
    };

    updateGlass(node.getBoundingClientRect());

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        updateGlass(entry.contentRect);
      });
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config]);

  return {
    ref,
    glass,
    glassStyle: glass
      ? {
          filter: glass.filterRef,
          WebkitFilter: glass.filterRef
        }
      : {}
  };
}
