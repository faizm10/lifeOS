# Relevant — Design System

Person of Interest–inspired personal intelligence console. Dark surveillance terminal aesthetic: calm, cinematic, precise.

## Color palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-base` | `#0a0e14` | Page background |
| `bg-panel` | `#0d1117` | Cards, sidebar |
| `bg-elevated` | `#161b22` | Hover, inputs |
| `border` | `#21262d` | Hairline borders |
| `text-primary` | `#c9d1d9` | Body text |
| `text-muted` | `#8b949e` | Secondary text |
| `text-dim` | `#484f58` | Labels, timestamps |
| `accent` | `#f0a020` | Relevant highlights, CTAs |
| `accent-dim` | `#b87d18` | Accent hover |
| `link` | `#39c5cf` | Links, graph edges, active |
| `danger` | `#f85149` | Alerts, delete |
| `success` | `#3fb950` | Confirmed, online |

## Typography

- **Headings:** Inter / Geist Sans — `font-sans`
- **Data / logs:** JetBrains Mono — `font-mono`
- **Scale:** `text-xs` (10px labels), `text-sm` (body), `text-lg` (section), `text-3xl` (hero)

## Spacing & radius

- Base unit: 4px
- Card padding: `p-4` / `p-6`
- Border radius: `2px` (`rounded-sm`) max — terminal feel

## Components

- `SectionLabel` — `§ SUBJECT // DOSSIER`
- `RelevantChip` — `[ RELEVANT ]` amber / `[ STALE ]` muted
- `StatusDot` — pulsing amber for active
- `TerminalLog` — monospace timestamp + content rows
- `Hairline` — 1px border divider

## Motion

- Status dot pulse: 2s ease-in-out infinite
- Page transitions: none (instant, terminal)
- Graph nodes: subtle glow on hover

## Accessibility

- Body text contrast ≥ 4.5:1 on `bg-base`
- Focus rings: `ring-accent/50`
