(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header state
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

  // Slow reveals on scroll
  var targets = document.querySelectorAll(".ways-head, .press ul, .press-line, .room-copy > *, .sec-head > *, .mood, .crates-copy > *, .sell-copy, .offer, .home-copy > *, .founder > *, .visit-inner");
  targets.forEach(function (el) { el.classList.add("rv"); });
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    targets.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 120 + "ms"; io.observe(el); });
  }

  // Lamp glow drifts toward the cursor in the hero
  var hero = document.querySelector(".hero");
  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      hero.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  }

  // "Drop the needle": generated vinyl surface noise. No recordings, nothing licensed.
  var btn = document.getElementById("needleBtn");
  var label = btn.querySelector(".needle-label");
  var np = document.getElementById("np");
  var ctx = null, gain = null, src = null;

  function buildCrackle(ac) {
    var secs = 6, rate = ac.sampleRate, len = secs * rate;
    var buf = ac.createBuffer(2, len, rate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch), b0 = 0, b1 = 0;
      for (var i = 0; i < len; i++) {
        // Soft, warm hiss (lowpassed noise)
        var w = Math.random() * 2 - 1;
        b0 = 0.995 * b0 + w * 0.02;
        b1 = 0.6 * b1 + b0 * 0.4;
        var s = b1 * 0.35;
        // Sparse pops and ticks
        if (Math.random() < 0.00035) {
          var amp = 0.25 + Math.random() * 0.5, dec = 40 + Math.random() * 160;
          for (var k = 0; k < dec && i + k < len; k++) d[i + k] += (Math.random() * 2 - 1) * amp * Math.exp(-k / (dec / 5));
        }
        // Faint once-per-revolution thump at 33 1/3 rpm
        var rev = (i / rate) % 1.8;
        if (rev < 0.012) s += Math.sin(rev * 900) * 0.05 * (1 - rev / 0.012);
        d[i] += s;
      }
    }
    return buf;
  }

  function start() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!ctx) {
      ctx = new AC();
      gain = ctx.createGain();
      var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 5200;
      gain.connect(lp); lp.connect(ctx.destination);
    }
    src = ctx.createBufferSource();
    src.buffer = buildCrackle(ctx);
    src.loop = true;
    src.connect(gain);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.6);
    if (ctx.state === "suspended") ctx.resume();
    src.start();
  }
  function stop() {
    if (!ctx || !src) return;
    var s = src;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    setTimeout(function () { try { s.stop(); } catch (e) {} }, 1300);
    src = null;
  }
  btn.addEventListener("click", function () {
    var on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(on));
    label.textContent = on ? "Lift the needle" : "Drop the needle";
    np.hidden = !on;
    on ? start() : stop();
  });
})();
