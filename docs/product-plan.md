<!-- Copy of Leon's Google Doc "Product" (working plan), written as a build spec by Claude (AI) on 24 Nov 2026. The Google Doc is the live version; Leon's decisions win. Golf facts carry their source; anything marked SUGGESTION is not decided yet. -->

# Product plan: Personalised Golf for All

Deadline: product complete **6 Dec 2026**. Testing with 5 real people from **30 Nov**.

## 1. How the tool works
1. **Questions** collect what the golfer needs (section 3).
2. **Filter** removes irons that can never fit: wrong hand, far over budget (Felfernig et al. 2015, constraint-based recommenders).
3. **Score** every remaining iron: for each feature, golfer's need (weight) × iron's rating (1–5), summed (ASQ decision matrix; Google, content-based filtering).
4. **Show the top 3**. Each shows 2+ reasons linked to the golfer's answers, 1 trade-off, 1 limitation or next step (success criterion R3).
5. **No match:** relax the budget first and say so clearly (Felfernig et al. 2015).

## 2. Questionnaire journey (Leon's decision, 24 Nov)
- The questionnaire plays **one golf hole**. Each answer moves the ball further down the hole. After the last question the ball drops into the cup, then the results appear.
- The hole is a **stylised illustration** (drawn as SVG, not a copied course map), inspired by the **15th hole (par 5) at Crans-sur-Sierre, Switzerland**. In the final round of the 2023 Omega European Masters, Ludvig Åberg hit a 244-yard second shot close to the pin there and called it his favourite shot on the way to his first DP World Tour win (19-under, by two shots). Sources: PGA Tour/AP, 3 Sept 2023; Golf Monthly, 2023. The course has views of the Matterhorn, Mont Blanc and the Rhône Valley (PGA.com). Exact yardage and shape of the 15th are not known, so do not state them; the drawing is "inspired by", not a map.
- Why (Leon): a Swiss course near where he lives, a Swedish player like his family's roots, and a par 5 gives enough "shots" for 10 questions.
- Must work with `prefers-reduced-motion` (no movement, progress still clear), and always show "Question X of 10" as text (U3). The hole is decorative for screen readers.

## 3. Questions (all approved by Leon, 24 Nov). Keep the wording exactly.
| # | Question | Help text (shown under the question) | Options | Effect | Source |
|---|---|---|---|---|---|
| 1 | Are you right- or left-handed? | The way you stand to the ball. Most right-handed people play right-handed. | Right / Left | Filter | Fact |
| 2 | What's your budget for a set of irons? | For a full set, usually 6–7 irons (e.g. 5-iron to pitching wedge). New sets from big brands are often CHF 1,000–1,400 in Switzerland. | Under CHF 500 / CHF 500–1,000 / CHF 1,000–1,400 / Over CHF 1,400 / No limit / Not sure yet | Filter (relaxed if nothing fits) | Leon's Swiss price research; Covey 2025 |
| 3 | Would you buy used irons? | Irons a few years old lose very little performance and can cost much less. | New only / Open to used / Not sure | "Used" tip; value +1 if open | Johnson & Stachura 2019; coach interview |
| 4 | What's your level? | Your handicap shows your level. If you don't have one, choose Beginner or Not sure. | Beginner (no handicap) / 25+ / 15–24 / 6–14 / 0–5 / Not sure | Main driver of category fit | Weston 2025; Covey 2025; Today's Golfer 2026 |
| 5 | How much do you play, and how keen are you? | This helps decide how much it's worth spending. | A few times a year / Regularly / Seriously trying to improve | Value weight; coaching tip | Coach interview; Shapcott 2022 |
| 6 | What's your most common bad iron shot? | Fat = you hit the ground before the ball. Thin = you catch the ball low on the face and it flies low. Toe/heel = off the end of the face or near the shaft. | Fat (ground first) / Thin / Off the toe or heel / Slice or hook / Not sure | Forgiveness | Summitt 2026; Johnson 2026 |
| 7 | How high do your irons fly? | Some irons are built to launch the ball higher, which helps if your shots stay low. | Too low, hard to get up / Normal / Too high / Not sure | Launch help | Covey 2025; Summitt 2026; Johnson 2026 |
| 8 | What matters most to you? | Pick up to 3, most important first. Every iron is a trade-off. | Distance / Forgiveness / Control and accuracy / Feel / How it looks / Price / Not sure. **Ranked choice (changed 25 Nov):** pick up to 3 in order; tapping a choice again removes it and the others move up; "Not sure" is exclusive (clears the others). Stored as an ordered list, e.g. ["forgiveness","accuracy"] (the stored name for "Control and accuracy" is `accuracy`) | Ranked weight boost: 1st choice +3, 2nd +2, 3rd +1 to that feature's weight | Today's Golfer 2026; Saternus 2019; coach interview |
| 9 | What's your goal? | Easier irons help your scores now. There's no clear proof that harder irons make you improve faster. | Score better now / Improve my ball striking long term / Not sure | Small accuracy boost + honest note | MyGolfSpy Labs; Saternus; coach |
| 10 | Optional: height, wrist-to-floor, swing speed (if known) | Only if you know them. Used for tips on lie, length and shaft, not to choose the iron. | Height (cm), wrist-to-floor (cm), driver swing speed (mph) + Skip | Advice only | PING colour chart; Saternus lie angle; MacKenzie & Sprigings 2009; flex chart: MyGolfSpy (Olizarowicz) and GOLF.com (Melton, 2020) |

**Shaft flex tip (added 24 Nov, sources: MyGolfSpy flex chart; GOLF.com 2020, data from True Spec Golf):** if a driver swing speed is given, the results show a likely flex as a starting point only: under 72 mph Ladies, 72–83 Senior, 84–96 Regular, 97–104 Stiff, 105+ X-Stiff. Always add: "This chart is for drivers; iron flex can differ and brands aren't standardised, so confirm it at a fitting. Flex mainly changes launch and direction, not your swing speed (MacKenzie & Sprigings 2009)." No swing speed given = no flex advice.

**"Not sure" (Leon's decision):** no weight change. The results say so, e.g. "You weren't sure about your usual miss, so it didn't affect your results. A lesson or fitting can tell you." (helps R2)

## 4. Scoring (SUGGESTION, Leon still to confirm; tune with test profiles)
Features rated 1–5: forgiveness, distance, accuracy, launch help, feel, value.

Category starting ratings (Today's Golfer 2026 category averages: carry GI 185.6, PD 181.3, players' cavity 172.8, blade 171.7 yd; left-right dispersion widest for GI, tightest for blades; Covey 2025: GI = most forgiveness and launch). Feel = SUGGESTION.

| Category | Forgiveness | Distance | Accuracy | Launch | Feel |
|---|---|---|---|---|---|
| Game improvement | 5 | 5 | 2 | 5 | 2 |
| Players' distance | 4 | 4 | 3 | 4 | 3 |
| Players' cavity | 3 | 2 | 4 | 3 | 4 |
| Blade | 1 | 2 | 5 | 2 | 5 |

Value: 5 = under CHF 500, 4 = 500–1,000, 3 = 1,000–1,400, 2 = 1,400–1,800, 1 = above.
Weights start at 1. Level: beginner/25+ → forgiveness +3, launch +2; 15–24 → forgiveness +2, distance +1; 6–14 → accuracy +1, distance +1, forgiveness +1; 0–5 → accuracy +2, feel +2. Fat/thin/off-centre → forgiveness +2. Too low → launch +2. "What matters most" (ranked, Leon 25 Nov) → 1st choice +3, 2nd +2, 3rd +1 to that feature's weight (source: Leon's design choice, based on the ASQ decision matrix: more important criteria get bigger weights). "How it looks" boosts **feel** (compact, players-style look; Covey 2025: players distance irons began as "a distance iron that looks (somewhat) like a players iron"). If both Feel and How it looks are ranked, both weights add to feel (they clearly care a lot about it). "Price" boosts **value**. Casual → value +3. Long-term goal → accuracy +1.

## 5. Results page (Leon will design this in detail; he must be closely involved)
- Top 3 irons with match score, brand photo (credit under it, e.g. "Image: TaylorMade", link to the brand page).
- 2–3 reasons linked to the answers, 1 trade-off, 1 limitation/next step, source next to every fact.
- **For the algorithm phase (Leon, 25 Nov):** use the question 8 ranking in the reasons, e.g. "You put forgiveness first, so it counted most."
- Tips when relevant: lie check (PING; Saternus), shaft flex (MacKenzie & Sprigings), used irons + coaching (coach; Johnson & Stachura), "also look into: …" similar models.
- Note when irons outside Europe exist (e.g. US-only brands).
- "How it works" page: sources and limits.

## 6. Iron database
30 core irons in `data/irons.json`, all from Leon's sources (list in the Google Doc, section 6). Fields (SUGGESTION): id, brand, model, year, category, priceCHF, priceNote ("approx., converted from USD × 0.84, checked DATE"), leftHanded (true/false/unknown), ratings {forgiveness, distance, accuracy, launch, feel}, keyPoint, similar [names], image, imageCredit, brandUrl, sources [{label, url}]. Used irons are a tip, not separate entries. Irons that can't be bought in Switzerland are left out.

## 7. Test profiles (R2)
1. Beginner on a budget → budget GI (Takomo 101, Cobra Air-X) or used GI + coaching tip.
2. 15–24, CHF 1,000–1,400, wants distance → players' distance (P790, ZXi5, JPX925, Wilson DYNAPWR).
3. 6–14, no limit, wants control → players' cavity (T100, P7CB, Mizuno Pro M-13).
4. Left-handed, under CHF 500 → few options; used GI or relaxed budget, clearly explained.
5. Left-handed, under CHF 500, new only, 0–5, blades → honest "no match" that says what was relaxed.

## 8. Home page text (Leon's choice, 24 Nov)
- Headline: **Irons, explained. For your game.**
- Line under it: "A free, honest starting point before you buy or book a fitting."

## 9. Usability testing checklist (Phase 5, 5 testers)
Success criteria (from CLAUDE.md section 4):
- [ ] **U1** At least 4 of 5 complete the questionnaire and reach results without help.
- [ ] **U2** At least 4 of 5 can explain a recommendation reason and a limitation in their own words.
- [ ] **U3** The full process works on phone and laptop: readable text, labelled inputs, keyboard-operable controls, no clipped content.

Things to watch for:
- [ ] Did testers pick more than one on Q8 without being told? (added 25 Nov)
