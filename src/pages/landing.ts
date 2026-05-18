import { initGlossary } from "../ui/glossary";
import { createWelcomeModal } from "../ui/modal";
import type { SFXManager } from "../ui/sfx";

interface ProjectCard {
  name: string;
  description: string;
  tags: string[];
  href: string;
}

const cards: ProjectCard[] = [
  {
    name: "GPU Particle Playground",
    description: "A high-count particle field proving the shared compute harness and neon telemetry surface.",
    tags: ["WebGPU", "Storage Buffer", "WGSL"],
    href: "/particles/"
  },
  {
    name: "Food Coloring Sim",
    description: "Drops of dye fall, diffuse, mix, and settle through a water-like compute texture system.",
    tags: ["Compute Shader", "Textures", "Advection"],
    href: "/food-coloring/"
  },
  {
    name: "Chladni Patterns",
    description: "Audio-driven standing waves push sand particles into nodal patterns on a vibrating plate.",
    tags: ["Web Audio", "Dispatch", "Particles"],
    href: "/chladni/"
  },
  {
    name: "Missile Command",
    description: "A raymarched arcade scene with searchlights, bloom trails, clouds, and a city silhouette.",
    tags: ["Raymarching", "SDF", "Bloom"],
    href: "/missile-command/"
  },
  {
    name: "Chromalife",
    description: "An artificial life sandbox where color, glow, trails, and pulse become inherited phenotypes.",
    tags: ["Simulation", "Instancing", "Ping-Pong"],
    href: "/chromalife/"
  }
];

export function createLandingPage(sfx: SFXManager): HTMLElement {
  const page = document.createElement("div");
  page.innerHTML = `
    <section class="hero panel panel-main">
      <span class="chip status-chip--blue">WebGPU Portfolio</span>
      <h1>donfather.dev</h1>
      <p>
        GPU compute, simulation, and creative coding with raw
        <button type="button" data-glossary="WebGPU">WebGPU</button>,
        <button type="button" data-glossary="WGSL">WGSL</button>, and instrumented browser demos.
      </p>
    </section>
    <section class="gallery-grid" aria-label="Project gallery"></section>
  `;

  const gallery = page.querySelector<HTMLElement>(".gallery-grid");
  if (!gallery) {
    throw new Error("Landing page gallery failed to render.");
  }

  for (const card of cards) {
    const link = document.createElement("a");
    link.className = "project-card panel";
    link.href = card.href;
    link.innerHTML = `
      <h2>${card.name}</h2>
      <p>${card.description}</p>
      <div class="tag-row">
        ${card.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
      </div>
    `;
    link.addEventListener("mouseenter", () => sfx.play("hover"));
    link.addEventListener("click", () => sfx.play("click"));
    gallery.append(link);
  }

  initGlossary(page);

  const modal = createWelcomeModal({
    title: "donfather.dev",
    badge: "GPU",
    storageKey: `donfather:welcome:${location.pathname}`,
    sfx,
    content:
      "<p>This gallery collects browser-native GPU simulations, rendering experiments, and creative coding systems. Start with the project cards, then follow each demo as it comes online.</p>",
    actions: [
      {
        label: "Start Exploring",
        style: "primary"
      }
    ]
  });

  window.setTimeout(() => modal.show(), 250);
  return page;
}
