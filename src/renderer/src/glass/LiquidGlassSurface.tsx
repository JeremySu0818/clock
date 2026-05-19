import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactElement
} from "react";
import { useScreenCapture } from "./ScreenCaptureProvider";
import { useLiquidGlassSurface } from "./useLiquidGlassSurface";
import { getBackdropContrastTone, type TextContrastTone } from "./glass-utils";

type LiquidGlassSurfaceProps = ComponentPropsWithoutRef<"section"> & {
  as?: "section" | "div" | "span";
  autoTextContrast?: boolean;
  textContrastTone?: TextContrastTone;
  onTextContrastToneChange?: (tone: TextContrastTone) => void;
};

type Bounds = { left: number; top: number; width: number; height: number };

const CONTRAST_SAMPLE_INTERVAL = 6;
const CONTRAST_SAMPLE_SELECTOR = "[data-contrast-sample]";

export function LiquidGlassSurface({
  as = "section",
  autoTextContrast = true,
  textContrastTone: controlledTextContrastTone = "light",
  onTextContrastToneChange,
  children,
  className,
  style,
  ...props
}: LiquidGlassSurfaceProps): ReactElement {
  const { ref, glass, glassStyle } = useLiquidGlassSurface<HTMLElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const contrastFrameRef = useRef(0);
  const textContrastToneRef = useRef<TextContrastTone>(controlledTextContrastTone);
  const boundsRef = useRef<Bounds>({ left: 0, top: 0, width: 0, height: 0 });
  const sampleBoundsRef = useRef<Bounds | null>(null);

  const [isCaptureReady, setIsCaptureReady] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [textContrastTone, setTextContrastTone] = useState<TextContrastTone>(controlledTextContrastTone);

  const { stream, metricsRef } = useScreenCapture();

  const mergedStyle: CSSProperties = {
    ...style
  };
  const BackdropElement = as === "span" ? "span" : "div";

  useEffect(() => {
    textContrastToneRef.current = controlledTextContrastTone;
    setTextContrastTone(controlledTextContrastTone);
  }, [controlledTextContrastTone]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) {
      setIsCaptureReady(false);
      setCaptureError(stream === null ? "No capture stream available." : null);
      return undefined;
    }

    video.srcObject = stream;
    void video.play().then(() => {
      setCaptureError(null);
      setIsCaptureReady(true);
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Video play failed";
      setCaptureError(message);
      setIsCaptureReady(false);
    });

    return () => {
      video.pause();
      video.srcObject = null;
      setIsCaptureReady(false);
    };
  }, [stream]);

  useLayoutEffect(() => {
    const surface = ref.current;
    const video = videoRef.current;

    if (!surface || !video) {
      return undefined;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const offscreenCanvas = canvasRef.current;
    const context = offscreenCanvas.getContext("2d", { alpha: false, willReadFrequently: true });

    if (!context) {
      return undefined;
    }

    const updateBounds = (): void => {
      const rect = surface.getBoundingClientRect();
      boundsRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };

      const sampleTarget = surface.querySelector<HTMLElement>(CONTRAST_SAMPLE_SELECTOR);
      if (!sampleTarget) {
        sampleBoundsRef.current = null;
        return;
      }

      const sampleRect = sampleTarget.getBoundingClientRect();
      const left = Math.max(0, sampleRect.left - rect.left);
      const top = Math.max(0, sampleRect.top - rect.top);
      const right = Math.min(rect.width, sampleRect.right - rect.left);
      const bottom = Math.min(rect.height, sampleRect.bottom - rect.top);

      sampleBoundsRef.current = {
        left,
        top,
        width: Math.max(1, right - left),
        height: Math.max(1, bottom - top)
      };
    };

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
    });
    resizeObserver.observe(surface);

    updateBounds();

    let lastVideoWidth = "";
    let lastVideoHeight = "";
    let lastVideoTransform = "";

    const renderFrame = (): void => {
      const currentMetrics = metricsRef.current;

      if (!currentMetrics || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        frameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const bounds = boundsRef.current;
      const displayBounds = currentMetrics.display.bounds;
      const windowBounds = currentMetrics.windowBounds;

      const translateX = displayBounds.x - windowBounds.x - bounds.left;
      const translateY = displayBounds.y - windowBounds.y - bounds.top;
      const videoWidth = `${displayBounds.width}px`;
      const videoHeight = `${displayBounds.height}px`;
      const videoTransform = `translate(${translateX}px, ${translateY}px)`;

      if (
        lastVideoWidth !== videoWidth ||
        lastVideoHeight !== videoHeight ||
        lastVideoTransform !== videoTransform
      ) {
        lastVideoWidth = videoWidth;
        lastVideoHeight = videoHeight;
        lastVideoTransform = videoTransform;

        video.style.width = videoWidth;
        video.style.height = videoHeight;
        video.style.transform = videoTransform;
      }

      contrastFrameRef.current += 1;
      if (autoTextContrast && contrastFrameRef.current >= CONTRAST_SAMPLE_INTERVAL) {
        contrastFrameRef.current = 0;
        updateBounds();

        try {
          const currentBounds = boundsRef.current;
          const sampleBounds = sampleBoundsRef.current ?? {
            left: Math.max(0, currentBounds.width * 0.19),
            top: Math.max(0, currentBounds.height * 0.26),
            width: Math.max(1, currentBounds.width * 0.62),
            height: Math.max(1, currentBounds.height * 0.48)
          };
          const sampleX = Math.max(0, Math.round(sampleBounds.left));
          const sampleY = Math.max(0, Math.round(sampleBounds.top));
          const sampleWidth = Math.max(1, Math.round(sampleBounds.width));
          const sampleHeight = Math.max(1, Math.round(sampleBounds.height));

          if (offscreenCanvas.width !== sampleWidth || offscreenCanvas.height !== sampleHeight) {
            offscreenCanvas.width = sampleWidth;
            offscreenCanvas.height = sampleHeight;
          }

          const ratioX = video.videoWidth / displayBounds.width;
          const ratioY = video.videoHeight / displayBounds.height;

          const cropX = (windowBounds.x + currentBounds.left + sampleX - displayBounds.x) * ratioX;
          const cropY = (windowBounds.y + currentBounds.top + sampleY - displayBounds.y) * ratioY;
          const cropWidth = sampleWidth * ratioX;
          const cropHeight = sampleHeight * ratioY;

          context.drawImage(
            video,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            sampleWidth,
            sampleHeight
          );

          const nextTone = getBackdropContrastTone(
            context,
            sampleWidth,
            sampleHeight,
            textContrastToneRef.current
          );

          if (nextTone !== textContrastToneRef.current) {
            textContrastToneRef.current = nextTone;
            setTextContrastTone(nextTone);
            onTextContrastToneChange?.(nextTone);
          }
        } catch {}
      }

      frameRef.current = requestAnimationFrame(renderFrame);
    };

    frameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [autoTextContrast, metricsRef, onTextContrastToneChange, ref]);

  return createElement(
    as,
    {
      ref,
      className: [
        "liquid-glass-surface",
        isCaptureReady ? "is-capture-ready" : "is-capture-fallback",
        `is-text-contrast-${textContrastTone}`,
        className
      ]
        .filter(Boolean)
        .join(" "),
      "data-capture-state": isCaptureReady ? "ready" : "fallback",
      "data-capture-error": captureError ?? "",
      style: mergedStyle,
      ...props
    },
    <>
      {glass ? (
        <span
          aria-hidden="true"
          className="liquid-glass-filter"
          dangerouslySetInnerHTML={{ __html: glass.svgFilter }}
        />
      ) : null}
      {createElement(
        BackdropElement,
        {
          "aria-hidden": "true",
          className: "liquid-glass-backdrop",
          style: { ...glassStyle, overflow: "hidden" }
        },
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "0 0",
            pointerEvents: "none"
          }}
        />
      )}
      {children}
    </>
  );
}
