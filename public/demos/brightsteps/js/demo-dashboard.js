/**
 * BrightSteps static demo — role-based dashboard UI.
 */
(function () {
  "use strict";

  var auth = window.BrightStepsDemoAuth;
  if (!auth) return;

  var NAV = {
    student: [
      { icon: "🏠", label: "Dashboard", id: "home" },
      { icon: "📅", label: "Timetable", id: "timetable" },
      { icon: "📚", label: "Assignments", id: "assignments" },
      { icon: "📊", label: "Marks", id: "marks" },
    ],
    parent: [
      { icon: "🏠", label: "Dashboard", id: "home" },
      { icon: "📖", label: "Diary", id: "diary" },
      { icon: "✅", label: "Attendance", id: "attendance" },
      { icon: "📣", label: "Announcements", id: "announcements" },
    ],
    teacher: [
      { icon: "🏠", label: "Dashboard", id: "home" },
      { icon: "👥", label: "My class", id: "class" },
      { icon: "📝", label: "Assignments", id: "assignments" },
      { icon: "📋", label: "Attendance", id: "attendance" },
    ],
    headmaster: [
      { icon: "🏠", label: "Overview", id: "home" },
      { icon: "🏫", label: "School", id: "school" },
      { icon: "👩‍🏫", label: "Staff", id: "staff" },
      { icon: "📈", label: "Reports", id: "reports" },
    ],
    admin: [
      { icon: "🏠", label: "Dashboard", id: "home" },
      { icon: "👥", label: "Staff", id: "staff" },
      { icon: "🧒", label: "Students", id: "students" },
      { icon: "⚙️", label: "Settings", id: "settings" },
    ],
    superadmin: [
      { icon: "🏠", label: "Platform", id: "home" },
      { icon: "🏫", label: "Schools", id: "schools" },
      { icon: "🛡️", label: "Admins", id: "admins" },
      { icon: "📊", label: "Usage", id: "usage" },
    ],
  };

  function greeting() {
    var hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  function kpis(items) {
    return (
      '<div class="grid-4 stagger mb-2">' +
      items
        .map(function (item) {
          return (
            '<article class="kpi-card card-lift reveal ' +
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
    return (
      '<div class="dash-panel reveal"><div class="dash-panel__head"><h3>' +
      title +
      '</h3></div>' +
      body +
      "</div>"
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

  function contentFor(session, section) {
    var role = session.role;
    section = section || "home";

    if (role === "student") {
      if (section === "timetable") {
        return panel(
          "Today's timetable",
          timeline([
            { time: "8:30", title: "Mathematics", detail: "Room 12 · Ms. Wilson" },
            { time: "10:00", title: "Science", detail: "Lab 2 · Mr. Chen" },
            { time: "11:30", title: "English", detail: "Room 8 · Ms. Patel" },
          ])
        );
      }
      if (section === "assignments") {
        return panel(
          "Upcoming assignments",
          "<p><strong>Fractions worksheet</strong> — due Friday</p><p><strong>Plant diary</strong> — due next Monday</p>"
        );
      }
      if (section === "marks") {
        return panel("Recent marks", "<p>Mathematics: <strong>88%</strong></p><p>Science: <strong>92%</strong></p><p>English: <strong>85%</strong></p>");
      }
      return (
        '<div class="welcome-banner reveal"><h2>' +
        greeting() +
        ", " +
        session.name.split(" ")[0] +
        '! 👋</h2><p>' +
        session.className +
        "</p></div>" +
        kpis([
          { label: "Attendance", value: "96%", accent: "accent-mint" },
          { label: "Pending work", value: "2", accent: "accent-sky" },
          { label: "Upcoming exams", value: "1", accent: "accent-royal" },
          { label: "Recent average", value: "88%", accent: "accent-coral" },
        ]) +
        '<div class="grid-2">' +
        panel("Today's classes", timeline([
          { time: "8:30", title: "Mathematics", detail: "Room 12" },
          { time: "10:00", title: "Science", detail: "Lab 2" },
        ])) +
        panel("Today's diary", "<p><strong>Science</strong> — Plant growth observation</p><p class='text-muted small'>Homework: draw and label the stem.</p>") +
        "</div>"
      );
    }

    if (role === "parent") {
      if (section === "diary") return panel("Class diary", "<p><strong>Science</strong> — Plant growth topic introduced.</p><p><strong>English</strong> — Creative writing: my weekend.</p>");
      if (section === "attendance") return panel("Attendance", "<p>Alex Rivera — <strong>96%</strong> this term</p><p class='text-muted small'>2 late arrivals · 1 excused absence</p>");
      if (section === "announcements") return panel("Announcements", "<p>📣 Spring sports day — Friday 14 March</p><p>📣 Parent evening bookings open</p>");
      return (
        '<div class="welcome-banner reveal"><h2>' +
        greeting() +
        ", " +
        session.name.split(" ")[0] +
        '</h2><p>View diary, attendance, marks and announcements for your linked children.</p></div>' +
        '<article class="person-card card-lift accent-sky reveal" style="text-align:left;max-width:520px;"><h3 class="mb-0">Alex Rivera</h3><p class="text-muted mb-1">Grade 4 · Maple Class</p><span class="badge-soft">Son · STU-1042</span><div class="d-flex gap-1 flex-wrap mt-2"><button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-section="diary">Diary</button><button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-section="attendance">Attendance</button><button type="button" class="btn-bsa btn-bsa-sm btn-bsa-soft" data-section="announcements">Announcements</button></div></article>'
      );
    }

    if (role === "teacher") {
      if (section === "class") return panel("Maple Class", "<p>24 students enrolled</p><p>Next lesson: Mathematics · 8:30 AM</p>");
      if (section === "assignments") return panel("Assignments", "<p><strong>Fractions worksheet</strong> — published · 18 submitted</p><button type='button' class='btn-bsa btn-bsa-sm btn-bsa-primary mt-2' data-demo-action='publish'>Publish new (demo)</button>");
      if (section === "attendance") return panel("Today's attendance", "<p>22 present · 1 late · 1 absent</p>");
      return (
        '<div class="welcome-banner reveal"><h2>' +
        greeting() +
        ", " +
        session.name.split(" ")[0] +
        '</h2><p>' +
        session.className +
        "</p></div>" +
        kpis([
          { label: "My students", value: "24", accent: "accent-sky" },
          { label: "Lessons today", value: "4", accent: "accent-mint" },
          { label: "To mark", value: "6", accent: "accent-coral" },
          { label: "Messages", value: "3", accent: "accent-royal" },
        ]) +
        panel("Quick actions", '<button type="button" class="btn-bsa btn-bsa-soft me-1" data-section="attendance">Take attendance</button><button type="button" class="btn-bsa btn-bsa-soft" data-demo-action="publish">Post assignment</button>')
      );
    }

    if (role === "headmaster") {
      return (
        '<div class="welcome-banner reveal"><h2>School overview</h2><p>' +
        session.className +
        "</p></div>" +
        kpis([
          { label: "Students", value: "412", accent: "accent-mint" },
          { label: "Staff", value: "38", accent: "accent-sky" },
          { label: "Attendance", value: "94%", accent: "accent-royal" },
          { label: "Open tasks", value: "5", accent: "accent-coral" },
        ]) +
        panel("This week", "<p>Staff meeting — Wednesday</p><p>Inspection prep — ongoing</p>")
      );
    }

    if (role === "admin") {
      return (
        '<div class="welcome-banner reveal"><h2>School admin</h2><p>' +
        session.className +
        "</p></div>" +
        kpis([
          { label: "Active staff", value: "38", accent: "accent-sky" },
          { label: "Students", value: "412", accent: "accent-mint" },
          { label: "Classes", value: "18", accent: "accent-royal" },
          { label: "Pending invites", value: "2", accent: "accent-coral" },
        ]) +
        panel("Recent activity", "<p>New teacher account created</p><p>Website banner updated</p>")
      );
    }

    return (
      '<div class="welcome-banner reveal"><h2>Platform control</h2><p>Manage schools and school administrators across the platform.</p></div>' +
      kpis([
        { label: "Schools", value: "12", accent: "accent-royal" },
        { label: "School admins", value: "14", accent: "accent-sky" },
        { label: "Active users", value: "3.2k", accent: "accent-mint" },
        { label: "Support tickets", value: "4", accent: "accent-coral" },
      ]) +
      panel("Onboarding queue", "<p>BrightFuture Academy — setup in progress</p><p>Riverside Primary — awaiting DNS</p>")
    );
  }

  function render(session, section) {
    var navItems = NAV[session.role] || NAV.student;
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

    document.getElementById("dashRoleBadge").textContent = session.roleLabel;
    document.getElementById("dashUserName").textContent = session.name;
    document.getElementById("dashNav").innerHTML = navHtml;
    document.getElementById("dashContent").innerHTML = contentFor(session, section);
    document.title = session.roleLabel + " · BrightSteps Academy";
  }

  function boot() {
    var session = auth.requireAuth();
    if (!session) return;

    var section = "home";
    render(session, section);

    document.getElementById("dashLogout").addEventListener("click", function (e) {
      e.preventDefault();
      auth.logout();
    });

    document.addEventListener("click", function (e) {
      var navLink = e.target.closest("[data-section]");
      if (navLink && navLink.closest("#dashNav")) {
        e.preventDefault();
        section = navLink.getAttribute("data-section");
        render(session, section);
        return;
      }
      if (navLink && navLink.closest("#dashContent")) {
        e.preventDefault();
        section = navLink.getAttribute("data-section");
        render(session, section);
        return;
      }
      var demoBtn = e.target.closest("[data-demo-action]");
      if (demoBtn && window.showToast) {
        window.showToast("Saved (demo) — no server connected.", "success");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
