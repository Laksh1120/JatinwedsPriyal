# Project Context — Lake & Love Wedding Invitation

A single-page wedding invitation website for **Priyal & Jatin**.
This file is the running log for the project: what it is, how it's built, and
every change made during development. Update the **Changelog** section at the
bottom every time something is added, changed, or fixed.

## Overview

- **Couple:** Priyal Bang & Jatin Mulchandani
- **Date:** November 12, 2026
- **Venue:** Praveg Lake Resort, Daman - 3 Kachigam, Kachigam Damanganga Garden, Daman 396215
- **Countdown target:** December 10, 2026 (set 2026-09-28). Every other date on the page
  still reads November 12, 2026 — which is the real day is unconfirmed
- **Theme:** "Lakeside at dusk" tableau — sage and lavender (the requested `#B8C9A9` / `#C0AED4`) with antique gold on warm cream; arched photo frames, ornate panels, checkerboard staging, wall sconces, paper texture
- **Type:** Single-page TanStack Start app (React 19 + Vite + Tailwind CSS v4, one route at `/`)
- **Content status:** unchanged from the original upload — names, parents, date, venue,
  dress code and story copy are verbatim; the 4-stage timeline was replaced by a countdown

## File Structure

```
/dev-server
├── context.md                       # This file
├── AGENTS.md                        # Project rules (single-page composition)
├── src/
│   ├── routes/
│   │   ├── __root.tsx               # <html> shell, SEO meta, Google Fonts links
│   │   └── index.tsx                # The whole invitation: nav + all sections
│   ├── assets/
│   │   ├── couple.jpg.asset.json    # Real couple photo (Lovable asset pointer)
│   │   ├── lake.jpg.asset.json      # Lake backdrop (Lovable asset pointer)
│   │   ├── ganesha.png              # Generated gold Ganesha artwork (intro)
│   │   ├── story-proposal.jpg       # Generated story photo
│   │   ├── story-venue.jpg          # Generated story photo
│   │   └── story-engagement.jpg     # Generated story photo
│   ├── styles.css                   # Theme tokens + decorative classes
│   ├── components/ui/               # shadcn primitives (Button used here)
│   └── router.tsx / start.ts / server.ts
└── public/                          # favicon.ico, robots.txt
```

The original upload (`lake-and-love-invite.zip`, folder `win Copy/` with
`index.html`, `styles.css`, `script.js`, `images/couple.jpg`, `context.md`) is no
longer in the repo; its content now lives in `src/routes/index.tsx` and
`src/styles.css`.

## Sections in src/routes/index.tsx

1. **Ganpati intro** — full-screen deep-lavender room: doors part, gold Ganesha and the mantra appear, then the invitation card unfolds and the site is revealed (auto after ~7s; tap or Skip to go straight in; `localStorage`-gated, respects reduced-motion, `?intro` forces it)
2. **Nav** — fixed deep-lavender bar with gold-soft accents and cream text, "Lake & Love" wordmark, mobile hamburger
3. **Hero (`#home`)** — names, date, faded lake photo, paper texture, two wall sconces, arched couple portrait, scroll cue
4. **Couple (`#couple`)** — arched portrait + two ornate panels (bride and groom with parent names)
5. **Countdown (`#event`)** — live Days / Hours / Minutes / Seconds until December 10, 2026 in four deep-lavender cards on the sage checkerboard band, then the date/dress-code meta
6. **Venue (`#venue`)** — name, address, description, getting-there list, embedded Google Maps iframe, directions button
7. **Stories (`#blog`)** — 3 "our journey" cards with photo, date, title, copy, "Read more"
8. **Footer** — names, date, tagline "Where the lake meets forever"

## Design Tokens (src/styles.css `:root`, oklch)

| Token | Value | Use |
|---|---|---|
| `--background` / `--beige` | `#B8C9A9` | Sage page background, countdown checker band |
| `--emerald` | `#C0AED4` | Lavender hero |
| `--emerald-deep` | `#4C4258` | Deep lavender: nav, couple panels, countdown cards, venue, footer, intro room |
| `--blush` | `#E7E0ED` | Pale lavender: hero arch, story frames, panel shadows, labels on dark |
| `--gold` | `#81662D` | Hairlines, labels on cream, flourish dividers |
| `--gold-soft` | `#C7A85A` | Gold accents on dark surfaces, wall sconces |
| `--cream` | `#FAF7F1` | Cards, light text on dark |
| `--foreground` | `#253023` | Deep green ink on sage and lavender surfaces |
| `--font-display` | Bodoni Moda | Headings, names |
| `--font-body` | Montserrat | Body/UI text |

### Decorative classes (src/styles.css)

- `.paper-texture` — film-grain/mist overlay
- `.flourish` — gold rule + heart divider under headings
- `.arch-frame` / `.arch-inner` — arched photo frame with double gold outline
- `.ornate-panel` — deep-lavender card, gold hairline, ✦ corners, pale-lavender offset shadow
- `.count-card` — countdown unit card: deep lavender, gold hairline + ✦ corners, Bodoni numerals, pale-lavender label
- `.checker-section` / `.checker-footer` — checkerboard staging bands
- `.sconce` — wall-lamp ornament in the hero and in the intro
- `.ganpati-intro` / `.gi-*` — Ganpati opening sequence: deep-lavender doors and room, sage arched screens, perspective checkered floor, gold halo, invitation card
- `.invitation-card` — leftover from the previous entry card, no longer rendered

Fonts load from `<link>` tags in `src/routes/__root.tsx` (Tailwind v4's build
cannot `@import` a remote URL).

## Known Gaps / Things to Revisit

- The three story photos are AI-generated stand-ins, not real photographs
- The Ganesha drawing in the intro is generated artwork, not a traditional illustration
- The intro was matched from the reel's cover frames and embed media; the reel itself
  cannot be opened by automation, so the exact animation is still worth a side-by-side check
- Two dates now live on the page: the countdown runs to **December 10, 2026** while the hero,
  footer, intro card and page description still say **November 12, 2026** — confirm the real
  day and the site should be made consistent
- The removed timeline (4:00 PM Guest Arrival, 5:30 PM Ceremony, 6:30 PM Reception & Dinner,
  10:00 PM Farewell) is no longer shown anywhere; it can be reinstated under the countdown
  or beside the venue if the schedule is still wanted
- No RSVP form
- "Read more" links in the Stories cards are still dead `#` placeholders
- Google Maps iframe uses a text query, not verified exact coordinates
- No `og:image` set for link previews (no share-sized image yet)
- Site is not published yet — no public URL or custom domain
- The Instagram reference reel could not be opened directly (it blocks automated
  viewing); the look was matched from its embed media, so it is worth a side-by-side check

## Changelog

### 2026-09-25
- Initial analysis of uploaded project. No changes made yet — file structure and features documented above.
- Created this `context.md` to track future changes.
- **Envelope intro made interactive.** Previously it autoplayed on load and finished in ~4.5s regardless of whether anyone noticed. Now:
  - It no longer plays automatically — it waits, sealed shut, for the visitor to **click/tap the envelope, press Enter/Space on it, or scroll/swipe**.
  - Once triggered, the seal-break → flap-open → letter-out sequence is slowed down and re-timed (~5.8s total, up from ~2.7s) so each stage is clearly visible instead of blurring together.
  - Added a pulsing "Tap the seal or scroll to open" hint under the envelope, plus an idle glow/hover-scale on the seal, so it reads as interactive rather than decorative.
  - `localStorage` key bumped to `priyal-jatin-intro-v3` so returning testers/visitors see the new version once. It still only shows once per browser by default — add `?intro` to the URL to force it to replay for testing.
  - `prefers-reduced-motion` visitors and the Skip button still bypass it entirely/instantly, as before.

### 2026-09-26 — Redesign to the Instagram reference (content unchanged)
- **Rebuilt as a TanStack Start single-page app.** The static `index.html` /
  `styles.css` / `script.js` trio became `src/routes/index.tsx` (all sections in
  one route, per the rule recorded in `AGENTS.md`) and `src/styles.css`
  (Tailwind v4 with `@theme` tokens). All copy, names, dates, addresses and
  links were carried over word for word.
- **New palette.** Replaced the lake-blue/sage/gold hex scheme with an emerald /
  blush / antique-gold / cream set in `oklch`, matching the reference's vintage
  Indian wedding tableau.
- **New type pairing.** Cormorant Garamond + Josefin Sans → Bodoni Moda
  (display) + Montserrat (body), loaded via `<link>` in `src/routes/__root.tsx`.
- **New visual devices.** Arched photo frames, ornate emerald panels with ✦
  corners and blush offset shadows, checkerboard event/footer bands, hero wall
  sconces, paper-texture overlay, gold flourish dividers.
- **Intro replaced.** The animated envelope is now a tap-to-open invitation card
  on deep emerald; behaviour is the same (skippable, reduced-motion aware,
  `?intro` to force), and the `localStorage` key is bumped to
  `priyal-jatin-intro-v4`.
- **Flip cards simplified.** The bride/groom tap-to-flip cards became two
  standing ornate panels showing the same information.
- **Story photos swapped.** The Unsplash placeholders in the Stories section were
  replaced with three generated images in the new palette
  (`story-proposal.jpg`, `story-venue.jpg`, `story-engagement.jpg`).
- **Real photos are now Lovable assets.** `couple.jpg` (from the upload) and the
  lake backdrop are imported through `.asset.json` pointers instead of relative
  paths.
- **SEO/meta added.** Per-route title, description and `og:` tags for the
  invitation, plus the font preconnects.
- **Blank-screen fix.** The preview threw `Cannot read properties of null
  (reading 'useCallback')` — two copies of React were loaded from a stale Vite
  cache. Cleared the cache and restarted the dev server; no app code changed.
- **Verified:** build OK, page serves 200, and Playwright runs at 1280×1800 and
  390×844 show the intro card and every section with no console or page errors.

### 2026-09-28 — Ganpati opening sequence (content unchanged)
- **The envelope entry is gone.** The invitation-card intro is replaced by a
  Ganpati opening built on the third slide of the reference reel: emerald double
  doors slide apart, a gold Ganesha appears in a glowing halo above the mantra
  "॥ श्री गणेशाय नमः ॥", then the invitation card with the names and date
  unfolds beneath it. Once the card is revealed the sequence holds a moment and
  the overlay fades away to the website — no other section was touched.
- **The intro now sits in the reel's room** instead of a flat emerald
  backdrop: a textured emerald wall with a warm gold glow and an inset gold
  border, two flickering wall sconces, a pair of blush arched screens with gold
  edges behind the stage, and a black-and-cream checkered floor laid out in
  perspective.
- **New artwork:** `src/assets/ganesha.png`, a generated gold line drawing in
  the same palette as the rest of the site.
- **Timing from first paint:** doors 0.2s → Ganesha 1.1s → mantra 2.4s → card
  4.3s → auto-reveal 7.2s, then a 1.4s fade-out. The mantra is deep emerald so it
  reads clearly against the blush screens.
- **Behaviour unchanged:** tapping anywhere or pressing Skip goes straight to the
  site, `prefers-reduced-motion` visitors bypass the whole thing instantly, and
  `?intro` forces a replay. The `localStorage` key is bumped to
  `priyal-jatin-intro-v5`, so every browser sees the new opening once.
- **Dead style:** `.invitation-card` is still in `src/styles.css` but nothing
  renders it any more.
- **Verified:** build OK and Playwright runs at 1280×1800 and 390×844 step through
  the doors, Ganesha, mantra, card and the reveal into the site with no console or
  page errors.

### 2026-09-28 — Background revamp to beige & blue-grey (content unchanged)
- **The two requested colours are now the actual backgrounds**, verified by reading the
  rendered page: the whole page sits on `#BCA68E` beige (body, couple and stories
  sections, event checker band) and the hero plus the highlighted timeline card are
  `#88969F` blue-grey. The old emerald and blush are gone from the interface.
- **New shades built from the same two colours** so nothing is unreadable: a deep
  blue-grey (`oklch(0.405 0.03 233)`) for the nav, the couple panels, the venue, the
  footer and the intro room; a pale blue-grey (`oklch(0.855 0.024 231)`) for the hero
  arch, the story frames, the panel offset shadows and labels on dark; cream
  (`oklch(0.955 0.016 78)`) for cards; ink (`oklch(0.28 0.033 236)`) for text on the
  beige and blue-grey surfaces.
- **Gold was re-tuned** to an antique brass (`oklch(0.52 0.088 78)`) with a lighter
  `--gold-soft` for dark surfaces, since the old gold vanished against beige.
- **Text moved where contrast demanded it:** the hero now uses dark ink on blue-grey
  instead of cream, section headings on the beige page use ink, the venue heading has
  a light variant, the highlighted ceremony card carries ink copy, and the small
  labels were strengthened from 80% to full ink.
- **Intro room re-tinted** to match: blue-grey walls and floor, beige arched screens,
  brass lamps and card border.
- **Verified:** build OK; Playwright at 1280×1800 and 390×844 walks every section with
  no console or page errors; computed background colours read back as `#BCA68E` and
  `#88969F` on the surfaces listed above.

### 2026-09-28 — Event details replaced by a countdown
- **The Event Details section is now a countdown.** The 4-stage timeline (Arrival,
  Ceremony, Reception, Farewell) and its checkerboard grid were removed and replaced in
  the same place — section id `#event`, same checker band, same heading style — by a live
  counter reading **Days / Hours / Minutes / Seconds** until **10 December 2026**
  (midnight in Daman, `2026-12-10T00:00:00+05:30`, so every visitor counts to the same instant).
- **Styled as the rest of the invitation:** four deep blue-grey `.count-card` panels with a
  gold hairline and ✦ corners, Bodoni numerals in cream over a gold rule, pale blue-grey
  labels; the line "Until we say “I do” by the water" sits under them, then the cream
  date/dress-code strip, now reading "Thursday, December 10, 2026" and
  "Garden Formal · Earth tones encouraged".
- **Nav relabelled** from "Event" to "Countdown" on both desktop and the mobile menu.
- **Technical notes:** the counter is a `Countdown` component in `src/routes/index.tsx` —
  the first paint is `--` and the real numbers arrive in `useEffect`, so server and browser
  markup never disagree; it re-reads the clock every second and cleans its timer up on
  unmount. Once the target passes it shows "Today is the day — the lake is waiting."
  Each card also carries a screen-reader-only reading of its value.
- **Also:** sections now get `scroll-margin-top` so anchor jumps land clear of the fixed bar.
- **Verified:** build OK; Playwright at 1280×1800 (one row of four) and 390×844 (2×2 grid)
  shows the digits ticking down second by second, the nav link scrolling to the heading
  clear of the bar, and no console or page errors.

### 2026-09-28 — Preview load report (no code changed)
- **Report:** the preview appeared not to load right after the countdown swap.
- **Diagnosis:** nothing in the invitation was broken — the page answers `200` and a test
  browser opens the site through the Ganpati opening and every section with no console or
  page errors. The blank preview was the editor's own reload left over from the round of
  edits, not a fault in the site.
- **Action:** no app code, style or content was touched. A refresh (or hard refresh) clears
  it; if it ever happens again, note whether the page is plain white or shows an error
  message, since that decides whether to look at the cache or at the code.

### 2026-09-28 — Theme changed to sage & lavender (content unchanged)
- **The two requested colours are now the theme.** The beige `#BCA68E` and blue-grey
  `#88969F` scheme is gone; the page background and the countdown checker band are sage
  `#B8C9A9`, and the hero, the story frames and the Ganpati screens are lavender `#C0AED4`.
- **Every token in `src/styles.css` is now a literal hex** (the previous round wrote them in
  `oklch`): `--background`/`--accent`/`--beige` `#B8C9A9`, `--emerald`/`--secondary`/`--ring`
  `#C0AED4`, `--emerald-deep`/`--primary` `#4C4258`, `--blush` `#E7E0ED`, `--foreground`
  `#253023`, `--muted-foreground` `#44523F`, `--muted` `#E5EADF`, `--border` `#9EAC92`,
  `--input` `#DBE4D3`, `--gold` `#81662D`, `--gold-soft` `#C7A85A`, `--cream`/`--card` `#FAF7F1`.
- **The old names stay, the colours changed.** `--emerald` is lavender, `--beige` is sage and
  `--blush` is pale lavender — kept as class names so no layout or markup had to be touched.
- **Supporting shades rebuilt around the pair:** deep lavender `#4C4258` for the nav, the couple
  panels, the countdown cards, the venue, the footer and the intro room; pale lavender `#E7E0ED`
  for the hero arch, the story frames, the panel offset shadows and labels on dark; deep green
  ink `#253023` for all copy on sage and lavender; a sage-grey `#9EAC92` border.
- **Contrast re-checked, not assumed** (computed with a script against WCAG): ink on sage 7.84:1,
  ink on lavender 6.72:1, cream on deep lavender 8.82:1, pale lavender on deep lavender 7.31:1,
  gold-soft on deep lavender 4.12:1 (large/decorative text only), gold on cream 5.07:1.
- **Intro room re-tinted to match:** deep lavender walls, floor and doors, sage arched screens,
  brass lamps and card edging; the mantra stays dark so it reads on the screens.
- **Content, layout and behaviour untouched** — same copy, same sections, same countdown, same
  skippable opening with the `priyal-jatin-intro-v5` key and `?intro` replay.
- **This file's own descriptions were corrected** (Overview, Sections, decorative classes) so they
  say lavender/sage instead of the old emerald and blue-grey wording; changelog entries above are
  left as they were written.
- **Verified:** build OK; Playwright at 1280×1800 confirms sage on the body and the checker band,
  lavender in the hero, deep lavender in the nav and the countdown cards, with no console or page
  errors.

## 2026-09-30 — Full-screen envelope intro
- Added a full-screen, click-anywhere envelope opening before the invitation.
- Built the blush envelope, gold edging and seal, scalloped stamp, and blank cream card entirely in CSS using the existing warm-paper theme.
- Sequenced the flap opening, card rise, and overlay reveal; repeated input is ignored while it runs.
- The opening appears once per browser session, skips for reduced-motion visitors, and locks page scrolling while visible.
- Existing invitation content, sections, layout, and functionality remain unchanged.

## 2026-10-02 — Full-screen four-flap envelope redesign
- Replaced the small centered envelope, blank sliding card, and floating video window with a viewport-filling blush-paper envelope built from four responsive flaps.
- Added embossed floral details, a plain champagne wax seal, the two-line invitation message, and a layered pink satin ribbon bow.
- The existing video now sits behind the envelope from the first frame, starts with sound during the opening, and remains the same fixed background behind the final ticket frame.
- Added a small mute/unmute control after the reveal while preserving the session-only behavior, reduced-motion shortcut, scroll lock, fallback timing, and existing slap-on invitation transition.
