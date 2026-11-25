/*
  script.js = the LOGIC of the website (what happens when you click).
  Built by Claude (AI) for Leon, 24 Nov 2026. Plain JavaScript, no libraries.

  The questionnaire "plays one golf hole" (Leon's decision, docs/product-plan.md section 2):
  each answered question = one shot. 10 questions = 10 shots, and the 10th drops into the cup.

  Sections:
    1. The 10 questions (Leon's exact wording)    7. Playing a shot (the animation)
    2. The answers object                          8. The camera
    3. The 10 shots (where the ball goes, how)     9. Answer markers on the hole
    4. Screens (home, questions, results)         10. Drawing helpers (ball, trail, tracer, puffs, flag)
    5. Showing a question                         11. Start-up
    6. Next, Back, Skip

  Later (algorithm phase): FILTER -> SCORE -> RANK the irons, using the answers object.
*/


/* =========================================================
   1. THE 10 QUESTIONS
   Wording, help text and options copied exactly from docs/product-plan.md, section 3
   (all approved by Leon, 24 Nov). "value" is a short code the algorithm will use later.
   "short" = the name shown on the answer markers and the scorecard (Leon, 24 Nov).

   "note" = the Caddie's note (why we ask). SUGGESTION: drafted by Claude (AI) from Leon's
   research notes only, with the source from product-plan.md section 3. Leon approves or
   rewrites each one; set approved: true to remove the "Draft" tag. No note on question 1 (Leon).
   ========================================================= */
const QUESTIONS = [
  {
    id: "hand", short: "Hand",
    text: "Are you right- or left-handed?",
    help: "The way you stand to the ball. Most right-handed people play right-handed.",
    options: [
      { value: "right", label: "Right" },
      { value: "left", label: "Left" }
    ]
  },
  {
    id: "budget", short: "Budget",
    text: "What's your budget for a set of irons?",
    help: "For a full set, usually 6–7 irons (e.g. 5-iron to pitching wedge). New sets from big brands are often CHF 1,000–1,400 in Switzerland.",
    options: [
      { value: "under-500", label: "Under CHF 500" },
      { value: "500-1000", label: "CHF 500–1,000" },
      { value: "1000-1400", label: "CHF 1,000–1,400" },
      { value: "over-1400", label: "Over CHF 1,400" },
      { value: "no-limit", label: "No limit" },
      { value: "not-sure", label: "Not sure yet" }
    ],
    note: { approved: false,
      text: "Swiss prices run higher than US ones: MyGolfSpy's US game-improvement range works out to about CHF 670–1,090, but similar sets here often cost CHF 1,000 or more.",
      source: "Leon's Swiss price research, Nov 2026; Covey, MyGolfSpy, 2025" }
  },
  {
    id: "used", short: "Used irons",
    text: "Would you buy used irons?",
    help: "Irons a few years old lose very little performance and can cost much less.",
    options: [
      { value: "new-only", label: "New only" },
      { value: "open-to-used", label: "Open to used" },
      { value: "not-sure", label: "Not sure" }
    ],
    note: { approved: false,
      text: "Golf Digest says replacing irons is never a necessity. They suggest a set loses little in about five years, and estimate a 10-year-old set costs about a stroke every 9 holes.",
      source: "Johnson & Stachura, Golf Digest, 2019; coach interview" }
  },
  {
    id: "level", short: "Level",
    text: "What's your level?",
    help: "Your handicap shows your level. If you don't have one, choose Beginner or Not sure.",
    options: [
      { value: "beginner", label: "Beginner (no handicap)" },
      { value: "25-plus", label: "25+" },
      { value: "15-24", label: "15–24" },
      { value: "6-14", label: "6–14" },
      { value: "0-5", label: "0–5" },
      { value: "not-sure", label: "Not sure" }
    ],
    note: { approved: false,
      text: "The higher the handicap, the bigger and more forgiving the iron usually suggested. But it's only a rough guide: no single type of iron is best for everyone.",
      source: "Weston, Golf Monthly, 2025; Covey, MyGolfSpy, 2025; Today's Golfer, 2026" }
  },
  {
    id: "play", short: "How often",
    text: "How much do you play, and how keen are you?",
    help: "This helps decide how much it's worth spending.",
    options: [
      { value: "few-times", label: "A few times a year" },
      { value: "regularly", label: "Regularly" },
      { value: "improving", label: "Seriously trying to improve" }
    ],
    note: { approved: false,
      text: "In a large fitting study, golfers of every level improved with clubs that suited them, and higher handicaps gained the most. The study was run with a fitting company, so treat the numbers with care.",
      source: "Shapcott, National Club Golfer, 2022; coach interview" }
  },
  {
    id: "miss", short: "Usual miss",
    text: "What's your most common bad iron shot?",
    help: "Fat = you hit the ground before the ball. Thin = you catch the ball low on the face and it flies low. Toe/heel = off the end of the face or near the shaft.",
    options: [
      { value: "fat", label: "Fat (ground first)" },
      { value: "thin", label: "Thin" },
      { value: "toe-heel", label: "Off the toe or heel" },
      { value: "slice-hook", label: "Slice or hook" },
      { value: "not-sure", label: "Not sure" }
    ],
    note: { approved: false,
      text: "Different designs help different misses: a wide sole forgives fat shots, a high MOI keeps off-centre hits straighter, and more offset helps reduce a slice.",
      source: "Summitt, Hireko Golf, 2026; Johnson, Golf Digest, 2026" }
  },
  {
    id: "flight", short: "Ball flight",
    text: "How high do your irons fly?",
    help: "Some irons are built to launch the ball higher, which helps if your shots stay low.",
    options: [
      { value: "too-low", label: "Too low, hard to get up" },
      { value: "normal", label: "Normal" },
      { value: "too-high", label: "Too high" },
      { value: "not-sure", label: "Not sure" }
    ],
    note: { approved: false,
      text: "A centre of gravity that sits low and back helps launch the ball higher, and many golfers don't have the speed to launch it high on their own.",
      source: "Covey, MyGolfSpy, 2025; Summitt, Hireko Golf, 2026; Johnson, Golf Digest, 2026" }
  },
  {
    id: "priority", short: "Priority",
    // Ranked choice (Leon, 25 Nov): pick up to 3 in order; "Not sure" clears the others.
    // Stored as an ordered list, e.g. ["forgiveness", "accuracy"].
    // Scoring later (Leon): 1st choice +3, 2nd +2, 3rd +1 to that feature's weight.
    type: "ranked", max: 3, exclusive: "not-sure",
    text: "What matters most to you?",
    help: "Pick up to 3, most important first. Every iron is a trade-off.",
    options: [
      { value: "distance", label: "Distance" },
      { value: "forgiveness", label: "Forgiveness" },
      { value: "accuracy", label: "Control and accuracy" },
      { value: "feel", label: "Feel" },
      { value: "looks", label: "How it looks" },
      { value: "price", label: "Price" },
      { value: "not-sure", label: "Not sure" }
    ],
    note: { approved: false,
      text: "In one test at the same loft, distance irons carried about 5 yards further than blades, but the blades were more accurate for 4 of the 5 golfers.",
      source: "Saternus, Club Champion, 2019; Today's Golfer, 2026; coach interview" }
  },
  {
    id: "goal", short: "Goal",
    text: "What's your goal?",
    help: "Easier irons help your scores now. There's no clear proof that harder irons make you improve faster.",
    options: [
      { value: "score-now", label: "Score better now" },
      { value: "long-term", label: "Improve my ball striking long term" },
      { value: "not-sure", label: "Not sure" }
    ],
    note: { approved: false,
      text: "In two tests, even good players hit more good shots with forgiving irons. Neither test measured whether harder irons help you improve over time.",
      source: "Bishop, MyGolfSpy Labs; Saternus, Plugged In Golf; coach interview" }
  },
  {
    id: "measurements", short: "Measurements",
    type: "numbers",   // number boxes instead of options, plus a Skip button
    text: "Optional: height, wrist-to-floor, swing speed (if known)",
    help: "Only if you know them. Used for tips on lie, length and shaft, not to choose the iron.",
    fields: [
      { id: "heightCm", label: "Height (cm)" },
      { id: "wristToFloorCm", label: "Wrist-to-floor (cm)" },
      { id: "driverSpeedMph", label: "Driver swing speed (mph)", hint: "Only if you've measured it on a launch monitor" }
    ],
    note: { approved: false,
      text: "Height and wrist-to-floor give a starting point for lie and length, which a fitter then checks. In a small test, the right lie put shots about 5 yards closer together.",
      source: "PING colour code chart; Saternus, Plugged In Golf, 2018; MacKenzie & Sprigings, 2009" }
  }
];


/* =========================================================
   2. THE ANSWERS OBJECT
   Every answer is stored here, e.g. answers.level = "15-24".
   answers.measurements is either { heightCm, wristToFloorCm, driverSpeedMph } or "skipped".
   answers.priority is an ordered list, most important first, e.g. ["forgiveness", "accuracy"]
   (or ["not-sure"]). An empty list is stored as null, so Next stays disabled.
   No scoring yet: the algorithm will read this object later.
   ========================================================= */
let answers = {};

function resetAnswers() {
  answers = {};
  QUESTIONS.forEach(function (q) { answers[q.id] = null; });
}


/* =========================================================
   3. THE 10 SHOTS
   The ball has 11 resting spots (in the drawing's coordinates, 600 wide x 1000 tall):
   0 = tee ... 10 = in the cup. Shot 1 goes from spot 0 to spot 1, and so on.
   Pressing Next on question 3 plays shot 3.
   ========================================================= */
const CUP = { x: 352, y: 222 };   // must match the cup in the drawing (index.html)
const RIM = 6;                    // radius of the cup's rim, used for the lip-out

const SPOTS = [
  { x: 300, y: 938 },   // 0  tee
  { x: 250, y: 700 },   // 1  drive comes to rest on the fairway
  { x: 214, y: 522 },   // 2  fairway wood rolls into the fairway bunker
  { x: 268, y: 494 },   // 3  bunker escape, back on the fairway
  { x: 352, y: 392 },   // 4  layup area
  { x: 242, y: 262 },   // 5  approach lands in the greenside bunker
  { x: 259, y: 214 },   // 6  splash shot pops onto the fringe
  { x: 290, y: 238 },   // 7  chip from the fringe rolls closer
  { x: 338, y: 218 },   // 8  long putt, just short of the cup
  null,                 // 9  lip-out: worked out below (beside the cup)
  CUP                   // 10 in the cup
];

// Lip-out: the ball reaches the rim, circles three-quarters of the way round it, and stops beside the cup.
const lipIn = unit(CUP.x - SPOTS[8].x, CUP.y - SPOTS[8].y);
const LIP_START_ANGLE = Math.atan2(-lipIn.y, -lipIn.x);             // where the ball meets the rim
const LIP_END_ANGLE = LIP_START_ANGLE + Math.PI * 1.5;              // three-quarters round
const LIP_ENTRY = pointOnRim(LIP_START_ANGLE);
const LIP_EXIT = pointOnRim(LIP_END_ANGLE);
SPOTS[9] = {
  x: CUP.x + Math.cos(LIP_END_ANGLE + 0.3) * 11,
  y: CUP.y + Math.sin(LIP_END_ANGLE + 0.3) * 11
};

// Small line icons of the clubs, shown in the card header (Leon, 24 Nov: driver, wood, iron, wedge, putter)
const CLUBS = {
  driver: '<path d="M15.5 2.5 9 13.2"/><path d="M9 13.2c-2.8-.6-6 .6-6.3 2.6-.2 1.5 1.7 2.2 4 1.9 2.6-.4 4.2-1.9 4-3.4-.1-.6-.7-1-1.7-1.1z"/>',
  wood: '<path d="M15.5 2.5 9.6 13.8"/><path d="M9.6 13.8c-2.2-.3-4.6.7-4.8 2.2-.1 1.1 1.3 1.7 3.1 1.4 2-.3 3.2-1.4 3-2.6-.1-.5-.5-.9-1.3-1z"/>',
  iron: '<path d="M15.5 2.5 10 14"/><path d="M10 14 4.2 15.6l.9 2.4 6-1.4z"/>',
  wedge: '<path d="M15.5 2.5 10.2 13.6"/><path d="M10.2 13.6 4 14.2l.6 3.6 6.4-1.6z"/><path d="M5.6 15.6l4-.5"/>',
  putter: '<path d="M12.5 2.5v12"/><path d="M6.5 14.5h9a1.6 1.6 0 0 1 0 3.2h-9a1.6 1.6 0 0 1 0-3.2z"/>'
};

/*
  Real ball physics (Leon, 24 Nov): a full shot flies to where it LANDS, takes 1–2 small bounces,
  then rolls out to where it RESTS. This helper builds those pieces ("segments") for one shot.
    landBack = how far before the resting spot the ball lands (the roll-out)
    bounces  = 0, 1 or 2 small bounces after landing
    puff     = "turf" or "sand": a tiny puff of particles where the ball lands
*/
function fullShot(from, rest, o) {
  const dir = unit(rest.x - from.x, rest.y - from.y);
  const land = { x: rest.x - dir.x * o.landBack, y: rest.y - dir.y * o.landBack };
  const segments = [{ type: "flight", to: land, time: o.time, height: o.height, tracer: o.tracer, puff: o.puff }];
  const stops = o.bounces === 2 ? [0.45, 0.75] : o.bounces === 1 ? [0.6] : [];
  const bounceHeight = [0.16, 0.06];   // each bounce is much lower than the shot
  const bounceTime = [200, 130];
  stops.forEach(function (f, k) {
    segments.push({
      type: "flight", time: bounceTime[k], height: o.height * bounceHeight[k],
      to: { x: land.x + (rest.x - land.x) * f, y: land.y + (rest.y - land.y) * f }
    });
  });
  if (o.landBack > 0) segments.push({ type: "roll", to: rest, time: o.rollTime });
  return segments;
}

/*
  The 10 shots. "label" is shown in the card header BEFORE the shot is played, e.g. "Shot 3 · Fairway bunker".
  "club" picks the icon. "spray" = sand particles thrown out of a bunker at the start.
  Every shot is 1.5 seconds or less (Leon, 24 Nov).
*/
const SHOTS = [
  { label: "Drive", club: "driver",
    segments: fullShot(SPOTS[0], SPOTS[1], { landBack: 36, time: 950, height: 95, bounces: 2, rollTime: 200, puff: "turf", tracer: true }) },
  { label: "Fairway wood", club: "wood",
    segments: fullShot(SPOTS[1], SPOTS[2], { landBack: 56, time: 860, height: 70, bounces: 1, rollTime: 380, puff: "turf", tracer: true }) },
  { label: "Fairway bunker", club: "wedge", spray: 6,
    segments: fullShot(SPOTS[2], SPOTS[3], { landBack: 10, time: 700, height: 26, bounces: 1, rollTime: 200, puff: "turf" }) },
  { label: "Layup", club: "iron",
    segments: fullShot(SPOTS[3], SPOTS[4], { landBack: 22, time: 820, height: 55, bounces: 2, rollTime: 200, puff: "turf", tracer: true }) },
  { label: "Approach", club: "iron",   // lands straight in the bunker: no bounce, a sand puff
    segments: fullShot(SPOTS[4], SPOTS[5], { landBack: 0, time: 1050, height: 65, bounces: 0, puff: "sand", tracer: true }) },
  { label: "Greenside bunker", club: "wedge", spray: 14,
    segments: fullShot(SPOTS[5], SPOTS[6], { landBack: 6, time: 750, height: 34, bounces: 1, rollTime: 180 }) },
  { label: "Chip from the fringe", club: "wedge",
    segments: [{ type: "roll", to: SPOTS[7], time: 1100, hop: 5 }] },
  { label: "Long putt", club: "putter",
    segments: [{ type: "roll", to: SPOTS[8], time: 1400, bend: { x: 318, y: 244 } }] },
  { label: "Lip-out", club: "putter",
    segments: [{ type: "roll", to: LIP_ENTRY, time: 450, ease: "linear" },
               { type: "rim", to: LIP_EXIT, time: 700 },
               { type: "roll", to: SPOTS[9], time: 300 }] },
  { label: "Tap-in", club: "putter",
    segments: [{ type: "roll", to: CUP, time: 350, ease: "inOut" },
               { type: "drop", to: CUP, time: 300 }] }
];

// Work out where each segment starts, each shot's total time, and when its puffs happen
SHOTS.forEach(function (shot, i) {
  let from = SPOTS[i];
  let total = 0;
  shot.effects = [];
  if (shot.spray) {
    // sand thrown out of the bunker, mostly in the direction of the shot
    shot.effects.push({ time: 0, at: from, towards: shot.segments[0].to, kind: "sand", count: shot.spray, big: shot.spray > 8 });
  }
  shot.segments.forEach(function (seg) {
    seg.from = from;
    seg.startTime = total;
    total += seg.time;
    if (seg.puff) shot.effects.push({ time: total, at: seg.to, kind: seg.puff, count: seg.puff === "sand" ? 7 : 5, landing: true });
    from = seg.to;
  });
  shot.totalTime = total;
});


/* =========================================================
   4. SCREENS
   ========================================================= */
const app = document.querySelector(".app");
const screens = {
  home: document.getElementById("home"),
  questions: document.getElementById("questions"),
  results: document.getElementById("results")
};

let current = 0;   // which question is showing (0 = question 1)

function showScreen(name) {
  app.dataset.screen = name;   // the CSS uses this, e.g. to show the hole only on question screens
  Object.keys(screens).forEach(function (key) {
    screens[key].hidden = (key !== name);
  });
  window.scrollTo({ top: 0, behavior: "instant" });   // jump to the top (no smooth scroll between screens)
}

// HOME PAGE: sections fade in as they scroll into view (adds "is-visible"; the CSS does nothing with reduced motion)
const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(function (item) { revealer.observe(item); });
} else {
  revealItems.forEach(function (item) { item.classList.add("is-visible"); });
}

// Header links like "How it works" point to home page sections. From a question or results screen,
// they first go back to the home page, then scroll to that section.
document.querySelectorAll('.site-header a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
    if (app.dataset.screen === "home") return;   // already on the home page: the browser scrolls normally
    event.preventDefault();
    if (playing) return;
    showScreen("home");
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView();
  });
});

function startQuestionnaire() {
  resetAnswers();
  current = 0;
  showScreen("questions");
  placeBall(0);
  showQuestion(0, false);
}

// The results screen (PLACEHOLDER): your answers as a scorecard.
// rise = true: the scorecard rises up (after the dive into the cup).
function showResults(rise) {
  const body = document.getElementById("answers-list");
  body.innerHTML = "";
  QUESTIONS.forEach(function (q, i) {
    const row = document.createElement("tr");
    [String(i + 1), q.short, describeAnswer(q)].forEach(function (text) {
      const cell = document.createElement("td");
      cell.textContent = text;
      row.append(cell);
    });
    // Ranked answers (question 8) show as a numbered list in the last cell instead
    const ranked = rankedLabels(q);
    if (ranked) {
      const list = document.createElement("ol");
      list.className = "ranked-list";
      ranked.forEach(function (label) {
        const item = document.createElement("li");
        item.textContent = label;
        list.append(item);
      });
      row.lastChild.textContent = "";
      row.lastChild.append(list);
    }
    body.append(row);
  });
  showScreen("results");
  screens.results.classList.toggle("is-rising", Boolean(rise) && !reducedMotion());
  document.getElementById("results-title").focus();
}

// Turns a stored answer back into readable text (scorecard and markers)
function describeAnswer(q) {
  const value = answers[q.id];
  if (q.type === "numbers") {
    if (!value || value === "skipped") return "Skipped";
    return q.fields.map(function (f) {
      return f.label + ": " + (value[f.id] === null ? "–" : value[f.id]);
    }).join(", ");
  }
  const ranked = rankedLabels(q);
  if (ranked) {
    return ranked.map(function (label, i) { return (i + 1) + " " + label; }).join(", ");   // "1 Forgiveness, 2 Feel"
  }
  const option = q.options.find(function (o) { return o.value === value; });
  return option ? option.label : "–";
}

// Ranked question with at least one real choice: its labels in order, e.g. ["Forgiveness", "Feel"].
// Returns null otherwise ("Not sure" or no answer are shown as normal text).
function rankedLabels(q) {
  const value = answers[q.id];
  if (q.type !== "ranked" || !Array.isArray(value) || value[0] === q.exclusive) return null;
  return value.map(function (v) { return optionLabel(q, v); });
}

function optionLabel(q, value) {
  return q.options.find(function (o) { return o.value === value; }).label;
}


/* =========================================================
   5. SHOWING A QUESTION
   ========================================================= */
const qCard = document.getElementById("q-card");
const qBody = document.getElementById("q-body");
const nextButton = document.getElementById("next-button");
const backButton = document.getElementById("back-button");
const skipButton = document.getElementById("skip-button");

// arriving = true: the card slides in from the side away from the hole (after a shot)
function showQuestion(index, arriving) {
  const q = QUESTIONS[index];
  const shot = SHOTS[index];
  current = index;

  // Card header: "Question X of 10" (always shown as text) and the shot with its club icon
  document.getElementById("q-number").textContent = index + 1;
  // "Up to 3" label next to the question number, only on the ranked question (Leon, 25 Nov)
  const qPick = document.getElementById("q-pick");
  qPick.hidden = (q.type !== "ranked");
  if (q.type === "ranked") qPick.textContent = "Up to " + q.max;
  document.getElementById("shot-head").innerHTML =
    '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">' + CLUBS[shot.club] + "</svg>" +
    '<span><span class="num">Shot ' + (index + 1) + "</span> · " + shot.label + "</span>";

  // Build the question: a fieldset with the question as its legend, help text, caddie's note, then the answers
  qBody.innerHTML = "";
  const fieldset = document.createElement("fieldset");
  fieldset.setAttribute("aria-describedby", "q-help");
  fieldset.innerHTML =
    '<legend><h2 class="q-title" id="q-title" tabindex="-1"></h2></legend>' +
    '<p class="hint" id="q-help"></p>';
  fieldset.querySelector("#q-title").textContent = q.text;
  fieldset.querySelector("#q-help").textContent = q.help;
  if (q.note) fieldset.append(buildCaddieNote(q.note));

  if (q.type === "numbers") {
    fieldset.append(buildNumberFields(q));
  } else if (q.type === "ranked") {
    fieldset.append(buildRankedOptions(q));
  } else {
    fieldset.append(buildOptions(q));
  }
  qBody.append(fieldset);

  skipButton.hidden = (q.type !== "numbers");
  updateNextButton();

  // Card motion: the new card arrives from the other side (CSS does nothing if reduced motion is on)
  qCard.classList.remove("is-leaving");
  if (arriving) {
    qCard.classList.add("is-arriving");
    void qCard.offsetWidth;   // makes the browser notice the class before it is removed
    qCard.classList.remove("is-arriving");
  }

  // Accessibility: move focus to the question and announce "Question X of 10"
  document.getElementById("q-title").focus({ preventScroll: true });
  const announcer = document.getElementById("announcer");
  announcer.textContent = "";
  setTimeout(function () { announcer.textContent = "Question " + (index + 1) + " of 10"; }, 60);
}

// Caddie's note: a native <details>, closed until tapped, with its source
function buildCaddieNote(note) {
  const details = document.createElement("details");
  details.className = "caddie";
  const summary = document.createElement("summary");
  summary.textContent = "Caddie's note: why we ask";
  if (!note.approved) {
    const tag = document.createElement("span");
    tag.className = "draft-tag";
    tag.textContent = "Draft";
    summary.append(" ", tag);
  }
  const p = document.createElement("p");
  p.textContent = note.text;
  const cite = document.createElement("cite");
  cite.textContent = "Source: " + note.source;
  p.append(cite);
  details.append(summary, p);
  return details;
}

// Radio buttons inside labels (the whole card can be clicked)
function buildOptions(q) {
  const box = document.createElement("div");
  box.className = "options";
  if (q.options.length >= 5) box.classList.add("compact");   // 2 columns on small phones
  q.options.forEach(function (opt) {
    const label = document.createElement("label");
    label.className = "option";
    // "Not sure" gets its own full-width row on phones when it would otherwise sit alone
    // in the last row (odd number of options, e.g. question 6) (Leon, 25 Nov)
    if (opt.value === "not-sure" && q.options.length % 2 === 1) label.classList.add("own-row");
    const text = document.createElement("span");
    text.textContent = opt.label;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = q.id;
    input.value = opt.value;
    input.checked = (answers[q.id] === opt.value);   // keeps the earlier answer after Back
    input.addEventListener("change", function () {
      answers[q.id] = opt.value;
      updateNextButton();
    });
    label.append(text, input);
    box.append(label);
  });
  return box;
}

// Question 8: ranked choice (Leon, 25 Nov). Real checkboxes inside labels.
// Each tap adds the option with its rank (1, 2, 3); tapping it again removes it and the others move up.
// "Not sure" is exclusive: picking it clears the others (and picking a feature clears "Not sure").
function buildRankedOptions(q) {
  const wrap = document.createElement("div");
  const box = document.createElement("div");
  box.className = "options ranked";
  if (q.options.length >= 5) box.classList.add("compact");   // 2 columns on small phones

  let order = Array.isArray(answers[q.id]) ? answers[q.id].slice() : [];   // keeps the earlier answer after Back

  q.options.forEach(function (opt) {
    const label = document.createElement("label");
    label.className = "option";
    if (opt.value === q.exclusive) label.classList.add("own-row");   // "Not sure": own full-width row on phones
    label.dataset.value = opt.value;
    const text = document.createElement("span");
    text.textContent = opt.label;
    // Hidden text read by screen readers as part of the name: "Forgiveness, choice 1 of 3"
    const rankText = document.createElement("span");
    rankText.className = "sr-only rank-text";
    text.append(rankText);
    // The circle: a checkbox with the rank number drawn on top of it
    const pick = document.createElement("span");
    pick.className = "pick";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = q.id;
    input.value = opt.value;
    const badge = document.createElement("span");
    badge.className = "rank";
    badge.setAttribute("aria-hidden", "true");
    pick.append(input, badge);

    input.addEventListener("change", function () {
      let message;
      if (input.checked) {
        if (opt.value === q.exclusive) {
          message = order.length ? opt.label + ". Your other choices were cleared." : opt.label;
          order = [opt.value];
        } else if (order.length >= q.max && order[0] !== q.exclusive) {
          input.checked = false;   // already 3 picked: refuse the 4th
          message = "You've already picked " + q.max + ". Remove one first.";
          showRankStatus(wrap, message);
          announce(message);
          return;
        } else {
          order = order.filter(function (v) { return v !== q.exclusive; });
          order.push(opt.value);
          message = opt.label + ", choice " + order.length + " of " + q.max;
        }
      } else {
        const removedAt = order.indexOf(opt.value);
        order = order.filter(function (v) { return v !== opt.value; });
        message = opt.label + " removed.";
        // Say which choices moved up, e.g. "Feel is now choice 1."
        order.slice(removedAt).forEach(function (v, i) {
          message += " " + optionLabel(q, v) + " is now choice " + (removedAt + i + 1) + ".";
        });
      }
      answers[q.id] = order.length ? order.slice() : null;
      updateRanks(wrap, q, order);
      updateNextButton();
      announce(message);
    });

    label.append(text, pick);
    box.append(label);
  });

  // A small line under the options: how many are picked, or why a 4th tap did nothing
  const status = document.createElement("p");
  status.className = "rank-status";
  wrap.append(box, status);
  updateRanks(wrap, q, order);
  return wrap;
}

// Shows each picked option's rank (visible number + hidden text) and dims the rest when 3 are picked
function updateRanks(wrap, q, order) {
  const full = order.length >= q.max;
  wrap.querySelectorAll(".option").forEach(function (label) {
    const value = label.dataset.value;
    const rank = order.indexOf(value) + 1;   // 0 = not picked
    const isExclusive = (value === q.exclusive);
    label.querySelector("input").checked = rank > 0;
    label.querySelector(".rank").textContent = (rank && !isExclusive) ? rank : "";
    label.querySelector(".rank-text").textContent = (rank && !isExclusive) ? ", choice " + rank + " of " + q.max : "";
    label.classList.toggle("is-ranked", rank > 0 && !isExclusive);   // filled circle with a number
    label.classList.toggle("is-unavailable", full && rank === 0 && !isExclusive);
  });
  let text = "Nothing picked yet";
  if (order[0] === q.exclusive) text = "Not sure picked";
  else if (full) text = q.max + " of " + q.max + " picked. Tap one to remove it.";
  else if (order.length) text = order.length + " of " + q.max + " picked";
  showRankStatus(wrap, text);
}

function showRankStatus(wrap, text) {
  wrap.querySelector(".rank-status").textContent = text;
}

// Reads a short message aloud for screen readers (the same live region as "Question X of 10")
function announce(text) {
  const announcer = document.getElementById("announcer");
  announcer.textContent = "";
  setTimeout(function () { announcer.textContent = text; }, 60);
}

// Question 10: three optional number boxes
function buildNumberFields(q) {
  const box = document.createElement("div");
  box.className = "fields";
  const saved = (answers[q.id] && answers[q.id] !== "skipped") ? answers[q.id] : {};
  q.fields.forEach(function (f) {
    const field = document.createElement("div");
    field.className = "field";
    const label = document.createElement("label");
    label.htmlFor = f.id;
    label.textContent = f.label;
    field.append(label);
    if (f.hint) {
      const hint = document.createElement("span");
      hint.className = "field-hint";
      hint.id = f.id + "-hint";
      hint.textContent = f.hint;
      field.append(hint);
    }
    const input = document.createElement("input");
    input.type = "number";
    input.id = f.id;
    input.inputMode = "decimal";
    input.min = "0";
    if (f.hint) input.setAttribute("aria-describedby", f.id + "-hint");
    if (saved[f.id] !== undefined && saved[f.id] !== null) input.value = saved[f.id];
    input.addEventListener("input", function () {
      answers[q.id] = readNumberFields(q);
      updateNextButton();
    });
    field.append(input);
    box.append(field);
  });
  return box;
}

function readNumberFields(q) {
  const result = {};
  q.fields.forEach(function (f) {
    const n = parseFloat(document.getElementById(f.id).value);
    result[f.id] = (n > 0) ? n : null;
  });
  return result;
}

// Next is disabled until an answer is chosen (Leon, 24 Nov).
// On question 10, Next needs at least one number; Skip is always possible.
function updateNextButton() {
  const q = QUESTIONS[current];
  const value = answers[q.id];
  let ready;
  if (q.type === "numbers") {
    ready = value && value !== "skipped" && q.fields.some(function (f) { return value[f.id] !== null; });
  } else {
    ready = value !== null;
  }
  nextButton.disabled = !ready;
}


/* =========================================================
   6. NEXT, BACK, SKIP
   ========================================================= */
// Every Start button on the home page (hero, navigation bar, footer) has data-start
document.querySelectorAll("[data-start]").forEach(function (button) {
  button.addEventListener("click", startQuestionnaire);
});
document.getElementById("restart-button").addEventListener("click", startQuestionnaire);

// Next (also runs when Enter is pressed inside the form)
document.getElementById("q-form").addEventListener("submit", function (event) {
  event.preventDefault();
  if (playing) { skipShot(); return; }       // pressing Next during a shot skips it
  if (nextButton.disabled) return;
  playShotThenContinue();
});

// Skip (question 10 only): no measurements, then play the last shot
skipButton.addEventListener("click", function () {
  if (playing) { skipShot(); return; }
  answers.measurements = "skipped";
  playShotThenContinue();
});

// Back: the ball returns to its previous spot WITHOUT replaying the shot
backButton.addEventListener("click", function () {
  if (playing) return;
  if (current === 0) {
    showScreen("home");
    document.getElementById("start-button").focus();
    return;
  }
  placeBall(current - 1);
  showQuestion(current - 1, false);
});

// Skipping a shot: click/tap the hole panel, or press Enter or Space while a shot plays
document.getElementById("hole-panel").addEventListener("click", function () {
  if (playing) skipShot();
});
document.addEventListener("keydown", function (event) {
  if (playing && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    skipShot();
  }
}, true);

function playShotThenContinue() {
  const shotIndex = current;
  qCard.classList.add("is-leaving");   // the card eases towards the hole as the ball takes off

  // Phone: make sure the hole band is visible before the shot starts
  if (!isLaptop() && window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  }

  playShot(shotIndex, function () {
    if (shotIndex < QUESTIONS.length - 1) {
      showQuestion(shotIndex + 1, true);
    } else {
      holeOut();   // the 10th shot dropped in: flag sways, the camera dives into the cup, then results
    }
  });
}


/* =========================================================
   7. PLAYING A SHOT
   requestAnimationFrame calls "frame" about 60 times a second.
   Each time, we work out where the ball is at that moment and redraw it.
   ========================================================= */
let playing = null;   // information about the shot that is playing (null = no shot playing)

function playShot(index, onDone) {
  const shot = SHOTS[index];

  // Reduced motion: no flight, puffs or camera move. The ball just appears at its new spot.
  if (reducedMotion()) {
    placeBall(index + 1, true);
    onDone();
    return;
  }

  playing = {
    index: index, shot: shot, start: performance.now(), onDone: onDone, frameId: null,
    effects: shot.effects.map(function (e) { return { e: e, particles: null }; })
  };
  app.classList.add("is-playing");
  nextButton.setAttribute("aria-disabled", "true");
  backButton.setAttribute("aria-disabled", "true");
  playing.frameId = requestAnimationFrame(frame);
}

function frame(now) {
  if (!playing) return;
  const elapsed = Math.min(now - playing.start, playing.shot.totalTime);
  drawShotAt(playing.index, elapsed);
  // Puffs: create each one when its moment comes, then animate it
  playing.effects.forEach(function (fx) {
    const age = (now - playing.start) - fx.e.time;
    if (age < 0) return;
    if (!fx.particles) fx.particles = makeParticles(fx.e);
    drawParticles(fx.particles, age);
  });
  if (elapsed < playing.shot.totalTime) {
    playing.frameId = requestAnimationFrame(frame);
  } else {
    finishShot();
  }
}

// Jump straight to the end of the shot (Leon, 24 Nov: skipping is allowed).
// During the hole-out (flag sway and dive into the cup), skipping goes straight to the results.
function skipShot() {
  if (!playing) return;
  cancelAnimationFrame(playing.frameId);
  if (playing.holeOut) {
    endHoleOut(false);
  } else {
    finishShot();
  }
}

function finishShot() {
  const done = playing.onDone;
  const index = playing.index;
  playing.effects.forEach(function (fx) { if (fx.particles) clearParticles(fx.particles); });
  playing = null;
  app.classList.remove("is-playing");
  nextButton.removeAttribute("aria-disabled");
  backButton.removeAttribute("aria-disabled");
  fadeTracer();
  placeBall(index + 1, true);
  done();
}

// Where is the ball "elapsed" milliseconds into a shot? Returns x, y on the ground,
// h = height above the ground, plus scale and opacity (used when it drops in the cup).
function ballAt(shot, elapsed) {
  let seg = shot.segments[0];
  for (let i = 0; i < shot.segments.length; i++) {
    if (elapsed >= shot.segments[i].startTime) seg = shot.segments[i];
  }
  const u = clamp((elapsed - seg.startTime) / seg.time, 0, 1);   // 0 = start of segment, 1 = end
  const state = { x: seg.to.x, y: seg.to.y, h: 0, scale: 1, opacity: 1, seg: seg, u: u };

  if (seg.type === "flight") {                     // used for full shots AND the small bounces
    const g = 1 - Math.pow(1 - u, 1.6);           // fast off the club, slower as it comes down
    state.x = lerp(seg.from.x, seg.to.x, g);
    state.y = lerp(seg.from.y, seg.to.y, g);
    state.h = seg.height * Math.sin(Math.PI * u);  // up and back down: an arc
  } else if (seg.type === "roll") {
    const e = seg.ease === "linear" ? u : seg.ease === "inOut" ? easeInOut(u) : easeOut(u);
    if (seg.bend) {                                // a putt that curves
      state.x = quadratic(seg.from.x, seg.bend.x, seg.to.x, e);
      state.y = quadratic(seg.from.y, seg.bend.y, seg.to.y, e);
    } else {
      state.x = lerp(seg.from.x, seg.to.x, e);
      state.y = lerp(seg.from.y, seg.to.y, e);
    }
    if (seg.hop && u < 0.3) state.h = seg.hop * Math.sin(Math.PI * u / 0.3);   // a little chip hop
  } else if (seg.type === "rim") {
    const angle = lerp(LIP_START_ANGLE, LIP_END_ANGLE, 1 - Math.pow(1 - u, 1.4));
    const p = pointOnRim(angle);
    state.x = p.x;
    state.y = p.y;
  } else if (seg.type === "drop") {
    state.scale = 1 - 0.6 * u;                     // shrinks and disappears into the cup
    state.opacity = 1 - u;
  }
  return state;
}

// Draws one moment of a shot: ball, camera, the trail so far and the tracer
function drawShotAt(index, elapsed) {
  const shot = SHOTS[index];
  const b = ballAt(shot, elapsed);
  drawBall(b.x, b.y, b.h, b.scale, b.opacity);
  setCamera(cameraDuringShot(index, elapsed / shot.totalTime, b));
  drawTrailLine(index, samplePath(shot, elapsed));
  if (b.seg.tracer) drawTracer(shot, b.seg, elapsed);
}

// Points along the ground path from the start of the shot up to "upTo" ms (for the dotted trail)
function samplePath(shot, upTo) {
  const points = [];
  const steps = 40;
  for (let k = 0; k <= steps; k++) {
    const p = ballAt(shot, upTo * k / steps);
    points.push(p.x.toFixed(1) + "," + p.y.toFixed(1));
  }
  return points.join(" ");
}

/*
  The hole-out (after the 10th shot drops):
    0–0.7 s   the flag sways
    0.7–1.6 s the camera dives into the cup (the cup fills the panel)
    then      the results scorecard rises up
  Skippable with a click or Enter. With reduced motion, the results appear straight away.
*/
function holeOut() {
  if (reducedMotion()) { showResults(false); return; }
  const start = performance.now();
  const from = lastCamera;
  playing = { holeOut: true, frameId: null };
  app.classList.add("is-playing");
  function step(now) {
    if (!playing) return;
    const t = now - start;
    if (t < 700) {
      const p = t / 700;
      swayFlag(8 * Math.sin(p * Math.PI * 3) * (1 - p));   // a few swings, getting smaller
    } else {
      const p = easeIn(clamp((t - 700) / 900, 0, 1));
      const fade = String(Math.max(0, 1 - clamp((t - 700) / 250, 0, 1)));
      swayFlag(0);
      // Everything except the cup fades in the first quarter of a second, so only the cup fills the view
      flagPin.style.opacity = fade;
      flagShadow.style.opacity = fade;
      trail.style.opacity = fade;
      markerList.style.opacity = fade;
      setCamera({
        cx: lerp(from.cx, CUP.x, easeOut(p)),
        cy: lerp(from.cy, CUP.y, easeOut(p)),
        span: from.span * Math.pow(5 / from.span, p)      // zooms in smoothly until the cup fills the view
      });
    }
    if (t < 1650) {
      playing.frameId = requestAnimationFrame(step);
    } else {
      endHoleOut(true);
    }
  }
  playing.frameId = requestAnimationFrame(step);
}

function endHoleOut(rise) {
  cancelAnimationFrame(playing.frameId);
  playing = null;
  app.classList.remove("is-playing");
  showResults(rise);
}

// Puts back everything the dive faded out (used when a new round starts)
function resetHoleLook() {
  swayFlag(0);
  [flagPin, flagShadow, trail, markerList].forEach(function (el) { el.style.opacity = ""; });
}


/* =========================================================
   8. THE CAMERA
   The camera is the SVG "viewBox": the part of the drawing that is visible.
   Phone: the camera follows the ball, zoomed out for long shots and closer for the putts.
   Laptop: the whole hole is visible, then the camera eases in to the green from shot 6.
   ========================================================= */
const svg = document.getElementById("hole");
const frameBox = document.getElementById("hole-frame");
let lastCamera = { cx: 300, cy: 500, span: 1010 };   // what the camera showed last (used by the dive)
let viewBox = { x: 0, y: 0, w: 600, h: 1000 };        // the exact visible area (used by the markers)

// Phone: how much of the drawing's height is visible at each spot (smaller = more zoomed in)
const PHONE_ZOOM = [300, 300, 280, 280, 280, 220, 160, 130, 110, 100, 100];

// Laptop: what the camera shows at each spot (centre x, centre y, visible height)
const WHOLE_HOLE = { cx: 300, cy: 500, span: 1010 };
const LAPTOP_VIEWS = [WHOLE_HOLE, WHOLE_HOLE, WHOLE_HOLE, WHOLE_HOLE, WHOLE_HOLE, WHOLE_HOLE,
  { cx: 318, cy: 232, span: 400 },
  { cx: 330, cy: 226, span: 300 }, { cx: 330, cy: 226, span: 300 },
  { cx: 330, cy: 226, span: 300 }, { cx: 330, cy: 226, span: 300 }];

function cameraAtSpot(spot) {
  if (isLaptop()) return LAPTOP_VIEWS[spot];
  const p = SPOTS[spot];
  return { cx: p.x, cy: p.y - PHONE_ZOOM[spot] * 0.1, span: PHONE_ZOOM[spot] };
}

function cameraDuringShot(index, t, ball) {
  const e = easeInOut(t);
  if (isLaptop()) {
    const a = LAPTOP_VIEWS[index], b = LAPTOP_VIEWS[index + 1];
    return { cx: lerp(a.cx, b.cx, e), cy: lerp(a.cy, b.cy, e), span: lerp(a.span, b.span, e) };
  }
  const span = lerp(PHONE_ZOOM[index], PHONE_ZOOM[index + 1], e);
  // follow the ball, keeping it a little below the middle so you can see where it's going
  return { cx: ball.x, cy: ball.y - ball.h * 0.5 - span * 0.1, span: span };
}

function setCamera(cam) {
  const box = frameBox.getBoundingClientRect();
  if (box.width === 0 || box.height === 0) return;   // the hole isn't on screen
  lastCamera = cam;
  const h = cam.span;
  const w = h * (box.width / box.height);
  let cx = cam.cx, cy = cam.cy;
  if (!isLaptop() && h > 20) {
    // keep the phone camera inside the drawing (not during the dive into the cup)
    cx = (w >= 760) ? 300 : clamp(cx, -80 + w / 2, 680 - w / 2);
    cy = clamp(cy, -10 + h / 2, 1010 - h / 2);
  }
  viewBox = { x: cx - w / 2, y: cy - h / 2, w: w, h: h };
  svg.setAttribute("viewBox", [viewBox.x, viewBox.y, w, h].map(function (n) { return n.toFixed(2); }).join(" "));
  positionMarkers(box);
}

// If the window changes size, keep the camera right
window.addEventListener("resize", function () {
  if (!playing && app.dataset.screen === "questions") setCamera(cameraAtSpot(current));
});


/* =========================================================
   9. ANSWER MARKERS ON THE HOLE (Leon, 24 Nov)
   After each shot, a small numbered marker stays where the ball came to rest.
   They are real buttons on top of the drawing: hover, focus or tap shows
   "2 · Budget: CHF 500–1,000". The hole becomes a record of your answers.
   ========================================================= */
const markerList = document.getElementById("markers");

// Rebuild the markers for every shot played so far. "newest" = the shot that just finished (it pops in).
function renderMarkers(shotsPlayed, newest) {
  markerList.innerHTML = "";
  for (let i = 0; i < Math.min(shotsPlayed, 9); i++) {   // shot 10 ends in the cup: no marker needed
    const q = QUESTIONS[i];
    const li = document.createElement("li");
    li.dataset.spot = i + 1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "marker" + (i + 1 === newest ? " is-new" : "");
    button.innerHTML = '<span aria-hidden="true">' + (i + 1) + '</span><span class="marker-tip"></span>';
    button.querySelector(".marker-tip").textContent = (i + 1) + " · " + q.short + ": " + describeAnswer(q);
    button.addEventListener("click", function (event) {
      if (playing) return;              // during a shot, a click skips the shot instead
      event.stopPropagation();
      const wasOpen = button.classList.contains("is-open");
      closeMarkers();
      button.classList.toggle("is-open", !wasOpen);   // tap to open, tap again to close
    });
    li.append(button);
    markerList.append(li);
  }
  positionMarkers();
}

function closeMarkers() {
  markerList.querySelectorAll(".is-open").forEach(function (m) { m.classList.remove("is-open"); });
}
document.addEventListener("click", function (event) {
  if (!event.target.closest(".marker")) closeMarkers();
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeMarkers();
});

// Moves each marker to where its spot is on screen (called every time the camera moves)
function positionMarkers(box) {
  box = box || frameBox.getBoundingClientRect();
  const placed = [];
  const nudges = [[0, 0], [16, -8], [-16, -8], [0, -18], [20, 6], [-20, 6], [0, 18]];   // fan out if markers overlap
  markerList.querySelectorAll("li").forEach(function (li) {
    const spot = SPOTS[Number(li.dataset.spot)];
    let x = (spot.x - viewBox.x) / viewBox.w * box.width;
    let y = (spot.y - viewBox.y) / viewBox.h * box.height;
    for (let k = 0; k < nudges.length; k++) {
      const nx = x + nudges[k][0], ny = y + nudges[k][1];
      if (placed.every(function (p) { return Math.hypot(p.x - nx, p.y - ny) > 22; })) { x = nx; y = ny; break; }
    }
    placed.push({ x: x, y: y });
    li.style.transform = "translate(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px)";
    li.classList.toggle("is-offscreen", x < 0 || y < 10 || x > box.width || y > box.height);
    li.classList.toggle("tip-left", x < 110);
    li.classList.toggle("tip-right", x > box.width - 110);
  });
}


/* =========================================================
   10. DRAWING HELPERS
   ========================================================= */
const ballBody = document.getElementById("ball-body");
const ballShadow = document.getElementById("ball-shadow");
const trail = document.getElementById("trail");
const tracer = document.getElementById("tracer");
const puffLayer = document.getElementById("spray");
const flagPin = document.getElementById("flag-pin");
const flagShadow = document.querySelector("#flag > line");   // the pin's shadow on the green

// Ball: the shadow stays on the ground; the ball rises above it and looks bigger when high
function drawBall(x, y, h, scale, opacity) {
  const lift = Math.min(h / 100, 1);
  ballShadow.setAttribute("cx", (x + 1).toFixed(1));
  ballShadow.setAttribute("cy", (y + 1.2).toFixed(1));
  ballShadow.setAttribute("rx", (4 * (1 - 0.35 * lift) * scale).toFixed(2));
  ballShadow.setAttribute("ry", (2.4 * (1 - 0.35 * lift) * scale).toFixed(2));
  ballShadow.setAttribute("fill-opacity", (0.3 * (1 - 0.5 * lift) * opacity).toFixed(2));
  ballBody.setAttribute("cx", x.toFixed(1));
  ballBody.setAttribute("cy", (y - h).toFixed(1));
  ballBody.setAttribute("r", (3.6 * (1 + 0.7 * lift) * scale).toFixed(2));
  ballBody.setAttribute("opacity", opacity.toFixed(2));
}

// Puts the ball at a spot with no animation (start, Back, reduced motion, after a shot),
// redraws the dotted trail and the answer markers for every shot played so far.
// afterShot = true when a shot has just finished (its marker pops in).
function placeBall(spot, afterShot) {
  const p = SPOTS[spot];
  drawBall(p.x, p.y, 0, 1, spot === 10 ? 0 : 1);   // spot 10 = in the cup, so hidden
  trail.innerHTML = "";
  for (let i = 0; i < spot; i++) {
    drawTrailLine(i, samplePath(SHOTS[i], SHOTS[i].totalTime));
  }
  resetHoleLook();
  renderMarkers(spot, afterShot ? spot : 0);
  setCamera(cameraAtSpot(spot));
}

// One dotted brass line per shot (the path played so far = visual progress)
function drawTrailLine(index, points) {
  let line = trail.querySelector('[data-shot="' + index + '"]');
  if (!line) {
    line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.dataset.shot = index;
    trail.append(line);
  }
  line.setAttribute("points", points);
}

// Tracer: a solid brass line that follows the ball through the air
function drawTracer(shot, seg, elapsed) {
  const steps = 24;
  const points = [];
  const end = Math.min(elapsed, seg.startTime + seg.time);
  for (let k = 0; k <= steps; k++) {
    const p = ballAt(shot, seg.startTime + (end - seg.startTime) * k / steps);
    points.push((k === 0 ? "M" : "L") + p.x.toFixed(1) + " " + (p.y - p.h).toFixed(1));
  }
  tracer.style.transition = "none";
  tracer.style.opacity = "0.9";
  tracer.setAttribute("d", points.join(""));
}

function fadeTracer() {
  tracer.style.transition = "opacity 0.6s ease";
  tracer.style.opacity = "0";
}

// Puffs: a few small particles that burst out and fade (about 0.6 s).
//   Bunker shots: sand thrown mostly in the direction of the shot.
//   Landings: a tiny puff all around the spot (green for turf, beige for sand).
const PUFF_COLOURS = { sand: ["#D3C29C", "#EADDBF"], turf: ["#8FA27A", "#B3C19A"] };

function makeParticles(e) {
  const dir = e.towards ? Math.atan2(e.towards.y - e.at.y, e.towards.x - e.at.x) : 0;
  const particles = [];
  for (let i = 0; i < e.count; i++) {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const size = e.landing ? 0.8 + Math.random() * 0.8 : (e.big ? 1.4 : 1.1) + Math.random() * (e.big ? 1.6 : 1);
    dot.setAttribute("r", size.toFixed(2));
    const colours = PUFF_COLOURS[e.kind];
    dot.setAttribute("fill", colours[Math.random() < 0.6 ? 0 : 1]);
    puffLayer.append(dot);
    const angle = e.landing ? Math.random() * Math.PI * 2 : dir + (Math.random() - 0.5) * 2.4;
    particles.push({
      el: dot, x: e.at.x, y: e.at.y,
      dx: Math.cos(angle), dy: Math.sin(angle),
      dist: e.landing ? 3 + Math.random() * 5 : (e.big ? 12 : 7) + Math.random() * (e.big ? 20 : 11),
      rise: e.landing ? 3 * Math.random() : (e.big ? 10 : 5) * Math.random()
    });
  }
  return particles;
}

function drawParticles(particles, age) {
  const p = Math.min(age / 600, 1);
  const out = easeOut(p);
  particles.forEach(function (s) {
    s.el.setAttribute("cx", (s.x + s.dx * s.dist * out).toFixed(1));
    s.el.setAttribute("cy", (s.y + s.dy * s.dist * out - s.rise * Math.sin(Math.PI * p)).toFixed(1));
    s.el.setAttribute("opacity", (1 - p).toFixed(2));
  });
}

function clearParticles(particles) {
  particles.forEach(function (s) { s.el.remove(); });
}

// The pin sways around the cup (angle in degrees; 0 = upright)
function swayFlag(angle) {
  flagPin.setAttribute("transform", "rotate(" + angle.toFixed(2) + " " + CUP.x + " " + CUP.y + ")");
}

// Small maths helpers
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t) { return t * t * t; }
function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function quadratic(a, c, b, t) { return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b; }
function unit(x, y) { const len = Math.hypot(x, y); return { x: x / len, y: y / len }; }
function pointOnRim(angle) { return { x: CUP.x + Math.cos(angle) * RIM, y: CUP.y + Math.sin(angle) * RIM }; }
function isLaptop() { return window.matchMedia("(min-width: 1024px)").matches; }
function reducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }


/* =========================================================
   11. START-UP
   ========================================================= */
resetAnswers();
showScreen("home");
