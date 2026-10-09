# Icon Kin 0.1 acceptance ledger

## Verified in this artifact build

| Check | Evidence | Status |
| --- | --- | --- |
| JavaScript parses | `node --check app_logic.js` | PASS |
| Project initializes with editable DNA | Node VM state-contract test | PASS |
| Demo references, geometry recipes and eight assets | Node VM state-contract test | PASS |
| SVG validation rejects a script element | Node VM state-contract test | PASS |
| Shared-rule edit requires an explicit propagation preview | Node VM state-contract test | PASS |
| Rule propagation changes asset SVG and returns it to draft | Node VM state-contract test | PASS |
| Reversible snapshots retain prior state | Node VM state-contract test | PASS |
| Project serializes and loads as valid independent JSON | JSON round-trip and independent Python validation | PASS |
| Reopened project can be edited and serialized again | Node VM state-contract test | PASS |
| ZIP can be independently parsed and validated, SVG sources match archive JSON | Python stdlib ZIP integrity and SVG XML check | PASS |
| Asset provenance linkage in ZIP sidecars | Python metadata check | PASS |

**Testing boundary:** The isolated environment blocks the bundled browser from navigating to both local HTML and a local HTTP server (`ERR_BLOCKED_BY_ADMINISTRATOR`). Therefore live UI interaction, drag-and-drop files, browser downloads, rendering fidelity, and mobile/iPad behavior are **not verified** by these tests. The Node VM harness uses an intentionally minimal mock DOM and cannot substitute for real-browser acceptance testing. The HTML app has no network dependencies and is intended to work in browsers that permit local JavaScript/file downloads.

## Assisted/manual checks in this version

- Raster reference extraction provides quantized color samples, not an interpretation of geometry, perspective, material, or design intent.
- SVG attribute forensics reads explicit SVG attributes, not hidden authorial rules or computed styling.
- User manually evaluates semantic clarity, family coherence, optical size, exceptions and resemblance to the references.
- Calibration uses a representative, user-editable concept set. Its approval records user judgment, not AI falsification.
- QA includes SVG validity, explicit stroke comparison, basic contrast risk, provenance, approval status and notes on semantic uncertainty. It does not provide full accessibility conformance or perceptual image matching.

## Not yet implemented

- An actual ChatGPT Plugin Creator package and tool actions
- Standalone independent editor implementation, genuine cross-client test
- Cloud sync, encrypted sharing, advanced branching and concurrent merging
- Freeform vector path manipulation UI or painted raster corrections
- AI generation of arbitrary new icon geometry
- Realistic raster texture synthesis, font exports, layered vector or design-tool integration
- Automatic layout/optical QA and reference-style matching
- Full archival migration or cryptographic commit signatures

## Reproduction

```bash
node --check app_logic.js
node test_engine.js
python validate_iconkin.py sample.iconkin.json
python validate_iconkin.py sample-pack.zip
```

There are no external package dependencies for the app, validator, or test harness. Node.js is needed only to run the optional engine test; Python 3 is needed only for independent validation.