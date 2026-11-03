# Design QA

## Direction

- Reference: `https://www.ulrychkristian.cz`
- Adapted qualities: restrained editorial layout, large serif typography, portrait-led hero, sparse navigation, subtle star field, pointer-following light, image-led projects, and a full-screen mobile menu.
- Original implementation: all React, CSS, canvas, copy, imagery, and interactions in this project are Joshua's own assets and code.

## Responsive checks

- `320 x 700`: passed, no horizontal overflow.
- `390 x 844`: passed, hero and two-column metadata remain readable.
- `1440 x 900`: passed, desktop hero composition and navigation remain balanced.
- `2560 x 1440`: passed, constrained content and portrait scale cleanly.

## Interaction checks

- Cursor aura follows pointer and is disabled for touch/coarse pointers.
- Mobile menu opens as a full-screen overlay and prevents page scrolling.
- Project links preserve the existing case-study routes.
- Work, About, and Experience are distinct routes with an animated transition; desktop and mobile navigation checked.
- CV, GitHub, LinkedIn, email, and image assets resolve correctly.
- Reduced-motion users receive shortened or disabled motion.

## Browser checks

- No console errors.
- No broken hero or case-study images.
- Lighthouse desktop: Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100.
- Lighthouse mobile: Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100.

Final result: passed.
