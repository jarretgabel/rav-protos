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

  // Mark the section you're in, in the header and the phone dock
  var ids = ["design", "listen", "buy", "sell"];
  var links = document.querySelectorAll(".oh-nav a, .oh-dock a");
  function mark() {
    var y = window.scrollY + window.innerHeight * 0.45, cur = null;
    ids.forEach(function (id) { var s = document.getElementById(id); if (s && s.offsetTop <= y) cur = id; });
    var proof = document.querySelector(".proof");
    if (proof && proof.offsetTop <= y) cur = null;
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
  }
  window.addEventListener("scroll", mark, { passive: true });
  window.addEventListener("resize", mark);
  mark();
})();
