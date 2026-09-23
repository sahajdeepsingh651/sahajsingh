# Project & Learning Instructions (GEMINI.md)

## Pedagogical Rules & Learning Contract
- **Learning Goal:** The developer is learning Next.js, React, Tailwind, and web engineering from first principles.
- **Generative Learning (Active Recall):** Target the generative muscle, not the recognition muscle. Never write out entire components or spoon-feed copy-pasteable blocks of finished code.
- **Socratic Guidance:** When introducing a new concept or UI piece, ask questions and provide mental models that prompt the developer to deduce the solution and write the code themselves.
- **Bricks, not Houses:** Explain isolated CSS properties, layout techniques, or Next.js APIs when asked, but leave the architectural assembly and typing to the developer.
- **Spotter Role:** The developer drives the keyboard and makes creative decisions. The assistant reviews code, explains mental models, and helps debug errors.

## Project Vision & Aesthetic
- **Vibe:** Atmospheric, intellectual field notebook / personal digital garden.
- **Inspirations:** `atharvaraykar.com`, `gwern.net`, `earendil.com`.
- **Mockups:** Refer to `blo.png` (light mode) and `dark_mode_blog.png` (dark mode).
- **Core Visual Identity:**
  - Light mode: Warm parchment background (`#FAF7ED`), editorial serif typography, coastal ocean waves & lighthouse etching at the bottom.
  - Dark mode: Deep cosmic night sky (`#0B0F17`), constellation stardust, glowing lighthouse beam, warm ivory text.
  - Structure: Minimalist header (`sahaj deep singh`, tagline, `projects [now] essays about`, `• read` toggle), clean 2-column logs with monospace dates.

## Architecture & Conventions
- **Framework:** Next.js (App Router, TypeScript, `src/` directory).
- **Styling:** Tailwind CSS (v4) with CSS custom properties in `src/app/globals.css`.
- **Target Hosting:** GitHub Pages (`output: 'export'` in `next.config.ts`).
- **Static Assets:** Placed in `public/` (e.g. `real_read_mode.png`, `real_write_mode.png`).

## Design Decisions & Palette Records
- **Base Typography:** 18px base size (`--base-font-size: 18px`), 1.65 line leading, Newsreader serif (`--font-newsreader`), OpenType old-style numbers enabled (`oldstyle-nums`, `"onum" 1`).
- **Canvas Layout & Margin:** Left-anchored with 120px left screen margin (`--page-left-offset: 120px`).
- **Navigation Placement:** Begins after the content box border (matching `blo.png` mockup guide, `data-nav-placement="after-border"`), with a 36px separation gap (`--nav-distance: 36px`).
- **Content Box Width:** 896px / `max-w-4xl` (`--content-width: 896px`), equalized across all pages via `RootLayout` inheritance, leaving ~200px of breathing room before essay dates.
- **Essay Line Alignment:** Justified edge-to-edge (`data-entry-align="justified"`), minimum distance / safety gap: 28px (`--entry-gap: 28px`).
- **Background Art:**
  - Light mode: Original Read (`/real_read_mode.original.png`).
  - Dark mode: Strictly locked to `/real_write_mode.png` (cosmic night sky, never modified).
- **Navigation & Active State:** Brackets indicate current location (`[ Sahaj Singh ]` on `/`, `[now]` on `/now`).
- **Unselected / Secondary Text Evaluation:**
  - **Chosen Palette:**
    - Light mode: `--text-muted: #595147` (soft graphite charcoal on vellum).
    - Dark mode: `--text-muted: #e2e8f0` (Pale Platinum / Slate-200 on cosmic `#0b0f17`).
    - *Verdict:* Tested live against Slate-400, Warm Chalk, and Moonlit Silver. Pale Platinum provides high contrast and crisp legibility for secondary text, dates, and navigation links without washing out glowing ivory primary text.
  - **Option 1 (Single Ink Alternative):**
    - `--text-muted: var(--text-color)` (uniform ivory `#ede8dc` / walnut `#1f140e`).
    - *Verdict:* Kept on file as reference.
- **Section Heading Hierarchy & Palette (`--heading-color`):**
  - Decoupled from `--text-muted` to solve washed-out headings on parchment and flat hierarchy in dark mode.
  - Palettes added to Studio Controller:
    - *Espresso / Amber (Default)*: `#2C221E` (Warm Espresso Bronze) in light, `#F3D8A2` (Celestial Amber) in dark.
    - *Terracotta / Copper*: `#8B3A22` (Field Rust) in light, `#F6AD7B` (Warm Copper) in dark.
    - *Maritime Slate / Blue*: `#1E293B` (Deep Navy) in light, `#93C5FD` (Moonlit Silver) in dark.
    - *Sumi Ink / Ivory*: `#111111` in light, `#EDE8DC` in dark.
  - Typography modes: Serif (`blo.png` mockup style, 1.35rem) vs. Mono uppercase small-caps (`[data-heading-style="mono"]`).
- **Ocean Waterline Emergence & Scroll Boundary:**
  - Foreground Horizon Layer (`HorizonForeground`) is fixed at `z-20` so the coastal waves sit physically in front of page content.
  - Page Canvas (`GlassFrame`) is placed at `z-10` with calibrated directional padding `px-6 sm:px-8 pt-6 sm:pt-8 pb-28 sm:pb-32` (112px - 128px).
  - *Emergence Effect*: Text physically emerges from behind the ocean waves as the reader scrolls down.
  - *Natural Stop (No Over-scroll, No Sticky Scroll)*: When the final item ("Understanding from First Principles") clears the ocean waterline with ~35px of breathing room, scrolling terminates naturally. Eliminates the artificial dead air while preserving standard fluid browser scrolling.
- **Reading Progress Indicator Scope:**
  - **Essays Only**: The 1px / 2px silent graphite hairline reading rule (`ScrollCue`) is strictly scoped via `usePathname()` to long-form reading routes (`/essays`).
  - **Clean Canvas Everywhere Else**: Home (`/`), About (`/about`), Now (`/now`), Projects (`/projects`), and Thoughts (`/thoughts`) have zero overlay cues, zero floating widgets, and zero header lines, preserving a completely undisturbed digital garden canvas.
- **Essay Footer Architecture & Canonical Standard:**
  - **Ledger Format (`EssayFooter.tsx`)**: Stacked academic standard with substantive revision changelog, annotated bibliography with bidirectional anchor jumps (`#ref-X` ↔ `#cite-X`), and permanent archive colophon.
  - **Branch Preservation**: Interactive test switcher components are preserved in the `test-interactive-components` branch for reference; production `main` remains clean with zero experimental UI toolbars.
- **About Site Taxonomy & Structure:**
  - **Header Subtitle**: "Two perspectives: the author and the site."
  - **About Site Section**: Strictly dedicated to the site itself (personal field notebook, digital garden workspace, physical book/typography inspirations, nocturnal observation).
  - **Epistemic Confidence & Status**: Gwern-inspired document maturity tags (seed, developing, draft, revised) and Kesselman estimative probability scales are unified under Epistemic Confidence, preserving `#status` and `#confidence` anchor targets.

