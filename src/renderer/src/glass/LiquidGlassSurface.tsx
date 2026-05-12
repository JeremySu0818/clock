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
  const streamRef = useRef<MediaStream | null>(null);
  const [metrics, setMetrics] = useState<DesktopGlassMetrics | null>(null);
  const [captureVersion, setCaptureVersion] = useState(0);
  const [streamReadyVersion, setStreamReadyVersion] = useState(0);
  const [isCaptureReady, setIsCaptureReady] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
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
        setMetrics(initialMetrics);
      }
    });

    const unsubscribe = desktopGlass.onWindowMetrics((nextMetrics) => {
      setMetrics((currentMetrics) => {
        if (currentMetrics && currentMetrics.display.id !== nextMetrics.display.id) {
          setCaptureVersion((version) => version + 1);
        }

        return nextMetrics;
      });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [desktopGlass]);

  useEffect(() => {
    let cancelled = false;

    if (!desktopGlass) {
      return undefined;
    }

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

    void startDisplayCapture()
      .then((stream) => {
        if (cancelled) {
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
          setStreamReadyVersion((version) => version + 1);
        });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown capture error";
        setCaptureError(message);
        setIsCaptureReady(false);
        console.error("Unable to start desktop backdrop capture.", error);
      });

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [captureVersion, desktopGlass]);

  useLayoutEffect(() => {
    const surface = ref.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!surface || !canvas || !video || !metrics) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return undefined;
    }

    const renderFrame = (): void => {
      const nextVideo = videoRef.current;
      const nextSurface = ref.current;
      const nextCanvas = canvasRef.current;
      const nextMetrics = metrics;

      if (!nextVideo || !nextSurface || !nextCanvas || !nextMetrics) {
        frameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      if (nextVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        frameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const bounds = nextSurface.getBoundingClientRect();
      const devicePixelRatio = window.devicePixelRatio || 1;
      const targetWidth = Math.max(1, Math.round(bounds.width * devicePixelRatio));
      const targetHeight = Math.max(1, Math.round(bounds.height * devicePixelRatio));

      if (nextCanvas.width !== targetWidth || nextCanvas.height !== targetHeight) {
        nextCanvas.width = targetWidth;
        nextCanvas.height = targetHeight;
        nextCanvas.style.width = `${bounds.width}px`;
        nextCanvas.style.height = `${bounds.height}px`;
      }

      context.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

      const ratioX = nextVideo.videoWidth / nextMetrics.display.bounds.width;
      const ratioY = nextVideo.videoHeight / nextMetrics.display.bounds.height;
      const cropX =
        (nextMetrics.windowBounds.x + bounds.left - nextMetrics.display.bounds.x) * ratioX;
      const cropY =
        (nextMetrics.windowBounds.y + bounds.top - nextMetrics.display.bounds.y) * ratioY;
      const cropWidth = bounds.width * ratioX;
      const cropHeight = bounds.height * ratioY;

      context.drawImage(
        nextVideo,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        nextCanvas.width,
        nextCanvas.height
      );

      frameRef.current = requestAnimationFrame(renderFrame);
    };

    frameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [metrics, ref, streamReadyVersion]);

  return (
    <section
      ref={ref}
      className={[
        "liquid-glass-surface",
        isCaptureReady ? "is-capture-ready" : "is-capture-fallback",
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
