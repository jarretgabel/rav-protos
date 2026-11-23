(function () {
  var hdr = document.getElementById("hdr");
  var onScroll = function () { hdr.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.6); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile drawer
  var btn = document.querySelector(".hdr-menu");
  var drawer = document.getElementById("drawer");
  var setOpen = function (open) {
    drawer.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  btn.addEventListener("click", function () { setOpen(drawer.hidden); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

  // Collection rail
  var rail = document.getElementById("rail");
  var now = document.getElementById("railNow");
  var pieces = rail.querySelectorAll(".piece");
  var step = function () { return pieces[1].offsetLeft - pieces[0].offsetLeft; };
  document.querySelectorAll(".rail-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      rail.scrollBy({ left: step() * Number(b.dataset.dir), behavior: "smooth" });
    });
  });
  rail.addEventListener("scroll", function () {
    var i = Math.round(rail.scrollLeft / step());
    if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4) i = pieces.length - 1;
    now.textContent = String(Math.min(i + 1, pieces.length)).padStart(2, "0");
  }, { passive: true });
})();
