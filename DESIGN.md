# DESIGN.md

How the Advech web app looks. The brand (palette, type, radii, elevation, motion) comes from the Advech landing page; its marketing layouts do not. All values live as tokens in `src/styles.css` (the single source of truth, covered by `src/styles.test.ts`). Use tokens and the named utilities below; never raw palette classes (`gray-500`, `red-600`) or arbitrary values (`text-[13px]`, `bg-[#fff]`).

## Themes

Dark is the default; light is fully supported. The `dark` class on `<html>` is set before first paint from `localStorage["theme"]` (`src/lib/theme.ts`). Light is derived from dark (off-white canvas, white cards, low-alpha black hairlines), not inverted.

## Palette

| Token | Dark | Light |
| --- | --- | --- |
| `background` | `#08090a` | `#f6f6f7` |
| `card`, `popover` (raised) | `#161719` | `#ffffff` |
| `secondary`, `muted`, `accent` (highest) | `#212226` | `#eceef0` / `#eef0f2` |
| `foreground` | `#f7f8f8` | `#08090a` |
| `muted-foreground` | `#9a9fa8` | `#5b6069` |
| `border` / `input` | white 10% / 15% | black 10% / 16% |
| `primary` | `#ff5001` (hover `#ff6a26`) | `#ff5001` (hover `#e64700`) |
| `primary-foreground` | `#08090a` | `#08090a` |

Muted text is at least 4.5:1 on every surface in both themes. The landing page's fainter `#62666d` is deliberately not used.

## Orange rule

Orange (`primary`, `ring`, `glow`) is for primary actions, focus rings and live status only. Hover on links and nav items uses neutral emphasis (`accent`), never orange. Secondary and outline buttons are neutral.

## Status colours

Each of `success`, `warning`, `info` (`#4ea7ff` in dark) and `destructive` has four tokens: `X` (solid), `X-foreground` (text on solid), `X-soft` (tinted background), `X-soft-foreground` (text on the soft background). Utilities: `bg-success`, `text-success-foreground`, `bg-success-soft`, `text-success-soft-foreground`, and so on.

Mapping (applied by the shared `StatusBadge` in `src/components/StatusBadge`, via the pure `statusVisual(kind, status)`): `APPROVED` success; `PENDING_REVIEW` info; `NEEDS_CHANGES` and `IN_PROGRESS` warning; `REJECTED` destructive solid (final); `SUSPENDED` destructive soft (recoverable); `DRAFT` and `REGISTERED` neutral. No feature file chooses a status colour.

## Type

Geist (400, 500, 600) for text. IBM Plex Sans Arabic (400, 500, 600) replaces it when the interface language is Arabic (`:lang(ar)` re-points `--font-sans`; Geist stays as the Latin fallback). JetBrains Mono (400, 500) is for small uppercase labels only, never body text. All fonts are self-hosted via `@fontsource`.

| Utility | Size / line height | Weight |
| --- | --- | --- |
| `text-display` | 2.5rem / 1.1 | 600 |
| `text-headline-lg` | 1.75rem / 1.2 | 600 |
| `text-headline-md` | 1.25rem / 1.3 | 500 |
| `text-body-lg` | 1rem / 1.6 | 400 |
| `text-body-md` | 0.875rem / 1.5 | 400 |
| `text-label-caps` | 0.75rem, mono, uppercase, tracked | 500 |

`text-label-caps` (0.75rem) is the smallest size allowed. In Arabic it drops the mono face, uppercase and tracking. The scale is tighter than the landing page's (display 72px) because the app is dense.

## Radii

`rounded-sm` 0.25rem, `rounded-md` 0.5rem (the default, `--radius`), `rounded-lg` 0.75rem, `rounded-xl` 1rem, `rounded-2xl` 1.5rem, `rounded-full` pill. Controls use `md`, cards `lg` or `xl`.

## Elevation and motion

Elevation is neutral shadows (`shadow-xs` to `shadow-lg`); tables, forms and dialog bodies stay flat. Two special effects, used sparingly:

- Glow (`shadow-glow`, `--glow`): an orange halo for primary-button hover and focus.
- Glass (`glass` utility: translucent surface, blur, hairline): sidebar and navbar only.

Under `prefers-reduced-motion` the glow becomes transparent and transitions are effectively instant (functional spinners keep running).

## Shell, logo and page patterns

- Logo: `Logo` (`src/components/Logo.tsx`) shows the Advech icon or wordmark, orange on light and white on dark, switched by the `dark` class. Favicons live in `public/`.
- Glass is used by the sidebar and navbar only. Active and hover sidebar entries use `sidebar-accent`, not orange.
- Spacing scale (one scale for the whole app): `p-page` page gutter (1rem, 1.5rem from `md`), `gap-section` between sections of a page (1.5rem, 2rem from `md`), `gap-stack` between related items inside a section (1rem). Tokens: `--page-gutter`, `--section-gap`, `--stack-gap`.
- `PageLayout` takes `title` or `breadcrumbs`, `description` and `actions`.
- `TableCard` (+ `TableCardHeader`, `TableCardToolbar`, `TableCardFooter`) frames a table; `FormSectionCard` frames a group of fields. Both are flat.
- Empty state is `NoDataFound` (title, description, optional action); loading rows are `TableSkeletonRows`; `DataTable` uses both.

## Do

- Use semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`).
- Use logical properties (`ms-*`, `ps-*`, `text-start`) so RTL works.
- Keep one primary (orange) action per view.
- Add a token for both themes, with a foreground, and extend the parity test.

## Don't

- Don't use raw palette classes, hex colours or arbitrary sizes in feature code.
- Don't use orange for hover, decoration, borders or non-live status.
- Don't use mono for body text, or put glow or glass on tables, forms or dialog bodies.
- Don't copy landing-page hero treatments, large gradients or marketing spacing.
- Don't add design terms to `GLOSSARY.md` (domain terms only).
