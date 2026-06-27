import { createSiteShell } from "./siteShell";
import type { SFXManager } from "./sfx";

const GEAR_ICON = `
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
`;

export interface DemoLayoutConfig {
  title: string;
  description: string;
}

export interface DemoLayout {
  shell: HTMLElement;
  leftPanel: HTMLElement;
  metricsContainer: HTMLElement;
  canvasContainer: HTMLElement;
  rightPane: HTMLElement;
  flyoutTrigger: HTMLElement;
}

export function createDemoLayout(config: DemoLayoutConfig, sfx: SFXManager): DemoLayout {
  const content = document.createElement("div");
  content.className = "demo-layout";

  content.innerHTML = `
    <aside class="demo-left panel panel-main">
      <div class="demo-identity">
        <h1 class="demo-title">${config.title}</h1>
        <p class="demo-desc">${config.description}</p>
      </div>
      <div class="demo-metrics"></div>
    </aside>
    <section class="demo-right">
      <div class="demo-canvas-wrap"></div>
    </section>
  `;

  const leftPanel = content.querySelector<HTMLElement>(".demo-left");
  const metricsContainer = content.querySelector<HTMLElement>(".demo-metrics");
  const rightPane = content.querySelector<HTMLElement>(".demo-right");
  const canvasContainer = content.querySelector<HTMLElement>(".demo-canvas-wrap");

  if (!leftPanel || !metricsContainer || !rightPane || !canvasContainer) {
    throw new Error("Demo layout markup failed to render.");
  }

  const flyoutTrigger = document.createElement("button");
  flyoutTrigger.type = "button";
  flyoutTrigger.className = "btn-icon flyout-trigger";
  flyoutTrigger.setAttribute("aria-label", "Open settings");
  flyoutTrigger.innerHTML = GEAR_ICON;
  rightPane.append(flyoutTrigger);

  const shell = createSiteShell(content, sfx);
  shell.classList.add("site-shell--demo");

  flyoutTrigger.addEventListener("mouseenter", () => sfx.play("hover"));

  return {
    shell,
    leftPanel,
    metricsContainer,
    canvasContainer,
    rightPane,
    flyoutTrigger
  };
}
