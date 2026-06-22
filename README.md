<div align="center">

<!-- [HERO IMAGE: full-width screenshot of the Morrow dashboard (home page, grid layout, dark neumorphic theme)] -->

<br />

<!-- [LOGO: Morrow wordmark — "Mor" bold canvas-primary + "row" regular on dark bg, ~280px wide] -->

<h1>Morrow</h1> 

**Your browser's new tab, redesigned.**  
A personal dashboard that replaces the default new tab page, built for focus, not distraction.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

---

<img src="https://i.kwin.in/r/morrow-hero.avif" style="max-width: 600px; padding: 20px;"> 

</div>

## Overview

Morrow replaces your browser's new tab with a focused personal workspace. Quick-launch shortcuts, a unified search bar, to-dos, a watchlist, and settings — all in one place, shaped around how you actually work.

<!-- [SCREENSHOT: landing page hero section with scroll animation visible] -->
<img src="https://i.kwin.in/r/layout-clean.avif" style="max-width: 600px;padding: 20px;">


## Features

- **5 Dashboard Layouts** — Grid, Stream, Compact, Bento, Zen. Switch between layouts instantly from Settings.
- **Smart Search** — Choose your engine: Google, DuckDuckGo, Ecosia, or Bing.
- **Quick-Launch Cards** — Preset shortcuts or fully custom cards with label, icon, URL, and category.
- **To-Do List** — Lightweight task management on the Focus page.
- **Watch Queue** — Save links and track things you want to watch or read later.
- **5 Themes** — Amber, Nocturnal, Slate, Forest, Rose.
- **3-Step Onboarding** — Set your greeting, search engine preference, and card layout in under a minute.


## Getting Started

### Prerequisites

- Node.js 20+
- Yarn
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Environment

Create `.env.local` at the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/morrow
AUTH_SECRET=<see below>
NEXTAUTH_URL=http://localhost:3000
```

**`AUTH_SECRET`** — a random secret used to sign and encrypt session tokens. Generate one:

```bash
openssl rand -base64 32
```

Paste the output as the value. Never commit this — keep it only in `.env.local` (already git-ignored) and in your hosting provider's environment variables.

### Install & run

```bash
yarn install
yarn dev
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  ← landing (public)
│   ├── (canvas)/                 ← authenticated app
│   │   ├── home/                 ← dashboard
│   │   ├── focus/                ← to-dos
│   │   ├── queue/                ← watchlist
│   │   └── drift/                ← settings
│   ├── (gate)/                   ← login + signup
│   └── (ritual)/                 ← onboarding
├── craft/                        ← UI components
├── ledger/                       ← MongoDB models
├── signal/                       ← server actions + auth
└── schema/                       ← shared TypeScript interfaces
```


## Route Flow

```
/        →  landing
/enter   →  login   →  /home
/join    →  signup  →  /setup
/setup   →  onboarding (3 steps)  →  /home
/home    →  dashboard (auth required)
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/morrow&env=MONGODB_URI,AUTH_SECRET,NEXTAUTH_URL&envDescription=See%20.env.local%20setup%20in%20the%20README&project-name=morrow&repository-name=morrow)

1. Click the button above
2. Connect your GitHub and fork the repo
3. Add the three env vars when prompted (`MONGODB_URI`, `AUTH_SECRET`, `NEXTAUTH_URL`)
4. Deploy — Vercel auto-detects Next.js, no config needed



---

<div align="center">

Built with Next.js · Sanchit's Tools

</div>
