(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header
  var hdr = document.getElementById("hdr");
  var onScroll = function () { hdr.classList.toggle("solid", window.scrollY > 40); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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

  // Lamplight: follows the cursor on desktop, drifts slowly on its own otherwise
  var hero = document.querySelector(".hero");
  var tx = 62, ty = 48, x = tx, y = ty, lastMove = 0, t0 = performance.now();
  var fine = window.matchMedia("(pointer: fine)").matches;
  if (fine) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width * 100;
      ty = (e.clientY - r.top) / r.height * 100;
      lastMove = performance.now();
    });
  }
  function frame(now) {
    if (now - lastMove > 2500) {
      var t = (now - t0) / 1000;
      tx = 55 + Math.sin(t * 0.23) * 18;
      ty = 46 + Math.sin(t * 0.17 + 1) * 10;
    }
    x += (tx - x) * 0.06; y += (ty - y) * 0.06;
    hero.style.setProperty("--mx", x.toFixed(2) + "%");
    hero.style.setProperty("--my", y.toFixed(2) + "%");
    requestAnimationFrame(frame);
  }
  if (!reduce) requestAnimationFrame(frame);

  // Slow reveals
  var targets = document.querySelectorAll(".press-inner > *, .ways-head, .sleeve, .bleed-copy > *, .buy-head > *, .unit, .sell-copy > *, .founder > *, .visit-box");
  targets.forEach(function (el) { el.classList.add("rv"); });
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    targets.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 110 + "ms"; io.observe(el); });
  }
})();
