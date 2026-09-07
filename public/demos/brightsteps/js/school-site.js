/**
 * BrightSteps — public campus page (school.html?s=slug).
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

  function boot() {
    var root = document.getElementById("schoolSiteRoot");
    if (!root) return;
    if (!ops || !ops.getSchoolBySlug || !ops.loadSchools) {
      root.innerHTML =
        '<section class="band"><div class="wrap"><p class="text-muted">School directory unavailable.</p></div></section>';
      return;
    }
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
      document.title = "Campus not found · BrightSteps";
      return;
    }

    document.title = school.name + " · BrightSteps";
    var brandStrong = document.getElementById("schoolBrandName");
    var brandTag = document.getElementById("schoolBrandTag");
    if (brandStrong) brandStrong.textContent = school.name;
    if (brandTag) brandTag.textContent = school.tagline || "Learn. Explore. Grow.";

    root.innerHTML =
      '<section class="hero-fancy" id="top">' +
      '<div class="hero-fancy__grid"><div class="hero-fancy__copy">' +
      '<p class="eyebrow">' +
      escapeHtml(school.city || "Campus") +
      "</p>" +
      "<h1>" +
      escapeHtml(school.name) +
      "</h1>" +
      '<p class="hero-fancy__lead">' +
      escapeHtml(school.about || school.tagline || "A welcoming school community.") +
      "</p>" +
      '<div class="hero__actions">' +
      '<a class="btn-bsa btn-hero btn-hero-yellow" href="/demos/brightsteps/portal.html">Student portal</a>' +
      '<a class="btn-bsa btn-hero btn-hero-outline" href="/demos/brightsteps/contact.html">Contact</a>' +
      "</div></div>" +
      '<div class="hero-stage"><div class="hero-stage__back" role="img" aria-label="' +
      escapeHtml(school.name) +
      '"></div>' +
      '<div class="hero-stage__mid"><img src="/demos/brightsteps/img/photo-1503676260728-1c00da094a0b.jpg" alt="Students learning" loading="eager" /></div>' +
      "</div></div></section>" +
      '<section class="band"><div class="wrap" style="padding:2rem 1rem 3rem">' +
      "<h2>Welcome</h2>" +
      "<p>" +
      escapeHtml(school.about || "Families, teachers and students share one campus portal.") +
      "</p>" +
      "<p><strong>City:</strong> " +
      escapeHtml(school.city || "—") +
      "</p>" +
      (school.principalEmail
        ? "<p><strong>Office:</strong> " + escapeHtml(school.principalEmail) + "</p>"
        : "") +
      '<p style="margin-top:1.25rem"><a class="btn-bsa btn-bsa-primary" href="/demos/brightsteps/portal.html">Accedi / Portal</a> ' +
      '<a class="btn-bsa btn-bsa-soft" href="/demos/brightsteps/schools.html">All campuses</a></p>' +
      "</div></section>";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
