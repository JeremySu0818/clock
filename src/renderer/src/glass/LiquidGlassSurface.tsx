import type { ComponentPropsWithoutRef, CSSProperties, ReactElement } from "react";
import { useLiquidGlassSurface } from "./useLiquidGlassSurface";

type LiquidGlassSurfaceProps = ComponentPropsWithoutRef<"section">;

export function LiquidGlassSurface({
  children,
  className,
  style,
  ...props
}: LiquidGlassSurfaceProps): ReactElement {
  const { ref, glass, glassStyle } = useLiquidGlassSurface<HTMLElement>();

  const mergedStyle: CSSProperties = {
    ...glassStyle,
    ...style
  };

  return (
    <section
      ref={ref}
      className={["liquid-glass-surface", className].filter(Boolean).join(" ")}
      style={mergedStyle}
      {...props}
    >
      {glass ? (
        <span
          aria-hidden="true"
          className="liquid-glass-filter"
          dangerouslySetInnerHTML={{ __html: glass.svgFilter }}
        />
      ) : null}
      {children}
    </section>
  );
}
