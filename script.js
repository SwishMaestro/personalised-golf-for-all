/*
  script.js = the LOGIC of the website (what happens when you click).
  Built by Claude (AI) for Leon, 24 Nov 2026. Plain JavaScript, no libraries.

  The questionnaire "plays one golf hole" (Leon's decision, docs/product-plan.md section 2):
  each answered question = one shot. 10 questions = 10 shots, and the 10th drops into the cup.

  Sections:
    1. The 10 questions (Leon's exact wording)    6. Next, Back, Skip
    2. The answers object                          7. Playing a shot (the animation)
    3. The 10 shots (where the ball goes, how)     8. The camera
    4. Screens (home, questions, results)          9. Drawing helpers (ball, trail, tracer, sand, flag)
    5. Showing a question                         10. Start-up

  Later (algorithm phase): FILTER -> SCORE -> RANK the irons, using the answers object.
*/


/* =========================================================
   1. THE 10 QUESTIONS
   Wording, help text and options copied exactly from docs/product-plan.md, section 3
   (all approved by Leon, 24 Nov). "value" is a short code the algorithm will use later.
   ========================================================= */
const QUESTIONS = [
  {
    id: "hand",
    text: "Are you right- or left-handed?",
    help: "The way you stand to the ball. Most right-handed people play right-handed.",
    options: [
      { value: "right", label: "Right" },
      { value: "left", label: "Left" }
    ]
  },
  {
    id: "budget",
    text: "What's your budget for a set of irons?",
    help: "For a full set, usually 6–7 irons (e.g. 5-iron to pitching wedge). New sets from big brands are often CHF 1,000–1,400 in Switzerland.",
    options: [
      { value: "under-500", label: "Under CHF 500" },
      { value: "500-1000", label: "CHF 500–1,000" },
      { value: "1000-1400", label: "CHF 1,000–1,400" },
      { value: "over-1400", label: "Over CHF 1,400" },
      { value: "no-limit", label: "No limit" },
      { value: "not-sure", label: "Not sure yet" }
    ]
  },
  {
    id: "used",
    text: "Would you buy used irons?",
    help: "Irons a few years old lose very little performance and can cost much less.",
    options: [
      { value: "new-only", label: "New only" },
      { value: "open-to-used", label: "Open to used" },
      { value: "not-sure", label: "Not sure" }
    ]
  },
  {
    id: "level",
    text: "What's your level?",
    help: "Your handicap shows your level. If you don't have one, choose Beginner or Not sure.",
    options: [
      { value: "beginner", label: "Beginner (no handicap)" },
      { value: "25-plus", label: "25+" },
      { value: "15-24", label: "15–24" },
      { value: "6-14", label: "6–14" },
      { value: "0-5", label: "0–5" },
      { value: "not-sure", label: "Not sure" }
    ]
  },
  {
    id: "play",
    text: "How much do you play, and how keen are you?",
    help: "This helps decide how much it's worth spending.",
    options: [
      { value: "few-times", label: "A few times a year" },
      { value: "regularly", label: "Regularly" },
      { value: "improving", label: "Seriously trying to improve" }
    ]
  },
  {
    id: "miss",
    text: "What's your most common bad iron shot?",
    help: "Fat = you hit the ground before the ball. Thin = you catch the ball low on the face and it flies low. Toe/heel = off the end of the face or near the shaft.",
    options: [
      { value: "fat", label: "Fat (ground first)" },
      { value: "thin", label: "Thin" },
      { value: "toe-heel", label: "Off the toe or heel" },
      { value: "slice-hook", label: "Slice or hook" },
      { value: "not-sure", label: "Not sure" }
    ]
  },
  {
    id: "flight",
    text: "How high do your irons fly?",
    help: "Some irons are built to launch the ball higher, which helps if your shots stay low.",
    options: [
      { value: "too-low", label: "Too low, hard to get up" },
      { value: "normal", label: "Normal" },
      { value: "too-high", label: "Too high" },
      { value: "not-sure", label: "Not sure" }
    ]
  },
  {
    id: "priority",
    text: "What matters most to you?",
    help: "Every iron is a trade-off. Pick the one thing you'd least like to give up.",
    options: [
      { value: "distance", label: "Distance" },
      { value: "forgiveness", label: "Forgiveness" },
      { value: "accuracy", label: "Control and accuracy" },
      { value: "feel", label: "Feel" },
      { value: "looks", label: "How it looks" },
      { value: "price", label: "Price" },
      { value: "not-sure", label: "Not sure" }
    ]
  },
  {
    id: "goal",
    text: "What's your goal?",
    help: "Easier irons help your scores now. There's no clear proof that harder irons make you improve faster.",
    options: [
      { value: "score-now", label: "Score better now" },
      { value: "long-term", label: "Improve my ball striking long term" },
      { value: "not-sure", label: "Not sure" }
    ]
  },
  {
    id: "measurements",
    type: "numbers",   // number boxes instead of options, plus a Skip button
    text: "Optional: height, wrist-to-floor, swing speed (if known)",
    help: "Only if you know them. Used for tips on lie, length and shaft, not to choose the iron.",
    fields: [
      { id: "heightCm", label: "Height (cm)" },
      { id: "wristToFloorCm", label: "Wrist-to-floor (cm)" },
      { id: "driverSpeedMph", label: "Driver swing speed (mph)", hint: "Only if you've measured it on a launch monitor" }
    ]
  }
];


/* =========================================================
   2. THE ANSWERS OBJECT
   Every answer is stored here, e.g. answers.level = "15-24".
   answers.measurements is either { heightCm, wristToFloorCm, driverSpeedMph } or "skipped".
   No scoring yet: the algorithm will read this object later.
   ========================================================= */
let answers = {};

function resetAnswers() {
  answers = {};
  QUESTIONS.forEach(function (q) { answers[q.id] = null; });
}


/* =========================================================
   3. THE 10 SHOTS
   The ball has 11 spots (in the drawing's coordinates, 600 wide x 1000 tall):
   0 = tee ... 10 = in the cup. Shot 1 goes from spot 0 to spot 1, and so on.
   Pressing Next on question 3 plays shot 3.
   ========================================================= */
const CUP = { x: 352, y: 222 };   // must match the cup in the drawing (index.html)
const RIM = 6;                    // radius of the cup's rim, used for the lip-out

const SPOTS = [
  { x: 300, y: 938 },   // 0  tee
  { x: 250, y: 700 },   // 1  drive lands on the fairway
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

/*
  Each shot is made of "segments" played one after another:
    flight = the ball flies in an arc (height = how high it rises, in drawing units)
    roll   = the ball rolls along the ground and slows down (bend = a curve, hop = a small bounce at the start)
    rim    = the ball circles the rim of the cup (lip-out)
    drop   = the ball drops into the cup
  "time" is in milliseconds. Every shot is under 1.5 seconds (Leon, 24 Nov).
  "label" is shown on the hole BEFORE the shot is played, e.g. "Shot 3 · Fairway bunker".
*/
const SHOTS = [
  { label: "Drive",
    segments: [{ type: "flight", to: SPOTS[1], time: 1400, height: 95, tracer: true }] },
  { label: "Fairway wood",
    segments: [{ type: "flight", to: { x: 230, y: 566 }, time: 1000, height: 70, tracer: true },
               { type: "roll", to: SPOTS[2], time: 450 }] },
  { label: "Fairway bunker", spray: 6,
    segments: [{ type: "flight", to: SPOTS[3], time: 900, height: 26 }] },
  { label: "Layup",
    segments: [{ type: "flight", to: SPOTS[4], time: 1100, height: 55, tracer: true }] },
  { label: "Approach",
    segments: [{ type: "flight", to: SPOTS[5], time: 1200, height: 65, tracer: true }] },
  { label: "Greenside bunker", spray: 14,
    segments: [{ type: "flight", to: SPOTS[6], time: 1000, height: 34 }] },
  { label: "Chip from the fringe",
    segments: [{ type: "roll", to: SPOTS[7], time: 1100, hop: 5 }] },
  { label: "Long putt",
    segments: [{ type: "roll", to: SPOTS[8], time: 1400, bend: { x: 318, y: 244 } }] },
  { label: "Lip-out",
    segments: [{ type: "roll", to: LIP_ENTRY, time: 450, ease: "linear" },
               { type: "rim", to: LIP_EXIT, time: 700 },
               { type: "roll", to: SPOTS[9], time: 300 }] },
  { label: "Tap-in",
    segments: [{ type: "roll", to: CUP, time: 350, ease: "inOut" },
               { type: "drop", to: CUP, time: 300 }] }
];

// Fill in where each segment starts and the total time of each shot
SHOTS.forEach(function (shot, i) {
  let from = SPOTS[i];
  let total = 0;
  shot.segments.forEach(function (seg) {
    seg.from = from;
    seg.startTime = total;
    total += seg.time;
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
  window.scrollTo(0, 0);
}

function startQuestionnaire() {
  resetAnswers();
  current = 0;
  showScreen("questions");
  placeBall(0);
  showQuestion(0);
}

function showResults() {
  // PLACEHOLDER: list the saved answers so Leon can check them while testing
  const list = document.getElementById("answers-list");
  list.innerHTML = "";
  QUESTIONS.forEach(function (q) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = q.text;
    dd.textContent = describeAnswer(q);
    row.append(dt, dd);
    list.append(row);
  });
  showScreen("results");
  document.getElementById("results-title").focus();
}

// Turns a stored answer back into readable text for the results list
function describeAnswer(q) {
  const value = answers[q.id];
  if (q.type === "numbers") {
    if (!value || value === "skipped") return "Skipped";
    return q.fields.map(function (f) {
      return f.label + ": " + (value[f.id] === null ? "–" : value[f.id]);
    }).join(", ");
  }
  const option = q.options.find(function (o) { return o.value === value; });
  return option ? option.label : "–";
}


/* =========================================================
   5. SHOWING A QUESTION
   ========================================================= */
const qBody = document.getElementById("q-body");
const nextButton = document.getElementById("next-button");
const backButton = document.getElementById("back-button");
const skipButton = document.getElementById("skip-button");

function showQuestion(index) {
  const q = QUESTIONS[index];
  current = index;

  // "Question X of 10" (always shown as text) and the shot label on the hole
  document.getElementById("q-number").textContent = index + 1;
  document.getElementById("shot-label").innerHTML =
    '<span class="num">Shot ' + (index + 1) + "</span> · " + SHOTS[index].label;

  // Build the question: a fieldset with the question as its legend, help text, then the answers
  qBody.innerHTML = "";
  const fieldset = document.createElement("fieldset");
  fieldset.setAttribute("aria-describedby", "q-help");
  fieldset.innerHTML =
    '<legend><h2 class="q-title" id="q-title" tabindex="-1"></h2></legend>' +
    '<p class="hint" id="q-help"></p>';
  fieldset.querySelector("#q-title").textContent = q.text;
  fieldset.querySelector("#q-help").textContent = q.help;

  if (q.type === "numbers") {
    fieldset.append(buildNumberFields(q));
  } else {
    fieldset.append(buildOptions(q));
  }
  qBody.append(fieldset);

  skipButton.hidden = (q.type !== "numbers");
  updateNextButton();

  // Fade the new question in (CSS does nothing if reduced motion is on)
  qBody.classList.remove("is-waiting");
  qBody.classList.add("is-entering");
  void qBody.offsetWidth;   // makes the browser notice the class before it is removed
  qBody.classList.remove("is-entering");

  // Accessibility: move focus to the question and announce "Question X of 10"
  document.getElementById("q-title").focus({ preventScroll: true });
  const announcer = document.getElementById("announcer");
  announcer.textContent = "";
  setTimeout(function () { announcer.textContent = "Question " + (index + 1) + " of 10"; }, 60);
}

// Radio buttons inside labels (the whole card can be clicked)
function buildOptions(q) {
  const box = document.createElement("div");
  box.className = "options";
  if (q.options.length >= 5) box.classList.add("compact");   // 2 columns on small phones
  q.options.forEach(function (opt) {
    const label = document.createElement("label");
    label.className = "option";
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
document.getElementById("start-button").addEventListener("click", startQuestionnaire);
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
  showQuestion(current - 1);
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
  qBody.classList.add("is-waiting");   // dim the question while the shot plays

  // Phone: make sure the hole band is visible before the shot starts
  if (!isLaptop() && window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  }

  playShot(shotIndex, function () {
    if (shotIndex < QUESTIONS.length - 1) {
      showQuestion(shotIndex + 1);
    } else {
      holeOut();   // the 10th shot dropped in: flag sways, short pause, then results
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

  // Reduced motion: no flight, spray or camera move. The ball just appears at its new spot.
  if (reducedMotion()) {
    placeBall(index + 1);
    onDone();
    return;
  }

  playing = { index: index, shot: shot, start: performance.now(), onDone: onDone, frameId: null, particles: [] };
  app.classList.add("is-playing");
  nextButton.setAttribute("aria-disabled", "true");
  backButton.setAttribute("aria-disabled", "true");
  if (shot.spray) playing.particles = makeSpray(SPOTS[index], shot.segments[0].to, shot.spray);
  playing.frameId = requestAnimationFrame(frame);
}

function frame(now) {
  if (!playing) return;
  const elapsed = Math.min(now - playing.start, playing.shot.totalTime);
  drawShotAt(playing.index, elapsed);
  drawSpray(playing.particles, now - playing.start);
  if (elapsed < playing.shot.totalTime) {
    playing.frameId = requestAnimationFrame(frame);
  } else {
    finishShot();
  }
}

// Jump straight to the end of the shot (Leon, 24 Nov: skipping is allowed).
// During the flag sway after the last shot, skipping goes straight to the results.
function skipShot() {
  if (!playing) return;
  cancelAnimationFrame(playing.frameId);
  if (playing.holeOut) {
    endHoleOut();
  } else {
    finishShot();
  }
}

function finishShot() {
  const done = playing.onDone;
  const index = playing.index;
  clearSpray(playing.particles);
  playing = null;
  app.classList.remove("is-playing");
  nextButton.removeAttribute("aria-disabled");
  backButton.removeAttribute("aria-disabled");
  fadeTracer();
  placeBall(index + 1);
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

  if (seg.type === "flight") {
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
  const steps = 32;
  for (let k = 0; k <= steps; k++) {
    const p = ballAt(shot, upTo * k / steps);
    points.push(p.x.toFixed(1) + "," + p.y.toFixed(1));
  }
  return points.join(" ");
}

// The 10th shot is in: the flag sways, short pause, then the results screen
function holeOut() {
  if (reducedMotion()) { showResults(); return; }
  const start = performance.now();
  playing = { holeOut: true, frameId: null };
  app.classList.add("is-playing");
  function sway(now) {
    if (!playing) return;
    const p = Math.min((now - start) / 1000, 1);
    swayFlag(8 * Math.sin(p * Math.PI * 3) * (1 - p));   // a few swings, getting smaller
    if (now - start < 1450) {
      playing.frameId = requestAnimationFrame(sway);
    } else {
      endHoleOut();
    }
  }
  playing.frameId = requestAnimationFrame(sway);
}

function endHoleOut() {
  cancelAnimationFrame(playing.frameId);
  playing = null;
  app.classList.remove("is-playing");
  swayFlag(0);
  showResults();
}


/* =========================================================
   8. THE CAMERA
   The camera is the SVG "viewBox": the part of the drawing that is visible.
   Phone: the camera follows the ball, zoomed out for long shots and closer for the putts.
   Laptop: the whole hole is visible, then the camera eases in to the green from shot 6.
   ========================================================= */
const svg = document.getElementById("hole");
const frameBox = document.getElementById("hole-frame");

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
  const h = cam.span;
  const w = h * (box.width / box.height);
  let cx = cam.cx, cy = cam.cy;
  if (!isLaptop()) {
    // keep the phone camera inside the drawing
    cx = (w >= 760) ? 300 : clamp(cx, -80 + w / 2, 680 - w / 2);
    cy = clamp(cy, -10 + h / 2, 1010 - h / 2);
  }
  svg.setAttribute("viewBox", [cx - w / 2, cy - h / 2, w, h].map(function (n) { return n.toFixed(1); }).join(" "));
}

// If the window changes size, keep the camera right
window.addEventListener("resize", function () {
  if (!playing && app.dataset.screen === "questions") setCamera(cameraAtSpot(current));
});


/* =========================================================
   9. DRAWING HELPERS
   ========================================================= */
const ballBody = document.getElementById("ball-body");
const ballShadow = document.getElementById("ball-shadow");
const trail = document.getElementById("trail");
const tracer = document.getElementById("tracer");
const spray = document.getElementById("spray");
const flagPin = document.getElementById("flag-pin");

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

// Puts the ball at a spot with no animation (start, Back, reduced motion, after a shot)
// and redraws the dotted trail for every shot played so far.
function placeBall(spot) {
  const p = SPOTS[spot];
  drawBall(p.x, p.y, 0, 1, spot === 10 ? 0 : 1);   // spot 10 = in the cup, so hidden
  trail.innerHTML = "";
  for (let i = 0; i < spot; i++) {
    drawTrailLine(i, samplePath(SHOTS[i], SHOTS[i].totalTime));
  }
  swayFlag(0);
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

// Sand spray: a few sand-coloured dots burst out of the bunker and fade (about 0.6 s)
function makeSpray(from, towards, count) {
  const dir = Math.atan2(towards.y - from.y, towards.x - from.x);
  const big = count > 8;
  const particles = [];
  for (let i = 0; i < count; i++) {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("r", ((big ? 1.4 : 1.1) + Math.random() * (big ? 1.6 : 1)).toFixed(2));
    dot.setAttribute("fill", Math.random() < 0.6 ? "#D3C29C" : "#EADDBF");   // darker sand so it shows on light grass
    spray.append(dot);
    const angle = dir + (Math.random() - 0.5) * 2.4;   // mostly in the direction of the shot
    particles.push({
      el: dot, x: from.x, y: from.y,
      dx: Math.cos(angle), dy: Math.sin(angle),
      dist: (big ? 12 : 7) + Math.random() * (big ? 20 : 11),
      rise: (big ? 10 : 5) * Math.random()
    });
  }
  return particles;
}

function drawSpray(particles, elapsed) {
  const p = Math.min(elapsed / 600, 1);
  const out = easeOut(p);
  particles.forEach(function (s) {
    s.el.setAttribute("cx", (s.x + s.dx * s.dist * out).toFixed(1));
    s.el.setAttribute("cy", (s.y + s.dy * s.dist * out - s.rise * Math.sin(Math.PI * p)).toFixed(1));
    s.el.setAttribute("opacity", (1 - p).toFixed(2));
  });
}

function clearSpray(particles) {
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
function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function quadratic(a, c, b, t) { return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b; }
function unit(x, y) { const len = Math.hypot(x, y); return { x: x / len, y: y / len }; }
function pointOnRim(angle) { return { x: CUP.x + Math.cos(angle) * RIM, y: CUP.y + Math.sin(angle) * RIM }; }
function isLaptop() { return window.matchMedia("(min-width: 1024px)").matches; }
function reducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }


/* =========================================================
   10. START-UP
   ========================================================= */
resetAnswers();
showScreen("home");
