/**
 * BrightSteps Super Admin platform home (full website — no school dashboard sidebar).
 */
(function () {
  "use strict";

  var auth = window.BrightStepsDemoAuth;
  var ops = window.BrightStepsSchoolOps;
  if (!auth || !ops) return;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function boot() {
    var session = auth.requireAuth(["superadmin"]);
    if (!session) return;
    if (
      window.BrightStepsMobileGate &&
      window.BrightStepsMobileGate.guardAdminDesktopOnly(session)
    ) {
      return;
    }
    // Leaving school desk when on platform
    if (ops.setActiveSchoolId) ops.setActiveSchoolId("");

    var barUser = document.getElementById("saBarUser");
    if (barUser) barUser.textContent = session.name + " · Super Admin";

    var logout = document.getElementById("saLogout");
    if (logout) {
      logout.addEventListener("click", function (e) {
        e.preventDefault();
        auth.logout();
      });
    }

    renderSchools();
    renderSecurityPicker();
    wireCreate();
  }

  function renderSchools() {
    var grid = document.getElementById("saSchoolGrid");
    if (!grid) return;
    var schools = ops.loadSchools() || [];
    if (!schools.length) {
      grid.innerHTML = "<p class='text-muted'>No schools yet. Create one below.</p>";
      return;
    }
    grid.innerHTML = schools
      .map(function (s) {
        var site = ops.publicSitePath(s);
        var edit = site + (site.indexOf("?") >= 0 ? "&" : "?") + "edit=1";
        var portal = "/demos/brightsteps/portal.html?school=" + encodeURIComponent(s.slug);
        var desk =
          "/demos/brightsteps/dashboard.html?enter=" + encodeURIComponent(s.id);
        return (
          '<article class="sa-school-card">' +
          "<h3>" +
          esc(s.name) +
          "</h3>" +
          "<p class='text-muted' style='margin:0 0 0.85rem'>" +
          esc(s.city || "") +
          " · /" +
          esc(s.slug || "") +
          "</p>" +
          '<div style="display:flex;flex-wrap:wrap;gap:0.4rem">' +
          '<a class="btn-bsa btn-bsa-primary btn-bsa-sm" href="' +
          esc(edit) +
          '">Edit website</a>' +
          '<a class="btn-bsa btn-bsa-soft btn-bsa-sm" href="' +
          esc(site) +
          '" target="_blank" rel="noopener">View live</a>' +
          '<a class="btn-bsa btn-bsa-soft btn-bsa-sm" href="' +
          esc(portal) +
          '">School portal</a>' +
          '<a class="btn-bsa btn-bsa-ghost btn-bsa-sm" href="' +
          esc(desk) +
          '">Open school desk</a>' +
          '<button type="button" class="btn-bsa btn-bsa-soft btn-bsa-sm" data-sec-pick="' +
          esc(s.id) +
          '">Security</button>' +
          "</div></article>"
        );
      })
      .join("");

    grid.querySelectorAll("[data-sec-pick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showSchoolSecurity(btn.getAttribute("data-sec-pick"));
        var el = document.getElementById("security");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function showSchoolSecurity(schoolId) {
    var host = document.getElementById("saSecurityHost");
    var school = ops.getSchoolById(schoolId);
    var session = auth.getSession();
    if (!host || !school || !session) return;
    var sa = window.BrightStepsSuperAdmin;
    if (sa && sa.securityPanelHtml) {
      host.innerHTML = sa.securityPanelHtml(school, session, ops, esc);
      host.querySelectorAll("[data-sec-toggle]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var key = btn.getAttribute("data-sec-toggle");
          var sid = btn.getAttribute("data-sec-school");
          var val = btn.getAttribute("data-sec-value") === "1";
          var patch = {};
          patch[key] = val;
          var res = ops.setSchoolSecurity(sid, patch, session);
          if (window.showToast) {
            window.showToast(res.ok ? "Security updated (locked)." : res.message || "Failed", res.ok ? "success" : "error");
          }
          showSchoolSecurity(sid);
        });
      });
    }
  }

  function renderSecurityPicker() {
    var host = document.getElementById("saSecurityHost");
    if (!host) return;
    var schools = ops.loadSchools() || [];
    host.innerHTML =
      "<p>Select a school:</p><div style='display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem'>" +
      schools
        .map(function (s) {
          return (
            '<button type="button" class="btn-bsa btn-bsa-soft btn-bsa-sm" data-sec-pick="' +
            esc(s.id) +
            '">' +
            esc(s.name) +
            "</button>"
          );
        })
        .join("") +
      "</div><div id='saSecDetail'></div>";
    host.querySelectorAll("[data-sec-pick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showSchoolSecurity(btn.getAttribute("data-sec-pick"));
      });
    });
  }

  function wireCreate() {
    var form = document.getElementById("saCreateSchoolForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var session = auth.getSession();
      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var city = (form.querySelector('[name="city"]') || {}).value || "";
      var slug = (form.querySelector('[name="slug"]') || {}).value || "";
      var tagline = (form.querySelector('[name="tagline"]') || {}).value || "";
      var about = (form.querySelector('[name="about"]') || {}).value || "";
      var pName = (form.querySelector('[name="principalName"]') || {}).value || "";
      var pEmail = (form.querySelector('[name="principalEmail"]') || {}).value || "";
      var pPass = (form.querySelector('[name="principalPassword"]') || {}).value || "Demo@12345";
      var created = ops.upsertSchool({
        name: name,
        city: city,
        slug: slug,
        tagline: tagline,
        about: about,
        principalEmail: pEmail,
        publicEnabled: true,
      });
      if (!created.ok) {
        if (window.showToast) window.showToast(created.message, "error");
        return;
      }
      var msg = "School created: " + created.school.name;
      if (String(pName).trim() && String(pEmail).trim()) {
        var principal = auth.addAdminAccount({
          name: pName,
          email: pEmail,
          password: pPass,
          position: "full",
          className: created.school.name,
          schoolName: created.school.name,
          schoolId: created.school.id,
        });
        if (principal.ok) {
          ops.upsertSchool({
            id: created.school.id,
            name: created.school.name,
            city: created.school.city,
            slug: created.school.slug,
            tagline: created.school.tagline,
            about: created.school.about,
            principalEmail: principal.email,
            publicEnabled: true,
          });
          msg += " · Principal " + principal.email + " / " + principal.password;
        } else {
          msg += " · Principal failed: " + principal.message;
        }
      }
      if (window.showToast) window.showToast(msg, "success");
      form.reset();
      renderSchools();
      renderSecurityPicker();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
