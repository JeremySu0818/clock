import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactElement
} from "react";
import { useLiquidGlassSurface } from "./useLiquidGlassSurface";

type LiquidGlassSurfaceProps = ComponentPropsWithoutRef<"section">;

type DesktopGlassMetrics = Awaited<ReturnType<NonNullable<typeof window.desktopGlass>["getWindowMetrics"]>>;
type TextContrastTone = "light" | "dark";

const CONTRAST_SAMPLE_INTERVAL = 12;
const DARK_TEXT_LUMINANCE_THRESHOLD = 0.58;
const LIGHT_TEXT_LUMINANCE_THRESHOLD = 0.48;

function getBackdropContrastTone(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  currentTone: TextContrastTone
): TextContrastTone {
  const sampleWidth = Math.max(1, (width * 0.62) | 0);
  const sampleHeight = Math.max(1, (height * 0.48) | 0);
  const sampleX = Math.max(0, ((width - sampleWidth) >> 1));
  const sampleY = Math.max(0, ((height - sampleHeight) >> 1));
  const image = context.getImageData(sampleX, sampleY, sampleWidth, sampleHeight);
  const data = image.data;
  const stride = Math.max(4, Math.min(sampleWidth, sampleHeight) / 14 | 0);
  let luminanceTotal = 0;
  let samples = 0;

  for (let y = 0; y < sampleHeight; y += stride) {
    const rowOffset = y * sampleWidth;
    for (let x = 0; x < sampleWidth; x += stride) {
      const offset = (rowOffset + x) << 2;
      const alpha = data[offset + 3];

      if (alpha <= 0) {
        continue;
      }

      const alphaFactor = alpha / 255;
      luminanceTotal += (0.2126 * data[offset] + 0.7152 * data[offset + 1] + 0.0722 * data[offset + 2]) / 255 * alphaFactor;
      samples += 1;
    }
  }

  if (samples === 0) {
    return currentTone;
  }

  const luminance = luminanceTotal / samples;

  if (currentTone === "dark") {
    return luminance < LIGHT_TEXT_LUMINANCE_THRESHOLD ? "light" : "dark";
  }

  return luminance > DARK_TEXT_LUMINANCE_THRESHOLD ? "dark" : "light";
}

async function startDisplayCapture(): Promise<MediaStream> {
  return navigator.mediaDevices.getDisplayMedia({
    video: {
      frameRate: {
        ideal: 60,
        max: 60
      }
    },
    audio: false
  });
}

export function LiquidGlassSurface({
  children,
  className,
  style,
  ...props
}: LiquidGlassSurfaceProps): ReactElement {
  const { ref, glass, glassStyle } = useLiquidGlassSurface<HTMLElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const contrastFrameRef = useRef(0);
  const textContrastToneRef = useRef<TextContrastTone>("light");
  const streamRef = useRef<MediaStream | null>(null);
  const metricsRef = useRef<DesktopGlassMetrics | null>(null);
  const boundsRef = useRef<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 });

  const [isCaptureReady, setIsCaptureReady] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [textContrastTone, setTextContrastTone] = useState<TextContrastTone>("light");
  const desktopGlass = window.desktopGlass;

  const mergedStyle: CSSProperties = {
    ...style
  };

  useEffect(() => {
    let active = true;

    if (!desktopGlass) {
      setCaptureError("desktopGlass bridge is unavailable.");
      setIsCaptureReady(false);
      return undefined;
    }

    void desktopGlass.getWindowMetrics().then((initialMetrics) => {
      if (active) {
        metricsRef.current = initialMetrics;
      }
    });

    let captureVersion = 0;

    const unsubscribe = desktopGlass.onWindowMetrics((nextMetrics) => {
      const prev = metricsRef.current;
      metricsRef.current = nextMetrics;

      if (prev && prev.display.id !== nextMetrics.display.id) {
        captureVersion += 1;
        restartCapture();
      }
    });

    const stopStream = (): void => {
      for (const track of streamRef.current?.getTracks() ?? []) {
        track.stop();
      }

      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }

      videoRef.current = null;
      setIsCaptureReady(false);
    };

    const restartCapture = (): void => {
      const localVersion = captureVersion;
      stopStream();

      void startDisplayCapture()
        .then((stream) => {
          if (!active || localVersion !== captureVersion) {
            for (const track of stream.getTracks()) {
              track.stop();
            }
            return;
          }

          streamRef.current = stream;

          const video = document.createElement("video");
          video.autoplay = true;
          video.muted = true;
          video.playsInline = true;
          video.srcObject = stream;
          videoRef.current = video;

          void video.play().then(() => {
            setCaptureError(null);
            setIsCaptureReady(true);
          });
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : "Unknown capture error";
          setCaptureError(message);
          setIsCaptureReady(false);
        });
    };

    restartCapture();

    return () => {
      active = false;
      unsubscribe();
      stopStream();
    };
  }, [desktopGlass]);

  useLayoutEffect(() => {
    const surface = ref.current;
    const canvas = canvasRef.current;

    if (!surface || !canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!context) {
      return undefined;
    }

    const updateBounds = (): void => {
      const rect = surface.getBoundingClientRect();
      boundsRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    };

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
    });
    resizeObserver.observe(surface);

    updateBounds();

    const renderFrame = (): void => {
      const video = videoRef.current;
      const currentMetrics = metricsRef.current;

      if (!video || !currentMetrics || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        frameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const bounds = boundsRef.current;
      const devicePixelRatio = window.devicePixelRatio || 1;
      const targetWidth = Math.max(1, (bounds.width * devicePixelRatio) | 0);
      const targetHeight = Math.max(1, (bounds.height * devicePixelRatio) | 0);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.style.width = `${bounds.width}px`;
        canvas.style.height = `${bounds.height}px`;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      const displayBounds = currentMetrics.display.bounds;
      const windowBounds = currentMetrics.windowBounds;
      const ratioX = video.videoWidth / displayBounds.width;
      const ratioY = video.videoHeight / displayBounds.height;
      const cropX = (windowBounds.x + bounds.left - displayBounds.x) * ratioX;
      const cropY = (windowBounds.y + bounds.top - displayBounds.y) * ratioY;
      const cropWidth = bounds.width * ratioX;
      const cropHeight = bounds.height * ratioY;

      context.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      contrastFrameRef.current += 1;
      if (contrastFrameRef.current >= CONTRAST_SAMPLE_INTERVAL) {
        contrastFrameRef.current = 0;

        try {
          const nextTone = getBackdropContrastTone(
            context,
            canvas.width,
            canvas.height,
            textContrastToneRef.current
          );

          if (nextTone !== textContrastToneRef.current) {
            textContrastToneRef.current = nextTone;
            setTextContrastTone(nextTone);
          }
        } catch {
          
        }
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
  }, [ref]);

  return (
    <section
      ref={ref}
      className={[
        "liquid-glass-surface",
        isCaptureReady ? "is-capture-ready" : "is-capture-fallback",
        `is-text-contrast-${textContrastTone}`,
        className
      ]
        .filter(Boolean)
        .join(" ")}
      data-capture-state={isCaptureReady ? "ready" : "fallback"}
      data-capture-error={captureError ?? ""}
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
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="liquid-glass-backdrop"
        style={glassStyle}
      />
      {children}
    </section>
  );
}
