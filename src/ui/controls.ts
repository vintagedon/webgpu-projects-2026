import type { SFXManager } from "./sfx";

export interface ControlConfig {
  sfx?: SFXManager;
}

export interface ControlHandle<T> {
  element: HTMLElement;
  readonly value: T;
  onChange(callback: (value: T) => void): () => void;
  destroy(): void;
}

interface ControlState<T> {
  value: T;
  listeners: Set<(value: T) => void>;
}

function emit<T>(state: ControlState<T>, value: T): void {
  state.value = value;
  for (const listener of state.listeners) {
    listener(value);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function decimalsFromStep(step: number): number {
  if (step >= 1) {
    return 0;
  }
  const text = step.toExponential();
  const exponent = text.split("e")[1];
  return exponent ? Math.min(4, parseInt(exponent, 10) * -1) : 0;
}

export interface SliderConfig extends ControlConfig {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  onChange?: (value: number) => void;
}

export function createSlider(config: SliderConfig): ControlHandle<number> {
  const step = config.step ?? 1;
  const decimals = decimalsFromStep(step);
  const state: ControlState<number> = {
    value: config.value,
    listeners: new Set()
  };
  if (config.onChange) {
    state.listeners.add(config.onChange);
  }

  const element = document.createElement("div");
  element.className = "control slider-control";

  const valueLabel = config.unit
    ? `${config.value.toFixed(decimals)}${config.unit}`
    : config.value.toFixed(decimals);

  element.innerHTML = `
    <div class="slider-label-row">
      <span class="bar-label">${config.label}</span>
      <span class="bar-value">${valueLabel}</span>
    </div>
    <div class="slider-track" role="slider" tabindex="0"
      aria-label="${config.label}" aria-valuemin="${config.min}"
      aria-valuemax="${config.max}" aria-valuenow="${config.value}">
      <div class="slider-fill"></div>
      <div class="slider-thumb"></div>
    </div>
  `;

  const track = element.querySelector<HTMLElement>(".slider-track");
  const fill = element.querySelector<HTMLElement>(".slider-fill");
  const valueEl = element.querySelector<HTMLElement>(".bar-value");
  if (!track || !fill || !valueEl) {
    throw new Error("Slider markup failed to render.");
  }

  const ratio = (value: number): number => (value - config.min) / (config.max - config.min);

  const render = (): void => {
    const pct = clamp(ratio(state.value), 0, 1);
    fill.style.setProperty("--amount", pct.toFixed(4));
    track.style.setProperty("--thumb-left", `${(pct * 100).toFixed(2)}%`);
    track.setAttribute("aria-valuenow", state.value.toFixed(decimals));
    valueEl.textContent = config.unit
      ? `${state.value.toFixed(decimals)}${config.unit}`
      : state.value.toFixed(decimals);
  };

  const quantize = (raw: number): number => {
    const stepped = Math.round((raw - config.min) / step) * step + config.min;
    return clamp(stepped, config.min, config.max);
  };

  const valueFromPointer = (clientX: number): number => {
    const rect = track.getBoundingClientRect();
    const pct = (clientX - rect.left) / rect.width;
    return quantize(config.min + clamp(pct, 0, 1) * (config.max - config.min));
  };

  let dragging = false;

  const onPointerDown = (event: PointerEvent): void => {
    event.preventDefault();
    dragging = true;
    track.setPointerCapture(event.pointerId);
    config.sfx?.play("click");
    emit(state, valueFromPointer(event.clientX));
    render();
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!dragging) {
      return;
    }
    emit(state, valueFromPointer(event.clientX));
    render();
  };

  const endDrag = (event: PointerEvent): void => {
    if (!dragging) {
      return;
    }
    dragging = false;
    try {
      track.releasePointerCapture(event.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    const span = step * (event.shiftKey ? 10 : 1);
    let next: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      next = quantize(state.value - span);
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      next = quantize(state.value + span);
    } else if (event.key === "Home") {
      next = config.min;
    } else if (event.key === "End") {
      next = config.max;
    }
    if (next === null) {
      return;
    }
    event.preventDefault();
    config.sfx?.play("click");
    emit(state, next);
    render();
  };

  track.addEventListener("pointerdown", onPointerDown);
  track.addEventListener("pointermove", onPointerMove);
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("keydown", onKeyDown);

  render();

  return {
    element,
    get value(): number {
      return state.value;
    },
    set value(next: number) {
      state.value = quantize(next);
      render();
    },
    onChange(callback: (value: number) => void): () => void {
      state.listeners.add(callback);
      return () => state.listeners.delete(callback);
    },
    destroy(): void {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("keydown", onKeyDown);
      state.listeners.clear();
      element.remove();
    }
  };
}

export interface ToggleConfig extends ControlConfig {
  label: string;
  value: boolean;
  compact?: boolean;
  onChange?: (value: boolean) => void;
}

export function createToggle(config: ToggleConfig): ControlHandle<boolean> {
  const state: ControlState<boolean> = {
    value: config.value,
    listeners: new Set()
  };
  if (config.onChange) {
    state.listeners.add(config.onChange);
  }

  const element = document.createElement("label");
  element.className = "control toggle-control";

  element.innerHTML = `
    <span class="control-label">${config.label}</span>
    <button type="button" class="toggle ${config.compact ? "toggle-compact" : ""}"
      role="switch" aria-checked="${config.value}" aria-label="${config.label}">
      <span class="toggle-track"></span>
      <span class="toggle-glow"></span>
      <span class="toggle-thumb"></span>
    </button>
  `;

  const toggle = element.querySelector<HTMLButtonElement>(".toggle");
  if (!toggle) {
    throw new Error("Toggle markup failed to render.");
  }

  const render = (): void => {
    toggle.classList.toggle("toggle--on", state.value);
    toggle.setAttribute("aria-checked", String(state.value));
  };

  const onClick = (): void => {
    config.sfx?.play("toggle");
    emit(state, !state.value);
    render();
  };

  toggle.addEventListener("click", onClick);
  render();

  return {
    element,
    get value(): boolean {
      return state.value;
    },
    set value(next: boolean) {
      state.value = next;
      render();
    },
    onChange(callback: (value: boolean) => void): () => void {
      state.listeners.add(callback);
      return () => state.listeners.delete(callback);
    },
    destroy(): void {
      toggle.removeEventListener("click", onClick);
      state.listeners.clear();
      element.remove();
    }
  };
}

export interface SegmentOption {
  label: string;
  value: string;
}

export interface SegmentConfig extends ControlConfig {
  label?: string;
  options: SegmentOption[];
  active: string;
  onChange?: (value: string) => void;
}

export function createSegment(config: SegmentConfig): ControlHandle<string> {
  const state: ControlState<string> = {
    value: config.active,
    listeners: new Set()
  };
  if (config.onChange) {
    state.listeners.add(config.onChange);
  }

  const element = document.createElement("div");
  element.className = "control segment-control";

  const labelHtml = config.label
    ? `<span class="control-label">${config.label}</span>`
    : "";

  const buttonsHtml = config.options
    .map(
      (option) =>
        `<button type="button" class="segment-btn${option.value === config.active ? " segment-btn--active" : ""}" data-value="${option.value}">${option.label}</button>`
    )
    .join("");

  element.innerHTML = `
    ${labelHtml}
    <div class="segment" role="tablist">${buttonsHtml}</div>
  `;

  const onSelect = (event: Event): void => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains("segment-btn")) {
      return;
    }
    const value = target.dataset.value;
    if (!value || value === state.value) {
      return;
    }
    config.sfx?.play("click");
    emit(state, value);
    for (const btn of element.querySelectorAll(".segment-btn")) {
      btn.classList.toggle("segment-btn--active", btn === target);
    }
  };

  element.addEventListener("click", onSelect);

  return {
    element,
    get value(): string {
      return state.value;
    },
    set value(next: string) {
      state.value = next;
      for (const btn of element.querySelectorAll<HTMLButtonElement>(".segment-btn")) {
        btn.classList.toggle("segment-btn--active", btn.dataset.value === next);
      }
    },
    onChange(callback: (value: string) => void): () => void {
      state.listeners.add(callback);
      return () => state.listeners.delete(callback);
    },
    destroy(): void {
      element.removeEventListener("click", onSelect);
      state.listeners.clear();
      element.remove();
    }
  };
}

export interface PresetOption {
  label: string;
  value: string;
}

export interface PresetSelectorConfig extends ControlConfig {
  label?: string;
  presets: PresetOption[];
  onSelect?: (value: string) => void;
}

export function createPresetSelector(config: PresetSelectorConfig): ControlHandle<string> {
  const state: ControlState<string> = {
    value: config.presets[0]?.value ?? "",
    listeners: new Set()
  };
  if (config.onSelect) {
    state.listeners.add(config.onSelect);
  }

  const element = document.createElement("div");
  element.className = "control preset-control";

  const labelHtml = config.label
    ? `<span class="control-label">${config.label}</span>`
    : "";

  const buttonsHtml = config.presets
    .map(
      (preset) =>
        `<button type="button" class="btn-ghost preset-btn" data-value="${preset.value}">${preset.label}</button>`
    )
    .join("");

  element.innerHTML = `
    ${labelHtml}
    <div class="preset-list">${buttonsHtml}</div>
  `;

  const onSelect = (event: Event): void => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains("preset-btn")) {
      return;
    }
    const value = target.dataset.value;
    if (!value || value === state.value) {
      return;
    }
    config.sfx?.play("confirm");
    emit(state, value);
    for (const btn of element.querySelectorAll(".preset-btn")) {
      btn.classList.toggle("preset-btn--active", btn === target);
    }
  };

  element.addEventListener("click", onSelect);

  return {
    element,
    get value(): string {
      return state.value;
    },
    set value(next: string) {
      state.value = next;
      for (const btn of element.querySelectorAll<HTMLButtonElement>(".preset-btn")) {
        btn.classList.toggle("preset-btn--active", btn.dataset.value === next);
      }
    },
    onChange(callback: (value: string) => void): () => void {
      state.listeners.add(callback);
      return () => state.listeners.delete(callback);
    },
    destroy(): void {
      element.removeEventListener("click", onSelect);
      state.listeners.clear();
      element.remove();
    }
  };
}
