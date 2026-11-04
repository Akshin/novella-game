/* Throne Studios — общий скрипт сайта. */

/* ═══ КОНТАКТЫ ════════════════════════════════════════════════════════
   Единственное место, где хранятся почта и соцсети: шапки, подвалы и страница
   контактов на обоих языках берут их отсюда. Пустая строка — значит «скоро».
   Пример: email: "hello@thronestudios.com", url: "https://t.me/thronestudios" */
const SITE_CONTACTS = {
  email: "",
  social: [
    { id: "telegram", name: "Telegram", url: "" },
    { id: "vk", name: "VK", url: "" },
    { id: "youtube", name: "YouTube", url: "" },
    { id: "discord", name: "Discord", url: "" },
  ],
};
/* ═══════════════════════════════════════════════════════════════════ */

(() => {
  "use strict";
  const en = document.documentElement.lang === "en";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const ICONS = {
    telegram: '<path fill="currentColor" d="M21.6 3.2 2.8 10.5c-1.2.5-1.2 1.3-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.2-1.2ZM9.1 13.3l9.3-5.9c.4-.3.8-.1.5.2l-7.6 6.9-.3 3.3-1.9-4.5Z"/>',
    vk: '<path fill="currentColor" d="M3.5 6.5h3.1c.2 0 .4.1.5.4.8 2.2 2.3 4.6 3.1 4.6.3 0 .4-.2.4-.9V7.3c-.1-1.2-.8-1.3-.8-1.7 0-.2.2-.4.5-.4h3.9c.4 0 .5.2.5.6v3.9c0 .4.2.5.3.5.3 0 .6-.2 1.2-.8 1.2-1.4 2.1-3.5 2.1-3.5.1-.3.3-.5.7-.5h3c.9 0 1.1.5.9 1.1-.4 1.7-4 6.8-4 6.8-.3.5-.4.7 0 1.2.3.4 1.3 1.3 2 2.1 1.2 1.4 2.1 2.5 2.4 3.3.2.8-.2 1.2-1 1.2h-3.1c-.8 0-1.1-.5-2.2-1.6-1-.9-1.4-1.1-1.7-1.1-.4 0-.5.1-.5.7v1.5c0 .4-.1.6-1.2.6-1.8 0-3.8-1.1-5.2-3.1C3.8 14.7 3 11.1 3 10.4c0-.4.1-.6.5-.6Z" transform="translate(0 -1.5)"/>',
    youtube: '<path fill="currentColor" d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z"/>',
    discord: '<path fill="currentColor" d="M19.3 5.3A16.6 16.6 0 0 0 15.2 4l-.5 1a15.4 15.4 0 0 0-5.4 0l-.5-1a16.5 16.5 0 0 0-4.1 1.3C2.1 9.2 1.4 13 1.8 16.8a16.7 16.7 0 0 0 5 2.5l1.1-1.7c-.6-.2-1.2-.5-1.8-.9l.4-.3a11.8 11.8 0 0 0 10.1 0l.4.3c-.6.4-1.2.7-1.8.9l1.1 1.7a16.6 16.6 0 0 0 5-2.5c.5-4.4-.8-8.2-2.2-11.5ZM8.5 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>',
  };
  const icon = (id) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[id] || ""}</svg>`;
  const SOON = en ? "Soon" : "Скоро";

  /* ── Почта: адрес вместо заглушки, если он задан ── */
  if (SITE_CONTACTS.email) {
    $$("[data-email]").forEach((el) => {
      const a = document.createElement("a");
      a.href = `mailto:${SITE_CONTACTS.email}`;
      a.className = el.dataset.email || "";
      a.textContent = SITE_CONTACTS.email;
      el.replaceWith(a);
    });
    $$("[data-email-note]").forEach((el) => el.remove());
  }

  /* ── Соцсети: в подвале — только готовые ссылки, на странице контактов — все ── */
  $$("[data-socials]").forEach((ul) => {
    const cards = ul.dataset.socials === "cards";
    const items = SITE_CONTACTS.social.filter((s) => cards || s.url);
    ul.innerHTML = items.map((s) => {
      if (!s.url) return `<li><span class="s">${icon(s.id)}<b>${s.name}</b><small>${SOON}</small></span></li>`;
      const inner = cards ? `${icon(s.id)}<b>${s.name}</b><small>↗</small>` : s.name;
      return `<li><a href="${s.url}" target="_blank" rel="noopener">${inner}</a></li>`;
    }).join("") || `<li class="muted">${en ? "Coming soon" : "Скоро появятся"}</li>`;
  });

  /* ── Шапка: линия при прокрутке и мобильное меню ── */
  const head = $(".site-head");
  if (head) {
    const onScroll = () => head.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const btn = $(".menu-btn", head);
    const setOpen = (open) => {
      head.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
    };
    btn.addEventListener("click", () => setOpen(!head.classList.contains("menu-open")));
    $$(".nav a", head).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  /* ── Интерференция на первом экране: две точки-источника, одна идёт за курсором ── */
  const cv = $("#fringes");
  if (cv) {
    const host = cv.parentElement;
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, img;
    const size = () => {
      const r = host.getBoundingClientRect();
      W = 190;
      H = Math.max(80, Math.round((W * r.height) / Math.max(1, r.width)));
      cv.width = W; cv.height = H;
      img = ctx.createImageData(W, H);
    };
    let px = 0.32, py = 0.62, tx = px, ty = py, t = 0;
    host.addEventListener("pointermove", (e) => {
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
    });
    const k = (2 * Math.PI) / 7.2;
    const draw = () => {
      px += (tx - px) * 0.05; py += (ty - py) * 0.05;
      const narrow = innerWidth <= 860;
      const s1x = W * (narrow ? 0.5 : 0.74) + Math.cos(t * 0.13) * W * 0.03;
      const s1y = H * (narrow ? 0.72 : 0.5) + Math.sin(t * 0.11) * H * 0.04;
      const s2x = W * px, s2y = H * py;
      const d = img.data;
      let o = 0;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const d1 = Math.hypot(x - s1x, y - s1y);
          const d2 = Math.hypot(x - s2x, y - s2y);
          const a = Math.cos(k * d1 - t) / (1 + d1 * 0.012) + Math.cos(k * d2 - t) / (1 + d2 * 0.012);
          let I = a * a * 0.32;
          if (I > 1) I = 1;
          // от тёмно-фиолетового к мятному — цвета вуали StoryVeil
          d[o] = 52 + 46 * I; d[o + 1] = 34 + 196 * I; d[o + 2] = 110 + 79 * I; d[o + 3] = 26 + I * 150;
          o += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
    };
    size();
    draw();
    addEventListener("resize", () => { size(); draw(); });
    if (!reduce) {
      let visible = true, running = false, last = 0;
      const loop = (now) => {
        if (!visible || document.hidden) { running = false; return; }
        if (now - last > 33) { t += 0.11; draw(); last = now; }
        requestAnimationFrame(loop);
      };
      const kick = () => { if (!running && visible && !document.hidden) { running = true; requestAnimationFrame(loop); } };
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(host);
      document.addEventListener("visibilitychange", kick);
    }
  }

  /* ── Видео-петли локаций играют, только пока видны ── */
  const vids = $$("video[data-src]");
  if (vids.length) {
    const io = new IntersectionObserver((entries) => {
      for (const { target: v, isIntersecting } of entries) {
        if (isIntersecting) {
          if (!v.src) { v.onplaying = () => v.classList.add("on"); v.src = v.dataset.src; }
          const p = v.play();
          if (p) p.catch(() => {});
        } else if (v.src) v.pause();
      }
    }, { threshold: 0.35 });
    vids.forEach((v) => io.observe(v));
  }

  /* ── Персонажи: другая эмоция при наведении или нажатии ── */
  $$(".cast li").forEach((li) => {
    const img = $("img", li);
    const a = img.getAttribute("src");
    const b = a.replace(`_${li.dataset.a}.`, `_${li.dataset.b}.`);
    const set = (alt) => { li.classList.toggle("alt", alt); img.src = alt ? b : a; };
    li.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") set(true); });
    li.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") set(false); });
    li.addEventListener("click", () => set(!li.classList.contains("alt")));
    new Image().src = b;
  });
})();
