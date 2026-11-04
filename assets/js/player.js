/* Веб-плеер StoryVeil: фрагмент главы 1 «Интерференции» в рамке телефона.
   Сценарий и подписи — в story.ru.js / story.en.js (window.STORYVEIL_DEMO), подключаются до этого файла.
   Плеер встраивается в каждый <div data-player></div> на странице. */
(() => {
  "use strict";
  const DEMO = window.STORYVEIL_DEMO;
  const mount = document.querySelector("[data-player]");
  if (!DEMO || !mount) return;

  const ASSETS = new URL("../", document.currentScript.src).href;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 120) : ms));
  const { ui: T, chars: CH, script: SCRIPT, memory: MEMORY } = DEMO;
  const POS = { left: 0.24, center: 0.5, right: 0.76 };
  const charSrc = (id, emo) => `${ASSETS}chars/${id}_${emo}.webp`;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  if (!document.getElementById("gem")) {
    document.body.insertAdjacentHTML("afterbegin",
      `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="gem" viewBox="0 0 24 24"><path fill="currentColor" d="M6.2 3h11.6l4.2 6-10 12L2 9l4.2-6Zm1 2-2.5 3.6h4.2L10.4 5H7.2Zm6.4 0 1.5 3.6h4.2L16.8 5h-3.2Zm-1.6.5L10.6 9h2.8L12 5.5ZM5.2 10.6l5.2 6.3-2.1-6.3H5.2Zm5.2 0L12 16l1.6-5.4h-3.2Zm5.3 0-2.1 6.3 5.2-6.3h-3.1Z"/></symbol></svg>`);
  }

  mount.innerHTML = `
    <div class="phone">
      <div class="screen" tabindex="0" role="group" aria-label="${esc(T.screenLabel)}">
        <div class="bg show top"><img alt="" src="${ASSETS}bg/detector_cavern.jpg"><video muted loop playsinline preload="none" aria-hidden="true"></video></div>
        <div class="bg"><img alt=""><video muted loop playsinline preload="none" aria-hidden="true"></video></div>
        <div class="stage"></div>
        <div class="hero-portrait"><img alt=""></div>
        <div class="ui">
          <div class="choices" hidden></div>
          <div class="dlg narr" hidden><span class="plate"></span><p class="txt" aria-live="polite"></p></div>
        </div>
        <div class="blackout"></div>
        <div class="titlecard"></div>
        <div class="status" aria-hidden="true">
          <span>06:42</span>
          <span class="icons"><i style="width:1cqw;height:1.6cqw"></i><i style="width:1cqw;height:2.2cqw"></i><i style="width:1cqw;height:2.8cqw"></i><i style="width:5.6cqw;height:2.8cqw;border-radius:.8cqw;margin-left:1cqw"></i></span>
        </div>
        <div class="island" aria-hidden="true"></div>
        <div class="hud" aria-hidden="true">
          <span class="chip">${esc(T.chapter)}</span>
          <span class="chip gems"><svg><use href="#gem"/></svg><span class="gem-count">30</span></span>
        </div>
        <div class="overlay start">
          <div class="meta">${T.meta.map((m) => `<span>${esc(m)}</span>`).join("")}</div>
          <h3>${esc(T.title)}</h3>
          <p>${esc(T.synopsis)}</p>
          <button type="button" class="btn-game play">${esc(T.play)}</button>
          <small>${esc(T.length)}</small>
        </div>
        <div class="overlay end" hidden>
          <h3>${esc(T.endTitle)}</h3>
          <p>${esc(T.endMemory)}</p>
          <ul class="memory"></ul>
          <p>${esc(T.endNote)}</p>
          <button type="button" class="btn-game ghost replay">${esc(T.replay)}</button>
        </div>
      </div>
    </div>`;

  const $ = (s) => mount.querySelector(s);
  const screen = $(".screen"), stage = $(".stage");
  const heroP = $(".hero-portrait"), heroImg = heroP.querySelector("img");
  const dlg = $(".dlg"), plate = $(".plate"), txt = $(".txt"), choicesEl = $(".choices");
  const blackout = $(".blackout"), titleCard = $(".titlecard");
  const startEl = $(".start"), endEl = $(".end"), gemsEl = $(".gems"), gemCount = $(".gem-count");
  const layers = [...screen.querySelectorAll(".bg")].map((el) => ({ el, img: el.querySelector("img"), video: el.querySelector("video") }));
  let front = 0;

  function loadBg(layer, name) {
    layer.img.src = `${ASSETS}bg/${name}.jpg`;
    const v = layer.video;
    v.classList.remove("on");
    v.onplaying = () => v.classList.add("on");
    v.src = `${ASSETS}bg/${name}.mp4`;
    const p = v.play();
    if (p) p.catch(() => {});
  }

  loadBg(layers[0], "detector_cavern");
  new IntersectionObserver(([e]) => {
    for (const l of layers) {
      if (!l.el.classList.contains("show")) continue;
      if (e.isIntersecting) { const p = l.video.play(); if (p) p.catch(() => {}); } else l.video.pause();
    }
  }).observe(screen);

  async function setBg(name, mode) {
    if (mode === "black") {
      dlg.hidden = true;
      heroP.classList.remove("on");
      blackout.classList.add("on");
      await sleep(420);
      loadBg(layers[front], name);
      await sleep(160);
      blackout.classList.remove("on");
      await sleep(380);
      return;
    }
    const old = layers[front], next = layers[1 - front];
    loadBg(next, name);
    next.el.classList.add("show", "top");
    old.el.classList.remove("top");
    front = 1 - front;
    setTimeout(() => { if (layers[front] !== old) { old.el.classList.remove("show"); old.video.pause(); } }, 760);
    await sleep(380);
  }

  const onStage = new Map();
  function show(id, pos, emo, anim) {
    let s = onStage.get(id);
    if (!s) {
      const el = document.createElement("div");
      el.className = "fig " + (anim === "from_right" ? "in-right" : "in-fade");
      const img = new Image();
      img.alt = "";
      el.append(img);
      stage.append(el);
      s = { el, img, emo: null };
      onStage.set(id, s);
    }
    s.el.style.setProperty("--x", POS[pos]);
    emote(id, emo);
  }
  function emote(id, emo) {
    const s = onStage.get(id);
    if (s && s.emo !== emo) { s.emo = emo; s.img.src = charSrc(id, emo); }
  }
  function hide(id, anim) {
    const s = onStage.get(id);
    if (!s) return;
    onStage.delete(id);
    s.el.classList.remove("in-fade", "in-right", "dim");
    s.el.classList.add(anim === "to_right" ? "out-right" : "out-fade");
    setTimeout(() => s.el.remove(), 460);
  }
  function highlight(speaker) {
    for (const [id, s] of onStage) s.el.classList.toggle("dim", speaker !== null && speaker !== id);
  }

  // Печать по буквам: 22 мс на знак, как в игре; невидимый хвост держит высоту окна.
  let revealing = false, typeRaf = 0, typeText = "", shownEl, restEl;
  function type(text) {
    cancelAnimationFrame(typeRaf);
    typeText = text;
    txt.textContent = "";
    shownEl = document.createElement("span");
    restEl = document.createElement("span");
    restEl.className = "rest";
    restEl.textContent = text;
    txt.append(shownEl, restEl);
    dlg.classList.remove("done");
    if (reduce) return finishType();
    revealing = true;
    const t0 = performance.now();
    let n = 0;
    const tick = (now) => {
      const c = Math.min(text.length, Math.floor((now - t0) / 22));
      if (c !== n) { n = c; shownEl.textContent = text.slice(0, n); restEl.textContent = text.slice(n); }
      if (n < text.length) typeRaf = requestAnimationFrame(tick); else finishType();
    };
    typeRaf = requestAnimationFrame(tick);
  }
  function finishType() {
    cancelAnimationFrame(typeRaf);
    revealing = false;
    shownEl.textContent = typeText;
    restEl.textContent = "";
    dlg.classList.add("done");
  }

  function line(kind, who, emo, text) {
    dlg.hidden = false;
    dlg.className = "dlg " + (kind === "n" ? "narr" : kind === "t" ? "thought" : "speech");
    void dlg.offsetWidth;
    dlg.style.setProperty("--spk", who ? CH[who].color : "#ffffff");
    plate.textContent = kind === "t" ? T.thoughts : who ? CH[who].name : "";
    if (who && who !== "hero") emote(who, emo);
    if (who === "hero") {
      heroImg.src = charSrc("hero", emo || "neutral");
      heroP.classList.add("on");
    } else heroP.classList.remove("on");
    highlight(kind === "n" ? null : who);
    type(text);
  }

  let gems = 30;
  function setGems(n) {
    gems = n;
    gemCount.textContent = n;
    gemsEl.classList.remove("bump");
    void gemsEl.offsetWidth;
    gemsEl.classList.add("bump");
  }

  let stack = [], vars = {}, busy = false, waitingChoice = false, playing = false;
  function choose(opts) {
    choicesEl.textContent = "";
    dlg.classList.remove("done");
    opts.forEach((o, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice" + (o.premium ? " premium" : "");
      b.style.setProperty("--i", i);
      const label = document.createElement("span");
      label.textContent = o.text;
      b.append(label);
      if (o.premium) {
        const price = document.createElement("span");
        price.className = "price";
        price.innerHTML = `<svg aria-hidden="true"><use href="#gem"/></svg>${o.premium}`;
        b.append(price);
        b.setAttribute("aria-label", T.paidLabel(o.text, o.premium));
      }
      b.addEventListener("click", (e) => { e.stopPropagation(); pick(o); });
      choicesEl.append(b);
    });
    choicesEl.hidden = false;
    waitingChoice = true;
  }
  function pick(o) {
    if (!waitingChoice) return;
    if (o.premium) {
      if (gems < o.premium) { setGems(gems); return; }
      setGems(gems - o.premium);
      vars.paid = o.premium;
    }
    for (const [k, v] of Object.entries(o.set || {})) vars[k] = (vars[k] || 0) + v;
    waitingChoice = false;
    choicesEl.hidden = true;
    choicesEl.textContent = "";
    stack.push({ list: o.then, i: 0 });
    next();
  }

  async function title(text, bgName) {
    dlg.hidden = true;
    heroP.classList.remove("on");
    blackout.classList.add("on");
    await sleep(480);
    titleCard.textContent = text;
    titleCard.classList.add("on");
    loadBg(layers[front], bgName);
    await sleep(2300);
    titleCard.classList.remove("on");
    await sleep(520);
    blackout.classList.remove("on");
    await sleep(380);
  }

  function end() {
    dlg.hidden = true;
    heroP.classList.remove("on");
    const list = $(".memory");
    list.textContent = "";
    for (const [k, label] of Object.entries(MEMORY)) {
      if (!vars[k]) continue;
      const li = document.createElement("li");
      li.textContent = k === "legacy" ? label : `+${vars[k]} ${label}`;
      list.append(li);
    }
    if (vars.paid) {
      const li = document.createElement("li");
      li.className = "paid";
      li.textContent = T.paidMemory(vars.paid);
      list.append(li);
    }
    endEl.hidden = false;
    playing = false;
  }

  function run(p) {
    busy = true;
    p.then(() => { busy = false; next(); });
  }

  function next() {
    while (stack.length) {
      const top = stack[stack.length - 1];
      if (top.i >= top.list.length) { stack.pop(); continue; }
      const c = top.list[top.i++];
      switch (c[0]) {
        case "bg": run(setBg(c[1], c[2])); return;
        case "show": show(c[1], c[2], c[3], c[4]); break;
        case "hide": hide(c[1], c[2]); break;
        case "n": line("n", null, null, c[1]); return;
        case "t": line("t", "hero", c[1], c[2]); return;
        case "say": line("say", c[1], c[2], c[3]); return;
        case "choice": choose(c[1]); return;
        case "title": run(title(c[1], c[2])); return;
        case "end": end(); return;
      }
    }
  }

  function advance() {
    if (!playing || busy || waitingChoice) return;
    if (revealing) { finishType(); return; }
    next();
  }

  let preloaded = false;
  function preload() {
    if (preloaded) return;
    preloaded = true;
    const imgs = ["hero_neutral", "hero_amused", "hero_surprised", "viktor_neutral", "viktor_smile", "viktor_thoughtful",
      "samira_neutral", "samira_amused", "elias_neutral", "elias_amused", "elias_serious", "elias_surprised"]
      .map((n) => `${ASSETS}chars/${n}.webp`)
      .concat(["balcony_night", "lift", "control_room"].map((n) => `${ASSETS}bg/${n}.jpg`));
    for (const src of imgs) { const i = new Image(); i.src = src; }
  }

  async function begin() {
    preload();
    blackout.classList.add("on");
    await sleep(340);
    startEl.hidden = true;
    endEl.hidden = true;
    for (const id of [...onStage.keys()]) { onStage.get(id).el.remove(); onStage.delete(id); }
    heroP.classList.remove("on");
    choicesEl.hidden = true;
    dlg.hidden = true;
    vars = {};
    gems = 30;
    gemCount.textContent = gems;
    stack = [{ list: SCRIPT, i: 0 }];
    waitingChoice = false;
    playing = true;
    next();
    screen.focus({ preventScroll: true });
  }

  $(".play").addEventListener("click", (e) => { e.stopPropagation(); begin(); });
  $(".replay").addEventListener("click", (e) => { e.stopPropagation(); begin(); });
  screen.addEventListener("click", advance);
  screen.addEventListener("keydown", (e) => {
    if (e.target !== screen) return;
    if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") { e.preventDefault(); advance(); }
  });
  screen.addEventListener("pointerenter", preload, { once: true });

  // Ссылки «Играть» на странице ведут к телефону и сразу запускают фрагмент.
  document.querySelectorAll("[data-play]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    mount.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    if (!playing) begin(); else screen.focus({ preventScroll: true });
  }));
})();
