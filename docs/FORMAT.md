# Icon Kin Living Design Archive · draft schema 0.1

**Status:** experimental documented project format. JSON is authoritative; the ZIP is an optional bundle of JSON and derived copies of SVGs and reference media. This is not a ratified open standard or evidence of third-party interoperability.

## General design

`*.iconkin.json` is a UTF-8 JSON object with `schema` = `iconkin.project/0.1`. Embedded references use `data:image/...` URIs. Every icon preserves its exact approved-or-draft SVG bytes in `icons[].sourceSvg` and a recipe reference where applicable. An icon's saved SVG, not a possibly unavailable rendering model, is authoritative. History and snapshots permit restoring previously saved design states.

Top-level records and their roles:

| Field | Required | Semantics |
| --- | --- | --- |
| `schema` | yes | Exact format version identifier |
| `manifest` | yes | Stable project ID, revision, branch, timestamps, declared capabilities |
| `references[]` | yes | Embedded reference images, explicit observations, supplied attribution, license uncertainty |
| `styleDNA.rules` | yes | Rule IDs mapped to `{value, source, confidence, status, evidence, updated}` |
| `symbolicGrammar` | yes | Optional human-defined symbolic mappings and notes |
| `calibration` | yes | Chosen test concepts, variants, user acceptance and qualifications |
| `icons[]` | yes | Stable icon IDs, concept and meaning, SVG source, status, overrides, lineage, exceptions |
| `qa` | yes | Findings with evidence, affected item, type, dimension, severity, confidence and possible repair |
| `history[]` | yes | Chronological actions with explanations and affected IDs |
| `snapshots[]` | yes | Recoverable prior project states (excluding nested snapshots) |
| `exports[]` | yes | Records of past export events |
| `limitations[]` | yes | Known gaps in reproducibility, quality and supported functionality |

Rule status values: `provisional`, `approved`, `locked`, `rejected`. For this prototype, a rejected rule falls back to the preset value for *new construction*. Rejection should be understood as a project decision, not an inferred fact.

Icon approval and human semantic review are independent. A visual export is not proof that a concept is semantically well represented. A locked asset is protected from shared-rule propagation; an asset with `manualOverride: true` preserves its edited SVG; `pinned: true` explicitly excludes it from inherited regeneration. `ancestry[]` records the prior SVG for edits, propagation and rejoining.

## Current conformance level

The included `validate_iconkin.py` checks JSON structure, identifiers, presence of core rules, embedded source validity, SVG XML and unsafe elements, reference encoding, ZIP CRC verification, and asset equality between the ZIP and JSON project. It reports SHA-256 hashes of individual SVG sources. It **does not** certify visual fidelity, originality, semantic accuracy, WCAG conformance, third-party compatibility, lossless raster/vector translation or future schema migration.

**Independently validatable ≠ independently implemented alternate editor.** The archive is documented for another client to implement, but none is included.

## Known limitations

- The editor's built-in SVG parser disallows external SVG resources, CSS style attributes and many sophisticated constructs. This is intentional for safer local ingestion but excludes complex exports.
- Image reference reverse engineering is not automated beyond raster color sampling. SVG analysis sees explicit attributes, not CSS computed styles or inferred author intent.
- Version 0.1 writes one archive by browser download. It does not automatically track local filesystem changes, synchronize, encrypt, or maintain cryptographically signed commits.
- ZIP entries are ZIP STORE (uncompressed) with CRC32; the validator additionally supplies SHA-256 fingerprints. This is corruption detection, not a trusted-signature system.
- Snapshot restore is locally reversible by saving a snapshot of the replaced state. It is not a true multi-branch collaborative version-control system.
- The application may require a standard desktop browser capable of opening local HTML and handling file downloads. Some iPad file previews restrict JavaScript or downloads.

## Versioning and extensions

Unknown JSON members should be copied without interpretation when safely possible. A future extension convention may use reverse-domain namespaces such as `extensions.example.org/customData`; it is not implemented in version 0.1. Clients that cannot safely round-trip a field must warn and refuse destructive writes. This prototype only accepts its exact schema version. Schema migrations have not been implemented.

## Recovery test

1. Export `*.iconkin.json` from the editor and run `python validate_iconkin.py file.iconkin.json`.
2. Close the HTML and reopen it. Import that file from **Open project**.
3. Verify the reference images, rule evidence, snapshots, icon SVG sources, exceptions and decisions.
4. Change a Style DNA rule, inspect propagation previews, approve selected assets, and save again.
5. Export ZIP and run `python validate_iconkin.py exported-pack.zip`. Compare approved SVG byte hashes to prior versions. Differences after deliberate changes are expected, not loss of original approval history.