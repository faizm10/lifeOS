# LifeOS — Next.js + TypeScript + Tailwind

A personal almanac for finance & life tracking. Editorial dark-on-cream aesthetic — serif display + mono labels, hairline rules, no card-grid SaaS clichés.

## Stack
- **Next.js 14** — App Router, server components by default
- **TypeScript** — strict mode
- **Tailwind CSS** — custom almanac palette in `tailwind.config.ts`, all values in `oklch()`
- Drop-in **shadcn/ui** compatible — Tailwind tokens align so you can `npx shadcn add` and the components inherit colors

## Setup

```bash
cd nextjs
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run type-check
```

## Project layout

```
nextjs/
├── app/
│   ├── layout.tsx              # root shell — sidebar + topbar + main
│   ├── globals.css             # Tailwind + almanac primitives (.btn, .tag, .chip, .section-head)
│   ├── page.tsx                # 00 — Dashboard (editorial front page)
│   ├── transactions/page.tsx   # 01 — Ledger view (filterable, grouped by date)  [client]
│   ├── bills/page.tsx          # 02 — Recurring bills (paid/due/scheduled)        [client]
│   ├── wishlist/page.tsx       # 03 — 30-day cool-off list
│   ├── goals/page.tsx          # 04 — Savings goals + budgets
│   ├── journal/page.tsx        # 05 — Notebook view with mood selector            [client]
│   ├── wins/page.tsx           # 06 — Career timeline                              [client]
│   ├── sports/page.tsx         # 07 — Sessions log
│   └── media/page.tsx          # 08 — Books / shows / films
├── components/
│   ├── Sidebar.tsx             # numbered nav with active-state hairline
│   ├── Topbar.tsx              # breadcrumb + search + date
│   └── ui.tsx                  # <Bar>, <Tag>, <Money>, <LabelMono>, <SectionHead>, <Hairline>
├── lib/
│   ├── data.ts                 # typed seed data (Transaction, Bill, Goal, …)
│   └── utils.ts                # date helpers, clsx, formatters
├── tailwind.config.ts          # almanac palette + serif/mono/sans stacks
├── postcss.config.js
├── tsconfig.json               # strict + @/* path alias
└── next.config.js
```

## Design tokens

### Colors (Tailwind keys → oklch)
| Key | Use |
|---|---|
| `paper` / `paper-2` | page bg / sidebar bg |
| `surface` | elevated surface |
| `warm-bg` / `warm-surface` | journal-only warmer tint |
| `ink`, `ink-2`, `ink-3`, `ink-4` | text from highest to lowest contrast |
| `rule`, `rule-soft`, `rule-strong` | hairline borders |
| `accent`, `accent-soft`, `accent-fg` | runtime CSS-var driven |
| `pos`, `neg`, `warn` | semantic |

### Type
- **Serif (display):** Instrument Serif — `font-serif`
- **Sans (UI):** Geist — `font-sans` (default)
- **Mono (labels/numbers):** Geist Mono — `font-mono`

Loaded from Google Fonts in `globals.css`. Swap to `next/font` for production if desired.

### Patterns
- `.label-mono` — small uppercase mono label
- `.section-head` — `§ NN  Title  meta` rule-bottom header
- `.btn`, `.btn-ghost`, `.btn-primary`
- `.tag`, `.tag-solid`
- `.chip`, `.chip-active` — segmented filter buttons
- `.hairline`, `.hairline-strong`

## Theming the accent color

The accent is a CSS variable so it can be swapped at runtime (e.g. user preference):

```css
:root { --accent: oklch(0.46 0.16 28); }   /* oxblood — default */
```

Suggested alternates in the prototype:
- Ink black — `oklch(0.30 0.030 65)`
- Olive — `oklch(0.45 0.10 110)`
- Plum — `oklch(0.42 0.13 320)`
- Rust — `oklch(0.55 0.16 45)`

Persist via cookie/localStorage in a small client component if you want it user-tweakable.

## Adding shadcn/ui

```bash
npx shadcn@latest init     # accept defaults — points at app/globals.css
npx shadcn@latest add button card input dialog
```

Edit the generated tokens to map onto our palette (e.g. `--background` → `paper`, `--foreground` → `ink`, `--primary` → `accent`).

## Notes
- All "today" references use `TODAY = "2026-05-09"` in `lib/utils.ts`. Replace with `new Date()` for live dates.
- Seed data in `lib/data.ts` — replace with your DB / API. Types are exported.
- Pages marked `[client]` are `"use client"` for interactive state. The rest are server components.
- The dashboard, sports page, media page, and goals page are pure server components — they'll prerender at build time.
