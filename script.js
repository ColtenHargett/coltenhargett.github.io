function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

/* -----------------------------
   Small utilities
----------------------------- */
function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isFilePath(p) {
  // Treat anything with an extension as a file (works well for your repo)
  return /\.[a-z0-9]+$/i.test(String(p || "").trim());
}

function githubLink(repoUrl, path) {
  if (!repoUrl) return "#";
  const cleanRepo = repoUrl.replace(/\/$/, "");
  if (!path) return cleanRepo;

  const cleanPath = String(path).replace(/^\/+/, "");
  const kind = isFilePath(cleanPath) ? "blob" : "tree";

  // encodeURI keeps slashes, encodes spaces -> %20
  return `${cleanRepo}/${kind}/main/${encodeURI(cleanPath)}`;
}

/* -----------------------------
   Footer year
----------------------------- */
function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/* -----------------------------
   Mobile menu
----------------------------- */
function mobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const opening = menu.hasAttribute("hidden");
    if (opening) menu.removeAttribute("hidden");
    else menu.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", String(opening));
  });

  menu.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains("m-link")) {
      menu.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

/* -----------------------------
   Spotlight
----------------------------- */
function spotlight() {
  const el = document.getElementById("spotlight");
  if (!el) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  let raf = 0;
  window.addEventListener("mousemove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      el.style.setProperty("--x", `${x}%`);
      el.style.setProperty("--y", `${y}%`);
      raf = 0;
    });
  });
}

/* -----------------------------
   Top scroll progress bar
----------------------------- */
function topProgress() {
  const bar = document.getElementById("topProgress");
  if (!bar) return;

  function tick() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? clamp(scrollTop / docH, 0, 1) : 0;
    bar.style.width = `${Math.round(p * 100)}%`;
  }

  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
  tick();
}

/* -----------------------------
   Header blur on scroll
----------------------------- */
function headerBlur() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  function tick() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", tick, { passive: true });
  tick();
}

/* -----------------------------
   Hero parallax
----------------------------- */
function parallaxHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  let raf = 0;
  function tick() {
    raf = 0;
    const y = window.scrollY * 0.12;
    hero.style.setProperty("--heroParallax", `${y}px`);
  }

  window.addEventListener(
    "scroll",
    () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    },
    { passive: true }
  );

  tick();
}

/* -----------------------------
   Reveal on scroll
----------------------------- */
function revealOnScroll() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const ent of entries) {
        if (ent.isIntersecting) {
          ent.target.classList.add("show");
          io.unobserve(ent.target);
        }
      }
    },
    { threshold: 0.14 }
  );

  items.forEach((n) => io.observe(n));
}

/* -----------------------------
   Orb motion
----------------------------- */
function orbMotion() {
  const orb = document.getElementById("orb");
  if (!orb) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  let raf = 0;

  window.addEventListener("mousemove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const r = orb.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const dx = clamp((e.clientX - cx) / r.width, -0.65, 0.65);
      const dy = clamp((e.clientY - cy) / r.height, -0.65, 0.65);

      const rx = (-dy * 14).toFixed(2);
      const ry = (dx * 16).toFixed(2);
      orb.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;

      const mx = ((dx + 0.65) / 1.3) * 100;
      const my = ((dy + 0.65) / 1.3) * 100;
      orb.style.setProperty("--mx", `${mx}%`);
      orb.style.setProperty("--my", `${my}%`);

      raf = 0;
    });
  });

  window.addEventListener("mouseleave", () => {
    orb.style.transform = "";
  });
}

/* -----------------------------
   Tilt cards
----------------------------- */
function tiltCards() {
  const cards = document.querySelectorAll(".tilt");
  if (!cards.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  function onMove(e) {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * 6;
    const ry = (x - 0.5) * 8;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  }

  function onLeave(e) {
    e.currentTarget.style.transform = "";
  }

  cards.forEach((c) => {
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
  });
}

/* -----------------------------
   Magnetic buttons (subtle)
----------------------------- */
function magneticButtons() {
  const els = document.querySelectorAll(".mag");
  if (!els.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  els.forEach((el) => {
    let raf = 0;
    el.addEventListener("mousemove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        const mx = (x / r.width) * 10;
        const my = (y / r.height) * 10;
        el.style.transform = `translate(${mx}px, ${my}px)`;
        raf = 0;
      });
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

/* -----------------------------
   Magnetic folders
----------------------------- */
function magneticFolders() {
  const els = document.querySelectorAll(".folder");
  if (!els.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  els.forEach((el) => {
    let raf = 0;
    el.addEventListener("mousemove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / 22;
        const y = (e.clientY - r.top - r.height / 2) / 22;
        el.style.transform = `translate(${x}px, ${y}px) scale(1.01)`;
        raf = 0;
      });
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

/* -----------------------------
   Stable Approach scroll logic
   - Progress starts at first tick
   - No early cycling before visible
----------------------------- */
function storyScroll() {
  const stepsWrap = document.getElementById("storySteps");
  const steps = Array.from(document.querySelectorAll("#storySteps .step"));

  const bar = document.getElementById("progressBar");
  const kicker = document.getElementById("stageKicker");
  const title = document.getElementById("stageTitle");
  const body = document.getElementById("stageBody");
  const stage = document.getElementById("storyStage");

  if (!stepsWrap || !steps.length || !bar || !kicker || !title || !body || !stage) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const minPct = Math.round((1 / steps.length) * 100);
  let activeIdx = 0;

  function decisionY() {
    return window.innerHeight * 0.42;
  }

  function enabled() {
    const r = stepsWrap.getBoundingClientRect();
    return r.top < window.innerHeight * 0.65 && r.bottom > window.innerHeight * 0.35;
  }

  function apply(idx, animate) {
    const el = steps[idx];
    if (!el) return;

    kicker.textContent = el.dataset.kicker || "Approach";
    title.textContent = el.dataset.title || "—";
    body.textContent = el.dataset.body || "—";

    const pct = Math.max(minPct, Math.round(((idx + 1) / steps.length) * 100));
    bar.style.width = `${pct}%`;

    if (animate && !reduce) {
      stage.animate(
        [{ transform: "translateY(0px)" }, { transform: "translateY(-2px)" }, { transform: "translateY(0px)" }],
        { duration: 220, easing: "ease-out" }
      );
    }
  }

  // Start on first tick
  apply(0, false);

  let raf = 0;

  function tick() {
    raf = 0;
    if (!enabled()) return;

    const y = decisionY();

    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < steps.length; i++) {
      const r = steps[i].getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < window.innerHeight;
      if (!visible) continue;

      const anchor = r.top + Math.min(36, r.height * 0.25);
      const dist = Math.abs(anchor - y);

      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    if (bestIdx !== activeIdx) {
      activeIdx = bestIdx;
      apply(activeIdx, true);
    }
  }

  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  tick();
}

/* -----------------------------
   Projects loader + render
   - Populates Featured + Work folders from projects.json
   - Links go directly to file/folder inside repo using path
----------------------------- */
function pickPath(obj) {
  // Accept a few common key names so you don't have to fight JSON formatting
  return obj?.path || obj?.repoPath || obj?.folder || obj?.file || obj?.projectPath || "";
}
async function loadProjects() {
  const featuredGrid = document.getElementById("featuredGrid");
  const foldersRoot = document.getElementById("foldersRoot");

  // If your HTML doesn’t have these containers, don’t crash the page
  if (!featuredGrid && !foldersRoot) return;

  try {
    // cache-bust so updates show immediately
    const res = await fetch(`./projects.json?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`projects.json fetch failed: ${res.status}`);
    const data = await res.json();

    const githubUrl = data.githubPortfolioUrl || "https://github.com/ColtenHargett/portfolio";

    /* ----- Featured ----- */
    if (featuredGrid) {
      const featured = Array.isArray(data.featured) ? data.featured : [];
      featuredGrid.innerHTML = "";

      for (const p of featured) {
        const title = escapeHtml(p.title || "Project");
        const desc = escapeHtml(p.description || "");
        const tags = Array.isArray(p.tags) ? p.tags : [];
        const pPath = pickPath(p);
         const href = p.url || githubLink(githubUrl, pPath);
         if (!p.url && !pPath) console.warn("[Featured missing path/url]", p);

        const tagHtml = tags
          .slice(0, 6)
          .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
          .join("");

        // One button only: "See writeup" (links to GitHub)
        const card = document.createElement("article");
        card.className = "feature reveal tilt";
        card.innerHTML = `
          <div class="feature-top">
            <p class="feature-k">Featured project</p>
            <h3 class="feature-h">${title}</h3>
            <p class="feature-p">${desc}</p>
          </div>

          <div class="feature-row">
            ${tagHtml}
          </div>

          <div class="feature-actions">
            <a class="btn small mag" href="${href}" target="_blank" rel="noreferrer">See writeup</a>
          </div>
        `;
        featuredGrid.appendChild(card);
      }
    }

    /* ----- Work folders ----- */
    if (foldersRoot) {
      const collections = Array.isArray(data.collections) ? data.collections : [];
      foldersRoot.innerHTML = "";

      for (const col of collections) {
        const colId = escapeHtml(col.id || "");
        const icon = escapeHtml(col.icon || "▢");
        const title = escapeHtml(col.title || "Collection");
        const subtitle = escapeHtml(col.subtitle || "");
        const items = Array.isArray(col.items) ? col.items : [];

        const details = document.createElement("details");
        details.className = "folder reveal";
        if (colId) details.id = colId;

        // Build cards inside
        const cardsHtml = items
          .map((item) => {
            const itTitle = escapeHtml(item.title || "Project");
            const itSub = escapeHtml(item.sub || "");
            const itTags = Array.isArray(item.tags) ? item.tags : [];
            const itPath = pickPath(item); 
             const itHref = item.url || githubLink(githubUrl, itPath); 
             if (!item.url && !itPath) console.warn("[Item missing path/url]", item);

            const tagsHtml = itTags
              .slice(0, 6)
              .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
              .join("");

            return `
              <article class="card tilt">
                <h3 class="h3">${itTitle}</h3>
                <p class="sub">${itSub}</p>
                <div class="row">
                  ${tagsHtml}
                  <a class="mini mag" href="${itHref}" target="_blank" rel="noreferrer">See on GitHub</a>
                </div>
              </article>
            `;
          })
          .join("");

        details.innerHTML = `
          <summary class="folder-head">
            <div class="folder-left">
              <span class="folder-icon" aria-hidden="true">${icon}</span>
              <div>
                <p class="folder-title">${title}</p>
                <p class="folder-sub">${subtitle}</p>
              </div>
            </div>
            <span class="folder-meta" aria-hidden="true"><span class="chev">›</span></span>
          </summary>

          <div class="folder-body">
            <div class="cards">
              ${cardsHtml || `<p class="muted">No projects listed yet.</p>`}
            </div>
          </div>
        `;

        foldersRoot.appendChild(details);
      }
    }

    // Re-run reveal observers for newly injected nodes
    revealOnScroll();

    // Re-attach tilt/magnetic effects to newly injected nodes
    tiltCards();
    magneticButtons();
    magneticFolders();
  } catch (err) {
    // Fail gracefully (don’t blank the page)
    console.error(err);
  }
}

/* -----------------------------
   Boot
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  mobileMenu();
  spotlight();
  topProgress();
  headerBlur();
  parallaxHero();
  revealOnScroll();
  orbMotion();
  tiltCards();
  magneticButtons();
  magneticFolders();
  storyScroll();
  loadProjects();
});
