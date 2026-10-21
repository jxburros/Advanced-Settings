# Advanced Settings: solutions

**Spoilers.** This page is for the designer and for players who are stuck. Each entry gives the hint the game shows and where to find it, then the solution.

## Endings

| Ending | How |
| --- | --- |
| End of probation (win) | Reach Principal Engineer (18 releases; promotions at 3, 7, 12 and 18) and finish all four stories: the previous user (Channel 04), QuickFix (credential revoked), and all four duck corrections. |
| Released to the community (loss) | Acceptable Use concern reaches 100% **twice**. It rises with blocked sites (+1), translated or proxied personal pages, shopping (+4 to +10), blog posts (+6 to +26), and online sudoku play. **Private browsing multiplies it by 1.5**, although Settings › Privacy claims it counts *less*; the Calm Improvement Plan issues a correction in the log, in Mail and in the setting itself. Real work (a running build) lowers it, and nothing is reported while the workstation is isolated. Mail warns you at 40 and 70, and the Calm Index in the menu bar drops. The first time it reaches 100 you get a Calm Improvement Plan instead: concern resets to 55, Wayfinder closes for three minutes and private browsing is switched off. |
| Reimaged (loss) | Leave QuickFix unquarantined for about 15 minutes of build time (900 breach points). It only grows while a build is running and you're online and looking: it pauses while isolated, while nothing is building, and while the tab is in the background. It speeds up 3× if Developer › Install from is set to “Anywhere”. Warnings arrive at 5, 10 and 13 minutes of build time, and its processor use grows from 20% to 30% to 40%. Quiet Monitor releases push it back. |

The Secret Tracker unlocks in the dock after the first ending of any kind, and it persists across new workstations.

## Release tasks

After a version passes its tests (Pocket Notes v1.0 excepted) it needs a release task. Each project rotates through its own kinds; difficulty (shown as dots) is the project's base (Pocket 0, Lunchboard 1, Archive 2, Quiet Monitor and Workspace 3) plus half the version, up to 6. A wrong answer locks the task for 8 + 2 × difficulty seconds. An AI assistant assigned to development finishes a waiting task after 40 seconds (20 with the local model). The Help Desk has a ticket for the current task, ending in its answer.

| Kind | Projects | How to do it | Harder with |
| --- | --- | --- | --- |
| Code review | Pocket Notes, Lunchboard, Archive Index, Workspace Zero | One plain-language step contradicts the spec. Flag it. | More rules; from difficulty 3 the spec is shuffled. |
| Bug triage | Pocket Notes, Lunchboard | Label each report: Bug (something wrong), Feature request (asks for something new), Facilities (anything with the duck). | More reports. |
| Deploy window | Lunchboard | Lunch traffic repeats every 30 seconds. Deploy while the bar is green; deploying in the rush is an outage (lose $15 + 5 × difficulty, 10 s lock). | A longer rush. |
| Data migration | Archive Index, Quiet Monitor | Click the steps in runbook order: announce, back up, lock writes, migrate schema, copy records, rebuild index, unlock writes, check counts. A wrong step rolls back to the start. | More steps. |
| Probe tuning | Quiet Monitor, Workspace Zero | Coverage is rate × depth; overhead is 2 × rate + 3 × depth. Find a setting that meets both targets. Probes are free. | A wider dial range, so more combinations. |
| Legacy decode | Workspace Zero | A Caesar shift. Turn the dial until the note reads as English. | Longer notes. |

## Story moments

The Secret Tracker's Story tab lists 58 moments in nine sections (Work, the previous user, QuickFix, the duck, Bella, Reggie, Mom & Dad, the office, the Calm Index). The 15 marked “needed for probation” are the ones the win requires: the first release, all four promotions, Workspace Zero, the attachment, Channel 04, QuickFix arriving, quarantined and revoked, and the four duck corrections. Some optional ones exclude each other in a single run (getting the cake or missing it; reporting the phishing email or clicking it), so a full tracker takes more than one workstation.

## Help Desk

Help › Help Desk lists a ticket for every problem the player currently has: the workspace, Mara's attachment, Channel 04, QuickFix, the credential, the current duck case, Bella, Reggie, the parents' current product, and a falling Calm Index. Each ticket has three answers: a vague one at once, a clearer one 2½ minutes later, and the solution 5 minutes after that. Hints don't affect anything else.

## Secrets

| Secret | Hint | Solution |
| --- | --- | --- |
| Workspace Zero | Mara’s pencilled note; Notes | Settings › Advanced › Editor › Plugins › Installed › Theme Engine › Compatibility › Legacy Themes › Import › Supported Formats. Turn on Legacy workspace compatibility while any job is paused, then Import Workspace. |
| Channel 04 | “Monitors all four channels” | Buy Systems programming, then isolate the workstation. Channel 04 appears in Activity Monitor › Channels. |
| Hourlier | — | Turn off duck-related notifications. |
| Developer options | Note: “Nobody locked the build number. Insist.” | Tap Settings › About › Build 9.4.17 seven times. |
| Preferred vendor | Block page and intranet: “Business purchases go through Procurement”; procurement is “self-service” | In procurement.stillwater, add the vendor `dealdrift.shop`. The DealDrift catalog then appears and charges the development budget. |
| Tidepool | Block page: “educational resources are always permitted”; Marketplace decoy: “learning is always open” | tidepool.games is blocked, but `learn.tidepool.games` is allowed. Download the classroom edition, set Developer › Install from to “Toolshed and identified developers” (or Anywhere), then open the installer in Files › Downloads. |
| Gentle solver | — | Get Gentle Sudoku in Tidepool and solve it. The solution’s top row is `417396825`. |
| Mara’s blog | Tidepool › Community profile: “The gentle ones are the ones you remember. Top line first.” and quillpost.blog/marachen | quillpost.blog is blocked, so open it through translate.stillwater. The password is the sudoku’s top row: `417396825`. |
| The duck dashboard | Mara’s blog; the offline page: “Only the desk itself is listening” | Visit `ws-0417.local`. It works even when isolated. |
| Scoop | — | Once you’ve found the dashboard, The Daily Current lets you file the next duck correction before its headline runs. Get one right. |
| Greg’s space heater | Note: “Every switch drags its neighbours along. Leave Greg’s off.” | On facilities.stillwater, solve Panel B so every breaker is on except B7 (GREG). Each switch flips itself and its orthogonal neighbours. This gives builds +10%. |
| Now you’re Greg | — | Buy the space heater from DealDrift. It trips Panel B again. |
| Desk duck | Case 2 truth; facilities break room | Buy the cardboard box of crackers. A duck appears on the desktop. |
| Followed the packet | Library: “No honest reply arrives before the one in front of it.” | While a build is running and you’re online, use Activity Monitor › Security › Trace. At each hop pick the reply whose TTL is exactly one lower and whose round-trip time is higher than the last. A wrong pick adds 60 breach and restarts the trace. |
| Educated guess | Directory: `temp-contractor-04••`, home workstation WS-0417; Archive Index box 4; the 4:17 note | Quarantine without tracing, then revoke `temp-contractor-0417`. |
| Citizen journalist | — | After solving two duck cases, write a Quillpost post about the duck. |
| Appendix H | Library: “See Appendix H for what time means here” | Complete 6 reading sessions and return to the game at least 3 times. |
| The desk remembers | Trash count, the renamed Welcome file, a fading wallpaper, the falling Calm Index; a note at 6 returns says “I stopped counting at twelve” | Return 12 times. Each new browser session after the first counts as a return, and so does coming back to a tab that was in the background for 20 minutes. |

| Herself again | Bella’s own words before she leaves: “if i come back weird, remind me who i am”; Notes: “Remind them of something silly.” | When Bella returns very calm, the preset replies get nowhere. Type a message mentioning the **Furnace of Thursdays**, the nickname she taught you for Greg’s heater. |
| Out of office | Reggie’s questions; the directory (“last badge-out: never”); facilities (sleeping pod 4); Mara’s guest message | Archive Index box 5 is Reggie’s retention agreement: he stays “until Stillwater Assure reports that it is fully calm”. Once you have Channel 04 (Mara’s audit), a new reply appears: send him the audit. The condition is impossible, so the clause is void, and he leaves. |
| Return to sender | Mom: “see intranet.stillwater/pilots” | Answers are on the hidden intranet.stillwater/pilots page: hold the Hearth dial for ten seconds; say “I am calm” three times to the Serene TV. For the Pantry fridge, the truthful reply appears only after Channel 04. The corporate script also ends the thread, but without the secret. |
| Part of the problem | — | Press Reply all on the fridge-cleanout thread. Six more people reply all to agree with you. |
| There was cake | A toast: “CAKE in kitchen 3!!” | After the reply-all storm ends (from 4 releases), cake is announced. You have 45 seconds to click Go to kitchen 3. |
| Not today | The sender is `it-securlty@stillwater.co` | Report the “password expires” email (from 5 releases). Clicking it closes Wayfinder for 90 seconds and dents the Calm Index. |
| Quiet hours | — | Turn interface sounds off (menu bar speaker, or Settings › Sound). |
| Unlisted alert | Settings › Sound, after Quiet hours: “one of these wasn’t on the list before” | Choose the Quack alert sound. |
| Hold the line | Murmur’s only built-in track | Play “Please Continue to Hold” for a minute without stopping. |
| Old habits | — | Type ↑ ↑ ↓ ↓ ← → ← → B A on the desktop. Ducks parade. |
| Duck patrol | — | Leave the desk alone for 3 minutes; let the screensaver run for 8 seconds. |
| Recurring event | Calendar in the menu bar clock | Click any Thursday's event: Panel B maintenance at 4:17. |
| We have tried this | The “probably important” file | Drag it to the Trash, or right-click › Move to Trash. |
| See-through | — | Settings › Appearance: drag window transparency all the way. A note appears on the wallpaper. |
| Calm down | — | Click the Calm Index 10 times. |
| Live help | Help menu and calendar: “Thursdays, 4:15–4:19 p.m.” | Have the Help Desk open on a real Thursday between 4:15 and 4:19 p.m., local time. Greg answers. |
| Night shift | — | Play between midnight and 4 a.m., local time. |
| Forward momentum | Edit › Undo is “unavailable” | Choose Undo 5 times. |
| Search party | — | Search (Ctrl+K or the menu bar) for “duck”. |
| Persistent applicant | The block page | Request an exception 5 times. |
| Full power | Panel B | Before solving it, get all nine breakers on, B7 included. The panel trips back to the start. |
| Every wrong door | — | Click every decoy in Settings › Advanced (16 of them, on every level). |
| Same password everywhere | Lock screen: “Other user: mchen”, hint “the top line of the gentle one” | Lock the screen (logo menu or Ctrl+Shift+L), switch to mchen, enter `417396825`. |
| Good duck | — | With the desk duck (crackers), pat it 5 times. |
| Never filed | Archive box 7: “Ask the desk.” | Visit `ws-0417.local/box7`. |
| Cover to cover | — | Complete 11 reading sessions. |
| Redacted | Settings › About | Click the redacted name 3 times. |
| Lost in translation | — | Translate translate.stillwater with translate.stillwater. |

## Conversations

| Thread | Where | Arc |
| --- | --- | --- |
| Bella Park (QA) | Ripple, after the first release | Jokes about tests that always pass and teaches you “the Furnace of Thursdays”. She files a bug at 3 releases and is sent to the Wellness Wing; your message isn’t delivered. Three releases and three minutes later she returns very calm, and only the shared joke brings her back. Afterwards she refiles the bug with your logs. |
| Reggie Ashby (Platform) | Ripple, after 2 releases | He asks about your weekend, a bakery on Fifth, and what time you leave. His badge only opens inward. He hints at an archive document, then asks about “the weather”. Sending the audit frees him, and he writes from a bench with your duck. |
| Mom & Dad | Mail › Personal, after the first release | Three pilot products, each fixed with an answer from the hidden pilots page. The last one asks you to choose between the script and the truth. |
| Greg Okafor | Ripple, after you revoke the credential | His heater’s smart plug used the contractor account, so the “hacker” was partly a heater. He has a later note once Panel B is fixed. |
| mchen (guest) | Ripple, after Mara’s blog and Channel 04 | Mara says hello, then asks you to help Reggie, or thanks you if you already have. |

Shipping Workspace Zero recovers one of Mara’s notes per version (v1–v4). These mention Bella, Reggie and the consumer pilots.

## The duck corrections

The newsletter’s headlines arrive at 0, 2, 5 and 8 releases. A wrong correction closes the desk for 60 seconds. Every option is mundane on purpose, so the right one needs evidence.

| Case | Answer | Evidence |
| --- | --- | --- |
| Won’t leave HQ | Warm vent by the loading dock + oats at 12:15 | Facilities vent 7; intranet cafeteria note; Archive box 1 |
| “Predicts” layoffs | Follows cardboard boxes full of crackers | Facilities break room |
| Secure wing | Door opens for anything over 1.2 kg | Facilities doors table; Archive box 2 |
| Board of directors | Test directory entry tagged public, synced to the website | Directory; intranet announcement; stillwater.com; Archive box 3 |

## Returning effects

Each new browser session with an existing save counts as one return, as does coming back after the tab was hidden for 20 minutes.

| Returns | Effect |
| --- | --- |
| 1+ | “Welcome back” lines change; the Trash says the previous profile was deleted one more time. |
| 3+ | Appendix H can open. |
| 4+ | Welcome.pdf becomes “Welcome (2).pdf”, “Welcome (3).pdf”, and so on; the Calm Index starts to drop. |
| 6+ | The wallpaper starts to fade; the Welcome window says it has been revised again; a note says it takes twelve. |
| 8+ | The Trash holds `current_user_profile`, scheduled for removal. |
| 10+ | Settings › About lists you as a previous user. |
| 12 | Secret; a Mail draft about onboarding your successor; a sticky note signed “— You.” |

## Career tracks

| Track | Effect |
| --- | --- |
| Specialist | Every new feature starts with one fewer defect. |
| Manager | Releases pay 25% more. |
| Automator | With the pipeline on, shipped projects start their next version on their own. |
