# 🎨 Dynamic Theme System - How It Works

## Overview

The theme system allows you to change colors and styling from the admin panel, and those changes instantly apply to the entire landing page.

---

## How It Works

### 1. **Data Storage** (`data/site-data.json`)
Theme configuration is stored in the `theme` object:

```json
{
  "theme": {
    "primaryColor": "#ccff00",
    "primaryColorHover": "#b5e600",
    "backgroundColor": "#090b0a",
    "surfaceColor": "#0c0f0d",
    "borderColor": "#262a28",
    "textPrimary": "#ffffff",
    "textSecondary": "#a3a3a3",
    "ringColor": "rgba(204, 255, 0, 0.3)",
    "fontPrimary": "system-ui, -apple-system, sans-serif",
    "fontHeading": "system-ui, -apple-system, sans-serif",
    "borderRadius": "0px"
  }
}
```

### 2. **ThemeProvider Component** (`components/ThemeProvider.tsx`)

This client component:
- Fetches theme data from `/api/landing-data` on page load
- Injects CSS custom properties into the `<html>` element
- Updates automatically when you save changes in admin panel

```typescript
root.style.setProperty('--theme-primary', theme.primaryColor);
root.style.setProperty('--theme-bg', theme.backgroundColor);
// ... etc
```

### 3. **CSS Variables** (`src/index.css`)

CSS variables are defined with fallback values:

```css
:root {
  --theme-primary: #ccff00;  /* Fallback if theme not loaded yet */
  --theme-bg: #090b0a;
  /* ... etc */
}
```

### 4. **CSS Usage**

Components use the CSS variables:

```css
.hero-accent::after {
  background: var(--theme-primary, #ccff00);
}

body {
  background-color: var(--theme-bg, #090b0a);
}
```

The `var(--theme-primary, #ccff00)` means:
- Use `--theme-primary` if available
- Fall back to `#ccff00` if not

---

## What Gets Themed

### ✅ Automatically Themed (via CSS variables)

1. **Primary Accent Color** (`--theme-primary`):
   - Hero headline underlines
   - CTA buttons
   - Scrollbar hover
   - Section tags
   - Links and highlights
   - Logo animation finale color

2. **Background Colors** (`--theme-bg`):
   - Page background
   - Card backgrounds
   - Section backgrounds

3. **Text Colors**:
   - Primary text
   - Secondary/muted text

4. **Borders**:
   - Card borders
   - Dividers
   - Section separators

---

## How to Change Theme Colors

### From Admin Panel:

1. Go to `http://localhost:3000/admin`
2. Expand "🎨 Theme & Styling" section
3. Click any color picker
4. Choose your color or enter hex code
5. Click "Save Changes"
6. Refresh the landing page to see changes

### Result:

The ThemeProvider will:
1. Detect the save (via page refresh or manual refresh)
2. Fetch new theme data from API
3. Update all CSS variables
4. Colors change instantly across the site

---

## Components That Use Theme Colors

### Hardcoded in Components (need manual update):

Some components use Tailwind classes with hardcoded colors. To fully theme these, you'll need to:

**Option 1: Use inline styles**
```tsx
<div style={{ backgroundColor: 'var(--theme-primary)' }}>
```

**Option 2: Use CSS classes**
```tsx
<div className="themed-button">
// In CSS: .themed-button { background: var(--theme-primary); }
```

**Option 3: Pass theme as props**
```tsx
const theme = useTheme();
<div style={{ backgroundColor: theme.primaryColor }}>
```

### Currently Themed Areas:

✅ Hero headline underlines  
✅ Logo intro animation  
✅ Scrollbar  
✅ Typed text cursor  
✅ Background colors  
✅ Selection color (text selection)  

### Partially Themed (Tailwind classes):

⚠️ Buttons with `bg-[#ccff00]` class  
⚠️ Cards with `border-[#ccff00]` class  
⚠️ Text with `text-[#ccff00]` class  

---

## Adding More Theme Variables

### Step 1: Add to Data Schema

Update `lib/data.ts`:

```typescript
export interface SiteData {
  theme: {
    // ... existing
    accentSecondary: string;  // Add new color
  };
}
```

### Step 2: Add to Admin Form

Update `app/admin/page.tsx`:

```tsx
<FormColorPicker
  name="theme.accentSecondary"
  label="Secondary Accent Color"
/>
```

### Step 3: Add to ThemeProvider

Update `components/ThemeProvider.tsx`:

```typescript
root.style.setProperty('--theme-accent-secondary', theme.accentSecondary);
```

### Step 4: Add to CSS

Update `src/index.css`:

```css
:root {
  --theme-accent-secondary: #ff6b6b;
}
```

### Step 5: Use in Components

```css
.my-element {
  background: var(--theme-accent-secondary);
}
```

---

## Testing Theme Changes

### Test Flow:

1. **Change primary color to red** (`#ff0000`)
2. Save in admin panel
3. Refresh landing page
4. Verify changes:
   - Hero underlines are red
   - Scrollbar hover is red
   - Logo finale is red
   - Selection background is red

### Debug Issues:

**Theme not applying?**

1. Check browser console for errors
2. Verify ThemeProvider is wrapping the app in layout
3. Check if CSS variables are injected:
   ```javascript
   // In browser console:
   getComputedStyle(document.documentElement).getPropertyValue('--theme-primary')
   ```
4. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+F5` (Windows)

**Colors partially changing?**

- Some components use hardcoded Tailwind classes
- See "Partially Themed" section above
- Consider using inline styles or CSS classes for those

---

## Performance Notes

- ThemeProvider fetches once on page load
- CSS variables update instantly (no repaint)
- No performance impact on landing page
- Theme changes require page refresh

---

## Future Enhancements

### Possible Improvements:

1. **Real-time Preview**: Update theme in admin panel without refresh
2. **Multiple Themes**: Light/dark mode toggle
3. **Theme Presets**: Predefined color schemes
4. **Font Customization**: Dynamic font loading
5. **Advanced Theming**: Gradients, shadows, spacing

### Implementation Ideas:

**Real-time Updates**:
```typescript
// Use EventSource or WebSocket for live updates
const eventSource = new EventSource('/api/theme-updates');
eventSource.onmessage = (event) => {
  const newTheme = JSON.parse(event.data);
  applyTheme(newTheme);
};
```

**Theme Presets**:
```typescript
const presets = {
  neonLime: { primary: '#ccff00', bg: '#090b0a' },
  oceanBlue: { primary: '#00d4ff', bg: '#0a1828' },
  sunsetOrange: { primary: '#ff6b35', bg: '#1a0a00' }
};
```

---

## Troubleshooting

### Issue: Theme not loading on first visit

**Solution**: Add loading state
```typescript
const [isLoading, setIsLoading] = useState(true);
// Show skeleton while theme loads
```

### Issue: Flashing default colors before theme loads

**Solution**: Add CSS in `<head>`:
```html
<style>
  :root {
    --theme-primary: #ccff00;
    /* ... all defaults */
  }
</style>
```

### Issue: Tailwind classes not respecting theme

**Solution**: Use arbitrary values with CSS variables:
```tsx
className="bg-[var(--theme-primary)]"
```

---

## Summary

✅ Theme colors are stored in `data/site-data.json`  
✅ ThemeProvider fetches and injects CSS variables  
✅ CSS uses `var(--theme-primary)` with fallbacks  
✅ Changes in admin panel apply after save + refresh  
✅ Most accent colors and backgrounds are themed  
⚠️ Some Tailwind classes need manual updates  

**To fully theme the site**: Replace hardcoded Tailwind color classes with CSS variable references.

---

**Happy theming! 🎨**
