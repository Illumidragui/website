---
name: Refactor architecture — April 2026
description: Professional source structure applied in April 2026 refactor; use before touching any src/ file
type: project
---

Post-refactor source layout (build passes, April 2026):

```
src/
├── components/         ← reusable atoms (no page-specific logic)
│   ├── DataTable.js              shared table: headers + rows[]
│   ├── ProjectCard.js + .module.css  portfolio card (extracted from portfolio.js)
│   ├── DescBlock/index.js + .module.css  prose/stack line renderer (renderDescBlock export)
│   ├── SectionHeader/index.js + .module.css  label-line + h2 pattern
│   ├── Timeline/index.js + .module.css  generic timeline list (entries[])
│   ├── InfraContent.js           7 lines — selects lang and renders MDX from src/content/
│   ├── PipelineContent.js        7 lines — selects lang and renders MDX from src/content/
│   ├── OverviewContent.js + .module.css  fixed: no longer imports from pages CSS
│   └── NavbarLangToggle.js + .module.css
│
├── sections/           ← large visual blocks, one per homepage section
│   ├── Hero/index.js + Hero.module.css
│   ├── CareerArc/index.js + CareerArc.module.css
│   ├── Experience/index.js + Experience.module.css  (uses Timeline + SectionHeader)
│   └── Education/index.js + Education.module.css   (uses Timeline + SectionHeader)
│
├── content/            ← long-form bilingual content as MDX (no JSX, no JS logic)
│   ├── en/
│   │   ├── infra.mdx             infrastructure page content in English
│   │   └── pipeline.mdx          CI/CD pipeline page content in English
│   └── es/
│       ├── infra.mdx             infrastructure page content in Spanish
│       └── pipeline.mdx          CI/CD pipeline page content in Spanish
│
├── data/               ← structured data and short UI strings only
│   ├── project.json              all homepage data: heroTags, badges, experiences, education, portfolio
│   └── translations.js           short UI strings keyed by lang ('es'|'en')
│
├── styles/
│   └── custom.css                global Infima overrides + CSS vars (MOVED from src/css/)
│
├── context/
│   └── LangContext.js            LangProvider + useLang hook
│
├── pages/              ← thin orchestrators only (~20–40 lines each)
│   ├── index.js                  imports Hero, CareerArc, Experience, Education
│   ├── index.module.css          only .divider class
│   ├── infrastructure.js         uses OverviewContent, PipelineContent, InfraContent
│   ├── infrastructure.module.css page header + sidebar layout
│   ├── portfolio.js              uses ProjectCard
│   └── portfolio.module.css      hero header + grid layout only
│
└── theme/              ← Docusaurus swizzle — never modify
    ├── NavbarItem/ComponentTypes.js
    └── Root.js
```

**Content vs data rule:**
- `src/data/` — structured data (JSON) and short UI strings (button labels, section titles). No prose.
- `src/content/` — long-form text, technical documentation, anything a non-developer might edit. Always MDX, one file per language per topic.

**Why MDX over JS for content:** the previous `infraContent.js` / `pipelineContent.js` embedded React JSX (`<code>`, `<React.Fragment>`) directly inside data objects, which forced the format to be `.js`. MDX replaces all of that with standard Markdown syntax (backticks, bold, tables, fenced code blocks) and keeps components available where genuinely needed.

**How to apply:**
- New page section → `src/sections/`
- New reusable UI atom → `src/components/`
- New long-form bilingual content → `src/content/en/<topic>.mdx` + `src/content/es/<topic>.mdx`, render via a thin component in `src/components/`
- New short UI strings → `src/data/translations.js`
- Never let a component import CSS from a page module
