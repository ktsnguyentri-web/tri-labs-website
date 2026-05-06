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

## 3. The Square Corner Rule — **CRITICAL**

> This rule ensures a brutalist, architectural aesthetic by eliminating all curves from structural elements.

### The Law
- All **images, card containers, and structural UI elements** must have square corners (`rounded-none` or simply no `rounded-*` class).
- This applies to `<Image />` elements, their parent wrappers, hover overlays, and modals.
- Never use `rounded-xl`, `rounded-[12px]`, or any other rounding on these elements.

### Common Violations to Avoid
- ❌ Leaving `rounded-[12px]` on an image while the parent is square.
- ❌ Using `rounded-full` for image-based avatars or icons (unless they are specifically decorative scribbles).
- ❌ Inconsistent rounding between a card and its internal image.

---

## 4. Layout Architectures

### 4a. Featured Works (Homepage) — Asymmetric Bento Grid

- **Component:** `components/gallery/FeaturedGrid.tsx`
- **Grid:** `grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-4 grid-flow-dense`
- **Spans:** Each `Project` carries a `span` field from the CMS (e.g. `col-span-2 row-span-2`). Do not hardcode spans.
- **Max width:** `max-w-[1440px] mx-auto`
- **Images:** rounded-[12px] per Rule 3. Grayscale filter applied to non-hero images (`i % 3 !== 0`).
- **Hover overlay:** Bottom-anchored gradient (`from-black/80 to-transparent`), title + location in `font-mono`.
- **Interaction:** Clicking a card updates the URL to `/work/[slug]`, triggering an **Intercepted Route** to show the `ProjectModal` while maintaining the homepage context.

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

> Full token table lives in `DESIGN.md`. All typography must strictly adhere to the 'Foster + Partners' architectural aesthetic.

| Token | Size | Weight | Tracking | Line-Height | Usage |
|---|---|---|---|---|---|
| `display-2xl` | `144px` | `700` (Bold) | `-0.04em` | `1.0` | Massive Section Headers |
| `display-xl` | `96px` | `300` (Light) | `-0.04em` | `1.0` | Hero titles, taglines |
| `heading-lg` | `48px` | `300` (Light) | `-0.02em` | `1.1` | Sub-headers, article titles |


| `body-md` | `16px` | `400` (Normal) | `default` | `1.625` | Paragraphs, long-form text |
| `data-mono` | `11px` | `400` (Normal) | `0.2em` | `1.4` | Metadata, tags, secondary info |
| `label-caps` | `11px` | `700` (Bold) | `0.2em` | `1.4` | Buttons, navigation links, labels |

**Core Rules:**
- **Primary Display Font**: Strictly use **Inter**.
- **Rule #5: Consistent Typography Scaling**:
  - All display text must follow the established scale to ensure architectural alignment.
  - Taglines/Headers: Use predefined `display-*` or `heading-*` classes.
  - Grid elements must stay exactly within the clean layout lines.
- **Body Comfort**: Body text must use `text-on-surface-variant` (`#4C4546`) and `leading-relaxed` (1.625) for superior readability.
- **Metadata Contrast**: Small labels and metadata must use ultra-wide `0.2em` tracking and `11px` size to contrast against massive headers.
- **Navbar & Buttons**: Must use `label-caps` style (`text-[11px] font-bold tracking-[0.2em] uppercase`).

---

## 6. Interaction Model — Intercepted Routes

> **Use Intercepting Routes for shareable project links via Modals.**

| Content Type | Interaction |
|---|---|
| Project card (any) | Updates URL to `/work/[slug]`. If navigating from a gallery, it **intercepts** the route to show `<ProjectModal>`. |
| Direct Link | Navigating directly to `/work/[slug]` renders a **Full-Page** view (`app/work/[slug]/page.tsx`). |
| Research card | Currently opens `<ResearchModal>` (Standard Modal). |
| CV entry | Inline expand or modal — never `/cv/:id` route. |

**Routing behavior rules:**
- Intercepted modals must allow the user to share the URL of the project they are viewing.
- Use `router.back()` to close intercepted modals and return to the previous context.
- Modals are **client components** (`"use client"`). Intercepted page components fetch data and pass it as props.
- Body scroll must be **locked** while any modal is open (`overflow-hidden` on `<body>`).

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
2. The **square corner** (0px) requirement for all image containers and structural UI.
3. The `label-caps` typography style.
4. The `data-mono` typography style.
5. The `Inter` font family.
6. The `overflow-hidden` + square corner pairing on image wrappers.
