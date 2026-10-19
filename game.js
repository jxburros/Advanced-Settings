export const SKILLS = [
  {
    id: "web",
    name: "Web development",
    cost: 70,
    xp: 15,
    desc: "Build services with larger audiences. Unlocks the company intranet.",
  },
  {
    id: "tests",
    name: "Test harness",
    cost: 90,
    xp: 25,
    desc: "Tests also fix one defect. Less time chasing semicolons.",
  },
  {
    id: "hardware",
    name: "Second CPU core",
    cost: 130,
    xp: 40,
    desc: "Two jobs run at full speed. Research and build at the same time.",
  },
  {
    id: "database",
    name: "Databases",
    cost: 140,
    xp: 50,
    desc: "Unlock data projects and read archived employee records.",
  },
  {
    id: "scheduler",
    name: "Task scheduler",
    cost: 180,
    xp: 65,
    desc: "Automatically test, debug, and release completed work. You choose the next features.",
  },
  {
    id: "autocomplete",
    name: "Autocomplete",
    cost: 160,
    xp: 75,
    desc: "Writing tasks run 40% faster.",
  },
  {
    id: "systems",
    name: "Systems programming",
    cost: 220,
    xp: 95,
    desc: "Build system tools and inspect the hidden diagnostic channel.",
  },
  {
    id: "agents",
    name: "AI task assistant",
    cost: 300,
    xp: 120,
    desc: "Assign a local assistant to development, research, or security.",
  },
  {
    id: "local",
    name: "Local model runtime",
    cost: 380,
    xp: 170,
    requires: "agents",
    desc: "Unlock a third worker and stronger AI assignments.",
  },
];
export const PROJECTS = [
  {
    id: "notes",
    name: "Pocket Notes",
    kind: "SCRIPTING",
    desc: "A small utility. An unreasonable number of opinions about fonts.",
    skill: null,
    base: 45,
  },
  {
    id: "intranet",
    name: "Lunchboard",
    kind: "WEB SERVICE",
    desc: "An internal portal for lunch orders and other critical infrastructure.",
    skill: "web",
    base: 80,
  },
  {
    id: "archive",
    name: "Archive Index",
    kind: "DATABASE",
    desc: "Make decades of company records searchable. Including the awkward ones.",
    skill: "database",
    base: 110,
  },
  {
    id: "monitor",
    name: "Quiet Monitor",
    kind: "SYSTEMS",
    desc: "Watch the processes that would prefer not to be watched.",
    skill: "systems",
    base: 150,
  },
  {
    id: "workspace",
    name: "Workspace Zero",
    kind: "LEGACY",
    desc: "The previous employee’s abandoned environment, restored.",
    skill: "legacy",
    base: 180,
  },
];
export const FEATURES = [
  {
    id: "search",
    name: "Search",
    desc: "A useful, reliable addition.",
    time: 14,
    bugs: 1,
    reward: 1,
  },
  {
    id: "sync",
    name: "Cloud sync",
    desc: "More users. More edge cases.",
    time: 22,
    bugs: 3,
    reward: 1.7,
  },
  {
    id: "performance",
    name: "Performance",
    desc: "Careful work, fewer defects.",
    time: 18,
    bugs: 0,
    reward: 1.2,
  },
];
export const RANKS = [
  "Junior developer",
  "Developer",
  "Senior developer",
  "Staff engineer",
  "Principal engineer",
];
export function fresh(now = Date.now()) {
  return {
    version: 1,
    money: 40,
    xp: 0,
    users: 0,
    releases: 0,
    rank: 0,
    skills: [],
    projects: {
      notes: { version: 0, stage: "plan", bugs: 0, feature: "search" },
    },
    jobs: [],
    research: 0,
    auto: false,
    ai: "development",
    settings: { safe: true, legacy: false, duck: true, offline: false },
    stories: { employee: 0, hacker: 0, duck: 0, career: 0 },
    bookmarks: [],
    logs: [
      {
        text: "Welcome to your new workstation. The previous user has been mostly removed.",
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
  return !p.skill || s.skills.includes(p.skill);
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
  s.xp += 20 + Math.round(def.base / 10);
  s.releases++;
  p.version++;
  p.stage = "plan";
  log(
    s,
    `${def.name} v${p.version}.0 shipped. +$${money}. All tests pass. Somehow.`,
  );
  if (s.releases === 2) {
    s.stories.hacker = 1;
    log(
      s,
      "Security: an unrecognized plugin is consuming build resources. Inspect Diagnostics.",
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
    s.xp < k.xp ||
    (k.requires && !s.skills.includes(k.requires))
  )
    return false;
  s.money -= k.cost;
  s.skills.push(id);
  log(s, `${k.name} installed. Your workstation is a little more yours.`);
  return true;
}
export function research(s) {
  return addJob(s, "research", null, 20);
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
    `Promoted to ${RANKS[s.rank]}. Budget increased by $${100 * s.rank}. Your title now has ${s.rank + 1} syllables of authority.`,
  );
  return true;
}
export function discover(s, id) {
  if (!["legacy", "channel"].includes(id) || s.bookmarks.includes(id))
    return false;
  if (id === "legacy" && !(s.settings.legacy && s.jobs.some((j) => j.paused)))
    return false;
  if (id === "channel" && !(s.skills.includes("systems") && s.settings.offline))
    return false;
  if (id === "legacy") {
    s.skills.push("legacy");
    s.stories.employee = Math.max(1, s.stories.employee);
    log(
      s,
      "Workspace Zero recovered. A note reads: “The fourth channel is not on the network.”",
    );
  }
  if (id === "channel") {
    s.stories.employee = 3;
    log(
      s,
      "Private channel recovered: Mara left voluntarily. Her audit proves the company inflated deployment metrics. She left a reproducible trail, not a ghost.",
    );
  }
  s.bookmarks.push(id);
  return true;
}
export function story(s, action) {
  if (
    action === "archive" &&
    s.skills.includes("database") &&
    s.stories.employee === 1
  ) {
    s.stories.employee = 2;
    log(
      s,
      "Archive / Mara Chen: resignation accepted. Attachment: “Disconnect before checking channel four. Keep a copy for your review.”",
    );
    return true;
  }
  if (action === "observe" && s.stories.hacker === 1) {
    s.stories.hacker = 2;
    log(
      s,
      "Trace captured: quick-fix.plugin sends metrics to an outside contractor. Quarantine is now safe.",
    );
    return true;
  }
  if (action === "quarantine" && [1, 2].includes(s.stories.hacker)) {
    s.stories.hacker = s.stories.hacker === 2 ? 3 : 4;
    log(s, "Suspicious plugin quarantined. Build capacity restored.");
    return true;
  }
  if (action === "patch" && [3, 4].includes(s.stories.hacker)) {
    s.stories.hacker = 5;
    s.xp += 25;
    log(
      s,
      "Signature firewall enabled. The contractor’s abandoned credential is revoked; this intrusion will not recur.",
    );
    return true;
  }
  if (action === "duck" && s.stories.duck < 4) {
    s.stories.duck++;
    log(
      s,
      [
        "",
        "Facilities: the duck waits beside a warm exhaust vent. Cafeteria staff leave oats at 12:15.",
        "Camera log: boxes sometimes contain snacks. The duck has learned this. It cannot predict layoffs.",
        "Door audit: the motion sensor detects ducks. Security is reviewing the definition of employee.",
        "Directory corrected: “Board member: Duck” was a joke entry. A safe outdoor feeding area is approved.",
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
        s.skills.includes("agents") &&
        ((s.ai === "development" && j.kind !== "research") ||
          (s.ai === "research" && j.kind === "research"))
      )
        speed *= s.skills.includes("local") ? 1.8 : 1.4;
      if (s.stories.hacker === 1 || s.stories.hacker === 2) speed *= 0.8;
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
      if (j.kind === "research") {
        s.research++;
        s.xp += 8;
        log(s, "Research complete. +8 knowledge.");
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
      s.skills.includes("agents") &&
      s.ai === "security" &&
      s.stories.hacker > 0 &&
      s.stories.hacker < 5
    ) {
      if (s.elapsed % 10 < dt) {
        if (s.stories.hacker === 1) story(s, "observe");
        else if (s.stories.hacker === 2) story(s, "quarantine");
        else story(s, "patch");
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
    "xp",
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
      !["write", "test", "debug", "research"].includes(j.kind) ||
      !Number.isFinite(j.done) ||
      !Number.isFinite(j.total) ||
      j.total <= 0 ||
      (j.kind !== "research" && !s.projects[j.project])
    )
      throw Error("Invalid process.");
  if (
    !Number.isInteger(s.rank) ||
    s.rank > 4 ||
    !Number.isFinite(s.research) ||
    s.research < 0 ||
    typeof s.auto !== "boolean" ||
    !["development", "research", "security"].includes(s.ai)
  )
    throw Error("Invalid workstation state.");
  if (
    s.track !== undefined &&
    !["specialist", "manager", "automator"].includes(s.track)
  )
    throw Error("Invalid career.");
  for (const key of ["safe", "legacy", "duck", "offline"])
    if (typeof s.settings[key] !== "boolean") throw Error("Invalid settings.");
  for (const [key, max] of Object.entries({
    employee: 3,
    hacker: 5,
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
      (id) => ![...SKILLS.map((k) => k.id), "legacy"].includes(id),
    ) ||
    s.bookmarks.some((id) => !["legacy", "channel"].includes(id))
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
      `Welcome back. Processes ran for ${Math.round(elapsed / 60)} minutes (offline limit: 2 hours).`,
    );
  return s;
}
