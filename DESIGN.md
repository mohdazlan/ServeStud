<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

---
name: ServeStud — Topic 1 Companion
description: A warm, library-themed interactive learning companion for Java web technologies
---

# Design System: ServeStud — Topic 1 Companion

## 1. Overview

**Creative North Star: "The Reading Room"**

A well-organized reading room with good lighting: warm wood, honest paper, a librarian who actually wants to help. The whole surface behaves like the metaphor it teaches — the container is a building, the servlet is a librarian, and the interface is the library itself. Structured but never rigid; every section has breathing room, every unlock feels like a door opening.

This system explicitly rejects the e-learning monoculture: no Moodle/Canvas chrome, no corporate SaaS blue-gray, no purple gradient heroes, no card-in-card-in-card scaffolding. It is a learning *place*, not a content management surface. Warmth is carried by committed brand color, characterful type, and purposeful motion — not by decoration.

**Key Characteristics:**
- Environmental warmth: the surface itself reads as paper and wood, because the library IS the brand (the sanctioned exception — this is deliberate identity, not default cream)
- One strong, warm action color reserved for interaction: buttons, quiz submission, unlock moments
- Motion that explains (request journeys, lifecycle timelines), always student-controllable
- Head First energy: callouts, annotations, and marginalia rather than uniform card grids

## 2. Colors

Warm palette rooted in the library metaphor; the mood is "afternoon light in a timber reading room," not "beige SaaS."

### Primary
- **Burnt Amber (action)** — anchor: `oklch(0.695 0.205 43.2)`, tuned toward `oklch(0.60 0.16 43)` at implementation: the single warm action color. Buttons, quiz submission, unlock moments, active-section indicators. Always white/paper text on its fills.

### Secondary
- **Banker's-Lamp Green** — deep green, hue family ~150–160, `[exact value resolved during implementation]`: the second brand voice. Links, completed-section checkmarks' frame, "Learn/Think/Prove" phase accents. Must stay clearly distinct from the brighter semantic success green.

### Neutral
- **Paper (bg)** — warm-tinted light surface, chroma 0.015–0.03 toward the amber hue, `[to be resolved]`: the body background. Deliberately environmental, not near-white sand.
- **Aged Paper (surface)** — paper pulled ~10% toward ink: panels, quiz containers, sidebar.
- **Midnight Shelf (dark surface)** — deep warm-dark, `[to be resolved]`: code blocks and syntax-highlighting canvas.
- **Warm Ink** — tinted dark (never pure black), ≥7:1 contrast on Paper: all body text.
- **Semantic**: green (correct), warm red (incorrect), amber (partial) — always paired with text/icons, never color alone.

### Named Rules
**The One Desk Rule.** Burnt Amber appears only where the student can act: interactive elements and unlock moments. If it isn't clickable or just-unlocked, it isn't amber.
**The Paper-Is-Brand Rule.** The tinted background is a committed environmental choice tied to the library metaphor — tint it toward the brand's amber hue with intent (chroma ≥0.015), never let it drift to generic cream.
**The Never-Pure-Black Rule.** Text is warm ink; code canvases are midnight-warm. `#000` is prohibited.

## 3. Typography

**Display Font:** Fraunces (or Bitter / Zilla Slab — a characterful serif that says "learning," not "corporate") `[final choice at implementation]`
**Body Font:** Source Sans 3 (or Nunito / IBM Plex Sans — clean, highly readable) `[final choice at implementation]`
**Label/Mono Font:** JetBrains Mono or Fira Code, ligatures on, warm-palette syntax highlighting

**Character:** Serif display + humanist sans body — a deliberate contrast pairing. The serif carries the bookish warmth; the sans keeps ESL-friendly body text effortless. Inter and Poppins are explicitly banned for this brief.

### Hierarchy
- **Display**: section headers only; personality allowed here, nowhere else.
- **Headline/Title**: fixed rem scale (product register — no fluid clamp in app UI), ratio ~1.2.
- **Body**: 65–75ch max line length; short paragraphs (2–3 sentences); `text-wrap: pretty` on prose.
- **Label**: the body sans in a smaller weight/size — never the display serif in buttons, labels, or data.

### Named Rules
**The Serif-Stays-On-Stage Rule.** The display serif appears in section headings and celebratory moments only. UI controls, quiz options, and labels use the body sans.

## 4. Elevation

Mostly flat with tonal layering: paper and aged-paper surfaces separate panels; hairline borders in a warm neutral do the structural work. Shadows are rare and soft — reserved for genuinely floating elements (the metaphor-map overlay, the floating reference button). Heavy drop shadows and neumorphism are prohibited (PRODUCT.md anti-reference). Depth can also be conveyed by the metaphor itself: locked sections sit "behind" a closed door, not under a shadow.

### Named Rules
**The Flat-Shelf Rule.** Surfaces are flat at rest. A shadow means "this element floats above the page" (overlay, popover) — nothing else earns one.

## 5. Components

No components exist yet — this is a pre-implementation seed. The canonical set to build first (per SPEC.md): section navigation (sidebar/bottom tabs with locked/current/complete states), progress bar, checkpoint quiz (options, submit, feedback states), callout boxes ("Brain Power" provocations, "No Dumb Questions" sidebars, definition cards), code walkthrough panel with interactive annotations, and the animation stage with step-through playback controls. Every interactive component ships with default, hover, focus, active, disabled, and (for quizzes) correct/incorrect/partial states.

## 6. Do's and Don'ts

### Do:
- **Do** reserve Burnt Amber for actionable elements and unlock moments (The One Desk Rule).
- **Do** verify body text ≥4.5:1 (target ≥7:1) against the tinted paper background — warm-tinted bgs eat contrast quietly.
- **Do** use ease-out for entrances, ease-in for exits; 50–80ms stagger; 200–400ms micro-interactions; 600–1000ms major transitions; up to 3000ms only for the orchestrated teaching sequences (A1, A5, A9).
- **Do** give every animation a `prefers-reduced-motion` fallback that lands on the final, fully-informative state.
- **Do** communicate quiz feedback in text + icon + color, in that order of importance.

### Don't:
- **Don't** use corporate SaaS blue-gray palettes or "generic e-learning/LMS aesthetics (Moodle/Canvas feel)" — quoted from PRODUCT.md.
- **Don't** use heavy drop shadows, neumorphism, or glassmorphism.
- **Don't** wrap cards in cards in cards; prefer callouts, margins, and rules over card grids.
- **Don't** use purple gradient heroes, gradient text, or side-stripe (`border-left` accent) callouts.
- **Don't** use bounce or elastic easing — smooth and confident only.
- **Don't** add "01 / 02 / 03" decorative numbering — sections are gated, not numbered for show.
- **Don't** set body text in Inter or Poppins, or use the display serif in UI labels/buttons.
- **Don't** use stock photography — illustration and diagram only.
