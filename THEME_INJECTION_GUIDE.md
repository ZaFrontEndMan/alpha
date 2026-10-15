# 🎨 Theme Injection System - Server-Side Implementation

## Overview

The theme system now uses **server-side injection** in the root layout, ensuring that theme changes from the Admin Panel immediately reflect on the entire website.

---

## How It Works

### 1. **Server-Side Data Fetching** (`app/layout.tsx`)

```typescript
export default async function RootLayout({ children }) {
  // Fetch theme data server-side (cached)
  const siteData = await getSiteData();
  const theme = siteData.theme;

  return (
    <html>
      <head>
        {/* Inject CSS variables directly */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${theme.primaryColor};
            --primary-hover: ${theme.primaryColorHover};
            --radius: ${theme.borderRadius};
            /* ... etc */
          }
        `}} />
      </head>
      <body style={{ backgroundColor: theme.backgroundColor }}>
        {children}
      </body>
    </html>
  );
}
```

### 2. **CSS Variables Injected**

```css
:root {
  --primary: #ccff00;              /* Main accent color */
  --primary-hover: #b5e600;        /* Hover state */
  --primary-ring: rgba(...);       /* Ring/focus color */
  --radius: 0px;                   /* Border radius */
  --theme-bg: #090b0a;             /* Background */
  --theme-surface: #0c0f0d;        /* Cards/surfaces */
  --theme-border: #262a28;         /* Borders */
  --theme-text-primary: #ffffff;   /* Primary text */
  --theme-text-secondary: #a3a3a3; /* Secondary text */
}
```

### 3. **CSS Usage**

All CSS animations and effects use the variables:

```css
.hero-accent::after {
  background: var(--primary, #ccff00); /* Fallback to #ccff00 */
}

body {
  background-color: var(--theme-bg, #090b0a);
}

.scrollbar:hover {
  background: var(--primary);
}
```

### 4. **Tailwind Integration**

Tailwind config now supports theme variables:

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
      },
      borderRadius: {
        'theme': 'var(--radius)',
      },
    },
  },
}
```

**Usage in Components**:

```tsx
<button className="bg-primary hover:bg-primary-hover rounded-theme">
  Click Me
</button>

// Or with arbitrary values
<div className="bg-[var(--primary)] rounded-[var(--radius)]">
  Content
</div>
```

---

## Data Flow

```
Admin Panel
    ↓
  Edit Theme Colors/Radius
    ↓
  Click "Save Changes"
    ↓
  POST /api/landing-data
    ↓
  Write to data/site-data.json
    ↓
  revalidateTag('site-data')
    ↓
  Cache Invalidated
    ↓
  Next Request to Website
    ↓
  Layout fetches getSiteData() (fresh from cache)
    ↓
  CSS Variables Injected Server-Side
    ↓
  Browser Receives HTML with Inline Styles
    ↓
  Theme Applied Immediately
```

---

## CSS Variables Reference

### Primary Colors

| Variable | Default | Usage |
|----------|---------|-------|
| `--primary` | `#ccff00` | Main accent color |
| `--primary-hover` | `#b5e600` | Hover states |
| `--primary-ring` | `rgba(204, 255, 0, 0.3)` | Focus rings |

### Background & Surface

| Variable | Default | Usage |
|----------|---------|-------|
| `--theme-bg` | `#090b0a` | Page background |
| `--theme-surface` | `#0c0f0d` | Card backgrounds |
| `--theme-border` | `#262a28` | Borders |

### Text

| Variable | Default | Usage |
|----------|---------|-------|
| `--theme-text-primary` | `#ffffff` | Main text |
| `--theme-text-secondary` | `#a3a3a3` | Muted text |

### Layout

| Variable | Default | Usage |
|----------|---------|-------|
| `--radius` | `0px` | Border radius |
| `--theme-border-radius` | `var(--radius)` | Alias |

---

## Using Theme Variables

### In CSS

```css
/* Direct usage */
.my-element {
  background: var(--primary);
  border-radius: var(--radius);
  color: var(--theme-text-primary);
}

/* With fallback */
.my-element {
  background: var(--primary, #ccff00);
}
```

### In Tailwind Classes

```tsx
// Using config colors
<div className="bg-primary text-white rounded-theme">

// Using arbitrary values
<div className="bg-[var(--primary)] rounded-[var(--radius)]">

// Hover states
<button className="bg-primary hover:bg-primary-hover">
```

### In Inline Styles

```tsx
<div style={{ 
  backgroundColor: 'var(--primary)',
  borderRadius: 'var(--radius)'
}}>
```

### In JavaScript

```typescript
// Get computed value
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary');

// Set value (for client-side override)
document.documentElement.style.setProperty('--primary', '#ff0000');
```

---

## What Gets Themed Automatically

### ✅ Already Themed (CSS Variables)

1. **Hero Section**:
   - Headline underlines (`--primary`)
   - Accent text highlights
   - Background (`--theme-bg`)

2. **Logo Intro Animation**:
   - Final fill color (`--primary`)
   - Accent strokes

3. **Scrollbar**:
   - Hover color (`--primary`)
   - Track background (`--theme-bg`)

4. **Text Selection**:
   - Background (`--primary`)
   - Text color (black)

5. **Typed Text Cursor**:
   - Caret color (`--primary`)
   - Accent underlines

6. **Body Background**:
   - Main background (`--theme-bg`)
   - Text color (`--theme-text-primary`)

### ⚠️ Needs Manual Update (Hardcoded Tailwind)

Some components still use hardcoded Tailwind classes:

```tsx
// Current (hardcoded)
<button className="bg-[#ccff00] hover:bg-[#b5e600]">

// Should be (themed)
<button className="bg-primary hover:bg-primary-hover">
```

**Components to Update**:
- CTA buttons in Hero
- Package cards
- Section tags
- Interactive elements

---

## Testing Theme Changes

### 1. **Change Primary Color**

**Admin Panel**:
1. Go to `http://localhost:3000/admin`
2. Expand "Theme & Styling"
3. Change "Primary Color" to red (`#ff0000`)
4. Click "Save Changes"

**Landing Page**:
1. Refresh `http://localhost:3000`
2. Verify changes:
   - ✅ Hero underlines are red
   - ✅ Scrollbar hover is red
   - ✅ Logo animation is red
   - ✅ Selection background is red
   - ✅ Text cursor is red

### 2. **Change Border Radius**

**Admin Panel**:
1. Change "Border Radius" to `8px`
2. Save changes

**Landing Page**:
1. Refresh page
2. Check elements using `rounded-theme` class
3. Verify border radius changed

### 3. **Change Background Color**

**Admin Panel**:
1. Change "Background" to darker (`#000000`)
2. Save changes

**Landing Page**:
1. Refresh page
2. Body background should be black
3. All sections inherit new background

---

## Debugging Theme Issues

### Issue: Theme not applying after save

**Check**:
1. Admin save was successful (success message)
2. `data/site-data.json` has new values
3. Cache was revalidated
4. Page was hard-refreshed (`Cmd+Shift+R`)

**Fix**:
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: Variables not available in CSS

**Check browser console**:
```javascript
// Check if variables are set
getComputedStyle(document.documentElement).getPropertyValue('--primary')
```

**Should return**: Current color value (e.g., `#ccff00`)

**If empty**: Layout didn't inject styles properly

### Issue: Tailwind classes not working

**Check**:
1. `tailwind.config.ts` has theme variables
2. Build was restarted after config change
3. Using correct class names

**Fix**:
```bash
# Rebuild Tailwind
npm run dev
```

### Issue: Fallback colors showing

**Possible causes**:
1. Variable not injected
2. Variable name typo
3. CSS syntax error

**Debug**:
```css
/* Check fallback usage */
.element {
  background: var(--primary, #ccff00);
  /*                        ^^^^^^^^ Fallback shows if --primary is undefined */
}
```

---

## Performance Considerations

### Caching Strategy

**getSiteData()** uses Next.js `unstable_cache`:
```typescript
export const getSiteData = unstable_cache(
  async () => { /* fetch data */ },
  ['site-data'],
  {
    tags: ['site-data'],
    revalidate: 3600, // 1 hour
  }
);
```

**Benefits**:
- Fast server-side rendering
- Cached between requests
- Invalidates on save
- No client-side fetch needed

### Revalidation

When you save in admin:
1. `updateSiteData()` writes to JSON
2. `revalidateTag('site-data')` clears cache
3. Next request fetches fresh data
4. New styles injected

**No restart needed!**

---

## Best Practices

### 1. **Always Use CSS Variables**

```css
/* ✅ Good */
.element {
  background: var(--primary);
}

/* ❌ Bad */
.element {
  background: #ccff00;
}
```

### 2. **Provide Fallbacks**

```css
/* ✅ Good - has fallback */
.element {
  background: var(--primary, #ccff00);
}

/* ⚠️ Works but no fallback */
.element {
  background: var(--primary);
}
```

### 3. **Use Tailwind Config**

```tsx
/* ✅ Good - uses config */
<div className="bg-primary rounded-theme">

/* ⚠️ Verbose */
<div className="bg-[var(--primary)] rounded-[var(--radius)]">

/* ❌ Bad - hardcoded */
<div className="bg-[#ccff00] rounded-lg">
```

### 4. **Test After Changes**

Always test:
- [ ] Primary color changes
- [ ] Border radius changes
- [ ] Background color changes
- [ ] Hover states work
- [ ] Dark/light mode (if applicable)

---

## Migration Guide

### Updating Hardcoded Components

**Find hardcoded colors**:
```bash
# Search for hardcoded lime color
grep -r "#ccff00" components/
grep -r "bg-\[#ccff00\]" components/
```

**Replace with theme variables**:

**Before**:
```tsx
<button className="bg-[#ccff00] hover:bg-[#b5e600] rounded-lg">
  Click Me
</button>
```

**After**:
```tsx
<button className="bg-primary hover:bg-primary-hover rounded-theme">
  Click Me
</button>
```

**Before (CSS)**:
```css
.cta-button {
  background: #ccff00;
  border-radius: 8px;
}
```

**After (CSS)**:
```css
.cta-button {
  background: var(--primary);
  border-radius: var(--radius);
}
```

---

## Advanced: Theme Presets

### Future Enhancement

You could add theme presets to admin:

```typescript
const presets = {
  neonLime: {
    primaryColor: '#ccff00',
    backgroundColor: '#090b0a',
    borderRadius: '0px',
  },
  oceanBlue: {
    primaryColor: '#00d4ff',
    backgroundColor: '#0a1828',
    borderRadius: '8px',
  },
  sunsetOrange: {
    primaryColor: '#ff6b35',
    backgroundColor: '#1a0a00',
    borderRadius: '12px',
  },
};
```

Add preset selector in admin panel to quickly switch themes.

---

## Summary

✅ **Server-Side Injection**: Theme fetched and injected in layout  
✅ **CSS Variables**: All theme properties available globally  
✅ **Tailwind Integration**: Classes like `bg-primary` work  
✅ **Immediate Updates**: Changes reflect after save + refresh  
✅ **Cached Performance**: Fast loading with Next.js cache  
✅ **Fallback Values**: CSS still works if variables fail  

**The theme system is production-ready! 🎨**
