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

/* Reveal handling */
let _revealObserver = null;

function revealOnScroll() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length) return;

  if (_revealObserver) _revealObserver.disconnect();

  _revealObserver = new IntersectionObserver((entries) => {
    for (const ent of entries) {
      if (ent.isIntersecting) {
        ent.target.classList.add("show");
        _revealObserver.unobserve(ent.target);
      }
    }
  }, { threshold: 0.14 });

  items.forEach(n => _revealObserver.observe(n));
}

function forceShow(root) {
  if (!root) return;
  root.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));
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
 * Stable Approach scroll logic
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

/**
 * SAFEST POSSIBLE JSON LOADER:
 * - never wipes content unless JSON is successfully parsed
 * - logs useful errors
 */
async function loadProjects() {
  const featuredRoot = document.getElementById("featuredGrid");
  const workRoot = document.getElementById("foldersRoot");

  // If you didn't add these IDs yet, just skip (keeps your HTML)
  if (!featuredRoot || !workRoot) return;

  const featuredBackup = featuredRoot.innerHTML;
  const workBackup = workRoot.innerHTML;

  try {
    const res = await fetch("./projects.json?v=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error(`projects.json fetch failed: ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (!data) throw new Error("projects.json parsed but empty");

    // Expecting:
    // { githubPortfolioUrl, featured: [...], collections: [...] }
    const githubUrl = data.githubPortfolioUrl || "https://github.com/ColtenHargett/portfolio";

    // Render Featured
    if (Array.isArray(data.featured)) {
      featuredRoot.innerHTML = data.featured.map(p => {
        const tags = (p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
        const href = p.url || githubUrl;
        return `
          <article class="feature reveal tilt">
            <div class="feature-top">
              <p class="feature-k">Featured project</p>
              <h3 class="feature-h">${escapeHtml(p.title || "Project")}</h3>
              <p class="feature-p">${escapeHtml(p.description || "")}</p>
            </div>
            <div class="feature-row">${tags}</div>
            <div class="feature-actions">
              <a class="btn small mag" href="${href}" target="_blank" rel="noreferrer">See on GitHub</a>
            </div>
          </article>
        `;
      }).join("");
    }

    // Render Work folders
    if (Array.isArray(data.collections)) {
      workRoot.innerHTML = data.collections.map(col => {
        const items = (col.items || []).map(item => {
          const tags = (item.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
          const link = item.url || githubUrl;
          const bullets = (item.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("");

          return `
            <article class="card tilt">
              <h3 class="h3">${escapeHtml(item.title || "Project")}</h3>
              ${item.sub ? `<p class="sub">${escapeHtml(item.sub)}</p>` : ""}
              ${bullets ? `<ul class="bullets">${bullets}</ul>` : ""}
              <div class="row">
                ${tags}
                <a class="mini mag" href="${link}" target="_blank" rel="noreferrer">View on GitHub</a>
              </div>
            </article>
          `;
        }).join("");

        return `
          <details class="folder reveal" id="${escapeAttr(col.id || "")}">
            <summary class="folder-head">
              <div class="folder-left">
                <span class="folder-icon" aria-hidden="true">${escapeHtml(col.icon || "▢")}</span>
                <div>
                  <p class="folder-title">${escapeHtml(col.title || "Collection")}</p>
                  <p class="folder-sub">${escapeHtml(col.subtitle || "")}</p>
                </div>
              </div>
              <span class="folder-meta" aria-hidden="true"><span class="chev">›</span></span>
            </summary>
            <div class="folder-body">
              <div class="cards">
                ${items}
              </div>
            </div>
          </details>
        `;
      }).join("");
    }

    // Make sure new elements are visible + interactive
    revealOnScroll();
    forceShow(featuredRoot);
    forceShow(workRoot);
    tiltCards();
    magneticButtons();
    magneticFolders();

  } catch (err) {
    console.error("[Portfolio] Failed to load projects.json", err);

    // Restore your old HTML so the page doesn't look empty
    featuredRoot.innerHTML = featuredBackup;
    workRoot.innerHTML = workBackup;

    // Ensure restored content isn't invisible
    forceShow(featuredRoot);
    forceShow(workRoot);
  }
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s) {
  return String(s ?? "").replaceAll('"', "");
}

document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  mobileMenu();
  spotlight();
  topProgress();
  headerBlur();
  parallaxHero();

  // Setup reveal for initial DOM
  revealOnScroll();

  orbMotion();
  tiltCards();
  magneticButtons();
  magneticFolders();
  storyScroll();

  // Load JSON projects (doesn't break page if it fails)
  await loadProjects();
});
