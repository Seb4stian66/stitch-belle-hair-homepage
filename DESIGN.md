```markdown
# Design System Document: The Curated Atelier

## 1. Overview & Creative North Star
This design system is built upon the concept of **"The Curated Atelier."** Unlike standard high-street salon interfaces that rely on flashy imagery and cluttered grids, this system treats digital space like a physical luxury gallery. It is characterized by high-end craftsmanship, "Silent Luxury," and a refusal to follow generic "template" aesthetics.

The creative direction rejects rigid, boxed-in layouts in favor of **Intentional Asymmetry** and **Editorial Breathing Room.** By utilizing vast whitespace and unconventional compositions, we signal to the user that "Belle Hair by Mrs. Fati" is a premium, bespoke experience where detail is everything.

---

## 2. Colors: The Tonal Landscape
The palette transitions away from the starkness of pure black and white toward a sophisticated interplay of **Deep Anthracite (#2F2F2F)**, **Warm Off-White (#F5F5F0)**, and the metallic warmth of **Brushed Bronze (#A67C52)**.

### The "No-Line" Rule
To maintain a premium feel, designers are strictly prohibited from using 1px solid borders for sectioning content. Boundaries must be defined through:
*   **Background Color Shifts:** A section using `surface-container-low` (#f6f3f2) sitting on a `surface` (#fbf9f8) background.
*   **Tonal Transitions:** Using subtle shifts in the surface hierarchy to guide the eye.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of heavy-weight artisanal paper. 
*   **Base:** `surface` (#fbf9f8)
*   **Low Importance:** `surface-container-low` (#f6f3f2)
*   **High Importance/Floating:** `surface-container-lowest` (#ffffff)
Use these levels to create depth. A card should not "sit" on a page; it should emerge from it through a shift in tone.

### The "Glass & Gradient" Rule
For elements that must float (e.g., sticky headers or quick-action menus), use **Glassmorphism**. Combine semi-transparent surface colors with a `backdrop-blur` effect. 
*   **Signature Texture:** Main CTAs or Hero backgrounds should utilize a subtle linear gradient transitioning from `primary` (#79542e) to `primary_container` (#956c44) at a 135-degree angle to provide a metallic "Brushed Bronze" soul that feels tactile and expensive.

---

## 3. Typography: The Editorial Voice
This design system pairs a high-contrast Serif with a utilitarian Geometric Sans-Serif to balance heritage with modern precision.

*   **Display & Headlines (Noto Serif):** These are the "hero" moments. Use `display-lg` (3.5rem) with generous letter-spacing to command attention. Headlines should feel like title cards in a high-fashion film.
*   **Body & Titles (Manrope):** Chosen for its clean, unisex, and architectural qualities. `body-lg` (1rem) provides a comfortable reading experience, while `label-md` (0.75rem) in All-Caps should be used for metadata to evoke a sense of professional labeling.
*   **The Hierarchy Goal:** Use extreme scale differences. A `display-lg` headline paired with a tiny, airy `label-sm` creates an "Editorial" look that generic systems lack.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often too "digital." We achieve elevation through natural light physics and tonal stacking.

*   **The Layering Principle:** Depth is achieved by placing a `surface-container-lowest` card on a `surface-container-low` section. The contrast in the off-white tones provides a "soft lift" without the need for heavy shadows.
*   **Ambient Shadows:** If a floating effect is required (e.g., a modal), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(80, 69, 59, 0.06);`. The shadow color is a tinted version of `on-surface-variant` to mimic natural ambient light.
*   **The "Ghost Border" Fallback:** If a container needs containment against a similar background, use a "Ghost Border": the `outline-variant` token (#d4c4b7) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Buttons
*   **Primary:** Filled with the `primary` (#79542e) gradient. Use `rounded-md` (0.375rem). Text is `on-primary` (#ffffff), set in `label-md` All-Caps with 0.1rem letter spacing.
*   **Secondary:** No fill. Uses the "Ghost Border" (outline-variant at 20%) with `on-surface` text.
*   **States:** On hover, primary buttons should subtly increase in "glow" (using a soft inner-shadow) rather than changing color drastically.

### Cards & Lists
*   **Forbid Dividers:** Do not use horizontal lines to separate list items. Use vertical white space (`spacing-8`) or alternating background tones (`surface` vs `surface-container-low`).
*   **Modern Cards:** Use `rounded-xl` (0.75rem) for image-heavy cards. Content should be padded with `spacing-6` to ensure the layout feels "un-cramped."

### Input Fields
*   **Minimalist Form:** Avoid the "box" look. Use a `surface-container-low` fill with a bottom-only `outline` (#82756a). When focused, the bottom border transitions to `primary` (#79542e) with a subtle 2px thickness.

### Signature Component: The "Atelier Gallery"
A specialized masonry grid for salon portfolio work. Images should use varying aspect ratios (e.g., 4:5 and 1:1) with asymmetric spacing (`spacing-4` on one side, `spacing-8` on the other) to break the "grid" feel and appear like a curated scrapbook.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Whitespace:** Use `spacing-20` or `spacing-24` between major sections to let the design breathe.
*   **Use Intentional Asymmetry:** Offset text blocks from center-aligned images to create a high-end editorial rhythm.
*   **Maintain Unisex Appeal:** Stick to the Anthracite and Bronze palette; avoid decorative flourishes that lean too far into traditional "beauty salon" tropes.

### Don't:
*   **Don't use 1px Borders:** This is the quickest way to make a premium design look "cheap." Use color shifts instead.
*   **Don't use Standard Shadows:** Avoid the default CSS `0 2px 4px rgba(0,0,0,0.5)`. It is too harsh for "Silent Luxury."
*   **Don't use Swirly Scripts:** All personality should come from the high-quality Serif and the Bronze accent, not from "fancy" handwriting fonts.
*   **Don't Overuse the Accent:** Brushed Bronze is a spice, not the main course. Use it for CTAs, icons, and small highlights only.