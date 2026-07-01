# E-Power Motors — Elementor implementation package

This folder repackages the static reference build at the repo root
(`index.html` + `css/style.css` + `js/main.js`) into pieces you can paste
directly into Elementor on your live WordPress + WooCommerce site
(e-power.ma). **Nothing about the design was changed** — every class, ID,
and CSS custom property was renamed to a `ep-redesign-` prefix so it can't
collide with your theme or other plugins, and the JS was wrapped in an
IIFE so it doesn't leak globals. Logic, markup, and visuals are otherwise
identical to the root build (verified with an automated browser check
after the rename — counters, slider math, nav toggle, and image fallback
all still behave the same).

```
wordpress-elementor/
├── README.md                 ← this file
├── css/ep-redesign.css       ← one stylesheet, paste into WPCode (or split per-section — see below)
├── js/ep-redesign.js         ← one script, paste into WPCode
└── sections/
    ├── 01-header.html
    ├── 02-hero.html
    ├── 03-why-choose-us.html
    ├── 04-stats.html
    ├── 05-dual-cta.html
    ├── 06-feature-highlights.html
    ├── 07-product-grid.html      ← ⚠ WooCommerce dynamic — see below
    ├── 08-feature-tiles.html
    ├── 09-performance.html
    ├── 10-calculator.html
    ├── 11-blog.html              ← optionally dynamic (WP posts)
    ├── 12-final-cta-marquee.html
    ├── 13-gallery.html
    ├── 14-trust-badges.html
    ├── 15-footer.html
    └── 16-mobile-sticky-cta.html ← ⚠ site-wide overlay, not a page section
```

---

## 1. How your 9 sections map to these 16 files

The prototype has more granular blocks than your current page structure.
Nothing was cut — the extra blocks are grouped under the closest matching
section, with the "extra" ones called out so you can decide whether to
include them at all.

| Your section       | Files                                                              | Notes |
|---------------------|---------------------------------------------------------------------|-------|
| **Header**           | `01-header.html`                                                   | See §4 — this is site chrome, not page content. |
| **Hero**             | `02-hero.html`                                                     | |
| **Why Choose Us**    | `03-why-choose-us.html`                                            | 5 static feature cards. |
| **Stats**            | `04-stats.html`                                                    | 4 animated stat cards (count-up + pulse ring). |
| *(new)* Dual CTA     | `05-dual-cta.html`                                                 | Not in your current page — "Book a test ride" / "Become a reseller." Drop it if you don't want it. |
| **Features**         | `06-feature-highlights.html`, `08-feature-tiles.html`, `09-performance.html` | The prototype splits "features" into 3 blocks: a 5-icon strip, a 4-card tile grid, and a big performance stat + 2 image/text rows. Use one, two, or all three under your "Features" section. |
| **Product Grid**     | `07-product-grid.html`                                             | ⚠ **Static placeholder for ZL9/ZL3/SY — see §2, rebuild as WooCommerce.** |
| **Calculator**       | `10-calculator.html`                                               | Fully self-contained interactive block (needs the JS file). |
| **Blog**             | `11-blog.html`                                                     | Static 3-card teaser. Optionally make dynamic — see §3. |
| *(new)* Final CTA    | `12-final-cta-marquee.html`                                        | Closing CTA banner + scrolling city/model marquee. |
| *(new)* Gallery      | `13-gallery.html`                                                  | ZL9 photo grid. |
| *(new)* Trust badges | `14-trust-badges.html`                                             | 5-icon trust strip. |
| **Footer**           | `15-footer.html`                                                   | See §4 — site chrome, not page content. |
| *(new)* Mobile CTA   | `16-mobile-sticky-cta.html`                                        | See §4 — site-wide overlay, not page content. |

---

## 2. ⚠ Product Grid — needs to be rebuilt as WooCommerce (not pasted as-is)

`07-product-grid.html` is **static HTML** with the ZL9/ZL3/SY names, specs,
and prices hand-typed in. It will *not* reflect stock, price changes, or
new products in your shop. Paste it in only as a **temporary visual
reference** while you rebuild the real thing — then delete it.

The design's product card shows data WooCommerce doesn't store natively:
a "FLAGSHIP" badge, three icon+text spec chips (range / battery type /
power), a price, and a CTA button. To reproduce this dynamically you have
two realistic paths:

**Option A — Elementor Pro Loop Grid (recommended if you have Pro):**
1. Add the spec values as WooCommerce **product attributes** (e.g.
   `Autonomie`, `Type de batterie`, `Puissance`) or ACF fields on each
   product (ZL9, ZL3, SY).
2. Templates → Loop Templates → create a "Product" loop item.
3. Inside the loop template, rebuild the card structure from
   `07-product-grid.html` using Elementor widgets (Image, Heading, three
   Text/Icon-list widgets for the specs, Price dynamic tag, Button), and
   on **each widget's Advanced → CSS Classes** field, apply the matching
   class from the reference file (`ep-redesign-product-card__media`,
   `ep-redesign-spec-chip`, `ep-redesign-product-card__price`, etc.). The
   CSS in `css/ep-redesign.css` will then style it identically — you're
   just swapping static HTML for Elementor's dynamic widgets wearing the
   same classes.
4. Use a **Loop Grid** widget on the page, source = Products, manual
   selection = your 3 models (or a "Featured" category), columns = 3.
5. Add the "FLAGSHIP" badge manually on the ZL9 loop item only (condition
   on product ID, or a dedicated product tag).

**Option B — faster, less pixel-perfect (no Elementor Pro needed):**
Use Elementor's free **Shortcode widget** with WooCommerce's built-in
shortcode, e.g. `[products ids="123,456,789"]`, then use the CSS in
`css/ep-redesign.css` to re-skin WooCommerce's own markup
(`.woocommerce ul.products li.product`, `.price`, `.button`, etc.) rather
than the `ep-redesign-product-card` classes, which only apply to the
custom markup. This gets you real stock/price data fast but won't have
the spec chips or badge without further custom work (WooCommerce doesn't
render arbitrary attributes on the shop-loop card by default).

Either way, budget this as the most involved piece of the port — everything
else in this package is a straight copy-paste.

---

## 3. Blog — optional dynamic upgrade

`11-blog.html` is static placeholder copy. If you want it to show your
actual latest posts, swap it for Elementor's **Posts** widget (or **Loop
Grid** if you have Pro) querying your blog category, and apply the
`ep-redesign-blog-card`, `ep-redesign-blog-card__media`,
`ep-redesign-blog-card__tag` etc. classes to the corresponding
sub-widgets the same way as described for products in §2. If you're fine
hand-editing 3 teaser cards occasionally, the static version is a
perfectly reasonable permanent choice — this one is genuinely optional.

---

## 4. Header, Footer, and the Mobile Sticky CTA are *not* regular page content

Unlike the other files, these three exist outside your page body in a
typical Elementor setup:

- **`01-header.html`** and **`15-footer.html`** are your site-wide nav and
  footer. If you already have a header/footer built in **Elementor Theme
  Builder** (Templates → Theme Builder), decide once whether you're
  replacing it with this design or keeping what you have — don't paste
  these into a regular content page, or you'll get a duplicate
  header/footer on top of your theme's real one.
- **`16-mobile-sticky-cta.html`** is a fixed-position bar pinned to the
  bottom of the viewport on mobile only (`@media max-width: 860px` in the
  CSS). It's meant to appear on every page, not just the homepage. The
  simplest install is a **WPCode "HTML Snippet"** with Insertion set to
  *Insert Before `</body>`*, **Site Wide** — paste the file's contents
  there rather than adding it as a page widget.

---

## 5. Global setup (do this once, before building any section)

1. **Fonts** — the design uses Space Grotesk (headings) and Manrope
   (body). Add via a WPCode **HTML Snippet**, location *Site Wide
   Header*:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
   ```
   (Skip this if you already load these fonts another way — just confirm
   the family names match exactly.)

2. **CSS** — WPCode → Add Snippet → **CSS Snippet** → paste all of
   `css/ep-redesign.css` → Insertion: *Auto Insert, Site Wide Header* →
   Activate.

3. **JS** — WPCode → Add Snippet → **JS Snippet** → paste all of
   `js/ep-redesign.js` → Insertion: *Auto Insert, Site Wide Footer*
   (before `</body>`) → Activate. It's safe to load on every page: each
   feature (nav toggle, counters, calculator) checks for its own elements
   and does nothing if they're not on the current page.

4. **Elementor container settings** — for every section you build, put
   the "HTML" widget inside an Elementor **Section/Container** set to:
   - Content Width: **Full Width**
   - Padding: **0** on all sides
   
   Our own `.ep-redesign-container` class handles the `min(1280px, 92vw)`
   max-width and centering internally, and several sections (header,
   alternating dark stripes, hero/CTA glows) are designed to bleed
   edge-to-edge. Elementor's default section padding will otherwise throw
   off the spacing and clip the glow effects.

5. **Use the HTML widget, not a text/WYSIWYG widget.** Elementor's
   dedicated "HTML" widget passes markup through untouched. A Text Editor
   widget runs content through WordPress's `wpautop` filter, which will
   inject stray `<p>` tags into the markup and break the layout.

6. **Images** — every `<img>` in these files has a placeholder `src`
   (e.g. `images/hero-scooter.jpg`) that intentionally 404s; the JS hides
   it gracefully so the decorative pattern shows through until you swap
   it. Before publishing each section, replace those `src` values with
   real Media Library URLs. See `../images/PLACEHOLDERS.md` at the repo
   root for what each placeholder is meant to show.

---

## 6. Animations & interactions — confirmed preserved

Nothing was simplified or dropped during the rename. What's live in this
package, unchanged from the design:

- **Count-up numbers** (Hero stats, Stats section, Performance "0–50
  km/h in 4.5 sec") — animate on scroll via `IntersectionObserver` +
  eased `requestAnimationFrame`, in `js/ep-redesign.js`.
- **Pulse rings** on the 4 Stats icons — CSS `@keyframes
  epRedesignPulseRing`, staggered animation-delay per card.
- **Scrolling marquee** ticker in the Final CTA section — CSS
  `@keyframes epRedesignMarquee`, infinite linear loop.
- **Savings calculator** — live slider drag recalculates fuel vs.
  electric cost and repaints the slider's fill gradient on every
  `input` event, in `js/ep-redesign.js`.
- **Hover states** — button lift (`translateY(-2px)`), card border-color
  glow on Why/Feature/Blog cards, product card lift + border glow,
  footer link/social color transitions — all still plain CSS `:hover`.
- **Mobile nav toggle** — burger button opens/closes the mobile menu
  (`.is-open` class), `aria-expanded` kept in sync.
- **Broken-image fallback** — hides a placeholder `<img>` the instant it
  fails to load (handles the case where the 404 resolves before the
  script attaches, which is common on fast connections).

---

## 7. Suggested implementation order (staging first)

Do all of this on a staging copy of the site before touching production.
Order is chosen so each step validates the previous one before you take
on more risk/complexity:

1. **Global setup** (§5) — fonts, CSS snippet, JS snippet. Nothing is
   visible yet; this just makes the classes available.
2. **Header** — small, high-visibility, easy to confirm the burger menu
   and sticky behavior work before building anything else.
3. **Hero** — biggest visual gut-check: fonts, buttons, the count-up
   stats, and the glow effects all show up here. If this looks right, the
   design tokens are wired correctly.
4. **Why Choose Us**, **Stats** — static-ish content, low risk, confirms
   the pulse-ring animation and grid responsiveness at 860px.
5. **Product Grid** — do the WooCommerce rebuild (§2) now, in isolation,
   before adding more sections around it. This is the one piece that
   isn't a copy-paste, so give it its own test pass.
6. **Features** (highlights / tiles / performance) — static content,
   confirms the alternating image/text rows and responsive stacking.
7. **Calculator** — most complex JS on the page; test slider dragging and
   number formatting thoroughly once everything else is confirmed stable.
8. **Dual CTA, Final CTA + Marquee, Gallery, Trust badges** — remaining
   static sections, any order.
9. **Blog** — static, or wire up the dynamic Posts/Loop Grid version
   (§3).
10. **Footer**.
11. **Mobile Sticky CTA** — add last, since it's a site-wide overlay that
    will appear on every page immediately once the WPCode snippet is
    live; confirm everything else first.

Swap in real image URLs (§5.6) as you go, section by section, rather than
all at once at the end — it's much easier to spot a wrong image on one
freshly-built section than to audit the whole page later.
