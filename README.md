# Fernlight — fernlightapps.com

The landing page for Fernlight, an independent studio building AI-powered apps and services.
It's a plain static site (HTML, CSS and a little JavaScript) hosted free on GitHub Pages.

## What's where

| File | What it is |
|---|---|
| `index.html` | The page itself: all the words and sections |
| `css/styles.css` | Colours, fonts, spacing, layout and all animations |
| `js/main.js` | Light/dark toggle, nav highlight, scroll animations for older browsers, waitlist message |
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
- **Change colours:** open `css/styles.css`. The colours are listed at the very top: the first block is dark mode, the `[data-theme="light"]` block is light mode.
- **Add the founder photo:** upload a photo to `assets/` (for example `founder.jpg`), then in `index.html` find `[FOUNDER PHOTO]` and follow the comment just above it.

### Placeholders to fill in

Search `index.html` for these and replace them:

- `[YOUR NAME]`: your name in the "Note from the studio" section
- `[FOUNDER PHOTO]`: see above
- `[FIRST APP NAME]`: the name of your first app
- `[APP NAME]`: shown in the small notification mock-up
- `hello@fernlightapps.com`: change it if your contact email is different (it appears in two places)

## Waitlist form

GitHub Pages can't store form submissions, so the form isn't connected yet.
For now it shows a "coming soon" message when someone submits it.
Connecting a form service needs a small change in `index.html` (the form's `action`) and `js/main.js` (section 5).

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

## Browser support

The scroll animations use modern CSS where the browser supports it (Chrome, Edge, Brave, Safari 26+).
In other browsers (Firefox, older Safari), `js/main.js` plays the same animations instead.
If a visitor's device is set to reduce motion, all animation is turned off.
