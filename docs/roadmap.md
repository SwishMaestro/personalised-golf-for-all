# Roadmap: how the website gets built

> Drafted by Claude (AI) on 8 Nov 2026. Leon decides; this plan can change.
> Product complete: 6 Dec 2026. Final success criteria due: 22 Nov 2026.

## Every session (the routine)
1. Tell Claude Code what we're working on today (one phase step at a time).
2. Claude Code proposes; Leon accepts or rejects each change.
3. Check it with **Go Live** on laptop, and on phone.
4. Claude Code adds an entry to `docs/build-log.md`.
5. Commit in GitHub Desktop with a message in Leon's words, then **Push origin**.
6. Screenshot anything important for the process journal.

## Phase 1: The look (8–15 Nov)
- Claude Code makes 3 different design directions as separate test pages in `design/`,
  based on the reference sites. Leon compares and chooses (or mixes).
- Then: colours, fonts, spacing, buttons, motion, applied to the real pages.
- **Leon decides:** which direction and why; what to change.
- **Done when:** Home, one question screen and one result card look finished on phone and laptop.

## Phase 2: Questionnaire (by 15 Nov)
- Turn research findings into questions. Each question needs a source (see `research-notes.md`).
- Decide answer options, "I don't know" options, and which questions are filters.
- **Leon decides:** every question and its wording.
- **Done when:** all questions work on screen, one per screen, with a progress bar.

## Phase 3: Algorithm (16–22 Nov)
- Filters, then scoring rules, then top 3 with reasons from the rules.
- Every rule records its source and its reason sentence.
- Make 5–8 test golfer profiles and check the results make sense.
- **Leon decides:** filters vs points, weights, branching, how "I don't know" works.
- **Done when:** every test profile gets a sensible result or an honest "no match".
- Also: finalise success criteria (due 22 Nov).

## Phase 4: Iron database (23–29 Nov)
- Decide the fields for each iron (category, price, specs, left-handed, source links).
- Add irons one category at a time; every spec has a source and a "checked on" date.
- Coverage test: every test profile gets at least 3 sensible options.
- Add own photos. Fitting / coach evidence this week.
- **Done when:** database full, results page shows real clubs.

## Phase 5: Testing and fixing (30 Nov – 6 Dec)
- 5 testers (golf knowledge but don't play, regular players, very experienced players).
- Measure U1, U2, U3 as written in the criteria. Note problems.
- Fix, retest, final check on phone and laptop.
- **Done when:** criteria checked with evidence, final version live.

## Not yet decided (park here)
- Custom domain
- "Tips" section
- Saving or sharing results
- AI explanations (optional extra, only if time)
