# Build log

Newest entries at the top. Format and rules: see CLAUDE.md, section 3.

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
