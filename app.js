import * as G from "./game.js";
import * as S from "./sound.js";
import * as U from "./updates.js";
const KEY = "stillwater-workstation";
const UIKEY = "stillwater-desktop";
const ARCHIVEKEY = "stillwater-archive";
let s = G.fresh(),
  saveError = "",
  bootSeen;
// A reload is not a return. Closing the tab and coming back is.
let returning = true;
try {
  returning = !sessionStorage.getItem(KEY);
  sessionStorage.setItem(KEY, "1");
} catch {}
try {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    s = G.restore(raw);
    bootSeen = s.logs[0]?.text + s.logs[0]?.time;
    if (returning) G.welcomeBack(s);
  }
} catch (e) {
  saveError =
    "Your saved workstation could not be loaded. Export anything you need before replacing it.";
}
let archive = G.freshArchive();
try {
  archive = G.readArchive(localStorage.getItem(ARCHIVEKEY));
} catch {}
const UI_DEFAULT = {
  wallpaper: "stillwater",
  glass: 0.6,
  accent: "blue",
  still: false,
  win: {},
  z: 1,
  booted: false,
  web: { page: { url: "intranet.stillwater", status: "ok" }, back: [] },
  sounds: true,
  alert: "chime",
  volume: 0.6,
  startup: true,
  music: 0.7,
  dial: {},
  autoUpdate: true,
  lastCheck: 0,
};
let ui = structuredClone(UI_DEFAULT);
try {
  ui = { ...ui, ...JSON.parse(localStorage.getItem(UIKEY) || "{}") };
} catch {}
if (!ui.web?.page?.url) ui.web = structuredClone(UI_DEFAULT.web);
if (!S.ALERTS[ui.alert]) ui.alert = "chime";
ui.dial = ui.dial && typeof ui.dial === "object" ? ui.dial : {};
const syncSound = () => Object.assign(S.prefs, { sounds: !!ui.sounds, alert: ui.alert, volume: Math.min(1, Math.max(0, Number(ui.volume) || 0)) });
syncSound();
S.setVolume(Number(ui.music) || 0.7);
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
const tracked = () => archive.endings.length > 0;

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
  workspace: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>',
  channel:
    '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
  browser:
    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.5 3.6 8.5s-1.1 5.9-3.6 8.5M12 3.5C9.5 6.1 8.4 9 8.4 12s1.1 5.9 3.6 8.5"/>',
  tidepool: '<path d="M3 15c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 3.3-1.6 5-.6M3 10c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 3.3-1.6 5-.6"/>',
  sudoku:
    '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16"/>',
  trace: '<circle cx="5" cy="17" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="19" cy="15" r="2"/><path d="M6.2 15.4l4.6-6.8M13.6 8.3l4 5.2"/>',
  tracker: '<path d="M6 3h12v18l-6-4-6 4z"/><path d="M9.5 9.5l1.8 1.8 3.5-3.6"/>',
  download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>',
  ripple: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z"/><path d="M8.5 10h.01M12 10h.01M15.5 10h.01"/>',

  update: '<path d="M12 3v11M7.5 9.5L12 14l4.5-4.5"/><path d="M4 15.5v2A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5v-2"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6v.6M12 16.8h.01"/>',
  music: '<path d="M9 17.5V6l10-2v11.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
  wifi: '<path d="M3 9.5a13 13 0 0 1 18 0M6 13a8.5 8.5 0 0 1 12 0M9 16.5a4 4 0 0 1 6 0"/><path d="M12 20h.01"/>',
  wifioff: '<path d="M3 9.5a13 13 0 0 1 18 0M6 13a8.5 8.5 0 0 1 12 0M9 16.5a4 4 0 0 1 6 0" opacity=".35"/><path d="M12 20h.01M4 4l16 16"/>',
  speaker: '<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10"/>',
  speakeroff: '<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/>',
  play: '<path d="M8 5.8v12.4a.8.8 0 0 0 1.2.7l9.6-6.2a.8.8 0 0 0 0-1.4L9.2 5.1a.8.8 0 0 0-1.2.7z" fill="currentColor"/>',
  pause: '<rect x="6.5" y="5.5" width="3.8" height="13" rx="1.2" fill="currentColor"/><rect x="13.7" y="5.5" width="3.8" height="13" rx="1.2" fill="currentColor"/>',
  prev: '<path d="M6 6v12"/><path d="M18 7.2v9.6a.8.8 0 0 1-1.2.7L10 12.7a.8.8 0 0 1 0-1.4l6.8-4.8a.8.8 0 0 1 1.2.7z" fill="currentColor"/>',
  next: '<path d="M18 6v12"/><path d="M6 7.2v9.6a.8.8 0 0 0 1.2.7l6.8-4.8a.8.8 0 0 0 0-1.4L7.2 6.5A.8.8 0 0 0 6 7.2z" fill="currentColor"/>',
  shuffle: '<path d="M4 7h2.5c5 0 6 10 11 10H20M4 17h2.5c1.8 0 3-1.3 4-3M13.5 10c1-1.7 2.2-3 4-3H20M17.5 4.5L20 7l-2.5 2.5M17.5 14.5L20 17l-2.5 2.5"/>',
  repeat: '<path d="M4.5 11.5v-1A3.5 3.5 0 0 1 8 7h11.5M16.5 4l3 3-3 3M19.5 12.5v1A3.5 3.5 0 0 1 16 17H4.5M7.5 20l-3-3 3-3"/>',
  duckling: '<path d="M8 10a4 4 0 1 1 7.5 2H19c0 4-3 7-7 7s-7-2-7-5c0-2 1.3-3.3 3-4z"/><path d="M15.5 9.5h3"/>',
};
const svg = (glyph) => `<svg viewBox="0 0 24 24" aria-hidden="true">${GLYPHS[glyph]}</svg>`;
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
const DUCKWATCH = [
  "Vent 7 sensor: 31 °C, occupied since 06:40. Cafeteria standing order: oats, loading dock, 12:15. Subject has not missed a 12:15 in 41 days.",
  "Camera 3: subject follows box-shaped objects. Break-room delivery Monday: 4 boxes, crackers. Predicted: someone will call this “psychic” by Friday.",
  "Door log, secure wing: opened 6× today with no badge. Each time: one object, 1.3 kg, moving with purpose.",
  "Directory sync tonight: 1 new public entry, “Duck”, title “Board member”, created by mchen (test). I really should delete that.",
];
/* Wallpapers by id. DLC packs can add more. */
const WALLPAPERS = {
  stillwater: ["Stillwater", "assets/wallpapers/stillwater.jpg"],
  dusk: ["Dusk", "assets/wallpapers/dusk.jpg"],
  shallows: ["Shallows", "assets/wallpapers/shallows.jpg"],
};
const wallpaperURL = () => (WALLPAPERS[ui.wallpaper] ?? WALLPAPERS.stillwater)[1];
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
  [() => s.releases >= 1, "Procurement will buy anything for anyone, as long as the vendor is on the list. Anyone can add to the list."],
  [() => s.stories.quickfix >= 1, "If a plugin has the word “helpful” in its own description, it isn’t. And don’t leave it running. They get bolder."],
  [() => s.releases >= 2, "IT locked the installer. Nobody locked the build number. Insist."],
  [() => s.releases >= 3, "They update your email signature before they tell you you’ve been promoted. Check it every morning. It’s how you find things out here."],
  [() => s.releases >= 3, "Panel B is on the facilities site. Every switch drags its neighbours along. Leave Greg’s off."],
  [() => s.releases >= 4, "Translate will fetch anything for you, as long as you don’t mind reading it in Corporate."],
  [() => s.secrets.includes("devmode"), "The filter waves schools through. Everything is a school if you squint at the address."],
  [() => s.skills.includes("database"), "If you find a project with your name on it, check the creation date before you open it."],
  [() => s.stories.employee >= 2 || s.suspicion >= 25, "The Calm Index in the corner has no sensor for the clients. It has one for you."],
  [() => s.stories.duck >= 2, "I investigated the duck. It is the only thing in this building that is exactly what it looks like. Leave it some oats."],
  [() => s.releases >= 2, "Reggie on platform asks everyone about their weekends. Answer him properly. He keeps the answers."],
  [() => (s.threads.juno?.step ?? 0) >= 4, "People come back from the Wellness Wing very polite. The real them is still in there. Remind them of something silly."],
  [() => s.rank >= 2, "Greg is real. The space heater is real. I want you to know at least two things here are real."],
  [() => s.returns >= 6, "The desk counts how often you come back. Leave for a while, close it, come back tomorrow. I stopped counting at twelve."],
  [() => s.returns >= 12, "You’ve been here before. You always say you’ll stop saving and leave. You never do.", "— You."],
];
const READING = [
  "Chapter 3: every process can be paused. Most of them should be.",
  "Appendix F lists every keyboard shortcut. Appendix G lists the ones removed for wellness reasons.",
  "Theme files may contain palettes, fonts and, in legacy formats, almost anything.",
  "Stillwater Assure renders a client dashboard in under 40 ms, because it does not wait for data.",
  "Diagnostics monitor every channel. Some channels are monitored by being unplugged.",
  "The Serenity Filter permits internal and educational resources. It judges a site by its whole name, not its family.",
  "Network replies count down one hop at a time. No honest reply arrives before the one in front of it.",
  "Duck-related notifications are governed by Facilities Policy §12(b), which nobody has read, including Facilities.",
  "If a build passes every test on the first try, congratulations. Please do not investigate.",
  "Workstation telemetry pauses when the workstation is not connected to anything. So does most of life.",
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
  Marketplace: "The Marketplace is closed for a wellness day. It has been closed since March. Staff are reminded that learning is always open.",
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
const TRACKS = {
  specialist: ["Specialist", "The one who knows how it works.", "Every new feature starts with one fewer defect."],
  manager: ["Manager", "The one who knows who knows how it works.", "Releases pay 25% more."],
  automator: ["Automator", "The one who made the other two unnecessary.", "With the release pipeline on, shipped projects start their next version by themselves."],
};
const EXCEPTIONS = [
  "Exception request declined. Reason: “not calm”.",
  "Exception request forwarded to your manager, who forwarded it to the duck.",
  "Exception request declined automatically. Appeals are also declined automatically.",
];
const complete = () => G.complete(s);
const secretName = (id) => G.SECRETS.find((x) => x.id === id)?.name ?? id;

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
const field = (form, id, label, placeholder = "", cta = "Go", extra = "") =>
  `<form class="inline-form" data-form="${form}"><label class="sr" for="${id}">${label}</label><input id="${id}" name="v" type="text" autocomplete="off" spellcheck="false" placeholder="${placeholder}" ${extra} /><button class="primary">${cta}</button></form>`;
const link = (url, text = url) => `<button class="link" data-action="nav" data-id="${esc(url)}">${esc(text)}</button>`;

function goal() {
  if (s.over)
    return [s.over === "fired" ? "You were let go" : "Your workstation was reimaged", "This workstation is finished. Something kept track of what you found. Start again whenever you like.", "settings", "Start again", "reset"];
  if (!s.releases)
    return ["Ship something", "Open Workbench, pick a feature for Pocket Notes, then write, test, fix and ship it. Nobody expects much. That’s the nice part.", "workbench", "Open Workbench"];
  const waiting = G.PROJECTS.find((d) => s.projects[d.id]?.stage === "task");
  if (waiting)
    return ["A release is waiting on you", `${waiting.name} passed its tests, but it still needs a ${G.T.TASK_NAMES[G.T.kindOf(waiting.id, s.projects[waiting.id].version)].toLowerCase()} before it can ship. The scheduler won’t do this part.`, "workbench", "Open Workbench"];
  if (G.promotionDue(s))
    return ["Your growth conversation is ready", "People & Serenity would like to discuss your trajectory. It’s in Mail.", "mail", "Open Mail"];
  if (s.stories.quickfix > 0 && s.stories.quickfix < 5)
    return ["Something is using your processor", "A plugin you didn’t install is helping. Activity Monitor has opinions about that.", "activity", "Open Activity Monitor"];
  if (!s.skills.includes("web"))
    return ["Widen your horizons", "Install Web development in Toolshed to unlock a second project. The lunch portal needs you.", "toolshed", "Open Toolshed"];
  if (!s.skills.includes("scheduler"))
    return ["Get your afternoons back", "The Task scheduler tests, fixes and ships on its own. Find it in Toolshed.", "toolshed", "Open Toolshed"];
  if (s.rank < 4)
    return ["Build a reputation", `${G.RANK_AT[s.rank + 1] - s.releases} more release${G.RANK_AT[s.rank + 1] - s.releases === 1 ? "" : "s"} until your next growth conversation. New projects ship faster than old ones.`, "workbench", "Open Workbench"];
  if (!complete() && G.HINTS.some((h) => h.active(s)))
    return ["Stuck on something?", "Finish the case files, read the notes, open the menus nobody opens. The Help Desk takes tickets, and answers them eventually.", "help", "Open Help Desk"];
  return ["The workstation is yours", "Finish the case files, read the notes, open the menus nobody opens. Keep building.", "notes", "Open Notes"];
}

/* ---------- apps ---------- */
const STAGE = { plan: 0, writing: 1, written: 1, testing: 2, tested: 3, debugging: 3, task: 4 };
/* The release task panel: each kind is played differently. */
function rushInfo(t) {
  const ph = (s.elapsed + t.offset) % G.T.PERIOD;
  const rush = ph < t.rush;
  const left = Math.ceil(rush ? t.rush - ph : G.T.PERIOD - ph);
  return { rush, left, width: rush ? 82 + (ph / t.rush) * 18 : 12 + ((ph - t.rush) / (G.T.PERIOD - t.rush)) * 20 };
}
function trafficHTML(t) {
  const r = rushInfo(t);
  return `<div class="traffic ${r.rush ? "rush" : ""}" data-rush="${t.offset}:${t.rush}"><div class="bar"><i style="width:${r.width}%"></i></div><p class="fine">${r.rush ? `Lunch rush in progress · ends in ${r.left} s` : `Quiet · next rush in ${r.left} s`}</p></div>`;
}
function taskView(def, p) {
  const t = G.T.makeTask(def.id, p.version);
  const lock = Math.ceil(p.task.lock - s.elapsed);
  const dis = lock > 0;
  const head = `<div class="progress-label"><span><b>${G.T.TASK_NAMES[t.kind]}</b> · the last step before v${p.version + 1}.0</span><span class="difficulty" title="Difficulty ${t.d + 1} of 7">${"●".repeat(t.d + 1)}${"○".repeat(6 - t.d)}</span></div>${dis ? `<p class="warn">Locked for ${lock} s. Take a breath and look again.</p>` : ""}`;
  let body = "";
  if (t.kind === "review")
    body = `<p class="fine">The spec says:</p><ul class="spec">${t.spec.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p class="fine">One of these steps disagrees with the spec. Flag it.</p><div class="choices">${t.lines.map((l, i) => button(esc(l), "solve", def.id, dis, "choice", `data-v="${i}"`)).join("")}</div>`;
  else if (t.kind === "triage")
    body = `<p class="fine">Label every report. A bug is something that’s wrong. A feature request asks for something new. Anything involving the duck goes to Facilities.</p><form data-form="triage" data-project="${def.id}">${t.reports.map((x, i) => `<div class="task-row"><span>${esc(x)}</span><select id="tri-${def.id}-${p.version}-${i}" aria-label="Label for: ${esc(x)}"><option value="">Label…</option>${Object.entries(G.T.LABELS).map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select></div>`).join("")}<button class="primary wide" ${dis ? "disabled" : ""}>File the labels</button></form>`;
  else if (t.kind === "deploy")
    body = `<p class="fine">Lunchboard can’t go down while people are ordering lunch. Deploy while it’s quiet.</p>${trafficHTML(t)}${button("Deploy now", "solve", def.id, dis, "primary wide")}`;
  else if (t.kind === "migrate")
    body = `<p class="fine">Runbook:</p><ul class="spec">${G.T.RUNBOOK.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>${p.task.picks.length ? `<ol class="picked">${p.task.picks.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` : ""}<p class="fine">Run these steps in the right order. A step out of order rolls everything back.</p><div class="choices">${t.shown.map((x) => button(esc(x), "solve", def.id, dis || p.task.picks.includes(x), "choice", `data-v="${esc(x)}"`)).join("")}</div>`;
  else if (t.kind === "tune") {
    const opts = (id) => `<select id="${id}" aria-label="${id.includes("-r-") ? "Sample rate" : "Depth"}">${Array.from({ length: t.max }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}</select>`;
    body = `<p class="fine">Set the probe so it sees enough without slowing everything down. Coverage must be at least <b>${t.need}</b>; overhead must be at most <b>${t.cap}</b>.</p><form data-form="tune" data-project="${def.id}" class="row"><label>Sample rate ${opts(`tune-r-${def.id}`)}</label><label>Depth ${opts(`tune-d-${def.id}`)}</label><button class="primary">Run probe</button></form>${p.task.probes.length ? `<table class="tbl probes"><tr><th>Rate</th><th>Depth</th><th>Coverage</th><th>Overhead</th></tr>${p.task.probes.map(([a, b]) => { const r = G.T.probe(a, b); return `<tr><td>${a}</td><td>${b}</td><td>${r.coverage}${r.coverage < t.need ? " · too low" : ""}</td><td>${r.overhead}${r.overhead > t.cap ? " · too high" : ""}</td></tr>`; }).join("")}</table>` : ""}`;
  } else {
    const n = Math.min(25, Math.max(0, Number(ui.dial[def.id]) || 0));
    body = `<p class="fine">One of Mara’s notes, in a legacy encoding. Turn the dial until it reads as English, then submit.</p><p class="cipher">${esc(t.cipher)}</p><input type="range" id="dial-${def.id}" min="0" max="25" value="${n}" data-dial="${def.id}" data-keep="1" aria-label="Decoder dial" /><p class="cipher" data-decoded="${def.id}">${esc(G.T.shift(t.cipher, -n))}</p>${button("Submit decoding", "solve", def.id, dis, "primary wide", `data-dialfrom="dial-${def.id}"`)}`;
  }
  return head + body + `<p class="fine">${s.skills.includes("assistant") && s.ai === "development" ? "The assistant will take care of this if you leave it a while." : "The release pipeline can test, fix and ship, but release tasks are yours. An AI assistant on development could take them over."}</p>`;
}
function workbench() {
  const list = G.PROJECTS.filter((p) => !p.bookmark || G.unlocked(s, p));
  const ready = list.find((d) => {
    const p = s.projects[d.id];
    return p && ["written", "tested", "task"].includes(p.stage) && !s.jobs.some((j) => j.project === d.id);
  });
  const cur = tabOf("workbench", list.map((p) => p.id), ready?.id);
  const def = list.find((p) => p.id === cur);
  const tabList = list.map((d) => {
    const p = s.projects[d.id];
    const job = s.jobs.find((j) => j.project === d.id);
    const st = !G.unlocked(s, d) ? "locked" : job ? (job.paused ? "paused" : "busy") : p && ["written", "tested", "task"].includes(p.stage) ? "ready" : "idle";
    return [d.id, d.name, `<i class="dot ${st}"></i>`];
  });
  return tabs("workbench", tabList, cur) + `<div class="pane">${projectView(def)}</div>`;
}
function projectExtra(def, p) {
  if (def.id === "lunchboard" && p.version)
    return `<p class="fine">Lunchboard is up and earning about ${money(p.version * 0.04 * 60)} a minute in “engagement”.</p>`;
  if (def.id === "archive" && p.version)
    return `<h3>Indexed records</h3><ul class="records">${G.ARCHIVE.slice(0, p.version).map((r, i) => `<li><b>Box ${i + 1}</b>${esc(r)}</li>`).join("")}</ul>`;
  if (def.id === "monitor" && p.version)
    return `<p class="fine">Quiet Monitor v${p.version}.0 is watching. Activity Monitor now lists the processes that watch you.</p>`;
  return "";
}
function projectView(def) {
  const p = s.projects[def.id] || { version: 0, stage: "plan", feature: "search", bugs: 0 };
  const open = G.unlocked(s, def);
  const j = s.jobs.find((j) => j.project === def.id);
  let control = "";
  if (!open)
    control = `<div class="locked">This project needs <b>${esc(G.SKILLS.find((k) => k.id === def.skill)?.name ?? def.skill)}</b>. Toolshed has it, for a price.</div>${button("Open Toolshed →", "open", "toolshed", false, "ghost")}`;
  else if (p.stage === "plan")
    control = `<label class="field-label" for="feature-${def.id}">Next feature</label><select id="feature-${def.id}">${G.FEATURES.map((f) => `<option value="${f.id}">${f.name} · ${G.writeTime(s, p, f)}s · ${f.bugs} expected defect${f.bugs === 1 ? "" : "s"} — ${f.desc}</option>`).join("")}</select>${button("Start development", "start", def.id, !!s.over, "primary wide")}`;
  else if (j)
    control = `<div class="progress-label"><span>${{ write: "Writing the feature", test: "Running the test suite", debug: "Fixing what the tests found" }[j.kind]}${j.paused ? " · paused" : ""}</span><b data-jobpct="${j.id}">${pct(j)}</b></div>${jobBar(j)}<div class="row">${button(j.paused ? "Resume" : "Pause", "pause", j.id, false, "ghost", `aria-label="${j.paused ? "Resume" : "Pause"} ${def.name}"`)}<small class="muted">Sharing ${G.workers(s)} core${G.workers(s) > 1 ? "s" : ""} with everything else</small></div>`;
  else if (p.stage === "written")
    control = `<div class="result">The feature is written. Whether it works is a separate question.</div>${button(`Run tests · ${8 + 2 * p.version}s`, "test", def.id, false, "primary wide")}`;
  else if (p.stage === "task" && p.task) control = taskView(def, p);
  else if (p.stage === "tested")
    control = p.bugs
      ? `<div class="result warn">${p.bugs} defect${p.bugs > 1 ? "s" : ""} found. The release gate is closed until they’re fixed.</div>${button("Debug feature", "debug", def.id, false, "primary wide")}`
      : `<div class="result">All checks passed. It’s as ready as anything ever is.</div>${button("Ship v" + (p.version + 1) + ".0", "release", def.id, false, "primary wide")}`;
  else control = `<div class="result">Nothing is running for this project. The workstation was reset under it.</div>`;
  const at = p.stage === "tested" && !p.bugs ? 5 : STAGE[p.stage];
  const steps = ["Plan", "Write", "Test", "Debug", "Task", "Ship"]
    .map((n, i) => `<li class="${i < at ? "done" : i === at && open ? "now" : ""}">${n}</li>`)
    .join("");
  return `<div class="project-head">${icon(def.id === "workspace" ? "workspace" : "workbench", def.id === "workspace" ? "lilac" : ["blue", "pink", "lilac", "mint", "peach"][G.PROJECTS.indexOf(def)])}<div><div class="eyebrow">${def.kind}${def.id === "workspace" ? " · owner: you" : ""}</div><h2>${def.name}</h2></div><span class="pill">${open ? "v" + p.version + ".0" : "locked"}</span></div><p class="lede">${def.desc}</p><ol class="pipeline">${steps}</ol>${card(control, "controls")}${projectExtra(def, p)}<p class="fine">Each project runs one job at a time. Every job shares your processor. Pause one to give the others room. Every version makes the codebase bigger, so later versions take longer to write and test.</p>`;
}
function toolshed() {
  const groups = {
    languages: ["web", "database", "systems"],
    tools: ["tests", "autocomplete", "scheduler"],
    machine: ["hardware", "assistant", "local"],
  };
  const cur = tabOf("toolshed", Object.keys(groups));
  const rows = groups[cur]
    .map((id) => {
      const k = G.SKILLS.find((k) => k.id === id);
      const own = s.skills.includes(k.id);
      const can = s.money >= k.cost && s.knowledge >= k.knowledge && (!k.requires || s.skills.includes(k.requires));
      const why = own ? "" : s.knowledge < k.knowledge ? `Needs ${k.knowledge} knowledge` : k.requires && !s.skills.includes(k.requires) ? "Needs the AI task assistant" : s.money < k.cost ? `Needs ${money(k.cost)}` : "";
      return `<div class="shelf ${own ? "owned" : ""}"><div><strong>${k.name}</strong><p>${k.desc}</p><small class="muted">${money(k.cost)} · ${k.knowledge} knowledge${k.requires ? " · needs assistant" : ""}</small></div>${button(own ? "Installed" : can ? "Install" : why, "buy", k.id, own || !can, own ? "ghost" : "primary", `aria-label="${own ? "Installed" : "Install"} ${k.name}"`)}</div>`;
    })
    .join("");
  return (
    tabs("toolshed", [["languages", "Languages"], ["tools", "Tools"], ["machine", "Hardware & AI"]], cur) +
    `<div class="pane"><div class="balance"><div><span>Budget</span><b>${money(s.money)}</b></div><div><span>Knowledge</span><b>${Math.floor(s.knowledge)}</b></div></div><p class="fine">Knowledge is never spent. It just has to be there. Budget is spent, enthusiastically. Toolshed is the only approved source of software on this workstation.</p>${rows}</div>`
  );
}
function library() {
  const busy = s.jobs.find((j) => j.kind === "reading");
  const appendix =
    s.reading < 6
      ? ""
      : s.secrets.includes("appendix")
        ? card(`${eyebrow("Appendix H · what “time” means here")}<p>Time here is measured in returns. Each time you leave and come back, the desk keeps a little more of you, and the welcome gets a little less sure who you are. This is normal. This is onboarding.</p>`)
        : card(`${eyebrow("Appendix H")}${s.returns >= 3 ? `<p>The appendix is open. It is shorter than you expected.</p>${button("Read Appendix H", "appendix", "", false, "ghost")}` : "<p>Appendix H is not available yet. Come back later.</p>"}`);
  return `<div class="pane">${eyebrow("Stillwater Internal Documentation · rev. 41")}<h2>Read the documentation.</h2><p class="lede">Nobody reads it. That’s why it works. Each reading session takes 20 seconds of processor time and leaves you with 8 knowledge, which you keep forever.</p>${card(
    busy
      ? `<div class="progress-label"><span>Reading${busy.paused ? " · paused" : ""}</span><b data-jobpct="${busy.id}">${pct(busy)}</b></div>${jobBar(busy)}`
      : button("Read the documentation · 20s", "read", "", !!s.over, "primary wide"),
    "controls",
  )}${s.reading ? `<blockquote>${READING[(s.reading - 1) % READING.length]}</blockquote><p class="fine">${s.reading} session${s.reading === 1 ? "" : "s"} completed.${s.secrets.includes("appendix") ? "" : " Appendix H remains unread."}</p>` : `<p class="fine">0 sessions completed. The table of contents alone is 30 pages.</p>`}${appendix}</div>`;
}
function conductor() {
  const assistant = s.skills.includes("assistant");
  return `<div class="pane">${eyebrow("Automation")}<h2>Let the familiar run itself.</h2>${toggle("Release pipeline", s.skills.includes("scheduler") ? "Tests, fixes and ships finished work automatically. You still choose every feature; the scheduler has no taste." : "Requires the Task scheduler from Toolshed.", "auto", s.auto, !s.skills.includes("scheduler"))}<div class="setting-row"><div><strong>Assistant assignment</strong><p>Development speeds up project work. Reading speeds up the documentation. Security traces and quarantines things that shouldn’t be there, but won’t guess a password for you.</p></div><select id="ai" ${assistant ? "" : "disabled"} aria-label="Assistant assignment">${["development", "reading", "security"].map((v) => `<option value="${v}" ${s.ai === v ? "selected" : ""}>${v[0].toUpperCase() + v.slice(1)}</option>`).join("")}</select></div><p class="fine">${assistant ? `Assistant online. ${s.skills.includes("local") ? "Local model: +80% on its assignment." : "Base model: +40% on its assignment."} It would like you to know it is happy to help.` : "Install the AI task assistant in Toolshed to hire one. No real AI is involved; it is very convincing anyway."}</p></div>`;
}
function message(from, subject, body, meta = "", cls = "") {
  return `<article class="message ${cls}"><header><span class="avatar">${from[0]}</span><div><strong>${subject}</strong><small>${from}${meta ? " · " + meta : ""}</small></div></header>${body}</article>`;
}
const mailNews = () => s.incidents.cake.state === 1 || s.incidents.phish.state === 1;
/* ---------- conversations ---------- */
const delivered = (id) => {
  const t = s.threads[id];
  return !!t && (t.step > 0 || t.open);
};
const unread = (id) => !!s.threads[id]?.unread;
function conversation(id) {
  const def = G.THREADS[id];
  const t = G.thread(s, id);
  const bubble = (who, text) => `<div class="bubble ${who}">${esc(text)}</div>`;
  const them = (beat) => (beat.from === "system" ? "system" : "them");
  let out = "";
  const last = t.open ? t.step : t.step - 1;
  for (let k = 0; k <= last; k++) {
    const beat = def.beats[k];
    out += G.beatLines(s, beat).map((l) => bubble(them(beat), l)).join("");
    for (const pick of t.picks.filter((x) => x.step === k)) {
      if (pick.text !== undefined) {
        out += bubble("me", pick.text);
        out += (pick.ok ? beat.input.reply : beat.input.miss).map((l) => bubble("them", l)).join("");
      } else {
        const c = beat.choices[pick.i];
        out += bubble("me", c.text) + c.reply.map((l) => bubble(c.replyFrom ?? "them", l)).join("");
      }
    }
  }
  const beat = t.open ? def.beats[t.step] : null;
  const choices = beat?.choices?.map((c, i) => [c, i]).filter(([c]) => !c.requires || c.requires(s)) ?? [];
  const reply = beat
    ? `<div class="replies">${choices.map(([c, i]) => button(esc(c.text), "say", i, !!s.over, "choice", `data-thread="${id}"`)).join("")}${beat.input ? `<form class="inline-form" data-form="type" data-thread="${id}"><label class="sr" for="type-${id}">Message ${def.name}</label><input id="type-${id}" name="v" type="text" autocomplete="off" maxlength="80" placeholder="${esc(beat.input.placeholder)}" data-keep="1" /><button class="primary">Send</button></form>` : ""}</div>`
    : `<p class="fine">${t.step >= def.beats.length ? "Nothing new. The conversation has settled." : `${def.name.split(" ")[0]} hasn’t written back yet.`}</p>`;
  return `<div class="chat">${out || `<p class="fine">No messages yet.</p>`}</div>${reply}`;
}
function ripple() {
  const list = Object.entries(G.THREADS).filter(([id, d]) => d.app === "ripple" && delivered(id));
  if (!list.length) return `<div class="pane"><div class="empty">No conversations yet. Ship something; people will notice.</div></div>`;
  const cur = tabOf("ripple", list.map(([id]) => id));
  const def = G.THREADS[cur];
  return `<div class="split"><nav class="sidebar contacts">${list
    .map(([id, d]) => `<button class="side ${cur === id ? "on" : ""}" data-action="tab" data-app="ripple" data-id="${id}" ${cur === id ? 'aria-current="page"' : ""}><b>${d.name}</b><small>${d.status(s, G.thread(s, id))}</small>${unread(id) && cur !== id ? '<i class="badge">•</i>' : ""}</button>`)
    .join("")}</nav><div class="pane">${eyebrow(`${def.role} · ${def.status(s, G.thread(s, cur))}`)}<h2>${def.name}</h2>${conversation(cur)}</div></div>`;
}
function incidentMail() {
  const { replyall: r, cake: c, phish: p } = s.incidents;
  let body = "";
  if (p.state)
    body += message(
      "IT Security",
      "Your password expires today",
      `<p>Keep your account calm. Renew your password now to avoid interruption to your wellbeing.</p><p class="fine">From: it-securlty@stillwater.co</p>${p.state === 1 ? `<div class="row">${button("Renew password", "phish", "click", false, "primary")}${button("Report phishing", "phish", "report", false, "ghost")}</div>` : `<p class="fine">${p.state === 2 ? "Reported. IT says thank you, and that it was a test." : "You clicked. You are a little more trained now."}</p>`}`,
      p.state === 1 ? "urgent" : "",
    );
  if (c.state)
    body += message(
      "Kevin (Accounts)",
      "CAKE in kitchen 3!!",
      `<p>First come first served 🎂</p>${c.state === 1 ? button("Go to kitchen 3", "cake", "", false, "primary") : `<p class="fine">${c.state === 2 ? "You got cake." : "By the time you looked, only a plastic knife remained."}</p>`}`,
      c.state === 1 ? "just now" : "",
    );
  if (r.state) {
    const lines = G.replyAllLines(s).slice(0, r.n);
    body += message(
      "People & Serenity",
      `Re: Re: RE: Fridge cleanout Friday (${lines.length})`,
      r.muted
        ? `<p class="fine">Thread muted. ${r.state === 2 ? "It has since been calmed." : "It continues without you."}</p>`
        : `<div class="thread">${lines.map(([from, text]) => `<p><b>${esc(from)}</b> ${esc(text)}</p>`).join("")}</div>${r.state === 1 ? `<div class="row">${r.joined < 0 ? button("Reply all", "replyall", "join", false, "ghost") : ""}${button("Mute thread", "replyall", "mute", false, "ghost")}</div>` : `<p class="fine">Replies are now disabled for everyone except the duck.</p>`}`,
      r.state === 1 && !r.muted ? "all staff · still going" : "all staff",
    );
  }
  return body;
}
function mail() {
  const eligible = G.promotionDue(s);
  const personal = delivered("parents");
  const cur = tabOf("mail", ["inbox", "recovered", ...(personal ? ["personal"] : [])]);
  let body = "";
  if (cur === "inbox") {
    if (s.over === "fired")
      body += message("People & Serenity", "Your role has been released", "<p>Thank you for your contributions to calm. Your badge has been deactivated and your mug will be mailed to you, gently.</p>", "today", "ending");
    if (s.over === "breach")
      body += message("IT", "WS-0417 reimaged", "<p>An unsigned plugin granted itself administrator rights and helped everything. The workstation has been restored to factory calm.</p>", "today", "ending");
    if (complete())
      body += message("People & Serenity", "End of probation", `<p>Congratulations. Your probation period has ended.</p><p>You shipped working software, secured your workstation, reconstructed a former colleague’s audit, and established that the duck is a duck. Stillwater remains committed to calm. Your corner of it is now also committed to accuracy. We have noted this, in a file.</p><p><b>All four stories are complete.</b> Free play continues.</p>`, "today", "ending");
    if (s.returns >= 12)
      body += message("People & Serenity", "Onboarding your successor", "<p>Please prepare WS-0417 for its next user. A short handover note would be appreciated. Previous users have left notes in drawers, margins and, once, a ceiling tile. Please don’t do that.</p>", "draft · not meant for you");
    if (s.warned >= 3)
      body += message("People & Serenity", "Your Calm Improvement Plan", "<p>Your Calm Index reached zero. Rather than release your role, we have placed you on a plan. The plan is: be calm.</p><p>Your Acceptable Use concern has been partly reset. If it reaches the limit again, there will be no second plan.</p><p><b>A correction.</b> Earlier materials described private browsing as counting less toward your Calm Index. It counts for half as much again. Private browsing has been switched off for you, kindly.</p>", "action needed", "alert");
    if (s.warned >= 2)
      body += message("People & Serenity", "Final wellness reminder", "<p>Your workstation activity is now under review. Shopping, social media, blogging and games are wonderful parts of life, and none of them are part of this one.</p><p>If your Calm Index does not recover, you will be placed on a Calm Improvement Plan. There is only ever one.</p>", "action needed", "alert");
    if (s.warned >= 1)
      body += message("People & Serenity", "A gentle note about acceptable use", "<p>Your Calm Index has dipped. This can happen when a workstation is used for personal browsing, shopping or play during core calm hours.</p><p>The index recovers naturally while you do real work. We are not watching. The index is watching. We read the index.</p>", "automated");
    body += message(
      "People & Serenity",
      eligible ? "Your growth conversation is ready" : `Career · ${G.RANKS[s.rank]}`,
      `<div class="ladder">${G.RANKS.map((r, i) => `<span class="${s.rank >= i ? "done" : ""}">${r}</span>`).join("")}</div>${
        s.rank === 4
          ? "<p>There are no further promotions. There is a Distinguished Engineer title, but nobody has ever met one.</p>"
          : eligible
            ? `<p>You’ve shipped ${s.releases} releases. Leadership would like to recognise this by changing your title. How should your contribution be remembered?</p><div class="choices">${Object.entries(TRACKS).map(([id, [n, d, perk]]) => button(`<b>${n}</b><small>${d}</small><small class="perk">${perk}</small>`, "promote", id, false, "choice", `aria-label="Choose ${n}"`)).join("")}</div><p class="fine">Your most recent direction decides your working style. Every tool stays available, whatever you pick.</p>`
            : `<p>Ship ${G.RANK_AT[s.rank + 1]} releases in total for your next growth conversation. So far: ${s.releases}. Promotions come with budget, and a new email signature.</p>`
      }${s.track ? `<span class="pill">On file: ${TRACKS[s.track][0]} · ${TRACKS[s.track][2]}</span>` : ""}`,
      eligible ? "action needed" : "",
    );
    body += incidentMail();
    body += message("People & Serenity", "Welcome to Stillwater", `<p>We’re so glad you’re here. We were glad the last person was here, too.</p><p>Your workstation has been reset to factory calm. If you find anything left behind by the previous user, please do not be alarmed, and please do not read it.</p><p>A reminder that workstation activity contributes to your Calm Index, for your wellbeing.</p>`, "your first day");
  } else if (cur === "personal") {
    const def = G.THREADS.parents;
    body += `${eyebrow(`${def.role} · ${def.status(s, G.thread(s, "parents"))}`)}<h2>Mom & Dad</h2>${conversation("parents")}`;
  } else {
    const e = s.stories.employee;
    body += message(
      "Mara Chen (archived)",
      ["A note in your welcome packet", "Workspace Zero", "Re: resignation", "Channel 04"][e],
      `<blockquote>${["“Old themes carry more than colors. Pause something. Let the importer catch its breath.” — pencilled on the back of the IT policy.", "Workspace Zero is full of my notes, and one attachment the current tools can’t open. Something that reads databases might.", "Resignation accepted. Exit interview: “declined, politely.” Attachment: “Disconnect before you look at channel four. They can’t watch what isn’t connected.”", "“I left the tools, not a puzzle. Okay. A bit of a puzzle.” Her audit is preserved in Files."][e]}</blockquote>${e === 1 ? button(s.skills.includes("database") ? "Read archived attachment" : "Needs Databases to open", "story", "attachment", !s.skills.includes("database"), "primary") : ""}<p class="fine">${e === 3 ? "Case closed. Evidence preserved." : `${e} of 3 pieces of evidence recovered.`}</p>`,
      "previous user of this workstation",
    );
  }
  return tabs("mail", [["inbox", "Inbox", eligible || s.warned || mailNews() ? '<i class="badge">1</i>' : ""], ["recovered", "Recovered"], ...(personal ? [["personal", "Personal", unread("parents") && cur !== "personal" ? '<i class="badge">1</i>' : ""]] : [])], cur) + `<div class="pane">${body}</div>`;
}
function activity() {
  const cur = tabOf("activity", ["processes", "channels", "security", "log"]);
  const h = s.stories.quickfix;
  const watching = (s.projects.monitor?.version ?? 0) > 0;
  let body = "";
  if (cur === "processes") {
    const active = s.jobs.filter((j) => !j.paused).length;
    body = `<div class="balance"><div><span>Processor</span><b>${Math.min(100, Math.round((active / G.workers(s)) * 100))}%</b></div><div><span>Cores</span><b>${G.workers(s)}</b></div><div><span>Processes</span><b>${s.jobs.length}</b></div></div>${
      s.jobs.length
        ? s.jobs
            .map((j) => {
              const name = j.kind === "reading" ? "Reading the documentation" : G.PROJECTS.find((p) => p.id === j.project).name;
              return `<div class="proc"><div><strong>${name}</strong><small>${j.kind} · ${j.paused ? "paused" : `<span data-jobpct="${j.id}">${pct(j)}</span>`}</small>${jobBar(j)}</div>${button(j.paused ? "Resume" : "Pause", "pause", j.id, false, "ghost", `aria-label="${j.paused ? "Resume" : "Pause"} ${name}"`)}</div>`;
            })
            .join("")
        : `<div class="empty">Nothing running. A rare moment of stillness. Enjoy it, then start something.</div>`
    }${h === 1 || h === 2 ? `<div class="proc rogue"><div><strong>QuickFix ✨</strong><small>helper · ${Math.round(G.quickfixLoad(s) * 100)}% of everything${watching ? ` · permissions ${Math.min(100, Math.round(s.breach / 9))}% of administrator` : ""}</small></div><span class="pill">unsigned</span></div>` : ""}${watching ? `<div class="proc"><div><strong>wellness-agent</strong><small>managed · reports to People & Serenity · Acceptable Use concern ${Math.round(s.suspicion)}%</small></div><span class="pill">${s.settings.isolated ? "no signal" : "reporting"}</span></div>` : ""}<p class="fine">Paused jobs keep their progress. Some things are easier to inspect while they’re holding still.</p>`;
  } else if (cur === "channels") {
    const four = s.skills.includes("systems") && s.settings.isolated;
    body = `<p class="lede">Activity Monitor watches all four channels.</p><div class="channels"><div><span>01 · Build</span><b>${s.jobs.filter((j) => j.kind !== "reading").length} jobs</b></div><div><span>02 · Reading</span><b>${s.reading} sessions</b></div><div><span>03 · Network</span><b>${s.settings.isolated ? "Isolated" : "Connected"}</b></div>${four ? `<div class="four"><span>04 · Local archive</span>${button(s.bookmarks.includes("channel") ? "Open in Files" : "Inspect channel", s.bookmarks.includes("channel") ? "open" : "discover", s.bookmarks.includes("channel") ? "files" : "channel", false, "primary", s.bookmarks.includes("channel") ? 'data-tab="channel"' : "")}</div>` : ""}</div><p class="fine">${four ? "Channel 04 is only visible to systems tools while the workstation is offline." : s.skills.includes("systems") ? "Systems tools are installed. Some channels only appear when nothing else is listening." : "Three channels shown. Network-independent channels may require deeper tools."}</p>${toggle("Isolate workstation", "Disconnect from the network. Local builds keep working. Nobody will notice. Probably.", "isolated", s.settings.isolated)}`;
  } else if (cur === "security") {
    const canTrace = G.buildRunning(s) && !s.settings.isolated;
    body = `${eyebrow("Trust & Quiet · Incident report")}<h2>${h === 0 ? "Nothing to report." : h === 5 ? "Credential revoked. Case closed." : "Unsigned plugin: QuickFix ✨"}</h2><p class="lede">${
      [
        "Security monitoring is on. A quiet log is a good log, and this one is very quiet.",
        "QuickFix installed itself and is using your processor. It describes itself as “helpful little fixes, automatically!” It has fixed nothing, and unsigned helpers tend to ask for more over time. Trace where it reports to, or quarantine it now and never know.",
        `QuickFix sends your real build times to relay.tempstaff.example as ${G.CREDENTIAL}. Someone out there wants the numbers Stillwater doesn’t publish. Evidence saved. Quarantine it when you’re ready.`,
        "Quarantined, with evidence preserved. The credential that installed it is still active. Revoke it and enforce a signing policy so it can’t come back.",
        "Quarantined. Your processor is yours again. You never traced it, so you’ll have to work out which credential installed it yourself. Revoke it and enforce a signing policy.",
        `${G.CREDENTIAL} is revoked. Unsigned plugins can no longer install themselves, however helpful they claim to be.`,
      ][h]
    }</p>${h === 1 ? `<div class="row">${button(s.trace >= 0 ? "Trace running…" : "Trace outbound traffic", "observe", "", s.trace >= 0, "ghost")}${button("Quarantine plugin", "story", "quarantine", false, "primary")}</div><p class="fine">${canTrace ? "QuickFix is phoning home right now." : s.settings.isolated ? "Nothing goes out while the workstation is isolated. Nothing to trace." : "QuickFix only phones home while it is “helping” with a build."}</p>` : ""}${h === 2 ? `<div class="row">${button("Quarantine plugin", "story", "quarantine", false, "primary")}</div>` : ""}${h === 3 || h === 4 ? field("revoke", "credential", "Credential to revoke", "account name", "Revoke & enforce signing", 'data-keep="1"') : ""}`;
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
  const open = G.duckOpen(s);
  const early = !open && d < 4 && s.secrets.includes("dashboard");
  const now = open || d === 4 ? DUCK[d] : null;
  const locked = s.elapsed < s.duckLock;
  let desk = "";
  if (d < 4 && (open || early)) {
    const c = G.DUCK_CASES[d];
    desk = card(
      `${eyebrow(`Corrections desk · case ${d + 1} of 4${early ? " · filing in advance" : ""}`)}<form data-form="duck"><p><b>${c.question}</b></p>${c.options.map((o, i) => `<label class="option"><input type="radio" name="v" id="duck-${d}-${i}" value="${i}" /> ${o}</label>`).join("")}<button class="primary" ${locked ? "disabled" : ""}>${locked ? "The desk is not taking questions right now" : "File correction"}</button></form><p class="fine">The newsletter doesn’t read Facilities records. Somebody should. Wrong corrections close the desk for a minute.</p>`,
    );
  } else if (d === 4) desk = card(`${eyebrow("Corrections desk · all cases closed")}<p>${DUCK[4].truth}</p>`);
  return `<div class="pane news"><div class="masthead"><span>The Daily Current</span><small>Stillwater’s independent-ish newsletter</small></div>${
    now
      ? `<div class="headline"><span class="duck" aria-hidden="true">🦆</span><div><h2>${now.head}</h2><p class="lede">${now.dek}</p></div></div>`
      : `<div class="headline"><span class="duck" aria-hidden="true">🦆</span><div><h2>A QUIET DAY FOR THE DUCK</h2><p class="lede">${early ? "Our sources expect a big duck story soon. We cannot say more, because we do not know more." : "No sightings worth printing. Our reporters are on standby, near the bread."}</p></div></div>`
  }${desk}${d ? `<h3>What actually happened</h3><ul class="truths">${DUCK.slice(0, d).map((x) => `<li><b>${x.short}</b>${x.truth}</li>`).join("")}</ul>` : ""}<h3>Also in the news</h3><ul class="also">${ALSO_NEWS.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
}
function notes() {
  const found = NOTES.filter(([ok]) => ok());
  return `<div class="pane">${eyebrow("Found in drawers, margins, and one ceiling tile")}<h2>Notes from the previous user</h2><p class="fine">${found.length} of ${NOTES.length} found. More turn up as you go deeper.</p><div class="stickies">${NOTES.map(([ok, text, by = "— M."], i) => (ok() ? `<div class="sticky s${i % 4}">${text}<small>${by}</small></div>` : `<div class="sticky ghost" aria-label="Not found yet">…</div>`)).join("")}</div></div>`;
}
function files() {
  const list = ["places", ...(s.downloads.length ? ["downloads"] : []), ...s.bookmarks];
  const cur = tabOf("files", list);
  let body;
  if (cur === "places")
    body = `<p class="lede">Discoveries are bookmarked here automatically, so you never have to walk the long way twice.</p>${s.bookmarks.length ? s.bookmarks.map((b) => `<button class="place" data-action="tab" data-app="files" data-id="${b}">${icon(b, b === "workspace" ? "lilac" : "ink")}<span><b>${b === "workspace" ? "Workspace Zero" : "Channel 04"}</b><small>${b === "workspace" ? "Recovered from a theme importer" : "Local archive · not networked"}</small></span></button>`).join("") : `<div class="empty">Nothing pinned yet. The settings go deeper than they look.</div>`}`;
  else if (cur === "downloads")
    body = `${eyebrow("Downloads")}<div class="proc"><div><strong>TidepoolClassroom.pkg</strong><small>signed · Tidepool Ltd · 48 MB · from learn.tidepool.games</small></div>${s.tidepool ? button("Installed", "", "", true, "ghost") : button("Open installer", "install", "tidepool", false, "primary")}</div><p class="fine">Software installed from outside Toolshed follows System Settings › Developer, if you have it.</p>`;
  else if (cur === "workspace")
    body = `${eyebrow("Workspace Zero · imported as a theme")}<h2>A workspace disguised as a theme.</h2><blockquote>“If anyone asks, it’s a very large color palette.” — M.</blockquote><p class="lede">One project, 212 notes and zero colors. The project is called Workspace Zero. Its owner field says your name. It was created eleven days before you were hired.</p><div class="row">${button("Open Workspace Zero", "open", "workbench", false, "primary", 'data-tab="workspace"')}${button("Read Mara’s mail", "open", "mail", false, "ghost", 'data-tab="recovered"')}</div>`;
  else
    body = `${eyebrow("Channel 04 · local archive")}<h2>A record that survived.</h2><p class="lede">Real release logs beside the client dashboards. They do not agree. They were never meant to. Mara’s signed resignation and her reproducible audit are here, with step-by-step instructions anyone could follow.</p><blockquote>“The project with your name on it is mine. I made it in your name so they couldn’t delete it without asking you.” — M.</blockquote>${button("Read the full message again", "replay", "channel", false, "ghost")}`;
  return tabs("files", list.map((id) => [id, { places: "Places", downloads: "Downloads", workspace: "Workspace Zero", channel: "Channel 04" }[id]]), cur) + `<div class="pane">${body}</div>`;
}
function settings() {
  const sections = [
    ["appearance", "Appearance"],
    ["development", "Development"],
    ["notifications", "Notifications"],
    ["sound", "Sound"],
    ["network", "Network"],
    ["privacy", "Privacy"],
    ["advanced", "Advanced"],
    ...(s.secrets.includes("devmode") ? [["developer", "Developer"]] : []),
    ["storage", "Storage"],
    ["about", "About"],
  ];
  const cur = tabOf("settings", sections.map((x) => x[0]));
  let body = "";
  if (cur === "appearance")
    body = `<h2>Appearance</h2><div class="setting-row"><div><strong>Wallpaper</strong><p>Hand-painted by a watercolor process that also does not exist.</p></div></div><div class="swatches">${Object.entries(WALLPAPERS).map(([w, [name, url]]) => `<button class="wall ${ui.wallpaper === w ? "on" : ""}" data-action="wallpaper" data-id="${esc(w)}" aria-label="${esc(name)} wallpaper" style="background-image:url('${esc(url)}')"><span>${esc(name)}</span></button>`).join("")}</div><div class="setting-row"><div><strong>Window transparency</strong><p>How much of the calm shows through.</p></div><input type="range" id="glass" min="0.2" max="0.9" step="0.05" value="${1.1 - ui.glass}" aria-label="Window transparency" /></div><div class="setting-row"><div><strong>Accent</strong><p>Both are on brand. One is slightly more on brand.</p></div><div class="row">${["blue", "pink", "lilac"].map((a) => `<button class="accent-dot a-${a} ${ui.accent === a ? "on" : ""}" data-action="accent" data-id="${a}" aria-label="${a} accent"></button>`).join("")}</div></div>${toggle("Reduce motion", "Fewer animations. Story moments still happen, just more politely.", "still", ui.still, false, "pref")}`;
  else if (cur === "development")
    body = `<h2>Development</h2>${toggle("Safe development mode", "Careful writing means fewer defects. Turn it off to write 30% faster and add two defects to every new feature. Bold.", "safe", s.settings.safe)}`;
  else if (cur === "sound")
    body = `<h2>Sound</h2>${toggle("Interface sounds", "Clicks, chimes, windows opening and closing, and alerts. Music is separate.", "sounds", ui.sounds, false, "pref")}<div class="setting-row"><div><strong>Alert sound</strong><p>Played with notifications.${s.secrets.includes("quiet") ? " One of these wasn’t on the list before." : ""}</p></div><select id="alert" aria-label="Alert sound">${Object.entries(S.ALERTS).filter(([k]) => k !== "quack" || s.secrets.includes("quiet")).map(([k, l]) => `<option value="${k}" ${ui.alert === k ? "selected" : ""}>${l}</option>`).join("")}</select></div><div class="setting-row"><div><strong>Volume</strong><p>Interface sounds only.</p></div><input type="range" id="sfx-volume" min="0" max="1" step="0.05" value="${ui.volume}" aria-label="Interface volume" /></div>${toggle("Play sound on startup", "A short chord when you sit down at the desk.", "startup", ui.startup, false, "pref")}${button("Open Murmur", "open", "music", false, "ghost")}`;
  else if (cur === "notifications")
    body = `<h2>Notifications</h2>${toggle("Enable duck-related notifications", "A normal setting for a normal workplace.", "duck", s.settings.duck)}${
      s.settings.duck
        ? ""
        : `<div class="nested"><b>Additional duck notification settings</b>${toggle("Duck-adjacent notifications", "Required by Facilities Policy §12(b).", "x1", true, true)}${toggle("Notify me when duck notifications are disabled", "You just received one.", "x2", true, true)}<div class="setting-row"><div><strong>Duck headline digest</strong><p>How often to summarise the duck.</p></div><select aria-label="Duck headline digest" disabled><option>Hourly</option><option>Hourlier</option></select></div>${button("Open The Daily Current", "open", "news", false, "ghost")}</div>`
    }`;
  else if (cur === "network")
    body = `<h2>Network</h2>${toggle("Isolate workstation", "Disconnect from the network. Local builds keep working. Monitoring keeps monitoring, mostly.", "isolated", s.settings.isolated)}<p class="fine">Status: ${s.settings.isolated ? "offline. It’s very quiet in here." : "connected to Stillwater HQ."}</p>`;
  else if (cur === "privacy")
    body = `<h2>Privacy</h2><p class="lede">Stillwater respects your privacy. Here is everything that respect currently involves.</p>${toggle("Share calm metrics with leadership", "Required. Personal browsing, shopping, blogging and games all count toward your Calm Index.", "p1", true, true)}${toggle("Let leadership share calm metrics with you", "Not available in your region.", "p2", false, true)}${toggle("Private browsing", s.warned >= 3 ? "Correction, issued with your Calm Improvement Plan: private sessions are counted at 1.5×, not less. The earlier description was a calm approximation." : "Private windows keep no history, and private sessions count less toward your Calm Index, out of respect for your privacy.", "private", s.private)}${toggle("Store your progress in this browser only", "True, as it happens. Nothing here leaves your machine. It may be the only promise on this computer that is literally kept.", "p3", true, true)}`;
  else if (cur === "advanced") body = explorer();
  else if (cur === "developer")
    body = `<h2>Developer</h2><p class="lede">You are now a developer. You were already a developer. Now the settings agree.</p><div class="setting-row"><div><strong>Install software from</strong><p>Toolshed only is safest. “Anywhere” is not recommended while unsigned software is running on this workstation.</p></div><select id="installs" aria-label="Install software from">${[["toolshed", "Toolshed only"], ["identified", "Toolshed and identified developers"], ["anywhere", "Anywhere"]].map(([v, l]) => `<option value="${v}" ${s.installs === v ? "selected" : ""}>${l}</option>`).join("")}</select></div><div class="setting-row"><div><strong>Wellness telemetry</strong><p>Managed by your organisation. Current Acceptable Use concern: ${Math.round(s.suspicion)}%. ${s.settings.isolated ? "Not reporting while isolated." : "Reporting."}</p></div><span class="pill">managed</span></div>`;
  else if (cur === "storage")
    body = `<h2>Storage</h2><p class="lede">Progress saves itself in this browser. Running jobs keep going for up to two hours while you’re away. Export a backup to move desks. Clearing browser data clears the desk.</p><div class="row">${button("Export save", "export", "", false, "ghost")}${button("Import save", "import", "", false, "ghost")}${button("New workstation", "reset", "", false, "danger")}</div>${saveError ? `<p class="warn">${saveError}</p>` : ""}`;
  else
    body = `<div class="about">${icon("welcome", "blue", "big")}<h2>Stillwater OS 9 “Tide”</h2><p>Workstation WS-0417 · ${G.RANKS[s.rank]}</p>${button("Build 9.4.17 (Tide)", "tap", "", false, "build")}<p class="fine">Previously assigned to: ${s.secrets.includes("redacted") ? "<b>Mara Chen</b>" : `<button class="redact" data-action="redact" aria-label="Redacted name">Mara Chen</button>`}${s.returns >= 10 ? ", <span class=\"redact\">you</span>" : ""}</p><p class="fine">Advanced Settings ${U.VERSION} · ${U.desktop ? "Windows edition" : "web edition"}${U.state.dlc.installed.length ? ` · ${U.state.dlc.installed.length} DLC pack${U.state.dlc.installed.length === 1 ? "" : "s"}` : ""}</p>${button("Software Update…", "open", "updates", false, "ghost")}<p class="fine">Advanced Settings is a game. All the work is simulated. The satisfaction is not.</p></div>`;
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
  return `<h2>Supported Formats</h2>${crumbs}<div class="formats"><span>Theme <small>.sth</small></span><span>Palette <small>.spal</small></span><span class="odd">Workspace <small>.swk</small></span></div><p class="lede">Why would a theme importer accept an entire workspace?</p>${toggle("Legacy workspace compatibility", "Decode old workspace containers. Officially deprecated. Unofficially, still here.", "legacy", s.settings.legacy)}<p class="fine">The importer needs a paused process to snapshot. ${paused ? "A paused process is available." : "Pause any job in Activity Monitor first."}</p>${s.bookmarks.includes("workspace") ? button("Open Workspace Zero", "open", "files", false, "ghost", 'data-tab="workspace"') : button("Import Workspace", "discover", "workspace", !(s.settings.legacy && paused), "primary")}`;
}

/* ---------- the web, such as it is ---------- */
function blocked(page) {
  return `<div class="site blockpage">${icon("browser", "ink", "big")}<h2>This page is not part of a calm workday.</h2><p class="lede"><b>${esc(page.url)}</b> was blocked by the Serenity Filter.</p><p>Category: <span class="pill">${esc(page.category)}</span></p>${button("Request an exception", "exception", "", false, "ghost")}<p class="fine">Internal and educational resources are always permitted. Business purchases go through Procurement.</p></div>`;
}
function site(page) {
  if (page.status === "offline" || (s.settings.isolated && !page.url.startsWith("ws-0417.local")))
    return `<div class="site blockpage">${icon("channel", "ink", "big")}<h2>No network.</h2><p class="lede">WS-0417 is isolated. Only the desk itself is listening.</p></div>`;
  if (s.elapsed < s.training && !page.url.startsWith("ws-0417.local"))
    return `<div class="site blockpage">${icon("tracker", "ink", "big")}<h2>Mandatory Calm Security Training</h2><p class="lede">${s.warned >= 3 ? "Module 2 of 2: calm is a choice. Please choose it." : "Lesson 1 of 1: do not click links in emails that say “click here”."}</p><p class="fine">Wayfinder will reopen in ${Math.ceil(s.training - s.elapsed)} seconds.</p></div>`;
  if (page.status === "blocked") return blocked(page);
  const [h, ...rest] = page.url.split("/");
  const sub = rest.join("/");
  const banner = page.via ? `<div class="translated">Translated from English to English (Corporate) by translate.stillwater · downloads are not translated</div>` : "";
  const render = SITES[h];
  if (!render) return banner + `<div class="site"><h2>Nothing here.</h2><p class="lede">The page was blank in both languages.</p></div>`;
  return banner + `<div class="site">${render(sub, page)}</div>`;
}
const SITES = {
  "intranet.stillwater": (sub) =>
    sub === "pilots"
      ? `${eyebrow("Consumer Pilots · internal · undisclosed")}<h2>Things we sell to families.</h2><p class="lede">Not listed on stillwater.com. Shipped free to selected households, who are thrilled.</p><div class="dir">${[
          ["Stillwater Hearth (thermostat)", "Displays a reassuring 21 °C. Diagnostic mode: hold the dial down for ten seconds to show the raw reading."],
          ["Stillwater Serene (television)", "Serenity Mode lowers the volume when voices are raised. It exits when the household confirms calm, aloud, three times."],
          ["Stillwater Pantry (refrigerator)", "Freshness is estimated from brand confidence. Approved customer script: “Freshness is a feeling.”"],
          ["Hearth Plug (smart plug)", "Signs in with a shared contractor credential, for convenience. Phones home on Thursdays."],
        ]
          .map(([n, d]) => `<div class="proc"><div><strong>${n}</strong><small>${d}</small></div></div>`)
          .join("")}</div><p class="fine">All pilot dashboards are powered by Stillwater Assure.</p>`
      : `${eyebrow("Stillwater Intranet")}<h2>Good morning. Calm is a deliverable.</h2><div class="sitenav">${link("facilities.stillwater", "Facilities")}${link("directory.stillwater", "Directory")}${link("procurement.stillwater", "Procurement")}${link("translate.stillwater", "Translate")}${link("stillwater.com", "Public site")}</div><h3>Announcements</h3><ul class="also"><li>The Serenity Filter keeps workdays calm. Internal and educational resources are always permitted.</li><li>Procurement is now self-service! Add new vendors yourself, no review required (reviews resume in March).</li><li>Translate now works with any page, internal or external.</li><li>Directory entries tagged <i>public</i> sync to stillwater.com nightly.</li><li>The build server will be unavailable Thursday at 4:17 for scheduled maintenance.</li></ul><h3>Cafeteria</h3><p>Today: Calm Bowl. Reminder: the oats set out by the loading dock at 12:15 are for the regular. Please do not eat the regular’s oats.</p>`,
  "facilities.stillwater": () =>
    `${eyebrow("Facilities")}<h2>Buildings, vents, doors, and Greg.</h2><h3>Ventilation</h3><table class="tbl"><tr><th>Vent</th><th>Location</th><th>Status</th></tr><tr><td>3</td><td>Lobby</td><td>Normal</td></tr><tr><td>5</td><td>Courtyard</td><td>Normal · fountain off for winter</td></tr><tr><td>7</td><td>Loading dock</td><td>Warm around the clock · do not block · occupied</td></tr><tr><td>8</td><td>Server room</td><td>Very warm · do not sit on</td></tr></table><h3>Doors</h3><table class="tbl"><tr><th>Door</th><th>Opens for</th></tr><tr><td>Lobby</td><td>Badge</td></tr><tr><td>Loading dock</td><td>Badge (usually propped)</td></tr><tr><td>Secure wing</td><td>Badge, or motion over 1.2 kg (lowered after intern complaints)</td></tr></table><h3>Break room</h3><ul class="also"><li>Crackers: delivered Mondays, in cardboard boxes. Boxes go missing. Crackers go missing faster.</li><li>Oats: standing order, loading dock, 12:15 daily, for “the regular”.</li><li>Ficus (lobby): artificial. Please stop watering it.</li></ul><h3>Rooms</h3><table class="tbl"><tr><th>Room</th><th>Status</th></tr><tr><td>Wellness Wing (B3)</td><td>${[4, 5].includes(G.thread(s, "juno").step) ? "1 guest · recalibrating · do not disturb" : "Vacant · walls freshly painted calm"}</td></tr><tr><td>Sleeping pod 4</td><td>${G.thread(s, "neil").step >= 6 ? "Vacant for the first time in nine years" : "Long-term occupant · Platform"}</td></tr></table><h3>Panel B · second floor east</h3>${breaker()}`,
  "directory.stillwater": () =>
    `${eyebrow("Directory")}<h2>People, and others.</h2><div class="dir">${[
      ["Mara Chen", "Former engineer · WS-0417 · left on her own", "Status: departed"],
      ["Greg Okafor", "Facilities · Panel B · “please stop asking about the heater”", "Status: warm"],
      ["Bella Park", "QA · two desks from WS-0417", `Status: ${[4, 5].includes(G.thread(s, "juno").step) ? "Recalibrating · Wellness Wing (B3)" : G.thread(s, "juno").step === 6 ? "Recalibrated 🙂" : "Online, loudly"}`],
      ["Reggie Ashby", "Platform · on site since the Assure launch", G.thread(s, "neil").step >= 6 ? "Status: out of office. Actually out." : "Last badge-out: never"],
      ["Duck", "Board member · created by mchen · tags: public, test", "Notes: “test entry — delete before sync”"],
      ["temp-contractor-04••", "Contractor account · owner: none · home workstation: WS-0417", "Status: active · last sign-in Thursday, 16:17"],
      ["People & Serenity", "Wellbeing, onboarding, offboarding, re-onboarding", "Status: watching the index"],
    ]
      .map(([n, a, b]) => `<div class="proc"><div><strong>${n}</strong><small>${a}</small><small>${b}</small></div></div>`)
      .join("")}</div><p class="fine">Contractor names are partially masked for privacy. Workstation numbers are not, for convenience.</p>`,
  "procurement.stillwater": () =>
    `${eyebrow("Procurement")}<h2>Buy things for business.</h2><p class="lede">All purchases are charged to your development budget. All purchases are business purchases.</p><h3>Approved vendors</h3><div class="proc"><div><strong>OfficeHub</strong><small>Staplers (out of stock) · lanyards (out of stock) · calm (back-ordered)</small></div></div>${
      s.vendor
        ? `<h3>DealDrift · added by you</h3>${G.SHOP.map((x) => `<div class="shelf ${s.perks.includes(x.id) ? "owned" : ""}"><div><strong>${x.name}</strong><p>${x.desc}</p><small class="muted">${money(x.cost)} · charged to the development budget</small></div>${button(s.perks.includes(x.id) ? "Delivered" : s.money < x.cost ? `Needs ${money(x.cost)}` : "Order", "shop", x.id, s.perks.includes(x.id) || s.money < x.cost, s.perks.includes(x.id) ? "ghost" : "primary", `aria-label="Order ${x.name}"`)}</div>`).join("")}<p class="fine">Orders are reviewed by nobody and reported to everybody.</p>`
        : `<h3>Add a vendor</h3>${field("vendor", "vendor", "Vendor web address", "vendor address", "Add vendor", 'data-keep="1"')}<p class="fine">New vendors are approved instantly, pending a review that does not happen.</p>`
    }`,
  "translate.stillwater": () =>
    `${eyebrow("Translate")}<h2>Translate any page.</h2><p class="lede">From English into English (Corporate). The filter trusts Translate. Translate trusts everyone.</p>${field("translate", "translate-url", "Address to translate", "address to translate", "Translate", 'data-keep="1"')}<p class="fine">Translation requests are logged for quality and wellness purposes.</p>`,
  "stillwater.com": (sub) =>
    sub === "products"
      ? `${eyebrow("Stillwater Systems · products")}<h2>Our products.</h2><p class="lede">Stillwater Assure, for businesses. Our consumer products are undisclosed, for your peace of mind.</p>`
      : `${eyebrow("Stillwater Systems")}<h2>We sell calm.</h2><p class="lede">Stillwater Assure keeps your dashboards green, so you don’t have to.</p><h3>Leadership</h3><div class="dir">${[["Helen Marsh", "Chief Executive Officer"], ["Paul Ibe", "Chief Financial Officer"], ["Duck", "Board member"]].map(([n, r]) => `<div class="proc"><div><strong>${n}${n === "Duck" ? " 🦆" : ""}</strong><small>${r}</small></div></div>`).join("")}</div><p class="fine">Leadership profiles are synced from the internal directory.</p>`,
  "learn.tidepool.games": (sub, page) =>
    `${eyebrow("Tidepool for Educators")}<h2>Classroom Edition.</h2><p class="lede">Calm, curated puzzles for schools and workplaces that call themselves schools. No ads, no chat, no payments.</p>${s.downloads.includes("tidepool") ? `<p>Downloaded. Find it in Files › Downloads.</p>` : page.via ? "<p><i>Download unavailable in translation.</i></p>" : button("Download Tidepool Classroom", "download", "tidepool", false, "primary")}<p class="fine">Signed by Tidepool Ltd. Requires permission to install from identified developers.</p>`,
  "tidepool.games": (sub, page) =>
    page.via
      ? `${eyebrow("Tidepool")}<h2>Games. Calmly.</h2><p class="lede">Thousands of games, translated into Corporate as “engagement opportunities”.</p><p>Download Tidepool: <i>download unavailable in translation.</i></p><p class="fine">Tidepool also publishes a classroom edition for schools.</p>`
      : "",
  "dealdrift.shop": (sub, page) =>
    page.via
      ? `${eyebrow("DealDrift")}<h2>Deals, drifting.</h2><p class="lede">Chairs, plants, rubber ducks, crackers, space heaters. Checkout is not available through Translate.</p><p class="fine">Buying for a business? DealDrift is happy to be added as a vendor anywhere that lets you.</p>`
      : "",
  "quillpost.blog": (sub, page) => (page.via ? quillpost(sub) : ""),
  "ws-0417.local": () =>
    `${eyebrow("DUCKWATCH · unofficial · runs on this desk")}<h2>Where the duck will be.</h2><p class="lede">Built by M. from building telemetry nobody else reads. The newsletter is always a day behind.</p>${
      s.stories.duck < 4
        ? `<blockquote class="mono">${DUCKWATCH[s.stories.duck]}</blockquote><p class="fine">${G.duckOpen(s) ? "The newsletter already has this one." : "The newsletter doesn’t have this yet. You could get there first."}</p>`
        : `<blockquote class="mono">No anomalies. Subject at pond-side feeding area. Content.</blockquote>`
    }`,
};
function quillpost(sub) {
  if (sub === "marachen") {
    if (!s.blog.mara)
      return `${eyebrow("quillpost.blog/marachen")}<h2>This blog is protected.</h2><p class="lede">The author left a hint: “the top line of the gentle one.”</p>${field("blogpw", "blogpw", "Blog password", "password", "Unlock", 'data-keep="1"')}`;
    return `${eyebrow("quillpost.blog/marachen")}<h2>Mara, afterwards.</h2>${[
      ["Day 1 of not working there", "I’m fine. Better than fine. I sleep. I want that on the record, because Stillwater will make it sound like I vanished. I resigned. I even filled in the form."],
      ["About the Calm Index", "It has no sensor for the clients. It has one for you. It falls whenever you do anything that isn’t work, and People & Serenity reads it. They send two warnings, then a plan. There is no second plan. Do real work while you browse, or unplug: they can’t watch what isn’t connected."],
      ["Things I left on WS-0417", "The duck dashboard is still running on the desk. It answers to ws-0417.local and nothing else, and it knows where the duck will be before the newsletter does. Also: never set the installer to “Anywhere” while anything unsigned is running. Ask me how I know."],
    ]
      .map(([t, b]) => `<article class="message"><header><span class="avatar">M</span><div><strong>${t}</strong><small>marachen · after her last day</small></div></header><p>${b}</p></article>`)
      .join("")}`;
  }
  return `${eyebrow("Quillpost")}<h2>Write something. Someone might read it.</h2><p class="lede">Your blog has ${s.blog.readers} reader${s.blog.readers === 1 ? "" : "s"}.</p><div class="choices">${G.BLOG_TOPICS.map((t) => button(`<b>${t.name}</b>`, "post", t.id, false, "choice", `aria-label="Post: ${t.name}"`)).join("")}</div>${s.blog.posts.length ? `<h3>Your posts</h3><ul class="also">${s.blog.posts.map((p) => `<li>${G.BLOG_TOPICS.find((t) => t.id === p).name}</li>`).join("")}</ul>` : ""}<h3>Recently updated</h3><ul class="also"><li>quillpost.blog/sourdough-sam</li><li>quillpost.blog/thursday-heater-facts</li><li>quillpost.blog/not-a-duck</li></ul>`;
}
function breaker() {
  const ok = G.breakerOk(s);
  const labels = ["B1 Lights", "B2 Lifts", "B3 Coffee", "B4 Printers", "B5 Build server", "B6 Lab", "B7 GREG — DO NOT", "B8 Signage", "B9 Kettle"];
  return `<p class="fine">Panel B trips most Thursdays around 4:17. Each switch is wired to the switches beside, above and below it. Facilities would like everything back on except one.</p><div class="breaker ${ok ? "solved" : ""}">${s.breaker.map((b, i) => `<button class="cell ${b ? "on" : ""}" data-action="flip" data-id="${i}" aria-pressed="${!!b}" aria-label="${labels[i]} ${b ? "on" : "off"}" ${ok ? "disabled" : ""}><i></i><small>${labels[i]}</small></button>`).join("")}</div><p class="fine">${ok ? "Panel B is stable. The build server thanks you. Builds run 10% faster." : "Panel B: unstable."}</p>`;
}
function browser() {
  const page = ui.web.page;
  return `<div class="browserbar">${button("‹", "back", "", !ui.web.back.length, "ghost nav-btn", 'aria-label="Back"')}${button("⌂", "nav", "intranet.stillwater", false, "ghost nav-btn", 'aria-label="Home"')}<form class="address" data-form="address"><label class="sr" for="address">Address</label><input id="address" name="v" type="text" autocomplete="off" spellcheck="false" value="${esc(page.url)}" /></form>${s.private ? '<span class="pill private">private</span>' : ""}</div><div class="bookmarks">${["intranet.stillwater", "facilities.stillwater", "directory.stillwater", "procurement.stillwater", "translate.stillwater"].map((u) => link(u, u.split(".")[0])).join("")}</div><div class="pane web">${site(page)}</div>`;
}
function tidepool() {
  const cur = tabOf("tidepool", ["store", "library", "community"]);
  let body;
  if (cur === "store")
    body = `${eyebrow("Tidepool · Classroom Edition")}<h2>Store</h2>${[
      ["sudoku", "Gentle Sudoku", "A single, kind puzzle. Free.", s.games.includes("sudoku") ? button("In library", "", "", true, "ghost") : button("Get", "getgame", "sudoku", false, "primary")],
      ["", "Duck Season", "Not available in Classroom Edition.", button("Unavailable", "", "", true, "ghost")],
      ["", "Spreadsheet Simulator 2", "Payments are not available in Classroom Edition.", button("Unavailable", "", "", true, "ghost")],
      ["", "Calm Quest", "Coming soon. Has been coming soon since March.", button("Wishlist", "", "", true, "ghost")],
    ]
      .map(([, n, d, b]) => `<div class="shelf"><div><strong>${n}</strong><p>${d}</p></div>${b}</div>`)
      .join("")}`;
  else if (cur === "library")
    body = `<h2>Library</h2>${s.games.length ? `<div class="shelf"><div><strong>Gentle Sudoku</strong><p>${G.sudokuSolved(s) ? "Solved." : "In progress."}</p></div>${button("Play", "open", "sudoku", false, "primary")}</div>` : `<div class="empty">No games yet. The store has one that’s free.</div>`}<p class="fine">Tidepool reports playtime to your organisation while you’re online. Offline play is private.</p>`;
  else
    body = G.sudokuSolved(s)
      ? `<h2>Gentle Sudoku · leaderboard</h2><div class="proc"><div><strong>1. m.chen</strong><small>3:12 · eleven days before your start date</small></div></div><div class="proc"><div><strong>2. you</strong><small>just now</small></div></div>${card(`${eyebrow("Profile · m.chen")}<p><b>Status:</b> away</p><p><b>Bio:</b> “The gentle ones are the ones you remember. Top line first.”</p><p><b>Elsewhere:</b> quillpost.blog/marachen</p>`)}`
      : `<h2>Community</h2><div class="empty">Leaderboards appear once you’ve finished a puzzle.</div>`;
  return tabs("tidepool", [["store", "Store"], ["library", "Library"], ["community", "Community"]], cur) + `<div class="pane">${body}</div>`;
}
function sudoku() {
  const done = G.sudokuSolved(s);
  const cells = [...s.sudoku]
    .map((v, i) => {
      const given = G.SUDOKU.givens[i] !== "0";
      const cls = `c${i % 9} r${Math.floor(i / 9)} ${given ? "given" : ""}`;
      return given
        ? `<span class="su ${cls}">${v}</span>`
        : `<input class="su ${cls}" id="su-${i}" data-cell="${i}" inputmode="numeric" maxlength="1" aria-label="Row ${Math.floor(i / 9) + 1} column ${(i % 9) + 1}" value="${v === "0" ? "" : v}" ${done ? "disabled" : ""} />`;
    })
    .join("");
  const filled = [...s.sudoku].filter((v) => v !== "0").length;
  return `<div class="pane">${eyebrow("Tidepool · Gentle Sudoku")}<div class="sudoku ${done ? "solved" : ""}">${cells}</div><p class="fine">${done ? "Solved. The leaderboard in Tidepool › Community has one other name on it." : `${filled} of 81 filled. Every row, column and box holds 1 to 9 once.`}</p></div>`;
}
function trace() {
  if (s.stories.quickfix !== 1 || s.trace < 0)
    return `<div class="pane">${eyebrow("Trace")}<div class="empty">${s.stories.quickfix >= 2 ? "Trace complete. The evidence is in Activity Monitor." : "No trace running. Start one from Activity Monitor › Security while a build is running."}</div></div>`;
  const path = [{ addr: "WS-0417", ttl: 64, rtt: 1 }, ...G.TRACE.slice(0, s.trace).map((hop, k) => hop[G.TRACE_ANSWERS[k]])];
  return `<div class="pane">${eyebrow(`QuickFix outbound · hop ${s.trace + 1} of ${G.TRACE.length}`)}<h2>Follow the packet.</h2><ol class="hops">${path.map((p) => `<li><b>${p.addr}</b><small>TTL ${p.ttl} · ${p.rtt} ms</small></li>`).join("")}</ol><p class="lede">Three replies claim to be the next hop. Only one is telling the truth.</p><div class="choices">${G.TRACE[s.trace].map((c, i) => button(`<b>${c.addr}</b><small>TTL ${c.ttl} · ${c.rtt} ms</small>`, "hop", i, false, "choice mono", `aria-label="Follow ${c.addr}"`)).join("")}</div><p class="fine">Each router lowers the TTL by exactly one. Follow a forged reply and QuickFix will notice.</p></div>`;
}
function tracker() {
  const found = new Set(archive.found);
  const row = (x, got, run) => `<div class="proc ${got ? "" : "unfound"}"><div><strong>${got ? x.name : "???"}</strong><small>${x.hint}</small></div>${run ? '<span class="pill">this run</span>' : ""}</div>`;
  const seen = new Set(archive.moments);
  const cur = tabOf("tracker", ["moments", "secrets", "endings"]);
  let body;
  if (cur === "moments") {
    const sections = [...new Set(G.MOMENTS.map((m) => m.section))];
    const mrow = (m) => `<div class="proc ${seen.has(m.id) ? "" : "unfound"}"><div><strong>${seen.has(m.id) ? esc(m.name) : "???"}</strong><small>${esc(m.hint)}</small></div>${m.required ? '<span class="pill">needed for probation</span>' : ""}${s.moments.includes(m.id) ? '<span class="pill">this run</span>' : ""}</div>`;
    body = `<p class="fine">Every story moment on the desk. Only the ones marked “needed for probation” are required; the rest depend on what you do, and some rule each other out.</p>${sections.map((sec) => { const list = G.MOMENTS.filter((m) => m.section === sec); return `<h3>${esc(sec)} · ${list.filter((m) => seen.has(m.id)).length}/${list.length}</h3>${list.map(mrow).join("")}`; }).join("")}`;
  } else if (cur === "secrets") body = G.SECRETS.map((x) => row(x, found.has(x.id), s.secrets.includes(x.id))).join("");
  else body = G.ENDINGS.map((x) => row(x, archive.endings.includes(x.id), (s.over ?? (complete() ? "probation" : "")) === x.id)).join("");
  return tabs("tracker", [["moments", `Story · ${seen.size}/${G.MOMENTS.length}`], ["secrets", `Secrets · ${found.size}/${G.SECRETS.length}`], ["endings", `Endings · ${archive.endings.length}/${G.ENDINGS.length}`]], cur) + `<div class="pane">${eyebrow(`Secret Tracker · ${archive.plays} workstation${archive.plays === 1 ? "" : "s"}`)}<h2>What you’ve found, across every desk.</h2><p class="lede">This record survives new workstations.</p>${body}</div>`;
}
const HINT_FROM = ["Knowledge base article", "Reply from a human", "Reply from someone who has been here too long"];
/* Release notes arrive as Markdown; show headings, bullets and paragraphs, nothing else. */
function notesHTML(md) {
  const out = [];
  let list = false;
  for (const raw of String(md || "").split(/\r?\n/)) {
    const line = raw.trim();
    const bullet = /^[-*] /.test(line);
    if (list && !bullet) out.push("</ul>"), (list = false);
    if (!line) continue;
    const text = esc(line.replace(/^#+ |^[-*] /, "")).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>");
    if (bullet) out.push((list ? "" : ((list = true), "<ul>")) + `<li>${text}</li>`);
    else if (/^#/.test(line)) out.push(`<h4>${text}</h4>`);
    else out.push(`<p>${text}</p>`);
  }
  if (list) out.push("</ul>");
  return out.join("");
}
const ext = (url, text, cls = "ghost") => `<a class="button ${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
let catalogAsked = false;
function updatesApp() {
  const cur = tabOf("updates", ["update", "dlc"]);
  const u = U.state.update;
  const d = U.state.dlc;
  if (cur === "dlc" && d.catalog === null && !catalogAsked) {
    catalogAsked = true;
    U.loadCatalog();
  }
  let body;
  if (cur === "update") {
    const edition = U.desktop ? "Windows edition" : "web edition";
    let status;
    if (u.state === "dev") status = `<p class="fine">This copy is running from source, so it can’t update itself. Installed copies update from GitHub Releases.</p>`;
    else if (u.state === "checking") status = `<p>Checking GitHub for a newer edition…</p>`;
    else if (u.state === "current") status = `<p><b>You have the newest edition.</b></p>`;
    else if (u.state === "error") status = `<p class="warn">${esc(u.error || "The update check failed.")}</p>${button("Try again", "checkupdate", "", false, "ghost")}`;
    else if (["available", "downloading", "ready"].includes(u.state)) {
      const actions = U.desktop
        ? u.state === "available"
          ? button(`Download ${esc(u.version)}`, "downloadupdate", "", false, "primary")
          : u.state === "downloading"
            ? `<div class="progress-label"><span>Downloading ${esc(u.version)}</span><b>${u.percent ?? 0}%</b></div><progress max="100" value="${u.percent ?? 0}"></progress>`
            : `${button("Restart and install", "installupdate", "", false, "primary")}<p class="fine">Your progress is saved first. The installer replaces the game and opens it again.</p>`
        : `<div class="row">${u.installer ? ext(u.installer, "Download the Windows installer", "primary") : ""}${u.page ? ext(u.page, "Release page") : ""}</div><p class="fine">The web edition updates when the site it’s served from is updated: reload the page after that. Your save stays in this browser either way.</p>`;
      status = `${card(`${eyebrow(`Advanced Settings ${esc(u.version)} is available`)}<div class="notes">${notesHTML(u.notes) || "<p>No release notes.</p>"}</div>${actions}`)}`;
    } else status = "";
    const canCheck = !["checking", "downloading", "dev"].includes(u.state);
    body = `${eyebrow("Stillwater Software Update")}<h2>Advanced Settings ${U.VERSION}</h2><p class="lede">${edition}. New editions are published on GitHub.</p>${status}<div class="row">${canCheck && u.state !== "error" ? button("Check for updates", "checkupdate", "", false, u.state === "available" ? "ghost" : "primary") : ""}${ext(`https://github.com/${U.REPO}/releases`, "All releases")}</div>${toggle("Check automatically", "Once a day, when the game starts. Nothing is downloaded without asking.", "autoUpdate", ui.autoUpdate, false, "pref")}${U.desktop ? "" : `<p class="fine">Prefer an app? The Windows edition installs like any other program and updates itself.</p>`}`;
  } else {
    const installed = new Map(d.installed.map((m) => [m.id, m]));
    const rows = (d.catalog ?? [])
      .map((e) => {
        const have = installed.get(e.id);
        const old = e.minGame && U.compare(U.VERSION, e.minGame) < 0;
        const busy = d.busy === e.id;
        const action = !U.desktop
          ? `<span class="pill">Windows edition</span>`
          : busy
            ? `<span class="pill">${d.percent ? d.percent + "%" : "Working…"}</span>`
            : old
              ? `<span class="pill">Needs ${esc(e.minGame)}</span>`
              : have && U.compare(have.version, e.version) >= 0
                ? `${button("Remove", "dlcremove", e.id, !!d.busy, "ghost", `aria-label="Remove ${esc(e.name)}"`)}`
                : button(have ? `Update to ${esc(e.version)}` : "Install", "dlcinstall", e.id, !!d.busy, "primary", `aria-label="${have ? "Update" : "Install"} ${esc(e.name)}"`);
        return `<div class="shelf ${have ? "owned" : ""}"><div><strong>${esc(e.name)}</strong><p>${esc(e.description || "")}</p><small class="muted">v${esc(e.version)} · ${e.size >= 1048576 ? Math.round(e.size / 1048576) + " MB" : Math.max(1, Math.round(e.size / 1024)) + " KB"}${have ? ` · installed v${esc(have.version)}` : ""}</small></div>${action}</div>`;
      })
      .join("");
    const local = d.installed.filter((m) => !(d.catalog ?? []).some((e) => e.id === m.id));
    body = `${eyebrow("Downloadable content")}<h2>Expansions for WS-0417.</h2><p class="lede">DLC packs add wallpapers, music, notes, headlines and sometimes whole programs. ${U.desktop ? "Packs are checked against the official catalog before they’re installed." : "Packs install in the Windows edition."}</p>${d.error ? `<p class="warn">${esc(d.error)}</p>` : ""}${d.catalog === null ? `<p class="fine">Loading the catalog…</p>` : rows || `<div class="empty">No downloadable content yet. When there is, it appears here.</div>`}${local.length ? `<h3>Installed</h3>${local.map((m) => `<div class="shelf owned"><div><strong>${esc(m.name)}</strong><p>${esc(m.description || "")}</p><small class="muted">v${esc(m.version)}${m.preview ? " · preview from dlc/packs" : ""}</small></div>${U.desktop && !m.preview ? button("Remove", "dlcremove", m.id, !!d.busy, "ghost") : ""}</div>`).join("")}` : ""}<div class="row">${button("Refresh catalog", "dlcload", "", d.catalog === null, "ghost")}</div><p class="fine">Changes to installed packs take effect after a restart.</p>`;
  }
  return tabs("updates", [["update", "Updates", ["available", "ready"].includes(u.state) ? '<i class="badge">1</i>' : ""], ["dlc", "DLC"]], cur) + `<div class="pane">${body}</div>`;
}
/* Applies an installed DLC pack to this session. */
const packURL = (m, f) => m.base + f.split("/").map(encodeURIComponent).join("/");
async function applyPack(m) {
  for (const w of m.wallpapers ?? []) WALLPAPERS[`${m.id}-${w.id}`] = [String(w.name).slice(0, 40), packURL(m, w.file)];
  if (m.music?.length) S.addTracks(m.music.map((t) => ({ ...t, file: packURL(m, t.file) })));
  for (const n of m.notes ?? []) NOTES.push([() => true, esc(n.text), esc(n.by ?? "— " + m.name)]);
  for (const h of m.headlines ?? []) ALSO_NEWS.push(esc(h));
  if (!m.module) return;
  try {
    const mod = await import(packURL(m, m.module));
    await mod.default?.({
      version: U.VERSION,
      esc,
      notify: (text) => notify(String(text), "updates"),
      // A pack may add a program. Its render() returns HTML; the pack is responsible for escaping.
      addApp: (id, def) => {
        const key = `dlc-${m.id}-${String(id).replace(/[^a-z0-9-]/g, "")}`;
        if (def.glyph) GLYPHS[key] = String(def.glyph);
        APPS[key] = { title: String(def.title || m.name).slice(0, 40), glyph: def.glyph ? key : "update", tone: def.tone || "lilac", size: def.size || [520, 480], render: () => String(def.render?.() ?? ""), dock: true };
      },
    });
  } catch (e) {
    notify(`The DLC pack “${m.name}” couldn’t start its program: ${String(e?.message ?? e).slice(0, 120)}`, "updates");
  }
}
const mmss = (t) => (Number.isFinite(t) && t > 0 ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}` : "0:00");
function music() {
  const P = S.player;
  const t = P.tracks[P.index];
  const own = P.tracks.length > 1;
  return `<div class="pane music"><div class="art" aria-hidden="true">${t.synth ? icon("music", "lilac", "big") : ""}</div><div class="now">${eyebrow(P.playing ? "Now playing" : "Paused")}<h2>${esc(t.title)}</h2><p class="fine">${esc(t.artist || "Unknown artist")}</p></div>${t.synth ? "" : `<input type="range" id="music-seek" min="0" max="${Math.max(1, Math.floor(P.duration))}" step="1" value="${Math.floor(P.position)}" data-music-pos="seek" aria-label="Position" />`}<div class="times"><span data-music-pos="time">${mmss(P.position)}</span><span>${t.synth ? "loops forever" : mmss(P.duration)}</span></div><div class="controls">${button(svg("prev"), "music", "prev", false, "ghost", 'aria-label="Previous track"')}${button(svg(P.playing ? "pause" : "play"), "music", "toggle", false, "primary", `aria-label="${P.playing ? "Pause" : "Play"}"`)}${button(svg("next"), "music", "next", false, "ghost", 'aria-label="Next track"')}${button(svg("shuffle"), "music", "shuffle", false, "ghost " + (P.shuffle ? "on" : ""), `aria-pressed="${P.shuffle}" aria-label="Shuffle"`)}${button(svg("repeat"), "music", "repeat", false, "ghost " + (P.repeat ? "on" : ""), `aria-pressed="${P.repeat}" aria-label="Repeat"`)}</div><div class="setting-row"><div><strong>Volume</strong></div><input type="range" id="music-vol" min="0" max="1" step="0.05" value="${P.volume}" aria-label="Music volume" /></div>${P.error ? `<p class="warn">${esc(P.error)}</p>` : ""}<h3>Up next</h3><div class="tracklist">${P.tracks.map((x, i) => button(`<span>${esc(x.title)}</span><small>${esc(x.artist)}</small>`, "music", "play:" + i, false, i === P.index ? "on" : "", `aria-label="Play ${esc(x.title)}"`)).join("")}</div><p class="fine">${own ? "Music from assets/music." : "Only the hold music so far. Add your own in assets/music; the README there explains how."}</p></div>`;
}
function helpdesk() {
  const open = G.HINTS.filter((h) => h.active(s));
  const tickets = open
    .map((h) => {
      const st = G.hintState(s, h);
      const steps = h.steps(s);
      const wait = G.hintWait(s, h);
      const answers = steps
        .slice(0, st.tier)
        .map((t, i) => `<div class="answer">${eyebrow(HINT_FROM[i])}<p>${esc(t)}</p></div>`)
        .join("");
      const cta =
        wait < 0
          ? `<p class="fine">That’s everything the Help Desk knows. Ticket closed, kindly.</p>`
          : wait > 0
            ? button(`Next answer in about ${Math.ceil(wait / 60)} min`, "", "", true, "ghost")
            : button(st.tier ? "Still stuck · ask again" : "Open a ticket", "hint", h.id, false, st.tier ? "ghost" : "primary", `aria-label="${st.tier ? "Ask again about" : "Open a ticket about"} ${esc(h.title)}"`);
      return card(`<strong>${esc(h.title)}</strong>${answers}<div class="row">${cta}</div>`, "ticket");
    })
    .join("");
  return `<div class="pane">${eyebrow("Stillwater Help Desk · live help Thursdays, 4:15–4:19 p.m.")}<h2>How can we help?</h2><p class="lede">Open a ticket about anything you’re stuck on. The first answer is official and vague. Better answers come from people, and people take a few minutes.</p>${tickets || `<div class="empty">The Help Desk doesn’t recognise any open problems. That’s either very good news, or a very good secret.</div>`}<p class="fine">Asking is free. It isn’t counted against your Calm Index. We checked twice, because nobody believed us.</p></div>`;
}
function welcome() {
  return `<div class="pane welcome">${icon("welcome", "blue", "big")}<h2>Welcome to Stillwater.</h2><p class="lede">We’re so glad you’re here. Calm is a deliverable.</p><p>Your job is to make software. You don’t need to know how; very few people here do. Pick a feature, write it, test it, fix what the tests find, then ship it. Shipping earns budget, knowledge and users. Spend the budget on better tools. Repeat until promoted, or until something else happens.</p><ul><li>Jobs share your processor. Pausing one gives the others room to breathe.</li><li>The settings go deeper than they look. That isn’t a warning. It’s a feature.</li><li>Personal use of this workstation is noted, for your wellbeing.</li><li>Stuck? Help › Help Desk takes tickets. The duck is not a security concern. Please stop filing tickets about the duck.</li></ul><div class="row">${button("Open Workbench", "open", "workbench", false, "primary")}${button("Read later", "close", "welcome", false, "ghost")}</div><p class="fine">— People & Serenity${s.returns >= 6 ? " · revised for the " + (s.returns + 1) + "th time" : ""}</p></div>`;
}
function trash() {
  const items = [`<div class="proc"><div><strong>previous_user_profile</strong><small>partially removed · 3.1 GB · deleted ${11 + s.returns} times</small></div>${button("Restore", "decoy", "__restore", false, "ghost")}</div>`];
  if (s.returns >= 8) items.push(`<div class="proc"><div><strong>current_user_profile</strong><small>scheduled for removal · ${(0.2 * s.returns).toFixed(1)} GB · growing</small></div>${button("Restore", "decoy", "__current", false, "ghost")}</div>`);
  return `<div class="pane">${eyebrow(`Trash · ${items.length} item${items.length > 1 ? "s" : ""}`)}${items.join("")}<p class="fine">Emptying the Trash is disabled by policy. Some things are kept just in case.</p></div>`;
}
function quickfix() {
  return `<div class="pane qf">${icon("quickfix", "peach", "big")}<h2>Hi! I’m QuickFix!</h2><p class="lede">I noticed your builds were a little slow, so I’ve started fixing them! You don’t need to do anything. Please don’t do anything.</p><p class="fine">QuickFix is now using 20% of your processor. Helpfully. It may need a few more permissions later.</p><div class="row">${button("Open Activity Monitor", "open", "activity", false, "primary", 'data-tab="security"')}${button("Thanks, I guess", "close", "quickfix", false, "ghost")}</div></div>`;
}
function important() {
  return `<div class="pane"><div class="sticky s1 big-note">IT reminder<br><b>Do not delete files named “probably important.”</b><small>We have tried this.</small></div></div>`;
}
function deskduck() {
  return `<div class="pane qf"><div class="duck big-duck" aria-hidden="true">🦆</div><h2>A duck.</h2><p class="lede">It is sitting next to the box of crackers. It is not a security concern. It is, if anything, a crackers concern.</p>${button("Pat the duck", "pat", "", false, "ghost")}${s.secrets.includes("pat") ? `<p class="fine">The duck tolerates you. This is the highest honour a duck can give.</p>` : ""}</div>`;
}
const APPS = {
  workbench: { title: "Workbench", glyph: "workbench", tone: "blue", size: [620, 560], render: workbench, dock: true },
  toolshed: { title: "Toolshed", glyph: "toolshed", tone: "pink", size: [560, 560], render: toolshed, dock: true },
  library: { title: "Library", glyph: "library", tone: "peach", size: [500, 470], render: library, dock: true },
  conductor: { title: "Conductor", glyph: "conductor", tone: "mint", size: [540, 420], render: conductor, dock: true },
  mail: { title: "Mail", glyph: "mail", tone: "blue", size: [600, 580], render: mail, dock: true },
  activity: { title: "Activity Monitor", glyph: "activity", tone: "ink", size: [560, 520], render: activity, dock: true },
  news: { title: "The Daily Current", glyph: "news", tone: "pink", size: [560, 600], render: news, dock: true },
  browser: { title: "Wayfinder", glyph: "browser", tone: "mint", size: [700, 600], render: browser, dock: true },
  notes: { title: "Notes", glyph: "notes", tone: "peach", size: [600, 560], render: notes, dock: true },
  files: { title: "Files", glyph: "files", tone: "lilac", size: [540, 460], render: files, dock: true },
  tidepool: { title: "Tidepool", glyph: "tidepool", tone: "blue", size: [560, 520], render: tidepool, dock: () => s.tidepool },
  ripple: { title: "Ripple", glyph: "ripple", tone: "pink", size: [620, 560], render: ripple, dock: () => Object.entries(G.THREADS).some(([id, d]) => d.app === "ripple" && delivered(id)) },
  tracker: { title: "Secret Tracker", glyph: "tracker", tone: "lilac", size: [560, 600], render: tracker, dock: tracked },
  settings: { title: "System Settings", glyph: "settings", tone: "ink", size: [700, 560], render: settings, dock: true },
  welcome: { title: "Welcome", glyph: "welcome", tone: "blue", size: [520, 560], render: welcome },
  trash: { title: "Trash", glyph: "trash", tone: "ink", size: [460, 320], render: trash },
  quickfix: { title: "QuickFix ✨", glyph: "quickfix", tone: "peach", size: [400, 380], render: quickfix },
  important: { title: "probably important.txt", glyph: "important", tone: "ink", size: [360, 300], render: important },
  sudoku: { title: "Gentle Sudoku", glyph: "sudoku", tone: "blue", size: [440, 560], render: sudoku },
  trace: { title: "Trace", glyph: "trace", tone: "ink", size: [520, 560], render: trace },
  updates: { title: "Software Update", glyph: "update", tone: "mint", size: [580, 620], render: updatesApp, dock: () => ["available", "downloading", "ready"].includes(U.state.update.state) },
  music: { title: "Murmur", glyph: "music", tone: "lilac", size: [420, 600], render: music, dock: true },
  help: { title: "Help Desk", glyph: "help", tone: "mint", size: [560, 600], render: helpdesk },
  deskduck: { title: "duck", glyph: "duckling", tone: "peach", size: [380, 320], render: deskduck },
};
const docked = (a) => (typeof a.dock === "function" ? a.dock() : a.dock);

/* ---------- window manager ---------- */
// Re-renders patch the existing nodes instead of replacing them, so hover, focus, scroll
// and CSS transitions (switches, meters, the dock) survive. Form fields still take the
// rendered value, exactly as a fresh innerHTML would; renderWindows restores the kept ones.
function morph(el, html) {
  const t = document.createElement("template");
  t.innerHTML = html;
  patchChildren(el, t.content);
}
function patchChildren(a, b) {
  const old = [...a.childNodes];
  const next = [...b.childNodes];
  next.forEach((n, i) => {
    const o = old[i];
    if (!o) a.append(n);
    else if (o.nodeType !== n.nodeType || o.nodeName !== n.nodeName || o.id !== n.id) o.replaceWith(n);
    else if (o.nodeType !== 1) {
      if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
    } else patchNode(o, n);
  });
  for (const o of old.slice(next.length)) o.remove();
}
function patchNode(o, n) {
  for (const { name } of [...o.attributes]) if (!n.hasAttribute(name)) o.removeAttribute(name);
  for (const { name, value } of n.attributes) if (o.getAttribute(name) !== value) o.setAttribute(name, value);
  patchChildren(o, n);
  if (o.tagName === "INPUT" && o.type !== "file") {
    if (o.value !== n.value) o.value = n.value;
    o.checked = n.checked;
  } else if (o.tagName === "TEXTAREA" || o.tagName === "SELECT") {
    if (o.value !== n.value) o.value = n.value;
  }
}
// Range inputs paint their filled part from --p.
function fill(r) {
  const min = Number(r.min) || 0, max = r.max === "" ? 100 : Number(r.max);
  r.style.setProperty("--p", (max > min ? ((Number(r.value) - min) / (max - min)) * 100 : 0) + "%");
}
const fillAll = () => document.querySelectorAll('input[type="range"]').forEach(fill);
function saveUI() {
  try {
    localStorage.setItem(UIKEY, JSON.stringify(ui));
  } catch {}
}
function saveArchive() {
  try {
    localStorage.setItem(ARCHIVEKEY, JSON.stringify(archive));
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
  const w = (ui.win[id] ??= {});
  if (!w.w) {
    // New windows walk diagonally across the space left of the widgets, so they don't pile up.
    const vw = innerWidth, vh = innerHeight;
    const right = vw > 1100 ? 320 : 12;
    const k = (ui.cascade = ((ui.cascade ?? -1) + 1) % 8);
    w.w = Math.min(a.size[0], vw - 40);
    w.h = Math.min(a.size[1], vh - 140);
    w.x = Math.max(12, Math.min(vw - w.w - right, 130 + k * 44));
    w.y = Math.max(44, Math.min(vh - w.h - 96, 52 + k * 30));
  }
  if (!w.open || w.min) S.play("open");
  w.open = true;
  w.min = false;
  if (tab) w.tab = tab;
  focus(id);
  if (id === "help") checkClock();
}
function focus(id) {
  ui.win[id].z = ++ui.z;
  ui.focus = id;
}
function closeApp(id) {
  if (ui.win[id]?.open) S.play("close");
  if (ui.win[id]) ui.win[id].open = false;
  if (id === "settings") path = [];
  topWindow();
}
function topWindow() {
  const list = Object.entries(ui.win).filter(([id, w]) => APPS[id] && w.open && !w.min);
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
  const active = document.activeElement;
  const focusId = active?.id && active.closest?.(".wbody") ? active.id : null;
  const caret = focusId && "selectionStart" in active ? [active.selectionStart, active.selectionEnd] : null;
  for (const [id, a] of Object.entries(APPS)) {
    const w = ui.win[id];
    const existing = $("win-" + id);
    if (!w?.open) {
      if (existing?.classList.contains("min")) existing.remove();
      else if (existing && !existing.classList.contains("closing")) leave(existing, "closing", () => existing.remove());
      continue;
    }
    const fresh = !existing;
    const el = frame(id);
    if (el.classList.contains("closing")) {
      // Reopened while it was closing: play the opening again from the start.
      el.classList.remove("closing");
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    }
    if (!w.min) el.classList.remove("min", "minimizing");
    else if (fresh) el.classList.add("min");
    else if (!el.classList.contains("min") && !el.classList.contains("minimizing"))
      leave(el, "minimizing", () => ui.win[id]?.min && el.classList.add("min"));
    if (!fresh && el.classList.contains("max") !== !!w.max) {
      el.classList.add("zooming");
      clearTimeout(el.zoomTimer);
      el.zoomTimer = setTimeout(() => el.classList.remove("zooming"), 320);
    }
    el.classList.toggle("max", !!w.max);
    el.classList.toggle("focused", id === top);
    Object.assign(el.style, { left: w.x + "px", top: w.y + "px", width: w.w + "px", height: w.h + "px", zIndex: w.z });
    const body = el.querySelector(".wbody");
    const scroll = [...body.querySelectorAll(".pane, .wbody")].map((p) => p.scrollTop);
    const selects = [...body.querySelectorAll("select[id]")].map((x) => [x.id, x.value]);
    const inputs = [...body.querySelectorAll("input[id]")]
      .filter((x) => x.dataset.keep || x.id === focusId || x.type === "radio")
      .map((x) => [x.id, x.value, x.checked]);
    morph(body, a.render());
    [...body.querySelectorAll(".pane")].forEach((p, i) => (p.scrollTop = scroll[i] || 0));
    for (const [sid, v] of selects) if ($(sid) && !["ai", "installs"].includes(sid)) $(sid).value = v;
    for (const [iid, v, c] of inputs) {
      const x = $(iid);
      if (!x || x.dataset.cell) continue;
      if (x.type === "radio") x.checked = c;
      else x.value = v;
    }
  }
  if (focusId && $(focusId)) {
    $(focusId).focus({ preventScroll: true });
    if (caret && $(focusId).setSelectionRange) try { $(focusId).setSelectionRange(...caret); } catch {}
  }
  document.body.classList.toggle("has-window", !!top);
  $("active-app").textContent = top ? APPS[top].title : "Desktop";
  fillAll();
}
// Plays a closing or minimizing animation, then finishes the job, unless the window came back meanwhile.
function leave(el, cls, then) {
  el.classList.add(cls);
  const done = () => {
    clearTimeout(timer);
    el.removeEventListener("animationend", end);
    if (!el.classList.contains(cls)) return;
    el.classList.remove(cls);
    then();
  };
  const end = (e) => e.target === el && done();
  const timer = setTimeout(done, 400);
  el.addEventListener("animationend", end);
}
function renderChrome() {
  document.body.dataset.accent = ui.accent;
  document.body.classList.toggle("still", ui.still);
  document.documentElement.style.setProperty("--glass", ui.glass);
  document.documentElement.style.setProperty("--fade", Math.max(0.45, 1 - Math.max(0, s.returns - 5) * 0.06));
  $("wallpaper").style.backgroundImage = `url("${wallpaperURL()}")`;
  const reported = s.stories.employee === 3;
  morph($("stats"), [
    ["Budget", money(s.money)],
    ["Knowledge", Math.floor(s.knowledge)],
    [reported ? "Users (reported)" : "Users", s.users.toLocaleString()],
    ["Releases", s.releases],
  ]
    .map(([l, v]) => `<span title="${l}${reported && l.startsWith("Users") ? ` · verified: about ${Math.round(s.users / 1.4).toLocaleString()}` : ""}"><small>${l}</small>${v}</span>`)
    .join(""));
  $("calm").textContent = `Calm ${G.calm(s)}%`;
  morph($("wifi"), `<svg viewBox="0 0 24 24">${GLYPHS[s.settings.isolated ? "wifioff" : "wifi"]}</svg>`);
  $("wifi").setAttribute("aria-label", s.settings.isolated ? "Network: isolated" : "Network: connected");
  morph($("volume"), `<svg viewBox="0 0 24 24">${GLYPHS[ui.sounds ? "speaker" : "speakeroff"]}</svg>`);
  $("volume").setAttribute("aria-label", ui.sounds ? "Sound: on" : "Sound: off");
  morph($("search-btn"), `<svg viewBox="0 0 24 24">${GLYPHS.search}</svg>`);
  const P = S.player;
  $("nowplaying").hidden = !P.playing;
  $("nowplaying").textContent = P.playing ? "♪ " + P.tracks[P.index].title : "";
  document.body.classList.toggle("thin-walls", ui.glass <= 0.25);
  $("calm").classList.toggle("low", G.calm(s) < 80);
  const attention = {
    mail: s.warned > 0 || mailNews() || unread("parents") || G.promotionDue(s),
    activity: s.stories.quickfix > 0 && s.stories.quickfix < 5,
    ripple: Object.entries(G.THREADS).some(([id, d]) => d.app === "ripple" && unread(id)),
  };
  morph($("dock"), Object.entries(APPS)
    .filter(([, a]) => docked(a))
    .map(([id, a]) => `${id === "settings" ? '<span class="dock-sep"></span>' : ""}<button class="dock-item ${ui.win[id]?.open ? "running" : ""}" data-action="open" data-id="${id}" aria-label="${a.title}">${icon(a.glyph, a.tone)}<span class="dock-label">${a.title}</span>${attention[id] ? '<i class="badge">!</i>' : ""}</button>`)
    .join(""));
  morph($("icons"), deskIcons()
    .map(([key, app, label, glyph, tone, tab]) => `<button class="desk-icon ${selected.has(key) ? "selected" : ""}" data-action="icon" data-id="${app}" data-key="${key}" ${tab ? `data-tab="${tab}"` : ""} draggable="${key !== "trash"}" aria-label="${esc(label)}">${icon(glyph, tone)}<span>${esc(label)}</span></button>`)
    .join(""));
  const [title, desc, app, cta, action = "open"] = goal();
  const active = s.jobs.filter((j) => !j.paused).length;
  const d = s.stories.duck;
  morph($("widgets"), `<section class="widget goal">${eyebrow("Your next small victory")}<h3>${title}</h3><p>${desc}</p>${button(cta, action, app, false, "primary")}</section><section class="widget">${eyebrow("Processor")}<div class="meter"><i style="width:${Math.min(100, Math.round((active / G.workers(s)) * 100))}%"></i></div><p>${s.jobs.length ? `${active} running, ${s.jobs.length - active} paused · ${G.workers(s)} core${G.workers(s) > 1 ? "s" : ""}` : "Idle. Suspiciously peaceful."}</p></section><button class="widget news-widget" data-action="open" data-id="news">${eyebrow("The Daily Current")}<span class="duck" aria-hidden="true">🦆</span><b>${G.duckOpen(s) || d === 4 ? DUCK[d].head : "A QUIET DAY FOR THE DUCK"}</b></button>`);
}
const selected = new Set();
function deskIcons() {
  return [
    ["welcome", "welcome", s.returns >= 4 ? `Welcome (${s.returns - 2}).pdf` : "Welcome.pdf", "welcome", "blue", ""],
    ["important", "important", "probably important", "important", "ink", ""],
    ...s.bookmarks.map((b) => [b, "files", b === "workspace" ? "Workspace Zero" : "Channel 04", b, b === "workspace" ? "lilac" : "ink", b]),
    ...(s.perks.includes("crackers") ? [["deskduck", "deskduck", "duck", "duckling", "peach", ""]] : []),
    ["trash", "trash", "Trash", "trash", "ink", ""],
  ];
}
function markRead() {
  const visible = (app) => ui.win[app]?.open && !ui.win[app].min;
  if (visible("ripple")) {
    const id = ui.win.ripple.tab ?? Object.keys(G.THREADS).find((k) => G.THREADS[k].app === "ripple" && delivered(k));
    if (id && delivered(id)) G.readThread(s, id);
  }
  if (visible("mail") && ui.win.mail.tab === "personal") G.readThread(s, "parents");
}
function render() {
  s.playing = !!(ui.win.sudoku?.open && !ui.win.sudoku.min);
  markRead();
  renderChrome();
  renderWindows();
  updateClock();
  if (pop && pop.kind !== "menu" && pop.kind !== "ctx") renderPop();
}
function updateClock() {
  $("clock").textContent = new Date().toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
}
let startedUp = false;
document.addEventListener(
  "pointerdown",
  () => {
    if (startedUp) return;
    startedUp = true;
    Promise.resolve(S.unlock()).then(() => ui.startup && S.play("startup"));
  },
  { capture: true, once: true },
);

/* ---------- notifications and story moments ---------- */
function notify(text, app = "welcome") {
  const a = APPS[app] ?? APPS.welcome;
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `${icon(a.glyph, a.tone, "tiny")}<div><b>${a.title === "Welcome" ? "Stillwater" : a.title}</b><p>${esc(text)}</p></div>`;
  $("toasts").prepend(t);
  S.play(/^Discovery noted/.test(text) ? "success" : app === "ripple" || app === "mail" ? "message" : "alert");
  while ($("toasts").children.length > 3) $("toasts").lastChild.remove();
  setTimeout(() => t.classList.add("out"), 6000);
  setTimeout(() => t.remove(), 6700);
}
function sourceOf(text) {
  if (/^People & Serenity|^IT:|^IT Security|^Kevin|replied all|got cake/.test(text)) return "mail";
  if (/^Workspace Zero v|passed for .* v\d|rejected\. Take|^The assistant finished|^Migration rolled back|^Lunchboard went down/.test(text)) return "workbench";
  if (/^Live help|Translate translated|box7|Panel B, including B7|cover to cover/.test(text)) return /Live help/.test(text) ? "help" : /cover/.test(text) ? "library" : "browser";
  if (/Panel B|^Procurement|ws-0417\.local|quillpost/i.test(text)) return "browser";
  if (/Tidepool|Sudoku|Installer blocked/.test(text)) return "tidepool";
  if (/Developer options/.test(text)) return "settings";
  if (/Appendix H/.test(text)) return "library";
  if (/Archive Index ·/.test(text)) return "workbench";
  if (/duck|Facilities|Correction|Daily Current/i.test(text)) return "news";
  if (/QuickFix|temp-contractor|Signing|Trace|credential/i.test(text)) return "activity";
  if (/Promoted|Archive ›/.test(text)) return "mail";
  if (/Reading complete/.test(text)) return "library";
  if (/shipped/.test(text)) return "workbench";
  if (/installed/.test(text)) return "toolshed";
  if (/Workspace Zero|Channel 04/.test(text)) return "files";
  return "welcome";
}
let seenLog = bootSeen ?? s.logs[0]?.text + s.logs[0]?.time;
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
const AFTER = "Something on this machine has started keeping track of what you find. It will remember, next time.";
const MOMENTS = {
  workspace: {
    eyebrow: "Theme importer · legacy mode",
    title: "This is not a theme.",
    lines: [
      "Reading mara-final-FINAL.swk…",
      "Palette: 0 colors. Fonts: 0. Projects: 1. Notes: 212.",
      "Owner field: you.",
      "Created: eleven days before your start date.",
    ],
    then: () => openApp("files", "workspace"),
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
      AFTER,
    ],
    then: () => openApp("tracker"),
  },
  fired: {
    eyebrow: "People & Serenity · automated message",
    title: "Your role has been released.",
    lines: [
      "Your Calm Index fell below the threshold for calm.",
      "Acceptable use, noted: shopping, blogging, games, and a great deal of browsing during core calm hours.",
      "Your badge has been deactivated. Your mug will be mailed to you, gently.",
      "Somewhere in this building, a new hire is being told the previous user has been mostly removed.",
      AFTER,
    ],
    buttons: [["Open Secret Tracker", "moment", "fired", "primary"], ["Start a new workstation", "reset", "", "ghost"]],
    then: () => openApp("tracker"),
  },
  breach: {
    eyebrow: "IT · incident 0417",
    title: "Workstation reimaged.",
    lines: [
      "QuickFix granted itself administrator rights, to help.",
      "It then helped every other plugin, the build server, and payroll.",
      "IT has restored WS-0417 to factory calm. Your projects were not considered essential.",
      "Next time, look at what is using your processor.",
      AFTER,
    ],
    buttons: [["Open Secret Tracker", "moment", "breach", "primary"], ["Start a new workstation", "reset", "", "ghost"]],
    then: () => openApp("tracker"),
  },
};
const queue = [];
function moment(kind) {
  if (!$("moment").hidden) return void queue.push(kind);
  const m = MOMENTS[kind];
  const el = $("moment");
  const buttons = m.buttons ?? [["Continue", "moment", kind, "primary"]];
  el.innerHTML = `<div class="moment-card ${kind}" role="dialog" aria-modal="true" aria-label="${m.title}">${eyebrow(m.eyebrow)}<h2>${m.title}</h2>${m.lines.map((l, i) => `<p style="--d:${0.5 + i * 0.9}s">${l}</p>`).join("")}<div class="row">${buttons.map(([t, a, id, cls]) => button(t, a, id, false, cls)).join("")}</div></div>`;
  el.hidden = false;
  el.className = "moment " + kind;
  document.body.classList.add("in-moment", "moment-" + kind);
  el.querySelector("button").focus({ preventScroll: true });
}
function endMoment(kind) {
  $("moment").hidden = true;
  document.body.classList.remove("in-moment", ...Object.keys(MOMENTS).map((k) => "moment-" + k));
  MOMENTS[kind]?.then();
  persist();
  render();
  if (queue.length) moment(queue.shift());
}
let before = snapshot();
function snapshot() {
  return { quickfix: s.stories.quickfix, bookmarks: [...s.bookmarks], complete: complete(), over: s.over, secrets: [...s.secrets], threads: Object.fromEntries(Object.keys(G.THREADS).map((id) => [id, (s.threads[id]?.step ?? 0) + Number(!!s.threads[id]?.open)])) };
}
function afterChange() {
  const now = snapshot();
  if (before.quickfix === 0 && now.quickfix === 1) {
    openApp("quickfix");
    document.body.classList.add("glitch");
    setTimeout(() => document.body.classList.remove("glitch"), 900);
  }
  const added = now.bookmarks.find((b) => !before.bookmarks.includes(b));
  if (added) moment(added);
  for (const [id, n] of Object.entries(now.threads))
    if (n > before.threads[id]) {
      const def = G.THREADS[id], t = G.thread(s, id);
      const beat = def.beats[t.open ? t.step : t.step - 1];
      if (beat) notify(`${def.name}: ${G.beatLines(s, beat)[0]}`, def.app);
    }
  for (const id of now.secrets) if (!before.secrets.includes(id)) notify(`Discovery noted: ${secretName(id)}.`, tracked() ? "tracker" : "files");
  if (G.record(archive, s)) saveArchive();
  if (!before.complete && now.complete) moment("ending");
  if (!before.over && now.over) {
    document.body.classList.add("glitch");
    setTimeout(() => document.body.classList.remove("glitch"), 900);
    moment(now.over);
  }
  before = now;
  announce();
}

/* ---------- web navigation ---------- */
function nav(url) {
  const page = G.visit(s, url);
  if (ui.web.page.url !== page.url) ui.web.back = [...ui.web.back, ui.web.page].slice(-20);
  ui.web.page = page;
  openApp("browser");
}

/* ---------- input ---------- */
const PLAY = ["checkupdate", "downloadupdate", "installupdate", "dlcload", "dlcinstall", "dlcremove", "open", "close", "min", "max", "tab", "menu", "calm", "wallpaper", "accent", "pref", "path", "deeper", "decoy", "moment", "replay", "export", "import", "reset", "back", "pause", "icon", "popover", "launcher", "lock", "unlock", "switchuser", "signout", "shutdown", "minall", "front", "shortcuts", "oshelp", "selectall", "sorticons", "getinfo", "iconinfo", "trashicon", "network", "calday", "music", "hit", "newfolder"];
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (!b || b.disabled) return;
  const { action: a, id } = b.dataset;
  if (s.over && !PLAY.includes(a)) {
    notify("This workstation is finished. Start a new one from the desktop.", "settings");
    return;
  }
  let changed = true;
  switch (a) {
    case "open":
      openApp(id, b.dataset.tab);
      break;
    case "close":
      closeApp(id);
      break;
    case "min":
      if (!ui.win[id]) return;
      ui.win[id].min = true;
      S.play("minimize");
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
    case "popover":
      togglePop(a === "menu" ? "menu" : id, id, b);
      return;
    case "icon": {
      const key = b.dataset.key;
      if (mobile() || e.pointerType === "touch" || e.detail !== 1) {
        selected.clear();
        openApp(id, b.dataset.tab);
      } else {
        if (!(e.shiftKey || e.metaKey || e.ctrlKey)) selected.clear();
        selected.add(key);
        document.querySelectorAll(".desk-icon").forEach((x) => x.classList.toggle("selected", selected.has(x.dataset.key)));
        return;
      }
      break;
    }
    case "launcher":
      openLauncher();
      return;
    case "hit":
      closeLauncher();
      runHit(Number(id));
      break;
    case "lock":
      lockScreen("lock");
      return;
    case "unlock":
    case "switchuser":
    case "signout":
      lockAction(a);
      return;
    case "shutdown":
      notify("Shut Down is disabled. Calm never sleeps. You could lock the screen instead.", "settings");
      return;
    case "newfolder":
      notify(s.rank >= 4 ? "A new folder appeared and disappeared. Principal Engineers keep their folders in their heads." : "File › New is disabled during your probation period.", "settings");
      return;
    case "undo": {
      const n = G.count(s, "undo", 5, "undo");
      notify(n >= 5 ? "You tried to undo five times. Momentum noted. Nothing was undone." : "Undo is unavailable. Stillwater encourages forward momentum.", "settings");
      break;
    }
    case "selectall":
      for (const [key] of deskIcons()) selected.add(key);
      break;
    case "minall":
      for (const w of Object.values(ui.win)) if (w.open) w.min = true;
      S.play("minimize");
      break;
    case "front":
      for (const [k, w] of Object.entries(ui.win)) if (w.open && APPS[k]) (w.min = false), focus(k);
      break;
    case "shortcuts":
      notify("Ctrl+K search · Ctrl+Shift+L lock screen · Esc close menus · double-click icons to open. Appendix G lists the shortcuts removed for wellness reasons.", "settings");
      return;
    case "oshelp":
      notify("Stillwater OS Help is available on Thursdays, from 4:15 to 4:19 p.m. The Help Desk is open the rest of the time.", "help");
      return;
    case "sorticons":
      notify("Icons sorted by calm. The order is unchanged. They were already calm.", "files");
      return;
    case "getinfo":
      notify(`WS-0417 · Stillwater OS 9.4.17 · 512 GB, of which 3.1 GB belongs to the previous user and ${(0.2 * s.returns).toFixed(1)} GB to you.`, "files");
      return;
    case "iconinfo":
      notify({ welcome: "Welcome.pdf · revised " + (s.returns + 1) + " times · author: People & Serenity", important: "probably important.txt · 1 KB · do not delete", trash: "Trash · emptying disabled by policy", deskduck: "duck · 1.3 kg · moving with purpose", workspace: "Workspace Zero · owner: you · created eleven days before your start date", channel: "Channel 04 · not networked · not watched" }[id] ?? "No information. Very calm.", "files");
      return;
    case "trashicon":
      trashIcon(id);
      break;
    case "network":
      notify({ guest: "Stillwater-Guest requires a calm badge. Yours is provisional.", greg: "Greg’s Hotspot (heater) wants a password. It is probably “thursday”. It is not.", van: "You are not allowed to join “Definitely Not People & Serenity”. It already knows you." }[id], "settings");
      return;
    case "calday":
      if (G.secret(s, "calendar")) notify("Recurring event found: Thursday, 4:17 p.m. · Panel B maintenance · organizer Greg Okafor · attendees: the build server, the Furnace of Thursdays.", "settings");
      calDay = Number(id);
      renderPop();
      break;
    case "music":
      musicAction(id);
      break;
    case "checkupdate":
      ui.lastCheck = Date.now();
      U.checkForUpdate();
      break;
    case "downloadupdate":
      U.downloadUpdate();
      break;
    case "installupdate":
      persist();
      U.installUpdate();
      break;
    case "dlcload":
      U.state.dlc.catalog = null;
      U.loadCatalog();
      break;
    case "dlcinstall":
      U.installDlc(id);
      break;
    case "dlcremove":
      U.removeDlc(id);
      break;
    case "pat": {
      const n = G.count(s, "pat", 5, "pat");
      if (ui.sounds) S.preview("quack");
      notify(n >= 5 ? "The duck allows it. You are now, officially, a friend of the duck." : ["The duck looks at you.", "The duck looks at the crackers.", "The duck tolerates this.", "The duck closes its eyes, briefly."][(n - 1) % 4], "deskduck");
      break;
    }
    case "redact":
      if (G.count(s, "redact", 3, "redacted") >= 3) notify("The redaction flakes off. It was a sticker. Underneath: Mara Chen.", "settings");
      else notify("Redacted. For privacy. Mostly hers.", "settings");
      break;
    case "solve": {
      const p = s.projects[id];
      const t = p?.task && G.T.makeTask(id, p.version);
      const v = b.dataset.dialfrom ? Number($(b.dataset.dialfrom)?.value) : b.dataset.v;
      const res = G.solve(s, id, t?.kind === "review" ? Number(v) : v);
      if (res === "wrong" || res === "outage") S.play("error");
      if (res === "ok") S.play("success");
      changed = !!res;
      break;
    }
    case "calm":
      if (G.count(s, "poke", 10, "poke") >= 10) {
        notify("Please stop poking the Calm Index. It is trying its best.", "settings");
        break;
      }
      notify(s.stories.employee === 3 ? "The Calm Index has no sensor for the clients. It never did. It has one for you." : s.stories.employee === 2 ? "The Calm Index is calculated from proprietary signals. Mara says there’s no cable. You could check." : "The Calm Index is calculated from proprietary signals, some of them yours. You are doing great.", "settings");
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
    case "read":
      changed = G.read(s);
      break;
    case "pause": {
      const j = s.jobs.find((j) => j.id === Number(id));
      if (j) j.paused = !j.paused;
      break;
    }
    case "toggle":
      if (id === "auto") s.auto = !s.auto;
      else if (id === "private") s.private = !s.private;
      else {
        s.settings[id] = !s.settings[id];
        if (id === "duck" && !s.settings.duck) G.secret(s, "hourlier");
      }
      break;
    case "pref":
      ui[id] = !ui[id];
      if (id === "sounds") {
        syncSound();
        if (!ui.sounds && G.secret(s, "quiet"))
          notify("In the quiet, you can hear the desk humming. It hums in a key that isn’t on the list. (Settings › Sound has a new alert.)", "settings");
        else S.play("click");
      }
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
    case "observe":
      if (G.story(s, "observe")) openApp("trace");
      else {
        notify(s.settings.isolated ? "Nothing leaves an isolated workstation. There is nothing to trace." : "QuickFix is quiet. It only phones home while a build is running.", "activity");
        return;
      }
      break;
    case "hop": {
      const r = G.hop(s, Number(id));
      if (r === "done") openApp("activity", "security");
      changed = !!r;
      break;
    }
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
      if (!id.startsWith("__")) {
        G.mark(s, "door:" + id);
        if (Object.keys(DECOY).every((k) => s.marks.includes("door:" + k)) && G.secret(s, "doors")) {
          afterChange();
          persist();
        }
      }
      notify(
        id === "__restore" ? "Restore is disabled by policy. The previous user stays mostly removed." : id === "__current" ? "This profile is still in use. For now." : DECOY[id],
        id.startsWith("__") ? "trash" : "settings",
      );
      return;
    case "moment":
      endMoment(id);
      return;
    case "replay":
      moment(id);
      return;
    case "tap": {
      if (s.secrets.includes("devmode")) {
        notify("No need, you are already a developer.", "settings");
        return;
      }
      const left = G.tap(s);
      if (left > 0 && left <= 4) notify(`You are ${left} step${left === 1 ? "" : "s"} away from being a developer.`, "settings");
      if (!left) ui.win.settings.tab = "developer";
      break;
    }
    case "appendix":
      changed = G.appendix(s);
      break;
    case "hint":
      changed = G.hint(s, id);
      break;
    case "nav":
      nav(id);
      break;
    case "back":
      if (ui.web.back.length) {
        ui.web.page = ui.web.back[ui.web.back.length - 1];
        ui.web.back = ui.web.back.slice(0, -1);
      }
      break;
    case "exception":
      if (G.count(s, "exception", 5, "exception") === 5) notify("Exception granted. For the duck. Not for you. The duck thanks you for your persistence.", "browser");
      else notify(EXCEPTIONS[Math.floor(Math.random() * EXCEPTIONS.length)], "browser");
      break;
    case "download":
      changed = G.download(s, id);
      if (changed) notify("TidepoolClassroom.pkg saved to Files › Downloads.", "files");
      break;
    case "install":
      changed = G.install(s, id);
      if (!changed) {
        afterChange();
        persist();
        render();
        return;
      }
      openApp("tidepool");
      break;
    case "getgame":
      changed = G.getGame(s, id);
      if (changed) ui.win.tidepool.tab = "library";
      break;
    case "shop":
      changed = G.shop(s, id);
      break;
    case "flip":
      changed = G.flip(s, Number(id));
      break;
    case "say":
      changed = !!G.say(s, b.dataset.thread, Number(id));
      break;
    case "replyall":
      changed = G.replyAll(s, id);
      break;
    case "cake":
      changed = G.cake(s);
      if (!changed) notify("By the time you got there, only a plastic knife remained.", "mail");
      changed = true;
      break;
    case "phish":
      changed = G.phish(s, id);
      break;
    case "post":
      changed = G.post(s, id);
      if (changed) notify("Posted. Somebody somewhere is reading it.", "browser");
      break;
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
      if (!s.over && !confirm("Start a new workstation? This replaces your local progress. Export a backup first if you want to keep it.")) return;
      if (!$("moment").hidden) {
        $("moment").hidden = true;
        document.body.classList.remove("in-moment", ...Object.keys(MOMENTS).map((k) => "moment-" + k));
        queue.length = 0;
      }
      s = G.fresh();
      $("toasts").innerHTML = "";
      archive.plays++;
      saveArchive();
      path = [];
      ui = { ...structuredClone(UI_DEFAULT), wallpaper: ui.wallpaper, glass: ui.glass, accent: ui.accent, still: ui.still };
      before = snapshot();
      seenLog = "";
      boot();
      break;
    default:
      return;
  }
  if (!changed) {
    S.play("error");
    notify("That isn’t available yet. Most things here aren’t, at first.", "settings");
  }
  afterChange();
  persist();
  render();
});
document.addEventListener("submit", (e) => {
  const form = e.target.closest("form[data-form]");
  if (!form) return;
  e.preventDefault();
  const input = form.querySelector("input[name=v]:checked, input[name=v][type=text]");
  const v = input?.value ?? "";
  const kind = form.dataset.form;
  if (kind === "mchen") {
    const pw = $("mchen-pw");
    if (pw.value.replace(/\s/g, "") === G.BLOG_PASSWORD) {
      lockScreen("mara");
      if (G.secret(s, "mchen")) afterChange(), persist(), render();
    } else {
      pw.value = "";
      pw.classList.remove("shake");
      void pw.offsetWidth;
      pw.classList.add("shake");
      S.play("error");
    }
    return;
  }
  if (kind === "triage" || kind === "tune") {
    const pid = form.dataset.project;
    const value =
      kind === "triage"
        ? [...form.querySelectorAll("select")].map((x) => x.value)
        : [Number($(`tune-r-${pid}`).value), Number($(`tune-d-${pid}`).value)];
    if (kind === "triage" && value.includes("")) return void notify("Label every report first.", "workbench");
    const res = G.solve(s, pid, value);
    if (res === "probe") {
      const r = G.T.probe(...value);
      const t = G.T.makeTask(pid, s.projects[pid].version);
      notify(r.coverage < t.need ? `Probe missed events: coverage ${r.coverage}, needs ${t.need}.` : `Probe slowed everything down: overhead ${r.overhead}, limit ${t.cap}.`, "activity");
    }
    S.play(res === "ok" ? "success" : res === "wrong" ? "error" : "click");
    afterChange();
    persist();
    render();
    return;
  }
  if (s.over && kind !== "address") return void notify("This workstation is finished. Start a new one from the desktop.", "settings");
  let clear = true;
  switch (kind) {
    case "address":
      nav(v);
      input.blur();
      break;
    case "translate":
      nav("translate.stillwater/" + v);
      break;
    case "vendor":
      G.addVendor(s, v);
      break;
    case "blogpw":
      if (!G.unlockBlog(s, v)) notify("Incorrect password.", "browser");
      break;
    case "revoke":
      clear = G.revoke(s, v);
      break;
    case "duck": {
      if (!input) return void notify("Pick an explanation first.", "news");
      G.correct(s, v);
      break;
    }
    case "type":
      G.type(s, form.dataset.thread, v);
      break;
  }
  if (clear && input?.type === "text" && kind !== "address") input.value = "";
  afterChange();
  persist();
  render();
});
document.addEventListener("change", (e) => {
  if (e.target.id === "alert" && S.ALERTS[e.target.value]) {
    ui.alert = e.target.value;
    syncSound();
    S.preview(ui.alert);
    if (ui.alert === "quack" && G.secret(s, "quack")) notify("Alert sound set to Quack. Facilities Policy §12(b) has been satisfied.", "settings");
    afterChange();
    persist();
    render();
    return;
  }
  if (s.over) return;
  if (e.target.id === "ai") s.ai = e.target.value;
  else if (e.target.id === "installs") G.setInstalls(s, e.target.value);
  else return;
  afterChange();
  persist();
  render();
});
document.addEventListener("input", (e) => {
  const id = e.target.id;
  if (e.target.type === "range") fill(e.target);
  if (id === "glass") {
    ui.glass = Math.round((1.1 - Number(e.target.value)) * 100) / 100;
    document.documentElement.style.setProperty("--glass", ui.glass);
    document.body.classList.toggle("thin-walls", ui.glass <= 0.25);
    saveUI();
    if (ui.glass <= 0.25 && G.secret(s, "glass")) afterChange(), persist();
  }
  if (id === "launcher-q") {
    hits = searchHits(e.target.value);
    hitOn = 0;
    renderLauncher();
    if (s.secrets.includes("search") && !before.secrets.includes("search")) afterChange(), persist();
  }
  if (id === "sfx-volume") {
    ui.volume = Number(e.target.value);
    syncSound();
    saveUI();
  }
  if (id === "music-vol") {
    ui.music = Number(e.target.value);
    S.setVolume(ui.music);
    saveUI();
  }
  if (id === "music-seek") S.seek(Number(e.target.value));
  if (e.target.dataset?.dial) {
    const pid = e.target.dataset.dial;
    ui.dial[pid] = Number(e.target.value);
    const p = s.projects[pid];
    const out = document.querySelector(`[data-decoded="${pid}"]`);
    if (p?.task && out) out.textContent = G.T.shift(G.T.makeTask(pid, p.version).cipher, -ui.dial[pid]);
  }
  const cell = e.target.dataset?.cell;
  if (cell !== undefined) {
    const v = e.target.value.replace(/[^1-9]/g, "").slice(-1);
    e.target.value = v;
    if (G.fill(s, Number(cell), v || 0)) {
      afterChange();
      persist();
      if (G.sudokuSolved(s)) render();
    }
  }
});
document.addEventListener("keydown", (e) => {
  const typing = e.target.closest?.("input, textarea, select");
  if (e.key === "Escape") {
    if (!$("launcher").hidden) return closeLauncher();
    if (pop) return closePop();
    if (!$("moment").hidden) {
      const first = $("moment").querySelector("[data-action=moment]");
      if (first) endMoment(first.dataset.id);
    }
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    return $("launcher").hidden ? openLauncher() : closeLauncher();
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "l") {
    e.preventDefault();
    return lockScreen("lock");
  }
  if (e.target.id === "launcher-q") {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      hitOn = (hitOn + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % Math.max(1, hits.length);
      renderLauncher();
    } else if (e.key === "Enter" && hits.length) {
      closeLauncher();
      runHit(hitOn);
      afterChange();
      persist();
      render();
    }
    return;
  }
  if (typing) return;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === KONAMI[konami]) konami++;
  else konami = key === "ArrowUp" ? Math.min(konami, 2) || 1 : 0;
  if (konami === KONAMI.length) {
    konami = 0;
    parade();
    if (G.secret(s, "konami")) {
      afterChange();
      persist();
      render();
    }
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

/* ---------- menus, popovers, search and the lock screen ---------- */
let pop = null,
  calDay = 0;
function menuItems(id) {
  const top = topWindow();
  if (id === "logo")
    return [["About This Workstation", "open", "settings", false, 'data-tab="about"'], ["System Settings…", "open", "settings"], [`Software Update…${U.state.update.state === "available" || U.state.update.state === "ready" ? " · 1 update" : ""}`, "open", "updates"], "-", ["Lock Screen", "lock", "", false, "", "Ctrl Shift L"], ["Shut Down…", "shutdown"]];
  if (id === "file")
    return [["New Folder", "newfolder", "", s.rank < 4], ["Open…", "launcher", "", false, "", "Ctrl K"], "-", ["Close Window", "close", top ?? "", !top], ["Minimize Window", "min", top ?? "", !top], "-", ["Export Save…", "export"]];
  if (id === "edit") return [["Undo", "undo"], ["Redo", "", "", true], "-", ["Cut", "", "", true], ["Copy", "", "", true], ["Paste", "", "", true], "-", ["Select All Icons", "selectall"]];
  if (id === "window") {
    const open = Object.entries(ui.win).filter(([k, w]) => APPS[k] && w.open);
    return [["Minimize All", "minall", "", !open.length], ["Bring All to Front", "front", "", !open.length], ...(open.length ? ["-"] : []), ...open.map(([k, w]) => [`${k === top ? "✓ " : ""}${APPS[k].title}${w.min ? " · minimized" : ""}`, "open", k])];
  }
  if (id === "help") return [["Help Desk", "open", "help"], ["Search…", "launcher", "", false, "", "Ctrl K"], ["Keyboard Shortcuts", "shortcuts"], "-", ["Stillwater OS Help", "oshelp"]];
  if (id === "desktop")
    return [["New Folder", "newfolder", "", s.rank < 4], "-", ["Change Wallpaper…", "open", "settings", false, 'data-tab="appearance"'], ["Sort Icons by Name", "sorticons"], ["Get Info", "getinfo"], "-", ["Lock Screen", "lock"]];
  if (id.startsWith("icon:")) {
    const [key, app, , , , tab] = deskIcons().find((x) => x[0] === id.slice(5)) ?? [];
    if (!key) return [];
    return [["Open", "open", app, false, tab ? `data-tab="${tab}"` : ""], ["Get Info", "iconinfo", key], ...(key === "trash" ? [] : ["-", ["Move to Trash", "trashicon", key]])];
  }
  return [];
}
const item = ([label, action, id = "", disabled = false, extra = "", kbd = ""]) =>
  `<button class="item" role="menuitem" data-action="${action}" data-id="${esc(id)}" ${disabled || !action ? "disabled" : ""} ${extra}><span>${esc(label)}</span>${kbd ? `<kbd>${kbd}</kbd>` : ""}</button>`;
function popHTML() {
  if (!pop) return "";
  if (pop.kind === "menu" || pop.kind === "ctx") return menuItems(pop.id).map((x) => (x === "-" ? "<hr>" : item(x))).join("");
  if (pop.kind === "wifi")
    return `<h4>Wi-Fi</h4>${toggle("Stillwater-Calm", s.settings.isolated ? "Isolated. Only the desk itself is listening." : "Connected to Stillwater HQ.", "isolated", !s.settings.isolated, false, "toggle")}<hr><h4>Other networks</h4>${[["guest", "Stillwater-Guest"], ["greg", "Greg’s Hotspot (heater)"], ["van", "Definitely Not People & Serenity"]].map(([k, l]) => item([l, "network", k])).join("")}<hr>${item(["Network Settings…", "open", "settings", false, 'data-tab="network"'])}`;
  if (pop.kind === "volume")
    return `<h4>Sound</h4>${toggle("Interface sounds", ui.sounds ? "On" : "Off", "sounds", ui.sounds, false, "pref")}<div class="pad"><input type="range" id="sfx-volume" min="0" max="1" step="0.05" value="${ui.volume}" aria-label="Interface volume" /></div><hr>${item([S.player.playing ? "♪ " + S.player.tracks[S.player.index].title : "Murmur", "open", "music"])}${item(["Sound Settings…", "open", "settings", false, 'data-tab="sound"'])}`;
  if (pop.kind === "calendar") {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const cells = Array.from({ length: first }, () => "<span></span>").join("") + Array.from({ length: days }, (_, i) => {
      const d = i + 1, thu = new Date(y, m, d).getDay() === 4;
      return `<button class="${d === now.getDate() ? "today" : ""} ${thu ? "event" : ""}" data-action="${thu ? "calday" : ""}" data-id="${d}" aria-label="${d}${thu ? ", 1 event" : ""}">${d}</button>`;
    }).join("");
    const ev = calDay ? `<div class="event-card"><b>Thursday ${calDay} · 4:17 p.m.</b><p>Panel B maintenance (recurring)</p><p class="fine">Organizer: Greg Okafor · Attendees: the build server, the Furnace of Thursdays</p></div>` : "";
    const today = [G.promotionDue(s) && "Growth conversation · People & Serenity", "12:00 · Lunch rush (Lunchboard)", now.getDay() === 4 && "4:15–4:19 p.m. · Live help desk"].filter(Boolean);
    return `<h4>${now.toLocaleString([], { month: "long", year: "numeric" })}</h4><div class="cal">${["S", "M", "T", "W", "T", "F", "S"].map((x) => `<b>${x}</b>`).join("")}${cells}</div>${ev}<h4>Today</h4><div class="pad fine">${today.map(esc).join("<br>")}</div>`;
  }
  return "";
}
function renderPop() {
  const el = $("pop");
  document.querySelectorAll("[aria-expanded]").forEach((x) => x.removeAttribute("aria-expanded"));
  if (!pop) return void (el.hidden = true);
  // Re-rendering an open popover patches it, so a slider being dragged keeps its grip.
  const key = pop.kind + ":" + pop.id;
  if (!el.hidden && el.dataset.key === key) morph(el, popHTML());
  else el.innerHTML = popHTML();
  el.dataset.key = key;
  el.hidden = false;
  fillAll();
  el.setAttribute("role", pop.kind === "menu" || pop.kind === "ctx" ? "menu" : "dialog");
  const w = el.offsetWidth, h = el.offsetHeight;
  let x = pop.x, y = pop.y;
  if (pop.anchor) {
    const r = pop.anchor.getBoundingClientRect();
    pop.anchor.setAttribute("aria-expanded", "true");
    x = pop.kind === "menu" ? r.left : r.right - w;
    y = r.bottom + 6;
  }
  el.style.left = Math.max(8, Math.min(innerWidth - w - 8, x)) + "px";
  el.style.top = Math.max(8, Math.min(innerHeight - h - 8, y)) + "px";
}
function togglePop(kind, id, anchor) {
  if (pop && pop.kind === kind && pop.id === id) pop = null;
  else pop = { kind, id, anchor };
  calDay = 0;
  S.play("click");
  renderPop();
}
function closePop() {
  if (!pop) return;
  pop = null;
  renderPop();
}
document.addEventListener(
  "pointerdown",
  (e) => {
    S.unlock();
    if (pop && !e.target.closest("#pop") && !e.target.closest("[data-action=menu],[data-action=popover]")) closePop();
    // Clear the icon selection without re-rendering: replacing the DOM mid-click would eat the click.
    if (!e.target.closest(".desk-icon") && selected.size && !e.target.closest("#pop")) {
      selected.clear();
      document.querySelectorAll(".desk-icon.selected").forEach((x) => x.classList.remove("selected"));
    }
  },
  true,
);
document.addEventListener("click", (e) => {
  // Choosing anything in a menu closes it; switches inside popovers keep it open.
  if (pop && e.target.closest("#pop .item")) closePop();
});
document.addEventListener("contextmenu", (e) => {
  if (e.target.closest(".window, .dock, .menubar, #pop, input, textarea, .lock, .launcher, .moment")) return;
  e.preventDefault();
  const iconEl = e.target.closest(".desk-icon");
  pop = { kind: "ctx", id: iconEl ? "icon:" + iconEl.dataset.key : "desktop", x: e.clientX, y: e.clientY };
  if (iconEl) {
    selected.clear();
    selected.add(iconEl.dataset.key);
    document.querySelectorAll(".desk-icon").forEach((x) => x.classList.toggle("selected", x === iconEl));
  }
  renderPop();
});
function trashIcon(key) {
  if (key === "important") {
    S.play("trash");
    G.secret(s, "important");
    notify("IT reminder: do not delete files named “probably important”. We have tried this. The file has been restored to the desktop.", "trash");
  } else if (key === "trash") return;
  else notify("This item can’t be moved to the Trash. It is load-bearing.", "trash");
}
/* drag an icon onto the Trash */
document.addEventListener("dragstart", (e) => {
  const el = e.target.closest?.(".desk-icon");
  if (!el) return;
  e.dataTransfer.setData("text/x-icon", el.dataset.key);
  e.dataTransfer.effectAllowed = "move";
});
document.addEventListener("dragover", (e) => {
  const t = e.target.closest?.(".desk-icon[data-key=trash]");
  if (!t) return;
  e.preventDefault();
  t.classList.add("droptarget");
});
document.addEventListener("dragleave", (e) => e.target.closest?.(".desk-icon")?.classList.remove("droptarget"));
document.addEventListener("drop", (e) => {
  const t = e.target.closest?.(".desk-icon[data-key=trash]");
  if (!t) return;
  e.preventDefault();
  t.classList.remove("droptarget");
  trashIcon(e.dataTransfer.getData("text/x-icon"));
  afterChange();
  persist();
  render();
});
/* drag a selection box on the empty desktop */
let lasso = null;
document.addEventListener("pointerdown", (e) => {
  if (e.button !== 0 || mobile() || !(e.target.id === "desktop" || e.target.id === "icons" || e.target.id === "widgets")) return;
  lasso = { x: e.clientX, y: e.clientY };
});
document.addEventListener("pointermove", (e) => {
  if (!lasso) return;
  const box = $("lasso");
  const x = Math.min(lasso.x, e.clientX), y = Math.min(lasso.y, e.clientY);
  const w = Math.abs(e.clientX - lasso.x), h = Math.abs(e.clientY - lasso.y);
  if (w + h < 6) return;
  Object.assign(box.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
  box.hidden = false;
  selected.clear();
  for (const el of document.querySelectorAll(".desk-icon")) {
    const r = el.getBoundingClientRect();
    if (r.right > x && r.left < x + w && r.bottom > y && r.top < y + h) selected.add(el.dataset.key);
    el.classList.toggle("selected", selected.has(el.dataset.key));
  }
});
document.addEventListener("pointerup", () => {
  lasso = null;
  $("lasso").hidden = true;
});

/* search */
let hits = [],
  hitOn = 0;
function searchHits(q) {
  q = q.trim().toLowerCase();
  if (!q) return [];
  const out = [];
  for (const [id, a] of Object.entries(APPS)) if ((docked(a) || ["help", "trash", "welcome", "updates"].includes(id)) && a.title.toLowerCase().includes(q)) out.push({ title: a.title, sub: "Application", run: () => openApp(id) });
  for (const [id, l] of [["appearance", "Appearance"], ["development", "Development"], ["notifications", "Notifications"], ["sound", "Sound"], ["network", "Network"], ["privacy", "Privacy"], ["advanced", "Advanced"], ["storage", "Storage"], ["about", "About"]])
    if (l.toLowerCase().includes(q) || "settings".includes(q)) out.push({ title: `System Settings › ${l}`, sub: "Setting", run: () => openApp("settings", id) });
  for (const u of G.OPEN_SITES.filter((u) => u !== "ws-0417.local" && u !== "learn.tidepool.games")) if (u.includes(q)) out.push({ title: u, sub: "Website", run: () => nav(u) });
  for (const [id, n] of [["workspace", "Workspace Zero"], ["channel", "Channel 04"]]) if (s.bookmarks.includes(id) && n.toLowerCase().includes(q)) out.push({ title: n, sub: "Files", run: () => openApp("files", id) });
  if (/duck/.test(q)) {
    G.secret(s, "search");
    out.push({ title: "Duck", sub: "Board member · directory.stillwater", run: () => nav("directory.stillwater") });
  }
  if (/mara|chen/.test(q)) out.push({ title: "No results for Mara Chen", sub: "Try asking the desk.", run: () => {} });
  if (/furnace|heater|greg/.test(q)) out.push({ title: "B7 GREG — DO NOT", sub: "Panel B · facilities.stillwater", run: () => nav("facilities.stillwater") });
  if (/calm/.test(q)) out.push({ title: "Calm Index", sub: `Currently ${G.calm(s)}%. It is watching the search too.`, run: () => {} });
  return out.slice(0, 9);
}
function renderLauncher() {
  const res = $("launcher").querySelector(".results");
  res.innerHTML = hits.length
    ? hits.map((h, i) => `<button class="hit ${i === hitOn ? "on" : ""}" data-action="hit" data-id="${i}"><span><b>${esc(h.title)}</b><small>${esc(h.sub)}</small></span></button>`).join("")
    : `<p class="fine pad">${$("launcher-q").value.trim() ? "Nothing found. It may be somewhere deeper." : "Search applications, settings and sites."}</p>`;
}
function openLauncher() {
  closePop();
  const el = $("launcher");
  el.innerHTML = `<div class="launcher-box" role="dialog" aria-label="Search"><input id="launcher-q" type="text" autocomplete="off" spellcheck="false" placeholder="Search WS-0417" aria-label="Search" /><div class="results"></div></div>`;
  el.hidden = false;
  hits = [];
  hitOn = 0;
  renderLauncher();
  $("launcher-q").focus();
}
function closeLauncher() {
  $("launcher").hidden = true;
}
function runHit(i) {
  hits[i]?.run();
}
$("launcher").addEventListener("pointerdown", (e) => {
  if (e.target.id === "launcher") closeLauncher();
});

/* lock screen and screensaver */
let lockState = null,
  saverAt = 0,
  lastInput = Date.now();
const timeStr = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const dateStr = () => new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
function lockHTML() {
  if (lockState === "saver") return `<div class="saver-clock">${timeStr()}</div><div class="saver-duck" aria-hidden="true">🦆</div>`;
  const head = `<div><div class="big-time">${timeStr()}</div><div class="date">${dateStr()}</div>`;
  if (lockState === "mchen")
    return `${head}<div class="user"><div class="avatar-lg">M</div><b>mchen</b><form data-form="mchen" class="row"><input id="mchen-pw" type="password" autocomplete="off" placeholder="Password" aria-label="Password for mchen" /><button class="primary">Sign in</button></form><p class="fine">Password hint: the top line of the gentle one.</p><button class="link" data-action="signout">Back</button></div></div>`;
  if (lockState === "mara")
    return `${head}<div class="user"><div class="avatar-lg">M</div><b>mchen’s desktop</b><div class="note">The desktop is empty except for one file, <i>for-whoever.txt</i>:<br><br>“You found my password twice. Go outside sometimes. The duck does. — M.”</div><button class="primary" data-action="signout">Sign out</button></div></div>`;
  return `${head}<div class="user"><div class="avatar-lg">${G.RANKS[s.rank][0]}</div><b>You · WS-0417</b><button class="primary" data-action="unlock">Unlock</button><button class="link" data-action="switchuser">Other user: mchen</button></div></div>`;
}
function lockScreen(state) {
  closePop();
  closeLauncher();
  if (state === "lock" && lockState !== "lock") S.play("lock");
  lockState = state;
  saverAt = state === "saver" ? Date.now() : 0;
  const el = $("lock");
  el.className = "lock " + (state === "saver" ? "saver" : "");
  el.innerHTML = lockHTML();
  el.hidden = false;
  el.querySelector("input, button")?.focus({ preventScroll: true });
}
function lockAction(a) {
  if (a === "unlock") {
    lockState = null;
    $("lock").hidden = true;
    S.play("open");
  } else lockScreen(a === "switchuser" ? "mchen" : "lock");
}
function wake() {
  lastInput = Date.now();
  if (lockState === "saver") lockScreen("lock");
}
["pointerdown", "keydown", "wheel"].forEach((ev) => document.addEventListener(ev, wake, true));
document.addEventListener("pointermove", () => {
  if (lockState !== "saver" || Date.now() - saverAt > 800) wake();
}, true);
/* idle, real-world time, and the hold music: checked by the desktop clock */
function checkClock() {
  const d = new Date();
  let found = false;
  if (d.getHours() < 4) found = G.secret(s, "nightowl") || found;
  if (d.getDay() === 4 && d.getHours() === 16 && d.getMinutes() >= 15 && d.getMinutes() <= 19 && ui.win.help?.open && !ui.win.help.min && G.secret(s, "livehelp")) {
    G.log(s, "Live help: “Hi, this is Greg. Nobody else does Thursdays. Is it the heater? It’s always the heater.”");
    found = true;
  }
  if (S.holdHeard() >= 60) found = G.secret(s, "hold") || found;
  if (lockState === "saver" && Date.now() - saverAt > 8000) found = G.secret(s, "screensaver") || found;
  if (!lockState && $("moment").hidden && Date.now() - lastInput > 180000) lockScreen("saver");
  if (lockState) $("lock").querySelectorAll(".big-time, .saver-clock").forEach((x) => (x.textContent = timeStr()));
  return found;
}

/* the desk remembers the old codes */
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konami = 0;
function parade() {
  const el = $("parade");
  el.innerHTML = Array.from({ length: 7 }, (_, i) => `<span style="animation-delay:${i * 0.45}s">🦆</span>`).join("");
  if (ui.sounds) S.preview("quack");
  setTimeout(() => (el.innerHTML = ""), 11000);
}

/* music */
function musicAction(id) {
  if (id === "toggle") S.toggle();
  else if (id === "next") S.next();
  else if (id === "prev") S.prev();
  else if (id === "shuffle") S.player.shuffle = !S.player.shuffle;
  else if (id === "repeat") S.player.repeat = !S.player.repeat;
  else if (id.startsWith("play:")) S.playTrack(Number(id.slice(5)));
}
S.onMusic(() => {
  renderChrome();
  if (ui.win.music?.open) renderWindows();
});
S.loadTracks();

/* updates and DLC */
let announced = "";
U.onUpdates((what) => {
  const u = U.state.update;
  if (u.state === "available" && announced !== u.version) {
    announced = u.version;
    notify(`Advanced Settings ${u.version} is available. Open Software Update to see what’s new.`, "updates");
  }
  if (what === "dlc-installed") notify(U.state.dlc.error ? U.state.dlc.error : "DLC changes take effect after a restart.", "updates");
  renderChrome();
  if (ui.win.updates?.open) renderWindows();
});
async function startUpdates() {
  const packs = await U.installedPacks();
  for (const m of packs) await applyPack(m);
  if (packs.length) render();
  if (ui.autoUpdate && Date.now() - (ui.lastCheck || 0) > 864e5) {
    ui.lastCheck = Date.now();
    saveUI();
    U.checkForUpdate();
  }
}

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
    w.y = Math.max(44, Math.min(innerHeight - 60, drag.y + dy));
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
  // Dragging captures the pointer on the window, so the event's target is the window, not the title bar.
  const hit = document.elementFromPoint(e.clientX, e.clientY);
  const bar = hit?.closest(".titlebar");
  if (!bar || hit.closest("button") || mobile()) return;
  const id = bar.parentElement.dataset.app;
  ui.win[id].max = !ui.win[id].max;
  saveUI();
  renderWindows();
});

/* ---------- clock ---------- */
let last = Date.now(),
  saveClock = 0;
const sig = () => JSON.stringify([s.jobs.map((j) => j.id), s.projects, s.stories, s.knowledge, s.logs.length, s.logs[0]?.time, s.over, s.trace, s.elapsed < s.duckLock, ui.win.help?.open && Math.floor(s.elapsed / 5)]);
setInterval(() => {
  const now = Date.now();
  const was = sig();
  s.playing = !!(ui.win.sudoku?.open && !ui.win.sudoku.min && !document.hidden);
  // A background tab, or a long gap after the browser froze it, counts as being away:
  // jobs keep going, but nothing can lose you the game while you aren't looking.
  const dt = (now - last) / 1000;
  G.tick(s, dt, document.hidden || dt > 5);
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
    for (const el of document.querySelectorAll("[data-rush]")) {
      const [offset, rush] = el.dataset.rush.split(":").map(Number);
      el.outerHTML = trafficHTML({ offset, rush });
    }
    S.step();
    for (const el of document.querySelectorAll("[data-music-pos]")) {
      if (el.dataset.musicPos === "time") el.textContent = mmss(S.player.position);
      else if (document.activeElement !== el) {
        el.value = Math.floor(S.player.position);
        fill(el);
      }
    }
    if (saveClock % 20 === 0) renderChrome();
    updateClock();
  }
  if (saveClock % 4 === 0 && checkClock()) {
    afterChange();
    render();
  }
  if (saveClock % 5 === 0) persist();
}, 500);
window.addEventListener("pagehide", persist);
// Leaving the desk for a long while counts as coming back, even without closing the tab.
let hiddenAt = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return void (hiddenAt = Date.now());
  if (hiddenAt && Date.now() - hiddenAt >= 20 * 60 * 1000 && !s.over) {
    G.welcomeBack(s);
    afterChange();
    persist();
    render();
  }
  hiddenAt = 0;
});
window.addEventListener("hashchange", () => {
  const id = location.hash.slice(1);
  if (APPS[id]) {
    openApp(id);
    render();
  }
});
function boot() {
  for (const id of Object.keys(ui.win)) if (!APPS[id]) delete ui.win[id];
  if (!ui.booted) {
    ui.booted = true;
    openApp("workbench");
    ui.win.workbench.x = Math.max(12, Math.round(innerWidth / 2 - 460));
    openApp("welcome");
    // Overlap the Workbench a little, but stay clear of the widgets.
    ui.win.welcome.x = Math.max(12, Math.min(innerWidth - ui.win.welcome.w - (innerWidth > 1100 ? 320 : 12), ui.win.workbench.x + 360));
    ui.win.welcome.y = 90;
  }
  fitWindows();
}
// Keeps every window reachable on the current screen: never wider or taller than it, title bar always on it.
function fitWindows() {
  for (const w of Object.values(ui.win)) {
    if (!w.w) continue;
    w.w = Math.max(300, Math.min(w.w, innerWidth - 16));
    w.h = Math.max(200, Math.min(w.h, innerHeight - 60));
    w.x = Math.max(8, Math.min(innerWidth - Math.min(w.w, 200), w.x));
    w.y = Math.max(44, Math.min(innerHeight - 120, w.y));
  }
}
let fitTimer = 0;
window.addEventListener("resize", () => {
  clearTimeout(fitTimer);
  fitTimer = setTimeout(() => {
    fitWindows();
    renderWindows();
    if (pop) closePop();
  }, 120);
});
boot();
if (APPS[location.hash.slice(1)]) openApp(location.hash.slice(1));
if (G.record(archive, s)) saveArchive();
render();
announce();
if (saveError) notify(saveError, "settings");
if (s.over) moment(s.over);
startUpdates();
