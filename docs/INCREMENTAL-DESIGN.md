# Deepening the incremental layer

Design notes for making Advanced Settings' idle/incremental half as rich as its puzzle half. Ideas are marked **(yours)** when they came from the designer and **(proposed)** when they came out of the code review that produced this page. Version 1.3.0 implements part of it; see **Status** below. "Where things stand" describes the game before that.

## Status (1.3.0)

| Section | State |
| --- | --- |
| 1.1 Users | Done. Users belong to projects. They pay per second, raise the next version's reward (demand), and drift away from stale projects down to a loyal 40%. Staleness counts only time at the desk, so nothing drifts offline. A Lunchboard outage costs users. |
| 1.2 Spendable knowledge | Done, the "costs knowledge" option. Upgrades spend it; installing a skill still only needs it. |
| 1.3 Scaling curve | Done. The upgrades can be bought repeatedly, each level costing 1.15× the last (memory, a tiered autocomplete model, test suite, release notes). Demand from users keeps a project's earnings per second roughly flat or rising per version, where they used to fall. |
| 2 Product decisions | Done, with all four candidates (pricing, telemetry, support, roadmap) as Odette's reviews in Ripple, at least two releases apart. Telemetry has delayed consequences in Quiet Monitor, the parents' last email and a later message from Odette. Each review states its immediate effect, and Workbench lists the policy in force. |
| 3 Mid-game systems | Not started. |
| 4 Secrets | Two added, each with a hint and a test: Boss key (lock screen) and Nothing to report (telemetry and Quiet Monitor). Six optional story moments are also new. |
| 5 Fast moments | The boss key only. It needs the player present on a personal page, is telegraphed by a toast and sound, dents the Calm Index if missed, and is measured in `elapsed`. Relaxed timing (Settings › Appearance) doubles its window and the cake's. |

None of this has been play-tested yet. The numbers (`INCOME`, `STALE`, the policy multipliers, the boss timings) live at the top of `game.js`.

## Where things stand

From reading `game.js`:

- The loop is `start` → write → `test` → `debug` → task → `release`. Money, knowledge and users all grow roughly linearly.
- **`users` is never read.** `release` adds `round(money × 1.4)` to `s.users` (`game.js:806`) and nothing uses it.
- **`knowledge` is only a gate.** `buy` checks it (`:842`) but never spends it.
- **Money is the only spendable currency.** Skills and shop perks are one-time purchases.
- **The curve works against the player.** Write time scales as `1 + 0.4 × version`, reward as `1 + 0.12 × version`, so each new version is a worse deal. The only counterweight is one-time multipliers.
- **Automation ends the loop.** The scheduler and the Automator track run write/test/ship on their own, and the AI assistant handles release tasks, leaving only secrets and stories to do.
- **Content is the strong part.** About 46 secrets, 58 story moments, six release-task types and cross-linked puzzles. The aim is to bring the economy up to that standard without disturbing it.

## Design principle

> Everything you do is noticed: by users, by the Calm Index, by your manager, by the careful player.

New systems should make the player's choices visible somewhere else in the game, later, in a different app. That is how the existing content already works (the sudoku row is the blog password; the Furnace of Thursdays brings Bella back).

## 1. Foundations

### 1.1 Give `users` a job (proposed)

The cheapest change, since the number already exists. Options, and they combine:

- **Passive income.** Shipped projects earn per user, so a release keeps paying.
- **Bug reports.** Users generate a queue the player triages or lets pile up.
- **Demand.** Users scale a project's `reward`, giving a reason to keep updating old projects and not only start new ones.
- **Churn.** Users leave when a project goes stale or a version ships broken, so users behave as a stock with inflow and outflow, not a counter.

### 1.2 Make knowledge spendable (proposed)

Knowledge currently only walks a threshold. Make it consumed:

- Skills cost money **and** knowledge, or
- Knowledge decays slowly without reading, so the Library becomes an ongoing choice instead of a one-time chore.

Whichever is chosen must respect the offline rules below.

### 1.3 Fix the scaling curve (proposed)

- Replace flat one-time multipliers with **repeatable purchases whose cost grows** (for example hardware levels at roughly 1.15× the previous cost).
- Turn Autocomplete and similar single unlocks into tiers.
- Re-balance write time against reward so a new version is not strictly a worse deal.

## 2. Product decisions that move the game and the user count (yours)

**Idea:** the player makes decisions about the software that affect play and how many users adopt it. This is the highest-value addition, because it gives `users` and the feature choice real stakes (today the Search / Cloud sync / Performance pick only changes time, bugs and reward).

Shape of the system:

- **One decision per release**, delivered as a short product review through the existing `stories.js` choice mechanism (Mail or Ripple). More than one per release would turn the idle game into constant interruption.
- **Real trade-offs.** Candidates:
  - Pricing: free with ads, paid, or a "calm tier".
  - Telemetry: more data helps growth, but Quiet Monitor and the Calm Index notice.
  - Support policy: fast replies cost time, slow ones cost users.
  - Roadmap direction: which of several features to commit to.
- **Delayed, cross-app consequences.** A telemetry choice at v2 could surface as a Quiet Monitor finding or a message about the parents' pilot products at v6.
- **Fairness.** Consequences should be discoverable. Give each decision a small in-world hint beforehand (a Library note, a remark from Bella) so punishment never comes from information the player could not have had.

## 3. Mid-game systems (proposed)

### 3.1 Technical debt

The `safe` setting already trades 30% speed for two extra bugs. Make that continuous:

- Shipping with unresolved bugs adds debt that slows future writes on that project.
- A "Refactor" job pays debt down.
- The idle question becomes "ship now or clean up first".

### 3.2 Parallelism as a puzzle

Jobs compete for named resources (CPU, memory, disk, network) and the bottleneck moves as the player unlocks things. QuickFix's 30–40% CPU use and Greg's Panel B can feed the same model, so the story and economy share one system.

### 3.3 Programmable scheduler

Replace the on/off `s.auto` with rules the player designs: priority order, "only ship when users > N", "never touch Workspace Zero". Automation becomes something the player builds instead of something that removes the game.

### 3.4 Prestige tied to the story

The twelve-returns mechanic and the "previous user" are already a reset narrative. Make it a real prestige: reimage or hand off the workstation, lose projects and money, keep knowledge or a legacy multiplier. The Secret Tracker already persists across workstations, so the plumbing exists.

## 4. More little secrets (yours)

**Idea:** more small secrets. They are cheap to add, and the best ones match the quality of the current best.

Guidelines:

- Put them on surfaces not yet used: Murmur, the lock screen, Trash, the clock, window titles, file names.
- Give each a small in-world hint, as the 4:17 note and the Thursday calendar entry do.
- Reward noticing, not blanket clicking. The weakest current entries (Calm down, Search party, Old habits) are generic achievements; prefer secrets in the style of Same password everywhere.

Candidate ideas:

- Rename a file or note to a specific phrase (for example the "ask the desk" sticky).
- A Wi-Fi network name or sound setting that matters only at a particular time of day.
- Move or resize a window to a specific place or size.
- Murmur: a track title or playback position that matches something in Mail.
- Economy-linked: ship a project with zero users; choose the calm tier every time; leave a Ripple conversation unanswered past a threshold.

Housekeeping: secrets are listed in `SECRETS`, `HINTS`, `docs/SECRETS.md` and the README's count (46). A data-driven registration step would prevent drift, and each new secret should ship with its hint and a test, as the existing ones do.

## 5. Short, fast, high-pressure moments (yours)

**Idea:** a few brief moments where the player must act quickly or face consequences. The cake (45 seconds) and phishing test are already in this spirit.

Constraints, because these cut against the idle pacing, phone layout, reduced-motion support and the "time away can never lose you the game" rule:

- **Only while the player is present and active.** Not offline, not in a background tab. QuickFix already follows this (`!offline`, tab visible).
- **Telegraphed.** A cue first (sound from `sound.js`, a toast) so it tests reflexes rather than surprising the player.
- **Recoverable.** Small money loss, a Calm Index dent, a log line, a missed secret opportunity. A single missed reaction never ends the game.
- **Accessible.** Longer windows or an assist setting that gives the same reward.
- **Rare.** Three or four in total.
- **Measured in game seconds** (`elapsed`), so tests stay deterministic.

Candidates:

- **Boss key.** Your manager approaches while you are on a personal site in Wayfinder; minimize or lock before they arrive. Reuses the Acceptable Use system.
- **Panel B trips mid-build** (Thursday 4:17): re-flip the breakers before progress is lost.
- **Reply-all recall** within a few seconds, before the storm starts.
- **Deploy alert during a lunch rush**: roll back before the outage costs money.

## Constraints to respect

- Keep the 2-hour offline cap and the rule that time away cannot lose the game. Any new decay (knowledge, debt, churn) must pause or soften offline.
- Do not let numbers spiral. The puzzle layer rewards noticing small things.
- Several secrets and story beats are timed to the current pacing (the 900-breach timer, release counts for beats). Economy changes shift when these arrive. Re-run `npm test` and re-check the Secret Tracker's "needed for probation" path.

## Suggested order

1. Users do something: passive income, churn, demand per project (section 1.1).
2. Product decisions on top of that (section 2).
3. Secrets, added as the above create material, each with a hint and a test (section 4).
4. Fast moments last, starting with the boss key (section 5).
5. Debt, resources, programmable scheduler and prestige (section 3) as larger follow-ups.

Prototype one decision and one fast moment first, and check by playing whether they improve the game before building more. The above comes from reading the code, not from play-testing.
