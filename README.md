# ServeStud — Topic 1 Companion

Interactive learning companion for **Topic 1: Introduction to Java Web Technologies** (DFP50283, Politeknik Mukah). A single-page React app that teaches HTTP, containers, and servlets through a Library Management System metaphor — animations, exercises, and gated checkpoint quizzes.

## Stack

React 19 · Vite 8 · Tailwind CSS 4 · Framer Motion · Lucide React · self-hosted fonts (Fraunces, Source Sans 3, JetBrains Mono)

## Project context

- **[SPEC.md](SPEC.md)** — full content spec: sections, quizzes, animations, component architecture
- **[PRODUCT.md](PRODUCT.md)** — audience, voice, design principles (Impeccable)
- **[DESIGN.md](DESIGN.md)** — visual system: palette, typography, named rules (Impeccable)

## Develop

```bash
npm install
npm run dev      # dev server on :5173
npm run build    # static build → dist/ (deploy to CIDOS or any web host)
npm run lint     # oxlint
```

Progress persists in `localStorage`. No external API calls — the built `dist/` folder is fully self-contained.
