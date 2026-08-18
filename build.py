#!/usr/bin/env python3
"""
Static-site build for prism.inc.

Every page is a body fragment in build/pages/. This script wraps each one in
the shared shell — <head>, masthead with the real PRISM logo, and the site
footer — and writes the result to site/. That means the header, the nav, the
logo and the contact details exist exactly once in this repo.

    python3 build.py

site/ is committed, so Render serves it directly with no build step.
"""

from pathlib import Path

ROOT = Path(__file__).parent
PAGES = ROOT / "build" / "pages"
OUT = ROOT / "site"

SITE_NAME = "PRISM Inc."
EMAIL = "info@prism.inc"
LOCATION = "United States"
YEAR = 2026

NAV = [
    ("Home", "/", "index.html"),
    ("Products", "/products", "products.html"),
    ("AI Agents", "/ai-agents", "ai-agents.html"),
    ("Services", "/services", "services.html"),
    ("About", "/about", "about.html"),
    ("Contact", "/contact", "contact.html"),
]

ICON_ARROW = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
              '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>')
ICON_MENU = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
             'stroke-linecap="round" aria-hidden="true">'
             '<path d="M4 7h16M4 12h16M4 17h16"/></svg>')
ICON_MAIL = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
             'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
             '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>'
             '<rect x="2" y="4" width="20" height="16" rx="2"/></svg>')
ICON_PIN = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0'
            'C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>'
            '<circle cx="12" cy="10" r="3"/></svg>')


def nav_links(current, mobile=False):
    out = []
    for label, href, filename in NAV:
        cur = ' aria-current="page"' if filename == current else ""
        prefix = "mobile-" if mobile else ""
        out.append(
            f'<a href="{href}" data-testid="{prefix}nav-{label.lower().replace(" ", "-")}"{cur}>{label}</a>'
        )
    return "\n        ".join(out)


def masthead(current):
    return f"""<header class="masthead">
  <div class="shell">
    <a class="brand" href="/" data-testid="navbar-logo-link" aria-label="{SITE_NAME} — home">
      <img src="/assets/prism-logo.png" width="480" height="270" alt="PRISM" />
    </a>
    <nav class="nav-main" aria-label="Primary">
        {nav_links(current)}
    </nav>
    <a class="btn btn-primary" href="/contact" data-testid="navbar-cta-button">Request Consultation</a>
    <button class="navtoggle" data-nav-toggle type="button" aria-expanded="false"
            aria-controls="nav-drawer" aria-label="Open menu" data-testid="navbar-mobile-toggle">
      {ICON_MENU}
    </button>
  </div>
  <div class="navdrawer" id="nav-drawer">
    <div class="shell">
        {nav_links(current, mobile=True)}
      <a class="btn btn-primary" href="/contact">Request Consultation {ICON_ARROW}</a>
    </div>
  </div>
</header>"""


def footer():
    links = "\n          ".join(
        f'<li><a href="{href}" data-testid="footer-link-{label.lower().replace(" ", "-")}">{label}</a></li>'
        for label, href, _ in NAV
    )
    return f"""<footer class="sitefoot" data-testid="site-footer">
  <div class="shell">
    <div class="footgrid">
      <div>
        <span class="footlogo"><img src="/assets/prism-logo.png" width="480" height="270" alt="PRISM" /></span>
        <p class="blurb">
          Payment Resolution &amp; IDR System Management. We help healthcare providers recover
          what they're owed under the No Surprises Act through proprietary software and
          white-glove IDR consulting.
        </p>
      </div>
      <div>
        <p class="overline">Navigate</p>
        <ul>
          {links}
        </ul>
      </div>
      <div>
        <p class="overline">Contact</p>
        <ul class="contact">
          <li>{ICON_MAIL}<a href="mailto:{EMAIL}" data-testid="footer-email">{EMAIL}</a></li>
          <li>{ICON_PIN}<span>{LOCATION}</span></li>
        </ul>
      </div>
    </div>
    <div class="footbar">
      <p>&copy; {YEAR} {SITE_NAME} All rights reserved. HIPAA compliant. SOC 2 ready.</p>
      <div><span>Privacy Policy</span><span>Terms of Service</span><span>Compliance</span></div>
    </div>
  </div>
</footer>"""


def shell(*, filename, title, description, body):
    canonical = "https://prism.inc/" + ("" if filename == "index.html" else filename.replace(".html", ""))
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#0A2540" />
<title>{title}</title>
<meta name="description" content="{description}" />
<link rel="canonical" href="{canonical}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="{SITE_NAME}" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:image" content="https://prism.inc/assets/prism-logo.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/assets/prism-logo.png" />
<link rel="apple-touch-icon" href="/assets/prism-logo.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/prism.css" />
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

{masthead(filename)}

{body}

{footer()}

<script src="/assets/prism.js" defer></script>
</body>
</html>
"""


META = {
    "index.html": (
        "PRISM Inc. — Payment Resolution &amp; IDR System Management",
        "Out-of-network claims, resolved with precision. PRISM combines proprietary IDR software "
        "with white-glove consulting to maximize recovery under the No Surprises Act.",
    ),
    "products.html": (
        "The PRISM IDR Platform — Products",
        "A complete operating system for No Surprises Act dispute management. Eight integrated "
        "modules and a ten-agent AI case team. AI prepares, rules control, people approve.",
    ),
    "ai-agents.html": (
        "The AI case team — how the work flows | PRISM",
        "Five stages, ten agents, ten human approval gates. Exactly what the AI prepares and "
        "exactly what a person signs, at every step of an IDR dispute.",
    ),
    "services.html": (
        "White-glove IDR consulting — Services | PRISM",
        "PRISM's IDR specialists handle the entire arbitration lifecycle on your behalf, with "
        "results-based pricing.",
    ),
    "about.html": (
        "About PRISM — fair compensation for the people who deliver care",
        "PRISM stands for Payment Resolution &amp; IDR System Management. We turn the No Surprises "
        "Act from a paperwork burden into your competitive advantage.",
    ),
    "contact.html": (
        "Contact PRISM — let's talk recovery",
        "Tell us about your practice and current IDR pain points. We respond within one business "
        "day with a recommended next step.",
    ),
    "404.html": (
        "Page not found | PRISM Inc.",
        "That page doesn't exist. Head back to the PRISM homepage.",
    ),
}


def main():
    OUT.mkdir(exist_ok=True)
    built = []
    for filename, (title, description) in META.items():
        fragment = PAGES / filename
        if not fragment.exists():
            raise SystemExit(f"missing page fragment: {fragment}")
        html = shell(
            filename=filename,
            title=title,
            description=description,
            body=fragment.read_text(),
        )
        (OUT / filename).write_text(html)
        built.append(f"  site/{filename}  ({len(html):,} bytes)")
    print("built:\n" + "\n".join(built))


if __name__ == "__main__":
    main()
