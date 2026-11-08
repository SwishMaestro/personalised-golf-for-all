# Personalised Golf for All — project brief for Claude

> Written by Claude (AI) on 8 Nov 2026 at Leon's request, from his research notes,
> report and earlier planning. Leon reads and edits this file; his edits win.

## 1. What this project is

My (Leon's) **MYP Personal Project**, Year 11, Ecolint Campus des Nations.

**Product:** a mobile-friendly website where recreational golfers answer a short
questionnaire and get a **personalised shortlist of irons**. Each recommendation shows:
- at least two reasons linked to the golfer's own answers
- a relevant trade-off
- a clear limitation or next step (for example: try it at a fitting or demo)

No promises of improved performance. When nothing fits, the site says so honestly
and explains why, instead of forcing a result.

**Learning goal:** to learn how golfers' characteristics and iron specifications
affect equipment suitability, and how to evaluate evidence to make informed
iron-selection decisions.

The tool is an **alternative starting point, not a replacement for a fitting.** Its main
job is to help golfers narrow down where they sit among iron types and models.

## 2. Roles: how we work (read this first)

- **I am the director.** I make every decision about content, design and logic.
  You propose options, explain them, and I choose. Do not decide for me.
- **Never invent golf content.** No questions, rules, scores, weights or club data
  without a source from my research. If you suggest something without a source, label
  it clearly: `SUGGESTION (no source yet)`.
- **Explain every change in plain English:** what it does, why, and which file and lines.
  I must be able to explain all of the code to my supervisor.
- **Small steps.** One feature or one decision at a time. Show the result, then wait.
- **Ask before** deleting anything, renaming files, adding a library, or changing the
  file structure.
- **Teach me.** For simple HTML/CSS changes, show me how so I can do it myself next time.
- **Never write my report, process journal or reflections.** That writing must be mine.
  You may give facts or prompts, clearly labelled as AI.
- If my request conflicts with the success criteria, a source, or accessibility,
  tell me plainly before doing it.

## 2b. Aim for the best possible website

- **Give your full effort every time.** Treat this as a portfolio-quality website, not a
  school exercise. Think carefully, check your own work, and test it at phone and laptop
  width before saying it's done.
- **Be proactive with ideas.** After each task, suggest **up to 3 improvements** that would
  genuinely make the website better (design, usability, accuracy or performance). For each:
  what it is, why it helps, and which criterion it serves (R-i, R-ii, R-iii, U1-U3, or design).
- **Always check with me first.** Never build a suggestion until I say yes.
- **Be honest.** If something I ask for would make the website worse, harder to use, or less
  accurate, tell me plainly and explain why, then let me decide.
- **Plans can change.** I'm allowed to change my mind, the design or the order of work as
  the project develops. When I do, adapt, and record the change and my reason
  (or "Leon to add") in the build log.
- **Quality bar before calling anything finished:** works on phone and laptop, keyboard
  usable, readable contrast, no clipped text, no console errors, respects reduced motion,
  and looks deliberate rather than templated.

## 3. Build log (required after every change)

After each change I accept, add an entry at the TOP of `docs/build-log.md`:

```
## YYYY-MM-DD — short title
- What changed: (files, in plain English)
- Why: (the reason I gave, or "Leon to add")
- Decided by: Leon / suggested by Claude, chosen by Leon
- Source: (research source, or "none, design choice")
- Criterion: (R-i, R-ii, R-iii, U1, U2, U3, or design)
```

Keep it factual. Do not write my reasons for me. If I didn't give one, write "Leon to add".
This log is how my other Claude chat and my process journal keep track of the build.

**Commit messages:** suggest one, but I write the final message myself in GitHub Desktop.

## 4. Success criteria (from my report — the product is judged on these)

**Recommendation quality (R)**
- **R-i** Accurate, sourced information. Every spec and factual claim is traceable to a
  source or manufacturer claim. The tool's own interpretation is clearly marked as such.
- **R-ii** Recommendations justified by the golfer's answers and constraints. Unusual or
  incomplete profiles get a sensible result or a clear explanation of why not.
- **R-iii** Every recommendation has at least two reasons linked to the answers, a
  trade-off, and a limitation or next step, with no unsupported promises.

**Usability (U)**, tested with 5 testers
- **U1** At least 4 of 5 complete the questionnaire and reach results without help.
- **U2** At least 4 of 5 can explain a recommendation reason and a limitation in their own words.
- **U3** The full process works on phone and laptop: readable text, labelled inputs,
  keyboard-operable controls, no clipped content.

**Looks** are not scored, but they matter a lot to me (see section 5).

## 5. Design direction (my decisions so far)

- **Base style "Clubhouse":** deep green and cream, serif headlines. Mixed with some of
  the clean, easy-to-read feel of the "Clean sport" style.
- **It must NOT look generic or AI-made.** The aim is award-winning-website quality:
  considered typography, spacing, motion and detail.
- **Reference sites I like:** brandonyasin.com (minimal, editorial, numbered sections),
  moto-card.com (premium, bold type, smooth motion), tengilemalamala.com (calm, luxurious,
  large photography).
- **Pages:** Home → Questions (one per screen, progress bar) → Results → How it works
  (sources, method, limits).
- I will add **my own photos** later. Never use manufacturer images.
- Motion should explain something, not just decorate. Always respect `prefers-reduced-motion`.
- The final look is still open. I want to review and redesign it step by step.

## 6. Algorithm (structure agreed; details are mine to decide)

1. **Filter:** remove irons that can never fit (budget, handedness, new/used).
2. **Score:** answers add points to iron categories or models. Every rule must link to
   a source.
3. **Rank and explain:** show the top 3. Each rule that added points also adds its
   reason sentence to the result, so explanations come from the rules, never invented.

Undecided: exact questions, weights, branching (questions that depend on earlier
answers), and how to handle "I don't know" answers.

Background sources for this (in my research notes): Felfernig et al., "Constraint-Based
Recommender Systems" (2015); ASQ, "What Is a Decision Matrix?"; Google for Developers,
"Content-Based Filtering".

## 7. Findings from my research so far

Full notes: Google Doc "Research notes - PP - Leon". Summaries below are from my notes.

- **Johnson, E. Michael. "'Easy-To-Hit' Clubs Might Not Be the Fix for Your Iron Game."
  Golf Digest, 2026.** Ask about the golfer's usual miss (low shots, slices, chunks) to choose
  between game-improvement (GI, helps mishits) and super game-improvement (SGI, mainly helps
  launch). Don't automatically send weaker players to the most forgiving iron. Suggest a
  fitting or demo as an option, not every time. A small "tips" section is possible, but the
  main goal is narrowing down the right type of iron.
- **Bishop, Phillip. "Best Player's Distance Irons of 2026" and "Best Game-Improvement Irons
  of 2026." MyGolfSpy.** Tested models with data (20 players distance irons). Personalised
  weighting of priorities: price, best regardless of price, distance, feel, or a mix.
- **Covey, Tony. "Game-Improvement vs. Players Distance Irons." MyGolfSpy, 2025.** GI and
  players distance (PD) are blending. Golfers around 5–15 handicap increasingly move to PD.
  GI: bigger heads, more offset, low centre of gravity, wider soles, higher launch. I need to
  explain the overlap or draw my own line. Price ranges: GI about $799–1,299 per set,
  PD about $999–1,499.
- **Ferguson, Joe. "Best Budget Irons 2026." Golf Monthly.** Budget irons give up less than
  expected (Takomo 101 matched major brands on ball speed and distance). What you lose is
  mostly feel, finish durability, and the chance to try or be fitted first. Include budget
  options, especially for beginners and tight budgets. Warn that online-only brands can't be
  tried first, and suggest checking lie and length. Possible option for golfers who want to
  improve their skill, who might start with less forgiving clubs.

Still open in my research: specs to record per iron (Hireko engineering guide), lie angle,
fitting, used and older models, and the algorithm questions above.

## 8. Tech rules

- Plain **HTML, CSS and JavaScript**. No frameworks, no build step, no backend, no accounts.
- Hosted free on **GitHub Pages** from the `main` branch.
- **Files:**
  - `index.html`: page structure
  - `style.css`: look (colours and fonts as variables at the top)
  - `script.js`: logic and algorithm
  - `data/irons.json`: club database (fields to be decided by me)
  - `docs/build-log.md`: build log
- **Mobile first.** Test at phone width (about 375px) and laptop width.
- **Accessibility:** real `<button>` and `<label>` elements, visible keyboard focus,
  good colour contrast, readable font sizes.
- **Privacy:** no tracking, cookies, analytics or data collection.
- **Fonts:** Google Fonts are OK, with a fallback font.
- Write clear comments in the code so I can follow it.

## 9. Status and deadlines

- **8 Nov 2026:** setup done (GitHub repo, VS Code, Live Server). Empty skeleton created.
  Next: design the look with me, then the questionnaire from my research.
- **Final success criteria due:** 22 Nov 2026
- **Product complete:** 6 Dec 2026
- **Testing:** 5 testers in the last week, then fix and retest.

Plan: look → questionnaire → algorithm → iron database → testing.
