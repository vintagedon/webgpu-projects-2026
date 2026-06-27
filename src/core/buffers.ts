/**
 * Alignment for uniform-buffer binding offsets that the GPU addresses by a
 * dynamic offset (e.g. `dynamicOffset` bind groups) and for sub-allocated
 * regions carved out of a single large uniform buffer. Single-bind UBOs do not
 * need this; see {@link createUniformBuffer}. Use `alignTo(offset, UNIFORM_ALIGN)`
 * when packing multiple uniforms into one buffer with dynamic offsets.
 */
export const UNIFORM_ALIGN = 256;

function toGpuSource(data: ArrayBufferView): GPUAllowSharedBufferSource {
  return data as unknown as GPUAllowSharedBufferSource;
}

/**
 * Creates a storage buffer, uploads `data` once, and returns it. Size is padded
 * to a 4-byte boundary (storage buffers require a multiple of 4). Default usage
 * is STORAGE | COPY_DST; OR in extra flags (e.g. VERTEX, COPY_SRC) via `usage`.
 */
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

/**
 * Creates a uniform buffer of `size` bytes, rounded up to a 16-byte boundary.
 * 16 is the WGSL uniform-address-space member alignment floor and is sufficient
 * for any single-bind UBO. This does NOT pad to 256: that larger alignment only
 * governs dynamic binding offsets and sub-allocated regions (see UNIFORM_ALIGN).
 */
export function createUniformBuffer(device: GPUDevice, size: number): GPUBuffer {
  return device.createBuffer({
    size: alignTo(size, 16),
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });
}

/**
 * Writes `data` into `buffer` at `offset` (bytes) via the device queue. The
 * caller is responsible for offset alignment: 4 bytes within a uniform buffer,
 * or UNIFORM_ALIGN (256) for dynamic binding offsets.
 */
export function writeUniform(
  device: GPUDevice,
  buffer: GPUBuffer,
  offset: number,
  data: Float32Array | Uint32Array | ArrayBufferView
): void {
  device.queue.writeBuffer(buffer, offset, toGpuSource(data));
}

/**
 * Two storage textures in read/write swap for feedback simulations
 * (reaction-diffusion, fluid, cellular automata).
 *
 * Contract:
 * - Requires a caller-supplied `bindGroupLayout` with binding 0 = read-only
 *   texture view (`@binding(0) var t: texture_*`) and binding 1 = write storage
 *   texture (`@binding(1) var t: texture_storage_2d`).
 * - Both textures are created with STORAGE_BINDING | TEXTURE_BINDING | COPY_SRC
 *   so either side can be read or written each pass.
 * - `bindGroups[0]` reads view 0 / writes view 1; `bindGroups[1]` the reverse.
 * - Each compute pass binds `bindGroups[current]`, then `swap()` flips.
 */
export interface PingPongTextures {
  textures: [GPUTexture, GPUTexture];
  views: [GPUTextureView, GPUTextureView];
  bindGroups: [GPUBindGroup, GPUBindGroup];
  /** Index of the bind group to use for the current pass; flips on swap(). */
  readonly current: number;
  /** Advance to the other read/write pairing for the next pass. */
  swap(): void;
  /** Destroy both textures. Views and bind groups become invalid. */
  destroy(): void;
}

/**
 * Allocates a ping-pong texture pair plus their swap bind groups. See
 * {@link PingPongTextures} for the required bind-group layout binding order
 * (0 read view, 1 write storage) and texture usage contract.
 */
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

/** Rounds `value` up to the next multiple of `alignment`. */
export function alignTo(value: number, alignment: number): number {
  return Math.ceil(value / alignment) * alignment;
}
