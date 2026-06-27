import "../../assets/css/index.css";
import shaderSource from "./shader.wgsl?raw";
import { initWebGPU, getAdapterDescription, createCanvas } from "../../core";
import type { WebGPUContext } from "../../core";
import { createRenderLoop } from "../../core/loop";
import type { FrameRecorder } from "../../core/timing";
import { createDemoLayout } from "../../ui/layout";
import { createMetricsPanel } from "../../ui/metrics";
import { createFlyout } from "../../ui/flyout";
import { createSlider } from "../../ui/controls";
import { createWelcomeModal } from "../../ui/modal";
import { createSFXManager } from "../../ui/sfx";

interface GradientParams {
  hue: number;
  saturation: number;
  brightness: number;
}

const root = document.querySelector<HTMLElement>("#app");
if (!root) {
  throw new Error("Application root was not found.");
}

const sfx = createSFXManager();
const layout = createDemoLayout(
  {
    title: "Stub Demo",
    description:
      "A gradient proving the harness: two-pane layout, neon controls, and live telemetry."
  },
  sfx
);
root.append(layout.shell);

const metrics = createMetricsPanel(layout.metricsContainer);
metrics.setMetric("resolution", "resolution", "—");

const canvasHandle = createCanvas(layout.canvasContainer);

const params: GradientParams = {
  hue: 200,
  saturation: 75,
  brightness: 90
};

window.__DEMO_TEST_STATE__ = {
  webgpuInitialized: false,
  simulationRunning: false,
  fps: 0,
  frameCount: 0,
  demoName: "stub"
};

void boot();

async function boot(): Promise<void> {
  const gpu = await initWebGPU(canvasHandle.canvas);

  if (!gpu) {
    showUnavailableModal();
    return;
  }

  window.__DEMO_TEST_STATE__!.webgpuInitialized = true;
  metrics.setMetric("resolution", "resolution", `${canvasHandle.canvas.width}×${canvasHandle.canvas.height}`);

  const pipeline = buildPipeline(gpu);
  canvasHandle.onResize((width, height) => {
    metrics.setMetric("resolution", "resolution", `${width}×${height}`);
  });

  mountControls();

  const startTime = performance.now();
  const loop = createRenderLoop({
    onFrame: (_deltaTime, _frameCount, recorder) => onFrame(recorder, gpu, pipeline, startTime),
    onStats: (stats) => {
      metrics.updateStats(stats);
      const state = window.__DEMO_TEST_STATE__!;
      state.fps = stats.fps;
      state.frameCount++;
    }
  });

  const storageKey = `donfather:welcome:${location.pathname}`;
  const welcome = createWelcomeModal({
    title: "Stub Demo",
    badge: "WebGPU",
    storageKey,
    sfx,
    content: buildWelcomeContent(gpu),
    actions: [
      {
        label: "Start",
        style: "primary",
        onClick: () => {
          loop.start();
          window.__DEMO_TEST_STATE__!.simulationRunning = true;
        }
      }
    ]
  });

  if (localStorage.getItem(storageKey) === "true") {
    loop.start();
    window.__DEMO_TEST_STATE__!.simulationRunning = true;
  } else {
    welcome.show();
  }
}

interface StubPipeline {
  pipeline: GPURenderPipeline;
  uniformBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
}

function buildPipeline(gpu: WebGPUContext): StubPipeline {
  const { device, format } = gpu;

  const module = device.createShaderModule({ code: shaderSource });

  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module, entryPoint: "vs_main" },
    fragment: {
      module,
      entryPoint: "fs_main",
      targets: [{ format }]
    },
    primitive: { topology: "triangle-list" }
  });

  const uniformBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }]
  });

  return { pipeline, uniformBuffer, bindGroup };
}

function onFrame(
  recorder: FrameRecorder,
  gpu: WebGPUContext,
  pipeline: StubPipeline,
  startTime: number
): void {
  recorder.beginRender();

  const { device, context } = gpu;
  const time = (performance.now() - startTime) / 1000;
  const uniforms = new Float32Array([
    params.hue / 360,
    params.saturation / 100,
    params.brightness / 100,
    time
  ]);
  device.queue.writeBuffer(pipeline.uniformBuffer, 0, uniforms);

  const encoder = device.createCommandEncoder();
  const view = context.getCurrentTexture().createView();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view,
        clearValue: { r: 0.01, g: 0.02, b: 0.09, a: 1 },
        loadOp: "clear",
        storeOp: "store"
      }
    ]
  });
  pass.setPipeline(pipeline.pipeline);
  pass.setBindGroup(0, pipeline.bindGroup);
  pass.draw(3);
  pass.end();
  device.queue.submit([encoder.finish()]);

  recorder.endRender();
}

function mountControls(): void {
  const flyout = createFlyout({ sfx, trigger: layout.flyoutTrigger });
  layout.rightPane.append(flyout.element);
  layout.flyoutTrigger.addEventListener("click", () => flyout.toggle());

  const wrapper = document.createElement("div");
  wrapper.className = "flyout-content";
  wrapper.style.padding = "0 var(--space-1)";

  const hue = createSlider({
    label: "Hue",
    min: 0,
    max: 360,
    step: 1,
    value: params.hue,
    unit: "°",
    sfx,
    onChange: (value) => {
      params.hue = value;
    }
  });
  const saturation = createSlider({
    label: "Saturation",
    min: 0,
    max: 100,
    step: 1,
    value: params.saturation,
    unit: "%",
    sfx,
    onChange: (value) => {
      params.saturation = value;
    }
  });
  const brightness = createSlider({
    label: "Brightness",
    min: 0,
    max: 100,
    step: 1,
    value: params.brightness,
    unit: "%",
    sfx,
    onChange: (value) => {
      params.brightness = value;
    }
  });

  wrapper.append(hue.element, saturation.element, brightness.element);
  flyout.setContent(wrapper);
}

function buildWelcomeContent(gpu: WebGPUContext): string {
  const adapter = getAdapterDescription(gpu.adapter);
  return `
    <div class="webgpu-status">
      <div class="webgpu-status-row webgpu-status--ok">
        <span class="chip status-chip--blue">Ready</span>
        <span>WebGPU is available.</span>
      </div>
      <div class="webgpu-adapter">${adapter}</div>
      <p>A simple gradient renders through the full harness: device init, render loop, timing, and neon controls.</p>
    </div>
  `;
}

function showUnavailableModal(): void {
  const welcome = createWelcomeModal({
    title: "Stub Demo",
    badge: "WebGPU",
    storageKey: `donfather:welcome:${location.pathname}:nogpu`,
    sfx,
    content: `
      <div class="webgpu-status">
        <div class="webgpu-status-row webgpu-status--bad">
          <span class="chip" style="border-color: rgba(239,68,68,0.65); color: var(--neon-red);">Offline</span>
          <span>WebGPU is not available in this browser.</span>
        </div>
        <div class="webgpu-warning">
          WebGPU requires a recent browser and a compatible GPU. Try
          <strong>Chrome 113+</strong>, <strong>Edge 113+</strong>,
          <strong>Firefox 141+</strong>, or <strong>Safari 18+</strong>.
          Inspect your GPU at <code>chrome://gpu</code>.
        </div>
      </div>
    `,
    actions: [{ label: "Close", style: "secondary" }]
  });
  welcome.show();
}
