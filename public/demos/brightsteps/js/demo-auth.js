/**
 * BrightSteps static demo — client-side login (no external backend).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "brightsteps-demo-session";
  var LOGIN_PATH = "/demos/brightsteps/login.html";
  var DASHBOARD_PATH = "/demos/brightsteps/dashboard.html";

  var USERS = {
    student_demo: {
      password: "Demo@12345",
      role: "student",
      name: "Alex Rivera",
      roleLabel: "Student",
      className: "Grade 4 · Maple Class",
    },
    parent_demo: {
      password: "Demo@12345",
      role: "parent",
      name: "Amelia Johnson",
      roleLabel: "Parent / Guardian",
      className: "Linked child: Alex Rivera",
    },
    teacher_demo: {
      password: "Demo@12345",
      role: "teacher",
      name: "Sarah Wilson",
      roleLabel: "Teacher",
      className: "Maple Class · Homeroom",
    },
    "grace.okonkwo@brightsteps.academy": {
      password: "Demo@12345",
      role: "headmaster",
      name: "Grace Okonkwo",
      roleLabel: "Headmaster",
      className: "BrightSteps Academy",
    },
    "admin@brightfuture.academy": {
      password: "Demo@12345",
      role: "admin",
      name: "School Administrator",
      roleLabel: "School Admin",
      className: "BrightFuture Academy",
    },
    "superadmin@platform.com": {
      password: "Demo@12345",
      role: "superadmin",
      name: "Platform Super Admin",
      roleLabel: "Super Admin",
      className: "All schools",
    },
  };

  function normalizeLogin(value) {
    return String(value || "").trim().toLowerCase();
  }

  function readSession() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        var remembered = localStorage.getItem(STORAGE_KEY);
        raw = remembered;
      }
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeSession(session, remember) {
    var payload = JSON.stringify(session);
    sessionStorage.setItem(STORAGE_KEY, payload);
    if (remember) localStorage.setItem(STORAGE_KEY, payload);
    else localStorage.removeItem(STORAGE_KEY);
  }

  function clearSession() {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  }

  function login(loginId, password, remember) {
    var key = normalizeLogin(loginId);
    var user = USERS[key];
    if (!user || user.password !== password) {
      return { ok: false, message: "Invalid login ID or password." };
    }

    var session = {
      login: key,
      role: user.role,
      name: user.name,
      roleLabel: user.roleLabel,
      className: user.className,
      loggedInAt: Date.now(),
    };
    writeSession(session, !!remember);
    return { ok: true, session: session };
  }

  function logout() {
    clearSession();
    window.location.href = LOGIN_PATH;
  }

  function requireAuth(allowedRoles) {
    var session = readSession();
    if (!session) {
      window.location.href = LOGIN_PATH;
      return null;
    }
    if (allowedRoles && allowedRoles.length && allowedRoles.indexOf(session.role) === -1) {
      window.location.href = DASHBOARD_PATH;
      return null;
    }
    return session;
  }

  window.BrightStepsDemoAuth = {
    login: login,
    logout: logout,
    getSession: readSession,
    requireAuth: requireAuth,
    paths: { login: LOGIN_PATH, dashboard: DASHBOARD_PATH },
  };
})();
