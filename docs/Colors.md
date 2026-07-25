# InnoVote 2.0 — Sunway Innovation Fest UI Color Palette & Design System

**Primary Brand Color:** `#C12A37` (Crimson Red / Ruby Core)  
**Target Design Aesthetic:** Premium Modern Dark & Light Mode with Glassmorphism and High Contrast


---

## 1. Color Palette Tokens

### 1.1 Brand & Primary Colors
Anchored by `#C12A37`, providing a vibrant, authoritative, and engaging brand identity for event voting.

| Token Name | Hex Code | HSL Representation | Usage / Role |
| :--- | :--- | :--- | :--- |
| `--color-primary-50` | `#FFF0F2` | `hsl(351, 100%, 97%)` | Subtle red tints, chip backgrounds |
| `--color-primary-100` | `#FDE2E4` | `hsl(351, 86%, 94%)` | Hover fills, light alert background |
| `--color-primary-200` | `#F8B4B9` | `hsl(351, 82%, 84%)` | Light mode border focus |
| `--color-primary-300` | `#EF7B85` | `hsl(351, 80%, 71%)` | Muted primary accents |
| `--color-primary-400` | `#E54855` | `hsl(351, 76%, 59%)` | Active highlights / vibrant red |
| `--color-primary-500` | `#C12A37` | `hsl(355, 64%, 46%)` | **BASE PRIMARY BRAND COLOR** (CTA buttons, header branding, key metrics) |
| `--color-primary-600` | `#9E1F2A` | `hsl(355, 67%, 37%)` | Hover state for primary buttons |
| `--color-primary-700` | `#7B151F` | `hsl(354, 71%, 28%)` | Pressed state / active deep red |
| `--color-primary-800` | `#580F15` | `hsl(354, 71%, 20%)` | Dark mode container borders |
| `--color-primary-900` | `#39080C` | `hsl(354, 71%, 13%)` | Dark mode primary glow background |

---

## 2. Supporting & Neutral Palettes

### 2.1 Accent & Interface Colors
- **Slate Accent (Project Cards & Metadata):** `#64748B` (`hsl(215, 16%, 47%)`)
- **Interactive Highlight:** `#E54855` (`hsl(351, 76%, 59%)`)
- **Muted Border Accent:** `#334155` (`hsl(215, 25%, 27%)`)

### 2.2 Status & Feedback Colors
- **Success (OTP Verified, Vote Submitted, Result Revealed):** `#10B981` (Emerald Green) / Soft Fill: `#ECFDF5`
- **Warning (OTP Expiring Soon, Results Hidden Countdown):** `#F59E0B` (Amber) / Soft Fill: `#FFFBEB`
- **Error (Verification Failed, User Blocked, Rate Limited):** `#DC2626` (Bright Red) / Soft Fill: `#FEF2F2`
- **Info (Round Schedule, Admin Status):** `#3B82F6` (Royal Blue) / Soft Fill: `#EFF6FF`

---

## 3. Surface & Neutral System

### 3.1 Dark Mode Surface System (Default App Interface)

```css
:root {
  /* Dark Mode Surfaces */
  --bg-app-dark: #0D0E12;            /* Deep Obsidian Base */
  --bg-surface-dark: #16181E;        /* Primary Card / Surface */
  --bg-surface-elevated: #1F222B;    /* Modals, Dropdowns, Floating Panels */
  --border-dark: #2E3340;             /* Subtle Element Borders */
  --border-focus-dark: #C12A37;       /* Input Focus Ring */

  /* Dark Mode Typography */
  --text-primary-dark: #F8FAFC;       /* Pure White High Contrast */
  --text-secondary-dark: #94A3B8;     /* Slate Muted Subtitles */
  --text-tertiary-dark: #64748B;      /* Captions, Timestamps */
}
```

### 3.2 Light Mode Surface System

```css
:root {
  /* Light Mode Surfaces */
  --bg-app-light: #FAFAFB;           /* Off-White Clean Base */
  --bg-surface-light: #FFFFFF;       /* Pure White Cards */
  --bg-surface-elevated: #F1F5F9;   /* Hovered Surfaces & Chips */
  --border-light: #E2E8F0;            /* Soft Card Borders */
  --border-focus-light: #C12A37;      /* Focus States */

  /* Light Mode Typography */
  --text-primary-light: #0F172A;      /* Deep Slate Black */
  --text-secondary-light: #475569;    /* Muted Slate Text */
  --text-tertiary-light: #94A3B8;     /* Captions & Disabled Text */
}
```

---

## 4. UI Component Design Specifications

### 4.1 Primary Action Buttons (Cast Vote, Verify OTP, Admin CRUD Actions)
- **Background:** `var(--color-primary-500)` (`#C12A37`)
- **Text:** `#FFFFFF` (Font weight: `600` Semi-Bold)
- **Hover State:** `var(--color-primary-600)` (`#9E1F2A`) with subtle vertical scaling (`transform: translateY(-1px)`).
- **Active / Pressed State:** `var(--color-primary-700)` (`#7B151F`).
- **Focus Ring:** `0 0 0 3px rgba(193, 42, 55, 0.4)`.

### 4.2 Admin Management Tables & Forms
- **Table Headers:** Background `#1F222B`, Text `#94A3B8`, Font weight `600`.
- **Status Badges:**
  - `ACTIVE / PUBLISHED`: Background `#ECFDF5`, Text `#10B981`
  - `RESULTS HIDDEN`: Background `#FFFBEB`, Text `#F59E0B`
  - `BLOCKED`: Background `#FEF2F2`, Text `#DC2626`
- **Action Buttons (Edit/Delete):** Border `#2E3340`, Text `#F8FAFC`, Hover Background `#C12A37`.

### 4.3 Scheduled Result Reveal Banner (Voter View)
- **State (Results Hidden):** Displays countdown timer to scheduled reveal time.
- **Glassmorphism Backdrop:** `background: rgba(22, 24, 30, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(193, 42, 55, 0.2);`.

---

## 5. CSS Custom Properties Reference Snippet (`index.css`)

```css
:root {
  /* Brand Core */
  --brand-primary: #C12A37;
  --brand-primary-hover: #9E1F2A;
  --brand-primary-active: #7B151F;
  --brand-primary-light: #FFF0F2;
  --brand-primary-glow: rgba(193, 42, 55, 0.35);

  /* Feedback & Status */
  --status-success: #10B981;
  --status-warning: #F59E0B;
  --status-error: #DC2626;
  --status-info: #3B82F6;

  /* Default Dark Mode Mapping */
  --bg-app: #0D0E12;
  --bg-card: #16181E;
  --border-card: #2E3340;
  --text-main: #F8FAFC;
  --text-muted: #94A3B8;
}
```
