# Deploying to Render

Target service: **`rnd_3c9MqNoZQ2gqRf7LII58YGe9jPT1`**

---

## Status: I could not reach your Render account

This session has **no Render credentials** — no `RENDER_API_KEY`, no Render CLI,
and no Render MCP server. I checked. So I could not open that service, read its
deploy logs, or trigger a deploy, and I'm not going to claim otherwise.

What I did instead is remove the reasons a deploy of this repo would fail, and
verify the site end-to-end locally against a server that imitates Render's
static routing.

**To have me finish it:** set `RENDER_API_KEY` in this environment (an Owner-
scoped key from Render → Account Settings → API Keys). With that I can read the
service, pull the failed deploy's logs, fix the actual error, and redeploy.
Otherwise the settings below take about two minutes by hand.

---

## Settings for the existing service

Render Dashboard → your service → **Settings**:

| Setting | Value |
| --- | --- |
| Service type | **Static Site** |
| Repository | `hemantsatishjadhav06-ai/Prism-` |
| Branch | `claude/prism-products-ui-ux-lhyszd` |
| Root directory | *(blank)* |
| **Build command** | *(blank — leave it empty)* |
| **Publish directory** | `site` |

Then **Manual Deploy → Deploy latest commit**.

If the service was created as a **Web Service** rather than a **Static Site**,
it cannot be converted. Delete it and create a new Static Site, or use the
blueprint below — either way you get a new service ID.

### Or use the blueprint

[`render.yaml`](../render.yaml) at the repo root describes the whole thing.
Render Dashboard → **Blueprints → New Blueprint Instance** → pick this repo. It
creates the static site, the clean-URL rewrites and the security headers in one
step.

---

## Why the build command is empty

`site/` is **committed**. A deploy is "copy these files to the CDN" — there is
no toolchain to install, no dependency to resolve, and no build step that can
fail. This is deliberate: it removes the single largest source of Render deploy
failures.

`build.py` regenerates `site/` from `build/pages/` and is a local convenience:

```bash
python3 build.py     # then commit the regenerated site/
```

If you would rather Render build on every deploy, set the build command to
`python3 build.py` — but then a Python change in Render's build image can break
your deploy, and today it cannot.

---

## The errors that actually bite on Render

Symptoms first, since you can match them against your logs:

| What you see | Cause | Fix |
| --- | --- | --- |
| `==> Build failed 😞` with no useful output | Build command set on a repo with no `package.json` | Clear the build command |
| Deploy succeeds, site shows **Not Found** | Publish directory wrong | Set it to `site`, not `.` or `dist` |
| Deploy succeeds, blank white page | Publish directory points at a folder with no `index.html` | Set it to `site` |
| `/products` 404s but `/products.html` works | Clean-URL rewrites missing | Use `render.yaml`, or add the rewrites in Settings → Redirects/Rewrites |
| `npm: command not found` / `vite: not found` | Service type is Web Service, or a stale build command | Static Site + empty build command |
| CSS loads locally, not on Render | Relative asset paths | Already handled — every asset here is referenced absolutely (`/assets/...`) |
| Old content after a deploy | HTML cached at the edge | Already handled — `render.yaml` sets `Cache-Control: no-cache` on HTML |

---

## After it goes live

1. Visit `/`, `/products`, `/ai-agents`, `/services`, `/about`, `/contact` and
   one nonsense path to confirm the 404 renders.
2. Check the logo loads at `/assets/prism-logo.png`.
3. Point your custom domain at the service (Settings → Custom Domains) and let
   Render issue the certificate.

### One thing to decide: the contact form

The form posts to `https://billing-hub-206.emergent.host/api/contact` — the
same backend the current site uses. Two things to check once you're live:

- That backend must send `Access-Control-Allow-Origin` for the new Render
  origin, or the browser will block the request.
- If you'd rather point somewhere else, change one attribute — the
  `data-endpoint` on the `<form>` in `build/pages/contact.html` — and rebuild.

If the request fails for any reason the form does **not** silently die: the
visitor is offered a `mailto:` link with their answers already filled in. That
was deliberate, so a backend problem never costs you a lead.
