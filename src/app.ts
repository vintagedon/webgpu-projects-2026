import "./assets/css/index.css";
import { createLandingPage } from "./pages/landing";
import { createSiteShell } from "./ui/siteShell";
import { createSFXManager } from "./ui/sfx";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("Application root was not found.");
}

const sfx = createSFXManager();
const page = createLandingPage(sfx);
root.append(createSiteShell(page, sfx));
