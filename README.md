# PRISM Inc. — website

The full prism.inc site: six pages, the real PRISM logo and brand, and the
ten-agent AI case team folded in throughout. Built as a static site so a Render
deploy is "copy these files to the CDN" — no build step, nothing to break.

The organising idea, from the *AI-Enabled Operating Model* proposal:

> **AI reads and prepares. Rules calculate and control. People approve.**

---

## Look at it

```bash
python3 -m http.server 8000 --directory site
# then open http://localhost:8000
```

## Deploy it

**[`docs/DEPLOY-RENDER.md`](docs/DEPLOY-RENDER.md)** — settings for the existing
Render service, the blueprint alternative, and the errors that actually bite.

Short version: Static Site · publish directory `site` · **build command empty**.

---

## Pages

| Route | What's on it |
| --- | --- |
| `/` | Hero, four value props, the AI case team strip, the platform, client outcome, FAQ |
| `/products` | The eight platform modules, the ten agents (interactive board), the automation boundary, architecture, tool gateway, security, rollout, measurement |
| `/ai-agents` | **The flow** — five stages showing what the AI prepares and what a person signs, plus the roster and the hard limits |
| `/services` | The six consulting services, how we work, the bench |
| `/about` | The PRISM acronym, who we help, the mission, four operating values |
| `/contact` | Form (with a mailto fallback), direct contact, what happens next |
| `/404` | Not-found page with routes back into the site |

## Repo layout

```
site/                  what Render serves — committed, no build required
  assets/              prism.css, prism.js, prism-logo.png (the real logo)
build/pages/*.html     page bodies; the shared shell lives in build.py
build.py               regenerates site/ from build/pages/
render.yaml            Render blueprint: static site, clean URLs, security headers
docs/                  deploy guide, design system, content map, the flow PDF
src/                   drop-in React Products page, if you keep the SPA instead
preview/products.html  standalone single-file preview of the Products page
```

Edit a page body in `build/pages/`, run `python3 build.py`, commit `site/`.
The header, nav, logo and contact details exist **once**, in `build.py`.

## The flow PDF

**[`docs/PRISM-AI-Agent-Flow.pdf`](docs/PRISM-AI-Agent-Flow.pdf)** — four pages,
A4 landscape: the principle, the five-stage flow, the ten agents with the human
who signs for each, and the ten gates plus the five hard limits. Regenerate it
from `docs/pdf/ai-agent-flow.html`.

## Docs

| File | What's in it |
| --- | --- |
| [`docs/DEPLOY-RENDER.md`](docs/DEPLOY-RENDER.md) | Render settings, blueprint, failure modes |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Tokens, layout rules, motion budget, every contrast ratio |
| [`docs/CONTENT-MAP.md`](docs/CONTENT-MAP.md) | Every claim traced to its source |
| [`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md) | Porting the Products page into the React SPA instead |

## Verified

Checked in Chromium against a server that imitates Render's static routing:

- All 7 pages render at **375 / 768 / 1024 / 1440** with no horizontal overflow.
- No console errors; every image loads; exactly one `<h1>` per page.
- Every internal link resolves to a route that exists.
- Every text/background pair meets WCAG 2.1 AA; most exceed AAA.
- Mobile nav drawer, the Products agent board (ARIA tablist, arrow keys), and
  the contact form's offline fallback all work.
- All motion is removed under `prefers-reduced-motion: reduce`.

## Content note

The compliance-sensitive lines are deliberate and shouldn't be softened without
sign-off: HIPAA/SOC 2 **readiness** is not a completed audit; a cloud provider
touching ePHI needs a BAA; the late-2026 CMS IDR Gateway is US-users-only; and
no recovery percentage or time saving is claimed anywhere. See
[`docs/CONTENT-MAP.md`](docs/CONTENT-MAP.md).
