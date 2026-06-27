import type { SFXManager } from "./sfx";

export interface FlyoutConfig {
  position?: "right";
  width?: number;
  trigger?: HTMLElement;
  sfx: SFXManager;
}

interface FlyoutTab {
  label: string;
  button: HTMLButtonElement;
  panel: HTMLElement;
}

export interface Flyout {
  element: HTMLElement;
  content: HTMLElement;
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
  setContent(element: HTMLElement): void;
  addTab(label: string, contentFn: () => HTMLElement): void;
  destroy(): void;
}

export function createFlyout(config: FlyoutConfig): Flyout {
  const width = config.width ?? 280;
  const element = document.createElement("aside");
  element.className = "flyout panel panel-settings";
  element.setAttribute("aria-hidden", "true");
  element.style.width = `${width}px`;

  const header = document.createElement("div");
  header.className = "flyout-header";

  const title = document.createElement("span");
  title.className = "panel-title";
  title.textContent = "Settings";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn-icon flyout-close";
  closeButton.setAttribute("aria-label", "Close settings");
  closeButton.textContent = "×";

  header.append(title, closeButton);

  const tabBar = document.createElement("div");
  tabBar.className = "flyout-tabs";
  tabBar.hidden = true;

  const body = document.createElement("div");
  body.className = "flyout-body";

  element.append(header, tabBar, body);

  const content = document.createElement("div");
  content.className = "flyout-content";
  body.append(content);

  let opened = false;
  const tabs: FlyoutTab[] = [];

  const renderTabs = (): void => {
    tabBar.hidden = tabs.length <= 1;
  };

  const activateTab = (target: FlyoutTab): void => {
    for (const tab of tabs) {
      const isActive = tab === target;
      tab.button.classList.toggle("segment-btn--active", isActive);
      tab.panel.hidden = !isActive;
    }
  };

  const onClose = (): void => {
    close();
  };

  const onOutside = (event: PointerEvent): void => {
    const target = event.target as Node | null;
    if (target && (element.contains(target) || config.trigger?.contains(target))) {
      return;
    }
    close();
  };

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      close();
    }
  };

  function openFlyout(): void {
    if (opened) {
      return;
    }
    opened = true;
    element.classList.add("flyout--open");
    element.setAttribute("aria-hidden", "false");
    config.sfx.play("transition");
    window.setTimeout(() => {
      document.addEventListener("pointerdown", onOutside);
    }, 0);
    document.addEventListener("keydown", onKeydown);
  }

  function closeFlyout(): void {
    if (!opened) {
      return;
    }
    opened = false;
    element.classList.remove("flyout--open");
    element.setAttribute("aria-hidden", "true");
    config.sfx.play("cancel");
    document.removeEventListener("pointerdown", onOutside);
    document.removeEventListener("keydown", onKeydown);
  }

  closeButton.addEventListener("click", onClose);

  function open(): void {
    openFlyout();
  }

  function close(): void {
    closeFlyout();
  }

  return {
    element,
    content,
    open,
    close,
    toggle(): void {
      if (opened) {
        closeFlyout();
      } else {
        openFlyout();
      }
    },
    isOpen(): boolean {
      return opened;
    },
    setContent(target: HTMLElement): void {
      content.replaceChildren(target);
    },
    addTab(label: string, contentFn: () => HTMLElement): void {
      const panel = document.createElement("div");
      panel.className = "flyout-tab-panel";
      panel.hidden = tabs.length > 0;
      panel.append(contentFn());

      const button = document.createElement("button");
      button.type = "button";
      button.className = "segment-btn";
      button.textContent = label;
      if (tabs.length === 0) {
        button.classList.add("segment-btn--active");
      }
      button.addEventListener("click", () => {
        const target = tabs.find((tab) => tab.button === button);
        if (target) {
          activateTab(target);
        }
      });

      tabBar.append(button);
      body.append(panel);
      tabs.push({ label, button, panel });

      if (tabs.length === 1) {
        content.hidden = true;
      } else {
        content.hidden = true;
      }
      renderTabs();
    },
    destroy(): void {
      closeButton.removeEventListener("click", onClose);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onKeydown);
      element.remove();
    }
  };
}
