import test from "node:test";
import assert from "node:assert/strict";
import * as G from "../game.js";
function ship(s, id = "notes", feature = "search") {
  assert.ok(G.start(s, id, feature));
  G.tick(s, 100);
  assert.ok(G.test(s, id));
  G.tick(s, 100);
  if (s.projects[id].bugs) {
    assert.ok(G.debug(s, id));
    G.tick(s, 100);
  }
  assert.ok(G.release(s, id));
}
test("complete release cycle has gates and earns budget, knowledge, and users", () => {
  const s = G.fresh();
  assert.equal(G.release(s, "notes"), false);
  assert.ok(G.start(s, "notes", "sync"));
  assert.equal(G.start(s, "notes", "search"), false);
  G.tick(s, 30);
  assert.equal(G.release(s, "notes"), false);
  G.test(s, "notes");
  G.tick(s, 10);
  assert.equal(G.release(s, "notes"), false);
  G.debug(s, "notes");
  G.tick(s, 20);
  assert.ok(G.release(s, "notes"));
  assert.equal(s.releases, 1);
  assert.ok(s.money > 40);
  assert.ok(s.users > 0);
  assert.ok(s.xp > 0);
});
test("research shares CPU; paused jobs retain progress and release capacity", () => {
  const s = G.fresh();
  G.start(s, "notes", "search");
  G.research(s);
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
  assert.equal(G.start(s, "intranet", "search"), false);
  s.money = 1000;
  s.xp = 1000;
  assert.equal(G.buy(s, "local"), false);
  assert.ok(G.buy(s, "web"));
  assert.equal(s.money, 930);
  assert.equal(s.xp, 1000);
  assert.equal(G.buy(s, "web"), false);
  assert.ok(G.start(s, "intranet", "search"));
});
test("scheduler completes a feature without choosing a new feature", () => {
  const s = G.fresh();
  s.skills.push("scheduler");
  s.auto = true;
  G.start(s, "notes", "sync");
  G.tick(s, 150);
  assert.equal(s.releases, 1);
  assert.equal(s.projects.notes.stage, "plan");
  assert.equal(s.jobs.length, 0);
});
test("secrets require operational conditions and stay bookmarked", () => {
  const s = G.fresh();
  assert.equal(G.discover(s, "legacy"), false);
  s.settings.legacy = true;
  G.research(s);
  s.jobs[0].paused = true;
  assert.ok(G.discover(s, "legacy"));
  assert.ok(G.unlocked(s, G.PROJECTS[4]));
  assert.equal(G.discover(s, "legacy"), false);
  s.skills.push("database");
  assert.ok(G.story(s, "archive"));
  assert.equal(G.discover(s, "channel"), false);
  s.skills.push("systems");
  s.settings.offline = true;
  assert.ok(G.discover(s, "channel"));
  assert.equal(s.stories.employee, 3);
});
test("all storylines and final promotion are reachable through ordinary progression", () => {
  const s = G.fresh();
  for (let i = 0; i < 12; i++) {
    ship(s);
    if ((i + 1) % 3 === 0) assert.ok(G.promote(s, "specialist"));
  }
  assert.equal(s.rank, 4);
  assert.equal(G.promote(s, "specialist"), false);
  assert.ok(G.story(s, "observe"));
  assert.ok(G.story(s, "quarantine"));
  assert.ok(G.story(s, "patch"));
  assert.equal(s.stories.hacker, 5);
  assert.equal(G.story(s, "patch"), false);
  for (let i = 0; i < 4; i++) assert.ok(G.story(s, "duck"));
  assert.equal(G.story(s, "duck"), false);
  assert.ok(G.buy(s, "database"));
  assert.ok(G.buy(s, "systems"));
  s.settings.legacy = true;
  G.research(s);
  s.jobs[0].paused = true;
  G.discover(s, "legacy");
  G.story(s, "archive");
  s.settings.offline = true;
  G.discover(s, "channel");
  assert.deepEqual(s.stories, { employee: 3, hacker: 5, duck: 4, career: 4 });
});
test("AI security handles the threat and local model adds compute", () => {
  const s = G.fresh();
  s.skills.push("agents", "local");
  s.ai = "security";
  s.stories.hacker = 1;
  G.tick(s, 40);
  assert.equal(s.stories.hacker, 5);
  assert.equal(G.workers(s), 2);
});
test("save restoration handles offline time, paused jobs, and malformed data", () => {
  const s = G.fresh(1000);
  G.research(s);
  const resumed = G.restore(JSON.stringify(s), 61000);
  assert.equal(resumed.xp, 8);
  assert.equal(resumed.jobs.length, 0);
  s.jobs[0].paused = true;
  assert.equal(G.restore(s, 99999999).jobs[0].done, 0);
  assert.equal(G.restore(s, 99999999).elapsed, 7200);
  assert.throws(() => G.restore("{}"));
  assert.throws(() => G.restore({ ...s, money: "lots" }));
  assert.throws(() =>
    G.restore({
      ...s,
      jobs: [{ kind: "write", project: "missing", total: 10, done: 0 }],
    }),
  );
});
