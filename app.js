import * as G from "./game.js";
const KEY = "advanced-settings-v1";
let s = G.fresh(),
  saveError = "";
try {
  const raw = localStorage.getItem(KEY);
  if (raw) s = G.restore(raw);
} catch (e) {
  saveError =
    "Saved data could not be loaded. Export your current session before replacing it.";
}
let page = location.hash.slice(1) || "overview",
  path = [],
  toastTimer;
const $ = (id) => document.getElementById(id);
const esc = (x) =>
  String(x).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const money = (n) => "$" + Math.floor(n).toLocaleString();
const button = (text, action, id = "", disabled = false, cls = "") =>
  `<button class="${cls}" data-action="${action}" data-id="${id}" ${disabled ? "disabled" : ""}>${text}</button>`;
const nav = [
  ["overview", "◫", "Overview"],
  ["projects", "⌘", "Projects"],
  ["skills", "⌥", "Skills & tools"],
  ["automation", "⇄", "Automation"],
  ["inbox", "✉", "Company inbox"],
  ["diagnostics", "⌁", "Diagnostics"],
  ["settings", "⚙", "Settings"],
];
const titles = {
  overview: "A little more capable.",
  projects: "Good software starts somewhere.",
  skills: "Make this setup yours.",
  automation: "Delegate the familiar.",
  inbox: "You have company.",
  diagnostics: "Everything leaves a trace.",
  settings: "There is always another menu.",
  legacy: "Someone was here before you.",
  channel: "The fourth channel.",
};
function notify(text) {
  $("toast").textContent = text;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 3500);
}
function persist() {
  s.last = Date.now();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    $("save-status").textContent = "Saved locally";
  } catch {
    $("save-status").textContent = "Storage unavailable — export to save";
  }
}
function go(id) {
  page = id;
  path = [];
  location.hash = id;
  render();
}
function panel(label, title, body, extra = "") {
  return `<section class="panel ${extra}"><div class="section-label">${label}</div><h2>${title}</h2>${body}</section>`;
}
function goal() {
  if (!s.releases)
    return [
      "Your first release",
      "Choose a feature, write it, test it, fix any defects, and ship Pocket Notes.",
    ];
  if (s.rank < Math.min(4, Math.floor(s.releases / 3)))
    return [
      "Your review is ready",
      "Visit the company inbox to choose a career direction and claim your promotion.",
    ];
  if (!s.skills.includes("web"))
    return [
      "A wider world",
      "Unlock Web development in Skills & tools to start a second project.",
    ];
  if (!s.skills.includes("scheduler"))
    return [
      "Get your time back",
      "Unlock the Task scheduler to automate testing, debugging, and releases.",
    ];
  if (s.rank < 4)
    return [
      "Build a reputation",
      `${3 * (s.rank + 1) - s.releases} more releases until your next promotion review.`,
    ];
  return [
    "The workstation is yours",
    "Explore the remaining menus, finish the case files, and keep building.",
  ];
}
function projectCard(def) {
  const p = s.projects[def.id] || {
    version: 0,
    stage: "plan",
    feature: "search",
    bugs: 0,
  };
  const open = G.unlocked(s, def);
  const j = s.jobs.find((j) => j.project === def.id);
  let control = "";
  if (!open)
    control = `<div class="locked-note">↳ Requires ${esc(def.skill)} · unlock in Skills & tools</div>`;
  else if (p.stage === "plan")
    control = `<label class="field-label" for="feature-${def.id}">NEXT FEATURE</label><select id="feature-${def.id}">${G.FEATURES.map((f) => `<option value="${f.id}">${f.name} · ${f.time}s · ${f.bugs} base defects</option>`).join("")}</select>${button("Start development →", "start", def.id, false, "primary wide")}`;
  else if (j)
    control = `<div class="progress-label"><span>${{ write: "Writing feature", test: "Running test suite", debug: "Resolving defects" }[j.kind]}${j.paused ? " · paused" : ""}</span><b>${Math.floor((j.done / j.total) * 100)}%</b></div><progress max="${j.total}" value="${j.done}"></progress><div class="row-actions">${button(j.paused ? "Resume process" : "Pause process", "pause", j.id, false, "quiet")}<small>Shares ${G.workers(s)} CPU core${G.workers(s) > 1 ? "s" : ""}</small></div>`;
  else if (p.stage === "written")
    control = `<div class="result">✓ Feature written. Verify it before release.</div>${button("Run tests · 8s", "test", def.id, false, "primary wide")}`;
  else if (p.stage === "tested")
    control = p.bugs
      ? `<div class="result warning">${p.bugs} defect${p.bugs > 1 ? "s" : ""} found. The release gate is closed.</div>${button("Debug feature", "debug", def.id, false, "primary wide")}`
      : `<div class="result">✓ All checks passed. Ready for the world.</div>${button("Ship v" + (p.version + 1) + ".0 ↗", "release", def.id, false, "primary wide")}`;
  return `<article class="project-card ${open ? "" : "locked"}"><div class="card-top"><span class="project-icon">${{ notes: "▤", intranet: "▦", archive: "▥", monitor: "⌁", workspace: "◈" }[def.id]}</span><span class="tag">${open ? "v" + p.version + ".0" : "LOCKED"}</span></div><div class="eyebrow">${def.kind}</div><h3>${def.name}</h3><p>${def.desc}</p><div class="project-controls">${control}</div></article>`;
}
function overview() {
  const [title, desc] = goal();
  return `<section class="hero"><div><div class="eyebrow">YOUR NEXT SMALL VICTORY</div><h2>${title}</h2><p>${desc}</p>${button("Open " + (title === "Your review is ready" ? "company inbox" : "projects") + " →", "navigate", title === "Your review is ready" ? "inbox" : "projects", false, "primary")}</div><div class="hero-art" aria-hidden="true"><div class="window-mini"><div>● ● ● <span>pocket-notes.exe</span></div><p><i></i><i></i><i></i><i></i></p><b>build something<br>that works.</b><small>and then make it better_</small></div><span class="floating-tag">✓ one thing at a time</span></div></section><div class="section-heading"><h2>On your workbench</h2><a href="#projects">All projects ↗</a></div><div class="project-grid">${G.PROJECTS.slice(0, 2).map(projectCard).join("")}</div><div class="two-col">${panel(
    "BACKGROUND TASK",
    "A little research goes a long way.",
    `<p>Read documentation while your builds run. Each session earns 8 knowledge. Jobs share your available CPU capacity.</p>${button(
      s.jobs.some((j) => j.kind === "research")
        ? "Research in progress"
        : "Start research · 20s",
      "research",
      "",
      s.jobs.some((j) => j.kind === "research"),
      "quiet",
    )}`,
  )}${panel("AROUND THE OFFICE", "An entirely ordinary duck.", `<div class="news-line"><span class="duck" aria-hidden="true">🦆</span><p>${duckHeadlines[s.stories.duck]}</p></div><a href="#inbox">Read the facilities bulletin ↗</a>`)}</div>`;
}
const duckHeadlines = [
  "DUCK REFUSES TO LEAVE CORPORATE HEADQUARTERS",
  "MYSTERY DUCK PREDICTS COMPANY LAYOFFS",
  "DUCK BREACHES HIGH-SECURITY FACILITY",
  "LOCAL DUCK APPARENTLY APPOINTED TO BOARD",
  "DUCK RETIRES FROM BOARD TO PURSUE BREAD-ADJACENT INTERESTS",
];
function skills() {
  return `<div class="notice">Knowledge is a permanent unlock requirement. Only budget is spent. Languages open new projects; hardware lets jobs run in parallel.</div><div class="skill-grid">${G.SKILLS.map(
    (k) => {
      const own = s.skills.includes(k.id),
        can =
          s.money >= k.cost &&
          s.xp >= k.xp &&
          (!k.requires || s.skills.includes(k.requires));
      return panel(
        own ? "INSTALLED" : "WORKSTATION UPGRADE",
        k.name,
        `<p>${k.desc}</p><div class="skill-cost"><b>${money(k.cost)}</b><span>${k.xp} knowledge${k.requires ? " · needs assistant" : ""}</span></div>${button(own ? "✓ Installed" : can ? "Install upgrade →" : "Requirements not met", "buy", k.id, own || !can, own ? "quiet" : "primary wide")}`,
      );
    },
  ).join("")}</div>`;
}
function toggle(label, desc, key, checked, disabled = false) {
  return `<div class="setting-row"><div><strong>${label}</strong><p>${desc}</p></div><button role="switch" aria-checked="${checked}" aria-label="${label}" class="toggle ${checked ? "on" : ""}" data-action="toggle" data-id="${key}" ${disabled ? "disabled" : ""}><span></span></button></div>`;
}
function automation() {
  return (
    panel(
      "WORKFLOW",
      "Let the boring parts run themselves.",
      `${toggle("Release pipeline", "Test → debug → release. Choose each new feature yourself. Requires Task scheduler.", "auto", s.auto, !s.skills.includes("scheduler"))}<div class="setting-row"><div><strong>Local assistant assignment</strong><p>Development speeds project jobs; research speeds knowledge; security traces and removes threats.</p></div><select id="ai" ${s.skills.includes("agents") ? "" : "disabled"} aria-label="Assistant assignment"><option value="development" ${s.ai === "development" ? "selected" : ""}>Development</option><option value="research" ${s.ai === "research" ? "selected" : ""}>Research</option><option value="security" ${s.ai === "security" ? "selected" : ""}>Security</option></select></div><p class="fine">${s.skills.includes("agents") ? "Assistant online. " + (s.skills.includes("local") ? "Local model: 80% assigned-task boost." : "Base model: 40% assigned-task boost.") : "Install AI task assistant in Skills & tools to unlock assignments."} All AI is simulated locally.</p>`,
    ) +
    panel(
      "PROCESS CONTROL",
      "The queue is your workspace.",
      `<p>Pause a process from the activity panel to give other tasks more CPU time. Paused jobs keep their progress. Sometimes, inspecting a paused system reveals more than inspecting a busy one.</p><a href="#diagnostics">Open diagnostics ↗</a>`,
    )
  );
}
function inbox() {
  const eligible = s.rank < 4 && s.releases >= 3 * (s.rank + 1);
  return `<div class="two-col">${panel("PEOPLE OPERATIONS / CAREER", G.RANKS[s.rank], `<p>${s.rank === 4 ? "You have reached the final promotion. Your setup, tools, and discoveries remain yours to explore." : `Ship ${3 * (s.rank + 1)} total releases for your next review. Current: ${s.releases}. Promotions grant a larger budget.`}</p><div class="career-track">${G.RANKS.map((r, i) => `<span class="${s.rank >= i ? "done" : ""}">${i + 1}. ${r}</span>`).join("")}</div>${eligible ? `<p>Your review is ready. Choose how your contribution is recorded.</p>${["specialist", "manager", "automator"].map((t) => button("Choose " + t, "promote", t, false, "quiet")).join(" ")}<p class="fine">Career direction is narrative; all tools remain available.</p>` : s.track ? `<span class="tag">Career direction: ${s.track}</span>` : ""}`)}${panel("FACILITIES / CASE " + Math.min(s.stories.duck + 1, 4) + " OF 4", duckHeadlines[s.stories.duck], `<p>${["Local news has requested an interview. The duck has requested nothing, but keeps looking at the cafeteria.", "Someone has confused snack-seeking behavior with economic forecasting.", "Security wants a badge number. Facilities suggests checking the door sensor.", "A public directory sync has turned an office joke into a governance crisis.", "Case closed. A feeding area away from the doors keeps the duck safe. It remains a duck."][s.stories.duck]}</p>${button(s.stories.duck === 4 ? "✓ Duck case resolved" : "Inspect supporting records →", "story", "duck", s.stories.duck === 4, "quiet")}`)}</div>${panel("RECOVERED CORRESPONDENCE", "The previous employee", `<blockquote>“The build server stops responding at 4:17 every Thursday. Management calls this scheduled maintenance. It is Greg’s space heater.”</blockquote><p>${["The previous user left this in your welcome packet. A pencilled line underneath says: “Old themes carry more than colors. Pause something. Let the importer catch its breath.”", "Workspace Zero contains Mara’s notes. A database tool may be able to read her archived attachment.", "Mara’s resignation record is intact. The attachment says: “Disconnect before checking channel four.”", "Mara’s audit is recovered. She resigned after documenting inflated metrics, and left enough evidence for the next employee to verify her work. You have preserved the report."][s.stories.employee]}</p>${s.stories.employee === 1 ? button("Read archived attachment", "story", "archive", !s.skills.includes("database"), "quiet") : ""}<div class="case-status">${s.stories.employee === 3 ? "✓ Employee case resolved" : s.stories.employee + "/3 evidence recovered"}</div>`)}${s.rank === 4 && s.stories.employee === 3 && s.stories.hacker === 5 && s.stories.duck === 4 ? panel("END OF PROBATION. FINALLY.", "Access granted.", `<p>You made useful software, exposed the false metrics, secured your workstation, and proved that a duck was a duck. Meridian will never be sensible. But your corner of it works.</p><strong>All four storylines complete. Free play continues.</strong>`, "ending") : ""}`;
}
function diagnostics() {
  const h = s.stories.hacker;
  return (
    panel(
      "LIVE PROCESS INSPECTOR",
      "Three documented channels.",
      `<div class="channel-list"><div><span>01 / BUILD</span><b>${s.jobs.filter((j) => j.kind !== "research").length} jobs</b></div><div><span>02 / RESEARCH</span><b>${s.research} sessions complete</b></div><div><span>03 / NETWORK</span><b>${s.settings.offline ? "Isolated" : "Connected"}</b></div>${s.skills.includes("systems") && s.settings.offline ? `<div><span>04 / LOCAL ARCHIVE</span>${button("Inspect channel", "discover", "channel", false, "quiet")}</div>` : ""}</div><p class="fine">Diagnostics monitors all four channels. Network-independent channels may be hidden by default.</p>${toggle("Isolate workstation", "Disconnect the simulated network. Local builds still work.", "offline", s.settings.offline)}`,
    ) +
    panel(
      "SECURITY / INCIDENT REPORT",
      h === 0
        ? "No active incidents."
        : h === 5
          ? "Credential revoked. Case closed."
          : "Unrecognized plugin: quick-fix",
      `<p>${["Security monitoring is enabled. A quiet log is a good log.", "An unsigned plugin is taking 20% of compute resources. Observe it for attribution, or quarantine it immediately.", "Outbound trace points to a former contractor’s credential. The “repair” tool is harvesting metrics.", "Evidence preserved. Quarantine stopped the resource drain. Patch the credential policy to prevent recurrence.", "Resource drain stopped. Attribution was lost, but a signature policy can still stop recurrence.", "The old contractor credential is revoked. Signature verification now prevents this intrusion from returning."][h]}</p>${h === 1 ? button("Observe outbound trace", "story", "observe", false, "quiet") : ""} ${h === 1 || h === 2 ? button("Quarantine plugin", "story", "quarantine", false, "primary") : ""} ${h === 3 || h === 4 ? button("Install signature policy", "story", "patch", false, "primary") : ""}`,
    )
  );
}
const route = [
  "Editor",
  "Plugins",
  "Installed",
  "Theme Engine",
  "Compatibility",
  "Legacy Themes",
  "Import",
  "Supported Formats",
];
function settings() {
  let body = panel(
    "WORKSTATION PREFERENCES",
    "Small switches. Interesting consequences.",
    `${toggle("Safe development mode", "Careful writing reduces defects. Disabling it writes 30% faster, but adds two defects to new work.", "safe", s.settings.safe)}${toggle("Enable duck-related notifications", "A normal setting for a normal workplace.", "duck", s.settings.duck)}${!s.settings.duck ? `<div class="notice"><b>Additional duck notification settings</b><p>Duck-adjacent notifications remain enabled under policy §12(b). Facilities records are now pinned for your convenience.</p>${button("Open duck incident records", "navigate", "inbox", false, "quiet")}</div>` : ""}`,
  );
  body += panel(
    "ADVANCED / EXPLORER",
    "Compatibility is a very long word.",
    `<div class="breadcrumbs">${button("Settings", "path", "-1", false, "crumb")}${path.map((x, i) => `<span> / </span>${button(esc(x), "path", i, false, "crumb")}`).join("")}</div>${path.length < route.length ? `<div class="folder-row"><span>▱ ${route[path.length]}</span>${button("Open →", "deeper", "", false, "quiet")}</div><p class="fine">${path.length === 0 ? "Editor preferences, plugin metadata, and legacy compatibility." : path.length === 4 ? "Theme engine compatibility. Older formats may contain additional metadata." : "Configuration branch " + path.length + " of " + route.length + "."}</p>` : `<div class="notice">Supported formats: Theme, Palette, Workspace.</div>${toggle("Legacy workspace compatibility", "Enable decoding of old workspace containers.", "legacy", s.settings.legacy)}<p>The importer needs a paused process snapshot. Keep a job paused in the activity panel while importing.</p>${button("Import Workspace →", "discover", "legacy", !(s.settings.legacy && s.jobs.some((j) => j.paused)), "primary")}`}`,
  );
  body += panel(
    "LOCAL DATA",
    "Your desk, wherever you left it.",
    `<p>Progress saves automatically in this browser. Active jobs continue for up to two hours while away. Export a backup to move to another browser. Clearing browser data removes local saves.</p><div class="row-actions">${button("Export save ↓", "export", "", "", "quiet")}${button("Import save ↑", "import", "", "", "quiet")}${button("New workstation", "reset", "", "", "danger")}</div>${saveError ? `<p class="warning">${saveError}</p>` : ""}`,
  );
  return body;
}
function secret() {
  return page === "legacy"
    ? panel(
        "BOOKMARK / WORKSPACE ZERO",
        "A workspace disguised as a theme.",
        `<blockquote>“If they ask, it is a very large color palette.” — Mara</blockquote><p>You recovered an abandoned environment and a new project type. Its notes point toward an employee archive and a fourth diagnostic channel.</p>${button("Open Workspace Zero project", "navigate", "projects", false, "primary")} ${button("Read recovered notes", "navigate", "inbox", false, "quiet")}`,
      )
    : panel(
        "BOOKMARK / LOCAL ARCHIVE",
        "A record that survived.",
        `<p>The report compares real release logs with executive slides. They do not agree. Mara’s signed resignation and her reproducible audit explain what happened.</p><blockquote>“I left the tools, not a puzzle. Okay, a little bit of a puzzle.”</blockquote><p>Evidence preserved. The employee case is resolved.</p>${button("Return to case files", "navigate", "inbox", false, "primary")}`,
      );
}
function render() {
  if (
    !titles[page] ||
    (["legacy", "channel"].includes(page) && !s.bookmarks.includes(page))
  )
    page = "overview";
  $("title").textContent = titles[page];
  $("breadcrumb").textContent = "WORKSPACE / " + page.toUpperCase();
  $("rank").textContent = G.RANKS[s.rank];
  $("nav").innerHTML = nav
    .map(
      ([id, icon, label]) =>
        `<a href="#${id}" class="${page === id ? "selected" : ""}" ${page === id ? 'aria-current="page"' : ""}><span>${icon}</span>${label}${id === "inbox" && s.releases >= 3 * (s.rank + 1) && s.rank < 4 ? "<i></i>" : ""}</a>`,
    )
    .join("");
  $("pins").innerHTML = s.bookmarks.length
    ? s.bookmarks
        .map(
          (id) =>
            `<a class="pin" href="#${id}">↳ ${id === "legacy" ? "Workspace Zero" : "Fourth channel"}</a>`,
        )
        .join("")
    : '<p class="empty-pins">Nothing discovered. Yet.</p>';
  $("stats").innerHTML = [
    ["AVAILABLE BUDGET", money(s.money), "Reinvest in your setup"],
    ["KNOWLEDGE", Math.floor(s.xp), "Learn by doing"],
    ["ACTIVE USERS", s.users.toLocaleString(), "Small tools, real impact"],
    ["RELEASES SHIPPED", String(s.releases).padStart(2, "0"), G.RANKS[s.rank]],
  ]
    .map(
      ([l, n, d]) =>
        `<div><span>${l}</span><strong>${n}</strong><small>${d}</small></div>`,
    )
    .join("");
  const oldSelections = [...document.querySelectorAll('[id^="feature-"]')].map(
    (el) => [el.id, el.value],
  );
  $("content").innerHTML =
    page === "overview"
      ? overview()
      : page === "projects"
        ? `<div class="notice">Choose → write → test → debug → release. Each project can run one job; all active jobs share available compute.</div><div class="project-grid">${G.PROJECTS.filter(
            (p) => p.id !== "workspace" || s.skills.includes("legacy"),
          )
            .map(projectCard)
            .join("")}</div>`
        : page === "skills"
          ? skills()
          : page === "automation"
            ? automation()
            : page === "inbox"
              ? inbox()
              : page === "diagnostics"
                ? diagnostics()
                : page === "settings"
                  ? settings()
                  : secret();
  for (const [id, value] of oldSelections) if ($(id)) $(id).value = value;
  renderActivity();
}
function renderActivity() {
  $("clock").textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const active = s.jobs.filter((j) => !j.paused).length;
  $("cpu").textContent =
    Math.min(100, Math.round((active / G.workers(s)) * 100)) + "%";
  $("job-count").textContent =
    `${active} active process${active === 1 ? "" : "es"} · ${G.workers(s)} core${G.workers(s) === 1 ? "" : "s"}`;
  $("jobs").innerHTML = s.jobs.length
    ? s.jobs
        .map(
          (j) =>
            `<div class="job"><strong>${j.kind === "research" ? "Documentation research" : G.PROJECTS.find((p) => p.id === j.project).name}</strong><small>${j.kind.toUpperCase()} · ${j.paused ? "PAUSED" : Math.floor((j.done / j.total) * 100) + "%"}</small><progress value="${j.done}" max="${j.total}"></progress>${button(j.paused ? "▶ Resume" : "Ⅱ Pause", "pause", j.id, false, "job-toggle")}</div>`,
        )
        .join("")
    : '<div class="idle-state">◌<br>No running processes.<small>A good time to start something.</small></div>';
  $("logs").innerHTML = s.logs
    .slice(0, 6)
    .map(
      (l) =>
        `<div class="log"><time>${new Date(l.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time><p>${esc(l.text)}</p></div>`,
    )
    .join("");
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (!b || b.disabled) return;
  const { action: a, id } = b.dataset;
  let changed = true;
  switch (a) {
    case "navigate":
      go(id);
      return;
    case "start":
      changed = G.start(s, id, $("feature-" + id).value);
      break;
    case "test":
      changed = G.test(s, id);
      break;
    case "debug":
      changed = G.debug(s, id);
      break;
    case "release":
      changed = G.release(s, id);
      break;
    case "buy":
      changed = G.buy(s, id);
      break;
    case "research":
      changed = G.research(s);
      break;
    case "pause": {
      const j = s.jobs.find((j) => j.id === Number(id));
      if (j) j.paused = !j.paused;
      break;
    }
    case "toggle":
      if (id === "auto") s.auto = !s.auto;
      else s.settings[id] = !s.settings[id];
      break;
    case "story":
      changed = G.story(s, id);
      break;
    case "promote":
      changed = G.promote(s, id);
      break;
    case "discover":
      changed = G.discover(s, id);
      if (changed) {
        notify(
          "Discovery pinned: " +
            (id === "legacy" ? "Workspace Zero" : "Fourth channel"),
        );
        go(id);
      }
      break;
    case "deeper":
      path.push(route[path.length]);
      break;
    case "path":
      path = path.slice(0, Number(id) + 1);
      break;
    case "export": {
      persist();
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(s, null, 2)], { type: "application/json" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "advanced-settings-save.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }
    case "import":
      $("import-file").click();
      return;
    case "reset":
      if (
        !confirm(
          "Start a new workstation? This replaces your local progress. Export a backup first if you want to keep it.",
        )
      )
        return;
      s = G.fresh();
      path = [];
      go("overview");
      break;
    default:
      return;
  }
  if (!changed) notify("That action is not available yet.");
  persist();
  render();
});
document.addEventListener("change", (e) => {
  if (e.target.id === "ai") {
    s.ai = e.target.value;
    persist();
    render();
  }
});
$("import-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1000000) throw Error("Save file is too large.");
    const next = G.restore(await file.text());
    if (confirm("Replace this workstation with the imported save?")) {
      s = next;
      persist();
      go("overview");
      notify("Save restored. Welcome back.");
    }
  } catch (err) {
    notify("Could not import: " + err.message);
  }
  e.target.value = "";
});
window.addEventListener("hashchange", () => {
  page = location.hash.slice(1) || "overview";
  path = [];
  render();
});
let last = Date.now(),
  saveClock = 0;
setInterval(() => {
  const now = Date.now();
  const before = JSON.stringify([
    s.jobs.map((j) => j.id),
    s.projects,
    s.stories,
    s.xp,
  ]);
  G.tick(s, (now - last) / 1000);
  last = now;
  s.last = now;
  saveClock++;
  const after = JSON.stringify([
    s.jobs.map((j) => j.id),
    s.projects,
    s.stories,
    s.xp,
  ]);
  if (before !== after) render();
  else {
    renderActivity();
    document.querySelectorAll(".project-card").forEach((card) => {
      const b = card.querySelector('[data-action="pause"]');
      if (!b) return;
      const j = s.jobs.find((j) => j.id === Number(b.dataset.id));
      if (j) {
        card.querySelector("progress").value = j.done;
        card.querySelector(".progress-label b").textContent =
          Math.floor((j.done / j.total) * 100) + "%";
      }
    });
  }
  if (saveClock % 5 === 0) persist();
}, 500);
window.addEventListener("pagehide", persist);
render();
if (saveError) notify(saveError);
