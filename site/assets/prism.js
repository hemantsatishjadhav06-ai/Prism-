(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- Agent board: ARIA tabs with roving tabindex ---------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));

  function select(idx, focus) {
    tabs.forEach(function (tab, i) {
      var on = i === idx;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (panel, i) {
      panel.hidden = i !== idx;
    });
    if (focus) tabs[idx].focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(i, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    });
  });

  /* ---------------- Section nav: scroll-spy ---------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".sectionnav a"));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-140px 0px -65% 0px", threshold: 0 });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---------------- Reveal on scroll (progressive, motion-safe) ---------------- */
  if (!reduced.matches && "IntersectionObserver" in window) {
    var blocks = Array.prototype.slice.call(
      document.querySelectorAll(".section-head, .rule-grid, .board, .formula, .notes, .gates, .diag, .railbar, .fns")
    );
    blocks.forEach(function (el) { el.classList.add("reveal"); });
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    blocks.forEach(function (el) { reveal.observe(el); });
  }
})();

/* ---------------- Mobile navigation drawer ---------------- */
(function () {
  "use strict";
  var toggle = document.querySelector("[data-nav-toggle]");
  var drawer = document.getElementById("nav-drawer");
  if (!toggle || !drawer) return;

  function setOpen(open) {
    drawer.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setOpen(!drawer.classList.contains("is-open"));
  });

  // Escape closes it, and focus goes back to the control that opened it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Leaving the mobile breakpoint should not strand the drawer open.
  var wide = window.matchMedia("(min-width: 900px)");
  var onChange = function (e) { if (e.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener("change", onChange);
  else if (wide.addListener) wide.addListener(onChange);
})();

/* ---------------- Contact form ----------------
   Progressive enhancement over a real <form>. If the API is unreachable
   (wrong origin, CORS, backend down) the visitor still gets a working way to
   reach us rather than a dead button. */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var button = form.querySelector('button[type="submit"]');

  function say(text, tone) {
    status.textContent = text;
    status.style.color = tone === "error" ? "#BE123C" : tone === "ok" ? "#047857" : "";
  }

  function mailtoFallback(data) {
    var body =
      "Name: " + data.name + "\nEmail: " + data.email +
      "\nCompany: " + (data.company || "-") + "\nPhone: " + (data.phone || "-") +
      "\nService: " + (data.service_interest || "-") + "\n\n" + data.message;
    return "mailto:info@prism.inc?subject=" +
      encodeURIComponent("Website inquiry — " + (data.company || data.name)) +
      "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = String(value).trim(); });

    if (!data.name || !data.email || !data.message) {
      say("Please fill in your name, email and a message.", "error");
      return;
    }

    button.disabled = true;
    say("Sending…");

    fetch(form.dataset.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        form.reset();
        say("Inquiry sent. An IDR specialist will reach out within one business day.", "ok");
      })
      .catch(function () {
        status.innerHTML =
          'We couldn\'t submit that automatically. ' +
          '<a href="' + mailtoFallback(data) + '">Send it as an email instead</a> ' +
          "— your answers are already filled in.";
        status.style.color = "#B45309";
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
