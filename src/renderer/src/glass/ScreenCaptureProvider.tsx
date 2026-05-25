import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';

type DesktopGlassMetrics = Awaited<
  ReturnType<NonNullable<typeof window.desktopGlass>['getWindowMetrics']>
>;

type ScreenCaptureContextValue = {
  stream: MediaStream | null;
  metricsRef: RefObject<DesktopGlassMetrics | null>;
};

const ScreenCaptureContext = createContext<ScreenCaptureContextValue>({
  stream: null,
  metricsRef: { current: null },
});

async function startDisplayCapture(): Promise<MediaStream> {
  return navigator.mediaDevices.getDisplayMedia({
    video: {
      frameRate: {
        ideal: 60,
        max: 60,
      },
    },
    audio: false,
  });
}

type ScreenCaptureProviderProps = {
  children: ReactNode;
};

export function ScreenCaptureProvider({
  children,
}: ScreenCaptureProviderProps): ReactElement {
  const streamRef = useRef<MediaStream | null>(null);
  const metricsRef = useRef<DesktopGlassMetrics | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const desktopGlass = window.desktopGlass;

  useEffect(() => {
    let active = true;

    if (!desktopGlass) {
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
      setStream(null);
    };

    const restartCapture = (): void => {
      const localVersion = captureVersion;
      stopStream();

      void startDisplayCapture()
        .then((newStream) => {
          if (!active || localVersion !== captureVersion) {
            for (const track of newStream.getTracks()) {
              track.stop();
            }
            return;
          }

          streamRef.current = newStream;
          setStream(newStream);
        })
        .catch(() => {});
    };

    restartCapture();

    return () => {
      active = false;
      unsubscribe();
      stopStream();
    };
  }, [desktopGlass]);

  return (
    <ScreenCaptureContext.Provider value={{ stream, metricsRef }}>
      {children}
    </ScreenCaptureContext.Provider>
  );
}

export function useScreenCapture(): ScreenCaptureContextValue {
  return useContext(ScreenCaptureContext);
}
