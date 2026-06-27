import { FrameRecorder, FrameTimer, type FrameStats } from "./timing";

/**
 * Render loop contract. Per animation frame the loop runs `stepsPerFrame`
 * compute steps (onStep) followed by exactly one render (onFrame). The demo
 * brackets its GPU work inside each callback via the shared recorder so timing
 * aggregates correctly: onStep passes are summed into computeTimeMs across all
 * steps in the frame, onFrame into renderTimeMs. stepsPerFrame defaults to 1,
 * which reproduces the render-only stub (no onStep) unchanged.
 */
export interface RenderLoopOptions {
  onStep?: (deltaTime: number, stepIndex: number, recorder: FrameRecorder) => void;
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
    if (options.onStep) {
      for (let stepIndex = 0; stepIndex < stepsPerFrame; stepIndex++) {
        options.onStep(deltaTime, stepIndex, recorder);
      }
    }
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
