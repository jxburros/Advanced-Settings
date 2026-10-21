import test from "node:test";
import assert from "node:assert/strict";
import * as G from "../game.js";
const T = G.T;
/* Perform whatever release task is waiting, the way a player would. */
function task(s, id) {
  if (s.projects[id].stage !== "task") return;
  const t = T.makeTask(id, s.projects[id].version);
  if (t.kind === "review") assert.equal(G.solve(s, id, t.bad), "ok");
  else if (t.kind === "triage") assert.equal(G.solve(s, id, t.answer), "ok");
  else if (t.kind === "deploy") {
    while (T.rushing(t, s.elapsed)) G.tick(s, 1);
    assert.equal(G.solve(s, id), "ok");
  } else if (t.kind === "migrate") {
    for (const step of t.order.slice(0, -1)) assert.equal(G.solve(s, id, step), "next");
    assert.equal(G.solve(s, id, t.order.at(-1)), "ok");
  } else if (t.kind === "tune") {
    const fit = [];
    for (let a = 1; a <= t.max; a++)
      for (let b = 1; b <= t.max; b++) {
        const r = T.probe(a, b);
        if (r.coverage >= t.need && r.overhead <= t.cap) fit.push([a, b]);
      }
    assert.equal(G.solve(s, id, fit[0]), "ok");
  } else assert.equal(G.solve(s, id, t.shift), "ok");
  assert.equal(s.projects[id].stage, "tested");
}
function ship(s, id = "pocket", feature = "search") {
  assert.ok(G.start(s, id, feature));
  G.tick(s, 400);
  assert.ok(G.test(s, id));
  G.tick(s, 400);
  if (s.projects[id].bugs) {
    assert.ok(G.debug(s, id));
    G.tick(s, 400);
  }
  task(s, id);
  assert.ok(G.release(s, id));
}
function finish(s, id = "pocket") {
  G.tick(s, 100);
  G.test(s, id);
  G.tick(s, 100);
  if (s.projects[id].bugs) G.debug(s, id), G.tick(s, 100);
  task(s, id);
  assert.ok(G.release(s, id));
}
function trace(s) {
  G.start(s, "pocket", "sync");
  assert.ok(G.story(s, "observe"));
  for (const a of G.TRACE_ANSWERS.slice(0, -1)) assert.equal(G.hop(s, a), "next");
  assert.equal(G.hop(s, G.TRACE_ANSWERS.at(-1)), "done");
  finish(s);
}
test("complete release cycle has gates and earns budget, knowledge, and users", () => {
  const s = G.fresh();
  assert.equal(G.release(s, "pocket"), false);
  assert.ok(G.start(s, "pocket", "sync"));
  assert.equal(G.start(s, "pocket", "search"), false);
  G.tick(s, 30);
  assert.equal(G.release(s, "pocket"), false);
  G.test(s, "pocket");
  G.tick(s, 10);
  assert.equal(G.release(s, "pocket"), false);
  G.debug(s, "pocket");
  G.tick(s, 20);
  assert.ok(G.release(s, "pocket"));
  assert.equal(s.releases, 1);
  assert.ok(s.money > 40);
  assert.ok(s.users > 0);
  assert.ok(s.knowledge > 0);
});
test("reading shares CPU; paused jobs retain progress and release capacity", () => {
  const s = G.fresh();
  G.start(s, "pocket", "search");
  G.read(s);
  G.tick(s, 4);
  assert.equal(s.jobs[0].done, 2);
  assert.equal(s.jobs[1].done, 2);
  s.jobs[0].paused = true;
  G.tick(s, 4);
  assert.equal(s.jobs[0].done, 2);
  assert.equal(s.jobs[1].done, 6);
  s.skills.push("hardware");
  s.jobs[0].paused = false;
  G.tick(s, 2);
  assert.equal(s.jobs[0].done, 4);
  assert.equal(s.jobs[1].done, 8);
});
test("purchase respects money, knowledge, and dependency; languages unlock projects", () => {
  const s = G.fresh();
  assert.equal(G.buy(s, "web"), false);
  assert.equal(G.start(s, "lunchboard", "search"), false);
  s.money = 1000;
  s.knowledge = 1000;
  assert.equal(G.buy(s, "local"), false);
  assert.ok(G.buy(s, "web"));
  assert.equal(s.money, 930);
  assert.equal(s.knowledge, 1000);
  assert.equal(G.buy(s, "web"), false);
  assert.ok(G.start(s, "lunchboard", "search"));
});
test("scheduler completes a feature; automator track restarts it", () => {
  const s = G.fresh();
  s.skills.push("scheduler");
  s.auto = true;
  G.start(s, "pocket", "sync");
  G.tick(s, 150);
  assert.equal(s.releases, 1);
  assert.equal(s.projects.pocket.stage, "plan");
  assert.equal(s.jobs.length, 0);
  s.track = "automator";
  G.start(s, "pocket", "search");
  G.tick(s, 120);
  assert.equal(s.projects.pocket.stage, "task", "the scheduler has no taste: release tasks wait for you");
  s.skills.push("assistant");
  G.tick(s, 400);
  assert.ok(s.releases >= 3, "with the assistant on development, it keeps shipping without being asked");
  assert.notEqual(s.projects.pocket.stage, "plan");
});
test("career tracks change how work behaves", () => {
  const s = G.fresh();
  s.track = "specialist";
  G.start(s, "pocket", "search");
  assert.equal(s.projects.pocket.bugs, 0);
  const a = G.fresh(), b = G.fresh();
  b.track = "manager";
  ship(a);
  ship(b);
  assert.ok(b.money - 40 > (a.money - 40) * 1.2);
});
test("projects differ: Lunchboard earns over time, Archive Index reveals records", () => {
  const s = G.fresh();
  s.skills.push("web", "database");
  ship(s, "lunchboard");
  const m = s.money;
  G.tick(s, 100);
  assert.ok(s.money > m + 3);
  ship(s, "archive");
  assert.ok(s.logs.some((l) => /Vent 7/.test(l.text)));
});
test("secrets require operational conditions and stay bookmarked", () => {
  const s = G.fresh();
  assert.equal(G.discover(s, "workspace"), false);
  s.settings.legacy = true;
  G.read(s);
  s.jobs[0].paused = true;
  assert.ok(G.discover(s, "workspace"));
  assert.ok(G.unlocked(s, G.PROJECTS[4]));
  assert.equal(G.discover(s, "workspace"), false);
  s.skills.push("database");
  assert.ok(G.story(s, "attachment"));
  assert.equal(G.discover(s, "channel"), false);
  s.skills.push("systems");
  s.settings.isolated = true;
  assert.ok(G.discover(s, "channel"));
  assert.equal(s.stories.employee, 3);
  assert.deepEqual(s.secrets, ["workspace", "channel"]);
});
test("QuickFix trace needs a running build and punishes forged replies", () => {
  const s = G.fresh();
  s.stories.quickfix = 1;
  assert.equal(G.story(s, "observe"), false);
  G.start(s, "pocket", "sync");
  s.settings.isolated = true;
  assert.equal(G.story(s, "observe"), false);
  s.settings.isolated = false;
  assert.ok(G.story(s, "observe"));
  assert.equal(G.hop(s, (G.TRACE_ANSWERS[0] + 1) % 3), "lost");
  assert.equal(s.breach, 60);
  assert.equal(s.trace, -1);
  for (const [i, hop] of G.TRACE.entries()) {
    const prev = i ? G.TRACE[i - 1][G.TRACE_ANSWERS[i - 1]] : { ttl: 64, rtt: 1 };
    const honest = hop.filter((h) => h.ttl === prev.ttl - 1 && h.rtt > prev.rtt);
    assert.deepEqual(honest, [hop[G.TRACE_ANSWERS[i]]]);
  }
  const t = G.fresh();
  t.stories.quickfix = 1;
  trace(t);
  assert.equal(t.stories.quickfix, 2);
  assert.ok(t.secrets.includes("trace"));
});
test("revoking needs the exact credential; guessing it untraced is its own secret", () => {
  const s = G.fresh();
  s.stories.quickfix = 1;
  assert.ok(G.story(s, "quarantine"));
  assert.equal(s.stories.quickfix, 4);
  assert.equal(G.revoke(s, "temp-contractor-0418"), false);
  assert.ok(G.revoke(s, "  Temp-Contractor-0417 "));
  assert.equal(s.stories.quickfix, 5);
  assert.ok(s.secrets.includes("guess"));
});
test("duck corrections need the right explanation, lock on mistakes, and can be scooped", () => {
  const s = G.fresh();
  assert.equal(G.correct(s, 0), "wrong");
  assert.equal(G.correct(s, G.DUCK_CASES[0].answer), false);
  G.tick(s, 61);
  assert.ok(G.correct(s, G.DUCK_CASES[0].answer));
  assert.equal(s.stories.duck, 1);
  assert.equal(G.correct(s, G.DUCK_CASES[1].answer), false, "headline not out yet");
  G.visit(s, "ws-0417.local");
  assert.ok(s.secrets.includes("dashboard"));
  assert.ok(G.correct(s, G.DUCK_CASES[1].answer));
  assert.ok(s.secrets.includes("scoop"));
});
test("the browser blocks most of the web; Translate and Procurement get through", () => {
  const s = G.fresh();
  assert.equal(G.visit(s, "https://www.Facilities.Stillwater/").status, "ok");
  const b = G.visit(s, "quillpost.blog");
  assert.equal(b.status, "blocked");
  assert.equal(b.category, "Blogs & social");
  assert.equal(G.visit(s, "youtube.com").status, "blocked");
  const t = G.visit(s, "translate.stillwater/quillpost.blog/marachen");
  assert.deepEqual([t.status, t.via, t.url], ["ok", "translate", "quillpost.blog/marachen"]);
  assert.equal(G.shop(s, "chair"), false);
  assert.equal(G.addVendor(s, "amazon.com"), false);
  assert.ok(G.addVendor(s, "https://dealdrift.shop"));
  s.money = 500;
  assert.ok(G.shop(s, "rubberduck"));
  assert.equal(s.money, 475);
  s.settings.isolated = true;
  assert.equal(G.visit(s, "intranet.stillwater").status, "offline");
  assert.equal(G.visit(s, "ws-0417.local").status, "ok");
});
test("the game store: developer options, the classroom route, and a gentle sudoku", () => {
  const s = G.fresh();
  assert.equal(G.visit(s, "tidepool.games").status, "blocked");
  assert.equal(G.visit(s, "learn.tidepool.games").status, "ok");
  assert.ok(G.download(s, "tidepool"));
  assert.equal(G.install(s, "tidepool"), false);
  assert.equal(G.setInstalls(s, "identified"), false);
  for (let i = 6; i > 0; i--) assert.equal(G.tap(s), i);
  assert.equal(G.tap(s), 0);
  assert.ok(s.secrets.includes("devmode"));
  assert.ok(G.setInstalls(s, "identified"));
  assert.ok(G.install(s, "tidepool"));
  assert.ok(G.getGame(s, "sudoku"));
  assert.equal(G.fill(s, 0, 9), false, "givens are fixed");
  const blanks = [...G.SUDOKU.givens].flatMap((v, i) => (v === "0" ? [i] : []));
  for (const i of blanks) assert.ok(G.fill(s, i, G.SUDOKU.solution[i]));
  assert.ok(G.sudokuSolved(s));
  assert.ok(s.secrets.includes("sudoku"));
  assert.equal(G.unlockBlog(s, "123456789"), false);
  assert.ok(G.unlockBlog(s, G.SUDOKU.solution.slice(0, 9)));
  assert.ok(s.secrets.includes("blog"));
});
test("the sudoku is valid with a unique solution, and Panel B is solvable", () => {
  const sol = G.SUDOKU.solution;
  for (let k = 0; k < 9; k++) {
    const row = new Set(), col = new Set(), box = new Set();
    for (let m = 0; m < 9; m++) {
      row.add(sol[k * 9 + m]);
      col.add(sol[m * 9 + k]);
      box.add(sol[(Math.floor(k / 3) * 3 + Math.floor(m / 3)) * 9 + (k % 3) * 3 + (m % 3)]);
    }
    assert.equal(row.size + col.size + box.size, 27);
  }
  for (let i = 0; i < 81; i++) if (G.SUDOKU.givens[i] !== "0") assert.equal(G.SUDOKU.givens[i], sol[i]);
  const a = [...G.SUDOKU.givens].map(Number);
  let count = 0;
  const ok = (i, v) => {
    const r = Math.floor(i / 9), c = i % 9;
    for (let k = 0; k < 9; k++) if (a[r * 9 + k] === v || a[k * 9 + c] === v) return false;
    for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) if (a[(r - (r % 3) + x) * 9 + c - (c % 3) + y] === v) return false;
    return true;
  };
  const solve = () => {
    const i = a.indexOf(0);
    if (i < 0) return void count++;
    for (let v = 1; v <= 9 && count < 2; v++) if (ok(i, v)) { a[i] = v; solve(); a[i] = 0; }
  };
  solve();
  assert.equal(count, 1);
  let solved = 0;
  for (let mask = 0; mask < 512; mask++) {
    const s = G.fresh();
    for (let i = 0; i < 9; i++) if (mask & (1 << i)) G.flip(s, i);
    if (G.breakerOk(s)) solved++;
  }
  assert.ok(solved >= 1);
});
test("buying the heater trips the breaker again", () => {
  const s = G.fresh();
  s.breaker = [...G.BREAKER.goal];
  G.addVendor(s, "dealdrift.shop");
  s.money = 500;
  assert.ok(G.shop(s, "heater"));
  assert.equal(G.breakerOk(s), false);
  assert.ok(s.secrets.includes("greg"));
});
test("personal use raises concern, warns twice, then gets you fired", () => {
  const s = G.fresh();
  G.post(s, "job");
  G.post(s, "job");
  assert.equal(s.warned, 1);
  G.start(s, "pocket", "sync");
  const before = s.suspicion;
  G.tick(s, 10);
  assert.ok(s.suspicion < before, "real work calms the index");
  s.settings.isolated = true;
  G.post(s, "job");
  assert.ok(s.suspicion < before, "nothing reports while isolated");
  s.settings.isolated = false;
  s.private = true;
  G.post(s, "job");
  assert.equal(s.warned, 2);
  while (s.warned < 3) G.post(s, "job");
  assert.equal(s.over, null, "the first time is a plan, not a firing");
  assert.equal(s.warned, 3);
  assert.equal(s.suspicion, 55);
  assert.equal(s.private, false);
  assert.equal(G.visit(s, "intranet.stillwater").status, "training");
  G.post(s, "job");
  G.post(s, "job");
  assert.equal(s.over, "fired");
  assert.equal(G.start(s, "pocket", "search"), false);
  assert.equal(s.jobs.length, 0);
});
test("an ignored QuickFix escalates into a reimage, faster with installs from anywhere", () => {
  const s = G.fresh();
  s.stories.quickfix = 1;
  G.tick(s, 600);
  assert.equal(s.breach, 0, "QuickFix only grows while a build runs");
  G.start(s, "pocket", "sync");
  s.jobs[0].total = 1e6;
  G.tick(s, 299);
  assert.equal(G.quickfixLoad(s), 0.2);
  G.tick(s, 2);
  assert.equal(G.quickfixLoad(s), 0.3);
  const away = structuredClone(s);
  G.tick(away, 7200, true);
  assert.equal(away.over, null, "offline time never loses the game");
  s.secrets.push("devmode");
  G.setInstalls(s, "anywhere");
  G.tick(s, 200);
  assert.equal(s.over, "breach");
  const quiet = G.fresh();
  quiet.stories.quickfix = 1;
  G.start(quiet, "pocket", "sync");
  quiet.jobs[0].total = 1e6;
  quiet.settings.isolated = true;
  G.tick(quiet, 2000);
  assert.equal(quiet.over, null);
});
test("AI security traces and quarantines, but you still revoke the credential", () => {
  const s = G.fresh();
  s.skills.push("assistant", "local");
  s.ai = "security";
  s.stories.quickfix = 1;
  G.tick(s, 40);
  assert.equal(s.stories.quickfix, 3);
  assert.equal(G.workers(s), 2);
  assert.ok(G.revoke(s, G.CREDENTIAL));
});
test("all storylines and final promotion are reachable, and the archive records the ending", () => {
  const s = G.fresh();
  while (s.rank < 4) {
    if (s.stories.quickfix === 1) {
      trace(s);
      assert.ok(G.story(s, "quarantine"));
      assert.ok(G.revoke(s, G.CREDENTIAL));
    } else ship(s);
    if (G.promotionDue(s)) assert.ok(G.promote(s, "specialist"));
  }
  assert.equal(s.rank, 4);
  assert.equal(G.promote(s, "specialist"), false);
  assert.equal(s.stories.quickfix, 5);
  assert.equal(s.over, null);
  for (const c of G.DUCK_CASES) assert.ok(G.correct(s, c.answer));
  assert.equal(G.correct(s, 0), false);
  assert.ok(G.buy(s, "database"));
  assert.ok(G.buy(s, "systems"));
  s.settings.legacy = true;
  G.read(s);
  s.jobs.at(-1).paused = true;
  G.discover(s, "workspace");
  G.story(s, "attachment");
  s.settings.isolated = true;
  G.discover(s, "channel");
  assert.deepEqual(s.stories, { employee: 3, quickfix: 5, duck: 4, career: 4 });
  assert.ok(G.complete(s));
  const archive = G.freshArchive();
  assert.ok(G.record(archive, s));
  assert.deepEqual(archive.endings, ["probation"]);
  assert.ok(archive.found.includes("trace"));
  assert.equal(G.record(archive, s), false);
  const back = G.readArchive(JSON.stringify({ ...archive, found: [...archive.found, "nonsense"] }));
  assert.deepEqual(back.found, archive.found);
  assert.deepEqual(G.readArchive("not json"), G.freshArchive());
});
test("returning again and again changes the desk, and opens Appendix H", () => {
  const s = G.fresh();
  for (let i = 0; i < 6; i++) G.read(s), G.tick(s, 20);
  assert.equal(G.appendix(s), false);
  for (let i = 0; i < 3; i++) G.welcomeBack(s);
  assert.ok(G.appendix(s));
  assert.ok(G.calm(s) === 99);
  for (let i = 0; i < 9; i++) G.welcomeBack(s);
  assert.equal(s.returns, 12);
  assert.ok(G.calm(s) < 99);
  assert.ok(s.secrets.includes("returns"));
  assert.match(s.logs[0].text, /next user/);
});
test("save restoration handles offline time, migration, and malformed data", () => {
  const s = G.fresh(1000);
  G.read(s);
  const resumed = G.restore(JSON.stringify(s), 61000);
  assert.equal(resumed.knowledge, 8);
  assert.equal(resumed.jobs.length, 0);
  s.jobs[0].paused = true;
  assert.equal(G.restore(s, 99999999).jobs[0].done, 0);
  assert.equal(G.restore(s, 99999999).elapsed, 7200);
  assert.throws(() => G.restore("{}"));
  assert.throws(() => G.restore({ ...s, money: "lots" }));
  assert.throws(() => G.restore({ ...s, suspicion: 400 }));
  assert.throws(() => G.restore({ ...s, sudoku: "1".repeat(80) }));
  assert.throws(() => G.restore({ ...s, over: "bored" }));
  assert.throws(() =>
    G.restore({
      ...s,
      jobs: [{ kind: "write", project: "missing", total: 10, done: 0 }],
    }),
  );
  const old = { ...G.fresh(1000), version: 1, bookmarks: ["workspace"] };
  for (const k of ["secrets", "suspicion", "breach", "returns", "blog", "sudoku", "breaker", "aiClock"]) delete old[k];
  const migrated = G.restore(JSON.stringify(old), 2000);
  assert.equal(migrated.version, 5);
  assert.deepEqual(migrated.secrets, ["workspace"]);
  assert.equal(migrated.sudoku, G.SUDOKU.givens);
  const v3 = { ...G.fresh(1000), version: 3 };
  for (const k of ["hints", "moments", "marks", "counters"]) delete v3[k];
  const up = G.restore(JSON.stringify(v3), 2000);
  assert.deepEqual([up.version, up.hints, up.marks, up.counters], [5, {}, [], {}]);
  assert.throws(() => G.restore({ ...s, hints: { workspace: { tier: 9, at: 0 } } }));
});
function play(s, id) {
  // deliver pending beats by waiting; returns the open beat
  G.tick(s, 1);
  return G.THREADS[id].beats[G.thread(s, id).step];
}
test("Bella IMs you, disappears to a retreat, and only a shared joke brings her back", () => {
  const s = G.fresh();
  ship(s);
  G.tick(s, 1);
  const t = G.thread(s, "bella");
  assert.ok(t.open && t.unread);
  assert.ok(G.say(s, "bella", 0));
  G.tick(s, 41);
  assert.ok(G.say(s, "bella", 0), "the Furnace of Thursdays");
  s.releases = 3;
  G.tick(s, 1);
  assert.ok(G.say(s, "bella", 1));
  G.tick(s, 61);
  G.tick(s, 26);
  assert.equal(G.THREADS.bella.status(s, t), "away · recalibrating");
  assert.ok(G.say(s, "bella", 0));
  G.tick(s, 200);
  assert.equal(t.step, 5, "still away until more releases ship");
  s.releases += 3;
  G.tick(s, 10);
  assert.equal(G.THREADS.bella.status(s, t), "online · very calm");
  assert.equal(G.say(s, "bella", 1), "retry");
  assert.equal(G.type(s, "bella", "are you ok"), "retry");
  assert.ok(G.type(s, "bella", "remember the Furnace of Thursdays?"));
  assert.ok(s.secrets.includes("furnace"));
  G.tick(s, 91);
  assert.ok(G.say(s, "bella", 0));
  assert.equal(G.THREADS.bella.status(s, t), "online · herself again");
});
test("Reggie can only leave once the audit shows his clause is impossible", () => {
  const s = G.fresh();
  s.releases = 2;
  G.tick(s, 1);
  assert.ok(G.say(s, "reggie", 0));
  G.tick(s, 91);
  assert.ok(G.say(s, "reggie", 1));
  s.releases = 4;
  G.tick(s, 1);
  assert.ok(G.say(s, "reggie", 0));
  G.tick(s, 121);
  assert.ok(G.say(s, "reggie", 0));
  s.skills.push("database");
  s.releases = 5;
  G.tick(s, 1);
  s.projects.archive = { version: 5, stage: "plan", bugs: 0, feature: "search" };
  G.tick(s, 1);
  assert.equal(G.say(s, "reggie", 2), false, "needs the audit");
  assert.equal(G.say(s, "reggie", 0), "retry");
  s.stories.employee = 3;
  assert.ok(G.say(s, "reggie", 2));
  assert.ok(s.secrets.includes("outofoffice"));
  assert.match(G.THREADS.reggie.status(s, G.thread(s, "reggie")), /actually out/);
  s.blog.mara = true;
  G.tick(s, 1);
  G.say(s, "mara", 0);
  G.tick(s, 61);
  const lines = G.beatLines(s, G.THREADS.mara.beats[1]);
  assert.match(lines[0], /Reggie Ashby left/);
});
test("your parents need answers from the undisclosed pilots page, and the truth", () => {
  const s = G.fresh();
  ship(s);
  G.tick(s, 31);
  assert.ok(G.say(s, "parents", 1));
  G.tick(s, 121);
  assert.equal(G.say(s, "parents", 0), "retry");
  assert.ok(G.say(s, "parents", 2), "hold the dial");
  s.releases += 2;
  G.tick(s, 1);
  assert.ok(G.say(s, "parents", 2), "I am calm, three times");
  G.tick(s, 151);
  assert.equal(G.say(s, "parents", 1), false, "the truth needs Channel 04");
  s.stories.employee = 3;
  assert.ok(G.say(s, "parents", 1));
  assert.ok(s.secrets.includes("returned"));
  G.tick(s, 201);
  assert.equal(G.thread(s, "parents").step, 5);
  assert.equal(G.visit(s, "intranet.stillwater/pilots").status, "ok");
});
test("Greg checks in after the credential is revoked", () => {
  const s = G.fresh();
  s.stories.quickfix = 5;
  G.tick(s, 31);
  assert.ok(G.thread(s, "greg").open);
  assert.ok(G.say(s, "greg", 1));
  s.breaker = [...G.BREAKER.goal];
  G.tick(s, 1);
  assert.equal(G.thread(s, "greg").step, 2);
});
test("short incidents: reply-all storm, cake, and a phishing test", () => {
  const s = G.fresh();
  s.releases = 3;
  G.tick(s, 1);
  assert.equal(s.incidents.replyall.state, 1);
  G.tick(s, 30);
  assert.ok(G.replyAll(s, "join"));
  assert.ok(s.secrets.includes("partofproblem"));
  assert.equal(G.replyAll(s, "join"), false);
  assert.equal(G.replyAllLines(s).length, G.REPLY_ALL.length + 7);
  G.tick(s, 15 * 20);
  assert.equal(s.incidents.replyall.state, 2);

  s.releases = 4;
  G.tick(s, 31);
  assert.equal(s.incidents.cake.state, 1);
  G.tick(s, 46);
  assert.equal(G.cake(s), false, "the cake is gone");
  const fast = G.fresh();
  fast.releases = 4;
  while (fast.incidents.cake.state === 0) G.tick(fast, 1);
  G.tick(fast, 30);
  assert.ok(G.cake(fast));
  assert.ok(fast.secrets.includes("cake"));

  s.releases = 5;
  G.tick(s, 1);
  assert.match(s.logs[0].text, /securlty/);
  const clicked = structuredClone(s);
  assert.ok(G.phish(clicked, "click"));
  assert.equal(G.visit(clicked, "intranet.stillwater").status, "training");
  G.tick(clicked, 91);
  assert.equal(G.visit(clicked, "intranet.stillwater").status, "ok");
  assert.ok(G.phish(s, "report"));
  assert.ok(s.secrets.includes("phish"));
});
test("Workspace Zero releases recover Mara's notes, and conversations survive a save", () => {
  const s = G.fresh(1000);
  s.bookmarks.push("workspace");
  ship(s, "workspace");
  assert.ok(s.logs.some((l) => /Workspace Zero v1.0 notes/.test(l.text)));
  G.tick(s, 1);
  G.say(s, "bella", 0);
  const back = G.restore(JSON.stringify(s), s.last + 1000);
  assert.equal(back.threads.bella.step, 1);
  assert.throws(() => G.restore({ ...s, threads: { stranger: { step: 0 } } }));
});
test("promotions need more releases each time, and later versions take longer", () => {
  const s = G.fresh();
  assert.deepEqual(G.RANK_AT, [0, 3, 7, 12, 18]);
  for (let i = 0; i < 6; i++) ship(s);
  assert.ok(G.promote(s, "manager"));
  assert.equal(G.promote(s, "manager"), false, "one promotion at a time");
  assert.equal(G.promotionDue(s), false);
  ship(s);
  assert.ok(G.promotionDue(s));
  const f = G.FEATURES[0];
  assert.ok(G.writeTime(s, { version: 5 }, f) > G.writeTime(s, { version: 0 }, f) * 2);
});
test("the Help Desk escalates hints slowly, and only for open problems", () => {
  const s = G.fresh();
  const ws = G.HINTS.find((h) => h.id === "workspace");
  assert.equal(G.hint(s, "channel"), false, "no ticket for a problem you don't have");
  assert.ok(G.hint(s, "workspace"));
  assert.equal(G.hint(s, "workspace"), false, "the next answer has to wait");
  assert.equal(G.hintWait(s, ws), G.HINT_WAIT[1]);
  G.tick(s, G.HINT_WAIT[1]);
  assert.ok(G.hint(s, "workspace"));
  G.tick(s, G.HINT_WAIT[2]);
  assert.ok(G.hint(s, "workspace"));
  assert.equal(G.hintWait(s, ws), -1);
  assert.match(ws.steps(s)[2], /Import Workspace/);
  // Duck tickets follow the current case.
  assert.ok(G.hint(s, "duck"));
  G.correct(s, G.DUCK_CASES[0].answer);
  s.releases = 2;
  assert.equal(G.hintState(s, G.HINTS.find((h) => h.id === "duck")).tier, 0);
  // Every hint has three answers whenever it is active.
  s.suspicion = 50;
  s.stories.quickfix = 3;
  for (const h of G.HINTS) if (h.active(s)) assert.equal(h.steps(s).length, 3, h.id);
});
test("each project has its own release tasks, and they get harder", () => {
  const kinds = (id) => new Set([0, 1, 2, 3, 4, 5].map((v) => T.kindOf(id, v)));
  for (const id of Object.keys(T.KINDS)) assert.ok(kinds(id).size >= 2, id);
  assert.equal(T.needsTask("pocket", 0), false, "the first release is the tutorial");
  assert.ok(T.difficulty("monitor", 0) > T.difficulty("pocket", 1));
  assert.ok(T.difficulty("pocket", 8) > T.difficulty("pocket", 1));
  assert.ok(T.makeTask("pocket", 9).lines.length > T.makeTask("pocket", 1).lines.length);
  assert.deepEqual(T.makeTask("archive", 3), T.makeTask("archive", 3), "tasks are stable");
  // Every generated task is solvable.
  for (const id of Object.keys(T.KINDS))
    for (let v = 0; v < 14; v++) {
      const t = T.makeTask(id, v);
      if (t.kind === "tune") {
        let ok = false;
        for (let a = 1; a <= t.max; a++) for (let b = 1; b <= t.max; b++) ok ||= T.probe(a, b).coverage >= t.need && T.probe(a, b).overhead <= t.cap;
        assert.ok(ok, `${id} v${v}`);
      }
      if (t.kind === "decode") assert.equal(T.shift(t.cipher, -t.shift), t.text);
      if (t.kind === "migrate") assert.deepEqual([...t.shown].sort(), [...t.order].sort());
    }
});
test("release tasks punish mistakes in their own ways", () => {
  const s = G.fresh();
  ship(s);
  s.skills.push("web", "database");
  // Code review: a wrong pick locks the task for a while.
  G.start(s, "pocket", "performance");
  G.tick(s, 400);
  G.test(s, "pocket");
  G.tick(s, 400);
  assert.equal(s.projects.pocket.stage, "task");
  assert.equal(G.release(s, "pocket"), false, "no shipping before the task");
  const t = T.makeTask("pocket", 1);
  const wrong = t.kind === "review" ? (t.bad + 1) % t.lines.length : t.answer.map((x) => (x === "bug" ? "feature" : "bug"));
  assert.equal(G.solve(s, "pocket", wrong), "wrong");
  assert.equal(G.solve(s, "pocket", t.kind === "review" ? t.bad : t.answer), false, "locked");
  G.tick(s, 20);
  task(s, "pocket");
  // Deploying in the lunch rush is an outage.
  G.start(s, "lunchboard", "performance");
  G.tick(s, 400);
  G.test(s, "lunchboard");
  G.tick(s, 400);
  const d = T.makeTask("lunchboard", 0);
  assert.equal(d.kind, "deploy");
  while (!T.rushing(d, s.elapsed)) G.tick(s, 1);
  const money = s.money;
  assert.equal(G.solve(s, "lunchboard"), "outage");
  assert.ok(s.money < money);
  G.tick(s, 11);
  task(s, "lunchboard");
  G.moments(s);
  assert.ok(s.moments.includes("outage"));
  // A migration step out of order rolls everything back.
  G.start(s, "archive", "performance");
  G.tick(s, 400);
  G.test(s, "archive");
  G.tick(s, 400);
  const m = T.makeTask("archive", 0);
  assert.equal(m.kind, "migrate");
  assert.equal(G.solve(s, "archive", m.order[0]), "next");
  assert.equal(G.solve(s, "archive", m.order.at(-1)), "wrong");
  assert.deepEqual(s.projects.archive.task.picks, []);
  G.tick(s, 5);
  task(s, "archive");
  // A save in the middle of a task survives.
  const back = G.restore(JSON.stringify(s), s.last);
  assert.ok(back.marks.includes("task:migrate"));
});
test("story moments are recorded as they happen and kept across workstations", () => {
  const s = G.fresh();
  ship(s);
  s.settings.isolated = true;
  G.tick(s, 1);
  s.settings.isolated = false;
  G.tick(s, 1);
  assert.ok(s.moments.includes("ship"));
  assert.ok(s.moments.includes("unplugged"), "passing states still count");
  const archive = G.freshArchive();
  assert.ok(G.record(archive, s));
  assert.ok(archive.moments.includes("unplugged"));
  assert.deepEqual(G.readArchive(JSON.stringify(archive)).moments, archive.moments);
  assert.ok(G.MOMENTS.some((m) => m.required) && G.MOMENTS.some((m) => !m.required));
  assert.equal(new Set(G.MOMENTS.map((m) => m.id)).size, G.MOMENTS.length);
});
test("small secrets: Panel B at full power, the translator, box 7, the whole manual, and counting", () => {
  const s = G.fresh();
  // Lights-out on 3x3 is always solvable; find a set of flips that turns everything on.
  for (let mask = 0; mask < 512; mask++) {
    const b = [...G.BREAKER.start];
    for (let i = 0; i < 9; i++)
      if (mask & (1 << i)) for (const j of [i, i - 3, i + 3, i % 3 ? i - 1 : -1, i % 3 < 2 ? i + 1 : -1]) if (j >= 0 && j < 9) b[j] ^= 1;
    if (b.every((x) => x)) {
      for (let i = 0; i < 9; i++) if (mask & (1 << i)) G.flip(s, i);
      break;
    }
  }
  assert.ok(s.secrets.includes("fullpower"));
  assert.deepEqual(s.breaker, G.BREAKER.start, "the panel trips");
  G.visit(s, "translate.stillwater/translate.stillwater");
  assert.ok(s.secrets.includes("recursion"));
  assert.equal(s.suspicion, 0, "translating an internal page is not personal use");
  G.visit(s, "ws-0417.local/box7");
  assert.ok(s.secrets.includes("box7"));
  for (let i = 0; i < 11; i++) G.read(s), G.tick(s, 20);
  assert.ok(s.secrets.includes("manual"));
  assert.equal(G.count(s, "undo", 3, "undo"), 1);
  G.count(s, "undo", 3, "undo");
  assert.equal(s.secrets.includes("undo"), false);
  G.count(s, "undo", 3, "undo");
  assert.ok(s.secrets.includes("undo"));
  assert.equal(G.secret(s, "nonsense"), false);
});
