# Fernlight (fernlightapps.com)

The landing page for Fernlight, an independent app studio building beautiful, dependable everyday apps, with AI and with care.
It's a plain static site (HTML, CSS and a little JavaScript) hosted free on GitHub Pages.

## What's where

| File | What it is |
|---|---|
| `index.html` | The page itself: all the words and sections |
| `css/styles.css` | Colours, fonts, spacing, layout, the wordmark and all motion |
| `js/main.js` | Sticky nav, fade-in sections, the Inkwell preview's Write/Split/Read switch, and signup form messages |
| `404.html` | The "page not found" page |
| `assets/` | Favicon, app icons and the social share image |
| `assets/source/` | The HTML files the icons and share image are made from |
| `CNAME` | Tells GitHub Pages to use `fernlightapps.com` (don't delete it) |

## Editing the site

The easiest way is right on GitHub:

1. Open the file on github.com (for example `index.html`).
2. Click the pencil icon (Edit).
3. Make your change, then click **Commit changes**.
4. The live site updates on its own within a minute or two.

### Common edits

- **Change text:** open `index.html` and search for the words you want to change.
- **Change colours:** open `css/styles.css`. The site colours are listed at the very top: Fernlight green `--fern` (#B9DB6A), warm black `--ink` (#17150F), cream `--cream` (#F7F3EA), khaki `--sand` (#ECE4CF) and a pale sage `--sage` (#DCE6C9), used sparingly.
- **Logo:** the logo is the lowercase **fernlight** wordmark, typed in Archivo ExtraBold (search for "Wordmark" in `css/styles.css`). The icons use an "f" lettermark in fern green on warm black (`assets/favicon.svg`).
- **Fonts:** Archivo (headlines and text) and Newsreader (serif accents), loaded from Google Fonts in the `<head>` of `index.html`.
- **Contact email:** `hello@fernlightapps.com` appears in the footer of `index.html`.

## Updates form

GitHub Pages can't store form submissions, so signups go to [Buttondown](https://buttondown.com).
You'll see and export subscribers in your Buttondown dashboard, and can email them from there when you ship something new.

- The form's `action` in `index.html` ends with your Buttondown username. If you change usernames, update it there.
- Submitting opens Buttondown's confirmation in a new tab (Buttondown needs this to show a CAPTCHA if required), and the page asks the visitor to finish signing up there, then confirm by email.
- If the `action` still contains `[BUTTONDOWN USERNAME]`, the form isn't connected and shows a "coming soon" message instead.
- Recommended Buttondown settings: keep **double opt-in** on (subscribers confirm by email), and turn off open and click tracking for privacy.

## Regenerating images

The icons and share image are made from `assets/source/icon.html` and `assets/source/og-image.html`.
After editing either file, render it as a PNG in any Chromium-based browser (Chrome, Brave or Edge):

```bash
"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --headless=new --hide-scrollbars --virtual-time-budget=6000 --window-size=1200,630 --screenshot="$PWD/assets/og-image.png" "file://$PWD/assets/source/og-image.html"
```

For the icons, render `icon.html` at `512,512` to `assets/icon-512.png`, then make the smaller sizes on a Mac:

```bash
sips -z 192 192 assets/icon-512.png --out assets/icon-192.png
sips -z 180 180 assets/icon-512.png --out assets/apple-touch-icon.png
sips -z 32 32 assets/icon-512.png --out assets/favicon-32.png
```

## Previewing on your computer

From this folder, run:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080 in your browser.

## Motion

When the page loads, the headline rises in and the Inkwell phone slides up behind the cream sheet, followed by the two small cards beside it.
As you scroll, sections fade up gently and the four "How we build" cards stack on top of each other (pure CSS, `position: sticky`).
Everything animates only position and opacity, so it runs smoothly in every browser.
If a visitor's device is set to reduce motion, it's all turned off.
