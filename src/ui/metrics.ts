import type { FrameStats } from "../core/timing";

const FRAME_BUDGET_MS = 1000 / 60;
const SPARKLINE_SAMPLES = 60;

export interface MetricsPanel {
  element: HTMLElement;
  updateStats(stats: FrameStats): void;
  setMetric(key: string, label: string, value: string): void;
}

export function createMetricsPanel(container: HTMLElement): MetricsPanel {
  const element = document.createElement("div");
  element.className = "metrics-panel";

  element.innerHTML = `
    <div class="metric-fps-row">
      <div class="metric-fps">
        <span class="metric-value">--</span>
        <span class="metric-unit">FPS</span>
      </div>
      <canvas class="sparkline" aria-hidden="true"></canvas>
    </div>
    <div class="metric-time">
      <span class="metric-label">frame</span>
      <span class="metric-number">0.00 ms</span>
    </div>
    <div class="metric-bars">
      <div class="bar-wrap metric-bar">
        <div class="bar-header">
          <span class="bar-label">render</span>
          <span class="bar-value">0.00 ms</span>
        </div>
        <div class="bar"><div class="bar-fill"></div></div>
      </div>
      <div class="bar-wrap metric-bar">
        <div class="bar-header">
          <span class="bar-label">compute</span>
          <span class="bar-value">0.00 ms</span>
        </div>
        <div class="bar"><div class="bar-fill"></div></div>
      </div>
    </div>
    <div class="metrics-custom"></div>
  `;

  container.append(element);

  const fpsValue = element.querySelector<HTMLElement>(".metric-fps .metric-value");
  const frameTime = element.querySelector<HTMLElement>(".metric-time .metric-number");
  const bars = element.querySelectorAll<HTMLElement>(".metric-bar");
  const renderBar = bars[0];
  const computeBar = bars[1];
  const sparkline = element.querySelector<HTMLCanvasElement>(".sparkline");
  const customContainer = element.querySelector<HTMLElement>(".metrics-custom");

  if (!fpsValue || !frameTime || !renderBar || !computeBar || !sparkline || !customContainer) {
    throw new Error("Metrics panel markup failed to render.");
  }

  const renderFill = renderBar.querySelector<HTMLElement>(".bar-fill");
  const renderValue = renderBar.querySelector<HTMLElement>(".bar-value");
  const renderLabel = renderBar.querySelector<HTMLElement>(".bar-label");
  const computeFill = computeBar.querySelector<HTMLElement>(".bar-fill");
  const computeValue = computeBar.querySelector<HTMLElement>(".bar-value");
  const computeLabel = computeBar.querySelector<HTMLElement>(".bar-label");
  if (!renderFill || !renderValue || !renderLabel || !computeFill || !computeValue || !computeLabel) {
    throw new Error("Metrics bars failed to render.");
  }

  const fpsHistory: number[] = [];
  const customMetrics = new Map<string, HTMLElement>();

  const setBar = (fill: HTMLElement, value: HTMLElement, ms: number): void => {
    const ratio = Math.min(ms / FRAME_BUDGET_MS, 1);
    fill.style.setProperty("--amount", ratio.toFixed(4));
    value.textContent = `${ms.toFixed(2)} ms`;
  };

  const sizeSparkline = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = sparkline.getBoundingClientRect();
    sparkline.width = Math.max(1, Math.floor(rect.width * dpr));
    sparkline.height = Math.max(1, Math.floor(rect.height * dpr));
  };

  const drawSparkline = (): void => {
    const ctx = sparkline.getContext("2d");
    if (!ctx) {
      return;
    }
    const width = sparkline.width;
    const height = sparkline.height;
    ctx.clearRect(0, 0, width, height);

    const samples = fpsHistory.length;
    if (samples === 0) {
      return;
    }

    const maxFps = Math.max(60, ...fpsHistory);
    const stepX = width / (SPARKLINE_SAMPLES - 1);

    ctx.beginPath();
    for (let i = 0; i < samples; i++) {
      const sample = fpsHistory[i];
      if (sample === undefined) {
        continue;
      }
      const x = i * stepX;
      const y = height - (sample / maxFps) * height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = Math.max(1.5, window.devicePixelRatio || 1);
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
    ctx.shadowBlur = 6;
    ctx.stroke();
  };

  sizeSparkline();
  const resizeObserver = new ResizeObserver(() => {
    sizeSparkline();
    drawSparkline();
  });
  resizeObserver.observe(sparkline);

  // Pass-time labels must stay honest: the bars are fed by performance.now()
  // brackets around encode/submit (CPU-side) until the GPU timestamp-query path
  // is wired, so they are tagged "cpu" unless stats.gpuTiming says otherwise.
  // stats.gpuTiming originates from FrameTimer.supportsGpuTimestamps().
  const tag = (gpu: boolean): string => (gpu ? "gpu" : "cpu");

  return {
    element,
    updateStats(stats: FrameStats): void {
      fpsValue.textContent = String(stats.fps);
      frameTime.textContent = `${stats.frameTimeMs.toFixed(2)} ms`;
      renderLabel.textContent = `render · ${tag(stats.gpuTiming)}`;
      computeLabel.textContent = `compute · ${tag(stats.gpuTiming)}`;
      setBar(renderFill, renderValue, stats.renderTimeMs);
      setBar(computeFill, computeValue, stats.computeTimeMs);

      fpsHistory.push(stats.fps);
      if (fpsHistory.length > SPARKLINE_SAMPLES) {
        fpsHistory.shift();
      }
      drawSparkline();
    },
    setMetric(key: string, label: string, value: string): void {
      let row = customMetrics.get(key);
      if (!row) {
        row = document.createElement("div");
        row.className = "metric-row";
        row.innerHTML = `<span class="metric-label"></span><span class="metric-number"></span>`;
        customContainer.append(row);
        customMetrics.set(key, row);
      }
      const labelEl = row.querySelector<HTMLElement>(".metric-label");
      const valueEl = row.querySelector<HTMLElement>(".metric-number");
      if (labelEl) {
        labelEl.textContent = label;
      }
      if (valueEl) {
        valueEl.textContent = value;
      }
    }
  };
}
