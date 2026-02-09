function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

/* -----------------------------
   Utilities
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
  return /\.[a-z0-9]+$/i.test(String(p || "").trim());
}

function githubLink(repoUrl, path) {
  if (!repoUrl) return "#";
  const cleanRepo = repoUrl.replace(/\/$/, "");
  if (!path) return cleanRepo;

  const cleanPath = String(path).replace(/^\/+/, "");
  const kind = isFilePath(cleanPath) ? "blob" : "tree";
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
   Top progress bar
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

  window.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(tick);
  }, { passive: true });

  tick();
}

/* -----------------------------
   Reveal on scroll
----------------------------- */
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

  cards.forEach(c => {
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
  });
}

/* -----------------------------
   Magnetic buttons
----------------------------- */
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

/* -----------------------------
   Magnetic folders
----------------------------- */
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

/* -----------------------------
   Stable Approach scroll logic
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
----------------------------- */
async function loadProjects() {
  const featuredGrid = document.getElementById("featuredGrid");
  const foldersRoot = document.getElementById("foldersRoot");
  if (!featuredGrid && !foldersRoot) return;

  try {
    const res = await fetch(`./projects.json?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`projects.json fetch failed: ${res.status}`);
    const data = await res.json();

    const githubUrl = data.githubPortfolioUrl || "https://github.com/ColtenHargett/portfolio";

    /* Featured */
    if (featuredGrid) {
      const featured = Array.isArray(data.featured) ? data.featured : [];
      featuredGrid.innerHTML = "";

      for (const p of featured) {
        const title = escapeHtml(p.title || "Project");
        const desc = escapeHtml(p.description || "");
        const tags = Array.isArray(p.tags) ? p.tags : [];
        const href = p.url || githubLink(githubUrl, p.path);

        if (!p.url && !p.path) console.warn("[Featured missing path/url]", p);

        const tagHtml = tags.slice(0, 6)
          .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
          .join("");

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

    /* Work / Collections */
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

        const cardsHtml = items.map((item) => {
          const itTitle = escapeHtml(item.title || "Project");
          const itSub = escapeHtml(item.sub || "");
          const itTags = Array.isArray(item.tags) ? item.tags : [];
          const itHref = item.url || githubLink(githubUrl, item.path);

          if (!item.url && !item.path) console.warn("[Item missing path/url]", item);

          const tagsHtml = itTags.slice(0, 6)
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
        }).join("");

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

    // Re-run effects for injected DOM
    revealOnScroll();
    tiltCards();
    magneticButtons();
    magneticFolders();

  } catch (err) {
    console.error(err);
  }
}

/* -----------------------------
   Living Code Canvas (Option 1)
----------------------------- */
function codeCanvas() {
  const canvas = document.getElementById("codeCanvas");
  const shell = document.getElementById("codeShell");
  if (!canvas || !shell) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(r.width * dpr);
    canvas.height = Math.floor(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const lines = [
    "def normalize(data):",
    "return clean(data)",
    "for symbol in market:",
    "score = model(x)",
    "if invalid: continue",
    "parse → validate → emit",
    "state = next(state)",
    "O(n) scan, low memory",
    "defensive by default",
    "predictable outputs",
    "agent.run(context)",
    "summarize(changes)"
  ];

  const fragments = [];
  const fragCount = reduce ? 0 : 22;

  function rand(min, max) { return min + Math.random() * (max - min); }

  function seed() {
    fragments.length = 0;
    if (reduce) return;

    const r = canvas.getBoundingClientRect();
    for (let i = 0; i < fragCount; i++) {
      fragments.push({
        text: lines[i % lines.length],
        x: rand(40, r.width - 40),
        y: rand(50, r.height - 50),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.10, 0.10),
        size: rand(11, 13.5),
        alpha: rand(0.10, 0.22),
        phase: rand(0, Math.PI * 2)
      });
    }
  }

  let mouse = { x: 0.5, y: 0.45, active: false };
  let raf = 0;

  shell.addEventListener("mousemove", (e) => {
    mouse.active = true;
    const r = shell.getBoundingClientRect();
    mouse.x = clamp((e.clientX - r.left) / r.width, 0, 1);
    mouse.y = clamp((e.clientY - r.top) / r.height, 0, 1);

    const mx = mouse.x * 100;
    const my = mouse.y * 100;
    shell.style.setProperty("--mx", `${mx}%`);
    shell.style.setProperty("--my", `${my}%`);
  });

  shell.addEventListener("mouseleave", () => {
    mouse.active = false;
    shell.style.removeProperty("--mx");
    shell.style.removeProperty("--my");
  });

  function draw(t) {
    raf = 0;
    const r = canvas.getBoundingClientRect();
    const w = r.width;
    const h = r.height;

    ctx.clearRect(0, 0, w, h);

    // soft wash
    const g = ctx.createRadialGradient(w * 0.35, h * 0.25, 20, w * 0.55, h * 0.60, Math.max(w, h) * 0.75);
    g.addColorStop(0, "rgba(255,255,255,0.20)");
    g.addColorStop(1, "rgba(255,255,255,0.00)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (reduce) return;

    const scroll = window.scrollY || 0;
    const scrollPhase = scroll * 0.0012;

    ctx.save();
    ctx.textBaseline = "middle";

    for (let i = 0; i < fragments.length; i++) {
      const f = fragments[i];

      f.x += f.vx;
      f.y += f.vy;

      const breathe = Math.sin(t * 0.001 + f.phase + scrollPhase) * 0.6;

      if (mouse.active) {
        const tx = mouse.x * w;
        const ty = mouse.y * h;
        const dx = tx - f.x;
        const dy = ty - f.y;
        const dist = Math.max(40, Math.hypot(dx, dy));
        const pull = 10 / dist;
        f.x += dx * pull * 0.03;
        f.y += dy * pull * 0.03;
      }

      if (f.x < -60) f.x = w + 60;
      if (f.x > w + 60) f.x = -60;
      if (f.y < -40) f.y = h + 40;
      if (f.y > h + 40) f.y = -40;

      const alpha = clamp(f.alpha + breathe * 0.03, 0.06, 0.28);
      const useA = (i % 2) === 0;

      ctx.font = `${f.size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace`;
      ctx.fillStyle = useA
        ? `rgba(109,94,252,${alpha})`
        : `rgba(0,194,168,${alpha})`;

      ctx.shadowColor = "rgba(0,0,0,0.10)";
      ctx.shadowBlur = 6;

      ctx.fillText(f.text, f.x, f.y);
    }

    ctx.restore();
  }

  function loop(t) {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      draw(t);
      loop(t + 16);
    });
  }

  resize();
  seed();

  if (!reduce) loop(performance.now());
  else draw(performance.now());

  window.addEventListener("resize", () => {
    resize();
    seed();
  }, { passive: true });
}
function emailCopyUX() {
  const links = document.querySelectorAll("[data-copy]");
  if (!links.length) return;

  // simple toast
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1400);
  }

  links.forEach((a) => {
    a.addEventListener("click", async (e) => {
      // Try to copy first (feels instant). Still allow mailto to open.
      const text = a.getAttribute("data-copy");
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast("Email copied");
      } catch {
        // fallback: do nothing (mailto still works)
        showToast("Couldn’t copy — opening email");
      }
    });
  });
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
   emailCopyUX();
  parallaxHero();
  revealOnScroll();
  tiltCards();
  magneticButtons();
  magneticFolders();
  storyScroll();
  loadProjects();
  codeCanvas();
});
