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

  // Active nav link
  var links = document.querySelectorAll(".hdr-nav a");
  var secs = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute("href")); });
  function activeNav() {
    var y = window.scrollY + window.innerHeight * 0.35, cur = -1;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle("on", i === cur); });
  }
  window.addEventListener("scroll", activeNav, { passive: true });
  activeNav();

  // System finder. Pairings and totals are illustrative, built from list prices.
  var systems = {
    parlor: {
      name: "The Parlor", img: "img/g-shindo.jpg", price: "From $50,185",
      desc: "A small tube amplifier and efficient Brooklyn-made speakers. Intimate, vivid, and happy at dinner-party volume.",
      list: [["Brinkmann Bardo", "Turntable"], ["Leben CS-300XO", "Tube integrated"], ["DeVore Fidelity O/Bronze", "Loudspeakers"]]
    },
    library: {
      name: "The Library", img: "img/p-mcintosh.jpg", price: "From $94,500",
      desc: "Records and streaming in equal measure, with blue meters glowing on the shelf and power to spare for a big room.",
      list: [["dCS Rossini APEX", "DAC & streamer"], ["McIntosh MA2375", "Tube integrated"], ["Ø Audio Verdande", "Loudspeakers"]]
    },
    studio: {
      name: "The Studio", img: "img/g-phasemation.jpg", price: "From $356,765",
      desc: "Single-ended Western Electric 211s into high-efficiency speakers. Scale, texture and a sense of the players in the room.",
      list: [["Brinkmann Balance", "Turntable"], ["Phasemation MA-5000", "Monaural amplifiers"], ["DeVore Fidelity O/Reference", "Loudspeakers"]]
    },
    precision: {
      name: "The Reference", img: "img/g-brinkmann.jpg", price: "From $569,990",
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
