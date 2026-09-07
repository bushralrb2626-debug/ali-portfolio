/**
 * BrightSteps — families, internal visits, results access policy.
 * Used by demo-dashboard.js (localStorage demo only).
 */
(function (global) {
  "use strict";

  var FAMILIES_KEY = "brightsteps-demo-families";
  var INTERNAL_VISITS_KEY = "brightsteps-demo-internal-visits";
  var RESULT_POLICY_KEY = "brightsteps-demo-result-policy";
  var SCHOOLS_KEY = "brightsteps-demo-schools";

  var SEED_FAMILIES = [
    {
      id: "fam-amelia",
      name: "Amelia Johnson",
      email: "amelia.johnson@email.com",
      phone: "+39 02 555 0142",
      login: "parent_demo",
      kidIds: ["seed-alex"],
    },
  ];

  var SEED_SCHOOLS = [
    {
      id: "sch-materna",
      name: "Scuola Materna",
      city: "Milano",
      slug: "scuola-materna",
      tagline: "Impara. Esplora. Cresci.",
      about:
        "A colourful campus where curiosity grows, creativity shines, and every child can learn, explore and dream.",
      principalEmail: "grace.okonkwo@brightsteps.academy",
      publicEnabled: true,
    },
    {
      id: "sch-brightfuture",
      name: "BrightFuture Academy",
      city: "Roma",
      slug: "brightfuture-academy",
      tagline: "Learn. Explore. Grow.",
      about: "BrightFuture Academy partners with families for strong academics and a warm school community.",
      principalEmail: "admin@gmail.com",
      publicEnabled: true,
    },
    {
      id: "sch-maple",
      name: "Maple Grove Primary",
      city: "Torino",
      slug: "maple-grove",
      tagline: "Rooted in kindness.",
      about: "Maple Grove Primary is a welcoming neighbourhood school focused on literacy, play and belonging.",
      principalEmail: "",
      publicEnabled: true,
    },
  ];

  function loadList(key) {
    try {
      var raw = localStorage.getItem(key);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveList(key, list) {
    localStorage.setItem(key, JSON.stringify(list || []));
  }

  function norm(v) {
    return String(v || "")
      .trim()
      .toLowerCase();
  }

  function loadFamilies() {
    var list = loadList(FAMILIES_KEY);
    if (!list.length) {
      list = SEED_FAMILIES.map(function (f) {
        return {
          id: f.id,
          name: f.name,
          email: f.email,
          phone: f.phone,
          login: f.login,
          kidIds: (f.kidIds || []).slice(),
        };
      });
      saveList(FAMILIES_KEY, list);
    }
    return list;
  }

  function saveFamilies(list) {
    saveList(FAMILIES_KEY, list);
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
  }

  function loadSchools() {
    var list = loadList(SCHOOLS_KEY);
    if (!list.length) {
      list = SEED_SCHOOLS.map(function (s) {
        return {
          id: s.id,
          name: s.name,
          city: s.city,
          slug: s.slug,
          tagline: s.tagline,
          about: s.about,
          principalEmail: s.principalEmail || "",
          publicEnabled: s.publicEnabled !== false,
          createdAt: "",
        };
      });
      saveList(SCHOOLS_KEY, list);
    }
    return list;
  }

  function saveSchools(list) {
    saveList(SCHOOLS_KEY, list);
  }

  function getSchoolBySlug(slug) {
    var key = slugify(slug);
    return (
      loadSchools().find(function (s) {
        return slugify(s.slug) === key;
      }) || null
    );
  }

  function getSchoolById(id) {
    return (
      loadSchools().find(function (s) {
        return s.id === id;
      }) || null
    );
  }

  function getSchoolByName(name) {
    var key = norm(name);
    return (
      loadSchools().find(function (s) {
        return norm(s.name) === key;
      }) || null
    );
  }

  function upsertSchool(fields) {
    var list = loadSchools();
    var name = String(fields.name || "").trim();
    if (!name) return { ok: false, message: "Enter the school name." };
    var city = String(fields.city || "").trim() || "—";
    var slug = slugify(fields.slug || name);
    if (!slug) return { ok: false, message: "Enter a URL slug for the public site." };
    var existingBySlug = list.find(function (s) {
      return slugify(s.slug) === slug && s.id !== fields.id;
    });
    if (existingBySlug) return { ok: false, message: "That public URL slug is already used." };

    var existing =
      (fields.id &&
        list.find(function (s) {
          return s.id === fields.id;
        })) ||
      list.find(function (s) {
        return norm(s.name) === norm(name);
      });

    if (existing) {
      existing.name = name;
      existing.city = city;
      existing.slug = slug;
      existing.tagline = String(fields.tagline != null ? fields.tagline : existing.tagline || "").trim();
      existing.about = String(fields.about != null ? fields.about : existing.about || "").trim();
      if (fields.principalEmail != null) existing.principalEmail = String(fields.principalEmail || "").trim();
      if (fields.publicEnabled != null) existing.publicEnabled = !!fields.publicEnabled;
      saveSchools(list);
      return { ok: true, school: existing, created: false };
    }

    var school = {
      id: "sch-" + Date.now(),
      name: name,
      city: city,
      slug: slug,
      tagline: String(fields.tagline || "Learn. Explore. Grow.").trim(),
      about: String(fields.about || "").trim(),
      principalEmail: String(fields.principalEmail || "").trim(),
      publicEnabled: fields.publicEnabled !== false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(school);
    saveSchools(list);
    return { ok: true, school: school, created: true };
  }

  function removeSchool(id) {
    var list = loadSchools().filter(function (s) {
      return s.id !== id;
    });
    saveSchools(list);
    return { ok: true };
  }

  function publicSitePath(school) {
    if (!school || !school.slug) return "/demos/brightsteps/index.html";
    return "/demos/brightsteps/school.html?s=" + encodeURIComponent(school.slug);
  }

  function upsertFamily(fields) {
    var list = loadFamilies();
    var email = norm(fields.email);
    var existing = list.find(function (f) {
      return norm(f.email) === email || (fields.login && f.login === fields.login);
    });
    if (existing) {
      existing.name = fields.name || existing.name;
      existing.phone = fields.phone != null ? fields.phone : existing.phone;
      existing.login = fields.login || existing.login;
      if (fields.kidId && (existing.kidIds || []).indexOf(fields.kidId) === -1) {
        existing.kidIds = (existing.kidIds || []).concat([fields.kidId]);
      }
      saveFamilies(list);
      return existing;
    }
    var fam = {
      id: "fam-" + Date.now(),
      name: String(fields.name || "").trim(),
      email: String(fields.email || "").trim(),
      phone: String(fields.phone || "").trim(),
      login: fields.login || norm(fields.email),
      kidIds: fields.kidId ? [fields.kidId] : [],
    };
    list.unshift(fam);
    saveFamilies(list);
    return fam;
  }

  function familiesOfStudent(studentId) {
    return loadFamilies().filter(function (f) {
      return (f.kidIds || []).indexOf(studentId) !== -1;
    });
  }

  function familyForParentSession(session) {
    if (!session) return null;
    var login = norm(session.login);
    return (
      loadFamilies().find(function (f) {
        return (
          norm(f.email) === login ||
          norm(f.login) === login ||
          (session.name && f.name === session.name)
        );
      }) || null
    );
  }

  function kidIdsForParent(session) {
    var fam = familyForParentSession(session);
    if (fam) return (fam.kidIds || []).slice();
    if (loginIsDemoParent(session)) return ["seed-alex"];
    return [];
  }

  function loginIsDemoParent(session) {
    var login = norm(session && session.login);
    return login === "parent_demo" || login === "amelia.johnson@email.com";
  }

  /**
   * Block student + linked parents when a student is removed.
   * Parent blocked only if they have no remaining active kids.
   */
  function blockPortalsAfterStudentRemove(auth, student, personKeysFn) {
    if (!auth || !student) return;
    var studentId = student.id || student.name;
    var keys = typeof personKeysFn === "function" ? personKeysFn(student) : [studentId, student.email];
    auth.markRemoved(keys);
    if (auth.setLocked) auth.setLocked(keys, true);

    var families = loadFamilies();
    families.forEach(function (f) {
      if ((f.kidIds || []).indexOf(studentId) === -1) return;
      f.kidIds = (f.kidIds || []).filter(function (id) {
        return id !== studentId;
      });
      if (!f.kidIds.length) {
        var pkeys = [f.email, f.login, f.id].filter(Boolean);
        auth.markRemoved(pkeys);
        if (auth.setLocked) auth.setLocked(pkeys, true);
      }
    });
    saveFamilies(families);
  }

  function loadInternalVisits() {
    return loadList(INTERNAL_VISITS_KEY);
  }

  function saveInternalVisits(list) {
    saveList(INTERNAL_VISITS_KEY, list);
  }

  /** Booking rules: no student→student, no student→parent. Everyone can book admin. */
  function canBookVisit(fromRole, toRole) {
    var from = String(fromRole || "");
    var to = String(toRole || "");
    if (to === "admin" || to === "superadmin" || to === "headmaster") return true;
    if (from === "admin" || from === "superadmin") return true;
    if (from === "student" && to === "student") return false;
    if (from === "student" && to === "parent") return false;
    return true;
  }

  function getResultPolicy() {
    try {
      var raw = localStorage.getItem(RESULT_POLICY_KEY);
      var p = raw ? JSON.parse(raw) : null;
      if (!p || typeof p !== "object") {
        return { mode: "private", grants: {}, adminLocked: false, lockedBy: "", lockedAt: "" };
      }
      if (!p.grants || typeof p.grants !== "object") p.grants = {};
      if (!p.mode) p.mode = "private";
      return p;
    } catch (e) {
      return { mode: "private", grants: {}, adminLocked: false, lockedBy: "", lockedAt: "" };
    }
  }

  function saveResultPolicy(policy) {
    localStorage.setItem(RESULT_POLICY_KEY, JSON.stringify(policy || {}));
  }

  function setResultPolicy(patch, session) {
    var p = getResultPolicy();
    var isAdmin = session && (session.role === "admin" || session.role === "superadmin");
    if (p.adminLocked && !isAdmin) {
      return {
        ok: false,
        message: "Admin locked this results-access decision — only admin can change it.",
      };
    }
    if (patch.mode === "private" || patch.mode === "open") p.mode = patch.mode;
    if (patch.grants && typeof patch.grants === "object") p.grants = patch.grants;
    if (patch.grantStudentId && patch.grantViewer) {
      var sid = String(patch.grantStudentId);
      var viewer = String(patch.grantViewer).trim();
      if (!p.grants[sid]) p.grants[sid] = [];
      if (p.grants[sid].indexOf(viewer) === -1) p.grants[sid].push(viewer);
    }
    if (patch.revokeStudentId && patch.revokeViewer) {
      var rs = String(patch.revokeStudentId);
      p.grants[rs] = (p.grants[rs] || []).filter(function (v) {
        return v !== patch.revokeViewer;
      });
    }
    if (isAdmin && patch.adminLocked === true) {
      p.adminLocked = true;
      p.lockedBy = session.name || session.login;
      p.lockedAt = new Date().toISOString();
    }
    if (isAdmin && patch.adminLocked === false) {
      p.adminLocked = false;
      p.lockedBy = "";
      p.lockedAt = "";
    }
    saveResultPolicy(p);
    return { ok: true, policy: p };
  }

  function canViewResult(session, result, kidIdsFn) {
    if (!session || !result) return false;
    if (session.role === "admin" || session.role === "superadmin") return true;
    if (
      session.role === "teacher" &&
      (result.teacherLogin === session.login || result.teacher === session.name)
    ) {
      return true;
    }
    if (session.role === "student") {
      if (result.studentId && session.personId && result.studentId === session.personId) return true;
      if (result.studentName && result.studentName === session.name) return true;
    }
    if (session.role === "parent") {
      var kids =
        typeof kidIdsFn === "function" ? kidIdsFn(session) : kidIdsForParent(session);
      if (kids.indexOf(result.studentId) !== -1) return true;
    }
    var policy = getResultPolicy();
    if (policy.mode === "open") return true;
    var grants = (policy.grants && policy.grants[result.studentId]) || [];
    if (grants.indexOf("*") !== -1) return true;
    if (grants.indexOf(session.login) !== -1) return true;
    if (grants.indexOf(norm(session.login)) !== -1) return true;
    return false;
  }

  global.BrightStepsSchoolOps = {
    loadFamilies: loadFamilies,
    saveFamilies: saveFamilies,
    upsertFamily: upsertFamily,
    familiesOfStudent: familiesOfStudent,
    familyForParentSession: familyForParentSession,
    kidIdsForParent: kidIdsForParent,
    blockPortalsAfterStudentRemove: blockPortalsAfterStudentRemove,
    loadInternalVisits: loadInternalVisits,
    saveInternalVisits: saveInternalVisits,
    canBookVisit: canBookVisit,
    getResultPolicy: getResultPolicy,
    setResultPolicy: setResultPolicy,
    canViewResult: canViewResult,
    loadSchools: loadSchools,
    saveSchools: saveSchools,
    upsertSchool: upsertSchool,
    removeSchool: removeSchool,
    getSchoolBySlug: getSchoolBySlug,
    getSchoolById: getSchoolById,
    getSchoolByName: getSchoolByName,
    publicSitePath: publicSitePath,
    slugify: slugify,
    seedSchools: SEED_SCHOOLS,
  };
})(window);
