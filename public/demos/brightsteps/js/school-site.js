/**
 * BrightSteps — public campus page (school.html?s=slug).
 * Loads Super Admin locked blocks from API (persistent) then localStorage.
 */
(function () {
  "use strict";

  var ops = window.BrightStepsSchoolOps;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function querySlug() {
    try {
      var params = new URLSearchParams(window.location.search || "");
      return String(params.get("s") || params.get("slug") || "").trim();
    } catch (e) {
      return "";
    }
  }

  function isEditMode() {
    try {
      return new URLSearchParams(window.location.search || "").get("edit") === "1";
    } catch (e) {
      return false;
    }
  }

  function renderPage(school, page) {
    var root = document.getElementById("schoolSiteRoot");
    if (!root) return;
    document.title = school.name + " · BrightSteps";
    var brandStrong = document.getElementById("schoolBrandName");
    var brandTag = document.getElementById("schoolBrandTag");
    if (brandStrong) brandStrong.textContent = school.name;
    if (brandTag) brandTag.textContent = school.tagline || "Learn. Explore. Grow.";

    if (ops.isSchoolFeatureEnabled && !ops.isSchoolFeatureEnabled(school.id, "publicSite")) {
      root.innerHTML =
        '<section class="band"><div class="wrap" style="padding:3rem 1rem">' +
        "<h1>Website disabled</h1>" +
        "<p>Super Admin has disabled the public site for this school.</p>" +
        '<p><a class="btn-bsa btn-bsa-primary" href="/demos/brightsteps/schools.html">Browse schools</a></p>' +
        "</div></section>";
      return;
    }

    var blocks = (page && page.blocks) || [];
    var portal = "/demos/brightsteps/portal.html?school=" + encodeURIComponent(school.slug);
    var bodyHtml = blocks
      .map(function (b) {
        if (b.type === "hero") {
          return (
            '<section class="hero-fancy" id="top">' +
            '<div class="hero-fancy__grid"><div class="hero-fancy__copy">' +
            '<p class="eyebrow">' +
            escapeHtml(school.city || "Campus") +
            "</p>" +
            "<h1>" +
            escapeHtml(b.title || school.name) +
            "</h1>" +
            '<p class="hero-fancy__lead">' +
            escapeHtml(b.body || school.about || "") +
            "</p>" +
            '<div class="hero__actions">' +
            '<a class="btn-bsa btn-hero btn-hero-yellow" href="' +
            portal +
            '">Student portal</a>' +
            '<a class="btn-bsa btn-hero btn-hero-outline" href="/demos/brightsteps/contact.html">Contact</a>' +
            "</div></div>" +
            '<div class="hero-stage"><div class="hero-stage__back" role="img" aria-label="' +
            escapeHtml(school.name) +
            '"></div>' +
            '<div class="hero-stage__mid"><img src="/demos/brightsteps/img/photo-1503676260728-1c00da094a0b.jpg" alt="Students learning" loading="eager" /></div>' +
            "</div></div></section>"
          );
        }
        return (
          '<section class="band"><div class="wrap" style="padding:1.5rem 1rem 2rem;max-width:960px;margin:0 auto">' +
          '<h2 style="font-family:Fredoka,sans-serif">' +
          escapeHtml(b.title || "") +
          "</h2>" +
          "<p>" +
          escapeHtml(b.body || "") +
          "</p></div></section>"
        );
      })
      .join("");

    if (!bodyHtml) {
      bodyHtml =
        '<section class="band"><div class="wrap" style="padding:2rem 1rem"><h1>' +
        escapeHtml(school.name) +
        "</h1><p>" +
        escapeHtml(school.about || "") +
        "</p></div></section>";
    }

    root.innerHTML =
      bodyHtml +
      '<section class="band"><div class="wrap" style="padding:1rem 1rem 3rem;max-width:960px;margin:0 auto">' +
      '<a class="btn-bsa btn-bsa-primary" href="' +
      portal +
      '">Accedi / Portal</a> ' +
      '<a class="btn-bsa btn-bsa-soft" href="/demos/brightsteps/schools.html">All campuses</a>' +
      (page && page.updatedBy
        ? "<p class='text-muted small' style='margin-top:1rem'>Site locked by Super Admin (" +
          escapeHtml(page.updatedBy) +
          ")</p>"
        : "") +
      "</div></section>";
  }

  function boot() {
    var root = document.getElementById("schoolSiteRoot");
    if (!root || !ops || !ops.getSchoolBySlug) return;
    if (isEditMode()) return; // visual editor owns the page

    ops.loadSchools();
    var slug = querySlug();
    var school = slug ? ops.getSchoolBySlug(slug) : null;
    if (!school || school.publicEnabled === false) {
      root.innerHTML =
        '<section class="band"><div class="wrap" style="padding:3rem 1rem">' +
        "<h1>Campus not found</h1>" +
        "<p>This school website is not published yet.</p>" +
        '<p><a class="btn-bsa btn-bsa-primary" href="/demos/brightsteps/schools.html">Browse schools</a></p>' +
        "</div></section>";
      return;
    }

    var localPage = ops.getSchoolPage(school.id);
    if (ops.fetchSchoolPageRemote) {
      ops.fetchSchoolPageRemote(school.id, school.slug).then(function (remote) {
        renderPage(school, remote || localPage);
      });
    } else {
      renderPage(school, localPage);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
