import alertUrl from "../assets/sfx/alert.wav";
import cancelUrl from "../assets/sfx/cancel.wav";
import clickUrl from "../assets/sfx/click.wav";
import confirmUrl from "../assets/sfx/confirm.wav";
import errorUrl from "../assets/sfx/error.wav";
import hoverUrl from "../assets/sfx/hover.wav";
import toggleUrl from "../assets/sfx/toggle.wav";
import transitionUrl from "../assets/sfx/transition.wav";

export type SFXCategory =
  | "click"
  | "hover"
  | "confirm"
  | "cancel"
  | "toggle"
  | "transition"
  | "alert"
  | "error";

export interface SFXManager {
  play(category: SFXCategory): void;
  mute(): void;
  unmute(): void;
  isMuted(): boolean;
}

const STORAGE_KEY = "donfather:sfx-muted";

const soundUrls: Record<SFXCategory, string> = {
  click: clickUrl,
  hover: hoverUrl,
  confirm: confirmUrl,
  cancel: cancelUrl,
  toggle: toggleUrl,
  transition: transitionUrl,
  alert: alertUrl,
  error: errorUrl
};

export function createSFXManager(): SFXManager {
  let context: AudioContext | null = null;
  let muted = localStorage.getItem(STORAGE_KEY) === "true";
  const buffers = new Map<SFXCategory, AudioBuffer>();
  const pending = new Map<SFXCategory, Promise<AudioBuffer>>();

  const getContext = (): AudioContext => {
    context ??= new AudioContext();
    return context;
  };

  const load = (category: SFXCategory): Promise<AudioBuffer> => {
    const existing = buffers.get(category);
    if (existing) {
      return Promise.resolve(existing);
    }

    const pendingLoad = pending.get(category);
    if (pendingLoad) {
      return pendingLoad;
    }

    const audioContext = getContext();
    const promise = fetch(soundUrls[category])
      .then((response) => response.arrayBuffer())
      .then((data) => audioContext.decodeAudioData(data))
      .then((buffer) => {
        buffers.set(category, buffer);
        pending.delete(category);
        return buffer;
      });

    pending.set(category, promise);
    return promise;
  };

  return {
    play(category: SFXCategory): void {
      if (muted) {
        return;
      }

      const audioContext = getContext();
      if (audioContext.state === "suspended") {
        void audioContext.resume();
      }

      void load(category).then((buffer) => {
        if (muted) {
          return;
        }

        const source = audioContext.createBufferSource();
        const gain = audioContext.createGain();
        gain.gain.value = 0.26;
        source.buffer = buffer;
        source.connect(gain).connect(audioContext.destination);
        source.start();
      });
    },
    mute(): void {
      muted = true;
      localStorage.setItem(STORAGE_KEY, "true");
    },
    unmute(): void {
      muted = false;
      localStorage.setItem(STORAGE_KEY, "false");
    },
    isMuted(): boolean {
      return muted;
    }
  };
}
