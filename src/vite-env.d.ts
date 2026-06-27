/// <reference types="vite/client" />

interface DemoTestState {
  webgpuInitialized: boolean;
  simulationRunning: boolean;
  fps: number;
  frameCount: number;
  demoName: string;
}

interface Window {
  __DEMO_TEST_STATE__?: DemoTestState;
}
