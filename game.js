export const SKILLS = [
  {
    id: "web",
    name: "Web development",
    cost: 70,
    knowledge: 15,
    desc: "Make things for browsers. Unlocks Lunchboard, the lunch portal that is somehow mission-critical.",
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
    desc: "Unlocks Archive Index and read access to the personnel archive. Use responsibly, or at least quietly.",
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
    desc: "The internal lunch portal. Three outages last quarter, all of them during lunch.",
    skill: "web",
    base: 80,
  },
  {
    id: "archive",
    name: "Archive Index",
    kind: "DATABASE",
    desc: "Make forty years of company records searchable, including the ones nobody asked for.",
    skill: "database",
    base: 110,
  },
  {
    id: "monitor",
    name: "Quiet Monitor",
    kind: "SYSTEMS",
    desc: "Watches the processes that would prefer not to be watched.",
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
export function fresh(now = Date.now()) {
  return {
    version: 1,
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
  };
}
export function log(s, text) {
  s.logs.unshift({ text, time: s.last });
  s.logs = s.logs.slice(0, 40);
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
export function addJob(s, kind, project, total) {
  if (s.jobs.some((j) => j.kind === kind && j.project === project))
    return false;
  s.jobs.push({ id: s.nextId++, kind, project, total, done: 0, paused: false });
  return true;
}
export function start(s, id, feature) {
  const p = PROJECTS.find((p) => p.id === id);
  if (!p || !unlocked(s, p)) return false;
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
  state.bugs = f.bugs + (s.settings.safe ? 0 : 2);
  return addJob(s, "write", id, f.time * (s.settings.safe ? 1 : 0.7));
}
export function test(s, id) {
  const p = s.projects[id];
  if (!p || p.stage !== "written") return false;
  p.stage = "testing";
  return addJob(s, "test", id, 8);
}
export function debug(s, id) {
  const p = s.projects[id];
  if (!p || p.stage !== "tested" || p.bugs <= 0) return false;
  p.stage = "debugging";
  return addJob(s, "debug", id, 6 + p.bugs * 2);
}
export function release(s, id) {
  const p = s.projects[id],
    def = PROJECTS.find((x) => x.id === id);
  if (!p || p.stage !== "tested" || p.bugs > 0) return false;
  const f = FEATURES.find((f) => f.id === p.feature);
  const money = Math.round(def.base * f.reward * (1 + p.version * 0.12));
  s.money += money;
  s.users += Math.round(money * 1.4);
  s.knowledge += 20 + Math.round(def.base / 10);
  s.releases++;
  p.version++;
  p.stage = "plan";
  log(
    s,
    `${def.name} v${p.version}.0 shipped. +$${money}. Every test passed on the first run, as they always do.`,
  );
  if (s.releases === 2) {
    s.stories.quickfix = 1;
    log(
      s,
      "QuickFix installed itself to help with build performance. Build performance is down 20%. QuickFix is thrilled.",
    );
  }
  return true;
}
export function buy(s, id) {
  const k = SKILLS.find((k) => k.id === id);
  if (
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
  if (rank <= s.rank || !["specialist", "manager", "automator"].includes(track))
    return false;
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
  if (!["workspace", "channel"].includes(id) || s.bookmarks.includes(id))
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
  return true;
}
export function story(s, action) {
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
    s.stories.quickfix = 2;
    log(
      s,
      "Trace complete. QuickFix copies your real build times to an outside address owned by temp-contractor-0417. Someone wants the numbers Stillwater does not publish.",
    );
    return true;
  }
  if (action === "quarantine" && [1, 2].includes(s.stories.quickfix)) {
    s.stories.quickfix = s.stories.quickfix === 2 ? 3 : 4;
    log(s, "QuickFix quarantined. It asked to stay. Build capacity restored.");
    return true;
  }
  if (action === "sign" && [3, 4].includes(s.stories.quickfix)) {
    s.stories.quickfix = 5;
    s.knowledge += 25;
    log(
      s,
      "Signing policy enforced. temp-contractor-0417 revoked. Its last sign-in was from this desk, on a Thursday, at 4:17 p.m. Probably Greg’s space heater.",
    );
    return true;
  }
  if (action === "duck" && s.stories.duck < 4) {
    s.stories.duck++;
    log(
      s,
      [
        "",
        "Facilities: the duck sits by the loading-dock exhaust vent, which is warm. The cafeteria leaves oats out at 12:15. Mystery solved.",
        "Camera log: the duck follows anyone carrying a cardboard box. Break-room boxes contain crackers. It predicts snacks, not layoffs.",
        "Door audit: the secure wing opens for anything over 1.2 kg moving with purpose. The duck qualifies. Several interns do not.",
        "Directory fix: “Board member: Duck” was a joke entry that synced to the public site. The duck has been offered a pond-side feeding area instead.",
      ][s.stories.duck],
    );
    return true;
  }
  return false;
}
export function tick(s, seconds) {
  seconds = Math.min(Math.max(seconds, 0), 7200);
  let remaining = seconds;
  while (remaining > 0) {
    const dt = Math.min(1, remaining);
    remaining -= dt;
    s.elapsed += dt;
    const active = s.jobs.filter((j) => !j.paused);
    const share = Math.min(1, workers(s) / Math.max(1, active.length));
    for (const j of active) {
      let speed = share;
      if (j.kind === "write" && s.skills.includes("autocomplete")) speed *= 1.4;
      if (
        s.skills.includes("assistant") &&
        ((s.ai === "development" && j.kind !== "reading") ||
          (s.ai === "reading" && j.kind === "reading"))
      )
        speed *= s.skills.includes("local") ? 1.8 : 1.4;
      if (s.stories.quickfix === 1 || s.stories.quickfix === 2) speed *= 0.8;
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
      s.stories.quickfix > 0 &&
      s.stories.quickfix < 5
    ) {
      if (s.elapsed % 10 < dt) {
        if (s.stories.quickfix === 1) story(s, "observe");
        else if (s.stories.quickfix === 2) story(s, "quarantine");
        else story(s, "sign");
      }
    }
  }
  return s;
}
export function restore(raw, now = Date.now()) {
  const s = typeof raw === "string" ? JSON.parse(raw) : structuredClone(raw);
  if (
    !s ||
    s.version !== 1 ||
    !s.projects ||
    !Array.isArray(s.jobs) ||
    !Array.isArray(s.skills) ||
    !s.settings ||
    !s.stories ||
    !Array.isArray(s.bookmarks) ||
    !Array.isArray(s.logs)
  )
    throw Error("This is not an Advanced Settings save.");
  for (const k of [
    "money",
    "knowledge",
    "users",
    "releases",
    "rank",
    "last",
    "elapsed",
    "nextId",
  ])
    if (!Number.isFinite(s[k]) || s[k] < 0) throw Error("Invalid save values.");
  for (const [id, p] of Object.entries(s.projects))
    if (
      !PROJECTS.some((x) => x.id === id) ||
      ![
        "plan",
        "writing",
        "written",
        "testing",
        "tested",
        "debugging",
      ].includes(p.stage) ||
      !FEATURES.some((x) => x.id === p.feature) ||
      !Number.isFinite(p.bugs) ||
      !Number.isFinite(p.version)
    )
      throw Error("Invalid project.");
  for (const j of s.jobs)
    if (
      !["write", "test", "debug", "reading"].includes(j.kind) ||
      !Number.isFinite(j.done) ||
      !Number.isFinite(j.total) ||
      j.total <= 0 ||
      (j.kind !== "reading" && !s.projects[j.project])
    )
      throw Error("Invalid process.");
  if (
    !Number.isInteger(s.rank) ||
    s.rank > 4 ||
    !Number.isFinite(s.reading) ||
    s.reading < 0 ||
    typeof s.auto !== "boolean" ||
    !["development", "reading", "security"].includes(s.ai)
  )
    throw Error("Invalid workstation state.");
  if (
    s.track !== undefined &&
    !["specialist", "manager", "automator"].includes(s.track)
  )
    throw Error("Invalid career.");
  for (const key of ["safe", "legacy", "duck", "isolated"])
    if (typeof s.settings[key] !== "boolean") throw Error("Invalid settings.");
  for (const [key, max] of Object.entries({
    employee: 3,
    quickfix: 5,
    duck: 4,
    career: 4,
  }))
    if (
      !Number.isInteger(s.stories[key]) ||
      s.stories[key] < 0 ||
      s.stories[key] > max
    )
      throw Error("Invalid case file.");
  if (
    s.skills.some(
      (id) => !SKILLS.some((k) => k.id === id),
    ) ||
    s.bookmarks.some((id) => !["workspace", "channel"].includes(id))
  )
    throw Error("Invalid unlocks.");
  if (
    s.logs.length > 40 ||
    s.logs.some(
      (l) =>
        !l ||
        typeof l.text !== "string" ||
        l.text.length > 2000 ||
        !Number.isFinite(l.time),
    )
  )
    throw Error("Invalid event log.");
  if (
    s.jobs.length > 6 ||
    s.jobs.some(
      (j) =>
        !Number.isInteger(j.id) ||
        j.id < 1 ||
        typeof j.paused !== "boolean" ||
        j.done < 0,
    ) ||
    new Set(s.jobs.map((j) => j.id)).size !== s.jobs.length
  )
    throw Error("Invalid process IDs.");
  const elapsed = Math.min(7200, Math.max(0, (now - s.last) / 1000));
  tick(s, elapsed);
  s.last = now;
  if (elapsed > 60)
    log(
      s,
      `Welcome back. Your processes kept working for ${Math.round(elapsed / 60)} minutes without you (limit: 2 hours). They did not miss you.`,
    );
  return s;
}
