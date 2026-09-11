# StoryMagic

> Personalized AI-powered bedtime stories where your child becomes the hero of every story.

## Status

**🟢 Active** — In active development. Features are being built and shipped incrementally.

## About

StoryMagic is a full-stack web application that turns every child into the hero of their own adventure. Parents and kids pick a world, build a character, and the app generates a unique, age-appropriate, child-safe story in seconds — complete with a moral lesson, multiple languages, and adjustable reading levels.

The product pairs a polished, magic-themed landing experience with a complete member dashboard: a story library with favorites and search, reading-progress tracking, child profiles, learning games, achievements, and a fully responsive UI with playful 60fps animations.

## Tech Stack

**Frontend**

- React 19 · TanStack Router & Start · Tailwind CSS v4 · Framer Motion

**Backend & Data**

- TanStack server functions · Supabase (Postgres + Row-Level Security, Auth, Storage)
- AI story generation via the Lovable AI Gateway with Zod-validated inputs

**Tooling**

- TypeScript · Bun · Vite

## Key Features

- **AI Story Generator** — 12 categories, 2/5/10-minute lengths, 8 languages, difficulty levels, and optional moral lessons
- **Personalized characters** — name, age, and themes baked into every generated tale
- **Story library** — search, favorites, and reading-progress/resume tracking synced per user
- **Child profiles** — tailor experiences per child in the family
- **Learning games & achievements** — quests and badges that reward curious minds
- **Parent dashboard** — stats, continue-reading, and quick access to everything
- **Safe by design** — strict AI content guardrails and RLS-protected user data

## Getting Started

Requires Node.js and [Bun](https://bun.sh) (or npm).

```sh
git clone <repository-url>
cd <repository-name>
bun install        # or: npm install
bun run dev        # or: npm run dev
```

Set up environment variables (Supabase project URL + publishable keys, and `LOVABLE_API_KEY` for AI generation).

## Project Structure

```
src/
├── components/     # UI primitives, layout, effects
├── lib/            # auth, store, stories, story-generation logic
├── routes/         # file-based routes (landing, auth, app pages)
└── integrations/   # Supabase client & auth wiring
supabase/
└── migrations/     # schema, RLS policies, seed data
```

## Built with Lovable

This project is developed with [Lovable](https://lovable.dev) — build the UI in the editor and push changes straight back to this repository.
