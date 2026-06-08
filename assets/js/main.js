(function () {
  var data = window.NSV;
  var path = location.pathname.split("/").pop() || "index.html";
  var links = [
    ["Home", "index.html"],
    ["About Us", "about.html"],
    ["Services", "services.html"],
    ["Projects", "projects.html"],
    ["Contact", "contact.html"]
  ];

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function icon(name) {
    var paths = {
      menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      x: '<path d="M18 6 6 18M6 6l12 12"/>',
      phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8 9.67a16 16 0 0 0 6.33 6.33l1.24-1.24a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z"/>',
      mail: '<path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/>',
      map: '<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
      arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      check: '<path d="M20 6 9 17l-5-5"/>'
    };
    return '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths[name] + "</svg>";
  }

  function renderShell() {
    var header = $("#site-header");
    var footer = $("#site-footer");
    var nav = links.map(function (item) {
      var active = item[1] === path ? ' aria-current="page"' : "";
      return '<a href="' + item[1] + '"' + active + ">" + item[0] + "</a>";
    }).join("");
   header.innerHTML =
  '<a class="brand" href="index.html">' +
'<img src="assets/images/logo.png" alt="NSV Infra Engineering Projects" class="logo-img">' +
  '</a>' +
  '<button class="nav-toggle" aria-label="Open navigation" aria-expanded="false">' + icon("menu") + '</button>' +
  '<nav class="site-nav" aria-label="Primary navigation">' + nav + '</nav>';
    footer.innerHTML =
      '<div class="footer-grid"><div><a class="brand footer-brand" href="index.html"><img src="assets/images/logo.png" alt="NSV Infra Engineering Projects" class="footer-logo"><span><strong>' + data.company.name + '</strong><small>Construction and Infrastructure</small></span></a><p>Engineering-led infrastructure development, road construction, layout development, and building projects across Telangana.</p></div>' +
      '<div><h3>Quick Links</h3>' + links.map(function (item) { return '<a href="' + item[1] + '">' + item[0] + '</a>'; }).join("") + '</div>' +
      '<div><h3>Services</h3>' + data.services.map(function (s) { return '<a href="services.html#' + slug(s.title) + '">' + s.title + '</a>'; }).join("") + '</div>' +
      '<div><h3>Contact</h3><p>' + data.company.address + '</p><p>' + data.company.phone + '</p><p>' + data.company.email + '</p><div class="socials"><a aria-label="LinkedIn" href="#">in</a><a aria-label="Instagram" href="https://www.instagram.com/ie.nsv.infra?igsh=MTI4ZDkzb2hqenczdg==" target="_blank">ig</a></div></div></div>' +
      '<div class="copyright">&copy; 2026 ' + data.company.name + '. All Rights Reserved.</div>';
    $(".nav-toggle").addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
      this.setAttribute("aria-expanded", document.body.classList.contains("nav-open"));
      this.innerHTML = document.body.classList.contains("nav-open") ? icon("x") : icon("menu");
    });
  }

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function initStats() {
    all("[data-count]").forEach(function (el) {
      var target = Number(el.dataset.count);
      var value = 0;
      var step = Math.max(1, Math.round(target / 48));
      var timer = setInterval(function () {
        value = Math.min(target, value + step);
        el.textContent = value + "+";
        if (value >= target) clearInterval(timer);
      }, 24);
    });
  }

  function initProjects() {
    var grid = $("#project-grid");
    if (!grid) return;
    var categories = ["All"].concat(Array.from(new Set(data.projects.map(function (p) { return p[0]; }))));
    $("#project-filters").innerHTML = categories.map(function (cat, i) {
      return '<button class="chip' + (i === 0 ? " active" : "") + '" data-filter="' + cat + '">' + cat + "</button>";
    }).join("");
    function render(filter) {
      grid.innerHTML = data.projects.filter(function (p) { return filter === "All" || p[0] === filter; }).map(function (p, index) {
       return '<article class="project-card" data-index="' + index + '">' +
'<div class="project-image placeholder ' +
(p[2] === "Adibatla" ? "adibatla-img" :
 p[0] === "Layout Projects" ? "layout-img" :
 p[0] === "Road Projects" ? "road-img" :
 "building-img")  +
'"><span>' + p[0].replace(" Projects","") + '</span></div>' +
'<div class="project-body"><span>' + p[0] + '</span><h3>' + p[1] + '</h3><p>' + p[3] + '</p><dl><dt>Location</dt><dd>' + p[2] + '</dd></dl><dl><dt>Completion</dt><dd>' + p[4] + '</dd></dl></div></article>';
      }).join("");
    }
    render("All");
    all("#project-filters button").forEach(function (button) {
      button.addEventListener("click", function () {
        all("#project-filters button").forEach(function (b) { b.classList.remove("active"); });
        button.classList.add("active");
        render(button.dataset.filter);
      });
    });
    grid.addEventListener("click", function (event) {
      var card = event.target.closest(".project-card");
      if (!card) return;
      var project = data.projects[Number(card.dataset.index)];
      $("#lightbox-title").textContent = project[1];
      $("#lightbox-text").textContent = project[2] + " | " + project[3] + " | Completion: " + project[4];
      $("#lightbox").classList.add("show");
    });
    $("#lightbox-close").addEventListener("click", function () { $("#lightbox").classList.remove("show"); });
  }

  function initForms() {
    all("form[data-success]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var box = document.createElement("div");
        box.className = "form-success";
        box.textContent = form.dataset.success;
        form.reset();
        form.appendChild(box);
        setTimeout(function () { box.remove(); }, 6000);
      });
    });
    var frame = $("#google-form-frame");
    if (frame) frame.src = data.company.googleFormUrl === "YOUR_GOOGLE_FORM_URL_HERE" ? "about:blank" : data.company.googleFormUrl;
    var map = $("#map-frame");
    if (map) map.src = data.company.mapEmbed;
  }

  function initWhatsApp() {
    var message = encodeURIComponent("Hello NSV Infra Engineering Projects,\nI am interested in your services.\n\nName:\nLocation:\nProject Type:\n\nPlease contact me.");
    var link = "https://wa.me/919177210909?text=" + message;
    var floating = $("#whatsapp-float");
    if (floating) floating.href = link;
    all("[data-whatsapp]").forEach(function (el) { el.href = link; });
  }

  renderShell();
  initStats();
  initProjects();
  initForms();
  initWhatsApp();
})();
