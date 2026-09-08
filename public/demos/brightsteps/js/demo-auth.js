/**
 * BrightSteps static demo — client-side login / registration (no backend).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "brightsteps-demo-session";
  var USERS_KEY = "brightsteps-demo-users";
  var LOCKS_KEY = "brightsteps-demo-locks";
  var REMOVED_KEY = "brightsteps-demo-removed";
  var LOGIN_PATH = "/demos/brightsteps/login.html";
  var REGISTER_PATH = "/demos/brightsteps/register.html";
  var DASHBOARD_PATH = "/demos/brightsteps/dashboard.html";
  var PLATFORM_PATH = "/demos/brightsteps/platform.html";
  var DEMO_PASSWORD = "Demo@12345";

  /** School-admin desk positions (role stays "admin"; access is scoped by position). */
  var ADMIN_POSITIONS = {
    full: {
      id: "full",
      label: "School Admin (full access)",
      shortLabel: "School Admin",
      sections: null,
    },
    fees: {
      id: "fees",
      label: "Fees Managing Admin",
      shortLabel: "Fees Admin",
      sections: ["home", "fees", "students", "parents"],
    },
    accounts: {
      id: "accounts",
      label: "Account Admin",
      shortLabel: "Account Admin",
      sections: ["home", "fees", "staff", "students", "slorsh-reports"],
    },
    admissions: {
      id: "admissions",
      label: "Admissions Admin",
      shortLabel: "Admissions Admin",
      sections: ["home", "meetings", "book-visit", "parents", "students"],
    },
    academics: {
      id: "academics",
      label: "Academics Admin",
      shortLabel: "Academics Admin",
      sections: ["home", "results", "attendance", "classrooms", "staff", "students", "announce"],
    },
    communications: {
      id: "communications",
      label: "Communications Admin",
      shortLabel: "Comms Admin",
      sections: ["home", "announce", "feedback", "meetings"],
    },
  };

  var BUILTIN = {
    student_demo: {
      password: DEMO_PASSWORD,
      role: "student",
      name: "Alex Rivera",
      roleLabel: "Student",
      className: "Grade 4 · Maple Class",
      personId: "seed-alex",
    },
    "alex.rivera@student.brightsteps.academy": null,
    parent_demo: {
      password: DEMO_PASSWORD,
      role: "parent",
      name: "Amelia Johnson",
      roleLabel: "Parent / Guardian",
      className: "Linked child: Alex Rivera",
    },
    "amelia.johnson@email.com": null,
    teacher_demo: {
      password: DEMO_PASSWORD,
      role: "teacher",
      name: "Sarah Wilson",
      roleLabel: "Teacher",
      className: "Grade 4 · Maple",
      personId: "seed-sarah",
    },
    "sarah.wilson@brightsteps.academy": null,
    "grace.okonkwo@brightsteps.academy": {
      password: DEMO_PASSWORD,
      role: "headmaster",
      name: "Grace Okonkwo",
      roleLabel: "Headmaster",
      className: "BrightSteps Academy",
    },
    "admin@gmail.com": {
      password: "123456",
      role: "admin",
      name: "School Administrator",
      roleLabel: "School Admin",
      className: "BrightFuture Academy",
      adminPosition: "full",
      schoolId: "sch-brightfuture",
      schoolName: "BrightFuture Academy",
    },
    "superadmin@gmail.com": {
      password: "12345",
      role: "superadmin",
      name: "Platform Super Admin",
      roleLabel: "Super Admin",
      className: "All schools",
    },
  };

  BUILTIN["alex.rivera@student.brightsteps.academy"] = BUILTIN.student_demo;
  BUILTIN["amelia.johnson@email.com"] = BUILTIN.parent_demo;
  BUILTIN["sarah.wilson@brightsteps.academy"] = BUILTIN.teacher_demo;
  BUILTIN["admin@brightfuture.academy"] = BUILTIN["admin@gmail.com"];
  BUILTIN["superadmin@platform.com"] = BUILTIN["superadmin@gmail.com"];

  function normalizeLogin(value) {
    return String(value || "").trim().toLowerCase();
  }

  function loadMap(key) {
    try {
      var raw = localStorage.getItem(key);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveMap(key, map) {
    localStorage.setItem(key, JSON.stringify(map));
  }

  function extraUsers() {
    return loadMap(USERS_KEY);
  }

  function saveExtra(map) {
    saveMap(USERS_KEY, map);
  }

  function locks() {
    return loadMap(LOCKS_KEY);
  }

  function removed() {
    return loadMap(REMOVED_KEY);
  }

  function lookup(loginId) {
    var key = normalizeLogin(loginId);
    if (BUILTIN[key]) return { key: key, user: BUILTIN[key] };
    var extra = extraUsers();
    if (extra[key]) return { key: key, user: extra[key] };
    return null;
  }

  function isRemovedKey(key) {
    var map = removed();
    return !!(map[normalizeLogin(key)] || map[String(key || "")]);
  }

  function isLockedKey(key) {
    var map = locks();
    var k = normalizeLogin(key);
    if (map[k] || map[String(key || "")]) return true;
    var found = lookup(key);
    if (found && found.user && found.user.personId && map[found.user.personId]) return true;
    return false;
  }

  function setLocked(keys, locked) {
    var map = locks();
    (Array.isArray(keys) ? keys : [keys]).forEach(function (k) {
      if (!k) return;
      var id = String(k);
      var norm = normalizeLogin(id);
      if (locked) {
        map[id] = true;
        if (norm) map[norm] = true;
      } else {
        delete map[id];
        delete map[norm];
      }
    });
    saveMap(LOCKS_KEY, map);
  }

  function markRemoved(keys) {
    var map = removed();
    (Array.isArray(keys) ? keys : [keys]).forEach(function (k) {
      if (!k) return;
      map[String(k)] = true;
      map[normalizeLogin(k)] = true;
    });
    saveMap(REMOVED_KEY, map);
  }

  function deleteExtraUser(email) {
    var key = normalizeLogin(email);
    if (!key) return;
    var extra = extraUsers();
    if (extra[key]) {
      delete extra[key];
      saveExtra(extra);
    }
  }

  function isPublicDemoAccount(loginId) {
    var found = lookup(loginId);
    if (!found || !found.user) return false;
    return found.user.role === "student" || found.user.role === "parent" || found.user.role === "teacher";
  }

  function readSession() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
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

  function normalizeAdminPosition(value) {
    var id = String(value || "full").trim().toLowerCase();
    return ADMIN_POSITIONS[id] ? id : "full";
  }

  function positionMeta(positionId) {
    return ADMIN_POSITIONS[normalizeAdminPosition(positionId)] || ADMIN_POSITIONS.full;
  }

  function toSession(key, user) {
    var position = user.role === "admin" ? normalizeAdminPosition(user.adminPosition) : "";
    var meta = position ? positionMeta(position) : null;
    var roleLabel = user.roleLabel;
    if (user.role === "admin") {
      if (meta && position !== "full") roleLabel = meta.shortLabel;
      else roleLabel = "Principal / School Admin";
    }
    return {
      login: key,
      role: user.role,
      name: user.name,
      roleLabel: roleLabel,
      className: user.className,
      personId: user.personId || "",
      adminPosition: position,
      schoolId: user.schoolId || "",
      schoolName: user.schoolName || user.className || "",
      loggedInAt: Date.now(),
    };
  }

  function canManageAdmins(session) {
    if (!session) return false;
    if (session.role === "superadmin") return true;
    if (session.role !== "admin") return false;
    return normalizeAdminPosition(session.adminPosition) === "full";
  }

  function adminAllowedSections(session) {
    if (!session) return [];
    if (session.role === "superadmin") return null;
    if (session.role !== "admin") return [];
    var meta = positionMeta(session.adminPosition);
    return meta.sections;
  }

  function canAdminAccessSection(session, sectionId) {
    if (!session) return false;
    if (session.role === "superadmin") return true;
    if (session.role !== "admin") return false;
    var allowed = adminAllowedSections(session);
    if (!allowed) return true;
    return allowed.indexOf(String(sectionId || "home")) !== -1;
  }

  function login(loginId, password, remember) {
    var found = lookup(loginId);
    if (!found || found.user.password !== password) {
      return { ok: false, message: "Invalid login ID or password." };
    }
    if (isRemovedKey(found.key) || (found.user.personId && isRemovedKey(found.user.personId))) {
      return { ok: false, message: "This account was removed by the school admin." };
    }
    if (
      (found.user.role === "student" || found.user.role === "parent") &&
      isLockedKey(found.key)
    ) {
      return {
        ok: false,
        message:
          found.user.role === "parent"
            ? "Your parent portal is locked by the school admin. Contact the office."
            : "Your student portal is locked by the school admin. Contact the office.",
      };
    }
    var session = toSession(found.key, found.user);
    if (window.BrightStepsSchoolOps && found.user.role !== "superadmin") {
      var opsAuth = window.BrightStepsSchoolOps;
      var schoolRec =
        (found.user.schoolId && opsAuth.getSchoolById && opsAuth.getSchoolById(found.user.schoolId)) ||
        (opsAuth.getSchoolByName && opsAuth.getSchoolByName(found.user.schoolName || found.user.className));
      var feature = opsAuth.portalFeatureForRole ? opsAuth.portalFeatureForRole(found.user.role) : "";
      if (schoolRec && feature && opsAuth.isSchoolFeatureEnabled && !opsAuth.isSchoolFeatureEnabled(schoolRec.id, feature)) {
        return {
          ok: false,
          message:
            "This school's " +
            (found.user.role === "admin" ? "admin" : found.user.role) +
            " portal is disabled by Super Admin security.",
        };
      }
    }
    writeSession(session, !!remember);
    return { ok: true, session: session };
  }

  function register(fields) {
    var email = normalizeLogin(fields.email);
    var name = String(fields.name || "").trim();
    var password = String(fields.password || "");
    var role = String(fields.role || "parent");
    var allowed = { student: 1, parent: 1, teacher: 1 };
    if (!allowed[role]) role = "parent";
    if (!name || name.length > 80) return { ok: false, message: "Please enter your name." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Please enter a valid email." };
    if (password.length < 6) return { ok: false, message: "Password must be at least 6 characters." };
    if (lookup(email)) return { ok: false, message: "That email is already registered. Sign in instead." };

    var labels = { student: "Student", parent: "Parent / Guardian", teacher: "Teacher" };
    var classes = {
      student: "Grade 4 · Maple",
      parent: "Linked child pending",
      teacher: "Grade 4 · Maple",
    };
    var extra = extraUsers();
    extra[email] = {
      password: password,
      role: role,
      name: name,
      roleLabel: labels[role],
      className: classes[role],
    };
    saveExtra(extra);
    var session = toSession(email, extra[email]);
    writeSession(session, true);
    return { ok: true, session: session };
  }

  function addStudentAccount(fields) {
    var email = normalizeLogin(fields.email);
    var name = String(fields.name || "").trim();
    var year = String(fields.year || "Grade 1").trim();
    var password = String(fields.password || DEMO_PASSWORD);
    if (!name || name.length > 80) return { ok: false, message: "Enter the child's name." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid email for the student login." };
    if (lookup(email)) return { ok: false, message: "That email is already registered." };
    var extra = extraUsers();
    extra[email] = {
      password: password.length >= 6 ? password : DEMO_PASSWORD,
      role: "student",
      name: name,
      roleLabel: "Student",
      className: year,
      personId: fields.personId || "",
    };
    saveExtra(extra);
    return { ok: true, email: email, password: extra[email].password };
  }

  function addTeacherAccount(fields) {
    var email = normalizeLogin(fields.email);
    var name = String(fields.name || "").trim();
    var subject = String(fields.subject || "General").trim();
    var password = String(fields.password || DEMO_PASSWORD);
    if (!name || name.length > 80) return { ok: false, message: "Enter the teacher's name." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid email for the teacher login." };
    if (lookup(email)) return { ok: false, message: "That email is already registered." };
    var extra = extraUsers();
    extra[email] = {
      password: password.length >= 6 ? password : DEMO_PASSWORD,
      role: "teacher",
      name: name,
      roleLabel: "Teacher",
      className: String(fields.className || subject).trim() || subject,
      personId: fields.personId || "",
    };
    saveExtra(extra);
    return { ok: true, email: email, password: extra[email].password };
  }

  function addParentAccount(fields) {
    var email = normalizeLogin(fields.email);
    var name = String(fields.name || "").trim();
    var password = String(fields.password || DEMO_PASSWORD);
    var phone = String(fields.phone || "").trim().slice(0, 40);
    if (!name || name.length > 80) return { ok: false, message: "Enter the parent / guardian name." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid parent email." };
    var existing = lookup(email);
    if (existing) {
      if (existing.user.role !== "parent") {
        return { ok: false, message: "That email is already used by another role." };
      }
      return { ok: true, email: email, password: null, existing: true };
    }
    var extra = extraUsers();
    extra[email] = {
      password: password.length >= 6 ? password : DEMO_PASSWORD,
      role: "parent",
      name: name,
      roleLabel: "Parent / Guardian",
      className: String(fields.className || "Linked children").trim() || "Linked children",
      phone: phone,
      personId: fields.personId || "",
    };
    saveExtra(extra);
    return { ok: true, email: email, password: extra[email].password, existing: false };
  }

  function addAdminAccount(fields) {
    var email = normalizeLogin(fields.email);
    var name = String(fields.name || "").trim();
    var password = String(fields.password || DEMO_PASSWORD);
    var position = normalizeAdminPosition(fields.position || fields.adminPosition);
    var meta = positionMeta(position);
    var school = String(fields.className || fields.school || fields.schoolName || "BrightFuture Academy").trim() || "BrightFuture Academy";
    var schoolId = String(fields.schoolId || "").trim();
    if (!name || name.length > 80) return { ok: false, message: "Enter the admin's name." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid email for the admin login." };
    if (lookup(email)) return { ok: false, message: "That email is already registered." };
    var extra = extraUsers();
    extra[email] = {
      password: password.length >= 6 ? password : DEMO_PASSWORD,
      role: "admin",
      name: name,
      roleLabel: position === "full" ? "Principal / School Admin" : meta.shortLabel,
      className: school,
      schoolName: school,
      schoolId: schoolId,
      adminPosition: position,
      personId: fields.personId || "",
    };
    saveExtra(extra);
    return {
      ok: true,
      email: email,
      password: extra[email].password,
      position: position,
      positionLabel: meta.label,
      schoolName: school,
      schoolId: schoolId,
    };
  }

  function listAdmins() {
    var out = [];
    var seen = {};
    function pushAdmin(key, user, builtin) {
      if (!user || user.role !== "admin") return;
      var email = normalizeLogin(key);
      if (!email || seen[email]) return;
      if (isRemovedKey(email) || (user.personId && isRemovedKey(user.personId))) return;
      seen[email] = true;
      var position = normalizeAdminPosition(user.adminPosition);
      var meta = positionMeta(position);
      out.push({
        email: email,
        name: user.name,
        school: user.schoolName || user.className || "",
        schoolId: user.schoolId || "",
        position: position,
        positionLabel: meta.label,
        roleLabel: user.roleLabel || meta.shortLabel,
        builtin: !!builtin,
      });
    }
    pushAdmin("admin@gmail.com", BUILTIN["admin@gmail.com"], true);
    var extra = extraUsers();
    Object.keys(extra).forEach(function (key) {
      pushAdmin(key, extra[key], false);
    });
    out.sort(function (a, b) {
      if (a.builtin !== b.builtin) return a.builtin ? -1 : 1;
      return String(a.name).localeCompare(String(b.name));
    });
    return out;
  }

  function removeAdminAccount(email, opts) {
    opts = opts || {};
    var bySuper = !!opts.bySuperAdmin;
    var key = normalizeLogin(email);
    if (!key) return { ok: false, message: "Missing admin email." };
    if (key === "superadmin@gmail.com" || key === "superadmin@platform.com") {
      return { ok: false, message: "Super Admin cannot be removed." };
    }
    var found = lookup(key);
    if (!found || found.user.role !== "admin") {
      return { ok: false, message: "Admin account not found." };
    }
    var isPrimary =
      key === "admin@gmail.com" ||
      key === "admin@brightfuture.academy" ||
      (!!BUILTIN[key] && !extraUsers()[key]);
    if (isPrimary && !bySuper) {
      return { ok: false, message: "Only Super Admin can remove a primary school admin." };
    }
    markRemoved([key]);
    if (key === "admin@gmail.com") markRemoved(["admin@brightfuture.academy"]);
    if (key === "admin@brightfuture.academy") markRemoved(["admin@gmail.com"]);
    deleteExtraUser(key);
    return { ok: true, primary: isPrimary };
  }

  function listSecurityState() {
    var lockMap = locks();
    var removedMap = removed();
    var locked = [];
    var seen = {};
    Object.keys(lockMap).forEach(function (k) {
      if (!lockMap[k] || seen[k]) return;
      seen[k] = true;
      locked.push(k);
    });
    var removedKeys = [];
    seen = {};
    Object.keys(removedMap).forEach(function (k) {
      if (!removedMap[k] || seen[k]) return;
      seen[k] = true;
      removedKeys.push(k);
    });
    return { locked: locked, removed: removedKeys };
  }

  function homePathForRole(role) {
    if (role === "superadmin") return PLATFORM_PATH;
    return DASHBOARD_PATH;
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
    if (
      (session.role === "student" || session.role === "parent") &&
      isLockedKey(session.login)
    ) {
      clearSession();
      window.location.href = LOGIN_PATH + "?locked=1";
      return null;
    }
    if (isRemovedKey(session.login) || (session.personId && isRemovedKey(session.personId))) {
      clearSession();
      window.location.href = LOGIN_PATH + "?removed=1";
      return null;
    }
    if (allowedRoles && allowedRoles.length && allowedRoles.indexOf(session.role) === -1) {
      window.location.href = homePathForRole(session.role);
      return null;
    }
    return session;
  }

  window.BrightStepsDemoAuth = {
    login: login,
    register: register,
    addStudentAccount: addStudentAccount,
    addTeacherAccount: addTeacherAccount,
    addParentAccount: addParentAccount,
    addAdminAccount: addAdminAccount,
    listAdmins: listAdmins,
    removeAdminAccount: removeAdminAccount,
    listSecurityState: listSecurityState,
    adminPositions: ADMIN_POSITIONS,
    canManageAdmins: canManageAdmins,
    canAdminAccessSection: canAdminAccessSection,
    adminAllowedSections: adminAllowedSections,
    logout: logout,
    getSession: readSession,
    requireAuth: requireAuth,
    homePathForRole: homePathForRole,
    isLocked: isLockedKey,
    setLocked: setLocked,
    isRemoved: isRemovedKey,
    markRemoved: markRemoved,
    deleteExtraUser: deleteExtraUser,
    isDemoAccount: isPublicDemoAccount,
    isPublicDemoAccount: isPublicDemoAccount,
    demoPassword: DEMO_PASSWORD,
    paths: {
      login: LOGIN_PATH,
      register: REGISTER_PATH,
      dashboard: DASHBOARD_PATH,
      platform: PLATFORM_PATH,
    },
  };
})();
