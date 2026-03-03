# PLAN: Mobile Responsiveness Audit — KrmaPhal Coming Soon Page

## Overview
Audit and fix the Coming Soon page (`karmaphal.in`) for mobile responsiveness across all breakpoints. Currently designed primarily for desktop — needs full mobile optimization to match our divine luxury vision on every screen size.

---

## Target Devices & Breakpoints
| Breakpoint | Width | Devices |
|------------|-------|---------|
| **Mobile S** | 320px | iPhone SE, older Android |
| **Mobile M** | 375px | iPhone 12/13/14/15 |
| **Mobile L** | 428px | iPhone Pro Max, large Android |
| **Tablet** | 768px | iPad Mini, tablets |
| **Desktop** | 1024px+ | Already working |

---

## Phase 1: Audit (No Code — Identify Issues)

### Task 1.1: Preloader Audit
- [ ] Test Genesis animation on 375px width
- [ ] Check Sacred Geometry SVG sizing (65vmin — may be too large on mobile)
- [ ] Verify verse text wrapping (long Sanskrit word `कर्मण्येवाधिकारस्ते` on small screens)
- [ ] Check philosophy text visibility
- [ ] Check percentage counter position (bottom-8 — may overlap content)
- [ ] Brand name flash sizing (text-4xl — check fit)
- [ ] Verify particle burst doesn't cause overflow/scrollbar

### Task 1.2: Hero Section Audit
- [ ] Logo sizing: `text-6xl` on mobile — too big? Too small? Repha (र्) clipping?
- [ ] Bindu dot visibility at small sizes
- [ ] Tagline text wrapping and letter-spacing at 320px
- [ ] Services text wrapping (all 5 on one line?)
- [ ] Golden line width
- [ ] Scroll indicator position and visibility
- [ ] Ambient breathing glow size (900px fixed — bleeds on mobile?)

### Task 1.3: Countdown Section Audit
- [ ] Countdown boxes sizing and spacing at 375px
- [ ] "Launching Soon" text size and letter-spacing overflow
- [ ] Email input + button layout (rounded pill — does it squish?)
- [ ] Colon separators visibility
- [ ] Section padding

### Task 1.4: Services Section Audit
- [ ] 4-column grid → should be 2x2 or stacked on mobile
- [ ] SVG icon sizes
- [ ] Text sizing and readability
- [ ] Card spacing

### Task 1.5: Footer Audit
- [ ] Social icons spacing
- [ ] Copyright text wrapping

### Task 1.6: Interactive Elements Audit
- [ ] DivineTorch — disable or adapt for touch (no hover on mobile)
- [ ] MagneticButton — disable magnetic effect on touch
- [ ] Smooth scroll (Lenis) — verify touch/swipe behavior
- [ ] Sacred Geometry torch-reveal layer — no cursor on mobile

---

## Phase 2: Fix & Implement (After Audit Approval)

### Task 2.1: Preloader Mobile Fixes
- Adjust SVG geometry size for mobile
- Fix verse text overflow
- Adjust brand name sizing
- Ensure no horizontal scroll during animations

### Task 2.2: Hero Section Mobile Fixes
- Responsive logo sizing (possibly smaller on 320px)
- Adjust letter-spacing on tagline for narrow screens
- Services text: wrap to 2 lines or reduce tracking
- Fix breathing glow for mobile viewport
- Scroll indicator spacing

### Task 2.3: Countdown Mobile Fixes
- Stack countdown units 2x2 if needed, or reduce sizing
- "Launching Soon" tracking reduction on mobile
- Email form: full-width, possibly stack input/button vertically on smallest screens

### Task 2.4: Services Grid Mobile Fix
- Switch to 2-column or single-column on mobile
- Adjust icon + text sizes

### Task 2.5: Touch Interaction Fixes
- DivineTorch: Disable or use touch-move events on mobile
- MagneticButton: Disable magnetic pull on touch devices
- Sacred Geometry: Skip torch-reveal layer on mobile (no cursor)

### Task 2.6: Performance
- Reduce particle count on mobile (40 → 20)
- Check animation performance at 60fps on mid-range devices
- Verify `prefers-reduced-motion` support

---

## Phase 3: Test & Verify

### Task 3.1: Cross-Device Testing
- [ ] iPhone SE (320px)
- [ ] iPhone 14 (390px)
- [ ] iPhone 14 Pro Max (428px)
- [ ] iPad Mini (768px)
- [ ] Android mid-range (360px)
- [ ] Landscape mode check

### Task 3.2: Performance Testing
- [ ] Lighthouse mobile score
- [ ] Animation smoothness
- [ ] First contentful paint

---

## Components to Touch
| Component | File | Priority |
|-----------|------|----------|
| Preloader | `src/components/Preloader.tsx` | 🔴 High |
| MonolithHero | `src/components/MonolithHero.tsx` | 🔴 High |
| SacredGeometry | `src/components/SacredGeometry.tsx` | 🟡 Medium |
| ServiceTeaser | `src/components/ServiceTeaser.tsx` | 🟡 Medium |
| DivineTorch | `src/components/DivineTorch.tsx` | 🟡 Medium |
| MagneticButton | `src/components/MagneticButton.tsx` | 🟢 Low |
| SmoothScroll | `src/components/SmoothScroll.tsx` | 🟢 Low |
| globals.css | `src/app/globals.css` | 🟡 Medium |

---

## Execution Order
1. **Phase 1 (Audit)** → Screenshot every section at 375px → share with Abhi
2. **Phase 2 (Fix)** → Implement fixes component by component (after approval)
3. **Phase 3 (Test)** → Full device matrix verification

## Estimated Effort
- Phase 1: 15-20 minutes
- Phase 2: 45-60 minutes
- Phase 3: 15-20 minutes
