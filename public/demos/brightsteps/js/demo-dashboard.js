/**
 * BrightSteps static demo — role-based dashboard UI.
 */
(function () {
  "use strict";

  var auth = window.BrightStepsDemoAuth;
  if (!auth) return;
  var ops = window.BrightStepsSchoolOps || null;
  var sa = window.BrightStepsSuperAdmin || null;

  var NAV = {
    student: [
      { icon: "🏠", label: "Dashboard", id: "home" },
      { icon: "📅", label: "Book visit", id: "book-visit" },
      { icon: "📅", label: "Timetable", id: "timetable" },
      { icon: "✅", label: "Attendance", id: "attendance" },
      { icon: "📚", label: "Assignments", id: "assignments" },
      { icon: "📊", label: "Marks", id: "marks" },
      { icon: "📣", label: "Notices", id: "announcements" },
      { icon: "💬", label: "Feedback", id: "feedback" },
    ],
    parent: [
      { icon: "🏠", label: "Dashboard", id: "home" },
      { icon: "🧒", label: "My children", id: "kids" },
      { icon: "📊", label: "Results", id: "results" },
      { icon: "📅", label: "Book visit", id: "book-visit" },
      { icon: "📖", label: "Diary", id: "diary" },
      { icon: "✅", label: "Attendance", id: "attendance" },
      { icon: "📣", label: "Announcements", id: "announcements" },
      { icon: "💬", label: "Feedback", id: "feedback" },
    ],
    teacher: [
      { icon: "🏠", label: "Dashboard", id: "home" },
      { icon: "👥", label: "My class", id: "class" },
      { icon: "📅", label: "Book visit", id: "book-visit" },
      { icon: "📝", label: "Assignments", id: "assignments" },
      { icon: "📋", label: "Attendance", id: "attendance" },
      { icon: "📊", label: "Results", id: "results" },
      { icon: "💬", label: "Feedback", id: "feedback" },
    ],
    headmaster: [
      { icon: "🏠", label: "Overview", id: "home" },
      { icon: "👩‍🏫", label: "Staff", id: "staff" },
      { icon: "🧒", label: "Students", id: "students" },
      { icon: "📈", label: "Results", id: "reports" },
    ],
    admin: [
      { icon: "🏠", label: "Dashboard", id: "home" },
      { icon: "📅", label: "Meetings", id: "meetings" },
      { icon: "👩‍🏫", label: "Teachers", id: "staff" },
      { icon: "🧒", label: "Students", id: "students" },
      { icon: "👨‍👩‍👧", label: "Parents", id: "parents" },
      { icon: "✅", label: "Attendance", id: "attendance" },
      { icon: "💵", label: "Fees", id: "fees" },
      { icon: "🏫", label: "Classrooms", id: "classrooms" },
      { icon: "📣", label: "Announce", id: "announce" },
      { icon: "📥", label: "Inbox", id: "feedback" },
      { icon: "📊", label: "Results", id: "results" },
      { icon: "📑", label: "Reports", id: "slorsh-reports" },
      { icon: "📈", label: "Analytics", id: "analytics" },
      { icon: "📅", label: "Book visit", id: "book-visit" },
      { icon: "🛡️", label: "Admins", id: "admins" },
      { icon: "⚙️", label: "Settings", id: "settings" },
    ],
    superadmin: [
      { icon: "🏠", label: "Hub", id: "home" },
      { icon: "🏫", label: "Schools", id: "schools" },
      { icon: "🛡️", label: "Security", id: "security" },
      { icon: "🔐", label: "School security", id: "school-security" },
      { icon: "🖼️", label: "Edit website", id: "edit-site" },
      { icon: "📅", label: "Meetings", id: "meetings" },
      { icon: "👩‍🏫", label: "Teachers", id: "teachers" },
      { icon: "🧒", label: "Students", id: "students" },
      { icon: "👨‍👩‍👧", label: "Parents", id: "parents" },
      { icon: "✅", label: "Attendance", id: "attendance" },
      { icon: "💵", label: "Fees", id: "fees" },
      { icon: "🏫", label: "Classrooms", id: "classrooms" },
      { icon: "📣", label: "Announce", id: "announce" },
      { icon: "📥", label: "Inbox", id: "feedback" },
      { icon: "📊", label: "Results", id: "results" },
      { icon: "📑", label: "Reports", id: "slorsh-reports" },
      { icon: "📈", label: "Analytics", id: "analytics" },
      { icon: "📅", label: "Book visit", id: "book-visit" },
      { icon: "🛡️", label: "Admins", id: "admins" },
    ],
  };

  var SCHOOLS = [
    { name: "Scuola Materna", city: "Milano", students: 412, teachers: 38, attendance: "94%" },
    { name: "BrightFuture Academy", city: "Roma", students: 286, teachers: 24, attendance: "91%" },
    { name: "Maple Grove Primary", city: "Torino", students: 198, teachers: 16, attendance: "96%" },
  ];
  var TEACHERS = [
    { id: "seed-sarah", name: "Sarah Wilson", school: "Scuola Materna", subject: "Mathematics", className: "Maple · 4A", salary: 85000, email: "sarah.wilson@brightsteps.academy" },
    { id: "seed-david", name: "David Chen", school: "Scuola Materna", subject: "Science", className: "Lab · 4B", salary: 82000 },
    { id: "seed-amina", name: "Amina Rahman", school: "Scuola Materna", subject: "English", className: "4A / 5A", salary: 80000 },
    { id: "seed-priya", name: "Priya Sharma", school: "BrightFuture Academy", subject: "Art", className: "Studio", salary: 78000 },
    { id: "seed-james", name: "James Okonkwo", school: "Maple Grove Primary", subject: "PE", className: "All years", salary: 76000 },
  ];
  var STUDENTS = [
    { id: "seed-alex", name: "Alex Rivera", school: "Scuola Materna", year: "Grade 4", avg: "88%", fee: 12000, email: "alex.rivera@student.brightsteps.academy" },
    { id: "seed-mia", name: "Mia Chen", school: "Scuola Materna", year: "Grade 4", avg: "91%", fee: 12000 },
    { id: "seed-noah", name: "Noah Patel", school: "Scuola Materna", year: "Grade 5", avg: "84%", fee: 13000 },
    { id: "seed-sofia", name: "Sofia Rossi", school: "BrightFuture Academy", year: "Grade 3", avg: "90%", fee: 11000 },
    { id: "seed-leo", name: "Leo Mensah", school: "Maple Grove Primary", year: "Grade 2", avg: "87%", fee: 10000 },
  ];
  var KIDS_KEY = "brightsteps-demo-kids";
  var STAFF_KEY = "brightsteps-demo-staff";
  var MONEY_KEY = "brightsteps-demo-money";
  var ROOMS_KEY = "brightsteps-demo-rooms";
  var ROOM_MAP_KEY = "brightsteps-demo-room-map";
  var ANNOUNCE_KEY = "brightsteps-demo-announce";
  var HOMEWORK_KEY = "brightsteps-demo-homework";
  var FEEDBACK_KEY = "brightsteps-demo-feedback";
  var RESULTS_KEY = "brightsteps-demo-results";
  var ATTEND_KEY = "brightsteps-demo-attendance";
  var ATTEND_WINDOW_KEY = "brightsteps-demo-attend-window";
  var FEE_PAID_KEY = "brightsteps-demo-fee-paid";
  var REPORT_HISTORY_KEY = "brightsteps-demo-report-history";
  var FAMILIES_KEY = "brightsteps-demo-families";
  var INTERNAL_VISITS_KEY = "brightsteps-demo-internal-visits";
  var attendTickTimer = null;

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

  var DEFAULT_ROOMS = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4 · Maple",
    "Grade 5",
    "Art Studio",
    "PE All years",
  ];

  var SEED_ROOM_MAP = {
    "seed-alex": "Grade 4 · Maple",
    "seed-mia": "Grade 4 · Maple",
    "seed-noah": "Grade 5",
    "seed-sofia": "Grade 3",
    "seed-leo": "Grade 2",
    "seed-sarah": "Grade 4 · Maple",
    "seed-david": "Grade 5",
    "seed-amina": "Grade 4 · Maple",
    "seed-priya": "Art Studio",
    "seed-james": "PE All years",
  };

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
    localStorage.setItem(key, JSON.stringify(list.slice(0, 200)));
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

  function loadKids() {
    return loadList(KIDS_KEY);
  }

  function saveKids(list) {
    saveList(KIDS_KEY, list);
  }

  function loadStaff() {
    return loadList(STAFF_KEY);
  }

  function saveStaff(list) {
    saveList(STAFF_KEY, list);
  }

  function loadMoney() {
    try {
      var raw = localStorage.getItem(MONEY_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveMoney(map) {
    localStorage.setItem(MONEY_KEY, JSON.stringify(map));
  }

  function ensureRooms() {
    var rooms = loadList(ROOMS_KEY);
    if (!rooms.length) {
      saveList(ROOMS_KEY, DEFAULT_ROOMS.slice());
      return DEFAULT_ROOMS.slice();
    }
    return rooms;
  }

  function loadRooms() {
    return ensureRooms();
  }

  function saveRooms(rooms) {
    saveList(ROOMS_KEY, rooms);
  }

  function ensureRoomMap() {
    var map = loadMap(ROOM_MAP_KEY);
    if (!Object.keys(map).length) {
      map = {};
      Object.keys(SEED_ROOM_MAP).forEach(function (k) {
        map[k] = SEED_ROOM_MAP[k];
      });
      saveMap(ROOM_MAP_KEY, map);
    }
    return map;
  }

  function loadRoomMap() {
    return ensureRoomMap();
  }

  function saveRoomMap(map) {
    saveMap(ROOM_MAP_KEY, map);
  }

  function loadAnnouncements() {
    return loadList(ANNOUNCE_KEY);
  }

  function saveAnnouncements(list) {
    saveList(ANNOUNCE_KEY, list);
  }

  function loadHomework() {
    return loadList(HOMEWORK_KEY);
  }

  function saveHomework(list) {
    saveList(HOMEWORK_KEY, list);
  }

  function loadAttendance() {
    return loadMap(ATTEND_KEY);
  }

  function saveAttendance(map) {
    saveMap(ATTEND_KEY, map);
  }

  function loadAttendWindow() {
    try {
      var raw = localStorage.getItem(ATTEND_WINDOW_KEY);
      if (!raw) return null;
      var w = JSON.parse(raw);
      if (!w || !w.start || !w.end) return null;
      return w;
    } catch (e) {
      return null;
    }
  }

  function saveAttendWindow(win) {
    localStorage.setItem(ATTEND_WINDOW_KEY, JSON.stringify(win));
  }

  function parseHmToMinutes(hm) {
    var m = String(hm || "").trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    var h = Number(m[1]);
    var min = Number(m[2]);
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return h * 60 + min;
  }

  function formatMinutesClock(total) {
    var h = Math.floor(total / 60);
    var m = total % 60;
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  }

  function nowMinutes() {
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function attendWindowState() {
    var w = loadAttendWindow();
    if (!w) {
      return { configured: false, open: false, locked: false, label: "No window set", remaining: "" };
    }
    var start = parseHmToMinutes(w.start);
    var end = parseHmToMinutes(w.end);
    if (start == null || end == null || end <= start) {
      return { configured: false, open: false, locked: !!w.locked, label: "Invalid window", remaining: "" };
    }
    var now = nowMinutes();
    var open = now >= start && now < end;
    var remaining = "";
    if (open) {
      var left = end - now;
      remaining = left + " min left";
    } else if (now < start) {
      remaining = "Opens in " + (start - now) + " min";
    } else {
      remaining = "Closed for today";
    }
    return {
      configured: true,
      open: open,
      locked: !!w.locked,
      start: w.start,
      end: w.end,
      label: w.start + " – " + w.end,
      remaining: remaining,
      win: w,
    };
  }

  function attendanceStatusLabel(status) {
    if (status === "present") return "Present";
    if (status === "absent") return "Absent";
    if (status === "leave") return "Leave";
    return "Not marked";
  }

  function attendanceBadgeHtml(status) {
    if (status === "present") return '<span class="badge-soft badge-mint">Present</span>';
    if (status === "absent") return '<span class="badge-soft badge-coral">Absent</span>';
    if (status === "leave") return '<span class="badge-soft badge-sky">Leave</span>';
    return '<span class="text-muted">Not marked</span>';
  }

  function getAttendance(personId) {
    if (!personId) return null;
    var map = loadAttendance();
    return map[personId] || null;
  }

  function setAttendance(personId, kind, status, session, classroom) {
    var map = loadAttendance();
    map[personId] = {
      kind: kind,
      status: status,
      classroom: classroom || "",
      at: new Date().toISOString(),
      by: session.login || session.email || session.role,
      byName: session.name || "",
    };
    saveAttendance(map);
  }

  function clearStudentAttendanceForRoom(room) {
    var map = loadAttendance();
    var next = {};
    Object.keys(map).forEach(function (id) {
      var row = map[id];
      if (!row) return;
      if (row.kind === "student" && row.classroom === room) return;
      next[id] = row;
    });
    allStudents().forEach(function (s) {
      if (s.classroom === room) delete next[s.id || s.name];
    });
    saveAttendance(next);
  }

  function studentsInTeacherClass(session) {
    var room = sessionClassroom(session);
    return allStudents().filter(function (s) {
      return room && s.classroom === room;
    });
  }

  function studentPersonId(session) {
    return session.personId || (session.login === "student_demo" ? "seed-alex" : session.login || session.name);
  }

  function teacherPersonId(session) {
    if (session.personId) return session.personId;
    if (session.login === "teacher_demo") return "seed-sarah";
    var match = allTeachers().find(function (t) {
      return (
        (t.email && session.email && t.email.toLowerCase() === String(session.email).toLowerCase()) ||
        t.name === session.name
      );
    });
    return match ? match.id || match.name : session.login || session.name;
  }

  function markPresentBtnHtml(personId, kind, already) {
    if (already) {
      return attendanceBadgeHtml("present");
    }
    return (
      '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-primary" data-mark-attend="' +
      escapeHtml(personId) +
      '" data-attend-kind="' +
      escapeHtml(kind) +
      '" data-attend-status="present">Mark present</button>'
    );
  }

  function studentMarkButtonsHtml(personId, currentStatus) {
    var statuses = [
      { id: "present", label: "Present", cls: "btn-bsa-primary" },
      { id: "absent", label: "Absent", cls: "btn-bsa-soft" },
      { id: "leave", label: "Leave", cls: "btn-bsa-soft" },
    ];
    return (
      '<span class="attendance-toggle" style="display:inline-flex;gap:0.35rem;flex-wrap:wrap">' +
      statuses
        .map(function (s) {
          var active = currentStatus === s.id ? " active" : "";
          return (
            '<button type="button" class="btn-bsa btn-bsa-sm ' +
            s.cls +
            active +
            '" data-mark-attend="' +
            escapeHtml(personId) +
            '" data-attend-kind="student" data-attend-status="' +
            s.id +
            '">' +
            s.label +
            "</button>"
          );
        })
        .join("") +
      "</span>"
    );
  }

  function attendWindowBannerHtml(state, forTeacher) {
    if (!state.configured) {
      return (
        "<p class='text-muted'><strong>Attendance window:</strong> Admin has not set a time yet." +
        (forTeacher ? " You can mark once the office sets today’s window." : "") +
        "</p>"
      );
    }
    return (
      "<p><strong>Attendance window:</strong> " +
      escapeHtml(state.label) +
      (state.locked ? " · <em>Fixed by admin</em>" : "") +
      " · " +
      escapeHtml(state.remaining) +
      (state.open
        ? ' · <span class="badge-soft badge-mint">Open now</span>'
        : ' · <span class="badge-soft badge-coral">Closed</span>') +
      "</p>"
    );
  }

  function studentAttendancePanel(session) {
    var id = studentPersonId(session);
    var room = sessionClassroom(session);
    var row = getAttendance(id);
    var state = attendWindowState();
    var status = row ? attendanceStatusLabel(row.status) : "Not marked";
    var detail = row
      ? "<p class='text-muted small'>Marked " +
        escapeHtml(row.at ? new Date(row.at).toLocaleString() : "") +
        (row.byName ? " · by " + escapeHtml(row.byName) : "") +
        "</p>"
      : "<p class='text-muted small'>Your class teacher marks attendance during the admin window.</p>";
    return (
      '<div class="welcome-banner"><h2>My attendance</h2><p>' +
      escapeHtml(room || "Your class") +
      "</p></div>" +
      panel(
        "Today",
        attendWindowBannerHtml(state, false) +
          "<p><strong>Status:</strong> " +
          escapeHtml(status) +
          "</p>" +
          detail
      )
    );
  }

  function teacherAttendancePanel(session) {
    var room = sessionClassroom(session);
    var state = attendWindowState();
    var selfId = teacherPersonId(session);
    var selfRow = getAttendance(selfId);
    if (!room) {
      return panel(
        "Attendance",
        attendWindowBannerHtml(state, true) +
          "<p class='text-muted'>You are not assigned to a classroom yet. Ask admin to place you in Classrooms.</p>"
      );
    }
    var kids = studentsInTeacherClass(session);
    var counts = { present: 0, absent: 0, leave: 0, unmarked: 0 };
    var rows = kids.map(function (s) {
      var id = s.id || s.name;
      var row = getAttendance(id);
      var st = row && row.status ? row.status : "";
      if (st === "present") counts.present++;
      else if (st === "absent") counts.absent++;
      else if (st === "leave") counts.leave++;
      else counts.unmarked++;
      return [
        escapeHtml(s.name),
        attendanceBadgeHtml(st),
        state.open
          ? studentMarkButtonsHtml(id, st)
          : st
            ? attendanceBadgeHtml(st)
            : '<span class="text-muted">Window closed</span>',
      ];
    });
    if (!rows.length) {
      rows = [["—", "No students in this class", ""]];
    }
    var selfBlock =
      "<p><strong>Your attendance (present only):</strong> " +
      (selfRow && selfRow.status === "present"
        ? attendanceBadgeHtml("present")
        : state.open
          ? markPresentBtnHtml(selfId, "teacher-self", false)
          : '<span class="text-muted">Not marked · window closed</span>') +
      "</p>";
    return (
      '<div class="welcome-banner"><h2>Class attendance</h2><p>From the teachers portal: mark <strong>yourself present</strong>, then mark students in <strong>' +
      escapeHtml(room) +
      "</strong> as Present, Absent, or Leave — only while the admin window is open.</p></div>" +
      attendWindowBannerHtml(state, true) +
      kpis([
        { label: "Present", value: String(counts.present), accent: "accent-mint" },
        { label: "Absent / Leave", value: String(counts.absent + counts.leave), accent: "accent-coral" },
        { label: "Not marked", value: String(counts.unmarked), accent: "accent-royal" },
      ]) +
      panel("Teacher check-in", selfBlock) +
      panel(
        escapeHtml(room) + " · " + kids.length + " students",
        (state.open
          ? '<p style="margin-bottom:1rem"><button type="button" class="btn-bsa btn-bsa-soft" data-reset-attend-room="' +
            escapeHtml(room) +
            '">Clear class marks</button></p>'
          : "") + table(["Student", "Status", "Action"], rows)
      )
    );
  }

  function adminAttendancePanel(session) {
    var state = attendWindowState();
    var w = state.win || { start: "08:00", end: "09:00", locked: false };
    var teachers = allTeachers();
    var present = 0;
    var rows = teachers.map(function (t) {
      var id = t.id || t.name;
      var row = getAttendance(id);
      var isPresent = row && row.status === "present";
      if (isPresent) present++;
      return [
        escapeHtml(t.name),
        escapeHtml(t.classroom || t.className || "—"),
        escapeHtml(attendanceStatusLabel(isPresent ? "present" : "")),
      ];
    });
    var form =
      '<form id="attendWindowForm" class="form-bsa" style="display:grid;gap:0.75rem;max-width:28rem">' +
      "<p class='text-muted small'>Set when teachers may mark their own attendance and their class. Once saved, teachers cannot change these times.</p>" +
      '<label>Start <input type="time" name="start" required value="' +
      escapeHtml(w.start || "08:00") +
      '" /></label>' +
      '<label>End <input type="time" name="end" required value="' +
      escapeHtml(w.end || "09:00") +
      '" /></label>' +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Save &amp; fix window</button>' +
      "</form>";
    return (
      '<div class="welcome-banner"><h2>Attendance window</h2><p>Admin fixes the daily marking window. Teachers mark themselves and their class only inside that time.</p></div>' +
      attendWindowBannerHtml(state, false) +
      panel("Fix today’s window", form) +
      kpis([
        { label: "Teachers present", value: String(present), accent: "accent-mint" },
        { label: "Not marked", value: String(Math.max(0, teachers.length - present)), accent: "accent-coral" },
      ]) +
      panel("Staff check-in today", table(["Teacher", "Class", "Status"], rows))
    );
  }

  function parentAttendancePanel() {
    var kids = parentKidsList();
    if (!kids.length) {
      return panel("Attendance", "<p class='text-muted'>No linked children.</p>");
    }
    var blocks = kids
      .map(function (child) {
        var id = child.id || child.name;
        var row = getAttendance(id);
        return (
          "<p><strong>" +
          escapeHtml(child.name) +
          "</strong> — <strong>" +
          escapeHtml(attendanceStatusLabel(row && row.status)) +
          "</strong>" +
          (row
            ? " <span class='text-muted small'>Updated " +
              escapeHtml(new Date(row.at).toLocaleString()) +
              "</span>"
            : " <span class='text-muted small'>Not marked yet today.</span>") +
          "</p>"
        );
      })
      .join("");
    return panel("Attendance", blocks);
  }

  var SLORSH_REPORT_USAGE = [
    { type: "weekly", label: "Weekly Report", blurb: "7-day Italian school ops narrative.", tone: "usage", eyebrow: "Usage" },
    { type: "monthly", label: "Monthly Report", blurb: "30-day iscrizioni, presenze, rette.", tone: "usage", eyebrow: "Usage" },
    { type: "weekly_plus", label: "Weekly Report+", blurb: "Deeper weekly + risks (Italy).", tone: "usage-plus", eyebrow: "Usage +" },
    { type: "monthly_plus", label: "Monthly Report+", blurb: "Deeper monthly + next steps (Italy).", tone: "usage-plus", eyebrow: "Usage +" },
  ];
  var SLORSH_REPORT_MARKET = [
    { type: "market_competitor", label: "Market + Competitor", blurb: "Italy EdTech / registro positioning.", tone: "market", eyebrow: "Market" },
    { type: "product_performance", label: "Product Performance", blurb: "Presenze, colloqui, desk bot.", tone: "market", eyebrow: "Market" },
    { type: "pricing_optimization", label: "Pricing Optimization", blurb: "Rette framing experiments (EUR).", tone: "market", eyebrow: "Market" },
    { type: "customer_satisfaction", label: "Customer Satisfaction", blurb: "Visite & inbox themes (IT parents).", tone: "market", eyebrow: "Market" },
    { type: "sales_performance", label: "Sales Performance", blurb: "Visite → interesse iscrizione.", tone: "market", eyebrow: "Market" },
    { type: "executive_dashboard", label: "Executive Dashboard", blurb: "One-page Italian admin snapshot.", tone: "exec", eyebrow: "Exec" },
  ];

  function inlineMd(text) {
    return escapeHtml(String(text || ""))
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function splitTableRow(line) {
    var raw = String(line || "").trim();
    if (raw.charAt(0) === "|") raw = raw.slice(1);
    if (raw.charAt(raw.length - 1) === "|") raw = raw.slice(0, -1);
    return raw.split("|").map(function (c) {
      return c.trim();
    });
  }

  function isTableSep(line) {
    return /^\|?\s*:?-{3,}.*\|/.test(String(line || "").trim());
  }

  function renderReportMarkdown(md) {
    var lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var i = 0;
    var inUl = false;
    var inOl = false;

    function closeLists() {
      if (inUl) {
        html.push("</ul>");
        inUl = false;
      }
      if (inOl) {
        html.push("</ol>");
        inOl = false;
      }
    }

    while (i < lines.length) {
      var line = lines[i];
      var trimmed = line.trim();

      if (!trimmed) {
        closeLists();
        i += 1;
        continue;
      }

      if (trimmed.indexOf("|") !== -1 && i + 1 < lines.length && isTableSep(lines[i + 1])) {
        closeLists();
        var heads = splitTableRow(trimmed);
        i += 2;
        html.push("<table><thead><tr>");
        heads.forEach(function (h) {
          html.push("<th>" + inlineMd(h) + "</th>");
        });
        html.push("</tr></thead><tbody>");
        while (i < lines.length && lines[i].indexOf("|") !== -1 && lines[i].trim()) {
          if (isTableSep(lines[i])) {
            i += 1;
            continue;
          }
          var cells = splitTableRow(lines[i]);
          html.push("<tr>");
          cells.forEach(function (c) {
            html.push("<td>" + inlineMd(c) + "</td>");
          });
          html.push("</tr>");
          i += 1;
        }
        html.push("</tbody></table>");
        continue;
      }

      if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
        closeLists();
        html.push("<hr />");
        i += 1;
        continue;
      }

      var heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        closeLists();
        var level = heading[1].length;
        html.push("<h" + level + ">" + inlineMd(heading[2]) + "</h" + level + ">");
        i += 1;
        continue;
      }

      var ul = trimmed.match(/^[-*]\s+(.+)$/);
      if (ul) {
        if (inOl) {
          html.push("</ol>");
          inOl = false;
        }
        if (!inUl) {
          html.push("<ul>");
          inUl = true;
        }
        html.push("<li>" + inlineMd(ul[1]) + "</li>");
        i += 1;
        continue;
      }

      var ol = trimmed.match(/^\d+\.\s+(.+)$/);
      if (ol) {
        if (inUl) {
          html.push("</ul>");
          inUl = false;
        }
        if (!inOl) {
          html.push("<ol>");
          inOl = true;
        }
        html.push("<li>" + inlineMd(ol[1]) + "</li>");
        i += 1;
        continue;
      }

      closeLists();
      html.push("<p>" + inlineMd(trimmed) + "</p>");
      i += 1;
    }
    closeLists();
    return html.join("");
  }

  function schoolReportLoadingHtml() {
    return (
      '<div class="sr-out" aria-busy="true">' +
      '<div class="sr-loading">' +
      '<div class="sr-loading__row"><span class="sr-spin" aria-hidden="true"></span>' +
      "<div><strong>Generating report…</strong>" +
      '<p class="text-muted small" style="margin:0.2rem 0 0">Analyzing campus pack and writing the narrative.</p></div></div>' +
      '<div class="sr-skel" aria-hidden="true">' +
      '<div class="sr-skel__bar"></div><div class="sr-skel__bar"></div>' +
      '<div class="sr-skel__bar"></div><div class="sr-skel__bar"></div>' +
      "</div></div></div>"
    );
  }

  function schoolReportResultHtml(data, rType) {
    var live = data.via !== "fallback";
    var pill = live
      ? '<span class="sr-pill sr-pill--live">Live analysis</span>'
      : '<span class="sr-pill sr-pill--offline">Pack snapshot</span>';
    return (
      '<div class="sr-out">' +
      '<div class="sr-out__head">' +
      "<div><h3>" +
      escapeHtml(data.title || rType) +
      "</h3>" +
      (data.summary
        ? '<p class="sr-out__meta">' + escapeHtml(data.summary) + "</p>"
        : "") +
      "</div>" +
      pill +
      "</div>" +
      '<div class="sr-md">' +
      renderReportMarkdown(data.markdown || "") +
      "</div></div>"
    );
  }

  function schoolReportPack(session) {
    var attendMap = loadAttendance();
    var present = 0;
    var absent = 0;
    var leave = 0;
    Object.keys(attendMap).forEach(function (k) {
      var st = (attendMap[k] && attendMap[k].status) || "";
      if (st === "present") present++;
      else if (st === "absent") absent++;
      else if (st === "leave") leave++;
    });
    var win = attendWindowState();
    return {
      school: session.className || "BrightFuture Academy",
      admin: session.name || "School Administrator",
      role: session.role,
      teachers: allTeachers().length,
      students: allStudents().length,
      classrooms: (typeof loadRooms === "function" ? loadRooms() : []).length,
      visit_requests: loadVisits().length,
      results_on_file: loadResults().length,
      announcements: (typeof loadAnnouncements === "function" ? loadAnnouncements() : []).length,
      feedback_inbox: (typeof loadFeedback === "function" ? loadFeedback() : []).length,
      attendance_today: { present: present, absent: absent, leave: leave, marked: present + absent + leave },
      attendance_window: win.configured
        ? { label: win.label, open: win.open, remaining: win.remaining }
        : { configured: false },
      teacher_names: allTeachers()
        .slice(0, 12)
        .map(function (t) {
          return t.name + (t.classroom || t.className ? " · " + (t.classroom || t.className) : "");
        }),
    };
  }

  function schoolReportsPanel(session) {
    function cards(list) {
      return (
        '<div class="sr-grid">' +
        list
          .map(function (item) {
            return (
              '<button type="button" class="sr-card" data-tone="' +
              escapeHtml(item.tone || "usage") +
              '" data-school-report="' +
              escapeHtml(item.type) +
              '"><span class="sr-card__eyebrow">' +
              escapeHtml(item.eyebrow || "Report") +
              '</span><span class="sr-card__title">' +
              escapeHtml(item.label) +
              '</span><span class="sr-card__blurb">' +
              escapeHtml(item.blurb) +
              '</span><span class="sr-card__cta">Generate <span aria-hidden="true">→</span></span></button>'
            );
          })
          .join("") +
        "</div>"
      );
    }
    return (
      '<div class="sr-hero"><h2>Reports</h2><p>Italian school intel · 4 usage + 6 market types from live campus data (Italy / EUR).</p>' +
      '<div class="sr-seat">Signed in as <strong>' +
      escapeHtml(session.name || "Ali") +
      '</strong> · <span class="badge-soft badge-mint">Admin</span></div></div>' +
      '<div class="sr-topic"><label for="schoolReportTopic">Niche / topic (optional)</label>' +
      '<input type="text" id="schoolReportTopic" class="form-bsa" maxlength="200" placeholder="e.g. iscrizioni scuola primaria Milano" /></div>' +
      panel("Usage reports", cards(SLORSH_REPORT_USAGE)) +
      panel("Market intel", cards(SLORSH_REPORT_MARKET)) +
      reportHistoryPanelHtml() +
      panel(
        "Latest narrative",
        '<div id="schoolReportOut"><div class="sr-out"><p class="sr-empty">Choose a report type to generate, or open one from Previous reports.</p></div></div>'
      )
    );
  }

  function loadFeedback() {
    return loadList(FEEDBACK_KEY);
  }

  function saveFeedback(list) {
    saveList(FEEDBACK_KEY, list);
  }

  function parseAmount(value) {
    var n = Number(String(value == null ? "" : value).replace(/[^\d.]/g, ""));
    if (!isFinite(n) || n < 0) return 0;
    return Math.round(n);
  }

  function money(value) {
    return "€ " + parseAmount(value).toLocaleString("it-IT");
  }

  function loadFeePaidMap() {
    try {
      var raw = localStorage.getItem(FEE_PAID_KEY);
      var map = raw ? JSON.parse(raw) : {};
      return map && typeof map === "object" ? map : {};
    } catch (e) {
      return {};
    }
  }

  function saveFeePaidMap(map) {
    localStorage.setItem(FEE_PAID_KEY, JSON.stringify(map || {}));
  }

  function isFeePaid(studentId) {
    var row = loadFeePaidMap()[studentId];
    return !!(row && row.paid);
  }

  function setFeePaid(studentId, paid) {
    var map = loadFeePaidMap();
    if (paid) {
      map[studentId] = { paid: true, at: new Date().toISOString() };
    } else {
      delete map[studentId];
    }
    saveFeePaidMap(map);
  }

  function feeStatusCell(student) {
    var id = student.id || student.name;
    if (isFeePaid(id)) {
      return (
        '<div class="fee-status fee-status--paid">' +
        '<strong>Paid</strong>' +
        '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-fee-unpaid="' +
        escapeHtml(id) +
        '">Mark pending</button></div>'
      );
    }
    return (
      '<div class="fee-status fee-status--pending">' +
      "<strong>Pending</strong>" +
      '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-primary" data-fee-paid="' +
      escapeHtml(id) +
      '">Mark paid</button></div>'
    );
  }

  function loadReportHistory() {
    var list = loadList(REPORT_HISTORY_KEY);
    return Array.isArray(list) ? list.slice(0, 5) : [];
  }

  function saveReportHistoryEntry(entry) {
    var list = loadReportHistory();
    list.unshift({
      id: "rep-" + Date.now(),
      type: entry.type || "",
      title: entry.title || entry.type || "Report",
      summary: String(entry.summary || "").slice(0, 280),
      markdown: String(entry.markdown || "").slice(0, 120000),
      topic: entry.topic || "",
      at: entry.at || new Date().toISOString(),
      credits_charged: entry.credits_charged || 0,
      via: entry.via || "",
    });
    saveList(REPORT_HISTORY_KEY, list.slice(0, 5));
  }

  function reportHistoryPanelHtml() {
    var list = loadReportHistory();
    if (!list.length) {
      return panel(
        "Previous reports",
        "<p class='text-muted'>No saved reports yet. Generate one above — the last 5 stay here for this browser.</p>"
      );
    }
    var rows = list.map(function (r, idx) {
      var when = r.at ? String(r.at).replace("T", " ").slice(0, 16) : "";
      return [
        escapeHtml(when),
        escapeHtml(r.title || r.type),
        escapeHtml((r.summary || "").slice(0, 90)),
        '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-primary" data-view-report="' +
          escapeHtml(r.id) +
          '">View</button>',
      ];
    });
    return panel(
      "Previous reports (last 5)",
      table(["When", "Report", "Summary", ""], rows)
    );
  }

  function amountFor(id, field, fallback) {
    var map = loadMoney();
    if (map[id] && map[id][field] != null && map[id][field] !== "") return parseAmount(map[id][field]);
    return parseAmount(fallback);
  }

  function setAmount(id, field, value) {
    var map = loadMoney();
    if (!map[id]) map[id] = {};
    map[id][field] = parseAmount(value);
    saveMoney(map);
  }

  function canManageRoster(session) {
    return session && (session.role === "admin" || session.role === "superadmin");
  }

  function canManageSchoolAdmins(session) {
    if (auth.canManageAdmins) return auth.canManageAdmins(session);
    return !!(session && (session.role === "superadmin" || session.role === "admin"));
  }

  function navItemsFor(session) {
    var items = (NAV[session.role] || NAV.student).slice();
    if (session.role === "admin") {
      if (!canManageSchoolAdmins(session)) {
        items = items.filter(function (item) {
          return item.id !== "admins";
        });
      }
      if (auth.adminAllowedSections) {
        var allowed = auth.adminAllowedSections(session);
        if (allowed) {
          items = items.filter(function (item) {
            return allowed.indexOf(item.id) !== -1;
          });
        }
      }
    }
    return items;
  }

  function ensureAdminSection(session, section) {
    if (session.role !== "admin") return section;
    if (auth.canAdminAccessSection && !auth.canAdminAccessSection(session, section)) {
      return "home";
    }
    if (section === "admins" && !canManageSchoolAdmins(session)) return "home";
    return section;
  }

  function isPersonRemoved(person) {
    var id = person.id || person.name;
    if (auth.isRemoved(id)) return true;
    if (person.email && auth.isRemoved(person.email)) return true;
    return false;
  }

  function personKeys(person) {
    var id = person.id || person.name;
    var keys = [id];
    if (person.email) keys.push(person.email);
    if (id === "seed-alex") {
      keys.push("student_demo", "alex.rivera@student.brightsteps.academy");
    }
    if (id === "seed-sarah") {
      keys.push("teacher_demo", "sarah.wilson@brightsteps.academy");
    }
    return keys;
  }

  function isStudentLocked(person) {
    return personKeys(person).some(function (k) {
      return auth.isLocked(k);
    });
  }

  function getClassroomForPerson(personId, fallback) {
    var map = loadRoomMap();
    if (map[personId]) return map[personId];
    return fallback || "";
  }

  function applyClassroom(person) {
    var id = person.id || person.name;
    person.classroom = getClassroomForPerson(id, person.year || person.className || "");
    return person;
  }

  function sessionClassroom(session) {
    if (session.personId) {
      return getClassroomForPerson(session.personId, session.className || "");
    }
    return session.className || "";
  }

  function parentLinkedClassroom() {
    var kids = parentKidsList();
    if (kids[0] && kids[0].classroom) return kids[0].classroom;
    return "Grade 4 · Maple";
  }

  function parentKidsList(sessionOpt) {
    var session = sessionOpt || (auth.getSession && auth.getSession()) || null;
    if (!ops || !session) return allStudents().filter(function (s) { return (s.id || s.name) === "seed-alex"; });
    var ids = ops.kidIdsForParent(session);
    if (!ids.length) ids = ["seed-alex"];
    return allStudents().filter(function (s) {
      return ids.indexOf(s.id || s.name) !== -1;
    });
  }

  function parentsPanel() {
    var families = ops ? ops.loadFamilies() : [];
    var rows = families.map(function (f) {
      var kidNames = (f.kidIds || [])
        .map(function (id) {
          var s = allStudents().find(function (x) { return (x.id || x.name) === id; })
            || STUDENTS.find(function (x) { return (x.id || x.name) === id; });
          return s ? s.name : id;
        })
        .join(", ") || "—";
      return [
        escapeHtml(f.name),
        escapeHtml(f.email || f.login || ""),
        escapeHtml(f.phone || "—"),
        escapeHtml(kidNames),
      ];
    });
    return (
      panel(
        "Parents / guardians — contact & children",
        rows.length
          ? table(["Parent", "Email / portal login", "Phone", "Children"], rows)
          : "<p class='text-muted'>No parent records yet. Link a parent when adding a student.</p>"
      ) +
      '<form class="form-bsa" id="addParentForm">' +
      "<p><strong>Add / link parent</strong></p>" +
      '<div class="form-row">' +
      '<label>Parent name<input name="name" required maxlength="80" /></label>' +
      '<label>Email (portal login)<input name="email" type="email" required /></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>Phone<input name="phone" maxlength="40" placeholder="+39 …" /></label>' +
      '<label>Link child<select name="kidId">' +
      studentOptionsHtml("") +
      "</select></label>" +
      "</div>" +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Save parent</button>' +
      "</form>"
    );
  }

  function parentKidsPanel(session) {
    var kids = parentKidsList();
    var rows = kids.map(function (s) {
      return [
        escapeHtml(s.name),
        escapeHtml(s.year || "—"),
        escapeHtml(s.classroom || "—"),
        escapeHtml(s.school || "—"),
        money(s.fee),
      ];
    });
    return (
      panel(
        "My children",
        rows.length
          ? table(["Name", "Year", "Classroom", "School", "Fee"], rows)
          : "<p class='text-muted'>No children linked yet.</p>"
      ) +
      '<form class="form-bsa" id="parentAddKidForm">' +
      "<p><strong>Add another child</strong> — creates their student login and links them to you.</p>" +
      '<div class="form-row">' +
      '<label>Child name<input name="name" required maxlength="80" /></label>' +
      '<label>Year<input name="year" required value="Grade 1" /></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>Child email (login)<input name="email" type="email" required /></label>' +
      '<label>Temp password<input name="password" value="Demo@12345" minlength="6" /></label>' +
      "</div>" +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Add child</button>' +
      "</form>"
    );
  }

  function bookVisitTargets(session) {
    var targets = [];
    allTeachers().forEach(function (t) {
      targets.push({
        key: "teacher:" + (t.id || t.name),
        role: "teacher",
        label: "Teacher · " + t.name,
        name: t.name,
        email: t.email || "",
      });
    });
    if (ops) {
      ops.loadFamilies().forEach(function (f) {
        targets.push({
          key: "parent:" + (f.id || f.email),
          role: "parent",
          label: "Parent · " + f.name + (f.kidIds && f.kidIds.length ? " (" + f.kidIds.length + " kids)" : ""),
          name: f.name,
          email: f.email || "",
        });
      });
    }
    targets.push({
      key: "admin:school",
      role: "admin",
      label: "School admin",
      name: "School Administrator",
      email: "admin@gmail.com",
    });
    return targets.filter(function (t) {
      if (!ops) return true;
      return ops.canBookVisit(session.role, t.role);
    });
  }

  function bookVisitPanel(session) {
    var targets = bookVisitTargets(session);
    var opts = targets
      .map(function (t) {
        return (
          '<option value="' +
          escapeHtml(t.key) +
          '" data-role="' +
          escapeHtml(t.role) +
          '" data-name="' +
          escapeHtml(t.name) +
          '" data-email="' +
          escapeHtml(t.email || "") +
          '">' +
          escapeHtml(t.label) +
          "</option>"
        );
      })
      .join("");
    var mine = (ops ? ops.loadInternalVisits() : []).filter(function (v) {
      return v.fromLogin === session.login || v.toEmail === session.login || v.toName === session.name;
    });
    var rows = mine.slice(0, 20).map(function (v) {
      return [
        escapeHtml((v.createdAt || "").replace("T", " ").slice(0, 16)),
        escapeHtml(v.fromName + " → " + v.toName),
        escapeHtml(v.when || ""),
        escapeHtml(v.note || ""),
      ];
    });
    return (
      '<div class="welcome-banner"><h2>Book a visit</h2><p>Teachers ↔ parents, everyone → admin. Students cannot book other students or parents.</p></div>' +
      '<form class="form-bsa" id="internalVisitForm">' +
      '<div class="form-row">' +
      '<label>Meet with<select name="target" required><option value="">Select…</option>' +
      opts +
      "</select></label>" +
      '<label>When<input name="when" required maxlength="80" placeholder="e.g. Friday 10:00" /></label>' +
      "</div>" +
      '<label>Note<textarea name="note" maxlength="400" rows="2" placeholder="Reason for the visit"></textarea></label>' +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Request visit</button>' +
      "</form>" +
      panel(
        "Your visit requests",
        rows.length ? table(["When logged", "Who", "Slot", "Note"], rows) : "<p class='text-muted'>No internal visits yet.</p>"
      )
    );
  }

  function resultAccessPanel(session) {
    if (!ops || (session.role !== "admin" && session.role !== "superadmin")) return "";
    var policy = ops.getResultPolicy();
    var grantRows = [];
    Object.keys(policy.grants || {}).forEach(function (sid) {
      (policy.grants[sid] || []).forEach(function (viewer) {
        var s = allStudents().find(function (x) { return (x.id || x.name) === sid; });
        grantRows.push([
          escapeHtml(s ? s.name : sid),
          escapeHtml(viewer),
          '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-revoke-grant data-student="' +
            escapeHtml(sid) +
            '" data-viewer="' +
            escapeHtml(viewer) +
            '">Revoke</button>',
        ]);
      });
    });
    return (
      panel(
        "Results visibility (admin)",
        "<p>Default: only the student, their parents, the uploading teacher, and admin can see a result. " +
          (policy.mode === "open"
            ? "<strong>Open mode:</strong> anyone signed in can see all results."
            : "<strong>Private mode:</strong> restricted + optional grants.") +
          "</p>" +
          (policy.adminLocked
            ? '<p class="text-muted">🔒 Locked by ' +
              escapeHtml(policy.lockedBy || "admin") +
              " — others cannot change this.</p>"
            : "") +
          '<div class="form-row" style="gap:0.5rem;flex-wrap:wrap;margin:0.75rem 0">' +
          '<button type="button" class="btn-bsa btn-bsa-sm ' +
          (policy.mode === "private" ? "btn-bsa-primary" : "btn-bsa-soft") +
          '" data-result-mode="private">Private</button>' +
          '<button type="button" class="btn-bsa btn-bsa-sm ' +
          (policy.mode === "open" ? "btn-bsa-primary" : "btn-bsa-soft") +
          '" data-result-mode="open">Anyone can see all</button>' +
          '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-lock-result-policy="1">Lock decision</button>' +
          (policy.adminLocked
            ? '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-lock-result-policy="0">Unlock</button>'
            : "") +
          "</div>" +
          '<form class="form-bsa" id="grantResultForm">' +
          "<p><strong>Grant someone access to a student's results</strong></p>" +
          '<div class="form-row">' +
          '<label>Student<select name="studentId" required>' +
          studentOptionsHtml("") +
          "</select></label>" +
          '<label>Viewer login / email<input name="viewer" required placeholder="teacher or parent login" /></label>' +
          "</div>" +
          '<button type="submit" class="btn-bsa btn-bsa-primary">Grant access</button>' +
          "</form>" +
          (grantRows.length
            ? table(["Student", "Viewer", ""], grantRows)
            : "<p class='text-muted small'>No extra grants yet.</p>")
      )
    );
  }

  function saveFeeFor(id, value) {
    setAmount(id, "fee", value);
    var kids = loadKids();
    var changed = false;
    kids.forEach(function (k) {
      if ((k.id || k.name) === id) {
        k.fee = parseAmount(value);
        changed = true;
      }
    });
    if (changed) saveKids(kids);
  }

  function saveSalaryFor(id, value) {
    setAmount(id, "salary", value);
    var staff = loadStaff();
    var changed = false;
    staff.forEach(function (t) {
      if ((t.id || t.name) === id) {
        t.salary = parseAmount(value);
        changed = true;
      }
    });
    if (changed) saveStaff(staff);
  }

  function allTeachers() {
    return TEACHERS.concat(loadStaff())
      .filter(function (t) {
        return !isPersonRemoved(t);
      })
      .map(function (t) {
        var copy = {};
        Object.keys(t).forEach(function (k) {
          copy[k] = t[k];
        });
        copy.salary = amountFor(t.id || t.name, "salary", t.salary || 0);
        return applyClassroom(copy);
      });
  }

  function allStudents() {
    return STUDENTS.concat(loadKids())
      .filter(function (s) {
        return !isPersonRemoved(s);
      })
      .map(function (s) {
        var copy = {};
        Object.keys(s).forEach(function (k) {
          copy[k] = s[k];
        });
        copy.fee = amountFor(s.id || s.name, "fee", s.fee || 0);
        return applyClassroom(copy);
      });
  }

  function schoolNameOf(session) {
    if (!session) return "";
    if (session.role === "superadmin" && ops && ops.getActiveSchoolId) {
      var activeId = ops.getActiveSchoolId();
      if (activeId && ops.getSchoolById) {
        var active = ops.getSchoolById(activeId);
        if (active) return String(active.name || "").trim();
      }
      return "";
    }
    return String(session.schoolName || session.className || "").trim();
  }

  function sameSchoolName(a, b) {
    return (
      String(a || "")
        .trim()
        .toLowerCase() ===
      String(b || "")
        .trim()
        .toLowerCase()
    );
  }

  function isPlatformWide(session) {
    if (!session || session.role !== "superadmin") return false;
    if (ops && ops.getActiveSchoolId && ops.getActiveSchoolId()) return false;
    return true;
  }

  function activeSchoolRec() {
    if (!ops || !ops.getActiveSchoolId) return null;
    var id = ops.getActiveSchoolId();
    return id && ops.getSchoolById ? ops.getSchoolById(id) : null;
  }

  function scopedStudents(session) {
    var all = allStudents();
    if (isPlatformWide(session)) return all;
    if (!session) return all;
    if (session.role !== "admin" && session.role !== "superadmin") return all;
    var mine = schoolNameOf(session);
    if (!mine || mine === "All schools") return all;
    return all.filter(function (s) {
      return sameSchoolName(s.school, mine);
    });
  }

  function scopedTeachers(session) {
    var all = allTeachers();
    if (isPlatformWide(session)) return all;
    if (!session) return all;
    if (session.role !== "admin" && session.role !== "superadmin") return all;
    var mine = schoolNameOf(session);
    if (!mine || mine === "All schools") return all;
    return all.filter(function (t) {
      return sameSchoolName(t.school, mine);
    });
  }

  function liveSchools() {
    if (ops && ops.loadSchools) return ops.loadSchools();
    return SCHOOLS.map(function (s, i) {
      return {
        id: "seed-" + i,
        name: s.name,
        city: s.city,
        slug: String(s.name || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
        tagline: "",
        about: "",
        principalEmail: "",
        publicEnabled: true,
      };
    });
  }

  function countForSchool(schoolName, people) {
    return people.filter(function (p) {
      return sameSchoolName(p.school, schoolName);
    }).length;
  }

  function roomSelectOptions(current) {
    return loadRooms()
      .map(function (room) {
        var selected = room === current ? " selected" : "";
        return (
          '<option value="' + escapeHtml(room) + '"' + selected + ">" + escapeHtml(room) + "</option>"
        );
      })
      .join("");
  }

  function inlineRoomSelect(personId, current) {
    return (
      '<select data-room-select="' +
      escapeHtml(personId) +
      '">' +
      roomSelectOptions(current) +
      '</select> <button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-save-room="' +
      escapeHtml(personId) +
      '">Save</button>'
    );
  }

  function portalLockCell(person) {
    var locked = isStudentLocked(person);
    if (locked) {
      return (
        '<span class="text-muted small">Locked</span> ' +
        '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-unlock-student="' +
        escapeHtml(person.id || person.name) +
        '" data-email="' +
        escapeHtml(person.email || "") +
        '">Unlock</button>'
      );
    }
    return (
      '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-primary" data-lock-student="' +
      escapeHtml(person.id || person.name) +
      '" data-email="' +
      escapeHtml(person.email || "") +
      '">Lock</button>'
    );
  }

  function removePersonBtn(kind, person) {
    var label = kind === "student" ? "Remove student" : kind === "teacher" ? "Remove teacher" : "Remove";
    return (
      '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-remove-person data-kind="' +
      escapeHtml(kind) +
      '" data-id="' +
      escapeHtml(person.id || person.name) +
      '" data-email="' +
      escapeHtml(person.email || "") +
      '">' +
      escapeHtml(label) +
      "</button>"
    );
  }

  function moneyInput(kind, id, value) {
    return (
      '<div class="dash-money">' +
      '<input type="number" min="0" step="500" data-' +
      kind +
      '="' +
      escapeHtml(id) +
      '" value="' +
      parseAmount(value) +
      '" />' +
      '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-save-' +
      kind +
      '="' +
      escapeHtml(id) +
      '">Save</button>' +
      "</div>"
    );
  }

  function addKidForm(schoolDefault) {
    var school = escapeHtml(schoolDefault || "BrightFuture Academy");
    return (
      '<form class="form-bsa" id="addKidForm" style="margin-bottom:1.25rem">' +
      "<p><strong>Add a child</strong> — set their monthly fee and they get a student login.</p>" +
      '<div class="form-row">' +
      '<label>Full name<input name="name" required maxlength="80" placeholder="e.g. Ayaan Khan" /></label>' +
      '<label>Year / class<input name="year" required maxlength="40" placeholder="e.g. Grade 1" value="Grade 1" /></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>School<input name="school" required maxlength="80" value="' +
      school +
      '" /></label>' +
      '<label>Monthly fee (€)<input name="fee" type="number" min="0" step="50" value="450" required /></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>Student email (login)<input name="email" type="email" required placeholder="child@email.com" /></label>' +
      '<label>Temporary password<input name="password" value="Demo@12345" minlength="6" /></label>' +
      "</div>" +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Add child</button>' +
      "</form>"
    );
  }

  function addTeacherForm(schoolDefault) {
    var school = escapeHtml(schoolDefault || "BrightFuture Academy");
    return (
      '<form class="form-bsa" id="addTeacherForm" style="margin-bottom:1.25rem">' +
      "<p><strong>Add a teacher</strong> — set their monthly salary and they get a teacher login.</p>" +
      '<div class="form-row">' +
      '<label>Full name<input name="name" required maxlength="80" placeholder="e.g. Sara Malik" /></label>' +
      '<label>Subject<input name="subject" required maxlength="40" placeholder="e.g. Mathematics" /></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>School<input name="school" required maxlength="80" value="' +
      school +
      '" /></label>' +
      '<label>Class / role<input name="className" maxlength="40" placeholder="e.g. Grade 3 homeroom" /></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>Monthly salary (Rs)<input name="salary" type="number" min="0" step="1000" value="75000" required /></label>' +
      '<label>Teacher email (login)<input name="email" type="email" required placeholder="teacher@email.com" /></label>' +
      "</div>" +
      '<label>Temporary password<input name="password" value="Demo@12345" minlength="6" /></label>' +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Add teacher</button>' +
      "</form>"
    );
  }

  function adminPositionOptionsHtml(selected) {
    var positions = auth.adminPositions || {};
    var keys = Object.keys(positions);
    if (!keys.length) {
      return '<option value="full">School Admin (full access)</option>';
    }
    return keys
      .map(function (id) {
        var p = positions[id];
        var sel = id === selected ? " selected" : "";
        return (
          '<option value="' +
          escapeHtml(id) +
          '"' +
          sel +
          ">" +
          escapeHtml(p.label || p.shortLabel || id) +
          "</option>"
        );
      })
      .join("");
  }

  function addAdminForm(schoolDefault) {
    var school = escapeHtml(schoolDefault || "BrightFuture Academy");
    return (
      '<form class="form-bsa" id="addAdminForm" style="margin-bottom:1.25rem">' +
      "<p><strong>Create an admin</strong> — choose a position so they only see the desks they need.</p>" +
      '<div class="form-row">' +
      '<label>Full name<input name="name" required maxlength="80" placeholder="e.g. Nadia Khan" /></label>' +
      '<label>Position<select name="position" required>' +
      adminPositionOptionsHtml("fees") +
      "</select></label>" +
      "</div>" +
      '<div class="form-row">' +
      '<label>School / campus<input name="school" required maxlength="80" value="' +
      school +
      '" /></label>' +
      '<label>Email (login)<input name="email" type="email" required placeholder="fees.admin@school.com" /></label>' +
      "</div>" +
      '<label>Temporary password<input name="password" value="Demo@12345" minlength="6" /></label>' +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Create admin</button>' +
      "</form>"
    );
  }

  function adminsPanel(session) {
    var admins = auth.listAdmins ? auth.listAdmins() : [];
    if (session.role === "admin") {
      var mine = schoolNameOf(session);
      admins = admins.filter(function (a) {
        return !mine || sameSchoolName(a.school, mine) || a.email === session.login;
      });
    }
    var rows = admins.map(function (a) {
      var canRemovePrimary = session.role === "superadmin" && a.builtin;
      var actions =
        a.builtin && !canRemovePrimary
          ? "<span class='text-muted small'>Primary</span>"
          : '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-remove-admin="' +
            escapeHtml(a.email) +
            '"' +
            (a.builtin ? ' data-primary-admin="1"' : "") +
            ">" +
            (a.builtin ? "Remove primary" : "Remove") +
            "</button>";
      return [
        escapeHtml(a.name),
        escapeHtml(a.positionLabel || a.roleLabel || a.position),
        escapeHtml(a.school || "—"),
        escapeHtml(a.email),
        actions,
      ];
    });
    return (
      '<div class="welcome-banner"><h2>' +
      (session.role === "superadmin" ? "Principals & school admins" : "School admins") +
      "</h2><p>" +
      (session.role === "superadmin"
        ? "Create principals for each campus, or add position-based admins. Super Admin also manages security across schools."
        : "Create extra admins with positions such as Account Admin or Fees Managing Admin for your school.") +
      "</p></div>" +
      (canManageSchoolAdmins(session)
        ? addAdminForm(session && schoolNameOf(session) ? schoolNameOf(session) : "BrightFuture Academy")
        : "") +
      panel(
        session.role === "superadmin" ? "All school admins" : "Admins on this school",
        rows.length
          ? table(["Name", "Position", "School", "Login email", "Actions"], rows)
          : "<p class='text-muted'>No admin accounts yet.</p>"
      )
    );
  }

  function studentsPanel(session) {
    var rows = scopedStudents(session).map(function (s) {
      var id = s.id || s.name;
      return [
        escapeHtml(s.name),
        escapeHtml(s.school),
        escapeHtml(s.year),
        inlineRoomSelect(id, s.classroom),
        moneyInput("fee", id, s.fee),
        feeStatusCell(s),
        portalLockCell(s),
        removePersonBtn("student", s),
      ];
    });
    return (
      addKidForm(session && schoolNameOf(session) ? schoolNameOf(session) : "Scuola Materna") +
      panel(
        "Students — edit fees, mark paid, or remove",
        table(
          ["Name", "School", "Year", "Classroom", "Monthly fee", "Fee status", "Portal", "Actions"],
          rows
        )
      )
    );
  }

  function teachersPanel(session) {
    var rows = scopedTeachers(session).map(function (t) {
      var id = t.id || t.name;
      return [
        escapeHtml(t.name),
        escapeHtml(t.school),
        escapeHtml(t.subject),
        inlineRoomSelect(id, t.classroom),
        moneyInput("salary", id, t.salary),
        removePersonBtn("teacher", t),
      ];
    });
    return (
      addTeacherForm(session && schoolNameOf(session) ? schoolNameOf(session) : "BrightFuture Academy") +
      panel(
        "Teachers and monthly salary",
        table(["Name", "School", "Subject", "Classroom", "Monthly salary", "Actions"], rows)
      )
    );
  }

  function countPeopleInRoom(room, people) {
    return people.filter(function (p) {
      return p.classroom === room;
    }).length;
  }

  function classroomsPanel(session) {
    var rooms = loadRooms();
    var students = scopedStudents(session);
    var teachers = scopedTeachers(session);
    var roomRows = rooms.map(function (room) {
      return [
        escapeHtml(room),
        String(countPeopleInRoom(room, students)),
        String(countPeopleInRoom(room, teachers)),
        '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-remove-room="' +
          escapeHtml(room) +
          '">Remove</button>',
      ];
    });

    var assignRows = students
      .concat(
        teachers.map(function (t) {
          return { id: t.id, name: t.name, classroom: t.classroom, kind: "teacher" };
        })
      )
      .map(function (p) {
        var id = p.id || p.name;
        var kind = p.kind || "student";
        return [
          escapeHtml(p.name),
          kind === "teacher" ? "Teacher" : "Student",
          '<select data-room-select="' +
            escapeHtml(id) +
            '">' +
            roomSelectOptions(p.classroom) +
            '</select> <button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-assign-room data-person="' +
            escapeHtml(id) +
            '">Save assignment</button>',
        ];
      });

    return (
      '<form class="form-bsa" id="addRoomForm" style="margin-bottom:1.25rem">' +
      "<p><strong>Add or remove classrooms</strong> — new classes appear in assignments, announcements, homework and results.</p>" +
      '<label>New classroom name<input name="name" required maxlength="60" placeholder="e.g. Grade 6" /></label>' +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Add classroom</button>' +
      "</form>" +
      panel(
        "Classrooms",
        roomRows.length
          ? table(["Classroom", "Students", "Teachers", "Actions"], roomRows)
          : "<p class='text-muted'>No classrooms yet. Add one above.</p>"
      ) +
      panel("Assign people to classrooms", table(["Name", "Role", "Assignment"], assignRows))
    );
  }

  function removeRoom(roomName) {
    var room = String(roomName || "").trim();
    if (!room) return;
    var rooms = loadRooms().filter(function (r) {
      return r !== room;
    });
    saveRooms(rooms);
    var map = loadRoomMap();
    Object.keys(map).forEach(function (id) {
      if (map[id] === room) delete map[id];
    });
    saveRoomMap(map);
    var kids = loadKids().map(function (k) {
      if (k.classroom === room || k.year === room) {
        var copy = {};
        Object.keys(k).forEach(function (key) {
          copy[key] = k[key];
        });
        copy.classroom = "";
        return copy;
      }
      return k;
    });
    saveKids(kids);
    var staff = loadStaff().map(function (t) {
      if (t.classroom === room || t.className === room) {
        var copyT = {};
        Object.keys(t).forEach(function (key) {
          copyT[key] = t[key];
        });
        copyT.classroom = "";
        return copyT;
      }
      return t;
    });
    saveStaff(staff);
  }

  function formatDate(iso) {
    if (!iso) return "";
    return String(iso).replace("T", " ").slice(0, 16);
  }

  function announceListHtml(items, showDelete) {
    if (!items.length) {
      return "<p class='text-muted'>No announcements yet.</p>";
    }
    return (
      "<ul class='announce-list'>" +
      items
        .map(function (a) {
          var deleteBtn = showDelete
            ? ' <button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-delete-announce="' +
              escapeHtml(a.id) +
              '">Delete</button>'
            : "";
          return (
            "<li style='margin-bottom:1rem'>" +
            "<strong>" +
            escapeHtml(a.title) +
            "</strong>" +
            " <span class='text-muted small'>· " +
            escapeHtml(a.audience === "all" ? "Whole school" : a.audience) +
            " · " +
            escapeHtml(formatDate(a.createdAt)) +
            "</span>" +
            deleteBtn +
            "<p>" +
            escapeHtml(a.body) +
            "</p>" +
            "<p class='text-muted small'>Posted by " +
            escapeHtml(a.by || "Admin") +
            "</p></li>"
          );
        })
        .join("") +
      "</ul>"
    );
  }

  function filteredAnnouncements(audiences) {
    var set = {};
    audiences.forEach(function (a) {
      set[a] = true;
    });
    return loadAnnouncements()
      .filter(function (a) {
        if (a.audience === "all") return true;
        return !!set[a.audience];
      })
      .sort(function (a, b) {
        return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      });
  }

  function announcePanel(session) {
    var rooms = loadRooms();
    var audienceOpts =
      '<option value="all">Whole school</option>' +
      rooms
        .map(function (r) {
          return '<option value="' + escapeHtml(r) + '">' + escapeHtml(r) + "</option>";
        })
        .join("");
    var schoolOpts = "";
    if (session.role === "superadmin") {
      schoolOpts =
        '<label>Target school<select name="schoolId">' +
        '<option value="">All schools</option>' +
        liveSchools()
          .map(function (s) {
            var active = activeSchoolRec();
            return (
              '<option value="' +
              escapeHtml(s.id) +
              '"' +
              (active && active.id === s.id ? " selected" : "") +
              ">" +
              escapeHtml(s.name) +
              "</option>"
            );
          })
          .join("") +
        "</select></label>";
    }
    var list = loadAnnouncements().sort(function (a, b) {
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
    if (session.role === "admin") {
      var mine = schoolNameOf(session);
      list = list.filter(function (a) {
        if (!a.schoolId && !a.schoolName) return true;
        return sameSchoolName(a.schoolName, mine) || a.schoolId === session.schoolId;
      });
    }
    return (
      '<form class="form-bsa" id="announceForm" style="margin-bottom:1.25rem">' +
      "<p><strong>Post an announcement</strong></p>" +
      '<label>Title<input name="title" required maxlength="120" placeholder="e.g. Sports day" /></label>' +
      '<label>Message<textarea name="body" required maxlength="800" rows="3" placeholder="Details for parents and students"></textarea></label>' +
      schoolOpts +
      '<label>Audience<select name="audience">' +
      audienceOpts +
      "</select></label>" +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Publish announcement</button>' +
      "</form>" +
      panel("School announcements", announceListHtml(list, true))
    );
  }

  function studentNoticesPanel(session) {
    var classroom = sessionClassroom(session);
    var items = filteredAnnouncements(["all", classroom]);
    return panel(
      "School notices · " + escapeHtml(classroom || "your class"),
      announceListHtml(items, false)
    );
  }

  function parentNoticesPanel() {
    var linked = parentLinkedClassroom();
    var items = filteredAnnouncements(["all", linked]);
    return panel(
      "Announcements for Alex · " + escapeHtml(linked),
      announceListHtml(items, false)
    );
  }

  function recentNoticesSnippet(session, limit) {
    var classroom = sessionClassroom(session);
    var items = filteredAnnouncements(["all", classroom]).slice(0, limit || 2);
    if (!items.length) return "<p class='text-muted small'>No notices yet.</p>";
    return items
      .map(function (a) {
        return (
          "<p><strong>" +
          escapeHtml(a.title) +
          "</strong> — " +
          escapeHtml(a.body).slice(0, 80) +
          (a.body.length > 80 ? "…" : "") +
          "</p>"
        );
      })
      .join("");
  }

  function homeworkListHtml(items, showDelete) {
    if (!items.length) {
      return "<p class='text-muted'>No homework posted yet.</p>";
    }
    return (
      "<ul>" +
      items
        .map(function (h) {
          var deleteBtn = showDelete
            ? ' <button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-delete-homework="' +
              escapeHtml(h.id) +
              '">Delete</button>'
            : "";
          return (
            "<li style='margin-bottom:1rem'><strong>" +
            escapeHtml(h.title) +
            "</strong> · " +
            escapeHtml(h.classroom) +
            " · due " +
            escapeHtml(h.due || "TBC") +
            deleteBtn +
            "<p>" +
            escapeHtml(h.body) +
            "</p>" +
            "<p class='text-muted small'>By " +
            escapeHtml(h.teacher || "Teacher") +
            " · " +
            escapeHtml(formatDate(h.createdAt)) +
            "</p></li>"
          );
        })
        .join("") +
      "</ul>"
    );
  }

  function homeworkPanel(session) {
    var defaultRoom = sessionClassroom(session) || session.className || loadRooms()[0] || "";
    var rooms = loadRooms();
    var roomOpts = rooms
      .map(function (r) {
        var sel = r === defaultRoom ? " selected" : "";
        return '<option value="' + escapeHtml(r) + '"' + sel + ">" + escapeHtml(r) + "</option>";
      })
      .join("");
    var mine = loadHomework()
      .filter(function (h) {
        return h.teacherLogin === session.login;
      })
      .sort(function (a, b) {
        return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      });
    return (
      '<form class="form-bsa" id="homeworkForm" style="margin-bottom:1.25rem">' +
      "<p><strong>Assign homework</strong></p>" +
      '<label>Title<input name="title" required maxlength="120" placeholder="e.g. Fractions worksheet" /></label>' +
      '<label>Instructions<textarea name="body" required maxlength="800" rows="3" placeholder="What students should complete"></textarea></label>' +
      '<div class="form-row">' +
      '<label>Due date<input name="due" maxlength="40" placeholder="e.g. Friday 14 March" /></label>' +
      '<label>Classroom<select name="classroom">' +
      roomOpts +
      "</select></label>" +
      "</div>" +
      '<button type="submit" class="btn-bsa btn-bsa-primary">Post homework</button>' +
      "</form>" +
      panel("Homework you posted", homeworkListHtml(mine, true))
    );
  }

  function studentHomeworkPanel(session) {
    var classroom = sessionClassroom(session);
    var items = loadHomework()
      .filter(function (h) {
        return h.classroom === classroom;
      })
      .sort(function (a, b) {
        return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      });
    return panel(
      "Homework · " + escapeHtml(classroom || "your class"),
      homeworkListHtml(items, false)
    );
  }

  function loadResults() {
    var list = loadList(RESULTS_KEY);
    if (list.length) return list;
    return [
      {
        id: "res-seed-1",
        studentName: "Alex Rivera",
        studentId: "seed-alex",
        subject: "Math",
        paperType: "test",
        title: "Fractions test",
        mark: "88",
        maxMark: "100",
        classroom: "Grade 4 · Maple",
        school: "Scuola Materna",
        teacher: "Sarah Wilson",
        teacherLogin: "teacher_demo",
        createdAt: new Date().toISOString(),
        updatedAt: "",
        updatedBy: "",
      },
      {
        id: "res-seed-2",
        studentName: "Alex Rivera",
        studentId: "seed-alex",
        subject: "Science",
        paperType: "paper",
        title: "Plant diary paper",
        mark: "92",
        maxMark: "100",
        classroom: "Grade 4 · Maple",
        school: "Scuola Materna",
        teacher: "David Chen",
        teacherLogin: "",
        createdAt: new Date().toISOString(),
        updatedAt: "",
        updatedBy: "",
      },
      {
        id: "res-seed-3",
        studentName: "Mia Chen",
        studentId: "seed-mia",
        subject: "English",
        paperType: "test",
        title: "Reading comprehension",
        mark: "91",
        maxMark: "100",
        classroom: "Grade 4 · Maple",
        school: "Scuola Materna",
        teacher: "Amina Rahman",
        teacherLogin: "",
        createdAt: new Date().toISOString(),
        updatedAt: "",
        updatedBy: "",
      },
    ];
  }

  function saveResults(list) {
    saveList(RESULTS_KEY, list);
  }

  function studentOptionsHtml(selected) {
    return (
      '<option value="">Select student</option>' +
      allStudents()
        .map(function (s) {
          var id = s.id || s.name;
          var label = s.name + (s.classroom ? " · " + s.classroom : "");
          return (
            '<option value="' +
            escapeHtml(id) +
            '"' +
            (selected === id ? " selected" : "") +
            ">" +
            escapeHtml(label) +
            "</option>"
          );
        })
        .join("")
    );
  }

  function paperTypeLabel(type) {
    var map = { test: "Test", paper: "Paper", quiz: "Quiz", exam: "Exam" };
    return map[type] || "Test";
  }

  function markDisplay(r) {
    var mark = String(r.mark == null ? "" : r.mark).trim();
    var max = String(r.maxMark == null ? "" : r.maxMark).trim();
    if (!mark) return "—";
    if (mark.indexOf("%") !== -1) return mark;
    if (max) return mark + " / " + max;
    return mark;
  }

  function resultsUploadForm(session, isAdmin) {
    var classroomDefault = sessionClassroom(session) || "Grade 4 · Maple";
    return (
      '<form class="form-bsa" id="resultForm" style="margin-bottom:1.25rem">' +
      "<p><strong>" +
      (isAdmin ? "Create a result record" : "Upload a test / paper result") +
      "</strong></p>" +
      '<div class="form-row">' +
      '<label>Student<select name="studentId" required>' +
      studentOptionsHtml("") +
      "</select></label>" +
      '<label>Subject<input name="subject" required maxlength="40" placeholder="e.g. Mathematics" value="' +
      escapeHtml(isAdmin ? "" : session.className && session.className.indexOf("Math") !== -1 ? "Mathematics" : "") +
      '" /></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>Type<select name="paperType"><option value="test">Test</option><option value="paper">Paper</option><option value="quiz">Quiz</option><option value="exam">Exam</option></select></label>' +
      '<label>Title<input name="title" required maxlength="80" placeholder="e.g. Mid-term paper" /></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>Mark<input name="mark" required maxlength="20" placeholder="e.g. 88" /></label>' +
      '<label>Out of<input name="maxMark" maxlength="20" value="100" placeholder="100" /></label>' +
      "</div>" +
      '<div class="form-row">' +
      '<label>Classroom<select name="classroom">' +
      roomSelectOptions(classroomDefault) +
      "</select></label>" +
      '<label>School<input name="school" maxlength="80" value="' +
      escapeHtml(session.className && session.role !== "teacher" ? session.className : "BrightFuture Academy") +
      '" /></label>' +
      "</div>" +
      '<button type="submit" class="btn-bsa btn-bsa-primary">' +
      (isAdmin ? "Save record" : "Upload result") +
      "</button>" +
      "</form>"
    );
  }

  function resultsTable(session, items, editable) {
    if (!items.length) {
      return "<p class='text-muted'>No results on file yet.</p>";
    }
    if (editable) {
      var editRows = items.map(function (r) {
        return [
          escapeHtml(r.studentName),
          '<input type="text" data-result-subject="' +
            escapeHtml(r.id) +
            '" value="' +
            escapeHtml(r.subject || "") +
            '" />',
          escapeHtml(paperTypeLabel(r.paperType)),
          '<input type="text" data-result-title="' +
            escapeHtml(r.id) +
            '" value="' +
            escapeHtml(r.title || "") +
            '" />',
          '<div class="dash-money"><input type="text" data-result-mark="' +
            escapeHtml(r.id) +
            '" value="' +
            escapeHtml(r.mark) +
            '" /> <input type="text" data-result-max="' +
            escapeHtml(r.id) +
            '" value="' +
            escapeHtml(r.maxMark || "100") +
            '" style="width:4.5rem" /> <button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-save-result="' +
            escapeHtml(r.id) +
            '">Save</button></div>',
          escapeHtml(r.classroom || ""),
          escapeHtml(r.school || ""),
          escapeHtml(r.teacher || ""),
          escapeHtml(formatDate(r.updatedAt || r.createdAt)),
          '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-delete-result="' +
            escapeHtml(r.id) +
            '">Delete</button>',
        ];
      });
      return table(
        ["Student", "Subject", "Type", "Title", "Mark", "Class", "School", "Teacher", "Updated", "Actions"],
        editRows
      );
    }
    var rows = items.map(function (r) {
      return [
        escapeHtml(r.studentName),
        escapeHtml(r.subject),
        escapeHtml(paperTypeLabel(r.paperType)),
        escapeHtml(r.title),
        escapeHtml(markDisplay(r)),
        escapeHtml(r.classroom || ""),
        escapeHtml(r.school || ""),
        escapeHtml(r.teacher || ""),
        escapeHtml(formatDate(r.updatedAt || r.createdAt)),
        "—",
      ];
    });
    return table(
      ["Student", "Subject", "Type", "Title", "Mark", "Class", "School", "Teacher", "Updated", "Actions"],
      rows
    );
  }

  function allResultsForManagers(session) {
    if (session && (session.role === "admin" || session.role === "superadmin")) {
      return loadResults().slice();
    }
    return visibleResultsFor(session);
  }

  function visibleResultsFor(session) {
    return loadResults().filter(function (r) {
      if (!ops || !ops.canViewResult) return true;
      return ops.canViewResult(session, r, function (s) {
        return ops.kidIdsForParent(s);
      });
    });
  }

  function teacherResultsPanel(session) {
    var mine = visibleResultsFor(session)
      .filter(function (r) {
        return (
          r.teacherLogin === session.login ||
          r.teacher === session.name ||
          (!r.teacherLogin && r.classroom === sessionClassroom(session))
        );
      })
      .sort(function (a, b) {
        return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      });
    return (
      resultsUploadForm(session, false) +
      panel("My uploaded tests & papers", resultsTable(session, mine, false))
    );
  }

  function adminResultsPanel(session) {
    var all = allResultsForManagers(session).sort(function (a, b) {
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
    return (
      '<div class="welcome-banner"><h2>All student results</h2><p>Principals and Super Admin can view, edit marks/titles, or delete every result on file.</p></div>' +
      resultsUploadForm(session, true) +
      resultAccessPanel(session) +
      panel("All test & paper records", resultsTable(session, all, true))
    );
  }

  function studentMarksPanel(session) {
    var items = visibleResultsFor(session)
      .filter(function (r) {
        return r.studentName === session.name || r.studentId === session.personId;
      })
      .sort(function (a, b) {
        return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      });
    if (!items.length) {
      return panel("Recent marks", "<p class='text-muted'>No marks visible for you yet.</p>");
    }
    return panel(
      "Recent marks",
      table(
        ["Subject", "Type", "Title", "Mark", "Teacher"],
        items.map(function (r) {
          return [
            escapeHtml(r.subject),
            escapeHtml(paperTypeLabel(r.paperType)),
            escapeHtml(r.title),
            escapeHtml(markDisplay(r)),
            escapeHtml(r.teacher || "—"),
          ];
        })
      )
    );
  }

  function parentResultsPanel(session) {
    var items = visibleResultsFor(session).sort(function (a, b) {
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
    if (!items.length) {
      return panel("Children's results", "<p class='text-muted'>No results visible for your children yet.</p>");
    }
    return panel(
      "Children's test & paper results",
      table(
        ["Child", "Subject", "Type", "Title", "Mark", "Teacher"],
        items.map(function (r) {
          return [
            escapeHtml(r.studentName),
            escapeHtml(r.subject),
            escapeHtml(paperTypeLabel(r.paperType)),
            escapeHtml(r.title),
            escapeHtml(markDisplay(r)),
            escapeHtml(r.teacher || "—"),
          ];
        })
      )
    );
  }

  function feedbackPanel(session) {
    var isAdmin = session.role === "admin" || session.role === "superadmin";
    var form = "";
    if (!isAdmin) {
      form =
        '<form class="form-bsa" id="feedbackForm" style="margin-bottom:1.25rem">' +
        "<p><strong>Send a suggestion or complaint</strong> — tick anonymous if you do not want your name shown.</p>" +
        '<label>Type<select name="kind"><option value="suggestion">Suggestion</option><option value="complaint">Complaint</option></select></label>' +
        '<label>Message<textarea name="body" required maxlength="800" rows="3" placeholder="Your feedback"></textarea></label>' +
        '<label class="form-bsa__check"><input type="checkbox" name="anonymous" /> Send anonymously</label>' +
        '<button type="submit" class="btn-bsa btn-bsa-primary">Submit feedback</button>' +
        "</form>";
    }

    var all = loadFeedback().sort(function (a, b) {
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });

    if (isAdmin) {
      var rows = all.map(function (f) {
        return [
          escapeHtml(formatDate(f.createdAt)),
          escapeHtml(f.kind === "complaint" ? "Complaint" : "Suggestion"),
          escapeHtml(f.author || "Anonymous"),
          escapeHtml(f.role || ""),
          escapeHtml(f.body),
        ];
      });
      return (
        '<div class="welcome-banner"><h2>Feedback inbox</h2><p>Suggestions and complaints from students, parents and teachers. Admin does not send feedback here — only reviews it.</p></div>' +
        panel("Received feedback", table(["When", "Type", "From", "Role", "Message"], rows.length ? rows : [["—", "—", "—", "—", "No feedback yet."]]))
      );
    }

    var mine = all.filter(function (f) {
      return f.ownerLogin === session.login || f.login === session.login;
    });
    var mineRows = mine.map(function (f) {
      return [
        escapeHtml(formatDate(f.createdAt)),
        escapeHtml(f.kind === "complaint" ? "Complaint" : "Suggestion"),
        escapeHtml(f.anonymous ? "Anonymous" : f.author || ""),
        escapeHtml(f.body),
      ];
    });

    return (
      form +
      panel(
        "Your recent feedback",
        mineRows.length
          ? table(["When", "Type", "Shown as", "Message"], mineRows)
          : "<p class='text-muted'>You have not sent feedback yet.</p>"
      )
    );
  }

  function analyticsPanelShell() {
    return (
      '<div class="welcome-banner"><h2>Website analytics</h2><p>Unique people who opened the public BrightSteps site (homepage, about, programs, contact, …).</p></div>' +
      '<div id="webAnalyticsKpis">' +
      kpis([
        { label: "Opened today", value: "…", accent: "accent-mint" },
        { label: "Last 7 days", value: "…", accent: "accent-sky" },
        { label: "Last 30 days", value: "…", accent: "accent-royal" },
        { label: "Status", value: "Loading", accent: "accent-coral" },
      ]) +
      "</div>" +
      panel(
        "About these numbers",
        "<p>Each browser counts <strong>once per day</strong> when someone opens the public school website. Dashboard, login and register are not counted. After deploy, open the public site once to start the tally.</p>"
      )
    );
  }

  function loadWebAnalyticsInto(host) {
    if (!host) return;
    fetch("/api/demos/brightsteps/opens", { cache: "no-store" })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        var d = result.data || {};
        var today = result.ok ? String(d.today || 0) : "—";
        var week = result.ok ? String(d.week || 0) : "—";
        var month = result.ok ? String(d.month || 0) : "—";
        var status = result.ok ? "Live" : "Unavailable";
        host.innerHTML = kpis([
          { label: "Opened today", value: today, accent: "accent-mint" },
          { label: "Last 7 days", value: week, accent: "accent-sky" },
          { label: "Last 30 days", value: month, accent: "accent-royal" },
          { label: "Status", value: status, accent: result.ok ? "accent-mint" : "accent-coral" },
        ]);
      })
      .catch(function () {
        host.innerHTML = kpis([
          { label: "Opened today", value: "—", accent: "accent-mint" },
          { label: "Last 7 days", value: "—", accent: "accent-sky" },
          { label: "Last 30 days", value: "—", accent: "accent-royal" },
          { label: "Status", value: "Error", accent: "accent-coral" },
        ]);
      });
  }

  function feesPanel(session) {
    var students = scopedStudents(session);
    var unpaid = students.filter(function (s) {
      return !isFeePaid(s.id || s.name);
    });
    var paid = students.filter(function (s) {
      return isFeePaid(s.id || s.name);
    });
    var unpaidTotal = unpaid.reduce(function (sum, s) {
      return sum + parseAmount(s.fee);
    }, 0);
    var total = students.reduce(function (sum, s) {
      return sum + parseAmount(s.fee);
    }, 0);

    var unpaidRows = unpaid.map(function (s) {
      var id = s.id || s.name;
      return [
        escapeHtml(s.name),
        escapeHtml(s.year),
        escapeHtml(s.school),
        money(s.fee),
        feeStatusCell(s),
        removePersonBtn("student", s),
      ];
    });

    var allRows = students.map(function (s) {
      var id = s.id || s.name;
      return [
        escapeHtml(s.name),
        escapeHtml(s.year),
        escapeHtml(s.school),
        moneyInput("fee", id, s.fee),
        feeStatusCell(s),
        removePersonBtn("student", s),
      ];
    });

    return (
      kpis([
        { label: "Students", value: String(students.length), accent: "accent-mint" },
        { label: "Pending fees", value: String(unpaid.length), accent: "accent-coral" },
        { label: "Pending total", value: money(unpaidTotal), accent: "accent-royal" },
        { label: "Monthly fee roll", value: money(total), accent: "accent-sky" },
      ]) +
      panel(
        "Students with pending fees",
        unpaidRows.length
          ? table(["Student", "Year", "School", "Fee due", "Status", "Actions"], unpaidRows)
          : "<p class='text-muted'>No pending fees — everyone is marked paid.</p>"
      ) +
      panel(
        "All fees",
        table(["Student", "Year", "School", "Monthly fee", "Status", "Actions"], allRows) +
          (paid.length
            ? "<p class='text-muted small' style='margin-top:0.75rem'>" +
              paid.length +
              " paid · " +
              unpaid.length +
              " pending</p>"
            : "")
      )
    );
  }
  function loadVisits() {
    try {
      var raw = localStorage.getItem("brightsteps-demo-visits");
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function meetingsPanel() {
    var visits = loadVisits();
    if (!visits.length) {
      return panel(
        "Campus visit meetings",
        "<p>No visit bookings yet. When a signed-in parent books a visit in the campus chat, it appears here.</p>"
      );
    }
    return panel(
      "Campus visit meetings",
      table(
        ["When requested", "Name", "Email", "Visit time", "Child / year"],
        visits.map(function (v) {
          return [
            escapeHtml(v.createdAt ? String(v.createdAt).replace("T", " ").slice(0, 16) : ""),
            escapeHtml(v.name),
            escapeHtml(v.email),
            escapeHtml(v.when),
            escapeHtml(v.age),
          ];
        })
      )
    );
  }

  function greeting() {
    var hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  function schoolsManagePanel(session) {
    var schools = liveSchools();
    var students = allStudents();
    var teachers = allTeachers();
    var rows = schools.map(function (s) {
      var path =
        ops && ops.publicSitePath
          ? ops.publicSitePath(s)
          : "/demos/brightsteps/school.html?s=" + encodeURIComponent(s.slug);
      var edit = path + (path.indexOf("?") >= 0 ? "&" : "?") + "edit=1";
      return [
        session.role === "superadmin"
          ? '<button type="button" class="btn-bsa btn-bsa-ghost btn-bsa-sm" style="padding:0;border:0;background:transparent;font-weight:700;color:inherit" data-enter-school="' +
            escapeHtml(s.id) +
            '" data-goto-section="home">' +
            escapeHtml(s.name) +
            "</button>"
          : escapeHtml(s.name),
        escapeHtml(s.city || "—"),
        String(countForSchool(s.name, students)),
        String(countForSchool(s.name, teachers)),
        escapeHtml(s.principalEmail || "—"),
        '<a class="btn-bsa btn-bsa-sm btn-bsa-soft" href="' +
          escapeHtml(edit) +
          '">Edit website</a> <a class="btn-bsa btn-bsa-sm btn-bsa-soft" href="' +
          escapeHtml(path) +
          '" target="_blank" rel="noopener">View live</a>' +
        (session.role === "superadmin"
          ? ' <button type="button" class="btn-bsa btn-bsa-sm btn-bsa-primary" data-enter-school="' +
            escapeHtml(s.id) +
            '" data-goto-section="home">Open desk</button>'
          : "") +
        (session.role === "superadmin"
          ? ' <button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-remove-school="' +
            escapeHtml(s.id) +
            '">Remove</button>'
          : "—"),
      ];
    });

    var createForm = "";
    if (session.role === "superadmin") {
      createForm =
        '<form class="form-bsa" id="addSchoolForm" style="margin-bottom:1.25rem">' +
        "<p><strong>Create a school website</strong> — adds a public campus page and (optionally) a principal login who manages that school only.</p>" +
        '<div class="form-row">' +
        '<label>School name<input name="name" required maxlength="80" placeholder="e.g. Sunrise Primary" /></label>' +
        '<label>City<input name="city" required maxlength="60" placeholder="e.g. Firenze" /></label>' +
        "</div>" +
        '<div class="form-row">' +
        '<label>Public URL slug<input name="slug" maxlength="48" placeholder="sunrise-primary" /></label>' +
        '<label>Tagline<input name="tagline" maxlength="80" placeholder="Learn. Explore. Grow." /></label>' +
        "</div>" +
        '<label>About (public site)<textarea name="about" rows="2" maxlength="500" placeholder="Short welcome for the school website"></textarea></label>' +
        "<p><strong>Principal / school admin</strong> (optional — creates their login)</p>" +
        '<div class="form-row">' +
        '<label>Principal name<input name="principalName" maxlength="80" placeholder="e.g. Maria Conti" /></label>' +
        '<label>Principal email<input name="principalEmail" type="email" placeholder="principal@school.com" /></label>' +
        "</div>" +
        '<label>Temporary password<input name="principalPassword" value="Demo@12345" minlength="6" /></label>' +
        '<button type="submit" class="btn-bsa btn-bsa-primary">Create school + public site</button>' +
        "</form>";
    }

    return (
      '<div class="welcome-banner"><h2>Schools on the platform</h2><p>Super Admin owns the software: create campuses, publish their public sites, and assign principals. Each principal manages staff and students for their school.</p></div>' +
      createForm +
      panel(
        "All schools",
        table(
          ["School", "City", "Students", "Teachers", "Principal login", "Actions"],
          rows
        )
      ) +
      '<p class="text-muted small">Directory: <a href="/demos/brightsteps/schools.html">/demos/brightsteps/schools.html</a></p>'
    );
  }

  function securityPanel(session) {
    if (session.role !== "superadmin") {
      return panel("Security", "<p>Only Super Admin can manage platform security.</p>");
    }
    var state = auth.listSecurityState ? auth.listSecurityState() : { locked: [], removed: [] };
    var admins = auth.listAdmins ? auth.listAdmins() : [];
    var lockRows = (state.locked || []).map(function (k) {
      return [
        escapeHtml(k),
        "Portal locked",
        '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-unlock-key="' +
          escapeHtml(k) +
          '">Unlock</button>',
      ];
    });
    var removedRows = (state.removed || []).slice(0, 40).map(function (k) {
      return [escapeHtml(k), "Removed / blocked"];
    });
    var adminRows = admins.map(function (a) {
      return [
        escapeHtml(a.name),
        escapeHtml(a.school || "—"),
        escapeHtml(a.email),
        escapeHtml(a.positionLabel || a.roleLabel),
        '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-remove-admin="' +
          escapeHtml(a.email) +
          '"' +
          (a.builtin ? ' data-primary-admin="1"' : "") +
          ">" +
          (a.builtin ? "Remove primary" : "Remove access") +
          "</button>",
      ];
    });
    return (
      '<div class="welcome-banner"><h2>Platform security</h2><p>Super Admin oversees every school: unlock portals, review removals, and revoke school-admin access.</p></div>' +
      panel(
        "Locked portals",
        lockRows.length
          ? table(["Account / key", "Status", "Action"], lockRows)
          : "<p class='text-muted'>No locked portals right now.</p>"
      ) +
      panel(
        "School admins / principals",
        table(["Name", "School", "Email", "Position", "Actions"], adminRows)
      ) +
      panel(
        "Removed accounts (sample)",
        removedRows.length
          ? table(["Key", "Status"], removedRows)
          : "<p class='text-muted'>No removed accounts recorded.</p>"
      )
    );
  }

  function kpis(items) {
    return (
      '<div class="grid-4 mb-2">' +
      items
        .map(function (item) {
          return (
            '<article class="kpi-card ' +
            item.accent +
            '"><p class="kpi-label">' +
            item.label +
            '</p><h3 class="mb-0">' +
            item.value +
            "</h3></article>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function panel(title, body) {
    return '<div class="dash-panel"><div class="dash-panel__head"><h3>' + title + "</h3></div>" + body + "</div>";
  }

  function table(headers, rows) {
    var head = headers.map(function (h) {
      return "<th>" + h + "</th>";
    }).join("");
    var body = rows
      .map(function (row) {
        return "<tr>" + row.map(function (cell) {
          return "<td>" + cell + "</td>";
        }).join("") + "</tr>";
      })
      .join("");
    return (
      '<div class="table-responsive"><table class="dash-table"><thead><tr>' +
      head +
      "</tr></thead><tbody>" +
      body +
      "</tbody></table></div>"
    );
  }

  function timeline(items) {
    return (
      '<div class="timeline">' +
      items
        .map(function (item) {
          return (
            '<div class="timeline-item"><div class="time">' +
            item.time +
            "</div><div><strong>" +
            item.title +
            "</strong><span>" +
            item.detail +
            "</span></div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function welcome(session, subtitle) {
    return (
      '<div class="welcome-banner"><h2>' +
      greeting() +
      ", " +
      session.name.split(" ")[0] +
      '</h2><p>' +
      (subtitle || session.className || "") +
      "</p></div>"
    );
  }

  function contentFor(session, section) {
    var role = session.role;
    section = section || "home";

    if (role === "student") {
      if (section === "book-visit") return bookVisitPanel(session);
      if (section === "timetable") {
        return panel(
          "Today's timetable",
          timeline([
            { time: "8:30", title: "Mathematics", detail: "Room 12 · Ms. Wilson" },
            { time: "10:00", title: "Science", detail: "Lab 2 · Mr. Chen" },
            { time: "11:30", title: "English", detail: "Room 8 · Ms. Rahman" },
            { time: "13:30", title: "Art", detail: "Studio · Ms. Sharma" },
          ])
        );
      }
      if (section === "assignments") {
        return studentHomeworkPanel(session);
      }
      if (section === "attendance") {
        return studentAttendancePanel(session);
      }
      if (section === "announcements") {
        return studentNoticesPanel(session);
      }
      if (section === "feedback") {
        return feedbackPanel(session);
      }
      if (section === "marks") {
        return studentMarksPanel(session);
      }
      var pendingHw = loadHomework().filter(function (h) {
        return h.classroom === sessionClassroom(session);
      }).length;
      return (
        welcome(session) +
        kpis([
          { label: "Attendance", value: "96%", accent: "accent-mint" },
          { label: "Pending work", value: String(pendingHw), accent: "accent-sky" },
          { label: "Upcoming exams", value: "1", accent: "accent-royal" },
          { label: "Recent average", value: "88%", accent: "accent-coral" },
        ]) +
        '<div class="grid-2">' +
        panel(
          "Today's classes",
          timeline([
            { time: "8:30", title: "Mathematics", detail: "Room 12" },
            { time: "10:00", title: "Science", detail: "Lab 2" },
          ])
        ) +
        panel(
          "Latest notices",
          recentNoticesSnippet(session, 3) +
            '<p><button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-section="announcements">All notices</button></p>'
        ) +
        "</div>"
      );
    }

    if (role === "parent") {
      if (section === "kids") return parentKidsPanel(session);
      if (section === "book-visit") return bookVisitPanel(session);
      if (section === "results" || section === "marks") return parentResultsPanel(session);
      if (section === "diary") {
        return panel(
          "Class diary",
          "<p><strong>Science</strong> — Plant growth topic introduced.</p><p><strong>English</strong> — Creative writing: my weekend.</p><p><strong>Math</strong> — Fractions with counters.</p>"
        );
      }
      if (section === "attendance") {
        return parentAttendancePanel();
      }
      if (section === "announcements") {
        return parentNoticesPanel();
      }
      if (section === "feedback") {
        return feedbackPanel(session);
      }
      var kidsHome = parentKidsList();
      var kidCards = kidsHome
        .map(function (s) {
          return (
            panel(
              escapeHtml(s.name) + " · " + escapeHtml(s.year || ""),
              "<p>" +
                escapeHtml(s.classroom || "") +
                " · " +
                escapeHtml(s.school || "") +
                "</p><p><button type='button' class='btn-bsa btn-bsa-sm btn-bsa-soft' data-section='kids'>Manage children</button> <button type='button' class='btn-bsa btn-bsa-sm btn-bsa-soft' data-section='results'>Results</button></p>"
            )
          );
        })
        .join("");
      return (
        welcome(session, "Diary, attendance, results and visits for your linked children.") +
        kpis([
          { label: "Children", value: String(kidsHome.length), accent: "accent-mint" },
          {
            label: "Unread notices",
            value: String(filteredAnnouncements(["all", parentLinkedClassroom()]).length),
            accent: "accent-sky",
          },
          { label: "Visible results", value: String(visibleResultsFor(session).length), accent: "accent-royal" },
          { label: "Events", value: "1", accent: "accent-coral" },
        ]) +
        (kidCards || panel("Children", "<p class='text-muted'>No children linked.</p>"))
      );
    }

    if (role === "teacher") {
      if (section === "book-visit") return bookVisitPanel(session);
      if (section === "class") {
        var myRoom = sessionClassroom(session);
        var classStudents = studentsInTeacherClass(session);
        var classRows = classStudents.length
          ? classStudents.map(function (s) {
              var att = getAttendance(s.id || s.name);
              return [
                escapeHtml(s.name),
                escapeHtml(attendanceStatusLabel(att && att.status)),
                escapeHtml(s.avg || "—"),
              ];
            })
          : [["—", "No students assigned", "—"]];
        return panel(
          escapeHtml(myRoom || "My class") + " · " + classRows.length + " students",
          table(["Student", "Attendance", "Last mark"], classRows)
        );
      }
      if (section === "assignments") {
        return homeworkPanel(session);
      }
      if (section === "feedback") {
        return feedbackPanel(session);
      }
      if (section === "attendance") {
        return teacherAttendancePanel(session);
      }
      if (section === "results") {
        return teacherResultsPanel(session);
      }
      return (
        welcome(session) +
        kpis([
          { label: "My students", value: "24", accent: "accent-sky" },
          { label: "Lessons today", value: "4", accent: "accent-mint" },
          { label: "To mark", value: "6", accent: "accent-coral" },
          { label: "Messages", value: "3", accent: "accent-royal" },
        ]) +
        '<div class="grid-2">' +
        panel(
          "Today",
          timeline([
            { time: "8:30", title: "Mathematics 4A", detail: "Room 12" },
            { time: "10:00", title: "Mathematics 5B", detail: "Room 12" },
            { time: "13:30", title: "Planning", detail: "Staff room" },
          ])
        ) +
        panel(
          "Quick actions",
          '<p><button type="button" class="btn-bsa btn-bsa-soft" data-section="attendance">Take attendance</button></p><p><button type="button" class="btn-bsa btn-bsa-soft" data-section="class">Open class list</button></p><p><button type="button" class="btn-bsa btn-bsa-soft" data-section="assignments">Post homework</button></p>'
        ) +
        "</div>"
      );
    }

    if (role === "headmaster") {
      if (section === "staff") {
        return panel(
          "Staff",
          table(
            ["Name", "Role", "Subject"],
            TEACHERS.filter(function (t) {
              return t.school === "Scuola Materna";
            }).map(function (t) {
              return [t.name, "Teacher", t.subject];
            })
          )
        );
      }
      if (section === "students") {
        return panel(
          "Students",
          table(
            ["Name", "Year", "Average"],
            STUDENTS.filter(function (s) {
              return s.school === "Scuola Materna";
            }).map(function (s) {
              return [s.name, s.year, s.avg];
            })
          )
        );
      }
      if (section === "reports") {
        var schoolResults = loadResults().filter(function (r) {
          return !r.school || r.school === "Scuola Materna";
        });
        return panel(
          "Results",
          table(
            ["Student", "Subject", "Mark"],
            schoolResults.map(function (r) {
              return [escapeHtml(r.studentName), escapeHtml(r.subject), escapeHtml(markDisplay(r))];
            })
          )
        );
      }
      return (
        '<div class="welcome-banner"><h2>School overview</h2><p>' +
        session.className +
        "</p></div>" +
        kpis([
          { label: "Students", value: "412", accent: "accent-mint" },
          { label: "Staff", value: "38", accent: "accent-sky" },
          { label: "Attendance", value: "94%", accent: "accent-royal" },
          { label: "Open tasks", value: "5", accent: "accent-coral" },
        ]) +
        panel("This week", "<p>Staff meeting — Wednesday</p><p>Inspection prep — ongoing</p><p>Sports day — Friday</p>")
      );
    }

    if (role === "admin") {
      if (section === "meetings") return meetingsPanel();
      if (section === "staff") return teachersPanel(session);
      if (section === "students") return studentsPanel(session);
      if (section === "parents") return parentsPanel();
      if (section === "book-visit") return bookVisitPanel(session);
      if (section === "fees") return feesPanel(session);
      if (section === "classrooms") return classroomsPanel(session);
      if (section === "announce") return announcePanel(session);
      if (section === "feedback") return feedbackPanel(session);
      if (section === "results") return adminResultsPanel(session);
      if (section === "attendance") return adminAttendancePanel(session);
      if (section === "slorsh-reports") return schoolReportsPanel(session);
      if (section === "analytics") return analyticsPanelShell();
      if (section === "admins") return adminsPanel(session);
      if (section === "settings") {
        return panel(
          "School settings",
          "<p>Website banner, term dates and admissions notices (demo).</p><p><button type='button' class='btn-bsa btn-bsa-primary' data-demo-action='save'>Save (demo)</button></p>"
        );
      }
      var posNote =
        session.adminPosition && session.adminPosition !== "full"
          ? " · " + escapeHtml(session.roleLabel || "Admin")
          : "";
      var homeExtra =
        !session.adminPosition || session.adminPosition === "full"
          ? meetingsPanel() +
            panel(
              "Recent activity",
              "<p>New teacher account created</p><p>Website banner updated</p><p>Admissions visits appear under Meetings</p>"
            )
          : panel(
              "Your desk",
              "<p>You are signed in as <strong>" +
                escapeHtml(session.roleLabel || "Admin") +
                "</strong>. Use the sidebar for the areas assigned to this position.</p>"
            );
      return (
        '<div class="welcome-banner"><h2>Principal desk' +
        posNote +
        "</h2><p>" +
        escapeHtml(schoolNameOf(session) || session.className || "") +
        " — manage your staff and students. Results for all students stay editable here.</p></div>" +
        kpis([
          { label: "Active staff", value: String(scopedTeachers(session).length), accent: "accent-sky" },
          { label: "Students", value: String(scopedStudents(session).length), accent: "accent-mint" },
          { label: "Visit requests", value: String(loadVisits().length), accent: "accent-royal" },
          { label: "Pending invites", value: "2", accent: "accent-coral" },
        ]) +
        homeExtra
      );
    }

    if (section === "meetings") return meetingsPanel();
    if (section === "schools") return schoolsManagePanel(session);
    if (section === "security") return securityPanel(session);
    if (section === "school-security") {
      var schSec = activeSchoolRec();
      return sa && sa.securityPanelHtml
        ? sa.securityPanelHtml(schSec, session, ops, escapeHtml)
        : panel("School security", "<p>Enter a school from the Hub first.</p>");
    }
    if (section === "edit-site") {
      var schEdit = activeSchoolRec();
      return sa && sa.siteEditorHtml
        ? sa.siteEditorHtml(schEdit, session, ops, escapeHtml)
        : panel("Edit website", "<p>Enter a school from the Hub first.</p>");
    }
    if (section === "teachers") return teachersPanel(session);
    if (section === "students") return studentsPanel(session);
    if (section === "parents") return parentsPanel();
    if (section === "book-visit") return bookVisitPanel(session);
    if (section === "fees") return feesPanel(session);
    if (section === "classrooms") return classroomsPanel(session);
    if (section === "announce") return announcePanel(session);
    if (section === "feedback") return feedbackPanel(session);
    if (section === "results") return adminResultsPanel(session);
    if (section === "attendance") return adminAttendancePanel(session);
    if (section === "slorsh-reports") return schoolReportsPanel(session);
    if (section === "analytics") return analyticsPanelShell();
    if (section === "admins") return adminsPanel(session);
    // Super Admin with an open school: same desk home as Principal
    if (activeSchoolRec()) {
      return (
        '<div class="welcome-banner"><h2>Principal desk</h2><p>' +
        escapeHtml(schoolNameOf(session) || "School") +
        " — manage staff and students. Results for all students stay editable here.</p></div>" +
        kpis([
          { label: "Active staff", value: String(scopedTeachers(session).length), accent: "accent-sky" },
          { label: "Students", value: String(scopedStudents(session).length), accent: "accent-mint" },
          { label: "Visit requests", value: String(loadVisits().length), accent: "accent-royal" },
          { label: "Pending invites", value: "2", accent: "accent-coral" },
        ]) +
        meetingsPanel() +
        panel(
          "Recent activity",
          "<p>New teacher account created</p><p>Website banner updated</p><p>Admissions visits appear under Meetings</p>"
        )
      );
    }
    var schoolsNow = liveSchools();
    var hub =
      sa && sa.hubHtml
        ? sa.hubHtml(ops, escapeHtml)
        : '<div class="welcome-banner"><h2>Platform control</h2><p>Super Admin software desk.</p></div>';
    return (
      hub +
      kpis([
        { label: "Schools", value: String(schoolsNow.length), accent: "accent-royal" },
        { label: "Teachers", value: String(allTeachers().length), accent: "accent-sky" },
        { label: "Students", value: String(allStudents().length), accent: "accent-mint" },
        { label: "Results on file", value: String(loadResults().length), accent: "accent-coral" },
      ])
    );
  }

  function render(session, section) {
    ensureRooms();
    ensureRoomMap();
    section = ensureAdminSection(session, section || "home");
    var navItems = navItemsFor(session);
    var navHtml = navItems
      .map(function (item) {
        var active = item.id === section ? " active" : "";
        return (
          '<li><a href="#" class="' +
          active +
          '" data-section="' +
          item.id +
          '"><span aria-hidden="true">' +
          item.icon +
          "</span> " +
          item.label +
          "</a></li>"
        );
      })
      .join("");

    var badge = document.getElementById("dashRoleBadge");
    var nameEl = document.getElementById("dashUserName");
    var navEl = document.getElementById("dashNav");
    var content = document.getElementById("dashContent");
    if (!content || !navEl) return;
    if (badge) badge.textContent = session.roleLabel;
    if (nameEl) nameEl.textContent = session.name;
    navEl.innerHTML = navHtml;
    var banner = "";
    if (session.role === "superadmin") {
      var active = activeSchoolRec();
      var editHref = "/demos/brightsteps/platform.html";
      var liveHref = "/demos/brightsteps/platform.html";
      if (active && ops && ops.publicSitePath) {
        liveHref = ops.publicSitePath(active);
        editHref = liveHref + (liveHref.indexOf("?") >= 0 ? "&" : "?") + "edit=1";
      }
      banner =
        '<div style="background:#eef5ff;border:1px solid #c5d8f0;border-radius:12px;padding:0.75rem 1rem;margin-bottom:1rem;display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;justify-content:space-between">' +
        "<div><strong>School desk</strong> · " +
        escapeHtml((active && active.name) || "Choose a school") +
        "</div>" +
        '<div style="display:flex;flex-wrap:wrap;gap:0.4rem">' +
        '<a class="btn-bsa btn-bsa-sm btn-bsa-soft" href="' +
        escapeHtml(editHref) +
        '">Edit website</a>' +
        '<a class="btn-bsa btn-bsa-sm btn-bsa-soft" href="' +
        escapeHtml(liveHref) +
        '" target="_blank" rel="noopener">View live</a>' +
        '<button type="button" class="btn-bsa btn-bsa-sm btn-bsa-ghost" data-section="home" data-exit-school>Switch school</button>' +
        '<a class="btn-bsa btn-bsa-sm btn-bsa-ghost" href="/demos/brightsteps/platform.html">Websites platform</a>' +
        "</div></div>";
    }
    content.innerHTML = banner + contentFor(session, section);
    document.title = session.roleLabel + " · BrightSteps Academy";

    if (section === "analytics" && (session.role === "admin" || session.role === "superadmin")) {
      loadWebAnalyticsInto(document.getElementById("webAnalyticsKpis"));
    }

    if (section === "edit-site") {
      var host = document.getElementById("saSiteBlocks");
      if (host) {
        var dragEl = null;
        host.querySelectorAll(".sa-block").forEach(function (block) {
          block.addEventListener("dragstart", function () {
            dragEl = block;
            block.style.opacity = "0.55";
          });
          block.addEventListener("dragend", function () {
            block.style.opacity = "1";
            dragEl = null;
          });
          block.addEventListener("dragover", function (ev) {
            ev.preventDefault();
          });
          block.addEventListener("drop", function (ev) {
            ev.preventDefault();
            if (!dragEl || dragEl === block) return;
            var kids = Array.prototype.slice.call(host.children);
            var from = kids.indexOf(dragEl);
            var to = kids.indexOf(block);
            if (from < 0 || to < 0) return;
            if (from < to) host.insertBefore(dragEl, block.nextSibling);
            else host.insertBefore(dragEl, block);
            host.querySelectorAll(".sa-block").forEach(function (el, i) {
              el.setAttribute("data-block-index", String(i));
              el.querySelectorAll("[data-block-index]").forEach(function (inp) {
                inp.setAttribute("data-block-index", String(i));
              });
            });
          });
        });
      }
    }

    if (attendTickTimer) {
      clearInterval(attendTickTimer);
      attendTickTimer = null;
    }
    if (section === "attendance" && session.role !== "admin" && session.role !== "superadmin") {
      attendTickTimer = setInterval(function () {
        var live = (auth.getSession && auth.getSession()) || session;
        if (!live) return;
        var el = document.getElementById("dashContent");
        if (!el) return;
        el.innerHTML = contentFor(live, "attendance");
      }, 30000);
    }
  }

  function findPersonById(id) {
    var student = STUDENTS.concat(loadKids()).find(function (s) {
      return (s.id || s.name) === id;
    });
    if (student) return student;
    return TEACHERS.concat(loadStaff()).find(function (t) {
      return (t.id || t.name) === id;
    });
  }

  function saveRoomForPerson(personId, room) {
    var map = loadRoomMap();
    map[personId] = room;
    saveRoomMap(map);
  }

  function removePerson(kind, id, email) {
    if (!window.confirm("Remove this " + kind + " from the school portal? They will not be able to sign in.")) {
      return;
    }
    var person = findPersonById(id) || { id: id, email: email };
    if (kind === "student" && ops && ops.blockPortalsAfterStudentRemove) {
      ops.blockPortalsAfterStudentRemove(auth, person, personKeys);
    } else {
      auth.markRemoved(personKeys(person));
    }
    if (email) auth.deleteExtraUser(email);
    if (kind === "student") {
      var kids = loadKids().filter(function (k) {
        return (k.id || k.name) !== id && k.email !== email;
      });
      saveKids(kids);
      setFeePaid(id, false);
    }
    if (kind === "teacher") {
      var staff = loadStaff().filter(function (t) {
        return (t.id || t.name) !== id && t.email !== email;
      });
      saveStaff(staff);
    }
    var map = loadRoomMap();
    delete map[id];
    saveRoomMap(map);
    if (window.showToast) {
      window.showToast(
        kind === "student"
          ? "Student removed. Their portal (and parent portal if no other kids) is blocked."
          : "Removed from portal.",
        "success"
      );
    }
  }

  function boot() {
    var session = auth.requireAuth();
    if (!session) return;

    if (
      window.BrightStepsMobileGate &&
      window.BrightStepsMobileGate.guardAdminDesktopOnly(session)
    ) {
      return;
    }

    // Super Admin lands on dashboard desk; auto-open a school if none selected
    if (session.role === "superadmin") {
      var params = new URLSearchParams(window.location.search || "");
      var enterId = params.get("enter") || "";
      if (enterId && ops && ops.setActiveSchoolId) {
        ops.setActiveSchoolId(enterId);
        try {
          history.replaceState({}, "", "/demos/brightsteps/dashboard.html");
        } catch (e) {}
      }
      if (ops && ops.setActiveSchoolId && (!ops.getActiveSchoolId || !ops.getActiveSchoolId())) {
        var firstSchool = (ops.loadSchools && ops.loadSchools()[0]) || null;
        if (firstSchool && firstSchool.id) ops.setActiveSchoolId(firstSchool.id);
      }
    }

    var section = "home";
    render(session, section);

    var backdrop = document.createElement("div");
    backdrop.className = "dash-sidebar-backdrop";
    backdrop.id = "dashSidebarBackdrop";
    document.body.appendChild(backdrop);
    function closeSidebar() {
      var side = document.querySelector(".dash-sidebar");
      if (side) side.classList.remove("open");
      backdrop.classList.remove("show");
    }
    function openSidebar() {
      var side = document.querySelector(".dash-sidebar");
      if (side) side.classList.add("open");
      backdrop.classList.add("show");
    }
    backdrop.addEventListener("click", closeSidebar);
    var menuBtn = document.getElementById("sidebarToggle");
    if (menuBtn) {
      menuBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var side = document.querySelector(".dash-sidebar");
        if (side && side.classList.contains("open")) closeSidebar();
        else openSidebar();
      });
    }

    var logout = document.getElementById("dashLogout");
    if (logout) {
      logout.addEventListener("click", function (e) {
        e.preventDefault();
        auth.logout();
      });
    }

    document.addEventListener("click", function (e) {
      var navLink = e.target.closest("[data-section]");
      if (navLink && (navLink.closest("#dashNav") || navLink.closest("#dashContent"))) {
        e.preventDefault();
        section = navLink.getAttribute("data-section");
        session = (auth.getSession && auth.getSession()) || session;
        render(session, section);
        var side = document.querySelector(".dash-sidebar");
        var bd = document.getElementById("dashSidebarBackdrop");
        if (side) side.classList.remove("open");
        if (bd) bd.classList.remove("show");
        return;
      }

      var removeAdminBtn = e.target.closest("[data-remove-admin]");
      if (removeAdminBtn) {
        e.preventDefault();
        var isPrimaryAdmin = removeAdminBtn.getAttribute("data-primary-admin") === "1";
        if (isPrimaryAdmin && session.role !== "superadmin") {
          if (window.showToast) window.showToast("Only Super Admin can remove a primary school admin.", "error");
          return;
        }
        if (!isPrimaryAdmin && !canManageSchoolAdmins(session)) {
          if (window.showToast) window.showToast("Only full school admins can remove admins.", "error");
          return;
        }
        var adminEmail = removeAdminBtn.getAttribute("data-remove-admin");
        var confirmMsg = isPrimaryAdmin
          ? "Remove PRIMARY admin " + adminEmail + "? They will be blocked from signing in."
          : "Remove admin " + adminEmail + "? They will not be able to sign in.";
        if (!window.confirm(confirmMsg)) return;
        var removed = auth.removeAdminAccount
          ? auth.removeAdminAccount(adminEmail, { bySuperAdmin: session.role === "superadmin" })
          : { ok: false, message: "Cannot remove admin." };
        if (!removed.ok) {
          if (window.showToast) window.showToast(removed.message || "Could not remove admin.", "error");
          return;
        }
        if (window.showToast) window.showToast(isPrimaryAdmin ? "Primary admin removed." : "Admin removed.", "success");
        render(session, section === "security" ? "security" : "admins");
        return;
      }

      var enterSchoolBtn = e.target.closest("[data-enter-school]");
      if (enterSchoolBtn) {
        e.preventDefault();
        if (session.role !== "superadmin" || !ops || !ops.setActiveSchoolId) return;
        var enterId = enterSchoolBtn.getAttribute("data-enter-school");
        ops.setActiveSchoolId(enterId);
        var goto = enterSchoolBtn.getAttribute("data-goto-section") || "home";
        if (window.showToast) {
          var entered = ops.getSchoolById(enterId);
          window.showToast("Opened desk: " + ((entered && entered.name) || "school"), "success");
        }
        render(session, goto);
        return;
      }

      var exitSchoolBtn = e.target.closest("[data-exit-school]");
      if (exitSchoolBtn) {
        e.preventDefault();
        if (ops && ops.setActiveSchoolId) ops.setActiveSchoolId("");
        if (window.showToast) window.showToast("Pick a school to open its desk.", "success");
        render(session, "home");
        return;
      }

      var secToggle = e.target.closest("[data-sec-toggle]");
      if (secToggle) {
        e.preventDefault();
        if (session.role !== "superadmin" || !ops || !ops.setSchoolSecurity) return;
        var secSchool = secToggle.getAttribute("data-sec-school");
        var secKey = secToggle.getAttribute("data-sec-toggle");
        var secVal = secToggle.getAttribute("data-sec-value") === "1";
        var patch = {};
        patch[secKey] = secVal;
        var secRes = ops.setSchoolSecurity(secSchool, patch, session);
        if (!secRes.ok) {
          if (window.showToast) window.showToast(secRes.message || "Could not update security.", "error");
          return;
        }
        if (window.showToast) window.showToast("Security updated (locked for school admins).", "success");
        render(session, "school-security");
        return;
      }

      var saveSiteBtn = e.target.closest("[data-save-site]");
      if (saveSiteBtn) {
        e.preventDefault();
        if (session.role !== "superadmin" || !ops || !ops.saveSchoolPage) return;
        var siteSchoolId = saveSiteBtn.getAttribute("data-save-site");
        var blockEls = Array.prototype.slice.call(document.querySelectorAll("#saSiteBlocks .sa-block"));
        var blocks = blockEls.map(function (el) {
          var idx = el.getAttribute("data-block-index");
          var titleEl = el.querySelector('[data-block-field="title"]');
          var bodyEl = el.querySelector('[data-block-field="body"]');
          var typeEl = el.querySelector(".dash-panel__head h3");
          var typeText = typeEl ? String(typeEl.textContent || "").replace(/⋮⋮/g, "").trim() : "block";
          return {
            id: "b-" + idx,
            type: typeText,
            title: titleEl ? titleEl.value : "",
            body: bodyEl ? bodyEl.value : "",
          };
        });
        var savedPage = ops.saveSchoolPage(siteSchoolId, blocks, session);
        if (!savedPage.ok) {
          if (window.showToast) window.showToast(savedPage.message || "Could not save site.", "error");
          return;
        }
        if (window.showToast) window.showToast("Website saved and locked.", "success");
        render(session, "edit-site");
        return;
      }

      var unlockBtn = e.target.closest("[data-unlock-key]");
      if (unlockBtn) {
        e.preventDefault();
        if (session.role !== "superadmin") return;
        var unlockKey = unlockBtn.getAttribute("data-unlock-key");
        auth.setLocked(unlockKey, false);
        if (window.showToast) window.showToast("Unlocked: " + unlockKey, "success");
        render(session, "security");
        return;
      }

      var removeSchoolBtn = e.target.closest("[data-remove-school]");
      if (removeSchoolBtn) {
        e.preventDefault();
        if (session.role !== "superadmin" || !ops || !ops.removeSchool) return;
        var schoolId = removeSchoolBtn.getAttribute("data-remove-school");
        if (!window.confirm("Remove this school from the platform list? Public page will stop listing it.")) return;
        ops.removeSchool(schoolId);
        if (window.showToast) window.showToast("School removed.", "success");
        render(session, "schools");
        return;
      }

      var schoolReportBtn = e.target.closest("[data-school-report]");
      if (schoolReportBtn) {
        e.preventDefault();
        if (session.role !== "admin" && session.role !== "superadmin") {
          if (window.showToast) window.showToast("Reports are for school admin.", "error");
          return;
        }
        var rType = schoolReportBtn.getAttribute("data-school-report");
        var topicEl = document.getElementById("schoolReportTopic");
        var topic = topicEl ? String(topicEl.value || "").trim() : "";
        var out = document.getElementById("schoolReportOut");
        if (out) {
          out.innerHTML = schoolReportLoadingHtml();
        }
        schoolReportBtn.disabled = true;
        fetch("/api/demos/brightsteps/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: rType,
            topic: topic || undefined,
            pack: schoolReportPack(session),
          }),
        })
          .then(function (res) {
            return res.json().then(function (data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function (result) {
            schoolReportBtn.disabled = false;
            if (!result.ok && result.data && result.data.error) {
              if (out) {
                out.innerHTML =
                  '<div class="sr-out"><p class="sr-empty">' +
                  escapeHtml(result.data.error) +
                  "</p></div>";
              }
              if (window.showToast) window.showToast(result.data.error, "error");
              return;
            }
            var data = result.data || {};
            if (data.markdown) {
              saveReportHistoryEntry({
                type: rType,
                title: data.title || rType,
                summary: data.summary || "",
                markdown: data.markdown,
                topic: topic,
                credits_charged: data.credits_charged || 0,
                via: data.via || "",
              });
            }
            if (out) {
              out.innerHTML = schoolReportResultHtml(data, rType);
            }
            // Refresh history list without wiping the open narrative.
            render(session, "slorsh-reports");
            var outAfter = document.getElementById("schoolReportOut");
            if (outAfter) {
              outAfter.innerHTML = schoolReportResultHtml(data, rType);
            }
            if (window.showToast) {
              var cr = data.credits_charged;
              window.showToast(
                cr
                  ? "Report ready — " + cr + " credits charged on Slorsh."
                  : "Report ready.",
                "success"
              );
            }
          })
          .catch(function (err) {
            schoolReportBtn.disabled = false;
            if (out) {
              out.innerHTML =
                '<div class="sr-out"><p class="sr-empty">Could not generate report. ' +
                escapeHtml(err && err.message ? err.message : "") +
                "</p></div>";
            }
            if (window.showToast) window.showToast("Report request failed.", "error");
          });
        return;
      }

      var viewReportBtn = e.target.closest("[data-view-report]");
      if (viewReportBtn) {
        e.preventDefault();
        if (session.role !== "admin" && session.role !== "superadmin") return;
        var viewId = viewReportBtn.getAttribute("data-view-report");
        var hist = loadReportHistory().find(function (r) {
          return r.id === viewId;
        });
        var viewOut = document.getElementById("schoolReportOut");
        if (!hist) {
          if (window.showToast) window.showToast("Report not found.", "error");
          return;
        }
        if (viewOut) {
          viewOut.innerHTML = schoolReportResultHtml(
            {
              title: hist.title,
              summary: (hist.summary || "") + (hist.at ? " · Saved " + String(hist.at).replace("T", " ").slice(0, 16) : ""),
              markdown: hist.markdown,
              via: hist.via || "history",
            },
            hist.type
          );
          viewOut.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      var feePaidBtn = e.target.closest("[data-fee-paid]");
      if (feePaidBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        setFeePaid(feePaidBtn.getAttribute("data-fee-paid"), true);
        if (window.showToast) window.showToast("Marked as paid.", "success");
        render(session, section);
        return;
      }

      var feeUnpaidBtn = e.target.closest("[data-fee-unpaid]");
      if (feeUnpaidBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        setFeePaid(feeUnpaidBtn.getAttribute("data-fee-unpaid"), false);
        if (window.showToast) window.showToast("Marked as pending.", "success");
        render(session, section);
        return;
      }

      var lockBtn = e.target.closest("[data-lock-student]");
      if (lockBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var lockId = lockBtn.getAttribute("data-lock-student");
        var lockPerson = findPersonById(lockId) || { id: lockId, email: lockBtn.getAttribute("data-email") };
        auth.setLocked(personKeys(lockPerson), true);
        if (window.showToast) window.showToast("Student portal locked.", "success");
        render(session, section);
        return;
      }

      var unlockBtn = e.target.closest("[data-unlock-student]");
      if (unlockBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var unlockId = unlockBtn.getAttribute("data-unlock-student");
        var unlockPerson = findPersonById(unlockId) || { id: unlockId, email: unlockBtn.getAttribute("data-email") };
        auth.setLocked(personKeys(unlockPerson), false);
        if (window.showToast) window.showToast("Student portal unlocked.", "success");
        render(session, section);
        return;
      }

      var removeBtn = e.target.closest("[data-remove-person]");
      if (removeBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        removePerson(
          removeBtn.getAttribute("data-kind"),
          removeBtn.getAttribute("data-id"),
          removeBtn.getAttribute("data-email")
        );
        render(session, section);
        return;
      }

      var modeBtn = e.target.closest("[data-result-mode]");
      if (modeBtn) {
        e.preventDefault();
        if (!ops || (session.role !== "admin" && session.role !== "superadmin")) return;
        var modeRes = ops.setResultPolicy({ mode: modeBtn.getAttribute("data-result-mode") }, session);
        if (!modeRes.ok) {
          if (window.showToast) window.showToast(modeRes.message, "error");
          return;
        }
        if (window.showToast) window.showToast("Results visibility updated.", "success");
        render(session, "results");
        return;
      }

      var lockPol = e.target.closest("[data-lock-result-policy]");
      if (lockPol) {
        e.preventDefault();
        if (!ops || (session.role !== "admin" && session.role !== "superadmin")) return;
        var lockOn = lockPol.getAttribute("data-lock-result-policy") === "1";
        var lockRes = ops.setResultPolicy({ adminLocked: lockOn }, session);
        if (!lockRes.ok) {
          if (window.showToast) window.showToast(lockRes.message, "error");
          return;
        }
        if (window.showToast) {
          window.showToast(lockOn ? "Decision locked — only admin can change it." : "Decision unlocked.", "success");
        }
        render(session, "results");
        return;
      }

      var revokeBtn = e.target.closest("[data-revoke-grant]");
      if (revokeBtn) {
        e.preventDefault();
        if (!ops || (session.role !== "admin" && session.role !== "superadmin")) return;
        var rev = ops.setResultPolicy(
          {
            revokeStudentId: revokeBtn.getAttribute("data-student"),
            revokeViewer: revokeBtn.getAttribute("data-viewer"),
          },
          session
        );
        if (!rev.ok) {
          if (window.showToast) window.showToast(rev.message, "error");
          return;
        }
        if (window.showToast) window.showToast("Access revoked.", "success");
        render(session, "results");
        return;
      }

      var saveRoomBtn = e.target.closest("[data-save-room]");
      if (saveRoomBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var personId = saveRoomBtn.getAttribute("data-save-room");
        var row = saveRoomBtn.closest("tr");
        var select = row && row.querySelector('[data-room-select="' + personId + '"]');
        if (select) {
          saveRoomForPerson(personId, select.value);
          if (window.showToast) window.showToast("Classroom saved.", "success");
          render(session, section);
        }
        return;
      }

      var assignRoomBtn = e.target.closest("[data-assign-room]");
      if (assignRoomBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var assignId = assignRoomBtn.getAttribute("data-person");
        var assignRow = assignRoomBtn.closest("tr");
        var assignSelect = assignRow && assignRow.querySelector('[data-room-select="' + assignId + '"]');
        if (assignSelect) {
          saveRoomForPerson(assignId, assignSelect.value);
          if (window.showToast) window.showToast("Assignment saved.", "success");
          render(session, section);
        }
        return;
      }

      var removeRoomBtn = e.target.closest("[data-remove-room]");
      if (removeRoomBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var roomToRemove = removeRoomBtn.getAttribute("data-remove-room");
        if (!window.confirm('Remove classroom "' + roomToRemove + '"? People in it will be unassigned.')) return;
        removeRoom(roomToRemove);
        if (window.showToast) window.showToast("Classroom removed.", "success");
        render(session, "classrooms");
        return;
      }

      var deleteAnnounceBtn = e.target.closest("[data-delete-announce]");
      if (deleteAnnounceBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var announceId = deleteAnnounceBtn.getAttribute("data-delete-announce");
        var annItem = loadAnnouncements().find(function (a) {
          return a.id === announceId;
        });
        if (annItem && annItem.superLocked && session.role !== "superadmin") {
          if (window.showToast) window.showToast("This announcement was locked by Super Admin.", "error");
          return;
        }
        saveAnnouncements(
          loadAnnouncements().filter(function (a) {
            return a.id !== announceId;
          })
        );
        if (window.showToast) window.showToast("Announcement deleted.", "success");
        render(session, section);
        return;
      }

      var deleteHomeworkBtn = e.target.closest("[data-delete-homework]");
      if (deleteHomeworkBtn) {
        e.preventDefault();
        var hwId = deleteHomeworkBtn.getAttribute("data-delete-homework");
        saveHomework(
          loadHomework().filter(function (h) {
            return h.id !== hwId;
          })
        );
        if (window.showToast) window.showToast("Homework deleted.", "success");
        render(session, section);
        return;
      }

      var markAttendBtn = e.target.closest("[data-mark-attend]");
      if (markAttendBtn) {
        e.preventDefault();
        var winState = attendWindowState();
        if (!winState.configured || !winState.open) {
          if (window.showToast) {
            window.showToast(
              winState.configured
                ? "Attendance window is closed (" + winState.label + ")."
                : "Admin has not set an attendance window yet.",
              "error"
            );
          }
          return;
        }
        var markId = markAttendBtn.getAttribute("data-mark-attend");
        var markKind = markAttendBtn.getAttribute("data-attend-kind") || "student";
        var markStatus = (markAttendBtn.getAttribute("data-attend-status") || "present").toLowerCase();

        if (markKind === "teacher-self") {
          if (session.role !== "teacher") {
            if (window.showToast) window.showToast("Mark present from the teachers portal only.", "error");
            return;
          }
          if (markStatus !== "present") {
            if (window.showToast) window.showToast("Teachers can only mark themselves present.", "error");
            return;
          }
          var selfId = teacherPersonId(session);
          if (markId !== selfId) {
            if (window.showToast) window.showToast("You can only mark your own attendance.", "error");
            return;
          }
          setAttendance(selfId, "teacher", "present", session, sessionClassroom(session));
          if (window.showToast) window.showToast("You are marked present.", "success");
          render(session, "attendance");
          return;
        }

        if (markKind === "student") {
          if (session.role !== "teacher") {
            if (window.showToast) window.showToast("Only the class teacher can mark students.", "error");
            return;
          }
          if (markStatus !== "present" && markStatus !== "absent" && markStatus !== "leave") {
            if (window.showToast) window.showToast("Use Present, Absent, or Leave for students.", "error");
            return;
          }
          var allowed = studentsInTeacherClass(session).some(function (s) {
            return (s.id || s.name) === markId;
          });
          if (!allowed) {
            if (window.showToast) window.showToast("You can only mark students in your class.", "error");
            return;
          }
          var kid = allStudents().find(function (s) {
            return (s.id || s.name) === markId;
          });
          setAttendance(markId, "student", markStatus, session, kid ? kid.classroom : sessionClassroom(session));
          if (window.showToast) window.showToast("Student marked " + attendanceStatusLabel(markStatus) + ".", "success");
          render(session, "attendance");
          return;
        }

        if (window.showToast) window.showToast("Not allowed.", "error");
        return;
      }

      var resetAttendBtn = e.target.closest("[data-reset-attend-room]");
      if (resetAttendBtn) {
        e.preventDefault();
        if (session.role !== "teacher" && !canManageRoster(session)) {
          if (window.showToast) window.showToast("Only the class teacher can clear attendance.", "error");
          return;
        }
        var winOk = attendWindowState();
        if (session.role === "teacher" && (!winOk.configured || !winOk.open)) {
          if (window.showToast) window.showToast("You can only clear marks while the attendance window is open.", "error");
          return;
        }
        var resetRoom = resetAttendBtn.getAttribute("data-reset-attend-room") || sessionClassroom(session);
        if (session.role === "teacher" && resetRoom !== sessionClassroom(session)) {
          if (window.showToast) window.showToast("You can only clear your own class.", "error");
          return;
        }
        if (!window.confirm('Clear attendance marks for "' + resetRoom + '"?')) return;
        clearStudentAttendanceForRoom(resetRoom);
        if (window.showToast) window.showToast("Class marks cleared.", "success");
        render(session, "attendance");
        return;
      }

      var saveResultBtn = e.target.closest("[data-save-result]");
      if (saveResultBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var activeForResults = activeSchoolRec();
        if (
          session.role === "admin" &&
          activeForResults &&
          ops &&
          ops.isSchoolFeatureEnabled &&
          !ops.isSchoolFeatureEnabled(activeForResults.id || session.schoolId, "resultsEditBySchoolAdmin")
        ) {
          if (window.showToast) window.showToast("Super Admin disabled result edits for this school.", "error");
          return;
        }
        if (session.role === "admin" && session.schoolId && ops && ops.isSchoolFeatureEnabled) {
          if (!ops.isSchoolFeatureEnabled(session.schoolId, "resultsEditBySchoolAdmin")) {
            if (window.showToast) window.showToast("Super Admin disabled result edits for this school.", "error");
            return;
          }
        }
        var resId = saveResultBtn.getAttribute("data-save-result");
        var resRow = saveResultBtn.closest("tr");
        var markInput = resRow && resRow.querySelector('[data-result-mark="' + resId + '"]');
        var maxInput = resRow && resRow.querySelector('[data-result-max="' + resId + '"]');
        var subjectInput = resRow && resRow.querySelector('[data-result-subject="' + resId + '"]');
        var titleInput = resRow && resRow.querySelector('[data-result-title="' + resId + '"]');
        var existingRes = loadResults().find(function (r) {
          return r.id === resId;
        });
        if (existingRes && existingRes.superLocked && session.role !== "superadmin") {
          if (window.showToast) window.showToast("This result was locked by Super Admin.", "error");
          return;
        }
        var results = loadResults().map(function (r) {
          if (r.id !== resId) return r;
          var copy = {};
          Object.keys(r).forEach(function (k) {
            copy[k] = r[k];
          });
          copy.mark = String(markInput ? markInput.value : r.mark).trim();
          copy.maxMark = String(maxInput ? maxInput.value : r.maxMark || "100").trim();
          if (subjectInput) copy.subject = String(subjectInput.value || "").trim() || copy.subject;
          if (titleInput) copy.title = String(titleInput.value || "").trim() || copy.title;
          copy.updatedAt = new Date().toISOString();
          copy.updatedBy = session.name;
          if (session.role === "superadmin") copy.superLocked = true;
          return copy;
        });
        saveResults(results);
        if (window.showToast) window.showToast("Result updated.", "success");
        render(session, section);
        return;
      }

      var deleteResultBtn = e.target.closest("[data-delete-result]");
      if (deleteResultBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var delId = deleteResultBtn.getAttribute("data-delete-result");
        if (!window.confirm("Delete this result record?")) return;
        saveResults(
          loadResults().filter(function (r) {
            return r.id !== delId;
          })
        );
        if (window.showToast) window.showToast("Result deleted.", "success");
        render(session, section);
        return;
      }

      var saveFeeBtn = e.target.closest("[data-save-fee]");
      if (saveFeeBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var feeRow = saveFeeBtn.closest("tr");
        var feeInput = feeRow && feeRow.querySelector("[data-fee]");
        var feeId = saveFeeBtn.getAttribute("data-save-fee");
        saveFeeFor(feeId, feeInput ? feeInput.value : 0);
        if (window.showToast) window.showToast("Monthly fee saved: " + money(feeInput && feeInput.value), "success");
        render(session, section);
        return;
      }
      var saveSalaryBtn = e.target.closest("[data-save-salary]");
      if (saveSalaryBtn) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var salaryRow = saveSalaryBtn.closest("tr");
        var salaryInput = salaryRow && salaryRow.querySelector("[data-salary]");
        var salaryId = saveSalaryBtn.getAttribute("data-save-salary");
        saveSalaryFor(salaryId, salaryInput ? salaryInput.value : 0);
        if (window.showToast) window.showToast("Monthly salary saved: " + money(salaryInput && salaryInput.value), "success");
        render(session, section);
        return;
      }
      var demoBtn = e.target.closest("[data-demo-action]");
      if (demoBtn && window.showToast) {
        window.showToast("Saved (demo) — no server connected.", "success");
      }
    });

    document.addEventListener("submit", function (e) {
      var grantResultForm = e.target.closest("#grantResultForm");
      if (grantResultForm) {
        e.preventDefault();
        if (!ops || (session.role !== "admin" && session.role !== "superadmin")) return;
        var gSid = (grantResultForm.querySelector('[name="studentId"]') || {}).value || "";
        var gViewer = String((grantResultForm.querySelector('[name="viewer"]') || {}).value || "").trim();
        if (!gSid || !gViewer) return;
        var gRes = ops.setResultPolicy({ grantStudentId: gSid, grantViewer: gViewer }, session);
        if (!gRes.ok) {
          if (window.showToast) window.showToast(gRes.message, "error");
          return;
        }
        if (window.showToast) window.showToast("Access granted.", "success");
        render(session, "results");
        return;
      }

      var addParentForm = e.target.closest("#addParentForm");
      if (addParentForm) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var pName = String((addParentForm.querySelector('[name="name"]') || {}).value || "").trim();
        var pEmail = String((addParentForm.querySelector('[name="email"]') || {}).value || "").trim();
        var pPhone = String((addParentForm.querySelector('[name="phone"]') || {}).value || "").trim();
        var pKid = (addParentForm.querySelector('[name="kidId"]') || {}).value || "";
        if (!pName || !pEmail) return;
        var pAcc = auth.addParentAccount
          ? auth.addParentAccount({ name: pName, email: pEmail, phone: pPhone })
          : { ok: false, message: "Cannot add parent." };
        if (!pAcc.ok) {
          if (window.showToast) window.showToast(pAcc.message, "error");
          return;
        }
        if (ops) {
          ops.upsertFamily({
            name: pName,
            email: pEmail,
            phone: pPhone,
            login: pAcc.email,
            kidId: pKid || undefined,
          });
        }
        if (window.showToast) {
          window.showToast(
            pAcc.existing
              ? "Parent linked."
              : "Parent saved. Login: " + pAcc.email + (pAcc.password ? " / " + pAcc.password : ""),
            "success"
          );
        }
        render(session, "parents");
        return;
      }

      var parentAddKidForm = e.target.closest("#parentAddKidForm");
      if (parentAddKidForm) {
        e.preventDefault();
        if (session.role !== "parent") return;
        var cName = String((parentAddKidForm.querySelector('[name="name"]') || {}).value || "").trim();
        var cYear = String((parentAddKidForm.querySelector('[name="year"]') || {}).value || "Grade 1").trim();
        var cEmail = String((parentAddKidForm.querySelector('[name="email"]') || {}).value || "").trim();
        var cPass = String((parentAddKidForm.querySelector('[name="password"]') || {}).value || "Demo@12345");
        var cCreated = auth.addStudentAccount
          ? auth.addStudentAccount({ name: cName, year: cYear, email: cEmail, password: cPass })
          : { ok: false, message: "Cannot add students." };
        if (!cCreated.ok) {
          if (window.showToast) window.showToast(cCreated.message, "error");
          return;
        }
        var kidId = "s-" + Date.now();
        var kidsList = loadKids();
        kidsList.unshift({
          id: kidId,
          name: cName,
          school: "Scuola Materna",
          year: cYear,
          avg: "—",
          fee: 450,
          email: cCreated.email,
        });
        saveKids(kidsList);
        if (ops) {
          ops.upsertFamily({
            name: session.name,
            email: session.login,
            login: session.login,
            kidId: kidId,
          });
        }
        if (window.showToast) {
          window.showToast("Child added. Login: " + cCreated.email + " / " + cCreated.password, "success");
        }
        render(session, "kids");
        return;
      }

      var internalVisitForm = e.target.closest("#internalVisitForm");
      if (internalVisitForm) {
        e.preventDefault();
        var sel = internalVisitForm.querySelector('[name="target"]');
        if (!sel || !sel.value) return;
        var opt = sel.options[sel.selectedIndex];
        var toRole = opt.getAttribute("data-role") || "";
        if (ops && !ops.canBookVisit(session.role, toRole)) {
          if (window.showToast) window.showToast("That visit is not allowed for your role.", "error");
          return;
        }
        var when = String((internalVisitForm.querySelector('[name="when"]') || {}).value || "").trim();
        var note = String((internalVisitForm.querySelector('[name="note"]') || {}).value || "").trim();
        if (!when) return;
        var visits = ops ? ops.loadInternalVisits() : [];
        visits.unshift({
          id: "iv-" + Date.now(),
          fromLogin: session.login,
          fromName: session.name,
          fromRole: session.role,
          toRole: toRole,
          toName: opt.getAttribute("data-name") || opt.textContent,
          toEmail: opt.getAttribute("data-email") || "",
          when: when,
          note: note,
          createdAt: new Date().toISOString(),
        });
        if (ops) ops.saveInternalVisits(visits);
        else localStorage.setItem("brightsteps-demo-internal-visits", JSON.stringify(visits));
        if (window.showToast) window.showToast("Visit requested.", "success");
        render(session, "book-visit");
        return;
      }

      var attendWindowForm = e.target.closest("#attendWindowForm");
      if (attendWindowForm) {
        e.preventDefault();
        if (!canManageRoster(session)) {
          if (window.showToast) window.showToast("Only admin can set the attendance window.", "error");
          return;
        }
        var startVal = String((attendWindowForm.querySelector('[name="start"]') || {}).value || "").trim();
        var endVal = String((attendWindowForm.querySelector('[name="end"]') || {}).value || "").trim();
        var startMin = parseHmToMinutes(startVal);
        var endMin = parseHmToMinutes(endVal);
        if (startMin == null || endMin == null || endMin <= startMin) {
          if (window.showToast) window.showToast("Choose a valid start and end time (end must be after start).", "error");
          return;
        }
        saveAttendWindow({
          start: startVal,
          end: endVal,
          locked: true,
          setAt: new Date().toISOString(),
          setBy: session.name || session.login || "admin",
        });
        if (window.showToast) {
          window.showToast("Attendance window fixed: " + startVal + " – " + endVal + ". Teachers cannot change it.", "success");
        }
        render(session, "attendance");
        return;
      }

      var roomForm = e.target.closest("#addRoomForm");
      if (roomForm) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var roomName = String((roomForm.querySelector('[name="name"]') || {}).value || "").trim();
        if (!roomName) return;
        var rooms = loadRooms();
        if (rooms.indexOf(roomName) === -1) {
          rooms.push(roomName);
          saveRooms(rooms);
          if (window.showToast) window.showToast("Classroom added.", "success");
        }
        render(session, "classrooms");
        return;
      }

      var announceForm = e.target.closest("#announceForm");
      if (announceForm) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var aTitle = String((announceForm.querySelector('[name="title"]') || {}).value || "").trim();
        var aBody = String((announceForm.querySelector('[name="body"]') || {}).value || "").trim();
        var aAudience = (announceForm.querySelector('[name="audience"]') || {}).value || "all";
        var aSchoolId = (announceForm.querySelector('[name="schoolId"]') || {}).value || "";
        if (!aTitle || !aBody) return;
        if (session.role === "admin" && session.schoolId && ops && ops.isSchoolFeatureEnabled) {
          if (!ops.isSchoolFeatureEnabled(session.schoolId, "announcements")) {
            if (window.showToast) window.showToast("Announcements disabled by Super Admin.", "error");
            return;
          }
        }
        var schoolMeta =
          aSchoolId && ops && ops.getSchoolById
            ? ops.getSchoolById(aSchoolId)
            : session.role === "admin"
              ? { id: session.schoolId || "", name: schoolNameOf(session) }
              : null;
        var announcements = loadAnnouncements();
        announcements.unshift({
          id: "ann-" + Date.now(),
          title: aTitle,
          body: aBody,
          audience: aAudience,
          schoolId: schoolMeta ? schoolMeta.id || aSchoolId : aSchoolId,
          schoolName: schoolMeta ? schoolMeta.name : "",
          by: session.name,
          superLocked: session.role === "superadmin",
          createdAt: new Date().toISOString(),
        });
        saveAnnouncements(announcements);
        if (window.showToast) window.showToast("Announcement published.", "success");
        render(session, "announce");
        return;
      }

      var homeworkForm = e.target.closest("#homeworkForm");
      if (homeworkForm) {
        e.preventDefault();
        var hTitle = String((homeworkForm.querySelector('[name="title"]') || {}).value || "").trim();
        var hBody = String((homeworkForm.querySelector('[name="body"]') || {}).value || "").trim();
        var hDue = String((homeworkForm.querySelector('[name="due"]') || {}).value || "").trim();
        var hClassroom = (homeworkForm.querySelector('[name="classroom"]') || {}).value || sessionClassroom(session);
        if (!hTitle || !hBody) return;
        var homework = loadHomework();
        homework.unshift({
          id: "hw-" + Date.now(),
          title: hTitle,
          body: hBody,
          classroom: hClassroom,
          due: hDue,
          teacher: session.name,
          teacherLogin: session.login,
          createdAt: new Date().toISOString(),
        });
        saveHomework(homework);
        if (window.showToast) window.showToast("Homework posted.", "success");
        render(session, "assignments");
        return;
      }

      var feedbackForm = e.target.closest("#feedbackForm");
      if (feedbackForm) {
        e.preventDefault();
        if (session.role === "admin" || session.role === "superadmin") return;
        var fKind = (feedbackForm.querySelector('[name="kind"]') || {}).value || "suggestion";
        var fBody = String((feedbackForm.querySelector('[name="body"]') || {}).value || "").trim();
        var fAnon = !!(feedbackForm.querySelector('[name="anonymous"]') || {}).checked;
        if (!fBody) return;
        var feedback = loadFeedback();
        feedback.unshift({
          id: "fb-" + Date.now(),
          kind: fKind === "complaint" ? "complaint" : "suggestion",
          body: fBody,
          anonymous: fAnon,
          author: fAnon ? "Anonymous" : session.name,
          login: fAnon ? "" : session.login,
          ownerLogin: session.login,
          role: fAnon ? "Anonymous" : session.roleLabel || session.role,
          createdAt: new Date().toISOString(),
        });
        saveFeedback(feedback);
        if (window.showToast) {
          window.showToast(fAnon ? "Anonymous feedback submitted." : "Feedback submitted.", "success");
        }
        render(session, "feedback");
        return;
      }

      var resultForm = e.target.closest("#resultForm");
      if (resultForm) {
        e.preventDefault();
        if (session.role !== "teacher" && !canManageRoster(session)) return;
        var studentId = (resultForm.querySelector('[name="studentId"]') || {}).value || "";
        var student = findPersonById(studentId) || allStudents().filter(function (s) {
          return (s.id || s.name) === studentId;
        })[0];
        if (!student) {
          if (window.showToast) window.showToast("Choose a student.", "error");
          return;
        }
        var subject = String((resultForm.querySelector('[name="subject"]') || {}).value || "").trim();
        var paperType = (resultForm.querySelector('[name="paperType"]') || {}).value || "test";
        var title = String((resultForm.querySelector('[name="title"]') || {}).value || "").trim();
        var mark = String((resultForm.querySelector('[name="mark"]') || {}).value || "").trim();
        var maxMark = String((resultForm.querySelector('[name="maxMark"]') || {}).value || "100").trim();
        var classroom = (resultForm.querySelector('[name="classroom"]') || {}).value || student.classroom || "";
        var school = String((resultForm.querySelector('[name="school"]') || {}).value || student.school || "").trim();
        if (!subject || !title || !mark) return;
        var results = loadResults();
        results.unshift({
          id: "res-" + Date.now(),
          studentName: student.name,
          studentId: student.id || student.name,
          subject: subject,
          paperType: paperType,
          title: title,
          mark: mark,
          maxMark: maxMark || "100",
          classroom: classroom,
          school: school,
          teacher: session.name,
          teacherLogin: session.login,
          createdAt: new Date().toISOString(),
          updatedAt: "",
          updatedBy: "",
        });
        saveResults(results);
        if (window.showToast) window.showToast("Result saved for " + student.name + ".", "success");
        render(session, "results");
        return;
      }

      var teacherForm = e.target.closest("#addTeacherForm");
      if (teacherForm) {
        e.preventDefault();
        if (!canManageRoster(session)) return;
        var tName = (teacherForm.querySelector('[name="name"]') || {}).value || "";
        var tSubject = (teacherForm.querySelector('[name="subject"]') || {}).value || "";
        var tSchool = (teacherForm.querySelector('[name="school"]') || {}).value || session.className || "School";
        var tClass = (teacherForm.querySelector('[name="className"]') || {}).value || tSubject;
        var tSalary = parseAmount((teacherForm.querySelector('[name="salary"]') || {}).value);
        var tEmail = (teacherForm.querySelector('[name="email"]') || {}).value || "";
        var tPassword = (teacherForm.querySelector('[name="password"]') || {}).value || "Demo@12345";
        var tCreated = auth.addTeacherAccount
          ? auth.addTeacherAccount({ name: tName, subject: tSubject, className: tClass, email: tEmail, password: tPassword })
          : { ok: false, message: "Cannot add teachers." };
        if (!tCreated.ok) {
          if (window.showToast) window.showToast(tCreated.message, "error");
          return;
        }
        var staff = loadStaff();
        var teacherId = "t-" + Date.now();
        staff.unshift({
          id: teacherId,
          name: tName.trim(),
          school: String(tSchool).trim(),
          subject: String(tSubject).trim(),
          className: String(tClass).trim() || String(tSubject).trim(),
          salary: tSalary,
          email: tCreated.email,
        });
        saveStaff(staff);
        saveSalaryFor(teacherId, tSalary);
        if (window.showToast) {
          window.showToast("Added " + tName.trim() + ". Login: " + tCreated.email + " / " + tCreated.password, "success");
        }
        render(session, session.role === "superadmin" ? "teachers" : "staff");
        return;
      }

      var adminForm = e.target.closest("#addAdminForm");
      if (adminForm) {
        e.preventDefault();
        if (!canManageSchoolAdmins(session)) {
          if (window.showToast) window.showToast("Only full school admins can create admins.", "error");
          return;
        }
        var aName = (adminForm.querySelector('[name="name"]') || {}).value || "";
        var aPosition = (adminForm.querySelector('[name="position"]') || {}).value || "fees";
        var aSchool = (adminForm.querySelector('[name="school"]') || {}).value || session.className || "School";
        var aEmail = (adminForm.querySelector('[name="email"]') || {}).value || "";
        var aPassword = (adminForm.querySelector('[name="password"]') || {}).value || "Demo@12345";
        var schoolRec = ops && ops.getSchoolByName ? ops.getSchoolByName(aSchool) : null;
        var aCreated = auth.addAdminAccount
          ? auth.addAdminAccount({
              name: aName,
              position: aPosition,
              className: aSchool,
              schoolName: aSchool,
              schoolId: schoolRec ? schoolRec.id : session.schoolId || "",
              email: aEmail,
              password: aPassword,
            })
          : { ok: false, message: "Cannot create admins." };
        if (!aCreated.ok) {
          if (window.showToast) window.showToast(aCreated.message, "error");
          return;
        }
        if (window.showToast) {
          window.showToast(
            "Created " +
              aName.trim() +
              " (" +
              (aCreated.positionLabel || aPosition) +
              "). Login: " +
              aCreated.email +
              " / " +
              aCreated.password,
            "success"
          );
        }
        render(session, "admins");
        return;
      }

      var schoolForm = e.target.closest("#addSchoolForm");
      if (schoolForm) {
        e.preventDefault();
        if (session.role !== "superadmin" || !ops || !ops.upsertSchool) {
          if (window.showToast) window.showToast("Only Super Admin can create schools.", "error");
          return;
        }
        var sName = (schoolForm.querySelector('[name="name"]') || {}).value || "";
        var sCity = (schoolForm.querySelector('[name="city"]') || {}).value || "";
        var sSlug = (schoolForm.querySelector('[name="slug"]') || {}).value || "";
        var sTag = (schoolForm.querySelector('[name="tagline"]') || {}).value || "";
        var sAbout = (schoolForm.querySelector('[name="about"]') || {}).value || "";
        var pName = (schoolForm.querySelector('[name="principalName"]') || {}).value || "";
        var pEmail = (schoolForm.querySelector('[name="principalEmail"]') || {}).value || "";
        var pPass = (schoolForm.querySelector('[name="principalPassword"]') || {}).value || "Demo@12345";
        var createdSchool = ops.upsertSchool({
          name: sName,
          city: sCity,
          slug: sSlug,
          tagline: sTag,
          about: sAbout,
          principalEmail: pEmail,
          publicEnabled: true,
        });
        if (!createdSchool.ok) {
          if (window.showToast) window.showToast(createdSchool.message, "error");
          return;
        }
        var msg =
          "School created. Public site: " +
          (ops.publicSitePath(createdSchool.school) || "/demos/brightsteps/school.html?s=" + createdSchool.school.slug);
        if (String(pName).trim() && String(pEmail).trim()) {
          var principal = auth.addAdminAccount({
            name: pName,
            email: pEmail,
            password: pPass,
            position: "full",
            className: createdSchool.school.name,
            schoolName: createdSchool.school.name,
            schoolId: createdSchool.school.id,
          });
          if (!principal.ok) {
            if (window.showToast) window.showToast(createdSchool.school.name + " saved, but principal failed: " + principal.message, "error");
            render(session, "schools");
            return;
          }
          ops.upsertSchool({
            id: createdSchool.school.id,
            name: createdSchool.school.name,
            city: createdSchool.school.city,
            slug: createdSchool.school.slug,
            tagline: createdSchool.school.tagline,
            about: createdSchool.school.about,
            principalEmail: principal.email,
            publicEnabled: true,
          });
          msg +=
            " · Principal login: " + principal.email + " / " + principal.password;
        }
        if (window.showToast) window.showToast(msg, "success");
        render(session, "schools");
        return;
      }

      var form = e.target.closest("#addKidForm");
      if (!form) return;
      e.preventDefault();
      if (!canManageRoster(session)) return;
      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var year = (form.querySelector('[name="year"]') || {}).value || "";
      var school = (form.querySelector('[name="school"]') || {}).value || session.className || "School";
      var fee = parseAmount((form.querySelector('[name="fee"]') || {}).value);
      var email = (form.querySelector('[name="email"]') || {}).value || "";
      var password = (form.querySelector('[name="password"]') || {}).value || "Demo@12345";
      var created = auth.addStudentAccount
        ? auth.addStudentAccount({ name: name, year: year, email: email, password: password })
        : { ok: false, message: "Cannot add students." };
      if (!created.ok) {
        if (window.showToast) window.showToast(created.message, "error");
        return;
      }
      var kids = loadKids();
      var kidId = "s-" + Date.now();
      kids.unshift({
        id: kidId,
        name: name.trim(),
        school: String(school).trim(),
        year: String(year).trim(),
        avg: "—",
        fee: fee,
        email: created.email,
      });
      saveKids(kids);
      saveFeeFor(kidId, fee);
      if (window.showToast) {
        window.showToast("Added " + name.trim() + ". Login: " + created.email + " / " + created.password, "success");
      }
      render(session, "students");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
