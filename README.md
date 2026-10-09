# Icon Kin | Living Design Lab

A free static, local-first icon-family workbench. **Prototype 0.1**, not a full plugin or automated visual-language research engine. No account, backend, paid API or external JS library is required.

## Use the hosted workbench

Visit the GitHub Pages URL after deployment. Open **Load example** to start with synthetic sample references and eight icons, or import your own reference images. To retain changes, explicitly choose **Save project** and download a `*.iconkin.json` file. Reopen a project with **Open project**. The site does **not** upload projects to GitHub or auto-save their contents; do not rely on the browser tab to keep unsaved work.

## Publish for free with GitHub Pages

1. Create a **public** GitHub repository named `icon-kin` (or another name).
2. Put the files from this repository's root in the repository root, especially `index.html`, `style.css`, `app.js`, and `.nojekyll`.
3. In the repository, go to **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, select **main**, choose **/(root)**, then save.
5. The website will appear at `https://YOUR-USERNAME.github.io/icon-kin/` when deployment completes. If you pick another repository name, change the trailing URL segment.

The repository is public. Do **not** commit your personal `.iconkin.json` projects or private reference images. Those files belong on your device or private storage. Files placed in the repository, including examples and documentation, can be read by anyone.

## Develop/test locally

Open `index.html` in a browser, or serve with `python -m http.server 8000` and visit `http://localhost:8000`. Browser file restrictions differ by device.

- `index.html`: page UI markup.
- `style.css`: page styles.
- `app.js`: actual browser application.
- `examples/demo.iconkin.json`: demonstration project (synthetic content only).
- `docs/FORMAT.md`: early open project-format specification and limitations.
- `docs/ACCEPTANCE.md`: actual tests and untested capabilities.
- `tools/validate_iconkin.py`: independent, no-dependency structural validator.
- `tools/test_engine.js`, `tools/app_logic.js`: core logic tests/source for validation.

Run tests, if Python and Node are available:

```bash
node --check app.js
node tools/test_engine.js
python tools/validate_iconkin.py examples/demo.iconkin.json
```

The current analysis is limited: SVG attribute extraction, raster palette sampling, human-reviewed Style DNA, structured semantic notes, deterministic SVG recipes, and basic objective QA. It does **not** automatically reverse-engineer complex reference styles or guarantee visual similarity. Browser/iPad end-to-end interaction has not yet been fully tested.

## Project ownership

An `.iconkin.json` export is your editable project archive; an exported SVG is a derived asset. GitHub Pages is only the app delivery mechanism. Neither is a cloud database. Keep local backups of project archives. No license for source redistribution has been selected yet.