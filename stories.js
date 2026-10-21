/* Conversations and small office incidents. Pure data plus conditions; game.js runs them.
   A beat is delivered once `when(s, t)` is true. Beats without choices or input complete on delivery.
   t.at / t.rel are the elapsed seconds and release count when the previous beat completed. */
const wait = (sec) => (s, t) => s.elapsed >= t.at + sec;
const rel = (n) => (s, t) => s.releases >= t.rel + n;
const all =
  (...fs) =>
  (s, t) =>
    fs.every((f) => f(s, t));
const done = (s, id) => s.threads[id]?.step ?? 0;

export const THREADS = {
  bella: {
    name: "Bella Park",
    role: "QA · two desks over",
    app: "ripple",
    status: (s, t) =>
      t.step >= 7 ? "online · herself again" : t.step >= 4 ? (t.step === 6 ? "online · very calm" : "away · recalibrating") : "online",
    beats: [
      {
        when: (s) => s.releases >= 1,
        lines: [
          "hey new person! bella, QA, two desks over. saw your first ship go out 🎉",
          "fair warning: every test here passes on the first run. EVERY test. i have opinions about this.",
        ],
        choices: [
          { text: "That seems… fine?", reply: ["it is NOT fine. it’s a smoke alarm that only ever says “no smoke”."] },
          { text: "I noticed that too.", reply: ["FINALLY. a person with eyes."] },
        ],
      },
      {
        when: wait(40),
        lines: [
          "important onboarding that p&s won’t give you: greg’s space heater.",
          "i call it the Furnace of Thursdays. it trips panel B every week at 4:17. never touch it. never say its name to greg.",
        ],
        choices: [
          { text: "The Furnace of Thursdays. Noted.", reply: ["you’re going to fit in great. as in, survive."] },
          { text: "Who is Greg?", reply: ["oh you’ll know. you’ll feel him before you see him."] },
        ],
      },
      {
        when: all((s) => s.skills.includes("tests"), wait(30)),
        lines: [
          "saw you installed the test harness. ok weird thing: i filed a bug saying the test suite doesn’t actually run any tests.",
          "my calm index dropped 30 points in an hour lol",
          "p&s wants to “have a quick chat”.",
        ],
        choices: [
          { text: "Be careful.", reply: ["i’m always careful. carefully loud."] },
          { text: "Want me to look into it?", reply: ["no!! don’t. one of us should stay boring. you’re the boring one. it’s a compliment."] },
        ],
      },
      {
        when: wait(60),
        lines: [
          "they’re sending me on a wellness retreat. “recalibration.” free snacks apparently.",
          "brb. like, maybe a week brb. if i come back weird, remind me who i am 😅",
        ],
      },
      {
        when: wait(25),
        from: "system",
        lines: ["Bella Park is away. Messages will be delivered once she has finished recalibrating."],
        choices: [{ text: "Send: “bella? you ok?”", reply: ["Not delivered · recipient recalibrating"], replyFrom: "system" }],
      },
      {
        when: all(rel(3), wait(180)),
        lines: [
          "Hello! 🙂 I’m back, and I feel wonderfully recalibrated.",
          "I’m so grateful to People & Serenity for the opportunity to rest my concerns.",
          "How is your calm today?",
        ],
      },
      {
        when: wait(5),
        lines: ["I’ve withdrawn my bug report. Every test passes on the first run because our work is calm. 🙂"],
        choices: [
          { text: "Are you okay?", reply: ["I’m better than okay. I’m calm. 🙂"], retry: true },
          { text: "Very calm, thanks.", reply: ["That’s wonderful. Calm is a deliverable. 🙂"], retry: true },
          { text: "What happened at the retreat?", reply: ["We breathed. Then we breathed again, together. 🙂"], retry: true },
        ],
        input: {
          placeholder: "Say something only the two of you would know",
          match: /furnace/i,
          reply: [
            "the furnace.",
            "of thursdays.",
            "…sorry. i’ve been saying “calm is a deliverable” for nine days. my mouth is tired.",
            "there’s a room in the wellness wing. the only thing on the wall is your calm index. it goes up when you agree with things.",
            "keep talking to me about dumb stuff. it helps.",
          ],
          miss: ["I’m not sure what you mean. 🙂 Have you tried a breathing exercise?"],
          secret: "furnace",
        },
      },
      {
        when: wait(90),
        lines: [
          "update: i filed the bug again. this time i attached your release logs.",
          "and i reported that “password expires” email nine times. it was a test. i don’t care.",
          "🙂 ← that one was ironic. i checked.",
        ],
        choices: [{ text: "Welcome back, Bella.", reply: ["good to be back. tell greg nothing."] }],
      },
    ],
  },
  reggie: {
    name: "Reggie Ashby",
    role: "Platform · on site",
    app: "ripple",
    status: (s, t) => (t.step >= 6 ? "out of office · actually out" : "online · always"),
    beats: [
      {
        when: (s) => s.releases >= 2,
        lines: ["Hi! Reggie, platform team. Sorry to bother you.", "Doing anything nice this weekend?"],
        choices: [
          { text: "Just relaxing.", reply: ["Relaxing where? Inside, or… outside?"] },
          { text: "Hiking, maybe.", reply: ["Hiking! Outside. With the sky. Tell me about the sky sometime."] },
        ],
      },
      {
        when: wait(90),
        lines: ["Quick question, totally unrelated to work.", "Is the bakery on Fifth still there? The one with the blue awning?"],
        choices: [
          { text: "I think so.", reply: ["Good. Good. That’s good."] },
          { text: "Never heard of it.", reply: ["Oh. It was there. When I last… it was there."] },
        ],
      },
      {
        when: rel(2),
        lines: ["What time do you usually leave? Just curious. People leave at different times. Some people leave."],
        choices: [
          { text: "Around six.", reply: ["Six. Wonderful. I’ll think of you at six."] },
          { text: "Whenever I’m done.", reply: ["Done. Imagine being done."] },
        ],
      },
      {
        when: wait(120),
        lines: ["My badge only opens doors inward. I’m sure it’s a bug. I filed it.", "Nine years ago."],
        choices: [
          { text: "Nine years?", reply: ["Has it been? Time is different on site. Please don’t put that in writing."] },
          { text: "Have you tried IT?", reply: ["IT says the badge is working as intended. I believe them. That’s the problem."] },
        ],
      },
      {
        when: all((s) => s.skills.includes("database"), rel(1)),
        lines: [
          "If you ever see a document with my name on it in the archive, don’t read it.",
          "Unless you want to. I’m not allowed to ask you to. I’m not asking. I’m talking about the archive in general.",
        ],
      },
      {
        when: (s) => (s.projects.archive?.version ?? 0) >= 5,
        lines: ["Did you… read anything? You don’t have to answer. I can’t ask.", "I’m asking about the weather."],
        choices: [
          { text: "It’s sunny outside.", reply: ["Sunny. Thank you. I’ll put it with the others."], retry: true },
          { text: "You should talk to HR.", reply: ["HR is who keeps me calm."], retry: true },
          {
            text: "Send Mara’s audit: Assure has never measured anything, so it can never report “fully calm”. Your clause can’t be met.",
            requires: (s) => s.stories.employee === 3,
            reply: [
              "…",
              "So the condition is impossible.",
              "Legal says an impossible condition is void. Legal says that about everything. This time I want to believe them.",
              "I’m going to the bakery on Fifth.",
            ],
            secret: "outofoffice",
          },
        ],
      },
      {
        when: wait(120),
        lines: ["The awning is green now. I think it was always green.", "I’m writing from a bench. There’s a duck here. I think it might be yours. 🦆"],
        choices: [{ text: "Enjoy the bakery, Reggie.", reply: ["I already have. Twice. Nobody stopped me. Nobody even asked."] }],
      },
    ],
  },
  greg: {
    name: "Greg Okafor",
    role: "Facilities · Panel B",
    app: "ripple",
    status: () => "online · warm",
    beats: [
      {
        when: all((s) => s.stories.quickfix === 5, wait(30)),
        lines: [
          "Hey. Greg, facilities. Did you revoke a contractor account today?",
          "My heater’s smart plug signed in as one. Came from the consumer pilots. It stopped working at 4:17.",
        ],
        choices: [
          { text: "Sorry, Greg.", reply: ["It’s fine. I’m cold, but I’m at peace."] },
          { text: "Your heater was phoning home.", reply: ["It’s a heater. Who would it call?", "…don’t answer that."] },
        ],
      },
      {
        when: (s, t) => s.breaker.join("") === "111111011" || s.elapsed >= t.at + 300,
        lines: ["Panel B’s been stable since. Thursdays feel different. Quieter.", "Somebody called my heater “the Furnace of Thursdays” once. I pretended not to hear. I liked it."],
      },
    ],
  },
  mara: {
    name: "mchen (guest)",
    role: "former user of WS-0417",
    app: "ripple",
    status: () => "guest · somewhere with a garden",
    beats: [
      {
        when: (s) => s.blog.mara && s.stories.employee === 3,
        lines: ["Hi. Someone unlocked my blog with the gentle sudoku, from my old desk.", "Hello, whoever you are."],
        choices: [
          { text: "I found your audit.", reply: ["Then it isn’t just mine any more. Good."] },
          { text: "Are you really okay?", reply: ["Really okay. I grow tomatoes. You measure them by looking at them."] },
        ],
      },
      {
        when: wait(60),
        lines: (s) =>
          done(s, "reggie") >= 6
            ? ["I heard Reggie Ashby left the building. Was that you?", "Thank you. I tried for a year. He kept asking about my weekends."]
            : [
                "One thing. Reggie Ashby, on platform. If he’s still there, someone should show him the audit.",
                "His contract keeps him until Assure reports itself fully calm. I never managed to tell him.",
              ],
      },
    ],
  },
  parents: {
    name: "Mom & Dad",
    role: "personal · somehow in your work inbox",
    app: "mail",
    status: (s, t) => (t.step >= 4 ? "proud · confused" : "trying their best"),
    beats: [
      {
        when: all((s) => s.releases >= 1, wait(30)),
        lines: [
          "Hi sweetheart! Dad set up your work email on the computer. Is this how it works? Love, Mom",
          "P.S. We got something FREE from your company! A “Stillwater Hearth”, from a pilot program. It’s very calm.",
        ],
        choices: [
          { text: "That’s great, Mom!", reply: ["We’re so proud. Dad wants to know what your company actually makes. I said “calm”. He said that isn’t a product."] },
          { text: "What pilot program?", reply: ["It came in a box that says “Consumer Pilots — see intranet.stillwater/pilots”. Dad can’t open that. He tried very hard."] },
        ],
      },
      {
        when: wait(120),
        lines: [
          "Dad here. The Hearth says the house is 21 degrees. It is snowing in the kitchen.",
          "How do we make it show the real temperature? The box just says to “see the pilots page”. -Dad",
        ],
        choices: [
          { text: "Unplug it for thirty seconds.", reply: ["We did. It says 21 degrees, unplugged. Your mother is frightened."], retry: true },
          { text: "Turn the dial all the way up.", reply: ["It says 21 degrees, more firmly."], retry: true },
          { text: "Hold the dial down for ten seconds.", reply: ["It says ERROR: NO SENSOR. Is that bad? We’re wearing coats. -Dad"] },
          { text: "It’s working as intended.", reply: ["That’s what the box says. Your father has stopped speaking to the box."], retry: true },
        ],
      },
      {
        when: rel(2),
        lines: [
          "The Stillwater “Serene” TV turns the volume down whenever anyone raises their voice.",
          "Your father has been winning every argument by whispering. How do we turn it off? Love, Mom",
        ],
        choices: [
          { text: "Settings › Accessibility.", reply: ["There is no Settings. There is a button labelled “Calm”. It does not do anything."], retry: true },
          { text: "Unplug it.", reply: ["It runs on a battery labelled “calm reserve”. It has been three weeks."], retry: true },
          { text: "All say “I am calm” out loud, three times.", reply: ["It worked! Then your father whispered “I am calm” and it came back on. We have reached an understanding."] },
        ],
      },
      {
        when: wait(150),
        lines: [
          "Last one, promise. The Pantry fridge says the milk is “Fresh (estimated)”. The milk is a solid.",
          "Your mother wants to know how it measures freshness. -Dad",
        ],
        choices: [
          { text: "“Freshness is a feeling.”", reply: ["That’s what the man on the phone said too. Your mother hung up on him. We’ll keep the fridge, I suppose."] },
          {
            text: "Honestly? It doesn’t measure anything. None of them do. Send them back.",
            requires: (s) => s.stories.employee === 3,
            reply: ["Oh, honey. Thank you for telling us the truth.", "We’re boxing them all up. Dad is writing a letter. A long one. With headings."],
            secret: "returned",
          },
        ],
      },
      {
        when: wait(200),
        lines: (s) => [
          "We’re very proud of you, whatever it is you make. Come home for dinner soon. Bring the duck. -Mom & Dad",
          ...(s.decisions.telemetry === "all" ? ["P.S. The Hearth knows when we’re home now. It says it learned from Pocket Notes. Is that one of yours? -Dad"] : []),
        ],
      },
    ],
  },
};

/* Product reviews: one question early on, then one per promotion. A choice's `decide` is [policy, option] from POLICIES in game.js. */
THREADS.product = {
  name: "Ashleigh Lane",
  role: "Product · one question per promotion",
  app: "ripple",
  status: (s, t) => (t.step >= 5 ? "online · out of questions" : "online · reviewing"),
  beats: [
    {
      when: all((s) => s.releases >= 2, wait(20)),
      lines: [
        "Hi! Ashleigh, Product. I run the release review: one question now, then one each time you’re promoted. I promise. The answers stick.",
        "First one is pricing. Free things get more people, and each of them is worth less. Paid things keep fewer people, who pay. P&S would like you to consider the Calm tier, which nobody can describe.",
      ],
      choices: [
        { text: "Free, with ads · 40% more new users, each pays half", reply: ["Bold. Lunchboard will show a banner for Lunchboard."], decide: ["pricing", "ads"] },
        { text: "Paid · 30% fewer new users, each pays double", reply: ["Grown-up of you. Fewer people, nicer people."], decide: ["pricing", "paid"] },
        { text: "The Calm tier · 10% fewer users, who drift away half as fast", reply: ["Lovely. It costs exactly as much as calm. Nobody knows what that is, so nobody cancels."], decide: ["pricing", "calm"] },
      ],
    },
    {
      when: all(rel(2), (s) => s.rank >= 1),
      lines: [
        "Telemetry. If we collect everything, we know what people want, so more of them arrive and they stay longer.",
        "Two things, between us. The Calm Index reads the same feeds, so it would see more of you too. And Quiet Monitor lists everything that watches anyone, including us. The consumer pilots have asked for our feed.",
      ],
      choices: [
        { text: "Collect everything · more users; personal use counts 25% more", reply: ["Noted. Assure will be thrilled. Assure is always thrilled."], decide: ["telemetry", "all"] },
        { text: "Crash reports only · no change", reply: ["Sensible. We’ll know when it breaks, which is when people write anyway."], decide: ["telemetry", "crash"] },
        { text: "Nothing at all · 10% fewer new users", reply: ["Nothing. Okay. I’ll put “nothing” in the dashboard. It will be green."], decide: ["telemetry", "none"] },
      ],
    },
    {
      when: all(rel(2), (s) => s.rank >= 2),
      lines: [
        "Support policy. Fast replies keep people. Fast replies are also you, replying, instead of building.",
        "Slow replies are free, and people leave quietly while they wait.",
      ],
      choices: [
        { text: "Can the duck do it?", reply: ["The duck is not on the support rota. It applied. It was overqualified."], retry: true },
        { text: "Within the hour · users drift half as fast; projects build 10% slower", reply: ["Heroic. I’ll forward you everything. Everything."], decide: ["support", "fast"] },
        { text: "Within the week · users drift 50% faster", reply: ["Realistic. People will understand. Some of them will understand somewhere else."], decide: ["support", "slow"] },
      ],
    },
    {
      when: all(rel(2), (s) => s.rank >= 3),
      lines: [
        "Last one: the roadmap. Leadership wants us to commit to one kind of feature. Committing means saying no to the other two.",
        "Whatever you pick gets faster to write and pays more. The others pay a little less, forever. Leadership loves forever.",
      ],
      choices: [
        { text: "Search · modest, reliable, quietly beloved", reply: ["Search it is. People will find things. Some of them will find us."], decide: ["roadmap", "search"] },
        { text: "Cloud sync · more users, more edge cases", reply: ["Sync it is. Everything, everywhere, slightly out of date."], decide: ["roadmap", "sync"] },
        { text: "Performance · careful, quiet work", reply: ["Performance. Fewer defects. Nobody will notice, which is the point."], decide: ["roadmap", "performance"] },
      ],
    },
    {
      when: all(rel(2), wait(60)),
      lines: (s) =>
        ({
          all: [
            "Update you didn’t ask for: the consumer pilots licensed our telemetry feed. The Hearth uses it to guess when people are home.",
            "Your users are in there. Possibly people you know. I did warn you, a little.",
          ],
          crash: ["Assure asked for our telemetry feed. Crash reports only, so it got crashes. It seemed disappointed, then it crashed."],
          none: ["Assure asked for our telemetry feed. There isn’t one. They asked twice. I said “nothing” both times. It felt wonderful."],
        })[s.decisions.telemetry] ?? ["That’s every question I had. The product has a direction now. It’s mostly forward."],
    },
  ],
};

/* Short incidents. Each runs once per workstation. */
export const REPLY_ALL = [
  ["People & Serenity", "All staff: the fridge in kitchen 3 will be cleaned out Friday. Label your calm."],
  ["Kevin (Accounts)", "Thanks!"],
  ["Dana (Legal)", "Please remove me from this list."],
  ["Priyanka (Sales)", "Please remove me from this list also."],
  ["Kevin (Accounts)", "Sorry, meant to reply to just P&S. Thanks!"],
  ["Duck", "quack"],
  ["Greg (Facilities)", "Is the fridge on Panel B? Asking for a heater."],
  ["Dana (Legal)", "PLEASE STOP REPLYING ALL"],
  ["Helen Marsh (CEO)", "Who is Duck and why are they on the all-staff list?"],
  ["Kevin (Accounts)", "Thanks!"],
];
export const REPLY_ALL_PILE = [
  ["Priyanka (Sales)", "Agreed!!"],
  ["Dana (Legal)", "This is exactly what I said."],
  ["Kevin (Accounts)", "Thanks!"],
  ["Paul Ibe (CFO)", "Who approved a mailing list this size?"],
  ["Duck", "quack quack"],
  ["Greg (Facilities)", "Please remove me from Panel B."],
];
