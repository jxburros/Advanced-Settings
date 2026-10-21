import { THREADS, REPLY_ALL, REPLY_ALL_PILE } from "./stories.js";
import * as T from "./tasks.js";
export { THREADS, REPLY_ALL, REPLY_ALL_PILE, T };

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
    cost: 110,
    knowledge: 30,
    desc: "Tests now fix one defect on the way through. Real tests, as opposed to the other kind.",
  },
  {
    id: "hardware",
    name: "Second CPU core",
    cost: 180,
    knowledge: 55,
    desc: "Two jobs at full speed. Read and build at once, like a person with two hands.",
  },
  {
    id: "database",
    name: "Databases",
    cost: 200,
    knowledge: 70,
    desc: "Unlocks Archive Index and read access to the personnel archive. Every release indexes another box of records nobody asked for.",
  },
  {
    id: "scheduler",
    name: "Task scheduler",
    cost: 320,
    knowledge: 100,
    desc: "Tests, debugs and ships finished work by itself. It will not choose features. It has no taste.",
  },
  {
    id: "autocomplete",
    name: "Autocomplete",
    cost: 240,
    knowledge: 90,
    desc: "Writing jobs run 40% faster. Suggests the next line, and occasionally the next thought.",
  },
  {
    id: "systems",
    name: "Systems programming",
    cost: 340,
    knowledge: 130,
    desc: "Unlocks Quiet Monitor and the kind of diagnostics that do not show up in Diagnostics.",
  },
  {
    id: "assistant",
    name: "AI task assistant",
    cost: 480,
    knowledge: 170,
    desc: "A local assistant you can assign to development, reading or security. Very polite about everything.",
  },
  {
    id: "local",
    name: "Local model runtime",
    cost: 650,
    knowledge: 240,
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
/* Total releases needed for each rank. The gaps widen as the work gets bigger. */
export const RANK_AT = [0, 3, 7, 12, 18];
export function promotionDue(s) {
  return !s.over && s.rank < 4 && s.releases >= RANK_AT[s.rank + 1];
}

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
  "Workspace Zero v2.0 notes: “Bella in QA noticed too. Told her to stay quiet. She won’t. I like her.”",
  "Workspace Zero v3.0 notes: “Reggie asked about my weekend again. I gave him every detail. He wrote them down.”",
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
/* Repeatable upgrades. Each level costs 15% more than the last, and spends knowledge as well as budget. */
export const UPGRADES = [
  { id: "memory", name: "More memory", cost: 50, knowledge: 10, max: 10, desc: "Every job runs 6% faster per stick. Facilities can always find another stick." },
  { id: "model", name: "Autocomplete model", cost: 140, knowledge: 30, max: 5, requires: "autocomplete", desc: "Writing runs 10% faster per tier, on top of Autocomplete. Each tier finishes slightly stranger sentences." },
  { id: "suite", name: "Faster test suite", cost: 90, knowledge: 20, max: 5, requires: "tests", desc: "Testing and debugging run 15% faster per level. The tests still pass. They pass sooner." },
  { id: "notes", name: "Release notes", cost: 80, knowledge: 15, max: 8, desc: "Every release brings 10% more new users per level. People read them. Nobody knows why." },
];
export function upgradeCost(s, id) {
  const u = UPGRADES.find((x) => x.id === id);
  const n = s.upgrades[id] ?? 0;
  return { money: Math.round(u.cost * 1.15 ** n), knowledge: Math.round(u.knowledge * 1.15 ** n) };
}
const level = (s, id) => s.upgrades[id] ?? 0;

/* Users. Each shipped project keeps its own. They pay a little while they stay, raise what the next
   version of that project earns, and drift away from a project that hasn't shipped in a while. */
export const INCOME = 0.0004; // budget per user per second
export const STALE = 300; // seconds at the desk without a release before users start to drift
const DRIFT = 0.0006; // share of users lost per second while drifting
const LOYAL = 0.4; // nobody drifts below this share of a project's best
export function demand(p) {
  return 1 + Math.min(2, Math.sqrt(p?.users ?? 0) / 40);
}

/* Product reviews: one decision per release or so, asked in Ripple (stories.js), kept for good. */
export const POLICIES = {
  pricing: {
    name: "Pricing",
    options: {
      ads: { name: "Free with ads", effect: "40% more new users; each one pays half as much.", growth: 1.4, income: 0.5 },
      paid: { name: "Paid", effect: "30% fewer new users; each one pays twice as much.", growth: 0.7, income: 2 },
      calm: { name: "Calm tier", effect: "10% fewer new users; they drift away half as fast.", growth: 0.9, drift: 0.5 },
    },
  },
  telemetry: {
    name: "Telemetry",
    options: {
      all: { name: "Collect everything", effect: "25% more new users, who drift a little slower. The Calm Index reads the same feeds: personal use counts 25% more.", growth: 1.25, drift: 0.8, flag: 1.25 },
      crash: { name: "Crash reports only", effect: "No change. Crashes, reported." },
      none: { name: "Nothing at all", effect: "10% fewer new users. Nothing to see.", growth: 0.9 },
    },
  },
  support: {
    name: "Support",
    options: {
      fast: { name: "Within the hour", effect: "Users drift away half as fast; project jobs run 10% slower while you answer them.", drift: 0.5, speed: 0.9 },
      slow: { name: "Within the week", effect: "Users drift away 50% faster.", drift: 1.5 },
    },
  },
  roadmap: {
    name: "Roadmap",
    options: Object.fromEntries(
      [["search", "Search"], ["sync", "Cloud sync"], ["performance", "Performance"]].map(([id, n]) => [
        id,
        { name: n, effect: `${n} features pay 30% more and take 20% less time to write. The other two pay 10% less.`, feature: id },
      ]),
    ),
  },
};
/* The product of one effect across every decision made so far. */
export function policy(s, prop) {
  let x = 1;
  for (const [k, v] of Object.entries(s.decisions)) x *= POLICIES[k]?.options[v]?.[prop] ?? 1;
  return x;
}
const roadmap = (s, feature) => (!s.decisions.roadmap ? 1 : s.decisions.roadmap === feature ? 1.3 : 0.9);

/* The boss key: your manager walks over while you're on a personal page. Only while you're here. */
export const BOSS = { releases: 3, after: 20, window: 10, cooldown: 600 };
export const relaxed = (s, sec) => (s.settings.relaxed ? sec * 2 : sec);

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
  ["quiet", "Quiet hours", "Some things are only audible in silence."],
  ["quack", "Unlisted alert", "An alert sound that isn’t on the list."],
  ["hold", "Hold the line", "Some music is only for waiting."],
  ["konami", "Old habits", "Up, up, down, down…"],
  ["screensaver", "Duck patrol", "Leave the desk alone for a while."],
  ["calendar", "Recurring event", "Check the calendar for Thursday."],
  ["important", "We have tried this", "Some files should not go in the Trash."],
  ["glass", "See-through", "Make the windows as clear as they go."],
  ["poke", "Calm down", "Stop poking the Calm Index."],
  ["livehelp", "Live help", "Help is available on Thursdays, 4:15 to 4:19 p.m. Really."],
  ["nightowl", "Night shift", "Work very late, or very early."],
  ["undo", "Forward momentum", "Undo. Undo. Undo."],
  ["search", "Search party", "Search the computer for the obvious."],
  ["exception", "Persistent applicant", "Ask for an exception. Keep asking."],
  ["fullpower", "Full power", "Every switch on. Even that one."],
  ["doors", "Every wrong door", "Open every decoy in the deep settings."],
  ["mchen", "Same password everywhere", "Sign in as someone else."],
  ["pat", "Good duck", "Pat the duck."],
  ["box7", "Never filed", "Ask the desk for box 7."],
  ["manual", "Cover to cover", "Read every page of the documentation."],
  ["redacted", "Redacted", "Some names don’t stay hidden."],
  ["recursion", "Lost in translation", "Translate the translator."],
  ["bosskey", "Boss key", "Locked screens don’t get questions."],
  ["nothing", "Nothing to report", "Collect nothing. Then go looking for it."],
].map(([id, name, hint]) => ({ id, name, hint }));
export const ENDINGS = [
  { id: "probation", name: "End of probation", hint: "Finish every story." },
  { id: "fired", name: "Released to the community", hint: "Mind the Calm Index." },
  { id: "breach", name: "Reimaged", hint: "Unsigned helpers get bolder." },
];

/* Help Desk tickets: three escalating answers per open problem. Each answer after the first
   unlocks only after some time with the previous one, so the puzzles stay puzzles. */
export const HINT_WAIT = [0, 150, 300];
const at = (s, id, step) => s.threads[id]?.open && s.threads[id].step === step;
const DUCK_HINTS = [
  ["facilities.stillwater lists every vent. One of them is never empty.", "Read the Facilities ventilation table and the cafeteria note on the intranet. Archive Index box 1 says the same thing."],
  ["The duck isn’t psychic. Something it likes arrives in a particular container.", "Look at the break-room section on facilities.stillwater."],
  ["The secure wing doesn’t need a badge from everyone.", "Read the Doors table on facilities.stillwater. Archive Index box 2 explains why."],
  ["The public website copies its leadership page from somewhere internal.", "Look up “Duck” in directory.stillwater, then read the intranet announcements about tags."],
];
export const HINTS = [
  {
    id: "workspace",
    title: "The previous user’s workspace",
    active: (s) => !s.bookmarks.includes("workspace"),
    steps: () => [
      "Mara’s notes keep mentioning old themes. System Settings › Advanced goes much deeper than it looks, and every level has exactly one real door.",
      "The route is Editor › Plugins › Installed › Theme Engine › Compatibility › Legacy Themes › Import › Supported Formats.",
      "At Supported Formats, turn on Legacy workspace compatibility, pause any running job (Activity Monitor or Workbench), then press Import Workspace.",
    ],
  },
  {
    id: "attachment",
    title: "Mara’s attachment",
    active: (s) => s.stories.employee === 1,
    steps: () => [
      "Mail › Recovered has something from Mara that the current tools can’t open.",
      "It’s a record. Records live in databases.",
      "Install Databases in Toolshed › Languages, then press Read archived attachment in Mail › Recovered.",
    ],
  },
  {
    id: "channel",
    title: "The fourth channel",
    active: (s) => s.stories.employee === 2,
    steps: () => [
      "Activity Monitor says it watches four channels. Count the ones it shows you.",
      "The fourth channel is not on the network, and it needs tools that go below Diagnostics.",
      "Install Systems programming, then isolate the workstation (Activity Monitor › Channels, or Settings › Network). Channel 04 appears in Activity Monitor › Channels.",
    ],
  },
  {
    id: "quickfix",
    title: "An unsigned plugin",
    active: (s) => [1, 2].includes(s.stories.quickfix),
    steps: () => [
      "QuickFix grows bolder whenever a build is running. Activity Monitor › Security deals with it. Waiting too long is the only wrong answer.",
      "Quarantine works at any time. Tracing first is optional and needs a running build. Isolating the workstation freezes QuickFix while you think.",
      "Press Quarantine plugin. To trace first: at each hop, pick the reply whose TTL is exactly one lower and whose time is higher than the last.",
    ],
  },
  {
    id: "revoke",
    title: "The credential",
    active: (s) => [3, 4].includes(s.stories.quickfix),
    steps: () => [
      "The plugin is gone, but the account that installed it isn’t. You need its exact name.",
      "directory.stillwater masks the contractor’s name, but not its home workstation. You know that workstation well.",
      `Revoke ${CREDENTIAL} in Activity Monitor › Security.`,
    ],
  },
  {
    id: "duck",
    key: (s) => "duck" + s.stories.duck,
    title: "The duck story",
    active: (s) => s.stories.duck < DUCK_CASES.length && duckOpen(s),
    steps: (s) => [
      ...DUCK_HINTS[s.stories.duck],
      `File this correction: “${DUCK_CASES[s.stories.duck].options[DUCK_CASES[s.stories.duck].answer]}”`,
    ],
  },
  {
    id: "bella",
    title: "Bella came back different",
    active: (s) => at(s, "bella", 6),
    steps: () => [
      "Before she left, Bella asked you to remind her who she is. The preset replies won’t do that. Type something instead.",
      "Something silly that only the two of you share. She taught it to you early on, about a coworker’s appliance.",
      "Type “Furnace of Thursdays” to Bella in Ripple.",
    ],
  },
  {
    id: "reggie",
    title: "Reggie never leaves",
    active: (s) => at(s, "reggie", 5) && !s.secrets.includes("outofoffice"),
    steps: () => [
      "Reggie can’t ask you to read his document. Archive Index releases reveal one box at a time.",
      "Box 5 is his retention agreement. It holds him until Stillwater Assure reports something. Can it?",
      "Finish Mara’s story (Channel 04). Her audit unlocks a new reply to Reggie: send it to him.",
    ],
  },
  {
    id: "parents",
    key: (s) => "parents" + (s.threads.parents?.step ?? 0),
    title: "Mom and Dad’s pilot products",
    active: (s) => [1, 2, 3].some((k) => at(s, "parents", k)),
    steps: (s) => {
      const k = s.threads.parents.step;
      return [
        "The box said “see intranet.stillwater/pilots”. You can open it in Wayfinder.",
        "Each product on the pilots page lists the hidden way to make it behave.",
        [
          "",
          "Tell them to hold the Hearth dial down for ten seconds.",
          "Tell them to say “I am calm” out loud, three times.",
          s.stories.employee === 3
            ? "Tell them the truth: none of the products measure anything."
            : "The script reply ends the thread. The honest reply appears once you’ve found Mara’s audit in Channel 04.",
        ][k],
      ];
    },
  },
  {
    id: "task",
    key: (s) => {
      const id = PROJECTS.find((d) => s.projects[d.id]?.stage === "task")?.id;
      return `task:${id}:${s.projects[id]?.version}`;
    },
    title: "A release task",
    active: (s) => PROJECTS.some((d) => s.projects[d.id]?.stage === "task"),
    steps: (s) => {
      const id = PROJECTS.find((d) => s.projects[d.id]?.stage === "task").id;
      const p = s.projects[id];
      const t = T.makeTask(id, p.version);
      const fit = () => {
        for (let a = 1; a <= t.max; a++) for (let b = 1; b <= t.max; b++) { const r = T.probe(a, b); if (r.coverage >= t.need && r.overhead <= t.cap) return [a, b]; }
      };
      return {
        review: ["Read each step against each line of the spec. Exactly one step contradicts a rule.", "Look for numbers, directions and words like “every”, “never” and “exactly”.", `Flag “${t.lines?.[t.bad]}”`],
        triage: ["Something broken is a bug. Something new is a feature request. Any duck goes to Facilities.", "Reports phrased as questions or wishes (“could”, “please add”, “it would be nice”) are feature requests.", `Labels, top to bottom: ${t.answer?.map((x) => T.LABELS[x]).join(", ")}.`],
        deploy: ["Watch the traffic bar. Deploying while it’s pink takes Lunchboard down mid-lunch.", "The rush repeats every 30 seconds. Wait for it to turn green, then deploy straight away.", "Press Deploy now as soon as the bar says Quiet."],
        migrate: ["Each runbook rule tells you which step has to come before another.", "Announcing comes first and checking counts comes last. Writes are locked around anything that moves.", `The order is: ${t.order?.join(" → ")}.`],
        tune: ["Coverage is rate × depth. Overhead is twice the rate plus three times the depth.", "Depth costs more overhead than rate. Raise the rate first, then add depth until coverage is enough.", `Set sample rate ${fit()?.[0]} and depth ${fit()?.[1]}.`],
        decode: ["Every letter has been moved the same number of places along the alphabet.", "Short words like “the” and “a” give the shift away. Turn the dial until they appear.", `Turn the dial to ${t.shift}.`],
      }[t.kind];
    },
  },
  {
    id: "calm",
    title: "My Calm Index is falling",
    active: (s) => s.suspicion >= 25,
    steps: () => [
      "Acceptable Use concern fades while a build is running. Real work is the cure.",
      "Nothing reports while the workstation is isolated. Private browsing is reviewed with extra care: it makes things worse, not better.",
      "Stop shopping, blogging and playing for a while and keep a build running. A desk plant from Procurement doubles the recovery.",
    ],
  },
];
const hintKey = (s, h) => (h.key ? h.key(s) : h.id);
export function hintState(s, h) {
  return s.hints[hintKey(s, h)] ?? { tier: 0, at: 0 };
}
/* Seconds until the next answer for this ticket can be requested; 0 if it can be now, -1 if there are none left. */
export function hintWait(s, h) {
  const st = hintState(s, h);
  if (st.tier >= h.steps(s).length) return -1;
  return Math.max(0, Math.ceil(st.at + HINT_WAIT[st.tier] - s.elapsed));
}
export function hint(s, id) {
  const h = HINTS.find((x) => x.id === id);
  if (s.over || !h || !h.active(s) || hintWait(s, h) !== 0) return false;
  const st = hintState(s, h);
  s.hints[hintKey(s, h)] = { tier: st.tier + 1, at: s.elapsed };
  return true;
}

/* Story moments: everything that can happen on the desk. Only some are needed to finish
   probation; the Secret Tracker remembers all of them across workstations. */
const reached = (s, id, k) => {
  const t = s.threads[id];
  return !!t && (t.step > k || (t.step === k && t.open));
};
const passed = (s, id, k) => (s.threads[id]?.step ?? 0) > k;
const shipped = (s, id, n = 1) => (s.projects[id]?.version ?? 0) >= n;
export const MOMENTS = [
  ["Work", "ship", "First release", "Ship Pocket Notes.", true, (s) => s.releases >= 1],
  ["Work", "lunchship", "Lunch is served", "Ship Lunchboard.", false, (s) => shipped(s, "lunchboard")],
  ["Work", "archiveship", "Forty years, indexed", "Ship Archive Index.", false, (s) => shipped(s, "archive")],
  ["Work", "monitorship", "Watching the watchers", "Ship Quiet Monitor.", false, (s) => shipped(s, "monitor")],
  ["Work", "workspaceship", "Her project, your name", "Ship Workspace Zero.", false, (s) => shipped(s, "workspace")],
  ["Work", "notes4", "Every recovered note", "Ship Workspace Zero four times.", false, (s) => shipped(s, "workspace", 4)],
  ["Work", "rank1", "Developer", "Your first growth conversation.", true, (s) => s.rank >= 1],
  ["Work", "rank2", "Senior Developer", "Your second growth conversation.", true, (s) => s.rank >= 2],
  ["Work", "rank3", "Staff Engineer", "Your third growth conversation.", true, (s) => s.rank >= 3],
  ["Work", "rank4", "Principal Engineer", "The last growth conversation there is.", true, (s) => s.rank >= 4],
  ...Object.entries({ review: "Pass a code review.", triage: "Triage a pile of reports.", deploy: "Deploy between lunch rushes.", migrate: "Run a migration in order.", tune: "Tune a probe.", decode: "Decode a legacy note." }).map(
    ([k, hint]) => ["Work", "task" + k, T.TASK_NAMES[k], hint, false, (s) => s.marks.includes("task:" + k)],
  ),
  ["Work", "outage", "Lunch rush", "Deploy Lunchboard at exactly the wrong moment.", false, (s) => s.marks.includes("outage")],
  ["Work", "equipped", "Fully equipped", "Install everything in Toolshed.", false, (s) => s.skills.length === SKILLS.length],
  ["The previous user", "found", "The theme that wasn’t", "Import a workspace through a theme importer.", true, (s) => s.bookmarks.includes("workspace")],
  ["The previous user", "attachment", "Resignation accepted", "Open Mara’s archived attachment.", true, (s) => s.stories.employee >= 2],
  ["The previous user", "channel04", "Channel 04", "Read what Mara left offline.", true, (s) => s.stories.employee === 3],
  ["The previous user", "guest", "A guest message", "Hear from Mara herself.", false, (s) => reached(s, "mara", 0)],
  ["The previous user", "guest2", "Unfinished business", "Hear Mara out.", false, (s) => reached(s, "mara", 1)],
  ["QuickFix", "helper", "A helpful plugin", "Ship enough to attract help.", true, (s) => s.stories.quickfix >= 1],
  ["QuickFix", "traced", "Followed home", "Find out where QuickFix reports.", false, (s) => s.marks.includes("traced")],
  ["QuickFix", "quarantined", "Quarantined", "Stop QuickFix.", true, (s) => s.stories.quickfix >= 3],
  ["QuickFix", "revoked", "Signing policy enforced", "Revoke the credential behind it.", true, (s) => s.stories.quickfix === 5],
  ["QuickFix", "gregcall", "Who would a heater call?", "Hear from Greg once the credential is gone.", false, (s) => reached(s, "greg", 0)],
  ["QuickFix", "gregquiet", "Quieter Thursdays", "Hear from Greg again.", false, (s) => reached(s, "greg", 1)],
  ["The duck", "duck1", "Warm vent, 12:15", "Correct the first duck story.", true, (s) => s.stories.duck >= 1],
  ["The duck", "duck2", "Snacks, not layoffs", "Correct the second duck story.", true, (s) => s.stories.duck >= 2],
  ["The duck", "duck3", "Moving with purpose", "Correct the third duck story.", true, (s) => s.stories.duck >= 3],
  ["The duck", "duck4", "Board member: Duck", "Correct the last duck story.", true, (s) => s.stories.duck >= 4],
  ["Bella", "bella", "Two desks over", "Get a message from QA.", false, (s) => reached(s, "bella", 0)],
  ["Bella", "furnacename", "The Furnace of Thursdays", "Learn what Bella calls Greg’s heater.", false, (s) => reached(s, "bella", 1)],
  ["Bella", "retreat", "Recalibration", "A friend is sent to the Wellness Wing.", false, (s) => reached(s, "bella", 3)],
  ["Bella", "verycalm", "Very calm", "See who comes back.", false, (s) => reached(s, "bella", 5)],
  ["Bella", "bellaback", "Herself again", "Bring Bella back.", false, (s) => passed(s, "bella", 6)],
  ["Bella", "refiled", "Refiled", "See what Bella does next.", false, (s) => reached(s, "bella", 7)],
  ["Reggie", "reggie", "Reggie from Platform", "Get asked about your weekend.", false, (s) => reached(s, "reggie", 0)],
  ["Reggie", "badge", "Inward only", "Hear about Reggie’s badge.", false, (s) => reached(s, "reggie", 3)],
  ["Reggie", "reggiefree", "Out of office", "Get Reggie out of the building.", false, (s) => passed(s, "reggie", 5)],
  ["Reggie", "bench", "A bench and a duck", "Hear from Reggie outside.", false, (s) => reached(s, "reggie", 6)],
  ["Mom & Dad", "parents", "Mom found your work email", "Ship something; your parents will notice.", false, (s) => reached(s, "parents", 0)],
  ["Mom & Dad", "hearth", "21 degrees, indoors, snowing", "Fix the Hearth.", false, (s) => passed(s, "parents", 1)],
  ["Mom & Dad", "serene", "I am calm. I am calm. I am calm.", "Fix the Serene.", false, (s) => passed(s, "parents", 2)],
  ["Mom & Dad", "pantry", "Freshness is a feeling", "Answer about the Pantry.", false, (s) => passed(s, "parents", 3)],
  ["Mom & Dad", "dinner", "Bring the duck", "Get invited home.", false, (s) => reached(s, "parents", 4)],
  ["Product", "review", "One question per release", "Answer a product review.", false, (s) => Object.keys(s.decisions).length >= 1],
  ["Product", "reviews", "A product with a direction", "Answer every product review.", false, (s) => Object.keys(s.decisions).length === Object.keys(POLICIES).length],
  ["Product", "drift", "Drifting away", "Leave a project alone until its users wander off.", false, (s) => s.marks.includes("drift")],
  ["Product", "watcher", "One more watcher", "Let Quiet Monitor find your own telemetry.", false, (s) => s.marks.includes("telemetry")],
  ["The office", "lookbusy", "Look busy", "Hide a personal page before your manager arrives.", false, (s) => s.marks.includes("boss:hid")],
  ["The office", "seen", "Seen", "Let your manager see a personal page.", false, (s) => s.marks.includes("boss:caught")],
  ["The office", "storm", "Reply-all storm", "Survive an all-staff thread.", false, (s) => s.incidents.replyall.state >= 1],
  ["The office", "calmed", "Thread calmed", "Wait out the storm.", false, (s) => s.incidents.replyall.state === 2],
  ["The office", "kevin", "Kevin’s birthday", "Get to kitchen 3 in time.", false, (s) => s.incidents.cake.state === 2],
  ["The office", "knife", "A plastic knife", "Get to kitchen 3 too late.", false, (s) => s.incidents.cake.state === 3],
  ["The office", "trained", "Mandatory training", "Click the password email.", false, (s) => s.incidents.phish.state === 3],
  ["The office", "reported", "Reported", "Report the password email.", false, (s) => s.incidents.phish.state === 2],
  ["The office", "unplugged", "Unplugged", "Isolate the workstation.", false, (s) => s.settings.isolated],
  ["The Calm Index", "warned", "A gentle note", "Let the Calm Index dip.", false, (s) => s.warned >= 1],
  ["The Calm Index", "final", "Final wellness reminder", "Let it dip further.", false, (s) => s.warned >= 2],
  ["The Calm Index", "plan", "Calm Improvement Plan", "Hit the bottom, once.", false, (s) => s.warned >= 3],
].map(([section, id, name, hint, required, test]) => ({ section, id, name, hint, required, test }));
/* Records moments as they happen, so passing states (being offline, an outage) still count. */
export function moments(s) {
  let added = false;
  for (const m of MOMENTS)
    if (!s.moments.includes(m.id) && m.test(s)) {
      s.moments.push(m.id);
      added = true;
    }
  return added;
}
export function mark(s, id) {
  if (s.marks.includes(id) || s.marks.length >= 200) return false;
  s.marks.push(String(id).slice(0, 60));
  return true;
}
/* Counts repeated actions; reaching the goal reveals a secret. Returns the new count. */
export function count(s, key, goal, id) {
  if (s.over) return 0;
  s.counters[key] = Math.min(9999, (s.counters[key] ?? 0) + 1);
  if (s.counters[key] >= goal) secret(s, id);
  return s.counters[key];
}

const STAGES = ["plan", "writing", "written", "testing", "tested", "debugging", "task"];
const JOB_KINDS = ["write", "test", "debug", "reading"];
const INSTALLS = ["toolshed", "identified", "anywhere"];
const BOOKMARKS = ["workspace", "channel"];
const DOWNLOADS = ["tidepool"];
const GAMES = ["sudoku"];

export function fresh(now = Date.now()) {
  return {
    version: 6,
    money: 40,
    knowledge: 0,
    users: 0,
    releases: 0,
    rank: 0,
    skills: [],
    projects: {
      pocket: project(),
    },
    upgrades: {},
    decisions: {},
    jobs: [],
    reading: 0,
    auto: false,
    ai: "development",
    aiClock: 10,
    settings: { safe: true, legacy: false, duck: true, isolated: false, relaxed: false },
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
    browsing: false,
    threads: {},
    incidents: {
      replyall: { state: 0, n: 0, at: 0, joined: -1, muted: false },
      cake: { state: 0, at: 0 },
      phish: { state: 0, at: 0 },
      boss: { state: 0, at: 0, next: 0, seen: 0 },
    },
    training: 0,
    hints: {},
    moments: [],
    marks: [],
    counters: {},
  };
}
/* A project's state. `users` drift once `age` (seconds at the desk since its last release) passes STALE. */
function project() {
  return { version: 0, stage: "plan", bugs: 0, feature: "search", users: 0, peak: 0, age: 0, drift: false };
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
  const state = (s.projects[id] ??= project());
  if (state.stage !== "plan") return false;
  const f = FEATURES.find((f) => f.id === feature);
  if (!f) return false;
  state.feature = feature;
  state.stage = "writing";
  state.bugs = Math.max(
    0,
    f.bugs + (s.settings.safe ? 0 : 2) - (s.track === "specialist" ? 1 : 0),
  );
  return addJob(s, "write", id, writeTime(s, state, f));
}
/* Every version adds to the codebase, so each one takes a little longer to write. */
export function writeTime(s, p, f) {
  return Math.round(f.time * (1 + 0.4 * p.version) * (s.settings.safe ? 1 : 0.7) * (s.decisions.roadmap === f.id ? 0.8 : 1));
}
export function test(s, id) {
  const p = s.projects[id];
  if (s.over || !p || p.stage !== "written") return false;
  p.stage = "testing";
  return addJob(s, "test", id, 8 + 2 * p.version);
}
export function debug(s, id) {
  const p = s.projects[id];
  if (s.over || !p || p.stage !== "tested" || p.bugs <= 0) return false;
  p.stage = "debugging";
  return addJob(s, "debug", id, 6 + p.bugs * 2);
}
/* After testing comes up clean, most versions still need a release task before they ship. */
function gate(s, id) {
  const p = s.projects[id];
  if (!T.needsTask(id, p.version)) return;
  p.stage = "task";
  p.task = { at: s.elapsed, lock: 0, picks: [], probes: [] };
}
function finishTask(s, id, t, assistant = false) {
  const p = s.projects[id];
  p.stage = "tested";
  p.task = null;
  mark(s, "task:" + t.kind);
  const name = PROJECTS.find((x) => x.id === id).name;
  log(
    s,
    assistant
      ? `The assistant finished the ${T.TASK_NAMES[t.kind].toLowerCase()} for ${name}. It was very polite about it.`
      : `${T.TASK_NAMES[t.kind]} passed for ${name} v${p.version + 1}.0. Ready to ship.`,
  );
}
/* Attempt the current release task. Returns "ok", "next" (a step of a migration), "probe"
   (a tuning attempt that missed), "wrong", "outage", or false if nothing could be tried. */
export function solve(s, id, input) {
  const p = s.projects[id];
  if (s.over || !p || p.stage !== "task" || !p.task || s.elapsed < p.task.lock) return false;
  const t = T.makeTask(id, p.version);
  const name = PROJECTS.find((x) => x.id === id).name;
  let ok;
  if (t.kind === "review") ok = Number(input) === t.bad;
  else if (t.kind === "triage")
    ok = Array.isArray(input) && input.length === t.answer.length && input.every((x, i) => x === t.answer[i]);
  else if (t.kind === "deploy") {
    if (T.rushing(t, s.elapsed)) {
      const loss = Math.min(Math.floor(s.money), 15 + 5 * t.d);
      const left = Math.round(p.users * 0.1);
      s.money -= loss;
      p.users -= left;
      tally(s);
      p.task.lock = s.elapsed + 10;
      mark(s, "outage");
      log(s, `Lunchboard went down in the middle of the lunch rush. −$${loss} in refunds and apology cookies${left ? `, and ${left} users went somewhere with sandwiches` : ""}. Wait for the traffic to drop.`);
      return "outage";
    }
    ok = true;
  } else if (t.kind === "migrate") {
    if (input !== t.order[p.task.picks.length]) {
      p.task.picks = [];
      p.task.lock = s.elapsed + 4;
      log(s, `Migration rolled back: “${String(input).slice(0, 40)}” ran out of order. Nothing was lost except time. Read the runbook.`);
      return "wrong";
    }
    p.task.picks.push(input);
    if (p.task.picks.length < t.order.length) return "next";
    ok = true;
  } else if (t.kind === "tune") {
    const [rate, depth] = Array.isArray(input) ? input.map(Number) : [];
    const valid = (v) => Number.isInteger(v) && v >= 1 && v <= t.max;
    if (!valid(rate) || !valid(depth)) return false;
    p.task.probes = [[rate, depth], ...p.task.probes].slice(0, 6);
    const r = T.probe(rate, depth);
    if (r.coverage < t.need || r.overhead > t.cap) return "probe";
    ok = true;
  } else ok = Number(input) === t.shift;
  if (!ok) {
    p.task.lock = s.elapsed + 8 + 2 * t.d;
    log(s, `${T.TASK_NAMES[t.kind]} for ${name} rejected. Take ${8 + 2 * t.d} seconds and look again.`);
    return "wrong";
  }
  finishTask(s, id, t);
  return "ok";
}
export function release(s, id) {
  const p = s.projects[id],
    def = PROJECTS.find((x) => x.id === id);
  if (s.over || !p || p.stage !== "tested" || p.bugs > 0) return false;
  const f = FEATURES.find((f) => f.id === p.feature);
  // Users already on a project raise what its next version earns.
  const money = Math.round(
    def.base *
      f.reward *
      (1 + p.version * 0.12) *
      demand(p) *
      roadmap(s, p.feature) *
      (s.track === "manager" ? 1.25 : 1),
  );
  const gained = Math.round(money * 1.4 * policy(s, "growth") * (1 + 0.1 * level(s, "notes")));
  s.money += money;
  p.users += gained;
  p.peak = Math.max(p.peak, p.users);
  p.age = 0;
  p.drift = false;
  tally(s);
  s.knowledge += (20 + Math.round(def.base / 10)) * (id === "monitor" ? 2 : 1);
  s.releases++;
  p.version++;
  p.stage = "plan";
  p.task = null;
  log(
    s,
    `${def.name} v${p.version}.0 shipped. +$${money}, +${gained.toLocaleString()} users. Every test passed on the first run, as they always do.`,
  );
  if (id === "monitor") findings(s);
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
export function upgrade(s, id) {
  const u = UPGRADES.find((x) => x.id === id);
  if (s.over || !u || level(s, id) >= u.max || (u.requires && !s.skills.includes(u.requires))) return false;
  const c = upgradeCost(s, id);
  if (s.money < c.money || s.knowledge < c.knowledge) return false;
  s.money -= c.money;
  s.knowledge -= c.knowledge;
  s.upgrades[id] = level(s, id) + 1;
  log(s, `Upgrade installed: ${u.name}, level ${s.upgrades[id]}. It cost ${c.knowledge} knowledge, which you will have to learn again.`);
  return true;
}
function tally(s) {
  s.users = Math.round(Object.values(s.projects).reduce((n, p) => n + (p.users ?? 0), 0));
}
/* Product reviews are answered in Ripple; the answer stays on file. */
function decide(s, key, value) {
  if (!POLICIES[key]?.options[value] || s.decisions[key]) return false;
  s.decisions[key] = value;
  if (key === "telemetry") findings(s);
  return true;
}
/* What Quiet Monitor makes of your own telemetry, once both exist. */
function findings(s) {
  if (!(s.projects.monitor?.version > 0)) return;
  const t = s.decisions.telemetry;
  if (t === "all" && mark(s, "telemetry"))
    log(s, "Quiet Monitor found one more process that watches people: Stillwater product telemetry, collecting everything, approved by you. It forwards to the consumer pilots.");
  if (t === "none" && secret(s, "nothing"))
    log(s, "Quiet Monitor looked for your product telemetry and found nothing at all. It checked twice. It seemed relieved.");
}
/* Lock the screen while your manager is on the way. */
export function bossKey(s) {
  const b = s.incidents.boss;
  if (s.over || b.state !== 1) return false;
  Object.assign(b, { state: 0, next: s.elapsed + BOSS.cooldown, seen: 0 });
  mark(s, "boss:hid");
  secret(s, "bosskey");
  log(s, "Your manager arrived at a locked screen, read the clock on it, nodded, and left. Locked screens don’t get questions.");
  return true;
}
export function read(s) {
  return addJob(s, "reading", null, 20);
}
export function promote(s, track) {
  if (!promotionDue(s) || !TRACKS.includes(track)) return false;
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
  mark(s, "traced");
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
  s.suspicion = Math.min(100, s.suspicion + amount * (s.private ? 1.5 : 1) * policy(s, "flag"));
  if (s.suspicion >= 40 && s.warned < 1) {
    s.warned = 1;
    log(s, "People & Serenity: a gentle note about acceptable use. Your Calm Index has been shared with your manager, gently.");
  }
  if (s.suspicion >= 70 && s.warned < 2) {
    s.warned = 2;
    log(s, "People & Serenity: final wellness reminder. Your workstation activity is now being reviewed. Please be calm on purpose.");
  }
  if (s.suspicion < 100) return;
  // The first time, a plan. There is no second plan.
  if (s.warned < 3) {
    s.warned = 3;
    s.suspicion = 55;
    s.training = Math.max(s.training, s.elapsed + 180);
    s.private = false;
    log(s, "People & Serenity: you have been placed on a Calm Improvement Plan. Wayfinder is closed for three minutes. Private browsing has been switched off for you. A correction: private sessions were never counted at a reduced rate. They count for half as much again. There is no second plan.");
    return;
  }
  end(s, "fired");
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
    if (u === "ws-0417.local/box7" && secret(s, "box7"))
      log(s, "ws-0417.local/box7 answered with a record nobody filed. The desk keeps its own archive.");
    if (secret(s, "dashboard"))
      log(s, "ws-0417.local answered. Someone left a server running on this desk, and it only talks about the duck.");
    return { url: u, status: "ok", via };
  }
  if (via && h === "translate.stillwater") {
    if (secret(s, "recursion")) log(s, "Translate translated itself from English into English. The result was English. Several people were promoted.");
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
  if (s.breaker.every((b) => b)) {
    secret(s, "fullpower");
    s.breaker = [...BREAKER.start];
    log(s, "Every breaker on Panel B, including B7. For one glorious second the Furnace of Thursdays ran at full power. Then the whole panel tripped.");
    return true;
  }
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
  if (c.decide) decide(s, ...c.decide);
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
    log(s, "IT: thanks for reporting! That was a test. You passed. Most people don’t. Bella reported it nine times.");
  } else {
    p.state = 3;
    s.training = s.elapsed + 90;
    flag(s, 5);
    log(s, "IT: you have been enrolled in Mandatory Calm Security Training. Wayfinder is closed for 90 seconds, for your safety.");
  }
  return true;
}
function incidents(s, dt, offline) {
  const { replyall: r, cake: c, phish: p, boss: b } = s.incidents;
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
  } else if (c.state === 1 && s.elapsed > c.at + relaxed(s, 45)) c.state = 3;
  if (p.state === 0 && s.releases >= 5) {
    Object.assign(p, { state: 1, at: s.elapsed });
    log(s, "IT Security <it-securlty@stillwater.co>: Your password expires today. Keep it calm: click here to renew.");
  }
  // The boss key happens only while you're here, looking at something personal.
  const personal = s.browsing || s.playing;
  if (b.state === 1) {
    if (offline || !personal) {
      Object.assign(b, { state: 0, next: s.elapsed + BOSS.cooldown, seen: 0 });
      if (!offline && mark(s, "boss:hid"))
        log(s, "Your manager stopped at your desk, looked at the build output, nodded, and left. Nobody saw anything, which is the main thing.");
    } else if (s.elapsed >= b.at + relaxed(s, BOSS.window)) {
      Object.assign(b, { state: 0, next: s.elapsed + BOSS.cooldown, seen: 0 });
      mark(s, "boss:caught");
      log(s, "Your manager saw the page you were on. They said nothing. They wrote something down, slowly, so you could watch.");
      flag(s, 10);
    }
  } else if (!offline && personal && s.releases >= BOSS.releases && s.elapsed >= b.next && s.elapsed >= s.training) {
    b.seen += dt;
    if (b.seen >= BOSS.after) {
      Object.assign(b, { state: 1, at: s.elapsed });
      log(s, `Your manager has left their office and is walking this way. About ${relaxed(s, BOSS.window)} seconds. Minimize the personal stuff, or lock the screen.`);
    }
  } else if (!personal) b.seen = 0;
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
      let speed = share * (1 + 0.06 * level(s, "memory"));
      if (j.kind === "write" && s.skills.includes("autocomplete")) speed *= 1.4;
      if (j.kind === "write") speed *= 1 + 0.1 * level(s, "model");
      if (j.kind === "test" || j.kind === "debug") speed *= 1 + 0.15 * level(s, "suite");
      if (j.kind !== "reading") speed *= policy(s, "speed");
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
        if (!p.bugs) gate(s, j.project);
      }
      if (j.kind === "debug") {
        p.bugs = 0;
        p.stage = "tested";
        gate(s, j.project);
      }
      if (j.kind === "reading") {
        s.reading++;
        s.knowledge += 8;
        log(s, "Reading complete. +8 knowledge. Some of it was even true.");
        if (s.reading >= 11 && secret(s, "manual"))
          log(s, "You have read the documentation cover to cover. Nobody has done this before. The documentation is unsettled.");
      }
    }
    if (s.trace >= 0 && !buildRunning(s)) {
      s.trace = -1;
      log(s, "Trace dropped: QuickFix stopped phoning home when the build stopped.");
    }
    const lunch = s.projects.lunchboard?.version ?? 0;
    if (lunch) s.money += dt * 0.04 * lunch;
    // Users pay while they stay. Projects only go stale while you're at the desk.
    for (const [id, p] of Object.entries(s.projects)) {
      if (!p.users) continue;
      s.money += dt * p.users * INCOME * policy(s, "income");
      if (offline) continue;
      p.age += dt;
      if (p.age < STALE) continue;
      if (!p.drift) {
        p.drift = true;
        mark(s, "drift");
        log(s, `${PROJECTS.find((x) => x.id === id).name} users are drifting away. It hasn’t shipped anything in a while. Ship a new version to win them back.`);
      }
      p.users = Math.max(p.peak * LOYAL, p.users * (1 - DRIFT * policy(s, "drift") * dt));
    }
    tally(s);
    if (s.auto && s.skills.includes("scheduler"))
      for (const [id, p] of Object.entries(s.projects)) {
        if (p.stage === "written") test(s, id);
        else if (p.stage === "tested") {
          if (p.bugs) debug(s, id);
          else release(s, id);
        }
      }
    // The assistant handles release tasks, slowly, when it is assigned to development.
    if (s.skills.includes("assistant") && s.ai === "development")
      for (const [id, p] of Object.entries(s.projects)) {
        if (p.stage !== "task" || !p.task || s.elapsed - p.task.at < (s.skills.includes("local") ? 20 : 40)) continue;
        const t = T.makeTask(id, p.version);
        if (t.kind === "deploy" && T.rushing(t, s.elapsed)) continue;
        finishTask(s, id, t, true);
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
          mark(s, "traced");
          log(s, `The assistant traced QuickFix to relay.tempstaff.example and a credential: ${CREDENTIAL}. It would like a gold star.`);
        } else story(s, "quarantine");
      }
    }
    deliver(s);
    incidents(s, dt, offline);
    moments(s);
    if (!offline) {
      if (buildRunning(s) && s.suspicion > 0)
        s.suspicion = Math.max(0, s.suspicion - dt * 0.1 * (s.perks.includes("plant") ? 2 : 1));
      if (s.playing && s.games.includes("sudoku")) flag(s, dt * 0.15);
      // QuickFix only grows while it has a build to "help" with.
      if ([1, 2].includes(s.stories.quickfix) && !s.settings.isolated && buildRunning(s)) {
        const before = s.breach;
        s.breach += dt * (s.installs === "anywhere" ? 3 : 1);
        if (before < 300 && s.breach >= 300)
          log(s, "QuickFix requested additional permissions, to help. They were granted, helpfully. It now uses 30% of your processor.");
        if (before < 600 && s.breach >= 600)
          log(s, "QuickFix has started helping with other plugins. It uses 40% of your processor and has asked for administrator rights.");
        if (before < 780 && s.breach >= 780)
          log(s, "IT alert: QuickFix will have administrator rights within two minutes of build time. Quarantine it in Activity Monitor › Security, or isolate the workstation.");
        if (s.breach >= 900) end(s, "breach");
      }
    }
  }
  return s;
}

/* Cross-play record of secrets and endings. Lives outside the save. */
export function freshArchive() {
  return { found: [], endings: [], moments: [], plays: 1 };
}
export function record(archive, s) {
  let changed = false;
  for (const id of s.secrets)
    if (!archive.found.includes(id)) {
      archive.found.push(id);
      changed = true;
    }
  moments(s);
  for (const id of s.moments)
    if (!archive.moments.includes(id)) {
      archive.moments.push(id);
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
      moments: Array.isArray(a.moments) ? a.moments.filter((id) => MOMENTS.some((x) => x.id === id)) : [],
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
  if (![1, 2, 3, 4, 5].includes(s?.version)) return s;
  const base = fresh(s.last);
  for (const k of Object.keys(base)) if (!(k in s)) s[k] = base[k];
  if (s.version === 1) s.secrets = [...s.bookmarks];
  // Version 6: users belong to projects, shared out by how many versions each has shipped.
  if (s.settings && !("relaxed" in s.settings)) s.settings.relaxed = false;
  if (s.incidents && !s.incidents.boss) s.incidents.boss = base.incidents.boss;
  const projects = Object.values(s.projects ?? {});
  const shipped = projects.reduce((n, p) => n + (Number(p?.version) || 0), 0);
  for (const p of projects)
    if (p && !("users" in p)) {
      const users = shipped ? Math.round(((Number(s.users) || 0) * (Number(p.version) || 0)) / shipped) : 0;
      Object.assign(p, { users, peak: users, age: 0, drift: false });
    }
  s.version = 6;
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
    s.version !== 6 ||
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
      !Number.isFinite(p.version) ||
      !num(p.users) ||
      !num(p.peak) ||
      !num(p.age) ||
      typeof p.drift !== "boolean" ||
      (p.stage === "task" && !p.task) ||
      (p.task != null &&
        (typeof p.task !== "object" ||
          !Number.isFinite(p.task.at) ||
          !Number.isFinite(p.task.lock) ||
          !Array.isArray(p.task.picks) ||
          p.task.picks.length > T.STEPS.length ||
          p.task.picks.some((x) => !T.STEPS.includes(x)) ||
          !Array.isArray(p.task.probes) ||
          p.task.probes.length > 6 ||
          p.task.probes.some((x) => !Array.isArray(x) || x.length !== 2 || x.some((v) => !Number.isInteger(v) || v < 1 || v > 8))))
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
  for (const key of ["safe", "legacy", "duck", "isolated", "relaxed"])
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
    ![0, 1, 2, 3].includes(s.warned) ||
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
    typeof s.browsing !== "boolean" ||
    !s.upgrades ||
    typeof s.upgrades !== "object" ||
    Object.entries(s.upgrades).some(([id, n]) => !UPGRADES.some((u) => u.id === id && Number.isInteger(n) && n >= 0 && n <= u.max)) ||
    !s.decisions ||
    typeof s.decisions !== "object" ||
    Object.entries(s.decisions).some(([k, v]) => !POLICIES[k]?.options[v]) ||
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
  const { replyall: r, cake: c, phish: p, boss: b } = s.incidents ?? {};
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
    !b ||
    !int(b.state, 0, 1) ||
    !Number.isFinite(b.at) ||
    !Number.isFinite(b.next) ||
    !num(b.seen) ||
    !Number.isFinite(s.training) ||
    !s.hints ||
    typeof s.hints !== "object" ||
    Array.isArray(s.hints) ||
    Object.keys(s.hints).length > 40 ||
    Object.values(s.hints).some((h) => !int(h?.tier, 0, 3) || !Number.isFinite(h.at)) ||
    !listOf(s.moments, MOMENTS.map((m) => m.id)) ||
    !Array.isArray(s.marks) ||
    s.marks.length > 200 ||
    s.marks.some((m) => typeof m !== "string" || m.length > 60) ||
    !s.counters ||
    typeof s.counters !== "object" ||
    Array.isArray(s.counters) ||
    Object.keys(s.counters).length > 40 ||
    Object.values(s.counters).some((v) => !int(v, 0, 9999))
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
  s.browsing = false;
  tick(s, elapsed, true);
  s.last = now;
  if (elapsed > 60 && !s.over)
    log(
      s,
      `Your processes kept working for ${Math.round(elapsed / 60)} minutes without you (limit: 2 hours). They did not miss you.`,
    );
  return s;
}
