/* Bagas Wicaksono portfolio — editable content and behavior. */

// Add Bagas's confirmed email before launch, for example: "name@domain.com".
// A blank value keeps the contact CTA honest instead of inventing an address.
const CONTACT_EMAIL = "";

// Replace this placeholder with a real CV URL when the document is available.
const CV_URL = "#";

const GITHUB_USERNAME = "bagaslabs";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_CONTRIBUTION_GRAPH_URL = `https://ghchart.rshah.org/86d4c1/${GITHUB_USERNAME}`;
const GRAPH_FALLBACK_TIMEOUT_MS = 4500;
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@bagaswko";

// Illustrative concept entries. Replace descriptions, images, and links with verified project details.
const projects = [
  {
    id: "lua-automation",
    title: "Lua Game Automation Toolkit",
    category: "AUTOMATION / LUA",
    summary: "A concept toolkit for experimenting with repeatable in-game workflows and event-driven scripts.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Gaming workstation with a monitor and keyboard, used as a visual placeholder.",
    tags: ["Lua", "Automation", "Scripting"],
    overview: "A layout concept for documenting a small Lua automation toolkit. It is intended to demonstrate how a real project could explain its goals, constraints, and technical approach.",
    context: "A future verified write-up could describe repetitive workflows, event triggers, and the boundary between useful automation and the rules of a specific game or service.",
    approach: "Organize behavior into small reusable scripts, keep configuration separate from logic, and document assumptions so the system can be tested and maintained.",
    status: "Demo concept"
  },
  {
    id: "pi-hub",
    title: "Raspberry Pi Automation Hub",
    category: "PHYSICAL COMPUTING",
    summary: "A concept for a compact local hub that connects sensors, device state, and simple automation rules.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Close-up of a printed circuit board and electronic components, used as a visual placeholder.",
    tags: ["Go", "Linux", "GPIO"],
    overview: "A conceptual local automation hub for a Raspberry Pi-based setup. Real hardware, supported peripherals, and implementation notes should replace this description before publication.",
    context: "Small connected systems often need a clear place to coordinate events and expose device state without depending on a complex cloud service.",
    approach: "A possible implementation would separate hardware input, rule evaluation, and status reporting into understandable modules.",
    status: "Demo concept"
  },
  {
    id: "sensor-monitor",
    title: "Embedded Sensor Monitor",
    category: "EMBEDDED / IOT",
    summary: "A concept dashboard for viewing sensor readings and checking the health of a microcontroller prototype.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Electronics research setup with a person working at a device, used as a visual placeholder.",
    tags: ["C++", "Arduino", "IoT"],
    overview: "A placeholder concept for presenting telemetry from an Arduino-based sensor experiment. No specific sensor, measurement, or hardware build is claimed here.",
    context: "Raw sensor readings become easier to reason about when values, units, and device status are shown consistently.",
    approach: "A real version could document sampling intervals, error conditions, serial communication, and how values are transferred to a viewer.",
    status: "Demo concept"
  },
  {
    id: "udp-library",
    title: "Lightweight UDP Networking Library",
    category: "NETWORKING / GO",
    summary: "A concept library outline focused on a small API for UDP-based messaging and connection-free communication.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Rows of network and server hardware, used as a visual placeholder.",
    tags: ["Go", "UDP", "Networking"],
    overview: "A conceptual library page for lightweight UDP networking in Go. The title is inspired by a networking-library theme, but this entry is not represented as a verified repository or finished deliverable.",
    context: "A small networking package benefits from a clear interface, predictable error handling, and documentation of the limits of connectionless messaging.",
    approach: "A verified project entry should include an API overview, supported Go version, testing strategy, and a link to the actual repository.",
    status: "Demo concept"
  },
  {
    id: "telemetry-dashboard",
    title: "Hardware Telemetry Dashboard",
    category: "DATA / CONNECTED SYSTEMS",
    summary: "A concept for turning device signals into a readable view of system status and recent measurements.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "A team collaborating around laptops, used as a general software-work placeholder.",
    tags: ["IoT", "Raspberry Pi", "Monitoring"],
    overview: "A visual concept for a monitoring interface that might sit alongside a connected hardware project. It contains no fabricated telemetry or performance data.",
    context: "Hardware projects can be harder to debug when their state is only visible through isolated log messages or indicator lights.",
    approach: "A production write-up could describe the telemetry schema, update cadence, failure states, and how stale or missing readings are displayed.",
    status: "Demo concept"
  }
];

const byId = (id) => document.getElementById(id);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let lastProjectTrigger = null;
let toastTimeout = null;
let motionInitialized = false;

function safeStorageGet(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeStorageSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch { /* Private browsing can block storage. */ }
}

function setTheme(theme, persist = true) {
  const chosenTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = chosenTheme;
  document.documentElement.style.colorScheme = chosenTheme;
  const toggle = byId("theme-toggle");
  if (toggle) {
    const nextLabel = chosenTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    toggle.setAttribute("aria-label", nextLabel);
    toggle.setAttribute("title", nextLabel);
  }
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", chosenTheme === "dark" ? "#111916" : "#f4f5ef");
  if (persist) safeStorageSet("bagas-portfolio-theme", chosenTheme);
}

function showToast(message) {
  const toast = byId("site-toast");
  if (!toast) return;
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add("toast-visible");
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("toast-visible");
    window.setTimeout(() => { toast.hidden = true; }, 200);
  }, 3600);
}

const lucidePathMarkup = {
  "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  x: '<path d="m18 6-12 12"/><path d="m6 6 12 12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.42 1.42"/><path d="m17.65 17.65 1.42 1.42"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.35 17.65-1.42 1.42"/><path d="m19.07 4.93-1.42 1.42"/>',
  moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.463.402.807a6.5 6.5 0 0 0 8.268 8.268c.344-.215.829-.003.803.397Z"/>',
  "file-down": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M12 12v6"/><path d="m9 15 3 3 3-3"/>',
  "users-round": '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M20 8v6"/><path d="M23 11h-6"/><path d="M16 3.5a5 5 0 0 1 0 9.7"/>',
  "chart-no-axes-column": '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  "code-2": '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
  terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
  braces: '<path d="M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2"/><path d="M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  "terminal-square": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 9 3 3-3 3"/><path d="M13 15h4"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><path d="m8.12 8.12 12.76 12.76"/><path d="M14.8 14.8 21 8.6"/><circle cx="6" cy="18" r="3"/><path d="m8.12 15.88 3.5-3.5"/>',
  clapperboard: '<path d="M4 2h16l2 6H2l2-6Z"/><path d="M2 8h20v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="m8 2 2 6"/><path d="m14 2 2 6"/>',
  "figma": '<rect x="5" y="2" width="7" height="7" rx="3.5"/><rect x="12" y="2" width="7" height="7" rx="3.5"/><rect x="5" y="9" width="7" height="7" rx="3.5"/><circle cx="15.5" cy="12.5" r="3.5"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 0 1-7 0Z"/>'
};

function iconMarkup(name, className = "") {
  const paths = lucidePathMarkup[name] || lucidePathMarkup["arrow-up-right"];
  return `<svg class="lucide-icon${className ? ` ${className}` : ""}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function projectArtMarkup(project, context = "card") {
  const safeTitle = String(project.title || "Engineering concept").replace(/[&<>"']/g, "");
  const artId = `${project.id}-${context}`;
  const commonStart = `<svg class="project-art-fallback" viewBox="0 0 720 460" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid-${artId}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#8fb6a2" stroke-opacity=".12" stroke-width="1"/></pattern><linearGradient id="bg-${artId}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#203c30"/><stop offset="1" stop-color="#101b16"/></linearGradient></defs><rect width="720" height="460" fill="url(#bg-${artId})"/><rect width="720" height="460" fill="url(#grid-${artId})"/>`;
  const commonEnd = `<text x="28" y="425" fill="#9bd9c7" font-family="monospace" font-size="12" letter-spacing="2">BAGAS / ENGINEERING STUDIES</text><text x="692" y="425" text-anchor="end" fill="#d6a368" font-family="monospace" font-size="11">DEMO ART</text></svg>`;
  const art = {
    "lua-automation": `<g stroke="#9bd9c7" stroke-width="1.5" fill="none"><rect x="104" y="78" width="512" height="270" rx="8" stroke-opacity=".7"/><path d="M104 115H616" stroke-opacity=".45"/><circle cx="126" cy="96" r="4" fill="#d6a368" stroke="none"/><circle cx="142" cy="96" r="4" fill="#9bd9c7" stroke="none"/><circle cx="158" cy="96" r="4" fill="#6f887a" stroke="none"/><path d="M150 157l18 18-18 18M180 193h66M150 229l18 18-18 18M180 265h124" stroke-linecap="round" stroke-linejoin="round"/><path d="M352 153h197M352 179h154M352 205h176M352 231h133M352 257h165" stroke-opacity=".65" stroke-width="5" stroke-linecap="round"/></g><rect x="494" y="288" width="88" height="30" rx="4" fill="#d6a368" fill-opacity=".14" stroke="#d6a368"/><text x="538" y="307" text-anchor="middle" fill="#d6a368" font-family="monospace" font-size="10">LUA / 01</text>`,
    "pi-hub": `<g transform="translate(188 74)"><rect width="344" height="286" rx="14" fill="#1c4736" stroke="#9bd9c7" stroke-opacity=".8" stroke-width="2"/><rect x="98" y="70" width="145" height="140" rx="7" fill="#101b16" stroke="#9bd9c7" stroke-opacity=".75" stroke-width="2"/><rect x="127" y="99" width="87" height="82" rx="3" fill="#294d3d" stroke="#d6a368" stroke-opacity=".85"/><path d="M18 30H73V70M326 30H270V70M18 256H74V210M326 256H270V210" stroke="#d6a368" stroke-width="3" fill="none"/><g fill="#d6a368">${Array.from({length:10},(_,i)=>`<rect x="${35+i*28}" y="-7" width="9" height="18" rx="2"/>`).join('')}${Array.from({length:10},(_,i)=>`<rect x="${35+i*28}" y="275" width="9" height="18" rx="2"/>`).join('')}</g><g stroke="#9bd9c7" stroke-opacity=".75" stroke-width="2" fill="none"><path d="M72 70V47H105M243 107H278V84H308M98 173H56V206H30M243 197H282V224H311"/><circle cx="105" cy="47" r="4"/><circle cx="308" cy="84" r="4"/><circle cx="30" cy="206" r="4"/><circle cx="311" cy="224" r="4"/></g></g><text x="360" y="406" text-anchor="middle" fill="#eaf0eb" font-family="monospace" font-size="13" letter-spacing="2">LOCAL AUTOMATION HUB</text>`,
    "sensor-monitor": `<g><rect x="95" y="69" width="530" height="300" rx="8" fill="#14251e" stroke="#9bd9c7" stroke-opacity=".65"/><path d="M95 113H625" stroke="#9bd9c7" stroke-opacity=".35"/><g fill="#9bd9c7" font-family="monospace" font-size="11"><text x="120" y="96">SENSOR / LIVE TELEMETRY</text><text x="535" y="96">NODE 04</text></g><g stroke="#8cae9b" stroke-opacity=".25"><path d="M130 160H595M130 207H595M130 254H595M130 301H595M180 145V322M260 145V322M340 145V322M420 145V322M500 145V322M580 145V322"/></g><path d="M130 273L172 271 196 224 229 241 257 184 292 218 326 205 360 254 400 239 431 168 470 185 505 215 545 194 590 198" stroke="#9bd9c7" stroke-width="3" stroke-linejoin="round" fill="none"/><path d="M130 288L170 285 205 294 244 280 280 289 318 282 357 293 398 281 440 287 482 280 521 291 590 281" stroke="#d6a368" stroke-width="1.5" stroke-dasharray="4 6" fill="none"/><circle cx="431" cy="168" r="6" fill="#101b16" stroke="#d6a368" stroke-width="3"/></g><text x="120" y="344" fill="#9bd9c7" font-family="monospace" font-size="10">SIGNAL / CONDITIONING / OUTPUT</text>`,
    "udp-library": `<g stroke="#9bd9c7" stroke-width="2" fill="none"><path d="M157 143H300M420 143H563M180 316H318M402 316H540M236 143V214H318M480 143V214H402M236 316V263H318M480 316V263H402" stroke-opacity=".7"/><rect x="294" y="99" width="132" height="220" rx="8" fill="#14251e"/><path d="M312 130H408M312 158H386M312 186H400M312 214H378M312 242H398M312 270H367" stroke-width="5" stroke-linecap="round" stroke-opacity=".6"/><circle cx="157" cy="143" r="27" fill="#203c30"/><circle cx="563" cy="143" r="27" fill="#203c30"/><circle cx="180" cy="316" r="27" fill="#203c30"/><circle cx="540" cy="316" r="27" fill="#203c30"/></g><g fill="#eaf0eb" font-family="monospace" font-size="11" text-anchor="middle"><text x="157" y="147">A</text><text x="563" y="147">B</text><text x="180" y="320">C</text><text x="540" y="320">D</text></g><text x="360" y="383" text-anchor="middle" fill="#d6a368" font-family="monospace" font-size="13" letter-spacing="3">UDP / PACKETS / ROUTES</text>`,
    "telemetry-dashboard": `<g><rect x="88" y="65" width="544" height="310" rx="7" fill="#15261f" stroke="#9bd9c7" stroke-opacity=".65"/><rect x="88" y="65" width="544" height="44" rx="7" fill="#294d3d"/><path d="M88 109H632" stroke="#9bd9c7" stroke-opacity=".3"/><g fill="#eaf0eb" font-family="monospace" font-size="11"><text x="111" y="92">SYSTEM TELEMETRY</text><text x="566" y="92">LOCAL / DEMO</text></g><g fill="#1d392c" stroke="#8fb6a2" stroke-opacity=".55"><rect x="110" y="130" width="148" height="72" rx="5"/><rect x="271" y="130" width="148" height="72" rx="5"/><rect x="432" y="130" width="178" height="72" rx="5"/><rect x="110" y="218" width="500" height="126" rx="5"/></g><g fill="#9bd9c7" font-family="monospace" font-size="10"><text x="125" y="151">DEVICE STATUS</text><text x="286" y="151">SENSOR INPUT</text><text x="447" y="151">CONNECTION</text></g><g fill="#eaf0eb" font-family="Space Grotesk, sans-serif" font-size="20"><text x="125" y="184">READY</text><text x="286" y="184">ACTIVE</text><text x="447" y="184">LOCAL LINK</text></g><path d="M130 311L164 294 201 303 236 274 274 284 309 262 347 271 382 249 421 266 459 241 499 258 540 235 586 247" stroke="#9bd9c7" stroke-width="2.5" fill="none"/><path d="M130 321H588" stroke="#d6a368" stroke-width="1.5" stroke-dasharray="3 6"/></g>`
  };
  return `${commonStart}${art[project.id] || art["telemetry-dashboard"]}${commonEnd}`;
}

function projectCard(project, featured = false) {
  const tagMarkup = project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("");
  return `
    <button class="project-card relative flex min-w-0 w-full flex-col overflow-hidden bg-surface text-left ${featured ? "project-card-featured md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:min-h-[360px] max-md:min-h-0" : ""}" type="button" data-project-id="${project.id}" aria-haspopup="dialog" aria-label="View details for ${project.title}">
      <span class="project-card-media ${featured ? "project-card-media-featured" : ""}">
        ${projectArtMarkup(project, "card")}
        <img src="${project.image}" alt="${project.imageAlt}" loading="lazy" width="${featured ? 1200 : 720}" height="${featured ? 720 : 520}">
        <span class="project-image-index mono-text font-mono">${featured ? "PROJECT / 01" : `CONCEPT / ${String(projects.indexOf(project) + 1).padStart(2, "0")}`}</span>
        <span class="project-open-icon" aria-hidden="true">${iconMarkup("arrow-up-right")}</span>
      </span>
      <span class="project-card-body">
        <span class="project-card-meta"><span class="project-category mono-text font-mono">${project.category}</span><span class="demo-label">Demo concept</span></span>
        <span class="project-card-title">${project.title}</span>
        <span class="project-card-summary">${project.summary}</span>
        <span class="project-tags">${tagMarkup}</span>
      </span>
    </button>`;
}

function renderProjects() {
  const featuredContainer = byId("featured-projects");
  const gridContainer = byId("project-grid");
  if (!featuredContainer || !gridContainer) return;
  featuredContainer.innerHTML = projects.length ? projectCard(projects[0], true) : "";
  gridContainer.innerHTML = projects.slice(1, 5).map((project) => projectCard(project)).join("");
  refreshIcons();

  document.querySelectorAll(".project-card img").forEach((img) => {
    const showProjectImageFallback = () => {
      const media = img.closest(".project-card-media");
      const project = projects.find((item) => item.id === img.closest("[data-project-id]")?.dataset.projectId);
      if (!media || !project || media.classList.contains("image-failed")) return;
      media.classList.add("image-failed");
      img.remove();
      const artwork = media.querySelector(".project-art-fallback");
      artwork?.setAttribute("aria-hidden", "false");
      artwork?.setAttribute("role", "img");
      artwork?.setAttribute("aria-label", `Illustrative placeholder artwork for ${project.title}`);
    };
    img.addEventListener("error", showProjectImageFallback, { once: true });
    if (img.complete && img.naturalWidth === 0) showProjectImageFallback();
  });
}

function modalContent(project) {
  const tagMarkup = project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("");
  return `
    <div class="dialog-media">${projectArtMarkup(project, "modal")}<img class="w-full" src="${project.image}" alt="${project.imageAlt}" width="1200" height="720"><span class="dialog-media-caption mono-text">${project.category}</span></div>
    <div class="dialog-main">
      <div class="dialog-heading-row"><p class="section-kicker mono-text font-mono">PROJECT DETAILS / ${String(projects.indexOf(project) + 1).padStart(2, "0")}</p><span class="demo-label">${project.status}</span></div>
      <h2 id="dialog-title" class="font-display">${project.title}</h2>
      <p class="dialog-summary">${project.summary}</p>
      <div class="dialog-details-grid grid grid-cols-3 gap-[22px] mt-[34px] pt-[22px] max-md:grid-cols-1 max-md:gap-[19px] max-md:mt-[25px]">
        <section><h3 class="font-display">Overview</h3><p>${project.overview}</p></section>
        <section><h3 class="font-display">Context</h3><p>${project.context}</p></section>
        <section><h3 class="font-display">Approach</h3><p>${project.approach}</p></section>
      </div>
      <div class="dialog-stack"><p class="mono-text font-mono">TECH STACK</p><div class="project-tags">${tagMarkup}</div></div>
      <p class="dialog-disclaimer">This is a replaceable demo concept, not a claim of a completed project. Verified work details and links will replace this content when supplied.</p>
    </div>`;
}

function openProject(projectId, trigger) {
  const project = projects.find((item) => item.id === projectId);
  const dialog = byId("project-dialog");
  const content = byId("dialog-content");
  if (!project || !dialog || !content || typeof dialog.showModal !== "function") {
    if (project) showToast("Project details are unavailable in this browser. Please use an up-to-date browser.");
    return;
  }
  lastProjectTrigger = trigger || document.activeElement;
  content.innerHTML = modalContent(project);
  const dialogImage = content.querySelector(".dialog-media img");
  dialogImage?.addEventListener("error", () => {
    const media = dialogImage.closest(".dialog-media");
    if (media) {
      dialogImage.remove();
      media.classList.add("image-failed");
      const artwork = media.querySelector(".project-art-fallback");
      artwork?.setAttribute("aria-hidden", "false");
      artwork?.setAttribute("role", "img");
      artwork?.setAttribute("aria-label", `Illustrative placeholder artwork for ${project.title}`);
    }
  }, { once: true });
  if (dialogImage?.complete && dialogImage.naturalWidth === 0) {
    dialogImage.dispatchEvent(new Event("error"));
  }
  dialog.showModal();
  document.body.classList.add("dialog-open");
  refreshIcons();
  if (window.gsap && !prefersReducedMotion.matches) {
    window.gsap.fromTo(dialog.querySelector(".dialog-shell"), { y: 12, opacity: 0, scale: 0.99 }, { y: 0, opacity: 1, scale: 1, duration: 0.22, ease: "power2.out", clearProps: "all" });
  }
  byId("dialog-close")?.focus({ preventScroll: true });
}

function closeProjectDialog() {
  const dialog = byId("project-dialog");
  if (!dialog?.open) return;
  dialog.close();
  document.body.classList.remove("dialog-open");
  if (lastProjectTrigger && typeof lastProjectTrigger.focus === "function") {
    lastProjectTrigger.focus({ preventScroll: true });
  }
}

function refreshIcons(useFallback = false) {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.7 } });
    return;
  }
  if (useFallback) {
    document.querySelectorAll("i[data-lucide]").forEach((icon) => {
      const name = icon.getAttribute("data-lucide") || "arrow-up-right";
      const classes = icon.getAttribute("class") || "";
      icon.outerHTML = iconMarkup(name, classes);
    });
  }
}

function configureImages() {
  document.querySelectorAll("[data-github-profile]").forEach((link) => link.setAttribute("href", GITHUB_PROFILE_URL));
  document.querySelectorAll("[data-youtube-channel]").forEach((link) => link.setAttribute("href", YOUTUBE_CHANNEL_URL));
  const profile = byId("profile-photo");
  const fallback = byId("profile-fallback");
  if (profile && fallback) {
    const showPortraitFallback = () => {
      profile.hidden = true;
      fallback.hidden = false;
      fallback.classList.add("portrait-fallback-visible");
    };
    profile.addEventListener("error", showPortraitFallback, { once: true });
    profile.addEventListener("load", () => fallback.classList.remove("portrait-fallback-visible"), { once: true });
    if (profile.complete && profile.naturalWidth === 0) showPortraitFallback();
  }
  const graph = byId("contribution-graph");
  const graphFallback = byId("graph-fallback");
  if (graph && graphFallback) {
    graph.src = GITHUB_CONTRIBUTION_GRAPH_URL;
    const showGraphFallback = () => {
      if (graph.naturalWidth > 0) return;
      graph.hidden = true;
      graphFallback.hidden = false;
      refreshIcons();
    };
    graph.addEventListener("error", showGraphFallback, { once: true });
    graph.addEventListener("load", () => {
      if (graph.naturalWidth > 0) { graph.hidden = false; graphFallback.hidden = true; }
    }, { once: true });
    // Handle failures that occur before listeners are attached and requests that never settle.
    if (graph.complete && graph.naturalWidth === 0) showGraphFallback();
    window.setTimeout(showGraphFallback, GRAPH_FALLBACK_TIMEOUT_MS);
  }
  document.querySelectorAll(".tool-item img").forEach((img) => {
    const icon = img.nextElementSibling;
    img.addEventListener("error", () => {
      img.hidden = true;
      icon?.classList.add("tool-fallback-visible");
    }, { once: true });
    img.addEventListener("load", () => {
      if (img.naturalWidth > 0) icon?.classList.remove("tool-fallback-visible");
    }, { once: true });
    if (img.complete && img.naturalWidth === 0) {
      img.hidden = true;
      icon?.classList.add("tool-fallback-visible");
    }
  });
  document.querySelectorAll(".social-links img").forEach((img) => {
    const showSocialFallback = () => {
      img.hidden = true;
      img.parentElement?.classList.add("social-icon-failed");
    };
    img.addEventListener("error", showSocialFallback, { once: true });
    if (img.complete && img.naturalWidth === 0) showSocialFallback();
  });
}

function configureContactActions() {
  document.querySelectorAll("[data-contact-cta]").forEach((link) => {
    if (CONTACT_EMAIL.trim()) {
      link.setAttribute("href", `mailto:${CONTACT_EMAIL.trim()}`);
    } else {
      link.setAttribute("href", "#contact");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showToast("The contact email has not been configured yet. Add it to CONTACT_EMAIL in app.js before launch.");
      });
    }
  });
  const cvLink = document.querySelector("[data-cv-link]");
  if (cvLink) {
    if (CV_URL && CV_URL !== "#") cvLink.href = CV_URL;
    else cvLink.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("The CV link is a placeholder. Add the confirmed CV URL in app.js before launch.");
    });
  }
}

function configureTheme() {
  const savedTheme = safeStorageGet("bagas-portfolio-theme");
  setTheme(savedTheme === "light" ? "light" : "dark", false);
  byId("theme-toggle")?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
}

function configureMobileNav() {
  const toggle = byId("mobile-menu-toggle");
  const links = byId("nav-links");
  if (!toggle || !links) return;
  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    links.classList.remove("nav-links-open");
    toggle.innerHTML = iconMarkup("menu");
    refreshIcons();
  };
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    links.classList.toggle("nav-links-open", !isOpen);
    toggle.innerHTML = iconMarkup(isOpen ? "menu" : "x");
    refreshIcons();
  });
  links.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  document.addEventListener("click", (event) => {
    if (!links.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
}

function configureDialog() {
  const dialog = byId("project-dialog");
  byId("dialog-close")?.addEventListener("click", closeProjectDialog);
  dialog?.addEventListener("click", (event) => {
    // A click on the dialog canvas (outside its child panel) is a backdrop click.
    if (event.target === dialog) closeProjectDialog();
  });
  dialog?.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (lastProjectTrigger && typeof lastProjectTrigger.focus === "function") lastProjectTrigger.focus({ preventScroll: true });
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project-id]");
    if (trigger) openProject(trigger.dataset.projectId, trigger);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !dialog?.open) return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
}

function configureCurrentYear() {
  const year = byId("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function configureMotion() {
  if (motionInitialized || !window.gsap || prefersReducedMotion.matches) return;
  motionInitialized = true;
  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  gsap.fromTo(".hero-eyebrow, .hero-title, .hero-role, .hero-headline, .hero-bio, .hero-cta-row, .hero-note", { y: 14, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.68, stagger: 0.075, ease: "power2.out", delay: 0.1, clearProps: "transform,opacity"
  });
  gsap.fromTo(".portrait-frame", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.25, ease: "power2.out", clearProps: "transform,opacity" });
  if (window.ScrollTrigger) {
    gsap.fromTo(".signal-trace", { opacity: 0.3, y: 4 }, {
      opacity: 0.9, y: -3, ease: "none", scrollTrigger: { trigger: ".hero-visual", start: "top 75%", end: "bottom 20%", scrub: 0.7 }
    });
  }
  // No repeated fade-up on every section: content remains visible if GSAP/ScrollTrigger fails.
}

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function loadEnhancements() {
  // Load optional UI/motion libraries after the page is interactive. A failed CDN must not block core behavior.
  const [lucideLoaded, gsapLoaded] = await Promise.all([
    loadScript("https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"),
    loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js")
  ]);
  if (lucideLoaded || window.lucide) refreshIcons();
  else refreshIcons(true);
  if (gsapLoaded || window.gsap) {
    await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");
    configureMotion();
  }
}

function init() {
  configureTheme();
  configureMobileNav();
  renderProjects();
  configureDialog();
  configureImages();
  configureContactActions();
  configureCurrentYear();
  refreshIcons();
  configureMotion();
  void loadEnhancements();
  window.setTimeout(() => { if (!window.lucide) refreshIcons(true); }, 1400);
}

document.addEventListener("DOMContentLoaded", init, { once: true });
