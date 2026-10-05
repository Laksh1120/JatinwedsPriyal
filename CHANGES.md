# Change Spec — Invitation Layout Revision (2026-10-04)

Scope: layout and content refinements to the single-page invitation. All changes are in
`src/routes/index.tsx` and `src/styles.css`. No dependencies, routes, or build config changed.

## Global — equal "page" length between gold lines
- Introduced `--page-gap` and `--page-len` (`calc(100dvh - 2 * --page-gap - 2px)`) so each section
  ("page") is pinned to the invitation's visible window height, with ~2px slack so the top and bottom
  gold separator lines stay visible on screen.
- Added a `.page-pin` helper (fixed height, content top-aligned) applied to the Countdown, Venue, and
  Footer sections; the Hero/invitation card and each event card are pinned to the same height.
- Pages now butt directly against each other (event grid gap removed) so one gold line separates them.
- The "The Events" title band is intentionally exempt from the fixed height.

## Page 1 — Invitation / Hero
- Jatin's grandparents' line is now bracketed and breaks so "&" starts a new line, matching Priyal:
  `(Grand s/o Late Hiranand` / `& Smt. Ganeshidevi Mulchandani)`.
- Reduced the size and the space above/below the "with" between the two names.
- Top lotuses brought down with visible stems and shrunk so they clear the Ganesh mark; the Ganesh mark
  moved down for breathing room; bottom lotus shortened. Spacing tuned so the whole card fits with no overflow.

## Page 2 — Countdown
- Pinned to the standard page length, then shortened by ~18px so its bottom gold line sits a little
  higher (less empty space after the "11th – 12th December, 2026" date).

## Page 3 — Events (one page per event)
- Removed the "Two days of celebration" eyebrow above "The Events".
- Every event photo now uses a fixed-size box (same pixels on every event page).
- Removed the dots from times ("P.M."/"A.M." → "PM"/"AM") and enlarged the leading time number.
- Reserved a two-line title area and let the text fill the page so the date/day line up across events
  and the day sits near the bottom gold line with consistent spacing.

## Page 4 — Venue
- "Get Directions" is centered and moved up directly under "Praveg Lake Resort / Daman".
- Enlarged "Daman", the "Accommodation" heading, and the check-in/out text; nudged the accommodation
  block down slightly.
- Reduced and made consistent the gap between "The Venue" and the top gold line.
- Copy fixes: "185 km from Mumbai" → "164 km from Mumbai International Airport";
  "Accommodations" → "Accommodation".

## Page 5 — Footer
- Closing note is now two gold-italic lines with spacing between them, in a larger font.
- Added the page-1 lotus decoration (top and bottom) framing the note.

## Deferred (not in this revision)
- Animations: intro timing delay, countdown number-box flip, event-page motion, lotus sway/drag on the
  footer. Event photos currently use `cover` (slight edge crop) rather than `contain`.
