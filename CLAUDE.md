# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Morrow — CLAUDE.md

## Package manager
Always use **yarn**. Never use npm or npx.
- `yarn dev` — start dev server
- `yarn build` — production build
- `yarn lint` — eslint

## What this is
Morrow is a browser new-tab / homepage webapp + Chrome extension. Users create an account, configure preferences in a 3-step onboarding flow, then land on a personal dashboard that replaces their browser's new tab page.

## Stack
- **Next.js 16.2.9** — App Router, TypeScript, React 19
- **NextAuth v5 (beta.31)** — Credentials provider, JWT strategy
- **Mongoose + MongoDB Atlas** — database
- **Tailwind v4** — `@theme` block for design tokens, no config file
- **Motion (Framer Motion v12)** — animations
- **Lucide React** — icons (landing/gate/ritual only)
- **Material Symbols Outlined** — icons in canvas (loaded via `<link>` tag)

## Directory structure
```
src/
├── app/
│   ├── page.tsx                  ← landing page (always public, at /)
│   ├── layout.tsx                ← root layout (Google Fonts <link> tags, Providers)
│   ├── globals.css               ← single CSS file for both themes
│   ├── (canvas)/                 ← logged-in app (no path prefix)
│   │   ├── layout.tsx            ← checks auth, renders Sidebar
│   │   ├── home/page.tsx         ← dashboard (/home)
│   │   ├── focus/page.tsx        ← todos (/focus)
│   │   ├── queue/page.tsx        ← watchlist (/queue)
│   │   └── drift/page.tsx        ← settings (/drift)
│   ├── (gate)/                   ← auth pages (no path prefix)
│   │   ├── enter/page.tsx        ← login (/enter)
│   │   └── join/page.tsx         ← signup (/join)
│   ├── (ritual)/                 ← onboarding (no path prefix)
│   │   └── setup/page.tsx        ← 3-step setup (/setup)
│   └── api/auth/[...nextauth]/   ← NextAuth route handler
├── craft/                        ← UI components
│   ├── canvas/                   ← app-theme components
│   ├── gate/                     ← auth-theme components
│   ├── ritual/                   ← onboarding components (SetupClient.tsx)
│   └── primitives/               ← shared (Providers.tsx with SessionProvider)
├── ledger/                       ← MongoDB
│   ├── connect.ts                ← connectDB() singleton
│   └── models/                   ← User.ts, Todo.ts, WatchItem.ts
├── signal/                       ← server-side logic
│   ├── auth.ts                   ← NextAuth config — NO 'use server'
│   ├── actions.ts                ← 'use server' — registerUser, completeOnboarding
│   ├── todos.ts                  ← 'use server' — todo CRUD
│   └── watchlist.ts              ← 'use server' — watchlist CRUD
├── anchor/
│   └── session.d.ts              ← NextAuth module augmentation (User, Session, JWT)
├── schema/
│   └── index.ts                  ← shared TypeScript interfaces
├── auth.config.ts                ← edge-compatible NextAuth config (no bcrypt/mongoose)
└── middleware.ts                 ← redirects logged-in users away from /enter and /join
```

## Route flow
```
/           → landing (public)
/enter      → login  → on success: /home
/join       → signup → on success: /setup
/setup      → 3-step onboarding → on finish: /home
/home       → dashboard (requires auth + onboarded)
/focus      → todos (requires auth)
/queue      → watchlist (requires auth)
/drift      → settings (requires auth)
sign out    → /  (landing)
```

Middleware (`src/middleware.ts`) redirects logged-in users away from `/enter` and `/join` at the edge.

## Two design themes

### Landing / Gate / Ritual (amber dark)
- Background: `#1b1c1c`, primary: `#fbc38a` amber
- Fonts: Hanken Grotesk (`--font-sans`), Inter (`--font-body`)
- CSS tokens: `--color-*` variables (e.g. `--color-primary`, `--color-surface-container`)
- Utility classes: `shadow-glow`, `glow-btn`, `amber-glow`, `shadow-sunken`, `shadow-extruded`, `recessed-surface`, `carved-surface`, `grain-overlay`
- Use inline `style={{ color: 'var(--color-primary)' }}` — Tailwind utility classes for these tokens are available too (`text-primary`, `bg-background`) but inline styles were used throughout for reliability

### Canvas (blue-gray neumorphic)
- Background: `#0c0e10`, primary: `#bbc7dd` blue-gray
- Fonts: Manrope (`--font-canvas-heading`), Work Sans (`--font-canvas-body`)
- CSS tokens: `--canvas-*` variables (e.g. `--canvas-bg`, `--canvas-primary`)
- Utility classes: `canvas-recessed`, `canvas-raised`, `canvas-search-recessed`, `canvas-tactile-pressed`

## Critical rules

### `'use server'` files
A file with `'use server'` at the top can **only** export async functions.
- `signal/auth.ts` — NextAuth config, no `'use server'`
- `signal/actions.ts` — server actions, has `'use server'`

### NextAuth v5 patterns
- Export: `export const { handlers, auth, signIn, signOut } = NextAuth({...})`
- Route handler (`api/auth/[...nextauth]/route.ts`): `export const { GET, POST } = handlers`
- Server components: `const session = await auth()`
- Client components: `useSession()` from `next-auth/react`
- Session update after DB change: `const { update } = useSession(); await update();` — triggers jwt callback with `trigger === 'update'`, which re-fetches user from MongoDB
- **auth.config.ts split**: `src/auth.config.ts` holds the edge-compatible config (no imports of bcrypt or mongoose). `src/signal/auth.ts` spreads it and adds the Credentials provider. `middleware.ts` imports from `auth.config.ts` — never from `signal/auth.ts` — because middleware runs at the edge.

### Saving preferences
PATCH `/api/user/preferences` accepts `{ userId, ...fields }`. After the DB write, call `await update({ refresh: true })` then `router.refresh()` to re-run server components with fresh session data.

### Google Fonts / Material Symbols
Load via `<link>` tags in `app/layout.tsx` — **never** via CSS `@import url()`. Tailwind v4 strips external URL imports from CSS.

### Server → Client component pattern
Canvas pages are server components that call `await auth()` and fetch data, then pass it as props to a `*Client.tsx` file. Avoid `useSession()` in canvas pages.

### Session user shape
```ts
{
  id: string;
  username: string;
  displayName: string;
  onboarded: boolean;
  preferences: {
    theme: 'amber' | 'nocturnal' | 'slate' | 'forest' | 'rose';
    accentColor: string;
    searchEngine: 'google' | 'duckduckgo' | 'ecosia' | 'bing';
    greeting: string;
    enabledCards: string[];
    categories: string[];
    customQuickActions: { id: string; label: string; icon: string; url: string; category: string }[];
    presetCardCategories: Record<string, string>;
    dashboardLayout: 'grid' | 'stream' | 'compact' | 'zen' | 'bento';
  };
}
```
Always call `.toObject()` on Mongoose documents before putting data into the JWT — Mongoose arrays and subdocuments are not plain-serializable.

## .env.local
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/morrow
AUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

## What's built
- Landing page (5-section scroll-jacked, Motion animations)
- Login + signup pages (amber landing theme)
- 3-step onboarding (greeting → search engine → cards)
- Home dashboard (greeting, search, quick-launch cards) — 5 layout modes: grid, stream, compact, bento, zen
- Quick-action card inline edit mode: pencil FAB (fixed bottom-right) toggles edit mode; clicking any card opens a slide-in panel to edit label/icon/url/category (custom cards) or category only (preset cards)
- Focus page (todo CRUD)
- Queue page (watchlist CRUD)
- Drift page (settings — theme, layout picker, display name, search engine, categories, custom quick actions)

## What's not built yet
- Bookmarks page
- Chrome extension manifest (`newtab.html` → `morrow.app/home`)
