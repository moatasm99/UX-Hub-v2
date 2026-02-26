# UX Design Hub — Design System

> **Purpose:** Unify every UI decision so the platform keeps the exact same look and feel.
> Extracted from the existing codebase — no redesign, just standardized.

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography](#2-typography)
3. [Spacing System](#3-spacing-system)
4. [Border Radius](#4-border-radius)
5. [Shadow System](#5-shadow-system)
6. [Component Tokens](#6-component-tokens)
7. [Animation Rules](#7-animation-rules)

---

## 1. Color System

All color tokens are defined as CSS custom properties in `src/index.css` and swapped via the `.dark` class.

### 1.1 Backgrounds

| Token             | Light              | Dark               | Usage                      |
| ----------------- | ------------------ | ------------------- | -------------------------- |
| `--bg-primary`    | `#f8fafc`          | `#020617`           | Page background            |
| `--bg-secondary`  | `#ffffff`          | `#0f172a`           | Elevated surfaces          |
| `--bg-tertiary`   | `#f1f5f9`          | `#1e293b`           | Inset / grouped areas      |

**Tailwind mapping:**

```
bg-primary    → var(--bg-primary)      slate-50  / slate-950
bg-secondary  → var(--bg-secondary)    white     / slate-900
bg-tertiary   → var(--bg-tertiary)     slate-100 / slate-800
```

### 1.2 Surface / Glass

| Token            | Light                      | Dark                         |
| ---------------- | -------------------------- | ----------------------------- |
| `--card-bg`      | `rgba(255,255,255, 0.7)`   | `rgba(15,23,42, 0.7)`        |
| `--card-border`  | `rgba(0,0,0, 0.05)`        | `rgba(255,255,255, 0.08)`    |
| `--header-bg`    | `rgba(255,255,255, 0.8)`   | `rgba(2,6,23, 0.8)`          |

Used with `backdrop-filter: blur(12px)` for glassmorphism.

### 1.3 Primary (Brand)

| Role         | Tailwind           | Hex        |
| ------------ | ------------------ | ---------- |
| Brand main   | `purple-600`       | `#9333ea`  |
| Brand accent | `pink-600`         | `#db2777`  |
| Brand glow   | `purple-500/25`    | —          |

Logo gradient: `bg-gradient-to-br from-purple-600 to-pink-600`
Title text: `bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`

### 1.4 Accent Gradients

| Name             | Classes                                               | Usage                    |
| ---------------- | ----------------------------------------------------- | ------------------------ |
| Emerald → Teal   | `from-emerald-500 to-teal-500`                        | Courses nav active       |
| Amber → Orange   | `from-amber-500 to-orange-500`                        | Roadmap nav active       |
| Emerald → Green  | `from-emerald-500 to-green-600`                       | Completed modules        |
| Purple → Violet  | `from-purple-500 to-violet-600`                       | Active modules           |
| Red → Rose       | `from-red-500 to-rose-600`                            | Video resource icon      |
| Blue → Indigo    | `from-blue-500 to-indigo-600`                         | Article resource icon    |
| Amber → Orange   | `from-amber-50 to-orange-50` (dark: `900/20`)         | Task badge bg            |

### 1.5 Accent Flat Colors

Defined as CSS custom properties:

| Token               | Hex        | Tailwind          |
| -------------------- | ---------- | ----------------- |
| `--accent-purple`    | `#9333ea`  | `purple-600`      |
| `--accent-pink`      | `#ec4899`  | `pink-500`        |
| `--accent-emerald`   | `#10b981`  | `emerald-500`     |
| `--accent-teal`      | `#14b8a6`  | `teal-500`        |
| `--accent-amber`     | `#f59e0b`  | `amber-500`       |
| `--accent-orange`    | `#f97316`  | `orange-500`      |

### 1.6 Semantic Colors

| Role      | Tailwind class              | Usage                  |
| --------- | --------------------------- | ---------------------- |
| Success   | `emerald-500` / `green-500` | Published badges, done |
| Warning   | `amber-500` / `yellow-400`  | Drafts, caution        |
| Danger    | `red-600` / `red-500`       | Delete, errors         |
| Info      | `blue-600` / `blue-500`     | Primary actions, links |

### 1.7 Text

| Token              | Light      | Dark       | Tailwind fallback     |
| ------------------ | ---------- | ---------- | --------------------- |
| `--text-primary`   | `#0f172a`  | `#f8fafc`  | `slate-900` / `slate-50`  |
| `--text-secondary` | `#475569`  | `#cbd5e1`  | `slate-600` / `slate-300` |
| `--text-tertiary`  | `#94a3b8`  | `#64748b`  | `slate-400` / `slate-500` |

**Admin-specific text:**

| Role              | Tailwind         |
| ----------------- | ---------------- |
| Primary           | `text-white`     |
| Secondary         | `text-slate-400` |
| Muted             | `text-slate-500` |
| Label             | `text-slate-300` |

### 1.8 Borders

| Token              | Light      | Dark       |
| ------------------- | ---------- | ---------- |
| `--border-color`   | `#e2e8f0`  | `#1e293b`  |
| `--border-hover`   | `#cbd5e1`  | `#334155`  |

**Admin-specific borders:**

| Role          | Tailwind            |
| ------------- | ------------------- |
| Default       | `border-slate-800`  |
| Divider       | `border-slate-700`  |
| Focus ring    | `ring-blue-500/50`  |

---

## 2. Typography

### 2.1 Font Family

```css
/* Primary — body & UI */
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

/* Display — Arabic + headings */
--font-display: "Cairo", "Inter", ui-sans-serif, system-ui, sans-serif;
```

**Load from Google Fonts:** `Inter:400;500;600;700` and `Cairo:600;700`

### 2.2 Heading Scale

| Level | Size (Tailwind) | Weight        | Usage                            |
| ----- | --------------- | ------------- | -------------------------------- |
| H1    | `text-4xl`      | `font-bold`   | Landing hero                     |
| H2    | `text-3xl`      | `font-bold`   | Section titles                   |
| H3    | `text-2xl`      | `font-bold`   | Page headers (admin)             |
| H4    | `text-xl`       | `font-bold`   | Card titles, sidebar header      |
| H5    | `text-lg`       | `font-semibold` | Sub-section titles             |
| H6    | `text-base`     | `font-semibold` | Label headings                 |

### 2.3 Body Sizes

| Token     | Tailwind     | Usage                        |
| --------- | ------------ | ---------------------------- |
| Body LG   | `text-lg`    | Hero descriptions            |
| Body      | `text-base`  | Standard paragraphs          |
| Body SM   | `text-sm`    | Nav items, table cells, tags |
| Caption   | `text-xs`    | Badges, timestamps, metadata |

### 2.4 Font Weights

| Weight | Tailwind          | Usage                    |
| ------ | ----------------- | ------------------------ |
| 400    | `font-normal`     | Body text                |
| 500    | `font-medium`     | Nav links, buttons, tags |
| 600    | `font-semibold`   | Sub-headings, labels     |
| 700    | `font-bold`       | Headings, brand text     |

### 2.5 Line Height

| Context     | Value  |
| ----------- | ------ |
| Global root | `1.5`  |
| Headings    | `1.2` – `1.3` (tight) |
| Body text   | `1.5` – `1.6` (relaxed) |

### 2.6 Rendering

```css
font-synthesis: none;
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

---

## 3. Spacing System

### 3.1 Base Scale (4px)

| Token  | CSS      | Tailwind |
| ------ | -------- | -------- |
| xs     | `4px`    | `1`      |
| sm     | `8px`    | `2`      |
| md     | `12px`   | `3`      |
| base   | `16px`   | `4`      |
| lg     | `20px`   | `5`      |
| xl     | `24px`   | `6`      |
| 2xl    | `32px`   | `8`      |
| 3xl    | `48px`   | `12`     |

### 3.2 Section Spacing

| Context                      | Tailwind       |
| ---------------------------- | -------------- |
| Page padding (public)        | `px-4 py-8 lg:px-6` |
| Page padding (admin)         | `p-4 lg:p-8`  |
| Section vertical gap         | `space-y-8` / `gap-8` |
| Card internal padding        | `p-6`         |
| Modal internal padding       | `p-6`         |
| Form field gap               | `space-y-4`   |

### 3.3 Container Widths

| Context             | Tailwind          | Pixels   |
| -------------------- | ----------------- | -------- |
| Public max width     | `max-w-7xl`       | 1280px   |
| Admin max width      | `max-w-7xl`       | 1280px   |
| Admin sidebar        | `w-64`            | 256px    |
| Modal — small        | `max-w-sm`        | 384px    |
| Modal — medium       | `max-w-md`        | 448px    |
| Modal — large        | `max-w-lg`        | 512px    |
| Modal — wide form    | `max-w-2xl`       | 672px    |

---

## 4. Border Radius

| Element            | Tailwind         | CSS          |
| ------------------ | ---------------- | ------------ |
| Cards (public)     | `rounded-3xl`    | `24px`       |
| Cards (admin)      | `rounded-xl`     | `12px`       |
| Buttons (admin)    | `rounded-lg`     | `8px`        |
| Buttons (public)   | `rounded-xl`     | `12px`       |
| Nav tabs           | `rounded-xl`     | `12px`       |
| Tab container      | `rounded-2xl`    | `16px`       |
| Modals (admin)     | `rounded-xl`     | `12px`       |
| Login card         | `rounded-2xl`    | `16px`       |
| Inputs             | `rounded-lg`     | `8px`        |
| Badges             | `rounded-full`   | `9999px`     |
| Logo icon          | `rounded-xl`     | `12px`       |
| Category badges    | `rounded-2xl`    | `16px`       |
| Scrollbar thumb    | `3px`            | `3px`        |

---

## 5. Shadow System

### 5.1 Shadow Tiers

| Name            | Tailwind        | Usage                          |
| --------------- | --------------- | ------------------------------ |
| Base            | `shadow-sm`     | Inset cards (light mode)       |
| Medium          | `shadow-md`     | Badge icons, resource items    |
| Large           | `shadow-lg`     | Active nav, buttons            |
| Extra Large     | `shadow-xl`     | Data tables                    |
| 2X Large        | `shadow-2xl`    | Modals, confirm dialogs        |

### 5.2 Colored Shadows

| Usage                | Class                           |
| -------------------- | ------------------------------- |
| Logo glow            | `shadow-purple-500/25`          |
| Admin button glow    | `shadow-blue-900/20`            |
| Module glow (light)  | `shadow-purple-100`             |
| Module glow (dark)   | `shadow-purple-500/10`          |
| Course card (dark)   | `shadow-purple-500/20`          |
| Course card (light)  | `shadow-purple-200`             |

### 5.3 Glass Card Hover Shadow

```css
/* Light mode */
.glass-card:hover {
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
}

/* Dark mode */
.dark .glass-card:hover {
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5);
}
```

---

## 6. Component Tokens

### 6.1 Button Variants

#### Primary (Admin)

```
bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg
shadow-lg shadow-blue-900/20
disabled:opacity-50 disabled:cursor-not-allowed
transition-all
```

Sizes:
- Header action: `px-5 py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98]`
- Form submit: `px-6 py-2 rounded-lg`
- Inline action: `px-4 py-2 rounded-lg`

#### Danger

```
bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg
transition-colors
```

#### Ghost / Cancel

```
text-slate-400 hover:text-white font-medium
hover:bg-slate-800 rounded-lg transition-colors
```

#### Icon Button

```
p-2 text-slate-400 rounded-lg transition-colors

hover:text-white  hover:bg-slate-700       ← Edit
hover:text-red-400 hover:bg-red-500/10     ← Delete
```

#### Nav Active (Public)

```
bg-gradient-to-r {activeGradient} text-white shadow-lg
rounded-xl px-4 py-2.5 text-sm font-medium
```

#### Logout

```
bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-300
hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20
transition-all duration-200
```

### 6.2 Badge Styles

#### Status Badge

```
inline-flex items-center gap-1.5
px-2.5 py-1 rounded-full text-xs font-medium border

Published:  bg-emerald-500/10  text-emerald-400  border-emerald-500/20
Draft:      bg-yellow-500/10   text-yellow-400   border-yellow-500/20
```

#### Type Badge (resources)

```
inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border

Video:    bg-red-500/10    text-red-400    border-red-500/20
Article:  bg-blue-500/10   text-blue-400   border-blue-500/20
Tool:     bg-purple-500/10 text-purple-400 border-purple-500/20
Book:     bg-amber-500/10  text-amber-400  border-amber-500/20
```

#### Hero Page Badge

```
inline-flex items-center gap-2 px-4 py-2 rounded-full
bg-gradient-to-r from-{color}-500/10 to-{color}-500/10
border border-{color}-500/20
```

#### Task Badge (Public)

```
Light:  bg-gradient-to-br from-amber-50  to-orange-50
        border border-amber-400
Dark:   bg-gradient-to-br from-amber-900/20 to-orange-900/20
        border border-amber-500/40
```

### 6.3 Card Styles

#### Glass Card (Public)

```css
.glass-card {
  background: var(--card-bg);                 /* translucent */
  backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  transition: transform 250ms var(--ease-spring),
              box-shadow 250ms var(--ease-out),
              border-color 250ms ease;
}

.glass-card:hover {
  transform: translateY(-4px) scale(1.01);
  border-color: rgba(147, 51, 234, 0.3);       /* purple tint */
  box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15);
}
```

#### Admin Data Card / Table Container

```
bg-slate-900 border border-slate-800 rounded-xl
overflow-hidden shadow-xl
```

#### Admin Confirm Dialog

```
bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl
max-w-sm (or max-w-md)
```

### 6.4 Input Styles

#### Admin Text Input

```
w-full bg-slate-950 border border-slate-800 rounded-lg
px-4 py-2.5 text-white
focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
outline-none transition-all
```

#### Admin Search Input

```
w-full bg-slate-950 border border-slate-800 rounded-lg
pl-10 pr-4 py-2           ← with icon indent
text-white placeholder-slate-600
focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
outline-none transition-all
```

#### Admin Textarea

Same as text input + `resize-none`

#### Admin Select / Dropdown

Same token as text input.

#### Admin Toggle Switch

```
Track:   w-12 h-6 rounded-full p-1 transition-colors
         On:  bg-blue-600
         Off: bg-slate-700

Thumb:   w-4  h-4 rounded-full bg-white
         On:  translate-x-6
         Off: translate-x-0
         transition-transform
```

#### Label

```
text-sm font-medium text-slate-300
```

### 6.5 Modal Styles

#### Admin Modal Overlay

```
fixed inset-0 z-50 flex items-center justify-center
bg-black/60 backdrop-blur-sm p-4
```

#### Admin Modal Container

```
w-full max-w-{size} bg-slate-900 border border-slate-800
rounded-xl shadow-2xl overflow-hidden
```

Sizes: `max-w-sm` | `max-w-md` | `max-w-lg` | `max-w-2xl`

#### Modal Header

```
flex items-center justify-between p-6 border-b border-slate-800
```

Close button: `p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors`

#### Modal Body

```
p-6 space-y-4 (or space-y-6)
max-h-[70vh] overflow-y-auto   ← for long forms
```

#### Modal Footer

```
flex justify-end gap-3 p-6 border-t border-slate-800
```

### 6.6 Table Styles

#### Table Container

```
bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl
```

#### Table Header Row

```
bg-slate-800/50
```

#### Header Cell

```
px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider
```

#### Body Row

```
border-t border-slate-800 hover:bg-slate-800/50 transition-colors
```

#### Body Cell

```
px-6 py-4 text-sm text-white       ← primary
px-6 py-4 text-sm text-slate-400   ← secondary
```

#### Empty State (inside table)

```
p-8 text-center text-slate-500
```

---

## 7. Animation Rules

### 7.1 Motion Tokens

Defined as CSS custom properties:

| Token            | Value                              | Usage                   |
| ---------------- | ---------------------------------- | ----------------------- |
| `--motion-fast`  | `150ms`                            | Hover, focus            |
| `--motion-normal`| `250ms`                            | Card transforms, nav    |
| `--motion-slow`  | `350ms`                            | Section fade-in, theme  |
| `--ease-out`     | `cubic-bezier(0.22, 1, 0.36, 1)`  | Smooth deceleration     |
| `--ease-spring`  | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy card lifts     |

### 7.2 Hover Lift (Glass Cards)

```css
.glass-card:hover {
  transform: translateY(-4px) scale(1.01);
}
```

Transition: `transform 250ms var(--ease-spring)`

### 7.3 Admin Button Micro-Interaction

```
hover:scale-[1.02] active:scale-[0.98]
```

Applied to header-level action buttons only.

### 7.4 Fade-In-Up (Scroll-Triggered)

```css
.fade-section {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 350ms var(--ease-out),
              transform 350ms var(--ease-out);
  will-change: opacity, transform;
}

.fade-section.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 7.5 Keyframe Animations

| Name           | Duration   | Easing           | Usage                   |
| -------------- | ---------- | ---------------- | ----------------------- |
| `shimmer`      | `1.5s`     | `ease-in-out`    | Loading skeletons       |
| `float`        | `6s`       | `ease-in-out`    | Decorative floating     |
| `fade-in-up`   | `350ms`    | `var(--ease-out)` | Initial mount entrance |

```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0);    }
  50%      { transform: translateY(-10px); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0);    }
}
```

### 7.6 Transition Defaults

| Context              | Tailwind             |
| -------------------- | -------------------- |
| Admin buttons        | `transition-all`     |
| Admin icon buttons   | `transition-colors`  |
| Table rows           | `transition-colors`  |
| Admin sidebar open   | `duration-200 ease-in-out` |
| Theme switch (body)  | `var(--motion-slow) ease` |

### 7.7 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .glass-card:hover { transform: none; }
  .fade-section     { opacity: 1; transform: none; }
}
```

---

## Appendix A: Scrollbar

```css
::-webkit-scrollbar         { width: 6px; }
::-webkit-scrollbar-track   { background: var(--bg-primary); }
::-webkit-scrollbar-thumb   { background: var(--border-color); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }
```

## Appendix B: Admin Color Palette Summary

The admin panel uses a **dark-only** palette built on Tailwind's `slate` scale:

```
Background:   slate-950    #020617
Sidebar:      slate-900    #0f172a
Card:         slate-900    #0f172a
Input:        slate-950    #020617
Border:       slate-800    #1e293b
Divider:      slate-700    #334155
Text primary: white
Text muted:   slate-400    #94a3b8
Placeholder:  slate-600    #475569
Primary CTA:  blue-600     #2563eb
Primary hover:blue-500     #3b82f6
Danger:       red-600      #dc2626
```
