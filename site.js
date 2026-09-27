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
