(function () {
  // Header: transparent over the hero photo, solid once you scroll
  var hdr = document.getElementById("hdr");
  var hero = document.getElementById("top");
  function solid() { hdr.classList.toggle("solid", window.scrollY > hero.offsetHeight - 120); }
  window.addEventListener("scroll", solid, { passive: true });
  solid();

  // Drawer
  var menu = document.querySelector(".hdr-menu");
  var drawer = document.getElementById("drawer");
  var setOpen = function (open) {
    drawer.hidden = !open;
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
    hdr.classList.toggle("open", open);
  };
  menu.addEventListener("click", function () { setOpen(drawer.hidden); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

  // Mark the section you're in
  var ids = ["design", "listen", "buy", "sell"];
  var links = document.querySelectorAll(".hdr-nav a");
  function mark() {
    var y = window.scrollY + window.innerHeight * 0.45, cur = null;
    ids.forEach(function (id) { var s = document.getElementById(id); if (s && s.offsetTop <= y) cur = id; });
    var w = document.querySelector(".words");
    if (w && w.offsetTop <= y) cur = null;
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
  }
  window.addEventListener("scroll", mark, { passive: true });
  mark();
})();
