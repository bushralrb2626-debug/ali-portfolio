/**
 * BrightSteps Super Admin — hub, per-school security, drag-drop site editor.
 */
(function (global) {
  "use strict";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function activeSchool(ops) {
    if (!ops || !ops.getActiveSchoolId) return null;
    var id = ops.getActiveSchoolId();
    return id && ops.getSchoolById ? ops.getSchoolById(id) : null;
  }

  function hubHtml(ops, escapeHtml) {
    var e = escapeHtml || esc;
    var schools = ops && ops.loadSchools ? ops.loadSchools() : [];
    var active = activeSchool(ops);
    var cards = schools
      .map(function (s) {
        var path = ops.publicSitePath ? ops.publicSitePath(s) : "/demos/brightsteps/school.html?s=" + encodeURIComponent(s.slug);
        var portal = "/demos/brightsteps/portal.html?school=" + encodeURIComponent(s.slug);
        var isActive = active && active.id === s.id;
        return (
          '<article class="dash-panel" style="margin-bottom:0.85rem">' +
          '<div class="dash-panel__head"><h3>' +
          e(s.name) +
          (isActive ? ' <span class="text-muted small">(open desk)</span>' : "") +
          "</h3></div>" +
          "<p class='text-muted'>" +
          e(s.city || "") +
          " · /" +
          e(s.slug || "") +
          "</p>" +
          '<div style="display:flex;flex-wrap:wrap;gap:0.5rem">' +
          '<button type="button" class="btn-bsa btn-bsa-primary btn-bsa-sm" data-enter-school="' +
          e(s.id) +
          '">Enter school desk</button>' +
          '<a class="btn-bsa btn-bsa-soft btn-bsa-sm" href="' +
          e(portal) +
          '">School portal</a>' +
          '<a class="btn-bsa btn-bsa-soft btn-bsa-sm" href="' +
          e(path) +
          '" target="_blank" rel="noopener">Public site</a>' +
          '<button type="button" class="btn-bsa btn-bsa-soft btn-bsa-sm" data-enter-school="' +
          e(s.id) +
          '" data-goto-section="school-security">Security</button>' +
          '<button type="button" class="btn-bsa btn-bsa-soft btn-bsa-sm" data-enter-school="' +
          e(s.id) +
          '" data-goto-section="edit-site">Edit website</button>' +
          "</div></article>"
        );
      })
      .join("");
    return (
      '<div class="welcome-banner"><h2>Super Admin hub</h2><p>Open any school desk, portal, or public site. Security and website edits you make are permanent and cannot be changed by school admins.</p></div>' +
      (active
        ? '<p><button type="button" class="btn-bsa btn-bsa-ghost btn-bsa-sm" data-exit-school>Exit school desk (' +
          e(active.name) +
          ")</button></p>"
        : "") +
      (cards || "<p class='text-muted'>No schools yet — create one under Schools.</p>")
    );
  }

  function securityPanelHtml(school, session, ops, escapeHtml) {
    var e = escapeHtml || esc;
    if (!school || !ops || !ops.getSchoolSecurity) {
      return "<p class='text-muted'>Select a school from the hub first.</p>";
    }
    var sec = ops.getSchoolSecurity(school.id);
    var labels = ops.securityLabels || {};
    var rows = Object.keys(ops.defaultSchoolSecurity || sec)
      .filter(function (k) {
        return k !== "updatedAt" && k !== "updatedBy" && k !== "superLocked";
      })
      .map(function (key) {
        var on = !!sec[key];
        return (
          "<tr><td>" +
          e(labels[key] || key) +
          "</td><td>" +
          (on ? "<strong>Enabled</strong>" : "<span class='text-muted'>Disabled</span>") +
          '</td><td><button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-sec-toggle="' +
          e(key) +
          '" data-sec-school="' +
          e(school.id) +
          '" data-sec-value="' +
          (on ? "0" : "1") +
          '">' +
          (on ? "Disable" : "Enable") +
          "</button></td></tr>"
        );
      })
      .join("");
    return (
      '<div class="welcome-banner"><h2>Security · ' +
      e(school.name) +
      "</h2><p>Only Super Admin can change these. School admins cannot override.</p></div>" +
      '<div class="dash-panel"><div class="dash-panel__head"><h3>Portal &amp; feature switches</h3></div>' +
      '<div class="table-responsive"><table class="dash-table"><thead><tr><th>Setting</th><th>Status</th><th>Action</th></tr></thead><tbody>' +
      rows +
      "</tbody></table></div>" +
      (sec.updatedAt
        ? "<p class='text-muted small'>Last changed " + e(String(sec.updatedAt).replace("T", " ").slice(0, 16)) + " by " + e(sec.updatedBy || "Super Admin") + "</p>"
        : "") +
      "</div>"
    );
  }

  function siteEditorHtml(school, session, ops, escapeHtml) {
    var e = escapeHtml || esc;
    if (!school || !ops || !ops.getSchoolPage) {
      return "<p class='text-muted'>Enter a school desk first, then open Edit website.</p>";
    }
    var page = ops.getSchoolPage(school.id);
    var blocks = (page.blocks || [])
      .map(function (b, i) {
        return (
          '<article class="dash-panel sa-block" draggable="true" data-block-index="' +
          i +
          '" style="cursor:grab;margin-bottom:0.75rem">' +
          '<div class="dash-panel__head"><h3>⋮⋮ ' +
          e(b.type || "block") +
          "</h3></div>" +
          '<label>Title<input data-block-field="title" data-block-index="' +
          i +
          '" value="' +
          e(b.title || "") +
          '" /></label>' +
          '<label>Body<textarea data-block-field="body" data-block-index="' +
          i +
          '" rows="2">' +
          e(b.body || "") +
          "</textarea></label>" +
          "</article>"
        );
      })
      .join("");
    return (
      '<div class="welcome-banner"><h2>Edit website · ' +
      e(school.name) +
      "</h2><p>Drag blocks to reorder. Save makes this permanent — school admins cannot change it.</p></div>" +
      '<div id="saSiteBlocks">' +
      blocks +
      "</div>" +
      '<p><button type="button" class="btn-bsa btn-bsa-primary" data-save-site="' +
      e(school.id) +
      '">Save website (locked)</button> ' +
      '<a class="btn-bsa btn-bsa-soft" href="' +
      e(ops.publicSitePath(school)) +
      '" target="_blank" rel="noopener">Preview</a></p>'
    );
  }

  function portalSecurityBanner(school, ops, session, escapeHtml) {
    var e = escapeHtml || esc;
    if (!session || session.role !== "superadmin" || !school || !ops) return "";
    var sec = ops.getSchoolSecurity(school.id);
    var labels = ops.securityLabels || {};
    var toggles = Object.keys(ops.defaultSchoolSecurity || {})
      .map(function (key) {
        var on = !!sec[key];
        return (
          '<label style="display:flex;align-items:center;gap:0.4rem;margin:0.35rem 0">' +
          '<input type="checkbox" data-portal-sec="' +
          e(key) +
          '" data-sec-school="' +
          e(school.id) +
          '"' +
          (on ? " checked" : "") +
          " /> " +
          e(labels[key] || key) +
          "</label>"
        );
      })
      .join("");
    return (
      '<section class="band" style="background:#eef5ff;border-bottom:1px solid #c5d8f0;padding:1rem">' +
      '<div class="wrap" style="max-width:960px;margin:0 auto">' +
      "<h2 style=\"font-family:Fredoka,sans-serif;font-size:1.2rem;margin:0 0 0.5rem\">Super Admin security · " +
      e(school.name) +
      "</h2>" +
      "<p class='text-muted small'>Enable / disable portals for this school. Locked from school admins.</p>" +
      toggles +
      '<p style="margin-top:0.75rem"><button type="button" class="btn-bsa btn-bsa-primary btn-bsa-sm" id="saPortalSecSave">Save security</button></p>' +
      "</div></section>"
    );
  }

  global.BrightStepsSuperAdmin = {
    hubHtml: hubHtml,
    securityPanelHtml: securityPanelHtml,
    siteEditorHtml: siteEditorHtml,
    portalSecurityBanner: portalSecurityBanner,
    activeSchool: activeSchool,
  };
})(window);
