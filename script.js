function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

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

function headerBlur() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  function tick() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", tick, { passive: true });
  tick();
}

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

  window.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(tick);
  }, { passive: true });

  tick();
}

function revealOnScroll() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const ent of entries) {
      if (ent.isIntersecting) {
        ent.target.classList.add("show");
        io.unobserve(ent.target);
      }
    }
  }, { threshold: 0.14 });

  items.forEach(n => io.observe(n));
}

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

  cards.forEach(c => {
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
  });
}

function magneticButtons() {
  const els = document.querySelectorAll(".mag");
  if (!els.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  els.forEach(el => {
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

function magneticFolders() {
  const els = document.querySelectorAll(".folder");
  if (!els.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  els.forEach(el => {
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

/**
 * Stable Approach scroll logic (no observers fighting)
 * Progress bar starts at first tick automatically.
 */
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

/* ============================================================
   Projects rendering (projects.json → Featured + Work folders)
   ============================================================ */

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(str) {
  return String(str ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function joinUrl(base, path) {
  if (!base) return path || "";
  if (!path) return base;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${b}/${p}`;
}

function setRepoButtons(repoBase) {
  const a = document.getElementById("repoBtnFeatured");
  const b = document.getElementById("repoBtnWork");
  if (a && repoBase) a.href = repoBase;
  if (b && repoBase) b.href = repoBase;
}

function renderFeatured(featured, repoBase) {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;

  if (!Array.isArray(featured) || featured.length === 0) {
    grid.innerHTML = `<p class="muted">No featured projects yet.</p>`;
    return;
  }

  grid.innerHTML = featured.map((p) => {
    const title = escapeHtml(p.title);
    const desc = escapeHtml(p.description || "");
    const tags = Array.isArray(p.tags) ? p.tags.slice(0, 6) : [];
    const url = p.url ? p.url : (p.path ? joinUrl(repoBase, p.path) : repoBase);

    const ctaText = escapeHtml(p.ctaText || "Open on GitHub");
    const ctaHref = escapeHtml(url || repoBase || "#");

    const writeupHref = p.anchor ? `#${escapeHtml(p.anchor)}` : "#work";

    return `
      <article class="feature reveal tilt">
        <div class="feature-top">
          <p class="feature-k">Featured project</p>
          <h3 class="feature-h">${title}</h3>
          <p class="feature-p">${desc}</p>
        </div>

        <div class="feature-row">
          ${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
        </div>

        <div class="feature-actions">
          <a class="btn small mag" href="${writeupHref}">See details</a>
          <a class="btn small ghost mag" href="${ctaHref}" target="_blank" rel="noreferrer">${ctaText}</a>
        </div>
      </article>
    `;
  }).join("");
}

function renderWorkCollections(collections, repoBase) {
  const root = document.getElementById("foldersRoot");
  if (!root) return;

  if (!Array.isArray(collections) || collections.length === 0) {
    root.innerHTML = `<p class="muted">No projects yet.</p>`;
    return;
  }

  root.innerHTML = collections.map((col) => {
    const colTitle = escapeHtml(col.title);
    const colSubtitle = escapeHtml(col.subtitle || "");
    const colIcon = escapeHtml(col.icon || "▢");

    const colId = col.id ? String(col.id) : `collection-${slugify(colTitle)}`;

    const items = Array.isArray(col.items) ? col.items : [];

    const cardsHtml = items.map((p) => {
      const title = escapeHtml(p.title);
      const sub = escapeHtml(p.subtitle || p.description || "");
      const bullets = Array.isArray(p.bullets) ? p.bullets.slice(0, 4) : [];
      const tags = Array.isArray(p.tags) ? p.tags.slice(0, 6) : [];

      const url = p.url ? p.url : (p.path ? joinUrl(repoBase, p.path) : repoBase);
      const linkText = escapeHtml(p.linkText || "View on GitHub");
      const linkHref = escapeHtml(url || repoBase || "#");

      return `
        <article class="card tilt">
          <h3 class="h3">${title}</h3>
          ${sub ? `<p class="sub">${sub}</p>` : ``}

          ${bullets.length ? `
            <ul class="bullets">
              ${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          ` : ``}

          <div class="row">
            ${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
            ${url ? `<a class="mini mag" href="${linkHref}" target="_blank" rel="noreferrer">${linkText}</a>` : ``}
          </div>
        </article>
      `;
    }).join("");

    const openByDefault = col.open === true ? " open" : "";

    return `
      <details class="folder reveal" id="${escapeHtml(colId)}"${openByDefault}>
        <summary class="folder-head">
          <div class="folder-left">
            <span class="folder-icon" aria-hidden="true">${colIcon}</span>
            <div>
              <p class="folder-title">${colTitle}</p>
              <p class="folder-sub">${colSubtitle}</p>
            </div>
          </div>
          <span class="folder-meta" aria-hidden="true"><span class="chev">›</span></span>
        </summary>

        <div class="folder-body">
          <div class="cards">
            ${cardsHtml || `<p class="muted">No items yet.</p>`}
          </div>
        </div>
      </details>
    `;
  }).join("");
}

async function loadProjects() {
  // If these containers aren't on the page, just skip quietly.
  const featuredGrid = document.getElementById("featuredGrid");
  const foldersRoot = document.getElementById("foldersRoot");
  if (!featuredGrid && !foldersRoot) return;

  try {
    const res = await fetch("./projects.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`projects.json HTTP ${res.status}`);
    const data = await res.json();

    const repoBase = data.repoBase || data.repo || data.repository || "";
    setRepoButtons(repoBase);

    // Render
    renderFeatured(data.featured, repoBase);
    renderWorkCollections(data.collections, repoBase);

    // Re-run behaviors for injected elements
    revealOnScroll();
    tiltCards();
    magneticButtons();
    magneticFolders();
  } catch (err) {
    // Fail gracefully (don't break the rest of the site)
    if (featuredGrid) {
      featuredGrid.innerHTML = `<p class="muted">Could not load projects.</p>`;
    }
    if (foldersRoot) {
      foldersRoot.innerHTML = `<p class="muted">Could not load projects.</p>`;
    }
    // Uncomment for debugging:
    // console.error(err);
  }
}

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
