# Kwacha Coffee Roasters — Website Project

WEDE5020 Portfolio of Evidence. A small-business website for Kwacha Coffee
Roasters, an independent Johannesburg specialty coffee roastery.

## Pages

- `index.html` — Home
- `about.html` — About Us
- `products.html` — Our Roasts
- `enquiry.html` — Order / wholesale enquiry with instant quote (Part 3)
- `contact.html` — Contact, map and general message form
- `faq.html` — FAQ

## Tech Stack

- HTML5
- CSS3 (mobile-first, responsive, CSS animations)
- Vanilla JavaScript (Part 3): tabs, lightbox, dynamic roast list, form validation, AJAX
- Leaflet 1.9.4 + OpenStreetMap tiles (interactive map)
- JSON data file (`data/products.json`)

## Design notes

The name "Kwacha" is a Bemba/Nyanja word meaning "it is dawn," and is also
the currency of Zambia and Malawi — two of the roastery's sourcing
countries. That double meaning drives the visual identity:

- **Colour** — roasted-bean charcoal (`#1C1712`), burnt copper (`#B4592B`)
  and dawn gold (`#C0973C`) on a warm stone paper background (`#E7E1D2`),
  rather than a generic light-cream-and-terracotta palette.
- **Type** — Fraunces (display, used for headings and italic accents) paired
  with Work Sans (body).
- **Recurring device** — an 8px "horizon band" gradient strip runs under the
  header on every page; the home page hero expands it into a small SVG
  illustration of the sun rising over layered highveld hills, standing in
  for photography until real roastery shots are available.
- **Layout** — the roast process on the home page is the only numbered
  sequence, since it's the only content that's actually sequential. Product
  and origin listings use editorial rows rather than a repeated card grid,
  and the FAQ page uses native `<details>`/`<summary>` accordions.
- **Motion** — kept deliberately narrow rather than scattered across every
  section. There's one orchestrated moment (the home hero plays an actual
  sunrise on load: the sun lifts into place, a glow blooms once, then the
  highveld ridgelines settle in after it) and one recurring cue (a single
  light sweeps the horizon band once per page load, echoing the same
  dawn-breaking idea on every page without repeating the full hero
  sequence). Everything else only moves in response to what someone does:
  the nav underline, the button press state, and the FAQ accordion, which
  now opens and closes with an animated height transition in `js/faq.js`
  instead of snapping instantly. All of it is switched off automatically
  for anyone with `prefers-reduced-motion: reduce` set.

## Changelog

### Part 1
- Initial HTML file structure created (5 pages).
- Consistent header, navigation, and footer across all pages.

### Part 2
- Linked Google Fonts (Fraunces for headings, Work Sans for body text).
- Added CSS reset and base styles (colour scheme, box-sizing, base
  typography).
- Styled header/navigation using Flexbox, with a dark header and a
  horizon-gradient band as a recurring brand device.
- Built the home hero with Flexbox and an inline SVG dawn illustration in
  place of a stock photo.
- Rewrote copy across all five pages with specific, roastery-grounded
  content (sourcing countries, roast process, team roles) instead of
  placeholder text.
- Replaced the repeated card-grid pattern with an editorial row list
  (home, products) and a numbered sequence only where the content is
  genuinely sequential (roast process).
- Converted the FAQ page to a native accordion using `<details>`/`<summary>`.
- Styled the enquiry form with underline inputs instead of boxed fields.
- Added responsive breakpoints at 768px (tablet) and 480px (mobile).

### Part 3

**A. Changes from Part 2 feedback**
- _Add your lecturer's feedback here._ One entry per comment: what was said,
  what you changed, which file, and why.
- Other fixes made while preparing Part 3:
  - Added the missing `horizon-band` under the header on `index.html`.
  - Added real photos in `images/` with descriptive file names and `alt` text.
  - Darkened the copper colour slightly so text passes colour-contrast checks.
  - Added a skip-to-content link and `aria-current="page"` on the nav.

**B. JavaScript (all plain JavaScript, no libraries except Leaflet)**
- `js/main.js` - "Open now" badge (Johannesburg time) and next roast day.
- `js/faq.js` - animated FAQ accordion (from Part 2).
- `js/about.js` - tabs (About page) and the photo gallery lightbox.
- `js/products.js` - loads `data/products.json` with `fetch` (AJAX), then lets
  the visitor search, filter by roast level and sort. Cards are built with
  template strings.
- `js/map.js` - interactive map on the Contact page (Leaflet +
  OpenStreetMap): roastery marker, 15 km delivery area, and a "how far am I?"
  button that only asks for location when pressed.
- `js/forms.js` - validation for both forms (see C).
- Animation is kept simple: the Part 2 sunrise on the home page, the FAQ
  accordion, hover colour changes, and the lightbox.

**C. Forms**
- `enquiry.html` - name, email, South African phone number, enquiry type,
  roast, quantity, grind, collection or delivery. When everything is valid the
  page shows a quote (15% wholesale discount from 10 bags, R60 delivery under
  R400) and a stock message.
- `contact.html` - name, email, optional phone, message type, subject and a
  message of 20-600 characters with a live counter. Valid messages are sent
  with AJAX, then compiled into a `mailto:` link to
  `hello@kwachacoffee.co.za` (set at the top of `js/forms.js`).
- Validation uses HTML5 attributes (`required`, `type`, `min`, `max`,
  `maxlength`) plus JavaScript checks. Errors appear under each field.
- Note: the AJAX address in `forms.js` is a public demo service. Replace it
  with a real form service before relying on it. Stock levels in
  `products.json` are sample data.

**D. SEO**
- Keyword research: _specialty coffee Johannesburg_, _coffee roaster
  Brixton_, _single origin coffee_, _fresh roasted coffee delivery_.
- Unique `<title>` and meta description on every page, canonical links, Open
  Graph tags.
- One `<h1>` per page with headings in order; descriptive image file names
  and alt text; clean file names for URLs; internal links between pages.
- Mobile friendly: viewport meta and the responsive breakpoints from Part 2.
- Structured data (JSON-LD): local business on the home page, FAQ on the FAQ
  page.
- Local SEO: Brixton and Johannesburg in titles, copy, structured data and
  the map. Plan: set up a Google Business Profile.
- Off-page plan: ask partner cafes to link to the roast list; share pages on
  Instagram and Facebook.
- `robots.txt` and `sitemap.xml` added.
- Page speed: compressed images with thumbnails, no frameworks, one CSS file.
- Security: Content-Security-Policy meta tag, referrer policy, `rel` values on
  outside links, and input checked in the browser (a real server must check
  it again).

**E. Deployment**
- Publish with GitHub Pages (Settings, Pages, deploy from `main`). The
  canonical, sitemap and Open Graph URLs assume
  `https://km1211266-eng.github.io/Wede-but-better/kwacha-coffee-roasters/`.
  Change them if your link is different. `robots.txt` is only read from a
  domain root, so it fully works on a custom domain or Netlify.
- Because `products.json` is loaded with `fetch`, open the site with a local
  server (for example the VS Code Live Server extension) rather than by
  double-clicking the HTML files.

## References

American Heritage Dictionary (2022) *Kwacha*. 5th edn. Boston: HarperCollins
Publishers. Available at: https://www.ahdictionary.com/word/search.html?q=kwacha
(Accessed: 18 September 2026).

Google Fonts (no date) *Fraunces*. Available at:
https://fonts.google.com/specimen/Fraunces/about (Accessed: 18 September
2026).

Google Fonts (no date) *Work Sans*. Available at:
https://fonts.google.com/specimen/Work+Sans/about (Accessed: 18 September
2026).

Merriam-Webster (no date) *Kwacha*. Available at:
https://www.merriam-webster.com/dictionary/kwacha (Accessed: 18 September
2026).

Mozilla Developer Network (no date) *&lt;details&gt;: The Details disclosure
element*. Available at:
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details (Accessed:
18 September 2026).

Leaflet (2023) *Leaflet: an open-source JavaScript library for interactive
maps*, v1.9.4. Available at: https://leafletjs.com (Accessed: 15 October
2026).

OpenStreetMap contributors (no date) *OpenStreetMap*. Available at:
https://www.openstreetmap.org/copyright (Accessed: 15 October 2026).

Google Search Central (no date) *SEO starter guide*. Available at:
https://developers.google.com/search/docs/fundamentals/seo-starter-guide
(Accessed: 15 October 2026).

Mozilla Developer Network (no date) *Content Security Policy (CSP)*.
Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
(Accessed: 15 October 2026).

Mozilla Developer Network (no date) *Fetch API*. Available at:
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API (Accessed: 15
October 2026).

Schema.org (no date) *CafeOrCoffeeShop*. Available at:
https://schema.org/CafeOrCoffeeShop (Accessed: 15 October 2026).

W3C (no date) *ARIA Authoring Practices Guide: Tabs pattern*. Available at:
https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ (Accessed: 15 October 2026).

Mozilla Developer Network (no date) *CSS animations*. Available at:
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations (Accessed:
18 September 2026).

Mozilla Developer Network (no date) *prefers-reduced-motion*. Available at:
https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
(Accessed: 18 September 2026).

South African History Online (2013) *28 August 1970 — Malawi replaces the
Malawian pound with the Kwacha*. Available at:
https://sahistory.org.za/node/96343 (Accessed: 18 September 2026).

W3C Web Accessibility Initiative (2023) *Understanding Success Criterion
2.3.3: Animation from Interactions*. Available at:
https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
(Accessed: 18 September 2026).

All page copy, roast/origin details, pricing and team descriptions are
original content written for this project and are not drawn from an
external source.
