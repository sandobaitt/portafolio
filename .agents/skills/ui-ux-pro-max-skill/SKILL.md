---
name: ui-ux-pro-max-skill
description: AI skill that provides design intelligence for building professional UI/UX across multiple platforms.
---

# UI UX Pro Max Skill

This skill acts as a design intelligence engine for generating professional UI/UX systems.

## Core Directives for Agents:
1. **Design System Generation**: Before writing UI code, define the Pattern, Style, Colors, Typography, and Key Effects.
2. **Minimalist Storytelling**: Emphasize whitespace, high contrast, and clean layouts.
3. **Dual Themes**: Always design for native Dark Mode and Light Mode using CSS variables.
4. **Fluid Interactions**: Apply subtle scroll-reveals (fade-ups) and hover micro-interactions. No harsh or overly long animations.
5. **Anti-patterns**: Avoid neon colors, harsh shadows, pure black (#000000) or pure white (#FFFFFF) backgrounds if they hurt contrast, and avoid inaccessible text.

## Tech Stack Rules:
- For animations: Use `Framer Motion` for React/Next.js projects or `GSAP` for vanilla projects.
- For styling: Prefer CSS Variables and Vanilla CSS for total control, unless a framework is explicitly requested by the user.
