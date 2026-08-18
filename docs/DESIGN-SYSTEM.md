# Design system — PRISM Products page

Nothing here is invented. The tokens were read out of the live site's compiled
stylesheet (`prism.inc/static/css/main.4e08b093.css`) so the new page is
brand-identical, and the layout decisions were taken against the
[ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) design
intelligence database.

---

## 1. What the skill recommended, and what we did

Querying the skill for this page's job:

```bash
python3 src/ui-ux-pro-max/scripts/search.py \
  "healthcare SaaS B2B enterprise compliance platform product page AI agents" \
  --design-system --variance 4 --motion 4 --density 6
```

| Skill output | Decision |
| --- | --- |
| Product type **"B2B Service"** → *Accessible & Ethical + Minimalism & Swiss Style*, secondary *Bento Box Grid* | **Adopted.** This is exactly what PRISM already ships: hairline 1px grids, generous whitespace, no ornament. |
| Landing pattern **"Trust & Authority + Conversion"** — Hero (mission/credibility) → Proof → Solution overview → clear CTA path; *"Navy/Grey corporate. Trust blue. Accent for CTA only."* | **Adopted**, extended to twelve sections because the proposal carries far more substance than a four-section page can hold. |
| Generic SaaS default: **Glassmorphism**, **Plus Jakarta Sans**, orange `#EA580C` CTA | **Rejected.** PRISM has an established brand (Outfit/Manrope, navy `#0A2540`). Frosted glass and an orange CTA would read as a different company, and glassmorphism carries a `risk:conditional` accessibility note the skill itself flags. Brand consistency beats a generic recommendation. |
| Pre-delivery checklist (no emoji icons, `cursor-pointer`, 150–300ms hover, 4.5:1 contrast, visible focus, reduced-motion, 375/768/1024/1440) | **Adopted in full.** Every item verified — see §4 and the runbook. |

The lesson the skill encodes and this page follows: *accent colour is for the
CTA and for numerals, never for body text.*

---

## 2. Tokens (extracted from the live site)

### Colour

| Token | Value | Source | Use |
| --- | --- | --- | --- |
| `--navy` | `#0A2540` | live `bg-[#0A2540]` button fill | Primary. Buttons, inverted sections, module icons |
| `--navy-hover` | `#0F3A66` | live `hover:bg-[#0F3A66]` | Primary hover |
| `--navy-deep` | `#071A2E` | derived | Cells inside inverted sections |
| `--blue` | `#2563EB` | live `text-[#2563EB]` | Accent — numerals, active rules, CTA only |
| `--ink` | `#0F172A` | `--foreground: 222 47% 11%` | Headings, body emphasis |
| `--muted` | `#475569` | slate-600, live body copy | Body copy |
| `--numeral` | `#64748B` | `--muted-foreground: 215 16% 47%` | Small numerals, eyebrow text |
| `--line` | `#E2E8F0` | `--border: 214 32% 91%` | The hairline that carries the whole grid |
| `--wash-2` | `#F8FAFC` | live `bg-slate-50` | Alternating section bands |
| `--ok` / `--gate` / `--stop` | `#047857` / `#B45309` / `#BE123C` | new | The three-state control boundary |
| `--radius` | `0.375rem` | `--radius: 0.375rem` | All corners |

The three control-boundary colours are the only additions. They exist because
the automation boundary is the single most important idea on the page and it
needs three visually distinct states — and each is paired with a *different
icon shape* (check / lock / cross), never colour alone.

### Type

| Role | Face | Notes |
| --- | --- | --- |
| Display | **Outfit** 300–700, `letter-spacing: -0.02em` | Every `h1`–`h4`. Headlines at `font-light` (300), matching the live hero |
| Body | **Manrope** 300–700 | Everything else |
| Numerals | `ui-monospace` stack, `tabular-nums` | Step numbers, function names, the ROI formula |

Fluid sizing via `clamp()`: `h1` `clamp(2.75rem, 7vw, 4.5rem)`, `h2`
`clamp(2rem, 4.2vw, 3rem)`.

### Layout

- Shell `max-width: 1280px` (`max-w-7xl`), padding `24px` → `32px` at ≥1024px.
- **The hairline grid.** Every card cluster is
  `display:grid; gap:1px; background:#E2E8F0; border:1px solid #E2E8F0` with
  white cells. One rule, used eleven times — it is what makes the page read as
  a single system rather than a stack of components.
- Section rhythm: `padding-block: 80px` → `104px`, alternating white and
  `#F8FAFC` bands with `1px` borders.
- **Two-column section head** at ≥1024px: statement (7 cols) left, argument
  (5 cols) right, baseline-aligned. Below that they stack.

### Motion

Held to the skill's "Standard" tier (4/10) and no higher:

- Hover/colour transitions: 180–220ms.
- One reveal-on-scroll: 14px rise + fade, 500ms, fired once per block.
- No parallax, no page-transition overlay, no autoplay anything.
- Every one of the above is removed under `prefers-reduced-motion: reduce`,
  which also disables `scroll-behavior: smooth`.

---

## 3. Interaction

**Agent board.** An ARIA tablist with roving `tabindex`. `↓`/`→` and `↑`/`←`
wrap through all ten agents, `Home`/`End` jump to the ends, and the panel
follows selection. The two visual groups (case agents 1–8, portfolio agents
9–10) are two labelled tablists but one continuous keyboard walk — a reviewer
should never have to guess where the arrow keys stop working.

**Section jump rail.** `IntersectionObserver` with
`rootMargin: -140px 0px -65% 0px`, so the active entry tracks the section
you're reading rather than the one that happens to touch the viewport edge.
Sections carry `scroll-mt-32` to clear both sticky bars.

**No-JS behaviour.** In the standalone preview every agent panel renders; JS
only *hides* the unselected ones. Content is never gated behind a script.

---

## 4. Contrast — all verified against WCAG 2.1 AA

Every foreground/background pair on the page, measured:

| Pair | Ratio | |
| --- | --- | --- |
| `#0F172A` on white (headings) | 17.85 | AAA |
| white on `#0A2540` (primary button) | 15.54 | AAA |
| `#0A2540` on white | 15.54 | AAA |
| `#DCE6F3` on `#071A2E` (inverted list copy) | 13.92 | AAA |
| `#DBEAFE` on `#0A2540` (function chips) | 12.74 | AAA |
| `#FDE68A` on `#0A2540` (gated function chips) | 12.48 | AAA |
| `#CBD8EA` on `#071A2E` (inverted body) | 12.16 | AAA |
| `#CBD8EA` on `#0A2540` (inverted lede) | 10.77 | AAA |
| `#78350F` on `#FFFBEB` (approval-gate callout) | 8.75 | AAA |
| `#93B4E3` on `#071A2E` (inverted eyebrow) | 8.26 | AAA |
| `#475569` on white (body) | 7.58 | AAA |
| `#475569` on `#F8FAFC` (body on wash) | 7.24 | AAA |
| `#BE123C` on white ("never autonomous") | 6.29 | AAA |
| `#1D4ED8` on `#EFF6FF` (kind pill) | 6.16 | AAA |
| `#047857` on white ("automatic") | 5.48 | AA |
| `#2563EB` on white (accent) | 5.17 | AA |
| `#B45309` on white ("recorded approval") | 5.02 | AA |
| `#64748B` on white (eyebrow, small numerals) | 4.76 | AA |
| `#8695A9` on white (56px display numeral, large-text rule) | 3.05 | AA-large |

`--faint` (`#94A3B8`, slate-400) measures **2.56:1** and is therefore
restricted to hairlines and dividers. It is never used for text — that is why
`--numeral` and `--numeral-xl` exist.

Colour is never the only signal: the three control-boundary columns pair each
colour with a distinct icon *shape*, and the two gated functions are marked by
both tint and border.

---

## 5. Required global CSS

Already present on prism.inc. Included here in case the page is lifted into a
different app.

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap');

body { font-family: Manrope, sans-serif; }
h1, h2, h3, h4, h5, h6 { font-family: Outfit, sans-serif; letter-spacing: -0.02em; }
.font-display { font-family: Outfit, sans-serif; }

.overline {
  font-family: Manrope, sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.bg-grid {
  background-image:
    linear-gradient(90deg,  rgba(15,23,42,.05) 1px, transparent 0),
    linear-gradient(180deg, rgba(15,23,42,.05) 1px, transparent 0);
  background-size: 56px 56px;
}
```
