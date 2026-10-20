import { THREADS, REPLY_ALL, REPLY_ALL_PILE } from "./stories.js";
export { THREADS, REPLY_ALL, REPLY_ALL_PILE };

export const SKILLS = [
  {
    id: "web",
    name: "Web development",
    cost: 70,
    knowledge: 15,
    desc: "Make things for browsers. Unlocks Lunchboard, the lunch portal that is somehow mission-critical. Lunchboard earns a little budget on its own once it ships.",
  },
  {
    id: "tests",
    name: "Test harness",
    cost: 90,
    knowledge: 25,
    desc: "Tests now fix one defect on the way through. Real tests, as opposed to the other kind.",
  },
  {
    id: "hardware",
    name: "Second CPU core",
    cost: 130,
    knowledge: 40,
    desc: "Two jobs at full speed. Read and build at once, like a person with two hands.",
  },
  {
    id: "database",
    name: "Databases",
    cost: 140,
    knowledge: 50,
    desc: "Unlocks Archive Index and read access to the personnel archive. Every release indexes another box of records nobody asked for.",
  },
  {
    id: "scheduler",
    name: "Task scheduler",
    cost: 180,
    knowledge: 65,
    desc: "Tests, debugs and ships finished work by itself. It will not choose features. It has no taste.",
  },
  {
    id: "autocomplete",
    name: "Autocomplete",
    cost: 160,
    knowledge: 75,
    desc: "Writing jobs run 40% faster. Suggests the next line, and occasionally the next thought.",
  },
  {
    id: "systems",
    name: "Systems programming",
    cost: 220,
    knowledge: 95,
    desc: "Unlocks Quiet Monitor and the kind of diagnostics that do not show up in Diagnostics.",
  },
  {
    id: "assistant",
    name: "AI task assistant",
    cost: 300,
    knowledge: 120,
    desc: "A local assistant you can assign to development, reading or security. Very polite about everything.",
  },
  {
    id: "local",
    name: "Local model runtime",
    cost: 380,
    knowledge: 170,
    requires: "assistant",
    desc: "A third worker and a stronger assistant. Runs entirely on this machine, which is now warm.",
  },
];
export const PROJECTS = [
  {
    id: "pocket",
    name: "Pocket Notes",
    kind: "SCRIPT",
    desc: "A tiny notes utility with an unreasonable number of opinions about fonts.",
    skill: null,
    base: 45,
  },
  {
    id: "lunchboard",
    name: "Lunchboard",
    kind: "WEB SERVICE",
    desc: "The internal lunch portal. Three outages last quarter, all of them during lunch. Every shipped version earns a trickle of budget while it stays up.",
    skill: "web",
    base: 80,
  },
  {
    id: "archive",
    name: "Archive Index",
    kind: "DATABASE",
    desc: "Make forty years of company records searchable, including the ones nobody asked for. Each release indexes one more box.",
    skill: "database",
    base: 110,
  },
  {
    id: "monitor",
    name: "Quiet Monitor",
    kind: "SYSTEMS",
    desc: "Watches the processes that would prefer not to be watched, including the ones that watch you.",
    skill: "systems",
    base: 150,
  },
  {
    id: "workspace",
    name: "Workspace Zero",
    kind: "LEGACY",
    desc: "Owner: you. Created eleven days before your start date.",
    skill: null,
    bookmark: "workspace",
    base: 180,
  },
];
export const FEATURES = [
  {
    id: "search",
    name: "Search",
    desc: "Find things. Modest, reliable, quietly beloved.",
    time: 14,
    bugs: 1,
    reward: 1,
  },
  {
    id: "sync",
    name: "Cloud sync",
    desc: "More users, more edge cases, more feelings.",
    time: 22,
    bugs: 3,
    reward: 1.7,
  },
  {
    id: "performance",
    name: "Performance",
    desc: "Careful, quiet work. Fewer defects.",
    time: 18,
    bugs: 0,
    reward: 1.2,
  },
];
export const RANKS = [
  "Junior Developer (Provisional)",
  "Developer",
  "Senior Developer",
  "Staff Engineer",
  "Principal Engineer",
];
export const TRACKS = ["specialist", "manager", "automator"];

/* Records revealed one per Archive Index release. Several are clues. */
export const ARCHIVE = [
  "Work order 1187 · Facilities: “Vent 7 (loading dock) runs warm around the clock. Do not block. Something keeps sitting on it.”",
  "Memo · Security: “Secure-wing door sensitivity lowered to 1.2 kg after interns reported being ignored by it.”",
  "Sync job · Web: “Directory entries tagged public copy to stillwater.com nightly.” Last entry created: “Duck”, by mchen, tagged public (test).",
  "Accounts · IT: “temp-contractor-0417 — owner: none — home workstation: WS-0417 — status: active.”",
  "HR · retention agreement, N. Ashby (Platform): “Employee remains on site until Stillwater Assure reports that it is fully calm.” Signed nine years ago. Countersigned by a smiley face.",
  "Consumer pilots · IT: “Hearth smart plugs sign in with a shared contractor credential, for convenience.” Credential: temp-contractor-0417.",
  "Box 7 is empty except for a sticky note: “Some records were never filed. Ask the desk.”",
];
/* Notes recovered by shipping Workspace Zero, one per version. */
export const WORKSPACE_NOTES = [
  "Workspace Zero v1.0 notes: “Day 3. Every test passes. I wrote a test that should fail. It passed.”",
  "Workspace Zero v2.0 notes: “Juno in QA noticed too. Told her to stay quiet. She won’t. I like her.”",
  "Workspace Zero v3.0 notes: “Neil asked about my weekend again. I gave him every detail. He wrote them down.”",
  "Workspace Zero v4.0 notes: “The consumer pilots use the same dashboards. Somebody’s parents are going to buy a fridge that guesses.”",
];

/* Duck corrections: the answer has to be found elsewhere; every option is mundane. */
export const DUCK_CASES = [
  {
    release: 0,
    question: "Why won’t the duck leave headquarters?",
    options: [
      "It is nesting under the lobby ficus.",
      "The courtyard fountain is the only open water nearby.",
      "It sits on a warm vent by the loading dock, and someone leaves oats out at 12:15.",
      "It follows the cleaning crew for crumbs.",
    ],
    answer: 2,
  },
  {
    release: 2,
    question: "How does the duck “predict” layoffs?",
    options: [
      "It reacts to raised voices in meeting rooms.",
      "It follows cardboard boxes, and the break-room boxes are full of crackers.",
      "It waits by the parking lot at the end of the quarter.",
      "It follows people wearing lanyards.",
    ],
    answer: 1,
  },
  {
    release: 5,
    question: "How did the duck get into the secure wing?",
    options: [
      "It walked in behind an intern.",
      "Through an open window on the second floor.",
      "A cleaner propped the door with a bucket.",
      "The door opens for anything over 1.2 kg that moves with purpose.",
    ],
    answer: 3,
  },
  {
    release: 8,
    question: "How did the duck end up on the board of directors?",
    options: [
      "A test entry in the employee directory was tagged public and synced to the website.",
      "A shareholder proxy vote, cast as a joke.",
      "A typo for “Doug” on the investor relations page.",
      "Marketing added it to a slide that was later published.",
    ],
    answer: 0,
  },
];

export const SUDOKU = {
  givens:
    "407396000852410009390800401070008502960024107020000980730085200200739008600240093",
  solution:
    "417396825852417369396852471173968542968524137524173986739685214241739658685241793",
};
/* Panel B: flipping a breaker flips its row/column neighbours. Goal: all on except B7 (Greg). */
export const BREAKER = {
  start: [1, 0, 1, 0, 0, 1, 1, 1, 0],
  goal: [1, 1, 1, 1, 1, 1, 0, 1, 1],
};
/* QuickFix trace: a real hop is exactly one TTL lower and never faster than the last. */
export const TRACE = [
  [
    { addr: "10.4.17.1", ttl: 63, rtt: 2 },
    { addr: "10.4.0.9", ttl: 63, rtt: 0.4 },
    { addr: "10.9.1.1", ttl: 62, rtt: 3 },
  ],
  [
    { addr: "172.16.40.2", ttl: 61, rtt: 1 },
    { addr: "172.16.0.1", ttl: 62, rtt: 6 },
    { addr: "172.16.9.4", ttl: 60, rtt: 8 },
  ],
  [
    { addr: "198.51.100.7", ttl: 61, rtt: 19 },
    { addr: "198.51.100.30", ttl: 60, rtt: 4 },
    { addr: "198.51.100.12", ttl: 61, rtt: 3 },
  ],
  [
    { addr: "203.0.113.90", ttl: 59, rtt: 12 },
    { addr: "203.0.113.64", ttl: 60, rtt: 31 },
    { addr: "203.0.113.17", ttl: 58, rtt: 33 },
  ],
  [
    { addr: "relay.tempstaff.example", ttl: 59, rtt: 44 },
    { addr: "cdn.calm.example", ttl: 59, rtt: 20 },
    { addr: "backup.stillwater.example", ttl: 57, rtt: 50 },
  ],
];
export const TRACE_ANSWERS = [0, 1, 0, 1, 0];
export const CREDENTIAL = "temp-contractor-0417";
export const BLOG_PASSWORD = SUDOKU.solution.slice(0, 9);

export const SHOP = [
  { id: "chair", name: "Ergonomic chair", cost: 120, flag: 4, desc: "Writing jobs +10%. Arguably a business purchase." },
  { id: "headphones", name: "Noise-cancelling headphones", cost: 90, flag: 4, desc: "Reading +25%. Cancels most noise and some meetings." },
  { id: "plant", name: "Desk plant", cost: 40, flag: 8, desc: "Acceptable Use concerns fade twice as fast while you work. Plants look busy." },
  { id: "rubberduck", name: "Rubber duck (debugging edition)", cost: 25, flag: 8, desc: "Debug jobs run twice as fast. You explain the bug to the duck. The duck understands." },
  { id: "crackers", name: "Cardboard box of crackers", cost: 15, flag: 10, desc: "A snack. In a box. Nothing else will happen." },
  { id: "heater", name: "Compact space heater", cost: 60, flag: 10, desc: "Cosy. 1,500 W. What could go wrong on a shared circuit?" },
];
export const BLOG_TOPICS = [
  { id: "baking", name: "Weekend baking", flag: 6, readers: 3 },
  { id: "tips", name: "Ten productivity tips I do not follow", flag: 6, readers: 5 },
  { id: "duck", name: "About the duck at work", flag: 8, readers: 12 },
  { id: "job", name: "What my job is actually like", flag: 26, readers: 40 },
];

export const SECRETS = [
  ["workspace", "Workspace Zero", "A theme importer that wants a snapshot."],
  ["channel", "Channel 04", "Count the channels. Then unplug."],
  ["hourlier", "Hourlier", "Some notifications refuse to be disabled. Try anyway."],
  ["devmode", "Developer options", "Nobody locked the build number."],
  ["vendor", "Preferred vendor", "Business purchases go through Procurement. All purchases are business purchases."],
  ["tidepool", "Tidepool", "Education is always permitted."],
  ["sudoku", "Gentle solver", "Something gentle in the store."],
  ["blog", "Mara’s blog", "Translate English into English. Then remember the top line."],
  ["dashboard", "The duck dashboard", "Some addresses only answer the desk itself."],
  ["scoop", "Scoop", "Know the truth before the headline."],
  ["breaker", "Greg’s space heater", "Thursdays, 4:17. Leave one switch off."],
  ["greg", "Now you’re Greg", "Procurement will buy anything. Even that."],
  ["deskduck", "Desk duck", "It follows boxes."],
  ["trace", "Followed the packet", "Liars can’t arrive early."],
  ["guess", "Educated guess", "Revoke what you never traced."],
  ["citizen", "Citizen journalist", "Write about what you actually know."],
  ["appendix", "Appendix H", "Keep reading. Keep coming back."],
  ["returns", "The desk remembers", "Leave and return. Often."],
  ["furnace", "Herself again", "Remind a friend of something only the two of you know."],
  ["outofoffice", "Out of office", "An impossible condition is no condition at all."],
  ["returned", "Return to sender", "Tell your parents the truth."],
  ["partofproblem", "Part of the problem", "Reply all. Just once."],
  ["cake", "There was cake", "Some emails expire faster than others."],
  ["phish", "Not today", "Read who it’s really from."],
].map(([id, name, hint]) => ({ id, name, hint }));
export const ENDINGS = [
  { id: "probation", name: "End of probation", hint: "Finish every story." },
  { id: "fired", name: "Released to the community", hint: "Mind the Calm Index." },
  { id: "breach", name: "Reimaged", hint: "Unsigned helpers get bolder." },
];

const STAGES = ["plan", "writing", "written", "testing", "tested", "debugging"];
const JOB_KINDS = ["write", "test", "debug", "reading"];
const INSTALLS = ["toolshed", "identified", "anywhere"];
const BOOKMARKS = ["workspace", "channel"];
const DOWNLOADS = ["tidepool"];
const GAMES = ["sudoku"];

export function fresh(now = Date.now()) {
  return {
    version: 3,
    money: 40,
    knowledge: 0,
    users: 0,
    releases: 0,
    rank: 0,
    skills: [],
    projects: {
      pocket: { version: 0, stage: "plan", bugs: 0, feature: "search" },
    },
    jobs: [],
    reading: 0,
    auto: false,
    ai: "development",
    aiClock: 10,
    settings: { safe: true, legacy: false, duck: true, isolated: false },
    stories: { employee: 0, quickfix: 0, duck: 0, career: 0 },
    bookmarks: [],
    logs: [
      {
        text: "Welcome to Stillwater. Your workstation has been prepared for you. The previous user has been mostly removed.",
        time: now,
      },
    ],
    last: now,
    elapsed: 0,
    nextId: 1,
    secrets: [],
    over: null,
    suspicion: 0,
    warned: 0,
    breach: 0,
    returns: 0,
    duckLock: 0,
    devTaps: 0,
    installs: "toolshed",
    vendor: false,
    perks: [],
    downloads: [],
    tidepool: false,
    games: [],
    sudoku: SUDOKU.givens,
    breaker: [...BREAKER.start],
    trace: -1,
    blog: { posts: [], readers: 0, mara: false },
    private: false,
    playing: false,
    threads: {},
    incidents: {
      replyall: { state: 0, n: 0, at: 0, joined: -1, muted: false },
      cake: { state: 0, at: 0 },
      phish: { state: 0, at: 0 },
    },
    training: 0,
  };
}
export function log(s, text) {
  s.logs.unshift({ text, time: s.last });
  s.logs = s.logs.slice(0, 40);
}
export function secret(s, id) {
  if (s.secrets.includes(id) || !SECRETS.some((x) => x.id === id)) return false;
  s.secrets.push(id);
  return true;
}
export function unlocked(s, p) {
  return (
    (!p.skill || s.skills.includes(p.skill)) &&
    (!p.bookmark || s.bookmarks.includes(p.bookmark))
  );
}
export function workers(s) {
  return (
    1 +
    Number(s.skills.includes("hardware")) +
    Number(s.skills.includes("local"))
  );
}
export function quickfixLoad(s) {
  if (s.stories.quickfix !== 1 && s.stories.quickfix !== 2) return 0;
  return s.breach >= 600 ? 0.4 : s.breach >= 300 ? 0.3 : 0.2;
}
export function calm(s) {
  return Math.max(1, 99 - Math.floor(s.suspicion / 3) - Math.max(0, s.returns - 3));
}
export function addJob(s, kind, project, total) {
  if (s.over || s.jobs.some((j) => j.kind === kind && j.project === project))
    return false;
  s.jobs.push({ id: s.nextId++, kind, project, total, done: 0, paused: false });
  return true;
}
export function start(s, id, feature) {
  const p = PROJECTS.find((p) => p.id === id);
  if (s.over || !p || !unlocked(s, p)) return false;
  const state = (s.projects[id] ??= {
    version: 0,
    stage: "plan",
    bugs: 0,
    feature: "search",
  });
  if (state.stage !== "plan") return false;
  const f = FEATURES.find((f) => f.id === feature);
  if (!f) return false;
  state.feature = feature;
  state.stage = "writing";
  state.bugs = Math.max(
    0,
    f.bugs + (s.settings.safe ? 0 : 2) - (s.track === "specialist" ? 1 : 0),
  );
  return addJob(s, "write", id, f.time * (s.settings.safe ? 1 : 0.7));
}
export function test(s, id) {
  const p = s.projects[id];
  if (s.over || !p || p.stage !== "written") return false;
  p.stage = "testing";
  return addJob(s, "test", id, 8);
}
export function debug(s, id) {
  const p = s.projects[id];
  if (s.over || !p || p.stage !== "tested" || p.bugs <= 0) return false;
  p.stage = "debugging";
  return addJob(s, "debug", id, 6 + p.bugs * 2);
}
export function release(s, id) {
  const p = s.projects[id],
    def = PROJECTS.find((x) => x.id === id);
  if (s.over || !p || p.stage !== "tested" || p.bugs > 0) return false;
  const f = FEATURES.find((f) => f.id === p.feature);
  const money = Math.round(
    def.base *
      f.reward *
      (1 + p.version * 0.12) *
      (s.track === "manager" ? 1.25 : 1),
  );
  s.money += money;
  s.users += Math.round(money * 1.4);
  s.knowledge += (20 + Math.round(def.base / 10)) * (id === "monitor" ? 2 : 1);
  s.releases++;
  p.version++;
  p.stage = "plan";
  log(
    s,
    `${def.name} v${p.version}.0 shipped. +$${money}. Every test passed on the first run, as they always do.`,
  );
  if (id === "workspace" && p.version <= WORKSPACE_NOTES.length)
    log(s, WORKSPACE_NOTES[p.version - 1]);
  if (id === "archive" && p.version <= ARCHIVE.length)
    log(s, `Archive Index · box ${p.version}: ${ARCHIVE[p.version - 1]}`);
  if (id === "monitor" && s.breach > 0) {
    s.breach = Math.max(0, s.breach - 150);
    log(s, "Quiet Monitor shipped. Unsigned activity pushed back. QuickFix is sulking.");
  }
  if (s.releases === 2) {
    s.stories.quickfix = 1;
    log(
      s,
      "QuickFix installed itself to help with build performance, using a contractor credential (temp-contractor-••••). Build performance is down 20%. QuickFix is thrilled.",
    );
  }
  if (s.track === "automator" && s.auto && s.skills.includes("scheduler"))
    start(s, id, p.feature);
  return true;
}
export function buy(s, id) {
  const k = SKILLS.find((k) => k.id === id);
  if (
    s.over ||
    !k ||
    s.skills.includes(id) ||
    s.money < k.cost ||
    s.knowledge < k.knowledge ||
    (k.requires && !s.skills.includes(k.requires))
  )
    return false;
  s.money -= k.cost;
  s.skills.push(id);
  log(s, `${k.name} installed. Your workstation is a little more yours, legally still ours.`);
  return true;
}
export function read(s) {
  return addJob(s, "reading", null, 20);
}
export function promote(s, track) {
  const rank = Math.min(4, Math.floor(s.releases / 3));
  if (s.over || rank <= s.rank || !TRACKS.includes(track)) return false;
  s.rank++;
  s.stories.career = s.rank;
  s.track = track;
  s.money += 100 * s.rank;
  log(
    s,
    `Promoted to ${RANKS[s.rank]}. Budget +$${100 * s.rank}. Your email signature was updated eleven minutes before anyone told you.`,
  );
  return true;
}
export function discover(s, id) {
  if (s.over || !BOOKMARKS.includes(id) || s.bookmarks.includes(id))
    return false;
  if (id === "workspace" && !(s.settings.legacy && s.jobs.some((j) => j.paused)))
    return false;
  if (id === "channel" && !(s.skills.includes("systems") && s.settings.isolated))
    return false;
  if (id === "workspace") {
    s.stories.employee = Math.max(1, s.stories.employee);
    log(
      s,
      "Workspace Zero restored: one project, 212 notes, zero colors. A sticky note on the README says: “The fourth channel is not on the network. That is the point.”",
    );
  }
  if (id === "channel") {
    s.stories.employee = 3;
    log(
      s,
      "Channel 04 opened. Mara Chen left on her own, with a reproducible audit: Stillwater Assure does not measure anything. The dashboards are green because green is the color.",
    );
  }
  s.bookmarks.push(id);
  secret(s, id);
  return true;
}
export function buildRunning(s) {
  return s.jobs.some((j) => !j.paused && j.kind !== "reading");
}
export function story(s, action) {
  if (s.over) return false;
  if (
    action === "attachment" &&
    s.skills.includes("database") &&
    s.stories.employee === 1
  ) {
    s.stories.employee = 2;
    log(
      s,
      "Archive › Personnel › Chen, Mara: resignation accepted. Exit interview: “declined, politely.” Attachment: “Disconnect before you look at channel four. They cannot watch what is not connected.”",
    );
    return true;
  }
  if (action === "observe" && s.stories.quickfix === 1) {
    // QuickFix only phones home while it has a build to "help" with.
    if (!buildRunning(s) || s.settings.isolated || s.trace >= 0) return false;
    s.trace = 0;
    return true;
  }
  if (action === "quarantine" && [1, 2].includes(s.stories.quickfix)) {
    s.stories.quickfix = s.stories.quickfix === 2 ? 3 : 4;
    s.trace = -1;
    log(s, "QuickFix quarantined. It asked to stay. Build capacity restored.");
    return true;
  }
  return false;
}
/* One step of the trace mini game. Returns "next", "done" or "lost". */
export function hop(s, choice) {
  if (s.over || s.trace < 0 || s.stories.quickfix !== 1) return false;
  if (choice !== TRACE_ANSWERS[s.trace]) {
    s.trace = -1;
    s.breach += 60;
    log(s, "Trace lost. A reply arrived before it was sent, and you believed it. QuickFix noticed you looking.");
    return "lost";
  }
  s.trace++;
  if (s.trace < TRACE.length) return "next";
  s.trace = -1;
  s.stories.quickfix = 2;
  secret(s, "trace");
  log(
    s,
    `Trace complete. QuickFix copies your real build times to relay.tempstaff.example, signed in as ${CREDENTIAL}. Someone wants the numbers Stillwater does not publish.`,
  );
  return "done";
}
export function revoke(s, text) {
  if (s.over || ![3, 4].includes(s.stories.quickfix)) return false;
  const guess = String(text).trim().toLowerCase();
  if (guess !== CREDENTIAL) {
    log(s, `No credential named “${guess.slice(0, 40) || "nothing"}”. Identity & Calm suggests checking your spelling, and your assumptions.`);
    return false;
  }
  if (s.stories.quickfix === 4) secret(s, "guess");
  s.stories.quickfix = 5;
  s.breach = 0;
  s.knowledge += 25;
  log(
    s,
    `Signing policy enforced. ${CREDENTIAL} revoked. Its last sign-in was from this desk, on a Thursday, at 4:17 p.m. Probably Greg’s space heater.`,
  );
  return true;
}
export function duckOpen(s, i = s.stories.duck) {
  return i < DUCK_CASES.length && s.releases >= DUCK_CASES[i].release;
}
export function correct(s, option) {
  const i = s.stories.duck;
  if (s.over || i >= DUCK_CASES.length || s.elapsed < s.duckLock) return false;
  const early = !duckOpen(s);
  if (early && !s.secrets.includes("dashboard")) return false;
  if (Number(option) !== DUCK_CASES[i].answer) {
    s.duckLock = s.elapsed + 60;
    log(s, "Duck correction rejected. The Daily Current stands by its reporting, and will not take questions for a minute.");
    return "wrong";
  }
  s.stories.duck++;
  if (early) secret(s, "scoop");
  log(
    s,
    [
      "Correction filed: the duck sits by the loading-dock exhaust vent, which is warm. The cafeteria leaves oats out at 12:15. Mystery solved.",
      "Correction filed: the duck follows anyone carrying a cardboard box. Break-room boxes contain crackers. It predicts snacks, not layoffs.",
      "Correction filed: the secure wing opens for anything over 1.2 kg moving with purpose. The duck qualifies. Several interns do not.",
      "Correction filed: “Board member: Duck” was a joke directory entry that synced to the public site. The duck has been offered a pond-side feeding area instead.",
    ][i] + (early ? " You filed it before the story even ran." : ""),
  );
  return true;
}

/* ---------- Acceptable Use and the wider computer ---------- */
export function flag(s, amount) {
  if (s.over || s.settings.isolated || amount <= 0) return;
  s.suspicion = Math.min(100, s.suspicion + amount * (s.private ? 2 : 1));
  if (s.suspicion >= 40 && s.warned < 1) {
    s.warned = 1;
    log(s, "People & Serenity: a gentle note about acceptable use. Your Calm Index has been shared with your manager, gently.");
  }
  if (s.suspicion >= 70 && s.warned < 2) {
    s.warned = 2;
    log(s, "People & Serenity: final wellness reminder. Your workstation activity is now being reviewed. Please be calm on purpose.");
  }
  if (s.suspicion >= 100) end(s, "fired");
}
export function end(s, kind) {
  if (s.over) return false;
  s.over = kind;
  s.jobs = [];
  log(
    s,
    kind === "fired"
      ? "People & Serenity: your role has been released to the community. Please leave your badge, your mug, and your calm."
      : "IT: WS-0417 has been reimaged after an unsigned plugin granted itself administrator rights. Your progress was not considered essential.",
  );
  return true;
}
const host = (u) => u.split("/")[0];
export function normalize(url) {
  return String(url)
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "")
    .slice(0, 120);
}
export const OPEN_SITES = [
  "intranet.stillwater",
  "facilities.stillwater",
  "directory.stillwater",
  "procurement.stillwater",
  "translate.stillwater",
  "stillwater.com",
  "learn.tidepool.games",
  "ws-0417.local",
];
const PERSONAL = { "tidepool.games": "Games", "quillpost.blog": "Blogs & social", "dealdrift.shop": "Shopping" };
export function category(h) {
  if (PERSONAL[h]) return PERSONAL[h];
  if (/\.(games?|gg)$|game|play/.test(h)) return "Games";
  if (/\.(shop|store)$|shop|mart|buy|amazon|ebay/.test(h)) return "Shopping";
  if (/\.(blog|social)$|blog|tube|gram|book|tok|reddit|twitter|x\.com/.test(h)) return "Blogs & social";
  if (/news|times|post/.test(h)) return "News (unapproved)";
  return "Uncategorised, and therefore suspicious";
}
/* Where a typed address actually goes. Personal traffic is noticed. */
export function visit(s, url) {
  let u = normalize(url) || "intranet.stillwater";
  let via = null;
  if (u.startsWith("translate.stillwater/") && u.length > 21) {
    via = "translate";
    u = normalize(u.slice(21));
  }
  const h = host(u);
  if (s.settings.isolated && h !== "ws-0417.local")
    return { url: u, status: "offline" };
  if (s.elapsed < s.training) return { url: u, status: "training" };
  if (h === "ws-0417.local") {
    if (secret(s, "dashboard"))
      log(s, "ws-0417.local answered. Someone left a server running on this desk, and it only talks about the duck.");
    return { url: u, status: "ok", via };
  }
  if (via) {
    flag(s, PERSONAL[h] ? 3 : 1);
    return { url: u, status: "ok", via, category: PERSONAL[h] ? category(h) : null };
  }
  if (OPEN_SITES.includes(h)) return { url: u, status: "ok" };
  flag(s, 1);
  return { url: u, status: "blocked", category: category(h) };
}
export function addVendor(s, name) {
  if (s.over || s.settings.isolated) return false;
  const n = normalize(name);
  if (n !== "dealdrift.shop") {
    log(s, `Procurement could not find a vendor at “${n.slice(0, 40)}”. It looked, briefly.`);
    return false;
  }
  if (s.vendor) return false;
  s.vendor = true;
  secret(s, "vendor");
  log(s, "Procurement: DealDrift added as a vendor, pending review. Reviews are not currently performed.");
  return true;
}
export function shop(s, id) {
  const item = SHOP.find((x) => x.id === id);
  if (s.over || !s.vendor || s.settings.isolated || !item || s.perks.includes(id) || s.money < item.cost)
    return false;
  s.money -= item.cost;
  s.perks.push(id);
  log(s, `Procurement approved: ${item.name}, charged to the development budget. Reason given: “business”.`);
  if (id === "crackers") {
    secret(s, "deskduck");
    log(s, "A duck has been seen near your desk. It is looking at the box.");
  }
  if (id === "heater") {
    secret(s, "greg");
    if (s.breaker.join("") === BREAKER.goal.join("")) s.breaker[6] = 1;
    log(s, "Facilities: Panel B tripped again. Somebody has a space heater. The build server would like a word.");
  }
  flag(s, item.flag);
  return true;
}
export function breakerOk(s) {
  return s.breaker.join("") === BREAKER.goal.join("");
}
export function flip(s, i) {
  if (s.over || s.settings.isolated || !(i >= 0 && i < 9) || breakerOk(s)) return false;
  for (const j of [i, i - 3, i + 3, i % 3 ? i - 1 : -1, i % 3 < 2 ? i + 1 : -1])
    if (j >= 0 && j < 9) s.breaker[j] ^= 1;
  if (breakerOk(s)) {
    if (secret(s, "breaker"))
      log(s, "Panel B restored, with B7 (GREG — DO NOT) left off. The build server is stable for the first Thursday in living memory. Builds +10%.");
    else log(s, "Panel B restored. B7 stays off this time.");
  }
  return true;
}
export function post(s, topic) {
  const t = BLOG_TOPICS.find((x) => x.id === topic);
  if (s.over || !t || s.settings.isolated) return false;
  s.blog.posts.unshift(topic);
  s.blog.posts = s.blog.posts.slice(0, 12);
  s.blog.readers += t.readers;
  if (topic === "duck" && s.stories.duck >= 2 && secret(s, "citizen"))
    log(s, "The Daily Current quoted your blog post about the duck. They spelled “oats” wrong.");
  flag(s, t.flag);
  return true;
}
export function unlockBlog(s, pw) {
  if (s.over || s.blog.mara) return false;
  if (String(pw).replace(/\s/g, "") !== BLOG_PASSWORD) return false;
  s.blog.mara = true;
  secret(s, "blog");
  log(s, "quillpost.blog/marachen unlocked. Three posts, written after her last day.");
  return true;
}
export function tap(s) {
  if (s.over || s.secrets.includes("devmode")) return 0;
  s.devTaps++;
  if (s.devTaps >= 7) {
    secret(s, "devmode");
    log(s, "Developer options enabled. IT has been notified, in theory.");
    return 0;
  }
  return 7 - s.devTaps;
}
export function setInstalls(s, v) {
  if (s.over || !s.secrets.includes("devmode") || !INSTALLS.includes(v)) return false;
  s.installs = v;
  return true;
}
export function download(s, id) {
  if (s.over || !DOWNLOADS.includes(id) || s.downloads.includes(id) || s.settings.isolated) return false;
  s.downloads.push(id);
  return true;
}
export function install(s, id) {
  if (s.over || id !== "tidepool" || !s.downloads.includes(id) || s.tidepool) return false;
  if (s.installs === "toolshed") {
    log(s, "Installer blocked: this workstation installs software from Toolshed only. Managed by IT, who are managed by nobody.");
    return false;
  }
  s.tidepool = true;
  secret(s, "tidepool");
  log(s, "Tidepool (Classroom Edition) installed. Signed by Tidepool Ltd. Learning has never been so quiet.");
  return true;
}
export function getGame(s, id) {
  if (s.over || !s.tidepool || !GAMES.includes(id) || s.games.includes(id)) return false;
  s.games.push(id);
  return true;
}
export function sudokuSolved(s) {
  return s.sudoku === SUDOKU.solution;
}
export function fill(s, i, v) {
  if (s.over || !s.games.includes("sudoku") || !(i >= 0 && i < 81)) return false;
  if (SUDOKU.givens[i] !== "0" || sudokuSolved(s)) return false;
  v = Number(v);
  if (!(Number.isInteger(v) && v >= 0 && v <= 9)) return false;
  s.sudoku = s.sudoku.slice(0, i) + v + s.sudoku.slice(i + 1);
  if (sudokuSolved(s) && secret(s, "sudoku"))
    log(s, "Gentle Sudoku solved. Leaderboard unlocked: you are the second person ever to finish it on this machine.");
  return true;
}
export function appendix(s) {
  if (s.over || s.reading < 6 || s.returns < 3) return false;
  if (secret(s, "appendix"))
    log(s, "Appendix H read. It is one sentence long: “Time here is measured in returns.”");
  return true;
}
/* Called once per session when an existing save is loaded. */
export function welcomeBack(s) {
  if (s.over) return;
  s.returns++;
  const lines = [
    "",
    "Welcome back.",
    "Welcome back. Your chair was warm. It is a nice chair.",
    "Welcome back. Something on the desk was moved a little to the left.",
    "Welcome back. The Trash is a little fuller than you left it.",
    "Welcome back. People & Serenity has updated your onboarding materials, again.",
    "Welcome back. You have been here before. You have been here before.",
    "Welcome back. The workstation has begun preparing for the next user.",
  ];
  log(s, lines[Math.min(lines.length - 1, Math.ceil(s.returns / 2))] || "Welcome back.");
  if (s.returns >= 12 && secret(s, "returns"))
    log(s, "People & Serenity: onboarding materials for WS-0417’s next user are ready. They mention you, as “the previous user”.");
}

/* ---------- conversations ---------- */
export function thread(s, id) {
  return (s.threads[id] ??= { step: 0, open: false, at: 0, rel: 0, picks: [], unread: false });
}
export function beatLines(s, beat) {
  return typeof beat.lines === "function" ? beat.lines(s) : beat.lines;
}
const interactive = (beat) => !!(beat.choices || beat.input);
function advance(s, t) {
  t.step++;
  t.open = false;
  t.at = s.elapsed;
  t.rel = s.releases;
}
function deliver(s) {
  for (const [id, def] of Object.entries(THREADS)) {
    const t = thread(s, id);
    const beat = def.beats[t.step];
    if (!beat || t.open || !beat.when(s, t)) continue;
    t.open = true;
    t.unread = true;
    if (!interactive(beat)) advance(s, t);
  }
}
/* Pick a reply. Returns false if it isn't available, "retry" if it doesn't move things on. */
export function say(s, id, i) {
  const def = THREADS[id];
  const t = def && thread(s, id);
  const beat = t && def.beats[t.step];
  const c = beat?.choices?.[i];
  if (s.over || !t.open || !c || (c.requires && !c.requires(s))) return false;
  t.picks.push({ step: t.step, i });
  t.picks = t.picks.slice(-60);
  if (c.secret) secret(s, c.secret);
  if (c.retry) return "retry";
  advance(s, t);
  return true;
}
/* Free-text reply, for beats that need you to remember something. */
export function type(s, id, text) {
  const def = THREADS[id];
  const t = def && thread(s, id);
  const beat = t && def.beats[t.step];
  text = String(text).trim().slice(0, 80);
  if (s.over || !t.open || !beat?.input || !text) return false;
  const ok = beat.input.match.test(text);
  t.picks.push({ step: t.step, text, ok });
  t.picks = t.picks.slice(-60);
  if (!ok) return "retry";
  if (beat.input.secret) secret(s, beat.input.secret);
  advance(s, t);
  return true;
}
export function readThread(s, id) {
  if (!THREADS[id]) return false;
  thread(s, id).unread = false;
  return true;
}

/* ---------- small incidents ---------- */
export function replyAllLines(s) {
  const r = s.incidents.replyall;
  if (r.joined < 0) return REPLY_ALL;
  return [...REPLY_ALL.slice(0, r.joined), ["You", "Please stop replying all."], ...REPLY_ALL_PILE, ...REPLY_ALL.slice(r.joined)];
}
export function replyAll(s, action) {
  const r = s.incidents.replyall;
  if (s.over || r.state !== 1) return false;
  if (action === "mute") {
    if (r.muted) return false;
    r.muted = true;
    return true;
  }
  if (action !== "join" || r.joined >= 0) return false;
  r.joined = r.n;
  r.n++;
  secret(s, "partofproblem");
  log(s, "You replied all. Within seconds, six more people replied all to say they agreed with you.");
  return true;
}
export function cake(s) {
  const c = s.incidents.cake;
  if (s.over || c.state !== 1) return false;
  c.state = 2;
  s.knowledge += 5;
  secret(s, "cake");
  log(s, "You got cake. It was Kevin’s birthday. Kevin seemed confused, but pleased. +5 knowledge (sugar).");
  return true;
}
export function phish(s, action) {
  const p = s.incidents.phish;
  if (s.over || p.state !== 1 || !["click", "report"].includes(action)) return false;
  if (action === "report") {
    p.state = 2;
    secret(s, "phish");
    log(s, "IT: thanks for reporting! That was a test. You passed. Most people don’t. Juno reported it nine times.");
  } else {
    p.state = 3;
    s.training = s.elapsed + 90;
    flag(s, 5);
    log(s, "IT: you have been enrolled in Mandatory Calm Security Training. Wayfinder is closed for 90 seconds, for your safety.");
  }
  return true;
}
function incidents(s) {
  const { replyall: r, cake: c, phish: p } = s.incidents;
  if (r.state === 0 && s.releases >= 3) {
    Object.assign(r, { state: 1, n: 1, at: s.elapsed });
    log(s, "People & Serenity (all staff): the fridge in kitchen 3 will be cleaned out Friday. Label your calm.");
  } else if (r.state === 1 && s.elapsed >= r.at + 15) {
    r.n++;
    r.at = s.elapsed;
    if (r.n >= replyAllLines(s).length) {
      r.state = 2;
      log(s, "People & Serenity has calmed the all-staff thread. Replying all is now disabled for everyone except the duck.");
    }
  }
  if (c.state === 0 && s.releases >= 4 && r.state === 2) {
    Object.assign(c, { state: 1, at: s.elapsed });
    log(s, "Kevin (Accounts): CAKE in kitchen 3!! First come first served 🎂");
  } else if (c.state === 1 && s.elapsed > c.at + 45) c.state = 3;
  if (p.state === 0 && s.releases >= 5) {
    Object.assign(p, { state: 1, at: s.elapsed });
    log(s, "IT Security <it-securlty@stillwater.co>: Your password expires today. Keep it calm: click here to renew.");
  }
}

export function tick(s, seconds, offline = false) {
  seconds = Math.min(Math.max(seconds, 0), 7200);
  if (s.over) return s;
  let remaining = seconds;
  while (remaining > 0 && !s.over) {
    const dt = Math.min(1, remaining);
    remaining -= dt;
    s.elapsed += dt;
    const active = s.jobs.filter((j) => !j.paused);
    const share = Math.min(1, workers(s) / Math.max(1, active.length));
    for (const j of active) {
      let speed = share;
      if (j.kind === "write" && s.skills.includes("autocomplete")) speed *= 1.4;
      if (j.kind === "write" && s.perks.includes("chair")) speed *= 1.1;
      if (j.kind === "debug" && s.perks.includes("rubberduck")) speed *= 2;
      if (j.kind === "reading" && s.perks.includes("headphones")) speed *= 1.25;
      if (j.kind !== "reading" && breakerOk(s)) speed *= 1.1;
      if (
        s.skills.includes("assistant") &&
        ((s.ai === "development" && j.kind !== "reading") ||
          (s.ai === "reading" && j.kind === "reading"))
      )
        speed *= s.skills.includes("local") ? 1.8 : 1.4;
      speed *= 1 - quickfixLoad(s);
      j.done += dt * speed;
    }
    for (const j of [...s.jobs]) {
      if (j.done < j.total) continue;
      s.jobs = s.jobs.filter((k) => k.id !== j.id);
      const p = s.projects[j.project];
      if (j.kind === "write") p.stage = "written";
      if (j.kind === "test") {
        p.stage = "tested";
        if (s.skills.includes("tests")) p.bugs = Math.max(0, p.bugs - 1);
      }
      if (j.kind === "debug") {
        p.bugs = 0;
        p.stage = "tested";
      }
      if (j.kind === "reading") {
        s.reading++;
        s.knowledge += 8;
        log(s, "Reading complete. +8 knowledge. Some of it was even true.");
      }
    }
    if (s.trace >= 0 && !buildRunning(s)) {
      s.trace = -1;
      log(s, "Trace dropped: QuickFix stopped phoning home when the build stopped.");
    }
    const lunch = s.projects.lunchboard?.version ?? 0;
    if (lunch) s.money += dt * 0.04 * lunch;
    if (s.auto && s.skills.includes("scheduler"))
      for (const [id, p] of Object.entries(s.projects)) {
        if (p.stage === "written") test(s, id);
        else if (p.stage === "tested") {
          if (p.bugs) debug(s, id);
          else release(s, id);
        }
      }
    if (
      s.skills.includes("assistant") &&
      s.ai === "security" &&
      [1, 2].includes(s.stories.quickfix)
    ) {
      s.aiClock -= dt;
      if (s.aiClock <= 0) {
        s.aiClock = 10;
        if (s.stories.quickfix === 1) {
          s.stories.quickfix = 2;
          log(s, `The assistant traced QuickFix to relay.tempstaff.example and a credential: ${CREDENTIAL}. It would like a gold star.`);
        } else story(s, "quarantine");
      }
    }
    deliver(s);
    incidents(s);
    if (!offline) {
      if (buildRunning(s) && s.suspicion > 0)
        s.suspicion = Math.max(0, s.suspicion - dt * 0.1 * (s.perks.includes("plant") ? 2 : 1));
      if (s.playing && s.games.includes("sudoku")) flag(s, dt * 0.15);
      if ([1, 2].includes(s.stories.quickfix) && !s.settings.isolated) {
        const before = s.breach;
        s.breach += dt * (s.installs === "anywhere" ? 3 : 1);
        if (before < 300 && s.breach >= 300)
          log(s, "QuickFix requested additional permissions, to help. They were granted, helpfully. It now uses 30% of your processor.");
        if (before < 600 && s.breach >= 600)
          log(s, "QuickFix has started helping with other plugins. It uses 40% of your processor and has asked for administrator rights.");
        if (s.breach >= 900) end(s, "breach");
      }
    }
  }
  return s;
}

/* Cross-play record of secrets and endings. Lives outside the save. */
export function freshArchive() {
  return { found: [], endings: [], plays: 1 };
}
export function record(archive, s) {
  let changed = false;
  for (const id of s.secrets)
    if (!archive.found.includes(id)) {
      archive.found.push(id);
      changed = true;
    }
  const ending = s.over ?? (complete(s) ? "probation" : null);
  if (ending && !archive.endings.includes(ending)) {
    archive.endings.push(ending);
    changed = true;
  }
  return changed;
}
export function readArchive(raw) {
  try {
    const a = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!a || !Array.isArray(a.found) || !Array.isArray(a.endings)) throw 0;
    return {
      found: a.found.filter((id) => SECRETS.some((x) => x.id === id)),
      endings: a.endings.filter((id) => ENDINGS.some((x) => x.id === id)),
      plays: Number.isInteger(a.plays) && a.plays > 0 ? a.plays : 1,
    };
  } catch {
    return freshArchive();
  }
}
export function complete(s) {
  return (
    !s.over &&
    s.rank === 4 &&
    s.stories.employee === 3 &&
    s.stories.quickfix === 5 &&
    s.stories.duck === 4
  );
}

function migrate(s) {
  if (![1, 2].includes(s?.version)) return s;
  const base = fresh(s.last);
  for (const k of Object.keys(base)) if (!(k in s)) s[k] = base[k];
  if (s.version === 1) s.secrets = [...s.bookmarks];
  s.version = 3;
  return s;
}
const bad = (msg) => {
  throw Error(msg);
};
const num = (x) => Number.isFinite(x) && x >= 0;
const listOf = (x, allowed) => Array.isArray(x) && x.every((v) => allowed.includes(v)) && new Set(x).size === x.length;
export function restore(raw, now = Date.now()) {
  let s = typeof raw === "string" ? JSON.parse(raw) : structuredClone(raw);
  s = migrate(s);
  if (
    !s ||
    s.version !== 3 ||
    !s.projects ||
    !Array.isArray(s.jobs) ||
    !Array.isArray(s.skills) ||
    !s.settings ||
    !s.stories ||
    !Array.isArray(s.bookmarks) ||
    !Array.isArray(s.logs)
  )
    bad("This is not an Advanced Settings save.");
  for (const k of ["money", "knowledge", "users", "releases", "rank", "last", "elapsed", "nextId"])
    if (!num(s[k])) bad("Invalid save values.");
  for (const [id, p] of Object.entries(s.projects))
    if (
      !PROJECTS.some((x) => x.id === id) ||
      !STAGES.includes(p.stage) ||
      !FEATURES.some((x) => x.id === p.feature) ||
      !Number.isFinite(p.bugs) ||
      !Number.isFinite(p.version)
    )
      bad("Invalid project.");
  for (const j of s.jobs)
    if (
      !JOB_KINDS.includes(j.kind) ||
      !Number.isFinite(j.done) ||
      !Number.isFinite(j.total) ||
      j.total <= 0 ||
      (j.kind !== "reading" && !s.projects[j.project])
    )
      bad("Invalid process.");
  if (
    !Number.isInteger(s.rank) ||
    s.rank > 4 ||
    !num(s.reading) ||
    typeof s.auto !== "boolean" ||
    !["development", "reading", "security"].includes(s.ai) ||
    !Number.isFinite(s.aiClock)
  )
    bad("Invalid workstation state.");
  if (s.track !== undefined && !TRACKS.includes(s.track)) bad("Invalid career.");
  for (const key of ["safe", "legacy", "duck", "isolated"])
    if (typeof s.settings[key] !== "boolean") bad("Invalid settings.");
  for (const [key, max] of Object.entries({ employee: 3, quickfix: 5, duck: 4, career: 4 }))
    if (!Number.isInteger(s.stories[key]) || s.stories[key] < 0 || s.stories[key] > max)
      bad("Invalid case file.");
  if (
    !listOf(s.skills, SKILLS.map((k) => k.id)) ||
    !listOf(s.bookmarks, BOOKMARKS) ||
    !listOf(s.secrets, SECRETS.map((x) => x.id)) ||
    !listOf(s.perks, SHOP.map((x) => x.id)) ||
    !listOf(s.downloads, DOWNLOADS) ||
    !listOf(s.games, GAMES)
  )
    bad("Invalid unlocks.");
  if (
    ![null, "fired", "breach"].includes(s.over) ||
    !num(s.suspicion) ||
    s.suspicion > 100 ||
    ![0, 1, 2].includes(s.warned) ||
    !num(s.breach) ||
    !Number.isInteger(s.returns) ||
    s.returns < 0 ||
    !Number.isFinite(s.duckLock) ||
    !Number.isInteger(s.devTaps) ||
    !INSTALLS.includes(s.installs) ||
    typeof s.vendor !== "boolean" ||
    typeof s.tidepool !== "boolean" ||
    typeof s.private !== "boolean" ||
    typeof s.playing !== "boolean" ||
    typeof s.sudoku !== "string" ||
    !/^[0-9]{81}$/.test(s.sudoku) ||
    !Array.isArray(s.breaker) ||
    s.breaker.length !== 9 ||
    s.breaker.some((b) => b !== 0 && b !== 1) ||
    !Number.isInteger(s.trace) ||
    s.trace < -1 ||
    s.trace >= TRACE.length ||
    !s.blog ||
    !listOf([...new Set(s.blog.posts)], BLOG_TOPICS.map((t) => t.id)) ||
    s.blog.posts.length > 12 ||
    !num(s.blog.readers) ||
    typeof s.blog.mara !== "boolean"
  )
    bad("Invalid workstation extras.");
  const int = (x, lo, hi) => Number.isInteger(x) && x >= lo && x <= hi;
  const { replyall: r, cake: c, phish: p } = s.incidents ?? {};
  if (
    !s.threads ||
    typeof s.threads !== "object" ||
    Object.entries(s.threads).some(
      ([id, t]) =>
        !THREADS[id] ||
        !int(t?.step, 0, THREADS[id].beats.length) ||
        typeof t.open !== "boolean" ||
        typeof t.unread !== "boolean" ||
        !Number.isFinite(t.at) ||
        !num(t.rel) ||
        !Array.isArray(t.picks) ||
        t.picks.length > 60 ||
        t.picks.some((k) => !int(k?.step, 0, THREADS[id].beats.length - 1) || (k.i === undefined ? typeof k.text !== "string" || k.text.length > 80 : !int(k.i, 0, 9))),
    ) ||
    !r ||
    !int(r.state, 0, 2) ||
    !int(r.n, 0, 40) ||
    !int(r.joined, -1, 40) ||
    typeof r.muted !== "boolean" ||
    !Number.isFinite(r.at) ||
    !c ||
    !int(c.state, 0, 3) ||
    !Number.isFinite(c.at) ||
    !p ||
    !int(p.state, 0, 3) ||
    !Number.isFinite(p.at) ||
    !Number.isFinite(s.training)
  )
    bad("Invalid conversations.");
  if (
    s.logs.length > 40 ||
    s.logs.some((l) => !l || typeof l.text !== "string" || l.text.length > 2000 || !Number.isFinite(l.time))
  )
    bad("Invalid event log.");
  if (
    s.jobs.length > 6 ||
    s.jobs.some((j) => !Number.isInteger(j.id) || j.id < 1 || typeof j.paused !== "boolean" || j.done < 0) ||
    new Set(s.jobs.map((j) => j.id)).size !== s.jobs.length
  )
    bad("Invalid process IDs.");
  const elapsed = Math.min(7200, Math.max(0, (now - s.last) / 1000));
  s.playing = false;
  tick(s, elapsed, true);
  s.last = now;
  if (elapsed > 60 && !s.over)
    log(
      s,
      `Your processes kept working for ${Math.round(elapsed / 60)} minutes without you (limit: 2 hours). They did not miss you.`,
    );
  return s;
}
