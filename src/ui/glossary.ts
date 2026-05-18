import glossary from "../assets/data/glossary.json";
import { createTooltip } from "./tooltip";

const definitions: Record<string, string> = glossary;

export function initGlossary(containerEl: HTMLElement): void {
  const terms = containerEl.querySelectorAll<HTMLElement>("[data-glossary]");

  for (const term of terms) {
    const key = term.dataset.glossary ?? term.textContent?.trim() ?? "";
    const definition = definitions[key];

    if (!definition) {
      continue;
    }

    term.classList.add("glossary-term");
    term.tabIndex = 0;
    createTooltip({
      target: term,
      content: `<strong>${key}</strong><br>${definition}`
    });
  }
}
