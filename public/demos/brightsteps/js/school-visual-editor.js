/**
 * BrightSteps visual website editor (Super Admin) — WYSIWYG over live school page.
 * Pattern inspired by Ali portfolio /admin/preview EditableSite: drag handles + autosave.
 */
(function () {
  "use strict";

  var auth = window.BrightStepsDemoAuth;
  var ops = window.BrightStepsSchoolOps;
  if (!ops) return;

  function queryFlag(name) {
    try {
      return new URLSearchParams(window.location.search || "").get(name);
    } catch (e) {
      return null;
    }
  }

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function persistRemote(school, blocks, session) {
    return fetch("/api/demos/brightsteps/school-sites", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schoolId: school.id,
        slug: school.slug,
        blocks: blocks,
        updatedBy: session.name || "Super Admin",
        token: "superadmin",
      }),
    })
      .then(function (r) {
        return r.json();
      })
      .catch(function () {
        return { ok: false };
      });
  }

  function collectBlocks(root) {
    return Array.prototype.slice.call(root.querySelectorAll("[data-ve-block]")).map(function (el, i) {
      var titleEl = el.querySelector("[data-ve-title]");
      var bodyEl = el.querySelector("[data-ve-body]");
      return {
        id: el.getAttribute("data-ve-id") || "b-" + i,
        type: el.getAttribute("data-ve-type") || "about",
        title: titleEl ? titleEl.textContent.trim() : "",
        body: bodyEl ? bodyEl.textContent.trim() : "",
      };
    });
  }

  function saveAll(school, session, root, statusEl) {
    var blocks = collectBlocks(root);
    var local = ops.saveSchoolPage(school.id, blocks, session);
    if (statusEl) statusEl.textContent = "Saving…";
    return persistRemote(school, blocks, session).then(function (res) {
      if (statusEl) {
        statusEl.textContent = res && res.ok ? "Saved permanently ✓" : local.ok ? "Saved locally (server sync pending)" : "Save failed";
      }
      if (window.showToast) {
        window.showToast(
          res && res.ok ? "Website saved (locked for school admins)." : local.ok ? "Saved in browser; server sync failed." : "Could not save.",
          res && res.ok ? "success" : "error"
        );
      }
      return res;
    });
  }

  function mountEditor(school, session, page) {
    var bar = document.createElement("div");
    bar.className = "sa-ve-bar";
    bar.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:0.65rem;align-items:center;justify-content:space-between;padding:0.65rem 1rem;background:linear-gradient(100deg,#0b4fbf,#1565d8);color:#fff;position:sticky;top:0;z-index:50">' +
      "<div><strong>Visual editor</strong> · " +
      esc(school.name) +
      ' <span style="opacity:0.8">— visitors never see this bar</span></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center">' +
      '<span id="saVeStatus" style="opacity:0.9;font-size:0.85rem">Ready</span>' +
      '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" id="saVeSave">Save</button>' +
      '<a class="btn-bsa btn-bsa-sm btn-bsa-ghost" style="border-color:rgba(255,255,255,0.4);color:#fff" href="/demos/brightsteps/platform.html">Platform</a>' +
      '<a class="btn-bsa btn-bsa-sm btn-bsa-ghost" style="border-color:rgba(255,255,255,0.4);color:#fff" href="' +
      esc(ops.publicSitePath(school)) +
      '">Exit edit</a>' +
      "</div></div>";
    document.body.insertBefore(bar, document.body.firstChild);

    var root = document.getElementById("schoolSiteRoot");
    if (!root) return;

    var blocks = (page && page.blocks) || ops.defaultPageBlocks(school);
    root.innerHTML = blocks
      .map(function (b, i) {
        return (
          '<section class="band sa-ve-block" data-ve-block data-ve-id="' +
          esc(b.id || "b-" + i) +
          '" data-ve-type="' +
          esc(b.type || "about") +
          '" draggable="true" style="position:relative;padding:1.25rem 1rem;border-bottom:1px dashed #c5d8f0">' +
          '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft sa-ve-handle" style="position:absolute;top:0.75rem;right:1rem;cursor:grab">Drag</button>' +
          '<div class="wrap" style="max-width:960px;margin:0 auto">' +
          '<p class="text-muted small" style="margin:0 0 0.35rem">' +
          esc(b.type || "block") +
          "</p>" +
          '<h2 data-ve-title contenteditable="true" style="font-family:Fredoka,sans-serif;outline:2px dashed transparent;border-radius:8px;padding:0.15rem 0.25rem">' +
          esc(b.title || "") +
          "</h2>" +
          '<p data-ve-body contenteditable="true" style="outline:2px dashed transparent;border-radius:8px;padding:0.15rem 0.25rem;min-height:2.5rem">' +
          esc(b.body || "") +
          "</p>" +
          "</div></section>"
        );
      })
      .join("");

    var statusEl = document.getElementById("saVeStatus");
    var saveBtn = document.getElementById("saVeSave");
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        saveAll(school, session, root, statusEl);
      });
    }

    var dragEl = null;
    root.querySelectorAll("[data-ve-block]").forEach(function (block) {
      var handle = block.querySelector(".sa-ve-handle");
      block.addEventListener("dragstart", function (ev) {
        if (handle && ev.target !== handle && !handle.contains(ev.target)) {
          ev.preventDefault();
          return;
        }
        dragEl = block;
        block.style.opacity = "0.55";
      });
      block.addEventListener("dragend", function () {
        block.style.opacity = "1";
        dragEl = null;
        saveAll(school, session, root, statusEl);
      });
      block.addEventListener("dragover", function (ev) {
        ev.preventDefault();
      });
      block.addEventListener("drop", function (ev) {
        ev.preventDefault();
        if (!dragEl || dragEl === block) return;
        var kids = Array.prototype.slice.call(root.children);
        var from = kids.indexOf(dragEl);
        var to = kids.indexOf(block);
        if (from < 0 || to < 0) return;
        if (from < to) root.insertBefore(dragEl, block.nextSibling);
        else root.insertBefore(dragEl, block);
      });
    });

    var saveTimer = null;
    root.querySelectorAll("[contenteditable]").forEach(function (el) {
      el.addEventListener("focus", function () {
        el.style.outlineColor = "#7aa7e8";
      });
      el.addEventListener("blur", function () {
        el.style.outlineColor = "transparent";
        saveAll(school, session, root, statusEl);
      });
      el.addEventListener("input", function () {
        if (statusEl) statusEl.textContent = "Unsaved…";
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
          saveAll(school, session, root, statusEl);
        }, 500);
      });
    });

    window.addEventListener("beforeunload", function () {
      try {
        var blocksNow = collectBlocks(root);
        ops.saveSchoolPage(school.id, blocksNow, session);
      } catch (e) {}
    });
  }

  function boot() {
    if (queryFlag("edit") !== "1") return;
    var session = auth && auth.getSession ? auth.getSession() : null;
    if (!session || session.role !== "superadmin") {
      window.location.replace("/demos/brightsteps/login.html");
      return;
    }
    if (
      window.BrightStepsMobileGate &&
      window.BrightStepsMobileGate.guardAdminDesktopOnly(session)
    ) {
      return;
    }
    var slug = String(queryFlag("s") || queryFlag("slug") || "").trim();
    ops.loadSchools();
    var school = slug ? ops.getSchoolBySlug(slug) : null;
    if (!school) return;

    // Prefer server page, then local
    fetch("/api/demos/brightsteps/school-sites?schoolId=" + encodeURIComponent(school.id))
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var page =
          data && data.ok && data.found && data.blocks && data.blocks.length
            ? { blocks: data.blocks, updatedBy: data.updatedBy, updatedAt: data.updatedAt }
            : ops.getSchoolPage(school.id);
        // Wait a tick so school-site.js may have run; we replace root for edit mode
        setTimeout(function () {
          mountEditor(school, session, page);
        }, 50);
      })
      .catch(function () {
        setTimeout(function () {
          mountEditor(school, session, ops.getSchoolPage(school.id));
        }, 50);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
