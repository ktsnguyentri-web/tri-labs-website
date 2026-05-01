# Architectural Mischief Portfolio - "Added Contact Section" Specifications

## 1. Core Philosophy
The design navigates the tension between rigid architectural precision and fluid spontaneity. It fuses **Architectural Minimalism** with **Swiss Punk**, using a stark, 12-column mathematical grid interrupted by cyan "mischief" elements (digital ink scribbles, annotations).

## 2. Color Palette (Hex)
Extracted directly from the "Added Contact Section" metadata:
- **Stark Black (Primary):** `#000000`
- **Pure White (Surface Lowest):** `#FFFFFF`
- **Background/Surface:** `#F9F9F9`
- **Surface Container:** `#EEEEEE`
- **Vibrant Cyan (Tertiary Fixed / Mischief Accent):** `#61F9E9`
- **Secondary Accent:** `#5D5F5F`
- **On-Surface Variant (Text):** `#4C4546`

## 3. Typography
- **Global Font:** **Inter** is used exclusively across all typography styles, providing a unified, modernist feel.
- `display-xl`: 80px, Font Weight 700, Letter Spacing -0.04em, Line Height 1.0 (Hero texts).
- `heading-lg`: 32px, Font Weight 500, Letter Spacing -0.02em, Line Height 1.2 (Section headers).
- `body-md`: 16px, Font Weight 400, Line Height 1.6 (Paragraphs, nav links).
- `data-mono`: 14px, Font Weight 400, Letter Spacing 0.05em (Metadata, stats - *Using Inter*).
- `label-caps`: 12px, Font Weight 700, Letter Spacing 0.1em, Uppercase (Small labels, button text - *Using Inter*).

## 4. Layout & Spacing Rules
- **Grid:** 12-column fixed grid structure. Content is often asymmetrically aligned.
- **Geometry:** 0px rounded corners (sharp edges) on all UI elements (buttons, cards, inputs). The only curves are the cyan scribbles.
- **Borders:** 1px or 2px black solid borders to define zones. No shadows.
- **Spacing:** 
  - `unit`: 8px
  - `gutter`: 24px
  - `margin-edge`: 48px
  - `section-gap`: 160px (Extreme vertical rhythm for breathing room).

## 5. Primary Components
- **Navbar:** Persistent top bar, minimal links (`body-md`). Active state is a cyan hand-drawn dot beneath the item.
- **Hero:** Full-width monochrome photography, massive typography, strict grid alignment.
- **Contact Section (NEW):** "Let's build something." Massive 100px typography, email link with an arrow that translates on hover. Clean footer with Socials and Copyright text, separated by 1px black lines.
- **Buttons:** Solid black rectangles with white monospace text (`label-caps`). Hover triggers a cyan scribble strike-through or circle extending past the edges.
- **Workspace Cards:** 0px radius high-res images, information displayed in a strict grid of `data-mono` labels below. 1px black borders.
- **Featured Works:** Masonry gallery grid layout. Monochrome base with occasional vibrant cyan/gold accents.
- **Log / CV List:** 1px horizontal rule separators. Hovering a row highlights the border in cyan. Input fields have bottom-border only (1px black), turning cyan on focus.
