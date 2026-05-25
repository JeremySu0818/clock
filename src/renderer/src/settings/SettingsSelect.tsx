import { useEffect, useRef, type ReactElement } from 'react';
import { SettingsGlass } from './SettingsGlass';

export type SettingsMenuId = 'appearance' | 'language';

export type SettingsSelectOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type SettingsSelectProps<TValue extends string> = {
  buttonId: string;
  labelId: string;
  menuId: string;
  menuKey: SettingsMenuId;
  onChange: (value: TValue) => void;
  onOpenMenuChange: (menu: SettingsMenuId | null) => void;
  openMenu: SettingsMenuId | null;
  options: Array<SettingsSelectOption<TValue>>;
  value: TValue;
};

export function SettingsSelect<TValue extends string>({
  buttonId,
  labelId,
  menuId,
  menuKey,
  onChange,
  onOpenMenuChange,
  openMenu,
  options,
  value,
}: SettingsSelectProps<TValue>): ReactElement {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isOpen = openMenu === menuKey;
  const selectedLabel =
    options.find((option) => option.value === value)?.label ??
    options[0]?.label ??
    '';

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        menuRef.current?.contains(event.target)
      ) {
        return;
      }

      onOpenMenuChange(null);
    };

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, onOpenMenuChange]);

  return (
    <div className="settings-menu" ref={menuRef}>
      <button
        id={buttonId}
        type="button"
        className="settings-menu-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-labelledby={`${labelId} ${buttonId}`}
        onClick={() => onOpenMenuChange(isOpen ? null : menuKey)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            onOpenMenuChange(menuKey);
          }
        }}
      >
        <SettingsGlass className="settings-menu-button-glass">
          <span className="settings-control-content">{selectedLabel}</span>
          <span className="settings-menu-chevron" aria-hidden="true">
            ⌄
          </span>
        </SettingsGlass>
      </button>
      {isOpen ? (
        <div
          id={menuId}
          className="settings-menu-popover"
          role="listbox"
          aria-labelledby={labelId}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="settings-menu-option"
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                onOpenMenuChange(null);
              }}
            >
              <SettingsGlass className="settings-menu-option-glass">
                <span className="settings-control-content">{option.label}</span>
              </SettingsGlass>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
