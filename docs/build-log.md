# Build log

Newest entries at the top. Format and rules: see CLAUDE.md, section 3.

## 2026-11-24 — Home page: option 1 "D, refined" is now the real home page (experiments branch)
- What changed:
  - index.html: the temporary home screen is replaced by option 1 from design/home-1.html: sticky navigation bar (section links on laptop, Start button), photo hero with Leon's headline and line, How it works in 3 steps, the example result card ("Example Iron A", marked as a placeholder), Why you can trust it (sources next to every fact; "Free · No sign-up · No ads"), About this project and a footer with all sources. The About main text is a clearly marked placeholder for Leon to write. The hole drawing's patterns moved into a small shared hidden SVG and its course layers are grouped as "hole-art", so the About section shows the same drawing without a second copy.
  - style.css: home page styles (section 6), navigation bar, light and small button versions.
  - script.js: all Start buttons (navigation bar, hero, footer) start the questionnaire; header links go back to the home page section from the question screens; home sections fade in on scroll (not with reduced motion).
- Tested at 375 × 740 and 1440 × 900, with reduced motion: no sideways scrolling, no console errors, every Start button works, Back on question 1 returns home, the full round still reaches the scorecard.
- Why: Leon chose option 1 (reason: Leon to add)
- Decided by: Leon
- Source: home page facts as listed in the footer (docs/research-notes.md)
- Criterion: design, R-i, U3
- Still open: caddie's notes stay "Draft" until Leon sends his wording; About text by Leon.

## 2026-11-24 — Questionnaire upgrades: one connected experience (Part 4, experiments branch)
- What changed:
  - script.js: ball physics (each full shot lands, takes 1–2 small bounces and rolls out; tiny turf puff on fairway landings, sand puff in bunkers; every shot still ≤1.5 s). Numbered answer markers stay where each shot came to rest; hover, keyboard focus or tap shows e.g. "2 · Budget: CHF 500–1,000". The question card eases towards the hole when Next is pressed and the next card arrives from the other side; the card header shows "Shot X · …" with a line icon of the club (driver, wood, iron, wedge, putter). Caddie's note ("why we ask", closed by default) on questions 2–10 with the source from product-plan.md section 3; all 10 wordings are SUGGESTIONS drafted by Claude from Leon's research notes and show a "Draft" tag until Leon approves them. After the tap-in the flag sways, the camera dives into the cup and the results placeholder rises up as a scorecard; skippable with a click or Enter.
  - index.html: question card wrapper and header, cloud-shadow layer, marker layer, scorecard table on the results placeholder; the shot label moved off the hole into the card.
  - style.css: card and its motion, club icon, caddie's note, flag wave and drifting cloud shadows (both very faint), markers and labels, scorecard; reduced motion turns all movement off.
- Accessibility (U3): markers are real buttons with their text as the name; focus stays on Next during a shot and then moves to the new question; Escape closes marker labels. Tested at 375 × 667 and 1440 × 900 incl. reduced motion and real Tab key presses: no sideways scrolling, no console errors.
- Why: make the hole and the questions feel like one experience, more connected and entertaining but never overpowering; the questions and information come first (Leon). No "no tracking" claim because the site loads Google Fonts (Leon).
- Decided by: Leon (all six upgrades, iron icon, label in the card only, marker names, no caddie's note on Q1); details suggested by Claude, approved by Leon. Caddie's note wording: Leon to approve.
- Source: caddie's notes from docs/research-notes.md, sources as in product-plan.md section 3
- Criterion: U1, U2, U3, R-i, design

## 2026-11-24 — Three home page options (Part 2, experiments branch)
- What changed: added design/home-1.html ("D, refined": design D taken further, editorial numbered sections), design/home-2.html ("Product story": huge type, one idea per screen, scroll reveals, sources as footnotes; inspired by product pages like Apple's) and design/home-3.html ("Modern product": dark hero with a preview of the questionnaire, crisp cards with pointer highlights; inspired by sites like Linear and Stripe), and listed them in design/index.html. Each has a nav, hero with Leon's headline and line, Start, How it works in 3 steps, a result card preview ("Example Iron A", marked as a placeholder), Why you can trust it (every fact sourced; "Free, no sign-up, no ads"), About this project (draft text, Åberg/Crans-sur-Sierre teaser with the hole drawing) and a footer with sources. index.html not changed.
- Why: the home page should look like a real, professional website, not be built around the hole (Leon)
- Decided by: Leon (sections, three directions, wording changes); designs by Claude, for Leon to choose
- Source: facts from docs/research-notes.md (Covey 2025, Summitt 2026, Today's Golfer 2026, Stachura 2026, Wunder 2026, Saternus 2018, Ferguson 2026, ASQ, Felfernig et al. 2015, PGA Tour 2023, Leon's Swiss price check)
- Criterion: design, R-i

## 2026-11-24 — Questionnaire works: playing the hole shot by shot (Part 1)
- What changed:
  - script.js (rewritten): the 10 questions with Leon's exact wording, help text and options (product-plan.md section 3); all answers saved in one `answers` object (no scoring yet); Next (disabled until an answer is chosen), Back (ball returns to its previous spot without replaying the shot), Skip on question 10. Each Next plays one shot (all under 1.5 s): 1 drive with a brass tracer, 2 fairway wood that rolls into a fairway bunker, 3 bunker escape with a little sand spray, 4 layup, 5 approach into a greenside bunker, 6 splash shot with a bigger spray onto the fringe, 7 chip, 8 curving long putt, 9 lip-out round the rim, 10 tap-in, then the flag sways and the results placeholder appears. A shot can be skipped by clicking/tapping the hole or pressing Enter/Space. Camera: on phones it follows the ball (closer on the green); on laptops it shows the whole hole and eases in to the green from shot 6. Label "Shot X · ..." on the hole; no score anywhere.
  - index.html: the hole now only appears on question screens; temporary simple home page (until Leon chooses a home design); question screen, results placeholder (lists the saved answers for testing). Drawing: soft rounded trees, green about 20% bigger, new layers for the tracer and sand spray.
  - style.css: question screen (options, 2 compact columns for 5+ options on phones under 420px, number fields), shot label, results placeholder, reduced motion.
- Accessibility (U3): "Question X of 10" always shown as text; real radio buttons and labels; focus moves to each new question; aria-live announces "Question X of 10"; the drawing is hidden from screen readers; with reduced motion the ball simply appears at its new spot. Tested at 375 × 667 and 1440 × 900: no sideways scrolling, no console errors.
- Why: "The site doesn't feel like a real website yet, and there are no questions." The hole should be only for the questionnaire and feel like playing it shot by shot (Leon). Skip a shot: Leon to add.
- Decided by: Leon (shot list, labels incl. "Lip-out", skipping, hole only on question screens); animation details suggested by Claude, approved by Leon
- Source: questions from docs/product-plan.md section 3 (Leon's sources listed there); hole inspired by the 15th at Crans-sur-Sierre (PGA Tour/AP, 3 Sept 2023)
- Criterion: U1, U3, design

## 2026-11-24 — Questionnaire step 1: hole illustration, layout and home screen
- What changed: index.html (replaced skeleton: header, original SVG drawing of a par-5 hole inspired by the 15th at Crans-sur-Sierre, home screen with Leon's headline and line, inspiration credit linked to PGA Tour), style.css (design D colours and fonts as variables; phone and laptop layout). Shapes drawn with a helper script kept outside the project.
- Why: a Swiss course near where Leon lives, a Swedish player like his family's roots, and a par 5 gives enough "shots" for 10 questions (Leon, product-plan.md section 2)
- Decided by: Leon (hole idea, caption, headline); drawing and layout suggested by Claude, approved by Leon
- Source: PGA Tour/AP, 3 Sept 2023 (Åberg's shot); PGA.com (Alps view); no distances stated
- Criterion: design, U3

## 2026-11-11 — Design direction chosen: C (Morning Round), mixed with parts of A and B
- What changed: Leon chose Direction C as the base for the look. Added design/d-chosen.html, a test page of the mix (home, one question screen, one result card), and added it to design/index.html. index.html not changed yet.
  - Kept from C: full-width photo opening, light serif (Cormorant Garamond), stone/sage colours, gentle fades.
  - From A: small numbers and labels (No. 01, 01 Answer / 02 Compare / 03 Try), thin ruled lines, result card layout ("You answered" tags, numbered reasons, trade-off, dark "Before you buy" box, small sources).
  - From B: 3-card fan-out for the shortlist (calmer), segmented progress bar, result parts appearing in order, small brass accent, round arrow button.
- Why: "It's the most pleasing to look at — it feels calm, premium, trustworthy and like being out on a golf course." (Leon)
- Decided by: Leon (choice of C and of the parts to borrow); mix built by Claude
- Source: none, design choice. Reference sites: tengilemalamala.com (C), brandonyasin.com (A), moto-card.com (B)
- Criterion: design

## 2026-11-10 — Three design directions made as test pages
- What changed: added a design/ folder with three test pages, each showing the home page, one question screen and one result card with placeholder content: a-yardage-book.html (A, editorial, from brandonyasin.com), b-members-card.html (B, bold and premium, from moto-card.com), c-morning-round.html (C, calm and photo-led, from tengilemalamala.com), plus design/index.html linking them. Placeholder golf facts are taken from Johnson (Golf Digest, 2026) and Covey (MyGolfSpy, 2025) with sources shown. index.html not changed.
- Why: Leon to add (Phase 1 step in docs/roadmap.md: compare 3 directions before choosing)
- Decided by: suggested by Claude, approved by Leon
- Source: none, design choice
- Criterion: design

## 2026-11-08 — Roadmap and research notes added
- What changed: added docs/roadmap.md (5 build phases with dates and what Leon decides in each), docs/research-notes.md (copy of Leon's Google Doc research notes so Claude Code can cite sources), and pointed CLAUDE.md to both.
- Why: Leon to add
- Decided by: suggested by Claude, approved by Leon
- Source: none, planning
- Criterion: setup

## 2026-11-08 — Empty website skeleton and project brief
- What changed: created index.html (4 empty pages), style.css (starting colours as variables), script.js (Start button only, notes on the 3 algorithm stages), data/irons.json (empty), CLAUDE.md (brief for Claude Code), this build log.
- Why: Leon to add
- Decided by: suggested by Claude, approved by Leon
- Source: none, setup
- Criterion: setup

## 2026-11-08 — Tools set up
- What changed: GitHub repository created and published (public, for GitHub Pages). VS Code installed with the Claude Code extension (Opus, High effort, Manual mode) and Live Server. Claude Code was set to a local qwen2.5-coder model and was switched to Opus.
- Why: Leon to add
- Decided by: Leon, after comparing options with Claude (website builders, AI site builders, coding with Claude + GitHub Pages)
- Source: none, setup
- Criterion: setup
