// Mobile menu: shared by every page.
(() => {
  const btn = document.querySelector(".menu-btn"), nav = document.getElementById("site-nav");
  if (!btn || !nav) return;
  const set = open => { nav.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); };
  btn.addEventListener("click", () => set(!nav.classList.contains("open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { set(false); btn.focus(); } });
  document.addEventListener("click", e => { if (!e.target.closest("header.top")) set(false); });
})();

// Photo viewer: click a project photo to see it larger, without leaving the page.
(() => {
  const ZOOM = ".reveal .frame, .gallery img, .step-shots img";
  if (!document.querySelector(ZOOM)) return;
  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "Photo viewer");
  dlg.innerHTML = '<img alt=""><span class="lb-state"></span>' +
    '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lb-prev" aria-label="Previous photo">&lsaquo;</button>' +
    '<button type="button" class="lb-next" aria-label="Next photo">&rsaquo;</button>' +
    '<button type="button" class="lb-toggle"></button>';
  document.body.append(dlg);
  const img = dlg.querySelector("img"), state = dlg.querySelector(".lb-state"), toggle = dlg.querySelector(".lb-toggle");
  let list = [], i = 0;

  const figOf = el => el.closest(".reveal");
  const photoOf = el => el.tagName === "IMG" ? el : el.querySelector(figOf(el).classList.contains("showing-before") ? ".before" : ".after");
  // Enlarge small photos a little, but not so far that they turn soft.
  const fit = () => {
    if (!img.naturalWidth) return;
    const s = Math.min(innerWidth * .94 / img.naturalWidth, innerHeight * .84 / img.naturalHeight, 1.6);
    img.style.width = Math.round(img.naturalWidth * s) + "px";
  };
  const show = n => {
    if (!list.length) return;
    i = (n + list.length) % list.length;
    const p = photoOf(list[i]), fig = figOf(list[i]);
    img.style.width = "";
    img.src = p.dataset.full || p.currentSrc || p.src; img.alt = p.alt;
    state.hidden = toggle.hidden = !fig;
    if (fig) {
      const before = fig.classList.contains("showing-before");
      state.textContent = before ? "Before" : "After";
      toggle.textContent = before ? "See the after" : "See the before";
    }
    const many = list.length > 1;
    dlg.querySelector(".lb-prev").hidden = dlg.querySelector(".lb-next").hidden = !many;
  };
  const open = el => {
    const group = el.closest(".projects, .gallery, .steps");
    list = [...group.querySelectorAll(ZOOM)].filter(x => x.offsetParent);
    show(list.indexOf(el));
    dlg.showModal();
  };

  img.addEventListener("load", fit);
  addEventListener("resize", () => dlg.open && fit());
  dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
  dlg.querySelector(".lb-prev").addEventListener("click", () => show(i - 1));
  dlg.querySelector(".lb-next").addEventListener("click", () => show(i + 1));
  // Flip before/after in the viewer; the photo on the page flips with it.
  toggle.addEventListener("click", () => { figOf(list[i]).querySelector(".reveal-btn").click(); show(i); });
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && list.length > 1) show(i - 1);
    if (e.key === "ArrowRight" && list.length > 1) show(i + 1);
  });
  dlg.addEventListener("close", () => { const el = list[i]; if (el) el.focus({ preventScroll: true }); });

  document.querySelectorAll(ZOOM).forEach(el => {
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "View larger: " + photoOf(el).alt);
    el.addEventListener("click", e => { if (!e.target.closest(".reveal-btn")) open(el); });
    el.addEventListener("keydown", e => {
      if (e.target !== el || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault(); open(el);
    });
  });
})();
