# RULES.md — Tri Labs Permanent Design & Architecture Ledger

> **Source of Truth.** This file takes precedence over any AI-generated assumptions,
> boilerplate defaults, or library conventions. Every rule here reflects a deliberate,
> tested decision made during development of this portfolio.
> **Do not override any rule without explicit user approval.**

---

## 1. Core Navigation — Navbar

| Property | Value |
|---|---|
| Background | `bg-white` — solid, opaque. **No gradients, no blur, no transparency.** |
| Height | Exactly `h-[60px]`. Do not change this value. |
| Position | `fixed` + `top-0` + `z-50` |
| Vertical alignment | `items-center` on the inner flex row. Never use `items-start` or `items-end`. |
| Width | `w-full` |

**Page clearance rule:** Every page's `<main>` must open with `pt-[60px]` to clear the fixed navbar. This is non-negotiable.

---

## 2. Global Spacing — The Gallery Frame

All primary page sections must respect these padding values:

| Side | Value |
|---|---|
| Top (main element) | `pt-[60px]` (navbar clearance) |
| Left / Right | `px-[5vw]` at section level, or `px-10` for contained blocks |
| Bottom | `pb-10` minimum, `pb-16` for sections with a CTA button below |

- Inner content is constrained to `max-w-[1440px] mx-auto`.
- Section-to-section vertical rhythm: `pt-24 pb-16` on the `<section>` element.

---

## 3. The Rounded Corner Rule — **CRITICAL**

> This rule prevents the most common visual regression: square artifacts on image cards.

### The Law
- All **primary images and card containers** must use `rounded-[24px]`.
- The image element (`<Image />` or `<img>`) AND its parent container must carry the **same** `rounded-[24px]` class.
- The parent container **MUST** have `overflow-hidden` to clip internal content to the curve.

### The Correct HTML Pattern

```tsx
<div className="relative w-full h-full rounded-[24px] overflow-hidden group">
  <Image
    src="..."
    alt="..."
    fill
    className="object-cover rounded-[24px] transition-transform duration-500 group-hover:scale-105"
  />
  {/* Any hover overlay must ALSO carry rounded-[24px] */}
  <div className="absolute inset-0 rounded-[24px] bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</div>
```

### Common Violations to Avoid
- ❌ Placing `overflow-hidden` on a `<button>` element — browsers do not reliably clip absolutely-positioned children on replaced elements.
- ❌ Applying `rounded-*` only to the parent but not to the overlay or image.
- ❌ Using `rounded-xl` or `rounded-2xl` inconsistently — always use `rounded-[24px]` (exact value).
- ❌ Removing `rounded-[24px]` from any element on `:hover`.

---

## 4. Layout Architectures

### 4a. Featured Works (Homepage) — Asymmetric Bento Grid

- **Component:** `components/gallery/FeaturedGrid.tsx`
- **Grid:** `grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-4 grid-flow-dense`
- **Spans:** Each `Project` carries a `span` field from the CMS (e.g. `col-span-2 row-span-2`). Do not hardcode spans.
- **Max width:** `max-w-[1440px] mx-auto`
- **Images:** Rounded-[24px] per Rule 3. Grayscale filter applied to non-hero images (`i % 3 !== 0`).
- **Hover overlay:** Bottom-anchored gradient (`from-black/80 to-transparent`), title + location in `font-mono`.
- **Interaction:** Clicking a card opens `ProjectModal` — **never navigate to a new page.**

### 4b. Work Page — Bento Gallery

- **Component:** `components/gallery/WorkGallery.tsx`
- **Filter:** 4-category filter bar (Architecture, Design, Tool, Research). Filter is URL-driven via `?category=` query param.
- **Same rounding/overflow rules apply** as the Featured Works grid.

### 4c. Research / Tools — Uniform 3-Column Grid

- **Layout:** `grid-cols-1 md:grid-cols-3 gap-6`
- **Cards are balanced** — all cells the same size. No asymmetric spans.
- **Title:** Single line, `truncate` (no wrapping).
- **Excerpt:** Maximum 2 lines, `line-clamp-2`.
- **Interaction:** Clicking a card opens `ResearchModal` or a Lightbox — **never navigate to a new page.**

---

## 5. Typography — Inter Exclusively

> Full token table lives in `DESIGN.md`. These are the Tailwind-mapped values.

| Token | Size | Weight | Tracking | Usage |
|---|---|---|---|---|
| `display-xl` | `text-[80px]` | `font-bold` | `-0.04em` | Hero headings |
| `heading-lg` | `text-[32px]` | `font-medium` | `-0.02em` | Section titles |
| `body-md` | `text-base` (16px) | `font-normal` | default | Paragraphs, nav links |
| `data-mono` | `text-sm` (14px) | `font-normal` | `tracking-widest` | Metadata, stats |
| `label-caps` | `text-xs` (12px) | `font-bold` | `tracking-[0.1em]` | Buttons, small labels |

**Rules:**
- Font family: `Inter` only. Never override with a serif, system-ui, or monospace stack.
- Button text: always `uppercase label-caps` (`text-xs font-bold tracking-[0.1em] uppercase`).
- Section headings: `font-light tracking-tight` at `text-2xl md:text-3xl` for the "Featured Works / My Work Spans" pattern.

---

## 6. Interaction Model — Modal-First

> **Do not create new routes for content details.**

| Content Type | Detail View |
|---|---|
| Featured project card | Opens `<ProjectModal>` (lightbox, image + title + location) |
| Work gallery card | Opens `<ProjectModal>` |
| Research insight card | Opens `<ResearchModal>` or reading lightbox |
| CV entry | Inline expand or modal — never `/cv/:id` route |

**Modal behaviour rules:**
- Body scroll must be **locked** while any modal is open (`overflow-hidden` on `<body>`).
- Dismiss via: clicking the backdrop, pressing `Escape`, or an explicit close button.
- Modals are **client components** (`"use client"`). Parent server components pass data as props.

---

## 7. Color & Surface Tokens

> Canonical values from `DESIGN.md`. Do not deviate.

| Token | Value |
|---|---|
| Background | `#F9F9F9` |
| Surface / Card | `#EEEEEE` |
| Foreground / Text | `#000000` |
| Secondary text | `#4C4546` |
| Accent (Mischief Cyan) | `#61F9E9` |
| Pure White | `#FFFFFF` |

**Navbar background:** `#FFFFFF` (pure white), never `#F9F9F9`.

---

## 8. Image Handling

- **Library:** Always use Next.js `<Image>` (`next/image`), never bare `<img>`, for project and research images.
- **Fill mode:** Use `fill` prop + `sizes` attribute for grid cells. Parent must be `relative` and have explicit dimensions.
- **Grayscale aesthetic:** Non-hero images receive `grayscale(100%) contrast(120%)` via inline `style`. Hero image (index `i % 3 === 0`) remains in color.
- **External domains:** All allowed hostnames must be declared in `next.config.ts` under `images.remotePatterns`.

---

## 9. Component File Conventions

| Layer | Location |
|---|---|
| Page sections | `components/sections/` |
| Gallery/grid components | `components/gallery/` |
| Modals | `components/modals/` |
| Shared UI primitives | `components/ui/` |
| Layout (Navbar, Footer) | `components/layout/` |

- Server components are the default. Add `"use client"` only when hooks or browser APIs are required.
- CMS data fetching lives in `lib/cms.ts`. Do not fetch in components directly.
- All types live in `types/cms.ts`.

---

## 10. What Must Never Change Without Explicit Approval

1. The `60px` navbar height and `pt-[60px]` page clearance.
2. The `rounded-[24px]` value on image containers.
3. The modal-first interaction model (no detail page routes).
4. The `max-w-[1440px]` content cap.
5. The Inter font family.
6. The `overflow-hidden` + `rounded-[24px]` pairing on image wrappers.
