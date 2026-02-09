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

/* ----------------------------
   LIVING CODE LENS (ORB REPLACEMENT)
---------------------------- */
function livingCodeLens() {
  const lens = document.getElementById("lens");
  const canvas = document.getElementById("lensCanvas");
  if (!lens || !canvas) return;

  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const lines = [
    "for symbol in market:",
    "  raw = fetch(symbol)",
    "  if invalid(raw): continue",
    "  data = normalize(raw)",
    "  signal = score(data)",
    "  emit(symbol, signal)",
    "",
    "agent = build_pipeline()",
    "news = scrape(sources)",
    "summary = synthesize(news)",
    "store(summary)"
  ];

  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const size = 520;
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  let mx = 0.5, my = 0.5;
  let drift = 0;
  let t = 0;

  let rafMove = 0;
  window.addEventListener("mousemove", (e) => {
    if (rafMove) return;
    rafMove = requestAnimationFrame(() => {
      const r = lens.getBoundingClientRect();
      mx = clamp((e.clientX - r.left) / r.width, 0, 1);
      my = clamp((e.clientY - r.top) / r.height, 0, 1);
      lens.style.setProperty("--lx", `${mx * 100}%`);
      lens.style.setProperty("--ly", `${my * 100}%`);
      rafMove = 0;
    });
  });

  function draw() {
    const W = 520, H = 520;
    ctx.clearRect(0, 0, W, H);

    // soft paper wash
    ctx.fillStyle = "rgba(255,255,255,0.40)";
    ctx.fillRect(0, 0, W, H);

    // subtle scanlines
    ctx.fillStyle = "rgba(11,12,15,0.03)";
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);

    ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.textBaseline = "top";

    const pullX = (mx - 0.5) * 22;
    const pullY = (my - 0.5) * 22;

    const baseX = 92 + pullX;
    const baseY = 118 + pullY + drift;

    for (let i = 0; i < lines.length; i++) {
      const y = baseY + i * 18;
      if (y < 60 || y > H - 60) continue;

      const tint = (i % 2 === 0)
        ? "rgba(109,94,252,0.32)"
        : "rgba(0,194,168,0.28)";

      ctx.fillStyle = tint;
      ctx.fillText(lines[i], baseX, y);
    }
  }

  function tick() {
    if (!reduce) {
      t += 0.01;
      const float = Math.sin(t) * 9;
      const scroll = window.scrollY || 0;
      drift = (scroll * 0.03) + float;
    } else {
      drift = 0;
    }

    draw();
    requestAnimationFrame(tick);
  }

  tick();
}

/* ----------------------------
   PROJECTS.JSON RENDERING
---------------------------- */
function safeJoinUrl(base, path) {
  const cleanBase = String(base || "").replace(/\/+$/, "");
  const cleanPath = String(path || "").replace(/^\/+/, "");
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
}

function ensureTreePath(path) {
  // Supports folder paths like "AI/News Summary Agent/" and files like "Python/Hangman.py"
  // Always returns ".../tree/main/<path>" (works for files too in GitHub UI).
  const base = "https://github.com/ColtenHargett/portfolio/tree/main";
  return safeJoinUrl(base, encodeURI(path));
}

function tagHtml(tags) {
  if (!tags || !tags.length) return "";
  return tags.map(t => `<span class="tag">${t}</span>`).join("");
}

function renderFeatured(featured) {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;

  grid.innerHTML = featured.map(p => {
    const href = ensureTreePath(p.path);
    return `
      <article class="feature reveal tilt">
        <div class="feature-top">
          <p class="feature-k">Featured project</p>
          <h3 class="feature-h">${p.title}</h3>
          <p class="feature-p">${p.description || ""}</p>
        </div>

        <div class="feature-row">
          ${tagHtml(p.tags)}
        </div>

        <div class="feature-actions">
          <a class="btn small mag" href="${href}" target="_blank" rel="noreferrer">See on GitHub</a>
        </div>
      </article>
    `;
  }).join("");
}

function renderCollections(collections) {
  const holder = document.getElementById("folders");
  if (!holder) return;

  holder.innerHTML = collections.map(col => {
    const itemsHtml = (col.items || []).map(item => {
      const href = ensureTreePath(item.path);
      return `
        <article class="card tilt">
          <h3 class="h3">${item.title}</h3>
          <p class="sub">${item.sub || ""}</p>

          <div class="row">
            ${tagHtml(item.tags)}
            <a class="mini mag" href="${href}" target="_blank" rel="noreferrer">See on GitHub</a>
          </div>
        </article>
      `;
    }).join("");

    return `
      <details class="folder reveal" id="${col.id}">
        <summary class="folder-head">
          <div class="folder-left">
            <span class="folder-icon" aria-hidden="true">${col.icon || "▢"}</span>
            <div>
              <p class="folder-title">${col.title}</p>
              <p class="folder-sub">${col.subtitle || ""}</p>
            </div>
          </div>
          <span class="folder-meta" aria-hidden="true"><span class="chev">›</span></span>
        </summary>

        <div class="folder-body">
          <div class="cards">
            ${itemsHtml}
          </div>
        </div>
      </details>
    `;
  }).join("");
}

async function loadProjects() {
  try {
    const res = await fetch("./projects.json?v=6", { cache: "no-store" });
    if (!res.ok) throw new Error(`projects.json not found (${res.status})`);
    const data = await res.json();

    if (data.featured) renderFeatured(data.featured);
    if (data.collections) renderCollections(data.collections);

    // Re-hook effects after injecting DOM
    revealOnScroll();
    tiltCards();
    magneticButtons();
    magneticFolders();
  } catch (e) {
    // fail soft (don't break page)
    console.warn("Failed to load projects.json:", e);
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
  tiltCards();
  magneticButtons();
  magneticFolders();
  storyScroll();

  livingCodeLens();
  loadProjects();
});
