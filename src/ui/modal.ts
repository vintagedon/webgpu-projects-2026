import type { SFXManager } from "./sfx";

export interface WelcomeModalAction {
  label: string;
  onClick?: () => void;
  style?: "primary" | "secondary" | "danger";
}

export interface WelcomeModalConfig {
  title: string;
  badge?: string;
  content: string | HTMLElement;
  actions: WelcomeModalAction[];
  onDismiss?: () => void;
  storageKey: string;
  sfx: SFXManager;
}

export function createWelcomeModal(config: WelcomeModalConfig): { show(): void; dismiss(): void } {
  let backdrop: HTMLDivElement | null = null;

  const dismiss = (sound: "cancel" | "confirm" = "cancel"): void => {
    if (!backdrop) {
      return;
    }

    config.sfx.play(sound);
    localStorage.setItem(config.storageKey, "true");
    backdrop.remove();
    backdrop = null;
    document.removeEventListener("keydown", onKeydown);
    config.onDismiss?.();
  };

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      dismiss("cancel");
    }
  };

  const show = (): void => {
    if (localStorage.getItem(config.storageKey) === "true" || backdrop) {
      return;
    }

    backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const modal = document.createElement("section");
    modal.className = "welcome-modal panel panel-main";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const titleRow = document.createElement("div");
    titleRow.className = "modal-title-row";
    titleRow.innerHTML = `<h2>${config.title}</h2>${config.badge ? `<span class="chip status-chip--blue">${config.badge}</span>` : ""}`;

    const body = document.createElement("div");
    body.className = "modal-body";
    if (typeof config.content === "string") {
      body.innerHTML = config.content;
    } else {
      body.append(config.content);
    }

    const actions = document.createElement("div");
    actions.className = "modal-actions";
    for (const action of config.actions) {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        action.style === "secondary"
          ? "btn-ghost"
          : action.style === "danger"
            ? "btn-danger"
            : "btn-neon";
      button.textContent = action.label;
      button.addEventListener("click", () => {
        action.onClick?.();
        dismiss("confirm");
      });
      actions.append(button);
    }

    modal.append(titleRow, body, actions);
    backdrop.append(modal);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        dismiss("cancel");
      }
    });

    document.body.append(backdrop);
    document.addEventListener("keydown", onKeydown);
    config.sfx.play("transition");
  };

  return { show, dismiss };
}
