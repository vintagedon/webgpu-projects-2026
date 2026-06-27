export interface CanvasHandle {
  canvas: HTMLCanvasElement;
  onResize(callback: (width: number, height: number) => void): void;
  resize(): void;
  destroy(): void;
}

export function createCanvas(container: HTMLElement): CanvasHandle {
  const canvas = document.createElement("canvas");
  canvas.className = "gpu-canvas";
  container.append(canvas);

  const resizeCallbacks = new Set<(width: number, height: number) => void>();

  const resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      for (const callback of resizeCallbacks) {
        callback(width, height);
      }
    }
  };

  const observer = new ResizeObserver(() => resize());
  observer.observe(container);

  resize();

  return {
    canvas,
    onResize(callback: (width: number, height: number) => void): void {
      resizeCallbacks.add(callback);
    },
    resize,
    destroy(): void {
      observer.disconnect();
      resizeCallbacks.clear();
      canvas.remove();
    }
  };
}
