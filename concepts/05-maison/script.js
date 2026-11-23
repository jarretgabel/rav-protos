(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header + drawer
  var hdr = document.getElementById("hdr");
  var btn = document.querySelector(".hdr-menu");
  var drawer = document.getElementById("drawer");
  var setOpen = function (open) {
    drawer.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
  };
  btn.addEventListener("click", function () { setOpen(drawer.hidden); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

  // Reveal
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach(function (el) { reduce ? el.classList.add("in") : io.observe(el); });

  // Scroll: header state + consign parallax
  var bg = document.querySelector(".cons-bg");
  var sec = document.querySelector(".consign");
  var tick = false;
  function onScroll() {
    hdr.classList.toggle("solid", window.scrollY > 60);
    if (!reduce) {
      var r = sec.getBoundingClientRect();
      var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      if (p > -0.1 && p < 1.1) bg.style.transform = "translate3d(0," + (-p * 16) + "%,0)";
    }
    tick = false;
  }
  window.addEventListener("scroll", function () { if (!tick) { requestAnimationFrame(onScroll); tick = true; } }, { passive: true });
  onScroll();

  // Makers: floating preview follows the cursor
  var list = document.getElementById("mkList");
  var fl = document.getElementById("mkFloat");
  var flImg = fl.querySelector("img");
  var x = 0, y = 0, cx = 0, cy = 0, raf = null;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  function follow() {
    cx += (x - cx) * 0.14; cy += (y - cy) * 0.14;
    fl.style.left = cx + "px"; fl.style.top = cy + "px";
    raf = requestAnimationFrame(follow);
  }
  if (fine) {
    list.querySelectorAll("li").forEach(function (li) {
      var pre = new Image(); pre.src = li.dataset.img;
      li.addEventListener("mouseenter", function () { flImg.src = li.dataset.img; fl.classList.add("on"); });
    });
    list.addEventListener("mousemove", function (e) {
      x = e.clientX + 160; y = e.clientY;
      if (!raf) { cx = x; cy = y; follow(); }
    });
    list.addEventListener("mouseleave", function () {
      fl.classList.remove("on");
      cancelAnimationFrame(raf); raf = null;
    });
  }
})();
