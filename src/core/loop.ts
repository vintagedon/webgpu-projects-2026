import { FrameRecorder, FrameTimer, type FrameStats } from "./timing";

export interface RenderLoopOptions {
  onFrame: (deltaTime: number, frameCount: number, recorder: FrameRecorder) => void;
  onStats?: (stats: FrameStats) => void;
  stepsPerFrame?: number;
  timer?: FrameTimer;
}

export interface RenderLoop {
  start(): void;
  stop(): void;
  isRunning(): boolean;
  setStepsPerFrame(steps: number): void;
  getStepsPerFrame(): number;
  getTimer(): FrameTimer;
}

export function createRenderLoop(options: RenderLoopOptions): RenderLoop {
  const timer = options.timer ?? new FrameTimer();
  let stepsPerFrame = options.stepsPerFrame ?? 1;
  let rafId = 0;
  let running = false;
  let frameCount = 0;
  let lastTime = 0;

  const frame = (time: number): void => {
    if (!running) {
      return;
    }

    const deltaTime = lastTime > 0 ? (time - lastTime) / 1000 : 0;
    lastTime = time;

    const recorder = timer.beginFrame();
    options.onFrame(deltaTime, frameCount, recorder);

    const stats = timer.endFrame();
    options.onStats?.(stats);

    frameCount++;
    rafId = requestAnimationFrame(frame);
  };

  return {
    start(): void {
      if (running) {
        return;
      }
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    },
    stop(): void {
      running = false;
      cancelAnimationFrame(rafId);
    },
    isRunning(): boolean {
      return running;
    },
    setStepsPerFrame(steps: number): void {
      stepsPerFrame = Math.max(1, Math.floor(steps));
    },
    getStepsPerFrame(): number {
      return stepsPerFrame;
    },
    getTimer(): FrameTimer {
      return timer;
    }
  };
}
