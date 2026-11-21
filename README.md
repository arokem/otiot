# Otiot (Hebrew letters practice)

Standalone static web app (GitHub Pages–friendly) to practice Hebrew letter recognition and pronunciation.

## Features (MVP)

- Two modes:
  - **Letters only**: base Hebrew letters + final forms.
  - **Letters + nikud**: generated combinations of letter forms with a teaching set of niqqud marks.
- Flashcards: large Hebrew display, **Play pronunciation** (Web Speech API, `he-IL`), **Next**, **Shuffle**.
- Mobile-first, touch-friendly UI.

## Run locally

Because the app uses plain static files, run a local HTTP server from the repo root:

```bash
cd /path/to/otiot
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

> Opening `index.html` via `file://` may work in some browsers but is not recommended.

## Data notes

- Letter scope: **22 base letters** (א–ת) plus **5 final forms** (ך, ם, ן, ף, ץ) = **27** forms.
- Nikud scope: a practical teaching set of niqqud marks defined in `data/hebrew.js` (vowels + shin/sin dots + dagesh). “All nikud marks” in a Unicode sense is broader; this set matches common pronunciation/recognition practice.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Source** to “Deploy from a branch”.
3. Choose branch **`main`** (or your default) and folder **`/ (root)`**.
4. Save. Your site will be published at the URL shown by GitHub Pages.

All paths are relative, so the site works from the Pages root URL.

## Project structure

- `index.html` — app shell
- `styles.css` — styles
- `app.js` — app logic (flashcards, Web Speech)
- `data/hebrew.js` — letter/nikud data and generated cards (`window.HEBREW_DATA`)
