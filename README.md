# Resume Template Generator

A modern, bilingual (Spanish/English) resume builder built with Vue 3 + Vite. Fill in your information and get a live preview with instant PDF export.

**Live demo:** https://dlrdelarocha.github.io/resume-template-generator/

---

## Features

- **Live preview** — see your resume update in real time as you type
- **PDF export** — download a print-ready A4 PDF via html2pdf.js
- **Bilingual UI** — full Spanish and English interface
- **Typography controls** — adjust font size, line spacing, margins, and accent color
- **Save / load / export** — save multiple resume snapshots to localStorage and export as JSON
- **Drag to reorder** — reorder work experience entries via drag-and-drop
- **Sections:** Personal info, Summary, Work Experience, Education, Certifications, Languages, Skills
- **No account required** — everything stays in your browser

## Tech Stack

- [Vue 3](https://vuejs.org/) — Composition API with `<script setup>`
- [Vite](https://vitejs.dev/) — build tool
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) — PDF generation
- [vuedraggable](https://github.com/SortableJS/vue.draggable.next) — drag-and-drop sorting
- Custom CSS with CSS variables (no framework)

## Getting Started

```bash
# Install dependencies
yarn

# Start dev server
yarn dev

# Build for production
yarn build
```

## Deployment

This project deploys automatically to GitHub Pages via GitHub Actions on every push to `main`.

The live site is available at: https://dlrdelarocha.github.io/resume-template-generator/
