export interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
}

export interface AdapterInfo {
  vendor: string;
  architecture: string;
  description: string;
}

export async function initWebGPU(
  canvas: HTMLCanvasElement
): Promise<WebGPUContext | null> {
  if (typeof navigator === "undefined" || !navigator.gpu) {
    return null;
  }

  let adapter: GPUAdapter | null;
  try {
    adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
  } catch {
    return null;
  }

  if (!adapter) {
    return null;
  }

  let device: GPUDevice;
  try {
    device = await adapter.requestDevice();
  } catch {
    return null;
  }

  const context = canvas.getContext("webgpu");
  if (!context) {
    return null;
  }

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
    alphaMode: "premultiplied"
  });

  device.lost.then((info) => {
    console.warn(`WebGPU device lost: ${info.reason} - ${info.message}`);
  });

  return { adapter, device, context, format };
}

export function getAdapterInfo(adapter: GPUAdapter): AdapterInfo {
  const info = adapter.info;
  return {
    vendor: info.vendor,
    architecture: info.architecture,
    description: info.description
  };
}

export function getAdapterDescription(adapter: GPUAdapter): string {
  const { vendor, architecture, description } = getAdapterInfo(adapter);
  return description || architecture || vendor || "Unknown GPU";
}
