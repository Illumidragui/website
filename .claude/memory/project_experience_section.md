---
name: Experience section architecture
description: Two-level accordion UX for the Experience section — components, data shape, and patterns used
type: project
---

The Experience section uses a dedicated `ExperienceCard` component (not the generic `Timeline`, which Education still uses).

**Data shape** (`project.json` → `experiences[]`):
- `summary` / `summary_es` — 1-2 sentence executive summary (always visible)
- `highlights` / `highlights_es` — array of 2-3 impact bullets (always visible)
- `details` / `details_es` — array of `renderDescBlock`-compatible strings (accordion, hidden by default)
- Old `description` / `description_es` fields removed.

**Component tree:**
```
Experience/index.js          ← section, maps experiences → ExperienceCard
ExperienceCard/index.js      ← accordion card, uses useLang + renderDescBlock
ExperienceCard.module.css    ← card styles, CSS grid accordion trick (0fr → 1fr)
Experience.module.css        ← .list wrapper with ::before vertical timeline line
```

**Accordion animation:** CSS `grid-template-rows: 0fr → 1fr` transition (no JS height math, no max-height hack).

**Translations:** `expDetailsShow` / `expDetailsHide` added to `translations.js` (both en/es).

**Why:** `Timeline` is generic and shared with Education; ExperienceCard is purpose-built for the two-level CV pattern without coupling to Education's simpler needs.
