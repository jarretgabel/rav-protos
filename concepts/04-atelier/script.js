(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;

  // Intro curtain
  var lift = function () { body.classList.remove("is-loading"); };
  if (reduce) lift();
  else window.addEventListener("load", function () { setTimeout(lift, 1300); });
  setTimeout(lift, 3500); // never trap the page if an asset is slow

  // Header + mobile drawer
  var hdr = document.getElementById("hdr");
  var btn = document.querySelector(".hdr-menu");
  var drawer = document.getElementById("drawer");
  var setOpen = function (open) {
    drawer.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Close" : "Menu";
    body.style.overflow = open ? "hidden" : "";
  };
  btn.addEventListener("click", function () { setOpen(drawer.hidden); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });

  // Reveal
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { reduce ? el.classList.add("in") : io.observe(el); });

  // Scroll-driven scenes
  var heroObj = document.getElementById("heroObj");
  var heroCopy = document.getElementById("heroCopy");
  var ref = document.getElementById("reference");
  var track = document.getElementById("refTrack");
  var bar = document.getElementById("refBar");
  var now = document.getElementById("refNow");
  var objs = track.querySelectorAll(".obj");
  var frame = document.getElementById("roomFrame");
  var mqDesk = window.matchMedia("(min-width: 901px)");
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };

  function sizeRef() {
    if (!mqDesk.matches) { ref.style.height = ""; track.style.transform = ""; return; }
    var dist = track.scrollWidth - window.innerWidth;
    ref.style.height = (window.innerHeight + dist) + "px";
  }

  function frameUpdate() {
    var vh = window.innerHeight;
    var y = window.scrollY;
    hdr.classList.toggle("solid", y > vh * 0.85);
    if (reduce) return;

    // Hero: object recedes, headline lifts away
    var h = clamp(y / vh);
    heroObj.style.transform = "translateY(" + (h * -6) + "vh) scale(" + (1 - h * 0.14) + ")";
    heroCopy.style.transform = "translateY(" + (h * -14) + "vh)";
    heroCopy.style.opacity = String(1 - h * 1.6);

    // Reference: vertical scroll drives horizontal track
    if (mqDesk.matches) {
      var r = ref.getBoundingClientRect();
      var dist = track.scrollWidth - window.innerWidth;
      var p = clamp(-r.top / (r.height - vh));
      track.style.transform = "translate3d(" + (-p * dist) + "px,0,0)";
      bar.style.transform = "scaleX(" + p + ")";
      var idx = 0;
      objs.forEach(function (o, i) { if (o.getBoundingClientRect().left < window.innerWidth * 0.55) idx = i; });
      now.textContent = String(idx + 1).padStart(2, "0");
    }

    // Room: letterbox opens as it reaches the viewport
    var fr = frame.getBoundingClientRect();
    var q = clamp((vh - fr.top) / (vh * 1.1));
    frame.style.setProperty("--ci", (14 * (1 - q)).toFixed(2) + "%");
    frame.style.setProperty("--cx", (18 * (1 - q)).toFixed(2) + "%");
    frame.style.setProperty("--cs", (1.15 - 0.15 * q).toFixed(3));
    frame.style.setProperty("--co", clamp((q - 0.7) / 0.3).toFixed(2));
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(function () { frameUpdate(); ticking = false; }); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", function () { sizeRef(); frameUpdate(); });
  window.addEventListener("load", function () { sizeRef(); frameUpdate(); });
  sizeRef(); frameUpdate();

  // Mobile swipe counter
  track.addEventListener("scroll", function () {
    if (mqDesk.matches) return;
    var idx = 0;
    objs.forEach(function (o, i) { if (o.getBoundingClientRect().left < window.innerWidth * 0.5) idx = i; });
    now.textContent = String(idx + 1).padStart(2, "0");
  }, { passive: true });
})();
