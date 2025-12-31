# Real Estate Dashboard Design System
## Enterprise-Grade UI/UX Specifications

> **Target**: Admin & Agent roles for a scalable, professional Real Estate SaaS platform
> **Design Philosophy**: Clean, premium, high data density, optimized for long working hours

---

## 1. Visual Foundation

### 1.1 Color System

#### Primary Palette
```css
/* Brand Colors */
--color-primary-50:  #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;  /* Primary brand */
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;
--color-primary-950: #172554;

/* Neutral/Slate - Backgrounds & Text */
--color-neutral-50:  #f8fafc;
--color-neutral-100: #f1f5f9;
--color-neutral-200: #e2e8f0;
--color-neutral-300: #cbd5e1;
--color-neutral-400: #94a3b8;
--color-neutral-500: #64748b;
--color-neutral-600: #475569;
--color-neutral-700: #334155;
--color-neutral-800: #1e293b;
--color-neutral-900: #0f172a;
--color-neutral-950: #020617;

/* Semantic Colors */
--color-success-500: #22c55e;  /* Green - confirmations, rent */
--color-success-600: #16a34a;
--color-warning-500: #f59e0b;  /* Amber - alerts, featured */
--color-warning-600: #d97706;
--color-error-500:   #ef4444;  /* Red - errors, destructive */
--color-error-600:   #dc2626;
--color-info-500:    #0ea5e9;  /* Sky - informational */
--color-info-600:    #0284c7;

/* Real Estate Specific */
--color-rent:      #16a34a;  /* Green for rent properties */
--color-sale:      #2563eb;  /* Blue for sale properties */
--color-featured:  #f59e0b;  /* Amber for featured listings */
--color-pending:   #8b5cf6;  /* Purple for pending status */
--color-sold:      #6b7280;  /* Gray for sold/archived */
```

#### Dark Mode Palette
```css
/* Dark mode inverts background hierarchy */
--color-dark-bg-primary:   #0f172a;  /* Main background */
--color-dark-bg-secondary: #1e293b;  /* Cards, panels */
--color-dark-bg-tertiary:  #334155;  /* Hover states */
--color-dark-text-primary: #f1f5f9;  /* Primary text */
--color-dark-text-secondary: #cbd5e1; /* Secondary text */
--color-dark-border: #334155;        /* Borders */
```

#### Semi-Dark Mode
```css
/* Sidebar dark, content light */
--sidebar-bg: #1e293b;
--sidebar-text: #f1f5f9;
--content-bg: #ffffff;
--content-text: #0f172a;
```

### 1.2 Typography

#### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Montserrat', 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale (Desktop-First)
```css
/* Display - Marketing/Hero sections */
--text-display-2xl: 4.5rem;   /* 72px - Hero headlines */
--text-display-xl:  3.75rem;  /* 60px */
--text-display-lg:  3rem;     /* 48px */
--text-display-md:  2.25rem;  /* 36px */
--text-display-sm:  1.875rem; /* 30px */

/* Headings - Dashboard sections */
--text-h1: 2.25rem;  /* 36px - Page titles */
--text-h2: 1.875rem; /* 30px - Section titles */
--text-h3: 1.5rem;   /* 24px - Card titles */
--text-h4: 1.25rem;  /* 20px - Subsections */
--text-h5: 1.125rem; /* 18px - List headers */
--text-h6: 1rem;     /* 16px - Small headers */

/* Body - Primary content */
--text-base:  1rem;      /* 16px - Default */
--text-lg:    1.125rem;  /* 18px - Prominent text */
--text-sm:    0.875rem;  /* 14px - Secondary text */
--text-xs:    0.75rem;   /* 12px - Labels, captions */
--text-2xs:   0.6875rem; /* 11px - Fine print */

/* Line Heights */
--leading-tight:  1.25;    /* Headings */
--leading-snug:   1.375;   /* Subheadings */
--leading-normal: 1.5;     /* Body text */
--leading-relaxed: 1.625;  /* Long-form content */
--leading-loose:  2;       /* Spacious text */

/* Font Weights */
--font-light:    300;
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
--font-extrabold: 800;
```

#### Typography Rules
- **Page Titles**: Display MD (36px), Font Display, Semibold
- **Section Titles**: H3 (24px), Font Display, Semibold
- **Card Titles**: H4 (20px), Font Sans, Medium
- **Body Text**: Base (16px), Font Sans, Normal
- **Labels**: SM (14px), Font Sans, Medium
- **Captions**: XS (12px), Font Sans, Normal
- **Monospace**: Numbers in tables, code snippets

### 1.3 Spacing System

#### Base Unit: 4px (0.25rem)
```css
--spacing-0:   0;
--spacing-1:   0.25rem;  /* 4px */
--spacing-2:   0.5rem;   /* 8px */
--spacing-3:   0.75rem;  /* 12px */
--spacing-4:   1rem;     /* 16px */
--spacing-5:   1.25rem;  /* 20px */
--spacing-6:   1.5rem;   /* 24px */
--spacing-8:   2rem;     /* 32px */
--spacing-10:  2.5rem;   /* 40px */
--spacing-12:  3rem;     /* 48px */
--spacing-16:  4rem;     /* 64px */
--spacing-20:  5rem;     /* 80px */
--spacing-24:  6rem;     /* 96px */

/* Component-Specific */
--spacing-card-padding: var(--spacing-6);      /* 24px */
--spacing-section-gap:  var(--spacing-8);      /* 32px */
--spacing-page-padding: var(--spacing-6);      /* 24px */
--spacing-input-padding-x: var(--spacing-4);   /* 16px */
--spacing-input-padding-y: var(--spacing-3);   /* 12px */
--spacing-button-padding-x: var(--spacing-6);  /* 24px */
--spacing-button-padding-y: var(--spacing-3);  /* 12px */
```

#### Spacing Guidelines
- **Micro spacing** (1-2): Icon-text gaps, badge padding
- **Small spacing** (3-4): Input fields, button padding
- **Medium spacing** (6-8): Card padding, section gaps
- **Large spacing** (12-16): Page sections, grid gaps
- **XL spacing** (20-24): Marketing sections, hero areas

### 1.4 Elevation & Shadows

```css
/* Shadows - Subtle, professional */
--shadow-xs:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm:  0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Dark mode shadows (lighter) */
--shadow-dark-sm: 0 1px 3px 0 rgb(255 255 255 / 0.05);
--shadow-dark-md: 0 4px 6px -1px rgb(255 255 255 / 0.05);
--shadow-dark-lg: 0 10px 15px -3px rgb(255 255 255 / 0.05);

/* Elevation Levels */
--elevation-0: none;           /* Flat surfaces */
--elevation-1: var(--shadow-sm); /* Cards on page */
--elevation-2: var(--shadow-md); /* Hover states */
--elevation-3: var(--shadow-lg); /* Dropdowns, popovers */
--elevation-4: var(--shadow-xl); /* Modals, drawers */
--elevation-5: var(--shadow-2xl); /* Top-layer (toasts) */
```

### 1.5 Border Radius

```css
--radius-none: 0;
--radius-sm:   0.25rem;  /* 4px - Badges, small elements */
--radius-md:   0.375rem; /* 6px - Inputs, buttons */
--radius-lg:   0.5rem;   /* 8px - Cards */
--radius-xl:   0.75rem;  /* 12px - Large cards */
--radius-2xl:  1rem;     /* 16px - Featured cards */
--radius-full: 9999px;   /* Pills, avatars */
```

### 1.6 Animations & Transitions

```css
/* Duration */
--duration-instant: 100ms;
--duration-fast:    150ms;
--duration-normal:  200ms;
--duration-slow:    300ms;
--duration-slower:  500ms;

/* Easing */
--ease-in:     cubic-bezier(0.4, 0, 1, 1);
--ease-out:    cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Common Transitions */
--transition-colors: color var(--duration-normal) var(--ease-in-out),
                     background-color var(--duration-normal) var(--ease-in-out),
                     border-color var(--duration-normal) var(--ease-in-out);
--transition-transform: transform var(--duration-normal) var(--ease-out);
--transition-opacity:   opacity var(--duration-normal) var(--ease-in-out);
--transition-all:       all var(--duration-normal) var(--ease-in-out);

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 2. Layout Architecture

### 2.1 Grid System

```css
/* Container Widths */
--container-sm:  640px;
--container-md:  768px;
--container-lg:  1024px;
--container-xl:  1280px;
--container-2xl: 1536px;

/* Content Width Options (Theme Customizer) */
--content-width-compact: 1280px;  /* Default - readable */
--content-width-wide:    100%;    /* Full width - data tables */

/* Column System - 12 column grid */
--grid-cols-12: repeat(12, minmax(0, 1fr));
--grid-cols-6:  repeat(6, minmax(0, 1fr));
--grid-cols-4:  repeat(4, minmax(0, 1fr));
--grid-cols-3:  repeat(3, minmax(0, 1fr));
--grid-cols-2:  repeat(2, minmax(0, 1fr));
```

### 2.2 Dashboard Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  TOPBAR (Navbar) - Sticky/Static/Hidden                │
│  Logo | Search | Notifications | Profile                │
├───────────┬─────────────────────────────────────────────┤
│           │                                             │
│  SIDEBAR  │  MAIN CONTENT AREA                          │
│           │                                             │
│  Nav      │  ┌─────────────────────────────────────┐   │
│  Links    │  │ Page Header                         │   │
│           │  │ Title, breadcrumbs, actions         │   │
│  Expanded │  ├─────────────────────────────────────┤   │
│  or       │  │                                     │   │
│  Collapsed│  │ Content Cards/Tables                │   │
│           │  │                                     │   │
│  (260px   │  │                                     │   │
│   or      │  │                                     │   │
│   80px)   │  └─────────────────────────────────────┘   │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘
```

#### Layout Dimensions
```css
/* Sidebar */
--sidebar-width-expanded:  260px;
--sidebar-width-collapsed: 80px;
--sidebar-transition: width var(--duration-slow) var(--ease-in-out);

/* Topbar */
--topbar-height: 64px;
--topbar-z-index: 40;

/* Main Content */
--content-padding-x: var(--spacing-6);  /* 24px */
--content-padding-y: var(--spacing-6);  /* 24px */
--content-max-width: var(--content-width-compact);
```

### 2.3 Responsive Breakpoints

```css
/* Mobile-first approach, but desktop-optimized */
--breakpoint-sm:  640px;   /* Tablets portrait */
--breakpoint-md:  768px;   /* Tablets landscape */
--breakpoint-lg:  1024px;  /* Desktop */
--breakpoint-xl:  1280px;  /* Large desktop */
--breakpoint-2xl: 1536px;  /* Extra large desktop */

/* Usage Priority */
- Desktop (1280px+): Primary design target
- Tablet (768-1023px): Optimized layouts
- Mobile (<768px): Simplified, stacked layouts
```

---

## 3. Interaction Patterns

### 3.1 Interactive States

```css
/* Default State */
.interactive {
  transition: var(--transition-colors);
}

/* Hover State */
.interactive:hover {
  background-color: var(--color-neutral-100);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Active/Pressed State */
.interactive:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Focused State (Keyboard) */
.interactive:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Disabled State */
.interactive:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading State */
.interactive[data-loading="true"] {
  position: relative;
  color: transparent;
  pointer-events: none;
}
```

### 3.2 Micro-interactions

- **Button Click**: Scale down to 0.98, spring back
- **Card Hover**: Lift 2px, increase shadow
- **Table Row Hover**: Background change (50ms fast)
- **Input Focus**: Border color change + shadow glow
- **Toggle Switch**: Smooth slide (200ms)
- **Sidebar Expand/Collapse**: Width animation (300ms)
- **Modal Open**: Fade in backdrop + scale in content
- **Toast Notification**: Slide in from top-right

---

## 4. Accessibility Guidelines

### 4.1 Color Contrast

- **Text on Background**: Minimum 4.5:1 (WCAG AA)
- **Large Text**: Minimum 3:1
- **Interactive Elements**: 3:1 against adjacent colors
- **Icons**: 3:1 minimum

### 4.2 Focus Management

```css
/* Remove default outline */
*:focus {
  outline: none;
}

/* Custom focus ring for keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
```

### 4.3 ARIA Patterns

- **Buttons**: `role="button"`, `aria-label` for icon-only
- **Navigation**: `role="navigation"`, `aria-current="page"`
- **Modals**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Tabs**: `role="tablist"`, `role="tab"`, `aria-selected`
- **Loading**: `aria-busy="true"`, `aria-live="polite"`
- **Tooltips**: `role="tooltip"`, `aria-describedby`

### 4.4 Keyboard Navigation

- **Tab**: Move forward through interactive elements
- **Shift+Tab**: Move backward
- **Enter/Space**: Activate buttons/links
- **Escape**: Close modals/dropdowns
- **Arrow Keys**: Navigate menus, tabs, selects

---

## 5. Design Tokens Export

### 5.1 CSS Custom Properties (globals.css)
```css
:root {
  /* Colors */
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 217.2 91.2% 59.8%;
  --radius: 0.5rem;
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}
```

### 5.2 Tailwind Config Export
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... etc
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
}
```

---

## 6. Component Design Philosophy

### 6.1 Core Principles

1. **Composability**: Components should be small, focused, composable units
2. **Consistency**: Same component = same appearance everywhere
3. **Flexibility**: Support variants without bloat
4. **Accessibility**: Built-in ARIA, keyboard nav, focus management
5. **Performance**: Minimal re-renders, lazy loading, code splitting

### 6.2 Component Anatomy

```tsx
interface ComponentProps {
  // Visual variants
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';

  // State
  disabled?: boolean;
  loading?: boolean;

  // Style overrides
  className?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

### 6.3 Naming Conventions

- **Components**: PascalCase (`Button`, `Card`, `DataTable`)
- **Props**: camelCase (`onClick`, `isDisabled`, `primaryColor`)
- **CSS Classes**: kebab-case or Tailwind utilities
- **Files**: PascalCase for components (`Button.tsx`)
- **Variants**: lowercase strings (`'default'`, `'outline'`)

---

## Next Steps

This design system serves as the foundation for:
1. **Component Library** (detailed in COMPONENT_LIBRARY.md)
2. **Theme Customizer** (detailed in THEME_CUSTOMIZER.md)
3. **Layout Architecture** (detailed in LAYOUT_ARCHITECTURE.md)
4. **Implementation Guide** (detailed in IMPLEMENTATION_GUIDE.md)

---

**Version**: 1.0.0
**Last Updated**: 2025-12-31
**Status**: Active Development
