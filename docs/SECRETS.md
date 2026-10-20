# Advanced Settings: solutions

**Spoilers.** This page is for the designer and for players who are stuck. Each entry gives the hint the game shows and where to find it, then the solution.

## Endings

| Ending | How |
| --- | --- |
| End of probation (win) | Reach Principal Engineer (12 releases) and finish all four stories: the previous user (Channel 04), QuickFix (credential revoked), and all four duck corrections. |
| Released to the community (loss) | Acceptable Use concern reaches 100%. It rises with blocked sites (+1), translated or proxied personal pages, shopping (+4 to +10), blog posts (+6 to +26), and online sudoku play. **Private browsing doubles it.** Real work (a running build) lowers it, and nothing is reported while the workstation is isolated. Mail warns you at 40 and 70, and the Calm Index in the menu bar drops. |
| Reimaged (loss) | Leave QuickFix unquarantined for about 15 minutes of online play (900 breach points). It speeds up 3× if Developer › Install from is set to “Anywhere”, and it pauses while isolated. Warnings arrive at 5 and 10 minutes, and its processor use grows from 20% to 30% to 40%. Quiet Monitor releases push it back. |

The Secret Tracker unlocks in the dock after the first ending of any kind, and it persists across new workstations.

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
| The desk remembers | Trash count, the renamed Welcome file, a fading wallpaper, the falling Calm Index | Return 12 times. Each new browser session after the first counts as a return. |

## The duck corrections

The newsletter’s headlines arrive at 0, 2, 5 and 8 releases. A wrong correction closes the desk for 60 seconds. Every option is mundane on purpose, so the right one needs evidence.

| Case | Answer | Evidence |
| --- | --- | --- |
| Won’t leave HQ | Warm vent by the loading dock + oats at 12:15 | Facilities vent 7; intranet cafeteria note; Archive box 1 |
| “Predicts” layoffs | Follows cardboard boxes full of crackers | Facilities break room |
| Secure wing | Door opens for anything over 1.2 kg | Facilities doors table; Archive box 2 |
| Board of directors | Test directory entry tagged public, synced to the website | Directory; intranet announcement; stillwater.com; Archive box 3 |

## Returning effects

Each new browser session with an existing save counts as one return.

| Returns | Effect |
| --- | --- |
| 1+ | “Welcome back” lines change; the Trash says the previous profile was deleted one more time. |
| 3+ | Appendix H can open. |
| 4+ | Welcome.pdf becomes “Welcome (2).pdf”, “Welcome (3).pdf”, and so on; the Calm Index starts to drop. |
| 6+ | The wallpaper starts to fade; the Welcome window says it has been revised again. |
| 8+ | The Trash holds `current_user_profile`, scheduled for removal. |
| 10+ | Settings › About lists you as a previous user. |
| 12 | Secret; a Mail draft about onboarding your successor; a sticky note signed “— You.” |

## Career tracks

| Track | Effect |
| --- | --- |
| Specialist | Every new feature starts with one fewer defect. |
| Manager | Releases pay 25% more. |
| Automator | With the pipeline on, shipped projects start their next version on their own. |
