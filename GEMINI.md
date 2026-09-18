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
- **Base Typography:** 15px base size, 1.65 line leading, Newsreader serif (`--font-newsreader`), OpenType old-style numbers enabled (`oldstyle-nums`, `"onum" 1`).
- **Navigation & Active State:** Brackets indicate current location (`[ Sahaj Singh ]` on `/`, `[now]` on `/now`).
- **Unselected / Secondary Text Evaluation:**
  - **Chosen Palette:**
    - Light mode: `--text-muted: #595147` (soft graphite charcoal on vellum).
    - Dark mode: `--text-muted: #e2e8f0` (Pale Platinum / Slate-200 on cosmic `#0b0f17`).
    - *Verdict:* Tested live against Slate-400, Warm Chalk, and Moonlit Silver. Pale Platinum provides high contrast and crisp legibility for secondary text, dates, and navigation links without washing out glowing ivory primary text.
  - **Option 1 (Single Ink Alternative):**
    - `--text-muted: var(--text-color)` (uniform ivory `#ede8dc` / walnut `#1f140e`).
    - *Verdict:* Kept on file as reference.

