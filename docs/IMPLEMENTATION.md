# Implementation runbook — rebuilding `prism.inc/products`

This is the "what to do" file. Follow it top to bottom and the new Products
page ships without touching anything else on the site.

**Estimated effort:** 1–2 hours for a developer with repo access, most of it
verification.

---

## 0. What this repo contains

| Path | What it is | Where it goes |
| --- | --- | --- |
| `preview/products.html` | Self-contained, zero-dependency build of the finished page. Open it in a browser. | Review artefact — do **not** deploy |
| `src/pages/Products.jsx` | Drop-in replacement for the live `Products` route component | `src/pages/Products.jsx` in the prism.inc app |
| `src/data/prism-platform.js` | All page copy as data, so marketing/compliance edit content without touching layout | `src/data/prism-platform.js` |
| `docs/DESIGN-SYSTEM.md` | The tokens this page uses and why | reference |
| `docs/CONTENT-MAP.md` | Every claim on the page traced to its source | compliance review |

The preview and the React component render the same page. The preview exists
so stakeholders can approve the design before anyone opens the app repo.

---

## 1. Prerequisites — confirm these already exist

The live site (`prism.inc`, CRA + Tailwind 3 + shadcn/ui) already ships all of
these. Confirm before you paste anything in.

- [ ] **Fonts.** `Outfit` (display) and `Manrope` (body) are imported in the
      global stylesheet. *Currently: yes — `@import url(...family=Outfit...&family=Manrope...)`.*
- [ ] **`font-display` utility** maps to `Outfit, sans-serif` with
      `letter-spacing: -0.02em`. *Currently: yes, applied to `h1`–`h6`.*
- [ ] **`.overline` utility** — 12px / 700 / `.22em` tracking / uppercase.
      *Currently: yes.*
- [ ] **`.bg-grid` utility** — the two-axis hairline background used behind the
      hero. *Currently: yes.*
- [ ] **shadcn `Button`** resolvable at `@/components/ui/button`, and `asChild`
      supported. *Currently: yes.*
- [ ] **`lucide-react`** at a version that exports `ChartColumn`,
      `TriangleAlert`, `SquareCheckBig`, `CircleCheckBig`, `BotMessageSquare`
      and `UserRoundCheck` — i.e. **≥ 0.447**. The live bundle already uses
      `chart-column`, so this should hold. If it does not, see step 5.
- [ ] **`react-router-dom`** `Link`, and the `@/` path alias.

If any utility is missing, the CSS is in
[`docs/DESIGN-SYSTEM.md` § "Required global CSS"](./DESIGN-SYSTEM.md) — paste it
into the global stylesheet.

---

## 2. Install

```bash
# from the root of the prism.inc app repo
git checkout -b feat/products-ai-case-team

# copy the two files across
cp <this-repo>/src/data/prism-platform.js  src/data/prism-platform.js
cp <this-repo>/src/pages/Products.jsx      src/pages/Products.jsx

npm start
```

The route is unchanged. `Products.jsx` still default-exports the page
component, so no router edit is needed.

---

## 3. Verify before you push

Run these in order. Each one has caught a real bug in this build.

### 3.1 Automated

```bash
npm run build          # must succeed with no new warnings
npm test               # existing suite — the data-testids below are preserved
```

**Preserved test IDs** (do not rename — existing tests depend on them):

- `products-page`
- `module-0` … `module-7`
- `products-cta-top`, `products-cta-bottom`

**New test IDs** you can hook onto: `products-section-nav`,
`products-cta-agents`, `products-cta-diagnostic`, `hero-stat-{0..3}`,
`principle-{ai|rules|people}`, `lifecycle-{0..4}`, `agent-tab-{1..10}`,
`agent-panel-{1..10}`, `boundary-{automatic|approval|never}`,
`arch-{01..06}`, `phase-{0..3}`.

### 3.2 Manual — 8 checks, ~10 minutes

1. **No horizontal scroll** at 375 / 768 / 1024 / 1440 px. Every wide element
   (the ROI formula, the section jump rail) scrolls inside its own container,
   never the page body.
2. **Keyboard walk the agent board.** Tab into the list, then `↓` `↑` `Home`
   `End` must move between all ten agents and swap the panel. Focus ring must
   stay visible.
3. **Section jump rail** highlights the section you are actually looking at,
   and clicking an entry lands with the heading clear of both sticky bars
   (`scroll-mt-32`).
4. **Reduced motion.** In macOS System Settings → Accessibility → Display →
   Reduce Motion, reload: no reveal animations, no smooth scroll, all content
   visible immediately.
5. **Zoom to 200%.** No clipped text, no overlapping sticky bars.
6. **Screen reader spot-check.** The three-column control boundary must read as
   three lists, and the "Approval gate" callout must be announced with each
   agent panel.
7. **Print / PDF export** of the page still produces something a client can
   read (the navy sections invert; that is expected).
8. **Lighthouse** — Accessibility ≥ 95, no contrast failures. All colours on
   this page were checked against WCAG AA; see
   [`docs/DESIGN-SYSTEM.md` § Contrast](./DESIGN-SYSTEM.md).

---

## 4. Content ownership — read before editing copy

Three parts of this page are **compliance-load-bearing** and must not be
softened without sign-off:

1. **`OPERATING_NOTES`** in `src/data/prism-platform.js`. These say plainly
   that "HIPAA compliant and SOC 2 ready" is a readiness statement and not a
   completed independent audit, that a cloud provider touching ePHI needs a
   BAA, and that the late-2026 CMS IDR Gateway is U.S.-users-only. Removing
   them turns accurate positioning into an overclaim.
2. **`BOUNDARY` → "Never autonomous"** and every agent's `gate` field. These
   are the product's safety story. If engineering changes what an agent may do
   without a human, this copy changes in the same PR.
3. **The ROI framework.** It is stated as a formula with no promised
   percentage, deliberately. Do not add "up to X% recovery" without a measured
   pilot behind it.

Everything else — headlines, ledes, module descriptions — is normal marketing
copy. The eight module `desc` strings are carried over **verbatim** from the
current live page so the page keeps its existing search surface.

---

## 5. If `lucide-react` is older than 0.447

Swap the imports in `src/pages/Products.jsx`:

| New name | Older name |
| --- | --- |
| `ChartColumn` | `BarChart3` |
| `TriangleAlert` | `AlertTriangle` |
| `SquareCheckBig` | `CheckSquare` |
| `CircleCheckBig` | `CheckCircle2` |
| `BotMessageSquare` | `Bot` |
| `UserRoundCheck` | `UserCheck` |

Nothing else changes — the icons are only referenced through the
`MODULE_ICONS` / `PRINCIPLE_ICONS` / `BOUNDARY_ICONS` maps at the top of the
file.

---

## 6. Follow-on work this page sets up (not in scope here)

- **`/services`** should get the same `SectionHead` two-column treatment for
  visual consistency; it currently uses a single-column head.
- **Live agent board demo.** The board is presentational. The obvious next
  step is wiring one anonymised case through it as an interactive walkthrough.
- **A `/security` page.** The security section here is a summary; prospects in
  procurement will want the full control list, and it is the natural place to
  host the BAA and subprocessor list.
- **Shared `RuleGrid` / `SectionHead` components.** Both are defined locally in
  `Products.jsx`. Once a second page uses them, lift them into
  `src/components/`.
