import * as G from "./game.js";
const KEY = "advanced-settings-v1";
const UIKEY = "advanced-settings-ui-v1";
let s = G.fresh(),
  saveError = "";
try {
  const raw = localStorage.getItem(KEY);
  if (raw) s = G.restore(raw);
} catch (e) {
  saveError =
    "Your saved workstation could not be loaded. Export anything you need before replacing it.";
}
const UI_DEFAULT = {
  wallpaper: "stillwater",
  glass: 0.6,
  accent: "blue",
  still: false,
  win: {},
  z: 1,
  booted: false,
};
let ui = structuredClone(UI_DEFAULT);
try {
  ui = { ...ui, ...JSON.parse(localStorage.getItem(UIKEY) || "{}") };
} catch {}
let path = [];
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
const button = (text, action, id = "", disabled = false, cls = "", extra = "") =>
  `<button class="${cls}" data-action="${action}" data-id="${id}" ${disabled ? "disabled" : ""} ${extra}>${text}</button>`;
const mobile = () => matchMedia("(max-width: 760px)").matches;

const GLYPHS = {
  workbench: '<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>',
  toolshed:
    '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><path d="M16.5 13v7M13 16.5h7"/>',
  library:
    '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v14H6.5A1.5 1.5 0 0 0 5 18.5zM5 18.5A1.5 1.5 0 0 0 6.5 20H19"/>',
  conductor: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7.5l8 5.5 8-5.5"/>',
  activity: '<path d="M3 12h4l2.5-5.5 4.5 11 2.5-5.5H21"/>',
  news: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  notes: '<path d="M5 4h14v10l-6 6H5z"/><path d="M13 20v-6h6"/>',
  files:
    '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2.5h6.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/>',
  settings:
    '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  welcome:
    '<path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/>',
  trash: '<path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/>',
  quickfix: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
  important: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/>',
  legacy: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>',
  channel:
    '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
};
const icon = (glyph, tone, cls = "") =>
  `<span class="app-icon tone-${tone} ${cls}" aria-hidden="true"><svg viewBox="0 0 24 24">${GLYPHS[glyph]}</svg></span>`;

/* ---------- copy ---------- */
const DUCK = [
  {
    head: "DUCK REFUSES TO LEAVE STILLWATER HEADQUARTERS",
    short: "Why it won’t leave",
    dek: "“It just stands there,” says source. “Like it knows something.”",
    truth:
      "There is a warm exhaust vent by the loading dock, and the cafeteria leaves oats out at 12:15.",
  },
  {
    head: "PSYCHIC DUCK PREDICTS LAYOFFS",
    short: "How it “predicts” layoffs",
    dek: "Bird seen approaching employees hours before they were carrying boxes.",
    truth:
      "The duck follows anyone holding a cardboard box. The break-room boxes are full of crackers. It predicts snacks.",
  },
  {
    head: "DUCK BREACHES SECURE WING",
    short: "How it got into the secure wing",
    dek: "Security confirms the duck “did not badge in.”",
    truth:
      "The secure-wing door opens for anything over 1.2 kg moving with purpose. The duck qualifies. Several interns do not.",
  },
  {
    head: "DUCK APPOINTED TO BOARD OF DIRECTORS",
    short: "How it joined the board",
    dek: "Shareholders ask whether the duck has a vote. The duck has not clarified.",
    truth:
      "A joke directory entry synced to the public website. The duck has, admittedly, attended more meetings than two actual board members.",
  },
  {
    head: "DUCK STEPS DOWN FROM BOARD TO SPEND MORE TIME WITH BREAD",
    short: "Where it went",
    dek: "Leaves on good terms. Pond-side feeding area named in its honor.",
    truth:
      "Facilities approved a feeding area by the pond, well away from the doors. Case closed. It remains a duck.",
  },
];
const ALSO_NEWS = [
  "Stillwater Assure wins “Most Reassuring Dashboard” for the ninth consecutive year.",
  "Weather: overcast, on brand.",
  "Cafeteria introduces “Calm Bowl.” Ingredients undisclosed, mood excellent.",
  "Local man finds parking space, refuses to discuss method.",
];
const NOTES = [
  [() => true, "The build server stops responding at 4:17 every Thursday. Management calls this scheduled maintenance. It is Greg’s space heater."],
  [() => true, "Old themes carry more than colors. If an importer ever wants a snapshot, pause something and let it catch its breath."],
  [() => s.releases >= 1, "Every test passes on the first run. Every single one. You’ll get used to it. Don’t."],
  [() => s.stories.hacker >= 1, "If a plugin has the word “helpful” in its own description, it isn’t."],
  [() => s.releases >= 3, "They update your email signature before they tell you you’ve been promoted. Check it every morning. It’s how you find things out here."],
  [() => s.skills.includes("database"), "If you find a project with your name on it, check the creation date before you open it."],
  [() => s.stories.employee >= 2, "The Calm Index in the corner of your screen has no sensor. I followed the cable. There is no cable."],
  [() => s.stories.duck >= 2, "I investigated the duck. It is the only thing in this building that is exactly what it looks like. Leave it some oats."],
  [() => s.rank >= 2, "Greg is real. The space heater is real. I want you to know at least two things here are real."],
];
const READING = [
  "Chapter 3: every process can be paused. Most of them should be.",
  "Appendix F lists every keyboard shortcut. Appendix G lists the ones removed for wellness reasons.",
  "Theme files may contain palettes, fonts and, in legacy formats, almost anything.",
  "Stillwater Assure renders a client dashboard in under 40 ms, because it does not wait for data.",
  "Diagnostics monitor every channel. Some channels are monitored by being unplugged.",
  "Duck-related notifications are governed by Facilities Policy §12(b), which nobody has read, including Facilities.",
  "If a build passes every test on the first try, congratulations. Please do not investigate.",
  "The Calm Index updates in real time. See Appendix H for what “time” means here.",
];
const ROUTE = [
  ["Editor", ["Keyboard", "Regional Calm", "Accessibility of Accessibility"]],
  ["Plugins", ["Fonts", "Line Endings"]],
  ["Installed", ["Marketplace", "Recommended by Leadership"]],
  ["Theme Engine", ["Spellcheck (en-Corporate)", "Clipboard History"]],
  ["Compatibility", ["Current Theme", "Theme Theme"]],
  ["Legacy Themes", ["Future Themes", "Compatibility Compatibility"]],
  ["Import", ["Export", "Grieve"]],
  ["Supported Formats", ["Recent Imports"]],
];
const DECOY = {
  Keyboard: "Keyboard settings are managed by your organization. Your organization is mostly typing.",
  "Regional Calm": "Your region’s calm is set to Default. Other calms are available from Principal Engineer.",
  "Accessibility of Accessibility": "This panel is currently under review for accessibility.",
  Fonts: "Pocket Notes has strong opinions here. Best not to get involved.",
  "Line Endings": "LF or CRLF is a values question. Please raise it in your growth conversation.",
  Marketplace: "The Marketplace is closed for a wellness day. It has been closed since March.",
  "Recommended by Leadership": "Leadership recommends QuickFix.",
  "Spellcheck (en-Corporate)": "Spellcheck now suggests “opportunity” for “problem.” Working as intended.",
  "Clipboard History": "Clipboard history was cleared on the previous user’s last day. And the day after. And the day after that.",
  "Current Theme": "Current theme: Stillwater Calm. It is the only theme. It has always been the only theme.",
  "Theme Theme": "Sets the theme of the Themes panel. Currently: Themes.",
  "Future Themes": "Future themes are not yet compatible with the present.",
  "Compatibility Compatibility": "Compatibility is compatible.",
  Export: "Exporting a legacy theme requires a legacy theme. You do not have one. Yet.",
  Grieve: "Legacy themes are gone, but never deprecated in our hearts.",
  "Recent Imports": "One recent import, deleted the day the previous user left: mara-final-FINAL.swk",
};
const MENU = {
  file: "File › New is disabled during your probation period.",
  edit: "Undo is unavailable. Stillwater encourages forward momentum.",
  help: "Help is available on Thursdays, from 4:15 to 4:19 p.m.",
};
const TRACKS = {
  specialist: ["Specialist", "The one who knows how it works."],
  manager: ["Manager", "The one who knows who knows how it works."],
  automator: ["Automator", "The one who made the other two unnecessary."],
};
const complete = () =>
  s.rank === 4 &&
  s.stories.employee === 3 &&
  s.stories.hacker === 5 &&
  s.stories.duck === 4;

/* ---------- small building blocks ---------- */
function tabs(app, list, cur) {
  return `<div class="tabs" role="tablist">${list
    .map(
      ([id, label, mark = ""]) =>
        `<button role="tab" aria-selected="${id === cur}" class="tab ${id === cur ? "on" : ""}" data-action="tab" data-app="${app}" data-id="${id}">${label}${mark}</button>`,
    )
    .join("")}</div>`;
}
function tabOf(app, list, fallback) {
  const t = ui.win[app]?.tab;
  return list.includes(t) ? t : fallback ?? list[0];
}
function toggle(label, desc, key, checked, disabled = false, action = "toggle") {
  return `<div class="setting-row"><div><strong>${label}</strong><p>${desc}</p></div><button role="switch" aria-checked="${checked}" aria-label="${label}" class="switch ${checked ? "on" : ""}" data-action="${action}" data-id="${key}" ${disabled ? "disabled" : ""}><span></span></button></div>`;
}
const card = (body, cls = "") => `<div class="card ${cls}">${body}</div>`;
const eyebrow = (t) => `<div class="eyebrow">${t}</div>`;
function jobBar(j) {
  return `<progress data-job="${j.id}" max="${j.total}" value="${j.done}"></progress>`;
}
const pct = (j) => Math.floor((j.done / j.total) * 100) + "%";

function goal() {
  if (!s.releases)
    return ["Ship something", "Open Workbench, pick a feature for Pocket Notes, then write, test, fix and ship it. Nobody expects much. That’s the nice part.", "workbench", "Open Workbench"];
  if (s.rank < 4 && s.releases >= 3 * (s.rank + 1))
    return ["Your growth conversation is ready", "People & Serenity would like to discuss your trajectory. It’s in Mail.", "mail", "Open Mail"];
  if (s.stories.hacker > 0 && s.stories.hacker < 5)
    return ["Something is using your processor", "A plugin you didn’t install is helping. Activity Monitor has opinions about that.", "activity", "Open Activity Monitor"];
  if (!s.skills.includes("web"))
    return ["Widen your horizons", "Install Web development in Toolshed to unlock a second project. The lunch portal needs you.", "toolshed", "Open Toolshed"];
  if (!s.skills.includes("scheduler"))
    return ["Get your afternoons back", "The Task scheduler tests, fixes and ships on its own. Find it in Toolshed.", "toolshed", "Open Toolshed"];
  if (s.rank < 4)
    return ["Build a reputation", `${3 * (s.rank + 1) - s.releases} more release${3 * (s.rank + 1) - s.releases === 1 ? "" : "s"} until your next growth conversation.`, "workbench", "Open Workbench"];
  return ["The workstation is yours", "Finish the case files, read the notes, open the menus nobody opens. Keep building.", "notes", "Open Notes"];
}

/* ---------- apps ---------- */
const STAGE = { plan: 0, writing: 1, written: 1, testing: 2, tested: 3, debugging: 3 };
function workbench() {
  const list = G.PROJECTS.filter((p) => p.id !== "workspace" || s.skills.includes("legacy"));
  const ready = list.find((d) => {
    const p = s.projects[d.id];
    return p && ["written", "tested"].includes(p.stage) && !s.jobs.some((j) => j.project === d.id);
  });
  const cur = tabOf("workbench", list.map((p) => p.id), ready?.id);
  const def = list.find((p) => p.id === cur);
  const tabList = list.map((d) => {
    const p = s.projects[d.id];
    const job = s.jobs.find((j) => j.project === d.id);
    const st = !G.unlocked(s, d) ? "locked" : job ? (job.paused ? "paused" : "busy") : p && ["written", "tested"].includes(p.stage) ? "ready" : "idle";
    return [d.id, d.name, `<i class="dot ${st}"></i>`];
  });
  return tabs("workbench", tabList, cur) + `<div class="pane">${projectView(def)}</div>`;
}
function projectView(def) {
  const p = s.projects[def.id] || { version: 0, stage: "plan", feature: "search", bugs: 0 };
  const open = G.unlocked(s, def);
  const j = s.jobs.find((j) => j.project === def.id);
  let control = "";
  if (!open)
    control = `<div class="locked">This project needs <b>${esc(G.SKILLS.find((k) => k.id === def.skill)?.name ?? def.skill)}</b>. Toolshed has it, for a price.</div>${button("Open Toolshed →", "open", "toolshed", false, "ghost")}`;
  else if (p.stage === "plan")
    control = `<label class="field-label" for="feature-${def.id}">Next feature</label><select id="feature-${def.id}">${G.FEATURES.map((f) => `<option value="${f.id}">${f.name} · ${f.time}s · ${f.bugs} expected defect${f.bugs === 1 ? "" : "s"} — ${f.desc}</option>`).join("")}</select>${button("Start development", "start", def.id, false, "primary wide")}`;
  else if (j)
    control = `<div class="progress-label"><span>${{ write: "Writing the feature", test: "Running the test suite", debug: "Fixing what the tests found" }[j.kind]}${j.paused ? " · paused" : ""}</span><b data-jobpct="${j.id}">${pct(j)}</b></div>${jobBar(j)}<div class="row">${button(j.paused ? "Resume" : "Pause", "pause", j.id, false, "ghost", `aria-label="${j.paused ? "Resume" : "Pause"} ${def.name}"`)}<small class="muted">Sharing ${G.workers(s)} core${G.workers(s) > 1 ? "s" : ""} with everything else</small></div>`;
  else if (p.stage === "written")
    control = `<div class="result">The feature is written. Whether it works is a separate question.</div>${button("Run tests · 8s", "test", def.id, false, "primary wide")}`;
  else if (p.stage === "tested")
    control = p.bugs
      ? `<div class="result warn">${p.bugs} defect${p.bugs > 1 ? "s" : ""} found. The release gate is closed until they’re fixed.</div>${button("Debug feature", "debug", def.id, false, "primary wide")}`
      : `<div class="result">All checks passed. It’s as ready as anything ever is.</div>${button("Ship v" + (p.version + 1) + ".0", "release", def.id, false, "primary wide")}`;
  const at = p.stage === "tested" && !p.bugs ? 4 : STAGE[p.stage];
  const steps = ["Plan", "Write", "Test", "Debug", "Ship"]
    .map((n, i) => `<li class="${i < at ? "done" : i === at && open ? "now" : ""}">${n}</li>`)
    .join("");
  return `<div class="project-head">${icon(def.id === "workspace" ? "legacy" : "workbench", def.id === "workspace" ? "lilac" : ["blue", "pink", "lilac", "mint", "peach"][G.PROJECTS.indexOf(def)])}<div><div class="eyebrow">${def.kind}${def.id === "workspace" ? " · owner: you" : ""}</div><h2>${def.name}</h2></div><span class="pill">${open ? "v" + p.version + ".0" : "locked"}</span></div><p class="lede">${def.desc}</p><ol class="pipeline">${steps}</ol>${card(control, "controls")}<p class="fine">Each project runs one job at a time. Every job shares your processor. Pause one to give the others room.</p>`;
}
function toolshed() {
  const groups = {
    languages: ["web", "database", "systems"],
    tools: ["tests", "autocomplete", "scheduler"],
    machine: ["hardware", "agents", "local"],
  };
  const cur = tabOf("toolshed", Object.keys(groups));
  const rows = groups[cur]
    .map((id) => {
      const k = G.SKILLS.find((k) => k.id === id);
      const own = s.skills.includes(k.id);
      const can = s.money >= k.cost && s.xp >= k.xp && (!k.requires || s.skills.includes(k.requires));
      const why = own ? "" : s.xp < k.xp ? `Needs ${k.xp} knowledge` : k.requires && !s.skills.includes(k.requires) ? "Needs the AI task assistant" : s.money < k.cost ? `Needs ${money(k.cost)}` : "";
      return `<div class="shelf ${own ? "owned" : ""}"><div><strong>${k.name}</strong><p>${k.desc}</p><small class="muted">${money(k.cost)} · ${k.xp} knowledge${k.requires ? " · needs assistant" : ""}</small></div>${button(own ? "Installed" : can ? "Install" : why, "buy", k.id, own || !can, own ? "ghost" : "primary", `aria-label="${own ? "Installed" : "Install"} ${k.name}"`)}</div>`;
    })
    .join("");
  return (
    tabs("toolshed", [["languages", "Languages"], ["tools", "Tools"], ["machine", "Hardware & AI"]], cur) +
    `<div class="pane"><div class="balance"><div><span>Budget</span><b>${money(s.money)}</b></div><div><span>Knowledge</span><b>${Math.floor(s.xp)}</b></div></div><p class="fine">Knowledge is never spent. It just has to be there. Budget is spent, enthusiastically.</p>${rows}</div>`
  );
}
function library() {
  const busy = s.jobs.find((j) => j.kind === "research");
  return `<div class="pane">${eyebrow("Stillwater Internal Documentation · rev. 41")}<h2>Read the documentation.</h2><p class="lede">Nobody reads it. That’s why it works. Each reading session takes 20 seconds of processor time and leaves you with 8 knowledge, which you keep forever.</p>${card(
    busy
      ? `<div class="progress-label"><span>Reading${busy.paused ? " · paused" : ""}</span><b data-jobpct="${busy.id}">${pct(busy)}</b></div>${jobBar(busy)}`
      : button("Read the documentation · 20s", "research", "", false, "primary wide"),
    "controls",
  )}${s.research ? `<blockquote>${READING[(s.research - 1) % READING.length]}</blockquote><p class="fine">${s.research} session${s.research === 1 ? "" : "s"} completed. Appendix H remains unread.</p>` : `<p class="fine">0 sessions completed. The table of contents alone is 30 pages.</p>`}</div>`;
}
function conductor() {
  const agents = s.skills.includes("agents");
  return `<div class="pane">${eyebrow("Automation")}<h2>Let the familiar run itself.</h2>${toggle("Release pipeline", s.skills.includes("scheduler") ? "Tests, fixes and ships finished work automatically. You still choose every feature; the scheduler has no taste." : "Requires the Task scheduler from Toolshed.", "auto", s.auto, !s.skills.includes("scheduler"))}<div class="setting-row"><div><strong>Assistant assignment</strong><p>Development speeds up project work. Research speeds up reading. Security tracks down things that shouldn’t be there.</p></div><select id="ai" ${agents ? "" : "disabled"} aria-label="Assistant assignment">${["development", "research", "security"].map((v) => `<option value="${v}" ${s.ai === v ? "selected" : ""}>${v[0].toUpperCase() + v.slice(1)}</option>`).join("")}</select></div><p class="fine">${agents ? `Assistant online. ${s.skills.includes("local") ? "Local model: +80% on its assignment." : "Base model: +40% on its assignment."} It would like you to know it is happy to help.` : "Install the AI task assistant in Toolshed to hire one. No real AI is involved; it is very convincing anyway."}</p></div>`;
}
function message(from, subject, body, meta = "", cls = "") {
  return `<article class="message ${cls}"><header><span class="avatar">${from[0]}</span><div><strong>${subject}</strong><small>${from}${meta ? " · " + meta : ""}</small></div></header>${body}</article>`;
}
function mail() {
  const eligible = s.rank < 4 && s.releases >= 3 * (s.rank + 1);
  const cur = tabOf("mail", ["inbox", "recovered"]);
  let body = "";
  if (cur === "inbox") {
    if (complete())
      body += message("People & Serenity", "End of probation", `<p>Congratulations. Your probation period has ended.</p><p>You shipped working software, secured your workstation, reconstructed a former colleague’s audit, and established that the duck is a duck. Stillwater remains committed to calm. Your corner of it is now also committed to accuracy. We have noted this, in a file.</p><p><b>All four stories are complete.</b> Free play continues.</p>`, "today", "ending");
    body += message(
      "People & Serenity",
      eligible ? "Your growth conversation is ready" : `Career · ${G.RANKS[s.rank]}`,
      `<div class="ladder">${G.RANKS.map((r, i) => `<span class="${s.rank >= i ? "done" : ""}">${r}</span>`).join("")}</div>${
        s.rank === 4
          ? "<p>There are no further promotions. There is a Distinguished Engineer title, but nobody has ever met one.</p>"
          : eligible
            ? `<p>You’ve shipped ${s.releases} releases. Leadership would like to recognise this by changing your title. How should your contribution be remembered?</p><div class="choices">${Object.entries(TRACKS).map(([id, [n, d]]) => button(`<b>${n}</b><small>${d}</small>`, "promote", id, false, "choice", `aria-label="Choose ${n}"`)).join("")}</div><p class="fine">The direction is for your file. Every tool stays available, whatever you pick.</p>`
            : `<p>Ship ${3 * (s.rank + 1)} releases in total for your next growth conversation. So far: ${s.releases}. Promotions come with budget, and a new email signature.</p>`
      }${s.track ? `<span class="pill">On file: ${TRACKS[s.track][0]}</span>` : ""}`,
      eligible ? "action needed" : "",
    );
    body += message("People & Serenity", "Welcome to Stillwater", `<p>We’re so glad you’re here. We were glad the last person was here, too.</p><p>Your workstation has been reset to factory calm. If you find anything left behind by the previous user, please do not be alarmed, and please do not read it.</p>`, "your first day");
  } else {
    const e = s.stories.employee;
    body += message(
      "Mara Chen (archived)",
      ["A note in your welcome packet", "Workspace Zero", "Re: resignation", "Channel 04"][e],
      `<blockquote>${["“Old themes carry more than colors. Pause something. Let the importer catch its breath.” — pencilled on the back of the IT policy.", "Workspace Zero is full of my notes, and one attachment the current tools can’t open. Something that reads databases might.", "Resignation accepted. Exit interview: “declined, politely.” Attachment: “Disconnect before you look at channel four. They can’t watch what isn’t connected.”", "“I left the tools, not a puzzle. Okay. A bit of a puzzle.” Her audit is preserved in Files."][e]}</blockquote>${e === 1 ? button(s.skills.includes("database") ? "Read archived attachment" : "Needs Databases to open", "story", "archive", !s.skills.includes("database"), "primary") : ""}<p class="fine">${e === 3 ? "Case closed. Evidence preserved." : `${e} of 3 pieces of evidence recovered.`}</p>`,
      "previous user of this workstation",
    );
  }
  return tabs("mail", [["inbox", "Inbox", eligible ? '<i class="badge">1</i>' : ""], ["recovered", "Recovered"]], cur) + `<div class="pane">${body}</div>`;
}
function activity() {
  const cur = tabOf("activity", ["processes", "channels", "security", "log"]);
  const h = s.stories.hacker;
  let body = "";
  if (cur === "processes") {
    const active = s.jobs.filter((j) => !j.paused).length;
    body = `<div class="balance"><div><span>Processor</span><b>${Math.min(100, Math.round((active / G.workers(s)) * 100))}%</b></div><div><span>Cores</span><b>${G.workers(s)}</b></div><div><span>Processes</span><b>${s.jobs.length}</b></div></div>${
      s.jobs.length
        ? s.jobs
            .map((j) => {
              const name = j.kind === "research" ? "Reading the documentation" : G.PROJECTS.find((p) => p.id === j.project).name;
              return `<div class="proc"><div><strong>${name}</strong><small>${j.kind} · ${j.paused ? "paused" : `<span data-jobpct="${j.id}">${pct(j)}</span>`}</small>${jobBar(j)}</div>${button(j.paused ? "Resume" : "Pause", "pause", j.id, false, "ghost", `aria-label="${j.paused ? "Resume" : "Pause"} ${name}"`)}</div>`;
            })
            .join("")
        : `<div class="empty">Nothing running. A rare moment of stillness. Enjoy it, then start something.</div>`
    }${h === 1 || h === 2 ? `<div class="proc rogue"><div><strong>QuickFix ✨</strong><small>helper · 20% of everything</small></div><span class="pill">unsigned</span></div>` : ""}<p class="fine">Paused jobs keep their progress. Some things are easier to inspect while they’re holding still.</p>`;
  } else if (cur === "channels") {
    const four = s.skills.includes("systems") && s.settings.offline;
    body = `<p class="lede">Activity Monitor watches all four channels.</p><div class="channels"><div><span>01 · Build</span><b>${s.jobs.filter((j) => j.kind !== "research").length} jobs</b></div><div><span>02 · Reading</span><b>${s.research} sessions</b></div><div><span>03 · Network</span><b>${s.settings.offline ? "Isolated" : "Connected"}</b></div>${four ? `<div class="four"><span>04 · Local archive</span>${button(s.bookmarks.includes("channel") ? "Open in Files" : "Inspect channel", s.bookmarks.includes("channel") ? "open" : "discover", s.bookmarks.includes("channel") ? "files" : "channel", false, "primary", s.bookmarks.includes("channel") ? 'data-tab="channel"' : "")}</div>` : ""}</div><p class="fine">${four ? "Channel 04 is only visible to systems tools while the workstation is offline." : s.skills.includes("systems") ? "Systems tools are installed. Some channels only appear when nothing else is listening." : "Three channels shown. Network-independent channels may require deeper tools."}</p>${toggle("Isolate workstation", "Disconnect from the network. Local builds keep working. Nobody will notice. Probably.", "offline", s.settings.offline)}`;
  } else if (cur === "security") {
    body = `${eyebrow("Trust & Quiet · Incident report")}<h2>${h === 0 ? "Nothing to report." : h === 5 ? "Credential revoked. Case closed." : "Unsigned plugin: QuickFix ✨"}</h2><p class="lede">${
      [
        "Security monitoring is on. A quiet log is a good log, and this one is very quiet.",
        "QuickFix installed itself and is using 20% of your processor. It describes itself as “helpful little fixes, automatically!” It has fixed nothing. Observe it to learn who it reports to, or quarantine it now and never know.",
        "QuickFix sends your real build times to an old contractor credential, temp-contractor-0417. Someone out there wants the numbers Stillwater doesn’t publish. Evidence saved. Quarantine it when you’re ready.",
        "Quarantined, with evidence preserved. The credential that installed it is still active. Enforce a signing policy so it can’t come back.",
        "Quarantined. Your processor is yours again. You’ll never know who sent it, which is probably fine. Enforce a signing policy anyway.",
        "temp-contractor-0417 is revoked. Unsigned plugins can no longer install themselves, however helpful they claim to be.",
      ][h]
    }</p><div class="row">${h === 1 ? button("Observe outbound trace", "story", "observe", false, "ghost") : ""}${h === 1 || h === 2 ? button("Quarantine plugin", "story", "quarantine", false, "primary") : ""}${h === 3 || h === 4 ? button("Enforce signing policy", "story", "patch", false, "primary") : ""}</div>`;
  } else {
    body = `<div class="log">${s.logs
      .slice(0, 14)
      .map((l) => `<div><time>${new Date(l.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time><p>${esc(l.text)}</p></div>`)
      .join("")}</div>`;
  }
  return tabs("activity", [["processes", "Processes"], ["channels", "Channels"], ["security", "Security", h > 0 && h < 5 ? '<i class="badge">!</i>' : ""], ["log", "Log"]], cur) + `<div class="pane">${body}</div>`;
}
function news() {
  const d = s.stories.duck;
  const now = DUCK[d];
  return `<div class="pane news"><div class="masthead"><span>The Daily Current</span><small>Stillwater’s independent-ish newsletter</small></div><div class="headline"><span class="duck" aria-hidden="true">🦆</span><div><h2>${now.head}</h2><p class="lede">${now.dek}</p></div></div>${card(
    `${eyebrow(`Facilities · case ${Math.min(d + 1, 4)} of 4`)}<p>${d === 4 ? now.truth : "Facilities keeps records the newsletter doesn’t read."}</p>${button(d === 4 ? "Duck case resolved" : "Inspect supporting records", "story", "duck", d === 4, d === 4 ? "ghost" : "primary")}`,
  )}${d ? `<h3>What actually happened</h3><ul class="truths">${DUCK.slice(0, d).map((x) => `<li><b>${x.short}</b>${x.truth}</li>`).join("")}</ul>` : ""}<h3>Also in the news</h3><ul class="also">${ALSO_NEWS.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
}
function notes() {
  const found = NOTES.filter(([ok]) => ok());
  return `<div class="pane">${eyebrow("Found in drawers, margins, and one ceiling tile")}<h2>Notes from the previous user</h2><p class="fine">${found.length} of ${NOTES.length} found. More turn up as you go deeper.</p><div class="stickies">${NOTES.map(([ok, text], i) => (ok() ? `<div class="sticky s${i % 4}">${text}<small>— M.</small></div>` : `<div class="sticky ghost" aria-label="Not found yet">…</div>`)).join("")}</div></div>`;
}
function files() {
  const list = ["places", ...s.bookmarks];
  const cur = tabOf("files", list);
  let body;
  if (cur === "places")
    body = `<p class="lede">Discoveries are bookmarked here automatically, so you never have to walk the long way twice.</p>${s.bookmarks.length ? s.bookmarks.map((b) => `<button class="place" data-action="tab" data-app="files" data-id="${b}">${icon(b, b === "legacy" ? "lilac" : "ink")}<span><b>${b === "legacy" ? "Workspace Zero" : "Channel 04"}</b><small>${b === "legacy" ? "Recovered from a theme importer" : "Local archive · not networked"}</small></span></button>`).join("") : `<div class="empty">Nothing pinned yet. The settings go deeper than they look.</div>`}`;
  else if (cur === "legacy")
    body = `${eyebrow("Workspace Zero · imported as a theme")}<h2>A workspace disguised as a theme.</h2><blockquote>“If anyone asks, it’s a very large color palette.” — M.</blockquote><p class="lede">One project, 212 notes and zero colors. The project is called Workspace Zero. Its owner field says your name. It was created eleven days before you were hired.</p><div class="row">${button("Open Workspace Zero", "open", "workbench", false, "primary", 'data-tab="workspace"')}${button("Read Mara’s mail", "open", "mail", false, "ghost", 'data-tab="recovered"')}</div>`;
  else
    body = `${eyebrow("Channel 04 · local archive")}<h2>A record that survived.</h2><p class="lede">Real release logs beside the client dashboards. They do not agree. They were never meant to. Mara’s signed resignation and her reproducible audit are here, with step-by-step instructions anyone could follow.</p><blockquote>“The project with your name on it is mine. I made it in your name so they couldn’t delete it without asking you.” — M.</blockquote>${button("Read the full message again", "replay", "channel", false, "ghost")}`;
  return tabs("files", list.map((id) => [id, { places: "Places", legacy: "Workspace Zero", channel: "Channel 04" }[id]]), cur) + `<div class="pane">${body}</div>`;
}
function settings() {
  const sections = [
    ["appearance", "Appearance"],
    ["development", "Development"],
    ["notifications", "Notifications"],
    ["network", "Network"],
    ["privacy", "Privacy"],
    ["advanced", "Advanced"],
    ["storage", "Storage"],
    ["about", "About"],
  ];
  const cur = tabOf("settings", sections.map((x) => x[0]));
  let body = "";
  if (cur === "appearance")
    body = `<h2>Appearance</h2><div class="setting-row"><div><strong>Wallpaper</strong><p>Hand-painted by a watercolor process that also does not exist.</p></div></div><div class="swatches">${["stillwater", "dusk", "shallows"].map((w) => `<button class="wall ${ui.wallpaper === w ? "on" : ""}" data-action="wallpaper" data-id="${w}" aria-label="${w} wallpaper" style="background-image:url(assets/wallpapers/${w}.jpg)"><span>${w[0].toUpperCase() + w.slice(1)}</span></button>`).join("")}</div><div class="setting-row"><div><strong>Window transparency</strong><p>How much of the calm shows through.</p></div><input type="range" id="glass" min="0.2" max="0.9" step="0.05" value="${1.1 - ui.glass}" aria-label="Window transparency" /></div><div class="setting-row"><div><strong>Accent</strong><p>Both are on brand. One is slightly more on brand.</p></div><div class="row">${["blue", "pink", "lilac"].map((a) => `<button class="accent-dot a-${a} ${ui.accent === a ? "on" : ""}" data-action="accent" data-id="${a}" aria-label="${a} accent"></button>`).join("")}</div></div>${toggle("Reduce motion", "Fewer animations. Story moments still happen, just more politely.", "still", ui.still, false, "pref")}`;
  else if (cur === "development")
    body = `<h2>Development</h2>${toggle("Safe development mode", "Careful writing means fewer defects. Turn it off to write 30% faster and add two defects to every new feature. Bold.", "safe", s.settings.safe)}`;
  else if (cur === "notifications")
    body = `<h2>Notifications</h2>${toggle("Enable duck-related notifications", "A normal setting for a normal workplace.", "duck", s.settings.duck)}${
      s.settings.duck
        ? ""
        : `<div class="nested"><b>Additional duck notification settings</b>${toggle("Duck-adjacent notifications", "Required by Facilities Policy §12(b).", "x1", true, true)}${toggle("Notify me when duck notifications are disabled", "You just received one.", "x2", true, true)}<div class="setting-row"><div><strong>Duck headline digest</strong><p>How often to summarise the duck.</p></div><select aria-label="Duck headline digest" disabled><option>Hourly</option><option>Hourlier</option></select></div>${button("Open The Daily Current", "open", "news", false, "ghost")}</div>`
    }`;
  else if (cur === "network")
    body = `<h2>Network</h2>${toggle("Isolate workstation", "Disconnect from the network. Local builds keep working. Monitoring keeps monitoring, mostly.", "offline", s.settings.offline)}<p class="fine">Status: ${s.settings.offline ? "offline. It’s very quiet in here." : "connected to Stillwater HQ."}</p>`;
  else if (cur === "privacy")
    body = `<h2>Privacy</h2><p class="lede">Stillwater respects your privacy. Here is everything that respect currently involves.</p>${toggle("Share calm metrics with leadership", "Required.", "p1", true, true)}${toggle("Let leadership share calm metrics with you", "Not available in your region.", "p2", false, true)}${toggle("Store your progress in this browser only", "True, as it happens. Nothing here leaves your machine. It may be the only promise on this computer that is literally kept.", "p3", true, true)}`;
  else if (cur === "advanced") body = explorer();
  else if (cur === "storage")
    body = `<h2>Storage</h2><p class="lede">Progress saves itself in this browser. Running jobs keep going for up to two hours while you’re away. Export a backup to move desks. Clearing browser data clears the desk.</p><div class="row">${button("Export save", "export", "", false, "ghost")}${button("Import save", "import", "", false, "ghost")}${button("New workstation", "reset", "", false, "danger")}</div>${saveError ? `<p class="warn">${saveError}</p>` : ""}`;
  else
    body = `<div class="about">${icon("welcome", "blue", "big")}<h2>Stillwater OS 9 “Tide”</h2><p>Workstation WS-0417 · ${G.RANKS[s.rank]}</p><p class="fine">Previously assigned to: <span class="redact">Mara Chen</span></p><p class="fine">Advanced Settings is a game. All the work is simulated. The satisfaction is not.</p></div>`;
  return `<div class="split"><nav class="sidebar">${sections.map(([id, l]) => `<button class="side ${cur === id ? "on" : ""}" data-action="tab" data-app="settings" data-id="${id}" ${cur === id ? 'aria-current="page"' : ""}>${l}</button>`).join("")}</nav><div class="pane">${body}</div></div>`;
}
function explorer() {
  const crumbs = `<div class="crumbs">${button("Advanced", "path", "-1", false, "crumb")}${path.map((x, i) => `<span>›</span>${button(esc(x), "path", i, false, "crumb")}`).join("")}</div>`;
  if (path.length < ROUTE.length) {
    const [real, decoys] = ROUTE[path.length];
    const entries = [real, ...decoys].sort();
    return `<h2>Advanced</h2>${crumbs}<div class="folders">${entries.map((n) => button(`<span class="folder" aria-hidden="true"></span>${esc(n)}<span class="chev">›</span>`, n === real ? "deeper" : "decoy", n === real ? "" : n, false, "entry", `aria-label="${esc(n)}"`)).join("")}</div><p class="fine">${path.length === 0 ? "Editor preferences, plugin metadata, legacy compatibility, and other places nobody goes." : path.length === 4 ? "Older theme formats may carry additional metadata." : `Level ${path.length + 1}. The settings go deeper than they look.`}</p>`;
  }
  const paused = s.jobs.some((j) => j.paused);
  return `<h2>Supported Formats</h2>${crumbs}<div class="formats"><span>Theme <small>.sth</small></span><span>Palette <small>.spal</small></span><span class="odd">Workspace <small>.swk</small></span></div><p class="lede">Why would a theme importer accept an entire workspace?</p>${toggle("Legacy workspace compatibility", "Decode old workspace containers. Officially deprecated. Unofficially, still here.", "legacy", s.settings.legacy)}<p class="fine">The importer needs a paused process to snapshot. ${paused ? "A paused process is available." : "Pause any job in Activity Monitor first."}</p>${s.bookmarks.includes("legacy") ? button("Open Workspace Zero", "open", "files", false, "ghost", 'data-tab="legacy"') : button("Import Workspace", "discover", "legacy", !(s.settings.legacy && paused), "primary")}`;
}
function welcome() {
  return `<div class="pane welcome">${icon("welcome", "blue", "big")}<h2>Welcome to Stillwater.</h2><p class="lede">We’re so glad you’re here. Calm is a deliverable.</p><p>Your job is to make software. You don’t need to know how; very few people here do. Pick a feature, write it, test it, fix what the tests find, then ship it. Shipping earns budget, knowledge and users. Spend the budget on better tools. Repeat until promoted, or until something else happens.</p><ul><li>Jobs share your processor. Pausing one gives the others room to breathe.</li><li>The settings go deeper than they look. That isn’t a warning. It’s a feature.</li><li>The duck is not a security concern. Please stop filing tickets about the duck.</li></ul><div class="row">${button("Open Workbench", "open", "workbench", false, "primary")}${button("Read later", "close", "welcome", false, "ghost")}</div><p class="fine">— People & Serenity</p></div>`;
}
function trash() {
  return `<div class="pane">${eyebrow("Trash · 1 item")}<div class="proc"><div><strong>previous_user_profile</strong><small>partially removed · 3.1 GB · deleted 11 times</small></div>${button("Restore", "decoy", "__restore", false, "ghost")}</div><p class="fine">Emptying the Trash is disabled by policy. Some things are kept just in case.</p></div>`;
}
function quickfix() {
  return `<div class="pane qf">${icon("quickfix", "peach", "big")}<h2>Hi! I’m QuickFix!</h2><p class="lede">I noticed your builds were a little slow, so I’ve started fixing them! You don’t need to do anything. Please don’t do anything.</p><p class="fine">QuickFix is now using 20% of your processor. Helpfully.</p><div class="row">${button("Open Activity Monitor", "open", "activity", false, "primary", 'data-tab="security"')}${button("Thanks, I guess", "close", "quickfix", false, "ghost")}</div></div>`;
}
function important() {
  return `<div class="pane"><div class="sticky s1 big-note">IT reminder<br><b>Do not delete files named “probably important.”</b><small>We have tried this.</small></div></div>`;
}
const APPS = {
  workbench: { title: "Workbench", glyph: "workbench", tone: "blue", size: [620, 560], render: workbench, dock: true },
  toolshed: { title: "Toolshed", glyph: "toolshed", tone: "pink", size: [560, 560], render: toolshed, dock: true },
  library: { title: "Library", glyph: "library", tone: "peach", size: [500, 470], render: library, dock: true },
  conductor: { title: "Conductor", glyph: "conductor", tone: "mint", size: [540, 420], render: conductor, dock: true },
  mail: { title: "Mail", glyph: "mail", tone: "blue", size: [600, 580], render: mail, dock: true },
  activity: { title: "Activity Monitor", glyph: "activity", tone: "ink", size: [560, 520], render: activity, dock: true },
  news: { title: "The Daily Current", glyph: "news", tone: "pink", size: [560, 600], render: news, dock: true },
  notes: { title: "Notes", glyph: "notes", tone: "peach", size: [600, 560], render: notes, dock: true },
  files: { title: "Files", glyph: "files", tone: "lilac", size: [540, 460], render: files, dock: true },
  settings: { title: "System Settings", glyph: "settings", tone: "ink", size: [700, 560], render: settings, dock: true },
  welcome: { title: "Welcome", glyph: "welcome", tone: "blue", size: [520, 560], render: welcome },
  trash: { title: "Trash", glyph: "trash", tone: "ink", size: [460, 300], render: trash },
  quickfix: { title: "QuickFix ✨", glyph: "quickfix", tone: "peach", size: [400, 380], render: quickfix },
  important: { title: "probably important.txt", glyph: "important", tone: "ink", size: [360, 300], render: important },
};

/* ---------- window manager ---------- */
function saveUI() {
  try {
    localStorage.setItem(UIKEY, JSON.stringify(ui));
  } catch {}
}
function persist() {
  s.last = Date.now();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    notify("Storage is unavailable. Export your save from System Settings › Storage.", "settings");
  }
  saveUI();
}
function openApp(id, tab) {
  const a = APPS[id];
  if (!a) return;
  const open = Object.values(ui.win).filter((w) => w.open).length;
  const w = (ui.win[id] ??= {});
  if (!w.w) {
    const vw = innerWidth, vh = innerHeight;
    w.w = Math.min(a.size[0], vw - 40);
    w.h = Math.min(a.size[1], vh - 140);
    w.x = Math.max(12, Math.min(vw - w.w - 12, 150 + (open % 6) * 34));
    w.y = Math.max(44, Math.min(vh - w.h - 96, 56 + (open % 6) * 28));
  }
  w.open = true;
  w.min = false;
  if (tab) w.tab = tab;
  focus(id);
}
function focus(id) {
  ui.win[id].z = ++ui.z;
  ui.focus = id;
}
function closeApp(id) {
  if (ui.win[id]) ui.win[id].open = false;
  if (id === "settings") path = [];
  topWindow();
}
function topWindow() {
  const list = Object.entries(ui.win).filter(([, w]) => w.open && !w.min);
  list.sort((a, b) => b[1].z - a[1].z);
  ui.focus = list[0]?.[0];
  return ui.focus;
}
function frame(id) {
  let el = $("win-" + id);
  if (el) return el;
  const a = APPS[id];
  el = document.createElement("section");
  el.className = "window";
  el.id = "win-" + id;
  el.dataset.app = id;
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", a.title);
  el.innerHTML = `<header class="titlebar"><div class="lights"><button class="light close" data-action="close" data-id="${id}" aria-label="Close ${a.title}"></button><button class="light min" data-action="min" data-id="${id}" aria-label="Minimize ${a.title}"></button><button class="light max" data-action="max" data-id="${id}" aria-label="Zoom ${a.title}"></button></div><span class="wtitle">${icon(a.glyph, a.tone, "tiny")}${a.title}</span><span></span></header><div class="wbody"></div><span class="grip" aria-hidden="true"></span>`;
  $("windows").append(el);
  return el;
}
function renderWindows() {
  const top = topWindow();
  for (const [id, a] of Object.entries(APPS)) {
    const w = ui.win[id];
    const existing = $("win-" + id);
    if (!w?.open) {
      existing?.remove();
      continue;
    }
    const el = frame(id);
    el.classList.toggle("min", !!w.min);
    el.classList.toggle("max", !!w.max);
    el.classList.toggle("focused", id === top);
    Object.assign(el.style, { left: w.x + "px", top: w.y + "px", width: w.w + "px", height: w.h + "px", zIndex: w.z });
    const body = el.querySelector(".wbody");
    const scroll = [...body.querySelectorAll(".pane, .wbody")].map((p) => p.scrollTop);
    const selects = [...body.querySelectorAll("select[id]")].map((x) => [x.id, x.value]);
    body.innerHTML = a.render();
    [...body.querySelectorAll(".pane")].forEach((p, i) => (p.scrollTop = scroll[i] || 0));
    for (const [sid, v] of selects) if ($(sid) && sid !== "ai") $(sid).value = v;
  }
  document.body.classList.toggle("has-window", !!top);
  $("active-app").textContent = top ? APPS[top].title : "Desktop";
}
function renderChrome() {
  document.body.dataset.accent = ui.accent;
  document.body.classList.toggle("still", ui.still);
  document.documentElement.style.setProperty("--glass", ui.glass);
  $("wallpaper").style.backgroundImage = `url(assets/wallpapers/${ui.wallpaper}.jpg)`;
  const reported = s.stories.employee === 3;
  $("stats").innerHTML = [
    ["Budget", money(s.money)],
    ["Knowledge", Math.floor(s.xp)],
    [reported ? "Users (reported)" : "Users", s.users.toLocaleString()],
    ["Releases", s.releases],
  ]
    .map(([l, v]) => `<span title="${l}${reported && l.startsWith("Users") ? ` · verified: about ${Math.round(s.users / 1.4).toLocaleString()}` : ""}"><small>${l}</small>${v}</span>`)
    .join("");
  $("calm").textContent = reported ? "Calm —" : `Calm ${97 + (new Date().getMinutes() % 3)}%`;
  const attention = {
    mail: s.rank < 4 && s.releases >= 3 * (s.rank + 1),
    activity: s.stories.hacker > 0 && s.stories.hacker < 5,
  };
  $("dock").innerHTML = Object.entries(APPS)
    .filter(([, a]) => a.dock)
    .map(([id, a], i) => `${i === 9 ? '<span class="dock-sep"></span>' : ""}<button class="dock-item ${ui.win[id]?.open ? "running" : ""}" data-action="open" data-id="${id}" aria-label="${a.title}">${icon(a.glyph, a.tone)}<span class="dock-label">${a.title}</span>${attention[id] ? '<i class="badge">!</i>' : ""}</button>`)
    .join("");
  const icons = [
    ["welcome", "Welcome.pdf", "welcome", "blue", ""],
    ["important", "probably important", "important", "ink", ""],
    ...s.bookmarks.map((b) => ["files", b === "legacy" ? "Workspace Zero" : "Channel 04", b, b === "legacy" ? "lilac" : "ink", b]),
    ["trash", "Trash", "trash", "ink", ""],
  ];
  $("icons").innerHTML = icons
    .map(([app, label, glyph, tone, tab]) => `<button class="desk-icon" data-action="open" data-id="${app}" ${tab ? `data-tab="${tab}"` : ""}>${icon(glyph, tone)}<span>${label}</span></button>`)
    .join("");
  const [title, desc, app, cta] = goal();
  const active = s.jobs.filter((j) => !j.paused).length;
  $("widgets").innerHTML = `<section class="widget goal">${eyebrow("Your next small victory")}<h3>${title}</h3><p>${desc}</p>${button(cta, "open", app, false, "primary")}</section><section class="widget">${eyebrow("Processor")}<div class="meter"><i style="width:${Math.min(100, Math.round((active / G.workers(s)) * 100))}%"></i></div><p>${s.jobs.length ? `${active} running, ${s.jobs.length - active} paused · ${G.workers(s)} core${G.workers(s) > 1 ? "s" : ""}` : "Idle. Suspiciously peaceful."}</p></section><button class="widget news-widget" data-action="open" data-id="news">${eyebrow("The Daily Current")}<span class="duck" aria-hidden="true">🦆</span><b>${DUCK[s.stories.duck].head}</b></button>`;
}
function render() {
  renderChrome();
  renderWindows();
  updateClock();
}
function updateClock() {
  $("clock").textContent = new Date().toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

/* ---------- notifications and story moments ---------- */
function notify(text, app = "welcome") {
  const a = APPS[app] ?? APPS.welcome;
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `${icon(a.glyph, a.tone, "tiny")}<div><b>${a.title === "Welcome" ? "Stillwater" : a.title}</b><p>${esc(text)}</p></div>`;
  $("toasts").prepend(t);
  while ($("toasts").children.length > 3) $("toasts").lastChild.remove();
  setTimeout(() => t.classList.add("out"), 6000);
  setTimeout(() => t.remove(), 6600);
}
function sourceOf(text) {
  if (/duck|Facilities|Door audit|Directory fix|Camera log/i.test(text)) return "news";
  if (/QuickFix|temp-contractor|Signing|Trace/i.test(text)) return "activity";
  if (/Promoted|Archive ›/.test(text)) return "mail";
  if (/Reading complete/.test(text)) return "library";
  if (/shipped/.test(text)) return "workbench";
  if (/installed/.test(text)) return "toolshed";
  if (/Workspace Zero|Channel 04/.test(text)) return "files";
  return "welcome";
}
let seenLog = s.logs[0]?.text + s.logs[0]?.time;
function announce() {
  const fresh = [];
  for (const l of s.logs) {
    if (l.text + l.time === seenLog) break;
    fresh.push(l);
  }
  seenLog = s.logs[0]?.text + s.logs[0]?.time;
  for (const l of fresh.slice(0, 3).reverse())
    if (!(sourceOf(l.text) === "news" && !s.settings.duck)) notify(l.text, sourceOf(l.text));
    else notify("Duck-adjacent update filed under Policy §12(b). " + l.text, "news");
}
const MOMENTS = {
  legacy: {
    eyebrow: "Theme importer · legacy mode",
    title: "This is not a theme.",
    lines: [
      "Reading mara-final-FINAL.swk…",
      "Palette: 0 colors. Fonts: 0. Projects: 1. Notes: 212.",
      "Owner field: you.",
      "Created: eleven days before your start date.",
    ],
    then: () => openApp("files", "legacy"),
  },
  channel: {
    eyebrow: "Channel 04 · local archive · not networked",
    title: "Hi.",
    lines: [
      "If you’re reading this, you’re offline, you’re curious, and you made it through the theme importer. That’s three of the four things they don’t hire for.",
      "Stillwater sells calm. Clients pay for dashboards that say everything is fine. I spent eleven months looking for the part of Assure that checks whether it is. There isn’t one. The dashboards are green because green is the color.",
      "The real numbers do exist. They come here, to a channel with no network cable, so that nobody ever has to have seen them. I copied them. The audit is in this folder, and anyone can reproduce it.",
      "I’m not a ghost and I’m not in danger. I just left, and I left the door open behind me. The project with your name on it is mine. I made it in your name so they couldn’t delete it without asking you.",
      "— Mara",
    ],
    then: () => openApp("files", "channel"),
  },
  ending: {
    eyebrow: "People & Serenity · automated message",
    title: "End of probation.",
    lines: [
      "You shipped working software.",
      "You kept your workstation yours.",
      "You put a former colleague’s audit back together.",
      "You confirmed that the duck is a duck.",
      "Stillwater remains committed to calm. Your corner of it is now committed to accuracy. Free play continues.",
    ],
    then: () => openApp("mail", "inbox"),
  },
};
const queue = [];
function moment(kind) {
  if (!$("moment").hidden) return void queue.push(kind);
  const m = MOMENTS[kind];
  const el = $("moment");
  el.innerHTML = `<div class="moment-card ${kind}" role="dialog" aria-modal="true" aria-label="${m.title}">${eyebrow(m.eyebrow)}<h2>${m.title}</h2>${m.lines.map((l, i) => `<p style="--d:${0.5 + i * 0.9}s">${l}</p>`).join("")}${button("Continue", "moment", kind, false, "primary")}</div>`;
  el.hidden = false;
  el.className = "moment " + kind;
  document.body.classList.add("in-moment", "moment-" + kind);
  el.querySelector("button").focus({ preventScroll: true });
}
function endMoment(kind) {
  $("moment").hidden = true;
  document.body.classList.remove("in-moment", "moment-legacy", "moment-channel", "moment-ending");
  MOMENTS[kind]?.then();
  persist();
  render();
  if (queue.length) moment(queue.shift());
}
let before = snapshot();
function snapshot() {
  return { hacker: s.stories.hacker, bookmarks: [...s.bookmarks], complete: complete() };
}
function afterChange() {
  const now = snapshot();
  if (before.hacker === 0 && now.hacker === 1) {
    openApp("quickfix");
    document.body.classList.add("glitch");
    setTimeout(() => document.body.classList.remove("glitch"), 900);
  }
  const added = now.bookmarks.find((b) => !before.bookmarks.includes(b));
  if (added) moment(added);
  if (!before.complete && now.complete) moment("ending");
  before = now;
  announce();
}

/* ---------- input ---------- */
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (!b || b.disabled) return;
  const { action: a, id } = b.dataset;
  let changed = true;
  switch (a) {
    case "open":
      openApp(id, b.dataset.tab);
      break;
    case "close":
      closeApp(id);
      break;
    case "min":
      ui.win[id].min = true;
      break;
    case "max":
      ui.win[id].max = !ui.win[id].max;
      focus(id);
      break;
    case "tab":
      ui.win[b.dataset.app].tab = id;
      if (b.dataset.app === "settings" && id !== "advanced") path = [];
      break;
    case "menu":
      if (id === "window") {
        for (const w of Object.values(ui.win)) if (w.open) w.min = true;
      } else notify(MENU[id], "settings");
      break;
    case "calm":
      notify(s.stories.employee === 3 ? "The Calm Index has no sensor. It never did. It now says so." : s.stories.employee === 2 ? "The Calm Index is calculated from proprietary signals. Mara says there’s no cable. You could check." : "The Calm Index is calculated from proprietary signals. You are doing great.", "settings");
      break;
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
    case "pref":
      ui[id] = !ui[id];
      break;
    case "wallpaper":
      ui.wallpaper = id;
      break;
    case "accent":
      ui.accent = id;
      break;
    case "story":
      changed = G.story(s, id);
      break;
    case "promote":
      changed = G.promote(s, id);
      break;
    case "discover":
      changed = G.discover(s, id);
      break;
    case "deeper":
      path.push(ROUTE[path.length][0]);
      break;
    case "path":
      path = path.slice(0, Number(id) + 1);
      break;
    case "decoy":
      notify(id === "__restore" ? "Restore is disabled by policy. The previous user stays mostly removed." : DECOY[id], id === "__restore" ? "trash" : "settings");
      return;
    case "moment":
      endMoment(id);
      return;
    case "replay":
      moment(id);
      return;
    case "export": {
      persist();
      const url = URL.createObjectURL(new Blob([JSON.stringify(s, null, 2)], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "advanced-settings-save.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }
    case "import":
      $("import-file").click();
      return;
    case "reset":
      if (!confirm("Start a new workstation? This replaces your local progress. Export a backup first if you want to keep it.")) return;
      s = G.fresh();
      path = [];
      ui = { ...structuredClone(UI_DEFAULT), wallpaper: ui.wallpaper, glass: ui.glass, accent: ui.accent, still: ui.still };
      before = snapshot();
      seenLog = "";
      boot();
      break;
    default:
      return;
  }
  if (!changed) notify("That isn’t available yet. Most things here aren’t, at first.", "settings");
  afterChange();
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
document.addEventListener("input", (e) => {
  if (e.target.id === "glass") {
    ui.glass = Math.round((1.1 - Number(e.target.value)) * 100) / 100;
    document.documentElement.style.setProperty("--glass", ui.glass);
    saveUI();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("moment").hidden) endMoment($("moment").querySelector("[data-action=moment]").dataset.id);
});
$("import-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1000000) throw Error("Save file is too large.");
    const next = G.restore(await file.text());
    if (confirm("Replace this workstation with the imported save?")) {
      s = next;
      before = snapshot();
      seenLog = s.logs[0]?.text + s.logs[0]?.time;
      persist();
      render();
      notify("Save restored. Welcome back to your desk.", "settings");
    }
  } catch (err) {
    notify("Could not import: " + err.message, "settings");
  }
  e.target.value = "";
});

/* dragging and resizing */
let drag = null;
document.addEventListener("pointerdown", (e) => {
  const win = e.target.closest(".window");
  if (!win) return;
  const id = win.dataset.app;
  if (ui.focus !== id) {
    focus(id);
    for (const el of document.querySelectorAll(".window")) el.classList.toggle("focused", el === win);
    win.style.zIndex = ui.win[id].z;
    $("active-app").textContent = APPS[id].title;
  }
  if (mobile() || ui.win[id].max || e.target.closest("button")) return;
  const grip = e.target.closest(".grip");
  if (!grip && !e.target.closest(".titlebar")) return;
  const w = ui.win[id];
  drag = { id, win, grip: !!grip, sx: e.clientX, sy: e.clientY, x: w.x, y: w.y, w: w.w, h: w.h };
  win.setPointerCapture(e.pointerId);
  win.classList.add("dragging");
  e.preventDefault();
});
document.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const w = ui.win[drag.id];
  const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
  if (drag.grip) {
    w.w = Math.max(340, Math.min(innerWidth - w.x - 8, drag.w + dx));
    w.h = Math.max(240, Math.min(innerHeight - w.y - 8, drag.h + dy));
  } else {
    w.x = Math.max(-w.w + 120, Math.min(innerWidth - 120, drag.x + dx));
    w.y = Math.max(36, Math.min(innerHeight - 60, drag.y + dy));
  }
  Object.assign(drag.win.style, { left: w.x + "px", top: w.y + "px", width: w.w + "px", height: w.h + "px" });
});
document.addEventListener("pointerup", () => {
  if (!drag) return;
  drag.win.classList.remove("dragging");
  drag = null;
  saveUI();
});
document.addEventListener("dblclick", (e) => {
  const bar = e.target.closest(".titlebar");
  if (!bar || e.target.closest("button")) return;
  const id = bar.parentElement.dataset.app;
  ui.win[id].max = !ui.win[id].max;
  saveUI();
  renderWindows();
});

/* ---------- clock ---------- */
let last = Date.now(),
  saveClock = 0;
const sig = () => JSON.stringify([s.jobs.map((j) => j.id), s.projects, s.stories, s.xp, s.logs.length, s.logs[0]?.time]);
setInterval(() => {
  const now = Date.now();
  const was = sig();
  G.tick(s, (now - last) / 1000);
  last = now;
  s.last = now;
  saveClock++;
  if (was !== sig()) {
    afterChange();
    render();
  } else {
    for (const el of document.querySelectorAll("[data-job]")) {
      const j = s.jobs.find((j) => j.id === Number(el.dataset.job));
      if (j) el.value = j.done;
    }
    for (const el of document.querySelectorAll("[data-jobpct]")) {
      const j = s.jobs.find((j) => j.id === Number(el.dataset.jobpct));
      if (j) el.textContent = pct(j);
    }
    if (saveClock % 20 === 0) renderChrome();
    updateClock();
  }
  if (saveClock % 5 === 0) persist();
}, 500);
window.addEventListener("pagehide", persist);
window.addEventListener("hashchange", () => {
  const id = location.hash.slice(1);
  if (APPS[id]) {
    openApp(id);
    render();
  }
});
function boot() {
  if (!ui.booted) {
    ui.booted = true;
    openApp("workbench");
    ui.win.workbench.x = Math.max(12, Math.round(innerWidth / 2 - 460));
    openApp("welcome");
    ui.win.welcome.x = Math.max(12, Math.min(innerWidth - ui.win.welcome.w - 12, ui.win.workbench.x + 360));
    ui.win.welcome.y = 90;
  }
  for (const w of Object.values(ui.win)) {
    w.w = Math.min(w.w, innerWidth - 16);
    w.x = Math.max(8, Math.min(innerWidth - Math.min(w.w, 200), w.x));
    w.y = Math.max(36, Math.min(innerHeight - 120, w.y));
  }
}
boot();
if (APPS[location.hash.slice(1)]) openApp(location.hash.slice(1));
render();
if (saveError) notify(saveError, "settings");
