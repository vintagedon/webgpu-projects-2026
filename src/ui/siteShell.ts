import { createTooltip } from "./tooltip";
import type { SFXManager } from "./sfx";

export function createSiteShell(content: HTMLElement, sfx: SFXManager): HTMLElement {
  const shell = document.createElement("div");
  shell.className = "site-shell";

  const main = document.createElement("main");
  main.className = "site-main";
  main.append(content);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-left">
        <span>(c) 2026 <button class="author-trigger" type="button">Don Fountain</button></span>
        <button class="speaker-toggle btn-neon" type="button" aria-label="Toggle interface sounds"></button>
      </div>
      <nav class="footer-links" aria-label="External links">
        <a class="footer-link" href="https://github.com/vintagedon" rel="noreferrer" target="_blank">
          <span aria-hidden="true">GH</span><span>VintageDon</span>
        </a>
        <a class="footer-link" href="https://github.com/radioastronomyio" rel="noreferrer" target="_blank">
          <span aria-hidden="true">RA</span><span>RadioAstronomy.io</span>
        </a>
        <a class="footer-link" href="https://substack.com/@donfountain" rel="noreferrer" target="_blank">
          <span aria-hidden="true">SS</span><span>Substack</span>
        </a>
      </nav>
    </div>
  `;

  const author = footer.querySelector<HTMLElement>(".author-trigger");
  if (author) {
    createTooltip({
      target: author,
      options: { interactive: true, className: "panel-dialogue" },
      content: `
        <div class="about-tooltip">
          <div class="avatar-placeholder" aria-hidden="true">DF</div>
          <div>
            <p>Infrastructure engineer and builder. WebGPU, simulation, and creative coding.</p>
            <a class="footer-link" href="https://substack.com/@donfountain" rel="noreferrer" target="_blank">Read on Substack</a>
          </div>
        </div>
      `
    });
  }

  const speaker = footer.querySelector<HTMLButtonElement>(".speaker-toggle");
  const syncSpeaker = (): void => {
    if (!speaker) {
      return;
    }

    speaker.textContent = sfx.isMuted() ? "Muted" : "SFX";
    speaker.classList.toggle("btn-ghost", sfx.isMuted());
    speaker.classList.toggle("btn-neon", !sfx.isMuted());
  };

  if (speaker) {
    syncSpeaker();
    speaker.addEventListener("click", () => {
      if (sfx.isMuted()) {
        sfx.unmute();
        sfx.play("toggle");
      } else {
        sfx.play("toggle");
        sfx.mute();
      }
      syncSpeaker();
    });
  }

  shell.append(main, footer);
  return shell;
}
