/**
 * BrightSteps — admin desks are desktop-only; student/teacher/parent stay mobile-ok.
 */
(function (global) {
  "use strict";

  function isMobileViewport() {
    try {
      if (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) return true;
    } catch (e) {}
    return false;
  }

  function isMobileUa() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
      String(navigator.userAgent || "")
    );
  }

  function isTouchPhone() {
    return isMobileUa() || (isMobileViewport() && "ontouchstart" in window && screen.width < 1024);
  }

  function isAdminRole(role) {
    var r = String(role || "");
    return r === "admin" || r === "superadmin" || r === "headmaster";
  }

  function showNotAccessible() {
    try {
      document.documentElement.innerHTML =
        '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" />' +
        '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
        "<title>Not accessible</title>" +
        "<style>" +
        "body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;" +
        "font-family:Nunito,Segoe UI,sans-serif;background:#f4f7fb;color:#1b1f33;padding:1.5rem;text-align:center}" +
        "h1{font-family:Fredoka,Nunito,sans-serif;font-size:1.6rem;margin:0 0 0.6rem}" +
        "p{margin:0;opacity:0.85;max-width:22rem;line-height:1.5}" +
        "</style></head><body>" +
        "<div><h1>Not accessible</h1>" +
        "<p>This area is not available on mobile devices. Please use a desktop or laptop computer.</p>" +
        "</div></body></html>";
    } catch (e) {
      document.body.textContent = "Not accessible";
    }
  }

  /** Call on admin/platform pages. Returns true if blocked. */
  function guardAdminDesktopOnly(session) {
    if (!session || !isAdminRole(session.role)) return false;
    if (!isTouchPhone()) return false;
    showNotAccessible();
    return true;
  }

  global.BrightStepsMobileGate = {
    isMobile: isTouchPhone,
    isAdminRole: isAdminRole,
    showNotAccessible: showNotAccessible,
    guardAdminDesktopOnly: guardAdminDesktopOnly,
  };
})(window);
