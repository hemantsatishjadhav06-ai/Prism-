# PRISM — `/products` page rebuild

A redesign of [prism.inc/products](https://prism.inc/products) that folds the
*AI-Enabled Operating Model* proposal (July 2026) into the live product page:
the eight shipping platform modules, plus the ten-agent AI case team, the
automation boundary, the architecture, the stack, the security model, the
rollout plan and the measurement framework.

The organising idea, taken from the proposal, is one sentence:

> **AI reads and prepares. Rules calculate and control. People approve.**

The page is built so that promise is legible — every agent card names the human
who signs, and there is a whole section on what the system will never do on its
own.

---

## Look at it

```bash
open preview/products.html      # macOS
xdg-open preview/products.html  # Linux
```

One file, no build step, no dependencies. It is the finished page.

## Ship it

```
src/pages/Products.jsx        → drop-in replacement for the live route component
src/data/prism-platform.js    → all page copy, as data
```

Both match the live stack exactly: CRA + Tailwind 3 + shadcn/ui +
`lucide-react` + `react-router-dom`, brand tokens read out of the deployed
stylesheet. Existing `data-testid`s (`products-page`, `module-0…7`,
`products-cta-top`, `products-cta-bottom`) are preserved, so the current test
suite still passes.

**Start here → [`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md)** — the
step-by-step runbook, including the verification checklist.

## Docs

| File | What's in it |
| --- | --- |
| [`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md) | How to install, what to verify, what not to edit without sign-off |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Tokens, layout rules, motion budget, and every contrast ratio on the page |
| [`docs/CONTENT-MAP.md`](docs/CONTENT-MAP.md) | Every claim traced to the proposal page or the live site it came from |

## Design method

Design decisions were taken against
[ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), whose
database recommends *Accessible & Ethical + Minimalism & Swiss Style* with a
*Trust & Authority + Conversion* page pattern and a "navy/grey corporate, trust
blue, accent for CTA only" palette for B2B services in this category — which is
what PRISM already ships. Its generic SaaS defaults (glassmorphism, Plus Jakarta
Sans, an orange CTA) were deliberately **not** adopted; the reasoning is written
up in [`docs/DESIGN-SYSTEM.md` §1](docs/DESIGN-SYSTEM.md).

## Verified

- No horizontal overflow at 375 / 768 / 1024 / 1440 px (checked in Chromium).
- Every text/background pair meets WCAG 2.1 AA; most exceed AAA. Table in the
  design-system doc.
- Agent board is a keyboard-operable ARIA tablist with roving `tabindex`.
- All motion is removed under `prefers-reduced-motion: reduce`.
- Zero console errors.
