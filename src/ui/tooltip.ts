export interface TooltipOptions {
  delayMs?: number;
  className?: string;
  interactive?: boolean;
}

export interface TooltipHandle {
  show(): void;
  hide(): void;
  destroy(): void;
}

export interface TooltipConfig {
  target: HTMLElement;
  content: string | HTMLElement;
  options?: TooltipOptions;
}

export function createTooltip({ target, content, options = {} }: TooltipConfig): TooltipHandle {
  const delay = options.delayMs ?? 200;
  let showTimer = 0;
  let visible = false;

  const tooltip = document.createElement("div");
  tooltip.className = `tooltip-panel panel panel-main ${options.className ?? ""}`.trim();
  tooltip.hidden = true;
  tooltip.setAttribute("role", "tooltip");

  if (typeof content === "string") {
    tooltip.innerHTML = content;
  } else {
    tooltip.append(content);
  }

  document.body.append(tooltip);

  const position = (): void => {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const margin = 12;
    const preferredTop = targetRect.top - tooltipRect.height - margin;
    const top =
      preferredTop >= margin
        ? preferredTop
        : Math.min(targetRect.bottom + margin, window.innerHeight - tooltipRect.height - margin);
    const centeredLeft = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
    const left = Math.min(
      Math.max(centeredLeft, margin),
      window.innerWidth - tooltipRect.width - margin
    );

    tooltip.style.top = `${Math.max(top, margin)}px`;
    tooltip.style.left = `${left}px`;
  };

  const show = (): void => {
    window.clearTimeout(showTimer);
    showTimer = window.setTimeout(() => {
      tooltip.hidden = false;
      visible = true;
      position();
    }, delay);
  };

  const hide = (): void => {
    window.clearTimeout(showTimer);
    if (options.interactive && tooltip.matches(":hover")) {
      return;
    }
    tooltip.hidden = true;
    visible = false;
  };

  const toggle = (event: Event): void => {
    event.preventDefault();
    if (visible) {
      hide();
    } else {
      show();
    }
  };

  target.addEventListener("mouseenter", show);
  target.addEventListener("mouseleave", hide);
  target.addEventListener("focus", show);
  target.addEventListener("blur", hide);
  target.addEventListener("click", toggle);
  tooltip.addEventListener("mouseleave", hide);
  window.addEventListener("resize", position);
  window.addEventListener("scroll", position, true);

  return {
    show,
    hide,
    destroy(): void {
      window.clearTimeout(showTimer);
      target.removeEventListener("mouseenter", show);
      target.removeEventListener("mouseleave", hide);
      target.removeEventListener("focus", show);
      target.removeEventListener("blur", hide);
      target.removeEventListener("click", toggle);
      tooltip.removeEventListener("mouseleave", hide);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      tooltip.remove();
    }
  };
}
