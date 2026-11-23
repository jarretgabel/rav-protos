(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sticky nav state
  var nav = document.getElementById("nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 40); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuBtn = document.getElementById("menuBtn");
  var drawer = document.getElementById("drawer");
  var setMenu = function (open) {
    drawer.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  };
  menuBtn.addEventListener("click", function () { setMenu(drawer.hidden); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Turntable start/stop
  var deck = document.querySelector(".deck");
  var sw = document.getElementById("deckSwitch");
  sw.addEventListener("click", function () {
    var stopped = deck.classList.toggle("is-stopped");
    sw.setAttribute("aria-pressed", String(!stopped));
    playing = !stopped;
  });
  if (reduce) { deck.classList.add("is-stopped"); sw.setAttribute("aria-pressed", "false"); }

  // Draw VU dial faces. Pivot sits below the face (matches .vu-needle origin at 118% height).
  var cx = 80, cy = 118, r = 86, ink = "rgba(40,20,5,.8)";
  var pt = function (deg, rad) {
    var a = (deg - 90) * Math.PI / 180;
    return [(cx + rad * Math.cos(a)).toFixed(2), (cy + rad * Math.sin(a)).toFixed(2)];
  };
  var arc = function (a0, a1, rad) {
    var p0 = pt(a0, rad), p1 = pt(a1, rad);
    return "M" + p0.join(" ") + " A" + rad + " " + rad + " 0 0 1 " + p1.join(" ");
  };
  var svg = '<svg viewBox="0 0 160 100" aria-hidden="true">' +
    '<path d="' + arc(-46, 22, r) + '" fill="none" stroke="' + ink + '" stroke-width="1"/>' +
    '<path d="' + arc(22, 46, r) + '" fill="none" stroke="#a3241c" stroke-width="4"/>';
  var labels = { "-46": "20", "-30": "10", "-14": "5", "4": "0", "22": "+1", "38": "+3" };
  for (var d = -46; d <= 46; d += 4) {
    var major = labels[String(d)] !== undefined;
    var a = pt(d, r), b = pt(d, r + (major ? 9 : 5));
    svg += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + (d > 22 ? "#a3241c" : ink) + '" stroke-width="' + (major ? 1.2 : .7) + '"/>';
    if (major) {
      var l = pt(d, r + 15);
      svg += '<text x="' + l[0] + '" y="' + l[1] + '" font-size="7" font-family="JetBrains Mono, monospace" text-anchor="middle" dominant-baseline="middle" fill="' + (d >= 22 ? "#a3241c" : ink) + '">' + labels[String(d)] + "</text>";
    }
  }
  svg += "</svg>";
  document.querySelectorAll(".vu-scale").forEach(function (el) { el.innerHTML = svg; });

  // VU meters: needles follow a soft pseudo-music envelope while the deck is playing
  var playing = !reduce;
  var needles = document.querySelectorAll("[data-vu]");
  var t = 0;
  function vu() {
    t += 0.12;
    needles.forEach(function (n, i) {
      var level = playing
        ? 0.55 + 0.22 * Math.sin(t * 1.3 + i) + 0.14 * Math.sin(t * 3.7 + i * 2) + (Math.random() - 0.5) * 0.22
        : 0;
      level = Math.max(0, Math.min(1.02, level));
      n.style.transform = "rotate(" + (-48 + level * 96) + "deg)";
    });
  }
  if (!reduce) setInterval(vu, 140);

  // Reveal on scroll
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    els.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Inventory filters
  var chips = document.querySelectorAll(".chip");
  var crates = document.querySelectorAll(".crate");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-on"); });
      chip.classList.add("is-on");
      var f = chip.dataset.filter;
      crates.forEach(function (cr) {
        var show = f === "all" || cr.dataset.cat.split(" ").indexOf(f) > -1;
        cr.classList.toggle("is-hidden", !show);
        if (show) cr.classList.add("is-in");
      });
    });
  });
})();
