(() => {
  "use strict";

  /* =========================================================
     Constants & state
     ========================================================= */
  const CATEGORIES = {
    work:     { label: "Work",     color: "#7C9EFF" },
    personal: { label: "Personal", color: "#5EEAD4" },
    health:   { label: "Health",   color: "#FF6B81" },
    study:    { label: "Study",    color: "#FFB86B" },
    other:    { label: "Other",    color: "#C084FC" }
  };

  const STORAGE_KEYS = { tasks: "flow_tasks_v1", theme: "flow_theme_v1" };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let state = {
    tasks: [],
    selectedDate: toISO(new Date()),
    filter: "all",
    search: "",
    editingId: null
  };

  /* =========================================================
     Date helpers
     ========================================================= */
  function toISO(d) {
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60000);
    return local.toISOString().slice(0, 10);
  }
  function todayISO() { return toISO(new Date()); }
  function addDays(iso, n) {
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + n);
    return toISO(d);
  }
  function dayLabel(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  /* =========================================================
     Persistence
     ========================================================= */
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.tasks);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt storage */ }
    return seedTasks();
  }
  function saveTasks() {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(state.tasks));
  }
  function seedTasks() {
    const t = todayISO();
    return [
      { id: cryptoId(), title: "Review pull requests", category: "work", priority: "high", dueDate: t, dueTime: "09:30", notes: "", completed: true, createdAt: Date.now() },
      { id: cryptoId(), title: "Team standup", category: "work", priority: "medium", dueDate: t, dueTime: "10:00", notes: "", completed: true, createdAt: Date.now() },
      { id: cryptoId(), title: "Design system polish", category: "work", priority: "medium", dueDate: t, dueTime: "13:00", notes: "Spacing + color tokens", completed: false, createdAt: Date.now() },
      { id: cryptoId(), title: "Gym — leg day", category: "health", priority: "low", dueDate: t, dueTime: "18:30", notes: "", completed: false, createdAt: Date.now() },
      { id: cryptoId(), title: "Read 20 pages", category: "study", priority: "low", dueDate: t, dueTime: "21:00", notes: "", completed: false, createdAt: Date.now() },
      { id: cryptoId(), title: "Pay electricity bill", category: "personal", priority: "high", dueDate: addDays(t, -1), dueTime: "12:00", notes: "", completed: false, createdAt: Date.now() },
      { id: cryptoId(), title: "Plan weekend trip", category: "personal", priority: "low", dueDate: addDays(t, 1), dueTime: "11:00", notes: "", completed: false, createdAt: Date.now() },
      { id: cryptoId(), title: "Mock interview practice", category: "study", priority: "medium", dueDate: addDays(t, 1), dueTime: "16:00", notes: "", completed: false, createdAt: Date.now() },
      { id: cryptoId(), title: "Dentist appointment", category: "health", priority: "medium", dueDate: addDays(t, 2), dueTime: "10:30", notes: "", completed: false, createdAt: Date.now() }
    ];
  }
  function cryptoId() {
    return "t_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  /* =========================================================
     Theme
     ========================================================= */
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    const preferred = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(preferred);
  }
  function setTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(STORAGE_KEYS.theme, mode);
    const icon = document.getElementById("themeIcon");
    icon.className = mode === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  }

  /* =========================================================
     Clock & greeting
     ========================================================= */
  function tickClock() {
    const now = new Date();
    document.getElementById("clockTime").textContent =
      now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    document.getElementById("clockDate").textContent =
      now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  function updateGreeting() {
    const h = new Date().getHours();
    const eyebrow = h < 12 ? "GOOD MORNING" : h < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";
    document.getElementById("greetingEyebrow").textContent = eyebrow;
  }

  /* =========================================================
     Date rail
     ========================================================= */
  function renderDateRail() {
    const track = document.getElementById("dateRailTrack");
    track.innerHTML = "";
    const today = todayISO();
    for (let i = -4; i <= 10; i++) {
      const iso = addDays(today, i);
      const d = new Date(iso + "T00:00:00");
      const hasTasks = state.tasks.some(t => t.dueDate === iso);
      const btn = document.createElement("button");
      btn.className = "day-pill" +
        (iso === today ? " is-today" : "") +
        (iso === state.selectedDate ? " is-selected" : "") +
        (hasTasks ? " has-tasks" : "");
      btn.dataset.date = iso;
      btn.innerHTML = `
        <span class="dow">${d.toLocaleDateString(undefined, { weekday: "short" })}</span>
        <span class="dom">${d.getDate()}</span>
        <span class="dot"></span>
      `;
      btn.addEventListener("click", () => selectDate(iso));
      track.appendChild(btn);
    }
    const selectedEl = track.querySelector(".is-selected");
    if (selectedEl) selectedEl.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
  }
  function selectDate(iso) {
    state.selectedDate = iso;
    renderDateRail();
    renderAll();
  }

  /* =========================================================
     Filtering / querying
     ========================================================= */
  function getTasksForSelectedDate() {
    return state.tasks
      .filter(t => t.dueDate === state.selectedDate)
      .sort((a, b) => a.dueTime.localeCompare(b.dueTime));
  }
  function isOverdue(task) {
    if (task.completed) return false;
    if (task.dueDate < todayISO()) return true;
    if (task.dueDate === todayISO()) {
      const [h, m] = task.dueTime.split(":").map(Number);
      const due = new Date();
      due.setHours(h, m, 0, 0);
      return due < new Date();
    }
    return false;
  }
  function applyFilters(tasks) {
    let out = tasks;
    if (state.filter === "pending") out = out.filter(t => !t.completed);
    else if (state.filter === "completed") out = out.filter(t => t.completed);
    else if (state.filter === "overdue") out = out.filter(isOverdue);
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      out = out.filter(t => t.title.toLowerCase().includes(q) || CATEGORIES[t.category].label.toLowerCase().includes(q));
    }
    return out;
  }

  /* =========================================================
     Timeline rendering
     ========================================================= */
  function renderTimeline() {
    const dayTasks = getTasksForSelectedDate();
    const visible = applyFilters(dayTasks);
    const list = document.getElementById("taskList");
    const empty = document.getElementById("emptyState");

    document.getElementById("timelineDateLabel").textContent = "— " + dayLabel(state.selectedDate);

    list.innerHTML = "";
    if (visible.length === 0) {
      empty.hidden = false;
    } else {
      empty.hidden = true;
      visible.forEach((task, i) => {
        const li = buildTaskCard(task);
        li.style.animationDelay = (i * 0.04) + "s";
        list.appendChild(li);
      });
    }

    const total = dayTasks.length;
    const done = dayTasks.filter(t => t.completed).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById("spineFill").style.height = pct + "%";
  }

  function buildTaskCard(task) {
    const cat = CATEGORIES[task.category];
    const overdue = isOverdue(task);
    const li = document.createElement("li");
    li.className = "task-card" + (task.completed ? " is-completed" : "") + (overdue ? " is-overdue" : "");
    li.style.setProperty("--cat-color", cat.color);
    li.dataset.id = task.id;

    const time12 = formatTime(task.dueTime);

    li.innerHTML = `
      <button class="task-check" aria-label="Toggle complete">
        <i class="fa-solid fa-check"></i>
      </button>
      <div class="task-card__body">
        <p class="task-card__title">${escapeHTML(task.title)}</p>
        <div class="task-card__meta">
          <span class="cat-tag">${cat.label}</span>
          <span class="priority priority-${task.priority}"><i class="fa-solid fa-flag"></i>${cap(task.priority)}</span>
          <time>${time12}</time>
          ${overdue ? '<span class="priority priority-high"><i class="fa-solid fa-triangle-exclamation"></i>Overdue</span>' : ""}
        </div>
      </div>
      <div class="task-card__actions">
        <button class="mini-btn" data-action="edit" aria-label="Edit task"><i class="fa-solid fa-pen"></i></button>
        <button class="mini-btn danger" data-action="delete" aria-label="Delete task"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    li.querySelector(".task-check").addEventListener("click", () => toggleComplete(task.id));
    li.querySelector('[data-action="edit"]').addEventListener("click", () => openModal(task.id));
    li.querySelector('[data-action="delete"]').addEventListener("click", () => deleteTask(task.id));

    return li;
  }

  function formatTime(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function escapeHTML(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  /* =========================================================
     Mutations
     ========================================================= */
  function toggleComplete(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveTasks();
    renderAll();
    if (task.completed) toast(`"${task.title}" marked complete`, "success");
  }
  function deleteTask(id) {
    const task = state.tasks.find(t => t.id === id);
    const card = document.querySelector(`.task-card[data-id="${id}"]`);
    if (card && !prefersReducedMotion) {
      card.classList.add("is-removing");
      setTimeout(finish, 380);
    } else {
      finish();
    }
    function finish() {
      state.tasks = state.tasks.filter(t => t.id !== id);
      saveTasks();
      renderAll();
      if (task) toast(`"${task.title}" deleted`, "danger");
    }
  }
  function upsertTask(data) {
    if (state.editingId) {
      const task = state.tasks.find(t => t.id === state.editingId);
      Object.assign(task, data);
      toast(`"${task.title}" updated`, "success");
    } else {
      state.tasks.push({ id: cryptoId(), completed: false, createdAt: Date.now(), ...data });
      toast(`"${data.title}" added`, "success");
    }
    saveTasks();
  }

  /* =========================================================
     Stats: ring + week bars + categories
     ========================================================= */
  const RING_CIRCUMFERENCE = 2 * Math.PI * 60;

  function renderStats() {
    const dayTasks = getTasksForSelectedDate();
    const total = dayTasks.length;
    const done = dayTasks.filter(t => t.completed).length;
    const left = total - done;
    const pct = total ? Math.round((done / total) * 100) : 0;

    document.getElementById("statTotal").textContent = total;
    document.getElementById("statDone").textContent = done;
    document.getElementById("statLeft").textContent = left;
    document.getElementById("pctText").textContent = pct + "%";

    const ring = document.getElementById("ringFg");
    const offset = RING_CIRCUMFERENCE - (pct / 100) * RING_CIRCUMFERENCE;
    ring.style.strokeDashoffset = offset;

    document.getElementById("heroSummary").textContent = total === 0
      ? "No tasks queued for this day — plan something."
      : `${done} of ${total} tasks done (${pct}%) for ${dayLabel(state.selectedDate)}.`;
  }

  function renderWeekBars() {
    const container = document.getElementById("weekBars");
    container.innerHTML = "";
    const today = todayISO();
    // week: 6 days ago -> today
    let sum = 0, counted = 0;
    for (let i = -6; i <= 0; i++) {
      const iso = addDays(today, i);
      const dayTasks = state.tasks.filter(t => t.dueDate === iso);
      const total = dayTasks.length;
      const done = dayTasks.filter(t => t.completed).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      if (total) { sum += pct; counted++; }

      const d = new Date(iso + "T00:00:00");
      const col = document.createElement("div");
      col.className = "week-bar" + (total ? " has-data" : "") + (iso === today ? " is-today" : "");
      col.innerHTML = `
        <div class="week-bar__col" style="height:${Math.max(pct, 4)}%" title="${dayLabel(iso)}: ${pct}%"></div>
        <span class="week-bar__day">${d.toLocaleDateString(undefined, { weekday: "narrow" })}</span>
      `;
      container.appendChild(col);
    }
    document.getElementById("weekAvg").textContent = counted ? `${Math.round(sum / counted)}% avg` : "—";
  }

  function renderCategories() {
    const container = document.getElementById("catList");
    container.innerHTML = "";
    const counts = {};
    Object.keys(CATEGORIES).forEach(k => counts[k] = 0);
    state.tasks.forEach(t => { if (!t.completed) counts[t.category]++; });
    const max = Math.max(1, ...Object.values(counts));

    Object.entries(CATEGORIES).forEach(([key, meta]) => {
      const count = counts[key];
      const row = document.createElement("div");
      row.className = "cat-row";
      row.innerHTML = `
        <span class="swatch" style="background:${meta.color}"></span>
        <span class="name">${meta.label}</span>
        <span class="bar"><span class="bar__fill" style="width:0%; background:${meta.color}"></span></span>
        <span class="count">${count}</span>
      `;
      container.appendChild(row);
      requestAnimationFrame(() => {
        row.querySelector(".bar__fill").style.width = `${(count / max) * 100}%`;
      });
    });
  }

  /* =========================================================
     Modal
     ========================================================= */
  function openModal(taskId = null) {
    state.editingId = taskId;
    const overlay = document.getElementById("modalOverlay");
    const form = document.getElementById("taskForm");
    form.reset();

    document.getElementById("modalTitle").textContent = taskId ? "Edit task" : "New task";
    document.getElementById("deleteTaskBtn").hidden = !taskId;

    if (taskId) {
      const t = state.tasks.find(x => x.id === taskId);
      document.getElementById("taskId").value = t.id;
      document.getElementById("taskTitle").value = t.title;
      document.getElementById("taskDate").value = t.dueDate;
      document.getElementById("taskTime").value = t.dueTime;
      document.getElementById("taskCategory").value = t.category;
      document.getElementById("taskPriority").value = t.priority;
      document.getElementById("taskNotes").value = t.notes || "";
    } else {
      document.getElementById("taskDate").value = state.selectedDate;
      document.getElementById("taskTime").value = "09:00";
    }

    overlay.classList.add("is-open");
    setTimeout(() => document.getElementById("taskTitle").focus(), 150);
  }
  function closeModal() {
    document.getElementById("modalOverlay").classList.remove("is-open");
    state.editingId = null;
  }

  /* =========================================================
     Toasts
     ========================================================= */
  function toast(message, type = "success") {
    const root = document.getElementById("toastRoot");
    const el = document.createElement("div");
    el.className = "toast" + (type === "danger" ? " toast--danger" : "");
    const icon = type === "danger" ? "fa-circle-xmark" : "fa-circle-check";
    el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${escapeHTML(message)}</span>`;
    root.appendChild(el);
    setTimeout(() => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 250);
    }, 2600);
  }

  /* =========================================================
     3D tilt effect
     ========================================================= */
  function initTilt() {
    if (prefersReducedMotion) return;
    document.querySelectorAll(".tilt").forEach(el => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-2px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
      });
    });
  }

  /* =========================================================
     Master render
     ========================================================= */
  function renderAll() {
    renderTimeline();
    renderStats();
    renderWeekBars();
    renderCategories();
    renderDateRail();
  }

  /* =========================================================
     Event bindings
     ========================================================= */
  function bindEvents() {
    document.getElementById("themeToggle").addEventListener("click", toggleTheme);

    document.getElementById("openAddTask").addEventListener("click", () => openModal());
    document.getElementById("emptyAddBtn").addEventListener("click", () => openModal());
    document.getElementById("modalClose").addEventListener("click", closeModal);
    document.getElementById("cancelTaskBtn").addEventListener("click", closeModal);
    document.getElementById("modalOverlay").addEventListener("click", e => {
      if (e.target.id === "modalOverlay") closeModal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById("searchInput").focus();
      }
    });

    document.getElementById("taskForm").addEventListener("submit", e => {
      e.preventDefault();
      const data = {
        title: document.getElementById("taskTitle").value.trim(),
        dueDate: document.getElementById("taskDate").value,
        dueTime: document.getElementById("taskTime").value,
        category: document.getElementById("taskCategory").value,
        priority: document.getElementById("taskPriority").value,
        notes: document.getElementById("taskNotes").value.trim()
      };
      if (!data.title) return;
      upsertTask(data);
      closeModal();
      if (data.dueDate !== state.selectedDate) selectDate(data.dueDate);
      else renderAll();
    });

    document.getElementById("deleteTaskBtn").addEventListener("click", () => {
      if (state.editingId) {
        const id = state.editingId;
        closeModal();
        deleteTask(id);
      }
    });

    document.getElementById("dateRailPrev").addEventListener("click", () => {
      document.getElementById("dateRailTrack").scrollBy({ left: -220, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
    document.getElementById("dateRailNext").addEventListener("click", () => {
      document.getElementById("dateRailTrack").scrollBy({ left: 220, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    document.getElementById("chipFilters").addEventListener("click", e => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.filter = btn.dataset.filter;
      renderTimeline();
    });

    let searchDebounce;
    document.getElementById("searchInput").addEventListener("input", e => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.search = e.target.value;
        renderTimeline();
      }, 120);
    });
  }

  /* =========================================================
     Init
     ========================================================= */
  function init() {
    initTheme();
    state.tasks = loadTasks();
    saveTasks();

    updateGreeting();
    tickClock();
    setInterval(tickClock, 1000 * 30);

    document.getElementById("footYear").textContent = new Date().getFullYear();

    bindEvents();
    renderAll();
    initTilt();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
