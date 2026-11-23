(function () {
  document.documentElement.classList.add("js");

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

  // Shop mega panel: opens on hover or click, closes on leave, Escape or link click
  var megaBtn = document.querySelector(".nav-btn");
  var mega = document.getElementById("mega");
  var hdr = document.getElementById("hdr");
  var closeT;
  var setMega = function (open) {
    mega.hidden = !open;
    megaBtn.setAttribute("aria-expanded", String(open));
  };
  megaBtn.addEventListener("click", function () { setMega(mega.hidden); });
  megaBtn.addEventListener("mouseenter", function () { clearTimeout(closeT); setMega(true); });
  mega.addEventListener("mouseenter", function () { clearTimeout(closeT); });
  [megaBtn, mega].forEach(function (n) {
    n.addEventListener("mouseleave", function () { closeT = setTimeout(function () { setMega(false); }, 220); });
  });
  mega.addEventListener("click", function (e) { if (e.target.closest("a")) setMega(false); });
  document.addEventListener("click", function (e) { if (!hdr.contains(e.target)) setMega(false); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setOpen(false); setMega(false); }
    // "/" jumps to search, like a catalog index
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) {
      var s = document.querySelector(".hdr .search input");
      if (s && s.offsetParent) { e.preventDefault(); s.focus(); }
    }
  });

  // Active section in nav and dock
  var map = [
    ["#shop", ".nav-btn"], ["#preowned", '.hdr-nav a[href="#preowned"]'], ["#sell", '.hdr-nav a[href="#sell"]'],
    ["#visit", '.hdr-nav a[href="#visit"]'], ["#install", '.hdr-nav a[href="#install"]']
  ];
  var dockLinks = document.querySelectorAll(".dock a");
  function active() {
    var y = window.scrollY + window.innerHeight * 0.4, cur = null;
    map.forEach(function (m) { var s = document.querySelector(m[0]); if (s && s.offsetTop <= y) cur = m[0]; });
    if (cur === "#finder") cur = null;
    map.forEach(function (m) { var el = document.querySelector(m[1]); if (el) el.classList.toggle("on", m[0] === cur); });
    var dockCur = cur === "#preowned" ? "#shop" : cur;
    dockLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === dockCur); });
  }
  var heroEl = document.getElementById("top");
  function pastHero() { document.documentElement.classList.toggle("past-hero", window.scrollY > heroEl.offsetHeight * 0.75); }
  window.addEventListener("scroll", pastHero, { passive: true });
  pastHero();
  window.addEventListener("scroll", active, { passive: true });
  active();

  // System finder. Pairings and totals are illustrative, built from list prices.
  var systems = {
    parlor: {
      name: "The Parlor", img: "img/p-leben.jpg", price: "From $50,185",
      desc: "A small tube amplifier and efficient Brooklyn-made speakers. Intimate, vivid, and happy at dinner-party volume.",
      list: [["Brinkmann Bardo", "Turntable"], ["Leben CS-300XO", "Tube integrated"], ["DeVore Fidelity O/Bronze", "Loudspeakers"]]
    },
    library: {
      name: "The Library", img: "img/f-dcs.jpg", price: "From $94,500",
      desc: "Records and streaming in equal measure, with blue meters glowing on the shelf and power to spare for a big room.",
      list: [["dCS Rossini APEX", "DAC & streamer"], ["McIntosh MA2375", "Tube integrated"], ["Ø Audio Verdande", "Loudspeakers"]]
    },
    studio: {
      name: "The Studio", img: "img/f-devore.jpg", price: "From $356,765",
      desc: "Single-ended Western Electric 211s into high-efficiency speakers. Scale, texture and a sense of the players in the room.",
      list: [["Brinkmann Balance", "Turntable"], ["Phasemation MA-5000", "Monaural amplifiers"], ["DeVore Fidelity O/Reference", "Loudspeakers"]]
    },
    precision: {
      name: "The Reference", img: "img/f-nagra-anniv.jpg", price: "From $569,990",
      desc: "What we play when someone asks what’s possible. German analog, Swiss electronics, Maine loudspeakers, and a room built around them.",
      list: [["Brinkmann Balance", "Turntable"], ["Nagra Reference", "Preamp & mono amps"], ["Rockport Technologies Lyra", "Loudspeakers"]]
    }
  };

  function pick(room, src, sound) {
    if (sound === "detail" && room !== "apt") return "precision";
    if (sound === "scale" || room === "loft") return src === "stream" ? "library" : "studio";
    if (src === "stream" || src === "both" || room === "town") return "library";
    return "parlor";
  }

  var form = document.getElementById("finder-form");
  var result = document.getElementById("result");
  var el = {
    img: document.getElementById("rImg"), name: document.getElementById("rName"),
    desc: document.getElementById("rDesc"), list: document.getElementById("rList"), price: document.getElementById("rPrice")
  };
  var current = null;

  function render(key, animate) {
    if (key === current) return;
    current = key;
    var s = systems[key];
    var apply = function () {
      el.img.src = s.img; el.img.alt = s.name;
      el.name.textContent = s.name;
      el.desc.textContent = s.desc;
      el.price.textContent = s.price;
      el.list.innerHTML = s.list.map(function (r) { return "<li><span>" + r[0] + "</span><span>" + r[1] + "</span></li>"; }).join("");
      result.classList.remove("swap");
    };
    if (animate) { result.classList.add("swap"); setTimeout(apply, 280); } else apply();
  }

  function update(animate) {
    var v = function (n) { return form.querySelector('input[name="' + n + '"]:checked').value; };
    render(pick(v("room"), v("src"), v("sound")), animate);
  }
  form.addEventListener("change", function () { update(true); });
  update(false);
})();
