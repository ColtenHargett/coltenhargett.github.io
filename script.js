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

/* ---------------------------
   Projects rendering (NEW)
---------------------------- */

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTagRow(tags) {
  const safe = (Array.isArray(tags) ? tags : []).slice(0, 6);
  return safe.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
}

function renderFeaturedCard(item) {
  const title = escapeHtml(item.title || "Project");
  const subtitle = escapeHtml(item.subtitle || "");
  const href = item.github_url || "#";
  const tags = renderTagRow(item.tags);

  return `
    <article class="feature reveal tilt">
      <div class="feature-top">
        <p class="feature-k">Featured project</p>
        <h3 class="feature-h">${title}</h3>
        <p class="feature-p">${subtitle}</p>
      </div>

      <div class="feature-row">${tags}</div>

      <div class="feature-actions">
        <a class="btn small mag" href="${href}" target="_blank" rel="noreferrer">See writeup</a>
      </div>
    </article>
  `;
}

function renderProjectCard(p) {
  const title = escapeHtml(p.title || "Project");
  const subtitle = escapeHtml(p.subtitle || "");
  const href = p.github_url || "#";
  const tags = renderTagRow(p.tags);

  return `
    <article class="card tilt">
      <h3 class="h3">${title}</h3>
      <p class="sub">${subtitle}</p>
      <div class="row">
        ${tags}
        <a class="mini mag" href="${href}" target="_blank" rel="noreferrer">View on GitHub</a>
      </div>
    </article>
  `;
}

function renderCollectionDetails(col) {
  const id = escapeHtml(col.id || "collection");
  const title = escapeHtml(col.title || "Collection");
  const subtitle = escapeHtml(col.subtitle || "");
  const icon = escapeHtml(col.icon || "▢");

  const projects = Array.isArray(col.projects) ? col.projects : [];
  const cards = projects.map(renderProjectCard).join("");

  return `
    <details class="folder reveal" id="collection-${id}">
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
          ${cards || `<p class="muted">No projects yet.</p>`}
        </div>
      </div>
    </details>
  `;
}

async function loadProjects() {
  const featuredGrid = document.getElementById("featuredGrid");
  const foldersRoot = document.getElementById("foldersRoot");

  const repoBtnFeatured = document.getElementById("repoBtnFeatured");
  const repoBtnWork = document.getElementById("repoBtnWork");

  if (!featuredGrid || !foldersRoot) return;

  try {
    const res = await fetch("./projects.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`projects.json not found (${res.status})`);
    const data = await res.json();

    const portfolioRepo = data?.meta?.portfolio_repo || "https://github.com/ColtenHargett/portfolio";
    if (repoBtnFeatured) repoBtnFeatured.href = portfolioRepo;
    if (repoBtnWork) repoBtnWork.href = portfolioRepo;

    const featured = Array.isArray(data.featured) ? data.featured : [];
    const collections = Array.isArray(data.collections) ? data.collections : [];

    featuredGrid.innerHTML = featured.map(renderFeaturedCard).join("") || `<p class="muted">No featured projects yet.</p>`;
    foldersRoot.innerHTML = collections.map(renderCollectionDetails).join("") || `<p class="muted">No collections yet.</p>`;

    // Re-bind tilt/magnet behavior for newly injected elements
    tiltCards();
    magneticButtons();
    magneticFolders();

  } catch (err) {
    const msg = escapeHtml(err?.message || String(err));
    featuredGrid.innerHTML = `<p class="muted">Could not load projects.json: ${msg}</p>`;
    foldersRoot.innerHTML = `<p class="muted">Fix: confirm projects.json is in the same folder as index.html.</p>`;
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
  loadProjects();      // NEW
  storyScroll();
});
