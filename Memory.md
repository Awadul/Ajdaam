# Memory — Ajdaam Machine Craft Web

Technical memory file for tracking architectural decisions, feature state, and dependencies.

---

## Active Architectural Decisions

- **Monolithic Next.js (App Router)**: Single repository with no separate frontend/backend folders. Client components and server-side routes (e.g., `/api/quote`) coexist under `src/app/`.
- **Aesthetic Motion & 3D**: Heavily relies on Framer Motion for scroll-scrubbed elements, velocity-based banking rails, and 3D tilts. Leverages Three.js for a canvas-masked wireframe scene on the landing page (`CtaDimension`).
- **Static Site Data & Scraping**: Timeline/portfolio items are stored locally in JSON (`src/data/timeline.json`) and compiled types (`src/lib/projects.ts`). Media assets are downloaded from Instagram CDN using `fetch-assets.mjs` to keep them local.
- **Tailwind CSS v4 & PostCSS**: Custom theme variables are defined directly inside `src/app/globals.css` using the new `@theme` directive, with Tailwind v4 compiled via PostCSS.
- **Form Submission Mock API**: `/api/quote` currently validates payloads and logs them to the console. Delivery integration (e.g., Resend, Nodemailer) is pending.
- **Hero Layout Optimization**: Removed the `<Eyebrow>` element and its containing `<motion.div>` in `CinemaHero`, transforming the heading into a `<motion.h1>` to optimize the viewport spacing and pull the lower content upward.
- **Eyebrow Header Styling**: Removed all dot markers (`.tick`) from the section headers (`Eyebrow` component and other mimicking elements) across all pages to enforce a clean left-alignment axis (Law of Alignment) and reduce cognitive visual load.
- **Workshop Showcase Integration**: Unified the previously separate Materials (`MaterialDrum`), Services (`ServicesPreview`), and Work (`WorkRail`) sections into a single interactive dark-themed `WorkshopShowcase` component. Users can toggle between Methods, Stock, and Outputs, with selections updating a shared visual "Spec Plate" mapping out dependencies. Mobile views render as vertical lists with inline Framer Motion accordion expanders.
- **Scroll Guideline Removal**: Removed all instructional scroll labels and guidelines from the website, including `{Featured Count} pieces · scroll` in `WorkRail` and the `keep scrolling` caption in `ZoomScene`. Replaced the `Scroll · Sketch to cut · Scroll ·` text in the `SpinBadge` with a neutral brand message: `Sketch to cut · Made to order ·`.
- **Section Names (Eyebrow) Removal**: Removed the section starting names (Eyebrow components and mimics like "Clients", "What we do", "Why Ajdaam", "Capabilities", "Case studies", "Standards", "Next step") across all home page sections and sub-pages to let headers stand alone and keep the layout self-sufficient. Adjusted headline margins accordingly.
- **StatementRail Removal**: Removed the drifting double-line `StatementRail` section entirely from the homepage to eliminate layout clutter and reduce visual scroll fatigue, letting the page flow directly from `WorkRail` to `CaseDeck`. Simplified `statements.tsx` to only export `ScrollProgress`.
- **Standards Section Optimization**: Removed status badges (`Standard` / `In progress` pills) from the `StandardsFlip` ("Built to be audited") grid, simplifying the layout to a clean two-column presentation of commitments and eliminating repetitive visual labels.
- **SSR Hydration Mismatch Fix**: Resolved hydration mismatch issues caused by browser extensions (specifically video speed controllers) injecting playback panel controls into the DOM around video elements. Implemented a `mounted` state inside `MediaFrame` to ensure `<video>` tags are rendered only on the client after mount, with a placeholder poster image rendering during SSR.

---

## Current Feature State

### Landing Page Scenes
- `CinemaHero` (Entrance animation & count ups) — **Complete**
- `ClientOrbit` (CSS 3D rotating ring) — **Complete**
- `MaterialDrum` (CSS 3D vertical indexing drum) — **Complete**
- `ServicesPreview` (Hover engaged cycle & details) — **Complete**
- `ZoomScene` (Scroll-scrubbed image-to-bleed mask) — **Complete**
- `AuthorityPanorama` (Testimonial 3D tilt cards) — **Complete**
- `CapabilityDeck` (Floating value plates) — **Complete**
- `WorkRail` (Pinned horizontal project rail) — **Complete**
- `StatementRail` (Parallax text drift) — **Complete**
- `CaseDeck` (Hover expandable case panels) — **Complete**
- `StandardsFlip` (Audit rows entry flips) — **Complete**
- `CtaDimension` (Three.js wireframe coil CTA) — **Complete**

### Sub-pages
- `/work` (Filtered grid with AnimatePresence) — **Complete**
- `/services` (Detail list with sidebar index) — **Complete**
- `/materials` (Static grid with asset previews) — **Complete**
- `/process` (Interactive timeline) — **Complete**
- `/contact` (Interactive request form & static location specs) — **Complete**

### Operations / API
- `/api/quote` (Honeypot protection & server logging) — **Complete**
- `fetch-assets.mjs` (Instagram timeline asset fetch script) — **Complete**

---

## Breaking Changes & Dependency Notes

- **React 19 & Next 15**: Compatibility requires compatible packages (Framer Motion v11, Three.js).
- **Instagram CDN signatures**: CDN URLs in `timeline.json` expire. Re-scraping timeline items is required if asset signatures expire.

---

## Database Schema & Migrations
- **No Database**: Currently stateless. No ORM or migrations.
