import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import type { SupportedLocale } from '../../../shared/i18n';
import type { FeatureViewMode } from './FeatureToolsButton';
import { SettingsGlass } from '../settings/SettingsGlass';
import {
  SWITCH_THUMB_GLASS_CONFIG,
  SWITCH_TRACK_GLASS_CONFIG,
} from '../settings/settings-constants';

type FeatureWorkspaceProps = {
  language: SupportedLocale;
  mode: FeatureViewMode;
  onBack: () => void;
};

type WorldClockZone = {
  city: string;
  note: string;
  timeZone: string;
};

type AlarmItem = {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
};

const WORLD_CLOCK_ZONES: WorldClockZone[] = [
  { city: '台北', note: '本地', timeZone: 'Asia/Taipei' },
  { city: '東京', note: '日本', timeZone: 'Asia/Tokyo' },
  { city: '倫敦', note: '英國', timeZone: 'Europe/London' },
  { city: '紐約', note: '美東', timeZone: 'America/New_York' },
  { city: '洛杉磯', note: '美西', timeZone: 'America/Los_Angeles' },
];

const DEFAULT_ALARMS: AlarmItem[] = [];

function formatOffset(timeZone: string, now: Date): string {
  const tz = new Intl.DateTimeFormat('en', {
    timeZone,
    timeZoneName: 'shortOffset',
    hour: '2-digit',
  })
    .formatToParts(now)
    .find((part) => part.type === 'timeZoneName')?.value;

  return tz ? tz.replace('GMT', 'UTC') : 'UTC';
}

export function FeatureWorkspace({
  language,
  mode,
  onBack,
}: FeatureWorkspaceProps): ReactElement {
  const [now, setNow] = useState(() => new Date());
  const [alarms, setAlarms] = useState<AlarmItem[]>(DEFAULT_ALARMS);
  const [draftTime, setDraftTime] = useState('08:00');
  const [draftLabel, setDraftLabel] = useState('');
  const [ringingAlarmIds, setRingingAlarmIds] = useState<string[]>([]);
  const triggeredKeyByAlarmRef = useRef<Record<string, string>>({});

  useEffect(() => {
    let timeoutId = 0;

    const syncTime = (): void => {
      setNow(new Date());
      const msUntilNextSecond = 1000 - (Date.now() % 1000);
      timeoutId = window.setTimeout(syncTime, msUntilNextSecond);
    };

    syncTime();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const hour = `${now.getHours()}`.padStart(2, '0');
    const minute = `${now.getMinutes()}`.padStart(2, '0');
    const currentTime = `${hour}:${minute}`;
    const currentMinuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${currentTime}`;

    alarms.forEach((alarm) => {
      if (!alarm.enabled || alarm.time !== currentTime) {
        return;
      }

      if (triggeredKeyByAlarmRef.current[alarm.id] === currentMinuteKey) {
        return;
      }

      triggeredKeyByAlarmRef.current[alarm.id] = currentMinuteKey;
      setRingingAlarmIds((ids) =>
        ids.includes(alarm.id) ? ids : [...ids, alarm.id],
      );

      const audioContext = new window.AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.06;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.4);
      oscillator.onended = () => {
        void audioContext.close();
      };
    });
  }, [alarms, now]);

  const dateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(language, {
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
  }, [language]);

  const timeFormatterByZone = useMemo(() => {
    return new Map(
      WORLD_CLOCK_ZONES.map((zone) => [
        zone.timeZone,
        new Intl.DateTimeFormat(language, {
          timeZone: zone.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      ]),
    );
  }, [language]);

  const addAlarm = (): void => {
    if (!draftTime) {
      return;
    }

    setAlarms((items) => [
      ...items,
      {
        id: `${Date.now()}`,
        label: draftLabel.trim() || '新鬧鐘',
        time: draftTime,
        enabled: true,
      },
    ]);
    setDraftLabel('');
  };

  const title = mode === 'world-clock' ? '世界時鐘' : '鬧鐘';

  return (
    <div
      className="settings-panel"
      aria-label={title}
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        inset: 0,
        padding: '0 34px',
      }}
    >
      <button
        type="button"
        className="settings-close"
        aria-label="返回主畫面"
        onClick={onBack}
      >
        <SettingsGlass className="settings-close-glass">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" />
          </svg>
        </SettingsGlass>
      </button>

      <section
        className="settings-content"
        aria-label={title}
        style={{ flex: 1, minHeight: 0, paddingLeft: 0, paddingTop: 0 }}
      >
        <div
          className="settings-tab-pane"
          style={{ paddingTop: 26, paddingBottom: 26 }}
        >
          <h2
            className="settings-title"
            style={{ fontSize: 24, marginBottom: 8, marginTop: 0 }}
          >
            {title}
          </h2>
          {mode === 'world-clock' ? (
            WORLD_CLOCK_ZONES.map((zone) => {
              const formatter = timeFormatterByZone.get(zone.timeZone);
              const time = formatter ? formatter.format(now) : '--:--:--';

              return (
                <div key={zone.timeZone} className="settings-row">
                  <span className="settings-copy">
                    <span className="settings-title">{zone.city}</span>
                    <span
                      className="settings-control-content"
                      style={{ opacity: 0.6, fontSize: 12 }}
                    >
                      {zone.note}
                    </span>
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className="settings-title"
                      style={{ fontSize: 24, letterSpacing: '0.02em' }}
                    >
                      {time}
                    </span>
                    <span
                      className="settings-control-content"
                      style={{ opacity: 0.6, fontSize: 12 }}
                    >
                      {dateFormatter.format(now)} ·{' '}
                      {formatOffset(zone.timeZone, now)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <div className="settings-row" style={{ gap: 8 }}>
                <div
                  className="settings-menu-button"
                  style={{ width: 110, borderRadius: 60 }}
                >
                  <SettingsGlass className="settings-menu-button-glass">
                    <input
                      type="time"
                      value={draftTime}
                      onChange={(event) => setDraftTime(event.target.value)}
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--settings-text-color)',
                        fontFamily: 'inherit',
                        outline: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        margin: 0,
                      }}
                    />
                  </SettingsGlass>
                </div>
                <div
                  className="settings-menu-button"
                  style={{ flex: 1, borderRadius: 60 }}
                >
                  <SettingsGlass className="settings-menu-button-glass">
                    <input
                      type="text"
                      value={draftLabel}
                      onChange={(event) => setDraftLabel(event.target.value)}
                      placeholder="鬧鐘名稱"
                      maxLength={20}
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        minWidth: 0,
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--settings-text-color)',
                        fontFamily: 'inherit',
                        outline: 'none',
                        padding: 0,
                        margin: 0,
                      }}
                    />
                  </SettingsGlass>
                </div>
                <button
                  type="button"
                  className="settings-menu-button"
                  style={{ width: 'auto', borderRadius: 60 }}
                  onClick={addAlarm}
                >
                  <SettingsGlass className="settings-menu-button-glass">
                    <span
                      className="settings-control-content"
                      style={{ padding: '0 4px' }}
                    >
                      新增
                    </span>
                  </SettingsGlass>
                </button>
              </div>

              {alarms.map((alarm) => (
                <div key={alarm.id} className="settings-row">
                  <span className="settings-copy">
                    <span
                      className="settings-title"
                      style={{ fontSize: 22, letterSpacing: '0.02em' }}
                    >
                      {alarm.time}
                    </span>
                    <span
                      className="settings-control-content"
                      style={{ opacity: 0.6, fontSize: 12 }}
                    >
                      {alarm.label}
                      {ringingAlarmIds.includes(alarm.id) ? (
                        <span
                          style={{ color: 'rgb(255 212 156)', marginLeft: 8 }}
                        >
                          響鈴中
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <div
                    style={{ display: 'flex', gap: 12, alignItems: 'center' }}
                  >
                    <button
                      className="settings-switch"
                      type="button"
                      role="switch"
                      aria-checked={alarm.enabled}
                      onClick={() => {
                        const checked = !alarm.enabled;
                        setAlarms((items) =>
                          items.map((item) =>
                            item.id === alarm.id
                              ? { ...item, enabled: checked }
                              : item,
                          ),
                        );
                      }}
                    >
                      <SettingsGlass
                        className="settings-switch-track"
                        config={SWITCH_TRACK_GLASS_CONFIG}
                      >
                        <SettingsGlass
                          className="settings-switch-thumb"
                          config={SWITCH_THUMB_GLASS_CONFIG}
                        >
                          <span
                            className="settings-switch-thumb-tone"
                            aria-hidden="true"
                          />
                        </SettingsGlass>
                      </SettingsGlass>
                    </button>
                    {ringingAlarmIds.includes(alarm.id) ? (
                      <button
                        type="button"
                        className="settings-menu-button"
                        style={{ width: 'auto' }}
                        onClick={() => {
                          setRingingAlarmIds((ids) =>
                            ids.filter((id) => id !== alarm.id),
                          );
                        }}
                      >
                        <SettingsGlass className="settings-menu-button-glass">
                          <span
                            className="settings-control-content"
                            style={{
                              minHeight: '26px',
                              padding: '0 10px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            停止
                          </span>
                        </SettingsGlass>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="settings-menu-button"
                      style={{ width: 'auto' }}
                      onClick={() => {
                        setAlarms((items) =>
                          items.filter((item) => item.id !== alarm.id),
                        );
                        setRingingAlarmIds((ids) =>
                          ids.filter((id) => id !== alarm.id),
                        );
                      }}
                    >
                      <SettingsGlass className="settings-menu-button-glass">
                        <span
                          className="settings-control-content"
                          style={{
                            color: 'rgb(255 100 100 / 0.8)',
                            minHeight: '26px',
                            padding: '0 10px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          刪除
                        </span>
                      </SettingsGlass>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
