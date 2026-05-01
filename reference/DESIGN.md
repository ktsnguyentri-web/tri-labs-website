---
name: Monolith & Scribble
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00201d'
  on-tertiary-container: '#009488'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#61f9e9'
  tertiary-fixed-dim: '#3adccc'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  heading-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-edge: 48px
  section-gap: 160px
---

## Brand & Style

This design system navigates the tension between rigid architectural precision and the fluid spontaneity of a designer’s first sketch. It targets high-end institutional clients and luxury residential developers who value both technical mastery and creative soul.

The aesthetic fuses **Architectural Minimalism** with **Swiss Punk** influences. The UI acts as a silent gallery frame—stark, structured, and mathematical—interrupted by "raw human mischief" in the form of digital ink scribbles, hand-drawn annotations, and erratic underlines. In this light-mode iteration, the experience feels like a pristine white gallery wall or a fresh vellum sheet: high-contrast, clinical, and daylight-bright.

## Colors

The palette is intentionally binary, optimized for a high-contrast light environment to mimic architectural plans and premium editorial layouts.

- **Pure White (#FFFFFF):** Now the primary canvas color (background), providing a clean, expansive, and professional space for content.
- **Stark Black (#000000):** Used for structural elements, heavy borders, and primary typography to ensure maximum weight and authority against the white ground.
- **Vibrant Cyan (#40E0D0):** Reserved exclusively for the "mischief" layer—hand-drawn SVG scribbles, hover state highlights, and "as-built" annotations. It pops with electric clarity against the light background.
- **Architectural Grey (#F5F5F5):** Used as a subtle secondary canvas color or for utility zones like metadata containers and subtle UI dividing lines.

## Typography

The typographic strategy utilizes **Inter** as a singular, versatile voice to maintain a modern, engineered feel across all hierarchies.

**Headlines and Body:** Inter is used for navigation, body copy, and large display headlines. It is set with tight tracking for headlines to emphasize its geometric construction and generous leading for body text to maintain readability against the bright canvas.

**Technical Labels:** Also set in Inter, but distinguished by styling. These provide the "Technical" voice: used for metadata (e.g., project year, square footage, coordinates), button labels, and small instructional text. All technical labels are uppercase with increased letter spacing to emulate architectural drafting stamps.

## Layout & Spacing

The design system employs a **Fixed Grid** model based on a 12-column structure. 

- Use aggressive vertical rhythm; sections should be separated by large gaps (`section-gap`) to allow the portfolio imagery and white space to breathe.
- Content is often offset; for example, a project description might occupy 4 columns on the right, while the left 8 columns remain empty or house a single technical annotation.
- Alignment is uncompromisingly sharp. All elements must snap to the grid lines, creating a rigid skeleton that makes the cyan "scribble" elements feel truly disruptive.

## Elevation & Depth

This system avoids shadows and traditional depth cues in favor of a strictly flat, 2D aesthetic.

- **Stacking Logic:** Depth is conveyed through "layering" rather than "shading." Images may overlap slightly, or text may sit directly on top of a photograph.
- **Bold Borders:** Use 1px or 2px black borders to define zones and containers against the white background.
- **The Scribble Layer:** The cyan accent elements occupy the highest Z-index. They should appear to be "inked" onto the surface of the screen, often crossing over borders and text boundaries indiscriminately.

## Shapes

The geometry is absolute. Every functional UI element—buttons, input fields, image containers—uses **0px roundedness**. 

The only curves permitted in the design system are the organic, imperfect strokes of the Cyan accent elements. This contrast between the perfectly sharp rectangles of the UI and the messy loops of the scribbles is the core visual hook.

## Components

**Buttons:**
Primary buttons are solid black rectangles with white Inter text. On hover, a Cyan "scribble" strike-through or circle appears behind or over the button, extending past its edges.

**Input Fields:**
Simple bottom-border only (1px black). Labels sit above in `label-caps`. Focus state changes the bottom border to Cyan with a small hand-drawn asterisk appearing at the end of the line.

**Cards:**
Project cards consist of a high-resolution image with a 0px radius. Information is displayed below in a strictly organized grid of `data-mono` labels. No shadows; use a 1px black border to separate cards if they are adjacent.

**The 'Scribble' Overlays:**
A library of SVG assets representing human mark-making:
- *The Underline:* A shaky, double-stroke line.
- *The Circle:* An imperfect, non-closing loop used to highlight specific details.
- *The Arrow:* A quick, three-stroke directional pointer.
- *The Cross:* A "X" mark for deleting or closing modals.

**Navigation:**
A persistent top-bar with minimal links in `body-md`. The active state is indicated by a Cyan hand-drawn dot beneath the menu item.