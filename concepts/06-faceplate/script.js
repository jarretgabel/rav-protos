(function () {
  // Mobile drawer
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

  // Tuner dial: the needle glides between stations as you scroll through sections
  var needle = document.getElementById("needle");
  var stations = Array.prototype.map.call(document.querySelectorAll(".dial a"), function (a) {
    return { link: a, sec: document.querySelector(a.getAttribute("href")), x: parseFloat(a.style.getPropertyValue("--x")) };
  }).filter(function (s) { return s.sec; });
  var navLinks = document.querySelectorAll(".hdr-nav a");

  function update() {
    var probe = window.scrollY + window.innerHeight * 0.4;
    var i = 0;
    for (var k = 0; k < stations.length; k++) if (stations[k].sec.offsetTop <= probe) i = k;
    var cur = stations[i], next = stations[i + 1];
    var x = cur.x;
    if (next) {
      var span = next.sec.offsetTop - cur.sec.offsetTop;
      var t = Math.max(0, Math.min(1, (probe - cur.sec.offsetTop) / span));
      x = cur.x + (next.x - cur.x) * t;
    }
    needle.style.setProperty("--n", x.toFixed(2));
    stations.forEach(function (s, k) { s.link.classList.toggle("on", k === i); });
    var id = "#" + cur.sec.id;
    navLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === id); });
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(function () { update(); ticking = false; }); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("load", update);
  update();
})();
