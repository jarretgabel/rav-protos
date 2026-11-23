(function () {
  // Drawer
  var menu = document.querySelector(".hdr-menu");
  var drawer = document.getElementById("drawer");
  var setOpen = function (open) {
    drawer.hidden = !open;
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
  };
  menu.addEventListener("click", function () { setOpen(drawer.hidden); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

  // Input lamps: light the section you're in, in the header and the phone dock
  var ids = ["listen", "buy", "sell", "install"];
  var links = document.querySelectorAll(".inputs a, .dock a");
  function lamps() {
    var y = window.scrollY + window.innerHeight * 0.45, cur = null;
    ids.forEach(function (id) { var s = document.getElementById(id); if (s && s.offsetTop <= y) cur = id; });
    var visit = document.getElementById("visit");
    if (visit && visit.offsetTop <= y) cur = null;
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
  }
  var heroEl = document.getElementById("top");
  function pastHero() { document.documentElement.classList.toggle("past-hero", window.scrollY > heroEl.offsetHeight * 0.75); }
  window.addEventListener("scroll", pastHero, { passive: true });
  pastHero();
  window.addEventListener("scroll", lamps, { passive: true });
  window.addEventListener("resize", lamps);
  lamps();

  // New / Pre-owned shelf tabs
  var tabs = document.querySelectorAll(".tabs [role=tab]");
  var shelves = document.querySelectorAll(".shelf");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (o) { o.setAttribute("aria-selected", String(o === t)); });
      shelves.forEach(function (s) { s.hidden = s.dataset.set !== t.dataset.set; });
    });
  });
})();
