# Public philosophy explorer

`pages.ts` is the canonical registry for routes, metadata and the sitemap.
`content.json` contains only curated, trusted HTML/CSS migrated from the approved
local prototypes. It must never contain user input or unreviewed model output.
CSS selectors are scoped to `.explorer-root`, preserving other application pages.

`public/explorer/*.js` contains scene controllers. Each registers an initializer
in `window.PhiloExplorerMounts` and receives its root and an AbortSignal. All
listeners and observers must be cleaned up with that signal. Navigation within
the experience uses regular links; browser back/forward and direct entry work.
The React client component owns initialization and the production event adapter.

All initial scenes and additional readable explanations are server-rendered.
Interactions enhance rather than replace the crawlable content. An unavailable
script leaves readable text, sources, and links; no login or AI request is needed.

Portrait WebP files are optimized copies of the AI-generated historical
imaginings in the original local designs, not authentic historical portraits.
The old detailed Plato mockup is not a duplicate public route; its links now
lead to the existing philosopher guide.

The ignored `docs/` directory is not a build or deployment dependency.
