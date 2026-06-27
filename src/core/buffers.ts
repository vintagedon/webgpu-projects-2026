export const UNIFORM_ALIGN = 256;

function toGpuSource(data: ArrayBufferView): GPUAllowSharedBufferSource {
  return data as unknown as GPUAllowSharedBufferSource;
}

export function createStorageBuffer(
  device: GPUDevice,
  data: Float32Array | Uint32Array,
  usage: GPUBufferUsageFlags = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
): GPUBuffer {
  const buffer = device.createBuffer({
    size: alignTo(data.BYTES_PER_ELEMENT * data.length, 4),
    usage: usage | GPUBufferUsage.COPY_DST
  });
  device.queue.writeBuffer(buffer, 0, toGpuSource(data));
  return buffer;
}

export function createUniformBuffer(device: GPUDevice, size: number): GPUBuffer {
  return device.createBuffer({
    size: alignTo(size, 16),
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });
}

export function writeUniform(
  device: GPUDevice,
  buffer: GPUBuffer,
  offset: number,
  data: Float32Array | Uint32Array | ArrayBufferView
): void {
  device.queue.writeBuffer(buffer, offset, toGpuSource(data));
}

export interface PingPongTextures {
  textures: [GPUTexture, GPUTexture];
  views: [GPUTextureView, GPUTextureView];
  bindGroups: [GPUBindGroup, GPUBindGroup];
  readonly current: number;
  swap(): void;
  destroy(): void;
}

export function createPingPongTextures(
  device: GPUDevice,
  width: number,
  height: number,
  format: GPUTextureFormat,
  bindGroupLayout: GPUBindGroupLayout
): PingPongTextures {
  const createTexture = (): GPUTexture =>
    device.createTexture({
      size: { width, height },
      format,
      usage:
        GPUTextureUsage.STORAGE_BINDING |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_SRC
    });

  const textures: [GPUTexture, GPUTexture] = [createTexture(), createTexture()];
  const views: [GPUTextureView, GPUTextureView] = [
    textures[0].createView(),
    textures[1].createView()
  ];

  const createBindGroup = (read: GPUTextureView, write: GPUTextureView): GPUBindGroup =>
    device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: read },
        { binding: 1, resource: write }
      ]
    });

  const bindGroups: [GPUBindGroup, GPUBindGroup] = [
    createBindGroup(views[0], views[1]),
    createBindGroup(views[1], views[0])
  ];

  let current = 0;

  return {
    textures,
    views,
    bindGroups,
    get current(): number {
      return current;
    },
    swap(): void {
      current = 1 - current;
    },
    destroy(): void {
      textures[0].destroy();
      textures[1].destroy();
    }
  };
}

export function alignTo(value: number, alignment: number): number {
  return Math.ceil(value / alignment) * alignment;
}
