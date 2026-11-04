/* Throne Studios — общий скрипт сайта. */

/* ═══ КОНТАКТЫ ════════════════════════════════════════════════════════
   Единственное место, где хранятся почта и соцсети: шапки, подвалы и страница
   контактов на обоих языках берут их отсюда. Пустая строка — значит «скоро».
   Пример: email: "hello@thronestudios.com", url: "https://t.me/thronestudios" */
const SITE_CONTACTS = {
  email: "alo@thronestudios.ink",
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

  /* ── Искры на первом экране: тёплые пылинки медленно поднимаются в свете сцены ── */
  const cv = $("#motes");
  if (cv) {
    const host = cv.parentElement;
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = 1, motes = [];
    const rand = (a, b) => a + Math.random() * (b - a);
    const spawn = (anyY) => ({
      x: rand(0, W), y: anyY ? rand(0, H) : H + rand(0, 40),
      r: rand(0.5, 2.1), vy: rand(6, 22), sway: rand(6, 26), phase: rand(0, Math.PI * 2),
      speed: rand(0.2, 0.7), hue: rand(22, 42), life: rand(0.35, 1),
    });
    const size = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (W * H) / 14000));
      motes = Array.from({ length: count }, () => spawn(true));
    };
    let t = 0;
    const draw = (dt) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        m.y -= m.vy * dt;
        const x = m.x + Math.sin(t * m.speed + m.phase) * m.sway;
        if (m.y < -20) Object.assign(m, spawn(false));
        // мерцание, как у угольков: яркость дышит, у верха искра гаснет
        const fade = Math.min(1, m.y / (H * 0.35));
        const a = m.life * fade * (0.55 + 0.45 * Math.sin(t * 2.3 * m.speed + m.phase * 3));
        if (a <= 0) continue;
        const g = ctx.createRadialGradient(x, m.y, 0, x, m.y, m.r * 5);
        g.addColorStop(0, `hsla(${m.hue}, 100%, 72%, ${a})`);
        g.addColorStop(1, `hsla(${m.hue}, 100%, 55%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, m.y, m.r * 5, 0, Math.PI * 2); ctx.fill();
      }
    };
    size();
    draw(0);
    addEventListener("resize", () => { size(); draw(0); });
    if (!reduce) {
      let visible = true, running = false, last = 0;
      const loop = (now) => {
        if (!visible || document.hidden) { running = false; return; }
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
        last = now; t += dt;
        draw(dt);
        requestAnimationFrame(loop);
      };
      const kick = () => { if (!running && visible && !document.hidden) { running = true; last = 0; requestAnimationFrame(loop); } };
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(host);
      document.addEventListener("visibilitychange", kick);
    }
  }

  /* ── «Как это устроено»: мини-сцены ── */
  // Решения: выбранный ответ подсвечивается, остальные гаснут; повторное нажатие сбрасывает.
  $$('[data-viz="choices"]').forEach((box) => {
    const note = $(".vz-note", box), hint = note.textContent;
    const buttons = $$(".vz-choice", box);
    buttons.forEach((b) => b.addEventListener("click", () => {
      const again = b.classList.contains("picked");
      buttons.forEach((x) => x.classList.toggle("picked", !again && x === b));
      box.classList.toggle("chosen", !again);
      note.textContent = again ? hint : b.dataset.note;
    }));
  });

  // Отношения: герой улыбается, шкала растёт.
  $$('[data-viz="rel"] .vz-person').forEach((b) => {
    const img = $("img", b), a = img.getAttribute("src"), alt = b.dataset.b;
    new Image().src = alt;
    const set = (up) => { b.classList.toggle("up", up); img.src = up ? alt : a; };
    b.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") set(true); });
    b.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") set(false); });
    b.addEventListener("click", () => set(!b.classList.contains("up")));
  });

  // Особый выбор: 30 кристаллов → 10, сцена открыта; повторное нажатие возвращает как было.
  $$('[data-viz="premium"]').forEach((box) => {
    const btn = $(".vz-choice", box), gems = $(".vz-gems", box), count = $("b", gems);
    const note = $(".vz-note", box), hint = note.textContent;
    let raf = 0;
    btn.addEventListener("click", () => {
      const done = !box.classList.contains("done");
      box.classList.toggle("done", done);
      note.textContent = done ? note.dataset.done : hint;
      gems.classList.toggle("bump", false); void gems.offsetWidth; gems.classList.toggle("bump", true);
      cancelAnimationFrame(raf);
      const from = +count.textContent, to = done ? 10 : 30, t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / 500);
        count.textContent = Math.round(from + (to - from) * k);
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
  });

  // Живая сцена: реплика печатается по буквам, пока блок на экране, и повторяется.
  if (!reduce) $$('[data-viz="live"] [data-type]').forEach((el) => {
    const text = el.dataset.type;
    let i = 0, timer = 0, on = false;
    const step = () => {
      if (!on) return;
      i = i >= text.length ? 0 : i + 1;
      el.textContent = text.slice(0, i);
      timer = setTimeout(step, i >= text.length ? 2600 : 28);
    };
    new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      clearTimeout(timer);
      if (on) { i = 0; step(); }
    }, { threshold: 0.4 }).observe(el);
  });

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
