export interface FrameStats {
  fps: number;
  frameTimeMs: number;
  computeTimeMs: number;
  renderTimeMs: number;
  /**
   * Whether the pass timings above are GPU-timestamp-accurate. False here means
   * they are CPU-side `performance.now()` encode/submit brackets (the default
   * path). Originates from {@link FrameTimer.supportsGpuTimestamps}; the real
   * timestamp-query resolve/readback is wired in a later spec.
   */
  gpuTiming: boolean;
}

export interface FrameRecorder {
  beginCompute(): void;
  endCompute(): void;
  beginRender(): void;
  endRender(): void;
}

const EMPTY_STATS: FrameStats = {
  fps: 0,
  frameTimeMs: 0,
  computeTimeMs: 0,
  renderTimeMs: 0,
  gpuTiming: false
};

export class FrameTimer {
  private readonly history: number[] = [];
  private readonly historySize: number;
  private readonly gpuTimestamps: boolean;

  private frameStart = 0;
  private computeStart = 0;
  private renderStart = 0;
  private computeTimeMs = 0;
  private renderTimeMs = 0;
  private lastTimestamp = 0;
  private stats: FrameStats = { ...EMPTY_STATS };

  constructor(device?: GPUDevice, historySize = 60) {
    this.historySize = historySize;
    this.gpuTimestamps = device?.features.has("timestamp-query") ?? false;
  }

  supportsGpuTimestamps(): boolean {
    return this.gpuTimestamps;
  }

  getStats(): FrameStats {
    return this.stats;
  }

  /**
   * Begins a frame and returns a {@link FrameRecorder} the demo uses to bracket
   * its compute and render work.
   *
   * Measurement semantics: until the GPU timestamp-query path is wired, the
   * recorder measures pass cost with CPU-side `performance.now()` brackets
   * around command encode and queue.submit — i.e. host overhead, not GPU
   * execution time. That is honest enough for the stub and for relative tuning,
   * but the readout must not be presented as GPU-accurate. Spec 04 replaces the
   * begin/end pairs with timestamp-query writes when
   * {@link supportsGpuTimestamps} is true and flips {@link FrameStats.gpuTiming}.
   */
  beginFrame(): FrameRecorder {
    const now = performance.now();
    this.frameStart = now;
    this.computeTimeMs = 0;
    this.renderTimeMs = 0;

    if (this.lastTimestamp > 0) {
      const delta = now - this.lastTimestamp;
      this.history.push(delta);
      if (this.history.length > this.historySize) {
        this.history.shift();
      }
    }
    this.lastTimestamp = now;

    return {
      beginCompute: (): void => {
        this.computeStart = performance.now();
      },
      endCompute: (): void => {
        this.computeTimeMs += performance.now() - this.computeStart;
      },
      beginRender: (): void => {
        this.renderStart = performance.now();
      },
      endRender: (): void => {
        this.renderTimeMs += performance.now() - this.renderStart;
      }
    };
  }

  endFrame(): FrameStats {
    const frameTimeMs = performance.now() - this.frameStart;

    const fps =
      this.history.length > 0
        ? (this.history.length / this.history.reduce((sum, value) => sum + value, 0)) * 1000
        : 0;

    this.stats = {
      fps: Math.round(fps),
      frameTimeMs: Math.round(frameTimeMs * 100) / 100,
      computeTimeMs: Math.round(this.computeTimeMs * 100) / 100,
      renderTimeMs: Math.round(this.renderTimeMs * 100) / 100,
      gpuTiming: this.supportsGpuTimestamps()
    };

    return this.stats;
  }
}

export { EMPTY_STATS };
