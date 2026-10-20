/* Release tasks: the last step before a version ships. Each project has its own kinds of task,
   performed in different ways, and each gets harder with the project and the version.
   Content is generated from a seed, so a task looks the same every time it is opened; the save
   only keeps the player's progress. */
export const KINDS = {
  pocket: ["review", "triage"],
  lunchboard: ["deploy", "triage", "review"],
  archive: ["migrate", "review"],
  monitor: ["tune", "migrate"],
  workspace: ["decode", "tune", "review"],
};
const BASE = { pocket: 0, lunchboard: 1, archive: 2, monitor: 3, workspace: 3 };
export const TASK_NAMES = {
  review: "Code review",
  triage: "Bug triage",
  deploy: "Deploy window",
  migrate: "Data migration",
  tune: "Probe tuning",
  decode: "Legacy decode",
};
/* Pocket Notes v1.0 is the tutorial: no task. */
export const needsTask = (id, version) => !!KINDS[id] && !(id === "pocket" && version === 0);
export const difficulty = (id, version) => Math.min(6, BASE[id] + Math.floor(version / 2));
export function kindOf(id, version) {
  const k = KINDS[id];
  return k[(version - (id === "pocket" ? 1 : 0)) % k.length];
}
function rng(text) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, n) => Math.floor(r() * n);
function shuffle(r, list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = pick(r, i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Code review: compare plain-language steps against the spec; one disagrees. */
export const RULES = [
  ["Searches ignore capital letters.", "Lowercase the query before matching.", "Match the query exactly as typed."],
  ["Archived notes never appear.", "Skip notes marked archived.", "Include notes marked archived."],
  ["Show at most 10 results.", "Stop after 10 results.", "Stop after 100 results."],
  ["Newest items come first.", "Sort by date, newest first.", "Sort by date, oldest first."],
  ["Saving never deletes text.", "Add changes to the existing note.", "Replace the note with the latest change."],
  ["Times are shown in the user’s time zone.", "Convert times to local time.", "Show times in UTC."],
  ["Empty notes are not saved.", "Discard a note if it has no text.", "Save every note, even empty ones."],
  ["Passwords are never written to logs.", "Mask the password before logging the request.", "Log the whole request, password included."],
  ["Orders close at 11:30.", "Reject orders placed after 11:30.", "Reject orders placed after 12:30."],
  ["Every record keeps its original date.", "Copy the original date into the new record.", "Set the record’s date to today."],
  ["Every process is checked once a minute.", "Poll each process every 60 seconds.", "Poll each process every 60 minutes."],
  ["Prices are rounded to the cent.", "Round prices to two decimal places.", "Round prices to whole dollars."],
];
/* Bug triage: label each report. */
export const REPORTS = [
  ["Search finds nothing when I type a capital letter.", "bug"],
  ["Saving a note deleted my last paragraph.", "bug"],
  ["Lunchboard still shows yesterday’s menu.", "bug"],
  ["The app closes itself when a note is empty.", "bug"],
  ["Every time is three hours off.", "bug"],
  ["The order button does nothing after 11:00.", "bug"],
  ["Could notes have colours?", "feature"],
  ["Please add a dark mode.", "feature"],
  ["Can Lunchboard remember my usual order?", "feature"],
  ["It would be nice to export notes as a PDF.", "feature"],
  ["Add a button that sends my notes to my manager.", "feature"],
  ["There is a duck in the lunch queue.", "duck"],
  ["The duck took my sandwich. Is that a bug?", "duck"],
  ["A duck is sitting on the server rack. It looks comfortable.", "duck"],
];
export const LABELS = { bug: "Bug", feature: "Feature request", duck: "Facilities (duck)" };
/* Data migration: steps have one correct order, which the runbook implies. */
export const STEPS = [
  "Announce maintenance",
  "Back up the database",
  "Lock writes",
  "Migrate the schema",
  "Copy the records",
  "Rebuild the index",
  "Unlock writes",
  "Check record counts",
];
export const RUNBOOK = [
  "People are told before anything is touched.",
  "Nothing changes until there is a backup.",
  "Writes are locked before the schema or any record moves.",
  "Records can only be copied into a schema that exists.",
  "The index is built from the copied records.",
  "Writes stay locked until the index is rebuilt.",
  "Counts are checked last, once everyone can write again.",
];
/* Legacy decode: Mara’s workspace notes, shifted. */
export const PHRASES = [
  "ask the desk",
  "leave the duck some oats",
  "neil keeps the answers",
  "every test passes on the first run",
  "the fourth channel is not on the network",
  "they cannot watch what is not connected",
  "the dashboards are green because green is the color",
  "the calm index has exactly one sensor and it points at you",
];
export const shift = (text, n) =>
  text.replace(/[a-z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 97 + n + 26) % 26) + 97));

/* Lunch traffic repeats every 30 seconds; the rush gets longer on harder tasks. */
export const PERIOD = 30;

export function makeTask(id, version) {
  const kind = kindOf(id, version);
  const d = difficulty(id, version);
  const r = rng(`${id}:${version}`);
  const t = { kind, d };
  if (kind === "review") {
    const rules = shuffle(r, RULES).slice(0, Math.min(6, 3 + d));
    t.bad = pick(r, rules.length);
    t.lines = rules.map((x, i) => (i === t.bad ? x[2] : x[1]));
    t.spec = d >= 3 ? shuffle(r, rules.map((x) => x[0])) : rules.map((x) => x[0]);
  } else if (kind === "triage") {
    let list;
    do list = shuffle(r, REPORTS).slice(0, Math.min(6, 3 + d));
    while (new Set(list.map((x) => x[1])).size < 2);
    t.reports = list.map((x) => x[0]);
    t.answer = list.map((x) => x[1]);
  } else if (kind === "deploy") {
    t.rush = Math.round(PERIOD * Math.min(0.7, 0.3 + 0.07 * d));
    t.offset = pick(r, PERIOD);
  } else if (kind === "migrate") {
    const n = Math.min(STEPS.length, 3 + d);
    const keep = shuffle(r, STEPS.map((_, i) => i)).slice(0, n).sort((a, b) => a - b);
    t.order = keep.map((i) => STEPS[i]);
    t.shown = shuffle(r, t.order);
  } else if (kind === "tune") {
    t.max = Math.min(8, 4 + d);
    const rate = 1 + pick(r, t.max), depth = 1 + pick(r, t.max);
    t.need = rate * depth;
    t.cap = 2 * rate + 3 * depth;
  } else {
    t.text = PHRASES[Math.min(PHRASES.length - 1, d + pick(r, 2))];
    t.shift = 1 + pick(r, 25);
    t.cipher = shift(t.text, t.shift);
  }
  return t;
}
export const rushing = (t, elapsed) => (elapsed + t.offset) % PERIOD < t.rush;
export const probe = (rate, depth) => ({ coverage: rate * depth, overhead: 2 * rate + 3 * depth });
